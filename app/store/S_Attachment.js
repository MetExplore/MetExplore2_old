/**
 * S_Attachment
 * model : MetExplore.model.Attachment
 */
Ext.define('MetExplore.store.S_Attachment',{
	extend : 'Ext.data.Store',
	root: 'rows',
	model: 'MetExplore.model.Attachment',
    config: {
    	data: []
    }
});