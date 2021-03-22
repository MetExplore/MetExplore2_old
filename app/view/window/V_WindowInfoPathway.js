/**
 * panel Info pathway
 * Show informations of one pathway when user click to the i icon on the grid
 */
Ext.define('MetExplore.view.window.V_WindowInfoPathway', {

    extend: 'MetExplore.view.window.V_WindowInfoGeneric',
    alias: 'widget.windowInfoPathway',

    requires: ['MetExplore.view.grid.V_gridReactionsInPathway', 'MetExplore.view.grid.V_gridGenesInPathway',
        'MetExplore.view.panel.V_panelVotes'
    ],

    /**
     * Constructor
     * Initialize view with given parameters (params)
     */
    constructor: function(params) {
        var rec = params.rec;
        var config = this.config;
        if (MetExplore.globals.Session.access == "r" || MetExplore.globals.Session.idUser == -1) {
            config.canAnnot = false;
        } else {
            config.canAnnot = true;
        }
        config.title = rec.get('name') + " [" + rec.get('dbIdentifier') + "] ";
        config.idPathway = rec.get('id');
        config.nbVotes = 0;
        config.items = [];
        var itemsArray = [];

        items = [{
            title: 'Reactions',
            xtype: 'gridReactionsInPathway',
            rec: rec,
            win: this
        }, {
            title: 'Genes',
            name: 'panelGenes',
            xtype: 'gridGenesInPathway',
            idPathway: config.idPathway,
            rec: rec,
            win: this
        }, {
            title: 'Comments',
            name: 'panelComments',
            xtype: 'panel',
            hidden: MetExplore.globals.Session.publicBioSource,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'gridObjectComment',
                idObject: config.idPathway,
                typeObject: "pathway",
                canAnnot: config.canAnnot,
                win: this
            }]
        }, {
            title: '<b>Votes for this pathway</b>',
            xtype: 'panel',
            name: 'votePanel',
            hidden: MetExplore.globals.Session.publicBioSource,
            items: [{
                xtype: 'panelVotes',
                typeObj: 'pathway',
                idObj: config.idPathway,
                canAnnot: config.canAnnot
            }]
        }];

        config.items = items;

        this.callParent([config]);
    },

    listeners: {
        afterrender: function(window) {
            idUser = MetExplore.globals.Session.idUser;
            if (!window.canAnnot) {
                window.down("tabpanel[name=panelVotes]").setActiveTab(1);
            }
        }
    }
});