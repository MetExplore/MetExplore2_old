/**
 * addCompartmentForm
 */
Ext.define('MetExplore.view.form.V_AddCompartmentForm', {
	extend: 'MetExplore.view.form.V_AddGenericForm', 

	alias: 'widget.addCompartmentForm',

	requires:['MetExplore.override.form.field.VTypes'],

	items:[{xtype		: 'fieldset',
		layout:{
			type: 'table',
			columns: 5,
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
		title:'Create/update Compartment',
		items:[{
			fieldLabel:'Compartment Identifier *', 
            vtype:'dbIdentifier',
			name:'cmptId',
			colspan:2,
			allowBlank:false 
		},{ 
			fieldLabel:'Name *', 
			name:'name',
			colspan:1,
			allowBlank:false 
		},{
			xtype: 'numberfield',
			fieldLabel:'Spatial Dimensions', 
			name:'spatialDimensions',
			value: 3,
	        maxValue: 3,
	        minValue: 0,
			colspan:2,
			listeners:{
				change:function(field, newVal, oldVal){
					if(newVal===0){
						field.next('numberfield').setDisabled( true );
					}else{
						field.next('numberfield').setDisabled( false );
					}
				}
			}
		},{
			xtype: 'numberfield',
			fieldLabel:'Relative Size', 
			name:'size',
			value: 1,
	        minValue: 0,
			colspan:1			
		},{
			fieldLabel:'Units', //select UnitDef combo
			name:'units',
			colspan:2
		},{
			xtype: 'checkboxfield',
			boxLabel:'Constant Compartment size', 
			name:'constant',
			colspan:1,
			checked   : true,
			inputValue	: '1'
		},{
			xtype: 'checkboxfield',
			boxLabel: 'Default Compartment',
			name:'default',
			colspan:1,
			inputValue	: '1'
		},{
			fieldLabel:'Upper Compartment',
			name:'outCmp',
			xtype: 'selectCompartment',
			forceSelection: false,
			colspan:5
		}]
	}]
});