/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when upgrading.
*/
//test prod
Ext.application({
    name: 'MetExplore',

    extend: 'MetExplore.Application',

    //autoCreateViewport: true,
    requires: [
        'Ext.ux.grid.FiltersFeature',
        'MetExplore.override.view.Table',
        'MetExplore.globals.Feature',
        //,'MetExplore.override.form.field.VTypes'
    ],
    // onProfilesReady: function() {
    //     Ext.util.Cookies.clear('ext-gridGene');
    //     Ext.util.Cookies.clear('ext-gridProtein');
    //     Ext.util.Cookies.clear('ext-gridEnzyme');
    //     Ext.util.Cookies.clear('ext-gridMetabolite');
    //     Ext.util.Cookies.clear('ext-gridReaction');
    //     Ext.util.Cookies.clear('ext-gridPathway');
    //     Ext.util.Cookies.clear('ext-gridCompartment');
    //     Ext.util.Cookies.clear('ext-gridBioSource');
    //
    // },

    launch: function() {
        MetExplore.globals.Utils.removeGridCookies();
        Ext.override(Ext.data.proxy.Ajax, {
            timeout: 300000
        });
        // Ext.Ajax.on("beforerequest",function(con){
        //     con.UseDefaultXhrHeader=true;
        //     con.WithCredentials=false;
        // });
        // //configuration ajax
        // Ext.Ajax.on("beforerequest",function(con){
        //     con.setUseDefaultXhrHeader(false);
        //     con.setWithCredentials(true);
        // });
        // Global classes:
        //		Ext.require(['MetExplore.globals.Utils', 'MetExplore.globals.Project',
        //				'MetExplore.globals.Session', 'MetExplore.globals.Jobs',
        //				'MetExplore.globals.GraphObjects', 'MetExplore.globals.Votes',
        //				'MetExplore.globals.BioSource']);
        //		// Overide classes:
        //		Ext.require([// Add functions to String:
        //				'MetExplore.override.String',
        //						// Correct grouping bug on grids:
        //						'MetExplore.override.view.Table',
        //						// fix hide submenu (in chrome 43)
        //						'MetExplore.override.menu.Menu']);
        //		Ext.require([
        //		
        // Session values:
        //				console.log("-----------------delete Cookies------------");
        Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
        Ext.state.Manager.clear("metexploreidUser");
        // Ext.util.Cookies.set('ext-gridBioSource', null, new Date("January 1, 1970"));
        // Ext.util.Cookies.set('ext-gridPathway', null, new Date("January 1, 1970"));
        // Ext.util.Cookies.set('ext-gridCompartment', null, new Date("January 1, 1970"));
        // Ext.util.Cookies.set('ext-gridReaction', null, new Date("January 1, 1970"));
        // Ext.util.Cookies.set('ext-gridMetabolite', null, new Date("January 1, 1970"));
        // Ext.util.Cookies.set('ext-gridEnzyme', null, new Date("January 1, 1970"));
        // Ext.util.Cookies.set('ext-gridProtein', null, new Date("January 1, 1970"));
        // Ext.util.Cookies.set('ext-gridGene', null, new Date("January 1, 1970"));

        MetExplore.globals.Session.idUser = -1;
        MetExplore.globals.Session.idBioSource = -1;
        MetExplore.globals.Session.mapping = -1;
        MetExplore.globals.Session.idProject = -1;

        //myApp = this;

        /**
         * Controls the Ajax calls : displays a mask during every ajax call
         */
        // Ext.Ajax.on('requestcomplete', this.requestComplete, this);
        // Ext.Ajax.on('beforeRequest', this.beforeRequest, this);
        // Ext.Ajax.on('requestexception', this.requestException, this);
        Ext.create("MetExplore.view.Viewport");
        /*
         * version appli
         */
        var ctrlSession = MetExplore.app.getController('C_Session');
        ctrlSession.searchVersion();
        ctrlSession.manageUserAgreements();

        //storeB2.loadRecords({records: storeB1.getRange()},{add: true});

        /*		storeB2.load({callback: function(){
        			storeB2.loadRecords({records: storeB1.getRange()},{add: true});
        			console.log('test',storeB2);
        			}
        		});*/
        //MemoryLeakChecker(window);

        /*
         * parametre
         */
        var param = Ext.urlDecode(location.search.substring(1));
        //console.log('param',param);

        if (param["feature"] != undefined) {
            MetExplore.globals.Feature.name = param["feature"];
        } else {

            MetExplore.globals.Feature.name = 'metexplore';
        }
        if (param["autoload"] != undefined) {
            /**
             * recherche de parametres pour appel depuis appli exterieure
             */
            this.searchParam(param);

        } else {
            if (param["idMapping"] != undefined) {
                var ctrlMapping = MetExplore.app.getController('C_Map');
                ctrlMapping.loadMapping(param["idMapping"]);

            } else {
                if (param["inchipeakforest"] != undefined) {

                    this.peakForest(param);

                } else {
                    if (param["peakforest"] != undefined) {

                        this.peakForestWebService(param);

                    } else {

                        var flag = false;

                        /**
                         * recherche des cookies et initialisation de la
                         * session
                         */
                        Ext.getStore('S_BioSource').load({
                            callback: function() {
                                MetExplore.globals.Session.initSession(param);
                            }
                        });


                    }
                }
            }
        }

    },

    /**
     * load Metexplore from peakforest
     */
    peakForest: function(param) {

        if (param["idBioSource"] != undefined) {
            MetExplore.globals.Session.idBioSource = param["idBioSource"];
        } else {
            /** 1363= idBioSource Recon2 */
            MetExplore.globals.Session.idBioSource = '1363';
        }

        var ctrlSession = MetExplore.app.getController('C_Session');
        ctrlSession.completeSession(MetExplore.globals.Session.idBioSource, -1,
            '');

        var ctrlBioSource = MetExplore.app.getController('C_BioSource');
        ctrlBioSource
            .updateGrid(MetExplore.globals.Session.idBioSource, '', '');

        var ctrl = MetExplore.app.getController('C_AutoloadData');
        ctrl.loadInchiPeakForest(param);

    },

    /**
     * 
     */
    peakForestWebService: function(param) {

        if (param["idBioSource"] != undefined) {
            MetExplore.globals.Session.idBioSource = param["idBioSource"];
        } else {
            /** 1363= idBioSource Recon2 */
            MetExplore.globals.Session.idBioSource = '1363';
        }

        var ctrlSession = MetExplore.app.getController('C_Session');
        ctrlSession.completeSession(MetExplore.globals.Session.idBioSource, -1,
            '');

        var ctrlBioSource = MetExplore.app.getController('C_BioSource');
        ctrlBioSource
            .updateGrid(MetExplore.globals.Session.idBioSource, '', '');

        var ctrl = MetExplore.app.getController('C_AutoloadData');
        ctrl.loadMappingPeakForest(param);

    },

    /**
     * read and parse the URL for parameters
     */
    searchParam: function(param) {

        // var param = Ext.urlDecode(location.search.substring(1));;

        if (param["autoload"] != undefined) {
            /*
             * lecture du store localstorage
             */
            var store = Ext.getStore('S_LocalstorageData');
            store.load({
                callback: function() {
                    // console.log('localstorage ',store);
                    if (!param["autoload"]) {

                        var len = store.length() - 1;
                        var autoloadData = store.getAt(len);
                        //console.log("autoload :", autoloadData);
                    } else {

                        var autoloadData = store
                            .getAt(param["autoload"] - 1);
                        // console.log(autoloadSession);
                        if (!autoloadData) {
                            var len = store.length() - 1;
                            autoloadData = store.getAt(len);
                        }
                    }

                    //console.log("autoload :", autoloadData);

                    var idBioSource = autoloadData
                        .get('metexplore_idBioSource');

                    MetExplore.globals.Session.idBioSource = idBioSource;
                    var ctrlSession = MetExplore.app.getController('C_Session');
                    ctrlSession.completeSession(
                        MetExplore.globals.Session.idBioSource,
                        MetExplore.globals.Session.idUser);

                    // console.log('autoloadData ',autoloadData);
                    var ctrl = MetExplore.app.getController('C_AutoloadData');
                    ctrl.autoLoad(autoloadData);
                }
            });

        }

    },

    searchCookies: function() {

        /*
        var idUser = Ext.state.Manager.get("metexploreidUser");

        if (idUser) {
        	
        	MetExplore.globals.Session.idUser = idUser;
        	var ctrlUser = myApp.getController('C_User');
        	ctrlUser.initLogin(idUser);
        	var logout = Ext.getCmp('logout_user_button');
        	logout.setVisible(true);
        	
        }
        */
        var idBioSource = Ext.state.Manager.get("metexploreidBioSource");

        if (idBioSource) {
            MetExplore.globals.Session.idBioSource = idBioSource;

        }

        /**
         * completer les infos de session pour completer uniquement User :
         * executer avec parametre idBioSource -1 pour completer uniquement
         * bioSOurce : executer avec parametre idUser -1
         */
        if (idBioSource || idUser) {
            var ctrlSession = MetExplore.app.getController('C_Session');
            ctrlSession.completeSession(MetExplore.globals.Session.idBioSource,
                MetExplore.globals.Session.idUser);
        }

        if (idBioSource) {
            var ctrlBioSource = MetExplore.app.getController('C_BioSource');
            ctrlBioSource.updateGrid(idBioSource, '', '');
        }
    }



});