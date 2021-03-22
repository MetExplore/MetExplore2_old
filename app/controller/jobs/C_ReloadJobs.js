Ext.define('MetExplore.controller.jobs.C_ReloadJobs', {
	extend : 'Ext.app.Controller',

	requires: ['MetExplore.globals.Session'],

	init : function() {
		this.control({
			'button[action=reloadJobs]' : {
				click : this.reload
			}
		});

	},

	/**
	 * reload
	 * @param button
	 */
	reload : function(button) {
		MetExplore.globals.Session.isSessionExpired(function(isExpired){
	        if(!isExpired){
				Ext.getStore("S_Analyses").reload();
			}
		});
	}
});