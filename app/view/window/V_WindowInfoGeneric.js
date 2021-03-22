/**
 * window Info gene
 */
Ext.define('MetExplore.view.window.V_WindowInfoGeneric', {

	extend : 'Ext.Window',
	alias : 'widget.windowInfoGeneric',

	height: 500,
	width: 400,
	layout: 'accordion',
	//constrainHeader : true,
	items : [],
	bbar :['->', { xtype: 'button', text: 'Close', action:'close'}]
	
});