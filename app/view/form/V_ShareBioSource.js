/**
 * formShareBioSource
 * 
 */

Ext.define('MetExplore.view.form.V_ShareBioSource', {
    extend: 'Ext.form.Panel',
    alias: 'widget.formShareBioSource',
    requires: ['MetExplore.view.grid.V_gridMyBioSource'],
    layout: 'hbox',
    items: [{
        xtype: 'treepanel',
        id: 'treeUsers',
        title: 'Users',
        //allowBlank : false,
        height: 300,
        width: 400,
        padding: '50 0 50 50',
        rootVisible: false,
        store: 'S_TreeUsers',
        //displayField: 'text',
        viewConfig: {
            listeners: {
                beforedrop: function(nodeEl, data) {

                    var record = data.records[0];
                    var copy = {}; //children: []};
                    copy['id'] = record.get('id');
                    copy['text'] = record.get('NomComplet');
                    copy['leaf'] = true;
                    data.records = [copy];
                    return true;
                },
                itemcontextmenu: function(tree, record, item, index, e, eOpts) {
                    e.preventDefault();
                    tree.CtxMenu = new Ext.menu.Menu({
                        items: [{
                            text: 'Delete',
                            handler: function() {
                                console.log('del');
                            }
                        }]
                    });
                    // positionner le menu au niveau de la souris
                    tree.CtxMenu.showAt(e.getXY());
                    return true;
                }
            },
            plugins: {
                ptype: 'treeviewdragdrop',
                //appendOnly: true,
                ddGroup: 'selDD',
                enableDrop: true

            }

        }
    }, {
        xtype: 'gridMyBioSource',
        title: 'My BioSources',
        height: 300,
        width: 400,
        padding: '50 0 50 50',
        /*rootVisible: false,
        store:'S_TreeMyBioSources',
        displayField: 'NomComplet',*/
        viewConfig: {
            plugins: {
                ptype: 'gridviewdragdrop',
                ddGroup: 'selDD',
                enableDrag: true,
                enableDrop: false
            },
            listeners: {
                checkchange: function(node, checked) {
                    console.log('check');
                },
                drag: function(node, checked) {
                    console.log('drag');
                },
                beforedrag: function(node, checked) {
                    console.log('beforedrag');
                }

            }

        }
    }],
    buttonAlign: 'left',
    buttons: [{
            text: 'Save'
            //action : 'share',
            // Activated only if the form is valid
            //formBind : true
        },
        {
            text: 'Cancel'
            //action : 'share',
            // Activated only if the form is valid
            //formBind : true
        }
    ]
});