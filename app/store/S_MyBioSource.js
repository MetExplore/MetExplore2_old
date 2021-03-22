/**
 * S_MyBioSource
 * model : 'MetExplore.model.BioSource'
 */
Ext.define('MetExplore.store.S_MyBioSource', {
	extend : 'Ext.data.Store',
	model : 'MetExplore.model.BioSource',
	autoLoad : false,
	groupField :'orgName',
	storeId: 'S_MyBioSource',

	proxy : {
		type : 'ajax',
		url : 'resources/src/php/dataMybiosource.php',
		extraParams : {
			idUser : 0
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
					var responseText = Ext.decode(response.responseText);
					Ext.Msg.alert("Failed", responseText.message);
				}
			}
		}
	},
	
	listeners: {
		/**
		 * @event
		 * @param {} store
		 * @param {} records
		 */
		'load': function(store, records){
			var store= Ext.getStore('S_BioSource');
			store.addStat('S_MyBioSource');
			var cmp= Ext.getCmp('networkData').down('gridBioSource');
			if (cmp) {
				var storeGrid=cmp.getStore();
				var iniCount=storeGrid.count();
				// console.log('store',storeGrid);
				// console.log('records',records);
				storeGrid.remove(records);
				
				storeGrid.add(records);			
				
				var gridBS = Ext.getCmp('gridBioSource');
				if (gridBS.down('checkboxfield[name="groupfields"]').value) {
					var groupingSelected = gridBS.down('combobox[name="groupfields"]').value;
					if (groupingSelected == null) {
						groupingSelected = "groupNameProject";
					}
					storeGrid.group(groupingSelected);
					storeGrid.sort(groupingSelected, 'ASC');
					// var store= Ext.getStore('S_BioSource');
					// store.addStat();
					/*if (storeGrid.findRecord('public', true) ){
						gridBS.getView().features[0].collapse('true');
					}*/
				}
				
				//Private BioSources are only BioSources out of a project:
				var storeCombo = Ext.create('Ext.data.Store', {
					storeId: 'storeMyBioSource',
					fields: ['id', 'nameBioSource'],
					data: Ext.getStore('S_MyBioSource').getNonProjectBS()
				});
				Ext.ComponentQuery.query('selectMyBioSources[name="selMyBioSource"]')[0].bindStore(storeCombo);
				var ctrlSession = MetExplore.app.getController('C_Session');
				ctrlSession.publicprivateBioSource();
				
			}


		},
		/**
		 * @event
		 * @param {} store
		 * @param {} records
		 */
		'bulkremove': function( store, records){
			var cmp= Ext.getCmp('networkData').down('gridBioSource');
			if (cmp) {
				var storeGrid=Ext.getCmp('gridBioSource').getStore();
				storeGrid.remove(records);
				
				storeGrid.group('orgName');
				storeGrid.sort('orgName', 'ASC');
				cmp.getView().features[0].collapseAll();
			}
		}
	},
	
	/**
	 * Returns all records of the BioSource
	 * @return {}
	 */
	clone: function() {
		var records = [];
		this.each(function(record) {
			records.push(record);
		});
		return records;
	},
	
	/**
	 * Returns all records associated to a given project
	 * @param {} idProject
	 * @return {}
	 */
	getProjectBioSource: function(idProject) {
		var records = [];
		this.each(function(record) {
			if (record.get('idProject') == idProject)
				records.push(record);
		});
		return records;
	},
	
	/**
	 * Returns all records associated to none project
	 * @return {}
	 */
	getNonProjectBS: function() {
		var records = [];
		this.each(function(record) {
			if (record.get('groupNameProject') == '0-private')
				records.push(record);
		});
		return records;
	}
});
