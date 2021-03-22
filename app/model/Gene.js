/**
 * Gene
 */    Ext.define('MetExplore.model.Gene', {
        extend: 'MetExplore.model.NetworkEntity',
        fields: [
        	{name:'linkToDB', type: 'string'}
        ],
        
        getProteins : function(callback) {
			var store= this.linkIdToObject('Gene','Protein',callback);
			return store;
        },
        getEnzymes : function(callback) {
			var store= this.linkIdToObject('Gene','Enzyme',callback);
			return store;
        },

        getSubstrates : function(callback) {
        	var store= this.linkIdToObject('Gene','MetabLeft',callback);
			return store;

        },
        getProducts : function(callback) {
        	var store= this.linkIdToObject('Gene','MetabRight',callback);
			return store;
        },
        getReactions : function(callback) {
        	var store= this.linkIdToObject('Gene','Reaction',callback);
			return store;
        },
               
        getPathways : function(callback) {
			var store= this.linkIdToObject('Gene','Pathway',callback);
			return store;
        },
        getCompart: function(callback){
        	var store= this.linkIdToObject('Gene','CompartmentInBioSource',callback);
			return store;
        }
    });
