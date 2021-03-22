/**
 * selectInsertCompartment
 */
Ext.define('MetExplore.view.form.V_SelectInsertCompartment', {
	extend:'MetExplore.view.form.V_SelectInsertGeneric',
	
	alias:'widget.selectInsertCompartment',
	
	requires:['MetExplore.view.form.V_SelectCompartment'],
	
	items:[{
		fieldLabel:'Compartment *',
		name:'idCmpInBS',
		xtype: 'selectCompartment',
		allowBlank:false,
		listConfig: {
			getInnerTpl: function() {
				return '{identifier} ( {name} )';
			}
		}
	},{
		xtype:'button',
		text:'Create New Compartment',
		action:'newCompartment'
	}]
	
});