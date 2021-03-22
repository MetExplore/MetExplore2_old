/**
 * S_Feature
 * model : MetExplore.model.Feature
 */

Ext.define('MetExplore.store.S_Feature',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.Feature',
    requires: ['MetExplore.globals.Feature'],
	proxy: {
		type: 'ajax',
		url: 'resources/src/php/feature/feature.php',
        actionMethods : {read: "POST"},
        reader: {
            type: 'json',
            root: 'results',
            successProperty: 'success'
        }
	},
    autoLoad: true,
    listeners :{
        /**
         * @event load
         * @param store
         * @param records
         */
        'load': function(store, records){
            //console.log(MetExplore.globals.Feature.name);
            //console.log(store);
            if (MetExplore.globals.Feature.name=='metexplore') {
                MetExplore.globals.Feature.loadFeatureMetexplore();
            } else {
                MetExplore.globals.Feature.loadFeature(MetExplore.globals.Feature.name);
            }

        }
    }

});
