/**
 * S_IdentifiersReaction
 * load all GeneIdentifiers of BioSource
 * model : MetExplore.model.Identifiers
 */
Ext.define('MetExplore.store.S_IdentifiersReaction',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.Identifiers',
	autoLoad: false,

	proxy: {
		type: 'ajax',
		timeout: 1200000,
		url: 'resources/src/php/dataNetwork/dataIdentifiers/dataReactionIdentifiers.php',
		extraParams: {
			idBioSource:""
		},
		reader : {
			type : 'json',
			root : 'results',
			successProperty : 'success'
		},
		actionMethods : {read: "POST"},
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
