Ext.define('MetExplore.view.grid.V_gridAddReactionFromFile',{
	extend:'Ext.grid.Panel',
	alias: 'widget.gridAddReactionFromFile',
	//requires:[	'MetExplore.view.form.V_SelectField'],
	store : '',
	resizable:true,
	cls : 'grid-menu',
	resizeHandles: 'all',
	width: 800,
	plugins:[Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 2}) , 
	         	{ptype:'bufferedrenderer'}],
	         	
	autoScroll: true,
	columns: [{
        xtype: 'rownumberer',
        width: 50,
        sortable: false
    },{
		dataIndex: 'tab0',
		text : 'Col_A'
	},
	{
		dataIndex: 'tab1',
		text : 'Col_B'
	},
	{
		dataIndex: 'tab2',
		text : 'Col_C'
	},
	{
		dataIndex: 'tab3',
		text : 'Col_D'
	},
	{
		dataIndex: 'tab4',
		text : 'Col_E'
	},
	{
		dataIndex: 'tab5',
		text : 'Col_F'
	},
	{
		dataIndex: 'tab6',
		text : 'Col_G'
	},
	{
		dataIndex: 'tab7',
		text : 'Col_H'
	},
	{
		dataIndex: 'tab8',
		text : 'Col_I'
	},
	{
		dataIndex: 'tab9',
		text : 'Col_J'
	},
	{
		dataIndex: 'tab10',
		text : 'Col_K'
	},
	{
		dataIndex: 'tab11',
		text : 'Col_L'
	},
	{
		dataIndex: 'tab12',
		text : 'Col_M'
	},
	{
		dataIndex: 'tab13',
		text : 'Col_N'
	},
	{
		dataIndex: 'tab14',
		text : 'Col_O'
	},
	{
		dataIndex: 'tab15',
		text : 'Col_P'
	},
	{
		dataIndex: 'tab16',
		text : 'Col_Q'
	},
	{
		dataIndex: 'tab17',
		text : 'Col_R'
	},
	{
		dataIndex: 'tab18',
		text : 'Col_S'
	},
	{
		dataIndex: 'tab19',
		text : 'Col_T'
	},
	{
		dataIndex: 'tab20',
		text : 'Col_U'
	},
	{
		dataIndex: 'tab21',
		text : 'Col_V'
	},
	{
		dataIndex: 'tab22',
		text : 'Col_W'
	},
	{
		dataIndex: 'tab23',
		text : 'Col_X'
	},
	{
		dataIndex: 'tab24',
		text : 'Col_Y'
	},
	{
		dataIndex: 'tab25',
		text : 'Col_Z'
	}],
	
	initComponent: function() {
		var me = this;

		var theStore = Ext.create('MetExplore.store.S_DataTab');
		Ext.apply(me, {
			store: theStore
		}); 

		me.callParent();
	}
	
});

