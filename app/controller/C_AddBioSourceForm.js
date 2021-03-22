/**
 * C_AddBioSourceForm
 */

Ext.define('MetExplore.controller.C_AddBioSourceForm', {

    extend: 'Ext.app.Controller',

    requires: ['MetExplore.globals.History'],

    config: {
        views: ['form.V_AddBioSourceForm']
    },

    init: function() {
        this.control({
            'addBioSourceForm button[action=addBioSource]': {
                click: this.addBioSource
            }
        });
    },
    /**
     * add BioSource
     * @param button
     */
    addBioSource: function(button) {

        var values = button.up('form').getForm().getValues();
        // console.log(values)

        var encodedValues = values;

        encodedValues['iduser'] = MetExplore.globals.Session.idUser;

        /*
         * Get the biblio
         */
        var StoreB = button.up("addBioSourceForm").down('gridReactionBiblio')
            .getStore('S_ReactionBiblio');

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

                Ext.MessageBox.show({
                    msg: 'Saving BioSource, please wait...',
                    progressText: 'Saving...',
                    width: 300,
                    wait: true,
                    waitConfig: {
                        interval: 300
                    }
                });

                Ext.Ajax.request({
                    url: 'resources/src/php/modifNetwork/AddBioSource.php',
                    params: {
                        "functionParam": jsonData
                    },
                    reader: {
                        type: 'json',
                        successProperty: "success"
                    },
                    success: function(response, opts) {


                        var json = Ext.decode(response.responseText);
                        Ext.MessageBox.close();
                        Ext.MessageBox.alert('BioSource Created');

                        var store = Ext.getStore("S_MyBioSource");
                        store.reload({

                            scope: store,
                            callback: function(records, operation, success) {

                                if (button.getText() === "Save, and go back to table") {
                                    var main = Ext.ComponentQuery.query('mainPanel')[0];
                                    var tab = Ext.ComponentQuery.query('networkData')[0];
                                    var grid = Ext.ComponentQuery.query('networkData > gridBioSource')[0];
                                    if (main && tab && grid) {
                                        main.setActiveTab(tab);
                                        tab.setActiveTab(grid);
                                    }
                                }

                                var newBS = this.findRecord('id', json.idBioSource);

                                var recordTab = [newBS];

                                //var CtrlBiosource = Ext.create('MetExplore.controller.C_BioSource');
                                var CtrlBiosource = MetExplore.app.getController('C_BioSource');

                                CtrlBiosource.changeCurrentBioSource(null, recordTab);

                                var gridUBS = Ext.ComponentQuery
                                    .query('gridUserProjectBioSource[name="gridUserBioSource"]')[0];
                                gridUBS.getStore().reload();
                            }
                        });

                        button.up('addBioSourceForm').close();

                        var userHistoryGrid = Ext.ComponentQuery.query("gridHistory[type='user']")[0];

                        if (userHistoryGrid != null) {
                            MetExplore.globals.History.updateHistory(userHistoryGrid);
                        }

                    },
                    failure: function(response, opts) {
                        Ext.MessageBox.close();
                        Ext.MessageBox.alert('Server-side failure with status code ' +
                            response.status);
                    }
                });

            }
        });



    }

});