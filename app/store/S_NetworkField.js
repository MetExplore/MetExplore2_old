/**
 * S_NetworkField
 * model: 'MetExplore.model.NetworkField'
 */
Ext.define('MetExplore.store.S_NetworkField',{
		extend : 'Ext.data.ArrayStore',
        model: 'MetExplore.model.NetworkField',
        autoLoad: true,
        data :[
        	{'id':'select field'},
        	{'id':'dbIdentifier'},
        	{'id':'name'},
        	{'id':'chemicalFormula'},
        	{'id':'weight'},
        	{'id':'sideCompound'}]
     });
