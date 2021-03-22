/**
 * Launch cytoscape
 */
Ext.define('MetExplore.view.window.V_CytoscapeLaunchWindow', {

extend : 'Ext.Window',
	alias : 'widget.CytoscapeLaunchWindow',
	width : 500,
	closable : true,
	constrainHeader : true,
	height : 400,
	items : [],
	
	constructor : function(params) {

		config = this.config || {};
		
		var items = [{xtype:'panel', html:'launchCytocape'}];
		
		config.items = items;
		
		
		this.callParent([config]);
		
		}

});
