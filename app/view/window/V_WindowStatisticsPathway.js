/**
 * panel Statistics of pathways
 * Show statistics of one pathway when user click to the Statistics button
 */
Ext.define('MetExplore.view.window.V_WindowStatisticsPathway', {

    extend: 'Ext.Window',
    alias: 'widget.windowStatisticsPathway',

    requires: ['MetExplore.view.chart.V_ChartPathwayCompleteness'],

    height: 500,
    width: 700,
    layout: 'accordion',
    constrainHeader: true,
    items: [],
    bbar: [{
            text: 'Export',
            menu: {
                items: [{
                    text: 'Image (png)',
                    action: 'exportAsPng'
                }, {
                    text: 'Vector image (svg)',
                    action: 'exportAsSvg'
                }]
            }
        }, '->',
        {
            xtype: 'button',
            text: 'Close',
            action: 'close'
        }
    ],

    /**
     * Constructor
     */
    constructor: function(params) {

        var config = this.config;
        config.title = 'Statistics of pathways in the BioSource ' + MetExplore.globals.Session.nameBioSource;

        items = [{
            title: '<b>% of reactions with enzyme(s) in pathways (absolute values)</b>',
            xtype: 'panel',
            layout: 'fit',
            items: [{
                xtype: 'chartPathwayCompleteness',
                storePathway: params.storePathway,
                percentValues: false
            }]
        }, {
            title: '<b>% of reactions with enzyme(s) in pathways (percent)</b>',
            xtype: 'panel',
            layout: 'fit',
            items: [{
                xtype: 'chartPathwayCompleteness',
                storePathway: params.storePathway,
                percentValues: true
            }]
        }];

        config.items = items;

        this.callParent([config]);

    }
});