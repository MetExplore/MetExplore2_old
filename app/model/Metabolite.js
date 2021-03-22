/**
 * Metabolite
 */
Ext.define('MetExplore.model.Metabolite', {
			extend : 'MetExplore.model.NetworkEntity',
			fields : [{
						name : 'chemicalFormula',
						type : 'string'
					}, {
						name : 'weight',
						type : 'number'
					},  {
						name : 'averageMass',
						type : 'number'
					}, {
						name : 'sideCompound',
						type : 'boolean'
					}, {
						name : 'boundary',
						type : 'boolean'
					},{
						name : 'compartment',
						type : 'string'
					}, {
						name : 'topo',
						type : 'int'
					}, {
						name : 'inchi',
						type : 'string'
					}, {
						name : 'distance',
						type : 'string'
					}, {
                		name : 'mapping_type',
                		type : 'string'
            		}, {
                		name : 'mapping_id',
                		type : 'string'
            		}
            		,{
						name:'linkToDB', 
						type: 'string'
					}],
					
			

			getGenes : function(callback) {
				var store = this.linkIdToObject('Metabolite', 'Gene',callback);
				return store;
			},

			getProteins : function(callback) {
				var store = this.linkIdToObject('Metabolite', 'Protein',callback);
				return store;
			},
			getEnzymes : function(callback) {
				var store = this.linkIdToObject('Metabolite', 'Enzyme',callback);
				return store;
			},

			getReactions : function(callback) {
				var store = this.linkIdToObject('Metabolite', 'Reaction',callback);
				return store;
			},

			getPathways : function(callback) {
				var store = this.linkIdToObject('Metabolite', 'Pathway',callback);
				return store;
			},
			
			getCompartments : function(callback){
				var store = this.linkIdToObject('Metabolite', 'CompartmentInBioSource',callback);
				return store;
			},
			
			getInchi :function() {
				var storeInchiSvg = Ext.getStore('S_MetaboliteInchiSvg');
				var id= this.get('id');
				var rec= storeInchiSvg.getById(id);
 				if (rec) {
 					return(rec.get('inchi'));
 				} else {
 					return('0');
 				}
			},
			
			getSvg : function() {
				var storeInchiSvg = Ext.getStore('S_MetaboliteInchiSvg');
				var id= this.get('id');
				var rec= storeInchiSvg.getById(id);
 				if (rec) {
 					if (rec.get('svg')=='') return ('undefined'); 
 					else return(rec.get('svg'));
 				} else {
 					return('undefined');
 				}
				
			},
			getSvgHeight : function() {
				var storeInchiSvg = Ext.getStore('S_MetaboliteInchiSvg');
				var id= this.get('id');
				var rec= storeInchiSvg.getById(id);
 				if (rec) {
 					return(rec.get('height'));
 				} else {
 					return('0');
 				}
				
			},
			getSvgWidth : function() {
				var storeInchiSvg = Ext.getStore('S_MetaboliteInchiSvg');
				var id= this.get('id');
				var rec= storeInchiSvg.getById(id);
 				if (rec) {
 					return(rec.get('width'));
 				} else {
 					return('0');
 				}
				
			},

			getSvgHW : function() {
				var storeInchiSvg = Ext.getStore('S_MetaboliteInchiSvg');
				var id= this.get('id');
				var rec= storeInchiSvg.getById(id);
 				if (rec) {
 					if (rec.get('svg')=='') return ({svg:'undefined',height:'0',width:'0'}); 
 					else return({svg:rec.get('svg'),height:rec.get('height'),width:rec.get('width')});
 				} else {
 					return({svg:'undefined',height:'0',width:'0'});
 				}
				
			}

			
		});
