/**
 * S_NetworkData
 * List of currents datasets
 * model: 'MetExplore.model.NetworkData'
 */


Ext.define('MetExplore.store.S_NetworkData',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.NetworkData',
	autoLoad: false,
	/**
	 * getStoreById
	 * @param id
	 * @returns {*}
	 */
	getStoreById : function(id)
	{  
		var theData;
		this.each( function(data){
			if(data.getId()==id){
				theData = data;
			}
		});
		return theData;
	}
});
