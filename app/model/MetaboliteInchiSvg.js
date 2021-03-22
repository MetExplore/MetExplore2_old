/**
 * MetaboliteInchiSvg
 */
Ext.define('MetExplore.model.MetaboliteInchiSvg', {
	extend: 'Ext.data.Model',
	fields : [{
		name:'id',
		type:'string'
	},{
		name : 'inchi',
		type : 'string'
	}, {
		name : 'svg',
		type : 'string'
	}, {
		name : 'width',
		type : 'string'
	}, {
		name : 'height',
		type : 'string'
	},{
		name : 'score',
		type : 'string'

	}]



});
