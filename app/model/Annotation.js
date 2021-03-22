/**
 * Data Annotation Stockage des modifications avant execution dans la base
 */

Ext.define('MetExplore.model.Annotation', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'id',
            type: 'string'
        },
        {
            name: 'idMysql',
            type: 'string'
        },
        {
            name: 'table',
            type: 'string'
        },
        {
            name: 'field',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'dbIdentifier',
            type: 'string'
        },
        {
            name: 'oldV',
            type: 'string'
        },
        {
            name: 'newV',
            type: 'string'
        },
        {
            name: 'origin',
            type: 'string'
        }
    ]
});