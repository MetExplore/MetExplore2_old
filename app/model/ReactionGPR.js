/**
 * Reaction GPR
 */
Ext.define('MetExplore.model.ReactionGPR', {
	extend: 'Ext.data.Model',
	fields : [{
		name:'idInBio',
		type:'string'
	},{
		name : 'gpr',
		type : 'string'
	},{
        name : 'tabEnz'
    }
	]

});
