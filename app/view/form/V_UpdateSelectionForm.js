/**
 * @author MC
 * @description 
 */
Ext.define('MetExplore.view.form.V_UpdateSelectionForm', {
	extend: 'Ext.Panel',  
	alias: 'widget.updateSelectionForm',
	id:'updateSelectionForm',

	region:'north',
	height: 200,
	width:'100%', 
	margins:'0 0 0 0',
	split:true,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	animation: true
});