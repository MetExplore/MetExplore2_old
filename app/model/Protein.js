/**
 * Protein
 */
    Ext.define('MetExplore.model.Protein', {
        extend: 'MetExplore.model.NetworkEntity',
        
        getGenes : function(callback) {
			var store= this.linkIdToObject('Protein','Gene',callback);
			return store;
        },
        getEnzymes : function(callback) {
			var store= this.linkIdToObject('Protein','Enzyme',callback);
			return store;
        },
        getSubstrates : function(callback) {
        	var store= this.linkIdToObject('Protein','MetabLeft',callback);
			return store;

        },
        getProducts : function(callback) {
        	var store= this.linkIdToObject('Protein','MetabRight',callback);
			return store;
        },
        getReactions : function(callback) {
        	var store= this.linkIdToObject('Protein','Reaction',callback);
			return store;
        },
               
        getPathways : function(callback) {
			var store= this.linkIdToObject('Protein','Pathway',callback);
			return store;
        },
        
        getCompart: function(callback){
        	var store= this.linkIdToObject('Protein','CompartmentInBioSource',callback);
			return store;
        }

    });
 