/**
 * Menu de test visible uniquement par team metexplore
 */


Ext.define('MetExplore.view.menu.V_TestMenu', {
	extend: 'Ext.menu.Menu', 
	alias: 'widget.testMenu',
	//stores: ['S_leftMetabolite','S_rightMetabolite'],
	// requires: [
	           // //'MetExplore.view.form.V_MapMetabolitesTest',
	           // 'MetExplore.view.form.V_ShareBioSource',
	           // 'MetExplore.view.form.V_ReactionCreate',
	           // 'MetExplore.view.form.V_Annotation_TabFile'
	           // //'MetExplore.view.form.V_Add_TabFile'
	           // ],		
	           items:	[

	                 	 {
	                 		 text: 'Share',
	                 		 closable:true,
	                 		 handler: function(){
	                 			 //Ext.getCmp('homePanel').setVisible(false);
	                 			 var tabPanel= Ext.getCmp('tabPanel');
	                 			 tabPanel.setVisible(true);

	                 			 var newTab = tabPanel.add({
	                 				 title: 'Share',
	                 				 closable: true,
	                 				 items:[{xtype:'formShareBioSource'}]
	                 			 });
	                 			 newTab.show();
	                 			 //tabPanel.setActiveTab(newTab);

	                 			 //Ext.getCmp('sidePanel').setVisible(true);

	                 		 }
	                 	 } ,

	                 	 {
	                 		 text: 'Annotation ',
	                 		 id : 'menu_34',
	                 		 //hidden:true,

	                 		 handler: function(){

	                 			 //Ext.getCmp('homePanel').setVisible(false);
	                 			 var tabPanel= Ext.getCmp('tabPanel');
	                 			 tabPanel.setVisible(true);

	                 			 var newTab = tabPanel.add({
	                 				 title: 'Annotation',
	                 				 closable: true,
	                 				 layout:'fit',
	                 				 items:[{xtype:'formAnnotation'}]
	                 			 });

	                 			 newTab.show();
	                 			 tabPanel.setActiveTab(newTab);
	                 			 //Ext.getCmp('sidePanel').setVisible(true);            	 							
	                 		 }

//	                 	 },
//	                 	 {
//	                 	 text: 'Tab File ',
//	                 	 id : 'menu_35',
//	                 	 //hidden:true,

//	                 	 handler: function(){

//	                 	 //Ext.getCmp('homePanel').setVisible(false);
//	                 	 var tabPanel= Ext.getCmp('tabPanel');
//	                 	 tabPanel.setVisible(true);

//	                 	 var newTab = tabPanel.add({
//	                 	 title: 'Add Data',
//	                 	 closable: true,
//	                 	 layout:'fit',
//	                 	 overflowX: 'auto',
//	                 	 minWidth:1200,
//	                 	 items:[{xtype:'formAdd_TabFile'}]
//	                 	 });

//	                 	 newTab.show();
//	                 	 tabPanel.setActiveTab(newTab);
//	                 	 //Ext.getCmp('sidePanel').setVisible(true);            	 							
//	                 	 }

	                 	 }

	                 	 ]
});

