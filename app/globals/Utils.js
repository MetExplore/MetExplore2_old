/**
 * MetExplore.globals.Utils
 */
Ext.define('MetExplore.globals.Utils', {
    singleton: true,
    /**
     * Calcul difference between two dates
     * @param {} date1 begin date
     * @param {} date2 end date
     * @return {} difference in days
     */
    daysBetween: function(date1, date2) {
        //Ignore hours:
        date1 = new Date(this.formatDate(date1));
        date2 = new Date(this.formatDate(date2));
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    },

    /**
     * Format date in format YYYY-mm-dd plus, if withHours=true, hh:mm:ss
     * @param {} date, the date object
     * @param {} withHours, if true, add the hour in the formated date
     * @return {} formated hour
     */
    formatDate: function(date, withHours) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!
        var yyyy = date.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        var formatedDate = yyyy + "-" + mm + "-" + dd;

        if (!withHours) {
            return formatedDate;
        } else {
            var hh = date.getHours();
            if (hh < 10) {
                hh = '0' + hh;
            }
            var mm = date.getMinutes();
            if (mm < 10) {
                mm = '0' + mm;
            }
            var ss = date.getSeconds();
            if (ss < 10) {
                ss = '0' + ss;
            }
            return formatedDate + " " + hh + ":" + mm + ":" + "ss";
        }
    },


    /**
     * Displays a short message that disappears after one second, or the delay specified
     * @param text
     * @param cpt
     * @param delay
     */
    displayShortMessage: function(text, cpt, delay) {

        if (!Ext.isDefined(delay)) {
            delay = 1000;
        }

        Ext.create('Ext.window.Window', {
            header: false,
            bodyStyle: "font-weight:bold; font-size: 16pt;",
            border: 0,
            resizable: false,
            layout: 'fit',
            closable: false,
            floating: {
                shadow: false
            }, //Shadow cause bugs, we must disable it
            items: { // Let's put an empty grid in just to illustrate fit
                // layout
                bodyCls: 'short-message',
                html: text
            }
        }).show("body", function() {
            this.el.ghost("b", {
                delay: delay
            });
        });
    },

    /**
     * Return a random string char of length nbcar
     * @param {} nbcar
     * @return {}
     */
    randomStringChar: function(nbcar) {
        var ListeCar = new Array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
        var Chaine = '';
        for (i = 0; i < nbcar; i++) {
            Chaine = Chaine + ListeCar[Math.floor(Math.random() * ListeCar.length)];
        }
        return Chaine;
    },

    /**
     * Save file or data directly, with a given filename --> cause download dialog in the browser
     * @param {} uri: file or data to download
     * @param {} filename: default filename of the downloaded file
     */
    saveAs: function(uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            link.href = uri;
            link.download = filename;

            //Firefox requires the link to be in the body
            document.body.appendChild(link);

            //simulate click
            link.click();

            //remove the link when done
            document.body.removeChild(link);
        } else {
            window.open(uri);
        }
    },

    /**
     * Refresh ToDoList
     */
    refreshTodoList: function() {
        var gridUTD = Ext.ComponentQuery.query('userPanel gridTodoList')[0];
        filterUser = false;
        if (gridUTD.down('button[action="todoListPersonal"]').pressed) {
            var filterUser = true;
        }
        filterProject = false;

        var storeUTD = Ext.getStore('S_TodoList');

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                storeUTD.clearFilter();
                storeUTD.load({
                    params: {
                        idProject: -1
                    },
                    callback: function() {
                        if (filterUser) {
                            storeUTD.filter('idUser', MetExplore.globals.Session.idUser);
                        }
                        if (MetExplore.globals.Session.idProject != -1) {
                            var gridPTD = Ext.ComponentQuery.query('projectPanel gridTodoList')[0];
                            if (gridPTD.down('button[action="todoListPersonal"]').pressed) {
                                var filterProject = true;
                            }
                            storeUTD.updateProjectTodoList(filterProject);
                        }
                    }
                });
            }
        });



    },

    /**
     * Refresh BioSources
     */
    refreshBioSources: function() {
        var grid = Ext.ComponentQuery.query('networkData gridBioSource')[0];

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                grid.setLoading(true);

                grid.getStore().reload(function() {

                    grid.setLoading(false);
                    //Updare User panel BioSource grid:
                    var gridUBS = Ext.ComponentQuery.query('gridUserProjectBioSource[name="gridUserBioSource"]')[0];
                    if (gridUBS) {
                        gridUBS.getStore().reload();
                        //Update Project panel MyBioSource grid:
                        if (MetExplore.globals.Session.idProject != -1) {
                            var projectPanel = Ext.ComponentQuery.query("projectPanel")[0];
                            var pStore = Ext.create("MetExplore.store.S_MyBioSource", {
                                storeId: "S_ProjectBioSource",
                                autoLoad: false,
                                groupField: 'idProject'
                            });
                            var storeMyBioSource = Ext.getStore('S_MyBioSource');
                            pStore.add(storeMyBioSource.getProjectBioSource(MetExplore.globals.Session.idProject));
                            projectPanel.down('gridUserProjectBioSource').bindStore(pStore);
                        }
                    }
                });
            }
        });



    },

    /**
     * Remove the vote summary column on the given grid
     * @param {} grid
     */
    removeVotesColumns: function() {

        var grids = Ext.ComponentQuery.query('networkData')[0].items.items;

        for (var it = 0; it < grids.length; it++) {
            var grid = grids[it];
            if (grid instanceof Ext.data.Store) {
                if (grid.storeId != undefined)
                    grid = Ext.ComponentQuery.query(grid.storeId.replace('S_', 'grid'))[0];
            }


            if (grid instanceof Ext.grid.Panel) {
                //Delete vote summary column if exists:
                var colIdForRemoval = grid.indexCol('votes');
                if (colIdForRemoval > -1) {
                    var myComp = grid.headerCt.getComponent(colIdForRemoval);
                    grid.headerCt.remove(myComp);
                    grid.getView().refresh();
                }
                var colIdForRemoval = grid.indexCol('hasVote');
                if (colIdForRemoval > -1) {
                    var myComp = grid.headerCt.getComponent(colIdForRemoval);
                    grid.headerCt.remove(myComp);
                    grid.getView().refresh();
                }
            }
        }
    },

    /**
     *
     * @param tabStores
     * @param fct
     * @param param
     */
    storeLoadedCallfct: function(tabStores, fct, param) {

        len = tabStores.length;
        loadedStores = 0;
        //i = 0;

        function check() {
            if (++loadedStores === len) {
                //console.log('all stores loaded');
                fct(param);
                //AllStoresLoaded();
            }
        }
        // var allStores= new Array();
        //
        // for (i=0; i<len; i++) {
        // allStores.push (Ext.getStore(tabStores[i]));
        // }
        for (i = 0; i < len; i++) {
            var store = Ext.getStore(tabStores[i]);
            store.on('load', check, null, {
                single: true
            });
        }




        // function AllStoresLoaded() {
        // console.log('all');
        //    fct(json);
        // 	//fct();
        //
        // }
    },

    /**
     * remove cookies
     */
    removeGridCookies : function() {
        //console.log("removecookies");
        Ext.util.Cookies.clear('ext-gridGene');
        Ext.util.Cookies.clear('ext-gridProtein');
        Ext.util.Cookies.clear('ext-gridEnzyme');
        Ext.util.Cookies.clear('ext-gridMetabolite');
        Ext.util.Cookies.clear('ext-gridReaction');
        Ext.util.Cookies.clear('ext-gridPathway');
        Ext.util.Cookies.clear('ext-gridCompartment');
        Ext.util.Cookies.clear('ext-gridBioSource');

    }


});