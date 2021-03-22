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
 * C_GenericGrid
 */

Ext.define('MetExplore.controller.C_GenericGrid', {
    extend: 'Ext.app.Controller',

    requires: ['MetExplore.globals.Session',
        'MetExplore.globals.Votes',
        'MetExplore.view.window.*',
        'MetExplore.view.window.V_WindowInfoBioSource'
    ],

    config: {
        views: ['grid.V_GenericGrid']
    },

    init: function() {

    },

    /**
     * Just like init(), but called after the viewport is created. 
     * This is a work around for event duplication for this controller
     * 
     * It is used the same way as the init() function
     */
    onLaunch: function(app) {
        var genCtrl = MetExplore.app.getController('C_GenericGrid');
        genCtrl.showHideButtonTBar();

        document.addEventListener('seeMoreInformation', function(e) {
            var node = e.value;
            if (node.getBiologicalType() == "metabolite") {
                var store = Ext.getStore('S_Metabolite');
                var theMetaDBId = store.getByDBIdentifier(node.getDbIdentifier());
                var theMetaID = store.getByIdInAllMetabolite(node.getId());

                var theMeta = theMetaDBId || theMetaID;
                if (theMeta != undefined) {
                    var record = store.getById(theMeta.getId());
                    var win_InfoMetabolite = Ext.create('MetExplore.view.window.V_WindowInfoMetabolite', {
                        rec: record
                    });
                    win_InfoMetabolite.show();
                    win_InfoMetabolite.focus();
                }
            } else {
                var store = Ext.getStore('S_Reaction');
                var theReacDBId = store.getByDBIdentifier(node.getDbIdentifier());
                var theReacID = store.getByIdInAllReaction(node.getId());

                var theReac = theReacDBId || theReacID;
                if (theReac != undefined) {
                    var record = store.getById(theReac.getId());
                    var win_InfoReaction = Ext.create('MetExplore.view.window.V_WindowInfoReaction', {
                        rec: record
                    });
                    win_InfoReaction.show();
                    win_InfoReaction.focus();
                }
            }
        }, false);

        document.addEventListener('selectNodesInTable', function(e) {
            var arrayNodes = e.value;
            var gridMetabolite = Ext.getCmp("gridMetabolite");
            var gridReaction = Ext.getCmp("gridReaction");
            var firstMetabolite = true;
            var firstReaction = true;

            arrayNodes.forEach(function(node) {
                if (node.getBiologicalType() == "metabolite") {
                    var store = Ext.getStore('S_Metabolite');
                    var theMetaDBId = store.getByDBIdentifier(node.getDbIdentifier());
                    var theMetaID = store.getByIdInAllMetabolite(node.getId());

                    var theMeta = theMetaDBId || theMetaID;
                    if (theMeta != undefined) {
                        var record = store.getById(theMeta.getId());
                        var index = gridMetabolite.getStore().data.items.indexOf(record);
                        // On garde les selection prédédente si ce n'est pas le premier métabolite sélectionné
                        gridMetabolite.getView().getSelectionModel().select(index, !firstMetabolite);
                        if (firstMetabolite) firstMetabolite = !firstMetabolite;
                    }
                } else {
                    var store = Ext.getStore('S_Reaction');
                    var theReacDBId = store.getByDBIdentifier(node.getDbIdentifier());
                    var theReacID = store.getByIdInAllReaction(node.getId());

                    var theReac = theReacDBId || theReacID;
                    if (theReac != undefined) {
                        var record = store.getById(theReac.getId());
                        var index = gridReaction.getStore().data.items.indexOf(record);
                        // On garde les selection prédédente si ce n'est pas la première réaction sélectionnée
                        gridReaction.getView().getSelectionModel().select(index, !firstReaction);
                        if (firstReaction) firstReaction = !firstReaction;
                    }
                }
            })
        }, false);

        this.control({
            'genericGrid': {
                itemcontextmenu: this.editMenu,
                render: this.colorRowInConflict,
                viewready: this.mapKey,
                cellclick: this.cellClick,
                modifyeditability: this.modifyeditability
            },
            'genericGrid actioncolumn[action=seeInfos]': {
                click: this.openWindowInfo
            },
            'genericGrid button[action=add]': {
                click: this.addGridElement
            },
            'genericGrid button[action=edit]': {
                click: this.editGridElement
            },
            'genericGrid button[action=del]': {
                click: this.confirmDelete
            },
            'genericGrid button[action=summaryVotes]': {
                click: this.voteInfo
            }

        });
    },

    /**
     * Open windowInfo on the vote panel, results panel, on click to the summary chart on summaryVotes column
     * @param {} grid
     * @param {} record
     */
    showDetailsVotes: function(grid, record) {

        var win_Info = Ext.create('MetExplore.view.window.V_WindowInfo' + grid.panel.xtype.replace('grid', ''), {
            rec: record
        });
        win_Info.show();
        win_Info.focus();
        var panelVote = win_Info.items.getAt(win_Info.items.getCount() - 1);
        panelVote.expand();
        panelVote.items.items[0].setActiveTab(1);
    },


    /**
     * Click on a cell of the grid
     * @param {} grid
     * @param {} td
     * @param {} cellIndex
     * @param {} record
     * @param {} tr
     * @param {} rowIndex
     * @param {} e
     * @param {} eOpts
     */
    cellClick: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {

        if (Ext.get(td).select('.voteItem').elements.length >= 1) { //Check if the cell is in voteSummary column
            this.showDetailsVotes(grid, record);
        }
    },

    voteInfo: function(button) {
        MetExplore.globals.Votes.summarizeVotes(button, button.up('panel').xtype.replace('grid', '').replace(/sIn.*/, ''));
    },

    /**
     * Cannot use rowIndex param, because grid biosource is grouped. If the cell click has collapsed groups above, the record 
     * selected will not be the correct one
     */
    openWindowInfo: function(grid, cell, rowIndex, colIndex, event, rec, tr) {

        // var recordId;
        // if (grid.panel.xtype.search(/biosource/i) != -1) {
        //     recordId = parseInt(tr.getAttribute('data-recordid'));
        // } else {
        //     recordId = tr.getAttribute('data-recordid');
        // }
        //console.log(rec);
        //console.log(rec.data.id);
        // console.log(recordId);

        var win_Info;

        if (grid.panel.xtype === 'gridUserProjectBioSource') {
            win_Info = Ext.create('MetExplore.view.window.V_WindowInfoBioSource', {
                rec: grid.getStore().getById(rec.data.id)
            });
        } else {
            win_Info = Ext.create('MetExplore.view.window.V_WindowInfo' + grid.panel.xtype.replace('grid', '').replace(/sIn.*/, ''), {
                rec: grid.getStore().getById(rec.data.id)
            });
        }
        win_Info.show();
        win_Info.focus();
    },



    editMenu: function(grid, record, item, index, e, eOpts) {
        if (!grid.panel.noEditMenu) {
            // devalide le menu contextuel du navigateur
            e.preventDefault();
            var ctrl = this;
            // si grid panel est Reaction mettre visible le menu copy to cart
            if (grid.panel.id == 'gridReaction' || grid.panel.xtype == 'gridReactionsInPathway') {
                var copy = false;
                var reactionG = true;
                var selectableInVisu = true;
                var filtrableFromVisu = true;
            } else {
                var copy = true;
                var reactionG = false;
                var selectableInVisu = false;
                var filtrableFromVisu = false;
            };

            if (grid.panel.id == 'gridMetabolite') {
                var selectableInVisu = true;
            };

            if (grid.panel.id == 'gridCompartment') {
                var filtreCompart = false; //false
            } else {
                var filtreCompart = true;
            };

            if (typeof metExploreViz != "undefined") {
                var session = metExploreViz.getGlobals().getSessionById('viz');
                // if visualisation is actived we add item to menu
                if (session == null || !session.isActive()) {
                    var visuIsActive = false; //false
                } else {
                    var visuIsActive = true;
                }
            } else {
                var visuIsActive = false;
            }


            var noExportExcel = false;
            if (grid.panel.noExportExcel) {
                noExportExcel = true;
            }

            if (grid.panel.id == 'gridBioSource' || grid.panel.name == 'gridUserBioSource' || grid.panel.name == 'gridProjectBioSource') {
                ctrl.biosourceCtxtMenu(grid, record, item, index, e);
            } else {
                grid.CtxMenu = new Ext.menu.Menu({
                    items: [{
                            text: 'Copy selection to cart',
                            hidden: copy,
                            handler: function() {
                                //var panel = Ext.getCmp('networkData');
                                var selectReactions = grid.getSelectionModel().getSelection();

                                var cart = Ext.getStore('S_Cart');
                                cart.loadData(selectReactions, true);

                                var gridCart = Ext.getCmp('gridCart');
                                gridCart.expand();
                                var txt = gridCart.query('tbtext')[0];
                                var nb = cart.count();
                                txt.setText('<b>Nb Reactions : ' + nb + '</b>');

                            }
                        }, {
                            text: 'Copy All to cart',
                            hidden: copy,
                            handler: function() {
                                var allReactions = grid.getStore();

                                var cart = Ext.getStore('S_Cart');
                                cart.loadData(allReactions.getRange(), true);

                                var gridCart = Ext.getCmp('gridCart');
                                gridCart.expand();
                                var txt = gridCart.query('tbtext')[0];
                                var nb = cart.count();
                                txt.setText('<b>Nb Reactions : ' + nb + '</b>');
                            }
                        }, {
                            text: 'Filter on selection',
                            //hidden : filtre,
                            handler: function() {

                                //ctrl.delfilterGrid();
                                //console.log('gridhandler',grid.panel.typeObject);
                                var idBioSource = MetExplore.globals.Session.idBioSource;
                                var panel = Ext.getCmp('networkData');
                                var tabPanel = panel.getActiveTab();
                                var indexPanel = panel.items.indexOf(tabPanel);
                                var nb = grid.getSelectionModel().getSelection().length;
                                var id = "";
                                var dbid = "";

                                // var selection = [];
                                /*
                                 * recupere la liste des id selectionnes
                                 */
                                var compart = false;
                                if (grid.panel.id == 'gridCompartment') compart = true;

                                for (var i = 0; i < nb; i++) {
                                    var rec = grid.getSelectionModel().getSelection()[i];
                                    //console.log(rec);
                                    if (i == 0) {
                                        id = rec.get('id');
                                        if (compart) dbid = rec.get('identifier');
                                        else dbid = rec.get('dbIdentifier');
                                    } else {
                                        id = id + "," + rec.get('id');
                                        if (compart) dbid = dbid + "," + rec.get('identifier');
                                        else dbid = dbid + "," + rec.get('dbIdentifier');
                                    }

                                }
                                var gridFilter = Ext.getCmp('gridFilter');
                                gridFilter.expand();
                                var store = Ext.getStore('S_Filter');
                                var numFilter = store.addStoreFilter(grid, id, dbid);

                                /*
                                 * filtre sur compartiment : indexpanel=0 recuperation de la
                                 * liste des metabolites de ce compartiment en lan�ant datametabolitecompart 
                                 * apres lancer le update avec_ListidMetabolite et la liste des idMetabolite
                                 * 
                                 */
                                if (grid.panel.typeObject == "Compartment") {
                                    ctrl.filterStore('S_CompartmentInBioSource', id);
                                    Ext.Ajax.request({
                                        url: 'resources/src/php/datametabolitecompart.php',
                                        params: {
                                            idBioSource: idBioSource,
                                            req: "R_MetaboliteGroup_Compart",
                                            id: id
                                        },
                                        success: function(response, opts) {
                                            id = response.responseText;
                                            id = id.replace("\"", "");
                                            id = id.replace("\"", "");
                                            var store = Ext.getStore('S_Filter');
                                            var record = store.findRecord("num", numFilter);
                                            record.set("Metabolite", id);
                                            ctrl.filterGrid(idBioSource, "Metabolite", id, numFilter);
                                        },
                                        failure: function(response, opts) {
                                            console.log('server-side failure with status code ' + response.status);
                                        }
                                    });

                                } else {
                                    ctrl.filterGrid(idBioSource, grid.panel.typeObject, id, numFilter);
                                }

                            }
                        },

                        {
                            text: 'Delete Filter & Search',
                            handler: function() {
                                var storeFilter = Ext.getStore('S_Filter');
                                storeFilter.removeAll();
                                var ctrl = MetExplore.app.getController('C_GenericGrid');
                                ctrl.delfilterGrid();

                                var ctrlFilter = MetExplore.app.getController('C_gridFilter');
                                ctrlFilter.delAllSearch();

                            }
                        },
                        {
                            text: 'Highlight in visualisation',
                            hidden: !visuIsActive || !selectableInVisu,
                            handler: function() {
                                //var panel = Ext.getCmp('networkData');
                                var selectElements = grid.getSelectionModel().getSelection();

                                selectElements.forEach(function(element) {
                                    metExploreViz.GraphNode.selectNodeFromGrid(element.data.id);
                                });

                            }
                        }
                        // ,{
                        // 	text : 'Filter from visualisation',
                        // 	hidden : !visuIsActive || !filtrableFromVisu,
                        // 	handler : function() {
                        // 		ctrl.delfilterGrid();
                        // 	   //console.log('gridhandler',grid.panel.typeObject);
                        // 	   var idBioSource = MetExplore.globals.Session.idBioSource;
                        // 	   var panel = Ext.getCmp('networkData');
                        // 	   var tabPanel = panel.getActiveTab();
                        // 	   var indexPanel = panel.items.indexOf(tabPanel);
                        // 	   var id = "";
                        //
                        // 	   var selection=[];
                        // 	   /*
                        // 	    * recupere la liste des id selectionnes
                        // 	    */
                        //
                        //
                        // 	    var session = metExploreViz.getGlobals().getSessionById('viz');
                        // 	    var networkData = session.getD3Data();
                        // 	    var nodes = networkData.getNodes();
                        // 	    console.log(nodes);
                        // 	    var reactions = nodes.filter(function(node){
                        // 	    	return node.getBiologicalType() == 'reaction';
                        // 	    });
                        //
                        // 	    reactions.forEach(function(node){
                        // 	    	if (id == "") {
                        // 	    		id = node.getId();
                        // 	    	} else {
                        // 	    		id = id + "," + node.getId();
                        // 	    	}
                        // 	    	var selected={text:node.getDbIdentifier()+" ("+node.getName()+")", id:node.getId(),checked:true, leaf:true};
                        // 	    	selection.push(selected);
                        // 	    });
                        //
                        // 	    var controlBioSource = MetExplore.app.getController('C_BioSource');
                        // 	   /*
                        // 	    * filtre sur compartiment : indexpanel=0 recuperation de la
                        // 	    * liste des metabolites de ce compartiment en lan�ant datametabolitecompart
                        // 	    * apres lancer le update avec_ListidMetabolite et la liste des idMetabolite
                        // 	    *
                        // 	    */
                        // 	    if (grid.panel.typeObject == undefined) {
                        // 	    	switch (indexPanel) {
                        // 	    		case 1 :
                        // 	    		var idCompart = id;
                        // 	    		Ext.Ajax.request({
                        // 	    			url : 'resources/src/php/datametabolitecompart.php',
                        // 	    			params : {
                        // 	    				idBioSource : idBioSource,
                        // 	    				req : "R_MetaboliteGroup_Compart",
                        // 	    				id : id
                        // 	    			},
                        // 	    			success : function(response, opts) {
                        // 	    				id = response.responseText;
                        // 	    				id = id.replace("\"", "");
                        // 	    				id = id.replace("\"", "");
                        //
                        // 	    				ctrl.filterGrid(idBioSource,"Metabolite",id);
                        // 					   /*controlBioSource.updateGrid(idBioSource,
                        // 					   "_ListidMetabolite", id);*/
                        // 					},
                        // 					failure : function(response, opts) {
                        // 						console
                        // 						.log('server-side failure with status code '
                        // 							+ response.status);
                        // 					}
                        // 				});
                        // 	    		ctrl.filterStore('S_CompartmentInBioSource', id);
                        // 	    		break;
                        // 	    		case 2 :
                        // 	    		ctrl.filterGrid(idBioSource,"Pathway", id);
                        // 	    		break;
                        // 	    		case 3 :
                        // 	    		ctrl.filterGrid(idBioSource,"Reaction", id);
                        // 	    		break;
                        // 	    		case 4 :
                        // 	    		ctrl.filterGrid(idBioSource,"Metabolite", id);
                        // 	    		break;
                        // 	    		case 5 :
                        // 	    		ctrl.filterGrid(idBioSource,"Enzyme", id);
                        // 	    		break;
                        // 	    		case 6 :
                        // 	    		ctrl.filterGrid(idBioSource,"Protein", id);
                        // 	    		break;
                        // 	    		case 7 :
                        // 	    		ctrl.filterGrid(idBioSource,"Gene", id);
                        // 	    		break;
                        // 	    	}
                        // 	    }
                        // 	    else {
                        // 		   //console.log('grid',grid.panel.typeObject);
                        // 		   ctrl.filterGrid(idBioSource,grid.panel.typeObject, id);
                        // 		}
                        // 	}
                        // }
                        , {
                            text: 'help',
                            iconCls: 'help',
                            tooltip: 'Documentation for flux',
                            handler: function() {
                                MetExplore.app.getController('C_HelpRedirection').goTo('browse.php#filters');
                            }
                        }
                    ]
                });
            }
            // positionner le menu au niveau de la souris
            grid.CtxMenu.showAt(e.getXY());
        }
    },

    biosourceCtxtMenu: function(grid, record, item, index, e, eOpts) {

        var ctrl = this;

        var selection = grid.getSelectionModel().getSelection();

        var canAddToProject = MetExplore.globals.Session.idProject != -1 && MetExplore.globals.Session.getCurrentProject().get('access') == "owner" ? true : false;
        var isInProject = true;
        var selectionHasPublic = false;
        var idBioSources = [];
        for (var it = 0; it < selection.length; it++) {
            if (selection[it].get('groupNameProject') == "0-private") {
                isInProject = false;
            }
            if (selection[it].get('public')) {
                selectionHasPublic = true;
            }

            if (selection[it].get('groupNameProject').substr(0, 10) == "1-project:") {
                canAddToProject = false;
            }
            idBioSources.push(selection[it].get('id'));
        }
        //console.log(selectionHasPublic)

        /*
         * bug qd select grid avec grouping :
         * http://www.sencha.com/forum/showthread.php?264961
         * en attendant solution :
         * getAttribute('data-recordid')
         * NE PAS ENLEVER id du gridBioSource
         */
        var idBioSource = parseInt(item.getAttribute('data-recordid'));
        grid.CtxMenu = new Ext.menu.Menu({
            items: [{
                text: 'Select Biosource',
                handler: function() {
                    var idProjectBS = record.get('idProject');
                    //	        				   console.log(idProjectBS);
                    var idProjectSession = MetExplore.globals.Session.idProject;
                    if (idProjectBS > -1 && idProjectSession != idProjectBS) {
                        Ext.Msg.confirm("Open linked project", "To select this BioSource, you need to open the linked project. Continue?",
                            function(btn) {
                                if (btn == "yes") {
                                    MetExplore.globals.Project.openProjectById(idProjectBS, true, false);
                                    ctrl.selectBioSource(idBioSource);
                                }
                            });
                    } else {
                        ctrl.selectBioSource(idBioSource);
                    }

                }
            }, {
                text: 'Add BioSource(s) to current project',
                handler: function() {
                    if (selection.length > 0) {
                        MetExplore.globals.Project.callAddBioSourceToCurrentProject(idBioSources, selection);
                        var storeCombo = Ext.create('Ext.data.Store', {
                            storeId: 'storeComboAddBSToProject',
                            fields: ['id', 'nameBioSource'],
                            data: Ext.getStore('S_MyBioSource').getNonProjectBS()
                        });
                        Ext.ComponentQuery.query('selectMyBioSources[name="selMyBioSource"]')[0].bindStore(storeCombo);
                    }
                },
                hidden: !canAddToProject
            }, {
                text: 'Delete BioSource(s) from project',
                handler: function() {
                    if (selection.length > 0) {
                        MetExplore.globals.Project.deleteBioSourceFromProject(idBioSources, selection);
                        var storeCombo = Ext.create('Ext.data.Store', {
                            storeId: 'storeComboAddBSToProject',
                            fields: ['id', 'nameBioSource'],
                            data: Ext.getStore('S_MyBioSource').getNonProjectBS()
                        });
                        Ext.ComponentQuery.query('selectMyBioSources[name="selMyBioSource"]')[0].bindStore(storeCombo);
                    }
                },
                hidden: (!isInProject || selectionHasPublic)
            }]
        });


    },

    selectBioSource: function(idBioSource, func) {

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                var ctrlGrid = MetExplore.app.getController('C_GenericGrid');
                ctrlGrid.delColumn();
                var CtrlBiosource = MetExplore.app.getController('MetExplore.controller.C_BioSource');
                CtrlBiosource.addSupplData(idBioSource);
                CtrlBiosource.delFiltersGrid();
                CtrlBiosource.delNetworkData();
                CtrlBiosource.closeWinInfo();
                CtrlBiosource.closeEditWindows();
                //var storeFilter= Ext.getStore('S_Filter');
                //storeFilter.removeAll();

                CtrlBiosource.updateSessionBioSource(idBioSource);
                CtrlBiosource.updateGrid(idBioSource, func);
                CtrlBiosource.enableMenus();
                MetExplore.globals.Session.menuBioSource();

                Ext.ComponentQuery.query('mainPanel')[0].setActiveTab(2);
                Ext.ComponentQuery.query('networkData')[0].setActiveTab(3);
            }
        });
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


    /**--------------------------------------------------------------------------------------------------------
     * @param {} idBioSource
     * @param {} ObjectFilter
     * @param {} id
     */
    delfilterGrid: function(idBioSource, ObjectFilter, id) {

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
    filterReactionNotTransport: function(idBioSource, id, numFilter) {
        var store = Ext.getStore('S_Reaction');

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
                console.log('idReaction', id);
                ctrl.filterStore('S_Reaction', id);
                /**
                 * filtrer les autres avec idReaction
                 */
                ctrl.ajaxRequest(idBioSource, 'Reaction', 'Pathway', id, numFilter);
                ctrl.ajaxRequest(idBioSource, 'Reaction', 'Enzyme', id, numFilter);
                ctrl.ajaxRequest(idBioSource, 'Reaction', 'Protein', id, numFilter);
                ctrl.ajaxRequest(idBioSource, 'Reaction', 'Gene', id, numFilter);

            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },


    afficheGraph: function() {
        if (MetExplore.globals.Session.autoload) {
            var graphPanel = Ext.getCmp('graphPanel');
            var mainPanel = graphPanel.up("panel");
            var superPanel = mainPanel.up("panel");
            superPanel.setActiveTab(mainPanel);
            var ctrl = MetExplore.app.getController('C_GraphPanel');
            var refreshButton = graphPanel.query('button')[0];
            refreshButton.fireEvent('click');

        }

    },



    /**
     * enable Ctrl+a selection
     */
    mapKey: function(grid) {
        //console.log('mapKey');
        //grid.doLayout();
        var map = new Ext.KeyMap(grid.getEl(), [{
            key: "a",
            ctrl: true,

            fn: function(keyCode, e) {
                e.preventDefault();
                grid.getSelectionModel().selectAll();
            }
        }]);
    },

    /**
     * 1 - filtre le store de l'object actif avec les id selectionnes
     * 2 - filtre tous les autres object avec le resultat de la requete 
     * @param {} idBioSource
     * @param {} ObjectFilter : object sur lequel est l'utilisateur = tab actif
     * @param {} id : liste des id selectionnes
     */
    filterGrid: function(idBioSource, ObjectFilter, id, numFilter) {
        //console.log(ObjectFilter,id);
        //Tab Actif= Object
        this.filterStore('S_' + ObjectFilter, id);

        if (ObjectFilter != 'CompartmentInBioSource') {
            this.ajaxRequest(idBioSource, ObjectFilter, 'CompartmentInBioSource', id, numFilter);
        }
        if (ObjectFilter != 'Pathway') {
            this.ajaxRequest(idBioSource, ObjectFilter, 'Pathway', id, numFilter);
        }
        if (ObjectFilter != 'Reaction') {
            this.ajaxRequest(idBioSource, ObjectFilter, 'Reaction', id, numFilter);
        }
        if (ObjectFilter != 'Metabolite') {
            this.ajaxRequest(idBioSource, ObjectFilter, 'Metabolite', id, numFilter);
        }
        if (ObjectFilter != 'Enzyme') {
            this.ajaxRequest(idBioSource, ObjectFilter, 'Enzyme', id, numFilter);
        }
        if (ObjectFilter != 'Protein') {
            this.ajaxRequest(idBioSource, ObjectFilter, 'Protein', id, numFilter);
        }
        if (ObjectFilter != 'Gene') {
            this.ajaxRequest(idBioSource, ObjectFilter, 'Gene', id, numFilter);
        }


        //Pour tous les autres Tab faire Ajax requete qui recupere la liste des ids
    },


    /*------------------------------------------------------------------------------------------------------
     * ajaxRequest
     * lance php la liste des id resultant avec parametre de requte object du filtre
     * ex : on a une liste de reaction ; on veut la liste des Metabolites de ces reactions
     * 		on lance php groupMetabolite avec la requete R_Metabolite_ListidReaction
     */
    ajaxRequest: function(idBioSource, ObjectFilter, ResultFilter, id, numFilter) {
        var store = Ext.getStore('S_Filter');
        var record = store.findRecord("num", numFilter);

        //console.log(record);
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

                //console.log(ResultFilter);

                record.set(ResultFilter, id);
                //console.log (ResultFilter,id);
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
        if (id.length > 0) {
            var ids = id.replace(/,/g, "|");
            var res = "/".concat(ids, "/");
            store.filter("id", eval(res));
        } else {
            store.filter("id", "");
        }


        if (MetExplore.globals.Session.autoload) {
            if (storeName == "S_Reaction") {
                var storeCart = Ext.getStore('S_Cart');
                store.each(function(record) {
                    storeCart.add(record);
                });
                //storeCart.add(eval(res));
                var grid = Ext.getCmp('gridCart');
                var txt = grid.query('tbtext')[0];
                var nb = storeCart.count();
                txt.setText('<b>Nb Reactions : ' + nb + '</b>');
            }
            Ext.callback(this.afficheGraph, this);
        }
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


        //	        	   for (index = 0; index < 6; ++index) {
        //	        	   if (index!= indexPanel) {
        //	        	   var	col= Ext.create('Ext.grid.column.Column', {
        //	        	   header : networkArray[index],
        //	        	   dataIndex : 'nb'+networkArray[index],
        //	        	   filterable : true,
        //	        	   //flex : 1,									
        //	        	   sortable : true,
        //	        	   width:30
        //	        	   });
        //	        	   columns.push(col);
        //	        	   }
        //	        	   }

        //var grid= Ext.getCmp(tabPanel);
        //	        	   var col= Ext.create('Ext.grid.column.Column', {
        //	        	   header : 'Sum',
        //	        	   filterable : true,
        //	        	   columns: columns
        //	        	   });
        //	        	   grid.headerCt.insert(grid.columns.length, col);
        //	        	   grid.getView().refresh();
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

        var eltDisplayName;
        if (element === 'Protein') {
            eltDisplayName = "Gene Product";
        } else if (element === 'Enzyme') {
            eltDisplayName = "Enzymatic Complex";
        } else {
            eltDisplayName = element;
        }

        annotPannel.add({
            xtype: 'panel',
            title: "Add " + eltDisplayName + ": ",
            border: false,
            minWidth: 1000,
            layout: 'auto',
            collapsible: true,
            closable: true,
            items: [form]
        });
    },


    editGridElement: function(button) {

        var grid = button.up('grid');
        var re = new RegExp("^grid(.+)");
        var result = re.exec(grid.xtype);

        var element = result[1];
        var eltDisplayName;
        if (element === 'Protein') {
            eltDisplayName = "Gene Product";
        } else if (element === 'Enzyme') {
            eltDisplayName = "Enzymatic Complex";
        } else {
            eltDisplayName = element;
        }

        var annotPannel = Ext.getCmp('curationPanel');

        Ext.getCmp('tabPanel').setActiveTab(annotPannel);


        while (annotPannel.down('panel')) {
            annotPannel.down('panel').close();
        }


        var record = grid.getSelectionModel().getSelection()[0];

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
            title: "Update " + eltDisplayName + ": " + record.get('name'),
            border: false,
            minWidth: 1000,
            layout: 'auto',
            collapsible: true,
            closable: true,
            items: [form]
        });

        grid.getSelectionModel().deselectAll();

    },

    modifyeditability: function(grid, editable) {

        var toolbar = grid.down('toolbar');
        if (toolbar && grid.xtype != "gridBioSource") {
            toolbar.items.items.forEach(function(cmp) {
                if (cmp.type && cmp.type == "edition") {
                    cmp.setDisabled(!editable);
                }
            })

        }
    },

    showHideTbar: function(grid, hideValue) {

        if (grid.down('toolbar') && grid.xtype != "gridBioSource") {
            grid.down('toolbar').setVisible(hideValue);
        }

    },

    showHideButtonTBar: function() {
        var curationSpecif = true;
        var allBioSource = true;

        if (MetExplore.globals.Session.idBioSource != -1 && !MetExplore.globals.Session.publicBioSource) {
            curationSpecif = false;
        }

        if (MetExplore.globals.Session.idBioSource != -1) {
            allBioSource = false;
        }
        //console.log(curationSpecif);
        //console.log(allBioSource);
        var grid = Ext.getCmp('gridCompartment');
        if (grid) {
            grid.down('button[action=edit]').setDisabled(curationSpecif);
            grid.down('button[action=add]').setDisabled(curationSpecif);
            grid.down('button[action=del]').setDisabled(curationSpecif);
        }
        var grid = Ext.getCmp('gridPathway');
        if (grid) {
            grid.down('button[action=edit]').setDisabled(curationSpecif);
            grid.down('button[action=add]').setDisabled(curationSpecif);
            grid.down('button[action=del]').setDisabled(curationSpecif);
            grid.down('button[action=summaryVotes]').setDisabled(curationSpecif);
            grid.down('button[action=statistics]').setDisabled(allBioSource);
        }

        var grid = Ext.getCmp('gridReaction');
        if (grid) {
            grid.down('button[action=edit]').setDisabled(curationSpecif);
            grid.down('button[action=add]').setDisabled(curationSpecif);
            grid.down('button[action=ReactionDel]').setDisabled(curationSpecif);
            grid.down('button[action=ReactionChange]').setDisabled(curationSpecif);
            grid.down('button[action=ReactionSetting]').setDisabled(curationSpecif);
            grid.down('button[action=summaryVotes]').setDisabled(curationSpecif);
            grid.down('button[action=statistics]').setDisabled(allBioSource);
            grid.down('button[action=showEquations]').setDisabled(allBioSource);
            grid.down('filefield[name=fileAliasReaction]').setDisabled(allBioSource);
        }

        var grid = Ext.getCmp('gridMetabolite');
        if (grid) {
            grid.down('button[action=edit]').setDisabled(curationSpecif);
            grid.down('button[action=add]').setDisabled(curationSpecif);
            grid.down('button[action=del]').setDisabled(curationSpecif);
            grid.down('button[action=summaryVotes]').setDisabled(curationSpecif);
            grid.down('button[action=MetaboliteChange]').setDisabled(curationSpecif);
            grid.down('button[action=MetaboliteSetting]').setDisabled(curationSpecif);
            grid.down('filefield[name=fileAliasMetabolite]').setDisabled(allBioSource);

        }
        var grid = Ext.getCmp('gridEnzyme');
        if (grid) {
            grid.down('button[action=edit]').setDisabled(curationSpecif);
            grid.down('button[action=add]').setDisabled(curationSpecif);
            grid.down('button[action=del]').setDisabled(curationSpecif);
            grid.down('button[action=summaryVotes]').setDisabled(curationSpecif);


        }
        var grid = Ext.getCmp('gridProtein');
        if (grid) {
            grid.down('button[action=edit]').setDisabled(curationSpecif);
            grid.down('button[action=add]').setDisabled(curationSpecif);
            grid.down('button[action=del]').setDisabled(curationSpecif);
            grid.down('button[action=summaryVotes]').setDisabled(curationSpecif);
        }

        var grid = Ext.getCmp('gridGene');
        if (grid) {
            grid.down('button[action=edit]').setDisabled(curationSpecif);
            grid.down('button[action=add]').setDisabled(curationSpecif);
            grid.down('button[action=del]').setDisabled(curationSpecif);
            grid.down('button[action=summaryVotes]').setDisabled(curationSpecif);

        }
    },

    confirmDelete: function(button) {

        var grid = button.up('grid');
        var re = new RegExp("^grid(.+)");
        var result = re.exec(grid.xtype);
        var element = result[1],
            id = '';

        Ext.each(grid.getSelectionModel().getSelection(), function(record) {
            id += record.get('id') + ', ';
        });
        id = id.slice(0, -2);

        if (element == "Compartment") {
            this.verifyEmptyCompartments(id, button)
        } else {
            Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete these entity?', this.DelGridElement, button);
        }

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
                    Ext.getStore("storeBioSourceInfo").proxy.extraParams.idBioSource = MetExplore.globals.Session.idBioSource;
                    Ext.getStore("storeBioSourceInfo").reload();


                    MetExplore.globals.History.updateAllHistories();

                    if (element == "Compartment") {

                        var insertComparts = Ext.ComponentQuery.query('selectInsertCompartment');

                        for (var i = 0, n = insertComparts.length; i < n; i++) {
                            var comp = insertComparts[i];

                            comp.down("selectCompartment").getStore().loadWithFake_Compartment();
                        }

                    }
                },
                failure: function(response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                }
            });
        }

    },

    verifyEmptyCompartments: function(idsAsString, button) {

        var me = this;

        var CompartStore = Ext.ComponentQuery.query('gridCompartment')[0].getStore();

        Ext.Ajax.request({
            method: 'GET',
            url: 'resources/src/php/dataNetwork/verifyEmptyCompartments.php',
            params: {
                ids: idsAsString
            },
            success: function(response, opts) {

                var json = Ext.decode(response.responseText);
                var dbIdentifier;

                for (var i = 0, n = json.results.length; i < n; i++) {
                    var obj = json.results[i];


                    if (obj.nbMet != "0" || obj.nbProt != "0" || obj.nbEnz != "0") {


                        var dbIdentifier = CompartStore.findRecord('id', obj.id).get('identifier');

                        break;
                    }
                }

                if (dbIdentifier !== undefined) {
                    Ext.MessageBox.alert('Unable to delete non empty compartment', 'The Compartment ' + dbIdentifier + ' is not empty, aborting deletion.')
                } else {
                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete these entity?', me.DelGridElement, button);
                }
            },
            failure: function(response, opts) {
                Ext.MessageBox.alert('Error', 'Unable to retrieve Compartment information, aborting deletion.')
            }
        });
    },

    /*

        Support function to return field info from store based on fieldname

        */

    getModelField: function(fieldName) {
        var panel = Ext.getCmp('networkData');
        var grid = panel.getActiveTab();

        var fields = grid.store.model.getFields();
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].name === fieldName) {
                return fields[i];
            }
        }
    },


    delColumn: function() {
        var tabbiodata = ["Pathway", "Reaction", "Metabolite", "Enzyme", "Protein", "Gene"];

        for (var i = 0; i < tabbiodata.length; i++) {
            var grid = Ext.getCmp("grid" + tabbiodata[i]);
            var index = grid.headerCt.items.findIndex('tag_new', true);
            //console.log(grid.headerCt.items);
            while (index > -1) {
                grid.headerCt.remove(index);
                index = grid.headerCt.items.findIndex('tag_new', true);
            }

        }
        grid.getView().refresh();

    }
});