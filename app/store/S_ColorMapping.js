/**
 * S_ColorMapping
 * model : MetExplore.model.ColorMapping
 * Stores the colors for mapping caption 
 */

Ext.define('MetExplore.store.S_ColorMapping',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.ColorMapping',
	autoload : true,
	/**
	 * getColorByName
	 * @param name
	 * @returns {*}
	 */
	getColorByName : function(name){  
		var theData;
		this.each(function(data){
			if(data.getName()==name){
				theData = data;
			}
		});
		return theData;
	}
});
