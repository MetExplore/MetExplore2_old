/**
 * C_Cytotmp
 */
Ext.define('MetExplore.controller.C_Cytotmp', {
    extend: 'Ext.app.Controller',


    config: {
        views: ['grid.V_gridCart']
        //stores: ['S_CurrentUser']
    },

    init: function() {

        cyto = true;
        win = false;


        this.control({
            'gridCart button[action=graph]': {
                click: this.createCytoWindow
            }

        });
    },

    createCytoWindow: function() {
        //-----------------------------------------------
        //---------Window Creation if first click--------
        //-----------------------------------------------
        if (!win) {
            win = Ext.create('MetExplore.view.V_CytoWindow');
            win.show();
            //-----------------------------------------------
            //-------Cytoscape Creation if first click-------
            //-----------------------------------------------
            if (cyto) {
                this.cytoVisu();
                cyto = false;
            }
        }
        //-----------------------------------------------
        //-------Creation controler if move window-------
        //-----------------------------------------------
        win.on('move', function() {
            console.log("ddd", arguments);
            try {
                cy.center();
                cy.fit();
            } catch (err) {
                console.log('peux pas centrer pour le moment')
            }
        });
        //-----------------------------------------------
        //------Creation controler if resize window------
        //-----------------------------------------------
        win.on('resize', function(panel, w, h) {
            console.log('Panel resized to ' + w + 'x' + h);
            try {
                cy.center();
                cy.fit();
            } catch (err) {
                console.log('peux pas centrer pour le moment')
            }
        });
    },

    cytoVisu: function() {
        cy = $("#cy").cytoscape({
                elements: {
                    "nodes": [{
                        "classes": "b",
                        "data": {
                            "id": "n0",
                            "weight": 40
                        }
                    }, {
                        "classes": "b",
                        "data": {
                            "id": "n1",
                            "weight": 19
                        }
                    }, {
                        "classes": "c",
                        "data": {
                            "id": "n2",
                            "weight": 0
                        }
                    }, {
                        "classes": "d",
                        "data": {
                            "id": "n3",
                            "weight": 19
                        }
                    }, {
                        "classes": "e",
                        "data": {
                            "id": "n4",
                            "weight": 4
                        }
                    }, {
                        "classes": "a",
                        "data": {
                            "id": "n5",
                            "weight": 21
                        }
                    }, {
                        "classes": "e",
                        "data": {
                            "id": "n6",
                            "weight": 13
                        }
                    }, {
                        "classes": "a",
                        "data": {
                            "id": "n7",
                            "weight": 6
                        }
                    }, {
                        "classes": "a",
                        "data": {
                            "id": "n8",
                            "weight": 10
                        }
                    }, {
                        "classes": "b",
                        "data": {
                            "id": "n9",
                            "weight": 6
                        }
                    }, {
                        "classes": "c",
                        "data": {
                            "id": "n10",
                            "weight": 24
                        }
                    }, {
                        "classes": "c",
                        "data": {
                            "id": "n11",
                            "weight": 14
                        }
                    }, {
                        "classes": "e",
                        "data": {
                            "id": "n12",
                            "weight": 11
                        }
                    }, {
                        "classes": "b",
                        "data": {
                            "id": "n13",
                            "weight": 6
                        }
                    }, {
                        "classes": "e",
                        "data": {
                            "id": "n14",
                            "weight": 24
                        }
                    }, {
                        "classes": "b",
                        "data": {
                            "id": "n15",
                            "weight": 26
                        }
                    }, {
                        "classes": "b",
                        "data": {
                            "id": "n16",
                            "weight": 6
                        }
                    }, {
                        "classes": "c",
                        "data": {
                            "id": "n17",
                            "weight": 36
                        }
                    }, {
                        "classes": "a",
                        "data": {
                            "id": "n18",
                            "weight": 7
                        }
                    }, {
                        "classes": "b",
                        "data": {
                            "id": "n19",
                            "weight": 37
                        }
                    }, {
                        "classes": "c",
                        "data": {
                            "id": "n20",
                            "weight": 28
                        }
                    }, {
                        "classes": "d",
                        "data": {
                            "id": "n21",
                            "weight": 11
                        }
                    }, {
                        "classes": "d",
                        "data": {
                            "id": "n22",
                            "weight": 20
                        }
                    }, {
                        "classes": "e",
                        "data": {
                            "id": "n23",
                            "weight": 7
                        }
                    }, {
                        "classes": "b",
                        "data": {
                            "id": "n24",
                            "weight": 31
                        }
                    }, {
                        "classes": "b",
                        "data": {
                            "id": "n25",
                            "weight": 1
                        }
                    }, {
                        "classes": "e",
                        "data": {
                            "id": "n26",
                            "weight": 29
                        }
                    }, {
                        "classes": "d",
                        "data": {
                            "id": "n27",
                            "weight": 31
                        }
                    }, {
                        "classes": "d",
                        "data": {
                            "id": "n28",
                            "weight": 34
                        }
                    }, {
                        "classes": "b",
                        "data": {
                            "id": "n29",
                            "weight": 40
                        }
                    }, {
                        "classes": "d",
                        "data": {
                            "id": "n30",
                            "weight": 38
                        }
                    }, {
                        "classes": "b",
                        "data": {
                            "id": "n31",
                            "weight": 17
                        }
                    }, {
                        "classes": "a",
                        "data": {
                            "id": "n32",
                            "weight": 39
                        }
                    }, {
                        "classes": "d",
                        "data": {
                            "id": "n33",
                            "weight": 4
                        }
                    }, {
                        "classes": "c",
                        "data": {
                            "id": "n34",
                            "weight": 38
                        }
                    }, {
                        "classes": "d",
                        "data": {
                            "id": "n35",
                            "weight": 13
                        }
                    }, {
                        "classes": "b",
                        "data": {
                            "id": "n36",
                            "weight": 15
                        }
                    }, {
                        "classes": "a",
                        "data": {
                            "id": "n37",
                            "weight": 29
                        }
                    }, {
                        "classes": "a",
                        "data": {
                            "id": "n38",
                            "weight": 2
                        }
                    }, {
                        "classes": "d",
                        "data": {
                            "id": "n39",
                            "weight": 35
                        }
                    }, {
                        "classes": "c",
                        "data": {
                            "id": "n40",
                            "weight": 24
                        }
                    }, {
                        "classes": "c",
                        "data": {
                            "id": "n41",
                            "weight": 7
                        }
                    }, {
                        "classes": "e",
                        "data": {
                            "id": "n42",
                            "weight": 24
                        }
                    }, {
                        "classes": "c",
                        "data": {
                            "id": "n43",
                            "weight": 4
                        }
                    }, {
                        "classes": "d",
                        "data": {
                            "id": "n44",
                            "weight": 40
                        }
                    }, {
                        "classes": "a",
                        "data": {
                            "id": "n45",
                            "weight": 19
                        }
                    }, {
                        "classes": "b",
                        "data": {
                            "id": "n46",
                            "weight": 17
                        }
                    }, {
                        "classes": "b",
                        "data": {
                            "id": "n47",
                            "weight": 36
                        }
                    }, {
                        "classes": "b",
                        "data": {
                            "id": "n48",
                            "weight": 26
                        }
                    }, {
                        "classes": "a",
                        "data": {
                            "id": "n49",
                            "weight": 18
                        }
                    }],
                    "edges": [{
                        "data": {
                            "source": "n5",
                            "id": "e0",
                            "weight": 31,
                            "target": "n19"
                        }
                    }, {
                        "data": {
                            "source": "n37",
                            "id": "e1",
                            "weight": 31,
                            "target": "n25"
                        }
                    }, {
                        "data": {
                            "source": "n19",
                            "id": "e2",
                            "weight": 31,
                            "target": "n2"
                        }
                    }, {
                        "data": {
                            "source": "n16",
                            "id": "e3",
                            "weight": 23,
                            "target": "n27"
                        }
                    }, {
                        "data": {
                            "source": "n29",
                            "id": "e4",
                            "weight": 17,
                            "target": "n4"
                        }
                    }, {
                        "data": {
                            "source": "n1",
                            "id": "e5",
                            "weight": 33,
                            "target": "n12"
                        }
                    }, {
                        "data": {
                            "source": "n13",
                            "id": "e6",
                            "weight": 38,
                            "target": "n33"
                        }
                    }, {
                        "data": {
                            "source": "n12",
                            "id": "e7",
                            "weight": 34,
                            "target": "n4"
                        }
                    }, {
                        "data": {
                            "source": "n32",
                            "id": "e8",
                            "weight": 34,
                            "target": "n13"
                        }
                    }, {
                        "data": {
                            "source": "n44",
                            "id": "e9",
                            "weight": 32,
                            "target": "n19"
                        }
                    }, {
                        "data": {
                            "source": "n31",
                            "id": "e10",
                            "weight": 24,
                            "target": "n19"
                        }
                    }, {
                        "data": {
                            "source": "n35",
                            "id": "e11",
                            "weight": 18,
                            "target": "n48"
                        }
                    }, {
                        "data": {
                            "source": "n25",
                            "id": "e12",
                            "weight": 19,
                            "target": "n15"
                        }
                    }, {
                        "data": {
                            "source": "n31",
                            "id": "e13",
                            "weight": 18,
                            "target": "n16"
                        }
                    }, {
                        "data": {
                            "source": "n24",
                            "id": "e14",
                            "weight": 39,
                            "target": "n27"
                        }
                    }, {
                        "data": {
                            "source": "n47",
                            "id": "e15",
                            "weight": 22,
                            "target": "n3"
                        }
                    }, {
                        "data": {
                            "source": "n1",
                            "id": "e16",
                            "weight": 34,
                            "target": "n35"
                        }
                    }, {
                        "data": {
                            "source": "n22",
                            "id": "e17",
                            "weight": 15,
                            "target": "n5"
                        }
                    }, {
                        "data": {
                            "source": "n37",
                            "id": "e18",
                            "weight": 40,
                            "target": "n10"
                        }
                    }, {
                        "data": {
                            "source": "n37",
                            "id": "e19",
                            "weight": 21,
                            "target": "n29"
                        }
                    }]
                },
                layout: {
                    name: "arbor",
                    fit: true
                }

            })
            .css("background", "white")
            .css("width", "100%")
            .css("height", "100%")

            .cytoscape("get");


        //la fonction fit ne fonctionne pas, elle bloque l'interaction (click) avec cytoscape.
        //cy.fit();
        cy.center();
        //cy.nodes().bind("mouseover", function(e){console.log(e)})

        /*cy.bind('click', 'node', function(e){
            console.log(e.cyTarget._private.ids);
        });*/
        cy.bind('click', 'edge', {
            foo: 'bar'
        }, function(evt) {
            console.log(evt.data.foo); // 'bar'
            var edge = this;
            console.log('clicked ' + edge.id());
        });

        cy.bind('click', 'node', {
            foo: 'bar'
        }, function(evt) {
            console.log(evt.data.foo); // 'bar'
            var node = this;
            node.css("background-color", "#CCFFCC");
            console.log('clicked ' + node.id());
        });
        //cy.fit();

    },


    addNode: function() {
        var eles = cy.add([{
            group: "nodes",
            data: {
                id: "n50"
            },
            position: {
                x: 300,
                y: 300
            }
        }])
    },

    addEdge: function() {
        var eles = cy.add([{
            group: "edges",
            data: {
                id: "e30",
                source: "n50",
                target: "n49"
            }
        }])
    }


});