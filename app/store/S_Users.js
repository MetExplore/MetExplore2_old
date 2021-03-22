/**
 * S_Users
 * model : 'MetExplore.model.User'
 */
Ext.define('MetExplore.store.S_Users', {
	extend : 'Ext.data.Store',
	model : 'MetExplore.model.User',
	autoLoad : true,
	proxy : {
		type : 'ajax',
		url : 'resources/src/php/dataUsers.php',
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
	}
});
