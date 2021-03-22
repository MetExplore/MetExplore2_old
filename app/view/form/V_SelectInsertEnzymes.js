/**
 * selectInsertEnzymes
 */
 Ext.define('MetExplore.view.form.V_SelectInsertEnzymes', {
 	extend : 'MetExplore.view.form.V_SelectInsertGeneric',

 	alias : 'widget.selectInsertEnzymes',

 	requires : ['MetExplore.view.form.V_SelectEnzymes'],


 	items : [{
 		xtype:"fieldset",
 		border:false,
	 	padding:0,
		margin:0, 		
 		items:[{
	 		xtype : 'selectEnzymes',
	 		name : 'enzymes',
	 		fieldLabel : 'Enzymatic Complex(es)'

	 	},{
	 		xtype : "button",
	 		text : "Report Table selection",
	 		action : "reportEnzymeSelection"
	 	},{
	 		xtype : 'button',
	 		text : 'Create New enzymatic Complex',
	 		action : 'newEnzyme'
	 	}]
 	}]
 });