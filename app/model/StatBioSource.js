/**
 * Identifiers
 * list of extID from table MetaboliteIdentifiers, ReactionIdentifiers, GeneIdentifiers
 */
Ext.define('MetExplore.model.StatBioSource', {
			extend : 'Ext.data.Model',
			fields : [
				{
					name : 'idBioSource',
					type : 'string'
				},
				{
					name : 'extDBName',
					type : 'string'
				},
				{
					name : 'nb',
					type : 'string'
				},
				{
					name : 'object',
					type : 'string'
				}
			]
		});