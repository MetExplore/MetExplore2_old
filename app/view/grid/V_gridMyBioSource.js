/**
 * gridMyBioSource
 */
Ext.define('MetExplore.view.grid.V_gridMyBioSource',{
	extend:'Ext.grid.Panel', 
	store: 'S_MyBioSource',
	alias: 'widget.gridMyBioSource',

	stateful: true,
	hideHeaders: true,
	columns: [{
		hidden : true,
		dataIndex: 'id'
	},{
		width    : 350,
		dataIndex: 'NomComplet'
	}]
});
