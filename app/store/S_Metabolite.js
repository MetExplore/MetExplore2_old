/**
 * S_Metabolite
 * model : MetExplore.model.Metabolite
 */
Ext.define('MetExplore.store.S_Metabolite', {
    extend: 'Ext.data.Store',
    requires: ['MetExplore.globals.Loaded', 'MetExplore.globals.Session'],
    model: 'MetExplore.model.Metabolite',
    id: 'metabolite',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        timeout: 1200000,
        url: 'resources/src/php/dataNetwork/dataMetabolite.php',
        actionMethods: {
            read: "POST"
        },
        extraParams: {
            idBioSource: "",
            req: "R_Metabolite",
            id: ""
        },

        reader: {
            type: 'json',
            root: 'results',
            successProperty: 'success',
            method: 'POST',
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

        },

        /**
         * @event
         * @param store
         * @param records
         */
        'load': function(store, records){
            /* fuzzyy search
               create json with name
             */
            var jsonMetabolite = MetExplore.globals.StoreUtils.storeTojson('S_Metabolite');
            var result = _.map(jsonMetabolite, function(objMetabolite) {
                var obj = {};
                obj['dbIdentifier'] = objMetabolite['dbIdentifier'];
                obj['id'] = objMetabolite['id'];
                obj['name'] = objMetabolite['name'];
                obj['newname'] = MetExplore.globals.StoreUtils.stringProcessing(objMetabolite['name']);
                return obj
            });
            //console.log('result',result);
            MetExplore.globals.StoreUtils.jsonMetabolite = result;

            /*
            add  supplementary data
             */

            //this.addSupplDataMetabolite();


        }

    },
    /**
     * addSupplDataMetabolite
     */
    addSupplDataMetabolite: function() {

        var storeBioSourceData = Ext.getStore('S_BioSourceData');
        storeBioSourceData.clearFilter(true);
        storeBioSourceData.filter("object", "Metabolite");
        //console.log("Metabolite",storeBioSourceData);

        if (storeBioSourceData.count() > 0) {
            console.log("Metabolite");

            var jsonMetabolite = MetExplore.globals.StoreUtils.storeTojson('S_Metabolite');
            var keysMetabolite = _.keys(jsonMetabolite[0]);
            storeBioSourceData.each(function(record) {
                var json = Ext.decode(record.get('datajson'));
                var idsqlData = record.get('id');

                var keys = _.keys(json[0]);
                //_.pull(keys,"dbIdentifier");

                var objblank = {};
                var gridCols = [];
                for (var i = 0; i < keys.length; i++) {
                    //si la nouvelle cle est non presente dans les cle Metabolite
                    if (keysMetabolite.indexOf(keys[i]) == -1) {
                        objblank[keys[i]] = "";
                        gridCols.push(keys[i]);
                    }
                }

                var resultMerge = _.map(jsonMetabolite, function(obj) {
                    var objtrouve = _.find(json, {
                        dbIdentifier: obj.dbIdentifier
                    });
                    //console.log(objtrouve);
                    if (objtrouve == undefined) objtrouve = objblank;
                    return _.assign(obj, objtrouve);
                });
                jsonMetabolite = resultMerge;

                MetExplore.globals.StoreUtils.jsonTostore('S_Metabolite', jsonMetabolite);
                var gridM = Ext.getCmp("gridMetabolite");
                for (var i = 0; i < gridCols.length; i++) {
                    //add Col in grid
                    if (MetExplore.globals.Session.publicBioSource)
                        gridM.createCol(gridCols[i], gridCols[i], false, 0, 0, "git" + idsqlData);
                    else
                        gridM.createEditableCol(gridCols[i], gridCols[i], false, 0, 0, "git" + idsqlData);
                }

            });
        }
    },

    /**
     * addIdentifiersMetabolite
     * @param ids
     */
    addIdentifiersMetabolite: function(ids) {
        var tabDBName= MetExplore.globals.Identifiers.extDBNameMetabolite;
        var objblank = {};
        for (i=0; i<tabDBName.length; i++){
            objblank[tabDBName[i]]="";
        }

        var jsonMetabolite = MetExplore.globals.StoreUtils.storeTojson('S_Metabolite');
        //var storeIdentifiers = Ext.getStore('S_IdentifiersMetabolite');
        var jsonId= MetExplore.globals.StoreUtils.storeTojson('S_IdentifiersMetabolite');
        //console.log(jsonId);
        var jsonIdkey=_.groupBy(jsonId,'idmysql');
        //console.log(jsonIdkey);
        var resultMerge = _.map(jsonMetabolite, function (obj) {
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
        jsonMetabolite = resultMerge;

        // pour tous les ids ajout des col si elles n'existent pas
        var grid=  Ext.getCmp("gridMetabolite");
        var store= Ext.getStore('S_Identifiersgit');
        if (store) store.filter("object","Metabolite");;
        for(var i= 0; i < ids.length; i++)
        {
            var listnewid="";
            var rec= store.findRecord('extDBName',ids[i]);
            if (rec) {
                listnewid= rec.get('listid');
                if (listnewid==null) listnewid="";
            }
            var col= grid.indexCol(ids[i]);
            if (col<0) grid.createIdentifiersCol(ids[i], ids[i], listnewid);
        }
        store.clearFilter();
    },

    loadIdentifiersMetabolite: function(){
        //if (MetExplore.globals.Identifiers.S_IdentifiersMetabolite!=MetExplore.globals.Session.idBioSource) {
            var storeIds = Ext.getStore('S_IdentifiersMetabolite');
            var idBioSource = MetExplore.globals.Session.idBioSource;
            storeIds.proxy.extraParams.idBioSource = idBioSource;
            storeIds.load({
                callback: function () {
                    MetExplore.globals.Identifiers.S_IdentifiersMetabolite = idBioSource;
                    var storeM= Ext.getStore('S_Metabolite');
                    storeM.addIdentifiersMetabolite(MetExplore.globals.Identifiers.extDBNameMetabolite);
                }
            });
       // }
    },


    getMetaboliteById: function(id) {
        var theMetabolite;
        this.each(function(metabolite) {
            if (metabolite.get('id') == id) {
                theMetabolite = metabolite;
            }
        });
        return theMetabolite;
    },
    getByDBIdentifier: function(id) {
        return (this.snapshot || this.data).findBy(function(record) {
            return record.get('dbIdentifier') === id;
        });
    },
    getByName: function(name) {
        return (this.snapshot || this.data).findBy(function(record) {
            return record.get('name') === name;
        });
    },
    getByIdInAllMetabolite: function(id) {
        return (this.snapshot || this.data).findBy(function(record) {
            return record.get('id') === id;
        });
    },
    getByDBIdentifierFiltered: function(id) {
        return this.data.findBy(function(record) {
            return record.get('dbIdentifier') === id;
        });
    }
});