Ext.define('MetExplore.controller.C_BioSource', {
    extend: 'Ext.app.Controller',
    /**
     * description : declaration of the views and the stores. If not in config,
     *              does not work properly...
     *
     */
    config: {
        views: ['form.V_SelectBioSources', 'form.V_SelectMyBioSources', 'form.V_SelectProjectBioSources', 'button.V_JavaApplicationMenuItem']
    },

    requires: ['MetExplore.globals.Session', 'MetExplore.globals.Loaded', 'MetExplore.globals.Jobs','MetExplore.globals.Feature','MetExplore.globals.Identifiers'],
    /**
     * init function Checks the changes on the bioSource selection
     *
     */
    init: function() {

        this.control({
            'selectBioSources': {
                select: this.changeCurrentBioSource
            },
            'selectMyBioSources[name="selMyBioSource"]': {
                select: this.changeCurrentBioSource
            },
            'selectProjectBioSources': {
                select: this.changeCurrentBioSource
            }
        });
    },


    /**
     * description Change the current bioSource with the values of the
     *              selectBioSources combo box
     */
    changeCurrentBioSource: function(combo, records, eOpts) {

        var ctrl = MetExplore.app.getController('C_BioSource');

        // MetExplore.globals.Session.isSessionExpired(function(isExpired) {
        //     if (!isExpired) {
        /**
         * recuperer idBioSource selectionne
         * completer variables de session
         * ecrire cookie nouveau BioSource
         */
        var idBioSource = records[0].get('id');
        var ctrlGrid = MetExplore.app.getController('C_GenericGrid');
        ctrlGrid.delColumn();
        ctrl.delNetworkData();
        ctrl.delFiltersGrid();
        ctrl.closeWinInfo();
        ctrl.closeEditWindows();
        //var storeFilter= Ext.getStore('S_Filter');
        //storeFilter.removeAll();


        //ctrl.addSupplData(idBioSource);
        ctrl.updateSessionBioSource(idBioSource);
        ctrl.updateGrid(idBioSource);
        ctrl.enableMenus();


    },
    /*
    loading supplementary data du biosource sélectionné
     */

    addSupplData: function(idBioSource) {
        //console.log("addSuppl data");
        var storeBioSourceData = Ext.getStore('S_BioSourceData');
        storeBioSourceData.proxy.extraParams.idBioSource = idBioSource;
        storeBioSourceData.proxy.extraParams.idUser = MetExplore.globals.Session.idUser;
        storeBioSourceData.load();

    },


    delFiltersGrid: function() {

        var netDataTab = Ext.getCmp('networkData');

        netDataTab.items.items.forEach(function(grid) {
            //console.log('grid',grid);
            if (grid.filters) grid.filters.clearFilters();
        });

        var ctrlFilter= MetExplore.app.getController('C_gridFilter');
        ctrlFilter.delAllFilters();
        ctrlFilter.delAllSearch();
    },

    /**
     * Close all window info (all window Info extends WindowInfoGeneric class)
     */
    closeWinInfo: function() {

        Ext.each(Ext.ComponentQuery.query('windowInfoGeneric'), function(win_info) {
            if (win_info.getXType() !== "windowInfoBioSource") {
                win_info.close();
            }
        });

    },


    closeEditWindows: function() {

        var arr = Ext.ComponentQuery.query('window > addGenericForm');

        arr.forEach(function closeAddWin(addpanel) {
            addpanel.up('window').close();
        })
    },

    updateSessionBioSource: function(idBioSource) {


        MetExplore.globals.Session.idBioSource = idBioSource;
        Ext.state.Manager.set("metexploreidBioSource", idBioSource);

        var ctrlSession = MetExplore.app.getController('C_Session');
        ctrlSession.completeSession(idBioSource, '-1', null, false);

        var rec = Ext.getStore('S_BioSource').getById(idBioSource);
        if (!rec) rec = Ext.getStore('S_MyBioSource').getById(idBioSource);

        if (rec) {
            var ctrlGridBS = MetExplore.app.getController('C_gridBioSource');
            ctrlGridBS.setBiosourceInfo(idBioSource, rec.get('NomComplet'), rec.get('public'), rec.get('access'), rec.get('idProject'));
            Ext.state.Manager.set("metexplorePrivateBioSource", !rec.get('public'));
        }

        if (typeof metExploreViz !== 'undefined') {
            metExploreViz.resetMetExploreViz();
        }
        MetExplore.globals.Feature.loadFeatureMetexplore();
    },

    delNetworkData: function() {
        /**
         * del storeCart
         */
        var storeCart = Ext.getStore('S_Cart');
        storeCart.removeAll();
        var grid = Ext.getCmp('gridCart');
        var txt = grid.query('tbtext')[0];
        //var nb= cart.count();
        txt.setText('<b>Nb Reactions : 0</b>');
        /**
         * supprimer tous les mapping
         */
        var ctrl = MetExplore.app.getController('C_BioSource');
        ctrl.delMapping();
        MetExplore.globals.Jobs.closeJavaApplicationPanels();
        //this.delFlux();


        /**
         * effacer les annotations en cours
         */
        var curation = Ext.getCmp('curationPanel');

        while (curation.down('panel')) {
            curation.down('panel').close();
        }

        /**
         * empty the S_ModelIdentifier store
         */
        Ext.getStore("S_ModelIdentifier").removeAll();

        /**
         * effacer les filtres
         */
        //		var root=Ext.getCmp('treeFilter').getRootNode();
        //		root.removeAll();

        /**
         * effacer metabolite topology
         */
        //		var gridM = Ext.getCmp('gridMetabolite');
        //		var index = gridM.headerCt.items.findIndex('dataIndex','topo');
        //		gridM.columns[index].setVisible(false);
        //		gridM.getView().refresh();

    },

    delFlux: function() {
        var grid = Ext.getCmp('gridReaction');
        var indice = grid.indexColHeader('Flux Lower Bound');
        if (indice > -1) grid.removeCol(indice);
        var indice = grid.indexColHeader('Flux Upper Bound');
        if (indice > -1) grid.removeCol(indice);
        grid.removeCol(indice);
    },

    /**
     * Enable Java application menus
     */
    enableMenus: function(callback) {
        // Enables all the external java application buttons
        Ext.each(Ext.ComponentQuery.query('ja_menu_item'), function(menu_item) {

            var disabled = false;

            var application = menu_item.java_application;
            //console.log(application);
            if (application === null) {
                disabled = true;
            } else if (application.get("require_login")) {

                var idUser = MetExplore.globals.Session.idUser;

                if (idUser == -1) {
                    disabled = true;
                }
            }

            menu_item.setDisabled(disabled);
        });

        if (callback) {
            callback();
        }
    },

    disableMenu: function() {

        // Enables all the external java application buttons
        Ext.each(Ext.ComponentQuery.query('ja_menu_item'), function(menu_item) {

            var disabled = true;

            var application = menu_item.java_application;
            //console.log(application);
            if (application === null) {
                disabled = true;
            } else {
                if (application.get("require_bioSource") && MetExplore.globals.Session.idBioSource != -1) {
                    disabled = false;
                }

                if (application.get("require_login") && (MetExplore.globals.Session.idUser != '-1' ||  MetExplore.globals.Session.idUser != '')) {
                    disabled = false;
                }
            }


            menu_item.setDisabled(disabled);
        });
    },

    // addFormulaReaction : function() {
    // var idBioSource= 	MetExplore.globals.Session.idBioSource;
    // var storeFormula= Ext.getStore('S_ReactionFormula');

    // storeFormula.proxy.extraParams.idBioSource=idBioSource;

    // storeFormula.load({
    // callback:function(){
    // var storeR= Ext.getStore('S_Reaction');
    // storeFormula.each(function(Id){
    // var id= Id.get('idReaction');
    // var rec= storeR.getById(id);
    // if (rec) {
    // rec.set('formula',Id.get('formula'));
    // }
    // })
    // })

    // }
    /**
     *
     */
    addMetabolitesIds: function(fun) {
        var idBioSource = MetExplore.globals.Session.idBioSource;
        var storeDBIds = Ext.getStore('S_MetaboliteDBIds');
        var storeIds = Ext.getStore('S_MetaboliteIds');
        var storeDB = Ext.getStore('S_MetaboliteDBName');
        storeDBIds.proxy.extraParams.idBioSource = idBioSource;
        storeDBIds.load({
                callback: function() {

                    storeDB.add(storeDBIds.getAt(0).get('DBName'));
                    storeIds.add(storeDBIds.getAt(0).get('Ids'));

                    ////		console.log(storeDB);
                    ////		console.log(storeIds);
                    //		/*
                    //		* ajouter colonnes a la grid Metabolite
                    //		* verifier que �a n'existe pas
                    //		*/
                    var gridM = Ext.getCmp('gridMetabolite');
                    var storeM = Ext.getStore('S_Metabolite');
                    storeDB.each(function(colDB) {

                        //console.log("storeDBIds.load");
                        var colName = colDB.get('extDBName');
                        gridM.createCol(colName, colName, true);
                        storeM.each(function(idM) {
                            idM.set(colName, '');
                        });
                    });

                    /*
                     * ajouter Id au store S_Metabolite
                     */


                    storeIds.each(function(Id) {
                        var id = Id.get('idMetabolite');
                        var rec = storeM.getById(id);
                        if (rec) {
                            rec.set(Id.get('DB'), Id.get('DBids'));
                        }
                    })

                    if (fun) fun();
                }
            }

        );

    },

    addInchiSvg: function() {
        return new Promise(function(resolve, reject) {
            Ext.suspendLayouts();
            var idBioSource = MetExplore.globals.Session.idBioSource;
            var storeInchi = Ext.getStore('S_MetaboliteInchiSvg');

            storeInchi.proxy.extraParams.idBioSource = idBioSource;
            storeInchi.load({
                callback: function () {
                    /*
                     * ajouter inchi au store S_Metabolite
                     */
                    var storeInchi = Ext.getStore('S_MetaboliteInchiSvg');
                    var storeMetabolite = Ext.getStore('S_Metabolite');

                    storeInchi.each(function (inchi) {
                        //console.log(inchi);
                        var rec = storeMetabolite.getById(inchi.get('id'));
                        if (rec) {
                            rec.set('inchi', inchi.get('inchi'));
                            //console.log(rec);
                        }
                    });

                    var gridM = Ext.getCmp('gridMetabolite');
                    if (gridM) {
                        var index = gridM.headerCt.items.findIndex('dataIndex', 'inchi');

                        if (storeInchi.count() > 0)
                            gridM.columns[index].setVisible(true);
                        else
                            gridM.columns[index].setVisible(false);

                        gridM.getView().refresh();
                    }
                    Ext.resumeLayouts(true);
                    /*
                     * valider possibilite de mapping sur inchi
                     */
                    var fieldInchi = Ext.ComponentQuery.query('panel > form > checkboxfield[name=inchi]');
                    for (i = 0; i < fieldInchi.length; i++) {
                        fieldInchi[i].setValue(false);

                    }
                    //console.log('inchi : ',storeInchi);
                }
            });
            resolve();
        });

    },


    addInchikey: function() {
        return new Promise(function(resolve, reject) {
            Ext.suspendLayouts();
            var idBioSource = MetExplore.globals.Session.idBioSource;
            var storeInchikey = Ext.getStore('S_MetaboliteInchikey');

            storeInchikey.proxy.extraParams.idBioSource = idBioSource;
            storeInchikey.load({
                callback: function () {
                    /*
                     * ajouter inchi au store S_Metabolite
                     */
                    var storeInchikey = Ext.getStore('S_MetaboliteInchikey');
                    var storeMetabolite = Ext.getStore('S_Metabolite');

                    storeInchikey.each(function (inchikey) {
                        //console.log(inchi);
                        var rec = storeMetabolite.getById(inchikey.get('id'));
                        if (rec) {
                            rec.set('inchikey', inchikey.get('inchikey'));
                            //console.log(rec);
                        }
                    });

                    var gridM = Ext.getCmp('gridMetabolite');
                    if (gridM) {
                        var index = gridM.headerCt.items.findIndex('dataIndex', 'inchikey');
                        // console.log('indexcol',index);
                        // console.log(gridM.columns[index]);
                        if (storeInchikey.count() > 0) {
                            gridM.columns[index].setVisible(true);
                            // console.log('true');
                        }
                        else {
                            gridM.columns[index].setVisible(false);
                            // console.log('false');
                        }

                        gridM.getView().refresh();
                    }
                    Ext.resumeLayouts(true);
                    /*
                     * valider possibilite de mapping sur inchikey
                     */
                    var fieldInchikey = Ext.ComponentQuery.query('panel > form > checkboxfield[name=inchikey]');
                    for (i = 0; i < fieldInchikey.length; i++) {
                        fieldInchikey[i].setValue(false);

                    }
                }
            });
            resolve();
        })

    },
    /**
     *
     */
    addGPR: function() {
        return new Promise(function(resolve, reject) {
            Ext.suspendLayouts();
            var idBioSource = MetExplore.globals.Session.idBioSource;
            var storeGPR = Ext.getStore('S_ReactionGPR');

            storeGPR.proxy.extraParams.idBioSource = idBioSource;
            storeGPR.load({
                callback: function () {
                    /*
                     * ajouter gpr au store S_Reaction
                     */
                    var storeGPR = Ext.getStore('S_ReactionGPR');
                    var storeReaction = Ext.getStore('S_Reaction');

                    //var ctrlMap = MetExplore.app.getController('C_Map');
                    //console.log(result);
                    var dataGPR = MetExplore.globals.StoreUtils.storeTojson('S_ReactionGPR');
                    var dataR = MetExplore.globals.StoreUtils.storeTojson('S_Reaction');

                    //merger les datas des 2 json

                    var resultMerge = _.map(dataR, function (obj) {
                        return _.assign(obj, _.find(dataGPR, {
                            idInBio: obj.idInBio
                        }));
                    });
                    //console.log(resultMerge);
                    MetExplore.globals.StoreUtils.jsonTostore('S_Reaction', resultMerge);

                    var gridR = Ext.getCmp('gridReaction');
                    if (gridR) {
                        var index = gridR.headerCt.items.findIndex('dataIndex', 'gpr');

                        if (storeGPR.getCount() > 0)
                            gridR.columns[index].setVisible(true);
                        else
                            gridR.columns[index].setVisible(false);

                        gridR.getView().refresh();
                    }
                    Ext.resumeLayouts(true);
                }
            });
            resolve();
        });

    },


    addEquation: function() {
        return new Promise(function(resolve, reject) {
            Ext.suspendLayouts();
            var idBioSource = MetExplore.globals.Session.idBioSource;

            var storeEq = Ext.getStore('S_ReactionEquation');
            storeEq.proxy.extraParams.idBioSource = idBioSource;
            storeEq.load({
                callback: function () {
                    /*
                     * ajouter equation au store S_Reaction
                     */
                    var storeEq = Ext.getStore('S_ReactionEquation');
                    var storeReaction = Ext.getStore('S_Reaction');

                    var ctrlMap = MetExplore.app.getController('C_Map');
                    //console.log(result);
                    var dataEq = ctrlMap.storeTojson('S_ReactionEquation');
                    var dataR = ctrlMap.storeTojson('S_Reaction');

                    //merger les datas des 2 json

                    var resultMerge = _.map(dataR, function (obj) {
                        return _.assign(obj, _.find(dataEq, {
                            idReaction: obj.id
                        }));
                    });

                    ctrlMap.jsonTostore('S_Reaction', resultMerge);

                    var gridR = Ext.getCmp('gridReaction');
                    if (gridR) {
                        var index = gridR.headerCt.items.findIndex('dataIndex', 'gpr');

                        if (storeEq.getCount() > 0)
                            gridR.columns[index].setVisible(true);
                        else
                            gridR.columns[index].setVisible(false);

                        gridR.getView().refresh();
                    }
                    Ext.resumeLayouts(true);


                }
            });
            resolve();
        })

    },

    /**
     * description Update grid (recharge tous les stores) appel lors modif
     *              BioSource + filtre req : complement du nom de requete (par
     *              ex, _ListidMetabolite ou _Compart id : liste des id (utilise
     *              lors du filtre)
     *
     *              id : liste d'ids Mysql separes par des virgules
     */
    updateGrid: function(idBioSource, func) {
        if (idBioSource != -1) {
            //load extDBName : type identifiers disponibles pour Metabolite, Reaction, Gene
            this.loadextDBName(idBioSource);
            var storeIds = Ext.getStore('S_Identifiersgit');
            storeIds.proxy.extraParams.idBioSource = idBioSource;
            storeIds.load({});
            ga('send', 'event', 'BioSource', 'biosource', idBioSource, 1);
            var ctrl = MetExplore.app.getController('C_BioSource');
            //var ctrl= this;
            var storeCompart = Ext.getStore('S_CompartmentInBioSource');
            storeCompart.proxy.extraParams.idBioSource = idBioSource;
            storeCompart.proxy.extraParams.req = "R_Compart";

            storeCompart.load({
                callback: function () {
                   /* storeCompart.sort({
                        property: 'name',
                        direction: 'ASC'
                    });*/
                }
            });


            var storeP = Ext.getStore('S_Pathway');
            storeP.proxy.extraParams.idBioSource = idBioSource;
            storeP.proxy.extraParams.req = "R_Pathway";

            storeP.load({
                callback: function () {
                   /* storeP.sort({
                        property: 'name',
                        direction: 'ASC'
                    });*/
                    MetExplore.globals.Loaded.S_Pathway = true;
                    storeP.addSupplDataPathway();
                }
            });

            //Update edit right value on grid pathway:
            //this.hasRights();

            var storeR = Ext.getStore('S_Reaction');
            storeR.proxy.extraParams.idBioSource = idBioSource;
            storeR.proxy.extraParams.req = "R_Reaction";

            storeR.load({
                callback: function () {
                    /*storeR.sort({
                        property: 'name',
                        direction: 'ASC'
                    });*/
                    MetExplore.globals.Loaded.S_Reaction = true;
                    var p= ctrl.addGPR();
                    p.then(ctrl.addEquation());
                    //p.then(storeR.addSupplDataReaction());
                    storeR.loadIdentifiersReaction();

                }
            });


            var storeM = Ext.getStore('S_Metabolite');
            storeM.proxy.extraParams.idBioSource = idBioSource;
            storeM.proxy.extraParams.req = "R_Metabolite";

            storeM.load({
                callback: function () {
                   /* storeM.sort({
                        property: 'name',
                        direction: 'ASC'
                    });*/
                    // var p= ctrl.addInchiSvg();
                    // p.then(ctrl.addInchikey());
                    // p.then(
                    //storeM.addSupplDataMetabolite();
                    storeM.loadIdentifiersMetabolite();
                    if (func) func();
                }
            });


            var storeE = Ext.getStore('S_Enzyme');
            storeE.proxy.extraParams.idBioSource = idBioSource;
            storeE.proxy.extraParams.req = "R_Enzyme";

            storeE.load({
                callback: function () {
                    //storeE.addSupplDataEnzyme();
                }
            });

            var storePr = Ext.getStore('S_Protein');
            storePr.proxy.extraParams.idBioSource = idBioSource;
            storePr.proxy.extraParams.req = "R_Protein";

            storePr.load({
                callback: function () {
                    //storePr.addSupplDataProtein();
                }
            });

            var storeG = Ext.getStore('S_Gene');
            storeG.proxy.extraParams.idBioSource = idBioSource;
            storeG.proxy.extraParams.req = "R_Gene";

            storeG.load({
                callback: function () {
                  /*  storeG.sort({
                        property: 'name',
                        direction: 'ASC'
                    });*/
                    //storeG.addSupplDataGene();
                    storeG.loadIdentifiersGene();

                }
            });



            var storeReactionPatyhway = Ext.getStore('S_ReactionPathway');
            storeReactionPatyhway.proxy.extraParams.idBioSource = idBioSource;

            storeReactionPatyhway.load({
                callback: function () {
                }
            });

            var storeLink = Ext.getStore('S_LinkReactionMetabolite');
            storeLink.proxy.extraParams.idBioSource = idBioSource;

            storeLink.load({
                callback: function () {
                }
            });
        }

        var annot = Ext.getStore('S_AnnotationReaction');
        annot.removeAll();
        var annot = Ext.getStore('S_AnnotationMetabolite');
        annot.removeAll();


    },



    loadextDBName: function (idBioSource) {
        var storeIds = Ext.getStore('S_IdentifiersDBName');
        storeIds.proxy.extraParams.idBioSource = idBioSource;
        storeIds.load({
            callback: function (records) {
                //console.log(records);
                records.forEach(function (rec) {
                    var obj= rec.get('object');
                    var listids= [];
                    if (rec.get('extDBName') && rec.get('extDBName').length>0) {
                        listids= rec.get('extDBName').split(",");
                    }
                    //ajout visibilité button addids
                    switch (obj) {
                        case 'Metabolite' :
                            MetExplore.globals.Identifiers.extDBNameMetabolite = listids;
                        case 'Reaction':
                            MetExplore.globals.Identifiers.extDBNameReaction = listids;
                        case 'Gene':
                            MetExplore.globals.Identifiers.extDBNameGene = listids;
                    }
                })
            }
        });
    },

    /**
     *
     */
    delColumnSum: function() {
        var networkArray = ["Pathway", "Reaction", "Metabolite", "Enzyme", "Protein", "Gene"];
        for (var index = 0; index < 6; ++index) {
            var grid = Ext.getCmp('grid' + networkArray[index]);

            if (grid) {
                var indexSum = grid.headerCt.items.findIndex('id', 'Sum');

                if (indexSum > -1) {
                    grid.headerCt.remove(indexSum);
                    grid.doLayout();
                }
            }

        }


    },

    delMappingNum: function(object, numero) {

        /*
         */
        // var storeM= Ext.getStore('S_Mapping');
        // var rec= storeM.getById('M'+numero);
        // storeM.remove(rec);
        var storeM = Ext.getStore('S_MappingInfo');
        var rec = storeM.getById('M' + numero);
        var mapTitle = rec.get('title');
        storeM.remove(rec);

        var grid = Ext.getCmp('grid' + object);
        //console.log(map);
        //console.log(grid.headerCt.items);
        //var mapTitle= 'Mapping_'+numero;

        var index = grid.headerCt.items.findIndex('text', mapTitle);
        if (index > -1) {
            grid.headerCt.remove(index);
            grid.getView().refresh();
        }
        //si Metabolite, remove reaction coverage

        /**
         * if mapping gene, metabolite remove reaction coverage
         */

        if (object == 'Metabolite' || object == 'Gene') {

            var gridP = Ext.getCmp('gridReaction');
            var index = gridP.headerCt.items.findIndex('text', mapTitle + ' on ' + object);

            if (index > -1) {
                gridP.headerCt.remove(index);
                gridP.getView().refresh();
            }
        }
        /**
         * if mapping gene, metabolite or reaction remove pathway coverage
         */
        if (object == 'Metabolite' || object == 'Reaction' || object == 'Gene') {

            var gridP = Ext.getCmp('gridPathway');
            var index = gridP.headerCt.items.findIndex('text', mapTitle + ' on ' + object);

            if (index > -1) {
                gridP.headerCt.remove(index);
                gridP.getView().refresh();
            }
        }

        /*
         * close tab mapping
         */
        /*
        var tabMapping= Ext.ComponentQuery.query('mainPanel > panel[title=\"Mapping_'+numero+'\"]')[0];
        tabPanel.remove(tabMapping);*/

    },



    delMappingRecord: function(object, MappingRec) {

        var storeM = Ext.getStore('S_MappingInfo');
        var mapTitle = MappingRec.get('title');
        storeM.remove(MappingRec);

        var grid = Ext.getCmp('grid' + object);


        var index = grid.headerCt.items.findIndex('text', mapTitle);
        if (index > -1) {
            grid.headerCt.remove(index);
            grid.getView().refresh();
        }

        /**
         * if mapping gene, metabolite remove reaction coverage
         */
        if (object == 'Metabolite' || object == 'Gene') {
            var gridP = Ext.getCmp('gridReaction');
            var index = gridP.headerCt.items.findIndex('text', mapTitle + ' on ' + object);

            if (index > -1) {
                gridP.headerCt.remove(index);
                gridP.getView().refresh();
            }
        }
        /**
         * if mapping gene, metabolite or reaction remove pathway coverage
         */
        if (object == 'Metabolite' || object == 'Reaction' || object == 'Gene') {
            var gridP = Ext.getCmp('gridPathway');
            var index = gridP.headerCt.items.findIndex('text', mapTitle + ' on ' + object);

            if (index > -1) {
                gridP.headerCt.remove(index);
                gridP.getView().refresh();
            }
        }

    },


    delMapping: function() {
        var storeMap = Ext.getStore('S_MappingInfo');
        var tabPanel = Ext.getCmp('tabPanel');

        /*
         * delete col mapping dans network data
         * delete tabpanel mapping
         */
        storeMap.each(function(map) {
            /*
             * remove column grid
             */
            var numero = map.get('numero');

            var grid = Ext.getCmp('grid' + map.get('object'));
            //console.log(map);
            //console.log(grid.headerCt.items);
            var mapTitle = map.get('title');

            var index = grid.headerCt.items.findIndex('text', mapTitle);
            if (index > -1) {
                grid.headerCt.remove(index);
                grid.getView().refresh();
            }
            //si Metabolite, remove reaction coverage
            var object = map.get('object');
            /**
             * if mapping gene, metabolite remove reaction coverage
             */

            if (object == 'Metabolite' || object == 'Gene') {

                var gridP = Ext.getCmp('gridReaction');
                var index = gridP.headerCt.items.findIndex('text', mapTitle + ' on ' + object);

                if (index > -1) {
                    gridP.headerCt.remove(index);
                    gridP.getView().refresh();
                }
            }
            /**
             * if mapping gene, metabolite or reaction remove pathway coverage
             */
            if (object == 'Metabolite' || object == 'Reaction' || object == 'Gene') {

                var gridP = Ext.getCmp('gridPathway');
                var index = gridP.headerCt.items.findIndex('text', mapTitle + ' on ' + object);

                if (index > -1) {
                    gridP.headerCt.remove(index);
                    gridP.getView().refresh();
                }
            }

            /*
             * close tab mapping
             */

            var tabMapping = Ext.ComponentQuery.query('mainPanel > panel[title=\"' + mapTitle + '\"]')[0];
            tabPanel.remove(tabMapping);

        });
        //vider S_Mapping
        storeMap.removeAll();
        // var storeMap= Ext.getStore('S_Mapping');
        // storeMap.removeAll();
        //rendre non visible Nb metabolite apres coverage
        /*
        var gridP= Ext.getCmp('gridPathway');
        console.log(gridP.headerCt.items);
        var index = gridP.headerCt.items.findIndex('dataIndex','nbMetabolite');
        if (index>-1) {
        	gridP.columns[index].setVisible(false);
        }

        var gridR= Ext.getCmp('gridReaction');
        var index = gridR.headerCt.items.findIndex('dataIndex','nbMetabolite');
        if (index>-1) {
        	gridR.columns[index].setVisible(false);
        }
         */
    },

    delJavaAppPanels: function() {

        var javaTabs = Ext.ComponentQuery.query('mainPanel > ja_parameters_form');

        javaTabs.forEach(function(panel) {
            panel.close();
        });

    },



    delStoreNetwork: function() {
        var storeCompart = Ext.getStore('S_CompartmentInBioSource');
        storeCompart.removeAll();

        var storeP = Ext.getStore('S_Pathway');
        storeP.removeAll();

        var storeR = Ext.getStore('S_Reaction');
        storeR.removeAll();


        var storeM = Ext.getStore('S_Metabolite');
        storeM.removeAll();


        var storeE = Ext.getStore('S_Enzyme');
        storeE.removeAll();

        var storePr = Ext.getStore('S_Protein');
        storePr.removeAll();

        var storeG = Ext.getStore('S_Gene');
        storeG.removeAll();

        var annot = Ext.getStore('S_AnnotationReaction');
        annot.removeAll();

        var annot = Ext.getStore('S_AnnotationMetabolite');
        annot.removeAll();

        var storeCart = Ext.getStore('S_Cart');
        storeCart.removeAll();

        // var storeInchi = Ext.getStore('S_MetaboliteInchiSvg');
        // storeInchi.removeAll();

    },




    unselectBioSource: function() {

        Ext.state.Manager.set("metexploreidBioSource", "");
        MetExplore.globals.Session.idBioSource = -1;
        MetExplore.globals.Session.nameBioSource = '';
        MetExplore.globals.Session.publicBioSource = '';
        MetExplore.globals.Session.typeDB = '';
        MetExplore.globals.Session.idDB = '';

        var ctrl = MetExplore.app.getController('C_BioSource');

        ctrl.delNetworkData();
        ctrl.delStoreNetwork();
        ctrl.disableMenu();

        MetExplore.globals.Jobs.closeJavaApplicationPanels();

        var ctrlSession = MetExplore.app.getController('C_Session');
        ctrlSession.publicprivateBioSource();

        if (Ext.getCmp('bioSourceInfo')) {
            Ext.getCmp('bioSourceInfo').close();
        };

        var arr = Ext.ComponentQuery.query('window > addGenericForm');

        arr.forEach(function closeAddWin(addpanel) {
            addpanel.up('window').close();
        });

        Ext.ComponentQuery.query('selectBioSources')[0].setValue("");
        Ext.ComponentQuery.query('selectMyBioSources')[0].setValue("");
        Ext.ComponentQuery.query('selectProjectBioSources')[0].setValue("");

        var genCtrl = MetExplore.app.getController('C_GenericGrid');
        genCtrl.showHideButtonTBar();

        //netDataTab.setActiveTab(0);
    }


});