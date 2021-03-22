/**
 * S_Pathway
 * model: 'MetExplore.model.Pathway'
 */
Ext.define('MetExplore.store.S_Pathway',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.Pathway',
	autoLoad: false,
	//id :'pathway',
	proxy: {
		type: 'ajax',
        timeout: 1200000,
		url: 'resources/src/php/dataNetwork/dataPathway.php',
        actionMethods : {read: "POST"},
		extraParams: {
			idBioSource:"",
			req:"R_Pathway",
			id:"",
			getVotes: false
		},
		reader: {
			type : 'json',
			root : 'results',
			successProperty : 'success'
		}
	},

	listeners: {
		/**
		 * @event
		 * @param store
		 * @param records
		 * @param successful
		 * @param eOpts
		 */
		beforeload: function(store, records, successful, eOpts) {
			if (store.data.items.length > 0 && store.data.items[0].get('votes') != "") {
				store.proxy.extraParams.getVotes = true;
			}
			else {
				store.proxy.extraParams.getVotes = false;
			}
		},
        // load : function(store, records) {
			// if (MetExplore.globals.Session.idUser!=-1 && MetExplore.globals.Session.idBioSource!=-1){
			// 	this.addSupplDataPathway();
			// }
        // }

	},

	/**
	 * addSupplDataPathway
	 */
    addSupplDataPathway: function() {

        var storeBioSourceData = Ext.getStore('S_BioSourceData');
        storeBioSourceData.clearFilter(true);
        storeBioSourceData.filter("object","Pathway");

		if (storeBioSourceData.count()>0) {
			//console.log("Pathway");

                var jsonPathway = MetExplore.globals.StoreUtils.storeTojson('S_Pathway');
                var keysPathway= _.keys(jsonPathway[0]);
                storeBioSourceData.each(function (record) {
                    var json = Ext.decode(record.get('datajson'));

                    var keys = _.keys(json[0]);
                    //_.pull(keys,"dbIdentifier");

                    var objblank = {};
                    var gridCols= [];
                    for(var i= 0; i < keys.length; i++)
                    {
                        //si la nouvelle cle est non presente dans les cle Metabolite
                        if (keysPathway.indexOf(keys[i])==-1 ) {
                            objblank[keys[i]] = "";
                            gridCols.push(keys[i]);
                        }
                    }

                    var resultMerge = _.map(jsonPathway, function (obj) {
                        var objtrouve = _.find(json, {
                            dbIdentifier: obj.dbIdentifier
                        });
                        //console.log(objtrouve);
                        if (objtrouve == undefined) objtrouve = objblank;
                        return _.assign(obj, objtrouve);
                    });
                    jsonPathway = resultMerge;

                    MetExplore.globals.StoreUtils.jsonTostore('S_Pathway', jsonPathway);
                    var grid=  Ext.getCmp("gridPathway");
                    for(var i= 0; i < gridCols.length; i++)
                    {
                        //add Col in grid
                        grid.createCol(gridCols[i], gridCols[i], false, 0, 0);
                    }

                });
            }


    },
	/**
	 * getCompletenessCategoriesCount
	 * @param doPercent
	 * @returns {Ext.data.JsonStore}
	 */
	getCompletenessCategoriesCount: function(doPercent) {
		var categories = {'< 25%': 0,
				'> 25%': 0,
				'> 50%': 0,
				'> 75%': 0};
		this.each(function(record) {
			var completeness = record.get('completeness');
			if (completeness < 25)
				categories['< 25%']++;
			else if(completeness < 50)
				categories['> 25%']++;
			else if(completeness < 75)
				categories['> 50%']++;
			else
				categories['> 75%']++;
		});
		if (doPercent)
		{
			var total = categories['< 25%'] + categories['> 25%'] + categories['> 50%'] + categories['> 75%'];
			categories['< 25%'] = Math.round((categories['< 25%'] / total) * 100);
			categories['> 25%'] = Math.round((categories['> 25%'] / total) * 100);
			categories['> 50%'] = Math.round((categories['> 50%'] / total) * 100);
			categories['> 75%'] = Math.round((categories['> 75%'] / total) * 100);
		}
		var storeCats = Ext.create('Ext.data.JsonStore', {
			fields: ['name', 'data'],
			data: [
			       { 'name': '< 25%',   'data': categories['< 25%'] },
			       { 'name': '> 25%',   'data': categories['> 25%'] },
			       { 'name': '> 50%', 'data': categories['> 50%'] },
			       { 'name': '> 75%',  'data': categories['> 75%'] }
			       ]
		});

		return storeCats;
	}
});
