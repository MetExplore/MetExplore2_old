/**
 * MetExplore.globals.History
 */
Ext.define('MetExplore.globals.History', {
			singleton : true,
			
			requires:["MetExplore.globals.Session"],

			/**
			 * Update all the grid histories
			 */
			updateAllHistories : function() {
				
				var my = this;

				var a_gridHistories = Ext.ComponentQuery.query("gridHistory");

				Ext.each(a_gridHistories, function(gridHistory) {
							my.updateHistory(gridHistory);

						});

			},
			
			/**
			 * Update a grid History
			 * @param {} gridHistory
			 */
			updateHistory : function(gridHistory) {
				var from = MetExplore.globals.Utils.formatDate(gridHistory.down('datefield[name="historyFrom"]').value);
				var to = MetExplore.globals.Utils.formatDate(gridHistory.down('datefield[name="historyTo"]').value);
				
				var idProject = -1;
				
				if(gridHistory.getType()=="project")
				{
					idProject = MetExplore.globals.Session.idProject;
				}
				
				idUser = -1;
				if (gridHistory.down('button[action="historyPersonal"]').pressed) {
					idUser = MetExplore.globals.Session.idUser;
				}
				
				gridHistory.getStore().updateHistory(from, to, idProject, idUser);
				
			}
			

		});
