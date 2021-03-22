/**
 * sidePanel
 */
Ext.define('MetExplore.view.V_SidePanel', {
	extend: 'Ext.Panel',	
	alias: 'widget.sidePanel',
	id:'sidePanel',

	           collapsible: true,
	           region:'east',
	           width: 520,
	           margins:'0 2 2 0',
	           split:true,
	           layout:'accordion', 
	           items: [{
	        	   title:'Selected BioSource',
	        	   id:'panelBioSource',
	        	   xtype:'panel',
	        	   autoScroll: true,
	        	   layout:{
	        		   type:'vbox',
	        		   align:'stretch'
	        	   },
	        	   items:[{
	        		   id:'comboBioSources',
	        		   fieldLabel: 'Public',
	        		   labelAlign: 'top',
	        		   xtype:'selectBioSources'
	        	   },{
	        		   id:'comboMyBioSources',
	        		   fieldLabel: 'Private',
	        		   labelAlign: 'top',
	        		   xtype:'selectMyBioSources'
	        	   },{
	        		   fieldLabel: 'Project',
	        		   labelAlign: 'top',
	        		   xtype:'selectProjectBioSources',
	        		   hidden: true
	        	   }]
	           },{
	        	   title:'Cart',
	        	   id:'gridCart',
	        	   xtype:'gridCart'
	           },
	           {
	        	   title : 'Jobs',
	        	   xtype:'gridJobs'
	           },
				{
                   title : 'Filters',
                    id:'gridFilter',
                   xtype:'gridFilter'
                }
                ]
});