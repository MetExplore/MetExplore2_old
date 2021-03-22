/**
 * S_MetaboliteInchikey
 * model : MetExplore.model.MetaboliteInchikey
 */
Ext.define('MetExplore.store.S_MetaboliteInchikey',{
		extend : 'Ext.data.Store',
        model: 'MetExplore.model.MetaboliteInchikey',
        requires: ['MetExplore.globals.Loaded','MetExplore.globals.Session'],
        autoLoad: false,
				
        proxy: {
            type: 'ajax',
            url: 'resources/src/php/dataNetwork/metaboliteInchikey.php',
            extraParams: {idBioSource:""},
            //reader: {type: 'json', root:'results', totalProperty:'total' }
            reader: {
				type : 'json',
				root : 'results',
				successProperty : 'success'
            }
        },
        listeners : {
            /**
             * @event
             */
        	'load' : function() {
        		MetExplore.globals.Loaded.S_MetaboliteInchikey= MetExplore.globals.Session.idBioSource;
        		}
        	
        }
        

    });
