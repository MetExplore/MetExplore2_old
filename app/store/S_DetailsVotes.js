/**
 * S_DetailsVotes
 * model : MetExplore.model.DetailsVotes
 */
Ext.define('MetExplore.store.S_DetailsVotes', {
	extend : 'Ext.data.Store',
	model : 'MetExplore.model.DetailsVotes',
	sorters: [{
     	property: 'vote',
     	direction: 'DESC'
   	}],

	autoLoad : false,

	proxy : {
		type : 'ajax',
		url : 'resources/src/php/dataNetwork/dataDetailsVotes.php',
		extraParams : {
			idObject: -1,
			typeObject: ""
		},
		reader : {
			type : 'json',
			root : 'results',
			successProperty : 'success'
		},
		listeners : {
			/**
			 * 
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