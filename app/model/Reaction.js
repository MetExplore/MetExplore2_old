/**
 * Reaction
 *
 */

Ext.define('MetExplore.model.Reaction', {
			extend : 'MetExplore.model.NetworkEntity',
			
			fields : [{
						name : 'ec',
						type : 'string'
					}, {
						name : 'hole',
						type : 'boolean'
					}, {
						name : 'reversible',
						type : 'boolean'
					}, {
						name : 'formule',
						type : 'string'
					}, {
						name : 'upperBound',
						type : 'number'
					}, {
						name : 'lowerBound',
						type : 'number'
					}, {
						name : 'substrates',
						type : 'auto'
					},{
						name : 'products',
						type : 'auto'
					},{
						name:'linkToDB', 
						type: 'string'
					},{
						name:'eqName',
						type: 'string'
					},{
						name:'eqDB',
						type:'string'
					},{
						name:'eqForm',
						type:'string'
					},
					{
						name:'gpr',
						type: 'string'
					}
					],

			getGenes : function(callback) {
				var store = this.linkIdToObject('Reaction', 'Gene',callback);
				return store;
			},
			getEnzymes : function(callback) {
				var store = this.linkIdToObject('Reaction', 'Enzyme',callback);
				return store;
			},
			getProteins : function(callback) {
				var store = this.linkIdToObject('Reaction', 'Protein',callback);
				return store;
			},
			/**
			 * @return {}
			 */
			getSubstrates : function(callback) {
				/*
				 * faire la liaison entre idMysql contenus dans array substrates et S_Metabolite
				 */
				var store = this.linkIdToObject('Reaction', 'MetabLeft',callback);
				
				return store;
				
				/*
				this.substrates=[];

				var store= Ext.getStore('S_Reaction');
				var reaction= store.getById(this.get('id'));
				var leftM= reaction.get('substrates');
				var taille= leftM.length;
				var storeFind= Ext.getStore('S_Metabolite');
				//var storeOut= Ext.create('MetExplore.store.S_Metabolite');
				for(var i= 0; i < taille; i++)
				{
					//var rec= storeFind.findRecord('id',tabResultId[i]);
					var rec= storeFind.getById(leftM[i]);
	 				// if (rec) {
	 				// 	storeOut.add(rec);
	 				// };
	 				this.substrates.push(rec);
				}
				//console.log('store substrat :',storeOut);
				//return storeOut;
				//console.log(this.substrates);
				return this.substrates;
*/
				
			},
			getProducts : function(callback) {
				
				var store = this.linkIdToObject('Reaction', 'MetabRight',callback);
				return store;
				/*
				this.products=[];
				var store= Ext.getStore('S_Reaction');
				var reaction= store.getById(this.get('id'));
				var rightM= reaction.get('products');
				var taille= rightM.length;
				//console.log('products : ',products);
				var storeFind= Ext.getStore('S_Metabolite');
				//var storeOut= Ext.create('MetExplore.store.S_Metabolite');
				for(var i= 0; i < taille; i++)
				{
					//var rec= storeFind.findRecord('id',tabResultId[i]);
					var rec= storeFind.getById(rightM[i]);
	 				// if (rec) {
	 				// 	storeOut.add(rec);
	 				// };
	 				this.products.push(rec);
				}
				//console.log('store products ',storeOut);
				//return storeOut;
				return this.products;
				*/
			},

			getPathways : function(callback) {
				var store = this.linkIdToObject('Reaction', 'Pathway',callback);
				return store;
			},
			
	        getCompart: function(callback){
	        	var store= this.linkIdToObject('Enzyme','CompartmentInBioSource',callback);
				return store;
	        }
		});
