/**
 * IdentifiersDBName
 * list of extDBName from table MetaboliteIdentifiers, ReactionIdentifiers, GeneIdentifiers
 */
Ext.define('MetExplore.model.IdentifiersDBName', {
			extend : 'Ext.data.Model',
			fields : [
				{
					name : 'object',
					type : 'string'
				},
				{
					name : 'extDBName',
					type : 'auto'
				}]
		});