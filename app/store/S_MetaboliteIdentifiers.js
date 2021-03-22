/**
 * S_MetaboliteIdentifiers
 * model : MetExplore.model.DataBaseIds
 */
Ext.define('MetExplore.store.S_MetaboliteIdentifiers',{
	extend : 'Ext.data.Store',
	storeId: 'storeMetaboliteIdentifiers',
	model: 'MetExplore.model.DataBaseIds',
	autoLoad: false,

	proxy: {
		type: 'ajax',
        timeout: 1200000,
		url: 'resources/src/php/dataNetwork/dataMetabolite_identifiers.php',
		extraParams: {
			idMySql:""
		},
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
