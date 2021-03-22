/**
 * addGeneForm
 */
Ext.define('MetExplore.view.form.V_AddGeneForm', {
	extend: 'MetExplore.view.form.V_AddGenericForm',

	requires:['MetExplore.view.form.V_SelectInsertProtein','MetExplore.override.form.field.VTypes'],

	alias: 'widget.addGeneForm',

	items:[{
		xtype		: 'fieldset',
		layout:{
			type: 'table',
			columns: 2,
			tableAttrs: {
				style: {
					width: '100%'
				}
			}
		},
		defaults: {
			// applied to each contained panel
			bodyStyle: 'padding:5px'
		},
		defaultType:'textfield',
		title:'Create/update Gene',
		items:[{
			fieldLabel:'Gene Identifier *',
            vtype:'dbIdentifier', 
			name:'geneId',
			width: 400,
			allowBlank:false 
		},{ 
			fieldLabel:'Name *', 
			name:'name',
			allowBlank:false,
			width: 400
		},{
			xtype:'selectInsertProtein',
			bodyStyle : 'background:none',
			colspan:2
		}]
	}]

});