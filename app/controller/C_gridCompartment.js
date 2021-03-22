/**
 * C_gridProtein
 */
Ext.define('MetExplore.controller.C_gridCompartment', {
	extend: 'Ext.app.Controller',

	views: ['grid.V_gridCompartment'],
	stores: ['S_CompartmentInBioSource'],

	/*
	 * Definition des evenements
	 */	
	init: function() {
		this.getS_CompartmentInBioSourceStore().sort('name', 'ASC');
		this.getS_CompartmentInBioSourceStore().addListener('datachanged',this.UpdateTitle, this);
        this.getS_CompartmentInBioSourceStore().addListener('filterchange',this.UpdateTitle, this);
		this.control();

	},


	UpdateTitle:function(store){

		var visibleElt=store.getCount(),
			total=store.getTotalCount( );
        if (MetExplore.globals.Session.idBioSource == -1) total= 0;
		var grid=Ext.getCmp('gridCompartment');

		grid.setTitle('Compartments ('+visibleElt+'/'+total+')');
	}


});