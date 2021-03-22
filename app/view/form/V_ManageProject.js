/**
 * manage a project
 */
Ext.define('MetExplore.view.form.V_ManageProject', {

    extend: 'Ext.form.Panel',
    alias: 'widget.ManageProject',

    height: 500,
    width: 800,
    layout: {
        type: 'vbox',
        align: 'stretch',
        animate: true,
        padding: 5
    },
    constrainHeader: true,
    bodyStyle: 'background:transparent;',

    border: false,

    requires: ['MetExplore.view.form.V_AddUserToProject'],

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
        config.idProject = params.idProject;
        config.access = params.access;
        //config.title = 'PROJECT: ' + params.title;
        config.items = [];

        items = [{
            xtype: 'textfield',
            name: 'name',
            fieldLabel: 'Name',
            value: params.name,
            readOnly: config.access != "owner"
        }, {
            xtype: 'textarea',
            name: 'desc',
            fieldLabel: 'Description',
            value: params.description,
            flex: 1,
            readOnly: config.access != "owner"
        }, {
            xtype: 'label',
            text: 'Users of the project:'
        }, {
            xtype: 'panel',
            layout: 'fit',
            height: 200,
            items: [{
                xtype: 'addUserToProject',
                action: config.action,
                access: config.access,
                users: params.users
            }]
        }];

        config.items = items;

        this.callParent([config]);

    }
});