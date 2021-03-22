Ext.define('MetExplore.view.grid.V_gridMeSHPairMetrics', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridMeSHPairMetrics',
    selType: 'checkboxmodel',
    plugins: [
        //Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 2}) ,
        {
            ptype: 'bufferedrenderer'
        }
    ],
    autoScroll: true,
    //store: 'S_MeSHPairMetricsValues',

    maxHeight: 300,
    resizeHandles: 'all',
    columns: [{
        text: 'MeSH term',
        width: 55,
        flex: 1,
        sortable: true,
        dataIndex: "name",
        renderer: function(value) {
            if (value)
                return "<a target='_blank' href='https://meshb.nlm.nih.gov/search?searchInField=allTerms&sort=&size=20&searchType=exactMatch&searchMethod=FullWord&q=" + value + "'>" + value + "</a>";
            return "";
        }
    }, {
        text: 'Article odds ratio',
        width: 55,
        flex: 1,
        sortable: true,
        dataIndex: "articleOddsRatio"

    }, {
        text: 'Article co occur',
        flex: 1,
        sortable: true,
        dataIndex: "articleCoOccur"
    }, {
        text: "Article count",
        flex: 1,
        sortable: true,
        dataIndex: "articleCount"
    }]
});