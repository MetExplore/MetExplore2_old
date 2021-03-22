/**
 * @author FV
 * @description 
 */
Ext.define('MetExplore.view.main.V_GraphPanel', {
	extend: 'Ext.panel.Panel', 
	alias: 'widget.graphPanel',
	id: 'graphPanel',

	// requires: [
	           // 'MetExplore.view.menu.V_Viz_MiningMenu',
	           // 'MetExplore.view.menu.V_Viz_ExportMenu',
	           // 'MetExplore.view.menu.V_Viz_DrawingMenu',
	           // 'MetExplore.view.main.V_ComparePanel',
	           // 'MetExplore.view.graphcomponent.V_Viz'
	           // ],
	           height:'100%',
	           width:'100%', 
	           margins:'0 0 0 0', 
	           split:true, 
	           layout:{
	        	   type:'vbox',
	        	   align:'stretch'
	           },
	           items: [
	                   {    title: 'Comparative Network',
	                	   closable: false,
	                	   id :'comparePanel',
	                	   xtype : 'comparePanel'
	                   },
	                   {
	                	   tbar:{
								id:'tbarGraph',
								items: [
								{
								   xtype:'button'/*,text: 'Refresh/Build network'*/,
								   id:'buttonRefresh',
								   disabled:true,
								   action:'refresh',
								   tooltip:'You must fill the cart to create the network',
								   iconCls:'refresh'
								},
								'-',
								//{text: 'Drawing', menu:{xtype: 'cytoscapeDrawingMenu'},id:'cytoscapeDrawingMenuID',hidden:false},
								//{text: 'Edit', menu:{xtype: 'cytoscapeEditMenu'},id:'cytoscapeEditMenuID',hidden:false},
								{text: 'Mining', menu:{xtype: 'vizMiningMenu'},tooltip:'You must create a network to use this menu',id:'vizMiningMenuID',disabled:true,hidden:false},
								{text: 'Drawing', menu:{xtype: 'vizDrawingMenu'},tooltip:'You must create a network to use this menu',id:'vizDrawingMenuID',disabled:true,hidden:false},
								{text: 'Export', menu:{xtype: 'vizExportMenu'},tooltip:'You must create a network to use this menu',id:'vizExportMenuID',disabled:true,hidden:false},
								'-',
								{xtype:'button'/*,text: 'Save network'*/,disabled:true,id:'buttonSaveNetwork', action:'saveNetwork',tooltip:'You must create a network to save the network',iconCls:'copyNetwork'},
								'-',
								{
									xtype: 'textfield',
									name: 'searchNodeTextField',
									id:'searchNodeTextField',
									fieldLabel: 'Search Node(s)',
									listeners: {
										change: function(that, newValue, oldValue) {
											if(oldValue==undefined)
												oldValue="";
											if(newValue.length>0 && oldValue.length==0)
												Ext.getCmp('searchNodeButton').setDisabled(false);
											else
												if (oldValue.length>0 && newValue.length==0) 
													Ext.getCmp('searchNodeButton').setDisabled(true);
										},
										specialkey : function(field, event){
											if(event.getKey() == event.ENTER){
												var component = Ext.getCmp("searchNodeButton");
										        if(component!= undefined){
										            component.fireEvent("click");
										        }
											}	
										}
									}
								},
								{
								    xtype:'button'/*,text: 'Copy network'*/,
								    // scale: 'large',
								    id:'searchNodeButton',
								    action:'searchNode',
								    tooltip:'You must create a network to copy the network',
								    iconCls:'search',
								    disabled:true,
								    padding:'0 0 0 0'
								}
								]
	                		}
	                   },{
	                	   id :'viz',
	                	   xtype : 'viz'
	                   }]
});