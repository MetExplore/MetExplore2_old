/**
 * Info nb Reactions,.... on BioSource
 */

Ext.define('MetExplore.model.BioSourceInfo', {
	extend: 'Ext.data.Model',
	fields: [{name: 'nbReactions',type:'int'},
	         {name: 'nbMetabolites',type:'int'},
	         {name:	'nbPathways',type:'int'},
	         {name:	'nbGenes',type:'int'},
	         {name:	'nbProteins',type:'int'},
	         {name:	'nbEnzymes',type:'int'},
	         {name:	'nbCompartments',type:'int'},
	         {name:	'nbUsers',type:'int'}],

	         isBiosourceEmpty:function(){
	        	 if(this.get('nbReactions')!==0){
	        		 return false;
	        	 }
	        	 if(this.get('nbMetabolites')!==0){
	        		 return false;
	        	 }
	        	 if(this.get('nbPathways')!==0){
	        		 return false;
	        	 }
	        	 if(this.get('nbGenes')!==0){
	        		 return false;
	        	 }
	        	 if(this.get('nbProteins')!==0){
	        		 return false;
	        	 }
	        	 if(this.get('nbEnzymes')!==0){
	        		 return false;
	        	 }
	        	 if(this.get('nbCompartments')!==0){
	        		 return false;
	        	 }
	        	 
	        	 return true;

	         }


});
