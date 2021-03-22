/**
 * @author FV
 * Menu graphmodelling
 */


Ext.define('MetExplore.view.menu.V_GraphModelling', {
		extend: 'Ext.menu.Menu', 
//		requires: ['MetExplore.globals.Session'],

		alias: 'widget.graphModelling',
		items:	[
             {
            	 text: 'Topology metabolite ',
             	 //id : 'menu_34',
            	 //hidden:true,

            	 handler: function(){
            	 
					var idBioSource= MetExplore.globals.Session.idBioSource;
					var storeMetaboliteTopo= Ext.getStore('S_MetaboliteTopo');
					storeMetaboliteTopo.proxy.extraParams.idBioSource=idBioSource;
					storeMetaboliteTopo.load({
							callback : function(records, operation, success) {
							
								var storeMetabolite = Ext.getStore("S_Metabolite");
								storeMetaboliteTopo.each(function(metaboliteTopo) {
									//console.log(metaboliteTopo.get('idMetabolite'));
									var rec= storeMetabolite.findRecord('id', metaboliteTopo.get('idMetabolite'),0,false,true,true);
									//console.log(rec);
									if (rec) {
										rec.set('topo', metaboliteTopo.get('topo')); 
									}
								});
								storeMetabolite.commitChanges();
							}
					});
					
					var gridM = Ext.getCmp('gridMetabolite');
					var index = gridM.headerCt.items.findIndex('dataIndex','topo');
					gridM.columns[index].setVisible(true);
					gridM.getView().refresh();

            	 }	

             }


        ]
});

