Ext.define('MetExplore.controller.C_treeFilter', {
    extend: 'Ext.app.Controller',


    config: {
        views: ['tree.V_treeFilter']
    },
    requires: ['MetExplore.globals.Session'],

    init: function() {
        this.control({
            'treeFilter': {
                itemclick: this.refreshChecked,
                ApplyFilters: this.GenerateJson
            },
            'treeFilter dataview': {
                beforedrop: this.customDrop
            },
            'treeFilter button[action=apllyFilters]': {
                click: this.GenerateJson
            },
            'treeFilter button[action=clear]': {
                click: this.Clear
            }
        });
    },


    refreshChecked: function(view, rec) {
        if (rec.get('id') !== "filtersSrc") {
            rec.set('checked', !rec.get('checked'));

            if (!rec.get('leaf')) {
                rec.eachChild(function(child) {
                    child.set('checked', rec.get('checked'));
                });
            } else {
                var parent = rec.parentNode;

                var hasChildChecked = false;
                parent.eachChild(function(child) {
                    if (child.get('checked')) {
                        hasChildChecked = true;
                        return false;
                    }
                });
                parent.set('checked', hasChildChecked);

            }

        }
    },


    customDrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {


        var selection = [];


        data.records.forEach(function(rec) {
            var selected = {
                text: rec.get('dbIdentifier') + " (" + rec.get('name') + ")",
                id: rec.get('id'),
                checked: true,
                leaf: true
            };
            selection.push(selected);
        });

        this.AddDataToTree(selection);

        return false;
    },


    AddDataToTree: function(selection) {

        var treepanel = Ext.getCmp('treeFilter');
        treepanel.expand();
        var root = treepanel.getRootNode();

        root.expand(true);

        var panel = Ext.getCmp('networkData');
        var tabPanel = panel.getActiveTab();
        var indexPanel = panel.items.indexOf(tabPanel);


        switch (indexPanel) {
            case 1:
                var compartNode = root.findChild("id", '1');
                if (compartNode === null) {
                    root.insertChild(0, {
                        text: 'Compartment',
                        id: '1',
                        checked: true,
                        expanded: true
                    });
                    compartNode = root.findChild("id", '1');
                }

                selection.forEach(function(element, index, array) {
                    var child = compartNode.findChild("id", element.id);
                    if (child === null) {
                        compartNode.appendChild(element);
                    }
                });

                break;
            case 2:
                var pathwayNode = root.findChild("id", '2');
                if (pathwayNode === null) {
                    root.insertChild(1, {
                        text: 'Pathway',
                        id: '2',
                        checked: true,
                        expanded: true
                    });
                    pathwayNode = root.findChild("id", '2');
                }

                selection.forEach(function(element, index, array) {
                    var child = pathwayNode.findChild("id", element.id);
                    if (child === null) {
                        pathwayNode.appendChild(element);
                    }
                });

                break;
            case 3:
                var reactionNode = root.findChild("id", '3');
                if (reactionNode === null) {
                    root.insertChild(2, {
                        text: 'Reaction',
                        id: '3',
                        checked: true,
                        expanded: true
                    });
                    reactionNode = root.findChild("id", '3');
                }

                selection.forEach(function(element, index, array) {
                    var child = reactionNode.findChild("id", element.id);
                    if (child === null) {
                        reactionNode.appendChild(element);
                    }
                });

                break;
            case 4:
                var metaboliteNode = root.findChild("id", '4');
                if (metaboliteNode === null) {
                    root.insertChild(3, {
                        text: 'Metabolite',
                        id: '4',
                        checked: true,
                        expanded: true
                    });
                    metaboliteNode = root.findChild("id", '4');
                }

                selection.forEach(function(element, index, array) {
                    var child = metaboliteNode.findChild("id", element.id);
                    if (child === null) {
                        metaboliteNode.appendChild(element);
                    }
                });

                break;
            case 5:
                var enzymeNode = root.findChild("id", '5');
                if (enzymeNode === null) {
                    root.insertChild(4, {
                        text: 'Enzyme',
                        id: '5',
                        checked: true,
                        expanded: true
                    });
                    enzymeNode = root.findChild("id", '5');
                }

                selection.forEach(function(element, index, array) {
                    var child = enzymeNode.findChild("id", element.id);
                    if (child === null) {
                        enzymeNode.appendChild(element);
                    }
                });

                break;
            case 6:
                var proteinNode = root.findChild("id", '6');
                if (proteinNode === null) {
                    root.insertChild(5, {
                        text: 'Protein',
                        id: '6',
                        checked: true,
                        expanded: true
                    });
                    proteinNode = root.findChild("id", '6');
                }

                selection.forEach(function(element, index, array) {
                    var child = proteinNode.findChild("id", element.id);
                    if (child === null) {
                        proteinNode.appendChild(element);
                    }
                });

                break;
            case 7:
                var geneNode = root.findChild("id", '7');
                if (geneNode === null) {
                    root.insertChild(6, {
                        text: 'Gene',
                        id: '7',
                        checked: true,
                        expanded: true
                    });
                    geneNode = root.findChild("id", '7');
                }

                selection.forEach(function(element, index, array) {
                    var child = geneNode.findChild("id", element.id);
                    if (child === null) {
                        geneNode.appendChild(element);
                    }
                });

                break;
        }

        var leafCount = 0;
        treepanel.getRootNode().cascadeBy(function(node) {
            if (node.isLeaf()) leafCount++;
        });

        treepanel.setTitle("Filters (" + leafCount + " filters)");

        treepanel.getStore().sort();
        treepanel.fireEvent("ApplyFilters");
    },







    //	GetTreeAsObject: function(treeNode){
    //		var data={};
    //		if (treeNode.get('checked') || treeNode.isRoot()){
    //			data['text']=treeNode.get('text');
    //			data['id']=treeNode.get('id');
    //			data['leaf']=treeNode.get('leaf');
    //
    //			if (!data['leaf']){
    //				data['children']=[];
    //
    //				treeNode.eachChild(function(child){
    //
    //					var childData=this.GetTreeAsObject(child);
    //					if(childData!==null){
    //						data['children'].push(childData)
    //					}
    //				},this)
    //			}
    //			return data;
    //		}else{
    //			return null;
    //		}
    //	},


    GetTreeAsObject: function(treeRoot) {
        var data = {};
        data['root'] = true;
        data['idBiosource'] = MetExplore.globals.Session.idBioSource;
        data['filters'] = [];
        treeRoot.eachChild(function(child) {
            if (child.get('checked')) {
                var eltFilter = {};
                eltFilter['on'] = child.get("text");
                var ids = [];

                child.eachChild(function(granchild) {
                    if (granchild.get('checked')) {
                        ids.push(granchild.get('id'));
                    }
                });

                eltFilter['id'] = ids.join();
                data['filters'].push(eltFilter);
            }
        });
        return data;
    },


    GenerateJson: function(button) {

        var root = Ext.getCmp('treeFilter').getRootNode();

        var obj = this.GetTreeAsObject(root);
        var treeAsJson = Ext.encode(obj);

        console.log(treeAsJson);

    },


    AjaxRequest: function(filterJson) {





    },


    ClearTree: function() {
        var root = Ext.getCmp('treeFilter').getRootNode();
        root.removeAll();
        Ext.getCmp('treeFilter').setTitle("Filters");
    },

    Clear: function() {

        var gridsCtrl = MetExplore.app.getController('C_GenericGrid');
        gridsCtrl.delfilterGrid();


    }


});