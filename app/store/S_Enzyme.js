/**
 * S_Enzyme
 *  model : MetExplore.model.Enzyme
 */
Ext.define('MetExplore.store.S_Enzyme',{
		extend : 'Ext.data.Store',
        model: 'MetExplore.model.Enzyme',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: 'resources/src/php/dataNetwork/dataEnzyme.php',
            actionMethods : {read: "POST"},
            extraParams: {
            	idBioSource:"",
            	req:"R_Enzyme",
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
         * @event beforeload
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
            }
		},

    /**
     * addSupplDataEnzyme
     */
    addSupplDataEnzyme: function() {

        var storeBioSourceData = Ext.getStore('S_BioSourceData');
        storeBioSourceData.clearFilter(true);
        storeBioSourceData.filter("object","Enzyme");

        if (storeBioSourceData.count()>0) {
            //console.log("Enzyme");

                var jsonEnzyme = MetExplore.globals.StoreUtils.storeTojson('S_Enzyme');
                var keysEnzyme= _.keys(jsonEnzyme[0]);
                storeBioSourceData.each(function (record) {
                    var json = Ext.decode(record.get('datajson'));

                    var keys = _.keys(json[0]);
                    //_.pull(keys,"dbIdentifier");

                    var objblank = {};
                    var gridCols= [];
                    for(var i= 0; i < keys.length; i++)
                    {
                        //si la nouvelle cle est non presente dans les cle Metabolite
                        if (keysEnzyme.indexOf(keys[i])==-1 ) {
                            objblank[keys[i]] = "";
                            gridCols.push(keys[i]);
                        }
                    }

                    var resultMerge = _.map(jsonEnzyme, function (obj) {
                        var objtrouve = _.find(json, {
                            dbIdentifier: obj.dbIdentifier
                        });
                        //console.log(objtrouve);
                        if (objtrouve == undefined) objtrouve = objblank;
                        return _.assign(obj, objtrouve);
                    });
                    jsonEnzyme = resultMerge;

                    MetExplore.globals.StoreUtils.jsonTostore('S_Enzyme', jsonEnzyme);
                    var grid=  Ext.getCmp("gridEnzyme");
                    for(var i= 0; i < gridCols.length; i++)
                    {
                        //add Col in grid
                        grid.createCol(gridCols[i], gridCols[i], false, 0, 0);
                    }

                });
            }

    },

});
 