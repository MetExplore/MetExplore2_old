/**
 * @author FV
 * selectMapping
 */
Ext.define('MetExplore.view.form.V_SelectMapping', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.selectMapping',
		
        displayField: 'title',
        valueField: 'id',
        width: 150,
        queryMode: 'local',
        multiSelect:false,
        store: 'S_MappingInfo',
        emptyText:'-- Select Mapping --',
        margin:'5 5 5 5'
});