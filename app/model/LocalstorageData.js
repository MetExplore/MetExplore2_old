/**
 * LocalstorageData
 */
Ext.define('MetExplore.model.LocalstorageData', {
        extend: 'Ext.data.Model',

        fields: [{
            name:'metexplore_idBioSource',
            type:'string'
        }, {
            name:'metexplore_nbActions',
            type:'string'
        }, {
        	name:'metexplore_actions',
        	type:'auto'
        	}
        ],

        proxy: {
            type: 'localstorage',
            id  : 'metexplore'
    	},
    	getAt: function() {
    		return this;
    	}
    });