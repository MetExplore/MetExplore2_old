/**
 * S_BioSource
 * model : MetExplore.model.BioSource
 */
Ext.define('MetExplore.store.S_BioSource', {
	extend : 'Ext.data.Store',
	model : 'MetExplore.model.BioSource',

	//requires :['MetExplore.globals.Session', 'MetExplore.view.grid.V_gridBioSource'],

	autoLoad : true,
	groupField :'orgName',

	proxy : {
		type : 'ajax',
		url : 'resources/src/php/databiosource.php',
        actionMethods : {read: "POST"},
		reader : {
			type : 'json',
			root : 'results',
			successProperty : 'success'
		},
		timeout: 1200000,
		listeners : {
			/**
			 * @event proxy exception
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

	listeners: {
/**
 * @event load
 * @param {} store
 * @param {} records
 */
		'load': function(store, records){
			
			//MetExplore.globals.Utils.removeVotesColumns();
					
			var cmpNet= Ext.getCmp('networkData');
			if (cmpNet != null) {
				var cmp= cmpNet.down('gridBioSource');
				if (cmp) {
					var storeGrid=cmp.getStore();
					storeGrid.add(records);
		
					if (storeGrid.findRecord('public', false) ){
						
						if(!cmp.getView().features[0].disabled ){
							storeGrid.group('groupNameProject');
							storeGrid.sort('groupNameProject', 'ASC');
							
							cmp.getView().features[0].collapseAll();
						}
						
						if (MetExplore.globals.Session.idBioSource > -1) {
							var currentBioSource = storeGrid.getById(MetExplore.globals.Session.idBioSource);
							var access = currentBioSource.get('access');
							var idProject = currentBioSource.get('idProject');
							var ctrlgridBioSource= MetExplore.app.getController('C_gridBioSource');
							ctrlgridBioSource.setBiosourceInfo(MetExplore.globals.Session.idBioSource, MetExplore.globals.Session.nameBioSource, MetExplore.globals.Session.publicBioSource, access, idProject);
						}
						
						
						
					}else{
						if(!cmp.getView().features[0].disabled ){
							
							storeGrid.group('orgName');
							storeGrid.sort('orgName', 'ASC');
			
							cmp.getView().features[0].collapseAll();
						}
						
					}
				}
				this.loadStat();
			}
		}
	},
	/**
	 * addStat
	 * @param ids
	 */
	addStat: function(nameStore) {
		var MtabDBName= MetExplore.globals.BioSource.statidmetab;
		var objblank = {};
		for (i=0; i<MtabDBName.length; i++){
			objblank["M_"+MtabDBName[i]]=0;
		}
		var GtabDBName= MetExplore.globals.BioSource.statidgene;
		for (i=0; i<GtabDBName.length; i++){
			objblank["G_"+GtabDBName[i]]=0;
		}

		var jsonBioSource = MetExplore.globals.StoreUtils.storeTojson(nameStore);
		var jsonStat= MetExplore.globals.StoreUtils.storeTojson('S_StatBioSource');

		var jsonIdkey=_.groupBy(jsonStat,'idBioSource');
		//console.log(jsonIdkey);
		var resultMerge = _.map(jsonBioSource, function (biosource) {
			var objtrouve= jsonIdkey[biosource['id']];
			//console.log('obj',objtrouve);

			var objcover = Object.assign({}, objblank);
			if (objtrouve) {
				var nbMetab= _.find(objtrouve,{"extDBName":"nbMetab"})["nb"];
				//var nbGene= _.find(objtrouve,{"extDBName":"nbGene"})["nb"];
				//console.log(nbMetab);
				for (i = 0; i < objtrouve.length; i++) {
					var cover = objtrouve[i];
					var extDBName= cover["extDBName"];
					if (extDBName=="nbGene" || extDBName=="nbMetab") {
						objcover[extDBName] = cover["nb"];
					} else {
						if (cover["object"]=="Metabolite"){
							objcover["M_"+extDBName] = Math.round((cover["nb"]*10000)/nbMetab)/100;
						}
						// a ajouter pour Gene
						// else {
						// 	objcover["G_"+extDBName] = Math.round((cover["nb"]*10000)/nbGene)/100;
						// }

					}

				}
			}
			return _.assign(biosource, objcover);
		});
		jsonBioSource = resultMerge;
		//console.log(jsonBioSource);
		// pour tous les ids ajout des col si elles n'existent pas
		var grid=  Ext.getCmp("gridBioSource");
		//var store= Ext.getStore('S_StatBioSource');
		//if (store) store.filter("object","Metabolite");;
		for(var i= 0; i < MtabDBName.length; i++)
		{
			var col= grid.indexCol("M_"+MtabDBName[i]);
			if (col<0) {
				grid.createCoverCol("Metabolite-"+MtabDBName[i], "M_"+MtabDBName[i]);
			}
		}
		//meme chose pour les Gene
		// for(var i= 0; i < GtabDBName.length; i++)
		// {
		// 	var col= grid.indexCol("G_"+GtabDBName[i]);
		// 	if (col<0) {
		// 		grid.createCoverCol("Gene-"+GtabDBName[i], "G_"+GtabDBName[i]);
		// 	}
		// }
 
	},

	loadStat: function(){
		//if (MetExplore.globals.Identifiers.S_IdentifiersMetabolite!=MetExplore.globals.Session.idBioSource) {
		var storeStat = Ext.getStore('S_StatBioSource');
		storeStat.load({
			callback: function () {
				var store= Ext.getStore('S_BioSource');
				store.addStat('S_gridBioSource');
			}
		});
		// }
	},


});
