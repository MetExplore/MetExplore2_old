/**
 * gridReaction
 */

Ext.define('MetExplore.view.grid.V_gridReaction', {
    extend: 'MetExplore.view.grid.V_GenericGrid',
    alias: 'widget.gridReaction',
    store: 'S_Reaction',
    id: 'gridReaction',
    config: {
        name: 'gridReaction',
        typeObject: 'Reaction'
    },

    requires: ['MetExplore.globals.Session'],

    // impossible to put it in V_GenericGrid
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        }),
        {
            ptype: 'bufferedrenderer',
            pluginId: 'buffergridReaction'
        }
    ],
    // selType: 'cellmodel',
    // selModel: {
    //
    //     //checkOnly: true,
    //     mode: 'MULTI',
    //     //enableKeyNav: false
    // },
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
                tooltip: 'See more information on this Reaction'
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
                tooltip: 'See this Reaction in the source database website'
            }]
        }, {
            text: 'Name',
            flex: 3,
            hidden: false,
            sortable: true,
            dataIndex: 'name',
            search:'exact',
            items: [{
                xtype: 'searchtrigger',
                autoSearch: true,
                anyMatch: true
            }],
            editor: {
                allowBlank: false
            }
        }, {
            text: 'Identifier',
            flex: 2,
            hidden: false,
            sortable: true,
            search:'exact',
            items: [{
                xtype: 'searchtrigger',
                autoSearch: true,
                anyMatch: true
            }],
            dataIndex: 'dbIdentifier',
            // editor: {
            //     allowBlank: false
            // }
        }, {
            text: 'E.C.',
            flex: 1,
            sortable: true,
            dataIndex: 'ec',
            search:'exact',
            items: [{
                xtype: 'searchtrigger',
                autoSearch: true,
                anyMatch: true
            }],
            editor: {
                allowBlank: false
            }
        }, {
            text: 'GPR',
            dataIndex: 'gpr',
            hidden: true,
            //filter: true,
            flex: 3
        }, {
            text: 'Equation (names)',
            dataIndex: 'eqName',
            hidden: true,
            //filter: true,
            flex: 3
        }, {
            text: 'Equation (identifiers)',
            dataIndex: 'eqDB',
            hidden: true,
            //filter: true,
            flex: 3
        }, {
            text: 'Equation (formulas)',
            dataIndex: 'eqForm',
            hidden: true,
            //filter: true,
            flex: 3
        },
        //	{
        //		text     : 'Formula',
        //		width    : 150,
        //		sortable : false,
        //		//filter: true,
        //		dataIndex: 'formule',
        //		editor: {
        //			allowBlank: false
        //		}
        //	},
        //	{
        //		text     : 'hole',
        //		width    : 30,
        //		xtype	 : 'checkcolumn', 	
        //		sortable : true,
        //		filter: {type:'boolean'},
        //		dataIndex: 'hole',
        //		hidden:true,
        //		editor: {
        //			xtype: 'checkbox',
        //			cls: 'x-grid-checkheader-editor'
        //		}
        //	},
        {
            text: 'Reversible',
            width: 70,
            xtype: 'checkcolumn',
            sortable: true,
            type: 'bool',
            //filter: true,
            dataIndex: 'reversible',
            editor: {
                xtype: 'checkbox',
                cls: 'x-grid-checkheader-editor'
            }
        },
        {
            text: 'Flux Lower Bound',
            width: 70,
            sortable: true,
            //filter: true,
            dataIndex: 'lowerBound',
            editor: {
                allowBlank: false
            }
        },
        {
            text: 'Flux Upper Bound',
            width: 70,
            sortable: true,
            //filter: true,
            dataIndex: 'upperBound',
            editor: {
                allowBlank: false
            }
        }
    ],

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

            Ext.util.Cookies.clear('ext-gridReaction');

            // var storeR = Ext.getStore('S_Reaction');
            // storeR.addSupplDataReaction();
            // storeR.loadIdentifiersReaction();

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
    },


    /* top bar 
     * actions definis dans controller
     */
    tbar: {
        id: 'tbarReaction',
        //hidden: true,
        items: [{
                xtype: 'button',
                text: 'Add',
                action: 'add',
                tooltip: 'Add a new reaction to the network',
                type: 'edition',
                iconCls: 'add'
            }, {
                xtype: 'button',
                text: 'Edit',
                action: 'edit',
                tooltip: 'Edit selected reactions',
                type: 'edition',
                iconCls: 'reply'
            }, {
                xtype: 'button',
                text: 'Delete',
                action: 'ReactionDel',
                tooltip: 'Delete selected reactions',
                type: 'edition',
                iconCls: 'del'
            },
            '-',
            '  ',
            {
                xtype: 'button',
                text: 'Save',
                action: 'ReactionChange',
                tooltip: 'Save Modified Entries',
                type: 'edition',
                iconCls: 'save'
            }, {
                xtype: 'button',
                text: 'Multiple affectation',
                action: 'ReactionSetting',
                tooltip: 'Setting same value for ALL selected reactions',
                type: 'edition',
                iconCls: 'settings'
            }, '-', {
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
            }, {
                xtype: 'button',
                text: 'Equations',
                action: 'showEquations',
                tooltip: 'Show equations columns',
                iconCls: 'equation',

            },

            // alias lecture fichier tab
            {
                xtype: 'filefield',
                name: 'fileAliasReaction',
                buttonOnly: true,
                tooltip: 'Add aliases from txt file with Identifier and Alias Columns',
                //hideEmptyLabel: false,
                //hideLabel : true,
                //title:'Add aliases from txt file with Identifier and Alias Columns'
                buttonConfig: {
                    id: 'idImportAliasReaction',
                    text: 'Load Aliases',
                    tooltip: 'Add aliases from txt file with Identifier and Alias Columns',
                    iconCls: 'alias',
                    //     style :{
                    //         color: "transparent"},
                },

                //msgTarget: 'side',
                listeners: {

                    change: function(sender) {
                        //console.log(sender);
                        var form = this.up('gridReaction');
                        //console.log(form);

                        var file = form.down('filefield[name=fileAliasReaction]').getEl().down('input[type=file]').dom.files[0];
                        //console.log(file);

                        var reader = new FileReader();
                        reader.onload = (function(theFile) {
                            return function(e) {
                                //recuperation de la 1er ligne
                                var i = e.target.result.indexOf("\r\n");
                                var str = e.target.result.substring(0, i);
                                var res = str.split("\t");
                                //console.log(str);

                                if (res[0] == "dbIdentifier" || res[0] == "Identifier" || res[1] == "alias" || res[1] == "Alias" || res[0] == "Id") {
                                    //il y a en 1er lidne qqchose qui ressemble a des intitulé de colonne
                                    //donc on les change, on met les bon
                                    var strFile = "dbIdentifier\talias\r\n" + e.target.result.substring(i + 2);
                                    //console.log(strFile);
                                } else {
                                    //pas intitulé de colonne
                                    // mettre en 1er ligne dbIdentifier & alias
                                    var strFile = "dbIdentifier\talias\r\n" + e.target.result;
                                    //console.log(strFile);
                                }

                                var result = tsvJSON(strFile);
                                result = Ext.JSON.decode(result);
                                //console.log(result);
                                MetExplore.app.getController('C_Map').loadJsonAliases(result);

                            };
                        })(file);
                        reader.readAsBinaryString(file);
                        form.down('filefield[name=fileAliasReaction]').reset();
                    }
                }
            },
            // {
            //     xtype: 'button',
            //     text: 'Identifiers',
            //     action: 'showIdsReaction',
            //     tooltip: 'Show identifiers columns',
            //     iconCls: 'identifiers',
            //
            // }
            , '->', {
                iconCls: 'help',
                tooltip: 'Documentation for reactions grid',
                handler: function() {
                    MetExplore.app.getController('C_HelpRedirection').goTo('browse.php#reaction_grid');
                }
            }
        ]
    },


    initComponent: function() {

        this.callParent(arguments);
    }

});