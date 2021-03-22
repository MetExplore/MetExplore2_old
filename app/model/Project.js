/**
 * Project
 */
Ext.define('MetExplore.model.Project', {
	extend: 'Ext.data.Model',
	fields: [
	         //{name:'metaboliteCoverage',type:'float',defaultValue:0},
	         {name:'idProject',type:'string'},
	         {name:'name', type:'string'},
	         {name:'description', type:'string'},
	         {name:'dateC', type:'string'},
	         {name:'access', type: 'string'},
	         {name:'users', type: 'auto'},
	         {name:'active', type: 'bool'},
	         {name: 'lastModification', type : 'string'},
	         {name: 'lastVisit', type: 'string'},
	         {name: 'neverOpened', type: 'boolean'}
			]
});