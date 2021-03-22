/**
 * gridMetabolite
 */
Ext.define('MetExplore.view.grid.V_gridMetabolite', {
    extend: 'MetExplore.view.grid.V_GenericGrid',
    store: 'S_Metabolite',
    title: 'Metabolites',
    requires: ['MetExplore.view.form.V_Search','MetExplore.view.form.V_SearchFuzzy'],
    alias: 'widget.gridMetabolite',
    id: 'gridMetabolite',

    config: {
        name: 'gridMetabolite',
        typeObject: 'Metabolite'
    },
    // impossible to put it in V_GenericGrid
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        }),
        {
            ptype: 'bufferedrenderer',
            pluginId: 'buffergridMetabolite'
        }
    ],
    // features : [{
    // menuFilterText  : 'Search',
    // ftype : 'filters',
    // local : true
    // }],
    //		{
    //		ptype : 'cellediting',
    //		clicksToEdit: 2
    //		},

    //stateId: 'stateGrid',


    columns: [{
            xtype: 'rownumberer',
            width: 50,
            sortable: false
        },
        {
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
                tooltip: 'See more information on this Metabolite'
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
			sortable: true,
            search:'fuzzy',
            dataIndex: 'name',
            editor: {
                allowBlank: false
            },
			//bodyPadding: 30,
            items:[{
                xtype: 'searchfuzzytrigger',
                autoSearch: true,
                anyMatch:true
            }],
            // items:[{
            //     xtype: 'textfield',
            //     name: 'nameSearch',
				// id:'nameSearch',
				// //labelAlign:'right',
            //     //fieldLabel: 'Name',
				//             flex: 3,
            //
            //     listeners:{
            //         'change': function(field){
            //             //console.log('test',field);
            //             if (field.value.length>0)
            //                 MetExplore.app.getController('C_gridMetabolite').fuzzysearch(field.value);
            //         }
            //     }
				//
            // }, {
            //     xtype: 'button',
            //     action: 'SearchDel',
            //     //tooltip: 'del search',
            //     iconCls: 'del',
				// width:22,
				// //padding:'10 5 3 10'
            // }],


        }, {
            text: 'Identifier',
            flex: 2,
            search:'exact',
            sortable: true,
           // filter: true,
            items:[{
                xtype: 'searchtrigger',
                autoSearch: true,
                anyMatch:true
            }],
            dataIndex: 'dbIdentifier',
            // editor: {
            //     allowBlank: false
            // }

        },

        {
            text: 'Formula',
            flex: 1,
            sortable: true,
            search:'exact',
            items:[{
                xtype: 'searchtrigger',
                autoSearch: true,
                anyMatch:true
            }],

            dataIndex: 'chemicalFormula',
            editor: {
                allowBlank: false
            }

        },
        {
            text: 'Compartment',
            search:'exact',
            flex: 1,
            sortable: true,
            //filter: true,
            items:[{
                xtype: 'searchtrigger',
                autoSearch: false,
                anyMatch:true
            }],

            dataIndex: 'compartment'

        },
        {
            text: 'Monoisotopic Mass',
            xtype: 'numbercolumn',
            format: '0.000000000000000',
            flex: 1,
            sortable: true,
            //filter: true,
            dataIndex: 'weight',
            align: 'right',
            hidden:true,
            editor: {
                allowBlank: false
            }
        }, {
            text: 'Average Mass',
            xtype: 'numbercolumn',
            format: '0.000000000000000',
            flex: 1,
            sortable: true,
            //filter: true,
            //hidden : true, si on met hidden la colonne n'est pas editable pourquoi?? (plutot faire setvisible afterrender)
            hidden:true,
            dataIndex: 'averageMass',

            align: 'right',
            editor: {
                allowBlank: false
            }
        },
        {
            text: 'Side compound',
            width: 55,
            xtype: 'checkcolumn',
            sortable: true,
            type: 'bool',
            //filter: true,
            dataIndex: 'sideCompound',
            //id		 : 'side',
            editor: {
                xtype: 'checkbox',
                cls: 'x-grid-checkheader-editor'
            }
        },
        {
            text: 'Boundary condition',
            width: 55,
            xtype: 'checkcolumn',
            sortable: true,
            type: 'bool',
            hidden:true,
            dataIndex: 'boundary',
            editor: {
                xtype: 'checkbox',
                cls: 'x-grid-checkheader-editor'
            }
        },
        //		{
        //		text     : 'topology',
        //		//width    : 250,
        //		sortable : true,
        //		//filter: true,
        //		dataIndex: 'topo',
        //		hidden	 : true,
        //		renderer: function(value){ if (value>0 && value<10){
        //		return '<img src=resources/images/topo_metabolite/topo' + value + '.svg />';
        //		}
        //		}

        //		},
        // {
        //     text: 'InChI',
        //     dataIndex: 'inchi',
        //     hidden: true,
        //    // filter: true,
        //     flex: 3,
        //     items:[{
        //         xtype: 'searchtrigger',
        //         autoSearch: true,
        //         anyMatch:true
        //     }],
        // },
        // {
        //     text: 'InchiKey',
        //     dataIndex: 'inchikey',
        //     hidden: true,
        //     //filter: true,
        //     flex: 3,
        //     items:[{
        //         xtype: 'searchtrigger',
        //         autoSearch: true,
        //         anyMatch:true
        //     }],
        // }
    ],


    tbar: {
        id: 'tbarMetabolite',
        //hidden: true,
        items: [{
                xtype: 'button',
                text: 'Add',
                action: 'add',
                tooltip: 'Add a new Metabolite to the network',
                type: 'edition',
                iconCls: 'add'
            }, {
                xtype: 'button',
                text: 'Edit',
                action: 'edit',
                tooltip: 'Edit selected Metabolites',
                type: 'edition',
                iconCls: 'reply'
            }, {
                xtype: 'button',
                text: 'Delete',
                action: 'del',
                tooltip: 'Delete selected Metabolites',
                type: 'edition',
                iconCls: 'del'
            }, '-', {
                xtype: 'button',
                text: 'Curation Votes',
                action: 'summaryVotes',
                tooltip: 'Show summary of votes in a new column',
                iconCls: 'summaryVotes'
            },
            '-',
            {
                xtype: 'button',
                text: 'Save',
                action: 'MetaboliteChange',
                tooltip: 'Save Modified Entries',
                type: 'edition',
                iconCls: 'save'
            }, {
                xtype: 'button',
                text: 'Multiple affectation',
                action: 'MetaboliteSetting',
                tooltip: 'Setting same value for ALL selected Metabolites',
                type: 'edition',
                iconCls: 'settings'
            },
            {
                xtype: 'filefield',
                name : 'fileAliasMetabolite',
                buttonOnly: true,
                //hideEmptyLabel: false,
                //hideLabel : true,
                title:"",
                // style :{
                //     opacity: "0", position: "absolute"}, //title:'Add aliases from txt file with Identifier and Alias Columns'
                buttonConfig: {
                    id: 'idImportAliasMetabolite',
                    text: 'Load Aliases',
                    tooltip: 'Add aliases from txt file with Identifier and Alias Columns',
                    iconCls: 'alias',

                },

                //msgTarget: 'side',
                listeners: {

                    change : function(sender) {
                        //console.log(sender);
                        var form = this.up('gridMetabolite');
                        //console.log(form);
                        var file = form.down('filefield[name=fileAliasMetabolite]').getEl().down('input[type=file]').dom.files[0];
                        //console.log(file);
                        var reader = new FileReader();
                        reader.onload = (function(theFile) {
                            return function(e) {
                                //recuperation de la 1er ligne
                                var i= e.target.result.indexOf("\r\n");
                                var str= e.target.result.substring(0,i);
                                var res= str.split("\t");

                                if (res[0]=="dbIdentifier" || res[0]=="Identifier" || res[1]=="alias" || res[1]=="Alias" || res[0]=="Id") {
                                    //il y a en 1er lidne qqchose qui ressemble a des intitulé de colonne
                                    //donc on les change, on met les bon
                                    var strFile= "dbIdentifier\talias\r\n"+e.target.result.substring(i+2);
                                    //console.log(strFile);
                                } else {
                                    //pas intitulé de colonne
                                    // mettre en 1er ligne dbIdentifier & alias
                                    var strFile= "dbIdentifier\talias\r\n"+e.target.result;
                                    //console.log(strFile);
                                }

                                var result= tsvJSON(strFile);
                                result= Ext.JSON.decode(result);
                                //console.log(result);
                                MetExplore.app.getController('C_Map').loadJsonAliases(result);

                            };
                        })(file);
                        reader.readAsBinaryString(file);
                        form.down('filefield[name=fileAliasMetabolite]').reset();
                    }
                }
            },
            // {
            //     xtype: 'button',
            //     text: 'Identifiers',
            //     action: 'showIdsMetabolite',
            //     tooltip: 'Show identifiers columns',
            //     iconCls: 'identifiers',
            //
            // },
			'->', {
                iconCls: 'help',
                tooltip: 'Documentation for metabolites grid',
                handler: function() {
                    MetExplore.app.getController('C_HelpRedirection').goTo('browse.php#metabolite_grid');
                }
            }
        ]
    },

    // viewConfig: {
    //     listeners: {
    //         viewready: function (view) {
    //             Ext.get(view.getNode(1)).addCls('id-cell');
    //         }
    //     }
    // },
    listeners: {
//         filterupdate:function(eventname, args, arg2) {
//             console.log(eventname);
//     console.log(args);
//     console.log(arg2);
// },

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
            //Ext.get(grid.getNode(1)).addCls('id-cell');
            //console.log("view ready");
            //var storeM = Ext.getStore('S_Metabolite');
            //storeM.addSupplDataMetabolite();
            //storeM.loadIdentifiersMetabolite();
            Ext.util.Cookies.clear('ext-gridMetabolite');

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