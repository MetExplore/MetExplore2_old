/**
 * S_TodoList
 * model: 'MetExplore.model.TodoList'
 */
Ext.define('MetExplore.store.S_TodoList',{
	extend : 'Ext.data.Store',
	storeId: 'storeTodoList',
	model: 'MetExplore.model.TodoList',
	autoLoad: false,
	sorters: [{
     	property: 'limitDate',
     	direction: 'DESC'
   	}],

	proxy: {
		type: 'ajax',
		url: 'resources/src/php/userAndProject/dataTodoList.php',
		extraParams: {
			iduser: "",
			idproject: ""
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
	
	/*listeners : {
		'add' : function(store, records, index, eOpts) {
			console.log('add to store');
		},
		'remove' : function(store, record, index, isMove, eOpt) {
			console.log('delete from store');
		}
	},*/
	
	/**
	 * Update project todolist store from user todolist store
	 * @param {} records
	 * @param {} action
	 * @param {} filterUser
	 */
	updateProjectTodoList: function(filterUser) {
		var storeUTD = Ext.getStore('S_TodoList');
		var storePTD = Ext.getStore('S_ProjectTodoList');
		storePTD.clearFilter();
		storePTD.removeAll();
		//Get all records without any filter:
		var allRecords = storeUTD.snapshot || storeUTD.data;
		allRecords.each(function(record) {
			if (record.get('idProject') == MetExplore.globals.Session.idProject) {
				storePTD.add(record);
			}
		});
		if (filterUser) {
			storePTD.clearFilter();
			storePTD.filter('idUser', MetExplore.globals.Session.idUser);
		}
	},
	
	/**
	 * Sync todostore of user and of project
	 * @param {} records
	 * @param {} action
	 * @param {} storeTypeOrig
	 * @param {} filterUser
	 */
	syncToDoStores: function(records, action, storeTypeOrig, filterUser) {
		if (storeTypeOrig == "generic") {
			var storeSync = Ext.getStore('S_ProjectTodoList');
		}
		else {
			var storeSync = Ext.getStore('S_TodoList');
		}
		if (action == "add") {
			for (var it = 0; it < records.length; it++) {
				storeSync.add(records[it]);
			}
		}
		else if (action == "delete") {
			storeSync.clearFilter();
			storeSync.each(function(record){
				if (records.indexOf(record.get('id')) > -1) {
					storeSync.remove(record);
				}
			});
		}
		if (filterUser) {
			storeSync.clearFilter();
			storeSync.filter('idUser', MetExplore.globals.Session.idUser);
		}
	}
});