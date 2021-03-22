/**
 * S_Analyses
 * model : MetExplore.model.Analysis
 */
Ext.define('MetExplore.store.S_Analyses', {
	extend : 'Ext.data.Store',

	requires : [],

	model : 'MetExplore.model.Analysis',
	
	autoLoad : true,
	
	sorters:
    {
		property: 'date',
        direction: 'DESC'
    },

	proxy : {
		type : 'ajax',
		url : 'resources/src/php/application_binding/listAnalyses.php',
		
		reader : {
			type : 'json',
			root:'analyses',
			successProperty : 'success'
		},
		listeners : {
			/**
			 * 
			 * @param {} proxy
			 * @param {} response
			 * @param {} operation
			 * @param {} eOpts
			 */
			'exception' : function(proxy, response, operation, eOpts) {
				if (response.status !== 200) {
					Ext.Msg.alert("Failed", "Server Error. Status: "
									+ response.status);
				} else {
					var responseText = Ext
							.decode(response.responseText);
					Ext.Msg.alert("Failed", responseText.message);
				}
			}
		}
	}


});