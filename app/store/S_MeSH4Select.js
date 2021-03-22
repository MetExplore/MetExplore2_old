/**
 * S_MeSH
 * model : MetExplore.model.MeSH
 */
Ext.define('MetExplore.store.S_MeSH4Select', {
    extend: 'Ext.data.Store',
    id: 'mesh4select',
    autoLoad: false,
    fields: [{
            name: 'term',
            type: 'string'
        },
        {
            name: 'score',
            type: 'int'
        }
    ],
    sorters: [{
        property: 'score',
        direction: 'ASC'
    }]
});