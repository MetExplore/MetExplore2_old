// Model to handle Cell values contained in the class Column

Ext.define('MetExplore.model.Inchi', {
		extend : 'Ext.data.Model',
		fields : [ 
			{name : 'identified',type : 'bool'},
			{name : 'idMap',type:'string', mapping: function(v){return v;}}
		]
/*
    	proxy: {
        	type: 'memory',
        	reader: {
            	type: 'json',
            	root: 'rows'
        	}
    	}     */   
    });