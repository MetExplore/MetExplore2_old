/**
 * S_LocalstorageUrlAccess
 * model : MetExplore.model.Url
 * data:[{url:'http://localhost'}, {url:'http://metexplore.toulouse.inra.fr'}]
 */
Ext.define('MetExplore.store.S_LocalstorageUrlAccess', {
	extend : 'Ext.data.Store',
	model : 'MetExplore.model.Url',
	autoLoad : true,

	data:[{url:'http://localhost'}, 
	      {url:'http://metexplore.toulouse.inra.fr'}, 
	      {url:'http://127.0.0.1:8000'},
	      {url:'http://polyomics.mvls.gla.ac.uk'}]
});
