/**
 * S_PathwayMapped
 * model: 'MetExplore.model.Pathway'
 */
Ext.define('MetExplore.store.S_PathwayMapped',{
		extend : 'Ext.data.Store',
        model: 'MetExplore.model.Pathway',
        autoLoad: false

        // proxy: {
        //     type: 'ajax',
        //     url: 'resources/src/php/dataPathwayMetaboliteCoverage.php',
        //     extraParams: {idBioSource:"",req:"R_Pathway_ListidMetabolite",id:""},
        //     reader: {type: 'json' }
        // }
    });