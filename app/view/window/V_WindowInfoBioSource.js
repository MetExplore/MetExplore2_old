/**
 * panel Info gene
 */
Ext.define('MetExplore.view.window.V_WindowInfoBioSource', {

	extend : 'MetExplore.view.window.V_WindowInfoGeneric',
	alias : 'widget.windowInfoBioSource',

	requires:['MetExplore.globals.Session', 'MetExplore.view.form.V_updateBioSource','MetExplore.view.panel.V_dataBioSource'],
	autoScroll: true,
	items:[],
	width:500,

	layout: 'fit',

	constructor : function(params) {
		var rec=params.rec;
		config = this.config;
		//console.log('rec',rec);
        //console.log('params',params);
		this.title=rec.get('NomComplet');
		var mySQlId = rec.get('id');
		
		panelItems={
				autoScroll: true,
				border:false
				};
		
		//console.log(rec)
		
		if(rec.get('public')){
			panelItems.items=Ext.create('MetExplore.view.panel.V_dataBioSource',{
				id: mySQlId,
				header:false,
				access: rec.get('access'),
				idProject: rec.get('idProject')
			});
		}else{
			panelItems.items=Ext.create('MetExplore.view.form.V_updateBioSource',{
				id: mySQlId,
				header:false,
				access: rec.get('access'),
				idProject: rec.get('idProject')
			});
		}

		config.items = panelItems;

		this.callParent([config]);

	}


});