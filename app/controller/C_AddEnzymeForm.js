/**
 * C_AddEnzymeForm
 */
Ext.define('MetExplore.controller.C_AddEnzymeForm', {
    extend: 'Ext.app.Controller',

    requires: ['MetExplore.globals.Session', 'MetExplore.globals.History'],

    config: {
        views: ['form.V_AddEnzymeForm'],
        nbLoads: 0 //to store initial values only one time: increment this number at each asynchrone ajax request. At the end, if nbLoads is equal of the number of requests to do, then launch sauvInitialValues function
    },


    init: function() {

        this.control({
            'addEnzymeForm': {
                afterrender: this.loadRecord
            },
            'addEnzymeForm button[action=addEnzyme]': {
                click: this.SubmitEnzForm
            },
            'addEnzymeForm button[action=updateEnzyme]': {
                click: this.updateEnzyme
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
            var enzRec = formPanel.passedRecord;

            var formValues = {};
            formValues['enzId'] = enzRec.get('dbIdentifier');
            if (enzRec.get('dbIdentifier') != "") {
                var cmp = formPanel.query('textfield[name=enzId]')[0];
                if (cmp) cmp.setReadOnly(true);
            }
            formValues['name'] = enzRec.get('name');

            var boxRxn = formPanel.down('selectReactions');
            var boxProt = formPanel.down('selectProteins');
            var boxCompart = formPanel.down('selectCompartment');


            enzRec.getProteins(function(store) {
                var proteins = [];
                store.each(function(record) {
                    proteins.push(record);
                });
                boxProt.select(proteins);

                me.nbLoads++;
                if (me.nbLoads >= 3)
                    me.sauvInitialValues(formPanel);
            });

            enzRec.getReactions(function(store) {
                var reactions = [];
                store.each(function(record) {
                    reactions.push(record)
                });
                boxRxn.select(reactions);

                me.nbLoads++;
                if (me.nbLoads >= 3)
                    me.sauvInitialValues(formPanel);
            });


            boxCompart.getStore().loadWithFake_Compartment(function() {

                var fakeComp = boxCompart.getStore().findRecord("identifier", "fake_compartment");

                enzRec.getCompart(function(store) {

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

    SubmitEnzForm: function(button) {

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
                    url: 'resources/src/php/modifNetwork/AddEnzyme.php',
                    params: {
                        "functionParam": jsonData
                    },
                    waitMsg: 'Adding enzyme, please wait...',
                    successFunction: function(json) {
                        if (button.up('panel').up('panel').down('selectElement')) {
                            button.up('panel').up('panel').down('selectElement').reset();
                            button.up('addEnzymeForm').close();
                        } else if (button.up('addEnzymeForm').up()) {
                            button.up('addEnzymeForm').up().close();
                        }
                        Ext.MessageBox.alert('Success', 'Enzymatic Complex added correctly');

                        Ext.getStore("S_Enzyme").reload({
                            callback: function() {

                                var grid = Ext.ComponentQuery.query('networkData > gridEnzyme')[0];

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
                    },
                    failure: function(response, opts) {
                        Ext.MessageBox.alert('Server-side failure with status code ' + response.status);
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

    updateEnzyme: function(button) {
        var form = button.up('form');

        var values = form.getValues();
        var encodedValues = this.getEncodedValues(values);

        var jsonData = Ext.encode(encodedValues);

        var jsonDataInitial = Ext.encode(form.initialValues);

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {

                MetExplore.globals.MetExploreAjax.send({
                    url: 'resources/src/php/modifNetwork/UpdateEnzyme.php',
                    params: {
                        "functionParam": jsonData,
                        "initialValues": jsonDataInitial
                    },
                    waitMsg: 'Updating enzyme, please wait...',
                    successFunction: function(json) {

                        Ext.getStore("S_Enzyme").reload({
                            callback: function() {

                                var grid = Ext.ComponentQuery.query('networkData > gridEnzyme')[0];

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

                        if (button.up('addEnzymeForm').up("window")) {
                            button.up('addEnzymeForm').up("window").close();
                        } else {
                            button.up('addEnzymeForm').up('panel').close();
                        }
                        Ext.MessageBox.alert('Success', 'Enzymatic Complex updated correctly');

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