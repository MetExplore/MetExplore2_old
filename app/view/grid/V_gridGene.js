/**
 * gridGene
 */
Ext.define('MetExplore.view.grid.V_gridGene', {
    extend: 'MetExplore.view.grid.V_GenericGrid',
    store: 'S_Gene',
    title: 'Genes',
    alias: 'widget.gridGene',
    id: 'gridGene',
    config: {
        name: 'gridGene',
        typeObject: 'Gene'
    },

    // impossible to put it in V_GenericGrid
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        }),
        {
            ptype: 'bufferedrenderer',
            pluginId: 'buffergridGene'
        }
    ],

    columns: [{
            xtype: 'rownumberer',
            width: 50,
            sortable: false
        }, {
            xtype: 'actioncolumn',
            menuText: 'info',
            header: '',
            width: 20,
            action: 'seeInfos',
            dataIndex: 'seeInfos',
            sortable: false,
            items: [{
                icon: './resources/icons/info.svg',
                region: 'center',
                tooltip: 'See more information on this Gene'
            }]
        }, {
            header: '',
            xtype: 'actioncolumn',
            menuText: 'external info',
            width: 20,
            dataIndex: 'linkToDB',
            action: 'openLinkInDB',
            sortable: false,
            items: [{
                icon: './resources/icons/link.png',
                region: 'center',
                tooltip: 'See this Gene in the source database website'
            }]
        },
        //	                   {
        //	                   text     : 'id',
        //	                   width    : 20,
        //	                   flex     : 1,
        //	                   sortable : true,
        //	                   hidden:true,
        //	                   dataIndex: 'id'
        //	                   },
        {
            text: 'Name',
            flex: 3,
            sortable: true,
            search:'exact',
            items:[{
                xtype: 'searchtrigger',
                autoSearch: true,
                anyMatch:true
            }],
            dataIndex: 'name'
        },
        {
            text: 'Identifier',
            flex: 2,
            sortable: true,
            search:'exact',
            items:[{
                xtype: 'searchtrigger',
                autoSearch: true,
                anyMatch:true
            }],
            dataIndex: 'dbIdentifier'
        }

    ],
    tbar: {
        id: 'tbarGene',
        //hidden: true,
        items: [{
                xtype: 'button',
                text: 'Add',
                action: 'add',
                tooltip: 'Add a new Gene to the network',
                type: 'edition',
                iconCls: 'add'
            }, {
                xtype: 'button',
                text: 'Edit',
                action: 'edit',
                tooltip: 'Edit selected Genes',
                type: 'edition',
                iconCls: 'reply'
            }, {
                xtype: 'button',
                text: 'Delete',
                action: 'del',
                tooltip: 'Delete selected Genes',
                type: 'edition',
                iconCls: 'del'
            }, '-', {
                xtype: 'button',
                text: 'Curation Votes',
                action: 'summaryVotes',
                tooltip: 'Show summary of votes in a new column',
                iconCls: 'summaryVotes'
            },
            // {
            //     xtype: 'button',
            //     text: 'Identifiers',
            //     action: 'showIdsGene',
            //     tooltip: 'Show identifiers columns',
            //     iconCls: 'identifiers',
            //
            // }
            , '->', {
                iconCls: 'help',
                tooltip: 'Documentation for genes grid',
                handler: function() {
                    MetExplore.app.getController('C_HelpRedirection').goTo('browse.php#other_grid');
                }
            }
        ]
    },
    listeners: {

        cellclick: function(grid, td, cellIndex, record, tr, rowIndex) {
            gRow = rowIndex;
            gCol = cellIndex;
            //console.log(cellIndex);
        },

        /*
         * ctrl C :
         * ajout d'une zone text contenant les infos du store correspondant dans le document
         * faire focus sur cette zone / faire select
         */
        viewready: function(grid) {

            Ext.util.Cookies.clear('ext-gridGene');

            // var storeG = Ext.getStore('S_Gene');
            // storeG.addSupplDataGene();
            // storeG.loadIdentifiersGene();
            var map = new Ext.KeyMap(grid.getEl(), [{
                key: "c",
                ctrl: true,
                fn: function(keyCode, e) {

                    var recs = grid.getSelectionModel().getSelection();

                    if (recs && recs.length != 0) {

                        var clipText = grid.getCsvDataFromRecs(recs, grid.fieldCol(gCol));
                        var ta = document.createElement('textarea');

                        ta.id = 'cliparea';
                        ta.style.position = 'absolute';
                        ta.style.left = '1000px';
                        ta.style.top = '1000px';
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
            }]);
        }
    },

    /*
     * creation csv pour copy to excel
     */
    getCsvDataFromRecs: function(records, field) {

        var grid = this;
        var clipText = '';
        var currentStore = grid.getStore();
        var currRow = currentStore.find('id', records[0].data.id);

        for (var i = 0; i < records.length; i++) {

            var index = currentStore.find('id', records[i].data.id);
            var r = index;
            var rec = records[i];
            var cv = grid.columns;

            var val = rec.data[field];
            clipText = clipText.concat("\n", val);
        }
        return clipText;
    }

});