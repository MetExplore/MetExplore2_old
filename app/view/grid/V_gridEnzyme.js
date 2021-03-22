/**
 * gridEnzyme
 */
Ext.define('MetExplore.view.grid.V_gridEnzyme', {
    extend: 'MetExplore.view.grid.V_GenericGrid',
    alias: 'widget.gridEnzyme',
    store: 'S_Enzyme',
    title: 'Enzymatic Complex',
    config: {
        name: 'gridEnzyme',
        typeObject: 'Enzyme'
    },
    // impossible to put it in V_GenericGrid
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        }),
        {
            ptype: 'bufferedrenderer',
            pluginId: 'buffergridEnzyme'
        }
    ],


    columns: [{
            xtype: 'rownumberer',
            width: 50,
            sortable: false
        }, {
            xtype: 'actioncolumn',
            header: '',
            menuText: 'info',
            action: 'seeInfos',
            dataIndex: 'seeInfos',
            width: 20,
            sortable: false,
            items: [{
                icon: './resources/icons/info.svg',
                region: 'center',
                tooltip: 'See more information on this Enzyme'
            }]

        },
        //        	{
        //                text     : 'id',
        //                width    : 20,
        //                flex     : 1,
        //                sortable : true,
        //                dataIndex: 'id'
        //             },
        {
            text: 'Name',
            flex: 1,
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
            width: 250,
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
        id: 'tbarEnzyme',
        //hidden: true,
        items: [{
                xtype: 'button',
                text: 'Add',
                action: 'add',
                tooltip: 'Add a new Enzyme to the network',
                type: 'edition',
                iconCls: 'add'
            }, {
                xtype: 'button',
                text: 'Edit',
                action: 'edit',
                tooltip: 'Edit selected Enzymes',
                type: 'edition',
                iconCls: 'reply'
            }, {
                xtype: 'button',
                text: 'Delete',
                action: 'del',
                tooltip: 'Delete selected Enzymes',
                type: 'edition',
                iconCls: 'del'
            }, '-', {
                xtype: 'button',
                text: 'Curation Votes',
                action: 'summaryVotes',
                tooltip: 'Show summary of votes in a new column',
                iconCls: 'summaryVotes'
            }
            //    	  '  ',
            //    	  {
            //    		  xtype:'button',
            //    		  text: 'Commit Changes',
            //    		  action:'EnzymeChange',
            //    		  tooltip:'Save Modified Entries',
            //    		  iconCls:'save'
            //    	  },{
            //    		  xtype:'button',
            //    		  text: 'Multiple affectation',
            //    		  action:'EnzymeSetting',
            //    		  tooltip:'Setting same value for ALL selected Enzymes',
            //    		  iconCls:'settings'
            //    	  }
            , '->', {
                iconCls: 'help',
                tooltip: 'Documentation for enzymes grid',
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
            Ext.util.Cookies.clear('ext-gridEnzyme');

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