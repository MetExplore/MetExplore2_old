/**
 * S_ReactionEquation
 * model: 'MetExplore.model.ReactionEquation'
 */
Ext.define('MetExplore.store.S_ReactionEquation', {
    extend: 'Ext.data.Store',
    model: 'MetExplore.model.ReactionEquation',
    //requires: ['MetExplore.globals.Loaded','MetExplore.globals.Session'],
    autoLoad: false,

    proxy: {
        type: 'ajax',
        url: 'resources/src/php/dataNetwork/getEquations.php',
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