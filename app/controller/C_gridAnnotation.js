/**
 * C_gridAnnotation
 */
Ext.define('MetExplore.controller.C_gridAnnotation', {
    extend: 'Ext.app.Controller',
    stores: ['S_DataTab'],
    config: {
        views: ['grid.V_gridAnnotation', 'form.V_Annotation_TabFile']
    },
    //requires:['MetExplore.view.form.V_SelectField'],

    init: function() {
        this.control({
            'gridAnnotation': {

                //itemcontextmenu : this.editMenu,
                viewready: function(grid) {
                    //							var storeData= Ext.create('MetExplore.store.S_DataTab');
                    //							grid.reconfigure(storeData);
                    this.mapKey(grid);
                    //this.addColumnGrid(grid,1);
                }
            }
        });
        //		

    },
    /**
     * 
     * 
     */
    updateMenu: function(grid, object) {
        var menu = grid.headerCt.getMenu();
        //console.log(grid);
        menu.removeAll();
        menu.add([{
            text: 'nothing',
            handler: function() {
                var col = menu.activeHeader.dataIndex;
                var numCol = parseInt(col.substring(3));
                grid.columns[numCol].setText('Col_' + String.fromCharCode(numCol + 65));
                //                    for (i=0;i<30;i++) {
                //                    	console.log("i: ",i,String.fromCharCode(i+65));
                //                    }
            }
        }, {
            xtype: 'menuseparator'
        }, {
            text: 'name',
            handler: function() {
                var col = menu.activeHeader.dataIndex;
                var numCol = parseInt(col.substring(3));
                grid.columns[numCol].setText('name');
            }

        }, {
            text: 'dbIdentifier',
            handler: function() {
                var col = menu.activeHeader.dataIndex;
                var numCol = parseInt(col.substring(3));
                grid.columns[numCol].setText('dbIdentifier');
            }

        }]);

        switch (object) {
            case 'Metabolite':
                menu.add([{
                    text: 'chemicalFormula',
                    handler: function() {
                        var col = menu.activeHeader.dataIndex;
                        var numCol = parseInt(col.substring(3));
                        grid.columns[numCol].setText('chemicalFormula');
                    }
                }, {
                    text: 'sideCompound',
                    handler: function() {
                        var col = menu.activeHeader.dataIndex;
                        var numCol = parseInt(col.substring(3));
                        grid.columns[numCol].setText('sideCompound');
                    }
                }]);
                break;

            case 'Reaction':
                menu.add([{
                    text: 'ec',
                    handler: function() {
                        var col = menu.activeHeader.dataIndex;
                        var numCol = parseInt(col.substring(3));
                        grid.columns[numCol].setText('ec');
                    }
                }, {
                    text: 'reversible',
                    handler: function() {
                        var col = menu.activeHeader.dataIndex;
                        var numCol = parseInt(col.substring(3));
                        grid.columns[numCol].setText('reversible');
                    }
                }, {
                    text: 'lowerBound',
                    handler: function() {
                        var col = menu.activeHeader.dataIndex;
                        var numCol = parseInt(col.substring(3));
                        grid.columns[numCol].setText('lowerBound');
                    }
                }, {
                    text: 'upperBound',
                    handler: function() {
                        var col = menu.activeHeader.dataIndex;
                        var numCol = parseInt(col.substring(3));
                        grid.columns[numCol].setText('upperBound');
                    }

                }]);
                break;
            default:
                break;
        }
        /*
        grid.doLayout();
        grid.getView().refresh();*/
    },
    /*
     * ajout menu contextuel
     */
    editMenu: function(grid, record, item, index, e, eOpts) {
        // devalide le menu contextuel du navigateur
        e.preventDefault();
        //var grid= Ext.ComponentQuery.query('tabpanel')[0].getActiveTab().query('gridData')[0];
        //console.log(grid.ownerCt);
        var ctrl = this;

        grid.CtxMenu = new Ext.menu.Menu({
            items: [{
                text: 'Row -> Header',
                handler: function() {

                    //var storeData= Ext.getStore('S_DataMapping');
                    var storeData = grid.ownerCt.getStore();
                    //console.log('store',storeData);
                    var currentRec = storeData.getAt(index);
                    var columnsMapping = grid.headerCt.gridDataColumns;
                    //var columnsMapping=  grid.ownerCt.columns;
                    //gridData.headerCt.gridDataColumns
                    //					console.log('header ',grid.headerCt);
                    //					console.log('owner ',grid.ownerCt.columns);
                    for (var i = 2; i < columnsMapping.length; i++) {
                        //console.log('gridCol',grid.headerCt.gridDataColumns[i]);
                        grid.headerCt.gridDataColumns[i].text = currentRec.get('map' + (i - 2));
                        grid.headerCt.gridDataColumns[i].initialConfig.header = currentRec.get('map' + (i - 2));
                        grid.headerCt.gridDataColumns[i].initialConfig.text = currentRec.get('map' + (i - 2));
                        //grid.columns[i].setText(currentRec.get('map'+(i-2)));
                        //grid.ownerCt.columns[i].setText(currentRec.get('map'+(i-2)));
                    }
                    //grid.doLayout();
                    //					var gridData= grid.query('gridData')[0];
                    //					gridData.doLayout();
                    storeData.removeAt(index);
                    /*console.log(grid.getView());
                    grid.getView().refresh();*/
                    //grid.reconfigure(storeData);
                }
            }, {
                text: 'Add Row',
                handler: function() {
                    var storeGrid = grid.ownerCt.getStore();
                    storeGrid.add({
                        'id': '',
                        'conditions': []
                    });
                }
                //			}, {
                //				text : 'Add Column',
                //				handler : function() {					
                //					var nb= grid.ownerCt.columns.length;
                //					console.log(nb);
                //
                //					ctrl.modifyModel(nb);
                //					
                //					ctrl.removeColumnGrid (grid.ownerCt);
                //					ctrl.addColumnGrid(grid.ownerCt, nb);
                //
                //				}
                //			},{
                //				text : 'Remove Column',
                //				handler : function() {
                //					var nb= grid.ownerCt.columns.length;
                //					console.log(nb);
                //					if (nb>2) {
                //						ctrl.modifyModel(nb-2);					
                //						ctrl.removeColumnGrid (grid.ownerCt);
                //					}
                //				}
            }, {
                text: 'Remove Row',
                handler: function() {
                    var storeGrid = grid.ownerCt.getStore();
                    //storeGrid.add({'id':'','conditions':[]});

                    //console.log(index);
                    if (storeGrid.count() > 1) {
                        storeGrid.removeAt(index);
                    }
                }
            }]
        });
        // positionner le menu au niveau de la souris
        grid.CtxMenu.showAt(e.getXY());
    },

    mapKey: function(grid) {
        var map = new Ext.KeyMap(grid.getEl(), [{
                key: "v",
                ctrl: true,
                fn: function() {

                    var ta = document.createElement('textarea');
                    ta.id = 'cliparea';

                    ta.style.position = 'absolute';
                    ta.style.left = '-1000px';
                    ta.style.top = '-1000px';
                    ta.value = '';
                    document.body.appendChild(ta);
                    document.designMode = 'off';

                    setTimeout(function() {

                        MetExplore.app.getController('C_gridAnnotation').getRecsFromCsv(grid, ta, false, '');
                    }, 100);

                    ta.focus();
                    ta.select();
                }
            },
            {
                key: "c",
                ctrl: true,
                fn: function(keyCode, e) {

                    var recs = grid.getStore();
                    var model = recs.model.getFields();
                    //console.log('rec ',recs,'model ',model);
                    if (recs && recs.length != 0) {
                        var clipText = MetExplore.app.getController('C_gridAnnotation').getCsvDataFromRecs(recs);
                        var ta = document.createElement('textarea');
                        ta.id = 'cliparea';
                        ta.style.position = 'absolute';
                        ta.style.left = '-1000px';
                        ta.style.top = '-1000px';
                        ta.value = clipText;
                        document.body.appendChild(ta);
                        document.designMode = 'off';
                        ta.focus();
                        ta.select();
                        setTimeout(function() {
                            document.body.removeChild(ta);
                        }, 100);

                    }
                }

            }
        ]);
    },

    getCsvDataFromRecs: function(recs) {

        var clipText = '';
        var tabFields = new Array;
        /*
        var model = recs.model.getFields();
        var nbCol= model.length;
        for (i=0; i<nbCol;i++) {
        	tabFields.push(model[i].name);
        }*/
        recs.each(function(row) {
            for (i = 0; i < nbCol; i++) {
                val = row.get(tabFields[i]);
                clipText = clipText.concat(val, "\t");
            }
            clipText = clipText.concat("\n");
            //console.log(cell);

        });

        return clipText;
    },
    /*
     * creation csv pour copy to excel
     */
    getRecsFromCsv: function(grid, ta, autoload, rows) {

        document.body.removeChild(ta);
        var rows = ta.value;

        rows = rows.split("\n");
        var cols = rows[0].split("\t");
        var nbCol = cols.length;
        //modifie modele
        //this.modifyModel(nbCol);

        //ajout column grid
        //this.removeColumnGrid (grid);
        //this.addColumnGrid(grid, nbCol);
        //ajout des data
        var storeData = grid.getStore();
        this.addData(storeData, rows);
        //console.log(storeData);
    },
    //ajout des colonnes dans le storeColumn


    modifyModel: function(nb) {

        var model = MetExplore.app.getModel('DataTab');
        // 1er colonne= Element a mapper
        var nbFields = model.getFields().length - 1;
        //			console.log(nb);
        //            console.log(model.getFields());
        var fields = model.prototype.fields.getRange();
        for (i = nbFields; i <= nb; i++) {

            fields.push({
                name: 'tab' + i,
                mapping: 'tab[' + i + ']'
            });
        }
        model.setFields(fields);
        //console.log('fields new ',fields);
        //console.log(model.getFields());
    },

    removeColumnGrid: function(grid) {


        grid.headerCt.removeAll();
        //		var combo= grid.up('panel').down('fieldset').down('combo[fieldLabel="Match Column"]') ;
        //		combo.store.removeAll();
        var store = Ext.getStore('S_Col');
        store.removeAll();

    },

    addColumnGrid: function(grid, nb) {
        var store = Ext.getStore('S_Col');
        //var gridAnnot= grid.up('panel').down('fieldset').down('gridAnnotProperty') ;
        //console.log('grid ',grid.headerCt);
        var source;
        var sourceConfig;
        //gridAnnot.setSource({'C':'c','C':'c','C':'c'},{editor : 'selectField'})
        for (var i = 1; i <= nb; i++) {
            //var select= new selectField();
            //gridAnnot.setProperty('Col_'+i,{value:'test',editor : 'selectField'},true);
            store.add({
                'id': 'Col_' + i
            });
            var column = Ext.create('Ext.grid.column.Column', {
                dataIndex: 'tab' + (i - 1),
                header: 'Col_' + i,
                width: 120
            });
            grid.headerCt.insert(grid.columns.length, column);

        }

        grid.getView().refresh();
    },

    addData: function(store, rows) {
        store.removeAll();
        var nbRow = (rows.length - 1);
        for (var i = 0; i < nbRow; i++) {
            var cols = rows[i].split("\t");
            console.log(cols);
            //ajout 1 record dans store avec contenu de colonne 1
            store.add({
                'tab0': cols[0],
                'tab1': cols[1],
                'tab2': cols[2],
                'tab3': cols[3],
                'tab4': cols[4],
                'tab5': cols[5],
                'tab6': cols[6],
                'tab7': cols[7],
                'tab8': cols[8],
                'tab9': cols[9]
            });
            //		    	var currentRec= store.getAt(i); 
            //
            //		    	var nbCol = cols.length;
            //				for (var j=1; j<nbCol; j++) {	
            //					currentRec.set('map'+(j-1), cols[j])
            //		    	}
        }
        console.log(store);
    }
});