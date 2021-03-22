/**
 * C_Session
 * 
 */

Ext.define('MetExplore.controller.C_Session', {

    extend: 'Ext.app.Controller',
    /*	requires : ['MetExplore.globals.Session',
    			'MetExplore.view.main.V_UserPanel', 'MetExplore.globals.Project'],
    */
    /*
     * recherche du num de version de l'appli
     */
    searchVersion: function() {
        var ctrl = this;

        Ext.Ajax.request({
            url: 'resources/src/php/versionAppli.php',

            params: {},
            success: function(response, opts) {
                json = Ext.JSON.decode(response.responseText);
                // console.log(json);
                if (json != -1 && json != null) {
                    if (json['versionAppli'] != -1 &&
                        json['versionAppli'] != null) {
                        MetExplore.globals.Session.version = json['versionAppli'];
                        Ext.getCmp('versionAppli')
                            .update('<span id="versionAppli">' +
                                MetExplore.globals.Session.version +
                                '</span>');
                    }
                }

            },
            failure: function(response, opts) {
                // console.log('server-side failure with status code '+
                // response.status);
            }
        });

    },

    loadComponent: function() {
        var store = Ext.getStore('S_ApplicationComponent');
        // console.log('records',store);
        store.each(function(component) {
            // console.log(component);
            var menu = component.get('component');
            var hide = true;
            // console.log('menu',menu);
            var component = Ext.ComponentQuery.query('panel[title="' +
                menu + '"]')[0];
            if (component && hide) {
                // component.setVisible(false);
                // console.log('panel '+component);
                var panel = component.up('panel');
                if (panel) {
                    panel.remove(component);
                    panel.doLayout();
                }
            } else {
                var component = Ext.ComponentQuery
                    .query('bannerPanel toolbar ja_menu_item[text="' +
                        menu + '"]')[0];
                // console.log('menu '+component);
                if (component && hide) {
                    component.hide();
                } else {
                    var component = Ext.ComponentQuery
                        .query('panel[id="' + menu + '"]')[0];
                    // console.log('panel id '+component);
                    if (component && hide) {
                        component.setVisible(false);
                    }
                }
            }
            var component = Ext.ComponentQuery.query('panel[id="' +
                menu + '"]')[0];
            // console.log('panel id '+component);
            if (component) {
                var panel = component.up('panel');
                if (panel) {
                    panel.remove(component);
                    panel.doLayout();
                }
            }
            var viewport = Ext.getCmp('viewport');
            if (viewport)
                viewport.doLayout();

        });

    },

    /**
     * 
     * @param {}
     *            idBioSource
     * @param {}
     *            idUser
     * @param {}
     *            param
     * @param {}
     *            loadUserPanel: if true, load user and project panel, else do
     *            not it. Useful because we must load S_MyBioSource BEFORE do
     *            this and completeSession is also launch directly from app.js,
     *            and launch also if we switch BioSource. In these two cases we
     *            must not reload user and project panels.
     */
    completeSession: function(idBioSource, idUser, param, loadUserPanel) {
        var ctrl = this;

        Ext.Ajax.request({
            url: 'resources/src/php/sessionData.php',

            params: {
                idBioSource: idBioSource,
                idUser: idUser,
                updateLastVisit: loadUserPanel ? "true" : "false"
            },
            success: function(response, opts) {
                json = Ext.JSON.decode(response.responseText);

                if (json['status'] == false) {
                    Ext.MessageBox.alert("Failed", json['message']);
                } else {

                    if (parseInt(json['idBioSource']) != -1) {
                        var storeBioSource = Ext.getStore('S_BioSource');
                        storeBioSource.reload();
                        MetExplore.globals.Session.nameBioSource = json['NomComplet'];
                        MetExplore.globals.Session.publicBioSource = json['public'];
                        MetExplore.globals.Session.typeDB = json['typeDB'];
                        MetExplore.globals.Session.idDB = json['idDB'];
                        // MetExplore.globals.Session.showHideColumns();
                        if (json['access']) {
                            MetExplore.globals.Session.access = json['access'];
                        } else {
                            MetExplore.globals.Session.access = "r";
                        }

                        var side = Ext.getCmp('sidePanel');
                        if (side) {
                            if (side.collapsed) {
                                side.setTitle(MetExplore.globals.Session.nameBioSource);
                            }
                        }

                        // var ctrl= ;
                        if (param && MetExplore.globals.Session.publicBioSource) {
                            ctrl.parseUrl(param);
                        }
                        if (!param || MetExplore.globals.Session.publicBioSource) {
                            ctrl.publicprivateBioSource();
                        }
                    } else {
                        Ext.getCmp('sidePanel').setTitle('');
                    }

                    if (json['idUser'] != -1) {
                        MetExplore.globals.Session.nameUser = json['nameUser'];
                        MetExploreViz.onloadMetExploreViz(function() {
                            metExploreViz.onloadSession(function() {
                                metExploreViz.setUser(MetExplore.globals.Session.nameUser);
                            });
                        });

                        MetExplore.globals.Session.mailUser = json['emailUser'];
                        MetExplore.globals.Session.lastvisitDate = json['lastvisitDate'];
                        Ext.getCmp('login_button').setVisible(false);

                        if (Ext.getCmp('curationPanel'))
                            MetExplore.app.getController('C_CurationPanel').activateCuration();

                        // Load user panel only if loadUserPanel variable is
                        // true (this is done to assure it is done only one
                        // time, as this function is launched twice if user is
                        // connected (a good idea should be to correct this)
                        if (loadUserPanel) {
                            // Collapse all groups of BioSource:
                            var gridBS = Ext.getCmp('gridBioSource');
                            gridBS.getView().features[0].collapseAll();
                            var userPanel = Ext.ComponentQuery.query('UserPanel')[0];
                            // If userPanel is here
                            if (userPanel) {
                                userPanel.removeAll();

                                Ext.getStore('S_UserProjects').load({ // Load
                                    // user
                                    // projects
                                    // store
                                    callback: function() { // When it's done,
                                        // make the user
                                        // panel
                                        userPanel.add(userPanel.setItemsUserConnected());

                                        userPanel.setNameUser();
                                        userPanel.setTitle("User Profile");
                                        // Load user history:
                                        var storeUserHist = Ext
                                            .getStore('S_UserHistory');
                                        storeUserHist.load({
                                            params: {
                                                idProject: -1,
                                                autoDate: true
                                            },
                                            callback: function() { // When it's
                                                // done,
                                                // update the
                                                // grid
                                                // history
                                                // view
                                                this.clearFilter();

                                                var idUser = MetExplore.globals.Session.idUser;

                                                this.filter('idUser', MetExplore.globals.Session.idUser);

                                                var gridUserHistory = Ext.ComponentQuery.query('userPanel gridHistory')[0];

                                                MetExplore.app.getController('userAndProject.C_GridHistory').doUpdate = false;

                                                if (gridUserHistory) {
                                                    var returnValues = this.proxy.reader.jsonData;
                                                    gridUserHistory
                                                        .down('datefield[name="historyFrom"]')
                                                        .setValue(returnValues.from
                                                            .split(/\s/)[0]);
                                                    // gridUserHistory
                                                    //     .down('datefield[name="historyTo"]')
                                                    //     .setValue(returnValues.to
                                                    //         .split(/\s/)[0]);
                                                    gridUserHistory
                                                        .down('datefield[name="historyTo"]')
                                                        .setValue(new Date());
                                                    MetExplore.app
                                                        .getController('userAndProject.C_GridHistory').doUpdate = true;

                                                    //Get there is new projects (invitations) that have not been notified:
                                                    Ext.Ajax.request({
                                                        url: 'resources/src/php/userAndProject/getUserHasNewProjects.php',
                                                        success: function(response, opts) {
                                                            var repJson = null;

                                                            try {
                                                                repJson = Ext.decode(response.responseText);
                                                            } catch (exception) {
                                                                Ext.MessageBox
                                                                    .alert('Ajax error',
                                                                        'delete history items failed: JSON incorrect!');
                                                            }

                                                            if (repJson != null && repJson['success']) {
                                                                if (repJson["newProjects"]) {
                                                                    Ext.MessageBox.alert("New projects!", "You have received invitation(s) to new projects. You can accept the invitation(s) from the User Profile tab. They appears with a grey background.");
                                                                }
                                                            }
                                                        },
                                                        failure: function(response, opts) {
                                                            // console.log('server-side failure with status code '+
                                                            // response.status);
                                                        }
                                                    });

                                                    if (json['idProject'] != -1) { // And
                                                        // then
                                                        // open
                                                        // the
                                                        // project
                                                        // if
                                                        // needed
                                                        MetExplore.globals.Project
                                                            .openProjectById(
                                                                json['idProject'],
                                                                true, false);
                                                    }
                                                }

                                            }
                                        })
                                    }
                                });
                            }
                        }
                    } else { // make login in user panel
                        if (Ext.ComponentQuery.query('UserPanel').length == 1) {
                            var userPanel = Ext.ComponentQuery
                                .query('UserPanel')[0];
                            if (userPanel) {
                                userPanel.removeAll();
                                userPanel.add(userPanel.setLoginPanel());
                                userPanel.setTitle("User Profile");
                            }
                        }
                        MetExploreViz.onloadMetExploreViz(function() {
                            metExploreViz.onloadSession(function() {
                                metExploreViz.setUser("");
                            });
                        });
                    }
                    Ext.getCmp('curationPanel').fireEvent('show',
                        Ext.getCmp('curationPanel'));
                    // if (json['versionAppli']!=-1) {
                    // MetExplore.globals.Session.version=json['versionAppli'];
                    // Ext.getCmp('versionAppli').update('<span
                    // id="versionAppli">' + MetExplore.globals.Session.version
                    // + '</span>');
                    // }
                }
            },
            failure: function(response, opts) {
                // console.log('server-side failure with status code '+
                // response.status);
            }
        });

    },

    manageUserAgreements: function() {
        var hours = 24; // Reset when storage is more than 24hours
        var min = 60; // Reset when storage is more than 24hours
        var now = new Date().getTime();
        var setupTime = localStorage.getItem('useragreements_metexplore');
        if (setupTime == null) {

            showUserAgreement();
        } else {
            if (now - setupTime > 365 * 24 * 60 * 60 * 1000) {
                localStorage.clear();
                showUserAgreement();
            }
        }

        function showUserAgreement() {
            var messageBox = Ext.create('Ext.window.MessageBox', {
                listeners: {
                    afterlayout: function() {
                        messageBox.msgButtons.ok.setDisabled(true);
                        var overall = document.getElementById("agreements_approve");
                        overall.addEventListener('click', function(e, i) {
                            if (document.getElementById('agreements_approve').checked) {
                                messageBox.msgButtons.ok.setDisabled(false);
                            } else {
                                messageBox.msgButtons.ok.setDisabled(true);
                            }
                        });
                    }
                }
            });

            Ext.create('Ext.window.MessageBox').show({
                width: 1000,
                closable: false,
                maxWidth: 1000,
                maxHeight: 610,
                height: 610,
                title: 'MetExplore overview',
                buttons: Ext.MessageBox.OK,
                msg: 'Before using MetExplore, please find a overview of MetExplore features. ' +
                    '<br/>' +
                    '<form method="get" action="https://metexplore.toulouse.inra.fr/metexplore-doc/" target=_blank">' +
                    '<input type="submit" value="MetExplore documentation">' +
                    '</form>' +
                    '<iframe src="resources/pdf/PosterMetExplore.pdf" width="970px" height="450px"></iframe>'
            });

            messageBox.show({
                width: 1000,
                closable: false,
                maxWidth: 1000,
                maxHeight: 610,
                height: 610,
                title: 'Use Agreement',
                buttons: Ext.MessageBox.OK,
                msg: 'Before using MetExplore, please first accept the following User Agreement. If you are using cookies, you won\'t have to do that again.<br/><br/>' +
                    '<iframe src="resources/pdf/User_agreement_MetExplore.pdf" width="970px" height="450px"></iframe>\n' +
                    '<div style="text-align:center">I approve :<input type="checkbox" id="agreements_approve" name="agreements_approve">' +
                    '</div>',
                fn: function(btn) {
                    if (btn == 'ok') {
                        localStorage.setItem('useragreements_metexplore', now);
                    }
                }
            });
        }
    },

    publicprivateBioSource: function() {
        //console.log('session');
        var idBioSource = MetExplore.globals.Session.idBioSource;
        var idUser = MetExplore.globals.Session.idUser;
        var NameBioSource = MetExplore.globals.Session.nameBioSource;

        // console.log('public : '+MetExplore.globals.Session.publicBioSource);
        var boxPublic = Ext.ComponentQuery.query('selectBioSources')[0];
        var boxPrive = Ext.ComponentQuery.query('selectMyBioSources')[0];
        var boxProject = Ext.ComponentQuery.query('selectProjectBioSources')[0];


        //		var ctrlgridBioSource= MetExplore.app.getController('C_gridBioSource');
        //		ctrlgridBioSource.setBiosourceInfo(idBioSource, NameBioSource,
        //				MetExplore.globals.Session.publicBioSource);


        // activate or not the annotation interface when changing biosource
        var annotPanel = Ext.getCmp('curationPanel');
        MetExplore.app.getController('C_CurationPanel').checkSession(annotPanel);

        var netDataTab = Ext.getCmp('networkData');
        var genCtrl = MetExplore.app.getController('C_GenericGrid');
        genCtrl.showHideButtonTBar();

        if (MetExplore.globals.Session.publicBioSource) {
            if (boxPublic)
                boxPublic.select(idBioSource);
            if (boxPrive)
                boxPrive.setValue("");
            if (boxProject)
                boxProject.select("");

        } else {
            if (boxPrive.getStore().getById(idBioSource)) {
                boxPrive.select(idBioSource);
                if (boxProject)
                    boxProject.select("");
            } else {
                boxPrive.select("");
                if (boxProject && boxProject.getStore().getById(idBioSource)) {
                    boxProject.select(idBioSource);
                }
            }
            boxPublic.setValue("");

        }
    },

    /**
     * Parse the url to select one biosource and one view
     */
    parseUrl: function(params) {

        if (typeof params["idBioSource"] != "undefined") {

            //			MetExplore.globals.Session.idBioSource = params["idBioSource"];
            //			var ctrlBioSource = MetExplore.app.getController('C_BioSource');
            //			ctrlBioSource.updateSessionBioSource(parseInt(params["idBioSource"]));
            //			ctrlBioSource.updateGrid(params["idBioSource"], '', '');

            // select a grid
            if (typeof params["view"] != "undefined") {
                var view = params["view"];

                if (Object.prototype.toString.call(view) === '[object Array]') {
                    alert("Only one value is allowed for the view parameter");
                } else {

                    var grid = null;

                    if (view == "reactions") {
                        grid = Ext.ComponentQuery.query('gridReaction')[0];
                    } else if (view == "metabolites") {
                        grid = Ext.ComponentQuery.query('gridMetabolite')[0];
                    } else if (view == "pathways") {
                        grid = Ext.ComponentQuery.query('gridPathway')[0];
                    } else if (view == "compartments") {
                        grid = Ext.ComponentQuery.query('gridCompartment')[0];
                    } else if (view == "enzymes") {
                        grid = Ext.ComponentQuery.query('gridEnzyme')[0];
                    } else if (view == "proteins") {
                        grid = Ext.ComponentQuery.query('gridProtein')[0];
                    } else if (view == "genes") {
                        grid = Ext.ComponentQuery.query('gridGene')[0];
                    }

                    if (grid != null) {
                        var panel = grid.up("panel");
                        panel.setActiveTab(grid);
                    } else {
                        alert("Bad value for the view parameter in the url");
                    }
                }
            }

            // draw a set of reactions
            if (typeof params["draw"] != "undefined") {
                var reactionsStr = params["draw"];

                if (Object.prototype.toString.call(view) === '[object Array]') {
                    alert("The parameter draw does not allow several values but only a string containing reactions ids separated by \t");
                } else {
                    var a_reactions = reactionsStr.split("__+__");

                    var storeReaction = Ext.getStore("S_Reaction");

                    storeReaction.load({
                        callback: function() {
                            storeReaction.sort({
                                property: 'name',
                                direction: 'ASC'
                            });

                            var storeCart = Ext.getStore("S_Cart");
                            storeCart.removeAll();

                            var msg = "";

                            for (var i = 0; i < a_reactions.length; i++) {

                                var reactionIdentifier = a_reactions[i];

                                var instanceReaction = storeReaction
                                    .findRecord("dbIdentifier",
                                        reactionIdentifier);

                                if (instanceReaction == null) {
                                    msg += "\nThe reaction " +
                                        reactionIdentifier +
                                        " is not found in the BioSource";
                                } else {
                                    storeCart.add(instanceReaction);
                                }

                            }

                            if (msg != "") {
                                alert(msg);
                            }

                            if (storeCart.count() > 0) {
                                var graphPanel = Ext.getCmp('graphPanel');
                                var mainPanel = graphPanel.up("panel");

                                mainPanel.setActiveTab(graphPanel);

                                var ctrlGraph = MetExplore.app
                                    .getController('C_GraphPanel');
                                ctrlGraph.refresh();
                                console.log('ok');
                                if (typeof params["hide"] != "undefined") {
                                    console.log('ok');
                                    var storeComponent = Ext
                                        .getStore('S_ApplicationComponent');
                                    storeComponent.add({
                                            'component': 'sidePanel'
                                        }, {
                                            'component': 'bannerPanel'
                                        }, {
                                            'component': 'Network Data'
                                        }, {
                                            'component': 'Network Curation'
                                        }
                                        // {'component':'Mapping_1','hideComponent':
                                        // true}
                                        // {'component':'Network
                                        // Viz','hideComponent': false},
                                        // {'component':'Pathways','hideComponent':
                                        // true},
                                        // {'component':'BioSources','hideComponent':
                                        // true},
                                        // {'component':'Omics','hideComponent':
                                        // true},
                                        // {'component':'graphPanel','hideComponent':
                                        // false}
                                    );
                                    // var ctrl = MetExplore.app.getController('C_Session');
                                    // ctrl.loadComponent();
                                }

                            }

                        }
                    });

                }

            }

            if (typeof params["pathway"] != "undefined") {

                var pathwayDBid = params["pathway"];

                if (Object.prototype.toString.call(view) === '[object Array]') {
                    alert("The parameter pathway does not allow several values but only a string containing the pathway id");
                } else {

                    var storeCart = Ext.getStore('S_Cart');

                    var store1 = Ext.getStore('S_Pathway');
                    var store2 = Ext.getStore('S_Reaction');
                    var store3 = Ext.getStore('S_LinkReactionMetabolite');

                    var grid = Ext.getCmp('gridCart');

                    var nb = storeCart.count();
                    var txt = grid.query('tbtext')[0];
                    txt.setText('<b>Nb Reactions : ' + nb + '</b>');

                    var allStores = [store1, store2, store3],
                        len = allStores.length,
                        loadedStores = 0,
                        i = 0;

                    function check() {
                        console.log(loadedStores);
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

                        var pathRec = store1.findRecord('dbIdentifier',
                            pathwayDBid);

                        if (pathRec != null) {

                            storeCart = pathRec.linkPathwayToCart(storeCart,
                                function(aCart) {

                                    if (aCart.count() > 0) {
                                        var graphPanel = Ext
                                            .getCmp('networksPanel');
                                        var mainPanel = graphPanel
                                            .up("panel");

                                        mainPanel.setActiveTab(graphPanel);

                                        // var ctrlGraph = MetExplore.app
                                        // 		.getController('C_GraphPanel');
                                        // ctrlGraph.refresh();
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

                                            var sommeOk = 0;
                                            cart
                                                .each(function(reaction) {

                                                    reaction.getPathways(function(pathwaysStore) {
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

                                                        pathwaysStore.each(function(pathway) {
                                                            arrayIds.push(pathway.get('name'));
                                                        });

                                                        networkData.addNode(reactionName,
                                                            undefined, reactiondbIdentifier,
                                                            reactionID, reactionReversibility,
                                                            'reaction', false, true, undefined,
                                                            undefined, undefined, undefined, ec, undefined, undefined, arrayIds, undefined, reaction.get('alias'));

                                                        sommeOk++;
                                                    });

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
                                                            networkData.addNode(metaboliteName,
                                                                compartment, dbMetabolite,
                                                                metaboliteID, undefined,
                                                                'metabolite', false, true,
                                                                metaboliteSVG.svg,
                                                                svgWidth, svgHeight, isSsideCompoud, undefined, undefined, undefined, undefined, undefined, undefined, metabolite.get('alias'));

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
                                        });
                                        /*
                                                                                if (typeof params["hide"] != "undefined") {
                                                                                    console.log('ok');
                                                                                    var storeComponent = Ext
                                                                                        .getStore('S_ApplicationComponent');
                                                                                    storeComponent.add({
                                                                                            'component': 'sidePanel'
                                                                                        }, {
                                                                                            'component': 'bannerPanel'
                                                                                        }, {
                                                                                            'component': 'Network Data'
                                                                                        }, {
                                                                                            'component': 'Network Curation'
                                                                                        }
                                                                                        // {'component':'Mapping_1','hideComponent':
                                                                                        // true}
                                                                                        // {'component':'Network
                                                                                        // Viz','hideComponent':
                                                                                        // false},
                                                                                        // {'component':'Pathways','hideComponent':
                                                                                        // true},
                                                                                        // {'component':'BioSources','hideComponent':
                                                                                        // true},
                                                                                        // {'component':'Omics','hideComponent':
                                                                                        // true},
                                                                                        // {'component':'graphPanel','hideComponent':
                                                                                        // false}
                                                                                    );
                                                                                    var ctrl = MetExplore.app
                                                                                        .getController('C_Session');
                                                                                    ctrl.loadComponent();
                                                                                }*/
                                    }
                                })

                        } else {
                            alert("The pathway was not found in this BioSource");
                        }
                    }
                }
            }
        }
    }
});