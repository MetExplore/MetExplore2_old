/**
 * C_OpenLinkInDBWebSite
 * Open link in Database Website when user click to a link button
 * 
 */

Ext.define('MetExplore.controller.C_OpenLinkInDBWebSite', {
	extend : 'Ext.app.Controller',
	/**
	 * 
	 * @type Config
	 * description : declaration of the views and the stores. If not in config,
	 *              does not work properly...
	 * 
	 */
	config : {
		views : ['grid.V_gridReaction', 'grid.V_gridPathway', 'grid.GenesInReaction', 'grid.GenesInPathway', 
				 'grid.PathwaysInReaction', 'grid.ReactionsInPathway', 'grid.gridMetabolite', 'grid.gridGene']
	},

	requires: ['MetExplore.globals.Session','MetExplore.globals.Loaded'],
	/**
	 * init function Checks the changes on the bioSource selection
	 * 
	 */
	init : function() {

		this.control({
			'actioncolumn[action="openLinkInDB"]': {
				click: this.viewLinkInWebSite
			}
		});
	},
	
	viewLinkInWebSite: function(grid, cell, rowIndex)
	{
		window.open(grid.getStore().getAt(rowIndex).get('linkToDB'),'_blank');
	}
});