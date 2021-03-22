/**
 * S_LocalstorageData
 * model : MetExplore.model.LocalstorageData
 */
Ext.define('MetExplore.store.S_LocalstorageData', {
	extend : 'Ext.data.Store',
	model : 'MetExplore.model.LocalstorageData',
	autoLoad : false,
	length : function(){
		return this.count();
	}
	//data :[{idBioSource:'1319',nbActions:'1',
	//actions: [
	//	
	
	//	{name:'map', 
	//	 params:['Reaction','name'],
	//   datas:[{'1-183-2-183-SN-GLYCEROL-PHOSPHOCHOLINE \t44\n1-KETO-2-METHYLVALERATE \t4\n1-PHOSPHATIDYL-1D-MYO-INOSITOL-35-BISPH\t66\n'}]
	//}]
	//}], 
});
