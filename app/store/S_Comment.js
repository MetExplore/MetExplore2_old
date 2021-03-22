/**
 * S_Comment
 * model : MetExplore.model.Comment
 */
Ext.define('MetExplore.store.S_Comment',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.Comment',
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'resources/src/php/datacomment.php',
		extraParams: {
			idUser:0,
			idObject:0,
			typeObject:""
		},
		reader : {
			type : 'json',
			root : 'results',
			successProperty : 'success'
		}
	}
});
