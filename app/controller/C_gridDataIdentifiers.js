/**
 * C_gridData
 */
Ext.define('MetExplore.controller.C_gridDataIdentifiers', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'gridDataIdentifiers': {
                //itemcontextmenu: this.editMenu,
                viewready: function(grid) {
                        var storeData = Ext.create('MetExplore.store.S_DataMultiMapping');
                        grid.reconfigure(storeData);
                    this.mapKey(grid);
                },

            }
        });
        //		

    },
    /*
    addComboCol: function(grid, combo) {
        var col = Ext.create('Ext.grid.column.Column', {
            header: combo,
            dataIndex: 'col1',
            filterable: true,
            sortable: true,
            renderTpl: Ext.create('MetExplore.override.CTemplate', Ext.grid.column.Column.prototype.renderTpl),
            //text: combo,

            listeners: {
                destroy: function() {
                    combo.destroy();
                },

                resize: function(col, width) {
                    console.log(width);
                    combo.setWidth(width - 14);
                }
            }
        });
        console.log(col);
        grid.headerCt.insert(2, col);
    },

*/
    /*
     * ajout menu contextuel
     */
    editMenu: function(grid, record, item, index, e, eOpts) {
        // devalide le menu contextuel du navigateur
        e.preventDefault();
        var ctrl = this;

        grid.CtxMenu = new Ext.menu.Menu({
            items: [{

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

                        MetExplore.app.getController('C_gridDataIdentifiers').getRecsFromCsv(grid, ta, false, '');
                    }, 1000);

                    ta.focus();
                    ta.select();
                    //document.body.removeChild(ta);
                }
            }, {
                key: "a",
                ctrl: true,

                fn: function(keyCode, e) {
                    e.preventDefault();
                    grid.getSelectionModel().selectAll();
                }
            }

        ]);
    },

    getCsvDataFromRecs: function(recs) {

        var clipText = '';
        var tabFields = new Array;
        var model = recs.model.getFields();
        var nbCol = model.length;
        for (i = 0; i < nbCol; i++) {
            tabFields.push(model[i].name);
        }
        recs.each(function(row) {
            for (i = 0; i < nbCol; i++) {
                val = row.get(tabFields[i]);
                clipText = clipText.concat(val, "\t");
            }
            clipText = clipText.concat("\n");
            //console.log('row',row);

        });

        return clipText;
    },
    /*
     * creation csv pour copy to excel
     */
    getRecsFromCsv: function(grid, ta, autoload, rows) {

        if (!autoload) {
            var rows = ta.value;
            document.body.removeChild(ta);
        }

        rows = rows.split("\n");
        var cols = rows[0].split("\t");
        var nbCol = cols.length;
        //console.log(rows);
        //console.log(cols);
        this.removeColumnGrid(grid);

        var header = grid.up('panel').query('checkboxfield[name=header]')[0].getRawValue();
        //console.log(header);
        this.addColumnGrid(grid, nbCol, header, cols);

        //ajout des data
        var storeData = grid.getStore();
        this.addData(storeData, rows, header);
        //console.log(rows);

    },


    removeColumnGrid: function(grid) {
        //-2 ne pas supprimer les 4 premieres col (num ligne, result_id, result_distance, result_mapping)
        var gridData = grid.query('gridDataIdentifiers')[0];
        //console.log(grid);
        var nb = grid.headerCt.gridDataColumns.length - 4;
        //console.log('grid ',grid.headerCt);
        for (i = 0; i < nb; i++) {
            grid.headerCt.remove(4);
        }
    },

    //compare chaine header avec un element du tableau des types identifiants
    compareID: function(chaine) {
        chaine = chaine.toLowerCase();
        //console.log(chaine);
        var table = ['name', 'inchikey', 'chebi', 'formula', 'kegg', 'inchi', 'smiles', 'pubchem', 'hmdb', 'lipid', 'swiss', 'other'];
        var result = '';
        var i = 0;
        while (result == '') {
            if (chaine.indexOf(table[i]) > -1)
                result = table[i];
            i = i + 1;
            if (i == 12) result = 'other';
        }
        if (result == 'lipid') result = 'lipidmap';
        if (result == 'swiss') result = 'swisslipids';
        if (result == 'name') result = 'dataset_name';
        //console.log(result);
        return result;
    },

    addColumnGrid: function(grid, nb, header, rowHeader) {
        //				var gridData= grid.query('gridData')[0];
        //		console.log(grid);
        //var header= this.up('panel').query('checkboxfield[name=header]')[0].getRawValue();

        //console.log('grid ',grid);
        for (var i = 0; i < nb; i++) {
            var colText = '';
            var colVal = 'other';
            if (header) {
                colText = rowHeader[i];
                colVal = this.compareID(colText);
            } else {
                colText = 'identifier';
            }
            var column = Ext.create('Ext.grid.column.Column', {
                text: colText,
                header: colText,
                items: [{
                    xtype: 'combobox',
                    store: ['dataset_name', 'inchikey', 'chebi', 'formula', 'kegg', 'inchi', 'smiles', 'pubchem', 'hmdb', 'lipidmap', 'swisslipids', 'other'],
                    value: colVal,
                }],
                menuDisabled: true,
                dataIndex: 'map' + i,
                filterable: true,
                flex: 1,
                sortable: true,
                listeners: {
                    resize: function(col, width) {
                        col.query('combobox')[0].setWidth(width - 3);
                    }
                }
            });

            grid.headerCt.insert(column); //grid.columns.length,
            grid.columns.push(column);
        }
    },

    addData: function(store, rows, header) {
        //console.log(rows);
        store.removeAll();

        var nbRow = (rows.length);
        if (header) var debut = 1;
        else debut = 0;

        for (var i = debut; i < nbRow; i++) {
            //console.log(cols);
            var cols = rows[i].split("\t");
            //console.log(cols);
            var regex = /(?:\r\n|\r|\n){2,}/g;

            //console.log(cols[0]);
            if (rows[i] != "") {
                for (var j = 0; j < cols.length; j++) {
                    cols[j] = cols[j].replace(regex, "");
                    if (cols[j]=="") cols[j]= "NaN";
                }
                for (var j = cols.length; j < 20; j++) {
                    cols[j] = "";
                }
                store.add({
                    'result_id': '',
                    'result_distance': '',
                    'result_mapping': '',
                    'map0': cols[0],
                    'map1': cols[1],
                    'map2': cols[2],
                    'map3': cols[3],
                    'map4': cols[4],
                    'map5': cols[5],
                    'map6': cols[6],
                    'map7': cols[7],
                    'map8': cols[8],
                    'map9': cols[9],
                    'map10': cols[10],
                    'map11': cols[11],
                    'map12': cols[12],
                    'map13': cols[13],
                    'map14': cols[14],
                    'map15': cols[15],
                    'map16': cols[16],
                    'map17': cols[17],
                    'map18': cols[18],
                    'map19': cols[19]
                });

            }
        }
        //console.log(store);
    },

    addDataBlank: function(store) {
        store.add({
            'result_id': '',
            'result_distance': '',
            'result_mapping': '',
            'map0': '',
            'map1': '',
            'map2': '',
            'map3': '',
            'map4': '',
            'map5': '',
            'map6': '',
            'map7': '',
            'map8': '',
            'map9': '',
            'map10': '',
            'map11': '',
            'map12': '',
            'map13': '',
            'map14': '',
            'map15': '',
            'map16': '',
            'map17': '',
            'map18': '',
            'map19': ''
        });
    }

});