/**
 * PATHWAY
 * Creation des grid     
 * definition des grid panel pour chaque store
 * colonne action (ex: Del/Add)
 * plugin edition / drag&drop
 * barre action (ex: commit) 
 */
Ext.define('MetExplore.view.grid.V_gridPathway', {
    extend: 'MetExplore.view.grid.V_GenericGrid',
    alias: 'widget.gridPathway',
    id: 'gridPathway',
    config: {
        name: 'gridPathway',
        typeObject: 'Pathway'
    },
    store: 'S_Pathway',
    //canEditValues: false,

    requires: ['MetExplore.globals.Session'],

    // impossible to put it in V_GenericGrid
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        }),
        {
            ptype: 'bufferedrenderer',
            pluginId: 'buffergridPathway'
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
                tooltip: 'See more information on this Pathway'
                /*handler: function(grid, rowIndex, colIndex, item, e, record, row) 
					 {
						 grid.up('panel').fireEvent("viewInfos", record,rowIndex);
			 	 	 }*/
            }]
        }, {
            xtype: 'actioncolumn',
            header: '',
            menuText: 'external info',
            width: 20,
            action: 'openLinkInDB',
            dataIndex: 'linkToDB',
            sortable: false,
            items: [{
                icon: './resources/icons/link.png',
                region: 'center',
                tooltip: 'See this Pathway in the source database website'
            }]
        }, {
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
            // editor		: {
            // 	allowBlank: false
            // }
        }, {
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
        }, {
            text: 'Nb Reactions',
            width: 80,
            sortable: true,
            dataIndex: 'nbReaction',
            hidden: true
        }, {
            text: 'Nb Reactions with Enz.',
            width: 130,
            sortable: true,
            // filter: {
            //     type: 'int'
            // },
            dataIndex: 'nbReactionWithEnz',
            hidden: true
        }, {
            text: '% Reactions with Enz',
            width: 130,
            sortable: true,
            // hidden: true,
            // filter: {
            //     type: 'int'
            // },
            dataIndex: 'completeness',
            renderer: function(value) {
                if (value == -1) {
                    return '<span class="veryLowCompletude">NA</span>';
                }
                if (value < 25 || isNaN(value)) {
                    return '<span class="veryLowCompletude">' + value + ' %</span>';
                } else if (value < 50) {
                    return '<span class="lowCompletude">' + value + ' %</span>';
                } else if (value < 75) {
                    return '<span class="mediumCompletude">' + value + ' %</span>';
                } else {
                    return '<span class="highCompletude">' + value + ' %</span>';
                }
            }
        }
        /*,{
        	text      : 'More info',
        	width	  : 60,
        	sortable  : false,
        	dataIndex : 'databaseLink',
        	hidden    : true
        },*/
        /*{
        	id        : 'confidence',
        	header    : 'Confidence',
        	dataIndex : 'confidence',
           width	  : 70,
           align     : 'right',
           hidden    : true,
           editor	  : {
           	xtype	  : 'numberfield'
           }
        },*/
        //	         {
        //	        	 text : 'Metabolite Coverage',
        //	        	 dataIndex : 'metaboliteCoverage',
        //	        	 filterable : true,
        //	        	 flex     : 1,
        //	        	 //width: 100,                                  
        //	        	 sortable : true,',
        //	             editable  : false,
        //	        	 hidden:true,
        //	        	 renderer: Ext.util.Format.numberRenderer('00.00 %')
        //	         },
        // {
        // header:'',
        // text : 'Nb Metabolites',
        // dataIndex : 'metaboliteNb',
        // filterable : true,
        // flex     : 1,
        // sortable : true,
        // hidden:true
        // }
    ],

    tbar: {
        id: 'tbarPathway',
        //hidden: true,
        items: [{
                xtype: 'button',
                text: 'Add',
                action: 'add',
                tooltip: 'Add a new Pathway to the network',
                type: 'edition',
                iconCls: 'add'
            }, {
                xtype: 'button',
                text: 'Edit',
                action: 'edit',
                tooltip: 'Edit selected Pathways',
                type: 'edition',
                iconCls: 'reply'
            }, {
                xtype: 'button',
                text: 'Delete',
                action: 'del',
                tooltip: 'Delete selected Pathways',
                type: 'edition',
                iconCls: 'del'
            },
            '-',
            {
                xtype: 'button',
                text: 'Curation Statistics',
                action: 'statistics',
                tooltip: 'Show statistics about Pathways',
                iconCls: 'statistics'
            }, {
                xtype: 'button',
                text: 'Curation Votes',
                action: 'summaryVotes',
                tooltip: 'Show summary of votes in a new column',
                iconCls: 'summaryVotes'
            }
            //	        	  ,'-'
            //	        	  ,'  ',{
            //	        		  xtype:'button',
            //	        		  text: 'Commit Changes',
            //	        		  action:'PathwayChange',
            //	        		  tooltip:'Save Modified Entries',
            //	        		  iconCls:'save'
            //	        	  },{
            //
            //	        		  xtype:'button',
            //	        		  text: 'Multiple affectation',
            //	        		  action:'PathwaySetting',
            //	        		  tooltip:'Setting same value for ALL selected Pathways',
            //	        		  iconCls:'settings'
            //	        	  
            //	        	  }
            , '->',
            // {
            //     iconCls: 'help',
            //     tooltip: 'Documentation for pathways enrichment',
            //     //disabled : true,
            //     //id : 'linkenrich',
            //     handler: function() {
            //         MetExplore.app.getController('MetExplore.controller.C_HelpRedirection').goTo('mapping.php#mappingResults');
            //     }
            // },
            {
                iconCls: 'help',
                tooltip: 'Documentation for pathways grid',
                handler: function() {
                    MetExplore.app.getController('C_HelpRedirection').goTo('browse.php#pathway_grid');
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

            Ext.util.Cookies.clear('ext-gridPathway');

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