/**
 * panel Statistics of reactions
 * Show statistics of one reaction when user click to the Statistics button
 */
Ext.define('MetExplore.view.window.V_WindowStatisticsReaction', {

    extend: 'Ext.Window',
    alias: 'widget.windowStatisticsReaction',

    requires: ['MetExplore.view.chart.V_ChartGauge'],

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
        },
        '->',
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
        config.title = 'Statistics of reactions in the BioSource ' + MetExplore.globals.Session.nameBioSource;

        Ext.Ajax.request({
            url: 'resources/src/php/dataNetwork/getReactionsStats.php',
            params: {
                idBioSource: MetExplore.globals.Session.idBioSource
            },
            failure: function(response, opts) {
                Ext.MessageBox
                    .alert('Ajax error',
                        'get data of window failed on Equations!');
            },
            success: function(response, opts) {
                var repJson = Ext.decode(response.responseText);
                if (repJson['success']) {
                    //Set value of catalyzed reactions (and update store):
                    var chart = this.query('chartGauge[name="reactionsCatalyzed"]')[0];
                    chart.value = repJson['pctCatalyzedReact'];
                    chart.axes.items[0].setTitle(repJson['nbReactCatalyzed'] + " / " + repJson['nbReact'] + "  (" + chart.value + " %)");
                    var store = chart.getStore();
                    store.getAt(0).set('value', chart.value);
                    //Set value of reactions in pathway (store will be updated on tab changed):
                    chart = this.query('chartGauge[name="reactionsInPathway"]')[0];
                    chart.value = repJson['pctReactInPath'];
                    chart.axes.items[0].title = repJson['nbReactInPathway'] + " / " + repJson['nbReact'] + "  (" + chart.value + " %)";
                } else {
                    Ext.MessageBox
                        .alert('Ajax error',
                            'get data of window failed!');
                }

            },
            scope: this
        });

        config.items = [{
            title: '<b>% of reactions with enzyme(s)</b>',
            xtype: 'panel',
            layout: 'fit',
            items: [{
                xtype: 'chartGauge',
                name: 'reactionsCatalyzed'
            }]
        }, {
            title: '<b>% of reactions within pathway(s)</b>',
            xtype: 'panel',
            layout: 'fit',
            items: [{
                xtype: 'chartGauge',
                name: 'reactionsInPathway'
            }]
        }];

        this.callParent([config]);

    }
});