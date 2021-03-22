/**
 * Attachment
 */
Ext.define('MetExplore.model.Attachment', {
			extend : 'Ext.data.Model',
			fields: [
				{name: 'id'},
			 	{name: 'nameDoc'},
			 	{name: 'filePath'},
			 	{name: 'author'},
			 	{name: 'desc'},
			 	{name: 'type'}
			]
		});