/**
 * V_ChartPathwayCompleteness
 * Object showing gauge chart of reaction catalyzed
 */
Ext.define('MetExplore.view.chart.V_ChartGauge', {
	extend : 'Ext.chart.Chart',
	
	requires:['Ext.chart.*',
	          'Ext.data.JsonStore'],
	
	alias : 'widget.chartGauge',
	config: {
		value: 0
	},
	
	animate: true,
    insetPadding: 30,
    axes: [{
        type: 'gauge',
        position: 'gauge',
        minimum: 0,
        maximum: 100,
        steps: 10,
        margin: 10,
        title: "0/0 (0%)",
        labelTitle: { font: 'bold 14pt Arial' }
    }],
    series: [{
        type: 'gauge',
        field: 'value',
        donut: 30,
        colorSet: ['#F49D10', '#ddd']
    }],
    
    title: "% of reactions with enzyme(s)",
    store: Ext.create('Ext.data.JsonStore', {
	    fields: ['value'],
	    data: [
	        { 'value':0 }
	    ]
	})

});