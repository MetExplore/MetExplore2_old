/**
 * @author MC
 * selectMapping
 */
Ext.define('MetExplore.view.form.V_SelectDisplayNodeName', {
        extend: 'Ext.form.ComboBox',
	alias: 'widget.selectDisplayNodeName',
		
        displayField: 'name',
        valueField: 'value',
        width: 150,
        queryMode: 'local',
        multiSelect:false,
        editable:false,
        flex:1,
        store: {
                fields: ['name','value'],
                data: [
                       // {'name':'Id', 'value':'id'},
                       {'name':'Database identifier', 'value':'dbIdentifier'},
                       {'name':'Name', 'value':'name'}
                       ]
        },
        emptyText:'-- Select Display Node Name --',
        margin:'5 5 5 5'
});