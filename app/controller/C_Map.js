/**
 * C_Map
 *
 */

Ext.define('MetExplore.controller.C_Map', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session'],

    config: {
        views: ['form.V_Map']
    },

    /**
     * init function Checks the changes on the bioSource selection
     *
     */
    init: function() {
        var me = this;

        this.control({
            'fieldset[name=takingInAccountChemicalLibrary]': {

                afterrender: function(form){
                    var panel = Ext.getCmp('tabPanel').getActiveTab();

                    panel.useChemicalLibraryBackground=false;
                    panel.metabolitesFromChemicalLibrary=[];
                    panel.chemicalLibraryName=undefined;
                    panel.idmapping="";

                    form.el.down('input').on('click', function(e,div,g){
                        var bool = false;
                        if(div.checked){
                            bool=true;
                            me.setChemicalLibrary(true, panel);
                            form.expand();
                        }else{
                            form.collapse();
                            me.setChemicalLibrary(false, panel);
                        }
                        form.setDisabled(!bool);

                        form.prev('hiddenfield[name=takingInAccountChemicalLibrary]').setValue(!bool);

                    },this);
                }
            },
            'fileuploadfield[name=inputChemicalLibrary]': {
                change: function(form, value, eOpts) {

                    var me = this;

                    function handleFileSelect(input, func) {

                        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                            alert('The File APIs are not fully supported in this browser.');
                            return;
                        }

                        if (!input) {
                            alert("couldn't find the fileinput element.");
                        } else if (!input.files) {
                            alert("This browser doesn't seem to support the `files` property of file inputs.");
                        } else {
                            file = input.files[0];

                            var reader = new FileReader();
                            reader.onload = function() {
                                func(reader.result, file.name);
                            };
                            reader.readAsText(file);
                        }
                    }

                    handleFileSelect(form.fileInputEl.dom, function(tabTxt, title) {

                        var panel = Ext.getCmp('tabPanel').getActiveTab();
                        me.setChemicalLibraryName(title, panel);

                        tabTxt = tabTxt.replace(/\r/g, "");
                        tabTxt = tabTxt.replace(" ", "");
                        var lines = tabTxt.split('\n');

                        var notValidMetabolites = [];
                        var validMetabolites = [];
                        var storeMetabolite = Ext.getStore("S_Metabolite");
                        var nbMetaboliteInBiosource = storeMetabolite.data.length;
                        var nbMetaboliteInLibrary = lines.length;

                        lines.forEach(function (id) {
                            var metabFound = storeMetabolite.getByDBIdentifier(id);
                            if(metabFound!==null)
                            {
                                validMetabolites.push(metabFound.getId());
                            }
                            else
                            {
                                notValidMetabolites.push(id);
                            }
                        });

                        if(notValidMetabolites.length>0){
                            Ext.Msg.show({
                                title:'Warning',
                                msg: 'These metabolites are not found : '+notValidMetabolites.join(", "),
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.WARNING
                            });
                        }

                        me.setMetabolitesFromChemicalLibrary(validMetabolites, panel);





                        var sets = [{sets: ['Biosource'], size: nbMetaboliteInBiosource},
                            {sets: ['Library'], size: nbMetaboliteInLibrary},
                            {sets: ['Biosource', 'Library'], size: validMetabolites.length}];

                        var chart = venn.VennDiagram();

                        var panel = Ext.getCmp('tabPanel').getActiveTab();

                        d3.select("#"+panel.down('panel[forId=venn]').el.id+"-innerCt").datum(sets).call(chart);
                        var svg = d3.select("#"+panel.down('panel[forId=venn]').el.id+"-innerCt").select('svg');
                        var h = svg.attr('height');
                        panel.down('panel[forId=venn]').setHeight(parseInt(h)+30);

                    });
                }
            },
            'formMap button[action=map]': {
                click: this.map
            },
            'formMap button[action=exportJsonFile]': {
                click: this.exportJsonFile
            }
            // 'formMap button[action=saveMappingDB]': {
            //     click: this.saveMappingDB
            // }
        });
    },

    /**
     * addFormMap
     *  create tab mapping with default value in form
     * @param {} ObjectMap
     * @param {} FieldMap
     * @param {} NbCond
     * @param {} nameData
     */
    addFormMap: function(ObjectMap, FieldMap, NbCond, nameData, infoMap) {

        var tabPanel = Ext.getCmp('tabPanel');

        var newTab = tabPanel.add({
            title: 'Mapping',
            closable: true,
            items: [{
                xtype: 'formMap'
            }]
        });
        newTab.show();

        newTab.query('combo')[0].setRawValue(ObjectMap);
        newTab.query('combo')[1].setRawValue(FieldMap);

        var gridData = newTab.query('gridData')[0];

        var storeData = Ext.getStore(nameData);
        gridData.reconfigure(storeData);

        var ctrlGrid = MetExplore.app.getController('C_gridData');
        ctrlGrid.removeColumnGrid(gridData);
        if (NbCond > 0) ctrlGrid.addColumnGrid(gridData, NbCond);


    },

    /**
     * @method addCols
     * ajoute les colonnes conditions de mapping
     * Creation d'un tableau de colonnes (toutes les colonnes de conditions)
     * si colonne est une colonne identifiee 'map*'
     *        ajoute cette colonne au modele de l'Object (par ex Metabolite, ajout field M(numeroMapping)map0,...)
     *        modifie la grid correspondante
     * @param {string} columnsMapping    tableau liste des colonne de gridData
     * @param {string} objectName
     */
    addColsGrid: function(objectMap, mapInfo, nbCond) {

        //
        //Ext.suspendEvents();
        var columns = new Array();
        var col = Ext.create('Ext.grid.column.Column', {
            header: 'identified',
            dataIndex: mapInfo + 'identified',
            filterable: true,
            hideable: false,
            sortable: true
        });
        columns.push(col);

        for (var i = 0; i < nbCond; i++) {


            var col = Ext.create('Ext.grid.column.Column', {
                header: 'Condition' + i,
                dataIndex: mapInfo + 'map' + i,
                filterable: true,
                hideable: false,
                sortable: true
            });
            columns.push(col);
        }


        /**
         * Ajout d'une colonne Mapping_numero de mapping contenant un
         * tableau de colonnes de conditions
         */
        var grid = Ext.getCmp('grid' + objectMap);
        //grid.suspendEvents();

        var col = Ext.create('Ext.grid.column.Column', {
            header: 'Mapping_' + mapInfo,
            filterable: true,
            hideable: false,
            headerId: mapInfo,
            //width:70,
            //id : mapInfo,
            // sortable : true,
            columns: columns
        });

        if (grid) {
            grid.headerCt.add(grid.columns.length, col);
            grid.columns.length = grid.columns.length + 1;
            /**
             * bug nombre de data affichees apres mapping (ticket 532)
             */
            // var store= grid.getStore();
            // this.reconfigure(store);
            // this.getView().refresh();
            // var bufferId= 'buffer'+grid.id;
            // var plugin= grid.getPlugin(bufferId);
            // if (plugin) plugin.scrollTo(0);

            //grid.updateLayout();
        }
        //grid.resumeEvents();

    },


    /**
     * mappingData
     * @param {} nameStoreNetwork
     * @param {} nameStoreData
     * @param {} nameStoreOut
     * @param {} mapInfo
     */
    mappingData: function(nameStoreNetwork, nameStoreData, nameStoreOut, mapInfo) {


        storeNetwork = Ext.getStore(nameStoreNetwork);
        storeData = Ext.getStore(nameStoreData);
        //

        if (nameStoreOut != '') {
            storeOut = Ext.getStore(nameStoreOut);
        } else {
            storeOut = Ext.getStore(nameStoreNetwork);
        }


        storeMappingInfo = Ext.getStore('S_MappingInfo');
        var recInfo = storeMappingInfo.getById(mapInfo);
        //var nbMapped=0;

        if (recInfo) {
            object = recInfo.get('object');
            field = recInfo.get('field');
            numero = recInfo.get('numero');

            tabIdRec = [];

            storeNetwork.each(function(dataNetwork) {

                var recMap = storeData.findRecord('idMap', dataNetwork.get(field), 0, false, true, true);
                if (recMap) {
                    //var nbMapping= nbMapped+1;
                    recMap.set('identified', true);
                    //
                    dataNetwork.set(mapInfo + 'identified', true);

                    var idNetwork = dataNetwork.get('id');
                    if (idNetwork) {
                        recOut = storeOut.getById(idNetwork);
                        tabIdRec.push(idNetwork);
                        if (recOut) {
                            var mapped = recOut.get('mapped') + 1;
                            recOut.set(mapInfo + 'identified', true);
                            recOut.set('mapped', mapped);
                        }
                    }
                    //}
                    //
                } else {
                    //rec.set('identified',false);
                    dataNetwork.set(mapInfo + 'identified', false);
                }
            });

            recInfo.set('nbData', storeData.getCount());
            recInfo.set('nbMapped', tabIdRec.length);
            recInfo.set('idMapped', tabIdRec.join());

            storeData.filter("identified", true);

            var nbDataNetwork = storeData.getCount();
            storeData.clearFilter();

            recInfo.set('nbDataInNetwork', nbDataNetwork);
        }

        //Ext.callback(this.doLayoutMapping(recInfo));


    },
    /**
     * loadMapping
     * @param {} idMapping
     */
    loadMapping: function(idMapping) {
        var ctrl = MetExplore.app.getController('C_Map');
        Ext.Ajax.request({
            url: 'resources/src/php/map/loadMapping.php',
            params: {
                idMapping: idMapping
            },
            timeout: 300000,
            success: function(response, opts) {

                var results = Ext.decode(response.responseText)["results"];
                //
                //

                if (results != undefined) {

                    var param = {
                        idBioSource: results.idBiosource
                    };

                    MetExplore.globals.Session.initSession(param, function() {
                        /**
                         * ajout dans storeS_MappingInfo
                         */
                        var storeMapInfo = Ext.getStore('S_MappingInfo');
                        var tabNbMap = results.idsMapped.split(',');
                        var nb = tabNbMap.length;
                        var num = storeMapInfo.addMappingInfo(results.element, results.field, results.idBiosource, results.idsMapped, "", "", nb, results.nbrOfInputData);
                        // ajout init viz
                        var mapping = {
                            'id': 'M' + num,
                            'name': '',
                            'object': results.element,
                            'field': results.field,
                            'numero': num,
                            'title': "Mapping",
                            'idBioSource': results.idBiosource,
                            'sizeObject': results.nbrOfInputData,
                            'coverCondition': false,
                            'condName': ""
                        };
                        console.log("loadMAp");
                        ctrl= MetExplore.app.getController("C_Map");
                        ctrl.initMappingInVisualization(mapping, num, false);
                        /**
                         objectName, fieldName, idBioSource, idMapped, condName, storeMap, nbMapped, nbData, title
                         */
                    });
                    //								var ctrlBioSource = MetExplore.app.getController('C_BioSource');
                    //
                    //								ctrlBioSource.updateSessionBioSource(parseInt(results.idBiosource));
                    //								ctrlBioSource.updateGrid(results.idBiosource);

                }

            },

            failure: function(response, opts) {
                Ext.MessageBox.alert('server-side failure with status code ' + response.status);
            }
        });
    },


    /**
     * @method map
     * Recupere le contenu du formulaire de mapping
     * Recupere les data de mapping
     * Execute mapping
     */
    map: function(button, inchi) {
        var ctrl = MetExplore.app.getController('C_Map');
        var panel = Ext.getCmp('tabPanel').getActiveTab();
        var myMask = new Ext.LoadMask({
            target: panel, // Here myPanel is the component you wish to mask
            msg: "Please wait..."
        });
        myMask.show();

        panel.query('button[action=map]')[0].disable();

        var objectName = panel.query('combo[name=object]')[0].getRawValue();
        var fieldName = panel.query('combo[name=field]')[0].getRawValue();


        var mappingType = 0;
        if (panel.query('checkboxfield[name=mapping_type]')[0].getValue() == true) {
            mappingType = 1;
        }

        //
        var cover = panel.query('combo[name=coverage]')[0].getValue();

        Ext.suspendLayouts();
        //tester si  store filtre
        var storeData = Ext.getStore('S_' + objectName);
        if (storeData.getTotalCount() > storeData.getCount()) {
            // Ext.MessageBox.confirm('Mapping on filter network', 'Do you want to remove filter on grid before mapping?', function(btn) {
            // 	//
            // 	if (btn == 'yes') {
            var controlBioSource = MetExplore.app.getController('C_BioSource');
            controlBioSource.delFiltersGrid();
            var control = MetExplore.app.getController('C_GenericGrid');
            control.delfilterGrid();
            // 	}
            // });
        }
        if (fieldName == 'EC') fieldName = 'ec';
        if (fieldName == 'Identifier') fieldName = 'dbIdentifier';
        else if (fieldName == 'Monoisotopic Mass') fieldName = 'weight';
        //
        var ppm = panel.query('textfield[name=ppm]')[0].getRawValue();

        var gridData = panel.query('gridData')[0];
        var colData = gridData.headerCt.gridDataColumns;
        var nameMap = panel.query('textfield[name=mapping_name]')[0].getRawValue();

        //recherche si existe dans mappingInfo (si nom existe mettre nom+
        var search = 0;

        var storeMapInfo = Ext.getStore('S_MappingInfo');
        do {
            var recInfo = storeMapInfo.findRecord('title', nameMap);
            if (recInfo) {
                nameMap = 'Mapping_' + (recInfo.get('numero') + 1);
            } else search = 1;
        } while (search == 0);


        //if (nameMap=="Mapping" || nameMap=='') nameMap= "Mapping_"+numero;
        panel.setTitle(nameMap);

        var index = gridData.headerCt.items.findIndex('dataIndex', 'identified');
        gridData.columns[index].setVisible(true);

        if (mappingType == 0) {
            var numero = ctrl.addInfoMapping(objectName, fieldName, colData, nameMap, cover);
            panel.query('textfield[name=id]')[0].setValue('M' + numero);
            panel.idmapping= 'M' + numero;

            /**
             * Copy Colonne du gridData au grid du Network
             */
            ctrl.addCols(colData, objectName, numero, nameMap);

            /**
             * init store for order
             */
            ctrl.initStore(objectName, colData, numero);

            /**
             * ajout data dans gridNetwork
             * pour toutes les data du grid Data pour mapping
             *        ajout dans le store du grid de l'object mappe les data conditions
             */
            var Listid = new Array();

            if (inchi == 'inchipeakforest') var storeDataMap = Ext.getStore('S_InchiPeakForest');
            else var storeDataMap = gridData.getStore();

            storeDataMap.each(function(dataMapping) {
                var id = new Array();

                switch (fieldName) {
                    case 'weight':
                        var id = ctrl.addDataMapWeight(dataMapping, colData, numero, ppm);
                        break;
                    case 'inchi':
                        //var store = Ext.getStore('S_MetaboliteInchiSvg');
                        var id = ctrl.addDataMapInchi(dataMapping, colData, numero);
                        break;
                    default:
                        var id = ctrl.addDataMap(dataMapping, colData, numero, objectName, fieldName);

                }


                if (id.length > 0) {
                    dataMapping.set('identified', true);
                } else dataMapping.set('identified', false);

                dataMapping.set('idSql', id.join());
                Listid = Listid.concat(id);

            });
            Listid = _.uniq(Listid);
            var storeMapInfo = Ext.getStore('S_MappingInfo');
            var recInfo = storeMapInfo.findRecord('numero', numero);
            if (recInfo) {
                recInfo.set('nbData', storeDataMap.getCount());
                recInfo.set('nbMapped', Listid.length);
                storeDataMap.filter("identified", true);
                //
                var nbDataNetwork = storeDataMap.getCount();
                storeDataMap.clearFilter();

                recInfo.set('nbDataInNetwork', nbDataNetwork);
                //recInfo.set('nbDataInNetwork', Listid.length);
                recInfo.set('idMapped', Listid.join());
                //var resultMapping= panel.query('text[name=resultMapping]')[0];
                //resultMapping.text= 'Nb Data :' +storeDataMap.getCount()+' Nb Mapped :' +Listid.length;
            }
            ctrl.addReport(numero, 1);
            /*
             * Test si data filtree et affichage warning
             */
            //var txtWarning = panel.query('text')[0];

            /**------------------------------------------------------------------------
             * Pathway Coverage
             *        calcul de la couverture Metabolite
             */
            if ((objectName == 'Reaction' || objectName == 'Metabolite' || objectName == 'Gene' || objectName == 'Protein' || objectName == 'Enzyme') && Listid.length > 0) {
                ctrl.coverage(numero, storeDataMap, cover, myMask);

                Ext.callback(this.maskHide(myMask), this);
            } else {
                Ext.callback(this.maskHide(myMask), this);
                //
            }

            if (objectName == 'Pathway'){
                Ext.callback(this.afterMapInGrid(MetExplore.globals.Session.mappingObjViz[numero]), this);
            }
        } else {
            //mapping multiple
            var nbCol = colData.length - 3; //col num et col identified et col a mapper
            //
            var num1 = ctrl.addInfoMultiMapping(objectName, fieldName, colData, nameMap, cover);

            var id = 'M' + num1;
            var numeros = [num1];
            for (i = num1 + 1; i < num1 + nbCol; i++) {
                id = id + ',M' + i;
                numeros.push(i);
            }

            panel.query('textfield[name=id]')[0].setValue(id);
            panel.idmapping= id;
            //console.log('panel',panel);
            //
            /**
             * init store for order
             */
            ctrl.initStoreMulti(objectName, nbCol, num1);
            var storeDataMap = gridData.getStore();
            //var resultMapping= panel.query('text[name=resultMapping]')[0];
            //resultMapping.text= 'Nb Data :' +storeDataMap.getCount();
            ctrl.addDataMultiMap(storeDataMap, colData, num1, objectName, fieldName);
            ctrl.addReport(num1, nbCol);
            // add coverage
            if ((objectName == 'Reaction' || objectName == 'Metabolite' || objectName == 'Gene' || objectName == 'Protein' || objectName == 'Enzyme')) {
                ctrl.coverageMulti(num1, nbCol, myMask);
            } else {
                Ext.callback(ctrl.maskHide(myMask), this);
            }

            if (objectName == 'Pathway'){
                for (i = 0; i < nbCol; i++) {
                    var numMap = num1 + i;
                    Ext.callback(ctrl.afterMapInGrid(MetExplore.globals.Session.mappingObjViz[numMap]), ctrl);
                }
            }
        }
        Ext.resumeLayouts(true);
    },

    /**********************
     * Map node on visualisation
     * @param {} mapping : MappingInfo store corresponding to last mapping
     */
    afterMapInGrid: function(mapping) {
        MetExploreViz.onloadMetExploreViz(function() {
            metExploreViz.onloadSession(function() {

                metExploreViz.GraphMapping.loadDataFromJSON(JSON.stringify(mapping));
            });
        });
    },

    /**********************
     * Map node on visualisation
     * @param {} mapping : MappingInfo store corresponding to last mapping
     */
    initMappingInVisualization: function(mapping, numero, itsCoverage, seeds, data) {
        // console.log("initMappingInVisualization");
        // console.log(mapping);
        // console.log(numero);
        // console.log(itsCoverage);
        // console.log(seeds);
        // console.log(data);
        // console.log("-----");

        var activeMapping;
        if (itsCoverage)
            activeMapping = MetExplore.globals.Session.mappingCoverageViz;
        else
            activeMapping = MetExplore.globals.Session.mappingObjViz;

        // if(activeMapping.filter(function(mapping){return mapping.seeds!=undefined}).length==0)
        //           	Ext.getCmp("mappingVizPanel").hide();

        if (mapping.object != "Gene" || mapping.object == 'Enzyme' || mapping.object == 'Protein') {
            activeMapping[numero] = {};
            activeMapping[numero].name = mapping.title;
            activeMapping[numero].id = mapping.id;
            activeMapping[numero].seeds = seeds;
            activeMapping[numero].data = data;
            activeMapping[numero].mappings = [];
            activeMapping[numero].object = mapping.object;
            activeMapping[numero].targetLabel = mapping.object.toLowerCase() + "DBIdentifier";
            var condition = mapping.condName;

            if (condition != undefined) {
                if (condition.length > 0) {
                    condition.forEach(function(cond) {
                        var mapdata = {};
                        mapdata.name = cond;
                        mapdata.data = [];

                        activeMapping[numero].mappings.push(mapdata);
                    });
                    var mapdata = {};
                    mapdata.name = "PathwayCoverage";
                    mapdata.data = [];
                    activeMapping[numero].mappings.push(mapdata);
                    var mapdata = {};
                    mapdata.name = "PathwayEnrichment";
                    mapdata.data = [];
                    activeMapping[numero].mappings.push(mapdata);

                } else {
                    var mapdata = {};
                    mapdata.name = "undefined";
                    mapdata.data = [];
                    activeMapping[numero].mappings.push(mapdata);

                    mapdata = {};
                    mapdata.name = "PathwayCoverage";
                    mapdata.data = [];
                    activeMapping[numero].mappings.push(mapdata);
                    mapdata = {};
                    mapdata.name = "PathwayEnrichment";
                    mapdata.data = [];
                    activeMapping[numero].mappings.push(mapdata);
                }
            } else {
                var mapdata = {};
                mapdata.name = "undefined";
                mapdata.data = [];
                activeMapping[numero].mappings.push(mapdata);

                mapdata = {};
                mapdata.name = "PathwayCoverage";
                mapdata.data = [];
                activeMapping[numero].mappings.push(mapdata);
                mapdata = {};
                mapdata.name = "PathwayEnrichment";
                mapdata.data = [];
                activeMapping[numero].mappings.push(mapdata);
            }

            if (activeMapping.filter(function(mapping) {
                    return mapping.seeds != undefined || mapping.data != undefined
                }).length > 0)

                Ext.getCmp("mappingVizPanel").show();

        } else {
            if (itsCoverage) {
                activeMapping[numero] = {};
                activeMapping[numero].name = mapping.title;
                activeMapping[numero].id = mapping.id;
                activeMapping[numero].mappings = [];
                activeMapping[numero].targetLabel = "reactionDBIdentifier";

                var mapdata = {};
                mapdata.name = "Nb_of_Mapped";
                mapdata.data = [];

                activeMapping[numero].mappings.push(mapdata);

                var conditions = mapping.condName;
                if (conditions.length > 0 && mapping.coverCondition != 'without') {
                    conditions.forEach(function(cond) {
                        var mapdata = {};
                        mapdata.name = cond + ' (' + mapping.coverCondition + ')';
                        mapdata.data = [];

                        activeMapping[numero].mappings.push(mapdata);
                    });
                }

                mapdata = {};
                mapdata.name = "PathwayCoverage";
                mapdata.data = [];
                activeMapping[numero].mappings.push(mapdata);
                mapdata = {};
                mapdata.name = "PathwayEnrichment";
                mapdata.data = [];
                activeMapping[numero].mappings.push(mapdata);
            }

        }
    },

    /**********************
     * Map node on visualisation
     * @param {} mapping : MappingInfo store corresponding to last mapping
     */
    dataMappingInVisualization: function(conditionName, dbIdentifier, val, numMap, itsCoverage) {
        console.log("dataMappingInVisualization");
        // console.log(conditionName);
        // console.log(dbIdentifier);
        // console.log(val);
        // console.log(numMap);
        // console.log(itsCoverage);
        // console.log("-----");

        var activeMapping;
        if (itsCoverage)
            activeMapping = MetExplore.globals.Session.mappingCoverageViz;
        else
            activeMapping = MetExplore.globals.Session.mappingObjViz;
        
        console.log("activeMapping",activeMapping);
        console.log("-----");  
            
        if (activeMapping[numMap].mappings[0].name != "undefined") {


            var mapArrayMapDatas = activeMapping[numMap].mappings.filter(function(condition) {
                return conditionName == condition.name;
            });

            var mapdata = mapArrayMapDatas[0];


            if (mapdata != undefined) {
                if (conditionName != "undefined") {
                    var nodedata = {};
                    nodedata.node = dbIdentifier;
                    nodedata.value = val;
                    mapdata.data.push(nodedata);
                } else {
                    var nodedata = {};
                    nodedata.node = dbIdentifier;
                    mapdata.data.push(nodedata);
                }
            }
        } else {
            var mapdata = activeMapping[numMap].mappings[0];

            if (mapdata != undefined && conditionName == "Identified") {
                var nodedata = {};
                nodedata.node = dbIdentifier;
                mapdata.data.push(nodedata);
            }

            var mapArrayMapDatas = activeMapping[numMap].mappings.filter(function(condition) {
                return conditionName == condition.name;
            });
            var mapdata = mapArrayMapDatas[0];


            if (mapdata != undefined && conditionName != "Identified") {
                var nodedata = {};
                nodedata.node = dbIdentifier;
                nodedata.value = val;
                mapdata.data.push(nodedata);
            }
        }
    },

    addReport: function(num, nb) {

        var panel = Ext.getCmp('tabPanel').getActiveTab();
        var report = panel.query('displayfield[name=resultMapping]')[0];
        var storeMapInfo = Ext.getStore('S_MappingInfo');
        var txt = '';
        for (i = num; i < num + nb; i++) {

            var recInfo = storeMapInfo.findRecord('numero', i);
            if (recInfo) {
                var nbMapped = recInfo.get('nbMapped');
                var nbData = recInfo.get('nbData');
                var nbDataInNetwork = recInfo.get('nbDataInNetwork');
                //var pourcent= parseInt(nbDataInNetwork*10000/nbData)/100;
                txt = txt + '<br /><b>&nbsp&nbsp&nbsp' + recInfo.get('title') + '</b>&nbsp&nbsp&nbsp<u>Nb Data:</u> ' + nbData + '</b>&nbsp&nbsp&nbspNb Data In Network: ' + nbDataInNetwork + '&nbsp&nbsp&nbspNb Mapped: ' + nbMapped; // +'&nbsp&nbsp&nbsp%: '+pourcent;
            }
        }


        report.setValue(txt);

    },

    maskHide: function(mask) {
        if (mask) mask.hide();

        var panel = Ext.getCmp('tabPanel').getActiveTab();
        if (panel.items.items[0] != undefined) {
            if (panel.items.items[0].xtype == "formMap") {
                panel.query('combo[name=coverage]')[0].disable();
                panel.query('checkboxfield[name=mapping_type]')[0].disable();
                panel.query('textfield[name=ppm]')[0].disable();
                panel.query('textfield[name=mapping_name]')[0].disable();
                //console.log(panel.query('gridData')[0]);
                panel.query('combo[name=object]')[0].disable();
                panel.query('combo[name=field]')[0].disable();
                panel.query('fileuploadfield')[0].disable();
                panel.query('combo[name=separator]')[0].disable();
                panel.query('checkboxfield[name=header]')[0].disable();
                panel.query('displayfield[name=resultMapping]')[0].setVisible(true);
                panel.query('button[name=save_mapping]')[0].setVisible(true);
                // if (MetExplore.globals.Session.idUser != -1) {
                //     panel.query('button[name=save_mappingDB]')[0].setVisible(true);
                // }

            }
        }
    },


    /**
     * @method addInfoMapping
     * Ajoute les infos de mapping dans S_Mapping
     * @param {string} objectName  Object sur lequel mapping (par defaut Metabolite)
     * @param {string} fieldName champs (par defaut dbIdentifier)
     *
     */
    addInfoMapping: function(objectName, fieldName, colData, nameMap, cover) {

        var ctrl = MetExplore.app.getController('C_Map');
        var condName = new Array();
        var nb = colData.length;
        for (i = 0; i < nb; i++) {

            var col = colData[i];
            if (col.dataIndex.indexOf('map') > -1) {

                condName.push(col.text);
            }
        }


        var idBioSource = MetExplore.globals.Session.idBioSource;

        //var storeMap = Ext.getStore('S_Mapping');
        var storeMapInfo = Ext.getStore('S_MappingInfo');

        if (storeMapInfo.last())
            var numero = storeMapInfo.last().get('numero') + 1;
        else
            var numero = 1;

        // if (nameMap=="Mapping") {
        // 	nameMap = "Mapping_" + numero;
        // }
        var coverCondition;
        if (cover == 1) {
            coverCondition = 'min';
        } else {
            if (cover == 2) {
                coverCondition = 'max';
            } else {
                if (cover == 3) {
                    coverCondition = 'average';
                } else {
                    coverCondition = 'without';
                }
            }
        }

        var store = Ext.getStore('S_' + objectName);
        var sizeObj = store.getCount();

        var mapping = {
            'id': 'M' + numero,
            'name': '',
            'object': objectName,
            'field': fieldName,
            'numero': numero,
            'title': nameMap,
            'idBioSource': idBioSource,
            'sizeObject': sizeObj,
            'coverCondition': coverCondition,
            'condName': condName
        };
        
        storeMapInfo.add(mapping);
        var itsCoverage = false;
        if (objectName != 'Gene' || objectName == 'Enzyme' || objectName == 'Protein')
            ctrl.initMappingInVisualization(mapping, numero, itsCoverage);


        return numero;
    },

    addInfoMultiMapping: function(objectName, fieldName, colData, nameMap, cover) {

        var ctrl = MetExplore.app.getController('C_Map');
        var idBioSource = MetExplore.globals.Session.idBioSource;

        var storeMapInfo = Ext.getStore('S_MappingInfo');

        if (storeMapInfo.last())
            var num1 = storeMapInfo.last().get('numero') + 1;
        else
            var num1 = 1;

        if (nameMap != "") nameMap = nameMap + "-";

        var nbCol = colData.length - 3; //col num et col identified et col a mapper

        var coverCondition;
        if (cover == 1) {
            coverCondition = 'min';
        } else {
            if (cover == 2) {
                coverCondition = 'max';
            } else {
                if (cover == 3) {
                    coverCondition = 'average';
                } else {
                    coverCondition = 'without';
                }
            }
        }
        for (i = 0; i < nbCol; i++) {

            var name = colData[3 + i].text;
            var condName = new Array();
            condName.push(name);
            var numero = num1 + i;

            var mapping = {
                'id': 'M' + numero,
                'name': '',
                'object': objectName,
                'field': fieldName,
                'numero': numero,
                'title': nameMap + name,
                'idBioSource': idBioSource,
                'coverCondition': coverCondition,
                'condName': condName
            };

            storeMapInfo.add(mapping);

            var itsCoverage = false;
            ctrl.initMappingInVisualization(mapping, numero, itsCoverage);
        }

        return num1;
    },

    /**
     * @method delGridMapping
     * @param {string} objectName  Object sur lequel mapping (par defaut Metabolite)
     * @param {string} actualNumber numero mapping a supprimer
     */
    delGridMapping: function(objectName, numero) {

        var grid = Ext.getCmp('grid' + objectName);

        var index = grid.headerCt.items.findIndex('id', 'M' + numero);

        if (index > -1) grid.headerCt.remove(index);
        //grid.getView().refresh();
        //si Metabolite, remove pathway coverage
        if (objectName == 'Metabolite') {
            var gridP = Ext.getCmp('gridPathway');
            var index = gridP.headerCt.items.findIndex('id', 'M' + numero);
            if (index > -1) gridP.headerCt.remove(index);
            //gridP.getView().refresh();
        }
    },


    /**
     * @method addCols
     * ajoute les colonnes conditions de mapping
     * Creation d'un tableau de colonnes (toutes les colonnes de conditions)
     * si colonne est une colonne identifiee 'map*'
     *        ajoute cette colonne au modele de l'Object (par ex Metabolite, ajout field M(numeroMapping)map0,...)
     *        modifie la grid correspondante
     * @param {string} columnsMapping    tableau liste des colonne de gridData
     * @param {string} objectName
     */
    addCols: function(columnsMapping, objectName, numero, nameMap) {

        //Ext.suspendEvents();
        var columns = new Array();
        // ajoute la col identified
        var sortTypeDESC = function(value) {
            if (value == ' ') {
                return Number.NEGATIVE_INFINITY;
            } else {
                if (isNaN(value)) {
                    return -100000000000000000;
                } else {
                    return parseFloat(value);
                }
            }
        };
        var sortTypeASC = function(value) {

            if (value == ' ') {
                return Number.POSITIVE_INFINITY;
            } else {
                if (isNaN(value)) {
                    return +100000000000000000;
                } else {
                    return parseFloat(value);
                }
            }
        };

        var col = Ext.create('Ext.grid.column.Column', {
            header: 'identified',
            dataIndex: 'M' + numero + 'identified',
            filterable: true,
            hideable: false,
            sortable: true
        });
        columns.push(col);

        for (var i = 3; i < columnsMapping.length; i++) {
            //
            colMap = columnsMapping[i];
            // si colonne.id contient map (elimine la colonne id = 2er colonne & colonne identified)
            //if (colMap.dataIndex.indexOf('map') != -1) {
            if (colMap.dataIndex != 'idMap') {
                // modify model (par exemple Metabolite)
                //this.modifyModel(objectName, colMap, numero);
                //this.addFieldsModel(objectName,colMap,'1');
                // modify grid : add colonne

                var col = Ext.create('Ext.grid.column.Column', {
                    header: colMap.text,
                    dataIndex: 'M' + numero + colMap.dataIndex,

                    filterable: true,
                    hideable: false,
                    tag_new:true,
                    sortable: true

                    // doSort: function(state) {
                    //     var field = this.getSortParam();
                    //     var model = MetExplore.app.getModel(objectName);
                    //     var fields = model.prototype.fields.getRange();
                    //
                    //     if (state =='ASC') {
                    //         fields[29].sortType= sortTypeASC;
                    //     } else {
                    //         fields[29].sortType= sortTypeDESC;
                    //     }
                    //     // storeGrid = Ext.getStore('S_' + objectName);
                    //     //
                    //     // storeGrid.sort({
                    //     //      property: field,
                    //     //      direction: state,
                    //     //      sorterFn: function(v1, v2) {
                    //     //          v1 = v1.get(field);
                    //     //          v2 = v2.get(field);
                    //     //          //var change;
                    //     //          //if (v1 === v2) return 0;
                    //     //          if (v1 == ' ') return -1;
                    //     //          if (isNaN(v1)) {
                    //     //              if (v2 == ' ') return -1;
                    //     //              else return +1;
                    //     //          }
                    //     //          if (isNaN(v2) || v2 == ' ') return -1;
                    //     //          v1 = parseFloat(v1);
                    //     //          v2 = parseFloat(v2);
                    //     //
                    //     //          return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
                    //     //      }
                    //     // });
                    // }

                });
                columns.push(col);
            }

        }
        /**
         * Ajout d'une colonne Mapping_numero de mapping contenant un
         * tableau de colonnes de conditions
         */
        var grid = Ext.getCmp('grid' + objectName);
        //grid.suspendEvents();
        var groupHeader= '<div>'+nameMap+"&nbsp;&nbsp;<img src='./resources/icons/delete.svg' width='15' height='15' class='icon-delete' style=\"cursor: pointer;\"  />"+'</div>';
        var col = Ext.create('Ext.grid.column.Column', {
            header: groupHeader,
            filterable: true,
            hideable: false,
            id: 'M' + numero,
            headerId: 'M' + numero,
            tag_new:true,
            columns: columns,
            listeners: {
                'afterrender': function(el1) {
                    //console.log(this.up());
                    //var grid= Ext.getCmp('gridReaction');
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
        //ajout du header pour suppression


        if (grid) {
            grid.headerCt.add(grid.headerCt.items.length, col);
            //grid.getView.refresh();
        }
        //grid.resumeEvents();

    },

    removeMapping : function (idMapping){
        Ext.MessageBox.confirm('remove Mapping', 'Do you want to remove Mapping?', function(btn) {
            //
            if (btn == 'yes') {
                var store = Ext.getStore('S_MappingInfo');
                var rec = store.getById(idMapping);
                if (rec) {
                    store.remove(rec);

                    var tabgrid=['gridPathway','gridReaction','gridMetabolite','gridEnzyme','gridProtein','gridGene'];

                    for (i=0; i<6; i++) {
                        var grid= Ext.getCmp(tabgrid[i]);
                        var index = grid.headerCt.items.findIndex('headerId',idMapping);

                        if (index > -1) {
                            grid.headerCt.remove(index);
                            grid.getView().refresh();
                        }
                    }
                    //recherche panel avec idMapping (i=4 : 3 premiers sont user, network,curation, viz)
                    var panels= Ext.getCmp('tabPanel');

                    for (i=5 ; i<panels.items.items.length; i++) {
                        if (panels.items.items[i].idmapping==idMapping) {
                            panels.items.items[i].destroy();
                        }
                    }

                }
            }
        });

    },

    doLayoutMapping: function(recInfo) {
        /*
         * layout tab mapping
         */
        var title = recInfo.get('title');
        var panel = Ext.getCmp('tabPanel').getActiveTab();
        //Ext.ComponentQuery.query('mainPanel > panel[title='+title+']')[0];
        /*Ext.ComponentQuery.query('mainPanel > panel[title=\"Mapping_'+numero+'\"]')[0];*/
        if (panel) {
            panel.setTitle(title);
            //enable report button
            var reportButton = panel.query('button[text=Coverage]')[0];
            if (reportButton) {
                reportButton.setDisabled(false);
            }

            //gridData identified column visible
            var gridData = panel.query('gridData')[0];
            if (gridData) {
                //console.log('store',gridData.getStore());
                var index = gridData.headerCt.items.findIndex('dataIndex', 'identified');
                if (index >= 0) {
                    gridData.columns[index].setVisible(true);
                };
            }
        }

        //				if (formMapping) {
        //					var report= formMapping.query('button[text=Reporting]')[0];
        //					if (report) {report.setDisabled(false);}
        //				}
        /*
         * layout grid network
         */
        // ajout couleur
        // var objectName = recInfo.get('object');
        // var grid = Ext.getCmp('grid' + objectName);
        // //grid.suspendEvents();
        // grid.getView().getRowClass = function(record, index) {
        //     if (record.get('mapped') == 0)
        //         return 'colorTransparent';
        //     else
        //         return 'colorMapped';
        //
        // };
        storeGrid = Ext.getStore('S_' + objectName);
        storeGrid.sort({
            property: 'mapped',
            direction: 'DESC'
        });
        //console.log(grid.getView());
        //grid.forceComponentLayout();

        /*
         * ATTENTION : Focus cree ralentissement important qd 3 mapping a la suite !!!
         */
        //redessiner
        //grid.doLayout();
        //grid.resumeEvents();
        // Ajout LC Focus on the table
        //				var networkPanel = Ext.getCmp('networkData');
        //				mainPanel = networkPanel.up("panel");
        //				mainPanel.setActiveTab(networkPanel);
        //				networkPanel.setActiveTab(grid);


    },
    miseForme: function(objectName) {
        // ajout couleur
        /*
         var grid = Ext.getCmp('grid' + objectName);
         //grid.suspendEvents();

         grid.getView().getRowClass = function(record, index) {
         if (record.get('mapped') == 0)
         return 'colorTransparent';
         else
         return 'colorMapped';

         };
         */
        storeGrid = Ext.getStore('S_' + objectName);
        storeGrid.sort({
            property: 'mapped',
            direction: 'DESC'
        });
        //console.log(grid.getView());
        //grid.forceComponentLayout();
        //grid.updateLayout();
        /*
         * ATTENTION : Focus cree ralentissement important qd 3 mapping a la suite !!!
         */
        //redessiner
        //grid.doLayout();
        //grid.resumeEvents();
        // Ajout LC Focus on the table
        //				var networkPanel = Ext.getCmp('networkData');
        //				//console.log(networkPanel.getLayout());
        //				var mainPanel = networkPanel.up("panel");
        //				mainPanel.setActiveTab(networkPanel);
        //				var gridId= 'grid'+objectName;
        //				networkPanel.getLayout().setActiveItem(gridId);


    },


    /**-----------------------------------------------------------------------------
     * modify modele de l'object avec info contenu dans record
     * par ex : qd mapping metabolite :
     *        modifie le modele metabolite avec autant de conditions ajoutees
     *        affecte le store correspondant a ce modele avec valeur NaN
     */
    /*			modifyModel : function(object, record, numero) {


     var model = MetExplore.app.getModel(object);
     //
     var fields = model.prototype.fields.getRange();
     //
     fields.push({
     name : 'M' + numero + record.dataIndex,
     type: record.type

     });

     model.setFields(fields);

     // affectation de valeur pour le champs ajoute dans le modele
     store = Ext.getStore('S_' + object);
     store.each(function(rec) {
     if (record.dataIndex != 'identified') {
     var id = rec.set('M' + numero + record.dataIndex, 0);
     } else {
     var id = rec.set('M' + numero + record.dataIndex, false);
     }
     });
     store.commitChanges();
     },*/

    initStore: function(object, colMap, numero) {
        //initialiser le modele
        var model = MetExplore.app.getModel(object);
        var fields = model.prototype.fields.getRange();
        var store = Ext.getStore('S_' + object);

        for (var i = 0; i < colMap.length; i++) {
            var col = colMap[i];
            if (col.dataIndex == 'identified') {
                fields.push({
                    name: 'M' + numero + col.dataIndex,
                    type: 'bool',
                    defaultValue: false

                })
            }
            if ((col.dataIndex != 'idMap') && (col.dataIndex != 'identified')) {
                fields.push({
                    name: 'M' + numero + col.dataIndex,
                    defaultValue: ' ',
                    sortType: function(value) {
                        var grid = Ext.getCmp('grid' + object);
                        var sorter = store.sorters.getAt(0);
                        var dir = sorter.direction;
                        if (value == '0') {
                            return parseFloat(0);
                        }

                        if (value == ' ') {
                            //
                            if (dir == 'ASC') return Number.POSITIVE_INFINITY;
                            else return Number.NEGATIVE_INFINITY;
                        } else {
                            //
                            if (isNaN(value)) {
                                if (dir == 'ASC') return +100000000000000000;
                                else return -100000000000000000;
                            } else {
                                return parseFloat(value);
                            }
                        }
                    }
                })
            }

        }

        model.setFields(fields);
        //
        var store = Ext.getStore('S_' + object);

        store.each(function(rec) {
            //rec.set('M'+numero+'identified', true);
            try {
                rec.set('M' + numero + 'identified', false);
            } catch (err) {}

            for (var i = 0; i < colMap.length; i++) {
                var col = colMap[i];
                // elimine la colonne id
                //
                if ((col.dataIndex != 'idMap') && (col.dataIndex != 'identified')) {
                    try {
                        rec.set('M' + numero + col.dataIndex, ' ');
                    } catch (err) {}
                }
            }
            // try {
            //     rec.commit();
            // } catch (err) {}

        });
        //store.commitChanges();
    },

    initStoreMulti: function(object, nbCol, num1) {

        //initialiser le modele
        var model = MetExplore.app.getModel(object);
        var fields = model.prototype.fields.getRange();
        var store = Ext.getStore('S_' + object);

        for (var i = 0; i < nbCol; i++) {

            var numMap = num1 + i;

            fields.push({
                name: 'M' + numMap + 'map0',

                sortType: function(value) {

                    var grid = Ext.getCmp('grid' + object);
                    var sorter = store.sorters.getAt(0);
                    var dir = sorter.direction;

                    if (value == ' ') {
                        if (dir == 'ASC') return Number.POSITIVE_INFINITY;
                        else return Number.NEGATIVE_INFINITY;
                    } else {
                        if (isNaN(value)) {
                            if (dir == 'ASC') return +100000000000000000;
                            else return -100000000000000000;
                        } else {
                            return parseFloat(value);
                        }
                    }
                }
            })
        }

        model.setFields(fields);
        // init data store
        var store = Ext.getStore('S_' + object);
        store.each(function(rec) {

            for (var i = 0; i < nbCol; i++) {
                //var col = colMap[i];
                var numMap = num1 + i;
                try {
                    rec.set('M' + numMap + 'map0', " ");
                } catch (err) {}

            }
            // try {
            //     rec.commit();
            // } catch (err) {}
        });
        //store.commitChanges();
        //
    },

    /**---------------------------------------------------------------------------
     * modify grid en ajoutant colonne (header = record.text / data = record.id
     * par ex : qd mapping metabolite :
     *        ajoute colonne a gridMetabolite avec configuration contenu dans record
     */
    /*			modifyGrid : function(grid, col, numero) {
     var grid = Ext.getCmp(grid);
     var column = Ext.create('Ext.grid.column.Column', {
     header : 'Map' + numero + col.text,
     dataIndex : 'M' + numero + col.dataIndex,
     filterable : true,
     hideable : false,
     flex : 1,
     sortable : true
     });
     if (grid) grid.headerCt.insert(grid.columns.length, column);

     },*/

    /**------------------------------------------------------------------------
     * affecte les donnees de condition de mapping au store
     * par ex : qd mapping metabolite, modele modifie & colonne grid ajoutee
     *         affecte les data des conditions mapping dans le S_Metabolite
     */
    addDataMap: function(dataMap, colMap, numero, object, element) {

        var ctrl = MetExplore.app.getController('C_Map');

        var store = Ext.getStore('S_' + object);
        //
        var val = dataMap.get('idMap');
        //
        var tabIdRec = new Array();
        //
        var start = 0;
        do {
            //
            var rec = store.findRecord(element, dataMap.get('idMap'), start, false, true, true);
            //
            if (rec) {
                var idrec = rec.get('id');
                //
                //
                //console.log(tabIdRec.indexOf(idrec));
                if (tabIdRec.indexOf(idrec) == -1) {
                    tabIdRec.push(idrec);
                }
                start = store.indexOf(rec) + 1;
                //dataMap.set('identified',true);
                try {
                    dataMap.set('identified', true);
                } catch (err) {};

                ctrl.addConditions(rec.get('id'), object, dataMap, colMap, numero);

            } //else data.set('identified',false);

        } while (rec != null);
        //store.commitChanges();

        return tabIdRec;
    },


    addDataMultiMap: function(storeDataMap, colMap, num1, object, element) {
        var ctrl = MetExplore.app.getController('C_Map');
        //console.log(colMap)
        var store = Ext.getStore('S_' + object);

        var storeMapInfo = Ext.getStore('S_MappingInfo');

        // if (recInfo) {
        // 	recInfo.set('nbData',storeDataMap.getCount());
        // 	recInfo.set('nbMapped',Listid.length);
        // 	recInfo.set('idMapped',Listid.join());
        // }

        var nbCol = colMap.length - 3; //col num et col identified et col a mapper
        //
        //var tabId = new Array();
        //var tabMap = new Array(nbCol);
        //var tabIdRec= new Array(tabMap,tabId);
        var tabIdRec = new Array();
        for (i = 0; i < nbCol; i++) {
            tabIdRec[i] = new Array();
        }
        //var nbDataNetwork=0;

        storeDataMap.each(function(dataMap) {
            var valId = dataMap.get('idMap');
            for (i = 0; i < nbCol; i++) {
                //
                var numMap = num1 + i;
                var valCol = parseFloat(dataMap.get('map' + i));
                //
                // if ( !isNaN(valCol)) {

                var start = 0;
                do {

                    var rec = store.findRecord(element, valId, start, false, true, true);
                    if (rec) {
                        //if (tabIdRec[i])
                        //
                        //if (start==0) nbDataNetwork= nbDataNetwork+1;
                        if (!isNaN(valCol)) tabIdRec[i].push(rec.get('id'));
                        start = store.indexOf(rec) + 1;
                        try {
                            dataMap.set('identified', true);
                        } catch (err) {};

                        rec.set('M' + numMap + 'identified', true);
                        rec.set('M' + numMap + 'idMap', valId);
                        var map = rec.get('mapped') + 1;
                        rec.set('mapped', map);

                        if (!isNaN(valCol)) {
                            rec.set('M' + numMap + 'map0', valCol);
                            var itsCoverage = false;
                            if (object != 'Gene' || object == 'Enzyme' || object == 'Protein')
                                ctrl.dataMappingInVisualization(colMap[3 + i].text, rec.get('dbIdentifier'), valCol, numMap, itsCoverage);

                        } else {
                            rec.set('M' + numMap + 'map0', 'NaN');
                        }
                        // try {
                        //     rec.commit();
                        // } catch (err) {}
                    }

                } while (rec != null);
            }
        });

        storeDataMap.filter("identified", true);
        var nbDataNetwork = storeDataMap.getCount();
        storeDataMap.clearFilter();

        for (i = 0; i < nbCol; i++) {
            var recInfo = storeMapInfo.findRecord('numero', num1 + i);
            if (recInfo) {
                recInfo.set('nbData', storeDataMap.getCount());
                recInfo.set('nbDataInNetwork', nbDataNetwork);
                recInfo.set('nbMapped', tabIdRec[i].length);
                recInfo.set('idMapped', tabIdRec[i].join());

            }


            var textCol = recInfo.get('title');
            //add col
            var grid = Ext.getCmp('grid' + object);
            //var columns = new Array();
            var col = Ext.create('Ext.grid.column.Column', {
                header: textCol,
                dataIndex: 'M' + (num1 + i) + 'map0',
                headerId: 'M' + (num1 + i),
                //xtype:'numberfield',
                filterable: true,
                hideable: false,
                sortable: true
                // sort: function(v1) {
                //
                // }

            });
            //columns.push(col);
            if (grid) {
                //
                grid.headerCt.add(grid.columns.length + i, col);
            }

        }
        //store.commitChanges();

    },

    addDataMapWeight: function(dataMap, colMap, numero, ppm) {
        //MemoryLeakChecker(window);
        var ctrl = MetExplore.app.getController('C_Map');
        var store = Ext.getStore('S_Metabolite');
        //
        var data = dataMap.get('idMap').replace(',', '.');
        var val = parseFloat(data);
        var ppm = parseFloat(ppm);
        var interval = ppm * val / 1000000;

        var valMin = val - interval;
        var valMax = val + interval;
        /*
         *
         */
        var tabIdRec = new Array();

        store.each(function(metabolite) {
            var weight = metabolite.get('weight');
            if (weight < valMax && weight > valMin) {
                tabIdRec.push(metabolite.get('id'));
                //start= store.indexOf(rec)+1;
                //dataMap.set('identified',true);
                try {
                    dataMap.set('identified', true);
                } catch (err) {};

                ctrl.addConditions(metabolite.get('id'), 'Metabolite', dataMap, colMap, numero);
            }
        });
        //store.commitChanges();
        return tabIdRec;

    },


    /**
     * recherche idMetabolite du meme inchi
     * @param {} data
     * @param {} ppm
     * @param {} colMap
     * @param {} numero
     * @return {}
     */
    addDataMapInchi: function(dataMap, colMap, numero) {
        var store = Ext.getStore('S_MetaboliteInchiSvg');

        //
        var val = dataMap.get('idMap');
        var tabIdRec = new Array();

        var start = 0;
        do {
            var rec = store.findRecord('inchi', val, start, true, false, true);
            if (rec) {
                tabIdRec.push(rec.get('id'));
                start = store.indexOf(rec) + 1;
                //dataMap.set('identified',true);
                try {
                    dataMap.set('identified', true);
                } catch (err) {}

                this.addConditions(rec.get('id'), 'Metabolite', dataMap, colMap, numero);

            } //else data.set('identified',false);

        } while (rec != null);
        //store.commitChanges();
        //
        return tabIdRec;

    },
    /**
     * add data condition pour id match
     * @param {} id : object mapped
     * @param {} object : type object (Metabolite, Reaction)
     * @param {} data : conditions
     * @param {} colMap : colonnes de conditions
     * @param {} numero : numero du mapping
     */
    addConditions: function(id, object, condition, colMap, numero) {
        var ctrl = MetExplore.app.getController('C_Map');
        var store = Ext.getStore('S_' + object);
        //				store.each(function(object){
        //
        //				}
        //add values in store network
        var rec = store.getById(id);
        if (rec) {
            //rec.set('M'+numero+'identified', true);
            try {
                rec.set('M' + numero + 'identified', true);
            } catch (err) {}
            var map = rec.get('mapped') + 1;
            try {
                rec.set('mapped', map);
            } catch (err) {}
            //rec.set('mapped', map)
            //i=1 elimine la colonne numero (1er colonne)
            for (var i = 1; i < colMap.length; i++) {
                var col = colMap[i];
                // elimine la colonne id
                //if (col.dataIndex != 'id') {
                //rec.set('M' + numero + col.dataIndex, condition.get(col.dataIndex));
                try {
                    //
                    //
                    // console.log( condition.get(col.dataIndex));
                    var itsCoverage = false;
                    if (object != 'Gene' || object == 'Enzyme' || object == 'Protein')
                        ctrl.dataMappingInVisualization(col.text, rec.get('dbIdentifier'), condition.get(col.dataIndex), numero, itsCoverage);
                    rec.set('M' + numero + col.dataIndex, condition.get(col.dataIndex));
                } catch (err) {}
                //}
            }
            // try {
            //     rec.commit();
            // } catch (err) {}
        }
        //store.commitChanges();
    },

    /**------------------------------------------------------------------------
     * pathway Coverage
     *        pour chaque pathway dans lequel contenu un des metabolites
     *            calcul : nombre de metabolite mappe / nombre total metabolite du pathway
     *
     *        mettre visible la colonne metabolite coverage du gridPathway
     */
    // pathwayCoverage: function(Listid, numMap) {
    //     var ctrl = MetExplore.app.getController('C_Map');
    //     var idBioSource = MetExplore.globals.Session.idBioSource;
    //     Ext.Ajax.request({
    //         url: 'resources/src/php/map/pathwayMetaboliteCoverage.php',
    //         scope: this,
    //         method: 'POST',
    //         timeout: 300000,
    //         params: {
    //             idBioSource: idBioSource,
    //             id: Listid.join()
    //         },
    //         failure: function(response, opts) {
    //             if (response.timedout) {
    //                 Ext.MessageBox.alert('Error', 'Request was timedout');
    //             } else {
    //                 Ext.MessageBox.alert('Server Error', 'Server-side failure with status code ' + response.status);
    //             }
    //         },
    //         success: function(response, opts) {
    //             var json = null;
    //             try {
    //                 json = Ext.decode(response.responseText);
    //
    //                 if (json["success"] == false) {
    //                     Ext.MessageBox.alert('Server error',
    //                         'metabolite mapping on the server has failed. Error : ' +
    //                         json.message);
    //                 } else {
    //                     ctrl.addDataPathway(json["data"],
    //                         numMap);
    //                 }
    //
    //             } catch (err) {
    //                 Ext.MessageBox.alert('Ajax error',
    //                     'Error during metabolome mapping, can\'t find pathway coverage. Error: ' +
    //                     err);
    //             }
    //
    //         }
    //     });
    //
    // },

    /**------------------------------------------------------------------------
     * addDataPathway : affecte les donnees calculees de pathwayCoverage dans le store pathway
     * creation d'un  Store S_PathwayMapped pour visu chart
     */
    addDataPathway: function(dataCover, recInfo) {

        var pathwayMapStore = Ext.getStore('S_PathwayMapped');
        if (!pathwayMapStore) {
            pathwayMapStore = Ext.create('Ext.data.Store', {
                extend: 'Ext.data.Store',
                model: 'MetExplore.model.Pathway',
                autoLoad: false
            });
        }
        /*
         * Ajout des champs dans modele Pathway ajout colonnes dans
         * gridPathway
         */



        /*
         var fields = model.prototype.fields.getRange();
         fields.push({
         name : fieldCoverage,

         // name: 'M'+numMap+'metabCover',
         type : 'float',
         defaultValue : 0
         });
         fields.push({
         name : fieldnbMapped, // 'M'+numMap+'nbMapped',
         type : 'float',
         defaultValue : 0
         });
         model.setFields(fields);
         */
        store = Ext.getStore('S_Pathway');

        var map = recInfo.get('id');
        var fieldCoverage = map + 'coverage';
        var fieldnbMapped = map + 'nbMapped';

        store.each(function(rec) {
            //
            var id = rec.set(fieldCoverage, 0);
            var id = rec.set(fieldnbMapped, 0);
            var id = rec.set('nbMetabolite', '-');
        });
        //store.commitChanges();

        /*
         * Ajout des colonnes dans gridPathway
         */
        var columns = new Array();
        var col = Ext.create('Ext.grid.column.Column', {
            header: 'Metabolite Coverage',
            dataIndex: fieldCoverage,
            filterable: true,
            // flex : 1,
            sortable: true,
            hideable: false,
            renderer: Ext.util.Format
                .numberRenderer('00.00 %')
        });
        columns.push(col);
        var col = Ext.create('Ext.grid.column.Column', {
            header: 'Number of Mapped Metabolite/Pathway',
            dataIndex: fieldnbMapped,
            hideable: false,
            filterable: true,
            // flex : 1,
            sortable: true
            // renderer: Ext.util.Format.numberRenderer('00.00 %')
        });
        columns.push(col);
        var numMap = recInfo.get('numero');
        var grid = Ext.getCmp('gridPathway');
        if (grid != 'undefined' && grid.headerCt != 'undefined') {
            var col = Ext.create('Ext.grid.column.Column', {
                header: 'Mapping_' + numMap,
                filterable: true,
                id: 'M' + numMap,
                headerId: 'M' + numMap,
                hideable: false,
                // flex : 1,
                // sortable : true,
                columns: columns
            });
            if (grid.headerCt != 'undefined') grid.headerCt.add(grid.columns.length, col);

            /*
             * Ajout des data
             */
            var nb = dataCover.length;
            var storeP = Ext.getStore('S_Pathway');

            for (var i = 0; i < nb; i++) {
                //
                var rec = storeP.getById(dataCover[i].pathway);
                if (rec) {
                    //
                    rec.data[fieldCoverage] = dataCover[i].coverage;
                    rec.data[fieldnbMapped] = dataCover[i].nbMapped;
                    rec.data['nbMetabolite'] = dataCover[i].nb;
                    pathwayMapStore.add(rec);
                }
            }
            storeP.sort({
                property: fieldnbMapped,
                direction: 'DESC'
            });
            if (grid) {
                var index = grid.headerCt.items.findIndex('dataIndex',
                    'nbMetabolite');
                //grid.columns[index].setVisible(true);
            }
        }

        // var index =
        // grid.headerCt.items.findIndex('dataIndex','metaboliteCoverage');
        // grid.columns[index].setVisible(true);
        // var index =
        // grid.headerCt.items.findIndex('dataIndex','metaboliteCoverage');
        // grid.columns[index].setVisible(true);

    },


    /**------------------------------------------------------------------------
     * addDataPathway : affecte les donnees calculees de pathwayCoverage dans le store pathway
     * creation d'un  Store S_PathwayMapped pour visu chart
     */
    addDataCover: function(dataCover, recInfo, object, storeData, coverageCondition) {

        var me = this;
        var ctrl = MetExplore.app.getController('C_Map');
        if (coverageCondition > 0) {
            var storeDupli = Ext.create('Ext.data.Store', {
                model: storeData.model
            });
            storeDupli.removeAll();
            storeDupli.add(storeData.getRange());

        }
        //
        //
        //
        //
        //store2.add(storeData.getRange());
        //
        //
        //
        var storeObject = Ext.getStore('S_' + object);

        var map = recInfo.get('id');
        //
        //
        var fieldCoverage = map + 'coverage';

        var fieldnbMapped = map + 'nbMapped';

        var originObject = recInfo.get('object');

        var nbIndex = 'nb' + originObject;
        var nbIndexText = 'Nb ' + originObject + 's';

        var nbTotal = dataCover.length;
        //var nbData = recInfo.get('nbData');
        var nbData = recInfo.get('nbMapped');
        //
        var sizeUnfiltered = Ext.getStore('S_' + originObject).getTotalCount();

        var reactions = {};
        var pathways = {};
        var panel =  Ext.getCmp('tabPanel').getActiveTab();

        if(originObject==="Metabolite"){
            var listIdMetabolites = me.getMetabolitesFromChemicalLibrary(panel);


            if (me.useChemicalLibrary(panel)) {
                if(listIdMetabolites.length===0){
                    Ext.Msg.show({
                        title:'Warning',
                        msg: 'There is none metabolites corresponding to metabolites of biosource selected. Please select a file with good ids OR unselect check box. ',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.WARNING
                    });
                }
                else
                {
                    var storeReaction = Ext.getStore('S_Reaction');
                    var storeReactionPathway = Ext.getStore('S_ReactionPathway');
                    var storePathway = Ext.getStore('S_Pathway');
                    // Filtre store Link recupere les links de la liste des idReaction contenus dans cart
                    var storeLink = Ext.getStore('S_LinkReactionMetabolite');

                    storeLink.filterBy(function(record, id) {
                        return Ext.Array.indexOf(listIdMetabolites, record.get("idMetabolite")) !== -1;
                    }, this);

                    var sommeOk = 0;

                    storeReaction
                        .filterBy(function(record, id) {
                            return (Ext.Array.indexOf(storeLink.getRange().map(function(rec) {
                                return rec.get("idReaction")
                            }), record.get("id")) !== -1);
                        });

                    storeReaction
                        .each(function(reaction) {
                            if (reactions[reaction.get('id')] === undefined) {
                                reactions[reaction.get('id')] = [];
                            }

                            storeReactionPathway.getRange()
                                .filter(function(reactionPathway) {
                                    return reactionPathway.get('idReaction') == reaction.get('id');
                                })
                                .forEach(function(reactionPathway) {
                                    var pathway = storePathway.getById(reactionPathway.get('idPathway'));
                                    reactions[reaction.get('id')].push(pathway.get('dbIdentifier'));
                                });

                            sommeOk++;
                        });

                    function launchCartFilled(func) {

                        var nbReactions = storeReaction.getCount();
                        if (sommeOk == nbReactions) {
                            // the variable is defined
                            func();
                            return;
                        }
                        var that = this;
                        setTimeout(function() {
                            launchCartFilled(func);
                        }, 200);
                    }

                    function onloadPathways(func) {
                        launchCartFilled(func);
                    }


                    onloadPathways(function() {


                        // Filtre store Link recupere les links de la liste des idReaction contenus dans cart
                        var storeLink = Ext
                            .getStore('S_LinkReactionMetabolite');

                        storeLink.filterBy(function(record, id) {
                            if (Ext.Array.indexOf(listIdMetabolites, record.get("idMetabolite")) !== -1) {
                                return true;
                            }
                            return false;
                        }, this);

                        storeLink
                            .each(function(link) {

                                metaboliteID = link.get('idMetabolite');
                                reactionID = link.get('idReaction');

                                var metaboliteMapIndex = listIdMetabolites.indexOf(metaboliteID);

                                if (metaboliteMapIndex == -1) {
                                    listIdMetabolites
                                        .push(metaboliteID);
                                }

                                reactions[reactionID]
                                    .forEach(function(pathw) {
                                        if (pathways[pathw] === undefined) pathways[pathw] = [];

                                        var metabolitePathMapIndex = pathways[pathw].indexOf(metaboliteID);

                                        if (metabolitePathMapIndex == -1) {
                                            pathways[pathw].push(metaboliteID);
                                        }
                                    });
                            });
                    });
                    var controlBioSource = MetExplore.app.getController('C_BioSource');
                    controlBioSource.delFiltersGrid();
                    var control = MetExplore.app.getController('C_GenericGrid');
                    control.delfilterGrid();
                }
            }
        }

        //
        //console.log(recInfo.get('nbMapped'));
        //var nbTotalMap = recInfo.get('nbMapped');
        //
        if (object == 'Pathway') {
            var pathEnrich = map + 'pathEnrich';
            var pathSignif = map + 'pathSignif';
            var pathSignifBenjaminiHochberg = map + 'pathSignifBenjaminiHochberg';
        }


        storeObject.each(function(rec) {

            rec.set(fieldCoverage, 0);
            rec.set(fieldnbMapped, 0);
            //rec.set('nbMetabolite', 0);
            //if (originObject!= 'Reaction') rec.set(nbIndex, '-');
            if (object == 'Pathway') {
                rec.set(pathEnrich, Number.POSITIVE_INFINITY);
                rec.set(pathSignif, Number.POSITIVE_INFINITY);
                rec.set(pathSignifBenjaminiHochberg, Number.POSITIVE_INFINITY);
            }
            // try {
            //     rec.commit();
            // } catch (err) {}
        });
        //storeObject.commitChanges();

        //var numMap= recInfo.get('numero');

        var grid = Ext.getCmp('grid' + object);

        /*create col in  grid*/
        if (grid != 'undefined' && grid.headerCt != 'undefined') {

            var tabGrid = new Array();
            var tabGridHeader = new Array();

            //if (originObject!= 'Reaction') tabGrid.push(nbIndex);
            tabGrid.push(fieldCoverage);
            tabGrid.push(fieldnbMapped);

            //if (originObject!= 'Reaction') tabGridHeader.push(nbIndexText);
            tabGridHeader.push('Coverage');
            tabGridHeader.push('Nb of Mapped');

            if (object == 'Pathway' && MetExplore.globals.Session.idBioSource != 3223) {

                tabGrid.push(pathEnrich);
                tabGridHeader.push('p-value');

                tabGrid.push(pathSignif);
                tabGridHeader.push('Bonferroni corrected p-value');

                tabGrid.push(pathSignifBenjaminiHochberg);
                tabGridHeader.push('BH-corrected p-value');


                //recherche index Nb Reaction dans la grid
                var index = grid.headerCt.items.findIndex('dataIndex', 'nbReaction');
                grid.columns[index].setVisible(true);
            }

            // ajouter les conditions ensuite mettre >0
            if (coverageCondition > 0) {

                var condName = recInfo.get('condName');
                var condNb = condName.length;
                for (i = 0; i < condNb; i++) {
                    tabGrid.push(map + 'map' + i);
                    tabGridHeader.push(condName[i]);
                }
                // storeDupli.each(function(dataMap){
                // 	for (j = 0; j <condNb; j++) {
                //
                // 		dataMap.data['Floatmap' + j] = parseFloat(dataMap.data['map' + j]);
                // 		console.log('after',parseFloat(dataMap.data['map' + j]));
                // 	}
                // });
                //

            }
            var headerGroup = recInfo.get('title') + ' on ' + originObject;


            if (me.useChemicalLibrary(panel) && listIdMetabolites.length>0) headerGroup = headerGroup + ' taking in account ' + me.getChemicalLibraryName(panel);
            grid.createGroupCol(headerGroup, tabGridHeader, tabGrid, false, 0, map);


            //					var index = grid.headerCt.items.findIndex('dataIndex', nbIndex);
            //					if (index<0) {
            //						index= grid.createCol(nbIndex, nbIndex, false);
            //					}
            //
            //grid.columns[index].setVisible(true);


        }
        /*
         * Ajout des data
         */

        /*				console.log('--------------------------')



         console.log('--------------------------')



         */

        for (var i = 0; i < nbTotal; i++) {
            //
            var rec = storeObject.getById(dataCover[i].id);
            if (rec) {

                var itsCoverage = true;
                //
                var nbMapped = dataCover[i].nbMapped;
                var sizePath = dataCover[i].nb;
                var idMapped = dataCover[i].idMapped;
                //var idSql= dataCover[i].idSql;


                if (coverageCondition > 0) {

                    //
                    //
                    storeDupli.clearFilter();
                    var tabId = idMapped.split(',');

                    //filtre store
                    storeDupli.filterBy(function(record) {
                        //var map0F=
                        if (tabId.indexOf(record.get('idSql')) > -1)
                            return true;
                    });
                    //storeDupli.filter('idSql', tabId);
                    //
                    switch (coverageCondition) {
                        case 1:
                            //
                            for (j = 0; j < condNb; j++) {
                                rec.data[map + 'map' + j] = storeDupli.min('map' + j, true);
                                if (originObject != 'Reaction' && originObject != 'Metabolite')
                                    ctrl.dataMappingInVisualization(condName[j] + ' (' + recInfo.get('coverCondition') + ')', rec.get('dbIdentifier'), rec.data[map + 'map' + j], recInfo.get('numero'), itsCoverage);
                            }
                            break;
                        case 2:
                            for (j = 0; j < condNb; j++) {
                                rec.data[map + 'map' + j] = storeDupli.max('map' + j, true);
                                if (originObject != 'Reaction' && originObject != 'Metabolite')
                                    ctrl.dataMappingInVisualization(condName[j] + ' (' + recInfo.get('coverCondition') + ')', rec.get('dbIdentifier'), rec.data[map + 'map' + j], recInfo.get('numero'), itsCoverage);
                            }
                            break;
                        case 3:
                            //storeDupli.each(function())
                            for (j = 0; j < condNb; j++) {
                                //console.log(storeDupli.getRange());
                                rec.data[map + 'map' + j] = storeDupli.average('map' + j, true);
                                if (originObject != 'Reaction' && originObject != 'Metabolite')
                                    ctrl.dataMappingInVisualization(condName[j] + ' (' + recInfo.get('coverCondition') + ')', rec.get('dbIdentifier'), rec.data[map + 'map' + j], recInfo.get('numero'), itsCoverage);
                            }
                            break;
                    }

                }

                if (originObject != 'Reaction' && originObject != 'Metabolite')
                    ctrl.dataMappingInVisualization("Nb_of_Mapped", rec.get('dbIdentifier'), nbMapped, recInfo.get('numero'), itsCoverage);

                rec.data[fieldCoverage] = dataCover[i].coverage;
                rec.data[fieldnbMapped] = nbMapped;
                rec.data[nbIndex] = sizePath;

                if (object == 'Pathway' && MetExplore.globals.Session.idBioSource != 3223) {
                    if (nbMapped > 0) {
                        if (!me.useChemicalLibrary(panel) || listIdMetabolites.length===0) {
                            // nbMapped : Number of mapped entities on pathway
                            // nbData : Number of mapped entities on network
                            // sizePath : Number of entities in pathway
                            // size : Number of entities on network

                            if( originObject === "Gene" )
                                ctrl.dataMappingInVisualization("PathwayCoverage", rec.get('name'), nbMapped / sizePath, recInfo.get('numero'), true);
                            else ctrl.dataMappingInVisualization("PathwayCoverage", rec.get('name'), nbMapped / sizePath, recInfo.get('numero'), false);

                            var result = exact22(nbMapped, nbData - nbMapped, sizePath - nbMapped, sizeUnfiltered - nbData - sizePath + nbMapped);
                            rec.data[pathEnrich] = result; //exact22(nbMapped,nbData-nbMapped,sizePath-nbMapped,sizeUnfiltered-nbData-sizePath+nbMapped);

                        } else {
                            // nbMapped : Number of mapped entities on pathway
                            // nbData : Number of mapped entities on network
                            // sizePath : Number of entities in pathway
                            // size : Number of entities on network
                            var sizePath = pathways[rec.get('dbIdentifier')].length;

                            var size = listIdMetabolites.length;
                            ctrl.dataMappingInVisualization("PathwayCoverage", rec.get('name'), nbMapped / sizePath, recInfo.get('numero'), false);
                            var result = exact22(nbMapped, nbData - nbMapped, sizePath - nbMapped, size - nbData - sizePath + nbMapped);
                            rec.data[pathEnrich] = result; //exact22(nbMapped,nbData-nbMapped,sizePath-nbMapped,size-nbData-sizePath+nbMapped);
                        }
                    }
                }
            }
        }
        var rankedValues = [];
        if (object == 'Pathway' && MetExplore.globals.Session.idBioSource != 3223) {
            // Calculate Benjamini & Hochberg
            storeObject.sort({
                property: pathEnrich,
                direction: 'ASC'
            });

            var pathwaysClone = Object.assign([], storeObject.getRange());
            var pathwaysCloneData = pathwaysClone.map(function(item){return item.data;});
            var pathwayMapped = pathwaysCloneData.filter(function(p){return p[map+"nbMapped"]>0;});
            
            var previous=[];
            var positionMinus=0;
            var rank = 1;
            storeObject.each(function(path){
                if(path.get(map+"nbMapped")>0){
                    if (!(!me.useChemicalLibrary(panel) || listIdMetabolites.length===0))
                        pathwayMapped = pathwayMapped.filter(function(p){return pathways[p['dbIdentifier']];});

                    var nbPathwayMapped = pathwayMapped.length;

                    path.data[pathSignif] = Math.min(1, path.data[pathEnrich] * nbPathwayMapped);

                    path.data[pathSignifBenjaminiHochberg] = path.get(pathEnrich) * nbPathwayMapped / (rank);

                    if(previous.length>0){

                        if(previous[0].data[pathSignifBenjaminiHochberg] > path.data[pathSignifBenjaminiHochberg]){
                            positionMinus++;
                            previous.forEach(function (value) { value.data[pathSignifBenjaminiHochberg] = path.data[pathSignifBenjaminiHochberg]; })
                        }
                        else previous = [];
                    }

                    previous.push(path);

                    
                    if( originObject === "Gene" )
                        ctrl.dataMappingInVisualization("PathwayEnrichment", path.get('name'), path.data[pathSignifBenjaminiHochberg], recInfo.get('numero'), true);
                    else ctrl.dataMappingInVisualization("PathwayEnrichment", path.get('name'), path.data[pathSignifBenjaminiHochberg], recInfo.get('numero'), false);

                    rank++;

                }
            });
        }

        storeObject.sort({
            property: fieldnbMapped,
            direction: 'DESC'
        });

    },

    coverage: function(num, jsonData, coverageCondition, mask) {
        var ctrl = MetExplore.app.getController('C_Map');
        //console.log(button.findParentByType('form'));
        if (coverageCondition < 0) coverageCondition = 0;
        if (!title) {
            var title = Ext.getCmp('tabPanel').getActiveTab().title;
        }
        var storeInfo = Ext.getStore('S_MappingInfo');
        //console.log

        var recInfo = storeInfo.findRecord('numero', num, 0, false, true, true);
        //


        if (recInfo) {
            var object = recInfo.get('object');

            var listCover;
            if (object == 'Reaction') {
                listCover = 'Pathway'
            } else {
                if (object == 'Metabolite') {
                    listCover = 'Pathway,Reaction'
                } else {
                    if (object == 'Gene' || object == 'Enzyme' || object == 'Protein') {
                        listCover = 'Pathway,Reaction'
                    }
                }
            }



            var numMapping = recInfo.get('numero');
            var Listid = recInfo.get('idMapped');
            var ctrlMap = this;

            if (object == 'Gene' || object == 'Enzyme' || object == 'Protein') {

                var mapping = {
                    'id': recInfo.get('id'),
                    'object': object,
                    'numero': numMapping,
                    'title': recInfo.get('title') + '_on_' + object,
                    'coverCondition': recInfo.get('coverCondition'),
                    'condName': recInfo.get('condName')
                };

                var itsCoverage = true;
                ctrl.initMappingInVisualization(mapping, numMapping, itsCoverage);
            }

            Ext.Ajax.request({
                url: 'resources/src/php/map/coverageMapping.php',
                timeout: 300000,
                scope: this,
                method: 'POST',
                timeout: 300000,
                params: {
                    idBioSource: MetExplore.globals.Session.idBioSource,
                    id: Listid, //.join()
                    object: recInfo.get('object'),
                    listOut: listCover,
                    numMapping: numMapping
                },
                failure: function(response, opts) {
                    Ext.MessageBox.alert('Ajax error',
                        'Error during metabolome mapping, can\'t find pathway coverage. Error: ');
                    Ext.callback(this.maskHide(mask), this);
                },
                success: function(response, opts) {
                    //var obj = Ext.decode(response.responseText);

                    //
                    var json = null;
                    json = Ext.decode(response.responseText);
                    /*
                     if (json["success"] == false) {
                     Ext.MessageBox.alert('Server error','pathway coverage on the server has failed. Error : '
                     + json.message);
                     } else {*/
                    var tabCover = listCover.split(',');
                    //
                    for (index in tabCover) {
                        var val = tabCover[index];
                        //
                        ctrlMap.addDataCover(json["data"][val], recInfo, val, jsonData, coverageCondition);

                    }
                    //ctrlMap.addDataCover(json["data"]["Reaction"],recInfo,'Reaction');
                    //ctrlMap.visuDataPathway();
                    //}
                    Ext.callback(this.maskHide(mask), this);

                    if (object == "Gene" || object == 'Enzyme' || object == 'Protein'){
                        Ext.callback(this.afterMapInGrid(MetExplore.globals.Session.mappingCoverageViz[numMapping]), this);
                    }
                    else {
                        if(object == "Metabolite" || object == 'Reaction'){
                            Ext.callback(this.afterMapInGrid(MetExplore.globals.Session.mappingObjViz[numMapping]), this);
                        }
                    }
                }
            });
        } else {
            Ext.callback(this.maskHide(mask), this);
        }
    },

    coverageMulti: function(m1, nb, mask) {
        var ctrl = MetExplore.app.getController('C_Map');
        var storeInfo = Ext.getStore('S_MappingInfo');
        for (i = 0; i < nb; i++) {
            var numMapping = m1 + i;
            var recInfo = storeInfo.findRecord('numero', numMapping, 0, false, true, true);

            if (recInfo) {
                var object = recInfo.get('object');

                var listCover;
                if (object == 'Reaction') {
                    listCover = 'Pathway'
                } else {
                    if (object == 'Metabolite') {
                        listCover = 'Pathway,Reaction'
                    } else {
                        if (object == 'Gene' || object == 'Enzyme' || object == 'Protein') {
                            listCover = 'Pathway,Reaction'
                        }
                    }
                }

                var Listid = recInfo.get('idMapped');

                var ctrlMap = this;

                if (object == 'Gene' || object == 'Enzyme' || object == 'Protein') {

                    var mapping = {
                        'id': recInfo.get('id'),
                        'object': object,
                        'numero': numMapping,
                        'title': recInfo.get('title') + '_on_' + object,
                        'coverCondition': recInfo.get('coverCondition'),
                        'condName': recInfo.get('condName')
                    };

                    var itsCoverage = true;
                    ctrl.initMappingInVisualization(mapping, numMapping, itsCoverage);
                }

                Ext.Ajax.request({
                    url: 'resources/src/php/map/coverageMapping.php',
                    timeout: 300000,
                    scope: this,
                    method: 'POST',
                    params: {
                        idBioSource: MetExplore.globals.Session.idBioSource,
                        id: Listid, //.join()
                        object: object,
                        listOut: listCover,
                        numMapping: numMapping
                    },
                    failure: function(response, opts) {
                        Ext.MessageBox.alert('Ajax error',
                            'Error during coverage. Error: ');
                        Ext.callback(this.maskHide(mask), this);
                    },
                    success: function(response, opts) {

                        var json = null;
                        json = Ext.decode(response.responseText);

                        var tabCover = listCover.split(',');
                        var numMap = json["numMap"];
                        var storeInfo = Ext.getStore('S_MappingInfo');
                        var recInfo = storeInfo.findRecord('numero', numMap, 0, false, true, true);
                        //

                        for (index in tabCover) {
                            var val = tabCover[index];
                            ctrlMap.addDataCover(json["data"][val], recInfo, val, '', 0);
                        }

                        Ext.callback(this.maskHide(mask), this);

                        if (object == "Gene" || object == 'Enzyme' || object == 'Protein'){
                            Ext.callback(this.afterMapInGrid(MetExplore.globals.Session.mappingCoverageViz[numMap]), this);
                        }
                        else {
                            if(object == "Metabolite" || object == 'Reaction'){

                                Ext.callback(this.afterMapInGrid(MetExplore.globals.Session.mappingObjViz[numMap]), this);
                            }
                        }
                    }
                });
            }

        }
        //console.log

        //



        if (recInfo) {


        }
    },


    /*********************************************************************************************************************
     * feature mapping_save
     * ******************************************************************************************************************
     * bouton visible a la fin de maskHide (l 614)
     * sauvegarde mapping en json
     */



    /**
     * json d'un store
     * @param nameStore
     * @returns {*|Array}
     */
    storeTojson: function(nameStore) {
        //
        var items = Ext.getStore(nameStore).data.items;
        var result = Ext.Array.pluck(items, 'data');
        //
        return result
    },
    /**
     * json du store d'un composant
     * @param ui
     * @returns {*|Array}
     */
    uistoreTojson: function(ui) {
        //
        var items = ui.getStore().data.items;
        //
        var result = Ext.Array.pluck(items, 'data');
        //
        return result
    },

    /**
     * affecter un json a un store
     * @param nameStore
     * @returns {*|Array}
     */
    jsonTostore: function(nameStore, json) {

        var store = Ext.getStore(nameStore);
        store.proxy.reader.rawData = json;

    },

    /**
     * retourne les keys qui commencent par le contenu de tab
     * @param json
     * @param tab
     */
    keyscollection: function(json, tab) {
        //
        var keys = _.remove(_.keys(json[0]), function(n) {
            return tab.indexOf(n.substr(0, 2)) != -1;
        });
        //
        return keys
    },
    /**
     * renvoi un json avec les keys d'un tableau d'objet
     * @param tab
     * @param keys
     */
    tabTojson: function(tab, keys) {
        //
        var result = _.map(tab, function(object) {
            return _.pick(object, keys);
        });
        //
        return result;
    },
    //objectTojson : functio

    /**
     * declenche par le bouton save mapping
     */
    exportJsonFile: function() {
        var ctrl = MetExplore.app.getController('C_Map');
        var stringJSON = ctrl.save_mapping();
        var a = document.createElement('a');
        var panel = Ext.getCmp('tabPanel').getActiveTab();
        var nameFile = "mapping.json";
        if (panel) {
            var mapping_name = panel.query('textfield[name=mapping_name]')[0];
            if (mapping_name) {
                var txt = mapping_name.value;
                if (txt != "") {
                    nameFile = txt + ".json";
                }
            }
        }

        var blob = new Blob([stringJSON], {
            type: 'text/plain'
        });

        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = nameFile;
        document.body.appendChild(a);
        a.click();
        setTimeout(function(){
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);

    },

    /**
     * sauvegarde mapping en json
     */
    save_mapping: function() {
        var ctrl = MetExplore.app.getController('C_Map');
        var stringJSON = "{\"mapping\":";
        //recuperation data formulaire
        var panel = Ext.getCmp('tabPanel').getActiveTab();

        //data sur info de mapping
        var mapping_ids = panel.query('textfield[name=id]')[0].value.split(',');
        var mappingInfo = ctrl.storeTojson("S_MappingInfo");
        //filtre le contenu du store Mapping Info par le tableau des ids contenu dans formulaire
        var mappings = _.filter(mappingInfo, function(o) {
            return mapping_ids.indexOf(o.id) > -1;
        });
        stringJSON += Ext.JSON.encode(mappings);

        //data provenant de la grid
        var gridData = panel.query('gridData')[0];
        var nbcolCond = gridData.headerCt.gridDataColumns.length - 3;
        var datas = ctrl.uistoreTojson(gridData); //Ext.Array.pluck(storeData.data.items, 'data');
        stringJSON += "," + ctrl.data_mapping(datas, nbcolCond);

        //data network
        var mapping_biodata = mappings[0].object;
        stringJSON += ctrl.data_network(mapping_ids, mapping_biodata);

        stringJSON += '}\n';

        return stringJSON;
    },


    /**
     * renvoi un json des data de grid du formulaire de mapping
     * @param collection collection issue
     * @param nbcond nombre de conditions
     * @returns {*}
     */
    data_mapping: function(collection, nbcond) {
        //console.log('datamapping',Ext.JSON.encode(collection));
        //
        //creation d'un tableau des keys que l'on souhaite garder
        var colkeys = ['identified', 'idMap', 'id'];
        for (var i = 0; i < nbcond; i++) {
            colkeys.push('map' + i);
        }

        //recupere tous les object de la collection avec uniquement les keys specifiees
        var result = _.map(collection, function(object) {
            return _.pick(object, colkeys);
        });
        var json = Ext.JSON.encode(result);
        //
        //return  json
        return "\n\"data\":" + json
    },

    /**
     *    creation json contenant toutes les datas ajoutees dans les grid apres mapping
     * @param mapping_ids
     * @param biodata
     * @returns {string}
     * tableau de tous les biodata
     * reduction du tableau de Pathway jusqu'a l'object mappé
     * pour ce tableau, recuperer toutes les data de mapping dans les stores
     */
    data_network: function(mapping_ids, biodata) {
        //
        //
        var ctrl = MetExplore.app.getController('C_Map');
        var tabbiodata = ["Pathway", "Reaction", "Metabolite", "Enzyme", "Protein", "Gene"];
        var ind = tabbiodata.indexOf(biodata) + 1;

        tabbiodata = _.dropRight(tabbiodata, 6 - ind);
        var json = "\n";

        for (var i = 0; i < tabbiodata.length; i++) {

            var datas = ctrl.storeTojson("S_" + tabbiodata[i]);

            // supprime toutes les keys qui ne commence pas par contenu de mapping_ids (par ex M1, M2 :les mappings du formulaire)
            var keys = ctrl.keyscollection(datas, mapping_ids);

            //ajouter id a la liste des keys
            keys.push("id");
            keys.push("name");
            keys.push("dbIdentifier");

            //recupere les calculs effectues dans les store
            var result = _.map(datas, function(object) {
                return _.pick(object, keys);
            });
            //

            var cols = ctrl.cols_mapping(mapping_ids, tabbiodata[i]);

            json = json + ",\"result" + tabbiodata[i] + "\":" + Ext.JSON.encode(result) + "\n" + ",\"col" + tabbiodata[i] + "\":" + Ext.JSON.encode(cols);

            //
        }
        //
        //
        return json
    },

    /**
     *
     * @param mapping_ids
     * @param biodata
     */
    cols_mapping: function(mapping_ids, biodata) {
        //
        //

        var grid = Ext.getCmp("grid" + biodata);

        //suppression des cols non headerId contenu dans la liste des mappings
        //var gridCol;
        var cols = new Array;

        if (grid) {

            var gridCol = _.filter(grid.headerCt.items.items, function(n) {
                //console.log (n);
                return mapping_ids.indexOf(n.headerId) > -1;
            });
            //
            for (var i = 0; i < gridCol.length; i++) {
                if (gridCol[i].gridDataColumns) {
                    //colonnes groupées
                    var res = this.tabTojson(gridCol[i].gridDataColumns, ["text", "dataIndex"]);
                } else {
                    //colonnes non groupées cas multi mapping (1 colonne /mapping)
                    var res = [_.pick(gridCol[i], ["text", "dataIndex"])];
                }
                //
                var object = _.assign({
                    "colId": gridCol[i].headerId,
                    "colTxt": gridCol[i].text,
                    "cols": res
                });
                cols.push(object);
            }
        }

        //console.log(Ext.JSON.encode(cols));
        return cols;
    },


    /*
     controlle BioSource lors du load json
     */
    loadJsonMenu: function(json) {
        //
        //
        // document.addEventListener('loadNetworkBiosource', function (arg) {
        //     MetExploreViz.onloadMetExploreViz(function () {
        var ctrl = MetExplore.app.getController('C_Map');
        var idBioSource = undefined;
        if (json.mapping != undefined) {
            idBioSource = json.mapping[0].idBioSource; //arg.value.biosource;
        }

        if (idBioSource != undefined && idBioSource != "" && !isNaN(idBioSource)) {
            var storeBS = Ext.getStore('S_BioSource');
            var storeMyBS = Ext.getStore('S_MyBioSource');
            var accessPublic = storeBS.findRecord('id', idBioSource);
            var accessPrivate = storeMyBS.findRecord('id', idBioSource);

            if (accessPublic || accessPrivate) {
                if (MetExplore.globals.Session.idBioSource != idBioSource) {

                    Ext.Msg.alert({
                        title: 'Different biosource',
                        msg: 'Current MetExplore biosource and biosource in file are different. ',
                        animateTarget: 'elId',
                        icon: Ext.window.MessageBox.WARNING,
                        buttonText: {
                            yes: ('Change'),
                            //ok: 'Keep MetExplore BioSource',
                            cancel: 'Cancel'
                        },
                        fn: function(button) {
                            if (button === 'yes') {

                                MetExplore.globals.Loaded.S_Reaction = -1;
                                MetExplore.globals.Loaded.S_Pathway = -1;

                                //Change MetExplore BioSource
                                var ctrlGrid = MetExplore.app.getController('C_GenericGrid');
                                ctrlGrid.selectBioSource(idBioSource);
                                //
                                //
                                MetExplore.globals.Utils.storeLoadedCallfct(['S_Reaction', 'S_Pathway'], ctrl.loadJsonMapping, json)
                                // that.loadJsonMapping(json);
                            }
                        }

                    });
                } else {
                    ctrl.loadJsonMapping(json);
                }

            } else {
                Ext.Msg.alert({
                    title: 'Private BioSource',
                    msg: 'You attempt to load private BioSource and you do\'nt have access to it',
                    animateTarget: 'elId',
                    buttons: Ext.Msg.OK,
                    icon: Ext.window.MessageBox.WARNING
                });
            }

        } else {
            Ext.Msg.alert({
                title: 'Json no conform',
                msg: 'The json isn\'t a metexplore mapping save file',
                animateTarget: 'elId',
                buttons: Ext.Msg.OK,
                icon: Ext.window.MessageBox.WARNING
            });

        }
    },


    /**
     * recharger un json de mapping sauve
     * @param json json de mapping
     */
    loadJsonMapping: function(json) {
        // recupere les infos mapping et les affecte a S_MappingInfo
        //
        var ctrl = MetExplore.app.getController('C_Map');
        var mappingAdded = [];
        var storeMapInfo = Ext.getStore('S_MappingInfo');
        var num= 1;

        for (var i = 0; i < json.mapping.length; i++) {

            var data = json.mapping[i];

            if (storeMapInfo.count() > 0) {
                num= storeMapInfo.last().get('numero') +1;

                // remplacer dans json tous les Mx par Mnum (nouveau numero)
                var stringJSON= Ext.JSON.encode(json);
                var newJSON= stringJSON.replace(new RegExp(data.id, 'g'),"M"+num);
                //console.log(newJSON)
                json= Ext.JSON.decode(newJSON);
                data= json.mapping[i];
                var ch= data.title;
                if (ch.indexOf("Mapping") >-1) data.title= "Mapping_"+num;
                //console.log(data);
            }

            //console.log("Go");
            //console.log(data.numero);
            var mapping = {
                'condName': data.condName,
                'coverCondition': data.coverCondition,
                'coverPathway': data.coverPathway,
                'coverReaction': data.coverReaction,
                'field': data.field,
                'id': data.id,
                'idBioSource': data.idBioSource,
                'idMapped': data.idMapped,
                'nbData': data.nbData,
                'nbDataInNetwork': data.nbDataInNetwork,
                'nbMapped': data.nbMapped,
                'numero': data.numero,
                'object': data.object,
                'title': data.title
            };

            storeMapInfo.add(mapping);
            mappingAdded.push(mapping);
            ctrl.initMappingInVisualization(mapping, data.numero, false);

        }
        //ctrl.initMappingInVisualization(mapping, mapping.numero, false);
        // recupere les data et les affecte aux stores
        var tabbiodata = ["Pathway", "Reaction", "Metabolite", "Enzyme", "Protein", "Gene"];
        var ind = tabbiodata.indexOf(json.mapping[0].object) + 1;
        tabbiodata = _.dropRight(tabbiodata, 6 - ind);

        for (var i = 0; i < tabbiodata.length; i++) {
            var key = "result" + tabbiodata[i];
            //
            var result = json[key];
            //var ctrl= MetExplore.app.getController('C_Map');
            //
            var data = ctrl.storeTojson('S_' + tabbiodata[i]);

            //merger les datas des 2 json
            var resultMerge = _.map(data, function(obj) {
                return _.assign(obj, _.find(result, {
                    id: obj.id
                }));
            });
            //
            // ajoute les data de mapping dans le store
            ctrl.jsonTostore('S_' + tabbiodata[i], resultMerge);

            //ajout des colonnes dans les differentes grids
            var grid = Ext.getCmp("grid" + tabbiodata[i]);
            var col = json["col" + tabbiodata[i]];
            //console.log(col);
            for (var j = 0; j < col.length; j++) {
                var tabTxt = _.map(col[j].cols, 'text');
                var tabVal = _.map(col[j].cols, 'dataIndex');
            }
            grid.createGroupCol("Mapping_"+num, tabTxt, tabVal, false, 0, col[0].colId);


            if(tabbiodata[i]==="Pathway"){
                data.forEach(function (value) {
                    if (value["M"+num+"pathSignifBenjaminiHochberg"]){
                        ctrl.dataMappingInVisualization("PathwayEnrichment", value.name, value["M"+num+"pathSignifBenjaminiHochberg"], num, false);
                    }
                    if (value["M"+num+"coverage"]){
                        ctrl.dataMappingInVisualization("PathwayCoverage", value.name, value["M"+num+"coverage"], num, false);
                    }
                })
            }
        }

        console.log(MetExplore.globals.Session.mappingObjViz[mapping.numero]);
        var main = Ext.ComponentQuery.query('mainPanel')[0];
        var tab = Ext.ComponentQuery.query('networkData')[0];
        var grid = Ext.getCmp("grid" + json.mapping[0].object);

        if (main && tab && grid) {
            main.setActiveTab(tab);
            tab.setActiveTab(grid);
        }
        //attention il peut y avoir plusieurs mapping (donc il faudra boucler
        mappingAdded.forEach(function(mapping) {
            ctrl.visuMap(mapping);
        });

    },

    loadJsonAliases: function(json) {
        //
        //console.log(Ext.getCmp('networkData').getActiveTab());
        var entitie = Ext.getCmp('networkData').getActiveTab().id.replace("grid", "");

        //
        var ctrl = MetExplore.app.getController('C_Map');
        //
        var data = ctrl.storeTojson('S_' + entitie);

        //merger les datas des 2 json
        json.forEach(function(node) {
            MetExploreViz.onloadMetExploreViz(function() {
                metExploreViz.onloadSession(function() {
                    metExploreViz.GraphNode.setAliasByDBId(node.dbIdentifier, node.alias);
                });
            });
        });

        var objblank = {
            alias: " "
        };
        var resultMerge = _.map(data, function(obj) {
            var objtrouve = _.find(json, {
                dbIdentifier: obj.dbIdentifier
            });
            //
            if (objtrouve == undefined) objtrouve = objblank;
            return _.assign(obj, objtrouve);
        });
        //


        //
        // ajoute les data de mapping dans le store
        ctrl.jsonTostore('S_' + entitie, resultMerge);
        var grid = Ext.getCmp("grid" + entitie);
        grid.createCol("alias", "alias", false, 0, "alias");

    },
    /**------------------------------------------------------------------------
     * visu mapping
     * elaboration du json d'un mapping pour la visu
     *
     *
     * rmq: pour faire tests il serait mieu de passer l'objet mapping et le json du store (ligne 1)
     *
     *
     */

    /**
     * 
     * @param mapping
     */
    visuMap: function(mapping) {

        var ctrl = MetExplore.app.getController('C_Map');
        var json = ctrl.storeTojson('S_' + mapping.object);

        //filtrer json du store pour avoir que les object mappes
        //var keymap= '\''+mapping.id+'identified'+'\'';
        var keymap = mapping.id + 'identified';

        // je filtre le json sur les enregistrement mappes
        var jsonfilter = _.filter(json, function(node) {
            return node[keymap] == true;
        });
        var conditions = mapping.condName;

        var mappings = new Array();
        //boucle sur conditions
        for (i = 0; i < conditions.length; i++) {
            //1er condition : key= M1map0 .....
            var key = mapping.id + "map" + i;
            //sur le json filtre (=json des datas mappees)
            //recupere le dbIdentifier que je mets dans attribut "node"
            //recupere valeur contenue dans par ex M1map0....
            var resultdata = _.map(jsonfilter, function(item) {
                return {
                    "node": item.dbIdentifier,
                    "value": item[key]
                }
            });

            //attribut les data
            var result = {
                'name': mapping.condName[i],
                'data': resultdata
            };
            mappings[i] = result;
        }

        if (mapping.object != "Gene" || mapping.object == 'Enzyme' || mapping.object == 'Protein') {

            MetExplore.globals.Session.mappingObjViz[mapping.numero].mappings = mappings.concat(MetExplore.globals.Session.mappingObjViz[mapping.numero].mappings.slice(mapping.condName.length));

            MetExploreViz.onloadMetExploreViz(function() {
                metExploreViz.onloadSession(function() {
                    console.log("loadDataFromJSON");console.log(MetExplore.globals.Session.mappingObjViz[mapping.numero]);metExploreViz.GraphMapping.loadDataFromJSON(JSON.stringify(MetExplore.globals.Session.mappingObjViz[mapping.numero]));
                });
            });
        }
    },

    //
    // concatJson : function (jsona, jsonb, keya, keyb) {
    //     var jsona= [{id:'a',jsona1:'json11', jsona2:'json21'},{id:'a',jsona1:'json12', jsona2:'json22'},{id:'a',jsona1:'json13', jsona2:'json23'},{id:'a',jsonb1:'json14', jsona2:'json24'}];
    //     var jsonb= [{id:'a',jsonb1:'json11', jsonb2:'json21'},{id:'a',jsonb1:'json12', jsonb2:'json22'},{id:'a',jsonb1:'json13', jsonb2:'json23'},{id:'a',jsonb1:'json14', jsonb2:'json24'}];
    //     var keya='jsona1';
    //     var keyb='jsonb1';
    //
    //
    //
    //
    // },



    /**------------------------------------------------------------------------
     * visuDataPathway : affecte les donnees calculees de pathwayCoverage dans le store pathway
     */
    visuDataPathway: function() {
        // var gridP = Ext.getCmp('gridPathway');
        //
        // var index =
        // gridP.headerCt.items.findIndex('dataIndex','metaboliteCoverage');
        // gridP.columns[index].setVisible(true);
        // var index =
        // gridP.headerCt.items.findIndex('dataIndex','metaboliteNb');
        // gridP.columns[index].setVisible(true);
        /*
         * Revoir affichage du tabPanel des resultats graphiques
         *
         * Ext.require('Ext.chart.*');
         Ext.require(['Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit', 'Ext.window.MessageBox']);

         Ext.onReady(function () {




         });
         */

        //var tabResult =Ext.create("MetExplore.view.main.V_MetaboliteMappingResult");
        var chart = Ext.create('Ext.chart.Chart', {
            style: 'background:#fff',
            animate: true,
            shadow: true,
            store: 'S_Pathway',
            legend: {
                position: 'right'
            },
            axes: [{
                type: 'Numeric',
                position: 'bottom',
                fields: ['nbMetabolite', 'M1nbMapped', 'M1coverage'],
                minimum: 0,
                label: {
                    renderer: Ext.util.Format.numberRenderer('0,0')
                },
                grid: true,
                title: ''
            }, {
                type: 'Category',
                position: 'left',
                fields: ['dbIdentifier'],
                title: 'Pathways'
            }],
            series: [{
                type: 'bar',
                axis: 'bottom',
                tips: {
                    trackMouse: true,
                    width: 140,
                    height: 28,
                    renderer: function(storeItem, item) {
                        this.setTitle(storeItem.get('dbIdentifiers') + '\nnbMetabolites ' + storeItem.get('nbMetabolite'));
                    }
                },
                xField: 'name',
                yField: ['nbMetabolite', 'M1nbMapped', 'M1coverage']
            }]
        });

        var win = Ext.create('Ext.Window', {
            width: 800,
            height: 600,
            minHeight: 400,
            minWidth: 550,
            hidden: false,
            maximizable: true,
            title: 'Metabolite Coverage',
            autoShow: true,
            layout: 'fit',
            tbar: [{
                text: 'Save Chart',
                handler: function() {
                    Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice) {
                        if (choice == 'yes') {
                            chart.save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            }],
            items: [chart]
        });
        //				var tabPanel= Ext.getCmp('tabPanel');
        //				var newTab = tabPanel.add({ title: 'Metabolite Mapping Result', closable: false, items:[tabResult] }); newTab.show();
        //
    },

    setChemicalLibrary: function(bool, panel) {

        panel.useChemicalLibraryBackground = bool;
    },
    useChemicalLibrary: function(panel) {

        return panel.useChemicalLibraryBackground;
    },
    setChemicalLibraryName: function(fileName, panel) {

        panel.chemicalLibraryName = fileName;
    },
    getChemicalLibraryName: function(panel) {

        return panel.chemicalLibraryName;
    },
    setMetabolitesFromChemicalLibrary: function(validMetabolites, panel) {
        panel.metabolitesFromChemicalLibrary = validMetabolites;

    },
    getMetabolitesFromChemicalLibrary: function(panel) {

        return panel.metabolitesFromChemicalLibrary;
    }
});