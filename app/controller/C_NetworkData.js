/**
 * C_NetworkData
 */
Ext.define('MetExplore.controller.C_NetworkData', {
	extend: 'Ext.app.Controller',
	requires: ['MetExplore.globals.Session'],


	views: ['main.V_NetworkData'],
	
	init : function() {
		this.control({
//			'networkData' : {
//				beforetabchange:this.resetBiosourceInfo,
//			}
		});

	}
	
//	resetBiosourceInfo:function( tabPanel, newCard, oldCard, eOpts ){
//		
//		if (oldCard.getXType()=="gridBioSource"){
//			var idBS=MetExplore.globals.Session.idBioSource,
//			nameBS=MetExplore.globals.Session.nameBioSource,
//			publicBS=MetExplore.globals.Session.publicBioSource;
//			var access=MetExplore.globals.Session.access
//			var idProject=MetExplore.globals.Session.idProject;
//			
//			var ctrlgridBioSource= myApp.getController('C_gridBioSource');
//			ctrlgridBioSource.setBiosourceInfo(idBS, nameBS, publicBS, access, idProject);
//		}
//	}
	
});