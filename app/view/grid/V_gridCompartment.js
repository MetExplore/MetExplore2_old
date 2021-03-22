/**
 * gridCompartment
 */

Ext.define('MetExplore.view.grid.V_gridCompartment', {
    extend: 'MetExplore.view.grid.V_GenericGrid',
    alias: 'widget.gridCompartment',
    store: 'S_CompartmentInBioSource',
    config: {
        name: 'gridCompartment',
        typeObject: 'Compartment'
    },

    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        }),
        {
            ptype: 'bufferedrenderer',
            pluginId: 'buffergridCompartment'
        }
    ],


    columns: [{
        xtype: 'rownumberer',
        width: 50,
        sortable: false
    }, {
        text: 'Name',
        flex: 3,
        sortable: true,
        // filter: {
        //     type: 'string'
        // },
        dataIndex: 'name'
    }, {
        text: 'Identifier',
        flex: 2,
        sortable: true,
        // filter: {
        //     type: 'string'
        // },
        dataIndex: 'identifier'
    }],

    tbar: {
        id: 'tbarCompartment',
        // hidden: true,
        items: [{
                xtype: 'button',
                text: 'Add',
                action: 'add',
                tooltip: 'Add a new Compartment to the network',
                type: 'edition',
                iconCls: 'add'
            }, {
                xtype: 'button',
                text: 'Edit',
                action: 'edit',
                tooltip: 'Edit selected Compartments',
                type: 'edition',
                iconCls: 'reply'
            }, {
                xtype: 'button',
                text: 'Delete',
                action: 'del',
                tooltip: 'Delete selected Compartments',
                type: 'edition',
                iconCls: 'del'
            }, {
                xtype: 'button',
                hidden: true,
                text: 'tmp',
                tooltip: 'Delete selected Compartments',
                handler: function(btn) {
                    btn.up('gridCompartment').fireEvent('modifyeditability', btn.up('gridCompartment'), false);
                },
                iconCls: 'del'
            }, '->', {
                iconCls: 'help',
                tooltip: 'Documentation for compartments grid',
                handler: function() {
                    MetExplore.app.getController('C_HelpRedirection').goTo('browse.php#compartment_grid');
                }
            }
            //	        	 ,'-',
            //	        	 '  ',
            //	        	 {
            //	        	 xtype:'button',
            //	        	 text: 'Commit Changes',
            //	        	 action:'CompartmentChange',
            //	        	 tooltip:'Save Modified Entries',
            //	        	 iconCls:'save'
            //	        	 },{
            //	        	 xtype:'button',
            //	        	 text: 'Multiple affectation',
            //	        	 action:'CompartmentSetting',
            //	        	 tooltip:'Setting same value for ALL selected Compartments',
            //	        	 iconCls:'settings'
            //	        	 }
        ]
    }

});