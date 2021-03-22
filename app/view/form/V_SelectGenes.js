/**
 * selectGenes
 */
Ext.define('MetExplore.view.form.V_SelectGenes', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.selectGenes',
	displayField: 'dbIdentifier',
	valueField: 'dbIdentifier',
	store:"S_Gene",
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