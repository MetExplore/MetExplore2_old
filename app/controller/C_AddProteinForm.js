/**
 * C_AddProteinForm
 */
Ext.define('MetExplore.controller.C_AddProteinForm', {
    extend: 'Ext.app.Controller',

    requires: ['MetExplore.globals.Session', 'MetExplore.globals.History'],

    config: {
        views: ['form.V_AddProteinForm'],
        nbLoads: 0 //to store initial values only one time: increment this number at each asynchrone ajax request. At the end, if nbLoads is equal of the number of requests to do, then launch sauvInitialValues function
    },


    init: function() {

        this.control({
            'addProteinForm': {
                afterrender: this.loadRecord
            },
            'addProteinForm button[action=addProtein]': {
                click: this.SubmitProtForm
            },
            'addProteinForm button[action=updateProtein]': {
                click: this.updateProtein
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

        var encodedValues = this.getEncodedValues(values);

        component.initialValues = encodedValues;

    },

    loadRecord: function(formPanel) {

        var me = this;

        if (formPanel.passedRecord) {
            var protRec = formPanel.passedRecord;

            var formValues = {};
            formValues['protId'] = protRec.get('dbIdentifier');
            formValues['name'] = protRec.get('name');

            var boxGenes = formPanel.down('selectGenes');
            var boxEnz = formPanel.down('selectEnzymes');
            var boxCompart = formPanel.down('selectCompartment');
            if (protRec.get('dbIdentifier') != "") {
                var cmp = formPanel.query('textfield[name=protId]')[0];
                if (cmp) cmp.setReadOnly(true);
            }
            protRec.getGenes(function(store) {
                var Genes = [];

                store.each(function(record) {
                    Genes.push(record);
                });
                boxGenes.select(Genes);

                me.nbLoads++;
                if (me.nbLoads >= 3)
                    me.sauvInitialValues(formPanel);
            });

            protRec.getEnzymes(function(store) {
                var enzymes = [];

                store.each(function(record) {
                    enzymes.push(record);
                });
                boxEnz.select(enzymes);

                me.nbLoads++;
                if (me.nbLoads >= 3)
                    me.sauvInitialValues(formPanel);

            });

            boxCompart.getStore().loadWithFake_Compartment(function() {

                var fakeComp = boxCompart.getStore().findRecord("identifier", "fake_compartment");

                protRec.getCompart(function(store) {

                    if (store.count() == 0) {
                        boxCompart.select(fakeComp);
                    } else {
                        store.each(function(record) {
                            boxCompart.select(record);
                        });
                    }

                    me.nbLoads++;
                    if (me.nbLoads >= 3)
                        me.sauvInitialValues(formPanel);
                });
            });



            formPanel.getForm().setValues(formValues);
        }

    },

    SubmitProtForm: function(button) {

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
                    url: 'resources/src/php/modifNetwork/AddProtein.php',
                    params: {
                        "functionParam": jsonData
                    },
                    waitMsg: 'Adding protein in the MetExplore database, please wait...',
                    serverFailureMessage: "Impossible to send the parameters to the server",
                    successFunction: function(json) {
                        if (button.up('panel').up('panel').down('selectElement')) {
                            button.up('panel').up('panel').down('selectElement').reset();
                            button.up('addProteinForm').close();
                        } else if (button.up('addProteinForm').up()) {
                            button.up('addProteinForm').up().close();
                        }
                        var grid = Ext.ComponentQuery.query('networkData > gridProtein')[0];
                        grid.getSelectionModel().deselectAll(true);

                        Ext.getStore("S_Protein").reload({
                            callback: function() {

                                var grid = Ext.ComponentQuery.query('networkData > gridProtein')[0];
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

                        Ext.MessageBox.alert('Success', 'Gene Product Added correctly');

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

    updateProtein: function(button) {

        var form = button.up('form');

        var values = form.getValues();
        var encodedValues = this.getEncodedValues(values);

        var jsonData = Ext.encode(encodedValues);

        var jsonDataInitial = Ext.encode(form.initialValues);

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {

                MetExplore.globals.MetExploreAjax.send({
                    url: 'resources/src/php/modifNetwork/UpdateProtein.php',
                    params: {
                        "functionParam": jsonData,
                        "initialValues": jsonDataInitial
                    },
                    waitMsg: 'Updating protein, please wait...',
                    successFunction: function(json) {
                        Ext.getStore("S_Protein").reload({
                            callback: function() {


                                var grid = Ext.ComponentQuery.query('networkData > gridProtein')[0];
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


                        if (button.up('addProteinForm').up("window")) {
                            button.up('addProteinForm').up("window").close()

                        } else {
                            button.up('addProteinForm').up('panel').close();

                        }
                        Ext.MessageBox.alert('Success', 'Gene Product updated correctly');

                        MetExplore.globals.History.updateAllHistories();
                    },
                    failure: function(response, opts) {
                        Ext.MessageBox.alert('Server-side failure with status code ' + response.status);
                    }

                });
            }
        });

    }

});