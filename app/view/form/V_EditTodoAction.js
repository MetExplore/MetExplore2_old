/**
 * edit/add a todoaction
 * Edit a todoaction, oar add it
 */
Ext.define('MetExplore.view.form.V_EditTodoAction', {

    extend: 'Ext.form.Panel',
    alias: 'widget.EditTodoAction',
    xtype: 'editTodoAction',

    //height: 200,
    width: 500,
    layout: {
        type: 'vbox',
        align: 'stretch',
        animate: true,
        padding: 5
    },
    constrainHeader: true,
    bodyStyle: 'background:transparent;',

    items: [],
    bbar: ['->', {
        xtype: 'button',
        text: 'Save',
        action: 'save'
    }, {
        xtype: 'button',
        text: 'Cancel',
        action: 'cancel'
    }],

    /**
     * Constructor
     * Get record (ie the reaction for which we want informations) and transmit to gridReactionIds
     */
    constructor: function(params) {
        var config = this.config;
        config.action = params.action;
        config.rec = params.rec;
        config.gridTD = params.gridTD;
        config.users = params.users;
        config.idTodo = params.idTodo,
            config.nameUser = params.nameUser,
            config.dataOrig = [{
                'id': params.idTodo,
                'todo': params.description,
                'idProject': params.project,
                'idUser': params.user,
                'limitDate': params.limitDate,
                'status': params.status
            }],

            config.items = [];
        params.projects.unshift({
            idProject: "-1",
            name: "None"
        });
        params.users["-1"] = [{
            name: MetExplore.globals.Session.nameUser,
            id: MetExplore.globals.Session.idUser
        }];
        var itemsArray = [];

        if (params.project != "") {
            var dataUsers = config.users[params.project];
        } else {
            var dataUsers = config.users[-1];
        }

        items = [{
            xtype: 'textfield',
            name: 'desc',
            fieldLabel: 'Description',
            value: params.description
        }, {
            xtype: 'combo',
            name: 'project',
            fieldLabel: 'Project',
            store: {
                model: 'MetExplore.model.Project',
                proxy: {
                    type: 'memory'
                },
                data: params.projects
            },
            displayField: 'name',
            valueField: 'idProject',
            editable: false,
            value: params.project,
            hidden: config.gridTD.type == "project"
        }, {
            xtype: 'combo',
            name: 'user',
            fieldLabel: 'User',
            store: {
                model: 'MetExplore.model.User',
                proxy: {
                    type: 'memory'
                },
                data: dataUsers
            },
            displayField: 'name',
            valueField: 'id',
            editable: false,
            value: params.user
        }, {
            xtype: 'datefield',
            name: 'limitDate',
            fieldLabel: 'Limit date',
            format: 'Y-m-d',
            value: params.limitDate,
            editable: false
        }, {
            xtype: 'combo',
            name: 'status',
            fieldLabel: 'Status',
            store: ['Not started', 'In progress', 'Done', 'Cancelled'],
            editable: false,
            value: params.status
        }, {
            xtype: 'combo',
            name: 'priority',
            fieldLabel: 'Priority',
            store: {
                fields: ['name', 'fullname'],
                data: [{
                        name: 'vhigh',
                        fullname: 'Very high'
                    }, {
                        name: 'high',
                        fullname: 'High'
                    }, {
                        name: 'normal',
                        fullname: 'Normal'
                    },
                    {
                        name: 'low',
                        fullname: 'Low'
                    }, {
                        name: 'vlow',
                        fullname: 'Very low'
                    }
                ]
            },
            displayField: 'fullname',
            valueField: 'fullname',
            editable: false,
            value: params.priority
        }];

        config.items = items;

        this.callParent([config]);

    }
});