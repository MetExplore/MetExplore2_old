/**
 * History
 */
Ext.define('MetExplore.model.History', {
        extend: 'Ext.data.Model',
        fields: [{name: 'id', type: 'int'}, 
        		 'date', 
        		 'idUser', 
        		 'idProject', 
        		 'project', 
        		 'idBioSource', 
        		 'bioSource', 
        		 'user', 
        		 'action', 
        		 'fileDetails']
    });