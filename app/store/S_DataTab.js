/**
 * S_DataTab
 * model : MetExplore.model.DataTab
 */

Ext.define('MetExplore.store.S_DataTab',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.DataTab',
	alias: 'widget.dataTab',
	data:{
		rows:[{
			'tab':['','','','','','']
		}]
	},
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: 'resources/src/php/fileCSV-custom-read-annot.php',
		extraParams: {
			fileName:"",
			separator:"",
			delimiter:"", 
			skip:"", 
			comment:""
		},
		reader: {
			type: 'json', 
			root:'rows' 
		}
	}
});
