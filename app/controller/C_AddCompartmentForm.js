/**
 * C_AddCompartmentForm
 */
Ext.define('MetExplore.controller.C_AddCompartmentForm', {
    extend: 'Ext.app.Controller',

    requires: ['MetExplore.globals.Session', 'MetExplore.globals.History'],

    config: {
        views: ['form.V_AddCompartmentForm']
    },


    init: function() {

        this.control({
            'addCompartmentForm': {
                afterrender: this.loadRecord
            },
            'addCompartmentForm button[action=addCompartment]': {
                click: this.SubmitCmptForm
            },
            'addCompartmentForm button[action=updateCompartment]': {
                click: this.updateCompartment
            }
        });
    },
    /**
     * loadRecord
     * @param formPanel
     */
    loadRecord: function(formPanel) {
        if (formPanel.passedRecord) {
            var cmptRec = formPanel.passedRecord;

            formPanel.getForm().findField('CompartmentMySQLId').setValue(cmptRec.get('idCompartment'));
            formPanel.getForm().findField('CompartmentMySQLIdinBioSource').setValue(cmptRec.get('id'));

            var formValues = {};
            if (cmptRec.get('dbIdentifier') != "") {
                var cmp = formPanel.query('textfield[name=cmptId]')[0];
                if (cmp) cmp.setReadOnly(true);
            }

            var encodedValues = {};
            encodedValues['idBiosource'] = MetExplore.globals.Session.idBioSource;
            encodedValues['idCmptInBS'] = cmptRec.get('id');
            encodedValues['idCmpt'] = cmptRec.get('idCompartment');

            var jsonData = Ext.encode(encodedValues);

            formValue = {};

            Ext.Ajax.request({
                url: 'resources/src/php/dataNetwork/complementaryDataCompartment.php',
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

                    Object.getOwnPropertyNames(RepJson.results).forEach(function(val, idx, array) {
                        formValue[val] = RepJson.results[val];
                    });

                },
                callback: function() {
                    formValue['cmptId'] = cmptRec.get('identifier');
                    formValue['name'] = cmptRec.get('name');


                    formPanel.getForm().setValues(formValue);
                }
            });
        }
    },

    /**
     * encodeFormValues
     * @param values
     */
    encodeFormValues: function(values) {

        var encodedValues = {};

        var idBioSource = MetExplore.globals.Session.idBioSource;

        var ibDB = Ext.getStore("S_MyBioSource").findRecord('id', idBioSource).get('dbId');

        encodedValues['idBiosource'] = idBioSource;
        encodedValues['idDB'] = ibDB;
        encodedValues['iduser'] = MetExplore.globals.Session.idUser;

        encodedValues['cmptId'] = values['cmptId'];
        encodedValues['name'] = values['name'];

        encodedValues['spatialDimensions'] = values['spatialDimensions'];

        if ('size' in values) {
            encodedValues['size'] = values['size'];
        }

        if (values['units'] !== '') {
            encodedValues['units'] = values['units'];
        }

        encodedValues['outCmp'] = values['outCmp'];

        if ('constant' in values) {
            encodedValues['constant'] = values['constant'];
        } else {
            encodedValues['constant'] = 0;
        }

        if ('default' in values) {
            encodedValues['default'] = values['default'];
        } else {
            encodedValues['default'] = 0;
        }
        return encodedValues;
    },


    SubmitCmptForm: function(button) {

        var values = button.up('form').getValues();

        var encodedValues = this.encodeFormValues(values);

        var jsonData = Ext.encode(encodedValues);

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {

                MetExplore.globals.MetExploreAjax.send({
                    url: 'resources/src/php/modifNetwork/AddCompartment.php',
                    params: {
                        "functionParam": jsonData
                    },
                    waitMsg: 'Adding compartment, please wait...',
                    successFunction: function(json) {
                        if (button.up('panel').up('panel').down('selectElement')) {
                            button.up('panel').up('panel').down('selectElement').reset();
                            button.up('addCompartmentForm').close();
                        } else if (button.up('addCompartmentForm').up()) {
                            button.up('addCompartmentForm').up().close();
                        }

                        Ext.MessageBox.alert('Success', 'Compartment added correctly');

                        Ext.getStore("S_CompartmentInBioSource").reload({
                            callback: function() {

                                var grid = Ext.ComponentQuery.query('networkData > gridCompartment')[0];

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

                        var insertComparts = Ext.ComponentQuery.query('selectInsertCompartment');

                        for (var i = 0, n = insertComparts.length; i < n; i++) {
                            var comp = insertComparts[i];

                            comp.down("selectCompartment").getStore().loadWithFake_Compartment();
                        }

                        Ext.getStore("storeBioSourceInfo").proxy.extraParams.idBioSource = MetExplore.globals.Session.idBioSource;
                        Ext.getStore("storeBioSourceInfo").reload();

                        MetExplore.globals.History.updateAllHistories();
                    }

                });
            }
        });


    },
    /**
     * updateCompartment
     * @param button
     */
    updateCompartment: function(button) {

        var values = button.up('form').getValues();

        var encodedValues = this.encodeFormValues(values);

        encodedValues['idCompartment'] = values["CompartmentMySQLId"];
        encodedValues['idCmptInBS'] = values["CompartmentMySQLIdinBioSource"];

        var jsonData = Ext.encode(encodedValues);

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {

                MetExplore.globals.MetExploreAjax.send({
                    url: 'resources/src/php/modifNetwork/UpdateCompartment.php',
                    params: {
                        "functionParam": jsonData
                    },
                    waitMsg: 'Updating compartment, please wait...',
                    successFunction: function(json) {

                        Ext.getStore("S_CompartmentInBioSource").reload({
                            callback: function() {

                                var grid = Ext.ComponentQuery.query('networkData > gridCompartment')[0];

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

                        if (button.up('addCompartmentForm').up("window")) {
                            button.up('addCompartmentForm').up("window").close();
                        } else {
                            button.up('addCompartmentForm').up('panel').close();
                        }
                        Ext.MessageBox.alert('Success', 'Compartment updated correctly');

                        MetExplore.globals.History.updateAllHistories();

                        var insertComparts = Ext.ComponentQuery.query('selectInsertCompartment');

                        for (var i = 0, n = insertComparts.length; i < n; i++) {
                            var comp = insertComparts[i];

                            comp.down("selectCompartment").getStore().loadWithFake_Compartment();
                        }

                    }
                });
            }
        });

    }





});