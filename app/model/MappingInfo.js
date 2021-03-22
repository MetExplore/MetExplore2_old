/**
 * Model to handle List of Mappings liste des mappings effectues
 * id : M<num>	<num> = numero du mapping
 * object : objet sur leque a ete fait le mapping (par defaut : Metabolite)
 * element : element sur lequel a ete fait le mapping (par defaut : dbIdentifier)
 * ListId : liste des id mysql qui ont ete mappes
 */

Ext.define('MetExplore.model.MappingInfo', {
	requires :['MetExplore.globals.Session'],
		extend : 'Ext.data.Model',
		fields : [ 
			{name : 'id'},
			{name : 'title'},
			{name : 'object'},
			{name : 'field'},
			{name : 'numero'},
			{name : 'idBioSource'},
			{name : 'idMapped', type:'string'},
			{name : 'condName', type:'auto'},
			{name : 'storeMap', type:'string'},
			{name : 'nbMapped', type:'integer'},
			{name : 'nbData', type:'integer'},
			{name : 'nbDataInNetwork', type:'integer'},
            {name : 'sizeObject', type:'integer'},
			{name : 'coverCondition', type:'string'},
			{name : 'coverPathway', type:'boolean',defaultValue:false},
			{name : 'coverReaction', type:'boolean',defaultValue:false}
		],
		

		changeMysqlId :function(){
			
		}
    });