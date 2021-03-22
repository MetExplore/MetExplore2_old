/**
 * @author MC
 * @description combobox to select condition in mapping
 */
/**
 * selectCondition
 */
Ext.define('MetExplore.view.form.V_SelectCondition', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.selectCondition',
	store: 'S_Condition',
	displayField: 'condName',
	valueField: 'condName',
	queryMode: 'local',
	editable:false,
	emptyText:'-- Select a condition --',
	margin:'5 5 5 5',
	anyMatch : true
});