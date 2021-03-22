/**
 * panel confirm add User
 * Show informations of one comment, with right in edit if user can do it
 */
Ext.define('MetExplore.view.form.V_ConfirmAddUserToProject', {

    extend: 'Ext.form.Panel',
    alias: 'widget.ConfirmAddUserToProject',


    height: 100,
    width: 400,
    layout: {
        type: 'vbox',
        align: 'stretch',
        animate: true,
        padding: 5
    },

    bodyStyle: 'background:transparent;',

    constrainHeader: true,
    items: [],
    bbar: ['->', {
        xtype: 'button',
        text: "Ok",
        action: 'confirm'
    }, {
        xtype: 'button',
        text: "Cancel",
        action: 'cancel'
    }],

    items: [],

    constructor: function(params) {
        var config = this.config;

        config.gridUinP = params.gridUinP;
        config.newUser = params.newUser;

        config.items = [{
            xtype: 'label',
            text: 'Add user ' + params.nameUser + ' (' + params.value + ') to this project?',
            margins: '0 0 15 0'
        }, {
            xtype: 'combo',
            name: 'access',
            fieldLabel: 'with access',
            store: 'S_Access',
            valueField: 'name',
            displayField: 'name',
            value: 'read',
            editable: false
        }];

        this.callParent([config]);
    }

});