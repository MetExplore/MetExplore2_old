/**
 * @author MC
 * @description combobox to select type of condition
 */
/**
 * selectConditionType
 */
Ext.define('MetExplore.view.form.V_SelectConditionType', {
		extend: 'Ext.form.ComboBox',
		alias: 'widget.selectConditionType',
		store: {
            fields: ['name'],
            data : [
                {"name":"Continuous"},
                {"name":"Discrete"},
                {"name":"Binary"}
            ]
        },
        flex:1,
        displayField: 'name',
        valueField: 'name',
        queryMode: 'local',
        editable:false,
        emptyText:'-- Type of data --',
        margin:'5 5 5 5',
        anyMatch : true
    });