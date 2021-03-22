/**
 * S_Access
 * store of access values
 */
Ext.define('MetExplore.store.S_Access',{
	extend : 'Ext.data.Store',
	fields: ['name'],
    data: [{name: "read"}, 
    	   {name: "annotator"}, 
    	   {name: "read/write"}, 
    	   {name: "owner"}]
});