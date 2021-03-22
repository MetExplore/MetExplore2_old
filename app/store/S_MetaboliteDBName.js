/**
 * S_MetaboliteDBName
 * model : MetExplore.model.MetaboliteDBName
 */
Ext.define('MetExplore.store.S_MetaboliteDBName',{
		extend : 'Ext.data.Store',
        model: 'MetExplore.model.MetaboliteDBName',
        //requires: ['MetExplore.globals.Loaded','MetExplore.globals.Session'],
        autoLoad: false,
				
//        proxy: {
//            type: 'ajax',
//            url: 'resources/src/php/dataNetwork/metaboliteIdentifiers.php',
//            extraParams: {idBioSource:""},
//            //reader: {type: 'json', root:'results', totalProperty:'total' }
//            reader: {
//				type : 'json',
//				root : 'results',
//				successProperty : 'success'
//            }
//        },
//         listeners : {
//         	'load' : function() {
//         		//MetExplore.globals.Loaded.S_MetaboliteInchiSvg= MetExplore.globals.Session.idBioSource;
//         		}
//
//         }
        

    });
