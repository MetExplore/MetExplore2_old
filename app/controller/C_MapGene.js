/**
 * C_MapGene
 *
 */

Ext.define('MetExplore.controller.C_MapGene', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session', 'MetExplore.globals.StoreUtils'],

    config: {
        views: ['form.V_MapGene']
    },

    /**
     * init function Checks the changes on the bioSource selection
     *
     */
    init: function () {
        this.control({
            'formMapGene button[action=mapGene]': {
                click: this.mapGene
            },
            afterrender: function(form) {
                var panel = Ext.getCmp('tabPanel').getActiveTab();
                panel.idmapping = "";
            }
        });

    },

    /*
    revoir calcul pathway enrichment (
    nbData = nbreaction ou nb de Gene &
    nbMapped = nb gene mappes ou nb de reactions
     */
    /****************************************************************************************************************
     * @method map
     * Recupere le contenu du formulaire de mapping
     * mettre en forme les resultats
     * Recupere les data de mapping
     * Execute mapping
     */
    mapGene: function (button) {

        //suspendre les evenement attention ne pas omettre de le remettre avant ajout de col
        //Ext.suspendLayouts();

        //recuperation elements formulaire
        var panel = Ext.getCmp('tabPanel').getActiveTab();
        var myMask = new Ext.LoadMask({
            target: panel, // Here myPanel is the component you wish to mask
            msg: "Please wait..."
        });
        myMask.show();
        var gridData = panel.query('gridDataGene')[0];
        var nameMap = panel.query('textfield[name=mapping_name]')[0].getRawValue();

        //ajout d'un mapping dans S_MappingInfo
        var storeMapInfo = Ext.getStore('S_MappingInfo');
        var mapId = storeMapInfo.addMappingInfoGene(gridData, nameMap);
        var recInfo = storeMapInfo.findRecord('id', mapId);
        if (recInfo) {
            panel.query('textfield[name=id]')[0].setValue(mapId);
            panel.setTitle(recInfo.get('title'));
            panel.idmapping=mapId;
        }

        //calcul mapping gene en prenant compte gpr
        var p = this.calcmapGene(gridData, mapId); ///, this.result2grid);
        p.then(this.result2grid(gridData, mapId))
        .then(this.result2MappingInfo(mapId))
        .then(this.coverage(mapId))
        .then(this.endMapping(myMask));

    },


    /*****************************************************************************************************************************************
     * principe:
     tabData= tableau du dataset
     dataGPR= data du strore ReactionGPR ; recuperer le tableau des enz (entre les enz c'est un or) dans les enz il peut y en avoir avec and
     si pas de gpr sur reaction -> no mapping
     si intersection entre tabEnz et tabData -> mapping (puisque c'est du or entre les elsments du tabEnz
     si pas intersection & si pas encore mappé voir si il y a un enz avec and et dans ce cas voir s'il y a tous les enz du and dans dataset

     * @param gridData
     * @param callback
     */
    calcmapGene: function (gridData, mapId) {
        return new Promise(function(resolve, reject) {

            var dataGene = MetExplore.globals.StoreUtils.uistoreTojson(gridData);
            var dataReaction = MetExplore.globals.StoreUtils.storeTojson('S_Reaction');
            var dataset = _.map(dataGene, 'idMap');

            var result = _.map(dataReaction, function (object) {
                var res = false;
                var enzymes = [];

                enzymes = _.compact(object['tabEnz']);
                //console.log('tab ',object['tabEnz']);
                //console.log('enz ',enzymes);
                if (enzymes.length = 0) {
                    res = false
                } else {
                    if (_.intersection(_.compact(object['tabEnz']), dataset).length > 0) {
                        res = true;
                    } else {
                        //tq non trouve et i<=taille tableau
                        var i = 0
                        while (!res && i < _.compact(object['tabEnz']).length) {
                            var tabGroupEnz = _.compact(object['tabEnz'])[i].split(" and ");
                            if (tabGroupEnz.length > 1) {

                                if (_.intersection(tabGroupEnz, dataset).length == tabGroupEnz.length) {
                                    //console.log("tabGroupEnz ",tabGroupEnz.length);
                                    //console.log("intersect ",_.intersection(tabGroupEnz, dataset).length);
                                    res = true;
                                }
                            }
                            i = i + 1;
                        }
                    }
                }
                object[mapId + "identified"] = res;
                return object;
            });
            resolve("end");
        })
    },

    /*******************************************************************************************************************
     * data to grid
     * @param gridData
     * @param mapId
     */
    result2grid : function (gridData, mapId){

        //affecter result gpr dans gridReaction
        this.result2gridReaction(mapId);

        //affecter resultat dans dataset
        this.result2dataset(gridData, mapId);

        //affecter resultat dans gridGene
        this.result2gridGene(gridData, mapId);
    },

    /*******************************************************************************************************************
     * result2gridReaction
     * resultats de mapping vers le store S_Reaction
     * add column dans la gridReaction
     *
     * @param result resultat du calcull de mapping gpr
     * @param mapId
     */
    result2gridReaction: function(mapId) {
        //console.log("result2gridReaction");
        //creation colonne Mapping dans grid Metabolite
        var gridR = Ext.getCmp("gridReaction");

        var storeMapInfo = Ext.getStore('S_MappingInfo');
        var recInfo = storeMapInfo.findRecord('id', mapId);
        var title= '<div>'+recInfo.get("title")+"&nbsp;&nbsp;<img src='./resources/icons/delete.svg' width='15' height='15' class='icon-delete' style=\"cursor: pointer;\"  />"+'</div>';


        var colMap= Ext.create('Ext.grid.column.Column', {
            tag_new:true,
            header: title,
            headerId: mapId,
            filterable: true,
            hideable: true,
            dataIndex: mapId+'identified',
            listeners: {
                'afterrender': function(el1) {
                    var grid= this.up();
                    var el= el1.getEl().select('.icon-delete');
                    if (el) { el.swallowEvent('click', true) }
                    grid.mon(el, 'click', function () {
                        var ctrlMap=  MetExplore.app.getController('C_Map');
                        ctrlMap.removeMapping(el1.headerId);
                    })
                }
            }
        });
        gridR.headerCt.add(gridR.columns.length, colMap);

        gridR.getView().refresh();

    },


    /*******************************************************************************************************************
     * result2dataset
     * ajout resultats de mapping dans la grid de saisie
     * resultats dans la grid du formulaire des data
     * @param json_data
     */
    result2dataset : function (gridData, mapId) {
        //console.log("result2dataset");
        var dataset= MetExplore.globals.StoreUtils.uistoreTojson(gridData);
        var dataGene= MetExplore.globals.StoreUtils.storeTojson('S_Gene');

        var resultMerge= _.map(dataset, function (obj){
            var objGene= _.find(dataGene, {
                dbIdentifier: obj.idMap
            });
            if (objGene) {
                obj["identified"]= true;
            }
            return obj
        });

        var store= gridData.getStore();
        store.proxy.reader.rawData = resultMerge;
        gridData.columns[1].setVisible(true);
    },

    /****************************************************************************************************************************
     * result2gridGene
     * ajout resultats de mapping dans la grid de saisie
     * resultats dans la grid du formulaire des data
     * @param json_data
     */
    result2gridGene : function (gridData, mapId) {
        //console.log("result2gridGene");
        var dataset= MetExplore.globals.StoreUtils.uistoreTojson(gridData);
        var dataGene= MetExplore.globals.StoreUtils.storeTojson('S_Gene');

        var resultMerge= _.map(dataGene, function (obj){
            var objdata= _.find(dataset, {
                idMap : obj.dbIdentifier
            });
            if (objdata) {
                obj[mapId+"identified"]= true;
            } else {
                obj[mapId+"identified"]= false;
            }
            return obj
        });

        MetExplore.globals.StoreUtils.jsonTostore('S_Gene',resultMerge);
        //add column mapping
        //creation colonne Mapping dans grid Metabolite
        var gridGene = Ext.getCmp("gridGene");

        var storeMapInfo = Ext.getStore('S_MappingInfo');
        var recInfo = storeMapInfo.findRecord('id', mapId);
        var title= '<div>'+recInfo.get("title")+"&nbsp;&nbsp;<img src='./resources/icons/delete.svg' width='15' height='15' class='icon-delete' style=\"cursor: pointer;\"  />"+'</div>';

        var colMap= Ext.create('Ext.grid.column.Column', {
            tag_new:true,
            header: title,
            headerId : mapId,
            filterable: true,
            hideable: true,
            dataIndex: mapId+'identified',
            listeners: {
                'afterrender': function(el1) {
                    var grid= this.up();
                    var el= el1.getEl().select('.icon-delete');
                    if (el) { el.swallowEvent('click', true) }
                    grid.mon(el, 'click', function () {
                        var ctrlMap=  MetExplore.app.getController('C_Map');
                        ctrlMap.removeMapping(el1.headerId);
                    })
                }
            }
        });
        gridGene.headerCt.add(gridGene.columns.length, colMap);

        gridGene.getView().refresh();

    },


    /*******************************************************************************************************************
     * result2MappingInfo
     * ajoute resultats de mapping dans le store MappingInfo
     * @param json_data
     * @param mapId
     */
    result2MappingInfo : function(mapId) {
        //console.log("result2MappingInfo");
        var storeMapInfo = Ext.getStore('S_MappingInfo');
        var json_data= MetExplore.globals.StoreUtils.storeTojson('S_Reaction');
        //console.log(json_data);
        var recInfo = storeMapInfo.findRecord('id', mapId);
        //console.log("mappingInfo",recInfo);
        if (recInfo) {
            var mapTab= _.filter(json_data,mapId+"identified");
            var tabId= _.map(mapTab,"id");
            recInfo.set('idMapped', tabId.join());
            recInfo.set('nbDataInNetwork', tabId.length);
            recInfo.set('nbMapped', tabId.length);
        }
        return (true);
    },

    /*******************************************************************************************************************
     * coverage
     * lancement php du calcul du coverage des idMapped (Metabolite) sur objets Pathway, Reaction
     * @param mapId
     */
    coverage: function(mapId) {
        //console.log("coverage");
        var storeMapInfo = Ext.getStore('S_MappingInfo');

        var recInfo = storeMapInfo.findRecord('id', mapId, 0, false, true, true);

        var Listid = recInfo.get('idMapped');
        //console.log(Listid);
        var numMapping= recInfo.get('numero');
        var ctrl = this;

        Ext.Ajax.request({
            url: 'resources/src/php/map/coverageMapping.php',
            timeout: 300000,
            scope: this,
            method: 'POST',
            params: {
                idBioSource: MetExplore.globals.Session.idBioSource,
                id: Listid, //.join()
                object: 'Reaction',
                listOut: 'Pathway',
                numMapping: numMapping
            },
            failure: function(response, opts) {
                Ext.MessageBox.alert('Ajax error',
                    'Error during metabolome mapping, can\'t find pathway coverage. Error: ');
                Ext.callback(this.maskHide(mask), this);
            },
            success: function(response, opts) {

                var json = Ext.decode(response.responseText);
                if (json["success"] == false) {
                    Ext.MessageBox.alert('Server error','pathway coverage on the server has failed. Error : ' + json.message);
                } else {
                    ctrl.addCoveragePathway(json["data"]["Pathway"], recInfo);
                }
            }
        });
    },

    /**
     * addCoverageReaction
     * @param dataCover
     * @param recInfo
     */
    addCoverageReaction: function(dataCover, recInfo) {

        var storeReaction = Ext.getStore('S_Reaction');

        var mapId = recInfo.get('id');

        var dataStore = MetExplore.globals.StoreUtils.storeTojson("S_Reaction");

        var resultMerge = _.map(dataStore, function(obj) {

            //recherche dans le tableau de resultat
            var find = _.find(dataCover, {
                id: obj.id
            });

            //creation d'un nouvel objet resultat
            var resultobj= {};
            if (find == undefined) {
                resultobj[mapId + "coverage"] = 0;
                resultobj[mapId + "nbMapped"] = 0;
                resultobj[mapId + "nb"] = 0;
            } else {
                resultobj[mapId + "coverage"] = find["coverage"];
                resultobj[mapId + "nbMapped"] = find["nbMapped"];
                resultobj[mapId + "nb"] = find["nb"];
            }


            return _.assignIn(obj, resultobj);
        });
        MetExplore.globals.StoreUtils.jsonTostore('S_Reaction', resultMerge);

        /*create col in  grid*/
        var grid = Ext.getCmp('gridReaction');
        if (grid != 'undefined' && grid.headerCt != 'undefined') {

            var tabGrid = new Array();
            var tabGridHeader = new Array();

            tabGrid.push(mapId + "coverage");
            tabGrid.push(mapId + "nbMapped");

            tabGridHeader.push('Coverage');
            tabGridHeader.push('Nb of Mapped');

            var headerGroup = recInfo.get('title') + ' on Metabolite' ;
            grid.createGroupCol(headerGroup, tabGridHeader, tabGrid, false, 0, mapId);
            }

        storeReaction.sort({
            property: mapId + "nbMapped",
            direction: 'DESC'
        });

    },


    /**------------------------------------------------------------------------
     * addDataPathway : affecte les donnees calculees de pathwayCoverage dans le store pathway
     * creation d'un  Store S_PathwayMapped pour visu chart
     */
    addCoveragePathway: function(dataCover, recInfo) {

        var storePathway = Ext.getStore('S_Pathway');

        var mapId = recInfo.get('id');
        var nbData= recInfo.get('nbData');
        var nbMapped= recInfo.get('nbMapped');
        var size= recInfo.get('sizeObject');
        var nbTotal = dataCover.length;

        var dataPathway = MetExplore.globals.StoreUtils.storeTojson("S_Pathway");

        var resultMerge = _.map(dataPathway, function(obj) {

            //recherche dans le tableau de resultat
            var findPathway = _.find(dataCover, {
                id: obj.id
            });

            //creation d'un nouvel objet resultat
            var resultobj= {};
            if (findPathway == undefined) {
                resultobj[mapId + "coverage"] = 0;
                resultobj[mapId + "nbMapped"] = 0;
                resultobj[mapId + "nb"] = 0;
                resultobj[mapId + "pathEnrich"]= 1;
                resultobj[mapId + "pathSignif"]= nbTotal;
                resultobj[mapId + "pathSignifBenjaminiHochberg"]= 1;

            } else {

                var nbMapped= findPathway["nbMapped"];
                var sizePath= findPathway["nb"];
                var result = exact22(nbMapped, nbData - nbMapped, sizePath - nbMapped, size - nbData - sizePath + nbMapped);

                resultobj[mapId + "coverage"] = findPathway["coverage"];
                resultobj[mapId + "nbMapped"] = findPathway["nbMapped"];
                resultobj[mapId + "nb"] = findPathway["nb"];
                resultobj[mapId + "pathEnrich"]= result;
                resultobj[mapId + "pathSignif"]= result * nbTotal;
                resultobj[mapId + "pathSignifBenjaminiHochberg"]= 1;
            }


            return _.assignIn(obj, resultobj);
        });
        MetExplore.globals.StoreUtils.jsonTostore('S_Pathway', resultMerge);

        // Calculate Benjamini & Hochberg
        storePathway.sort({
            property: mapId + "pathEnrich",
            direction: 'ASC'
        });
        var rankedValues = storePathway.getRange()
            .map(function(path) {
                return path.get(mapId + 'pathEnrich');
            });
        storePathway.each(function(path) {
            var rank = rankedValues.indexOf(path.get(mapId + "pathEnrich")) + 1;
            path.data[mapId + "pathSignifBenjaminiHochberg"] = path.get(mapId + "pathEnrich") * nbTotal / rank;
        })


        /*create col in  grid*/
        var grid = Ext.getCmp('gridPathway');
        if (grid != 'undefined' && grid.headerCt != 'undefined') {

            var tabGridHeader =
                ['Coverage','Nb of Mapped','p-value','Bonferroni corrected p-value','BH-corrected p-value'];
            var tabGrid =
                [mapId + "coverage",mapId + "nbMapped",mapId + "pathEnrich",mapId + "pathSignif",mapId + "pathSignifBenjaminiHochberg"];

            var headerGroup = recInfo.get('title') + ' on Gene' ;
            grid.createGroupCol(headerGroup, tabGridHeader, tabGrid, false, 0, mapId);
        }

        storePathway.sort({
            property: mapId + "nbMapped",
            direction: 'DESC'
        });

    },




    /**************************************************************************************
     * maskHide
     * enleve mask attente et devalide elements formulaire
     * @param mask
     */
    endMapping: function(mask) {
        //console.log("end");
        if (mask) mask.hide();

        var panel = Ext.getCmp('tabPanel').getActiveTab();
        if (panel.items.items[0] != undefined) {
            if (panel.items.items[0].xtype == "formMapGene") {
                panel.query('button[action=mapGene]')[0].disable();
                panel.query('textfield[name=mapping_name]')[0].disable();
                panel.query('checkboxfield[name=header]')[0].disable();
            }
        }
    },

});

