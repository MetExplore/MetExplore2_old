/**
 * S_DataMapping
 * model : MetExplore.model.DataMapping
 */
Ext.define('MetExplore.store.S_DataMapping',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.DataMapping',
	alias: 'widget.dataMapping',
	data:{
		rows:[{
			'identified':'',
			'idMap':'',
			'conditions':['','']
		}]
	},
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'resources/src/php/fileCSV-read.php',
		extraParams: {
			fileName:"",
			sep:"",
			header:false
		},
		reader: {
			type: 'json', 
			root:'rows' 
		}
	}
});
