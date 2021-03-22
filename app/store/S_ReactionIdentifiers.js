/**
 * S_ReactionIdentifiers
 * Stock informations relative to the reaction selected
 * model: 'MetExplore.model.KeyValue'
 */
Ext.define('MetExplore.store.S_ReactionIdentifiers',{
	extend : 'Ext.data.Store',
	storeId: 'storeReactionIdentifiers',
	model: 'MetExplore.model.KeyValue',
	autoLoad: false,

	proxy: {
		type: 'ajax',
		url: 'resources/src/php/dataNetwork/dataReaction_identifiers.php',
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