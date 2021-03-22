Ext.define('MetExplore.view.grid.V_GridTodoList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridTodoList',
    config: {
        hiddenColumns: [] //List of columns to be hidden
    },

    multiSelect: true, //Accept multiple selection

    /**
     * Constructor of the view
     * @param {} params: parameters griven to the constructor
     */
    constructor: function(params) {
        var config = this.config;
        if (params.hiddenColumns != undefined) { //Get hidden columns
            config.hiddenColumns = params.hiddenColumns;
        } else {
            config.hiddenColumns = [];
        }

        if (params.store) //Bind given store, if any, to the grid
        {
            config.store = params.store;
            if (params.loadStore) { //Load the store if asked
                config.store.load({
                    params: {
                        idProject: params.idProject
                    },
                    callback: function() { //Filter the grid to show only personal todos at startup
                        this.clearFilter();
                        var idUser = MetExplore.globals.Session.idUser;
                        this.filter('idUser', idUser);
                    }
                })
            }
        }
        if (params.type) { //Get the "type" of the grid. Type permit to differentiate several instances of the same grid, and make unic toggleGroup for each instances
            config.type = params.type;
        } else {
            config.type = "generic";
        }

        config.bbar = [{
                xtype: 'button',
                action: 'refresh',
                tooltip: 'Refresh the TODO list',
                iconCls: 'refresh',
                margins: '0 2.5 0 0'
            }, '-', '->',
            { //Button to show only personal TODOs
                xtype: 'button',
                enableToggle: false,
                toggleGroup: 'todoView' + config.type, //to be unic
                text: 'Personal',
                cls: 'button-personal',
                action: 'todoListPersonal',
                width: 100,
                margins: '0 5 0 0',
                pressed: true
            }, { //Button to show all TODOs
                xtype: 'button',
                enableToggle: false,
                toggleGroup: 'todoView' + config.type,
                text: 'All',
                cls: 'button-all',
                action: 'todoListAll',
                width: 100
            }
        ];

        //Set columns:
        config.columns = [{
            text: 'Description',
            dataIndex: 'todo',
            flex: 3,
            sortable: true
        }, {
            text: 'Project',
            dataIndex: 'project',
            flex: 2,
            sortable: true,
            hidden: config.hiddenColumns.indexOf('project') != -1
        }, {
            text: 'User',
            dataIndex: 'user',
            width: 120,
            sortable: true
        }, {
            text: 'Limit date',
            dataIndex: 'limitDate',
            xtype: 'datecolumn',
            width: 70,
            sortable: true,
            format: 'Y-m-d'
        }, {
            text: 'Date ajout',
            dataIndex: 'dateAjout',
            width: 100,
            sortable: true,
            hidden: true,
            format: 'Y-m-d'
        }, {
            text: 'Status',
            dataIndex: 'status',
            width: 80,
            sortable: true
        }, {
            text: 'Priority',
            dataIndex: 'priority',
            width: 80,
            sortable: true,
            renderer: function(value, metadata, record) {
                switch (value) {
                    case "Normal":
                        metadata.style = "background-color:#F2F5A9;";
                        return value;
                    case "High":
                        metadata.style = "background-color:#FE9A2E;";
                        return value;
                    case "Very high":
                        metadata.style = "background-color:#FF0000;";
                        return value;
                    case "Low":
                        metadata.style = "background-color:#BEF781;";
                        return value;
                    case "Very low":
                        metadata.style = "background-color:#E6E6E6;";
                        return value;
                    default:
                        return value;
                }
            },
            doSort: function(state) { //Redefine sort by comparing sum of items instead of number of items
                var ds = this.up('grid').getStore();
                var field = this.getSortParam();
                ds.sort({
                    property: field,
                    direction: state,
                    sorterFn: function(v1, v2) {
                        v1 = v1.get(field);
                        v2 = v2.get(field);
                        order = ["Very low", "Low", "Normal", "High", "Very high"];
                        v1Index = order.indexOf(v1);
                        v2Index = order.indexOf(v2);
                        if (v1Index < v2Index) {
                            return -1;
                        } else if (v1Index > v2Index) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                });
            }
        }];

        //Call parent with all set config
        this.callParent([config]);
    },

    rbar: {
        // static!
        width: 35,
        items: [

            { //Button set ToDostarted
                xtype: 'button',
                text: '',
                cls: 'button-start',
                width: 25,
                height: 25,
                action: 'todoListStart',
                tooltip: 'Set selection <b>in progress</b>'
            }, { //Button set ToDostoped
                xtype: 'button',
                text: '',
                cls: 'button-stop',
                height: 25,
                action: 'todoListStop',
                tooltip: 'Set selection <b>not started</b>'
            }, { //Button set ToDodone
                xtype: 'button',
                text: '',
                cls: 'button-done',
                height: 25,
                action: 'todoListDone',
                tooltip: 'Set selection <b>done</b>'
            }, { //Button set ToDocancelled
                xtype: 'button',
                text: '',
                cls: 'button-cancel',
                height: 25,
                action: 'todoListCancelled',
                tooltip: 'Set selection <b>cancelled</b>'
            },
            '->',
            { //Button add new ToDolist
                xtype: 'button',
                text: '',
                height: 25,
                cls: 'button-plus',
                margins: '3 0 0 0',
                action: 'todoListPlus',
                tooltip: 'Add new TODO'
            }, { //Button deleteToDo
                xtype: 'button',
                height: 25,
                text: '',
                cls: 'button-minus',
                margins: '3 0 0 0',
                action: 'todoListMinus',
                tooltip: 'Delete selected TODOs'
            }
        ]
    },

    //Using viewconfig to set row background color in red while date is next to the limit date 
    viewConfig: {
        getRowClass: function(record, rowIndex, rowParams, store) {
            var limitDate = new Date(record.get('limitDate'));
            var diff = MetExplore.globals.Utils.daysBetween(new Date(Date.now()), limitDate);
            if (record.get('status') != 'Done' && record.get('status') != 'Cancelled' && diff < 5) return 'todoUrgent'; //We set as urgent if the diff between dates is 5 days
            else return 'todoNormal';
        }
    }

});