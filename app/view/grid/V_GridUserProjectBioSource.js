/**
 * gridBioSource of one user
 */

Ext.define('MetExplore.view.grid.V_GridUserProjectBioSource', {
    extend: 'MetExplore.view.grid.V_GenericGrid',
    alias: 'widget.gridUserProjectBioSource',
    config: {
        groupEl: false
    },

    requires: ['MetExplore.globals.Session'],

    columns: [],

    features: [{
        ftype: 'grouping',
        groupHeaderTpl: Ext.create('Ext.XTemplate', '{name:this.formatName}', {
            formatName: function(name) {
                var newName = name;
                if (name == true || name == "2-public") {
                    newName = 'Public';
                } else if (name == false || name == "0-private") {
                    newName = 'Private';
                } else if (name.substr(0, 10) == "1-project:") {
                    newName = 'Project: ' + name.substr(10);
                }
                return newName;
            }
        }),
        startCollapsed: true
    }],

    constructor: function(params) {
        var config = this.config;
        config.name = params.name;
        config.groupEl = params.groupEl == undefined ? true : params.groupEl;
        if (params.hiddenColumns) {
            config.hiddenColumns = params.hiddenColumns;
        }
        if (params.store) {
            config.store = params.store;
        }

        config.bbar = {
            items: [{
                xtype: 'button',
                action: 'refresh',
                tooltip: 'Refresh the list of available Biosources',
                iconCls: 'refresh'
            }, '-']
        };

        if (params.bbar != undefined) {
            config.bbar.items = config.bbar.items.concat(params.bbar.items);
        }

        this.callParent([config]);
    },

    initComponent: function() {
        this.columns = [{
            xtype: 'rownumberer',
            width: 50,
            sortable: false,
            hidden: this.hiddenColumns.indexOf('rownumberer') != -1
        }, {
            xtype: 'actioncolumn',
            menuText: '',
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
            dataIndex: 'id',
            hidden: this.hiddenColumns.indexOf('id') != -1
        }, {
            text: 'Name',
            flex: 3,
            sortable: true,
            filter: {
                type: 'string'
            },
            dataIndex: 'nameBioSource',
            hidden: this.hiddenColumns.indexOf('name') != -1
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
            dataIndex: 'orgName',
            hidden: this.hiddenColumns.indexOf('orgName') != -1
        }, {
            text: 'Strain',
            flex: 2,
            sortable: true,
            filter: {
                type: 'string'
            },
            dataIndex: 'strain',
            hidden: this.hiddenColumns.indexOf('strain') != -1
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
            flex: 1,
            sortable: true,
            filter: {
                type: 'string'
            },
            dataIndex: 'dbSource',
            hidden: this.hiddenColumns.indexOf('dbSource') != -1
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
            flex: 1,
            sortable: true,
            filter: {
                type: 'string'
            },
            dataIndex: 'dbType',
            hidden: this.hiddenColumns.indexOf('dbType') != -1
        }, {
            text: 'Status',
            flex: 1,
            sortable: true,
            filter: {
                type: 'string'
            },
            dataIndex: 'public',
            hidden: this.hiddenColumns.indexOf('status') != -1,
            renderer: function(myValue, myDontKnow, myRecord) {
                if (myValue) {
                    return 'Public';
                } else {
                    return 'Private';
                }
            }
        }, {
            text: 'Project',
            dataIndex: 'project',
            hidden: this.hiddenColumns.indexOf('project') != -1
        }, {
            text: 'Creation Date',
            xtype: 'datecolumn',
            sortable: true,
            hidden: true,
            dataIndex: 'dateAdd',
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
            sortable: true,
            hidden: true,
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
            hidden: this.hiddenColumns.indexOf('biblio') != -1,
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
        }];

        this.callParent();
    },

    listeners: {
        afterrender: function(grid) {
            if (!grid.groupEl) {
                grid.getView().features[0].disable(); //The only one manner to disable groups without bugs is to do it on afterrender
            }
        }
    }

});