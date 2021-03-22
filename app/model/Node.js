/**
 * Node class
 * For now, only contains the id
 */
Ext.define('MetExplore.model.Node', {
	extend: 'Ext.data.Model',
	fields: [
	         {name: 'id', type: 'string'},
	         //a reaction or a metabolite...later a gene?
	         {name: 'biologicalType', type: 'string'},
	         // a Metabolite object or a Reaction Object
	         {name: 'biologicalElement'}
	         ],

	         equals : function(x){
	        	 var equal=true;
	        	 if(this.get('id')!=x.get('id'))
	        	 {equal=false;}
	        	 return equal;
	         },

	         toString :function(){
	        	 return this.get('id');
	         }

});