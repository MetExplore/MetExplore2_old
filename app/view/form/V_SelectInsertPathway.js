/**
 * selectInsertPathway
 */
Ext.define('MetExplore.view.form.V_SelectInsertPathway', {
	extend:'MetExplore.view.form.V_SelectInsertGeneric',
	
	alias:'widget.selectInsertPathway',
	
	requires:['MetExplore.view.form.V_SelectPathway'],
	
	items:[{
		  xtype:'selectPathway',
		  name:'pathway',
		  fieldLabel: 'Is part of '
	  },{
		  xtype:'button',
		  text:'Create New Pathway',
		  action:'newPathway'	        				  
	  }]
	
});