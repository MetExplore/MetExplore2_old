/**
 * Generic Model Data : for all NetworkEntity 
 */
Ext.define('MetExplore.model.NetworkEntity', {
	extend: 'Ext.data.Model',
	requires: ['MetExplore.globals.Session'],

	

	fields: [{name:'id',type:'string'},
	         {name:'idInBio',type:'string'},
	         {name:'name',type:'string'},
	         {name:'dbIdentifier',type:'string'},
	         {name:'inConflictWith',type:'string'},
	         {name:'mapped',type:'int',defaultValue:0},
	         {name:'nbPathway',type:'int',defaultValue:0},
	         {name:'nbReaction',type:'int',defaultValue:0},
	         {name:'nbReactionWithEnz',type:'int',defaultValue:0},
	         {name:'nbMetabolite',type:'int',defaultValue:0},
	         {name:'nbEnzyme',type:'int',defaultValue:0},
	         {name:'nbProtein',type:'int',defaultValue:0},
	         {name:'nbGene',type:'int',defaultValue:0},
	         {name:'votes', type: 'auto'},
	         {name:'hasVote', type: 'string'}
	         ],


	         /**
	          * execute requete sql (async= obligatoire pour avoir result avant return)
	          * exemple : je veux toutes les reactions d'une liste de pathways
	          * @param {} inTypObject  par exemple : Pathway --> obtenir les Id Reactions des idPathways
	          * @param {} outTypObject par exemple : Reaction 
	          * @param {} callback
	          * @return {} liste des idReactions
	          */
	         linkIdToObject : function(inTypObject, outTypObject, callback) {

	        	 var idBioSource= 	MetExplore.globals.Session.idBioSource;

	        	 idIn= this.get('id');
	        	 var tabResultId=-1;

	        	 if (outTypObject=='MetabLeft' || outTypObject=='MetabRight') {

	        		 var storeOut= Ext.create('MetExplore.store.S_Metabolite');

	        	 } else if(outTypObject == 'ReactionWithEquation') {

	        		 var storeOut= Ext.create('MetExplore.store.S_Reaction');

	        	 } else {

	        		 var storeOut= Ext.create('MetExplore.store.S_'+outTypObject);
	        	 }

	        	 var req = 'R_'+outTypObject+'_Listid'+inTypObject;

	        	 if (outTypObject == 'ReactionWithEquation')
	        	 {
	        		 req = 'R_Reaction_Listid'+inTypObject;
	        	 }

	        	 Ext.Ajax.request({
	        		 url : 'resources/src/php/dataNetwork/group'+outTypObject+'.php',
					 defaultHeaders: {Cookie:"test"},
					 disableCaching: false,
					 method: 'POST',
	        		 scope: this,
	        		 //async: false,
	        		 params : {
	        			 idBioSource : idBioSource,
	        			 req : req,
	        			 id : idIn
	        		 },
					 beforerequest: function() {
	        		 	//supprimer les cookies
						MetExplore.globals.Utils.removeGridCookies();

					 },
	        		 success : function(response, opts) {
						 MetExplore.globals.Utils.removeGridCookies();
	        		 	console.log('ok post');
	        			 if (outTypObject == "ReactionWithEquation")
	        			 {
	        				 var rep = Ext.decode(response.responseText);
	        				 idOut = rep["ids"];
	        				 var equations = rep["equations"];
	        			 }
	        			 else
	        			 {
	        				 idOut = response.responseText;						
	        			 }
	        			 idOut = idOut.replace("\"", "");
	        			 idOut = idOut.replace("\"", "");
	        			 tabResultId= idOut.split(",");
	        			 //console.log(tabResultId);
	        			 /**----------------------------------------------------------------------------------
	        			  * correspondance 	liste idMySql  <->  objet du store
	        			  * creation d'un store
	        			  */    		

	        			 var taille= tabResultId.length;
	        			 if (outTypObject== 'MetabLeft' || outTypObject== 'MetabRight') { outTypObject= 'Metabolite'; }
	        			 else if(outTypObject == 'ReactionWithEquation') {outTypObject = "Reaction"; var withEquation = true;}
	        			 var storeFind= Ext.getStore('S_'+outTypObject);

	        			 //var storeOut= Ext.create('MetExplore.store.S_'+outTypObject);
	        			 for(var i= 0; i < taille; i++)
	        			 {
	        				 //var rec= storeFind.findRecord('id',tabResultId[i]);
	        				 var rec= storeFind.getById(tabResultId[i]);
	        				 if (rec) {
	        					 if (withEquation)
	        					 {
	        						 rec.set("equation", equations[i]);
	        					 }
	        					 storeOut.add(rec);
	        				 };
	        			 }

	        			 if (callback){
	        				 callback(storeOut);
	        			 }

	        			 return storeOut;

	        		 },
	        		 failure : function(response, opts) {
						 MetExplore.globals.Utils.removeGridCookies();
	        			 console.log('server-side failure with status code '+ response.status);
	        			 return -1;
	        		 }
	        	 });
	        	 //console.log(outTypObject,storeOut);
	        	 return storeOut;  
	         },

	         /**
	          * 
	          * @param {} idMapping
	          * @param {} NbCond
	          */
	         addFieldsModel : function(objectMap, mapInfo, nbCond) {


	        	 var fields = this.fields.items;

	        	 //console.log('fields',fields);
	        	 fields.push(
	        			 Ext.create('Ext.data.Field',{
	        				 name : mapInfo + 'identified',
	        				 type: 'bool',
	        				 id: mapInfo + 'identified',
	        				 defaultValue: false
	        			 })
	        	 );

	        	 for (i=0; i < nbCond; i++) {
	        		 fields.push(
	        				 Ext.create('Ext.data.Field',{
	        					 name : mapInfo + 'map' + i,
	        					 type: 'string',
	        					 id : mapInfo + 'map' + i,
	        					 defaultValue: '0'
	        				 })
	        		 );
	        	 }

	        	 this.fields.items= fields;
	        	 //this.join('S_Metabolite');
	        	 //this.set(eval(mapInfo+'identified'), false);
	        	 var store= Ext.getStore('S_'+objectMap);

	        	 store.each(function(rec) {
	        		 var id = rec.set(mapInfo+'identified', false);
	        		 for (i=0; i < nbCond; i++) {
	        			 var id = rec.set(mapInfo+'map'+i, '0');
	        		 }

	        	 });
	        	 store.commitChanges();


	         },

	         initFields: function (nameStore, mapInfo, nbCond) {
	        	 //console.log(this);
	        	 //this.mapInfo+'identified'= false;
	        	 //this.set(mapInfo+'identified', false);

	        	 //this.set(eval(mapInfo+'identified'), false);

	        	 var store= Ext.getStore(nameStore);
	        	 //var models= Ext.ModelManager.getModel();

	        	 //console.log(models);
	        	 store.each(function(rec) {
	        		 rec.set(mapInfo+'identified', false);

	        		 for (i=0; i < nbCond; i++) {
	        			 rec.set(mapInfo+'map'+i, '0');
	        		 }

	        	 });
	        	 store.commitChanges();

	         }



});
/**
 * Some inspiration:


Ext.define('User', {
extend: 'Ext.data.Model',
config:{
fields: ['name','age','phone']
},
addField:function(field){
var fields = this.getFields().items || [];
var data = this.getData(); // preserve data
fields.push(field);
this.setFields( fields );
this.setData( data );
}
});




var user = Ext.create('User',{name:'blue', age:35, phone:'0723538xxx' } );


user.addField({name:'caffee', type:'string'});


user.set('caffee','Arabica');


console.log( user.get('caffee') );


console.log(user.getData() );
 */
