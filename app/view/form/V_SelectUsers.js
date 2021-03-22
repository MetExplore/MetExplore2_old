Ext.define('MetExplore.view.form.V_SelectUsers', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.selectUsers',

	displayField: 'email',
	valueField: 'id',
	width: 340,
	id :'selUsers',
	store: 'S_Users',
	queryMode: 'local',
	forceSelection:true,
	emptyText:'-- Select Users --',
	anyMatch : true,
	multiSelect: true,
	delimiter: ","
});