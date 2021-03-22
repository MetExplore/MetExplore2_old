/**
 * @author MC
 * @description 
 */
 /**
 * comparePanel
 */
Ext.define('MetExplore.view.main.V_ComparePanel', {
	extend: 'Ext.Panel',	
	alias: 'widget.comparePanel',
	id:'comparePanel',
	// requires: ['MetExplore.view.form.V_SelectBioSources',
	           // 'MetExplore.view.form.V_SelectMyBioSources',
	           // 'MetExplore.view.grid.V_gridCart',
	           // //'MetExplore.view.tree.V_treeFilter'

	           // ],

	collapsible: true,
	collapsed:true,
	region:'north',
	height: 300,
	width:'100%', 
	split:true,
	"resizable": {
        "handles": "s",
        "pinned": true
    },
	layout: {
        type: 'hbox',
        align: 'stretch'
    },
    animation: true
});