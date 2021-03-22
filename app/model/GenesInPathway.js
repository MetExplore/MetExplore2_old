/**
 * Get genes present in pathway
 */
Ext.define('MetExplore.model.GenesInPathway', {
    extend: 'Ext.data.Model',
    requires: ['MetExplore.globals.Session'],

    fields: [{name:'dbIdentifier', type:'string'},
    		 {name:'name', type:'string'},
    		 {name:'url', type:'string'}
    		]
});