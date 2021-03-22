/**
 * S_History
 * model: 'MetExplore.model.History'
 */
Ext.define('MetExplore.store.S_History',{
	extend : 'Ext.data.Store',
	storeId: 'storeHistory',
	model: 'MetExplore.model.History',
	autoLoad: false,
	sorters: [{
     	property: 'id',
     	direction: 'DESC'
   	}],

	proxy: {
		type: 'ajax',
		url: 'resources/src/php/userAndProject/dataHistory.php',
		extraParams: {
			idUser: -1,
			idProject: -1
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
	},
	
	/**
	 * Update the history wih griven dated
	 * @param {} from: date from
	 * @param {} to: date to
	 */
	updateHistory: function(from, to, idProject, idUser) {
		
		if(typeof idProject === "undefined")
		{
			console.log("[WARNING][S_History][updateHistory] No idProject defined ");
			idProject = -1;
		}
		
		if(typeof idUser === "undefined")
		{
			console.log("[WARNING][S_History][updateHistory] No idUser defined ");
			idUser = -1;
		}
		
		this.removeAll();
		var parameters = {idProject: idProject};
		if (from != undefined && to != undefined) {
			parameters['from'] = from;
			parameters['to'] = to;
		}
		this.load({
			params: parameters,
			callback: function() {
				this.clearFilter();
				this.sort();
				
				if(idUser != -1){
					this.filter('idUser', idUser);
				}
			}
		});
	}
	
});