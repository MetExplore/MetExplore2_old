/**
 * C_gridData
 */
Ext.define('MetExplore.controller.C_gridData', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'gridData': {
                itemcontextmenu: this.editMenu,
                viewready: function(grid) {
                    var storeData = Ext.create('MetExplore.store.S_DataMapping');
                    grid.reconfigure(storeData);
                    this.mapKey(grid);

                }

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
                    ta.class= 'test';
                    document.body.appendChild(ta);
                    //document.designMode = 'off';
                    setTimeout(function() {

                        MetExplore.app.getController('C_gridData').getRecsFromCsv(grid, ta, false, '');
                    }, 1000);

                    ta.focus();
                    ta.select();
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
            rows = ta.value;
            document.body.removeChild(ta);
        }
        //console.log('getRec');

        rows = rows.split("\n");
        var cols = rows[0].split("\t");
        var nbCol = cols.length;

        // var combo = grid.up('panel').query('combobox[name=mapping_type]')[0];
        // var store = combo.getStore();
        // if (nbCol <= 1) {
        //     store.filter('id', 0);
        // } else {
        //     store.clearFilter();
        // }
        //console.log(nbCol);
        this.removeColumnGrid(grid);
        //var header=false;
        var header = grid.up('panel').query('checkboxfield[name=header]')[0].getRawValue();
        //console.log(header);
        this.addColumnGrid(grid, nbCol, header, cols);
        console.log(nbCol);
        if (nbCol<2) {
            var panel = Ext.getCmp('tabPanel').getActiveTab();
            if (panel.items.items[0] != undefined) {
                if (panel.items.items[0].xtype == "formMap") {
                    panel.query('combo[name=coverage]')[0].disable();
                    panel.query('checkboxfield[name=mapping_type]')[0].disable();
                }
            }
        } else {
            var panel = Ext.getCmp('tabPanel').getActiveTab();
            if (panel.items.items[0] != undefined) {
                if (panel.items.items[0].xtype == "formMap") {
                    panel.query('combo[name=coverage]')[0].enable();
                    panel.query('checkboxfield[name=mapping_type]')[0].enable();
                }
            }
        }

        //ajout des data
        var storeData = grid.getStore();
        this.addData(storeData, rows, header);

    },



    modifyModel: function(nb) {

        var model = MetExplore.app.getModel('DataMapping');
        // 1er colonne= Element a mapper
        var nbFields = model.getFields().length;

        var fields = model.prototype.fields.getRange();
        //console.log
        for (i = nbFields; i <= nb; i++) {
            var numMap = i - 2;
            fields.push({
                name: 'map' + numMap,
                mapping: 'conditions[' + numMap + ']'
            });
        }
        model.setFields(fields);
        //			console.log('fields new ',fields);
        //			console.log(model.getFields());
    },

    removeColumnGrid: function(grid) {
        //-2 ne pas supprimer les 2 premieres col (identified & identifier/name
        //var gridData = grid.query('gridData')[0];
        //console.log(grid);
        var nb = grid.headerCt.gridDataColumns.length - 3;
        //console.log('grid ',grid.headerCt);
        //console.log(nb);
        for (i = 0; i < nb; i++) {
            if (grid.headerCt) grid.headerCt.remove(3);
        }
    },

    addColumnGrid: function(grid, nb, header, rowHeader) {
        //				var gridData= grid.query('gridData')[0];
        //		console.log(grid);
        //var header= this.up('panel').query('checkboxfield[name=header]')[0].getRawValue();

        //console.log('grid ',grid);
        for (var i = 0; i < (nb - 1); i++) {
            if (header) var colText = rowHeader[i + 1];
            else var colText = 'condition' + i;
            var column = Ext.create('Ext.grid.column.Column', {
                //text: 'condition'+i,
                header: colText,
                dataIndex: 'map' + i,
                filterable: true,
                flex: 1,
                sortable: true
            });
            //gridData.ownerCt.columns[i].setText(currentRec.get('map'+(i-2)));	
            //grid.ownerCt.columns.push(column);//[i].setText(currentRec.get('map'+(i-2)))
            grid.headerCt.insert(column); //grid.columns.length,
            grid.columns.push(column);
        }
    },

    addData: function(store, rows, header) {
        store.removeAll();

        var nbRow = (rows.length);
        if (header) var debut = 1;
        else debut = 0;

        for (var i = debut; i < nbRow; i++) {

            var cols = rows[i].split("\t");
            var regex = /(?:\r\n|\r|\n){2,}/g;
            cols[0] = cols[0].replace(regex, "");

            if (cols[0] != "") {
                //console.log(cols[0]);
                //cols[0]= cols[0].replace(/[\r]/gi, "" )
                //ajout 1 record dans store avec contenu de colonne 1
                for (j = 1; j <= cols.length; j++) {
                    if (cols[j] == "") {
                        cols[j] = "a";
                    }
                    if (cols[j] != undefined)
                        cols[j] = cols[j].replace(",", ".");
                }
                store.add({
                    'identified': false,
                    'idMap': cols[0],
                    'map0': cols[1],
                    'map1': cols[2],
                    'map2': cols[3],
                    'map3': cols[4],
                    'map4': cols[5],
                    'map5': cols[6],
                    'map6': cols[7],
                    'map7': cols[8],
                    'map8': cols[9],
                    'map9': cols[10],
                    'map10': cols[11],
                    'map11': cols[12],
                    'map12': cols[13],
                    'map13': cols[14],
                    'map14': cols[15],
                    'map15': cols[16],
                    'map16': cols[17],
                    'map17': cols[18],
                    'map18': cols[19],
                    'map19': cols[20],
                    'map20': cols[21],
                    'map21': cols[22],
                    'map22': cols[23],
                    'map23': cols[24],
                    'map24': cols[25],
                    'map25': cols[26],
                    'map26': cols[27],
                    'map27': cols[28],
                    'map28': cols[29],
                    'map29': cols[30],
                    'map30': cols[31],
                    'map31': cols[32],
                    'map32': cols[33],
                    'map33': cols[34],
                    'map34': cols[35],
                    'map35': cols[36],
                    'map36': cols[37],
                    'map37': cols[38],
                    'map38': cols[39],
                    'map39': cols[40],
                    'map40': cols[41],
                    'map41': cols[42],
                    'map42': cols[43],
                    'map43': cols[44],
                    'map44': cols[45],
                    'map45': cols[46],
                    'map46': cols[47],
                    'map47': cols[48],
                    'map48': cols[49],
                    'map49': cols[50],
                    'map50': cols[51],
                    'map51': cols[52],
                    'map52': cols[53],
                    'map53': cols[54],
                    'map54': cols[55],
                    'map55': cols[56],
                    'map56': cols[57],
                    'map57': cols[58],
                    'map58': cols[59],
                    'map59': cols[60],
                    'map60': cols[61],
                    'map61': cols[62],
                    'map62': cols[63],
                    'map63': cols[64],
                    'map64': cols[65],
                    'map65': cols[66],
                    'map66': cols[67],
                    'map67': cols[68],
                    'map68': cols[69],
                    'map69': cols[70],
                    'map70': cols[71],
                    'map71': cols[72],
                    'map72': cols[73],
                    'map73': cols[74],
                    'map74': cols[75],
                    'map75': cols[76],
                    'map76': cols[77],
                    'map77': cols[78],
                    'map78': cols[79],
                    'map79': cols[80],
                    'map80': cols[81],
                    'map81': cols[82],
                    'map82': cols[83],
                    'map83': cols[84],
                    'map84': cols[85],
                    'map85': cols[86],
                    'map86': cols[87],
                    'map87': cols[88],
                    'map88': cols[89],
                    'map89': cols[90],
                    'map90': cols[91],
                    'map91': cols[92],
                    'map92': cols[93],
                    'map93': cols[94],
                    'map94': cols[95],
                    'map95': cols[96],
                    'map96': cols[97],
                    'map97': cols[98],
                    'map98': cols[99],
                    'map99': cols[100],
                    'map100': cols[101],
                    'map101': cols[102],
                    'map102': cols[103],
                    'map103': cols[104],
                    'map104': cols[105],
                    'map105': cols[106],
                    'map106': cols[107],
                    'map107': cols[108],
                    'map108': cols[109],
                    'map109': cols[110],
                    'map110': cols[111],
                    'map111': cols[112],
                    'map112': cols[113],
                    'map113': cols[114],
                    'map114': cols[115],
                    'map115': cols[116],
                    'map116': cols[117],
                    'map117': cols[118],
                    'map118': cols[119],
                    'map119': cols[100],
                    'map120': cols[121],
                    'map121': cols[122],
                    'map122': cols[123],
                    'map123': cols[124],
                    'map124': cols[125],
                    'map125': cols[126],
                    'map126': cols[127],
                    'map127': cols[128],
                    'map128': cols[129],
                    'map129': cols[130],
                    'map130': cols[131],
                    'map131': cols[132],
                    'map132': cols[133],
                    'map133': cols[134],
                    'map134': cols[135],
                    'map135': cols[136],
                    'map136': cols[137],
                    'map137': cols[138],
                    'map138': cols[139],
                    'map139': cols[140]
                });
            }

        }
        //console.log(store);
    },

    addDataBlank: function(store) {
        store.add({
            'identified': false,
            'idMap': '',
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
            'map19': '',
            'map20': '',
            'map21': '',
            'map22': '',
            'map23': '',
            'map24': '',
            'map25': '',
            'map26': '',
            'map27': '',
            'map28': '',
            'map29': '',
            'map30': '',
            'map31': '',
            'map32': '',
            'map33': '',
            'map34': '',
            'map35': '',
            'map36': '',
            'map37': '',
            'map38': '',
            'map39': '',
            'map40': '',
            'map41': '',
            'map42': '',
            'map43': '',
            'map44': '',
            'map45': '',
            'map46': '',
            'map47': '',
            'map48': '',
            'map49': '',
            'map50': '',
            'map51': '',
            'map52': '',
            'map53': '',
            'map54': '',
            'map55': '',
            'map56': '',
            'map57': '',
            'map58': '',
            'map59': '',
            'map60': '',
            'map61': '',
            'map62': '',
            'map63': '',
            'map64': '',
            'map65': '',
            'map66': '',
            'map67': '',
            'map68': '',
            'map69': '',
            'map70': '',
            'map71': '',
            'map72': '',
            'map73': '',
            'map74': '',
            'map75': '',
            'map76': '',
            'map77': '',
            'map78': '',
            'map79': '',
            'map80': '',
            'map81': '',
            'map82': '',
            'map83': '',
            'map84': '',
            'map85': '',
            'map86': '',
            'map87': '',
            'map88': '',
            'map89': '',
            'map90': '',
            'map91': '',
            'map92': '',
            'map93': '',
            'map94': '',
            'map95': '',
            'map96': '',
            'map97': '',
            'map98': '',
            'map99': '',
            'map100': '',
            'map101': '',
            'map102': '',
            'map103': '',
            'map104': '',
            'map105': '',
            'map106': '',
            'map107': '',
            'map108': '',
            'map109': '',
            'map110': '',
            'map111': '',
            'map112': '',
            'map113': '',
            'map114': '',
            'map115': '',
            'map116': '',
            'map117': '',
            'map118': '',
            'map119': '',
            'map120': '',
            'map121': '',
            'map122': '',
            'map123': '',
            'map124': '',
            'map125': '',
            'map126': '',
            'map127': '',
            'map128': '',
            'map129': '',
            'map130': '',
            'map131': '',
            'map132': '',
            'map133': '',
            'map134': '',
            'map135': '',
            'map136': '',
            'map137': '',
            'map138': '',
            'map139': ''
        });
    }

});