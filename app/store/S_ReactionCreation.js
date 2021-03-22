/**
 * S_ReactionCreation
 * model: 'MetExplore.model.ReactionCreation'
 */
Ext.define('MetExplore.store.S_ReactionCreation',{
		extend : 'Ext.data.Store',
        model: 'MetExplore.model.ReactionCreation',
        groupField: 'type',
        groupDir:'DESC'
        /*autoLoad: true,

        proxy: {
            type: 'ajax',
            url: 'resources/src/php/dataorganism_v1.php',
            reader: {type: 'json' }
        }*/
    });
