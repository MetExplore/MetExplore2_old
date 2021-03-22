/**
 * panel Info reaction
 * Show panel of votes
 */
Ext.define('MetExplore.view.panel.V_PanelVizGPR', {

	extend : 'Ext.panel.Panel',
	alias : 'widget.panelVizGPR',
	name: 'panelVizGPR',
	layout: 'fit',
	border: 'false',
	config: {
		loaded:false
	},
	items: [],
	tbar: {
		name: "tbar",
		items:[{
			xtype:'button',
			text: 'Show legend',
			enableToggle: true,
			action: 'showHideLegend',
			width: 100,
			cls: "legend"
		},{
			xtype:'button',
			text: 'Stop force',
			action: 'stopForce',
			width: 90,
			cls: "stopForce"
		/*},{
			xtype:'button',
			text:'export as SVG',
			action: 'saveSVG'*/
		},'->', 
		{
	        xtype:'button'/*,text: 'Refresh/Build network'*/,
	        action:'refresh',
	        tooltip:'Wait data is loading...',
	        iconCls:'refresh'
	    }],
	    disabled: true
	}
	
});