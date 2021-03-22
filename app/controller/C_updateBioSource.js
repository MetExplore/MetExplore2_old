/**
 * C_updateBioSource
 */
Ext.define('MetExplore.controller.C_updateBioSource', {
    extend: 'Ext.app.Controller',

    requires: ['MetExplore.globals.BioSource', 'MetExplore.view.form.V_AddUserToProject'],

    init: function() {
        this.control({
            'updateBioSource button[action=save]': {
                click: this.ConfirmSave
            },
            'updateBioSource button[action=reset]': {
                click: this.ResetChanges
            },
            'updateBioSource button[action=addref]': {
                click: this.AddBiblio
            },
            'updateBioSource button[action=manage]': {
                click: this.manageBioSource
            },
            'updateBioSource button[action=delete]': {
                click: this.DeleteBiosource
            },
            'updateBioSource button[action=duplicate]': {
                click: this.duplicateBS
            }

        });
    },

    ConfirmSave: function(button) {
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', this.SaveChanges, button.up('form'));
    },


    SaveChanges: function(buttonID) {
        if (buttonID == 'yes') {
            values = this.getValues();

            var jsonModif = Ext.encode(values);

            MetExplore.globals.Session.isSessionExpired(function(isExpired) {
                if (!isExpired) {
                    Ext.Ajax.request({
                        url: 'resources/src/php/modifNetwork/updateBioSource.php',
                        params: {
                            "functionParam": jsonModif
                        },
                        waitMsg: 'Saving Data, please wait...',
                        success: function(response, opts) {
                            var gridB = Ext.getCmp('gridBioSource');

                            Ext.getStore("S_MyBioSource").reload();
                        },
                        failure: function(response, opts) {
                            Ext.MessageBox.alert('Server-side failure with status code ' + response.status);
                        }

                    })
                }
            });
        }

    },

    ResetChanges: function(button) {
        var form = button.up('form');
        form.getForm().reset();
    },

    AddBiblio: function(button) {
        var values = button.up('form').getValues();

        var gridBib = button.up('form').down('gridBiblioLinks');

        var win_Biblio = Ext.create('Ext.Window', {

            title: 'Add Publication',
            layout: 'fit',
            height: 230,
            width: 400,

            items: [{
                xtype: 'form',
                monitorValid: true,
                bodyPadding: 10,

                items: [{
                    xtype: 'hiddenfield',
                    name: 'idBiosource',
                    value: values.idBiosource
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'PMID',
                    name: 'PMID',
                    allowBlank: false
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Title',
                    name: 'title'
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Authors',
                    name: 'authors'
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Journal',
                    name: 'Journal'
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Year',
                    name: 'Year'
                }],

                buttons: [{
                    text: 'Submit',
                    formBind: true,
                    handler: function(button) {
                        var formValues = button.up('form').getValues();

                        var jsonModif = Ext.encode(formValues);

                        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
                            if (!isExpired) {
                                Ext.Ajax.request({
                                    url: 'resources/src/php/modifNetwork/addRefToBioSource.php',
                                    params: {
                                        "functionParam": jsonModif
                                    },
                                    waitMsg: 'Saving Data, please wait...',
                                    success: function(response, opts) {
                                        win_Biblio.close();
                                        var gridB = Ext.getCmp('gridBioSource');

                                        Ext.getStore("S_MyBioSource").reload({
                                            scope: this,
                                            callback: function(records, operation, success) {

                                                var shortRef = "";

                                                var authorsList = formValues['authors'].split(',');
                                                if (authorsList.length > 1) {
                                                    shortRef = authorsList[0] + " et al., " + formValues['Year'];
                                                } else {
                                                    shortRef = authorsList[0] + ", " + formValues['Year'];
                                                }
                                                newRef = {};
                                                newRef['id'] = formValues['PMID'];
                                                if (shortRef != "") {
                                                    newRef['link'] = '<a target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/?term=' + newRef['id'] + '">' + shortRef + '</a>';
                                                } else {
                                                    newRef['link'] = '<a target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/?term=' + newRef['id'] + '">' + newRef['id'] + '</a>';
                                                }
                                                gridBib.getStore().add(newRef);
                                            }
                                        });



                                    },
                                    failure: function(response, opts) {
                                        Ext.MessageBox.alert('Server-side failure with status code ' + response.status);
                                    }

                                });
                            }
                        });


                    }
                }, {
                    text: 'Complete with PubMed Web service',
                    formBind: true,
                    handler: function(button) {

                        var form = button.up('form');

                        var formValues = form.getValues();

                        Ext.Ajax.cors = true;
                        Ext.Ajax.useDefaultXhrHeader = false;

                        Ext.Ajax.request({
                            url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=' + formValues["PMID"],
                            waitMsg: 'Saving Data, please wait...',
                            success: function(response, opts) {

                                var xmlDoc;

                                if (window.DOMParser) {
                                    parser = new DOMParser();
                                    xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                                } else // code for IE
                                {
                                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                                    xmlDoc.async = false;
                                    xmlDoc.loadXML(response.responseText);
                                }

                                var titl, auth = '',
                                    jour, y;

                                var nodelist = xmlDoc.getElementsByTagName('Item');
                                for (var i = 0; i < nodelist.length; i++) {
                                    if (nodelist[i].getAttribute("Name") == "Title") {
                                        titl = nodelist[i].childNodes[0].nodeValue;
                                    }
                                    if (nodelist[i].getAttribute("Name") == "Author") {
                                        auth += nodelist[i].childNodes[0].nodeValue + ', ';
                                    }
                                    if (nodelist[i].getAttribute("Name") == "FullJournalName") {
                                        jour = nodelist[i].childNodes[0].nodeValue;
                                    }
                                    if (nodelist[i].getAttribute("Name") == "PubDate") {
                                        y = nodelist[i].childNodes[0].nodeValue.substr(0, 4);
                                    }
                                }
                                auth = auth.substring(0, auth.length - 2);
                                form.getForm().setValues([{
                                        id: 'title',
                                        value: titl
                                    },
                                    {
                                        id: 'authors',
                                        value: auth
                                    },
                                    {
                                        id: 'Journal',
                                        value: jour
                                    },
                                    {
                                        id: 'Year',
                                        value: y
                                    }
                                ]);
                            },
                            failure: function(response, opts) {
                                Ext.MessageBox.alert('Server-side failure with status code ' + response.status);
                            }

                        })
                    }
                }]
            }]
        });

        win_Biblio.show();

    },



    manageBioSource: function(button) {
        var values = button.up('form').getValues();

        var idBioSource = values['idBiosource'];

        if (idBioSource == undefined) {
            Ext.MessageBox.alert('No selected BioSource', 'You must select a BioSource before');
        } else {

            var storeBS = Ext.getStore('S_gridBioSource');
            var idProject = storeBS.getAt(storeBS.find('id', values['idBiosource'])).get('idProject');

            if (idProject > -1) {
                Ext.MessageBox.alert('Share of project BioSource', 'You cannot share a BioSource that is in a project. Please add the person to the project instead.');
            } else {

                Ext.Ajax.request({
                    url: 'resources/src/php/userAndProject/getBioSourceUsers.php',

                    params: {
                        idBioSource: idBioSource
                    },
                    failure: function(response, opts) {
                        Ext.MessageBox
                            .alert('Ajax error',
                                'failed: Ajax error!');
                    },
                    success: function(response, opts) {
                        json = Ext.decode(response.responseText);

                        if (json != null) {

                            if (json["success"]) {
                                var access = json['access'];

                                if (access == 'owner') {

                                    var win_Manage = Ext.create('Ext.Window', {

                                        title: 'Manage BioSource users',

                                        layout: 'fit',
                                        width: 800,
                                        height: 300,

                                        items: [{
                                            xtype: 'addUserToProject',
                                            action: 'update',
                                            idBioSource: idBioSource,
                                            access: json['access'],
                                            users: json['users']
                                        }],
                                        buttons: [{
                                            text: "Save",
                                            formbind: true,
                                            handler: this.updateUsers
                                        }, {
                                            text: "Cancel",
                                            formbinf: true,
                                            handler: function(button) {
                                                button.up('window').close();
                                            }
                                        }]

                                    });

                                    win_Manage.show();
                                } else {
                                    Ext.MessageBox.alert('You don\'t have rights', 'You are not an owner of the BIoSource!');
                                }
                            } else {
                                Ext.MessageBox.alert('Error', json["message"]);
                            }
                        } else {
                            var message = "Bad Json!";
                            if (json != null) {
                                message = json["message"];
                            }
                            Ext.MessageBox.alert('Ajax error', message);
                        }
                    },
                    scope: this
                });
            }
        }
    },

    updateUsers: function(button) {
        var win = button.up('window');
        var idBioSource = win.down('addUserToProject').idBioSource;
        var usersStore = win.down('gridUsersInProject').getStore();
        var hasOwner = false;
        var users = {};
        usersStore.each(function(record) {
            var access = record.get('access');
            var idUser = record.get('id');
            users[idUser] = access;
            if (access == "owner") {
                hasOwner = true;
            }
        });
        if (hasOwner) {
            MetExplore.globals.Session.isSessionExpired(function(isExpired) {
                if (!isExpired) {
                    Ext.Ajax.request({
                        url: 'resources/src/php/userAndProject/updateBioSourceUsers.php',

                        params: {
                            idBioSource: idBioSource,
                            users: Ext.encode(users)
                        },
                        failure: function(response, opts) {
                            Ext.MessageBox
                                .alert('Ajax error',
                                    'failed: Ajax error!');
                        },
                        success: function(response, opts) {
                            json = Ext.decode(response.responseText);

                            if (json != null && json["success"]) {
                                win.close();
                            } else {
                                var message = "Bad Json!";
                                if (json != null) {
                                    message = json["message"];
                                }
                                Ext.MessageBox.alert('Ajax error', message);
                            }
                        }
                    });
                }
            });


        } else {
            Ext.MessageBox.alert('Owner required', 'The BioSource must has at least one owner')
        }
    },


    DeleteBiosource: function(button) {

        var values = button.up('form').getValues();

        var windowInfo = button.up('window');

        if (values['idBiosource'] == undefined) {
            Ext.MessageBox.alert('No selected BioSource', 'You must select a BioSource before');
        } else {

            var storeBS = Ext.getStore('S_gridBioSource');
            var idProject = storeBS.getAt(storeBS.find('id', values['idBiosource'])).get('idProject');

            if (idProject > -1) {
                Ext.MessageBox.alert('Delete of project BioSource', 'You cannot delete a BioSource that is in a project. Please remove the BioSource from the project before.');
            } else {

                var gridBioSourceInfo = Ext.create('MetExplore.view.grid.V_gridBioSourceInfo', {
                    header: 'Network Summary',
                    id: values.idBiosource

                });

                var win_Del = Ext.create('Ext.Window', {
                    title: 'Delete BioSource',
                    layout: 'auto',

                    items: [{
                        xtype: 'panel',
                        autoScroll: true,
                        border: false,
                        header: false,
                        width: 400,
                        layout: 'auto',
                        items: [{
                            xtype: 'form',
                            border: false,
                            monitorValid: true,
                            bodyPadding: 10,

                            items: [{
                                xtype: 'fieldset',
                                title: 'Warning !!',
                                html: '<p>You are about to delete your Biosource:</p><p><em>"' + values.BSName + '"</em></p><p>This action is irreversible. Are you sure you want to Continue?</p>'
                            }, {
                                xtype: 'hiddenfield',
                                name: 'databaseRef',
                                value: values.idDBRef

                            }, {
                                xtype: 'hiddenfield',
                                name: 'idBiosource',
                                value: values.idBiosource

                            }, {
                                xtype: 'hiddenfield',
                                name: 'idUser',
                                value: MetExplore.globals.Session.idUser

                            }]
                        }, gridBioSourceInfo]
                    }],
                    buttons: [{
                        text: "Yes",
                        handler: function(button) {
                            var formValues = button.up('window').down('form').getValues();

                            var myMask = new Ext.LoadMask({
                                target: button.up('window'),
                                msg: "Please wait..."
                            });
                            myMask.show();

                            var jsonModif = Ext.encode(formValues);
                            MetExplore.globals.BioSource.doDeleteBioSources({
                                "idBioSources": [formValues]
                            }, jsonModif, myMask, [button.up('window'), windowInfo]);
                        }
                    }, {
                        text: 'No',
                        handler: function(button) {
                            button.up('window').close();
                        }
                    }]
                });

                win_Del.show()
            }
        }
    },


    duplicateBS: function(button) {
        MetExplore.globals.BioSource.duplicateBS(button, button.up('updateBioSource').rec);
    }
});