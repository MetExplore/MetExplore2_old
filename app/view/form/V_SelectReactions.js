/**
 * selectReactions
 */
Ext.define('MetExplore.view.form.V_SelectReactions', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.selectReactions',
	displayField: 'dbIdentifier',
	valueField: 'dbIdentifier',
	multiSelect: true,
	delimiter: ",",
	width: 200,
	queryMode: 'local',
	editable:true,
	forceSelection:true,
	emptyText:'',
	margin:'0 0 5 0',
	anyMatch : true
	
});