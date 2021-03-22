/**
 * S_InchiPeakForest
 * model : MetExplore.model.Inchi
 */
Ext.define('MetExplore.store.S_InchiPeakForest', {
		extend : 'Ext.data.Store',
		model: 'MetExplore.model.Inchi',
		alias: 'widget.inchiPeakForest',

        autoLoad : false,
        proxy: {
        	type:'jsonp',
        	url:'http://peakforest.clermont.inra.fr/spectralDatabase-ws-rest/compound/getInChIRange/0/5000' //147.99.159.188
        }

    });


