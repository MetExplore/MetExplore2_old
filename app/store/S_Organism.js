/**
 * S_Organism
 * model: 'MetExplore.model.Organism'
 */
Ext.define('MetExplore.store.S_Organism',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.Organism',
	autoLoad: true,

	proxy: {
		type: 'ajax',
		url: 'resources/src/php/dataorganism.php',
		reader: {
			type: 'json' 
		}
	}
});
