/**
 * MetExplore.globals.Session
 */
Ext.define('MetExplore.globals.Session', {
    singleton: true,
    idUser: -1,
    nameUser: '',
    mailUser: '',
    idBioSource: -1,
    nameBioSource: '',
    typeDB: '',
    idDB: '',
    publicBioSource: '',
    versionAppli: '',
    mapping: '',
    mappingObjViz: [],
    mappingCoverageViz: [],
    idProject: -1,
    lastvisitDate: '0000-00-00 00:00:00',
    feature:'',

    /**
     * Get the project opened
     * @return the record of the opened project
     */
    getCurrentProject: function() {
        if (this.idProject != -1) {
            var storeUserProjects = Ext.getStore('S_UserProjects');
            if (!MetExplore.globals.Project.__project || this.idProject != storeUserProjects.getAt(MetExplore.globals.Project.__project).get('idProject')) {
                MetExplore.globals.Project.__project = storeUserProjects.find('idProject', this.idProject);
            }
            return storeUserProjects.getAt(MetExplore.globals.Project.__project);
        } else {
            return null;
        }
    },


    /**
     *
     * @param callback
     */
    isSessionExpired: function(callback) {

        var ctrlUser = MetExplore.app.getController('C_User');
        Ext.Ajax.request({
            url: "resources/src/php/session/checkSession.php",
            failure: function(response, opts) {
                Ext.MessageBox.alert('Ajax error', 'Your session is not reacheable. It is assumed as expired.');
                ctrlUser.logout();
                callback(true);
            },
            success: function(response, opts) {
                if (response.status == 200) {
                    var json = Ext.decode(response.responseText);

                    if (json.expired) {
                        Ext.MessageBox.alert('Session Expired', 'Your session has expired, please log back in to continue your work.');
                        ctrlUser.logout();
                    }

                    callback(json.expired);
                }
            }
        });

    },


    /**
     *
     * @param callback
     */
    checkSessionUserId: function(callback) {

        var ctrlUser = MetExplore.app.getController('C_User');

        Ext.Ajax.request({
            url: 'resources/src/php/user/checkUserId.php',
            params: {
                "currentIdUser": this.idUser
            },
            failure: function(response, opts) {
                Ext.MessageBox.alert('Ajax error', 'Getting the user id has failed');
                ctrlUser.logout();
                callback(false);
            },
            success: function(response, opts) {
                var json = Ext.decode(response.responseText);

                if (!json.loggedUser) {
                    // Ext.MessageBox.alert('Session Expired','Your session has expired, please log back in to continue your work.');
                    // ctrlUser.logout();
                }

                callback(json.loggedUser);
            }
        });
    },

    /**
     * enable /disable menu en fonction idBioSource
     */
    menuBioSource: function() {
        // if (MetExplore.globals.Session.idBioSource != -1) {
        //
        //     Ext.getCmp('mapMenu').setDisabled(false);
        //     Ext.getCmp('exportNetworkExcel').setDisabled(false);
        //
        //     Ext.Ajax.request({
        //         url: 'resources/src/php/utils/fileexist.php',
        //         scope: this,
        //         method: 'POST',
        //         //method: 'GET',
        //         params: {
        //             file: MetExplore.globals.Session.idBioSource + "-AAM-weights.tab"
        //         },
        //         failure: function(response, opts) {
        //             Ext.MessageBox
        //                 .alert('Ajax error',
        //                     'Error while getting file status');
        //         },
        //         success: function(response, opts) {
        //             var results = Ext.decode(response.responseText)["results"];
        //             //console.log(results);
        //             Ext.getCmp('rankMenu').setDisabled(!results);
        //
        //         }
        //     });
        //
        //     // function fileExists(url) {
        //     //     var http = new XMLHttpRequest();
        //     //     http.open('HEAD', url, false);
        //     //     http.send();
        //     //     return http.status != 404;
        //     // }
        //
        //     // if (!fileExists("../atomMapping/" + MetExplore.globals.Session.idBioSource + "-AAM-weights.tab")) {
        //     //     Ext.getCmp('rankMenu').setDisabled(true);
        //     // } else {
        //     //     Ext.getCmp('rankMenu').setDisabled(false);
        //     // }
        //
        // } else {
        //     Ext.getCmp('mapMenu').setDisabled(true);
        //     Ext.getCmp('exportNetworkExcel').setDisabled(true);
        //     Ext.getCmp('rankMenu').setDisabled(true);
        //
        // }
    },


    /**
     * Check if there is a user session in the server : if there is no
     * session, the userId will be -1
     * @param callback
     * @param scope
     */
    setUserId: function(callback, scope) {

        var idUser = undefined;

        Ext.Ajax.request({
            url: 'resources/src/php/user/getUserId.php',
            scope: this,
            failure: function(response, opts) {
                Ext.MessageBox.alert('Ajax error',
                    'Getting the user id has failed');

                return undefined;

            },
            success: function(response, opts) {
                idUser = response.responseText;

                if (idUser != -1) {

                    this.idUser = idUser;

                    var ctrlUser = MetExplore.app.getController('C_User');

                    ctrlUser.initLogin(idUser);
                    var logout = Ext.getCmp('logout_user_button');
                    logout.setVisible(true);
                }
                if (callback && scope) {
                    callback(scope);
                } else if (callback) {
                    callback();
                }

            }
        });

    },


    /**
     * Read the cookies or the url params and inits the session
     *
     * @param param
     * @param callback
     */
    initSession: function(param, callback) {
        this.menuBioSource();
        var me = this;

        //		Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

        this.setUserId(function(scope) {
            var idUser = scope.idUser;

            var idBioSource = -1;

            if (param["idBioSource"] != undefined) {


                Ext.Ajax.request({
                    url: 'resources/src/php/biodata/biosource/printBioSourceStatus.php',
                    scope: scope,
                    method: 'POST',
                    params: {
                        idBioSource: param["idBioSource"]
                    },
                    failure: function(response, opts) {
                        Ext.MessageBox
                            .alert('Ajax error',
                                'Error while getting biosource status');
                    },
                    success: function(response, opts) {

                        var json = null;

                        try {
                            json = Ext.decode(response.responseText);
                        } catch (err) {
                            Ext.MessageBox.alert('Ajax error', 'Error while reading the server response about biosource status');
                        }

                        if (json != null) {

                            if (json["success"] == false) {

                                Ext.MessageBox.alert('Ajax error', json["message"]);

                            } else {

                                bioSourceStatus = json["status"];

                                if (bioSourceStatus == "public") {

                                    idBioSource = parseInt(param["idBioSource"]);


                                } else if (bioSourceStatus == "private") {

                                    Ext.MessageBox.alert('Error', 'You can not access to private biosources via a url');

                                } else {

                                    Ext.MessageBox.alert('Error', 'The biosource in the url does not exist');

                                }

                                scope.launchSessionControllers(idBioSource, idUser, param, callback);

                            }

                        }
                    },
                    failure: function(response, opts) {

                    }
                });

            } else {
                var privateBS = Ext.state.Manager.get("metexplorePrivateBioSource");
                if (!privateBS) {
                    idBioSource = Ext.state.Manager.get("metexploreidBioSource");
                } else if (idUser != -1 && privateBS) {
                    idBioSource = Ext.state.Manager.get("metexploreidBioSource");
                }
                scope.launchSessionControllers(idBioSource, idUser, param, callback);
            }

        }, me);





    },


    /**
     * launch the different controllers that loads the interface. needed to be in a separate function to be called in callback functions.
     * @param {} idbiosource
     * @param {} idUser
     */
    launchSessionControllers: function(idBioSource, idUser, param, callback) {

        if (idBioSource) {
            this.idBioSource = idBioSource;

        }

        /**
         * completer les infos de session pour completer uniquement User :
         * executer avec parametre idBioSource -1 pour completer
         * uniquement bioSOurce : executer avec parametre idUser -1
         */
        var ctrlSession = MetExplore.app.getController('C_Session');
        if (idBioSource || idUser) {


            ctrlSession.completeSession(
                this.idBioSource,
                this.idUser);
        }

        var callbackflag = false;

        if (idBioSource) {

            var ctrlBioSource = MetExplore.app.getController('C_BioSource');

            ctrlBioSource.delNetworkData();
            ctrlBioSource.addSupplData(idBioSource);
            ctrlBioSource.updateSessionBioSource(idBioSource);
            ctrlBioSource.updateGrid(idBioSource);


            ctrlBioSource.enableMenus(callback);
            MetExplore.globals.Session.menuBioSource();

            callbackflag = true;
            //			ctrlBioSource.updateGrid(idBioSource, '', '');
        }

        if (param != undefined) {
            ctrlSession.parseUrl(param);
        }

        if (!callbackflag && callback) {
            callback();
        }
    },



    /**
     * Show/Hide the link column of the given grid (the column with link to the database)
     * And the windowInfo column when needed
     * @param {} grid
     */
    showHideLinkColumn: function(grid) {

        if (grid instanceof Ext.data.Store) {
            if (grid.storeId != undefined) //Get the corresponding grid
                grid = Ext.ComponentQuery.query(grid.storeId.replace('S_', 'grid'))[0];
        }

        if (grid instanceof Ext.grid.Panel) {

            var typeBioSource = MetExplore.globals.Session.typeDB;
            //console.log('type',typeBioSource);
            //Show/Hide link columns:
            if (typeBioSource != "") {

                var index = grid.indexCol('linkToDB');
                //console.log(index);
                if (index != -1) {
                    if (typeBioSource == "TrypanoCyc" || typeBioSource == "biocyc" || typeBioSource == "BioCyc") {
                        grid.columns[index].setVisible(true);
                        //console.log('grid',grid);
                    } else {
                        grid.columns[index].setVisible(false);
                        /*
                        supprimer column
                        */
                        // var ind= grid.indexCol('linkToDB');
                        // //console.log(ind);
                        // if (ind>-1) {
                        // 	grid.removeCol(ind);
                        // }

                    }
                }
            }

            //Show/Hide windowInfo column for Enzyme, Protein and Gene grids:
            if (["Enzyme", "Protein", "Gene"].indexOf(grid.typeObject) > -1) {
                var index = grid.indexCol('seeInfos');
                if (MetExplore.globals.Session.publicBioSource == true) {
                    grid.columns[index].setVisible(false);
                } else {
                    grid.columns[index].setVisible(true);
                }
            }
        } else {
            console.log('showHideLinkColumn: grid is not a grid panel: ', grid);
        }
    }

});