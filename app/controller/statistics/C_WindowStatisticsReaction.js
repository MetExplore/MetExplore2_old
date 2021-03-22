/**
 * C_WindowStatisticsReaction
 * Controls events of V_WindowStatisticsReaction
 */
Ext.define('MetExplore.controller.statistics.C_WindowStatisticsReaction',{
	extend : 'Ext.app.Controller',

	config : {
		views : ['window.V_WindowStatisticsReaction']
	},
	
	init : function() {
		this.control({
			'windowStatisticsReaction button[action="close"]':{
				click: this.closeWin
			},
			'windowStatisticsReaction panel': {
				expand: this.tabChanged
			},
			'windowStatisticsReaction [action="exportAsPng"]':{
				click: this.exportAsPng
			},
			'windowStatisticsReaction [action="exportAsSvg"]':{
				click: this.exportAsSvg
			}
		});

	},
	
	/**
	 * Tab changed
	 * @param {} button
	 */
	tabChanged: function(panel) {
		var chart = panel.down('chartGauge');
		var store = chart.getStore();
		store.getAt(0).set('value', chart.value);
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
			var chart = items[i].down('chartGauge');
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
			var chart = items[i].down('chartGauge');
			svg = chart.save({
				type : 'image/svg+xml'
			});
			
			MetExplore.globals.Utils.saveAs("data:application/octet-stream;charset=utf-16le;base64," + btoa(svg), "chart.svg");
		}
	}
	
});