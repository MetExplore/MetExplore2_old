/**
 * 
 */

Ext.define('MetExplore.controller.C_gridBiblioLinks', {
	extend: 'Ext.app.Controller',
	
	requires: ['MetExplore.globals.Session'],
	
	init: function() {
		this.control({
			'gridBiblioLinks actioncolumn':{
				click:this.deleteBiblio
			}
		});
	},
	
	
	
	
	deleteBiblio:function(grid, cell, rowIndex) {
		
		
		var recBiblio=grid.getStore().getAt(rowIndex);
	
		var values={};

		values['PMID']=recBiblio.get('id');
		values['idbiosource']=recBiblio.get('idbs');
		

		var jsonModif= Ext.encode(values);
		

		Ext.Ajax.request({
			url:'resources/src/php/modifNetwork/deleteBiblio.php',
			params: {"functionParam":jsonModif},
			waitMsg: 'Saving Data, please wait...',			
			success: function(response, opts) {
				grid.getStore().removeAt(rowIndex);

				var gridB=Ext.getCmp('gridBioSource');

				Ext.getStore("S_BioSource").reload({
					scope:this,
					callback:function(records, operation, success){
                        console.log('reload Biosource');

                        Ext.getStore("S_MyBioSource").reload({
							scope:this,
							callback:function(records, operation, success){

								gridB.fireEvent("beforeactivate",gridB);
							}
						});
					}
				});

			}, 
			failure: function(response, opts) { 
				Ext.MessageBox.alert('Server-side failure with status code ' + response.status); 
			}

		});




	}
	
});