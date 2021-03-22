/**
 * addProteinForm
 */
Ext.define('MetExplore.view.form.V_AddProteinForm', {
	extend: 'MetExplore.view.form.V_AddGenericForm', 

	requires:['MetExplore.view.form.V_SelectInsertCompartment',
	          'MetExplore.view.form.V_SelectInsertGenes',
	          'MetExplore.view.form.V_SelectInsertEnzymes',
	          'MetExplore.override.form.field.VTypes'],
	
	alias: 'widget.addProteinForm',
	
	config: {
		initialValues: []
	},

	items:[{
		xtype		: 'fieldset',
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
		title:'Create/update Gene Product',
		items:[{
			fieldLabel:'Gene Product Identifier *',  
            vtype:'dbIdentifier',
			name:'protId',
			colspan:2,
			allowBlank:false 
		},{ 
			fieldLabel:'Name *', 
			name:'name',
			colspan:2,
			allowBlank:false
		},{
			xtype:'selectInsertGenes',
			bodyStyle : 'background:none',
			colspan:2
		},{
			xtype:'selectInsertCompartment',
			bodyStyle : 'background:none',
			colspan:2
		},{
			xtype:'selectInsertEnzymes',
			bodyStyle : 'background:none',
			colspan:2
			
		}]
	}]
});