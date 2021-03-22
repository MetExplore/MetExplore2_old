/**
 * S_ReactionGPR
 * model: 'MetExplore.model.ReactionGPR'
 */
Ext.define('MetExplore.store.S_ReactionGPR', {
    extend: 'Ext.data.Store',
    model: 'MetExplore.model.ReactionGPR',
    //requires: ['MetExplore.globals.Loaded','MetExplore.globals.Session'],
    autoLoad: false,

    proxy: {
        type: 'ajax',
        url: 'resources/src/php/dataNetwork/reactionGPR_new.php',
        extraParams: {
            idBioSource: ""
        },
        //reader: {type: 'json', root:'results', totalProperty:'total' }
        reader: {
            type: 'json',
            root: 'results',
            successProperty: 'success'
        }
    }
    // listeners : {
    // 	'load' : function() {
    // 		MetExplore.globals.Loaded.S_MetaboliteInchiSvg= MetExplore.globals.Session.idBioSource;
    // 		}
    //
    // }


});