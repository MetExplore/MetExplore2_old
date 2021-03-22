/**
 * C_GraphRank
 */
Ext.define('MetExplore.controller.C_GraphRank', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session'],
    config: {
        views: ['form.V_GraphRankUI']
    },

    init: function() {
        var me = this;
        this.selectedMetabolites = [];
        this.selectedMapping = undefined;
        this.selectedCondition = undefined;

        this.control({
            'graphRankUI button[action=launch]': {
                click: function(boutton, ev) {

                    me.launch(boutton, ev);
                },
                render: function(button) {
                    Ext.Ajax.request({
                        url: 'resources/src/php/utils/fileexist.php',
                        scope: this,
                        method: 'POST',
                        //method: 'GET',
                        params: {
                            file: MetExplore.globals.Session.idBioSource + "-AAM-weights.tab"
                        },
                        failure: function(response, opts) {
                            Ext.MessageBox
                                .alert('Ajax error',
                                    'Error while getting file status');
                        },
                        success: function(response, opts) {
                            var results = Ext.decode(response.responseText)["results"];
                            //console.log(results);
                            if (!results){
                                Ext.MessageBox.confirm('MetaboRank', 'This tool only works by selecting the 3223 or 5482 BioSource. Do you want load 3223 biosource?', function(btn) {

                                    if (btn == 'yes') {
                                        var ctrl = MetExplore.app.getController('C_BioSource');

                                        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
                                            if (!isExpired) {
                                                /**
                                                 * recuperer idBioSource selectionne
                                                 * completer variables de session
                                                 * ecrire cookie nouveau BioSource
                                                 */
                                                ctrl.delNetworkData();
                                                ctrl.delFiltersGrid();
                                                ctrl.closeWinInfo();
                                                ctrl.closeEditWindows();
                                                ctrl.updateSessionBioSource(3223);
                                                ctrl.updateGrid(3223);

                                                var thisTab = Ext.ComponentQuery.query('mainPanel')[0].setActiveTab(Ext.ComponentQuery.query('mainPanel')[0].items.last());
                                                Ext.ComponentQuery.query('mainPanel')[0].setActiveTab(thisTab);

                                            }
                                        });
                                    } else {
                                        button.disable();
                                    }
                                })
                            }

                        }
                    });

                }
            },
            'graphRankUI selectMapping': {
                change: function(element, newValue, oldValue) {
                    if (newValue != oldValue) {
                        me.setSelectedMetabolites(newValue);

                        me.setSelectedMapping(newValue);
                        me.fillComboSelectCondition(newValue);
                    }
                }
            },
            'graphRankUI selectCondition': {
                change: function(element, newValue, oldValue) {
                    if (newValue != oldValue) {
                        me.setSelectedCondition(newValue);
                    }
                }
            }

            // ,
            // 'graphRankUI selectMetabolites' : {
            //     change: function(element, newValue, oldValue) {
            //         if (newValue != oldValue){
            //             me.setSelectedMetabolites(newValue);
            //         }
            //     }
            // }
        });

    },

    getSeeds: function() {
        var selectedMetabolites = this.getSelectedMetabolites();
        var selectedCondition = this.getSelectedCondition();
        var storeMetabolite = Ext.getStore("S_Metabolite");
        var seeds = {};

        if (this.getSelectedMapping() && this.getSelectedCondition()) {

            selectedMetabolites.forEach(function(metaboliteDbId) {
                var storeCond = Ext.getStore('S_Condition');
                var condition = storeCond.getStoreByCondName(selectedCondition);
                var recMetabolite = storeMetabolite.getByDBIdentifier(metaboliteDbId);
                var value = recMetabolite.get(condition.getCondInMetabolite());
                if (isNaN(value) || value === " ")
                    seeds[metaboliteDbId] = 0;
                else
                    seeds[metaboliteDbId] = value;


            })
        } else {
            selectedMetabolites.forEach(function(metaboliteDbId) {
                seeds[metaboliteDbId] = 0;
            })
        }
        return seeds;
    },

    // setSelectedMetabolites: function(metabolites) {
    //     this.selectedMetabolites = metabolites;
    // },
    setSelectedMetabolites: function(newMapping) {
        var mappingInfoStore = Ext.getStore('S_MappingInfo');
        var storeMetabolite = Ext.getStore("S_Metabolite");

        if (mappingInfoStore != undefined) {

            var theMapping = mappingInfoStore.findRecord('id', newMapping);
            var metabolitesId = theMapping.get('idMapped').split(',');
            var metabolitesDBId = metabolitesId.map(function(id) {
                if (storeMetabolite.getMetaboliteById(id))
                    return storeMetabolite.getMetaboliteById(id).get('dbIdentifier');
            });

            this.selectedMetabolites = metabolitesDBId;
        }
    },
    getSelectedMetabolites: function() {
        return this.selectedMetabolites;
    },

    setSelectedMapping: function(mapping) {
        this.selectedMapping = mapping;
    },
    getSelectedMapping: function() {
        return this.selectedMapping;
    },

    setSelectedCondition: function(condition) {
        this.selectedCondition = condition;
    },
    getSelectedCondition: function() {
        return this.selectedCondition;
    },

    /*******************************************
     * Affect selected mapping conditions to the comboBox: SelectCondition
     * @param {} newMapping : id of new mapping
     */
    fillComboSelectCondition: function(newMapping) {
        var mappingInfoStore = Ext.getStore('S_MappingInfo');

        if (mappingInfoStore != undefined) {
            var storeCond = Ext.getStore('S_Condition');
            storeCond.loadData([], false);

            var theMapping = mappingInfoStore.findRecord('id', newMapping);
            var conditions = theMapping.get('condName');

            for (var indCond = 0; indCond < conditions.length; indCond++) {
                storeCond.add({
                    'condName': conditions[indCond],
                    'condInMetabolite': theMapping.get('id') + 'map' + indCond
                });
            }
        }
    },

    /*
     * Launch page rank & chei rank
     * @button {} button
     */
    launch: function(button, ev) {
        if (this.selectedMetabolites.length > 0) {
            var ctrl = this;
            var storeLink = Ext
                .getStore('S_LinkReactionMetabolite');
            var storeM = Ext
                .getStore('S_Metabolite');
            var storeR = Ext
                .getStore('S_Reaction');

            var panel = Ext.getCmp('tabPanel').getActiveTab();
            var myMask = new Ext.LoadMask({
                target: panel, // Here myPanel is the component you wish to mask
                msg: "Please wait..."
            });

            if (storeM.getTotalCount() > storeM.getCount() || storeR.getTotalCount() > storeR.getCount()) {
                Ext.MessageBox.confirm('Ranking on filter network', 'Ranking must be executed on unfiltered grid. Do you want it?', function(btn) {

                    if (btn == 'yes') {
                        myMask.show();
                        var controlBioSource = MetExplore.app.getController('C_BioSource');
                        controlBioSource.delFiltersGrid();
                        var control = MetExplore.app.getController('C_GenericGrid');
                        control.delfilterGrid();
                        ctrl.rank(myMask);

                        button.disable();
                    }
                });
            } else {

                myMask.show();
                ctrl.rank(myMask);
                button.disable();
            }
        } else {
            Ext.MessageBox.alert('Warning', 'You have to map nodes to compute MetaboRank.\n' +
                'Select a mapping to define seeds! \n' +
                'And make sure that nodes are mapped.')
        }
    },

    /*
     * Launch page rank & chei rank
     * @button {} button
     */
    rank: function(myMask) {
        var me = this;
        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                var panel = Ext.getCmp('tabPanel').getActiveTab();
                var title = panel.query('textfield[name=analysis_title]')[0].getRawValue();
                var parameters = me.getParameters(title);

                Ext.Ajax.request({
                    url: 'resources/src/php/application_binding/launchRank.php',
                    params: parameters,
                    timeout: 2200000,
                    success: function(form, action) {
                        var json = null;
                        if (myMask) myMask.hide();

                        try {
                            json = Ext.decode(form.responseText);
                        } catch (err) {

                            Ext.MessageBox.alert('Failed', 'Server error while getting results !');
                            return;
                        }
                        if (json["success"] == false) {
                            Ext.MessageBox.alert('Failed', 'Server error : ' + json["message"]);

                        } else {
                            if (!Ext.isDefined(json["path"])) {
                                // The job is a long job
                                var message = json["message"];

                                var win = Ext.create("Ext.window.MessageBox", {
                                    height: 300
                                });
                                win.alert("Application message", message);

                                var sidePanel = Ext.ComponentQuery.query("sidePanel")[0];
                                var gridJobs = sidePanel.down("gridJobs");
                                gridJobs.expand();

                                Ext.getStore("S_Analyses").reload();

                            }
                        }
                    },
                    failure: function(form, action) {
                        if (myMask) myMask.hide();
                        var json = action.result;
                        Ext.MessageBox.alert('Failed', 'Server error : ' + json["message"])

                    }
                });
            }
        });
    },

    /*
     * get parameter to page rank & chei rank ajax request
     * @button {} button
     */
    getParameters: function(title) {
        var ctrl = this;
        var storeLink = Ext
            .getStore('S_LinkReactionMetabolite');
        var storeM = Ext
            .getStore('S_Metabolite');
        var storeR = Ext
            .getStore('S_Reaction');
        var winMessage = Ext.create("Ext.window.MessageBox", {
            maximizable: true,
            resizable: true
        });

        if (MetExplore.globals.Session.idUser == "" || MetExplore.globals.Session.idUser == -1) {
            var winWarning = Ext.create("Ext.window.MessageBox", {
                height: 300
            });

            winWarning.alert('Warning',
                'You are not connected, the job will only be available during your session. ');

            winWarning.setPosition(50);
        }

        var networkData = {
            links: [],
            reactions: [],
            metabolites: []
        };

        storeR.each(function(reaction) {
            networkData.reactions.push({
                id: reaction.data.id,
                dbIdentifier: reaction.data.dbIdentifier,
                name: reaction.data.name
            });
        });

        storeLink.each(function(linkReactionMetabolite) {
            var reaction = storeR.getById(linkReactionMetabolite.data.idReaction).data;
            networkData.links.push({
                idReaction: reaction.dbIdentifier,
                idMetabolite: storeM.getById(linkReactionMetabolite.data.idMetabolite).data.dbIdentifier,
                interaction: linkReactionMetabolite.data.interaction,
                reversible: reaction.reversible
            });
        });

        // storeM.proxy.extraParams.idBioSource=1363;
        // storeM.proxy.extraParams.req="R_Metabolite";
        //
        // storeM.load({
        //     callback:function(){
        //         storeM.sort({property    : 'name', direction: 'ASC'});
        //         MetExplore.app.getController("C_BioSource").addInchiSvg();
        //         //ctrl.addMetabolitesIds();
        //     }
        // });
        storeM.each(function(metabolite) {
            networkData.metabolites.push({
                id: metabolite.data.id,
                dbIdentifier: metabolite.data.dbIdentifier,
                name: metabolite.data.name
            });
        });

        return {
            network: JSON.stringify(networkData),
            idBioSource: MetExplore.globals.Session.idBioSource,
            title: title,
            metabolites: JSON.stringify(ctrl.getSeeds())
        };
    }
});