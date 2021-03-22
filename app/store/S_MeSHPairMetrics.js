/**
 * S_MeSHPairMetrics
 * model : MetExplore.model.MeSHPairMetrics
 */
Ext.define('MetExplore.store.S_MeSHPairMetrics', {
    extend: 'Ext.data.Store',
    id: 'meSHPairMetrics',
    autoLoad: false,
    fields: [{
            name: 'title',
            type: 'string'
        },
        {
            name: 'meshs',
            type: 'map'
        }
    ],
    sorters: [{
        property: 'title',
        direction: 'ASC'
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