/**
 * Analysis
 * @cfg {string} id
 * @cfg {boolean} session
 * @cfg {string} title
 */
Ext.define('MetExplore.model.Analysis', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id',
        type: 'string'
    }, {
        name: 'session',
        type: 'boolean'
    }, {
        name: 'title',
        type: 'string'
    }, {
        name: 'date',
        type: 'string'
    }, {
        name: 'log',
        type: 'string'
    }, {
        name: 'logpath',
        type: 'string'
    }, {
        name: 'status',
        type: 'string'
    }, {
        name: 'path',
        type: 'string'
    }, {
        name: 'resultType',
        type: 'string'
    }, {
        name: 'seeds',
        type: 'auto'
    }, {
        name: 'targetBiosource',
        type: 'int'
    }]
});