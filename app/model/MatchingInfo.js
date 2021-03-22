/**
 * Model to handle List of Matching Identifiers effectues
 * id : I<num>	<num> = numero du mapping
 */

Ext.define('MetExplore.model.MatchingInfo', {
	requires :['MetExplore.globals.Session'],
		extend : 'Ext.data.Model',
		fields : [ 
			{name : 'id'},
			//{name : 'numero'},
			{name : 'jsonDataset'},
			{name : 'jsonNetwork'},
			{name : 'keysData'},
			{name : 'colsData'}
		],
    });