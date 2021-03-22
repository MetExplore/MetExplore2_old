/**
 * S_Biblio
 * model : MetExplore.model.Biblio
 */
Ext.define('MetExplore.store.S_Biblio',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.Biblio',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'resources/src/php/databiblio.php',
		extraParams: {
			idReaction:0
		},
		reader: {
			type: 'json' 
		}
	}
});
