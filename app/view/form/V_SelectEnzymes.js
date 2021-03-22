/**
 * selectEnzymes
 */
Ext.define('MetExplore.view.form.V_SelectEnzymes', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.selectEnzymes',
	displayField: 'dbIdentifier',
	valueField: 'idInBio',
	store:"S_Enzyme",
	multiSelect: true,
	delimiter: ", ",
	width: 390,
	queryMode: 'local',
	editable:true,
	forceSelection:true,
	emptyText:'-- Select Enzymes --',
	margin:'0 0 5 0',
    labelWidth: 130,
	anyMatch : true
});