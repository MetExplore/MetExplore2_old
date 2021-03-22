/**
 * partie pour creation fichier excel
 */

var Base64 = (function() {
    // Private property
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // Private method for UTF-8 encoding

    function utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }

    // Public method for encoding
    return {
        encode: (typeof btoa == 'function') ? function(input) {
            return btoa(utf8Encode(input));
        } : function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = utf8Encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) + keyStr.charAt(enc4);
            }
            return output;
        }
    };
})();

/**
 * C_gridCart
 */
Ext.define('MetExplore.controller.C_gridCart', {
    extend: 'Ext.app.Controller',

    config: {
        models: ['NetworkData'],
        views: ['grid.V_gridCart'],
        stores: ['S_Cart']
    },
    init: function() {
        this.getStore('S_Cart')
            .addListener('datachanged',
                function(store) {

                    if (store.getCount() != 0) {
                        MetExploreViz.onloadMetExploreViz(function() {

                            var networkData = metExploreViz.newNetworkData('viz');

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

                            metExploreViz.getGlobals().setBiosource({
                                id: MetExplore.globals.Session.idBioSource,
                                name: MetExplore.globals.Session.nameBioSource,
                                version: MetExplore.globals.Session.version
                            });
                            var storeReactionPathway = Ext
                                .getStore('S_ReactionPathway');
                            var storePathway = Ext
                                .getStore('S_Pathway');

                            var sommeOk = 0;
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

                                    var arrayIds = [];

                                    storeReactionPathway.getRange()
                                        .filter(function(reactionPathway) {
                                            return reactionPathway.get('idReaction') == reactionID;
                                        })
                                        .forEach(function(reactionPathway) {
                                            var pathway = storePathway.getById(reactionPathway.get('idPathway'));
                                            arrayIds.push(pathway.get('name'));
                                        });

                                    networkData.addNode(
                                        reactionName,
                                        undefined, 
                                        reactiondbIdentifier,
                                        reactionID, 
                                        reactionReversibility,
                                        'reaction', 
                                        false, 
                                        true, 
                                        undefined,
                                        undefined, 
                                        undefined, 
                                        undefined, 
                                        ec, 
                                        undefined, 
                                        undefined, 
                                        arrayIds, 
                                        undefined, 
                                        reaction.get('alias'));

                                    sommeOk++;


                                });

                            /***** Fin Ajout FV****/

                            // Graph creation takes between 1 and 2s
                            // var end = new Date().getTime();
                            // var time = end - start;
                            // console.log(networkVizSession);
                            // console.log("----Viz: END refresh/Network creation
                            // "+time);



                            function launchCartFilled(func) {

                                var nbReactions = cart.getCount();
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

                                        var metaboliteMapIndex = ListIdMetabolites.indexOf(metaboliteID);

                                        if (metaboliteMapIndex == -1) {
                                            /**
                                             * metabolite non encore ajoute dans
                                             * noeud*
                                             */

                                            ListIdMetabolites
                                                .push(metaboliteID);

                                            var metabolite = storeM
                                                .getById(metaboliteID);

                                            rec = storeAnnotM.findRecord('id',
                                                metaboliteID);
                                            if (rec)
                                                sideCompound = rec.get('newV');
                                            else
                                                sideCompound = metabolite.get('sideCompound');

                                            if (sideCompound == 0 ||
                                                sideCompound == 'false' || sideCompound == false) {
                                                var isSsideCompoud = false;
                                            } else
                                                var isSsideCompoud = true;


                                            metaboliteName = metabolite
                                                .get('name');
                                            compartment = Ext.getStore('S_CompartmentInBioSource').getStoreByIdentifierFullStore(metabolite.get('compartment')).getName();

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
                                            networkData.addNode(
                                                metaboliteName,
                                                compartment, 
                                                dbMetabolite,
                                                metaboliteID, 
                                                undefined,
                                                'metabolite', 
                                                false, 
                                                true,
                                                metaboliteSVG.svg,
                                                svgWidth, 
                                                svgHeight, 
                                                isSsideCompoud, 
                                                undefined, 
                                                undefined, 
                                                undefined, 
                                                undefined, 
                                                undefined, 
                                                metabolite.get('alias'));

                                            metaboliteMapIndex = ListIdMetabolites
                                                .indexOf(metaboliteID);
                                        }

                                        networkData.getNodeById(reactionID).getPathways()
                                            .forEach(function(pathw) {
                                                networkData.getNodeById(metaboliteID).addPathway(pathw);
                                            });

                                        reactionMapIndex = ListIdReactions
                                            .indexOf(reactionID);
                                        metaboliteMapIndex = metaboliteMapIndex +
                                            lenR;

                                        if (reactionReversibility) {
                                            idBack = reactionID + "_back";
                                            if (interaction == 'in') {
                                                networkData.addLink(metaboliteID + " -- " + reactionID,
                                                    metaboliteMapIndex,
                                                    reactionMapIndex,
                                                    interaction, 'true');

                                            } else {
                                                networkData.addLink(reactionID + " -- " + metaboliteID,
                                                    reactionMapIndex,
                                                    metaboliteMapIndex,
                                                    interaction, 'true');

                                            }
                                        } else {
                                            if (interaction == 'in') {
                                                networkData.addLink(metaboliteID + " -- " + reactionID,
                                                    metaboliteMapIndex,
                                                    reactionMapIndex,
                                                    interaction, 'false');

                                            } else {
                                                networkData.addLink(reactionID + " -- " + metaboliteID,
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

                                networkData.setId('viz');
                                var myJsonString = JSON.stringify(networkData);
                                metExploreViz.cartFilled(myJsonString);

                            });
                        })
                    } else {

                    }
                }, this);

        // Listen for the event.
        document.addEventListener('refreshCart', function(e) {

            function launchRefreshCardReactions(func) {
                if (MetExplore.globals.Loaded.S_Reaction == true && MetExplore.globals.Loaded.S_Pathway == true) {
                    // the variable is defined
                    func();
                    return;
                }
                var that = this;
                setTimeout(function() {
                    launchRefreshCardReactions(func);
                }, 100);
            }

            function onloadReactionInStore(func) {
                launchRefreshCardReactions(func);
            }

            onloadReactionInStore(function() {
                var nodes = e.value;

                var store = Ext.getStore('S_Reaction');
                var storeReactionPathway = Ext.getStore('S_ReactionPathway');
                var storePathway = Ext.getStore('S_Pathway');

                var selectReactions = [];
                nodes.forEach(function(node) {
                    if (node.getBiologicalType() == "reaction") {
                        var nodeFromStore = store.getNodeById(node.getId());
                        if (nodeFromStore != undefined) {
                            selectReactions.push(nodeFromStore);

                            storeReactionPathway.getRange()
                                .filter(function(reactionPathway) {
                                    return reactionPathway.get('idReaction') == node.getId();
                                })
                                .forEach(function(reactionPathway) {
                                    var pathway = storePathway.getById(reactionPathway.get('idPathway'));
                                    node.addPathway(pathway.get('name'));
                                });

                        } else {
                            var nodeFromStore = store.getByDBIdentifier(node.getDbIdentifier());
                            if (nodeFromStore != undefined) {
                                selectReactions.push(nodeFromStore);

                                storeReactionPathway.getRange()
                                    .filter(function(reactionPathway) {
                                        return reactionPathway.get('idReaction') == node.getId();
                                    })
                                    .forEach(function(reactionPathway) {
                                        var pathway = storePathway.getById(reactionPathway.get('idPathway'));
                                        node.addPathway(pathway.get('name'));
                                    });
                            }
                        }
                    }
                });


                var grid = Ext.getCmp('gridCart');
                var cart = Ext.getStore('S_Cart');
                cart.removeAll();
                var txt = grid.query('tbtext')[0];
                txt.setText('<b>Nb Reactions : 0</b>');

                cart.loadData(selectReactions, true);

                var gridCart = Ext.getCmp('gridCart');
                gridCart.expand();
                var txt = gridCart.query('tbtext')[0];
                var nb = cart.count();
                txt.setText('<b>Nb Reactions : ' + nb + '</b>');

            })

        }, false);

        this.control({
            'gridCart': {
                itemcontextmenu: this.editMenu,
                viewready: this.mapKey

            },
            'gridCart button[action=delFlux]': {
                click: this.delFlux
            }
        });

    },

    /*
     * ajout menu contextuel
     */
    editMenu: function(grid, record, item, index, e, eOpts) {

        if (typeof metExploreViz === "undefined") {
            var visuIsActive = false;
        } else {
            var session = metExploreViz.getGlobals().getSessionById('viz');
            // if visualisation is actived we add item to menu
            if (session == null || !session.isActive()) {
                var visuIsActive = false; //false
            } else {
                var visuIsActive = true;
            }
        }
        //devalide le menu contextuel du navigateur
        e.preventDefault();
        var ctrl = this;

        grid.CtxMenu = new Ext.menu.Menu({
            items: [{
                    text: 'Delete Selection',

                    handler: function() {
                        var grid = Ext.getCmp('gridCart');
                        nb = grid.getSelectionModel().getSelection().length;
                        var cart = Ext.getStore('S_Cart');
                        //var id="";
                        for (var i = (nb - 1); i >= 0; i--) {
                            var rec = grid.getSelectionModel().getSelection()[i];
                            cart.remove(rec);
                        }

                        var txt = grid.query('tbtext')[0];
                        var nb = cart.count();
                        txt.setText('<b>Nb Reactions : ' + nb + '</b>')

                    }
                },
                {
                    text: 'Create network in viz from cart',
                    handler: function() {

                        var networksPanel = Ext.getCmp('networksPanel');
                        var mainPanel = networksPanel.up("panel");
                        // console.log(superPanel);
                        mainPanel.setActiveTab(networksPanel);
                        MetExploreViz.onloadMetExploreViz(function() {

                            var networkData = metExploreViz.newNetworkData('viz');

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

                            var storeReactionPathway = Ext.getStore('S_ReactionPathway');
                            var storePathway = Ext.getStore('S_Pathway');

                            storeAnnotR.filter('field', 'reversible');

                            metExploreViz.getGlobals().setBiosource({
                                id: MetExplore.globals.Session.idBioSource,
                                name: MetExplore.globals.Session.nameBioSource,
                                version: MetExplore.globals.Session.version
                            });

                            var sommeOk = 0;
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

                                    var arrayIds = [];

                                    storeReactionPathway.getRange()
                                        .filter(function(reactionPathway) {
                                            return reactionPathway.get('idReaction') == reactionID;
                                        })
                                        .forEach(function(reactionPathway) {
                                            var pathway = storePathway.getById(reactionPathway.get('idPathway'));
                                            arrayIds.push(pathway.get('name'));
                                        });
                                    networkData.addNode(
                                        reactionName,
                                        undefined, 
                                        reactiondbIdentifier,
                                        reactionID, 
                                        reactionReversibility,
                                        'reaction', 
                                        false, 
                                        true, 
                                        undefined,
                                        undefined, 
                                        undefined, 
                                        undefined, 
                                        ec, 
                                        undefined, 
                                        undefined, 
                                        arrayIds, 
                                        undefined, 
                                        reaction.get('alias'));

                                    sommeOk++;
                                });


                            /***** Fin Ajout FV****/

                            // Graph creation takes between 1 and 2s
                            // var end = new Date().getTime();
                            // var time = end - start;
                            // console.log(networkVizSession);
                            // console.log("----Viz: END refresh/Network creation
                            // "+time);



                            function launchCartFilled(func) {

                                var nbReactions = cart.getCount();
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

                                        var metaboliteMapIndex = ListIdMetabolites.indexOf(metaboliteID);

                                        if (metaboliteMapIndex == -1) {
                                            /**
                                             * metabolite non encore ajoute dans
                                             * noeud*
                                             */

                                            ListIdMetabolites
                                                .push(metaboliteID);

                                            var metabolite = storeM
                                                .getById(metaboliteID);

                                            rec = storeAnnotM.findRecord('id',
                                                metaboliteID);
                                            if (rec)
                                                sideCompound = rec.get('newV');
                                            else
                                                sideCompound = metabolite.get('sideCompound');

                                            if (sideCompound == 0 ||
                                                sideCompound == 'false' || sideCompound == false) {
                                                var isSsideCompoud = false;
                                            } else
                                                var isSsideCompoud = true;


                                            metaboliteName = metabolite
                                                .get('name');
                                            compartment = Ext.getStore('S_CompartmentInBioSource').getStoreByIdentifierFullStore(metabolite.get('compartment')).getName();

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
                                            networkData.addNode(
                                                metaboliteName,
                                                compartment, 
                                                dbMetabolite,
                                                metaboliteID, 
                                                undefined,
                                                'metabolite', 
                                                false, 
                                                true,
                                                metaboliteSVG.svg,
                                                svgWidth, 
                                                svgHeight, 
                                                isSsideCompoud, 
                                                undefined, 
                                                undefined, 
                                                undefined, 
                                                undefined, 
                                                undefined, 
                                                metabolite.get('alias'));

                                            metaboliteMapIndex = ListIdMetabolites
                                                .indexOf(metaboliteID);
                                        }

                                        networkData.getNodeById(reactionID).getPathways()
                                            .forEach(function(pathw) {
                                                networkData.getNodeById(metaboliteID).addPathway(pathw);
                                            });

                                        reactionMapIndex = ListIdReactions
                                            .indexOf(reactionID);
                                        metaboliteMapIndex = metaboliteMapIndex +
                                            lenR;

                                        if (reactionReversibility) {
                                            idBack = reactionID + "_back";
                                            if (interaction == 'in') {
                                                networkData.addLink(metaboliteID + " -- " + reactionID,
                                                    metaboliteMapIndex,
                                                    reactionMapIndex,
                                                    interaction, 'true');

                                            } else {
                                                networkData.addLink(reactionID + " -- " + metaboliteID,
                                                    reactionMapIndex,
                                                    metaboliteMapIndex,
                                                    interaction, 'true');

                                            }
                                        } else {
                                            if (interaction == 'in') {
                                                networkData.addLink(metaboliteID + " -- " + reactionID,
                                                    metaboliteMapIndex,
                                                    reactionMapIndex,
                                                    interaction, 'false');

                                            } else {
                                                networkData.addLink(reactionID + " -- " + metaboliteID,
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

                                networkData.setId('viz');
                                var myJsonString = JSON.stringify(networkData);
                                metExploreViz.GraphPanel.refreshPanel(myJsonString);
                            });

                            //Run graph

                            /*metExploreViz.GraphUtils.launchWebService(
                                "http://metexplore.toulouse.inra.fr:8080/metExploreWebService/mapping/graphresult/36047/filteredbypathway?pathwayidlist=(123770,123769)",
                                function(myJsonString){
                                    metExploreViz.GraphPanel.refreshPanelCallBack(myJsonString, 
                                        function(){
                                            metExploreViz.onloadSession(function(){
                                                
                                                var mapJSON = metExploreViz.GraphUtils.parseWebServiceMapping(myJsonString);
                                                //Load mapping
                                                console.log("loadDataFromJSON");metExploreViz.GraphMapping.loadDataFromJSON(mapJSON);
                                                //Highlight
                                                metExploreViz.GraphMapping.mapNodes("Global Mapping");
                                                // //Color nodes
                                                //metExploreViz.GraphMapping.graphMappingContinuousData("mapping_D-Galactose", "conditionName1");
                                            }); 
                                        });
                                }
                            ); */
                        })
                    }
                },









                {
                    text: 'Empty Cart',
                    handler: function() {
                        var grid = Ext.getCmp('gridCart');
                        var cart = Ext.getStore('S_Cart');
                        cart.removeAll();
                        var txt = grid.query('tbtext')[0];
                        txt.setText('<b>Nb Reactions : 0</b>')
                    }
                },
                // {
                //     text: 'New Filter on selection',
                //     //hidden : filtre,
                //     handler: function() {
                //         ctrl.delfilterGrid();
                //
                //         var idBioSource = MetExplore.globals.Session.idBioSource;
                //         var panel = Ext.getCmp('networkData');
                //         var tabPanel = panel.getActiveTab();
                //         var indexPanel = panel.items.indexOf(tabPanel);
                //         var nb = grid.getSelectionModel().getSelection().length;
                //         var id = "";
                //
                //         var selection = [];
                //         /*
                //          * recupere la liste des id selectionnes
                //          */
                //         for (var i = 0; i < nb; i++) {
                //             var rec = grid.getSelectionModel().getSelection()[i];
                //             if (i == 0) {
                //                 id = rec.get('id');
                //             } else {
                //                 id = id + "," + rec.get('id');
                //             }
                //             var selected = {
                //                 text: rec.get('dbIdentifier') + " (" + rec.get('name') + ")",
                //                 id: rec.get('id'),
                //                 checked: true,
                //                 leaf: true
                //             };
                //             selection.push(selected)
                //         }
                //
                //         //                       var treeCtrl=MetExplore.app.getController('C_treeFilter');
                //         //
                //         //                       treeCtrl.AddDataToTree(selection);
                //
                //         var controlBioSource = MetExplore.app.getController('C_BioSource');
                //         ctrl.filterGrid(idBioSource, "Reaction", id);
                //
                //     }
                // },
                // {
                //     text: 'Delete Filter',
                //     //hidden : filtre,
                //     handler: function() {
                //         ctrl.delfilterGrid();
                //     }
                // },
                {
                    text: 'Highlight in visualisation',
                    hidden: !visuIsActive,
                    handler: function() {
                        //var panel = Ext.getCmp('networkData');
                        var selectReactions = grid.getSelectionModel().getSelection();

                        selectReactions.forEach(function(reaction) {
                            metExploreViz.GraphNode.selectNodeFromGrid(reaction.data.id);
                        });
                    }
                }
            ]
        });
        //positionner le menu au niveau de la souris
        grid.CtxMenu.showAt(e.getXY());
    },

    delFlux: function() {

        var cart = Ext.getStore('S_Cart');
        var len = cart.count() - 1;

        for (var i = len; i >= 0; i--) {

            var reaction = cart.getAt(i);
            var lowerB = reaction.get('lowerBound');
            var upperB = reaction.get('upperBound');

            if (lowerB == 0 && upperB == 0) cart.removeAt(i);

        }
        var grid = Ext.getCmp('gridCart');
        var txt = grid.query('tbtext')[0];
        var nb = cart.count();
        txt.setText('<b>Nb Reactions : ' + nb + '</b>')
    },



    /**
     * enable Ctrl+a selection
     */
    mapKey: function(grid) {
        var map = new Ext.KeyMap(grid.getEl(), [{
            key: "a",
            ctrl: true,

            fn: function(keyCode, e) {
                e.preventDefault();
                grid.getSelectionModel().selectAll();
            }
        }]);
    },

    selectBioSource: function(idBioSource) {
        var CtrlBiosource = MetExplore.app.getController('MetExplore.controller.C_BioSource');
        CtrlBiosource.delNetworkData();
        CtrlBiosource.updateSessionBioSource(idBioSource);
        CtrlBiosource.updateGrid(idBioSource);
        CtrlBiosource.enableMenus();
        MetExplore.globals.Session.menuBioSource();

        Ext.ComponentQuery.query('mainPanel')[0].setActiveTab(2);
        Ext.ComponentQuery.query('networkData')[0].setActiveTab(3);
    },

    colorRowInConflict: function(grid) {
        if (grid.xtype !== 'gridBioSource') {
            grid.getView().getRowClass = function(record) {
                if (record.get('inConflictWith') && record.get('inConflictWith') != "")
                    return 'colorMapped';
                else
                    return 'colorTransparent';

            };
        }
    },



    /**
     * 
     * @param {} idBioSource
     * @param {} ObjectFilter
     * @param {} id
     */
    delfilterGrid: function(idBioSource, ObjectFilter, id) {

        //                 var treeCtrl=MetExplore.app.getController('C_treeFilter');
        //                 treeCtrl.ClearTree();

        var storeCompart = Ext.getStore('S_CompartmentInBioSource');
        storeCompart.clearFilter();
        var storeP = Ext.getStore('S_Pathway');
        storeP.clearFilter();
        var storeR = Ext.getStore('S_Reaction');
        storeR.clearFilter();
        var storeM = Ext.getStore('S_Metabolite');
        storeM.clearFilter();
        var storeE = Ext.getStore('S_Enzyme');
        storeE.clearFilter();
        var storePr = Ext.getStore('S_Protein');
        storePr.clearFilter();
        var storeG = Ext.getStore('S_Gene');
        storeG.clearFilter();
    },
    /**------------------------------------------------------------------------------------------------------
     * filterReactionNotTransport
     * reactions dont TOUS les metabolites sont dans la liste
     * @param {} idBioSource
     * @param {} id : idMetabolite
     */
    filterReactionNotTransport: function(idBioSource, id) {
        //console.log('idMetabolite ', id);
        var store = Ext.getStore('S_Reaction');
        //console.log('reaction :',store);

        var ctrl = this;
        Ext.Ajax.request({
            url: 'resources/src/php/dataNetwork/groupReactionWithoutTransport.php',
            params: {
                idBioSource: idBioSource,
                id: id
            },
            success: function(response, opts) {
                id = response.responseText;
                id = id.replace("\"", "");
                id = id.replace("\"", "");
                ctrl.filterStore('S_Reaction', id);
                /**
                 * filtrer les autres avec idReaction
                 */
                ctrl.ajaxRequest(idBioSource, 'Reaction', 'Pathway', id);
                ctrl.ajaxRequest(idBioSource, 'Reaction', 'Enzyme', id);
                ctrl.ajaxRequest(idBioSource, 'Reaction', 'Protein', id);
                ctrl.ajaxRequest(idBioSource, 'Reaction', 'Gene', id);

            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });




    },
    afficheGraph: function() {
        if (MetExplore.globals.Session.autoload) {
            var networksPanel = Ext.getCmp('networksPanel');
            var mainPanel = networksPanel.up("panel");
            // console.log(superPanel);
            mainPanel.setActiveTab(networksPanel);
            var ctrl = MetExplore.app.getController('C_GraphPanel');
            // console.log(ctrl);
            // var txt= grid.query('tbtext')[0];
            var refreshButton = networksPanel.query('button')[0];
            refreshButton.fireEvent('click');
            // console.log(refreshButton);
            // ctrl.refresh();

        }

    },
    /**
     * 1 - filtre le store de l'object actif avec les id selectionnes
     * 2 - filtre tous les autres object avec le resultat de la requete 
     * @param {} idBioSource
     * @param {} ObjectFilter : object sur lequel est l'utilisateur = tab actif
     * @param {} id : liste des id selectionnes
     */
    filterGrid: function(idBioSource, ObjectFilter, id) {
        //Tab Actif= Object
        this.filterStore('S_' + ObjectFilter, id);
        if (ObjectFilter != 'Pathway') {
            this.ajaxRequest(idBioSource, ObjectFilter, 'Pathway', id)
        }
        if (ObjectFilter != 'Reaction') {
            this.ajaxRequest(idBioSource, ObjectFilter, 'Reaction', id)
        }
        if (ObjectFilter != 'Metabolite') {
            this.ajaxRequest(idBioSource, ObjectFilter, 'Metabolite', id)
        }
        if (ObjectFilter != 'Enzyme') {
            this.ajaxRequest(idBioSource, ObjectFilter, 'Enzyme', id)
        }
        if (ObjectFilter != 'Protein') {
            this.ajaxRequest(idBioSource, ObjectFilter, 'Protein', id)
        }
        if (ObjectFilter != 'Gene') {
            this.ajaxRequest(idBioSource, ObjectFilter, 'Gene', id)
        }


        //Pour tous les autres Tab faire Ajax requete qui recupere la liste des ids
    },


    /*------------------------------------------------------------------------------------------------------
     * ajaxRequest
     * lance php la liste des id resultant avec parametre de requte object du filtre
     * ex : on a une liste de reaction ; on veut la liste des Metabolites de ces reactions
     *       on lance php groupMetabolite avec la requete R_Metabolite_ListidReaction
     */
    ajaxRequest: function(idBioSource, ObjectFilter, ResultFilter, id) {
        var ctrl = this;
        Ext.Ajax.request({
            url: 'resources/src/php/dataNetwork/group' + ResultFilter + '.php',
            params: {
                idBioSource: idBioSource,
                req: 'R_' + ResultFilter + '_Listid' + ObjectFilter,
                id: id
            },
            success: function(response, opts) {
                id = response.responseText;
                id = id.replace("\"", "");
                id = id.replace("\"", "");
                ctrl.filterStore('S_' + ResultFilter, id);
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });

    },

    /**------------------------------------------------------------------------------------------------------
    /* filtre d'un store en fonction de la liste id
                * reactions filtrees sont copiees dans cart
                */
    filterStore: function(storeName, id) {
        var store = Ext.getStore(storeName);
        var selectedItems = id.split(",");
        store.clearFilter();

        var storeCart = Ext.getStore('S_Cart');
        store.filterBy(function(record, id) {
            if (Ext.Array.indexOf(selectedItems, record.get("id")) !== -1) {
                //console.log(storeName,record);
                if (storeName == "S_Reaction" && MetExplore.globals.Session.autoload) {
                    storeCart.add(record);
                    var grid = Ext.getCmp('gridCart');
                    var txt = grid.query('tbtext')[0];
                    var nb = storeCart.count();
                    txt.setText('<b>Nb Reactions : ' + nb + '</b>')
                }
                return true;
            }
            return false;
        }, this);
        Ext.callback(this.afficheGraph, this);
    },

    /**------------------------------------------------------------------------------------------------------
    /* Ajout columnSum avec des sous column de chaque element
                * 
                */
    addColumnSum: function() {

        var panel = Ext.getCmp('networkData');
        var grid = panel.getActiveTab();
        //var col= Ext.getCmp('SumGene');
        //col.show();
        //console.log('grid : ',grid.headerCt,'col : ',col);
        var indexPanel = panel.items.indexOf(grid) - 2; //-1 pour enlever le panel Compartments+BioSource

        var columns = new Array();
        var index;
        var networkArray = ["Pathway", "Reaction", "Metabolite", "Enzyme", "Protein", "Gene"];


        //                 for (index = 0; index < 6; ++index) {
        //                 if (index!= indexPanel) {
        //                 var  col= Ext.create('Ext.grid.column.Column', {
        //                 header : networkArray[index],
        //                 dataIndex : 'nb'+networkArray[index],
        //                 filterable : true,
        //                 //flex : 1,                                  
        //                 sortable : true,
        //                 width:30
        //                 });
        //                 columns.push(col);
        //                 }
        //                 }

        //var grid= Ext.getCmp(tabPanel);
        //                 var col= Ext.create('Ext.grid.column.Column', {
        //                 header : 'Sum',
        //                 filterable : true,
        //                 columns: columns
        //                 });
        //                 grid.headerCt.insert(grid.columns.length, col);
        //                 grid.getView().refresh();
    },

    addValueSum: function() {

        var panel = Ext.getCmp('networkData');
        var grid = panel.getActiveTab();
        var indexPanel = panel.items.indexOf(grid) - 2; //-1 pour enlever le panel Compartments
        var networkArray = ["Pathway", "Reaction", "Metabolite", "Enzyme", "Protein", "Gene"];
        var ctrl = this;

        var idBioSource = MetExplore.globals.Session.idBioSource;
        Ext.Ajax.request({
            url: 'resources/src/php/calculation/CalculationSum.php',
            scope: this,
            method: 'GET',
            params: {
                idBioSource: idBioSource,
                nameGrid: networkArray[indexPanel]
            },
            failure: function(response, opts) {
                Ext.MessageBox.alert('Ajax error', 'CalculationSum error');
            },
            success: function(response, opts) {
                json = Ext.decode(response.responseText);
                ctrl.addValue(json["data"], networkArray[indexPanel]);
                //console.log(json);
            }
        });
    },

    addValue: function(data, object) {
        var store = Ext.getStore('S_' + object);
        for (i = 0; i < data.length; i++) {
            var rec = store.getById(data[i]['id']);
            if (rec) {
                rec.set('nbGene', data[i]['nbGene']);
                rec.set('nbProtein', data[i]['nbProtein']);
                rec.set('nbEnzyme', data[i]['nbEnzyme']);
                rec.set('nbMetabolite', data[i]['nbMetabolite']);
                rec.set('nbReaction', data[i]['nbReaction']);
                rec.set('nbPathway', data[i]['nbPathway']);

            }
        }
        store.commitChanges();
    },

    addGridElement: function(button) {
        var grid = button.up('grid');
        var re = new RegExp("^grid(.+)");
        var result = re.exec(grid.xtype);

        var element = result[1];

        var annotPannel = Ext.getCmp('curationPanel');

        Ext.getCmp('tabPanel').setActiveTab(annotPannel);


        while (annotPannel.down('panel')) {
            annotPannel.down('panel').close();
        }

        var form = Ext.create('MetExplore.view.form.V_Add' + element + 'Form', {
            passedRecord: null
        });

        annotPannel.add({
            xtype: 'panel',
            title: "Add " + element + ": ",
            border: false,
            minWidth: 1000,
            layout: 'auto',
            collapsible: true,
            closable: true,
            items: [form]
        })
    },


    editGridElement: function(button) {

        var grid = button.up('grid');
        var re = new RegExp("^grid(.+)");
        var result = re.exec(grid.xtype);

        var element = result[1];

        var annotPannel = Ext.getCmp('curationPanel');

        Ext.getCmp('tabPanel').setActiveTab(annotPannel);


        while (annotPannel.down('panel')) {
            annotPannel.down('panel').close();
        }


        Ext.each(grid.getSelectionModel().getSelection(), function(record) {

            var form = Ext.create('MetExplore.view.form.V_Add' + element + 'Form', {
                passedRecord: record
            });

            form.add({
                xtype: 'hiddenfield',
                name: element + 'MySQLId',
                value: record.get('id')
            }, {
                xtype: 'hiddenfield',
                name: element + 'MySQLIdinBioSource',
                value: record.get('idInBio')
            });

            annotPannel.add({
                xtype: 'panel',
                title: "Update " + element + ": " + record.get('name'),
                border: false,
                minWidth: 1000,
                layout: 'auto',
                collapsible: true,
                closable: true,
                items: [form]
            })

        })

    },

    showHideTbar: function(grid, hideValue) {

        if (grid.down('toolbar') && grid.xtype != "gridBioSource") {
            grid.down('toolbar').setVisible(hideValue)
        }

    },

    confirmDelete: function(button) {
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete these entity?', this.DelGridElement, button);
    },


    DelGridElement: function(buttonID) {
        if (buttonID == 'yes') {
            var grid = this.up('grid');
            var re = new RegExp("^grid(.+)");
            var result = re.exec(grid.xtype);

            var element = result[1],
                id = '';

            Ext.each(grid.getSelectionModel().getSelection(), function(record) {
                id += record.get('id') + ', ';
                grid.getStore().remove(record);
            });
            id = id.slice(0, -2);


            Ext.Ajax.request({
                url: 'resources/src/php/modifNetwork/deleteEntity.php',
                params: {
                    el: element,
                    id: id,
                    idBioSource: MetExplore.globals.Session.idBioSource
                },
                success: function(response, opts) {
                    //grid.getStore().reload();
                    if (Ext.getCmp('gridBioSourceInfo'))
                        Ext.getCmp('gridBioSourceInfo').getStore().reload();

                    MetExplore.globals.History.updateAllHistories();
                },
                failure: function(response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                }
            });
        }

    }


});