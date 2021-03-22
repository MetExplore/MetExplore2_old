/**
 * selectInsertGenes
 */
Ext.define('MetExplore.view.form.V_SelectInsertGenes', {
	extend:'MetExplore.view.form.V_SelectInsertGeneric',
	
	alias:'widget.selectInsertGenes',
	
	requires:['MetExplore.view.form.V_SelectGenes'],
	
	items:[{
		fieldLabel:'Gene(s) coding for this (Multiple Select)',
		name:'genes',
		xtype: 'selectGenes',
		width: 500,
		displayField:'name',
		valueField: 'idInBio',
		listConfig: {
			getInnerTpl: function() {
				return '{name} ( {dbIdentifier} )';
			}
		},
		allowBlank:true
	},{
		xtype:'button',
		text:'Create New Gene',
		action:'newGene'
	}]
	
});