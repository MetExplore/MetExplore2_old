/**
 * V_ChartPathwayCompleteness
 * Object showing columnchart of pathway completeness categories
 */
Ext.define('MetExplore.view.chart.V_ChartPathwayCompleteness', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.chartPathwayCompleteness',

    /**
     * Constructor of the view
     * @param {} params: parameters given
     */
    constructor: function(params) {
        var config = this.config;
        config.percentValues = params.percentValues;
        config.store = params.storePathway.getCompletenessCategoriesCount(config.percentValues);
        if (config.percentValues) {
            var yAxis = "Percent of pathways";
            var endItem = '% of pathways'; //end of title of series
        } else {
            var yAxis = "Number of pathways";
            var endItem = ' pathways' //end of title of series
        }
        config.title = "% of reactions with enzyme(s) in pathways";
        config.axes = [{
            type: 'Numeric',
            position: 'left',
            fields: ['data'],
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            title: yAxis,
            grid: true,
            minimum: 0
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: '% of reactions with enzyme in pathways'
        }];

        config.series = [{
            type: 'column',
            axis: 'left',
            highlight: true,
            tips: {
                trackMouse: true,
                width: 140,
                height: 28,
                renderer: function(storeItem, item) {
                    this.setTitle(storeItem.get('name') + ': ' + storeItem.get('data') + endItem);
                }
            },
            label: {
                display: 'insideEnd',
                field: 'data',
                renderer: Ext.util.Format.numberRenderer('0'),
                orientation: 'horizontal',
                color: '#333',
                'text-anchor': 'middle'
            },
            xField: 'name',
            yField: 'data',
            //color renderer
            renderer: function(sprite, record, attr, index, store) {
                var fieldValue = Math.random() * 20 + 10;
                var value = fieldValue;
                var color = "#000000";
                if (record.get('name') == "< 25%") {
                    color = "#FF0000";
                } else if (record.get('name') == "> 25%") {
                    color = "#FF8000";
                } else if (record.get('name') == "> 50%") {
                    color = "#AEB404";
                } else {
                    color = "#088A08";
                }
                return Ext.apply(attr, {
                    fill: color
                });
            }
        }];

        this.callParent([config]);
    }

});