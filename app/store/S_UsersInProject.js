/**
 * S_UsersInProject
 * model : 'MetExplore.model.UsersInProject'
 */
Ext.define('MetExplore.store.S_UsersInProject', {
	extend : 'Ext.data.Store',
	model : 'MetExplore.model.UsersInProject',
	autoLoad : false,
	proxy : {
		type : 'ajax',
		url : 'resources/src/php/userAndProject/dataUsersInProject.php',
		extraParams : {idProject: -1},
		reader : {
			type : 'json',
			root : 'results',
			successProperty : 'success'
		},
		listeners : {
			/**
			 * @event
			 * @param proxy
			 * @param response
			 * @param operation
			 * @param eOpts
			 */
			'exception' : function(proxy, response, operation, eOpts) {
				if (response.status !== 200) {
					Ext.Msg.alert("Failed", "Server Error. Status: " + response.status);
				} else {
					var responseText = Ext.decode(response.responseText);
					Ext.Msg.alert("Failed", responseText.message);
				}
			}
		}
	},

	/**
	 * destroyStore
	 */
	destroyStore: function() {
	    var me = this;
	
	    if (!me.isDestroyed) {
	        if (me.storeId) {
	            Ext.data.StoreManager.unregister(me);
	        }
	        me.clearData();
	        me.data = me.tree = me.sorters = me.filters = me.groupers = null;
	        if (me.reader) {
	            me.reader.destroyReader();
	        }
	        me.proxy = me.reader = me.writer = null;
	        me.clearListeners();
	        me.isDestroyed = true;
	
	        if (me.implicitModel) {
	            Ext.destroy(me.model);
	        } else {
	            me.model = null;
	        }
	    }
	}
});
