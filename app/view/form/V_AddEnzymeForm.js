/**
 * addEnzymeForm
 */
Ext.define('MetExplore.view.form.V_AddEnzymeForm', {
	extend: 'MetExplore.view.form.V_AddGenericForm',
	
	requires:['MetExplore.view.form.V_SelectInsertProtein',
	          'MetExplore.view.form.V_SelectInsertCompartment',
	          'MetExplore.view.form.V_SelectInsertReaction',
	          'MetExplore.override.form.field.VTypes'],

	alias: 'widget.addEnzymeForm',

	config: {
		initialValues: []
	},
	
	items:[{xtype		: 'fieldset',
		layout:{
			type: 'table',
			columns: 4,
			tableAttrs: {
				style: {
					width: '100%'
				}
			}
		},
		defaults: {
			bodyStyle: 'padding:5px'
		},
		defaultType:'textfield',
		title:'Create/update Enzymatic Complex',
		items:[{
			fieldLabel:'Enzymatic Complex Identifier *', 
            vtype:'dbIdentifier',
			name:'enzId',
	        width: 390,
			colspan:2,
			allowBlank:false 
		},{ 
			fieldLabel:'Name *', 
			name:'name' ,
			allowBlank:false,
	        width: 390,
			colspan :2
		},{
			xtype:'selectInsertProtein',
			bodyStyle : 'background:none',
			colspan:2
		},{
			xtype:'selectInsertReaction',
			bodyStyle : 'background:none',
			colspan:2
		},{
			xtype:'selectInsertCompartment',
			bodyStyle : 'background:none',
			colspan:4
		}]
	}]
});