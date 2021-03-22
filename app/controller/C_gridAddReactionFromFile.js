/**
 * C_gridAdd
 */
Ext.define('MetExplore.controller.C_gridAddReactionFromFile', {
    extend: 'Ext.app.Controller',
    stores: ['S_DataTab'],
    config: {
        views: ['grid.V_gridAddReactionFromFile']
    },
    requires: ['MetExplore.globals.Session'],

    init: function() {
        this.control({
            'reactionAnnotationFromFile': {
                afterrender: this.hidefieldset
            },
            'gridAddReactionFromFile': {
                afterrender: this.updateMenu,
                itemcontextmenu: this.editMenu,
                viewready: this.mapKey
            }
        });


    },


    hidefieldset: function(panel) {

        var store = panel.up('mainPanel').next('sidePanel').down('gridBioSourceInfo').getStore();

        var biosource = store.getAt(0);

        if (biosource.isBiosourceEmpty()) {
            var field = panel.down('fieldset');

            while (field = field.next('fieldset')) {
                if (field.title === 'Merging Attribute') {
                    field.next('fieldset').setVisible(false);
                    field.setVisible(false);
                }
            }
        }

    },

    /**
     * 
     * 
     */
    updateMenu: function(grid) {
        var menu = grid.headerCt.getMenu();
        //console.log(grid);
        menu.removeAll();
        menu.add([{
                text: 'Identifier *',
                handler: function() {
                    var col = menu.activeHeader.dataIndex;
                    var numCol = parseInt(col.substring(3)) + 1;
                    grid.columns[numCol].setText('Identifier');
                }

            }, {
                text: 'Reaction formula *',
                handler: function() {
                    var col = menu.activeHeader.dataIndex;
                    var numCol = parseInt(col.substring(3)) + 1;
                    grid.columns[numCol].setText('Reaction formula');
                }
            }, {
                xtype: 'menuseparator'
            }, {
                text: 'Name',
                handler: function() {
                    var col = menu.activeHeader.dataIndex;
                    var numCol = parseInt(col.substring(3)) + 1;
                    grid.columns[numCol].setText('Name');
                }

            },
            //		{ 
            //			text:'Compartment List',
            //			handler: function() {
            //				var col = menu.activeHeader.dataIndex;
            //				var numCol= parseInt(col.substring(3))+1;
            //				grid.columns[numCol].setText('Compartment List');
            //			}
            //		},
            {
                text: 'Pathway List',
                handler: function() {
                    var col = menu.activeHeader.dataIndex;
                    var numCol = parseInt(col.substring(3)) + 1;
                    grid.columns[numCol].setText('Pathway List');
                }
            }, {
                text: 'GPR',
                handler: function() {
                    var col = menu.activeHeader.dataIndex;
                    var numCol = parseInt(col.substring(3)) + 1;
                    grid.columns[numCol].setText('GPR');
                }
            }, {
                text: 'EC Number',
                handler: function() {
                    var col = menu.activeHeader.dataIndex;
                    var numCol = parseInt(col.substring(3)) + 1;
                    grid.columns[numCol].setText('EC Number');
                }
            }, {
                text: 'Flux lower Bound',
                handler: function() {
                    var col = menu.activeHeader.dataIndex;
                    var numCol = parseInt(col.substring(3)) + 1;
                    grid.columns[numCol].setText('Flux lower Bound');
                }
            }, {
                text: 'Flux upper Bound',
                handler: function() {
                    var col = menu.activeHeader.dataIndex;
                    var numCol = parseInt(col.substring(3)) + 1;
                    grid.columns[numCol].setText('Flux upper Bound');
                }
            }, {
                text: 'Reaction Status',
                handler: function() {
                    var col = menu.activeHeader.dataIndex;
                    var numCol = parseInt(col.substring(3)) + 1;
                    grid.columns[numCol].setText('Reaction Status');
                }
            }, {
                text: 'Comment',
                handler: function() {
                    var col = menu.activeHeader.dataIndex;
                    var numCol = parseInt(col.substring(3)) + 1;
                    grid.columns[numCol].setText('Comment');
                }
            }, {
                text: 'Biblio',
                handler: function() {
                    var col = menu.activeHeader.dataIndex;
                    var numCol = parseInt(col.substring(3)) + 1;
                    grid.columns[numCol].setText('Biblio');
                }
            }, {
                text: 'Not Used',
                handler: function() {
                    var col = menu.activeHeader.dataIndex;
                    var numCol = parseInt(col.substring(3)) + 1;
                    grid.columns[numCol].setText('Not Used');
                }
            }
        ]);

    },




    /*
     * ajout menu contextuel
     */
    editMenu: function(grid, record, item, index, e, eOpts) {
        // devalide le menu contextuel du navigateur
        e.preventDefault();

        grid.CtxMenu = new Ext.menu.Menu({
            items: [{
                text: 'Remove Row',
                handler: function() {
                    var storeGrid = grid.ownerCt.getStore();
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

                        MetExplore.app.getController('C_gridAdd').getRecsFromCsv(grid, ta, false, '');
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
                        var clipText = MetExplore.app.getController('C_gridAdd').getCsvDataFromRecs(recs);
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
        //		console.log(nb);
        //		console.log(model.getFields());
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
            rows[i] = rows[i].replace(/'/g, "");
            //rows[i]= rows[i].replace(/"/g,"");
            var cols = rows[i].split("\t");
            //console.log(cols);
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
                'tab9': cols[9],
                'tab10': cols[10],
                'tab11': cols[11],
                'tab12': cols[12],
                'tab13': cols[13],
                'tab14': cols[14],
                'tab15': cols[15],
                'tab16': cols[16],
                'tab17': cols[17],
                'tab18': cols[18],
                'tab19': cols[19],
                'tab20': cols[20],
                'tab21': cols[21],
                'tab22': cols[22],
                'tab23': cols[23],
                'tab24': cols[24],
                'tab25': cols[25]
            });
            //			var currentRec= store.getAt(i); 

            //			var nbCol = cols.length;
            //			for (var j=1; j<nbCol; j++) {	
            //			currentRec.set('map'+(j-1), cols[j])
            //			}
        }
        console.log(store);
    }
});