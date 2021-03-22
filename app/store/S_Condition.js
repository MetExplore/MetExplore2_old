/**
 * S_Condition : contenu de la combobox pour selectionner les conditions
 * model : MetExplore.model.Condition
 */
Ext.define('MetExplore.store.S_Condition',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.Condition',
	autoLoad: false,
	/**
	 * getStoreByCondName
	 * @param condName
	 * @returns {*}
	 */
	getStoreByCondName : function(condName){  
		var theCondition;
		this.each(function(condition){
			if(condition.getCondName()==condName){
				theCondition = condition;
			}
		});
		return theCondition;
	}
});
