/**
 * add users to a project
 */
Ext.define('MetExplore.view.form.V_ChooseRightsOnUserProject', {

    extend: 'Ext.form.Panel',
    alias: 'widget.chooseRightsOnUserProject',
    layout: 'fit',
    constrainHeader: true,

    width: 400,
    height: 300,

    border: false,
    defaults: {
        border: false
    },

    requires: ['MetExplore.view.grid.V_GridUsersInProject'],

    bbar: ['->', {
        text: 'Ok',
        action: 'confirm'
    }, {
        text: 'Cancel',
        action: 'cancel'
    }],

    items: [],

    /**
     * Constructor
     * Get record (ie the reaction for which we want informations) and transmit to gridReactionIds
     */
    constructor: function(params) {
        var config = this.config;
        config.access = "owner";
        config.idBioSources = params.idBioSources;
        config.bioSources = params.bioSources;
        //config.title = 'PROJECT: ' + params.title;

        items = [{
            xtype: 'label',
            text: 'Other users have access to this BioSource. To add this BioSource to current project, you must add them to the project. Choose their new access to the project. It will be the same for all BioSource of the project, including this new one.'
        }, {
            xtype: 'panel',
            flex: 1,
            layout: 'fit',
            items: [{
                xtype: 'gridUsersInProject',
                action: "update",
                users: params.users,
                type: 'inChooseRightsOnUserProject',
                editMenu: false,
                pluginId: 'bufferGridUsersInProject2',
                storeId: 'usersInChooseRightsOnUserProject'
            }]
        }];

        config.items = items;

        this.callParent([config]);

    }
});