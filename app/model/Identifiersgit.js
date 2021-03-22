/**
 * Identifiersgit
 * list of idsql from table MetaboliteIdentifiers, ReactionIdentifiers, GeneIdentifiers
 */
Ext.define('MetExplore.model.Identifiersgit', {
			extend : 'Ext.data.Model',
			fields : [
				{
					name : 'object',
					type : 'string'
				},
				{
					name : 'extDBName',
					type : 'auto'
				},
				{
					name : 'listid',
					type : 'auto'
				}]
		});