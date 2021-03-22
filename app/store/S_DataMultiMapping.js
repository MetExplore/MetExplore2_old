/**
 * S_DataMultiMapping
 * 	model : MetExplore.model.DataMultiMapping,
 */
Ext.define('MetExplore.store.S_DataMultiMapping',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.DataMultiMapping',
	alias: 'widget.dataMultiMapping',
	data:{
		rows:[{
            'result_id': '',
            'result_distance': '',
            'result_mapping': '',
			'idMap':['',''],
			//'conditions':['','']
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
