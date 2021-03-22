/**
 * C_panelVizGPR
 * Controls paint panelVizGPR events.
 */
Ext.define('MetExplore.controller.windowInfo.C_PanelVizGPR', {
    extend: 'Ext.app.Controller',

    requires: ['MetExplore.globals.GraphObjects'],

    config: {
        views: ['panel.V_panelVizGPR', 'window.V_WindowInfoReaction']
    },

    voteButtons: ["objectExists", "objectNotExists", "objectNoIdea", "objectHasErrors"],

    init: function() {
        this.control({
            'panelVizGPR': {
                expand: this.expandPanel,
                resize: this.resizePanel
            },
            'panelVizGPR button[action="refresh"]': {
                click: this.refreshDraw
            },
            'panelVizGPR button[action="showHideLegend"]': {
                toggle: this.showHideLegend
            },
            'panelVizGPR button[action="stopForce"]': {
                click: this.stopForce
            }
            /*'panelVizGPR button[action="saveSVG"]':{
            	click:this.saveSvg
            }*/
        });

    },

    expandPanel: function(component, eOpts) {

        //Draw if data is ready:
        if (component.up("windowInfoReaction").graphDataLoaded && !component.loaded) {
            component.loaded = true;
            this.drawGraph(component);
        }
    },

    refreshDraw: function(button) {
        d3.selectAll(".node").each(
            function(d) {
                d.fixed = false;
            }
        );
        var component = button.up("panelVizGPR");
        this.drawGraph(component);
        if (component.down('button[action="showHideLegend"]').pressed) {
            this.drawLegend(component);
        }
    },

    resizePanel: function(component, width, height, oldWidth, oldHeight, eOpts) {
        if (component.up("windowInfoReaction").graphDataLoaded && component.loaded) {
            this.drawGraph(component);
            if (component.down('button[action="showHideLegend"]').pressed) {
                this.drawLegend(component);
            }
        }
    },

    drawGraph: function(component) {

        var ctrl = this;

        //Remove svg if it exist:
        d3.select("#" + component.id + "-body").select("svg")
            .remove();

        var width = component.getWidth(),
            height = component.getHeight() - 55; //We have to minus 55 to have the true height
        var graph = component.up("windowInfoReaction").graph;

        var viz = d3.select("#" + component.id + "-body");
        viz = viz
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("class", "D3VizReact");

        //var color = d3.scale.category20();

        if (graph.nodes.length < 50) {

            var force = d3.layout.force()
                .charge(-300)
                //.gravity(0.5)
                .linkDistance(0.00082 * (width * height))
                .size([width, height]);

            force
                .nodes(graph.nodes)
                .links(graph.links)
                .start();

            var link = viz.selectAll(".link")
                .data(graph.links)
                .enter().append("line")
                .attr("stroke", "#999")
                .style("stroke-width", function(d) {
                    return Math.sqrt(d.value);
                });

            var node = viz.selectAll("g.node")
                .data(graph.nodes)
                .enter().append("svg:g")
                .attr("class", "node")
                .call(force.drag);

            //PROTEINS:
            var proteins = node.filter(function(d) {
                return d.group == "protein"
            });
            var secProt1 = MetExplore.globals.GraphObjects.protein(proteins.filter(function(d) {
                return d.main == 1
            }), "(-10,-10)");
            secProt1
                .on("dblclick", function(d) {
                    ctrl.showWindowInfo(d, "Protein")
                });
            var secProt0 = MetExplore.globals.GraphObjects.protein(proteins.filter(function(d) {
                return d.main == 0
            }), "(-10,-10)", true);
            secProt0
                .on("dblclick", function(d) {
                    ctrl.showWindowInfo(d, "Protein")
                });

            //ENZYMATIC COMPLEXES:
            var enzComplexes = node.filter(function(d) {
                return d.group == "enzyme"
            });
            var secEnz1 = MetExplore.globals.GraphObjects.enzymaticComplex(enzComplexes.filter(function(d) {
                return d.main == 1
            }), -12.5, -10);
            secEnz1
                .on("dblclick", function(d) {
                    ctrl.showWindowInfo(d, "Enzyme")
                });
            var secEnz0 = MetExplore.globals.GraphObjects.enzymaticComplex(enzComplexes.filter(function(d) {
                return d.main == 0
            }), -12.5, -10, true);
            secEnz0
                .on("dblclick", function(d) {
                    ctrl.showWindowInfo(d, "Enzyme")
                });

            //GENES:
            var genes = node.filter(function(d) {
                return d.group == "gene"
            });
            var secGene1 = MetExplore.globals.GraphObjects.gene(genes.filter(function(d) {
                return d.main == 1
            }), "(-10,-10)");
            secGene1
                .on("dblclick", function(d) {
                    ctrl.showWindowInfo(d, "Gene")
                });
            var secGene0 = MetExplore.globals.GraphObjects.gene(genes.filter(function(d) {
                return d.main == 0
            }), "(-10,-10)", true);
            secGene0
                .on("dblclick", function(d) {
                    ctrl.showWindowInfo(d, "Gene")
                });

            //REACTIONS:
            var reactions = node.filter(function(d) {
                return d.group == "reaction"
            });
            MetExplore.globals.GraphObjects.reaction(reactions.filter(function(d) {
                return d.main == 1
            }), "(-12.5,-7.5)");
            var secReact = MetExplore.globals.GraphObjects.reaction(reactions.filter(function(d) {
                return d.main == 0
            }), "(-12.5,-7.5)", true);
            secReact
                .on("dblclick", function(d) {
                    ctrl.showWindowInfo(d, "Reaction")
                });

            //LABELS:
            node.append("text")
                .text(function(d) {
                    return d.identifier;
                })
                .attr("style", "font-size:9pt; stroke: black; stroke-width: 0px;")
                .attr("transform", "translate(-10,-10)");

            node.append("title")
                .text(function(d) {
                    return d.name;
                });

            force.on("tick", function(e) {

                link.attr("x1", function(d) {
                        return Math.max(10, Math.min(width - 10, d.source.x));
                    })
                    .attr("y1", function(d) {
                        return Math.max(20, Math.min(height - 10, d.source.y));
                    })
                    .attr("x2", function(d) {
                        return Math.max(10, Math.min(width - 10, d.target.x));
                    })
                    .attr("y2", function(d) {
                        return Math.max(20, Math.min(height - 10, d.target.y));
                    });

                node.attr("cx", function(d) {
                        return Math.max(10, Math.min(width - 10, d.x));
                    })
                    .attr("cy", function(d) {
                        Math.max(20, Math.min(height - 10, d.y));
                    })
                    .attr("transform", function(d) {
                        return "translate(" +
                            Math.max(10, Math.min(width - 10, d.x)) + "," +
                            Math.max(20, Math.min(height - 10, d.y)) + ")"
                    });
            });
        } else {
            //If there are too nodes, show a summary instead of draw graph:
            var summary = viz.append("svg:g")
                .attr("class", "summaryGPR");

            summary.append('text')
                .text("There are too many nodes to draw them.")
                .attr("transform", "translate(5,15)");

            summary.append('text')
                .text("Summary:")
                .attr("style", "font-weight: bold")
                .attr("transform", "translate(5,45)");

            var nbGenes = graph.counts.genes;
            summary.append('text')
                .text(nbGenes + (nbGenes > 1 ? " genes," : " gene,"))
                .attr("transform", "translate(20,65)")
                .attr("fill", nbGenes > 10 ? "red" : "black");

            var nbProts = graph.counts.proteins;
            summary.append('text')
                .text(nbProts + (nbProts > 1 ? " proteins," : " protein,"))
                .attr("transform", "translate(20,85)")
                .attr("fill", nbProts > 10 ? "red" : "black");

            var nbEnz = graph.counts.enzymes;
            summary.append('text')
                .text(nbEnz + (nbEnz > 1 ? " enzymatic complexes," : " enzymatic complex,"))
                .attr("transform", "translate(20,105)")
                .attr("fill", nbEnz > 10 ? "red" : "black");

            var nbReact = graph.counts.reactions;
            summary.append('text')
                .text(nbReact + (nbReact > 1 ? " reations." : " reaction."))
                .attr("transform", "translate(20,125)")
                .attr("fill", nbReact > 10 ? "red" : "black");
        }
    },

    showWindowInfo: function(d, type) {
        if ((type != "Gene" && type != "Enzyme" && type != "Protein") || MetExplore.globals.Session.publicBioSource == false) {
            //We do not show the window for these objects if the BioSource is public (as thzy not contain any public component for now)
            if (d.id != undefined) {
                //Get corresponding record on store:
                var storeObj = Ext.getStore("S_" + type);
                var index = storeObj.find('id', d.id);
                if (index > -1) {
                    //Open windowInfo of the corresponding gene:
                    var win_InfoObj = Ext.create('MetExplore.view.window.V_WindowInfo' + type, {
                        rec: storeObj.getAt(index)
                    });
                    win_InfoObj.show();
                    win_InfoObj.focus();
                } else {
                    Ext.MessageBox.alert("Not found", "Object not found!");
                }
            }
        }
    },

    showHideLegend: function(button) {
        var panel = button.up("panelVizGPR");
        if (button.pressed) {
            this.drawLegend(panel);
            panel.showLegend = true;
        } else {
            this.hideLegend(panel);
            panel.showLegend = false;
        }
    },

    drawLegend: function(component) {
        var width = component.getWidth(),
            height = component.getHeight();

        var viz = d3.select("#" + component.id + "-body").select("svg")
            .append("g")
            .attr("class", "legend");

        //Background:
        viz.append("rect")
            .attr("width", 152)
            .attr("height", 122)
            .attr("fill", "white")
            .attr("opacity", 0.7);

        //Genes:
        MetExplore.globals.GraphObjects.gene(viz, "(5,5)");
        viz.append("text")
            .text("Genes")
            .attr("style", "font-size:9pt; stroke: black; stroke-width: 0px;")
            .attr("transform", "translate(35,20)");

        //Proteins:
        MetExplore.globals.GraphObjects.protein(viz, "(5,30)");
        viz.append("text")
            .text("Proteins")
            .attr("style", "font-size:9pt; stroke: black; stroke-width: 0px;")
            .attr("transform", "translate(35,45)");

        //Enzymatic complexes:
        MetExplore.globals.GraphObjects.enzymaticComplex(viz, 5, 55);
        viz.append("text")
            .text("Enzymatic complexes")
            .attr("style", "font-size:9pt; stroke: black; stroke-width: 0px;")
            .attr("transform", "translate(35,70)");

        //This Reaction:
        MetExplore.globals.GraphObjects.reaction(viz, "(5,80)");
        viz.append("text")
            .text("This reaction")
            .attr("style", "font-size:9pt; stroke: black; stroke-width: 0px;")
            .attr("transform", "translate(35,92)");

        //Other reactions:
        MetExplore.globals.GraphObjects.reaction(viz, "(5,105)", true);
        viz.append("text")
            .text("Other reactions")
            .attr("style", "font-size:9pt; stroke: black; stroke-width: 0px;")
            .attr("transform", "translate(35,116)");

    },

    hideLegend: function(component) {
        d3.select("#" + component.id + "-body").select("svg").select("g.legend").remove();
    },

    stopForce: function(button) {
        var component = button.up('panelVizGPR');
        d3.select("#" + component.id + "-body").selectAll(".node").each(
            function(d) {
                d.fixed = true;
            }
        )

    }

    /*saveSvg: function(button) {
    	var e = document.createElement('script'); 
    	e.setAttribute('src', 'lib/javascript/svg-crowbar-2.js/svg-crowbar-2.js'); 
    	e.setAttribute('class', 'svg-crowbar'); 
    	document.body.appendChild(e);
    }*/

});