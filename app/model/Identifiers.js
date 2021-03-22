/**
 * Identifiers
 * list of extID from table MetaboliteIdentifiers, ReactionIdentifiers, GeneIdentifiers
 */
Ext.define('MetExplore.model.Identifiers', {
			extend : 'Ext.data.Model',
			fields : [
				{
					name : 'idmysql',
					type : 'string'
				},
				{
					name : 'extDBName',
					type : 'string'
				},
				{
					name : 'extID',
					type : 'string'
				},
			]
		});