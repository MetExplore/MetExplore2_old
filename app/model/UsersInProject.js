/**
 * Users in project
 */
Ext.define('MetExplore.model.UsersInProject', {
        extend: 'Ext.data.Model',
        fields: [{name: 'id', type: 'string'}, 
        'name', 
        'access', 
        {name: 'valid', type: 'int'}]
    });