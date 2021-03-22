/**
 * LinkReactionMetabolite
 */
Ext.define('MetExplore.model.LinkReactionMetabolite', {
			extend : 'Ext.data.Model',
			fields : [
					{
						name : 'edgeId',
						type : 'string'
					},{
						name : 'idReaction',
						type : 'string'
					},{
					/*	name : 'nameReaction',
						type : 'string'
					},
					{
						name : 'dbReaction',
						type : 'string'
					},{*/
						name : 'reversible',
						type : 'boolean'
					},{
						name : 'idMetabolite',
						type : 'string'
					},{
					/*	name : 'nameMetabolite',
						type : 'string'
					},
					{
						name : 'dbMetabolite',
						type : 'string'
					},{*/
						name : 'side',
						type : 'int'
					},{
						name : 'interaction',
						type : 'string'
				/*	},{
						name : 'svg',
						type : 'string'
					},{
						name : 'width',
						type : 'string'
					},{
						name : 'height',
						type : 'string'*/
					}]
		});