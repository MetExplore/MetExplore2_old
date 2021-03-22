/**
 * C_AddPathwayForm
 */
Ext.define('MetExplore.controller.C_AddPathwayForm', {
    extend: 'Ext.app.Controller',

    requires: ['MetExplore.globals.Session', 'MetExplore.globals.History'],

    config: {
        views: ['form.V_AddPathwayForm'],
        nbLoads: 0 //to store initial values only one time: increment this number at each asynchrone ajax request. At the end, if nbLoads is equal of the number of requests to do, then launch sauvInitialValues function
    },


    init: function() {

        this.control({
            'addPathwayForm': {
                afterrender: this.loadRecord
            },
            'addPathwayForm button[action=addPathway]': {
                click: this.SubmitPthwForm
            },
            'addPathwayForm button[action=updatePathway]': {
                click: this.updatePathway
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
        values = component.getValues();
        var encodedInitialValues = this.encodeFormValues(values);
        encodedInitialValues['idPathway'] = values['PathwayMySQLId'];
        component.initialValues = encodedInitialValues;
    },

    loadRecord: function(formPanel) {

        var me = this;

        if (formPanel.passedRecord) {

            var pathRec = formPanel.passedRecord;

            var encodedValues = {};
            encodedValues['idBiosource'] = MetExplore.globals.Session.idBioSource;
            encodedValues['idPathway'] = pathRec.get('id');
            encodedValues['idPathInBio'] = pathRec.get('idInBio');

            var rxnBox = formPanel.down('selectReactions');
            var supBox = formPanel.down('selectPathway');
            if (pathRec.get('dbIdentifier') != "") {
                console.log(formPanel.query('textfield'));
                var cmp = formPanel.query('textfield[name=pthwId]')[0];
                if (cmp) cmp.setReadOnly(true);
            }
            var ReactStore = pathRec.getReactions(function(store) {
                var aReaction = [];
                store.each(function(record) {
                    aReaction.push(record.get('idInBio'));
                });
                rxnBox.select(aReaction);
                me.nbLoads++;
                if (me.nbLoads >= 2) {
                    me.sauvInitialValues(formPanel);
                }
            });
            formPanel.getForm().loadRecord(pathRec);

            var jsonData = Ext.encode(encodedValues);

            formValue = {};

            Ext.Ajax.request({
                url: 'resources/src/php/dataNetwork/complementaryDataPahway.php',
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
                    //console.log(RepJson.results)
                    var SuperPath = [];
                    RepJson.results.forEach(function(sup) {
                        SuperPath.push(sup.Super);
                    });
                    supBox.select(SuperPath);

                },
                callback: function() {
                    formValue['pthwId'] = pathRec.get('dbIdentifier');
                    formValue['pthwname'] = pathRec.get('name');

                    formPanel.getForm().setValues(formValue);

                    me.nbLoads++;
                    if (me.nbLoads >= 2) {
                        me.sauvInitialValues(formPanel);
                    }
                }

            });

        }

    },


    encodeFormValues: function(values) {
        var encodedValues = {};

        var idBioSource = MetExplore.globals.Session.idBioSource;

        var ibDB = Ext.getStore("S_MyBioSource").findRecord('id', idBioSource).get('dbId');

        encodedValues['idBiosource'] = idBioSource;
        encodedValues['idDB'] = ibDB;
        encodedValues['iduser'] = MetExplore.globals.Session.idUser;

        encodedValues['pthwId'] = values['pthwId'];
        encodedValues['pthwname'] = values['pthwname'];

        encodedValues['rxnInpthw'] = values['rxns'];
        encodedValues['superpthw'] = values['superpthws'];

        return encodedValues;
    },


    SubmitPthwForm: function(button) {

        var values = button.up('form').getValues();

        var encodedValues = this.encodeFormValues(values);

        var jsonData = Ext.encode(encodedValues);

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                MetExplore.globals.MetExploreAjax.send({
                    url: 'resources/src/php/modifNetwork/AddPathway.php',
                    params: {
                        "functionParam": jsonData
                    },
                    waitMsg: 'Adding pathway, please wait...',
                    successFunction: function(json) {
                        if (button.up('panel').up('panel').down('selectElement')) {
                            button.up('panel').up('panel').down('selectElement').reset();
                            button.up('addPathwayForm').close();
                        } else if (button.up('addPathwayForm').up()) {
                            button.up('addPathwayForm').up().close();
                        }

                        Ext.MessageBox.alert('Success', 'Pathway added correctly');

                        Ext.getStore("S_Pathway").reload({
                            callback: function() {

                                var grid = Ext.ComponentQuery.query('networkData > gridPathway')[0];

                                if (button.getText() === "Save, and go back to table") {
                                    var main = Ext.ComponentQuery.query('mainPanel')[0];
                                    var tab = Ext.ComponentQuery.query('networkData')[0];

                                    if (main && tab && grid) {
                                        main.setActiveTab(tab);
                                        tab.setActiveTab(grid);
                                    }
                                }
                            }
                        });
                        Ext.getStore("storeBioSourceInfo").proxy.extraParams.idBioSource = MetExplore.globals.Session.idBioSource;
                        Ext.getStore("storeBioSourceInfo").reload();

                        MetExplore.globals.History.updateAllHistories();
                    }
                });
            }
        });



    },

    updatePathway: function(button) {

        var form = button.up('form');

        var values = form.getValues();

        var encodedValues = this.encodeFormValues(values);
        encodedValues['idPathway'] = values['PathwayMySQLId'];

        var jsonData = Ext.encode(encodedValues);

        var jsonDataInitial = Ext.encode(form.initialValues);

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                MetExplore.globals.MetExploreAjax.send({
                    url: 'resources/src/php/modifNetwork/UpdatePathway.php',
                    params: {
                        "functionParam": jsonData,
                        "initialValues": jsonDataInitial
                    },
                    waitMsg: 'Updating pathway, please wait...',
                    successFunction: function(json) {
                        Ext.getStore("S_Pathway").reload({
                            callback: function() {

                                var grid = Ext.ComponentQuery.query('networkData > gridPathway')[0];

                                if (button.getText() === "Save, and go back to table") {
                                    var main = Ext.ComponentQuery.query('mainPanel')[0];
                                    var tab = Ext.ComponentQuery.query('networkData')[0];
                                    if (main && tab && grid) {
                                        main.setActiveTab(tab);
                                        tab.setActiveTab(grid);
                                    }
                                }
                            }
                        });

                        if (button.up('addPathwayForm').up("window")) {
                            button.up('addPathwayForm').up("window").close();

                        } else {
                            button.up('addPathwayForm').up('panel').close();
                        }

                        Ext.MessageBox.alert('Success', 'Pathway updated correctly');


                        MetExplore.globals.History.updateAllHistories();

                    }

                });
            }
        });



    }





});