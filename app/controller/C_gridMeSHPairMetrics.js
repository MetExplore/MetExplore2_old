/**
 * C_gridMeSHPairMetrics
 */
Ext.define('MetExplore.controller.C_gridMeSHPairMetrics', {
    extend: 'Ext.app.Controller',
    init: function() {
        this.control({
            'gridMeSHPairMetrics': {
                viewready: function(grid) {
                    console.log('o');
                    // var storeData = Ext.create('MetExplore.store.S_MeSHPairMetricsValues');
                    // grid.reconfigure(storeData);
                }
            }
        });
    }
});