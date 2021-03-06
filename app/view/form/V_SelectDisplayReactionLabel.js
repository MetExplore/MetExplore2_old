/**
 * @author MC
 * To select the reaction label 
 */
Ext.define('MetExplore.view.form.V_SelectDisplayReactionLabel', {
        extend: 'Ext.form.ComboBox',
	alias: 'widget.selectDisplayReactionLabel',
		    fieldLabel: "Reaction label",
        displayField: 'name',
        valueField: 'value',
        queryMode: 'local',
        multiSelect:false,
        editable:false,
        margin:'5 5 5 5',
        margins:'0 0 0 0',
        width:'100%', 
        store: {
                fields: ['name','value'],
                data: [
                       {'name':'EC', 'value':'ec'},
                       {'name':'Database identifier', 'value':'dbIdentifier'},
                       {'name':'Name', 'value':'name'}
                       ]
        },
        emptyText:'-- Select Display Reaction Label --'
});