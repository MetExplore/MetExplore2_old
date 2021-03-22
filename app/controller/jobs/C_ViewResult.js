/**
 * Controls the action column of the grid that list analyses Display a new panel
 * of results
 */
 Ext.define('MetExplore.controller.jobs.C_ViewResult', {
 	extend : 'Ext.app.Controller',

 	init : function() {
 		this.control({
 			'gridJobs' : {
 				viewresult : this.viewResult
 			}
 		});

 	},

	 /**
	  * viewResult
	  * @param record
	  * @param rowIndex
	  */
 	viewResult : function(record, rowIndex) {

 		var data = record.data;

 		var path = data.path;
 		
 		MetExplore.globals.Session.isSessionExpired(function(isExpired){
 			if(!isExpired){
 				if (path != "") {

 					MetExplore.globals.Jobs.displayResult(path, data.title, record);
 				} else {
 					MetExplore.globals.Utils.displayShortMessage(
 						"No result for now", null, 2000);
 				}
 			}
 		});



 	}

});
