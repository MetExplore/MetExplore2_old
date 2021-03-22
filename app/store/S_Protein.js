/**
 * S_Protein
 * model: 'MetExplore.model.Protein'
 */
Ext.define('MetExplore.store.S_Protein',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.Protein',
	autoLoad: false,
	proxy: {
		type: 'ajax',
        timeout: 1200000,
		url: 'resources/src/php/dataNetwork/dataProtein.php',
        actionMethods : {read: "POST"},
		extraParams: {
			idBioSource:"",
			req:"R_Protein",
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
		// },
		// 'load' : function(store, records) {
		// 	Ext.each(records,function(rec){
		// 		Ext.getStore("S_ModelIdentifier").add({'dbIdentifier':rec.get('dbIdentifier')});
		// 	})
		}
	},

    /**
     * addSupplDataProtein
     */
    addSupplDataProtein: function() {

        var storeBioSourceData = Ext.getStore('S_BioSourceData');
        storeBioSourceData.clearFilter(true);
        storeBioSourceData.filter("object","Protein");

        if (storeBioSourceData.count()>0) {
            console.log("Protein");

                var jsonProtein = MetExplore.globals.StoreUtils.storeTojson('S_Protein');
                var keysProtein= _.keys(jsonProtein[0]);
                storeBioSourceData.each(function (record) {
                    var json = Ext.decode(record.get('datajson'));

                    var keys = _.keys(json[0]);
                    //_.pull(keys,"dbIdentifier");

                    var objblank = {};
                    var gridCols= [];
                    for(var i= 0; i < keys.length; i++)
                    {
                        //si la nouvelle cle est non presente dans les cle Metabolite
                        if (keysProtein.indexOf(keys[i])==-1 ) {
                            objblank[keys[i]] = "";
                            gridCols.push(keys[i]);
                        }
                    }

                    var resultMerge = _.map(jsonProtein, function (obj) {
                        var objtrouve = _.find(json, {
                            dbIdentifier: obj.dbIdentifier
                        });
                        //console.log(objtrouve);
                        if (objtrouve == undefined) objtrouve = objblank;
                        return _.assign(obj, objtrouve);
                    });
                    jsonProtein = resultMerge;

                    MetExplore.globals.StoreUtils.jsonTostore('S_Protein', jsonProtein);
                    var grid=  Ext.getCmp("gridProtein");
                    for(var i= 0; i < gridCols.length; i++)
                    {
                        //add Col in grid
                        grid.createCol(gridCols[i], gridCols[i], false, 0, 0);
                    }

                });
            }
    },

});