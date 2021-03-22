/**
 * S_Reaction
 * model : 'MetExplore.model.Reaction'
 */
Ext.define('MetExplore.store.S_Reaction', {
    extend: 'Ext.data.Store',
    model: 'MetExplore.model.Reaction',
    // id :'reaction',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        timeout: 1200000,
        url: 'resources/src/php/dataNetwork/dataReaction.php',
        actionMethods : {read: "POST"},
        extraParams: {
            idBioSource: "",
            req: "R_Reaction",
            id: "",
            getVotes: false
        },
        reader: {
            type: 'json',
            root: 'results',
            successProperty: 'success'
        },
        listeners: {
            /**
             * @event
             * @param proxy
             * @param response
             * @param operation
             * @param eOpts
             */
            'exception': function(proxy, response, operation, eOpts) {
                if (response.status !== 200) {
                    Ext.Msg.alert("Failed", "Server Error. Status: " +
                        response.status);
                } else {
                    var responseText = Ext
                        .decode(response.responseText);
                    Ext.Msg.alert("Failed", responseText.message);
                }
            }
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
            if (store.data.items.length > 0 &&
                store.data.items[0].get('votes') != "") {
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
     * addSupplDataReaction
     */
    addSupplDataReaction: function() {

        var storeBioSourceData = Ext.getStore('S_BioSourceData');
        storeBioSourceData.clearFilter(true);
        storeBioSourceData.filter("object","Reaction");

        if (storeBioSourceData.count()>0) {
            console.log("Reaction");

                var jsonReaction = MetExplore.globals.StoreUtils.storeTojson('S_Reaction');
                var keysReaction= _.keys(jsonReaction[0]);
                storeBioSourceData.each(function (record) {
                    var json = Ext.decode(record.get('datajson'));

                    var keys = _.keys(json[0]);
                    //_.pull(keys,"dbIdentifier");

                    var objblank = {};
                    var gridCols= [];
                    for(var i= 0; i < keys.length; i++)
                    {
                        //si la nouvelle cle est non presente dans les cle Metabolite
                        if (keysReaction.indexOf(keys[i])==-1 ) {
                            objblank[keys[i]] = "";
                            gridCols.push(keys[i]);
                        }
                    }

                    var resultMerge = _.map(jsonReaction, function (obj) {
                        var objtrouve = _.find(json, {
                            dbIdentifier: obj.dbIdentifier
                        });
                        //console.log(objtrouve);
                        if (objtrouve == undefined) objtrouve = objblank;
                        return _.assign(obj, objtrouve);
                    });
                    jsonReaction = resultMerge;

                    MetExplore.globals.StoreUtils.jsonTostore('S_Reaction', jsonReaction);
                    var grid=  Ext.getCmp("gridReaction");
                    for(var i= 0; i < gridCols.length; i++)
                    {
                        //add Col in grid
                        grid.createCol(gridCols[i], gridCols[i], false, 0, 0);
                    }

                });
            }

    },

    /**
     * addIdentifiersReaction
     * @param ids
     */
    addIdentifiersReaction: function(ids) {
        var tabDBName= MetExplore.globals.Identifiers.extDBNameReaction;
        var objblank= {};

        for (i=0; i<tabDBName.length; i++){
            objblank[tabDBName[i]]="";
        }
        //console.log(objblank);
        var jsonReaction = MetExplore.globals.StoreUtils.storeTojson('S_Reaction');
        //var storeIdentifiers = Ext.getStore('S_IdentifiersReaction');
        var jsonId= MetExplore.globals.StoreUtils.storeTojson('S_IdentifiersReaction');
        //console.log(jsonId);
        var jsonIdkey=_.groupBy(jsonId,'idmysql');
        //console.log(jsonIdkey);
        var resultMerge = _.map(jsonReaction, function (obj) {
            var objtrouve= jsonIdkey[obj['id']];
            //copie de l'object et pas uniquement l'adresse
            var objids = Object.assign({}, objblank);
            if (objtrouve) {
                for (i=0; i<objtrouve.length;i++){
                    var id= objtrouve[i];
                    objids[id["extDBName"]]= id["extID"];
                }
            }

            return _.assign(obj, objids);
        });
        //jsonReaction = resultMerge;
        MetExplore.globals.StoreUtils.jsonTostore('S_Reaction',resultMerge);
        // pour tous les ids ajout des col si elles n'existent pas
        var grid=  Ext.getCmp("gridReaction");
        for(var i= 0; i < ids.length; i++)
        {
            var col= grid.indexCol(ids[i]);
            if (col<0) grid.createCol(ids[i], ids[i], true, 0, 0);
        }

    },

    loadIdentifiersReaction: function(){
        //if (MetExplore.globals.Identifiers.S_IdentifiersMetabolite!=MetExplore.globals.Session.idBioSource) {
        var storeIds = Ext.getStore('S_IdentifiersReaction');
        var idBioSource = MetExplore.globals.Session.idBioSource;
        storeIds.proxy.extraParams.idBioSource = idBioSource;
        storeIds.load({
            callback: function () {
                MetExplore.globals.Identifiers.S_IdentifiersReaction = idBioSource;
                var storeR= Ext.getStore('S_Reaction');
                storeR.addIdentifiersReaction(MetExplore.globals.Identifiers.extDBNameReaction);
            }
        });
        // }
    },

    /**
     *
     * @param id
     * @returns {*}
     */
    getReactionById: function(id) {
        var theReaction;
        this.each(function(reaction) {
            if (reaction.get('id') == id) {
                theReaction = reaction;
            }
        });
        return theReaction;
    },

    /**
     *
     * @param id
     * @returns {*}
     */
    getNodeById: function(id) {
        return (this.snapshot || this.data).findBy(function(record) {
            return record.get('id') === id;
        });
    },

    /**
     *
     * @param id
     * @returns {*}
     */
    getByDBIdentifier: function(id) {
        return (this.snapshot || this.data).findBy(function(record) {
            return record.get('dbIdentifier') === id;
        });
    },

    /**
     *
     * @param dbid
     * @returns {*}
     */
    getReactionByDBIdentifier: function(dbid) {
        var theReaction;
        this.each(function(reaction) {
            if (reaction.get('dbIdentifier') == dbid) {
                theReaction = reaction;
            }
        });
        return theReaction;
    },

    /**
     *
     * @param id
     * @returns {*}
     */
    getByIdInAllReaction: function(id) {
        return (this.snapshot || this.data).findBy(function(record) {
            return record.get('id') === id;
        });
    },
});