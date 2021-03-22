/**
 * C_MappingVizPanel
 */
Ext.define('MetExplore.controller.C_MappingVizPanel', {
    extend: 'Ext.app.Controller',

    config: {
        views: ['view.V_MappingVizPanel']
    },

    init: function() {
        var ctrl = this;
        this.scatterchart = undefined;
        this.control({
            // Scartter plot fill mappingVizPanel when resize
            'mappingVizPanel': {
                resize: function() {
                    if (ctrl.scatterchart) {
                        ctrl.scatterchart.reflow();
                    }
                },
                afterrender: this.render
            }
        });
    },

    render: function(panel) {
        var that = this;
        Ext.getCmp('comboMappingViz').on({
            change: function(field, value) {
                that.onCollapseCombo(field, value)
            }
        });
    },

    onCollapse: function(panel) {
        panel.setTitle(MetExplore.globals.Session.nameBioSource);
        if (Ext.getCmp('newElement')) {
            Ext.getCmp('newElement').doComponentLayout();
        }
    },


    onCollapseCombo: function(field, value) {
        if (Ext.getCmp('panelViz')) {
            Ext.getCmp('panelViz').doComponentLayout();
            console.log(value);
            if (value[0].raw != undefined) {
                if (value[0].raw.data != undefined) {

                    this.initHeatMap(value[0].raw);
                }

            }
            if (value[0].data != undefined) {
                var scatter = true;
                var mapping = MetExplore.globals.Session.mappingObjViz[value[0].data.numero];

                //If seeds are defined it's 2Drank mapping so wee can launch scatter plot visualisation
                if (mapping) {
                    if (mapping.seeds != undefined) {
                        this.initScatterPlot(mapping);
                    }
                }
            } else {
                var mapping = MetExplore.globals.Session.mappingObjViz.filter(function(map) {
                    return map.id == value
                })[0];

                if (mapping) {

                    if (mapping.data != undefined) {
                        this.initHeatMap(mapping);
                    }
                    //If seeds are defined it's 2Drank mapping so wee can launch scatter plot visualisation
                    if (mapping.seeds != undefined) {
                        this.initScatterPlot(mapping);
                    }
                }

            }

        }
    },

    // /**
    //  * Launch mapping on selection
    //  * @param {}
    //  *            entities
    //  * @param {}
    //  *            applicationName
    //  * @param {}
    //  *            objectName
    //  */
    mapEntities: function(entities, applicationName, objectName, id) {


        var ctrl = this;
        var panel = Ext.getCmp('tabPanel').getActiveTab();
        var myMask = new Ext.LoadMask({
            target: panel, // Here myPanel is the component you wish to mask
            msg: "Please wait..."
        });
        var ctrlMap = MetExplore.app.getController('C_Map');

        myMask.show();


        if (entities.length > 0) {
            if (entities.length > 200) {
                Ext.MessageBox.confirm('Confirm mapping', 'Mapping on more than 200 metabolites can be long. Would you like to do the mapping?', function(choice) {
                    if (choice == 'yes') {
                        map();
                    } else {
                        Ext.callback(ctrlMap.maskHide(myMask), this);
                        return false;
                    }
                });
            } else {
                map();
            }
        } else {
            Ext.callback(ctrlMap.maskHide(myMask), this);
            return false;
        }

        function map() {
            var storeMap = Ext.getStore('S_MappingInfo');

            var Listid = new Array();

            var store_object = Ext.getStore("S_" + objectName);

            // /**
            // * Commit changes : change also the grid
            // */
            // store_object.commitChanges();
            var stringIds = "";

            var storeMap = Ext.getStore('S_MappingInfo');

            // 4814 in dev server. Make correspond files on server with names and version to consult server if atom mapping is present 
            var numero = storeMap.addMappingInfo("Metabolite", "Identifier", "3223", stringIds, "", "", entities.length, entities.length, applicationName);

            var mapping = {
                'id': 'M' + numero,
                'name': applicationName,
                'object': objectName,
                'numero': numero,
                'title': applicationName,
                'condName': ["undefined"]
            };

            var itsCoverage = false;

            if (objectName !== "Gene")
                ctrlMap.initMappingInVisualization(mapping, numero, itsCoverage);

            Ext.each(entities, function(entity) {

                var dbIdentifier = entity;
                var rec = store_object.findRecord("dbIdentifier",
                    dbIdentifier, 0, false, true, true);
                if (rec) {
                    if (entities.indexOf(entity) == entities.length - 1)
                        stringIds += rec.get('id');
                    else
                        stringIds += rec.get('id') + ',';

                    rec.set("M" + numero + "identified", true);
                    ctrlMap.dataMappingInVisualization("Identified", rec.get('dbIdentifier'), '', numero, false);

                } else {
                    rec.set("M" + numero + "identified", false);
                }
            });

            store_object
                .filter(function(met) {
                    return met.get("M" + numero + "identified") == undefined;
                });

            store_object
                .each(function(met) {
                    met.set("M" + numero + "identified", false);
                });
            store_object.clearFilter();

            storeMap.last().set('idMapped', stringIds);

            var grid = Ext.getCmp('grid' + objectName);
            if (grid) {
                grid.createGroupCol(storeMap.last().get('title'), ['Identified'], ["M" + numero + 'identified'], false);
                //grid.colorRowMapped();
            }

            Ext.getStore('S_Metabolite').sort({
                property: 'mapped',
                direction: 'ASC'
            });
            ctrlMap.coverage(numero, store_object, 0, myMask);

            MetExploreViz.onloadMetExploreViz(function() {
                metExploreViz.onloadSession(function() {
                    console.log("loadDataFromJSON");console.log(MetExplore.globals.Session.mappingObjViz[numero]);metExploreViz.GraphMapping.loadDataFromJSON(JSON.stringify(MetExplore.globals.Session.mappingObjViz[numero]));
                });
            });

            return true;
        }
    },


    /**
     * Initialisation of scatter plot
     * @param {Object} mapping - Classic MetExplore mapping
     */
    initScatterPlot: function(mapping) {
        var ctrl = this;

        // Define scatter plot series
        var conditions = mapping.mappings;
        var mappingData = [];

        var mappingDataSeeds = [];
        var colors = [];
        for (var i = 0; i < conditions[0].data.length; i++) {
            var valCond1 = 0;
            var valCond2 = 0;

            if (!isNaN(conditions[0].data[i].value))
                valCond1 = conditions[0].data[i].value;

            if (!isNaN(conditions[1].data[i].value))
                valCond2 = conditions[1].data[i].value;

            if (mapping.seeds[conditions[0].data[i].node] != undefined) {
                mappingDataSeeds.push({
                    x: valCond1,
                    y: valCond2,
                    node: conditions[0].data[i].node,
                    nodeName: ctrl.getMetaboliteName(conditions[0].data[i].node)
                });
            } else {
                mappingData.push({
                    x: valCond1,
                    y: valCond2,
                    node: conditions[0].data[i].node,
                    nodeName: ctrl.getMetaboliteName(conditions[0].data[i].node)
                });
            }
        }

        // Define mins for each axes to enable log scaling of axes
        var minX = Math.min.apply(null, mappingData.map(function(node) {
            if (node.x > 0) return node.x;
            return 1;
        }));

        var minY = Math.min.apply(null, mappingData.map(function(node) {
            if (node.y > 0) return node.y;
            return 1;
        }));


        /**
         * Custom selection handler that selects points and cancels the default zoom behaviour
         */
        function selectPointsByDrag(e) {

            var evtobj = window.event ? event : e;
            var ctrlKey = evtobj.ctrlKey;

            // Select points
            var first = true;

            Highcharts.each(this.series, function(series) {
                if (series.data.length > 0) {
                    Highcharts.each(series.points, function(point) {
                        if (point.x >= e.xAxis[0].min && point.x <= e.xAxis[0].max &&
                            point.y >= e.yAxis[0].min && point.y <= e.yAxis[0].max && point.series.visible) {
                            var keep = true;

                            if (!ctrlKey && first) {
                                keep = false;
                                first = false;
                            }
                            point.select(true, keep);
                        }
                    });
                }
            });
            var selectedPoints = ctrl.scatterchart.getSelectedPoints();

            selectedPoints.forEach(function(point, i) {
                console.log(point);
                if (typeof metExploreViz != "undefined") {
                    var session = metExploreViz.getGlobals().getSessionById('viz');
                    // if visualisation is actived we add item to menu
                    if (session != null && session.isActive()) {
                        metExploreViz.GraphNode.highlightANode(point.node);
                    }
                }

                var store_object = Ext.getStore("S_" + mapping.object);
                var gridobject = Ext.getCmp("grid" + mapping.object);

                var rec = store_object.findRecord("dbIdentifier",
                    point.node, 0, false, true, true);

                var index = gridobject.getStore().data.items.indexOf(rec);
                var keep = true;
                if (i == 0) keep = false;

                gridobject.getView().getSelectionModel().select(index, keep);
            });

            // Fire a custom event
            // Highcharts.fireEvent(this, 'selectedpoints', { points: this.getSelectedPoints() });

            return false; // Don't zoom
        }

        // /**
        //  * The handler for a custom event, fired from selection event
        //  */
        // function selectedPoints(e) {
        //     // Show a label
        //     toast(this, '<b>' + e.points.length + ' points selected.</b>' +
        //         '<br>Click on empty space to deselect.');
        // }

        /**
         * On click, unselect all points
         */
        function unselectByClick() {
            var points = ctrl.scatterchart.getSelectedPoints();
            if (points.length > 0) {
                Highcharts.each(points, function(point) {
                    point.select(false);
                });
            }
            var gridobject = Ext.getCmp("grid" + mapping.object);
            gridobject.getView().getSelectionModel().deselectAll(true);
        }

        //Ajout d'un composant highchart avec des intéractions avec la visualisation de réseau
        ctrl.scatterchart = Highcharts.chart('panelViz', {
            chart: {
                type: 'scatter',
                events: {
                    selection: selectPointsByDrag,
                    // selectedpoints: selectedPoints,
                    click: unselectByClick
                },
                zoomType: 'xy',
                resetZoomButton: {
                    position: {
                        align: 'right', // by default
                        verticalAlign: 'top', // by default
                        x: -10,
                        y: 0
                    },
                    relativeTo: 'chart'
                }
            },
            lang: {
                mapping_node: 'Map selected nodes in table from scatter plot',
                log_axis: ''
            },
            tooltip: {
                formatter: function() {
                    var name = this.point.nodeName != undefined ? 'Name: ' + this.point.nodeName : "";
                    return mapping.object + ' <br>Id: ' + this.point.node + ' <br>' + name + ' <br> Page rank: ' + this.x + ', Chei rank: ' + this.y;
                }
            },
            title: {
                text: mapping.name
            },
            subtitle: {
                text: 'Source: MetExplore'
            },
            xAxis: {
                title: {
                    enabled: true,
                    text: 'MetaboRank Out'
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: "MetaboRank In"
                }
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    }
                },
                series: {
                    stickyTracking: false,
                    allowPointSelect: true,
                    turboThreshold: 0,
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function() {
                                var gridobject = Ext.getCmp("grid" + mapping.object);
                                gridobject.getView().getSelectionModel().deselectAll(true);

                                var selectedPoints = ctrl.scatterchart.getSelectedPoints();;
                                var points = [];

                                var evtobj = window.event ? event : undefined;
                                var ctrlKey = evtobj ? evtobj.ctrlKey : undefined;

                                if (ctrlKey)
                                    points = selectedPoints;

                                var index = selectedPoints.indexOf(this);

                                if (index == -1) {
                                    points.push(this);
                                } else {
                                    points.splice(index, 1);
                                }
                                Highcharts.each(points, function(point, i) {
                                    if (typeof metExploreViz != "undefined") {
                                        var session = metExploreViz.getGlobals().getSessionById('viz');
                                        // if visualisation is actived we add item to menu
                                        if (session != null && session.isActive()) {
                                            metExploreViz.GraphNode.highlightANode(point.node);
                                        }
                                    }

                                    var store_object = Ext.getStore("S_" + mapping.object);

                                    var rec = store_object.findRecord("dbIdentifier",
                                        point.node, 0, false, true, true);

                                    var index = gridobject.getStore().data.items.indexOf(rec);

                                    gridobject.getView().getSelectionModel().select(index, true);
                                });
                            }
                        }
                    }
                }
            },
            exporting: {
                buttons: {
                    customButton: {
                        y: 40,
                        text: 'Axis in log scale',
                        _titleKey: 'log_axis',
                        onclick: function() {
                            if (ctrl.scatterchart.yAxis[0].userOptions.type == 'logarithmic') {
                                ctrl.scatterchart.update({
                                    exporting: {
                                        buttons: {
                                            customButton: {
                                                text: 'Axis in log scale'
                                            }
                                        }
                                    }
                                });

                                ctrl.scatterchart.yAxis[0].update({
                                    type: 'linear',
                                    minorTickInterval: 'auto',
                                    title: {
                                        enabled: true,
                                        text: "MetaboRank In"
                                    }
                                });

                                ctrl.scatterchart.xAxis[0].update({
                                    title: {
                                        enabled: true,
                                        text: "MetaboRank Out"
                                    },
                                    type: 'linear',
                                    minorTickInterval: 'auto'
                                });
                            } else {
                                ctrl.scatterchart.update({
                                    exporting: {
                                        buttons: {
                                            customButton: {
                                                text: 'Axis in linear scale'
                                            }
                                        }
                                    }
                                });
                                ctrl.scatterchart.yAxis[0].update({
                                    title: {
                                        enabled: true,
                                        text: "log(MetaboRank In)"
                                    },
                                    type: 'logarithmic',
                                    minorTickInterval: '0.1'
                                });

                                ctrl.scatterchart.xAxis[0].update({
                                    title: {
                                        enabled: true,
                                        text: "log(MetaboRank Out)"
                                    },
                                    type: 'logarithmic',
                                    minorTickInterval: '0.1'
                                });
                            }
                        }
                    },
                    mapSelectedNodes: {
                        y: 70,
                        x: -25,
                        text: 'Map selected nodes',
                        _titleKey: 'mapping_node',
                        onclick: function() {

                            Ext.suspendLayouts();
                            var selectedPoints = ctrl.scatterchart.getSelectedPoints();
                            var listDBIs = selectedPoints.map(function(point) {
                                return point.node
                            });

                            ctrl.mapEntities(listDBIs, "Selected lines", "Metabolite");
                            Ext.resumeLayouts(true);
                        }
                    }
                }
            },
            series: [{
                name: "Fingerprint",
                data: mappingDataSeeds.map(function(node) {
                    if (node.x <= 0) node.x = minX;
                    if (node.y <= 0) node.y = minY;
                    return node;
                }),
                color: "#004D5A"
            }, {
                name: "Not in fingerprint",
                data: mappingData.map(function(node) {
                    if (node.x <= 0) node.x = minX;
                    if (node.y <= 0) node.y = minY;
                    return node;
                })
            }]
        });


        Ext.getStore("S_" + mapping.object).on("datachanged", function(store, records) {
            ctrl.scatterchart.series[0].update({
                name: "Fingerprint",
                data: mappingDataSeeds.filter(function(node) {
                        return store.getByDBIdentifierFiltered(node.node) != null;
                    })
                    .map(function(node) {
                        if (node.x <= 0) node.x = minX;
                        if (node.y <= 0) node.y = minY;
                        return node;
                    }),
                color: "#004D5A"
            }, false);

            ctrl.scatterchart.series[1].update({
                name: "Not in fingerprint",
                data: mappingData.filter(function(node) {
                        return store.getByDBIdentifierFiltered(node.node) != null;
                    })
                    .map(function(node) {
                        if (node.x <= 0) node.x = minX;
                        if (node.y <= 0) node.y = minY;
                        return node;
                    })
            }, true);

        }, this);

        return true;
    },

    /**
     * Initialisation of scatter plot
     * @param {Object} mapping - Classic MetExplore mapping
     */
    initHeatMap: function(mapping) {
        var ctrl = this;
        //Visualize with inchlib
        //     Ext.getCmp('mappingVizPanel').show();
        //     MetExplore.app.getController('MetExplore.controller.C_MappingVizPanel').initHeatMap({
        //     "column_metadata": {
        //         "features": [
        //             [
        //                 "inactive",
        //                 "active",
        //                 "active",
        //                 "inactive"
        //             ],
        //             [
        //                 "1",
        //                 "2",
        //                 "4",
        //                 "3"
        //             ]
        //         ],
        //             "feature_names": [
        //             "Classification",
        //             "Order"
        //         ]
        //     },
        //     "metadata": {
        //         "nodes": {
        //             "0": [
        //                 "class 1"
        //             ],
        //                 "1": [
        //                 "class 1"
        //             ],
        //                 "2": [
        //                 "class 2"
        //             ],
        //                 "3": [
        //                 "class 2"
        //             ],
        //                 "4": [
        //                 "class 3"
        //             ]
        //         },
        //         "feature_names": [
        //             "class"
        //         ]
        //     },
        //     "data": {
        //         "nodes": {
        //             "0": {
        //                 "count": 1,
        //                     "distance": 0,
        //                     "objects": [
        //                     "1"
        //                 ],
        //                     "features": [
        //                     3.5,
        //                     5.1,
        //                     0.2,
        //                     1.4
        //                 ],
        //                     "parent": 5
        //             },
        //             "1": {
        //                 "count": 1,
        //                     "distance": 0,
        //                     "objects": [
        //                     "2"
        //                 ],
        //                     "features": [
        //                     3.0,
        //                     4.9,
        //                     0.2,
        //                     1.4
        //                 ],
        //                     "parent": 7
        //             },
        //             "2": {
        //                 "count": 1,
        //                     "distance": 0,
        //                     "objects": [
        //                     "3"
        //                 ],
        //                     "features": [
        //                     3.2,
        //                     4.7,
        //                     0.2,
        //                     1.3
        //                 ],
        //                     "parent": 6
        //             },
        //             "3": {
        //                 "count": 1,
        //                     "distance": 0,
        //                     "objects": [
        //                     "4"
        //                 ],
        //                     "features": [
        //                     3.1,
        //                     4.6,
        //                     0.2,
        //                     1.5
        //                 ],
        //                     "parent": 6
        //             },
        //             "4": {
        //                 "count": 1,
        //                     "distance": 0,
        //                     "objects": [
        //                     "5"
        //                 ],
        //                     "features": [
        //                     3.6,
        //                     5.0,
        //                     0.2,
        //                     1.4
        //                 ],
        //                     "parent": 5
        //             },
        //             "5": {
        //                 "count": 2,
        //                     "distance": 0.141,
        //                     "left_child": 0,
        //                     "parent": 8,
        //                     "right_child": 4
        //             },
        //             "6": {
        //                 "count": 2,
        //                     "distance": 0.245,
        //                     "left_child": 2,
        //                     "parent": 7,
        //                     "right_child": 3
        //             },
        //             "7": {
        //                 "count": 3,
        //                     "distance": 0.337,
        //                     "left_child": 1,
        //                     "parent": 8,
        //                     "right_child": 6
        //             },
        //             "8": {
        //                 "count": 5,
        //                     "distance": 0.852,
        //                     "left_child": 5,
        //                     "right_child": 7
        //             }
        //         },
        //         "feature_names": [
        //             "feature 2",
        //             "feature 1",
        //             "feature 4",
        //             "feature 3"
        //         ]
        //     },
        //     "column_dendrogram": {
        //         "nodes": {
        //             "0": {
        //                 "count": 1,
        //                     "distance": 0,
        //                     "parent": 5
        //             },
        //             "1": {
        //                 "count": 1,
        //                     "distance": 0,
        //                     "parent": 5
        //             },
        //             "2": {
        //                 "count": 1,
        //                     "distance": 0,
        //                     "parent": 4
        //             },
        //             "3": {
        //                 "count": 1,
        //                     "distance": 0,
        //                     "parent": 4
        //             },
        //             "4": {
        //                 "count": 2,
        //                     "distance": 2.687,
        //                     "left_child": 2,
        //                     "parent": 6,
        //                     "right_child": 3
        //             },
        //             "5": {
        //                 "count": 2,
        //                     "distance": 3.554,
        //                     "left_child": 0,
        //                     "parent": 6,
        //                     "right_child": 1
        //             },
        //             "6": {
        //                 "count": 4,
        //                     "distance": 10.36,
        //                     "left_child": 4,
        //                     "right_child": 5
        //             }
        //         }
        //     }
        // });
        //     window.inchlib.update_settings({"dendrogram":  true});
        //     // window.inchlib.update_settings({"column_dendrogram":  true})
        //     window.inchlib.draw();


        //sudo python inchlib_clust-0.1.4/inchlib_clust.py sampleMeSH.csv -dh -mh -cmh -cd euclidean -rd euclidean -rl ward -cl ward -a both -dd ","
        // Ext.getCmp('panelViz').doComponentLayout();
        window.inchlib = new InCHlib({ //instantiate InCHlib
            target: "panelViz", //ID of a target HTML element
            metadata: true, //turn on the metadata
            column_metadata: true, //turn on the column metadata
            max_column_width: 40,
            max_row_height: 40,
            min_row_height: 40,
            min_height: 200, //set maximum height of visualization in pixels
            width: 1000, //set width of visualization in pixels
            heatmap_colors: "Blues", //set color scale for clustered data
            metadata_colors: "Greens", //set color scale for metadata
            fixed_row_id_size: 10,
            independent_columns: false,
            draw_row_ids: true
            // highlight_colors: "Greens",
            // highlighted_rows: [20,21,22,23,24,27]
        });
        //
        // console.log(value[0].raw.data)
        // if(value[0].raw.data.length<100){
        //     inchlib.update_settings({"fixed_row_id_size": 6});
        //     inchlib.update_settings({"draw_row_ids": true});
        // }

        inchlib.selectedMetabolites = {};
        inchlib.pubmedURL = "https://www.ncbi.nlm.nih.gov/pubmed?term=";

        inchlib.events.column_dendrogram_node_highlight = function(column_indexes, node_id) {
            console.log("column_dendrogram_node_highlight");
        };

        inchlib.events.column_dendrogram_node_onclick = function(column_indexes, node_id, evt) {
            console.log("column_dendrogram_node_onclick");
        };

        inchlib.events.column_dendrogram_node_onclick = function(column_indexes, node_id, evt) {
            console.log("column_dendrogram_node_onclick");
        };

        inchlib.events.column_dendrogram_node_unhighlight = function(node_id) {
            console.log("column_dendrogram_node_unhighlight");
        };

        inchlib.events.dendrogram_node_highlight = function(object_ids, node_id) {
            console.log("dendrogram_node_highlight");
        };

        inchlib.events.dendrogram_node_onclick = function(object_ids, node_id, evt) {
            console.log("dendrogram_node_onclick");
        };

        inchlib.events.dendrogram_node_unhighlight = function(node_id) {
            console.log("dendrogram_node_unhighlight");
        };

        inchlib.events.empty_space_onclick = function(evt) {
            console.log("empty_space_onclick");

            var r = inchlib.colors[inchlib.settings.heatmap_colors]["end"]["r"];
            var g = inchlib.colors[inchlib.settings.heatmap_colors]["end"]["g"];
            var b = inchlib.colors[inchlib.settings.heatmap_colors]["end"]["b"];
            var stroke = "rgb(" + r + ", " + g + ", " + b + ")";

            Object.keys(inchlib.selectedMetabolites).forEach(function(met) {
                inchlib.selectedMetabolites[met]["layer"].forEach(function(layer) {
                    layer.setAttrs({
                        "stroke": stroke
                    });
                    layer.parent.draw()
                });
            });

            var icon = inchlib.navigation_layer.find("#pubmedarticles_icon")[0];
            icon.hide();
            icon.parent.draw();
            inchlib.selectedMetabolites = {};
        };

        inchlib.events.heatmap_onmouseout = function(evt) {
            console.log("heatmap_onmouseout");
        };

        inchlib.events.on_columns_unzoom = function(node_id) {
            console.log("n_columns_unzoom");
        };

        inchlib.events.on_columns_zoom = function(column_indexes, node_id) {
            console.log("on_columns_zoom");
        };

        inchlib.events.on_refresh = function() {
            console.log("on_refresh");
        }

        inchlib.events.on_unzoom = function(node_id) {
            console.log("on_unzoom");
        };

        inchlib.events.on_zoom = function(object_ids, node_id) {
            console.log("on_zoom");
        };

        inchlib.events.headrow_onclick = function(object_ids, event) {
            console.log("headrow_onclick");
            console.log("TODO : Selection of all metabolites assciated with this MeSH & Information on the MeSH" +
                "Pathway enrichment on each MeSH?");
            var win_InfoPubMed = Ext.create('MetExplore.view.window.V_WindowInfoPubMed', {
                mesh: object_ids.partialText,
                pubmedAnalysis: mapping.data.pubmed
            });
            win_InfoPubMed.show();
            win_InfoPubMed.focus();
        };

        inchlib.events.sort_onclick = function clickSort() {
            window.inchlib.update_settings({
                "dendrogram": false
            });
            window.inchlib.draw();
        };

        inchlib.events.unsort_onclick = function clickUnSort() {
            window.inchlib.update_settings({
                "dendrogram": true
            });
            window.inchlib.update_settings({
                "column_dendrogram": true
            });
            window.inchlib.draw();
        };

        inchlib.events.andpubmedarticles_onclick = function clickSort() {
            ctrl.createAndLaunchURL("AND");
        };

        inchlib.events.orpubmedarticles_onclick = function clickUnSort() {
            ctrl.createAndLaunchURL("OR");
        };

        inchlib.events.headcol_onclick = function(object_ids, node_id) {
            console.log("headcol_onclick");

            // console.log("https://www.ncbi.nlm.nih.gov/pubmed/?term=%22" + object_ids.partialText + "%22%5BMesh+Terms%5D");
            // console.log(object_ids);
            // console.log(object_ids.partialText);
            var gridMetabolite = Ext.getCmp("gridMetabolite");
            var storesMetabolites = Ext.getStore('S_Metabolite');

            var record = storesMetabolites.getByName(object_ids.partialText);
            if (record) {
                storesMetabolites.remove(record, true);
                storesMetabolites.insert(0, record);

                // On garde les selection prédédente si ce n'est pas le premier métabolite sélectionné
                gridMetabolite.getView().getSelectionModel().select(record);

                var win_InfoPubMed = Ext.create('MetExplore.view.window.V_WindowInfoPubMed', {
                    metabolite: record,
                    pubmedAnalysis: mapping.data.pubmed
                });
                win_InfoPubMed.show();
                win_InfoPubMed.focus();

            }
        };

        // Display score, metabolite, MeSH and articles
        inchlib.events.row_onclick = function(object_ids, evt) {

            console.log("row_onclick");

            var name = inchlib.data.feature_names[evt.target.attrs.column.substr(2)];
            var gridMetabolite = Ext.getCmp("gridMetabolite");
            var storesMetabolites = Ext.getStore("S_Metabolite");
            var selectedMetabolite = storesMetabolites.getByName(name);
            // console.log(selectedMetabolite);
            if (selectedMetabolite) {

                storesMetabolites.remove(selectedMetabolite, true);
                storesMetabolites.insert(0, selectedMetabolite);

                // On garde les selection prédédente si ce n'est pas le premier métabolite sélectionné
                gridMetabolite.getView().getSelectionModel().select(selectedMetabolite);

                var win_InfoPubMed = Ext.create('MetExplore.view.window.V_WindowInfoPubMed', {
                    metabolite: selectedMetabolite,
                    pubmedAnalysis: mapping.data.pubmed,
                    mesh: object_ids[0]
                });
                win_InfoPubMed.show();
                win_InfoPubMed.focus();
            }
        };

        inchlib.events.row_onclickAndCtrlKey = function(object_ids, evt) {
            console.log("row_onclickAndCtrlKey");

            var name = inchlib.data.feature_names[evt.target.attrs.column.substr(2)];

            var storesMetabolites = Ext.getStore("S_Metabolite");
            var selectedMetabolite = storesMetabolites.getByName(name);
            var targetLayer = evt.target;
            if (Object.keys(inchlib.selectedMetabolites).length > 0) {
                var icon = inchlib.navigation_layer.find("#pubmedarticles_icon")[0];
                icon.show();
                icon.parent.draw();
            }

            if (selectedMetabolite &&
                targetLayer.attrs.column.charAt(0) === "d" &&
                targetLayer.attrs.value === 1) {

                targetLayer.setAttrs({
                    "stroke": "rgb(231, 77, 64)"
                });
                targetLayer.parent.draw();

                var themetab = mapping.data.pubmed.metabolites.find(function(met) {
                    return name === met.name;
                });

                if (!Object.keys(inchlib.selectedMetabolites).includes(themetab.iupac)) {

                    inchlib.selectedMetabolites[themetab.iupac] = {
                        "layer": [targetLayer],
                        "meshs": [object_ids[0]]
                    };
                } else {
                    inchlib.selectedMetabolites[themetab.iupac]["layer"].push(targetLayer);
                    inchlib.selectedMetabolites[themetab.iupac]["meshs"].push(object_ids[0]);
                }
            }
        };



        // window.dendrogram = new InCHlib({
        //     "images_path":
        //         {
        //             "ext": ".svg",
        //             "dir": "/software/inchlib/static/img/fragments/"
        //         },
        //     "target": "dendrogram",
        //     "max_column_width": 60.0,
        //     "min_row_height": 30.0,
        //     "images_as_alternative_data": true,
        //     "alternative_data": true,
        //     "navigation_toggle": {
        //         "distance_scale": false,
        //         "hint_button": false,
        //         "color_scale": false
        //     },
        //     "draw_row_ids": true,
        //     "metadata_colors": "BuWhRd"
        // });

        // Choisir les données à afficher pvalue foldchange...
        inchlib.read_data(mapping.data.meSHFromMetab4InCHlib); //read input json file
        inchlib.draw(); //draw cluster heatmap

        return true;
    },



    /**
     * Create and launch url to see articles from Mesh and metabolites
     */
    createAndLaunchURL: function(liaison) {
        var url = inchlib.pubmedURL;
        Object.keys(inchlib.selectedMetabolites).forEach(function(met) {
            inchlib.selectedMetabolites[met]["meshs"].forEach(function(mesh) {
                url += "(" + met + " AND " + mesh + "[MeSH Term]" + ")";
                if (inchlib.selectedMetabolites[met]["meshs"].indexOf(mesh) !== inchlib.selectedMetabolites[met]["meshs"].length - 1)
                    url += " " + liaison + " ";
            });
            if (Object.keys(inchlib.selectedMetabolites).indexOf(met) !== Object.keys(inchlib.selectedMetabolites).length - 1)
                url += " " + liaison + " ";
        });
        var finalurl = url.split(' ').join('+');
        window.open(finalurl, '_blank');
    },

    /**
     * Get metabolite name from store
     * @param {String} dbid - metabolite dbid
     */
    getMetaboliteName: function(dbid) {
        var storeMetabolite = Ext.getStore('S_Metabolite');
        var metabolite = storeMetabolite.getByDBIdentifier(dbid);
        var name = undefined;
        if (metabolite)
            name = metabolite.data.name;
        return name;
    },

    onExpand: function(panel) {
        panel.setTitle('');
        if (Ext.getCmp('newElement')) {
            Ext.getCmp('newElement').doComponentLayout();
        }
    }

    // changePointColorForNodeInVisualisation:function(scatterchart){
    //    MetExploreViz.onloadMetExploreViz(function () {
    //        metExploreViz.onloadSession(function () {
    //            var session = metExploreViz.getGlobals().getSessionById('viz');
    //            var metabolites = session.getD3Data().getNodes().filter(function (node) {
    //                return node.getBiologicalType() == "metabolite";
    //            });
    //            var listOfDBIdentifier = metabolites.map(function (node) {
    //                return node.getDbIdentifier();
    //            });
    //            scatterchart.series[0].data.forEach(function (point) {
    //                if(listOfDBIdentifier.indexOf(point.node)!=-1) {
    //                    point.color = "#004D5A";
    //                    point.firePointEvent('mouseOver')
    //                    // point.update({ x:point.x, y:point.y, node:point.node, color:"#004D5A"});
    //                }
    //            });
    //        });
    //    });
    // }
});