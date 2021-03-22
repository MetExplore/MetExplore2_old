/**
 * C_AddGeneForm
 */
Ext.define('MetExplore.controller.C_AddGeneForm', {
    extend: 'Ext.app.Controller',

    requires: ['MetExplore.globals.Session', 'MetExplore.globals.History', 'MetExplore.globals.MetExploreAjax'],

    config: {
        views: ['form.V_AddGeneForm'],
        nbLoads: 0 //to store initial values only one time: increment this number at each asynchrone ajax request. At the end, if nbLoads is equal of the number of requests to do, then launch sauvInitialValues function
    },


    init: function() {

        this.control({
            'addGeneForm': {
                afterrender: this.loadRecord
            },
            'addGeneForm button[action=addGene]': {
                click: this.SubmitGeneForm
            },
            'addGeneForm button[action=updateGene]': {
                click: this.updateGene
            }
        });
    },

    /**
     * Store initialvalues to send them to the php which identify then the modified values
     * @param {} component : the form object
     * @param {} eOpts
     */
    sauvInitialValues: function(component) {
        this.nbLoads = 0;

        var values = component.getForm().getValues();

        var encodedValues = this.getEncodedValues(values);

        component.initialValues = encodedValues;

    },

    loadRecord: function(formPanel) {

        var me = this;

        if (formPanel.passedRecord) {
            var geneRec = formPanel.passedRecord;

            var formValues = {};
            formValues['geneId'] = geneRec.get('dbIdentifier');
            formValues['name'] = geneRec.get('name');
            if (geneRec.get('dbIdentifier') != "") {
                var cmp = formPanel.query('textfield[name=geneId]')[0];
                if (cmp) cmp.setReadOnly(true);
            }
            var boxProt = formPanel.down('selectProteins');

            geneRec.getProteins(function(store) {
                var proteins = [];

                store.each(function(record) {
                    proteins.push(record);
                });
                boxProt.select(proteins);

                me.sauvInitialValues(formPanel);
            });



            formPanel.getForm().setValues(formValues);
        }
    },


    SubmitGeneForm: function(button) {

        var values = button.up('form').getValues();
        var encodedValues = values;

        var idBioSource = MetExplore.globals.Session.idBioSource;

        var ibDB = Ext.getStore("S_MyBioSource").findRecord('id', idBioSource).get('dbId');

        encodedValues['idBiosource'] = idBioSource;
        encodedValues['idDB'] = ibDB;
        encodedValues['iduser'] = MetExplore.globals.Session.idUser;

        var jsonData = Ext.encode(encodedValues);

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {

                MetExplore.globals.MetExploreAjax.send({
                    url: 'resources/src/php/modifNetwork/AddGene.php',
                    timeout: 240 * 1000,
                    // url : 'cgi/archive.cgi',
                    scope: this,
                    method: 'POST',
                    waitMsg: 'Adding gene in the MetExplore database, please wait...',
                    params: {
                        "functionParam": jsonData
                    },
                    serverFailureMessage: "Impossible to send the parameters to the server",
                    successFunction: function(json) {

                        if (button.up('panel').up('panel').down('selectElement')) {
                            button.up('panel').up('panel').down('selectElement').reset();
                            button.up('addGeneForm').close();
                        } else if (button.up('addGeneForm').up()) {
                            button.up('addGeneForm').up().close();
                        }

                        var grid = Ext.ComponentQuery.query('networkData > gridGene')[0];
                        grid.getSelectionModel().deselectAll(true);

                        Ext.getStore("S_Gene").reload({
                            callback: function() {

                                var grid = Ext.ComponentQuery.query('networkData > gridGene')[0];
                                var main = Ext.ComponentQuery.query('mainPanel')[0];
                                var tab = Ext.ComponentQuery.query('networkData')[0];

                                if (button.getText() === "Save, and go back to table") {

                                    if (main && tab && grid) {
                                        main.setActiveTab(tab);
                                        tab.setActiveTab(grid);
                                    }
                                }
                            }
                        });

                        Ext.MessageBox.alert('Success', 'Gene Added correctly');


                        Ext.getStore("storeBioSourceInfo").proxy.extraParams.idBioSource = MetExplore.globals.Session.idBioSource;
                        Ext.getStore("storeBioSourceInfo").reload();


                        MetExplore.globals.History.updateAllHistories();
                    }

                });
            }
        });


    },

    getEncodedValues: function(values) {
        var encodedValues = values;

        var idBioSource = MetExplore.globals.Session.idBioSource;

        encodedValues['idBiosource'] = idBioSource;
        encodedValues['iduser'] = MetExplore.globals.Session.idUser;

        return encodedValues;
    },

    updateGene: function(button) {

        var form = button.up('form');

        var values = form.getValues();
        var encodedValues = this.getEncodedValues(values);

        var jsonData = Ext.encode(encodedValues);

        var jsonDataInitial = Ext.encode(form.initialValues);

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {

                MetExplore.globals.MetExploreAjax.send({
                    url: 'resources/src/php/modifNetwork/UpdateGene.php',
                    params: {
                        "functionParam": jsonData,
                        "initialValues": jsonDataInitial
                    },
                    waitMsg: 'Updating gene, please wait...',
                    successFunction: function(json) {
                        Ext.getStore("S_Gene").reload({
                            callback: function() {


                                var grid = Ext.ComponentQuery.query('networkData > gridGene')[0];
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

                        if (button.up('addGeneForm').up("window")) {
                            button.up('addGeneForm').up("window").close();
                        } else {
                            button.up('addGeneForm').up('panel').close();
                        }

                        Ext.MessageBox.alert('Success', 'Gene updated correctly');

                        MetExplore.globals.History.updateAllHistories();
                    }
                });
            }
        });
    }
});