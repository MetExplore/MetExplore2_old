/**
 * 
 */
Ext.define('MetExplore.model.BioSourceData', {
    extend: 'Ext.data.Model',
    fields:

        [{
            name: 'id',
            type: 'int'
        }, {
            name: 'idBioSource',
            type: 'int'
        }, {
            name: 'object',
            type: 'string'
        }, {
            name: 'datajson',
            type: 'string'
        }, {
            name: 'listidUser',
            type: 'string'
        }]

});