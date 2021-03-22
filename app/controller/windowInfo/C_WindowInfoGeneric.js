/**
 * C_windowInfoPathway
 * Controls windowInfoPathway events.
 */
Ext.define('MetExplore.controller.windowInfo.C_WindowInfoGeneric',{
	extend : 'Ext.app.Controller',

	config : {
		views : ['window.V_WindowInfoGeneric']
	},
		
	init : function() {
		this.control({
			'windowInfoGeneric button[action=close]':{
				click:this.closeWin
			}
		});

	},
	
	/**
	 * Close the windowInfo grid
	 * @param {} button: button clicked
	 */
	closeWin : function(button) { 
		var win    = button.up('window');
		win.close();
	}
	
});