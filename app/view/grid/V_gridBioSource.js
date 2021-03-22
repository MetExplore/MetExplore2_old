/**
 * gridBioSource
 */

Ext.define('MetExplore.view.grid.V_gridBioSource', {
    extend: 'MetExplore.view.grid.V_GenericGrid',
    title: 'BioSource',
    alias: 'widget.gridBioSource',

    requires: ['MetExplore.globals.Session'],

    //store:'S_BioSource',
    //id:'gridBioSource',
    name: 'mainGridBioSource',

    features: [{
        ftype: 'grouping',
        enableGroupingMenu: false,
        groupHeaderTpl: Ext.create('Ext.XTemplate',
            '{name:this.formatName}', {
                formatName: function(name) {

                    var newName = name;
                    if (name === '') {
                        newName = 'Undefined'
                    } else if (name === true || name === "2-public") {
                        newName = 'Public'
                    } else if (name === false || name === "0-private") {
                        newName = 'Private'
                    } else if (Ext.String.startsWith(name, "1-project:")) {
                        newName = 'Project: ' + name.substr(10);
                    }

                    return newName;
                }
            }
            ),
            startCollapsed: true
        },
        {
            menuFilterText  : 'Search',
            ftype : 'filters',
            local : true,
            autoReload: false
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
        sortable: false,
        items: [{
            icon: './resources/icons/info.svg',
            region: 'center',
            tooltip: 'See more information on this Biosource'
        }]
    }, {
        text: 'Id',
        width: 40,
        sortable: true,
        dataIndex: 'id'
    }, {
        text: 'Name',
        flex: 3,
        sortable: true,
        filter: {
            type: 'string'
        },
        dataIndex: 'nameBioSource'
    }, {
        text: 'Complete Name',
        flex: 4,
        hidden: true,
        sortable: true,
        filter: {
            type: 'string'
        },
        dataIndex: 'NomComplet'
    }, {
        text: 'Organism',
        flex: 3,
        sortable: true,
        filter: {
            type: 'string'
        },
        dataIndex: 'orgName'
    }, {
        text: 'Strain',
        flex: 1,
        sortable: true,
        filter: {
            type: 'string'
        },
        dataIndex: 'strain'
    }, {
        text: 'Tissue',
        flex: 2,
        hidden: true,
        sortable: true,
        filter: {
            type: 'string'
        },
        dataIndex: 'tissue'
    }, {
        text: 'Cell Type',
        flex: 2,
        hidden: true,
        sortable: true,
        filter: {
            type: 'string'
        },
        dataIndex: 'cellType'
    }, {
        text: 'Source Database',
        flex: 2,
        sortable: true,
        hidden:true,
        filter: {
            type: 'string'
        },
        dataIndex: 'dbSource'
    }, {
        text: 'URL',
        flex: 2,
        hidden: true,
        sortable: true,
        filter: {
            type: 'string'
        },
        dataIndex: 'dbUrl'
    }, {
        text: 'Id in Database',
        flex: 2,
        hidden: true,
        sortable: true,
        filter: {
            type: 'string'
        },
        dataIndex: 'IdinDBref'
    }, {
        text: 'Version',
        flex: 2,
        hidden: true,
        sortable: true,
        filter: {
            type: 'string'
        },
        dataIndex: 'dbVersion'
    }, {
        text: 'Database Type',
        flex: 2,
        sortable: true,
        hidden:true,
        filter: {
            type: 'string'
        },
        dataIndex: 'dbType'
    }, {
        text: 'Status',
        hidden:true,
        flex: 1,
        sortable: true,
        filter: {
            type: 'string'
        },
        dataIndex: 'public',
        renderer: function(myValue, myDontKnow, myRecord) {
            if (myValue) {
                return 'Public';
            } else {
                return 'Private';
            }
        }
    }, {
        text: 'Creation Date',
        xtype: 'datecolumn',
        sortable: true,
        dataIndex: 'dateAdd',
        hidden:true,
        renderer: function(value, metadata, record) {
            if (value && value != "0000-00-00 00:00:00") {
                metadata.tdAttr = 'data-qtip="' + value + '"';
                return value.split(/\s/)[0];
            } else {
                return "unknown";
            }
        }
    }, {
        text: 'Last modification',
        xtype: 'datecolumn',
        flex: 2,
        sortable: true,
        hidden:true,
        dataIndex: 'lastModification',
        renderer: function(value, metadata, record) {
            if (value && value != "0000-00-00 00:00:00") {
                metadata.tdAttr = 'data-qtip="' + value + '"';
                return value.split(/\s/)[0];
            } else {
                return "unknown";
            }
        }
    }, {
        text: 'Publication',
        flex: 1,
        sortable: true,
        filter: {
            type: 'string'
        },
        dataIndex: 'biblio',
        renderer: function(myValue, myDontKnow, myRecord) {
            if (myValue) {
                var arrayOfStrings = myValue.split("-"),
                    stringtoreturn = "";

                for (var i = 0; i < arrayOfStrings.length; i++) {
                    if (arrayOfStrings[i] != "") {
                        var data = arrayOfStrings[i].split("|");
                        if (data[1] != "") {
                            stringtoreturn += '<a target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/?term=' + data[0] + '">' + data[1] + '</a>, ';
                        } else {
                            stringtoreturn += '<a target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/?term=' + data[0] + '">' + data[0] + '</a>, ';
                        }
                    }
                }
                return stringtoreturn;
            }
        }
    },{
        text     : 'Nb Metabolites',
        dataIndex: 'nbMetab'
    },{
        text     : 'Nb Genes',
        dataIndex: 'nbGene'
    }
    /*
        {

            text     : 'Coverage hmdb',
            dataIndex: 'fs',

        },*/
        // {
        //
        //     text     : 'Coverage',
        //     dataIndex: 'fs',
        //     items: [{
        //         xtype: 'combobox',
        //         store:[ 'bigg','chebi', 'hmdb', 'inchikey','kegg', 'lipidmaps','metacyc','metanetx', 'smiles', 'pubchem', 'seed', 'smiles'],
        //
        //         padding: 2,
        //         flex: 1
        //     }]

    //}
    ],
    listeners: {
        viewready: function (grid) {
            Ext.util.Cookies.clear('ext-gridBioSource');
        }
    },

    initComponent: function() {

        var me = this;
        var theStore = Ext.create('MetExplore.store.S_gridBioSource', {
            storeId: "S_gridBioSource"
        });
        Ext.apply(me, {
            store: theStore
        });

        //Set tbar:
        this.tbar = {
            id: 'tbarBioSource',
            items: ['You can change the grouping option here: ', {
                xtype: 'checkboxfield',
                name: 'groupfields',
                boxLabel: 'Group Table',
                checked: true,
                handler: function() {
                    var grid = this.up('gridBioSource');
                    if (this.getValue()) {


                        var groupName = this.nextSibling('combobox').getValue();

                        grid.getView().features[0].enable();

                        if (!groupName && MetExplore.globals.Session.idUser == '-1') {
                            grid.getStore().group('orgName');
                            grid.getStore().sort('orgName', 'ASC');
                            grid.getView().features[0].collapseAll();
                        } else if (!groupName) {
                            grid.getStore().group('groupNameProject');
                            grid.getStore().sort('groupNameProject', 'ASC');
                            grid.getView().features[0].collapseAll();
                        } else {
                            grid.getStore().group(groupName);
                            grid.getStore().sort(groupName, 'ASC');
                            grid.getView().features[0].collapseAll();
                        }

                    } else {
                        grid.getStore().clearGrouping();
                        grid.getView().features[0].disable();
                    }
                }
            }, '  ', {
                xtype: 'combobox',
                fieldLabel: 'Group by',
                name: 'groupfields',
                store: {
                    fields: ['ColumnName', 'field'],
                    data: [
                        // {
                        //     'ColumnName': 'Name',
                        //     'field': 'nameBioSource'
                        // },
                        // {
                        //     'ColumnName': 'Complete Name',
                        //     'field': 'NomComplet'
                        // },
                        {
                            'ColumnName': 'Organism',
                            'field': 'orgName'
                        },
                        {
                            'ColumnName': 'Source Database',
                            'field': 'dbSource'
                        },
                        {
                            'ColumnName': 'Database Type',
                            'field': 'dbType'
                        },
                        {
                            'ColumnName': 'Status',
                            'field': 'public'
                        },
                        {
                            'ColumnName': 'Projects',
                            'field': 'groupNameProject'
                        }
                    ]
                },
                displayField: 'ColumnName',
                valueField: 'field',
                listeners: {
                    select: function() {
                        var grid = this.up('gridBioSource');
                        var checkValue = this.previousSibling('checkboxfield').getValue();

                        if (!checkValue && this.getValue()) {
                            this.up().down('checkboxfield').setValue(true);
                        } else if (this.getValue()) {
                            grid.getView().features[0].enable();
                            grid.getStore().group(this.getValue());
                            grid.getStore().sort(this.getValue(), 'ASC');
                            grid.getView().features[0].collapseAll();
                        }
                    }
                }
            }, {
                xtype: 'button',
                text: 'Expand All',
                handler: function() {
                    var grid = this.up('gridBioSource');
                    grid.getView().features[0].expandAll();
                }
            }, {
                xtype: 'button',
                text: 'Collapse All',
                handler: function() {
                    var grid = this.up('gridBioSource');
                    grid.getView().features[0].collapseAll();
                }
            }, '->', {
                xtype: 'button',
                action: 'refresh',
                tooltip: 'Refresh the list of available Biosources',
                iconCls: 'refresh'
            }, {
                iconCls: 'help',
                tooltip: 'Documentation for biosources grid',
                handler: function() {
                    MetExplore.app.getController('C_HelpRedirection').goTo('browse.php#biosource_grid');
                }
            }]

        };

        me.callParent();

    },

});