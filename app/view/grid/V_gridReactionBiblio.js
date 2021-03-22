/**
 * gridReactionBiblio
 */
Ext.define('MetExplore.view.grid.V_gridReactionBiblio',{

	extend : 'Ext.grid.Panel',
	overflowX: 'hidden',
	//minWidth:930,

	requires:['MetExplore.view.form.V_AddBiblioForm'],
	alias : 'widget.gridReactionBiblio',

	dockedItems: [{
		xtype: 'addBiblioForm',
		dock: 'top',
		weight: 110 
	}],

	columns:[{
		text:'PMID',
		width:100,
		dataIndex:'pubmedid'
	},{
		text: 'Title',
		//flex: 2,
        width:300,
		dataIndex: 'title'
	},{
		text: 'Authors',
		//flex: 2,
        width:200,
		dataIndex: 'authors'
	},{
		text: 'Journal',
		//flex: 2,
        width:200,
		dataIndex: 'Journal'
	},{
		text: 'Year',
		width:100,
		dataIndex: 'Year'
	},{
		xtype: 'actioncolumn',
		//flex: 2,
		//minWidth: 225,
		iconCls: 'del',
		handler :function(grid, rowIndex, colIndex) {
			grid.getStore().removeAt(rowIndex);
		}
	}],

	initComponent: function() {
		var me = this;

		var theStore = Ext.create('MetExplore.store.S_ReactionBiblio');
		Ext.apply(me, {
			store: theStore
		}); 

		me.callParent();
	}
});