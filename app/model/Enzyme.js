/**
 * Enzyme
 */
Ext.define('MetExplore.model.Enzyme', {
        extend: 'MetExplore.model.NetworkEntity',

        getGenes : function(callback) {
			var store= this.linkIdToObject('Enzyme','Gene',callback);
			return store;
        },
        getProteins : function(callback) {
			var store= this.linkIdToObject('Enzyme','Protein',callback);
			return store;
        },
        getSubstrates : function(callback) {
        	var store= this.linkIdToObject('Enzyme','MetabLeft',callback);
			return store;

        },
        getProducts : function(callback) {
        	var store= this.linkIdToObject('Enzyme','MetabRight',callback);
			return store;
        },
        getReactions : function(callback) {
        	var store= this.linkIdToObject('Enzyme','Reaction',callback);
			return store;
        },
         
        getPathways : function(callback) {
			var store= this.linkIdToObject('Enzyme','Pathway',callback);
			return store;
        },
        getCompart: function(callback){
        	var store= this.linkIdToObject('Enzyme','CompartmentInBioSource',callback);
			return store;
        }

    });
