Ext.define('MetExplore.model.ModelIdentifier', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'dbIdentifier', type: 'string'}
    ],
    idProperty: 'dbIdentifier'
        
});