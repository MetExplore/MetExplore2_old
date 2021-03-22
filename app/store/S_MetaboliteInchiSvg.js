/**
 * S_MetaboliteInchiSvg
 * model : MetExplore.model.MetaboliteInchiSvg
 */
Ext.define('MetExplore.store.S_MetaboliteInchiSvg',{
		extend : 'Ext.data.Store',
        model: 'MetExplore.model.MetaboliteInchiSvg',
        requires: ['MetExplore.globals.Loaded','MetExplore.globals.Session'],
        autoLoad: false,
				
        proxy: {
            type: 'ajax',
            url: 'resources/src/php/dataNetwork/metaboliteInchiSvg.php',
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
        		MetExplore.globals.Loaded.S_MetaboliteInchiSvg= MetExplore.globals.Session.idBioSource;
        		}
        	
        }
        

    });
