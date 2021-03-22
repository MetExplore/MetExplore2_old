/**
 * S_IdentifiersDBName
 * model : MetExplore.model.Identifiersgit
 */
Ext.define('MetExplore.store.S_Identifiersgit',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.Identifiersgit',
	autoLoad: false,

	proxy: {
		type: 'ajax',
        timeout: 1200000,
		url: 'resources/src/php/dataNetwork/dataIdentifiers/identifiersgit.php',
		actionMethods : {read: "POST"},
		reader : {
			type : 'json',
			root : 'results',
			successProperty : 'success'
		},
		listeners : {
			/**
			 * @event
			 * @param {} proxy
			 * @param {} response
			 * @param {} operation
			 * @param {} eOpts
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
