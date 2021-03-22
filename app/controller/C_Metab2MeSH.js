/**
 * C_ExportExcel
 */
Ext.define('MetExplore.controller.C_Metab2MeSH', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session'],
    config: {
        views: ['form.V_Metab2MeSHUI']
    },

    init: function() {

        var me = this;
        this.selectedMetabolites = [];
        this.selectedMapping = undefined;
        this.selectedCondition = undefined;
        this.regexpPanel = /[.>< ,\/=()]/g;
        this.selectedTerms = [];
        this.control({
            'metab2meshUI [action=launch]': {
                click: this.launch
            },
            'metab2meshUI': {
                close: function() {
                    var storeMeSHPairMetricsValues = Ext.getStore("S_MeSHPairMetricsValues");
                    storeMeSHPairMetricsValues.loadData([], false);
                },
                render: function(panel) {
                    var grid = panel.down("gridMeSHPairMetrics");
                    var storeData = Ext.create('MetExplore.store.S_MeSHPairMetricsValues');
                    grid.reconfigure(storeData);
                }
            },
            'metab2meshUI [action=meshpairmetrics]': {
                click: this.meshpairmetrics
            },
            'metab2meshUI selectMapping': {
                change: function(element, newValue, oldValue) {
                    if (newValue != oldValue) {
                        me.setSelectedMetabolites(newValue);

                        me.setSelectedMapping(newValue);
                    }
                }
            },
            'metab2meshUI selectMeSHPairMetrics': {
                change: function(element, newValue, oldValue) {
                    if (newValue) {
                        if (newValue != oldValue) {
                            me.setMeSHPairMetricsValuesStore();
                        }
                    }
                }
            },
            'metab2meshUI selectMeSH': {
                select: function(combo, records, eOpts) {
                    var lastSelectedMesh = combo.value;

                    me.addToSelectedTerm(lastSelectedMesh);
                    combo.setValue('');
                }
            },
            'metab2meshUI fileuploadfield': {
                'change': function(form) {

                    console.log(form);
                    console.log(form.fileInputEl.dom);
                    // .fileInputEl.dom
                    function handleFileSelect(input, func) {

                        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                            alert('The File APIs are not fully supported in this browser.');
                            return;
                        }

                        if (!input) {
                            alert("couldn't find the fileinput element.");
                        } else if (!input.files) {
                            alert("This browser doesn't seem to support the `files` property of file inputs.");
                        } else {
                            file = input.files[0];

                            var reader = new FileReader();
                            reader.onload = function() {
                                func(reader.result, file.name);
                            };
                            reader.readAsText(file);
                        }
                    }
                    handleFileSelect(form.fileInputEl.dom, function(tabTxt, title) {

                        var data = tabTxt;
                        tabTxt = tabTxt.replace(/\r/g, "");
                        var lines = tabTxt.split('\n');
                        var notValidMeSH = [];
                        if (title.includes(".txt")) {
                            for (var i = lines.length - 1; i >= 0; i--) {
                                var validMeSHTerm = MetExplore.app.getController("C_SelectMeSH").datameshterms.find(function(mesh) {
                                    return mesh.term == lines[i]
                                });
                                console.log(validMeSHTerm);
                                if (validMeSHTerm) {
                                    me.addToSelectedTerm(lines[i]);
                                } else {
                                    if (lines[i] != "")
                                        notValidMeSH.push(lines[i]);
                                }
                            }
                            if (notValidMeSH.length > 0) {
                                Ext.MessageBox
                                    .alert(
                                        "Bad MeSH",
                                        notValidMeSH.join(', ') + '.</br>These term are not valid or are not in the Metab2MeSH filters. See <a target="_blank" href="https://meshb.nlm.nih.gov/search">MeSH website</a> to find the exact term.'
                                    );
                            }

                        } else {
                            // Warning for bad syntax file
                            Ext.MessageBox
                                .alert(
                                    "Syntaxe error",
                                    'File have bad syntax. See <a target="_blank" href="https://metexplore.toulouse.inra.fr/metexplore-doc">MetExplore documentation</a>.'
                                );
                        }
                    });
                }
            }
        });
    },


    /*
     * Add parameter value to selected term
     */
    addToSelectedTerm: function(term) {

        if (this.selectedTerms.indexOf(term) == -1) {
            this.selectedTerms.push(term);
            var newpanel = {
                boxLabel: "<a target='_blank' href='https://meshb.nlm.nih.gov/search?searchInField=allTerms&sort=&size=20&searchType=exactMatch&searchMethod=FullWord&q=" + term + "'>" + term + "</a>",
                name: "meshterm",
                labelStyle: "margin-left:10px",
                fieldStyle: "margin-top:2px",
                width: "100%",
                checked: true,
                listeners: {
                    change: function(me, newValue, oldValue, eOpts) {
                        if (newValue) {
                            me.selectedTerms.push(term);
                        } else {
                            var index = me.selectedTerms.indexOf(newValue);
                            if (index > -1) {
                                me.selectedTerms.splice(index, 1);
                            }
                        }
                    }
                }
            };
            newpanel.term = term;
            var panel = Ext.getCmp("tabPanel").activeTab;
            panel.down("fieldcontainer[name='validatedterms']").add(newpanel);
        }
    },
    /*
     * Set MeSH Pair Metrics values store
     */
    setMeSHPairMetricsValuesStore: function() {
        var panel = Ext.getCmp("tabPanel").activeTab;

        var grid = panel.down("gridMeSHPairMetrics");
        grid.show();

        // var map={
        //     "Carbon Tetrachloride": {
        //         "articleOddsRatio": 3.0847,
        //         "articleCoOccur": 22,
        //         "articleCount": 6345
        //     },
        //     "Liver Failure": {
        //         "articleOddsRatio": 30.2347,
        //         "articleCoOccur": 268,
        //         "articleCount": 5392
        //     },
        //     "Hepatitis B Surface Antigens": {
        //         "articleOddsRatio": 3.0809,
        //         "articleCoOccur": 41,
        //         "articleCount": 16200
        //     },
        //     "Portal Vein": {
        //         "articleOddsRatio": 13.1594,
        //         "articleCoOccur": 237,
        //         "articleCount": 17296
        //     },
        //     "Albumins": {
        //         "articleOddsRatio": 4.9162,
        //         "articleCoOccur": 54,
        //         "articleCount": 15354
        //     },
        //     "Portasystemic Shunt, Surgical": {
        //         "articleOddsRatio": 28.8848,
        //         "articleCoOccur": 187,
        //         "articleCount": 1943
        //     },
        //     "Fatal Outcome": {
        //         "articleOddsRatio": 4.2619,
        //         "articleCoOccur": 157,
        //         "articleCount": 48367
        //     },
        //     "Portasystemic Shunt, Transjugular Intrahepatic": {
        //         "articleOddsRatio": 29.2072,
        //         "articleCoOccur": 168,
        //         "articleCount": 1772
        //     },
        //     "Hepatolenticular Degeneration": {
        //         "articleOddsRatio": 13.1796,
        //         "articleCoOccur": 96,
        //         "articleCount": 4862
        //     },
        //     "Hepatic Veins": {
        //         "articleOddsRatio": 7.215,
        //         "articleCoOccur": 60,
        //         "articleCount": 5076
        //     },
        //     "Analgesics, Non-Narcotic": {
        //         "articleOddsRatio": 5.2072,
        //         "articleCoOccur": 47,
        //         "articleCount": 10220
        //     },
        //     "Globus Pallidus": {
        //         "articleOddsRatio": 4.8903,
        //         "articleCoOccur": 33,
        //         "articleCount": 5512
        //     },
        //     "Antidotes": {
        //         "articleOddsRatio": 3.108,
        //         "articleCoOccur": 16,
        //         "articleCount": 4643
        //     },
        //     "Astrocytes": {
        //         "articleOddsRatio": 7.2366,
        //         "articleCoOccur": 140,
        //         "articleCount": 24452
        //     },
        //     "Hepatitis B, Chronic": {
        //         "articleOddsRatio": 3.2404,
        //         "articleCoOccur": 33,
        //         "articleCount": 9087
        //     },
        //     "Amino Acids, Essential": {
        //         "articleOddsRatio": 3.8483,
        //         "articleCoOccur": 14,
        //         "articleCount": 1805
        //     },
        //     "Citrulline": {
        //         "articleOddsRatio": 3.2479,
        //         "articleCoOccur": 18,
        //         "articleCount": 3240
        //     },
        //     "Portal System": {
        //         "articleOddsRatio": 14.3043,
        //         "articleCoOccur": 132,
        //         "articleCount": 4986
        //     },
        //     "Neuropsychological Tests": {
        //         "articleOddsRatio": 8.1787,
        //         "articleCoOccur": 245,
        //         "articleCount": 63558
        //     },
        //     "Intracranial Pressure": {
        //         "articleOddsRatio": 7.2909,
        //         "articleCoOccur": 95,
        //         "articleCount": 13002
        //     },
        //     "Neurotransmitter Agents": {
        //         "articleOddsRatio": 8.0715,
        //         "articleCoOccur": 112,
        //         "articleCount": 24298
        //     },
        //     "Neomycin": {
        //         "articleOddsRatio": 15.4992,
        //         "articleCoOccur": 154,
        //         "articleCount": 7008
        //     },
        //     "Basal Ganglia": {
        //         "articleOddsRatio": 4.0695,
        //         "articleCoOccur": 45,
        //         "articleCount": 10957
        //     },
        //     "Artificial Organs": {
        //         "articleOddsRatio": 12.8359,
        //         "articleCoOccur": 64,
        //         "articleCount": 2624
        //     },
        //     "Chronic Disease": {
        //         "articleOddsRatio": 3.8581,
        //         "articleCoOccur": 398,
        //         "articleCount": 213483
        //     },
        //     "Blood-Brain Barrier": {
        //         "articleOddsRatio": 9.9392,
        //         "articleCoOccur": 121,
        //         "articleCount": 19691
        //     },
        //     "Aspartate Aminotransferases": {
        //         "articleOddsRatio": 6.6022,
        //         "articleCoOccur": 112,
        //         "articleCount": 24705
        //     },
        //     "Fatty Liver, Alcoholic": {
        //         "articleOddsRatio": 3.3879,
        //         "articleCoOccur": 12,
        //         "articleCount": 1063
        //     },
        //     "Mushroom Poisoning": {
        //         "articleOddsRatio": 15.0427,
        //         "articleCoOccur": 67,
        //         "articleCount": 1404
        //     },
        //     "Lactulose": {
        //         "articleOddsRatio": 60.5469,
        //         "articleCoOccur": 279,
        //         "articleCount": 1674
        //     },
        //     "Electroencephalography": {
        //         "articleOddsRatio": 8.3143,
        //         "articleCoOccur": 503,
        //         "articleCount": 115943
        //     },
        //     "Living Donors": {
        //         "articleOddsRatio": 3.9282,
        //         "articleCoOccur": 35,
        //         "articleCount": 10343
        //     },
        //     "Vascular Fistula": {
        //         "articleOddsRatio": 3.6909,
        //         "articleCoOccur": 15,
        //         "articleCount": 1697
        //     },
        //     "Ligation": {
        //         "articleOddsRatio": 4.7588,
        //         "articleCoOccur": 58,
        //         "articleCount": 17433
        //     },
        //     "Hepatomegaly": {
        //         "articleOddsRatio": 3.1265,
        //         "articleCoOccur": 26,
        //         "articleCount": 5076
        //     },
        //     "Arginine": {
        //         "articleOddsRatio": 3.1084,
        //         "articleCoOccur": 62,
        //         "articleCount": 36499
        //     },
        //     "Octopamine": {
        //         "articleOddsRatio": 11.4016,
        //         "articleCoOccur": 41,
        //         "articleCount": 1322
        //     },
        //     "Hepatorenal Syndrome": {
        //         "articleOddsRatio": 22.1088,
        //         "articleCoOccur": 78,
        //         "articleCount": 927
        //     },
        //     "Trail Making Test": {
        //         "articleOddsRatio": 3.8876,
        //         "articleCoOccur": 13,
        //         "articleCount": 540
        //     },
        //     "Hydroxyindoleacetic Acid": {
        //         "articleOddsRatio": 5.9637,
        //         "articleCoOccur": 44,
        //         "articleCount": 8277
        //     },
        //     "Gastrointestinal Agents": {
        //         "articleOddsRatio": 15.5636,
        //         "articleCoOccur": 103,
        //         "articleCount": 6686
        //     },
        //     "Liver Circulation": {
        //         "articleOddsRatio": 21.9138,
        //         "articleCoOccur": 180,
        //         "articleCount": 9607
        //     },
        //     "Neurologic Manifestations": {
        //         "articleOddsRatio": 5.7433,
        //         "articleCoOccur": 52,
        //         "articleCount": 7307
        //     },
        //     "GABA-A Receptor Antagonists": {
        //         "articleOddsRatio": 5.3435,
        //         "articleCoOccur": 21,
        //         "articleCount": 2132
        //     },
        //     "End Stage Liver Disease": {
        //         "articleOddsRatio": 4.6948,
        //         "articleCoOccur": 16,
        //         "articleCount": 649
        //     },
        //     "Hepatic Artery": {
        //         "articleOddsRatio": 4.4053,
        //         "articleCoOccur": 60,
        //         "articleCount": 11005
        //     },
        //     "Liver Cirrhosis, Alcoholic": {
        //         "articleOddsRatio": 23.962,
        //         "articleCoOccur": 217,
        //         "articleCount": 6048
        //     },
        //     "Plasmapheresis": {
        //         "articleOddsRatio": 12.3567,
        //         "articleCoOccur": 97,
        //         "articleCount": 7509
        //     },
        //     "Transaminases": {
        //         "articleOddsRatio": 3.2103,
        //         "articleCoOccur": 36,
        //         "articleCount": 11124
        //     },
        //     "Sorption Detoxification": {
        //         "articleOddsRatio": 10.9632,
        //         "articleCoOccur": 56,
        //         "articleCount": 791
        //     },
        //     "Dipeptides": {
        //         "articleOddsRatio": 4.5907,
        //         "articleCoOccur": 48,
        //         "articleCount": 12110
        //     },
        //     "Uremia": {
        //         "articleOddsRatio": 6.0096,
        //         "articleCoOccur": 90,
        //         "articleCount": 17283
        //     },
        //     "Acidosis": {
        //         "articleOddsRatio": 3.1667,
        //         "articleCoOccur": 46,
        //         "articleCount": 14762
        //     },
        //     "Alkalosis": {
        //         "articleOddsRatio": 7.078,
        //         "articleCoOccur": 39,
        //         "articleCount": 3742
        //     },
        //     "Flicker Fusion": {
        //         "articleOddsRatio": 6.0262,
        //         "articleCoOccur": 35,
        //         "articleCount": 2350
        //     },
        //     "Drug Overdose": {
        //         "articleOddsRatio": 5.6751,
        //         "articleCoOccur": 48,
        //         "articleCount": 7175
        //     },
        //     "Liver": {
        //         "articleOddsRatio": 6.0477,
        //         "articleCoOccur": 1161,
        //         "articleCount": 367582
        //     },
        //     "Blood Urea Nitrogen": {
        //         "articleOddsRatio": 5.3587,
        //         "articleCoOccur": 49,
        //         "articleCount": 10509
        //     },
        //     "Adrenal Cortex Hormones": {
        //         "articleOddsRatio": 3.118,
        //         "articleCoOccur": 75,
        //         "articleCount": 52241
        //     },
        //     "Biliary Atresia": {
        //         "articleOddsRatio": 3.5387,
        //         "articleCoOccur": 17,
        //         "articleCount": 2195
        //     },
        //     "Liver Cirrhosis, Experimental": {
        //         "articleOddsRatio": 5.4325,
        //         "articleCoOccur": 26,
        //         "articleCount": 3540
        //     },
        //     "Renal Veins": {
        //         "articleOddsRatio": 9.1894,
        //         "articleCoOccur": 56,
        //         "articleCount": 6546
        //     },
        //     "Hepatitis B virus": {
        //         "articleOddsRatio": 4.3199,
        //         "articleCoOccur": 70,
        //         "articleCount": 18999
        //     },
        //     "Parenteral Nutrition": {
        //         "articleOddsRatio": 7.8085,
        //         "articleCoOccur": 92,
        //         "articleCount": 12971
        //     }
        // };

        var storeMeSHPairMetricsValues = grid.getStore();
        if (panel.query('textfield[name=filter_meSHPairMetrics]')[0].getRawValue()) {
            var titlepanelmeSHPairMetrics = panel.query('textfield[name=filter_meSHPairMetrics]')[0].getRawValue();
            var meshsFromPairMetrics = Ext.getStore('S_MeSHPairMetrics').getMeSHsByTitle(titlepanelmeSHPairMetrics);

            var meSHMap = meshsFromPairMetrics.data.meshs;
            //var meSHMap = map;

            Object.keys(meSHMap).forEach(function(key) {
                var meshpairmetricsvalues = {
                    name: key,
                    articleOddsRatio: meSHMap[key].articleOddsRatio,
                    articleCoOccur: meSHMap[key].articleCoOccur,
                    articleCount: meSHMap[key].articleCount
                };
                storeMeSHPairMetricsValues.add(meshpairmetricsvalues);
            });
        }

        panel.doLayout();
    },

    /*
     * Get mapped nodes
     */
    getSeeds: function() {
        var selectedMetabolites = this.getSelectedMetabolites();
        var storeMetabolite = Ext.getStore("S_Metabolite");
        var seeds = [];
        if (this.getSelectedMapping() != undefined) {
            selectedMetabolites.forEach(function(metaboliteDbId) {
                var recMetabolite = storeMetabolite.getByDBIdentifier(metaboliteDbId);

                seeds.push(metaboliteDbId);
            })
        }
        return seeds;
    },

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
    /*
     controlle BioSource lors du load json
     */
    // loadcsv: function(json) {
    //     //console.log(Ext);
    //     //
    //     // document.addEventListener('loadNetworkBiosource', function (arg) {
    //     //     MetExploreViz.onloadMetExploreViz(function () {
    //     var ctrl = MetExplore.app.getController('C_Map');
    //     var idBioSource = undefined;
    //     if (json.mapping != undefined) {
    //         idBioSource = json.mapping[0].idBioSource; //arg.value.biosource;
    //     }
    //
    //     if (idBioSource != undefined && idBioSource != "" && !isNaN(idBioSource)) {
    //
    //     } else {
    //         Ext.Msg.alert({
    //             title: 'Json no conform',
    //             msg: 'The json isn\'t a metexplore mapping save file',
    //             animateTarget: 'elId',
    //             buttons: Ext.Msg.OK,
    //             icon: Ext.window.MessageBox.WARNING
    //         });
    //
    //     }
    // },
    //
    // /**
    //  * declenche par le bouton save mapping
    //  */
    // exportJsonFile: function() {
    //     var ctrl = MetExplore.app.getController('C_Map');
    //     var stringJSON = ctrl.save_mapping();
    //     var link = document.createElement('a');
    //     var panel = Ext.getCmp('tabPanel').getActiveTab();
    //     var nameFile = "mapping.json";
    //     if (panel) {
    //         var mapping_name = panel.query('textfield[name=mapping_name]')[0];
    //         if (mapping_name) {
    //             var txt = mapping_name.value;
    //             if (txt != "") {
    //                 nameFile = txt + ".tab";
    //             }
    //         }
    //     }
    //
    //     //console.log(nameFile);
    //     link.download = nameFile;
    //     //link.download = '_mapping.json';
    //     var blob = new Blob([stringJSON], {
    //         type: 'text/plain'
    //     });
    //     link.href = window.URL.createObjectURL(blob);
    //     link.click();
    // },

    setSelectedMapping: function(mapping) {
        this.selectedMapping = mapping;
    },
    getSelectedMapping: function() {
        return this.selectedMapping;
    },

    /*
     * Launch MeSH2Metab
     * @button {} button
     */
    launch: function(button, ev) {


        var ctrl = this;
        if (this.selectedMetabolites.length > 0) {
            Ext.suspendLayouts();
            console.log('launch');

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
                    if (btn == 'yes') {
                        myMask.show();
                        var controlBioSource = MetExplore.app.getController('C_BioSource');
                        controlBioSource.delFiltersGrid();
                        var control = MetExplore.app.getController('C_GenericGrid');
                        control.delfilterGrid();
                        ctrl.mesh(myMask);

                        button.disable();
                        Ext.resumeLayouts(true);
                    }
                });
            } else {

                myMask.show();
                ctrl.metab2mesh(myMask, function metab2meshCallBack() {
                    ctrl.selectedMetabolites = [];
                    ctrl.selectedMapping = undefined;
                    ctrl.selectedCondition = undefined;
                    ctrl.selectedTerms = [];
                    button.disable();
                    // var storeMeSHPairMetricsValues = Ext.getStore("S_MeSHPairMetricsValues");
                    // storeMeSHPairMetricsValues.loadData([]);
                    Ext.resumeLayouts(true);
                });
            }
        } else {
            Ext.MessageBox.alert('Warning', 'You have to map nodes to compute Metab2MeSH.\n' +
                'Select a mapping. \n' +
                'And make sure that nodes are mapped.')
        }
    },

    /*
     * Show meshpairmetrics form
     * @button {} button
     */
    meshpairmetrics: function(button, ev) {

        var tabPanel = Ext.getCmp('tabPanel');

        var newTab = tabPanel.add({
            title: 'MeSH pair metrics',
            iconCls: 'meshLogo',
            autoScroll: true,
            closable: true,
            items: [{
                xtype: 'meshpairmetricsUI'
            }]
        });

        newTab.show();
    },

    /*
     * Launch mesh analysis
     * @param myMask
     */
    metab2mesh: function(myMask, callback) {
        var me = this;
        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                var panel = Ext.getCmp('tabPanel').getActiveTab();
                var title = panel.query('textfield[name=analysis_title]')[0].getRawValue();
                var meshTerms = [];
                var panel = Ext.getCmp('tabPanel').getActiveTab();
                var listOfcheckboxTermsByCombo = panel.query("checkboxfield[name='meshterm']");

                //MeshPAIR
                var selectedMeshPairMetrics = Ext.getCmp("tabPanel").activeTab.down("gridMeSHPairMetrics").selModel.selected.items;
                selectedMeshPairMetrics.forEach(function(mesh) {
                    meshTerms.push(mesh.get('name'));
                });

                listOfcheckboxTermsByCombo.forEach(function(checkbox) {
                    if (checkbox.checked) {
                        if (meshTerms.indexOf(checkbox.term) == -1)
                            meshTerms.push(checkbox.term);
                    }
                });
                me.getParameters(title, meshTerms, function(param) {
                    Ext.Ajax.request({
                        url: 'resources/src/php/application_binding/launchMetab2MeSH.php',
                        params: param,
                        timeout: 2200000,
                        success: function(form, action) {
                            var json = null;
                            if (myMask) myMask.hide();
                            callback();
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
    },

    /*
     * get parameter to page rank & chei rank ajax request
     * @button {} button
     */
    getParameters: function(title, meshTerm, func) {
        var ctrl = this;
        var storeM = Ext
            .getStore('S_Metabolite');
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
        storeM.sort({
            property: 'name',
            direction: 'ASC'
        });

        MetExplore.app.getController("C_BioSource").addMetabolitesIds(function() {

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
                meshTerms: JSON.stringify(meshTerm),
                idBioSource: MetExplore.globals.Session.idBioSource,
                title: title,
                metabolites: JSON.stringify(ctrl.getSeeds())
            };
            func(param);
        });
        //     }
        // });
    }
});