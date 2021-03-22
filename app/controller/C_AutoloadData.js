/**
 * C_AutoloadData
 */

Ext.define('MetExplore.controller.C_AutoloadData', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session', 'MetExplore.globals.Loaded'],
    config: {
        views: ['form.V_Map']
    },
    autoLoad: function(session) {


        MetExplore.globals.Session.autoload = true;
        var idBioSource = session.get('metexplore_idBioSource');
        //console.log('ok');
        var ctrlBioSource = MetExplore.app.getController('C_BioSource');
        ctrlBioSource.updateGrid(idBioSource);

        this.loadAction(session);

    },

    affichePanel: function() {
        /**
         * * Copier liste des reactions dans cart
         */

        storeComponent.removeAll();
        storeComponent.add({
                'component': 'sidePanel'
            }, {
                'component': 'bannerPanel'
            }, {
                'component': 'Network Data'
            }, {
                'component': 'Network Curation'
            }, {
                'component': 'Mapping_1'
            }

        );
        // var ctrl = MetExplore.app.getController('C_Session');
        // ctrl.loadComponent();
        //var tabPanel= Ext.getCmp('tabPanel');



        var ctrl = MetExplore.app.getController('C_GraphPanel');
        ctrl.refresh();
        var viewport = Ext.getCmp('viewport');
        if (viewport) viewport.setVisible(true);
    },
    testCallback: function(entier) {
        //alert ('test callback');
        console.log('test callback', entier);
    },

    testFunction: function(min, max, callback) {
        //alert('Test' + param1 + ', ' + param2);  
        var i = 0;
        var myNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log('test', myNumber);


        if (callback && typeof(callback) === "function") {
            callback(myNumber);
        }
    },
    loadAction: function(session) {
        //this.testFunction('1', '2', this.testCallback);
        var firstAction = session.get('metexplore_actions')[0];
        console.log('action ', firstAction.name);

        if (firstAction.name == 'map') {
            /*
             * Afficher la vue V_Map avec data
             */
            console.log('action map is running');
            var tabPanel = Ext.getCmp('tabPanel');
            var newTab = tabPanel.add({
                title: 'Mapping',
                closable: true,
                items: [{
                    xtype: 'formMap'
                }]
            });
            newTab.show();
            //console.log(newTab);

            var ObjectMap = firstAction.params[0];
            /*			 
            MetExplore.globals.Session.mapping=ObjectMap;
            */
            newTab.query('combo')[0].setRawValue(ObjectMap);
            newTab.query('combo')[1].setRawValue(firstAction.params[1]);

            var gridData = newTab.query('gridData')[0];
            // var storeData= Ext.create('MetExplore.store.S_DataMapping');
            gridData.reconfigure(storeData);

            var ctrl = MetExplore.app.getController('C_gridData');
            ctrl.getRecsFromCsv(gridData, 'ta', true, firstAction.datas[0]);

            /*
             * attente chargement des store pour execution map
             */
            var store1 = Ext.getStore('S_Pathway');
            var store2 = Ext.getStore('S_Reaction');
            var store3 = Ext.getStore('S_Metabolite');
            var store4 = Ext.getStore('S_Enzyme');
            var store5 = Ext.getStore('S_Protein');
            var store6 = Ext.getStore('S_Gene');
            var store7 = Ext.getStore('S_LinkReactionMetabolite');
            var store8 = Ext.getStore('S_MetaboliteInchiSvg');
            var allStores = [store1, store2, store3, store4, store5, store6, store7, store8],
                len = allStores.length,
                loadedStores = 0,
                i = 0;

            function checkMap() {
                if (++loadedStores === len) {
                    console.log('all stores loaded');
                    AllStoresLoadedMap();
                }
            }

            for (; i < len; ++i) {
                allStores[i].on('load', checkMap, null, {
                    single: true
                });
            }


            function AllStoresLoadedMap(callback) {
                var ctrl = MetExplore.app.getController('C_Map');
                var panel = Ext.getCmp('tabPanel');
                var formMap = panel.getActiveTab();
                var button = formMap.query('button')[0];
                ctrl.map(button);

                /**
                 * recuperer la liste des Metabolites filtres 
                 * Lancer filtre
                 */
                storeMap = Ext.getStore('S_MappingInfo');
                rec = storeMap.getAt(0);
                var ctrl = MetExplore.app.getController('C_GenericGrid');
                ctrl.filterGrid(rec.get('idBioSource'), rec.get('object'), rec.get('Listid'));

                /**
                 * * Copier liste des reactions dans cart
                 */
                var storeCart = Ext.getStore('S_Cart');
                storeCart.on('add', cartLoaded, null, {
                    single: true
                });

                function cartLoaded() {
                    var graphPanel = Ext.getCmp('networksPanel');
                    var mainPanel = graphPanel.up("panel");
                    // mainPanel.setActiveTab(graphPanel);

                    var ctrl = MetExplore.app.getController('C_GraphPanel');

                    //ctrl.initiateViz('D3');
                    // ctrl.refresh();
                    // console.log(Ext.getStore('S_Reaction'));
                }
                //					var ctrl= MetExplore.app.getController('C_GraphPanel');
                //					ctrl.refresh();

            }

            // function checkMap() {
            // 	// console.log(storeMap);
            // }
        } else {
            //			if (firstAction.name== 'frame') {
            //			var viewport= Ext.getCmp('viewport');
            //			//if (viewport) viewport.setVisible(false);
            //				var storeComponent= Ext.getStore('S_ApplicationComponent');
            //				storeComponent.add(
            //						{'component':'sidePanel'},
            //						{'component':'bannerPanel'},
            //						{'component':'Network Curation'},
            //						{'component':'Network Data'}
            //
            //					);
            //					var ctrl= MetExplore.app.getController('C_Session');
            //					ctrl.loadComponent();
            //					//var newTab= 
            //					var tabPanel= Ext.getCmp('tabPanel');
            ////					var newTab = tabPanel.add({
            ////  	 						//title: 'Mapping',
            ////   	 						//closable: true,
            ////   	 						items:[{xtype:'graphPanel'}]
            ////       	 		});
            ////       	 		newTab.show();
            //       	 		var newTab = tabPanel.add({
            //  	 						title: 'Mapping',
            //   	 						closable: true,
            //   	 						items:[{xtype:'formMap'}]
            //       	 		});
            //       	 		newTab.show();
            // 				//console.log(newTab);
            //
            //				var ObjectMap= firstAction.params[0];
            //				/*			 
            //				MetExplore.globals.Session.mapping=ObjectMap;
            //				*/
            //				newTab.query('combo')[0].setRawValue( ObjectMap );
            //				newTab.query('combo')[1].setRawValue(firstAction.params[1] );
            //				
            //				var gridData= newTab.query('gridData')[0];
            //				var storeData= Ext.create('MetExplore.store.S_DataMapping');
            //				gridData.reconfigure(storeData);
            //				
            //				var ctrl= MetExplore.app.getController('C_gridData');
            //				ctrl.getRecsFromCsv(gridData, 'ta', true, firstAction.datas[0]) ;
            //				var ctrlSession = MetExplore.app.getController('C_Session');
            //				//ctrlSession.loadComponent();
            //				
            //				var store1= Ext.getStore('S_Pathway');
            //				var store2= Ext.getStore('S_Reaction');
            //				var store3= Ext.getStore('S_Metabolite');
            //				var store4= Ext.getStore('S_Enzyme');
            //				var store5= Ext.getStore('S_Protein');
            //				var store6= Ext.getStore('S_Gene');
            //				var store7= Ext.getStore('S_LinkReactionMetabolite');
            //				var allStores = [store1, store2, store3, store4, store5, store6, store7],
            //    			len = allStores.length,
            //    			loadedStores = 0,
            //    			i = 0;
            //				
            //				function check() {
            //				    if (++loadedStores === len) {
            //				        AllStoresLoaded();
            //				    }
            //				}
            //
            //				for (; i < len; ++i) {
            //				    allStores[i].on('load', check, null, {single: true});
            //				}
            //
            //
            //				function AllStoresLoaded() {
            //				    
            //				    var ctrl= MetExplore.app.getController('C_Map');
            //					var panel=Ext.getCmp('tabPanel');
            //					var formMap= panel.getActiveTab();
            //					var button= formMap.query('button')[0];
            //					ctrl.map(button) ;
            //					Ext.callback(this.afterMap, this)
            //					/**
            //					 * recuperer la liste des Metabolites filtres 
            //					 * Lancer filtre
            //					 */ 
            //					function afterMap(){
            //					storeMap= Ext.getStore('S_Mapping');
            //					rec= storeMap.getAt(0);
            //					var ctrl= MetExplore.app.getController('C_GenericGrid');
            //					ctrl.filterGrid(rec.get('idBioSource'),rec.get('object'),rec.get('Listid'));
            //					}
            //					
            //				}
            ////if (viewport) viewport.setVisible(false);
            //				
            //				
            //			}

            if (firstAction.name == 'frame') {
                var storeComponent = Ext.getStore('S_ApplicationComponent');
                storeComponent.add({
                        'component': 'sidePanel'
                    }, {
                        'component': 'bannerPanel'
                    }, {
                        'component': 'Network Curation'
                    }

                );
                // var ctrl = MetExplore.app.getController('C_Session');
                // ctrl.loadComponent();
                //var newTab= 
                var tabPanel = Ext.getCmp('tabPanel');
                //					var newTab = tabPanel.add({
                //  	 						//title: 'Mapping',
                //   	 						//closable: true,
                //   	 						items:[{xtype:'graphPanel'}]
                //       	 		});
                //       	 		newTab.show();
                var newTab = tabPanel.add({
                    title: 'Mapping',
                    closable: true,
                    items: [{
                        xtype: 'formMap'
                    }]
                });
                newTab.show();
                //console.log(newTab);

                var ObjectMap = firstAction.params[0];
                /*			 
                MetExplore.globals.Session.mapping=ObjectMap;
                */
                newTab.query('combo')[0].setRawValue(ObjectMap);
                newTab.query('combo')[1].setRawValue(firstAction.params[1]);

                var gridData = newTab.query('gridData')[0];
                var storeData = Ext.create('MetExplore.store.S_DataMapping');
                gridData.reconfigure(storeData);

                var ctrl = MetExplore.app.getController('C_gridData');
                ctrl.getRecsFromCsv(gridData, 'ta', true, firstAction.datas[0]);
                // var ctrlSession = MetExplore.app.getController('C_Session');
                // ctrlSession.loadComponent();

                var store1 = Ext.getStore('S_Pathway');
                var store2 = Ext.getStore('S_Reaction');
                var store3 = Ext.getStore('S_Metabolite');
                var store4 = Ext.getStore('S_Enzyme');
                var store5 = Ext.getStore('S_Protein');
                var store6 = Ext.getStore('S_Gene');
                var store7 = Ext.getStore('S_LinkReactionMetabolite');
                var store7 = Ext.getStore('S_MetaboliteInchiSvg');
                var allStores = [store1, store2, store3, store4, store5, store6, store7],
                    len = allStores.length,
                    loadedStores = 0,
                    i = 0;

                function checkFrame() {
                    if (++loadedStores === len) {
                        AllStoresLoadedFrame();
                    }
                }

                for (; i < len; ++i) {
                    allStores[i].on('load', checkFrame, null, {
                        single: true
                    });
                }


                function AllStoresLoadedFrame() {

                    var ctrl = MetExplore.app.getController('C_Map');
                    var panel = Ext.getCmp('tabPanel');
                    var formMap = panel.getActiveTab();
                    var button = formMap.query('button')[0];
                    ctrl.map(button);

                    /**
                     * recuperer la liste des Metabolites filtres 
                     * Lancer filtre
                     */
                    storeMap = Ext.getStore('S_MappingInfo');
                    rec = storeMap.getAt(0);
                    var ctrl = MetExplore.app.getController('C_GenericGrid');
                    ctrl.filterGrid(rec.get('idBioSource'), rec.get('object'), rec.get('Listid'));

                    storeComponent.add({
                            'component': 'sidePanel'
                        }, {
                            'component': 'bannerPanel'
                        }, {
                            'component': 'Network Data'
                        }, {
                            'component': 'Network Curation'
                        }, {
                            'component': 'Mapping_1'
                        }

                    );
                    // var ctrl = MetExplore.app.getController('C_Session');
                    // ctrl.loadComponent();
                    //var tabPanel= Ext.getCmp('tabPanel');

                    /**
                     * * Copier liste des reactions dans cart
                     */
                    var storeCart = Ext.getStore('S_Cart');
                    if (storeCart.count() > 0) {
                        var graphPanel = Ext.getCmp('networksPanel');
                        var mainPanel = graphPanel.up("panel");

                        mainPanel.setActiveTab(graphPanel);

                        var ctrl = MetExplore.app.getController('C_GraphPanel');
                        ctrl.refresh();
                    }
                    if (callback && typeof(callback) === "function") {
                        this.affichePanel()();
                    }
                    /*					storeCart.on('add', cartLoaded, null, {single: true});
                    					
                    					function cartLoaded (){
                    						console.log('je peux charger graph');
                    						var graphPanel= Ext.getCmp('graphPanel');
                    						console.log(graphPanel);
                    						var mainPanel = graphPanel.up("panel");
                    						mainPanel.setActiveTab(graphPanel);
                    						
                    						var ctrl= MetExplore.app.getController('C_GraphPanel');

                    						//ctrl.initiateViz('D3');
                    						ctrl.refresh();
                    					}*/
                    var ctrl = MetExplore.app.getController('C_GraphPanel');
                    ctrl.refresh();

                }
            }

        }
    },

    checkLoaded: function(tabStores) {
        console.log('store', tabStores);
        var len = tabStores.length;
        var loaded = 0;
        for (i = 0; i < len; i++) {
            var name = 'MetExplore.globals.Loaded.' + tabStores[i];
            //console.log('storeload',eval(name));
            if (eval(name) == MetExplore.globals.Session.idBioSource) {
                //console.log(tabStores[i]);
                loaded++;
            }
        }
        return loaded;
    },


    loadInchiPeakForest: function(param) {
        /**
         * 2- ajout dans S_Mapping
         * 1- attente chargement S_InchiPeakForest
         * 
         * 			info parametres, 
         * 3- mapping 
         *		in : data � mapper
         *			 store sur lequel mapper
         *			 field a mapper (pour data a mapper c'est toujours idMap)
         *			 type mapping : exact	
         * 4- affichage : 
         * 		tab formulaire mapping : nom du tab
         * 								 affichage gridData (colonne identified)
         * 		grid network : gridMetabolite ajout colonne 	
         */
        var storeMappingInfo = Ext.getStore('S_MappingInfo');
        storeMappingInfo.addMappingInfo('Metabolite', 'inchi', MetExplore.globals.Session.idBioSource, '', '');


        var store = Ext.getStore('S_InchiPeakForest');

        store.load({
            callback: function() {

                //console.log('callback');
                var ctrlMap = MetExplore.app.getController('C_Map');
                ctrlMap.addFormMap('Metabolite', 'inchi', 0, 'S_InchiPeakForest', 'M1');

                var nameStores = ['S_MetaboliteInchiSvg', 'S_Metabolite'];

                var ctrl = MetExplore.app.getController('C_AutoloadData');
                loadedStores = ctrl.checkLoaded(nameStores);
                i = 0;

                var store1 = Ext.getStore('S_MetaboliteInchiSvg');
                var store2 = Ext.getStore('S_Metabolite');
                //var store3= Ext.getStore('S_BioSource');

                var allStores = [store1, store2];
                len = allStores.length;

                function check() {

                    if (++loadedStores === len) {
                        AllStoresLoaded();
                    }
                }

                for (; i < len; ++i) {
                    allStores[i].on('load', check, null, {
                        single: true
                    });
                }


                function AllStoresLoaded() {

                    var ctrlMap = MetExplore.app.getController('C_Map');

                    ctrlMap.addColsGrid('Metabolite', 'M1', '0');

                    ctrlMap.mappingData('S_MetaboliteInchiSvg', 'S_InchiPeakForest', 'S_Metabolite', 'M1', param);

                    //var grid= Ext.getCmp('gridMetabolite');
                    //grid.reconfigure('S_Metabolite');

                    //console.log(panelMap);

                }

            }
        });


    }



});