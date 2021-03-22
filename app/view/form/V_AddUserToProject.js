/**
 * add users to a project
 */
Ext.define('MetExplore.view.form.V_AddUserToProject', {

    extend: 'Ext.form.Panel',
    alias: 'widget.addUserToProject',
    layout: {
        type: 'hbox',
        align: 'stretch',
        animate: true,
        padding: 5
    },
    constrainHeader: true,

    border: false,
    defaults: {
        border: false
    },

    requires: ['MetExplore.view.grid.V_GridUsersInProject'],

    items: [],

    /**
     * Constructor
     * Initialize components of the view
     */
    constructor: function(params) {
        var config = this.config;
        config.action = params.action;
        if (params.idProject != undefined)
            config.idProject = params.idProject;
        else if (params.idBioSource != undefined)
            config.idBioSource = params.idBioSource;
        config.access = params.access;

        //Nb to make all ids unic for each instance (in the case of several instances)
        config.nbInstance = 0;
        Ext.each(Ext.ComponentQuery.query('addUserToProject'), function(instance) {
            if (instance.nbInstance >= config.nbInstance) {
                config.nbInstance = instance.nbInstance + 1;
            }
        });

        items = [{
            xtype: 'panel',
            flex: 1,
            layout: 'fit',
            items: [{
                xtype: 'gridUsersInProject',
                action: config.action,
                users: params.users,
                type: 'inAddUserForm',
                editMenu: true,
                pluginId: 'bufferGridUsersInProject' + (3 + config.nbInstance).toString(),
                storeId: 'usersInProjectManaged' + (3 + config.nbInstance).toString()
            }]
        }, {
            xtype: 'panel',
            name: 'addUser',
            hidden: config.access != "owner" && config.access != "p",
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch',
                animate: true,
                padding: 5
            },
            items: [{
                xtype: 'label',
                text: 'Add new user',
                cls: 'title-add-new-user'
            }, {
                xtype: 'label',
                text: 'Username or e-mail:'
            }, {
                xtype: 'textfield',
                name: 'newUser',
                enableKeyEvents: true
            }, {
                xtype: 'panel',
                layout: 'hbox',
                border: false,
                items: [{
                    xtype: 'label',
                    flex: 1
                }, {
                    xtype: 'button',
                    text: 'Submit',
                    action: 'submitNewUser',
                    width: 100,
                    disabled: true
                }]
            }]
        }];

        config.items = items;

        this.callParent([config]);

    }
});