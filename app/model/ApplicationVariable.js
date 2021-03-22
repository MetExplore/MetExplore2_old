/**
 * Allows to model the parameters and the variables returned by an external program
 */

Ext.define('MetExplore.model.ApplicationVariable', {
	extend: 'Ext.data.Model',
	fields: [
	         {name:'name', type:'string'},
	         {name:'description', type:'string'},
	         {name:'metaVar', type:'string'},
	         {name:'type', type:'string'},
	         {name:'default', type:'string'},
	         {name:'min', type:'number', defaultValue:-Infinity},
	         {name:'max', type:'number', defaultValue:+Infinity},
	         {name:'value', type:'string'},
	         {name:'choices', type:'string', defaultValue:""},
	         {name:'required', type:'boolean', defaultValue:false}
	         ]
});