/**
 * C_gridData
 */
Ext.define('MetExplore.controller.C_gridDataGene', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'gridDataGene': {
                //itemcontextmenu: this.editMenu,
                viewready: function(grid) {
                        var storeData = Ext.create('MetExplore.store.S_DataMapping');
                        grid.reconfigure(storeData);
                    this.mapKey(grid);
                },
            }
        });
        //		

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

                        MetExplore.app.getController('C_gridDataGene').getRecsFromCsv(grid, ta);
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
    getRecsFromCsv: function(grid, ta) {


        var rows = ta.value.split("\n");
        document.body.removeChild(ta);


        // rows = rows.split("\n");
        // var cols = rows[0].split("\t");
        // var nbCol = cols.length;
        //console.log(rows);
        //console.log(cols);
        //this.removeColumnGrid(grid);

        var header = grid.up('panel').query('checkboxfield[name=header]')[0].getRawValue();
        //console.log(header);
        //this.addColumnGrid(grid, nbCol, header, cols);

        //ajout des data
        var storeData = grid.getStore();
        this.addData(storeData, rows, header);
        //console.log(storeData);

    },



    addData: function(store, rows, header) {
        //console.log(rows);
        store.removeAll();

        var nbRow = (rows.length);
        var debut = 0;
        if (header) debut = 1;

        for (var i = debut; i < nbRow; i++) {
            //console.log(cols);
            var cols = rows[i].split("\t");
            //console.log(cols);
            var regex = /(?:\r\n|\r|\n){2,}/g;
            cols[0] = cols[0].replace(regex, "");
            //console.log(cols[0]);
            if (cols[0] != "") {

                store.add({
                    'identified': '',
                    'idMap': cols[0]
                });

            }
        }
        //console.log(store);
    },

    addDataBlank: function(store) {
        store.add({
            'result': '',
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