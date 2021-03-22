/**
 * S_LinkReactionMetabolite
 * liste des noeud & edge
 * model : MetExplore.model.LinkReactionMetabolite
 */
Ext.define('MetExplore.store.S_LinkReactionMetabolite', {
			extend : 'Ext.data.Store',
			model : 'MetExplore.model.LinkReactionMetabolite',
			//id :'linkReactionMetabolite',
			autoLoad : false,
			proxy : {
				type : 'ajax',
				url : 'resources/src/php/dataNetwork/LinkReactionMetabolite.php',
				extraParams : {
					idBioSource : ""
				},
				reader : {
					type : 'json',
					root : 'results',
					successProperty : 'success'
				},
				listeners : {
					/**
					 * @event
					 * @param proxy
					 * @param response
					 * @param operation
					 * @param eOpts
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
