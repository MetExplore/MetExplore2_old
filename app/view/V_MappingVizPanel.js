/**
 * mappingVizPanel
 */
Ext.define('MetExplore.view.V_MappingVizPanel', {
	extend: 'Ext.Panel',	
	alias: 'widget.mappingVizPanel',
	id:'mappingVizPanel',
	collapsible: true,
	region:'east',
	width: 450,
	margins:'0 0 2 0',
	split:true,
	autoScroll: true,
	hidden: true,
	layout:{
		type:'vbox',
		align:'stretch'
	},
	title:'Mapping Visualization',
	items: [{
	   	id:'comboMappingViz',
	   	xtype:'selectMapping'
		},{
	   	id:'panelViz',
	   	xtype:'panelMappingViz'
	}]
});