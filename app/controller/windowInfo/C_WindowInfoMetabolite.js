/**
 * C_windowInfoMetabolite
 */
Ext.define('MetExplore.controller.windowInfo.C_WindowInfoMetabolite', {
    extend: 'Ext.app.Controller',

    config: {
        views: ['window.V_WindowInfoMetabolite',
            'view.grid.V_gridMetaboliteIds'
        ]
    },
    init: function() {
        this.control({
            'windowInfoMetabolite': {
                beforeshow: this.getImage
            }
        });

    },


    getImage: function(window) {
        //do stuff
    },

    updateLayout: function(panel) {

    },

    getGif: function(grid) {

        var storeMetaboIDs = grid.getStore();

        var panel = grid.up('panel');
        var imgPanel = panel.down('panel');

        if (storeMetaboIDs.findRecord('dbname', 'kegg.compound')) {
            var rec = storeMetaboIDs.findRecord('dbname', 'kegg.compound');
            var id = rec.get('dbid').split('<br/>');
            imgPanel.add(Ext.create('Ext.Img', {
                src: 'http://www.genome.jp/Fig/compound/' + id[0] + '.gif',
                shrinkWrap: true,
                layout: {
                    type: 'vbox',
                    pack: 'start',
                    align: 'stretch'
                }
            }));
            //imgPanel.on('enable', function(){this.doLayout()},panel,{delay: 500});
            //imgPanel.setDisabled(false);
            Ext.callback(function() {
                panel.doLayout()
            }, panel.scope);
        } else if (storeMetaboIDs.findRecord('dbname', 'hmdb')) {
            var rec = storeMetaboIDs.findRecord('dbname', 'hmdb');
            var id = rec.get('dbid').split('<br/>');
            imgPanel.add(Ext.create('Ext.Img', {
                src: 'http://structures.wishartlab.com/molecules/' + id[0] + '/image.png',
                mode: '',
                width: '50%',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                }
            }));
            //imgPanel.on('enable', function(){this.doLayout()},panel,{delay: 500});
            //imgPanel.setDisabled(false)
            Ext.callback(function() {
                panel.doLayout()
            }, panel.scope);
        }


    }
});