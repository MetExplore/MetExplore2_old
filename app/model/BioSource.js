/**
 * BioSource
 */
Ext.define('MetExplore.model.BioSource', {
        extend: 'Ext.data.Model',
        fields: 
        
        [{
        	/* fields from BioSource table*/
        	name : 'id',
        	type : 'int'
        },{
        	name : 'NomComplet',
        	type : 'string'
        },{	
        	name : 'nameBioSource',
        	type : 'string'
        },{	
        	name : 'IdinDBref',
        	type : 'string'
        },{
        	name : 'tissue',
        	type : 'string'
        },{	
        	name : 'cellType',
        	type : 'string'
        },{
        	name : 'strain',
        	type : 'string'
        },{	
        	name : 'source',
        	type : 'string'
        },{
        	name : 'public',
        	type : 'boolean'
        },{	
       		name : 'biblio',
        	type : 'string'
        },{	
        	/* fields from Organism table*/
        	name : 'orgName',
        	type : 'string'
        },{
        	name : 'orgId',
        	type : 'string'
        },{	
        	/* fields from DataBaseRef table*/
        	name : 'dbId',
        	type : 'string'
        },{
        	name : 'dbType',
        	type : 'string'
        },{	
       		name : 'dbUrl',
        	type : 'string'
        },{	
        	name : 'dbName',
        	type : 'string'
        },{
        	name : 'dbVersion',
        	type : 'string'
        },{	
       		name : 'dbSource',
        	type : 'string'
        },{
        	name : 'access',
        	type : 'string'
        },{
        	/* project fields*/
        	name : 'project',
        	type : 'string'
        },{
            name : 'idProject',
            type : 'int'
        },{
        	name : 'groupNameProject',
        	type : 'string'
        },{
            name : 'dateAdd',
            type : 'string'
        },{
        	name : 'lastModification',
        	type : 'string'
        }]

    });
