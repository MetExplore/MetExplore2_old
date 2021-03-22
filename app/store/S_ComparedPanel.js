/**
 * S_ComparedPanel
 * model : MetExplore.model.ComparedPanel
 * Store containing the panel compared network
 **/
Ext.define('MetExplore.store.S_ComparedPanel',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.ComparedPanel',
	autoload : true,
	/**
	 * setStoreVisibilityByParent
	 * @param parentId
	 */
	setStoreVisibilityByParent :function(parentId) {
		this.each(function(comparedPanel) {
			if(comparedPanel.getParent()==parentId){
				comparedPanel.setVisible(false);
			}
		});
	},
	/**
	 * getStoreById
	 * @param id
	 * @returns {*}
	 */
	getStoreById : function(id){  
		var theData;
		this.each(function(data){
			if(data.getPanel()==id){
				theData = data;
			}
		});
		return theData;
	},
	/**
	 * removeById
	 * @param id
	 */
	removeById : function(id){  
		var theData;
		this.each(function(data){
			if(data.getPanel()==id){
				theData = data;
			}
		});
		this.remove(theData);
	}

});
