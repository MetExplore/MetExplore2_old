/**
 * C_MapMulti
 *
 */

Ext.define('MetExplore.controller.C_MapMulti', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session', 'MetExplore.globals.StoreUtils'],

    config: {
        views: ['form.V_MapMulti']
    },

    /**
     * init function Checks the changes on the bioSource selection
     *
     */
    init: function() {
        this.control({
            'formMapMulti button[action=mapMulti]': {
                click: this.mapMulti
            },
            // 'formMap button[action=exportJsonFile]': {
            //     click: this.exportJsonFile
            // }
            // 'formMap button[action=saveMappingDB]': {
            //     click: this.saveMappingDB
            // }
        });

    },


    /**
     * @method map
     * Recupere le contenu du formulaire de mapping
     * recuperer tous les intitulés de colonne  (select combo)
     * lancer php : ecrit les fichiers / lance python
     * mettre en forme les resultats
     * Recupere les data de mapping
     * Execute mapping
     */
    mapMulti: function(button) {

        //suspendre les evenement
        Ext.suspendLayouts();


        //recuperation elements formulaire
        var panel = Ext.getCmp('tabPanel').getActiveTab();
        var myMask = new Ext.LoadMask({
            target: panel, // Here myPanel is the component you wish to mask
            msg: "Please wait..."
        });
        myMask.show();
        var gridData = panel.query('gridDataIdentifiers')[0];
        var classMap = panel.query('checkboxfield[name=classmapping]')[0].getRawValue();
        var nameMap = panel.query('textfield[name=mapping_name]')[0].getRawValue();

        //ajout d'un mapping dans S_MappingInfo
        var storeMapInfo = Ext.getStore('S_MappingInfo');
        var mapId = storeMapInfo.addMappingInfoMulti(gridData, nameMap);
        var recInfo = storeMapInfo.findRecord('id', mapId);
        if (recInfo) {
            panel.query('textfield[name=id]')[0].setValue(mapId);
            panel.setTitle(recInfo.get('title'));
        }

        //recupere toutes les keys (valeurs des combo colonnes) pour les dataIndex map0....
        var keyMap = {};
        var map = "";
        for (i = 3; i < gridData.columns.length; i++) {
            map = "map" + (i - 3);
            keyMap[map] = gridData.columns[i].items.items[0].value;
        }

        //recuperer le json du store de la grid
        //modification des cles du json pour mettre les intitulés des colonnes
        var data = MetExplore.globals.StoreUtils.uistoreTojson(gridData);
        var datawithkey = data.map(function(obj) {
            return _.mapKeys(obj, function(value, key) {
                return keyMap[key];
            });
        });

        //creation du fichiers des metabolites du reseau avec tous les identifiants de la DB
        Ext.Ajax.request({
            url: 'resources/src/php/multimapping/metaboliteIdsLipids.php',
            scope: this,
            method: 'POST',
            timeout: 300000,
            withCredentials: true,
            params: {
                idBioSource: MetExplore.globals.Session.idBioSource
            },
            failure: function(response, opts) {
                if (response.timedout) {
                    Ext.MessageBox.alert('Error', 'Request was timedout');
                } else {
                    Ext.MessageBox.alert('Server Error', 'Server-side failure with status code ' + response.status);
                }
                var ctrl = MetExplore.app.getController('C_MapMulti');
                ctrl.maskHide(myMask);
                Ext.resumeLayouts(true);
            },
            success: function(response, opts) {
                //lancement du mapping python
                Ext.Ajax.request({
                    url: 'resources/src/php/multimapping/loadMappingPy.php',
                    scope: this,
                    method: 'POST',
                    timeout: 300000,
                    withCredentials: true,
                    params: {
                        idBioSource: MetExplore.globals.Session.idBioSource,
                        jsonData: Ext.JSON.encode(datawithkey),
                        classMap: classMap
                    },
                    failure: function(response, opts) {
                        //console.log(response);
                        if (response.timedout) {
                            Ext.MessageBox.alert('Error', 'Request was timedout');
                        } else {
                            Ext.MessageBox.alert('Server Error', 'Server-side failure with status code ' + response.status);
                        }
                        var ctrl = MetExplore.app.getController('C_MapMulti');
                        ctrl.maskHide(myMask);
                        Ext.resumeLayouts(true);
                    },
                    success: function(response, opts) {
                        console.log("ok mapping effectué");

                        var json_data = Ext.decode(response.responseText)["json_data"];
                        //var data = response.responseText;
                        console.log("reponse python");
                        console.log(json_data);
                        var ctrl = MetExplore.app.getController('C_MapMulti');
                        var ctrlMap = MetExplore.app.getController('C_Map');

                        if (json_data != undefined) {
                            //affecter un mapping au store mapping
                            //var mapId= 'M' + numero ;
                            ctrl.result2MappingInfo(json_data, mapId);

                            // affecter les valeurs au store S_Metabolite
                            ctrl.result2gridNetwork(json_data, mapId);

                            // affecter toutes les valeurs de resultats au store de la grid Data
                            ctrl.result2grid(json_data);

                            //faire le coverage & pathway enrichment
                            ctrl.coverage(mapId);

                            Ext.callback(ctrlMap.afterMapInGrid(MetExplore.globals.Session.mappingObjViz[recInfo.get('numero')]), this);
                        }

                        //enlever mask attente
                        ctrl.maskHide(myMask);
                        Ext.resumeLayouts(true);

                    }
                });
            }
        });


    },

    /****************************************************************************************************************************
     * result2grid
     * ajout resultats de mapping dans la grid de saisie
     * resultats dans la grid du formulaire des data
     * @param json_data
     */
    result2grid: function(json_data) {
        var panel = Ext.getCmp('tabPanel').getActiveTab();
        var gridData = panel.query('gridDataIdentifiers')[0];

        var jsonstore = MetExplore.globals.StoreUtils.uistoreTojson(gridData);
        //console.log(jsonstore);
        var resultMerge = _.map(jsonstore, function(obj) {
            var objData = _.find(json_data, {
                name: obj.map0
            });

            var mapped = objData["mapped"];

            var result = "";
            for (var i = 0; i < mapped.length; i++) {
                result = result + mapped[i]["networkid"] + " -- " + mapped[i]["distance"] + " -- " + mapped[i]["mapping_type"] + "<br>";
            }
            if (result=="") result= "No mapping";
            return _.assign(obj, {
                "result": result
            })
        });

        var store = gridData.getStore();
        store.proxy.reader.rawData = resultMerge;
        gridData.columns[1].setVisible(true);
    },

    /**********************************************************************************************************************
     * result2gridNetwork
     * resultats de mapping vers le store S_Metabolite
     * add column dans la gridMetabolite
     *
     * @param json_data
     * @param mapId : id du mapping dans le store
     */
    result2gridNetwork: function(json_data, mapId) {
        // creation d'un tableau de tous les elements mappés
        var mapTable = _.flatten(_.map(json_data, "mapped"));

        //dans le store Metabolite, ajouter les infos de mapTable
        var dataStore = MetExplore.globals.StoreUtils.storeTojson("S_Metabolite");

        var storeMapInfo = Ext.getStore('S_MappingInfo');
        var recInfo = storeMapInfo.findRecord('id', mapId);

        var ctrlMap = MetExplore.app.getController('C_Map');

        var resultMerge = _.map(dataStore, function(obj) {

            //filtrer les tableau de resultat avec dbIdentifier correspondant dans reseau
            var findall = _.filter(mapTable, {
                networkid: obj.dbIdentifier
            });

            //creation d'un nouvel objet resultat
            var resultobj = {};
            resultobj[mapId + "datasetname"] = "";
            resultobj[mapId + "mappingtype"] = "";
            resultobj[mapId + "distance"] = "";
            resultobj[mapId + "classpath"] = "";
            var dists = (_.map(findall, "distance")).map(function(obj) {
                return parseInt(obj)
            });

            if (recInfo) {
                if (dists.length != 0) {
                    var minDist = Math.min.apply(null, dists);
                    ctrlMap.dataMappingInVisualization("Identified", obj.dbIdentifier, true, recInfo.get('numero'), false);
                    ctrlMap.dataMappingInVisualization("Min distance", obj.dbIdentifier, minDist, recInfo.get('numero'), false);
                }
            }

            for (var i = 0; i < findall.length; i++) {
                resultobj[mapId + "datasetname"] = resultobj[mapId + "datasetname"] + findall[i]["datasetname"] + "<br>";
                resultobj[mapId + "mappingtype"] = resultobj[mapId + "mappingtype"] + findall[i]["mapping_type"] + "<br>";
                resultobj[mapId + "distance"] = resultobj[mapId + "distance"] + findall[i]["distance"] + "<br>";
                //mettre arbre chebi dans le cas
                if (findall[i]["mapping_type"] == "chebi class mapping") {
                    resultobj[mapId + "classpath"] = resultobj[mapId + "classpath"] + _.join(findall[i]["path"], "->") + "<br>";
                }
            }

            return _.assignIn(obj, resultobj);
        });

        MetExplore.globals.StoreUtils.jsonTostore('S_Metabolite', resultMerge);

        //creation colonne Mapping dans grid Metabolite
        var gridM = Ext.getCmp("gridMetabolite");
        var cols = [];

        var col1 = Ext.create('Ext.grid.column.Column', {
            header: 'Distance',
            filterable: true,
            hideable: false,
            dataIndex: mapId + 'distance'
        });
        cols.push(col1);

        var col2 = Ext.create('Ext.grid.column.Column', {
            header: 'Mapping Type',
            filterable: true,
            hideable: false,
            dataIndex: mapId + 'mappingtype'
        });
        cols.push(col2);

        var col3 = Ext.create('Ext.grid.column.Column', {
            header: 'Dataset Id -> Network Id',
            filterable: true,
            hideable: false,
            dataIndex: mapId + 'classpath'
        });
        cols.push(col3);

        var col4 = Ext.create('Ext.grid.column.Column', {
            header: 'Dataset Name',
            filterable: true,
            hideable: false,
            dataIndex: mapId + 'datasetname'
        });
        cols.push(col4);


        var title = "Mapping";
        if (recInfo) {
            title = recInfo.get("title");
        }
        var colMap = Ext.create('Ext.grid.column.Column', {
            header: title,
            filterable: true,
            hideable: false,
            columns: cols
        });
        gridM.headerCt.add(gridM.columns.length, colMap);

        gridM.getView().refresh();


    },

    /**
     * result2MappingInfo
     * ajoute resultats de mapping dans le store MappingInfo
     * @param json_data
     * @param mapId
     */
    result2MappingInfo: function(json_data, mapId) {

        var storeMapInfo = Ext.getStore('S_MappingInfo');
        var recInfo = storeMapInfo.findRecord('id', mapId);
        if (recInfo) {
            var mapTable = _.flatten(_.map(json_data, "mapped"));
            var tabIdRec = _.flatten(_.map(mapTable, "idsql"));
            //console.log(tabIdRec);
            var tabUniq = _.uniq(tabIdRec);
            //console.log(tabUniq);
            recInfo.set('idMapped', tabUniq.join());
            recInfo.set('nbDataInNetwork', mapTable.length);
            recInfo.set('nbMapped', tabUniq.length);
        }
    },

    /**
     * coverage
     * lancement php du calcul du coverage des idMapped (Metabolite) sur objets Pathway, Reaction
     * @param mapId
     */
    coverage: function(mapId) {
        var storeMapInfo = Ext.getStore('S_MappingInfo');

        var recInfo = storeMapInfo.findRecord('id', mapId, 0, false, true, true);

        var Listid = recInfo.get('idMapped');
        var numMapping = recInfo.get('numero');
        var ctrl = this;

        Ext.Ajax.request({
            url: 'resources/src/php/map/coverageMapping.php',
            timeout: 300000,
            scope: this,
            method: 'POST',
            params: {
                idBioSource: MetExplore.globals.Session.idBioSource,
                id: Listid, //.join()
                object: 'Metabolite',
                listOut: 'Pathway,Reaction',
                numMapping: numMapping
            },
            failure: function(response, opts) {
                Ext.MessageBox.alert('Ajax error',
                    'Error during metabolome mapping, can\'t find pathway coverage. Error: ');
                Ext.callback(this.maskHide(mask), this);
            },
            success: function(response, opts) {

                var json = Ext.decode(response.responseText);
                console.log(json);

                if (json["success"] == false) {
                    Ext.MessageBox.alert('Server error', 'pathway coverage on the server has failed. Error : ' + json.message);
                } else {

                    ctrl.addCoverageReaction(json["data"]["Reaction"], recInfo);
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
            var resultobj = {};
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

            var headerGroup = recInfo.get('title') + ' on Metabolite';
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
        console.log(dataCover);

        var storePathway = Ext.getStore('S_Pathway');

        var mapId = recInfo.get('id');
        var nbData = recInfo.get('nbData');
        var nbMapped = recInfo.get('nbMapped');
        var size = recInfo.get('sizeObject');
        var nbTotal = dataCover.length;

        var dataPathway = MetExplore.globals.StoreUtils.storeTojson("S_Pathway");

        var resultMerge = _.map(dataPathway, function(obj) {

            //recherche dans le tableau de resultat
            var findPathway = _.find(dataCover, {
                id: obj.id
            });

            //creation d'un nouvel objet resultat
            var resultobj = {};
            if (findPathway == undefined) {
                resultobj[mapId + "coverage"] = 0;
                resultobj[mapId + "nbMapped"] = 0;
                resultobj[mapId + "nb"] = 0;
                resultobj[mapId + "pathEnrich"] = 1;
                resultobj[mapId + "pathSignif"] = nbTotal;
                resultobj[mapId + "pathSignifBenjaminiHochberg"] = 1;

            } else {

                var nbMapped = findPathway["nbMapped"];
                var sizePath = findPathway["nb"];
                var result = exact22(nbMapped, nbData - nbMapped, sizePath - nbMapped, size - nbData - sizePath + nbMapped);

                resultobj[mapId + "coverage"] = findPathway["coverage"];
                resultobj[mapId + "nbMapped"] = findPathway["nbMapped"];
                resultobj[mapId + "nb"] = findPathway["nb"];
                resultobj[mapId + "pathEnrich"] = result;
                resultobj[mapId + "pathSignif"] = result * nbTotal;
                resultobj[mapId + "pathSignifBenjaminiHochberg"] = 1;
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

            var tabGridHeader = ['Coverage', 'Nb of Mapped', 'p-value', 'Bonferroni corrected p-value', 'BH-corrected p-value'];
            var tabGrid = [mapId + "coverage", mapId + "nbMapped", mapId + "pathEnrich", mapId + "pathSignif", mapId + "pathSignifBenjaminiHochberg"];

            var headerGroup = recInfo.get('title') + ' on Metabolite';
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
    maskHide: function(mask) {
        if (mask) mask.hide();

        var panel = Ext.getCmp('tabPanel').getActiveTab();
        if (panel.items.items[0] != undefined) {
            if (panel.items.items[0].xtype == "formMapMulti") {
                panel.query('button[action=mapMulti]')[0].disable();
                //panel.query('combo[name=coverage]')[0].disable();
                panel.query('checkboxfield[name=classmapping]')[0].disable();
                //panel.query('textfield[name=ppm]')[0].disable();
                panel.query('textfield[name=mapping_name]')[0].disable();
                //console.log(panel.query('gridData')[0]);
                //panel.query('combo[name=object]')[0].disable();
                //panel.query('combo[name=field]')[0].disable();
                //panel.query('fileuploadfield')[0].disable();
                //panel.query('combo[name=separator]')[0].disable();
                panel.query('checkboxfield[name=header]')[0].disable();
                //panel.query('displayfield[name=resultMapping]')[0].setVisible(true);
                //panel.query('button[name=save_mapping]')[0].setVisible(true);
                // if (MetExplore.globals.Session.idUser != -1) {
                //     panel.query('button[name=save_mappingDB]')[0].setVisible(true);
                // }

            }
        }
    },

});