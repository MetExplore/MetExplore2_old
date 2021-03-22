/**
 * S_Gene
 * model: 'MetExplore.model.Gene'
 */
Ext.define('MetExplore.store.S_Gene', {
    extend: 'Ext.data.Store',
    model: 'MetExplore.model.Gene',
    autoLoad: false,
    requires: ['MetExplore.globals.Mapping'],
    proxy: {
        type: 'ajax',
        timeout: 1200000,
        url: 'resources/src/php/dataNetwork/dataGene.php',
        actionMethods : {read: "POST"},
        extraParams: {
            idBioSource: "",
            req: "R_Gene",
            id: "",
            getVotes: false
        },
        reader: {
            type: 'json',
            root: 'results',
            successProperty: 'success'
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
            } else {
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
     * add suppl data from biosource_data
     * project metexplore-data : push data on git -> data are integrated in table biosource_data (json field)
     */
    addSupplDataGene: function() {

        var storeBioSourceData = Ext.getStore('S_BioSourceData');
        storeBioSourceData.clearFilter(true);
        storeBioSourceData.filter("object","Gene");

        if (storeBioSourceData.count()>0) {
            //console.log("Gene");

                var jsonGene = MetExplore.globals.StoreUtils.storeTojson('S_Gene');
                var keysGene= _.keys(jsonGene[0]);
                storeBioSourceData.each(function (record) {
                    var json = Ext.decode(record.get('datajson'));

                    var keys = _.keys(json[0]);
                    //_.pull(keys,"dbIdentifier");

                    var objblank = {};
                    var gridCols= [];

                    for(var i= 0; i < keys.length; i++)
                    {
                        //si la nouvelle cle est non presente dans les cle Gene
                        if (keysGene.indexOf(keys[i])==-1 ) {
                            objblank[keys[i]] = "";
                            gridCols.push(keys[i]);
                        }
                    }
                    //mettre intitulés de cols pour ajouter quang gene selectionnés dans mapping
                    MetExplore.globals.Mapping.colsGene= gridCols;

                    var resultMerge = _.map(jsonGene, function (obj) {
                        var objtrouve = _.find(json, {
                            dbIdentifier: obj.dbIdentifier
                        });
                        //console.log(objtrouve);
                        if (objtrouve == undefined) objtrouve = objblank;
                        return _.assign(obj, objtrouve);
                    });
                    jsonGene = resultMerge;

                    MetExplore.globals.StoreUtils.jsonTostore('S_Gene', jsonGene);
                    var grid=  Ext.getCmp("gridGene");
                    for(var i= 0; i < gridCols.length; i++)
                    {
                        //add Col in grid
                        grid.createCol(gridCols[i], gridCols[i], false, 0, 0);
                    }

                });
            }

    },
    /**
     * addIdentifiersGene
     * @param ids
     */
    addIdentifiersGene: function(ids) {
        var tabDBName= MetExplore.globals.Identifiers.extDBNameGene;
        var objblank = {};
        for (i=0; i<tabDBName.length; i++){
            objblank[tabDBName[i]]="";
        }

        var jsonGene = MetExplore.globals.StoreUtils.storeTojson('S_Gene');
        //var storeIdentifiers = Ext.getStore('S_IdentifiersGene');
        var jsonId= MetExplore.globals.StoreUtils.storeTojson('S_IdentifiersGene');
        //console.log(jsonId);
        var jsonIdkey=_.groupBy(jsonId,'idmysql');
        var resultMerge = _.map(jsonGene, function (obj) {
            var objtrouve= jsonIdkey[obj['id']];
            //console.log('obj',objtrouve);
            var objids = Object.assign({}, objblank);
            if (objtrouve) {
                for (i = 0; i < objtrouve.length; i++) {
                    var id = objtrouve[i];
                    objids[id["extDBName"]] = id["extID"];
                }
            }
            return _.assign(obj, objids);
        });
        jsonGene = resultMerge;
        // ajout des col identifiant pour mapping gene
        MetExplore.globals.Mapping.colsGene=ids;
        // pour tous les ids ajout des col si elles n'existent pas
        var grid=  Ext.getCmp("gridGene");
        for(var i= 0; i < ids.length; i++)
        {
            var col= grid.indexCol(ids[i]);
            if (col<0) grid.createCol(ids[i], ids[i], true, 0, 0);
        }

    },

    loadIdentifiersGene: function(){
        //if (MetExplore.globals.Identifiers.S_IdentifiersMetabolite!=MetExplore.globals.Session.idBioSource) {
        var storeIds = Ext.getStore('S_IdentifiersGene');
        var idBioSource = MetExplore.globals.Session.idBioSource;
        storeIds.proxy.extraParams.idBioSource = idBioSource;
        storeIds.load({
            callback: function () {
                MetExplore.globals.Identifiers.S_IdentifiersGene = idBioSource;
                var storeG= Ext.getStore('S_Gene');
                storeG.addIdentifiersGene(MetExplore.globals.Identifiers.extDBNameGene);
            }
        });
        // }
    },


});