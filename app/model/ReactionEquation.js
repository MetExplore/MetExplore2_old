/**
 * Reaction GPR
 */
Ext.define('MetExplore.model.ReactionEquation', {
	extend: 'Ext.data.Model',
	fields : [{
		name:'idReaction',
		type:'string'
	},{
		name : 'eqName',
		type : 'string'
	},{
        name : 'eqDB',
        type : 'string'
    },{
        name : 'eqForm',
        type : 'string'
    }]

});
