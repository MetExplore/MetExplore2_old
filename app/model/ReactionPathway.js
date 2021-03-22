/**
 * LinkReactionMetabolite
 */
Ext.define('MetExplore.model.ReactionPathway', {
			extend : 'Ext.data.Model',
			fields : [
					{
						name : 'idPathway',
						type : 'string'
					},{
						name : 'idReaction',
						type : 'string'
					}
			]
		});