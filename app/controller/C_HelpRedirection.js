Ext.define('MetExplore.controller.C_HelpRedirection', {
    extend: 'Ext.app.Controller',

    goTo: function(feature) {
        var urlDoc = 'https://metexplore.toulouse.inra.fr/metexplore-doc/';
        window.open(urlDoc + '/' + feature, "_blank");
    },
    addHelpsForJavaApplications: function() {
        var me = this;

        var importmenu = Ext.getCmp("importmenuid");
        if (importmenu != undefined) {
            var importHelp = Ext.create('Ext.menu.Item', {
                text: 'Help',
                iconCls: 'help',
                tooltip: 'Documentation for import',

                handler: function() {
                    me.goTo('io.php#import');
                }
            });
            importmenu.add(importHelp);

        }

        var fluxmenu = Ext.getCmp("fluxmenuid");
        if (fluxmenu != undefined) {
            var fluxHelp = Ext.create('Ext.menu.Item', {
                text: 'Help',
                tooltip: 'Documentation for flux',
                iconCls: 'help',

                handler: function() {
                    me.goTo('flux.php');
                }
            });
            fluxmenu.add(fluxHelp);

        }

        var exportmenu = Ext.getCmp("exportmenuid");
        if (exportmenu != undefined) {
            var exportHelp = Ext.create('Ext.menu.Item', {
                text: 'Help',
                iconCls: 'help',
                tooltip: 'Documentation for export',

                handler: function() {
                    me.goTo('io.php#export');
                }
            });
            exportmenu.add(exportHelp);
        }
    }
});