/**
 * S_NetworkVizSession
 * Store containing the currently displayed CytoscapeSession object
 * model: 'MetExplore.model.NetworkVizSession'
 **/
Ext.define('MetExplore.store.S_NetworkVizSession',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.NetworkVizSession',
	/**
	 * getStoreById
	 * @param id
	 * @returns {*}
	 */
	getStoreById : function(id)
	{  
		var theSession;
		this.each( function(session){
			if(session.getId()==id){
				theSession = session;
			}
		});
		return theSession;
	}
});
