/**
 * C_HideColumnsInWindowIndo
 * Controls hide of columns of grids within any windowInfo.
 */
Ext.define('MetExplore.controller.windowInfo.C_HideColumnInWindowInfo',{
	extend : 'Ext.app.Controller',

	config : {
		views : ['panel.V_panelVotes']
	},
	
	init : function() {
		this.control({
			'gridReactionsInPathway':{
				viewready: this.hideColumn
			},
			'gridPathwaysInReaction':{
				viewready: this.hideColumn
			},
			'gridGenesInReaction':{
				viewready: this.hideColumn
			},
			'gridGenesInPathway':{
				viewready: this.hideColumn
			}
		});

	},
	
	hideColumn:function(grid){
		
		var typeBioSource= MetExplore.globals.Session.typeDB;

		var index = grid.indexCol('linkToDB');
		if (index != -1)
		{
			if (typeBioSource == "TrypanoCyc" || typeBioSource == "biocyc"){
				grid.columns[index].setVisible(true);
			}
			else
			{
				grid.columns[index].setVisible(false);
			}
		}
	}
	
});