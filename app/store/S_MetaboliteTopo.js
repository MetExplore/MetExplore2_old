/**
 * S_MetaboliteTopo
 * model : MetExplore.model.MetaboliteTopo
 */
Ext.define('MetExplore.store.S_MetaboliteTopo',{
		extend : 'Ext.data.Store',
        model: 'MetExplore.model.MetaboliteTopo',
        autoLoad: false,

        proxy: {
            type: 'ajax',
            url: 'resources/src/php/graphModelling/topologyMetabolite.php',
            extraParams: {idBioSource:""},
            //reader: {type: 'json', root:'results', totalProperty:'total' }
            reader: {type: 'json' }
        } 	
    });
