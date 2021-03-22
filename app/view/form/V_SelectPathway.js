/**
 * selectPathway
 */
Ext.define('MetExplore.view.form.V_SelectPathway', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.selectPathway',

	displayField: 'name',
	valueField: 'id',
	width: 390,
	store: 'S_Pathway',
	queryMode: 'local',
	multiSelect: true,
	forceSelection: true,
	emptyText:'-- Select Pathway Name--',
	listConfig: {
		getInnerTpl: function() {
			return '<b>Name: {name}</b></br>&emsp;<em>Id: {dbIdentifier}</em>';
		}
	}
});