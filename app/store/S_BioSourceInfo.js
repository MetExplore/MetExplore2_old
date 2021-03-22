/**
 * S_BioSourceInfo
 * modele : MetExplore.model.BioSourceInfo
 */
Ext.define('MetExplore.store.S_BioSourceInfo', {
	extend : 'Ext.data.Store',
	
	storeId : 'storeBioSourceInfo',
	model : 'MetExplore.model.BioSourceInfo',
	autoLoad : false,
	proxy : {
		type : 'ajax',
		url : 'resources/src/php/dataBiosourceInfo.php',
        actionMethods : {read: "POST"},
		extraParams : {
			idBioSource : ""
		},
		reader : {
			type : 'json',
			root : 'results',
			successProperty : 'success'
		},
		listeners : {
			/**
			 * @event exception
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
