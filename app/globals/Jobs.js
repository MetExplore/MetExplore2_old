/**
 * downloadDataUrlFromJavascript
 * @param filename
 * @param dataUrl
 */
function downloadDataUrlFromJavascript(filename, dataUrl) {

    // Construct the a element
    var link = document.createElement("a");
    link.download = filename;
    link.target = "_blank";

    // Construct the uri
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();

    // Cleanup the DOM
    document.body.removeChild(link);
    delete link;
}

/**
 * MetExplore.globals.Jobs
 */
Ext.define('MetExplore.globals.Jobs', {
    singleton: true,

    requires: ['MetExplore.globals.Session'],

    /**
     * Display the result of a job present in the job grid
     *
     * @param {} path
     * @param {} applicationName
     */
    displayLog: function(path, applicationName) {

        ctrl = this;

        var win_wait = Ext.create("Ext.window.MessageBox");

        win_wait.wait("Load logs. Please wait...", "Loading", {
            interval: 500
        });

        Ext.Ajax.request({
            url: path,
            scope: ctrl,
            method: 'POST',
            failure: function(response, opts) {
                Ext.MessageBox.alert('Ajax error',
                    'Error while getting results');
                win_wait.close();
            },
            success: function(response, opts) {
                win_wait.close();
                var json = null;
                var text = response.responseText;
                var title = applicationName;
                text = text.replace(/\n/g, "</br>");
                text = text.replace(/"/g, '&quot;');
                var win_Info;

                win_Info = Ext.create('MetExplore.view.window.V_WindowInfoJob', {
                    text: text,
                    title: title
                });

                win_Info.show();
                win_Info.focus();
            }
        });
    },
    /**
     * Display the result of a job present in the job grid
     * @param {} path
     * @param {} applicationName
     */
    displayResult: function(path, applicationName, Jobrecord) {

        var win_wait = Ext.create("Ext.window.MessageBox");

        win_wait.wait("Mapping results. Please wait...", "Mapping", {
            interval: 500
        });

        Ext.Ajax.request({
            url: path,
            scope: this,
            method: 'POST',
            failure: function(response, opts) {
                Ext.MessageBox.alert('Ajax error',
                    'Error while getting results');
                win_wait.close();
            },
            success: function(response, opts) {

                var json = null;

                try {
                    json = Ext.decode(response.responseText);
                } catch (err) {
                    Ext.MessageBox.alert('Ajax error',
                        'Error in the results. Error: ' + err);
                    win_wait.close();
                    return;
                }
                if ("meSHPairMetrics" in json) {
                    applicationName = "MeSH pair metrics";
                    var storeMeSH = Ext.getStore("S_MeSHPairMetrics");
                    var meshpairmetrics = {
                        title: 'MeSHPairMetrics on ' + json['mesh'],
                        meshs: json['meSHPairMetrics']
                    };
                    storeMeSH.add(meshpairmetrics);
                    win_wait.close();
                    return;
                }

                if ("download" in json) {
                    win_wait.close();

                    var url = json["download"];
                    var array = url.split(".");
                    var ext = array[array.length - 1];

                    var filename = applicationName + "_" + MetExplore.globals.Session.idBioSource + "." + ext;

                    downloadDataUrlFromJavascript(filename, url);

                    return;


                } else if ("url" in json) {
                    var url = json["url"];
                    win_wait.close();

                    window.open(url, "_blank");

                    return;
                    // var win = Ext.create('Ext.Window', {
                    // 	title : 'Result file of ' + applicationName,
                    // 	layout : 'fit',
                    // 	plain : true,
                    // 	closable : true,
                    // 	constrainHeader : true,
                    // 	items : [{
                    // 		html : "<p>You are about to be directed to an external web page to view the selected result."
                    // 				+ "</br>Click the button below to open results in a new tab or close this window "
                    // 				+ "to cancel</p>"
                    // 				+ "<a href=\""
                    // 				+ url
                    // 				+ "\" target=\"_blank\" ><button>Go to Result page</button></a>"
                    // 	}]

                    // });

                    // win.show();

                } else if ("idbiosource" in json) {
                    var idbiosource = json["idbiosource"];

                    Ext.getStore("S_MyBioSource").reload({
                        callback: function(records, operation, success) {
                            var ctrlGrid = MetExplore.app
                                .getController('MetExplore.controller.C_GenericGrid');
                            ctrlGrid.selectBioSource(parseInt(idbiosource));
                        }
                    });

                    win_wait.close();
                    return;
                }

                // Displays a message in a window
                var win = Ext.create("Ext.window.MessageBox", {
                    maximizable: true,
                    resizable: true
                });
                var message;

                if (Jobrecord && Jobrecord.get('targetBiosource') != "" && parseInt(Jobrecord.get('targetBiosource')) != MetExplore.globals.Session.idBioSource) {
                    win_wait.close();
                    var name = "";
                    var bioViaBiosourceStore = Ext.getStore('S_BioSource').getById(Jobrecord.get('targetBiosource'));
                    var projectBiosourceStore = Ext.getStore('S_ProjectBioSource');
                    if (projectBiosourceStore) {
                        var bioViaProjectBiosourceStore = Ext.getStore('S_ProjectBioSource').getById(Jobrecord.get('targetBiosource'));
                        if (bioViaProjectBiosourceStore)
                            name = bioViaProjectBiosourceStore.get('NomComplet');
                    }

                    if (bioViaBiosourceStore)
                        name = bioViaBiosourceStore.get('NomComplet');
                    message = "This analysis was done on another BioSource than the current one. Please load the BioSource \"" +
                        name +
                        "\" to view this result.";
                    win.alert("Application message", message);
                    return;
                }

                Ext.suspendLayouts();
                var mappingFinished = true;
                // Map values on reactions
                if ("reactions" in json) {

                    var reactions = json["reactions"];

                    mappingFinished = MetExplore.globals.Jobs.mapEntities(reactions, applicationName, "Reaction", Jobrecord);

                }

                // Map values on genes
                if ("genes" in json) {

                    var genes = json["genes"];

                    mappingFinished = MetExplore.globals.Jobs.mapEntities(genes, applicationName, "Gene", Jobrecord);

                }

                // Map values on pathways
                if ("pathways" in json) {

                    var pathways = json["pathways"];

                    mappingFinished = MetExplore.globals.Jobs.mapEntities(pathways, applicationName, "Pathway", Jobrecord);

                }

                // Map values on metabolites
                if ("metabolites" in json) {

                    var metabolites = json["metabolites"];

                    mappingFinished = MetExplore.globals.Jobs.mapEntities(metabolites, applicationName, "Metabolite", Jobrecord);
                }

                // Map values on enzymes
                if ("enzymes" in json) {

                    var enzymes = json["enzymes"];

                    mappingFinished = MetExplore.globals.Jobs.mapEntities(enzymes, applicationName, "Enzyme", Jobrecord);
                }

                // Map values on proteins
                if ("proteins" in json) {

                    var proteins = json["proteins"];

                    mappingFinished = MetExplore.globals.Jobs.mapEntities(proteins, applicationName, "Protein", Jobrecord);
                }

                if ("pagerank" in json) {
                    var entities = [json["pagerank"], json["cheirank"]];
                    applicationName = "MetaboRank";
                    var objectName = "Metabolite";

                    if (Object.keys(entities[0]).length > 0 && Object.keys(entities[1]).length) {
                        var storeMap = Ext.getStore('S_MappingInfo');

                        if (storeMap.last())
                            numero = storeMap.last().get('numero') + 1;
                        else {
                            numero = 1;

                        }
                        var colnames = ['MR Out', 'MR In'];

                        storeMap.add({
                            'id': 'M' + numero,
                            'name': applicationName,
                            'title': applicationName + " " + numero,
                            'object': objectName,
                            'element': "",
                            'condName': colnames,
                            'numero': numero
                        });

                        var columns = [];

                        var colFingerprint = Ext.create('Ext.grid.column.Column', {
                            header: "Fingerprint",
                            dataIndex: "M" + numero + "fingerprint",
                            flex: 1,
                            filterable: true,
                            hideable: false,
                            sortable: true
                        });
                        columns.push(colFingerprint);
                        for (var i = 0; i < colnames.length; i++) {

                            var colname = colnames[i];

                            // this.modifyModel(objectName, colname, numero);

                            var col = Ext.create('Ext.grid.column.Column', {
                                header: colname,
                                dataIndex: "M" + numero + 'map' + i,
                                filterable: true,
                                hideable: false,
                                flex: 1,
                                sortable: true
                            });
                            columns.push(col);

                        }

                        /*
                         * Ajout d'une colonne Mapping_numero de mapping contenant un
                         * tableau de colonnes de conditions
                         */

                        var gridName = "grid" + objectName;
                        var grid = Ext.getCmp(gridName);

                        var col = Ext.create('Ext.grid.column.Column', {
                            header: applicationName + " " + numero,
                            filterable: true,
                            id: 'M_' + numero,
                            sortable: true,
                            columns: columns
                        });
                        grid.headerCt.insert(grid.columns.length, col);

                        grid.getView().refresh();

                        for (var i = 0; i < colnames.length; i++) {

                            var colname = colnames[i];

                            // this.modifyModel(objectName, colname, numero);

                        }


                        /*------------------------------------------------------------------------
                         * pour toutes les data du grid Data pour mapping
                         *       ajout dans le store du grid de l'object mappe les data conditions
                         */
                        var Listid = new Array();

                        var store_object = Ext.getStore('S_Metabolite');

                        /**
                         * Commit changes : change also the grid
                         */
                        store_object.commitChanges();
                        var stringIds = "";

                        var ctrlMap = MetExplore.app.getController('C_Map');

                        var mapping = {
                            'id': 'M' + numero,
                            'name': applicationName,
                            'object': objectName,
                            'numero': numero,
                            'title': applicationName,
                            'condName': colnames
                        };

                        var itsCoverage = false;

                        if (objectName !== "Gene")
                            ctrlMap.initMappingInVisualization(mapping, numero, itsCoverage, Ext.decode(Jobrecord.get("seeds")));

                        var i = 0;

                        Ext.each(entities, function(entity) {
                            var colname = colnames[i];
                            for (var id in entity) {


                                var rec = store_object.findRecord("dbIdentifier",
                                    id, 0, false, true, true);

                                if (rec) {
                                    var map = rec.get('mapped') + 1;
                                    rec.set('mapped', map);

                                    if (objectName !== "Gene")
                                        ctrlMap.dataMappingInVisualization(colname, store_object.getByDBIdentifier(id).get('dbIdentifier'), entity[id], numero, itsCoverage);


                                    rec.set("M" + numero + 'map' + i, entity[id]);

                                }
                            }
                            i++;
                        });

                        var listFingerprint = Object.keys(Ext.decode(Jobrecord.get("seeds")));
                        store_object
                            .each(function(met) {
                                if (listFingerprint.indexOf(met.get("dbIdentifier")) === -1)
                                    met.set("M" + numero + "fingerprint", false);
                                else
                                    met.set("M" + numero + "fingerprint", true);
                            });

                        MetExplore.app.getController('C_MappingVizPanel').onCollapseCombo(Ext.getCmp('comboMappingViz'), [storeMap.last()]);
                        Ext.getCmp('comboMappingViz').setValue(storeMap.last());

                        MetExploreViz.onloadMetExploreViz(function() {
                            metExploreViz.onloadSession(function() {
                                console.log("loadDataFromJSON");console.log(MetExplore.globals.Session.mappingObjViz[numero]);metExploreViz.GraphMapping.loadDataFromJSON(JSON.stringify(MetExplore.globals.Session.mappingObjViz[numero]));
                            });
                        });
                    } else {
                        Ext.MessageBox
                            .alert(
                                'Page rank and Chei rank failed',
                                'None mapped node');
                    }

                }

                if ("associatedMeSHFromMetab4InCHlib" in json) {
                    applicationName = "Metab2MeSH";
                    var objectName = "Metabolite";

                    var storeMap = Ext.getStore('S_MappingInfo');

                    if (storeMap.last())
                        numero = storeMap.last().get('numero') + 1;
                    else {
                        numero = 1;

                    }
                    var data = {
                        meSHFromMetab4InCHlib: json["associatedMeSHFromMetab4InCHlib"],
                        pubmed: json["associatedMeSHFromMetab"]
                    };
                    var mapping = {
                        'id': 'M' + numero,
                        'name': applicationName,
                        'title': applicationName + " " + numero,
                        'object': objectName,
                        'data': data,
                        'numero': numero
                    };
                    storeMap.add(mapping);
                    var ctrlMap = MetExplore.app.getController('C_Map');
                    if (objectName !== "Gene")
                        ctrlMap.initMappingInVisualization(mapping, numero, false, undefined, data);

                    MetExplore.app.getController('C_MappingVizPanel').onCollapseCombo(Ext.getCmp('comboMappingViz'), [storeMap.last()]);
                    Ext.getCmp('comboMappingViz').setValue(storeMap.last());

                    //initialiser le modele
                    var model = MetExplore.app.getModel(objectName);
                    var fields = model.prototype.fields.getRange();
                    var store = Ext.getStore('S_' + objectName);

                    fields.push({
                        name: 'M' + numero + "idPubChem",
                        defaultValue: ' ',
                        sortType: function(value) {
                            var sorter = store.sorters.getAt(0);
                            var dir = sorter.direction;
                            if (value === ' ' || value === undefined) {
                                if (dir === 'ASC') return String.fromCharCode(254);
                                else return String.fromCharCode(1);
                            } else {
                                if (value === "false") {
                                    if (dir === 'ASC') return String.fromCharCode(253);
                                    else return String.fromCharCode(2);
                                } else {
                                    return value;
                                }
                            }
                        }
                    });

                    model.setFields(fields);

                    var col = Ext.create('Ext.grid.column.Column', {
                        header: "Link to PubChem",
                        dataIndex: "M" + numero + "idPubChem",
                        flex: 1,
                        filterable: true,
                        hideable: false,
                        sortable: true,
                        renderer: function(value) {
                            if (value)
                                return "<a target='_blank' href='https://pubchem.ncbi.nlm.nih.gov/compounds/" + value + "'>" + value + "</a>";
                            return "";
                        }
                    });

                    var colFingerprint = Ext.create('Ext.grid.column.Column', {
                        header: "Fingerprint",
                        dataIndex: "M" + numero + "fingerprint",
                        flex: 1,
                        filterable: true,
                        hideable: false,
                        sortable: true
                    });

                    /*
                     * Ajout d'une colonne Mapping_numero de mapping contenant un
                     * tableau de colonnes de conditions
                     */

                    var gridName = "grid" + objectName;
                    var grid = Ext.getCmp(gridName);

                    var col = Ext.create('Ext.grid.column.Column', {
                        header: applicationName,
                        filterable: true,
                        hideable: false,
                        id: 'M_' + numero,
                        columns: [colFingerprint, col]
                    });
                    grid.headerCt.insert(grid.columns.length, col);

                    grid.getView().refresh();
                    var store_object = Ext.getStore('S_Metabolite');

                    data.pubmed.metabolites.forEach(function(metabolite) {
                        var rec = store_object.findRecord("name",
                            metabolite.name, 0, false, true, true);


                        if (rec) {
                            var map = rec.get('mapped') + 1;
                            rec.set('mapped', map);
                            map = rec.get('mapped') + 1;
                            rec.set('mapped', map);
                            rec.set("M" + numero + "identified", true);
                            rec.set("M" + numero + "idPubChem", metabolite.iupac);
                        }
                    });

                    var listFingerprint = Ext.decode(Jobrecord.get("seeds"));
                    store_object
                        .each(function(met) {
                            if (listFingerprint.indexOf(met.get("dbIdentifier")) === -1)
                                met.set("M" + numero + "fingerprint", false);
                            else
                                met.set("M" + numero + "fingerprint", true);
                        });
                }

                if ("associatedMetabolites" in json) {
                    var associatedMetabolites = json["associatedMetabolites"];
                    applicationName = "MeSH2Metab";
                    var meshTerm = json["mesh"];
                    var objectName = "Metabolite";

                    if (Object.keys(associatedMetabolites).length > 0) {
                        var storeMap = Ext.getStore('S_MappingInfo');

                        if (storeMap.last())
                            numero = storeMap.last().get('numero') + 1;
                        else {
                            numero = 1;

                        }

                        //initialiser le modele
                        var model = MetExplore.app.getModel(objectName);
                        var fields = model.prototype.fields.getRange();
                        var store = Ext.getStore('S_' + objectName);

                        fields.push({
                            name: 'M' + numero + "idPubMed",
                            defaultValue: ' ',
                            sortType: function(value) {
                                var sorter = store.sorters.getAt(0);
                                var dir = sorter.direction;
                                if (value === ' ' || value === undefined) {
                                    if (dir === 'ASC') return String.fromCharCode(254);
                                    else return String.fromCharCode(1);
                                } else {
                                    if (value === "false") {
                                        if (dir === 'ASC') return String.fromCharCode(253);
                                        else return String.fromCharCode(2);
                                    } else {
                                        return value;
                                    }
                                }
                            }
                        });

                        model.setFields(fields);

                        var colnames = ['Fisher Exact Test', 'Benjamini-Hochberg FDR'];

                        storeMap.add({
                            'id': 'M' + numero,
                            'name': applicationName,
                            'title': applicationName + " on " + meshTerm,
                            'object': objectName,
                            'element': "",
                            'condName': colnames,
                            'numero': numero
                        });

                        var columns = [];
                        for (var i = 0; i < colnames.length; i++) {

                            var colname = colnames[i];

                            var col = Ext.create('Ext.grid.column.Column', {
                                header: colname,
                                dataIndex: "M" + numero + 'map' + i,
                                filterable: true,
                                hideable: false,
                                flex: 1,
                                sortable: true
                            });
                            columns.push(col);

                        }
                        var col = Ext.create('Ext.grid.column.Column', {
                            header: "Link to PubMed",
                            dataIndex: "M" + numero + "idPubMed",
                            flex: 1,
                            filterable: true,
                            hideable: false,
                            sortable: true,
                            renderer: function(value) {
                                if (value)
                                    return "<a target='_blank' href='https://www.ncbi.nlm.nih.gov/pubmed/?term=" + value + "'>" + value + "</a>";
                                return "";
                            }
                        });

                        columns.push(col);

                        /*
                         * Ajout d'une colonne Mapping_numero de mapping contenant un
                         * tableau de colonnes de conditions
                         */

                        var gridName = "grid" + objectName;
                        var grid = Ext.getCmp(gridName);

                        var col = Ext.create('Ext.grid.column.Column', {
                            header: applicationName + " on " + meshTerm,
                            filterable: true,
                            id: 'M_' + numero,
                            sortable: true,
                            columns: columns
                        });
                        grid.headerCt.insert(grid.columns.length, col);

                        grid.getView().refresh();

                        var store_object = Ext.getStore('S_Metabolite');

                        /**
                         * Commit changes : change also the grid
                         */
                        store_object.commitChanges();

                        var ctrlMap = MetExplore.app.getController('C_Map');
                        var mapping = {
                            'id': 'M' + numero,
                            'name': applicationName,
                            'object': objectName,
                            'numero': numero,
                            'title': applicationName,
                            'condName': colnames
                        };

                        var itsCoverage = false;

                        if (objectName !== "Gene")
                            ctrlMap.initMappingInVisualization(mapping, numero, itsCoverage);

                        var arrayIds = [];
                        for (var key in associatedMetabolites) {

                            var rec = store_object.findRecord("dbIdentifier",
                                key, 0, false, true, true);

                            if (rec) {
                                var map = rec.get('mapped') + 1;
                                rec.set('mapped', map);

                                if (objectName !== "Gene") {
                                    ctrlMap.dataMappingInVisualization(
                                        "Fisher Exact Test",
                                        store_object.getByDBIdentifier(key).get('dbIdentifier'),
                                        associatedMetabolites[key].fisherExact,
                                        numero,
                                        itsCoverage)


                                    ctrlMap.dataMappingInVisualization(
                                        "Benjamini-Hochberg FDR",
                                        store_object.getByDBIdentifier(key).get('dbIdentifier'),
                                        associatedMetabolites[key].qValue,
                                        numero,
                                        itsCoverage)
                                }
                                rec.set("M" + numero + 'map' + 0, associatedMetabolites[key].fisherExact);
                                map = rec.get('mapped') + 1;
                                rec.set('mapped', map);
                                rec.set("M" + numero + 'map' + 1, associatedMetabolites[key].qValue);
                                map = rec.get('mapped') + 1;
                                rec.set('mapped', map);
                                arrayIds.push(rec.get('id'));
                                rec.set("M" + numero + "identified", true);
                                rec.set("M" + numero + "idPubMed", associatedMetabolites[key].iupac + " AND " + meshTerm + "[Mesh Terms]");
                            }
                        }

                        store_object
                            .filter(function(met) {
                                return met.get("M" + numero + "identified") == undefined;
                            });

                        store_object
                            .each(function(met) {
                                met.set("M" + numero + "identified", false);
                            });
                        store_object.clearFilter();

                        storeMap.last().set('idMapped', arrayIds.join(','));

                        // MetExplore.app.getController('C_MappingVizPanel').onCollapseCombo(Ext.getCmp('comboMappingViz'), [storeMap.last()])
                        // Ext.getCmp('comboMappingViz').setValue(storeMap.last());
                        //
                        // MetExploreViz.onloadMetExploreViz(function(){
                        //     metExploreViz.onloadSession(function(){
                        //         console.log("loadDataFromJSON");metExploreViz.GraphMapping.loadDataFromJSON(JSON.stringify(MetExplore.globals.Session.mappingObjViz[numero]));
                        //     });
                        // });
                        /**------------------------------------------------------------------------
                         * Pathway Coverage
                         *        calcul de la couverture Metabolite
                         */
                        var ctrl = MetExplore.app.getController('C_Map');
                        var panel = Ext.getCmp('tabPanel').getActiveTab();
                        var myMask = new Ext.LoadMask({
                            target: panel, // Here myPanel is the component you wish to mask
                            msg: "Please wait..."
                        });
                        myMask.show();
                        var storeMapInfo = Ext.getStore('S_MappingInfo');

                        //
                        // var recInfo = storeMapInfo.findRecord('numero', numero);
                        // if (recInfo) {
                        //     recInfo.set('nbData', storeMapInfo.getCount());
                        //     recInfo.set('nbMapped', Listid.length);
                        //     storeMapInfo.filter("identified", true);
                        //     //console.log(storeData);
                        //     var nbDataNetwork = storeMapInfo.getCount();
                        //     storeMapInfo.clearFilter();
                        //
                        //     recInfo.set('nbDataInNetwork', nbDataNetwork);
                        //     //recInfo.set('nbDataInNetwork', Listid.length);
                        //     recInfo.set('idMapped', Listid.join());
                        //     //var resultMapping= panel.query('text[name=resultMapping]')[0];
                        //     //resultMapping.text= 'Nb Data :' +storeDataMap.getCount()+' Nb Mapped :' +Listid.length;
                        // }

                        // ctrl.addReport(numero, 1);

                        Ext.getStore('S_Metabolite').sort({
                            property: 'mapped',
                            direction: 'DESC'
                        });
                        ctrlMap.coverage(numero, storeMapInfo, 0, myMask);

                        Ext.callback(ctrl.afterMapInGrid(MetExplore.globals.Session.mappingObjViz[numero]), this);

                    } else {
                        Ext.MessageBox
                            .alert(
                                'Find Metabolite associated to MeSH failed',
                                'None mapped node');
                    }

                }

                win_wait.close();
                Ext.resumeLayouts(true);

                if (mappingFinished && ("message" in json)) {
                    message = json["message"];
                    win.alert("Application message", message);
                } else if ("message" in json) {
                    message = "This result has already been mapped on the appropriate grid.";
                    win.alert("Application message", message);
                }
            }
        });
    },

    displayError: function(path, applicationName) {
        console.log(record);
    },

    /**
     * mapEntities
     * @param {} entities
     * @param {} applicationName
     * @param {} objectName
     */
    mapEntities: function(entities, applicationName, objectName, Jobrecord) {

        if (entities.length > 0) {

            var storeMap = Ext.getStore('S_MappingInfo');

            if (storeMap.findRecord("id", 'M' + Jobrecord.get('id'), 0, false, true, true)) {
                return false;
            }


            if (storeMap.last())
                numero = storeMap.last().get('numero') + 1;
            else
                numero = 1;

            storeMap.add({
                'id': 'M' + Jobrecord.get('id'),
                'name': applicationName,
                'title': applicationName + " " + numero,
                'object': objectName,
                'element': "",
                'numero': numero
            });

            var colnames = [];

            // Get the column names in the first record
            var firstRecord = entities[0];

            for (key in firstRecord) {
                if (key != "dbIdentifier") {
                    colnames.push(key);
                }
            }

            var columns = [];
            for (var i = 0; i < colnames.length; i++) {

                var colname = colnames[i];

                // this.modifyModel(objectName, colname, numero);

                var col = Ext.create('Ext.grid.column.Column', {
                    header: colname,
                    dataIndex: "M" + numero + 'map' + i,
                    filterable: true,
                    hideable: false,
                    // flex : 1,
                    sortable: true
                });
                columns.push(col);

            }

            /*
             * Ajout d'une colonne Mapping_numero de mapping contenant un
             * tableau de colonnes de conditions
             */

            var gridName = "grid" + objectName;
            var grid = Ext.getCmp(gridName);

            var col = Ext.create('Ext.grid.column.Column', {
                header: applicationName + " " + numero,
                filterable: true,
                id: 'M_' + Jobrecord.get('id'),
                // sortable : true,
                columns: columns
            });
            grid.headerCt.insert(grid.columns.length, col);

            grid.getView().refresh();

            // for (var i = 0; i < colnames.length; i++) {

            // 	var colname = colnames[i];

            // 	this.modifyModel(objectName, colname, numero);

            // }


            /*------------------------------------------------------------------------
             * pour toutes les data du grid Data pour mapping
             * 		ajout dans le store du grid de l'object mappe les data conditions
             */
            var Listid = new Array();

            var store_object = Ext.getStore("S_" + objectName);


            // /**
            // * Commit changes : change also the grid
            // */
            // store_object.commitChanges();
            var stringIds = "";

            var ctrlMap = MetExplore.app.getController('C_Map');

            var mapping = {
                'id': 'M' + numero,
                'name': applicationName,
                'object': objectName,
                'numero': numero,
                'title': applicationName,
                'condName': colnames
            };

            var itsCoverage = false;

            // get the ids filtered and clear the filter
            var a_ids = [];


            store_object.each(function(record) {
                a_ids.push(record.id);
            });

            store_object.clearFilter(true);

            if (objectName !== "Gene")
                ctrlMap.initMappingInVisualization(mapping, numero, itsCoverage);

            Ext.each(entities, function(entity) {

                var dbIdentifier = entity["dbIdentifier"];

                var rec;



                var rec = store_object.findRecord("dbIdentifier",
                    dbIdentifier, 0, false, true, true);

                if (rec) {
                    var map = rec.get('mapped') + 1;
                    rec.set('mapped', map);

                    if (entities.indexOf(entity) == entities.length - 1)
                        stringIds += rec.get('id');
                    else
                        stringIds += rec.get('id') + ',';

                    for (var i = 0; i < colnames.length; i++) {
                        colname = colnames[i];

                        if (objectName !== "Gene")
                            ctrlMap.dataMappingInVisualization(colname, dbIdentifier, entity[colname], numero, itsCoverage);

                        rec.set("M" + numero + 'map' + i,
                            entity[colname]);


                        // } catch (err) {
                        // console.log(rec)
                        // There is an error during the second
                        // mapping but it seems that it does not
                        // affect
                        // the process
                        // }
                    }


                }
            });

            // reload the filters
            store_object.filter(function(record) {
                return (a_ids.includes(record.id));
            });

            // store_object.reload({filters:a_filters});

            // a_filters.filters = a_filters;
            // a_filters.eachKey(function(key, item) {
            //     console.log("filter", key, item);
            //     // if(typeof filter !== "undefined") {
            //     //     store_object.filter(filter);
            //     // }
            // });

            MetExploreViz.onloadMetExploreViz(function() {
                metExploreViz.onloadSession(function() {
                    console.log("loadDataFromJSON");console.log(MetExplore.globals.Session.mappingObjViz[numero]);metExploreViz.GraphMapping.loadDataFromJSON(JSON.stringify(MetExplore.globals.Session.mappingObjViz[numero]));
                });
            });

            return true;

        }

    },
    /**
     * modifyModel
     * @param {} object
     * @param {} colname
     * @param {} numero
     */
    modifyModel: function(object, colname, numero) {
        // console.log('numero', 'M'+numero+record.dataIndex);
        // console.log('change model', record);
        var model = MetExplore.app.getModel(object);
        var fields = model.prototype.fields.getRange();
        if (colname == "max")
            i = 1;
        else
            i = 0;

        fields.push({
            name: "M" + numero + 'map' + i
            // type: 'float',

        });

        model.setFields(fields);
        // affectation de valeur pour le champs ajoute dans le modele

        store = Ext.getStore('S_' + object);

        store.each(function(rec) {
            rec.set("M" + numero + 'map' + i, null);
        });
        store.commitChanges();
    },

    /**
     * Close all the java application panels
     */
    closeJavaApplicationPanels: function() {

        var mainPanel = Ext.ComponentQuery.query("mainPanel")[0];
        var networkData = Ext.ComponentQuery.query("networkData")[0];

        mainPanel.setActiveTab(networkData);

        var applicationPanels = Ext.ComponentQuery.query("ja_parameters_form");

        Ext.Array.each(applicationPanels, function(applicationPanel) {
            applicationPanel.close();
        });

        Ext.Array.each(Ext.ComponentQuery.query("SBMLExportUI"), function(panels) {
            panels.close();
        });
        Ext.Array.each(Ext.ComponentQuery.query("SBMLImportUI"), function(panels) {
            panels.close();
        });
    }

});