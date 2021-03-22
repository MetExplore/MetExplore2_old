/**
 * S_gridBioSource
 * model : 'MetExplore.model.BioSource'
 */
Ext.define('MetExplore.store.S_gridBioSource', {
	extend : 'Ext.data.Store',

	requires :['MetExplore.globals.Session'],

	model : 'MetExplore.model.BioSource',
	autoLoad : false,
	groupField :'orgName',

	/**
	 * reload
	 * @param callBack
	 */
	reload:function(callBack){

		this.removeAll(true );

		var idUser=MetExplore.globals.Session.idUser;

		var privStore=Ext.getStore('S_MyBioSource');
		var pubStore=Ext.getStore('S_BioSource');

		pubStore.reload({
			scope: this,
			callback: function(){

				if(idUser!='-1'){

					privStore.proxy.extraParams.idUser = idUser;
					privStore.load({
						scope: this,
						callback: function(){

							if (callBack) callBack();
						}
					});
				}else{
					if (callBack) callBack();
				}
			}
		});
	}

});
