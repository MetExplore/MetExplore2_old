/**
 * C_SelectElement
 */
Ext.define('MetExplore.controller.C_SelectElement', {
	extend: 'Ext.app.Controller',
/*	
	requires:['MetExplore.view.form.V_AddGenericForm',
	          'MetExplore.view.form.V_AddCompartmentForm',
	          'MetExplore.view.form.V_AddPathwayForm',
	          'MetExplore.view.form.V_AddReactionForm',
	          'MetExplore.view.form.V_AddMetaboliteForm',
	          'MetExplore.view.form.V_AddEnzymeForm',
	          'MetExplore.view.form.V_AddProteinForm',
	          'MetExplore.view.form.V_AddGeneForm'],
	
	config: {
		views: ['form.V_SelectElement']
	},
*/
	init : function() {

		this.control({
			'selectElement' : {
				select : this.addElementform
				}
		});
	},
	
	addElementform: function(combo, records, eOpts) {
		
		var elementform='add'+records[0].get('id')+'Form';
		
//		console.log(elementform)
		
		var panel=combo.up("panel");
		if (panel.down('addGenericForm')){
			panel.down('addGenericForm').close();
		}
		
		panel.add({
			xtype:elementform,
			layout:'fit'
		});
		
		
	}
	
});