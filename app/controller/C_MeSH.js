/**
 * C_MeSH
 */
Ext.define('MetExplore.controller.C_MeSH', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session'],
    config: {
        views: ['form.V_MeSHUI']
    },

    init: function() {

        var me = this;
        this.control({
            'meshUI [action=launch]': {
                click: this.launch
            }
            //,
            // 'meshUI selectMapping' : {
            //     change: function(element, newValue, oldValue) {
            //         if (newValue != oldValue){
            //             me.setSelectedMetabolites(newValue);

            //             me.setSelectedMapping(newValue);
            //             me.fillComboSelectCondition(newValue);
            //         }
            //     }
            // },
            // 'meshUI selectCondition' : {
            //     change: function(element, newValue, oldValue) {
            //         if (newValue != oldValue){
            //             me.setSelectedCondition(newValue);
            //         }

            //     }
            // }

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

    // getFingerprints: function() {
    //     var selectedMetabolites = this.getSelectedMetabolites();
    //     var selectedCondition= this.getSelectedCondition();
    //     var storeMetabolite = Ext.getStore("S_Metabolite");
    //     var fingerprints ={};
    //     if(this.getSelectedMapping()!=undefined && this.getSelectedCondition()!=undefined){
    //         selectedMetabolites.forEach(function (metaboliteDbId) {
    //             var storeCond = Ext.getStore('S_Condition');
    //             var condition = storeCond.getStoreByCondName(selectedCondition);
    //             var recMetabolite = storeMetabolite.getByDBIdentifier(metaboliteDbId);
    //             var value=recMetabolite.get(condition.getCondInMetabolite());

    //             if(isNaN(value) || value==" ")
    //                 fingerprints[metaboliteDbId]=1/selectedMetabolites.length;
    //             else
    //                 fingerprints[metaboliteDbId]=value;
    //         })
    //     }
    //     else
    //     {
    //         selectedMetabolites.forEach(function (metaboliteDbId) {
    //             fingerprints[metaboliteDbId]=1/selectedMetabolites.length;
    //         })
    //     }

    //     return fingerprints;
    // },

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
            })

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
     * Launch MeSH2Metab
     * @button {} button
     */
    launch: function(button, ev) {

        console.log('launch');
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
            Ext.MessageBox.confirm('MeSH analysis on filter network', 'MeSH must be executed on unfiltered grid. Do you want it?', function(btn) {
                //console.log(btn);
                if (btn == 'yes') {
                    myMask.show();
                    var controlBioSource = MetExplore.app.getController('C_BioSource');
                    controlBioSource.delFiltersGrid();
                    var control = MetExplore.app.getController('C_GenericGrid');
                    control.delfilterGrid();
                    ctrl.mesh(myMask);

                    button.disable();
                }
            });
        } else {

            myMask.show();
            ctrl.mesh(myMask);
            button.disable();
        }
    },

    /*
     * Launch mesh analysis
     * @button {} button
     */
    mesh: function(myMask) {

        Ext.suspendLayouts();
        var me = this;
        console.log("mesh");
        if (MetExplore.globals.Session.idBioSource != -1) {
            MetExplore.globals.Session.isSessionExpired(function(isExpired) {
                if (!isExpired) {
                    var panel = Ext.getCmp('tabPanel').getActiveTab();
                    var title = panel.query('textfield[name=analysis_title]')[0].getRawValue();
                    var meshTerm = panel.query('textfield[name=analysis_term]')[0].getRawValue();

                    console.log("isSessionExpired");
                    me.getParameters(title, meshTerm, function(param) {
                        Ext.Ajax.request({
                            url: 'resources/src/php/application_binding/launchMeSH.php',
                            params: param,
                            timeout: 2200000,
                            success: function(form, action) {
                                var json = null;
                                if (myMask) myMask.hide();

                                try {
                                    json = Ext.decode(form.responseText);
                                } catch (err) {

                                    Ext.MessageBox.alert('Failed', 'Server error while getting results !')
                                    return;
                                }
                                if (json["success"] == false) {
                                    Ext.MessageBox.alert('Failed', 'Server error : ' + json["message"])
                                    return;
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
                            }
                        });
                    });
                }
            });
        } else {
            Ext.MessageBox.alert('Warning', 'You have to load a biosource to compute Metab2MeSH.\n');
        }

        Ext.resumeLayouts(true);
    },

    /*
     * get parameter to page rank & chei rank ajax request
     * @button {} button
     */
    getParameters: function(title, meshTerm, func) {
        var ctrl = this;
        var storeM = Ext
            .getStore('S_Metabolite');

        console.log("getParameters");
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
            metabolites: []
        };

        var storeM = Ext.getStore('S_Metabolite');
        var storeMIds = Ext.getStore('S_MetaboliteIds');
        storeM.proxy.extraParams.idBioSource = MetExplore.globals.Session.idBioSource;
        storeM.proxy.extraParams.req = "R_Metabolite";

        var waitExtIdsLoaded = true;
        // storeM.load({
        //     callback: function() {
        console.log("load");
        storeM.sort({
            property: 'name',
            direction: 'ASC'
        });

        MetExplore.app.getController("C_BioSource").addMetabolitesIds(function() {
            console.log("addMetabolitesIds");
            storeM.each(function(metabolite) {
                var ids = storeMIds.getRange().filter(function(extId) {
                    return extId.get('idMetabolite') == metabolite.data.id && extId.get('DB') == "pubchem.compound";
                })[0];
                if (ids != undefined)
                    ids = [ids.data];
                else
                    ids = [];

                networkData.metabolites.push({
                    id: metabolite.data.id,
                    dbIdentifier: metabolite.data.dbIdentifier,
                    name: metabolite.data.name,
                    extIds: ids
                });

            });

            var param = {
                network: JSON.stringify(networkData),
                meshTerm: meshTerm,
                idBioSource: MetExplore.globals.Session.idBioSource,
                title: title
            };
            func(param);
        });
        //     }
        // });
    }
});