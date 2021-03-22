/**
 * C_windowInfoMetabolite
 */
Ext.define('MetExplore.controller.C_SidePanel',{
	extend : 'Ext.app.Controller',

	requires :['MetExplore.globals.Session'],
	
	config : {
		views : ['view.V_SidePanel']
	},
	init : function() {
		this.control({
			'sidePanel':{
				collapse:this.onCollapse,
				expand:this.onExpand
			}
		});

	},


	
	onCollapse:function(panel){
		
		panel.setTitle(MetExplore.globals.Session.nameBioSource);
		if(Ext.getCmp('newElement')){
			Ext.getCmp('newElement').doComponentLayout();
		}
	},
	
	
	onExpand:function(panel){
		panel.setTitle('');
		if(Ext.getCmp('newElement')){
			Ext.getCmp('newElement').doComponentLayout();
		}
	}	
});