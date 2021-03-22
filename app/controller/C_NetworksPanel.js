/**
 * C_gridData
 */
Ext.define('MetExplore.controller.C_NetworksPanel', {
    extend: 'Ext.app.Controller',
    config: {
        models: ['NetworkData'],
        views: ['main.V_NetworksPanel']
    },

    init: function() {
        this.control({
            'networksPanel': {
                afterrender: function(panel) {

                    MetExploreViz.initFrame("networksPanel");
                    MetExploreViz.onloadMetExploreViz(function() {
                        var generalStyle = metExploreViz.newGeneralStyle("MetExplore", "yellow", "blue", 500, false, false, false);
                        generalStyle.setEventForNodeInfo(true);
                        metExploreViz.setControlBioSource(true);
                        metExploreViz.setGeneralStyle(generalStyle);
                        metExploreViz.onloadSession(function() {
                            metExploreViz.setUser(MetExplore.globals.Session.nameUser);
                        });

                    });

                    document.addEventListener('loadNetworkBiosource', function(arg) {
                        MetExploreViz.onloadMetExploreViz(function() {

                            var networkBioSource = arg.value.biosource;
                            var json = arg.value.json;

                            var currentBioSource = {
                                id: MetExplore.globals.Session.idBioSource,
                                name: MetExplore.globals.Session.nameBioSource,
                                version: MetExplore.globals.Session.version
                            };

                            if (networkBioSource != undefined) {
                                var storeBS = Ext.getStore('S_BioSource');
                                var storeMyBS = Ext.getStore('S_MyBioSource');
                                var accessPublic = storeBS.findRecord('id', networkBioSource.id);
                                var accessPrivate = storeMyBS.findRecord('id', networkBioSource.id);

                                if (accessPublic || accessPrivate) {

                                    if ((currentBioSource.id == networkBioSource.id && networkBioSource.id != "" && networkBioSource.id != undefined) ||
                                        (currentBioSource.name == networkBioSource.name && networkBioSource.name != "" && networkBioSource.name != undefined)) {

                                        arg.value.func();
                                        arg.value.endFunc();

                                    } else {
                                        Ext.Msg.show({
                                            title: 'Different biosource',
                                            msg: 'Current MetExplore biosource and network biosource are different. Biosource file is: ' + networkBioSource.name + ' id: ' + networkBioSource.id,
                                            animateTarget: 'elId',
                                            icon: Ext.window.MessageBox.WARNING,
                                            fn: function(button) {
                                                if (button === "ok") {
                                                    //Function keep biosource and launch visu
                                                    arg.value.func();
                                                    arg.value.endFunc();
                                                } else {
                                                    if (button === 'yes') {

                                                        MetExplore.globals.Loaded.S_Reaction = -1;
                                                        MetExplore.globals.Loaded.S_Pathway = -1;

                                                        //Change MetExplore BioSource and launch visu
                                                        var ctrl = MetExplore.app.getController('MetExplore.controller.C_GenericGrid');
                                                        ctrl.selectBioSource(networkBioSource.id);
                                                        arg.value.endFunc();

                                                        var networksPanel = Ext.getCmp('networksPanel');

                                                        var mainPanel = networksPanel.up("panel");

                                                        mainPanel.setActiveTab(networksPanel);
                                                        metExploreViz.setIsNewBioSource(true);

                                                        metExploreViz.GraphPanel.refreshPanel(json);
                                                    } else {
                                                        arg.value.endFunc();
                                                    }
                                                }
                                            },
                                            buttonText: {
                                                yes: ('Change MetExplore BioSource to imported BioSource'),
                                                ok: 'Keep MetExplore BioSource',
                                                cancel: 'Cancel'
                                            }
                                        });
                                    }
                                } else {
                                    Ext.Msg.show({
                                        title: 'Private BioSource',
                                        msg: 'You attempt to load private BioSource and you do\'nt have access to it. Do you want load the network without the BioSource?',
                                        animateTarget: 'elId',
                                        buttons: Ext.Msg.YESNO,
                                        icon: Ext.window.MessageBox.QUESTION,
                                        fn: function(button) {
                                            if (button === 'yes') {
                                                metExploreViz.getGlobals().setBiosource(currentBioSource);
                                                arg.value.func();
                                            }
                                            arg.value.endFunc();
                                        }
                                    });
                                }
                            } else {
                                Ext.Msg.show({
                                    title: 'Assign biosource?',
                                    msg: 'There is no biosource informations on your network. Do you want affect current biosource on it?',
                                    animateTarget: 'elId',
                                    buttons: Ext.Msg.YESNO,
                                    icon: Ext.window.MessageBox.QUESTION,
                                    fn: function(button) {
                                        if (button === 'yes') {
                                            metExploreViz.getGlobals().setBiosource(currentBioSource);
                                        }
                                        arg.value.func();
                                        arg.value.endFunc();
                                    }
                                });
                            }

                        })
                    }, false);
                }
            }
        });
    }
});