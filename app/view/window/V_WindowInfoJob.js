/**
 * panel Info metabolite
 */
Ext.define('MetExplore.view.window.V_WindowInfoJob', {

    extend: 'MetExplore.view.window.V_WindowInfoGeneric',
    alias: 'widget.windowInfoJob',

    constructor: function(params) {
        var me = this;
        var config = {};

        items = [{
            xtype: 'panel',
            header: false,
            border: false,
            autoScroll: true,
            items: [{
                margin: "5 5 5 5",
                xtype: 'box',
                html: params.text
            }]
        }];
        config.title = "Log for " + params.title;

        config.layout = {
            type: 'fit',
            align: 'stretch'
        };

        config.items = items;

        this.callParent([config]);

    }

});