/**
 * controller graph panel
 */
Ext.define('MetExplore.controller.C_GraphPanel', {
    extend: 'Ext.app.Controller',
    // requires : [ 'MetExplore.globals.Session' ],
    // config : {
    // models : [ 'NetworkVizSession', 'NetworkData' ],
    // stores : [ 'S_Cart', 'S_NetworkVizSession', 'S_ColorMapping',
    // 'S_Metabolite', 'S_Reaction', 'S_NetworkData', 'S_Scale' ],
    // views : [ 'main.V_GraphPanel']
    // },
    fields: ["_metExploreViz"],


    /*******************************************
     * Initialization of listeners
     */
    init: function() {
        this.getStore('S_Cart')
            .addListener('datachanged',
                function(store) {
                    // If the cart store is empty we disable the button 
                    // else enable
                    var buttonRefresh = Ext.getCmp('buttonRefresh');
                    var buttonSaveNetwork = Ext.getCmp('buttonSaveNetwork');
                    var vizMiningMenu = Ext.getCmp('vizMiningMenuID');
                    var vizExportMenuID = Ext.getCmp('vizExportMenuID');
                    var vizDrawingMenu = Ext.getCmp('vizDrawingMenuID');


                    if (store.getCount() == 0) {
                        var session = Ext.getStore('S_NetworkVizSession').getById('viz');
                        if (session != undefined) {
                            session.setActivity(false);
                            metExploreD3.GraphNetwork.stopForce(session);
                        }

                        metExploreD3.GraphPanel.removeSvgComponents("viz");
                        if (buttonRefresh != undefined) {
                            buttonRefresh.setDisabled(true);
                            buttonRefresh.setTooltip('You must fill the cart to create the network');
                        }

                        if (buttonSaveNetwork != undefined) {
                            buttonSaveNetwork.setDisabled(true);
                            buttonSaveNetwork.setTooltip('You must create a network to save the network');
                        }

                        if (vizMiningMenu != undefined) {
                            vizMiningMenu.setDisabled(true);
                            vizMiningMenu.setTooltip('You must create network a to use this menu');
                        }

                        if (vizExportMenuID != undefined) {
                            vizExportMenuID.setTooltip('You must create network a to use this menu');
                            vizExportMenuID.setDisabled(true);
                        }
                        if (vizDrawingMenu != undefined) {
                            vizDrawingMenu.setTooltip('You must create network a to use this menu');
                            vizDrawingMenu.setDisabled(true);
                        }
                    } else {
                        if (buttonRefresh != undefined) {
                            buttonRefresh.setDisabled(false);
                            buttonRefresh.setTooltip('The graph will be updated to fit cart content and database modifications');
                        }
                    }
                }, this);
        this.control({
            'graphPanel': {
                afterrender: function() {
                    this.initiateViz('D3');
                },
                afterrefresh: metExploreD3.GraphCaption.drawCaption

            },
            'graphPanel button[action=refresh]': {
                click: function() {
                    var buttonSaveNetwork = Ext.getCmp('buttonSaveNetwork');
                    var vizMiningMenu = Ext.getCmp('vizMiningMenuID');
                    var vizExportMenuID = Ext.getCmp('vizExportMenuID');
                    var vizDrawingMenu = Ext.getCmp('vizDrawingMenuID');

                    if (buttonSaveNetwork != undefined) {
                        buttonSaveNetwork.setDisabled(false);
                        buttonSaveNetwork.setTooltip('The graph will be saved in other frame');
                    }
                    if (vizMiningMenu != undefined) {
                        vizMiningMenu.setDisabled(false);
                        vizMiningMenu.setTooltip('');
                    }

                    if (vizExportMenuID != undefined) {
                        vizExportMenuID.setDisabled(false);
                        vizExportMenuID.setTooltip('');
                    }
                    if (vizDrawingMenu != undefined) {
                        vizDrawingMenu.setDisabled(false);
                        vizDrawingMenu.setTooltip('');
                    }

                    this.refresh();
                }
            },
            'graphPanel button[action=searchNode]': {
                click: this.searchNode
            },
            'graphPanel button[action=saveNetwork]': {
                click: function() {
                    //this.loadSession();
                    this.getController('C_ComparePanel').saveNetwork()
                }
            },
            'graphPanel menu>menuitem[action=exportXGMML]': {
                click: function() {
                    this.exportXGMML();
                }
            },
            'graphPanel menu>menuitem[action=removeSideCompounds]': {
                click: function() {
                    metExploreD3.GraphNetwork.removeSideCompounds();
                }
            },
            'graphPanel menu>menuitem[action=duplicateSideCompounds]': {
                click: function() {
                    var storeSession = Ext.getStore('S_NetworkVizSession');
                    var session = storeSession.getById('viz');
                    session.setSideCompoundsDuplicated(true);
                    metExploreD3.GraphNetwork.duplicateSideCompounds('viz');
                }
            },
            'graphPanel menu>menuitem[action=highlightSubnetwork]': {
                click: metExploreD3.GraphFunction.highlightSubnetwork
            },
            'graphPanel menu>menuitem[action=keepOnlySubnetwork]': {
                click: metExploreD3.GraphFunction.keepOnlySubnetwork
            },
            'graphPanel menu>menuitem[action=exportPNG]': {
                click: metExploreD3.GraphUtils.exportPNG
            },
            'graphPanel menu>menuitem[action=exportJPG]': {
                click: metExploreD3.GraphUtils.exportJPG
            },
            'graphPanel menu>menuitem[action=exportSVG]': {
                click: metExploreD3.GraphUtils.exportSVG
            },
            'viz': {
                // Listener to move graph in center and replace widgets when the panel size changes
                resize: function() {
                    metExploreD3.GraphPanel.resizeViz("viz");
                    var session = Ext.getStore('S_NetworkVizSession').getById('viz');
                    // if visualisation is actived we add item to menu
                    if (session.isActive()) {

                        metExploreD3.GraphPanel.resizePanels('viz');
                    }
                }
            },
            'comparePanel': {

                add: function(panel) {
                    panel.expand(true);
                },
                beforeremove: function(d, component) {
                    // If a graph is already loaded
                    var storeSession = Ext.getStore('S_NetworkVizSession');
                    session = storeSession.getById(component.id + '-body');

                    if (session != undefined) {
                        // We stop the previous animation
                        metExploreD3.GraphNetwork.stopForce(session);

                        var comparedPanel = Ext.getStore('S_ComparedPanel');
                        if (comparedPanel != undefined) {
                            comparedPanel.setStoreVisibilityByParent(component.id);
                            comparedPanel.removeById(component.id + '-body');
                        }
                        storeSession.remove(session);
                        metExploreD3.GraphNetwork.looksLinked();
                    }
                },
                remove: function(panel, ownerCt) {
                    if (panel.items.length == 0)
                        panel.collapse(true);
                }
            }
        });
    },

    /*****************************************************
     * Initialization of global variables
     * @param {} vizEngine : library used to make the visualization
     */
    onSessionStart: function(vizEngine) {
        var networkVizSessionStore = Ext
            .getStore('S_NetworkVizSession');
        var NetworkVizSession = Ext.ModelManager
            .getModel('MetExplore.model.NetworkVizSession');
        var networkVizSession = new NetworkVizSession();
        networkVizSession.setVizEngine(vizEngine);
        networkVizSession.setId('viz');
        networkVizSession.setMapped('false');
        networkVizSessionStore.add(networkVizSession);
    },

    /*****************************************************
     * Initialization of visualization
     * @param {} vizEngine : library used to make the visualization
     */
    initiateViz: function(vizEngine) {

        this.onSessionStart(vizEngine);
        var ctrl = this;
        var networkVizSessionStore = Ext
            .getStore('S_NetworkVizSession').getById('viz');

        $("#viz").on('contextmenu', function(e) {
            // devalide le menu contextuel du navigateur
            e.preventDefault();

            // Define the right click to remove elements and display information
            var viz = Ext.getCmp('viz');
            if (viz != undefined) {
                if (e.target.id == "D3viz" ||
                    e.target.parentNode.parentNode.id == "D3viz" ||
                    e.target.parentNode.id == "graphComponent") {
                    if (networkVizSessionStore.getSelectedNodes().length != 0) {
                        viz.CtxMenu = new Ext.menu.Menu({
                            items: [{
                                text: 'Remove selected nodes',
                                hidden: false,
                                handler: function() {
                                    metExploreD3.GraphNetwork.removeSelectedNode("viz")
                                }
                            }, {
                                text: 'Side compounds (duplicate)',
                                hidden: false,
                                handler: function() {
                                    var storeSession = Ext.getStore('S_NetworkVizSession');
                                    var session = storeSession.getById('viz');
                                    session.setSideCompoundsDuplicated(true);
                                    metExploreD3.GraphNetwork.duplicateSideCompoundsSelected("viz");
                                }
                            }]
                        });
                    }
                } else {

                    if (e.target.id == '') {
                        if (e.target.parentNode.textContent != "") {
                            if (e.target.previousSibling.previousSibling == null)
                                var target = e.target.previousSibling;
                            else
                                var target = e.target.previousSibling.previousSibling;

                        } else
                            var target = e.target.parentNode.parentNode.firstChild;


                    } else
                        var target = e.target;



                    viz.CtxMenu = new Ext.menu.Menu({
                        items: [{
                            text: 'Remove the node',
                            hidden: false,
                            handler: function() {
                                metExploreD3.GraphNetwork.removeOnlyClickedNode(metExploreD3.GraphNode.selectNodeData(target.parentNode), "viz");
                            }
                        }, {
                            text: 'Side compound (duplicate)',
                            hidden: false,
                            handler: function() {
                                metExploreD3.GraphNetwork.duplicateASideCompoundSelected(target.parentNode, "viz");
                            }
                        }, {
                            text: 'See more information',
                            hidden: false,
                            handler: function() {

                                var id = target.id;
                                if (target.getAttribute('class') == "metabolite") {
                                    var storesMetabolites = Ext.getStore('S_Metabolite');
                                    var record = storesMetabolites.getMetaboliteById(id);
                                    var win_InfoMetabolite = Ext.create('MetExplore.view.window.V_WindowInfoMetabolite', {
                                        rec: record
                                    });
                                    win_InfoMetabolite.show();
                                    win_InfoMetabolite.focus();
                                } else {
                                    var storesReactions = Ext.getStore('S_Reaction');
                                    var record = storesReactions.getReactionById(id);
                                    var win_InfoReaction = Ext.create('MetExplore.view.window.V_WindowInfoReaction', {
                                        rec: record
                                    });
                                    win_InfoReaction.show();
                                    win_InfoReaction.focus();
                                }
                            }
                        }]
                    });
                }
            }

            // positionner le menu au niveau de la souris
            if (viz.CtxMenu != undefined)
                viz.CtxMenu.showAt(e.clientX, e.clientY);
        }); // Remove the context menu

        // Previously we used Cytoscape.js. Now we use D3.js,
        // that what is this test for
        if (networkVizSessionStore.getVizEngine() == 'D3') {

            metExploreD3.GraphNetwork.delayedInitialisation('viz');
        }
    },

    /*****************************************************
     * Update the network to fit the cart content
     */
    refresh: function() {

        var vizComp = Ext.getCmp("viz");
        if (vizComp != undefined) {
            var myMask = new Ext.LoadMask({
                target: vizComp,
                msg: "Refresh in process...",
                msgCls: 'msgClsCustomLoadMask'
            });
            myMask.show();

            var that = this;
            setTimeout(
                function() {

                    // var startall = new Date().getTime();
                    //var start = new Date().getTime();
                    // console.log("----Viz: START refresh/init Viz");

                    that.initData();

                    // Init of metabolite network
                    metExploreD3.GraphNetwork.refreshSvg('viz');

                    // 62771 ms for recon before refactoring
                    // 41465 ms now
                    // var endall = new Date().getTime();
                    // var timeall = endall - startall;
                    // console.log("----Viz: FINISH refresh/ all "+timeall);
                    myMask.hide();
                    var graphCmp = Ext.getCmp('graphPanel');
                    if (graphCmp != undefined)
                        graphCmp.fireEvent('afterrefresh');
                }, 100);
        }
    },

    /*****************************************************
     * Fill the data models with the store reaction
     */
    initData: function() {

        var networkVizSession = Ext.getStore('S_NetworkVizSession').getById("viz");

        // Reset visualisation---less than a ms
        networkVizSession.reset();

        var networkDataStore = Ext
            .getStore('S_NetworkData');

        var networkData = new NetworkData('viz');

        /*****Ajout FV*******/

        /**
         * 1) cart : mettre toutes les reactions dans node
         * mettre idReaction dans un tableau (ListId) 2) Store
         * LinkReactionMetabolite contient tous les edges pour
         * le BioSource Filtrer le store pour avoir les edges
         * des reactions du cart : filtre sur tableau ListId 3)
         * pour chaque element du store filtre ajouter edge
         */


        /*******************************************************/
        // console.log('storeAnnotReaction',storeAnnotReaction);
        // We go through each reaction of the cart and create
        // the related edges and nodes.
        /*******************************************************/
        var reactiondbIdentifier = "";
        var reactionID = "";
        var reactionName = "";

        // Get store content---few ms
        var cart = Ext.getStore('S_Cart');
        var ListIdReactions = [];
        var ListIdMetabolites = [];
        var storeAnnotR = Ext.getStore('S_AnnotationReaction');

        storeAnnotR.filter('field', 'reversible');

        cart
            .each(function(reaction) {

                reactiondbIdentifier = reaction
                    .get('dbIdentifier');
                reactionID = reaction.get('id');
                ListIdReactions.push(reactionID);
                reactionName = reaction.get('name'); // $("<div/>").html(reaction.get('name')).text();

                // Recherche annotation reversible
                var rec = storeAnnotR.findRecord('id',
                    reactionID + '_reversible', 0,
                    false, true, true);
                var ec = reaction.get('ec');

                if (rec)
                    var reactionReversibility = rec
                        .get('newV');
                else
                    var reactionReversibility = reaction
                        .get('reversible');

                networkData.addNode(reactionName,
                    undefined, reactiondbIdentifier,
                    reactionID, reactionReversibility,
                    'reaction', false, true, undefined,
                    undefined, undefined, undefined, ec, undefined, undefined, undefined, undefined, undefined, reaction
                        .get('alias'));

            });

        var lenR = ListIdReactions.length;

        // Filtre store Link recupere les links de la liste des idReaction contenus dans cart
        var storeLink = Ext
            .getStore('S_LinkReactionMetabolite');

        storeLink.filterBy(function(record, id) {
            if (Ext.Array.indexOf(ListIdReactions, record
                    .get("idReaction")) !== -1) {
                return true;
            }
            return false;
        }, this);

        var storeM = Ext.getStore('S_Metabolite');
        var storeAnnotM = Ext
            .getStore('S_AnnotationMetabolite');
        storeAnnotM.filter('field', 'sideCompound');

        var metaboliteID = "";
        var reactionID = "";
        var interaction = "";
        var reactionReversibility = true;
        var edgeID = "";

        var metaboliteName = "";
        var compartment = "";
        var dbMetabolite = "";
        var svgWidth = 0;
        var svgHeight = 0;

        var metaboliteMapIndex = 0;
        var reactionMapIndex = 0;
        var metaboliteMapIndex = 0;

        var idBack = "";

        storeLink
            .each(function(link) {

                metaboliteID = link.get('idMetabolite');
                reactionID = link.get('idReaction');
                interaction = link.get('interaction');

                // Recherche annotation reversible
                var rec = storeAnnotR.findRecord('id',
                    reactionID + '_reversible');

                if (rec)
                    reactionReversibility = rec.get('newV');
                else
                    reactionReversibility = link
                    .get('reversible');

                rec = storeAnnotM.findRecord('id',
                    metaboliteID);
                if (rec)
                    sideCompound = rec.get('newV');
                else
                    sideCompound = link.get('side');

                edgeID = link.get('edgeId');
                var metaboliteMapIndex = ListIdMetabolites.indexOf(metaboliteID);
                //console.log(sideCompound);
                if (sideCompound == 0 ||
                    sideCompound == 'false') {
                    var isSsideCompoud = false;
                } else
                    var isSsideCompoud = true;

                if (metaboliteMapIndex == -1) {
                    /**
                     * metabolite non encore ajoute dans
                     * noeud*
                     */
                    ListIdMetabolites
                        .push(metaboliteID);

                    var metabolite = storeM
                        .getById(metaboliteID);

                    sideCompound = metabolite.get('sideCompound');
                    if (sideCompound == 0 ||
                        sideCompound == 'false') {
                        var isSsideCompoud = false;
                    } else
                        var isSsideCompoud = true;
                    metaboliteName = metabolite
                        .get('name');
                    compartment = metabolite
                        .get('compartment');
                    dbMetabolite = metabolite
                        .get('dbIdentifier');
                    var metaboliteSVG = metabolite
                        .getSvgHW();
                    svgWidth = 0;
                    svgHeight = 0;
                    if (metaboliteSVG != "undefined") {
                        svgWidth = metaboliteSVG.width;
                        svgHeight = metaboliteSVG.height;
                    }

                    networkData.addNode(metaboliteName,
                        compartment, dbMetabolite,
                        metaboliteID, undefined,
                        'metabolite', false, true,
                        metaboliteSVG.svg,
                        svgWidth, svgHeight, isSsideCompoud, undefined, undefined, undefined, undefined, undefined, undefined, metabolite.get('alias'));

                    metaboliteMapIndex = ListIdMetabolites
                        .indexOf(metaboliteID);
                }

                reactionMapIndex = ListIdReactions
                    .indexOf(reactionID);
                metaboliteMapIndex = metaboliteMapIndex +
                    lenR;

                if (reactionReversibility) {
                    idBack = reactionID + "_back";
                    if (interaction == 'in') {
                        networkData.addLink(edgeID,
                            metaboliteMapIndex,
                            reactionMapIndex,
                            interaction, 'true');

                    } else {
                        networkData.addLink(edgeID,
                            reactionMapIndex,
                            metaboliteMapIndex,
                            interaction, 'true');
                    }
                } else {
                    if (interaction == 'in') {
                        networkData.addLink(edgeID,
                            metaboliteMapIndex,
                            reactionMapIndex,
                            interaction, 'false');

                    } else {
                        networkData.addLink(edgeID,
                            reactionMapIndex,
                            metaboliteMapIndex,
                            interaction, 'false');
                    }
                }
                //}
            });
        storeLink.clearFilter();
        storeAnnotM.clearFilter();
        storeAnnotR.clearFilter();

        /***** Fin Ajout FV****/

        // Graph creation takes between 1 and 2s
        // var end = new Date().getTime();
        // var time = end - start;
        // console.log(networkVizSession);
        // console.log("----Viz: END refresh/Network creation
        // "+time);

        networkData.setId('viz');
        networkDataStore.add(networkData);

        networkVizSession.setD3Data(networkData);
    },

    /*******************************************
     * Export a json which describe a metabolic network. 
     */
    exportJSON: function() {
        var storeNetworkData = Ext.getStore('S_NetworkData');
        var storeReaction = metExploreD3.getReactionsSet();
        var storeMetabolite = metExploreD3.getMetabolitesSet();
        var storeCompartmentInBioSource = Ext.getStore('S_CompartmentInBioSource');
        var stringJSON = "";
        stringJSON += "{\"reaction\":[";
        var storeReactionMap = Ext.create('Ext.data.Store', {
            fields: ['id', 'ec', 'name', 'reversible']
        });

        storeReaction.each(function(reaction) {
            storeNetworkData.getStoreById('viz').getNodes().forEach(function(node) {
                if (node.getId() == reaction.get('id')) {
                    storeReactionMap.add({
                        id: node.getId(),
                        ec: reaction.get('ec'),
                        name: node.getName(),
                        reversible: node.getReactionReversibility()
                    });
                }
            });
        });

        for (var i = 0; i < storeReactionMap.getCount(); i++) {
            stringJSON += Ext.JSON.encode(storeReactionMap.getRange()[i].data);
            if (i != storeReactionMap.getCount() - 1)
                stringJSON += ',\n';
        }
        stringJSON += "],\n\n\"metabolite\":[";
        var storeMetaboliteMap = Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'chemicalFormula', 'compartment', 'inchi']
        });

        // var storeMapping = Ext.getStore('S_Mapping');

        storeNetworkData.getStoreById('viz').getNodes().forEach(function(node) {
            storeMetabolite.each(function(metabolite) {
                if (node.getId() == metabolite.get('id')) {
                    var mapped = metabolite.get('mapped') > 0;
                    // if(metabolite.get('mapped')>0){
                    // 	storeMapping.each(function(map){
                    // 		arrayId = map.get('idMapped').split(',');
                    // 		arrayId.forEach(function(id){
                    // 			if(id==node.getId())
                    // 			{
                    // 				var ndCond = map.get('condName').length;
                    // 				for(var i =0; i<ndCond ; i++){

                    // 				}
                    // 			}
                    // 		});
                    // 	});		
                    // }
                    storeMetaboliteMap.add({
                        id: node.getId(),
                        name: metabolite.get('name'),
                        formula: metabolite.get('chemicalFormula'),
                        compartment: metabolite.get('compartment'),
                        inchi: metabolite.get('inchi'),
                        mapped: mapped
                    });
                }
            });
            if (node.isSideCompound()) {
                var idNode = node.getId();
                idNode = idNode.split('-');
                var metabolite = storeMetabolite.getMetaboliteById(idNode[0]);
                var mapped = metabolite.get('mapped') > 0;
                // if(metabolite.get('mapped')>0){
                // 	storeMapping.each(function(map){
                // 		arrayId = map.get('idMapped').split(',');
                // 		arrayId.forEach(function(id){
                // 			if(id==node.getId())
                // 			{
                // 				var ndCond = map.get('condName').length;
                // 				for(var i =0; i<ndCond ; i++){

                // 				}
                // 			}
                // 		});
                // 	});		
                // }
                storeMetaboliteMap.add({
                    id: node.getId(),
                    name: metabolite.get('name'),
                    formula: metabolite.get('chemicalFormula'),
                    compartment: metabolite.get('compartment'),
                    inchi: metabolite.get('inchi'),
                    mapped: mapped
                });
            }
        });

        for (var i = 0; i < storeMetaboliteMap.getCount(); i++) {
            stringJSON += Ext.JSON.encode(storeMetaboliteMap.getRange()[i].data);
            if (i != storeMetaboliteMap.getCount() - 1)
                stringJSON += ',\n';
        }

        stringJSON += "],\n\n\"link\":[";
        var storeLinkMap = Ext.create('Ext.data.Store', {
            fields: ['source', 'target', 'interaction']
        });

        storeNetworkData.getStoreById('viz').getLinks().forEach(function(link) {
            storeLinkMap.add({
                source: link.source.getId(),
                target: link.target.getId(),
                interaction: link.interaction
            });
        });

        for (var i = 0; i < storeLinkMap.getCount(); i++) {
            stringJSON += Ext.JSON.encode(storeLinkMap.getRange()[i].data);
            if (i != storeLinkMap.getCount() - 1)
                stringJSON += ',\n';
        }

        stringJSON += "],\n\n\"compartment\":[";
        var storeCompartment = Ext.create('Ext.data.Store', {
            fields: ['name', 'color']
        });

        storeCompartmentInBioSource.each(function(compartmentInBioSource) {
            storeCompartment.add({
                name: compartmentInBioSource.get('name'),
                color: compartmentInBioSource.get('color')
            });
        });

        for (var i = 0; i < storeCompartment.getCount(); i++) {
            stringJSON += Ext.JSON.encode(storeCompartment.getRange()[i].data);
            if (i != storeCompartment.getCount() - 1)
                stringJSON += ',\n';
        }
        stringJSON += ']}\n';

        return stringJSON;
    },

    /*******************************************
     * Export a json file which describe a metabolic network. 
     */
    exportJsonFile: function() {
        var stringJSON = this.exportJSON();
        var link = document.createElement('a');
        link.download = 'data.json';
        var blob = new Blob([stringJSON], {
            type: 'text/plain'
        });
        link.href = window.URL.createObjectURL(blob);
        link.click();
    },

    /*******************************************
     * Export a XGMML file which describe a metabolic network. 
     */
    exportXGMML: function() {

        if (MetExplore.globals.Session.idUser == "" ||
            MetExplore.globals.Session.idUser == -1) {
            var winWarning = Ext.create("Ext.window.MessageBox", {
                height: 300
            });

            winWarning
                .alert('Warning',
                    'You are not connected, the job will be available only during your session. ');

            winWarning.setPosition(50);
        }

        var svg = encodeURIComponent(metExploreD3.GraphUtils.exportMainSVG());
        var json = encodeURIComponent(this.exportJSON().replace(/\n/g, ''));

        var bs = {
            "analysis_title": 'Xgmml Export',
            "java_class": "metexplore.XgmmlExporter",
            "json": json,
            "svg": svg
        };
        Ext.Ajax.request({
            url: 'resources/src/php/application_binding/launchJavaApplication.php',
            method: 'POST',
            params: bs,
            success: function(response, opts) {
                var json = Ext.decode(response.responseText);


                if (json["success"] == false) {
                    Ext.Msg
                        .alert("Failed",
                            "Problem in getting results from the server (success = false)");


                } else {

                    var message = json["message"];

                    var win = Ext.create("Ext.window.MessageBox", {
                        height: 300
                    });

                    win.show({
                        title: "Application message",
                        msg: message
                    });

                    var sidePanel = Ext.ComponentQuery.query("sidePanel")[0];
                    var gridJobs = sidePanel.down("gridJobs");
                    gridJobs.expand();

                    Ext.getStore("S_Analyses").reload();

                }
            },
            failure: function(response, opts) {
                Ext.MessageBox.alert('Server-side failure with status code ' + response.status);
            }
        });
    },

    /*****************************************************
     * Search node in the visualisation by name, ec, compartment
     */
    searchNode: function() {
        metExploreD3.GraphNode.searchNode(Ext.getCmp("searchNodeTextField").getValue());
    }
});