/**
 * C_AddMetaboliteForm
 */
Ext.define('MetExplore.controller.C_AddMetaboliteForm', {
    extend: 'Ext.app.Controller',

    requires: ['MetExplore.globals.Session', 'MetExplore.globals.History'],

    config: {
        views: ['form.V_AddMetaboliteForm'],
        nbLoads: 0 //to store initial values only one time: increment this number at each asynchrone ajax request. At the end, if nbLoads is equal of the number of requests to do, then launch sauvInitialValues function
    },


    init: function() {

        this.control({
            'addMetaboliteForm': {
                afterrender: this.loadRecord
            },
            'addMetaboliteForm button[action=AutoCompleteKegg]': {
                click: this.AutoCompleteKegg
            },
            'addMetaboliteForm button[action=AutoCompleteChEBI]': {
                click: this.AutoCompleteChEBI
            },
            'addMetaboliteForm button[action=addMetabolite]': {
                click: this.SubmitMtbForm
            },
            'addMetaboliteForm button[action=updateMetabolite]': {
                click: this.updateMetabolite
            }
        });
    },

    /**
     * Store initialvalues to send them to the php which identify then the modified values
     * @param {} component : the form object
     * @param {} eOpts
     */
    sauvInitialValues: function(component, eOpts) {
        component.initialValues = component.getValues();
    },

    loadRecord: function(formPanel) {
        if (formPanel.passedRecord) {

            formValue = {};

            var me = this;

            var MetaboliteRec = formPanel.passedRecord;

            var encodedValues = {};
            encodedValues['idBiosource'] = MetExplore.globals.Session.idBioSource;
            encodedValues['idMetabolite'] = MetaboliteRec.get('id');
            if (MetaboliteRec.get('dbIdentifier') != "") {
                var cmp = formPanel.query('textfield[name=mtbId]')[0];
                if (cmp) cmp.setReadOnly(true);
            }

            var jsonData = Ext.encode(encodedValues);

            Ext.Ajax.request({
                url: 'resources/src/php/dataNetwork/dataMetabolite_identifiers.php',
                method: "GET",
                params: {
                    "idMySql": MetaboliteRec.get('id')
                },
                reader: {
                    type: 'json',
                    root: 'results',
                    successProperty: 'success'
                },
                success: function(response, opts) {
                    var RepArray = Ext.decode(response.responseText);

                    var keggCmp = Ext.ComponentQuery.query("fieldset textfield[name=keggid]")[0];

                    RepArray.results.forEach(function(object) {

                        var cmp = Ext.ComponentQuery.query("fieldset textfield[name=" + object.dbname + "]")[0];
                        if (cmp) {
                            cmp.setValue(object.dbid);
                        } else {
                            keggCmp.up('fieldset').add({
                                items: [{
                                    xtype: 'textfield',
                                    fieldLabel: object.dbname,
                                    name: object.dbname,
                                    value: object.dbid
                                }, {
                                    xtype: 'button',
                                    iconCls: 'del',
                                    handler: function(button) {
                                        button.up('panel').close();
                                    }
                                }]
                            });
                        }
                    });

                    //console.log(RepArray.results)

                    me.nbLoads++;
                    // if (me.nbLoads == 2)
                    me.sauvInitialValues(formPanel);
                },
                scope: this
            });

            Ext.Ajax.request({
                url: 'resources/src/php/dataNetwork/complementaryDataMetabolite.php',
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
                    formValue['mtbId'] = MetaboliteRec.get('dbIdentifier');
                    formValue['mtbname'] = MetaboliteRec.get('name');
                    formValue['formula'] = MetaboliteRec.get('chemicalFormula');
                    formValue['weight'] = MetaboliteRec.get('weight');
                    formValue['sideCoumpound'] = MetaboliteRec.get('sideCompound');


                    var CompRec = Ext.getStore('S_CompartmentInBioSource').findRecord('identifier', MetaboliteRec.get('compartment'));
                    formPanel.down('selectCompartment').select(CompRec);

                    formPanel.getForm().setValues(formValue);

                    me.nbLoads++;
                    // if (me.nbLoads == 2)
                    me.sauvInitialValues(formPanel);
                }
            });

        }

    },


    AutoCompleteKegg: function(button) {
        keggid = button.up('panel').down('textfield').getValue();
        var values = button.up('form').getValues();

        var fieldset = button.up('fieldset');

        fieldset.setLoading(true);

        Ext.Ajax.request({
            url: 'resources/src/php/webservices/keggCompound.php',
            params: {
                "kegg": keggid
            },
            reader: {
                type: 'json',
                root: 'data',
                successProperty: 'success'
            },
            success: function(response, opts) {
                var response = Ext.decode(response.responseText);
                if (response.success) {

                    var keggvalues = {};

                    if (values['mtbname'] == '' && response.data['NAME']) {
                        keggvalues['mtbname'] = response.data['NAME'][0];
                    }
                    if (values['formula'] == '' && response.data['FORMULA']) {
                        keggvalues['formula'] = response.data['FORMULA'][0];
                    }
                    if (values['weight'] == '' && response.data['MOL_WEIGHT']) {
                        keggvalues['weight'] = response.data['MOL_WEIGHT'][0];
                    }
                    if (response.data['DBLINKS']) {

                        for (var i = 0, c = response.data['DBLINKS'].length; i < c; i++) {

                            var array = response.data['DBLINKS'][i].split(": ");

                            if (!(array[0] in values)) {

                                button.up('fieldset').add({
                                    items: [{
                                        xtype: 'textfield',
                                        fieldLabel: array[0],
                                        name: array[0],
                                        value: array[1]
                                    }, {
                                        xtype: 'button',
                                        iconCls: 'del',
                                        handler: function(button) {
                                            button.up('panel').close();
                                        }
                                    }]
                                });

                            } else /*if (( array[0] in values) && values[array[0]==''])*/ {
                                keggvalues[array[0]] = array[1];
                            }
                        }
                    }

                    button.up('form').getForm().setValues(keggvalues);
                    fieldset.setLoading(false);

                } else {
                    Ext.MessageBox.alert("Error", "Invalid Kegg identifier: " + keggid);
                    fieldset.setLoading(false);
                }
            },
            failure: function(response, opts) {
                fieldset.setLoading(false);
                Ext.MessageBox.alert('Server-side failure with status code ' + response.status);
            }

        })
    },



    AutoCompleteChEBI: function(button) {

        chebi = button.up('panel').down('textfield').getValue();

        var values = button.up('form').getValues();

        var fieldset = button.up('fieldset');

        fieldset.setLoading(true);

        Ext.Ajax.request({
            url: 'resources/src/php/webservices/ChEBI.php',
            params: {
                "chebi": chebi
            },
            reader: {
                type: 'json',
                root: 'data',
                successProperty: 'success'
            },
            waitMsg: 'Saving Data, please wait...',
            success: function(response, opts) {
                var response = Ext.decode(response.responseText);
                if (response.success) {
                    var chebivalues = {};

                    if (values['mtbname'] == '' && response.data['chebiAsciiName']) {
                        chebivalues['mtbname'] = response.data['chebiAsciiName'][0];
                    }
                    if (values['formula'] == '' && response.data['Formulae']) {
                        chebivalues['formula'] = response.data['Formulae'][0];
                    }
                    if (values['charge'] == '' && response.data['charge']) {
                        chebivalues['charge'] = response.data['charge'][0];
                    }
                    if (values['weight'] == '' && response.data['mass']) {
                        chebivalues['weight'] = response.data['mass'][0];
                    }
                    if (values['inchi'] == '' && response.data['inchi']) {
                        chebivalues['inchi'] = response.data['inchi'][0];
                    }
                    if (values['inchiKey'] == '' && response.data['inchiKey']) {
                        chebivalues['inchiKey'] = response.data['inchiKey'][0];
                    }
                    if (values['smiles'] == '' && response.data['smiles']) {
                        chebivalues['smiles'] = response.data['smiles'][0];
                    }

                    button.up('form').getForm().setValues(chebivalues);
                    fieldset.setLoading(false);
                } else {
                    fieldset.setLoading(false);
                    Ext.MessageBox.alert("Error", "Invalid ChEBI identifier: " + chebi);

                }
            },
            failure: function(response, opts) {
                fieldset.setLoading(false);
                Ext.MessageBox.alert('Server-side failure with status code ' + response.status);
            }

        })

    },

    encodeFormValues: function(values) {

        var encodedValues = {};

        var idBioSource = MetExplore.globals.Session.idBioSource;

        var ibDB = Ext.getStore("S_MyBioSource").findRecord('id', idBioSource).get('dbId');

        encodedValues['idBiosource'] = idBioSource;
        encodedValues['idDB'] = ibDB;
        encodedValues['iduser'] = MetExplore.globals.Session.idUser;

        encodedValues['mtbId'] = values['mtbId'];
        encodedValues['mtbname'] = values['mtbname'];
        encodedValues['idCmpInBS'] = values['idCmpInBS'];
        encodedValues['formula'] = values['formula'];
        encodedValues['charge'] = values['charge'];
        encodedValues['weight'] = values['weight'];

        if (values['iValue'] == '') {
            encodedValues['qty'] = null;
            encodedValues['iValue'] = null;

        } else {
            encodedValues['qty'] = values['qty'];
            encodedValues['iValue'] = values['iValue'];
        }

        if ("generic" in values) {
            encodedValues['generic'] = values['generic'];
        } else {
            encodedValues['generic'] = 0;
        }

        if ("constant" in values) {
            encodedValues['constant'] = values['constant'];
        } else {
            encodedValues['constant'] = 0;
        }

        if ("boundaryCondition" in values) {
            encodedValues['boundaryCondition'] = values['boundaryCondition'];
        } else {
            encodedValues['boundaryCondition'] = 0;
        }
        if ("sideCoumpound" in values) {
            encodedValues['sideCoumpound'] = values['sideCoumpound'];
        } else {
            encodedValues['sideCoumpound'] = 0;
        }
        if ("hasOnlySubstanceUnit" in values) {
            encodedValues['hasOnlySubstanceUnit'] = values['hasOnlySubstanceUnit'];
        } else {
            encodedValues['hasOnlySubstanceUnit'] = 0;
        }
        if ("substanceUnit" in values) {
            encodedValues['substanceUnit'] = values['substanceUnit'];
        } else {
            encodedValues['substanceUnit'] = null;
        }

        encodedValues['DBref'] = {};

        for (var key in values) {
            if (!(key in encodedValues) && key !== "MetaboliteMySQLId" && key !== "MetaboliteMySQLIdinBioSource") {
                encodedValues['DBref'][key] = values[key];
            }

        }

        return encodedValues;

    },

    SubmitMtbForm: function(button) {

        var values = button.up('form').getValues();

        var encodedValues = this.encodeFormValues(values);

        var jsonData = Ext.encode(encodedValues);

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {

                MetExplore.globals.MetExploreAjax.send({
                    url: 'resources/src/php/modifNetwork/AddMetabolite.php',
                    params: {
                        "functionParam": jsonData
                    },
                    waitMsg: 'Adding metabolite, please wait...',
                    successFunction: function(json) {
                        if (button.up('panel').up('panel').down('selectElement')) {
                            button.up('panel').up('panel').down('selectElement').reset();
                            button.up('addMetaboliteForm').close();
                        } else if (button.up('addMetaboliteForm').up()) {
                            button.up('addMetaboliteForm').up().close();
                        }

                        Ext.MessageBox.alert('Success', 'Metabolite added correctly');

                        Ext.getStore("S_Metabolite").reload({
                            callback: function() {

                                var grid = Ext.ComponentQuery.query('networkData > gridMetabolite')[0];

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

                        Ext.getStore("S_MetaboliteInchiSvg").reload();

                        MetExplore.globals.History.updateAllHistories();

                    }
                });
            }
        });
    },

    updateMetabolite: function(button) {

        var form = button.up('form');

        var values = form.getValues();

        var encodedValues = this.encodeFormValues(values);

        encodedValues['idMetabolite'] = values['MetaboliteMySQLId'];
        encodedValues['idMetInBio'] = values['MetaboliteMySQLIdinBioSource'];

        var jsonData = Ext.encode(encodedValues);

        var initialValues = form.initialValues;

        var encodedInitialValues = this.encodeFormValues(initialValues);
        encodedInitialValues['idMetabolite'] = values['MetaboliteMySQLId'];
        encodedInitialValues['idMetInBio'] = values['MetaboliteMySQLIdinBioSource'];

        var jsonOrigData = Ext.encode(encodedInitialValues);

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {

                MetExplore.globals.MetExploreAjax.send({
                    url: 'resources/src/php/modifNetwork/UpdateMetabolite.php',
                    params: {
                        "functionParam": jsonData,
                        "initialValues": jsonOrigData
                    },
                    waitMsg: 'Updating metabolite, please wait...',
                    successFunction: function(json) {

                        Ext.getStore("S_Metabolite").reload({
                            callback: function() {

                                var grid = Ext.ComponentQuery.query('networkData > gridMetabolite')[0];

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

                        Ext.getStore("S_MetaboliteInchiSvg").reload();

                        if (button.up('addMetaboliteForm').up('window')) {
                            button.up('addMetaboliteForm').up("window").close();
                        } else {
                            button.up('addMetaboliteForm').up('panel').close();
                        }

                        Ext.MessageBox.alert('Success', 'Metabolite updated correctly');

                        MetExplore.globals.History.updateAllHistories();
                    }

                });
            }
        });


    }

});