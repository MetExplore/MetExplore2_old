/**
 * selectProteins
 */
Ext.define('MetExplore.view.form.V_SelectProteins', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.selectProteins',
	displayField: 'dbIdentifier',
	valueField: 'idInBio',
	store:"S_Protein",
	multiSelect: true,
	delimiter: ", ",
	width: 390,
	queryMode: 'local',
	editable:true,
	forceSelection:true,
	emptyText:'-- Select Gene Product --',
	margin:'0 0 5 0',
	anyMatch : true
});