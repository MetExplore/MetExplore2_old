/**
 * @author MC
 * @description class to control contion selection panel
 * C_SelectMapping
 */
Ext.define('MetExplore.controller.C_SelectMapping', {
	extend: 'Ext.app.Controller',
/*	
	requires:['MetExplore.view.form.V_SelectMapping'],
	
	config : {
		stores : [ 'S_MappingInfo' ],
		views : [ 'view.form.V_SelectMapping']
	},
*/		
	init : function() {
		this.getStore('S_MappingInfo')
			.addListener('datachanged',
				function(store){
					var selectMapping = Ext.getCmp('selectMapping');
					// If the MappingInfo store is empty we disable the button else enable
					if(selectMapping!=undefined)
					{
						if(store.getCount()==0)
						{
							selectMapping.setDisabled(true);
						}
						else
						{	
							selectMapping.setDisabled(false);
						}
					}
					

				    selectMapping = Ext.getCmp('selectMappingVisu');
					// If the MappingInfo store is empty we disable the button else enable
					if(selectMapping!=undefined)
					{
						if(store.getCount()==0)
						{
							selectMapping.setDisabled(true);
						}
						else
						{	
							selectMapping.setDisabled(false);
						}
					}
				}
					
		, this);
	}
});