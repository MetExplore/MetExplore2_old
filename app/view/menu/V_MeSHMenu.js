/**
 * MeSH menu
 * @description create meSH tab
 * 
 */

Ext.define('MetExplore.view.menu.V_MeSHMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.meSHMenu',
    disabled: false,

    //		requires: ['MetExplore.view.form.V_Map'],		

    items: [{
            text: 'From MeSH',
            iconCls: 'meshLogo',
            id: "meshMenu",
            handler: function() {

                var tabPanel = Ext.getCmp('tabPanel');

                var newTab = tabPanel.add({
                    title: 'MeSH mining from MeSH',
                    iconCls: 'meshLogo',
                    autoScroll: true,
                    closable: true,
                    items: [{
                        xtype: 'meshUI'
                    }],
                    listeners: {
                        afterrender: function(panel) {
                            var name = panel.query('textfield[name=analysis_title]')[0];
                            name.setValue('MeSH Mining from MeSH');
                            //console.log(name);
                        },
                        close: function(panel) {
                            //var namePanel= panel.title;
                            var idMap = panel.query('textfield[name=id]')[0].getRawValue();
                            var store = Ext.getStore('S_MappingInfo');
                            //console.log(idMap);
                            if (idMap != "") {
                                Ext.MessageBox.confirm('Close MeSH', 'Do you want to remove meSH', function(btn) {
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
            }
        }, {
            text: 'From metabolites',
            iconCls: 'meshLogo',
            id: "metab2meshMenu",
            handler: function() {
                var storeMapInfo = Ext.getStore('S_MappingInfo');

                var tabPanel = Ext.getCmp('tabPanel');

                var newTab = tabPanel.add({
                    title: 'MeSH mining from metabolites',
                    iconCls: 'meshLogo',
                    autoScroll: true,
                    closable: true,
                    items: [{
                        xtype: 'metab2meshUI'
                    }],
                    listeners: {
                        afterrender: function(panel) {
                            var name = panel.query('textfield[name=analysis_title]')[0];
                            name.setValue('MeSH mining from metabolites');
                            //console.log(name);
                        },
                        close: function(panel) {
                            //var namePanel= panel.title;
                            var idMap = panel.query('textfield[name=id]')[0].getRawValue();
                            var store = Ext.getStore('S_MappingInfo');
                            //console.log(idMap);
                            if (idMap != "") {
                                Ext.MessageBox.confirm('Close MeSH', 'Do you want to remove meSH', function(btn) {
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
            }
        }
        // ,{
        //     text: 'Help',
        //     iconCls: 'help',
        //     tooltip: 'Documentation for meSH',
        //     handler: function() {
        //         MetExplore.app.getController('C_HelpRedirection').goTo('meSH.php');
        //     }
        // }
    ]

});