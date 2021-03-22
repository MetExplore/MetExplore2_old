/**
 * Tools menu
 * @description create Tools menu
 *
 */

Ext.define('MetExplore.view.menu.V_ToolMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.toolMenu',
    disabled: false,

    requires: [
        //'MetExplore.view.menu.V_MappingMenu', 'MetExplore.view.menu.V_MeSHMenu'
    ],

    items: [
        {
            text: 'Metabolite Identifier Matcher',
            id: 'identifier',
            iconCls: 'translator',
            tooltip: 'Identifier Matcher',
            handler: function () {
                var tabPanel = Ext.getCmp('tabPanel');

                var newTab = tabPanel.add({
                    title: 'Identifier Matcher',
                    closable: true,
                    autoScroll: true,
                    items: [{
                        xtype: 'formIdentifierMatcher'
                    }],
                    listeners: {
                        // afterrender: function(panel) {
                        //     var name = panel.query('textfield[name=mapping_name]')[0];
                        //     name.setValue('Mapping');
                        //     //console.log(name);
                        // },
                        // close: function(panel) {
                        //     //var namePanel= panel.title;
                        //     var idMap = panel.query('textfield[name=id]')[0].getRawValue();
                        //     var store = Ext.getStore('S_MappingInfo');
                        //     //console.log(idMap);
                        //     if (idMap != "") {
                        //         Ext.MessageBox.confirm('Close Mapping', 'Do you want to remove mapping', function(btn) {
                        //             //console.log(btn);
                        //             if (btn == 'yes') {
                        //                 var tabId = idMap.split(',');
                        //                 for (i = 0; i < tabId.length; i++) {
                        //                     var rec = store.findRecord('id', tabId[i]);
                        //                     if (rec) {
                        //                         var object = rec.get('object');
                        //                         var numero = rec.get('numero');
                        //                         MetExplore.app.getController('C_BioSource').delMappingNum(object, numero);
                        //                     }
                        //                 }
                        //             }
                        //         });
                        //     }
                        // }
                    }
                });
                newTab.show();
            }
        }, {
            text: 'MeSH mining',
            iconCls: 'meshLogo',
            id: 'meSHMainMenu',
            hidden: true,
            tooltip: 'Launch MeSH analysis' //,
            // listeners: {
            //     added: {
            //         fn: function() {
            //             var cmp = this;
            //             Ext.Ajax.request({
            //                 url: 'resources/src/php/webservices/checkMetab2MeSH.php',
            //                 timeout: 22000,
            //                 success: function(form, action) {
            //                     var res = null;

            //                     try {
            //                         res = Ext.decode(form.responseText);
            //                         if (res || res === "true") {
            //                             cmp.setVisible(true);
            //                         } else {
            //                             console.log("Metab2MeSH API down");
            //                         }
            //                     } catch (err) {
            //                         console.log("Metab2MeSH API down");
            //                         Ext.MessageBox.alert('Failed', 'Server error while getting results !');
            //                         return;
            //                     }
            //                 },
            //                 failure: function(form, action) {
            //                     if (myMask) myMask.hide();
            //                     var json = action.result;
            //                     Ext.MessageBox.alert('Failed', 'Server error : ' + json["message"])

            //                 }
            //             });

            //         }
            //     }
            // },
            // // listeners: {
            // //     added: {
            // //         fn: function() {
            // //             var cmp = this;
            // //             Ext.Ajax.request({
            // //                 url: 'resources/src/php/webservices/checkMetab2MeSH.php',
            // //                 timeout: 22000,
            // //                 success: function(form, action) {
            // //                     var res = null;
            // //
            // //                     try {
            // //                         res = Ext.decode(form.responseText);
            // //                         if (res || res === "true") {
            // //                             cmp.setVisible(true);
            // //                         } else {
            // //                             console.log("Metab2MeSH API down");
            // //                         }
            // //                     } catch (err) {
            // //                         console.log("Metab2MeSH API down");
            // //                         Ext.MessageBox.alert('Failed', 'Server error while getting results !');
            // //                         return;
            // //                     }
            // //                 },
            // //                 failure: function(form, action) {
            // //                     if (myMask) myMask.hide();
            // //                     var json = action.result;
            // //                     Ext.MessageBox.alert('Failed', 'Server error : ' + json["message"])
            // //
            // //                 }
            // //             });
            // //
            // //         }
            // //     }
            // // },
            // menu: {
            //     id: 'meSHmenuid',
            //     xtype: 'meSHMenu'
            // }
        }, {
            text: 'MetaboRank',
            iconCls: 'metaborank',
            id: "rankMenu",
            tooltip: "This tool only works by selecting the 3223 BioSource ",
            handler: function() {
                var storeMapInfo = Ext.getStore('S_MappingInfo');
                var tabPanel = Ext.getCmp('tabPanel');

                var ctrl = MetExplore.app.getController('C_GraphRank')
                ctrl.setSelectedCondition(undefined);

                var newTab = tabPanel.add({
                    title: 'MetaboRank',
                    iconCls: 'metaborank',
                    autoScroll: true,
                    closable: true,
                    items: [{
                        xtype: 'graphRankUI'
                    }],
                    listeners: {
                        afterrender: function(panel) {
                            var name = panel.query('textfield[name=analysis_title]')[0];
                            name.setValue('MetaboRank');
                            //console.log(name);
                        },
                        close: function(panel) {
                            //var namePanel= panel.title;
                            var idMap = panel.query('textfield[name=id]')[0].getRawValue();
                            var store = Ext.getStore('S_MappingInfo');
                            //console.log(idMap);
                            if (idMap != "") {
                                Ext.MessageBox.confirm('Close Mapping', 'Do you want to remove mapping', function(btn) {
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
                            //
                            //
                            //                              var rec= store.findRecord('title',namePanel);
                            //                              if (rec) {
                            //                                  //console.log(panel);
                            //                                  Ext.MessageBox.confirm('Close Mapping', 'Do you want to remove mapping', function(btn){
                            //                                      console.log(btn);
                            //                                      if(btn == 'yes')
                            //                                      {
                            // /*                                           var store= Ext.getStore('S_MappingInfo');
                            //                                          var rec= store.getById('M'+numero);
                            //                                          if (rec) {*/
                            //                                              var object= rec.get('object');
                            //                                              console.log(object);
                            //                                              var numero= rec.get('numero');
                            //                                              console.log(numero);
                            //                                              MetExplore.app.getController('C_BioSource').delMappingNum(object, numero);
                            //                                          //}
                            //
                            //                                      }
                            //                                  });
                            //                              }
                        }
                    }
                });


                newTab.show();
            }

        }

    ]

});