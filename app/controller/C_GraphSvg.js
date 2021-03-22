/**
 * @author MC
 * @description : Draw the svg
 */
Ext.define('MetExplore.controller.C_GraphSvg', {
	extend : 'Ext.app.Controller',
	requires : [ 'MetExplore.globals.Session' ],
	config : {
		models : [ 'NetworkVizSession', 'NetworkData' ],
		stores : [ 'S_Cart', 'S_NetworkVizSession',
				'S_Metabolite', 'S_Reaction', 'S_NetworkData' ],
		views : [ 'main.V_GraphPanel']
	},

	/*****************************************************
	* Initialization of listeners
    * @param {} panel : panel to init
	*/
	delayedInitialisation : function(panel) {
		this.control({
			panel :{
	        	// Handler which permit to put legend text 'MetExploreViz' and network in good position
				resize : function(){
					var session = Ext.getStore('S_NetworkVizSession').getById('viz');
			    		// if visualisation is actived we add item to menu
			    		if(session.isActive()){
						
							metExploreD3.GraphPanel.resizePanels(panel);
						}
					}
			}
		});	
		metExploreD3.GraphNetwork.delayedInitialisation(panel);
	}
});
