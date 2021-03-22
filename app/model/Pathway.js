/**
 * Pathway
 */
Ext.define('MetExplore.model.Pathway', {
	extend: 'MetExplore.model.NetworkEntity',
	fields: [
	         //{name:'metaboliteCoverage',type:'float',defaultValue:0},
	         {name:'metaboliteNb',type:'int'},
	         {name:'completeness', type:'int'},
	         {name:'confidence', type: 'int'},
	         {name:'linkToDB', type: 'string'}
	         ],
	         getGenes : function(callback) {
	        	 var store= this.linkIdToObject('Pathway','Gene',callback);
	        	 return store;
	         },
	         getEnzymes : function(callback) {
	        	 var store= this.linkIdToObject('Pathway','Enzyme',callback);
	        	 return store;
	         },
	         getProteins : function(callback) {
	        	 var store= this.linkIdToObject('Pathway','Protein',callback);
	        	 return store;
	         },
	         getSubstrates : function(callback) {
	        	 var store= this.linkIdToObject('Pathway','MetabLeft',callback);
	        	 return store;

	         },
	         getProducts : function(callback) {
	        	 var store= this.linkIdToObject('Pathway','MetabRight',callback);
	        	 return store;
	         },       
	         getReactions : function(callback) {
	        	 //var store=Ext.create('MetExplore.store.S_Reaction');
	        	 var store= this.linkIdToObject('Pathway','Reaction',callback);
	        	 //console.log('store getReactions :',store);
	        	 return store;
	         },
	         getReactionsWithEquation : function(callback) {
	        	 //var store=Ext.create('MetExplore.store.S_Reaction');
	        	 var store= this.linkIdToObject('Pathway','ReactionWithEquation',callback);
	        	 //console.log('store getReactions :',store);
	        	 return store;
	         },
	         getCompart: function(callback){
	         	var store= this.linkIdToObject('Enzyme','CompartmentInBioSource',callback);
	 			return store;
	         },

	         
	         linkPathwayToCart: function(store, callback){
	        	 var idBioSource= 	MetExplore.globals.Session.idBioSource;

	        	 var idIn= this.get('id');
	        	 var tabResultId=-1;

	        	 var Cart= store;

	        	 Ext.Ajax.request({
	        		 url : 'resources/src/php/dataNetwork/groupReaction.php',
	        		 scope: this,
	        		 //async: false,
	        		 params : {
	        			 idBioSource : idBioSource,
	        			 req : 'R_Reaction_ListidPathway',
	        			 id : idIn
	        		 },
	        		 success : function(response, opts) {
	        			 var idOut = response.responseText;
	        			 var idOut = idOut.replace("\"", "");
	        			 var idOut = idOut.replace("\"", "");
	        			 tabResultId= idOut.split(",");

	        			 /**----------------------------------------------------
	        			  * correspondance 	liste idMySql  <->  objet du store
	        			  * creation d'un store
	        			  */    		

	        			 var taille= tabResultId.length;
	        			 var storeFind= Ext.getStore('S_Reaction');

	        			 for(var i= 0; i < taille; i++)
	        			 {
	        				 var rec= storeFind.getById(tabResultId[i]);
	        				 if (rec) {

	        					 Cart.add(rec);
	        				 };
	        			 }

	        			 if (callback){
	        				 callback(Cart);
	        			 }

	        			 return Cart;
	        		 },
	        		 failure : function(response, opts) {
	        			 console.log('server-side failure with status code '+ response.status);
	        			 return -1;
	        		 }
	        	 });
	        	 return Cart;
	         }

});
