/**
 * Mapping menu
 * @description create mapping tab
 * 
 */

Ext.define('MetExplore.view.menu.V_MappingMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.mappingMenu',
    disabled: false,

    //		requires: ['MetExplore.view.form.V_Map'],		

    items: [{
            text: 'From Omics',
            iconCls: 'importData',
            tooltip: 'Mapping from new data',
            handler: function() {
                var tabPanel = Ext.getCmp('tabPanel');

                var newTab = tabPanel.add({
                    title: 'Mapping',
                    closable: true,
                    iconCls: 'map',
                    autoScroll: true,
                    items: [{
                        xtype: 'formMap'
                    }],
                    listeners: {
                        afterrender: function(panel) {
                            var name = panel.query('textfield[name=mapping_name]')[0];
                            name.setValue('Mapping');
                        },
                        close: function(panel) {
                                //var namePanel= panel.title;
                                var idMap = panel.query('textfield[name=id]')[0].getRawValue();
                                //var store = Ext.getStore('S_MappingInfo');
                                //console.log(idMap);
                                if (idMap != "") {
                                    //Ext.MessageBox.confirm('Close Mapping', 'Do you want to remove mapping?', function (btn) {
                                        //console.log(btn);
                                      //  if (btn == 'yes') {
                                            var tabId = idMap.split(',');
                                            var ctrlMap= MetExplore.app.getController('C_Map');
                                            for (i = 0; i < tabId.length; i++) {
                                                ctrlMap.removeMapping(tabId[i]);
                                            }
                                            // for (i = 0; i < tabId.length; i++) {
                                            //     var rec = store.findRecord('id', tabId[i]);
                                            //     if (rec) {
                                            //         var object = rec.get('object');
                                            //         var numero = rec.get('numero');
                                            //         MetExplore.app.getController('C_BioSource').delMappingNum(object, numero);
                                            //     }
                                            //}
                                        }
                                   // });
                               // }
                        }
                    }
                });
                newTab.show();
            }
        },
        // {
        //     text: 'Metabolomics / Lipidomics',
        //     id: 'lipidoMenu',
        //     iconCls: 'importData',
        //     tooltip: 'Mapping from new data',
        //     handler: function() {
        //         var tabPanel = Ext.getCmp('tabPanel');
        //
        //         var newTab = tabPanel.add({
        //             title: 'Mapping',
        //             closable: true,
        //             iconCls: 'map',
        //             autoScroll: true,
        //             items: [{
        //                 xtype: 'formMapMulti'
        //             }],
        //             listeners: {
        //                 afterrender: function(panel) {
        //                     var name = panel.query('textfield[name=mapping_name]')[0];
        //                     name.setValue('Mapping');
        //                     //console.log(name);
        //                 },
        //                 close: function(panel) {
        //                     //var namePanel= panel.title;
        //                     var idMap = panel.query('textfield[name=id]')[0].getRawValue();
        //                     var store = Ext.getStore('S_MappingInfo');
        //                     //console.log(idMap);
        //                     if (idMap != "") {
        //                         Ext.MessageBox.confirm('Close Mapping', 'Do you want to remove mapping', function(btn) {
        //                             //console.log(btn);
        //                             if (btn == 'yes') {
        //                                 var tabId = idMap.split(',');
        //                                 for (i = 0; i < tabId.length; i++) {
        //                                     var rec = store.findRecord('id', tabId[i]);
        //                                     if (rec) {
        //                                         var object = rec.get('object');
        //                                         var numero = rec.get('numero');
        //                                         MetExplore.app.getController('C_BioSource').delMappingNum(object, numero);
        //                                     }
        //                                 }
        //                             }
        //                         });
        //                     }
        //                 }
        //             }
        //         });
        //         newTab.show();
        //     },
        // },
        {
            text: 'Genomics with gpr',
            iconCls: 'importData',
            id:'mappingGPR',
            tooltip: 'Mapping Genomics data',
            handler: function() {
                var tabPanel = Ext.getCmp('tabPanel');

                var newTab = tabPanel.add({
                    title: 'Mapping',
                    closable: true,
                    iconCls: 'map',
                    autoScroll: true,
                    items: [{
                        xtype: 'formMapGene'
                    }],
                    listeners: {
                        afterrender: function(panel) {
                            var name = panel.query('textfield[name=mapping_name]')[0];
                            name.setValue('Mapping');
                            //console.log(name);
                        },
                        close: function(panel) {
                            //var namePanel= panel.title;
                            var idMap = panel.query('textfield[name=id]')[0].getRawValue();
                            var store = Ext.getStore('S_MappingInfo');
                            //console.log(idMap);
                            if (idMap != "") {
                                Ext.MessageBox.confirm('Close Mapping', 'Do you want to remove mapping?', function(btn) {
                                    //console.log(btn);
                                    if (btn == 'yes') {
                                        var tabId = idMap.split(',');
                                        for (i = 0; i < tabId.length; i++) {
                                            var rec = store.findRecord('id', tabId[i]);
                                            if (rec) {
                                                var object = rec.get('object');
                                                var numero = rec.get('numero');
                                                MetExplore.app.getController('C_BioSource').delMappingNum(object, numero);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
                newTab.show();
            },
        },

        {
            text: 'Help',
            iconCls: 'help',
            tooltip: 'Documentation for mapping',
            handler: function() {
                MetExplore.app.getController('C_HelpRedirection').goTo('mapping.php');
            }
        }
    ]

});