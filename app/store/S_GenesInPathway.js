/**
 * S_GenesInPathway
 * model : 'MetExplore.model.GenesInPathway'
 */
Ext.define('MetExplore.store.S_GenesInPathway', {
	extend : 'Ext.data.Store',
	storeId: 'storeGenesInPathway',
	model : 'MetExplore.model.GenesInPathway',
	autoLoad : false,
	proxy : {
		type : 'ajax',
		url : 'resources/src/php/dataNetwork/dataGenesInPathway.php',
		extraParams : {
			idPathway: "-1"
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
					Ext.Msg.alert("Failed", "Server Error. Status: "
									+ response.status);
				} else {
					var responseText = Ext
							.decode(response.responseText);
					Ext.Msg.alert("Failed", responseText.message);
				}
			}
		}
	}
});