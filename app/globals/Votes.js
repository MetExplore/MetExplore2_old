/**
 * MetExplore.globals.Votes
 */
Ext.define('MetExplore.globals.Votes', {
	singleton : true,
	
	requires:['Ext.String'],
	
	/**
	 * Add the summarize votes column to the grid
	 * @param {} button //The button of the grid clicked
	 * @param {} typeObj //type of Object : reaction, pathway, ...
	 */
	summarizeVotes: function(button, typeObj){
		
		var typeObjMaj = typeObj[0].toUpperCase() + typeObj.slice(1);
		
		var grid = button.up('grid' + typeObjMaj);
		grid.setLoading(true);
		var storeObject = Ext.getStore('S_' + typeObjMaj);
		var ids = [];
		
		storeObject.each(function(record) {
			ids.push(record.get('id'));
		});
		
		Ext.Ajax.request({
			url : 'resources/src/php/dataNetwork/getVotesForObjects.php',
			params: {
				objects: Ext.encode(ids),
				typeObj: typeObj
			},
			failure : function(response, opts) {
				Ext.MessageBox
						.alert('Ajax error',
								'get user votes failed: Ajax error!');
				var win = this.up('window');
				if (win) {
					win.close();
				}
			},
			success : function(response, opts) {
				var repJson = null;
				
				try
				{
					repJson=Ext.decode(response.responseText);
				}
				catch (exception) {
					Ext.MessageBox
						.alert('Ajax error',
								'get user votes failed: JSON incorrect!');
					var win = this.up('window');
					if (win) {
						win.close();
					}
				}
	
				if (repJson != null && repJson['success'])
				{
					data = repJson["data"];
					//Set new vote values on store:
					storeObject.each(function(record) {
						record.set('votes', data[record.get('id')]["votes"]);
						record.set('hasVote', data[record.get('id')]["hasVote"] ? "yes" : "no");
					});
					
					//Column has vote:
					var col = Ext.create('Ext.grid.column.Column', {
						header : 'Did you vote?',
						hidden : true,
						dataIndex : 'hasVote',
						filterable : true,
						sortable : true,
						renderer : function(value, metadata, record) {
							if (value == "yes") { 
								return '<div class="hasVote">Yes</div>';
							}
							else {
								return '<div class="hasNoVote">No</div>';
							}
						}
					});
					grid.addCol(col, 'hasVote');
					var index = grid.indexCol('hasVote');
					var cols = grid.headerCt.getGridColumns()[grid.indexCol('hasVote')].setVisible(true);
					
					//Column votes summary:
					//Define the new column
					var col = Ext.create('Ext.grid.column.Column', {
						header : 'Votes summary',
						hidden : true,
						dataIndex : 'votes',
						filterable : true,
						sortable : true,
						renderer : function(value, metadata, record) {
							metadata.style = 'cursor: pointer;';
							var noInP = parseInt(value[0]);
							var inPwE = parseInt(value[1]);
							var inP = parseInt(value[2]);
							var total = noInP + inPwE + inP;
							var pNoInP = 0;
							var pInPwE = 0;
							var pInP = 0;
							var bar = '';
							if (total != 0) {
								pInP = (inP / total) * 100;
								if (pInP > 0) {
									bar += '<div class="voteItem votesYes" style="width: ' + pInP + '%">' + inP + '</div>';
								}
								pInPwE = (inPwE / total) * 100;
								if (pInPwE > 0) {
									bar += '<div class="voteItem votesYesNo" style="width:' + pInPwE + '%">' + inPwE + '</div>';
								}
								pNoInP = (noInP / total) * 100;
								if (pNoInP > 0) {
									bar += '<div class="voteItem votesNo" style="width:' + pNoInP + '%">' + noInP + '</div>';
								}
							}
							if (bar != '') //If there is at least one vote
								return bar;
							else { //There is no votes
								return '<center class="voteItem">No votes</center>';
							}
							
						},
						doSort: function(state) { //Redefine sort by comparing sum of items instead of number of items
			                var ds = this.up('grid').getStore();
			                var field = this.getSortParam();
			                ds.sort({
			                    property: field,
			                    direction: state,
			                    sorterFn: function(v1, v2){
			                        v1 = v1.get(field);
			                        if (v1 != "") {
				                        v1 = v1.reduce(function(a, b){return a+b;}); //sum of items inside v1
				                        v2 = v2.get(field);
				                        if (v2 != "") {
					                        v2 = v2.reduce(function(a, b){return a+b;}); //sum of items inside v2
					                        return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
				                        }
			                        }
			                        //else:
			                        return 0;
			                    }
			                });
			            }
					}); 
					grid.addCol(col, 'votes');
					grid.headerCt.getGridColumns()[grid.indexCol('votes')].setVisible(true);
					
					grid.setLoading(false);
				}
				else {
					Ext.MessageBox
						.alert(
								'get user votes failed',
								repJson['message']);
				}

			},
			scope : this
		});
	}
});