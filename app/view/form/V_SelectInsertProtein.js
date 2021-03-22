/**
 * selectInsertProtein
 */
Ext.define('MetExplore.view.form.V_SelectInsertProtein', {
	extend:'MetExplore.view.form.V_SelectInsertGeneric',
	
	alias:'widget.selectInsertProtein',
	
	requires:['MetExplore.view.form.V_SelectProteins'],
	
	items:[{
		fieldLabel:'Gene Product(s)',
		name:'prots',
		xtype: 'selectProteins',
		displayField:'name',
		listConfig: {
			getInnerTpl: function() {
				return '{name} ( {dbIdentifier} )';
			}
		},
		allowBlank:true
	
	},{
		xtype:'button',
		text:'Create New Gene Product',
		action:'newProtein'
	}]
	
});