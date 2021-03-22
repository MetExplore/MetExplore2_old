/**
 * C_AddReactionForm
 */
Ext.define('MetExplore.controller.C_AddReactionForm', {
    extend: 'Ext.app.Controller',

    requires: ['MetExplore.globals.Session', 'MetExplore.globals.History', 'MetExplore.model.ReactionCreation'],

    config: {
        views: ['form.V_AddReactionForm'],
        nbLoads: 0 //to store initial values only one time: increment this number at each asynchrone ajax request. At the end, if nbLoads is equal of the number of requests to do, then launch sauvInitialValues function
    },


    init: function() {

        this.control({
            'addReactionForm': {
                afterrender: this.loadRecord
            },
            'addReactionForm button[action=newMetabolite]': {
                click: this.newMetabWin
            },
            'addReactionForm button[action=addReaction]': {
                click: this.SubmitRxnForm
            },
            'addReactionForm button[action=updateReaction]': {
                click: this.updateReaction
            }
        });
    },

    /**
     * Store initialvalues to send them to the php which identify then the modified values
     * @param {} component : the form object
     * @param {} eOpts
     */
    sauvInitialValues: function(component, eOpts) {
        this.nbLoads = 0;

        var values = component.getForm().getValues();

        var encodedValues = this.encodeFormValues(values);

        encodedValues['idReaction'] = values['ReactionMySQLId'];
        encodedValues['idReactInBio'] = values['ReactionMySQLIdinBioSource'];

        /*
         * get the reactant
         */
        var Store = component.down("reactionCreate").getStore('S_ReactionCreation');

        encodedValues['Substrate'] = [];
        encodedValues['Product'] = [];

        Store.each(function(record) {
            var metabolite = {};
            metabolite['idMetabolite'] = record.get('idMetabolite');
            metabolite['coeff'] = record.get('coeff');
            //metabolite['cofactor']=record.get('cofactor') == true ? 1 : 0;
            metabolite['side'] = record.get('side') == true ? 1 : 0;
            //metabolite['constantCoeff']=record.get('constantCoeff') == true ? 1 : 0;

            encodedValues[record.get('type')].push(metabolite);
        });

        var StoreB = component.down("reactionCreate").down('gridReactionBiblio').getStore('S_ReactionBiblio');

        encodedValues['Biblio'] = [];

        StoreB.each(function(record) {
            var biblio = {};
            biblio['MysqlId'] = record.get('id');
            biblio['pubmedid'] = record.get('pubmedid');
            biblio['title'] = record.get('title');
            biblio['authors'] = record.get('authors');
            biblio['Journal'] = record.get('Journal');
            biblio['Year'] = record.get('Year');

            encodedValues['Biblio'].push(biblio);
        });

        component.initialValues = encodedValues;
    },

    /**
     * Use the Record of the reaction to pre-fill the form.
     * This makes several call to the database to get all the info
     */
    loadRecord: function(formPanel) {

        var me = this;

        if (formPanel.down('reactionForm').loadRec) {

            formValue = {};

            var ReactionRec = formPanel.down('reactionForm').loadRec;

            var boxPathway = formPanel.down('selectPathway');
            var boxEnzyme = formPanel.down('selectEnzymes');

            if (ReactionRec.get('dbIdentifier') != "") {
                //console.log(formPanel.query('textfield'));
                var cmp = formPanel.query('textfield[name=dbIdentifier]')[0];
                if (cmp) cmp.setReadOnly(true);
            }
            ReactionRec.getPathways(function(store) {
                var pathway = [];

                store.each(function(record) {
                    pathway.push(record.get('id'));
                });
                boxPathway.select(pathway);

                me.nbLoads++;
                // if (me.nbLoads >= 5)
                me.sauvInitialValues(formPanel);

            });

            ReactionRec.getEnzymes(function(store) {
                var enzyme = [];

                store.each(function(record) {
                    enzyme.push(record.get('idInBio'));
                });
                boxEnzyme.select(enzyme);

                me.nbLoads++;
                // if (me.nbLoads >= 5)
                me.sauvInitialValues(formPanel);
            });

            var encodedValues = {};
            encodedValues['idBiosource'] = MetExplore.globals.Session.idBioSource;
            encodedValues['idReaction'] = ReactionRec.get('id');

            encodedValues['idSubstrates'] = [];
            encodedValues['idProducts'] = [];

            ReactionRec.getSubstrates(function(storeS) {
                storeS.each(function(recordS) {
                    encodedValues['idSubstrates'].push(recordS.get('id'));
                });

                ReactionRec.getProducts(function(storeP) {
                    storeP.each(function(recordP) {
                        encodedValues['idProducts'].push(recordP.get('id'));
                    });
                    me.getReactantData(formPanel, encodedValues);

                    me.nbLoads++;
                    // if (me.nbLoads >= 5)
                    me.sauvInitialValues(formPanel);
                });
            });


        }
    },

    getReactantData: function(formPanel, encodedValues) {

        var me = this;

        var ReactionRec = formPanel.down('reactionForm').loadRec;

        // Get all the data we need to pre-fill the form
        var reactantStore = formPanel.down('reactionCreate').getStore();
        var biblioStore = formPanel.down('gridReactionBiblio').getStore();
        var biblioCtrl = MetExplore.app.getController('C_gridBiblio');
        var metStore = Ext.getStore('S_Metabolite');

        var jsonData = Ext.encode(encodedValues);

        //Load the reactant in the grid 
        Ext.Ajax.request({
            url: 'resources/src/php/dataNetwork/ReactionReactant.php',
            params: {
                "functionParam": jsonData
            },
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success'
            },
            success: function(response, opts) {
                var RepJson = Ext.decode(response.responseText);

                RepJson.results.forEach(function(reactant) {

                    var metName = metStore.getById(reactant.idMetabolite).get("name");

                    if (reactant.type == "Substrat") reactant.type = "Substrate";

                    var object = Ext.create('MetExplore.model.ReactionCreation', {
                        coeff: reactant.coeff,
                        metabolite: metName,
                        idMetabolite: reactant.idMetabolite,
                        type: reactant.type,
                        //cofactor		:reactant.cofactor,
                        side: reactant.side
                        //constantCoeff	:reactant.constantCoeff
                    });

                    reactantStore.add(object);
                });

                me.nbLoads++;
                // if (me.nbLoads >= 5)
                me.sauvInitialValues(formPanel);
            }
        });

        //////////////////////////////////
        //get complementary data (not present in the reaction model because not used anywhere else
        Ext.Ajax.request({
            url: 'resources/src/php/dataNetwork/complementaryDataReaction.php',
            params: {
                "functionParam": jsonData
            },
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success'
            },
            success: function(response, opts) {

                //get the remaining data from the record.
                //Values set here to avoid records to mix data during multiple edit
                formValue['name'] = ReactionRec.get('name');
                formValue['dbIdentifier'] = ReactionRec.get('dbIdentifier');
                formValue['EC'] = ReactionRec.get('ec');
                formValue['ubound'] = ReactionRec.get('upperBound');
                formValue['lbound'] = ReactionRec.get('lowerBound');

                if (ReactionRec.get('hole')) {
                    formValue['hole'] = '1';
                }

                if (ReactionRec.get('reversible')) {
                    formValue['reversible'] = 'true';
                }

                var RepJson = Ext.decode(response.responseText);

                formValue['go'] = RepJson.results.go;
                formValue['goName'] = RepJson.results.goName;
                //formValue['klaw']=RepJson.results.klaw;
                formValue['fast'] = RepJson.results.fast;
                formValue['generic'] = RepJson.results.generic;

                var statusStore = formPanel.down('selectReactionStatus').getStore();
                var rec = statusStore.findRecord('idStatus', RepJson.results.idStatus);
                formPanel.down('selectReactionStatus').select(rec);

                if (RepJson.results.biblio) {
                    RepJson.results.biblio.split(',').forEach(function(pubmedBiblio) {

                        var ids = pubmedBiblio.split('|');
                        var object = Ext.create('MetExplore.model.Biblio', {
                            id: ids[0],
                            pubmedid: ids[1]
                        });

                        biblioCtrl.completeWithPubMedInStore(object);

                        biblioStore.add(object);
                    });
                }
                formPanel.getForm().setValues(formValue);

                me.nbLoads++;
                // if (me.nbLoads >= 5)
                me.sauvInitialValues(formPanel);
            }
        });
    },



    newMetabWin: function(button) {

        var winConfig = {
            title: 'Add New Metabolite',
            autoScroll: true,

            border: false,
            items: [{
                xtype: 'addMetaboliteForm'
            }]
        };

        var win = Ext.create('Ext.Window', winConfig);
        win.show();
    },



    /**
     * Function used to encode the simple form values for the creation and the update of reaction
     */
    encodeFormValues: function(values) {
        var encodedValues = {};

        var idBioSource = MetExplore.globals.Session.idBioSource;

        var ibDB = Ext.getStore("S_MyBioSource").findRecord('id', idBioSource).get('dbId');

        encodedValues['idBiosource'] = idBioSource;
        encodedValues['idDB'] = ibDB;
        encodedValues['iduser'] = MetExplore.globals.Session.idUser;


        encodedValues['name'] = values['name'];
        encodedValues['dbIdentifier'] = values['dbIdentifier'];
        encodedValues['EC'] = values['EC'];
        encodedValues['pathway'] = values['pathway'];
        encodedValues['enzymes'] = values['enzymes'];
        encodedValues['go'] = values['go'];
        encodedValues['goName'] = values['goName'];
        encodedValues['idstatus'] = values['idstatus'];
        //encodedValues['klaw']=values['klaw'];


        if ('reversible' in values) {
            encodedValues['reversible'] = values['reversible'];
        } else {
            encodedValues['reversible'] = '0';
        }

        if ('fast' in values) {
            encodedValues['fast'] = values['fast'];
        } else {
            encodedValues['fast'] = '0';
        }

        if ('generic' in values) {
            encodedValues['generic'] = values['generic'];
        } else {
            encodedValues['generic'] = '0';
        }
        if ('hole' in values) {
            encodedValues['hole'] = values['hole'];
        } else {
            encodedValues['hole'] = '0';
        }

        if (values['ubound'] != '') {
            encodedValues['ubound'] = values['ubound'];
        } else {
            encodedValues['ubound'] = 9999;
        }

        //redefine fluxes bounds in accordance to reversibility of the reaction
        if (values['lbound'] != '') {
            if (encodedValues['reversible'] == '0' && parseInt(values['lbound']) < 0) {
                encodedValues['lbound'] = 0;
            } else {
                encodedValues['lbound'] = values['lbound'];
            }
        } else {
            if (encodedValues['reversible'] == '0') {
                encodedValues['lbound'] = 0;
            } else {
                encodedValues['lbound'] = -9999;
            }
        }

        return encodedValues;
    },


    /**
     * Classic Submit of the form. Used when creating a new Reaction
     */
    SubmitRxnForm: function(button) {

        var values = button.up('form').getForm().getValues();

        var encodedValues = this.encodeFormValues(values);

        /*
         * get the reactant
         */
        var Store = button.up('form').down("reactionCreate").getStore('S_ReactionCreation');

        encodedValues['Substrate'] = [];
        encodedValues['Product'] = [];

        Store.each(function(record) {
            //console.log(record);
            var metabolite = {};
            metabolite['idMetabolite'] = record.get('idMetabolite');
            metabolite['coeff'] = record.get('coeff');
            //metabolite['cofactor']=record.get('cofactor') == true ? 1 : 0;
            metabolite['side'] = record.get('side') == true ? 1 : 0;
            //metabolite['constantCoeff']=record.get('constantCoeff') == true ? 1 : 0;

            encodedValues[record.get('type')].push(metabolite);
        });
        //console.log(Store);


        /*
         * Get the biblio
         */
        var StoreB = button.up('form').down("reactionCreate").down('gridReactionBiblio').getStore('S_ReactionBiblio');

        encodedValues['Biblio'] = [];

        StoreB.each(function(record) {
            var biblio = {};
            biblio['pubmedid'] = record.get('pubmedid');
            biblio['title'] = record.get('title');
            biblio['authors'] = record.get('authors');
            biblio['Journal'] = record.get('Journal');
            biblio['Year'] = record.get('Year');

            encodedValues['Biblio'].push(biblio);
        });


        var jsonData = Ext.encode(encodedValues);


        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {

                MetExplore.globals.MetExploreAjax.send({
                    url: 'resources/src/php/modifNetwork/AddReaction.php',
                    params: {
                        "functionParam": jsonData
                    },
                    waitMsg: 'Adding Reaction, please wait...',
                    successFunction: function(json) {
                        if (button.up('addReactionForm').up('panel').down('selectElement')) {
                            button.up('addReactionForm').up('panel').down('selectElement').reset();
                            button.up('addReactionForm').close();
                        } else if (button.up('addReactionForm').up()) {
                            button.up('addReactionForm').up().close();

                        }
                        Ext.MessageBox.alert('Success', 'Reaction Added correctly');

                        Ext.getStore("S_Reaction").reload({
                            callback: function() {

                                var grid = Ext.ComponentQuery.query('networkData > gridReaction')[0];

                                if (button.getText() === "Save, and go back to table") {
                                    var main = Ext.ComponentQuery.query('mainPanel')[0];
                                    var tab = Ext.ComponentQuery.query('networkData')[0];

                                    if (main && tab && grid) {
                                        main.setActiveTab(tab);
                                        tab.setActiveTab(grid);
                                    }
                                }

                                Ext.getStore('S_LinkReactionMetabolite').reload();
                            }
                        });

                        MetExplore.globals.History.updateAllHistories();

                        Ext.getStore("storeBioSourceInfo").proxy.extraParams.idBioSource = MetExplore.globals.Session.idBioSource;
                        Ext.getStore("storeBioSourceInfo").reload();
                    }

                });
            }
        });


    },

    /**
     * Form submitted when updating an existing reaction. In this case we delete the old reactant and add the new ones.
     * Same thing for the biblio.
     */
    updateReaction: function(button) {

        var form = button.up('form');

        var values = form.getForm().getValues();

        var encodedValues = this.encodeFormValues(values);

        encodedValues['idReaction'] = values['ReactionMySQLId'];
        encodedValues['idReactInBio'] = values['ReactionMySQLIdinBioSource'];

        /*
         * get the reactant
         */
        var Store = form.down("reactionCreate").getStore('S_ReactionCreation');

        encodedValues['Substrate'] = [];
        encodedValues['Product'] = [];

        Store.each(function(record) {
            var metabolite = {};
            metabolite['idMetabolite'] = record.get('idMetabolite');
            metabolite['coeff'] = record.get('coeff');
            //metabolite['cofactor']=record.get('cofactor') == true ? 1 : 0;
            metabolite['side'] = record.get('side') == true ? 1 : 0;
            //metabolite['constantCoeff']=record.get('constantCoeff') == true ? 1 : 0;

            encodedValues[record.get('type')].push(metabolite);
        });

        /*
         * Get the biblio
         */
        var StoreB = form.down("reactionCreate").down('gridReactionBiblio').getStore('S_ReactionBiblio');

        encodedValues['Biblio'] = [];

        StoreB.each(function(record) {
            var biblio = {};
            biblio['MysqlId'] = record.get('id');
            biblio['pubmedid'] = record.get('pubmedid');
            biblio['title'] = record.get('title');
            biblio['authors'] = record.get('authors');
            biblio['Journal'] = record.get('Journal');
            biblio['Year'] = record.get('Year');

            encodedValues['Biblio'].push(biblio);
        });

        var jsonData = Ext.encode(encodedValues);
        var jsonDataInitial = Ext.encode(form.initialValues);

        //console.log(jsonData);

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {

                MetExplore.globals.MetExploreAjax.send({
                    url: 'resources/src/php/modifNetwork/UpdateReaction.php',
                    params: {
                        "functionParam": jsonData,
                        "initialValues": jsonDataInitial
                    },
                    waitMsg: 'Updating reaction, please wait...',
                    successFunction: function(json) {


                        Ext.getStore("S_Reaction").load({
                            callback: function() {

                                var grid = Ext.ComponentQuery.query('networkData > gridReaction')[0];

                                if (button.getText() === "Save, and go back to table") {
                                    var main = Ext.ComponentQuery.query('mainPanel')[0];
                                    var tab = Ext.ComponentQuery.query('networkData')[0];

                                    if (main && tab && grid) {
                                        main.setActiveTab(tab);
                                        tab.setActiveTab(grid);
                                    }
                                }

                                Ext.getStore('S_LinkReactionMetabolite').reload({
                                    callback: function() {
                                        if (Ext.getStore("S_Cart").getById(encodedValues['idReaction'])) {
                                            MetExplore.app.getController('C_GraphPanel').refresh();
                                        }
                                    }
                                });

                            }
                        });

                        if (button.up('addReactionForm').up("window")) {
                            button.up('addReactionForm').up("window").close();

                        } else {
                            button.up('addReactionForm').up('panel').close();

                        }

                        Ext.MessageBox.alert('Success', 'Reaction updated correctly');

                        MetExplore.globals.History.updateAllHistories();
                    }
                });
            }
        });


    }





});