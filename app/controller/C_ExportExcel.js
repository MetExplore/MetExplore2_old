function downloadDataUrlFromJavascript(filename, dataUrl) {

    // Construct the a element
    var link = document.createElement("a");
    link.download = filename;
    link.target = "_blank";

    // Construct the uri
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();

    // Cleanup the DOM
    document.body.removeChild(link);
    delete link;
}

/**
 * C_ExportExcel
 */
Ext.define('MetExplore.controller.C_ExportExcel', {
	extend: 'Ext.app.Controller',


	views: ['menu.V_ExportMenu'],
	
	init : function() {
		this.control({
					'exportMenu [action=exportNetworkExcel]' : {
						click : this.exportNetworkExcel
					}
				});

	},
	
	/**
	 * Export to excel menu clicked
	 * @param {} button
	 */
	exportNetworkExcel: function(button) {
		
		//Show wait message:
		MetExplore.globals.Utils.displayShortMessage("Processing... download will begin in a few moments...", Ext.ComponentQuery.query("mainPanel")[0], 4000);
		
		//Get all tab panels:
		var panels = Ext.ComponentQuery.query('networkData')[0].items.items;
		var sheets = []; //Sheets in excel file
		for (var it = 0; it < panels.length; it++) { //for each panel (1 panel = 1 sheet in Excel file)
			var grid = panels[it];
			if (grid.isXType('grid') && !grid.isXType('gridBioSource')) { //If the panel is a grid
				//Get data from panel:
				var title = grid.title;
				var store = grid.getStore();
				var columns = []; //List of columns (dataIndex)
				var colNames = []; //List of columns name
				var colIndexForName = {}; //Relation between name and index (dataIndex)
				var gridCols = grid.getView().getGridColumns(); //Get columns in the displayed order
				var data = {}; //Contains all data of the sheet (all values of all columns)
				for (var nb = 0; nb < gridCols.length; nb++) { //Fill list of columns name/dataIndex and prepare data hash to receive data
					var col = gridCols[nb];
					if (!col.isXType('actioncolumn') && col.dataIndex != undefined && col.dataIndex != "" && !col.isHidden()) { //Ignore actioncolumns or columns without dataIndex or hidden columns
						if (col.ownerCt.text) {
							// colonne groupée enlever le lien info
							var colTitle= col.ownerCt.text;

							// var i= colTitle.indexOf("&nbsp;&nbsp;<a href");
							// if (i>0) {
							// 	colTitle= colTitle.substring(0,i);
							// }
							// var i= colTitle.indexOf("&nbsp;&nbsp;<img");
							// if (i>0) {
							// 	colTitle= colTitle.substring(0,i);
							// }
							//reg=new RegExp("<.[^<>]*>", "gi" );
							colTitle= colTitle.replace(/<[^>]+>/g,"");
							colTitle= colTitle.replace(/&nbsp;/g,"");
							//console.log(colTitle);
							columns.push(colTitle + " > " + col.dataIndex);
							data[colTitle + " > " + col.dataIndex] = [];
							var colname = colTitle + " > " + col.text;
							colIndexForName[colname] = colTitle
								+ " > " + col.dataIndex;
						}
						else {
							columns.push(col.dataIndex);
							data[col.dataIndex] = [];
							var colname = col.text;
							colIndexForName[colname] = col.dataIndex;
						}
						colNames.push(colname);
					}
				}
				store.each(function(rec) { //Fill data columns with data
					for (var nb = 0; nb < columns.length; nb++) {
						var col = columns[nb];
						var colId = col.indexOf(" > ") == -1 ? col : col.split(" > ")[1];
						var value = rec.get(colId);
						if (typeof(value) == "boolean") {
							if (value)
								value = "true";
							else
								value = "false";
						}
						//console.log(value);
						data[col].push(value);
					}
				});
				//Set sheet informations:
				//console.log('colNames',colNames);
				var sheet = {};
				sheet["title"] = grid.title;
				sheet["data"] = data;
				sheet["columns"] = colNames;
				sheet["colIndexForName"] = colIndexForName;
				sheets.push(sheet);
			}
		}
			
		//Now, send the data to the php to process it and make the Excel file:
		Ext.Ajax.request({
			url : 'resources/src/php/export/exportDataToExcel.php',
			params: {
				title: MetExplore.globals.Session.nameBioSource + " data",
				data: Ext.encode(sheets)
			},
			timeout: 2400000,
			failure : function(response, opts) {
				Ext.MessageBox
						.alert('Ajax error',
								'export failed: Ajax error!');
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
								'export failed: JSON incorrect!');
					var win = this.up('window');
					if (win) {
						win.close();
					}
				}
	
				if (repJson != null && repJson['success'])
				{
					var filename="ExportExcel_"+MetExplore.globals.Session.idBioSource+".xls";
					
					downloadDataUrlFromJavascript(filename, repJson['file']);
					//window.open(repJson['file'],""); //Start download
				}
				else {
					Ext.MessageBox
						.alert(
								'export failed',
								repJson['message']);
				}
	
			},
			scope : this
		});
	    
	}


});