/**
 * MetabolitesIds
 */
Ext.define('MetExplore.model.MetaboliteIds', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'DB',
						type : 'string'
					}, {
						name : 'idMetabolite',
						type : 'string'
					},
					{
						name : 'DBids',
						type : 'string'
					}]
		});