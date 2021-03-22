/**
 * C_IdentifierMatcher
 *
 */

Ext.define('MetExplore.controller.C_IdentifierMatcher', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session', 'MetExplore.globals.StoreUtils'],

    config: {
        views: ['form.V_IdentifierMatcher']
    },

    init: function() {
        this.control({
            'formIdentifierMatcher button[action=matchIdentifier]': {
                click: this.matchIdentifier
            },
            'formIdentifierMatcher button[action=saveMatch]': {
                click: this.saveMatch
            },
        });

    },


    /**
     * @method matchIdentifier
     * Recupere le contenu du formulaire de matching
     * recuperer tous les intitulés de colonne  (select combo)
     * lancer php : ecrit les fichiers / lance python
     * mettre en forme les resultats
     * Recupere les data de mapping
     * Execute mapping
     */
    matchIdentifier: function(button) {


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


        /*recupere toutes les keys (valeurs des combo colonnes) pour les dataIndex map0....
        * i= 5 : 1er colonne de map (avant = result)
         */
        var keyMap = {};
        var keysData=[];
        var colsData=[];
        var map = "";
        for (i = 5; i < gridData.columns.length; i++) {
            map = "map" + (i - 5);
            keysData.push(map);
            var col= gridData.columns[i].items.items[0].value;
            colsData.push(col);
            keyMap[map] = col;
        }
        /*affecter les valeurs dans store pour sauvegarde
        * ajout dans store MatchingInfo
        * ajout d'un tag au bouton save pour retrouver le matching correspondant
         */
        var num= 1;
        var storeInfo= Ext.getStore('S_MatchingInfo');
        if (storeInfo.count()>0) num= storeInfo.last().get('id')+1;

        var button= panel.query('button[name=saveMatch]')[0];
        if (button!= undefined) button.tag=num;

        storeInfo.add({'id':num,'keysData':keysData,'colsData':colsData});

        //recuperer le json du store de la grid
        //modification des cles du json pour mettre les intitulés des colonnes
        var data = MetExplore.globals.StoreUtils.uistoreTojson(gridData);
        //console.log(data);
        i=1;
        var datawithkey = data.map(function(obj) {
            //console.log(obj);
            var objresult=_.assign({"name":"M"+i});
            i=i+1;
            var datak=_.mapKeys(obj, function(value, key) {
                return keyMap[key]});
            return _.assignIn(objresult, datak);
        });

        //console.log(datawithkey);
        var idBioSource= MetExplore.globals.Session.idBioSource;

        //creation du fichiers des metabolites du reseau avec tous les identifiants de la DB
        Ext.Ajax.request({
            url: 'resources/src/php/multimapping/metaboliteIdsLipids.php',
            scope: this,
            method: 'POST',
            timeout: 300000,
            withCredentials: true,
            params: {
                idBioSource: idBioSource
            },
            failure: function(response, opts) {
                if (response.timedout) {
                    Ext.MessageBox.alert('Error', 'Request was timedout');
                } else {
                    Ext.MessageBox.alert('Server Error', 'Server-side failure with status code ' + response.status);
                }
                var ctrl = MetExplore.app.getController('C_IdentifierMatcher');
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
                        idBioSource: idBioSource,
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
                        var ctrl = MetExplore.app.getController('C_IdentifierMatcher');
                        ctrl.maskHide(myMask);
                        Ext.resumeLayouts(true);
                    },
                    success: function(response, opts) {
                        //console.log("ok mapping effectué");

                        var json_data = Ext.decode(response.responseText)["json_data"];
                        var ctrl = MetExplore.app.getController('C_IdentifierMatcher');
                        //console.log(json_data);

                        if (json_data != undefined) {

                            //affecter un matching au store mapping
                            var enrInfo= Ext.getStore('S_MatchingInfo').last();
                            var jsonNetwork= ctrl.result2jsonNetwork(json_data);
                            var jsonDataset= ctrl.result2jsonDataset(json_data);
                            enrInfo.set('jsonNetwork',jsonNetwork);
                            enrInfo.set('jsonDataset',jsonDataset);

                            panel.query('button[name=saveMatch]')[0].setVisible(true);

                        } else {
                            panel.query('button[name=saveMatch]')[0].setVisible(false);
                            Ext.MessageBox.alert('Error', 'No result with this data');
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
     * result2jsonDataset
     * ajout resultats de mapping dans la grid de saisie
     * resultats dans la grid du formulaire des data
     * @param json_data
     */
    result2jsonDataset: function(json) {
        //console.log(json);
        var panel = Ext.getCmp('tabPanel').getActiveTab();
        var gridData = panel.query('gridDataIdentifiers')[0];

        var jsonstore = MetExplore.globals.StoreUtils.uistoreTojson(gridData);

        //add name M1.....
        var i=1;
        var json_name = jsonstore.map(function(obj) {
            //console.log(obj);
            var objname=_.assign({"name":"M"+i});
            i=i+1;
            return _.assignIn(obj, objname);
        });
        //console.log(json_name);
        jsonstore= json_name;
        //console.log(jsonstore);
        var resultMerge = _.map(jsonstore, function(obj) {
            var objData = _.find(json, {
                name: obj.name
            });

            var mapped = objData["mapped"];
            var result_id = "";
            var result_distance = "";
            var result_mapping = "";
            var result_classpath= "";
            var nb_mapped= mapped.length;
            var average=0;
            for (var i = 0; i < mapped.length; i++) {
                if (i==0) {
                    result_id = mapped[i]["networkid"];
                    result_distance = mapped[i]["distance"];
                    result_mapping = mapped[i]["mapping_type"].replace("mapping", "matching");
                    average= parseInt(mapped[i]["distance"],10);
                    result_classpath= mapped[i]["path"].join('-');
                    //console.log(mapped[i]["path"]);
                    //console.log(mapped[i]["path"].join('-'));
                } else {
                    result_id = result_id + ";" + mapped[i]["networkid"];
                    result_distance= result_distance +";" + mapped[i]["distance"];
                    result_mapping= result_mapping+";"+ mapped[i]["mapping_type"].replace("mapping", "matching");
                    average= average+parseInt(mapped[i]["distance"]);
                    result_classpath= result_classpath+";"+ mapped[i]["path"].join('-');
                    //console.log(result_path);
                }

            }
            if (nb_mapped>0) average= average/nb_mapped;
            else average= "";

            if (result_mapping=="") result_mapping= "No match";
            return _.assign(obj, {
                "result_id": result_id,
                "result_distance": result_distance,
                "result_mapping":result_mapping,
                "result_nb":nb_mapped,
                "result_average":average,
                "result_classpath":result_classpath
            })
        });

        var store = gridData.getStore();
        store.proxy.reader.rawData = resultMerge;
        gridData.columns[1].setVisible(true);
        gridData.columns[2].setVisible(true);
        gridData.columns[3].setVisible(true);

        return resultMerge;
    },

    /**********************************************************************************************************************
     * result2gridNetwork
     * resultats de mapping vers le store S_Metabolite
     * add column dans la gridMetabolite
     *
     * @param json_data
     * @param mapId : id du mapping dans le store
     */			

    result2jsonNetwork: function(json) {
        // creation d'un tableau de tous les elements mappés
        //console.log(json);
        var mapTable = _.flatten(_.map(json, "mapped"));
        //console.log(mapTable);
        //dans le store Metabolite, ajouter les infos de mapTable
        var dataStore = MetExplore.globals.StoreUtils.storeTojson("S_Metabolite");
        //console.log(dataStore);

        var resultMerge = _.map(dataStore, function(obj) {
            //filtrer les tableau de resultat avec dbIdentifier correspondant dans reseau
            var findall = _.filter(mapTable, {
                networkid: obj.dbIdentifier
            });

			var nb= findall.length;
			var tab_datasetname= [];
			var tab_mappingtype=[];
			var tab_distance= [];
			var tab_classpath=[];
			//console.log(findall);
			
            for (var i = 0; i < nb; i++) {			
                var name= findall[i]["datasetname"];
                var objfind= _.find(json, ['name', name]);
				var dataset= objfind["dataset_name"];
				var classpath= findall[i]["path"].join("-");
                // console.log(objfind);
                // console.log(findall[i]);
				/*
				si dataset n'est pas dans la tableau ajouter
				sinon si distance inferieure change distance
				*/
				//console.log(tab_datasetname);
				//console.log(classpath);
				var ind= tab_datasetname.indexOf(dataset);
				//console.log(_.join(findall[i]["path"], "->"));
				if (ind == -1){				
					tab_datasetname.push(objfind["dataset_name"]);
					tab_mappingtype.push(findall[i]["mapping_type"].replace("mapping", "matching"));
					tab_distance.push(findall[i]["distance"]);
                    tab_classpath.push(classpath);
				} else {
					if (parseInt(findall[i]["distance"])<parseInt(tab_distance[ind])) {
						tab_distance[ind]= findall[i]["distance"];
						tab_mappingtype[ind]= findall[i]["mapping_type"].replace("mapping", "matching");
                        tab_classpath[ind]= classpath;
					}
				}
            }

			var resultobj = {};
            resultobj["result_datasetname"] = _.join(tab_datasetname, ";");
            resultobj["result_mappingtype"] = _.join(tab_mappingtype, ";");
            resultobj["result_distance"] = _.join(tab_distance, ";");
            resultobj["result_nbdataset"] = tab_datasetname.length;
            resultobj["result_classpath"]= _.join(tab_classpath, ";");
			var calcul=0;
            for (i=0; i<tab_distance.length;i++){
				calcul= calcul+parseInt(tab_distance[i]);
			}
			if (tab_distance.length>0) resultobj["result_average"] = calcul/tab_distance.length;
            else resultobj["result_average"] = "";

            return _.assignIn(obj, resultobj);
        });

        return resultMerge;


    },
    /**
     * saveMatch
     * @param button
     */
    saveMatch: function(button) {
        var filename = "result.xlsx";
        var storeMatching= Ext.getStore('S_MatchingInfo');
        var enrInfo= storeMatching.getById(button.tag);
        var keysData= enrInfo.get('keysData');

        var keys_dataset= _.concat(["result_id","result_distance","result_classpath","result_mapping","result_nb","result_average"],keysData);
        var keys_network= ["name", "dbIdentifier","result_datasetname", "result_distance","result_classpath","result_nbdataset","result_average","result_mappingtype"];



        var data_dataset= MetExplore.globals.StoreUtils.jsonTotab(enrInfo.get('jsonDataset'), keys_dataset);
        var data_network= MetExplore.globals.StoreUtils.jsonTotab(enrInfo.get('jsonNetwork'), keys_network);

        var colsData= enrInfo.get('colsData');
        for (i=0; i<colsData.length; i++){
            if(colsData[i]!="dataset_name") {
                colsData[i]= "dataset_"+colsData[i];
            }
        }
        //console.log(this.colsData);

        data_dataset=_.concat([_.concat(["result_BioSourceIdentifier","result_distance","result_classpath","result_matchingType","result_nbMatched","result_averagedistance"],colsData)],data_dataset);

        data_network=_.concat([["BioSource_name", "BioSource_Identifier","dataset_name", "distance","classpath","nbdataset_mapped","average_distance","matching_type"]],data_network);

        //console.log(data_dataset);
        //console.log(data_network);
        var ws_name1 = "Dataset";
        var ws_name2 = "Metabolites";

        if(typeof console !== 'undefined') console.log(new Date());
        var wb = XLSX.utils.book_new();
        var ws1 = XLSX.utils.aoa_to_sheet(data_dataset);
        var ws2 = XLSX.utils.aoa_to_sheet(data_network);

        /* add worksheet to workbook */
        XLSX.utils.book_append_sheet(wb, ws1, ws_name1);
        XLSX.utils.book_append_sheet(wb, ws2, ws_name2);

        /* write workbook */
        if(typeof console !== 'undefined') console.log(new Date());
        XLSX.writeFile(wb, filename, {"type":"base64"});
        if(typeof console !== 'undefined') console.log(new Date());


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
            if (panel.items.items[0].xtype == "formIdentifierMatcher") {
                panel.query('button[action=matchIdentifier]')[0].disable();

                panel.query('checkboxfield[name=classmapping]')[0].disable();

                panel.query('checkboxfield[name=header]')[0].disable();
                //panel.query('button[name=saveMatch]')[0].setVisible(true);


            }
        }
    },

});