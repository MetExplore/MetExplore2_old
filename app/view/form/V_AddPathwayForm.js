/**
 * addPathwayForm
 */
Ext.define('MetExplore.view.form.V_AddPathwayForm', {	
	extend: 'MetExplore.view.form.V_AddGenericForm',

	requires:['MetExplore.view.form.V_SelectInsertReaction',
			'MetExplore.view.form.V_SelectPathway',
			'MetExplore.override.form.field.VTypes'],

	alias: 'widget.addPathwayForm',
	
	config: {
		initialValues: []
	},

	items:[{
		xtype		: 'fieldset',
		minWidth:950,
		layout:'auto',
		

		defaults: {
			bodyStyle: 'padding:5px'
		},
		defaultType:'textfield',
		title:'Create/update Pathway',
		items:[{ 
			fieldLabel:'Pathway Identifier*', 
            vtype:'dbIdentifier',
			name:'pthwId',
			colspan:2,
			width: 390,
			allowBlank:false 
		},{ 
			fieldLabel:'Name *', 
			name:'pthwname',
			allowBlank:false,
			colspan:3,
			width: 390
		},{
			xtype:'selectInsertReaction',
			bodyStyle : 'background:none',
			colspan:5

		},{
			xtype:'selectPathway',
			name:'superpthws',
			fieldLabel: 'Is part of ',
			colspan: 5,
			hidden:true
		}]
	}]
});