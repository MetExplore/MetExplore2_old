/**
 * S_MeSHPairMetricsValues
 * model : MetExplore.model.MeSHPairMetricsValues
 */
Ext.define('MetExplore.store.S_MeSHPairMetricsValues', {
    extend: 'Ext.data.Store',
    id: 'meSHPairMetricsValues',
    autoLoad: false,
    fields: [{
        name: 'name',
        type: 'string'
    }, {
        name: 'articleOddsRatio',
        type: 'int'
    }, {
        name: 'articleCoOccur',
        type: 'int'
    }, {
        name: 'articleCount',
        type: 'int'
    }],
    sorters: [{
        property: 'articleOddsRatio',
        direction: 'DESC'
    }, {
        property: 'articleCoOccur',
        direction: 'DESC'
    }, {
        property: 'articleCount',
        direction: 'DESC'
    }],
    /**
     * getMeSHsByTitle
     * @param title
     * @returns {*}
     */
    getMeSHsByTitle: function(title) {
        return (this.snapshot || this.data).findBy(function(record) {
            return record.get('title') === title;
        });
    }
});