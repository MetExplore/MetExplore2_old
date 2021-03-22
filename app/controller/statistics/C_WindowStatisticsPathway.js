/**
 * C_WindowStatisticsPathway
 * Controls events of V_WindowStatisticsPathway
 */
Ext.define('MetExplore.controller.statistics.C_WindowStatisticsPathway',{
	extend : 'Ext.app.Controller',

	config : {
		views : ['window.V_WindowStatisticsPathway']
	},
	
	init : function() {
		this.control({
			'windowStatisticsPathway button[action="close"]':{
				click: this.closeWin
			},
			'windowStatisticsPathway [action="exportAsPng"]':{
				click: this.exportAsPng
			},
			'windowStatisticsPathway [action="exportAsSvg"]':{
				click: this.exportAsSvg
			}
		});

	},
	
	/**
	 * Close the window
	 * @param {} button: button clicked
	 */
	closeWin: function(button) {
		button.up('window').close();
	},
	
	/**
	 * Export as PNG picture
	 * @param {} button: button clicked
	 */
	exportAsPng: function(button) {
		var win = button.up('window');
		var items = win.items.items;
		var i = 0;
		var found = false;
		//Search which panel is active:
		while (i < items.length && !found) {
			if (items[i].collapsed == false) {
				found = true;
			}
			else {
				i++;
			}
		}
		if (found) {
			var chart = items[i].down('chartPathwayCompleteness');
			Ext.draw.engine.ImageExporter.defaultUrl = 'resources/src/php/export/saveChart.php';
			chart.save({
				type : 'image/png'
			});
		}
	},
	
	/**
	 * Export as SVG picture
	 * @param {} button: button clicked
	 */
	exportAsSvg: function(button) {
		var win = button.up('window');
		var items = win.items.items;
		var i = 0;
		var found = false;
		//Search which panel is active:
		while (i < items.length && !found) {
			if (items[i].collapsed == false) {
				found = true;
			}
			else {
				i++;
			}
		}
		if (found) {
			var chart = items[i].down('chartPathwayCompleteness');
			svg = chart.save({
				type : 'image/svg+xml'
			});
			
			MetExplore.globals.Utils.saveAs("data:application/octet-stream;charset=utf-16le;base64," + btoa(svg), "chart.svg");
		}
	}
	
});