/**
 * S_ApplicationComponent
 * model : MetExplore.model.ApplicationComponent
 * Stores the current menu. Liste des menu visibles ;
 */

Ext.define('MetExplore.store.S_ApplicationComponent',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.ApplicationComponent',
	autoLoad : true,
	proxy: {
		type: 'ajax',
		//url: 'resources/config/hideComponent.json',
		reader: {
			type : 'json'
		}
	},
	listeners :{
			/**
			 * add
			 */
			// add : function (){
			// 	var ctrl= MetExplore.app.getController('C_Session');
			// 	ctrl.loadComponent();
            //
			// }
		}

});
