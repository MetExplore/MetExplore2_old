/**
 * gridBioSourceInfo
 */
Ext.define('MetExplore.view.grid.V_gridBioSourceInfo',{
	extend:'Ext.grid.Panel',
//	border: false,
	layout:'fit',

	alias: 'widget.gridBioSourceInfo',
	store:'S_BioSourceInfo',
//	shrinkWrap:false,
//	stateful: true,
//	stripeRows: true,
	border: false,

	columns:[ {
		header     : 'Compart',
		dataIndex: 'nbCompartments',
		flex:1
	},{
		header     : 'Path',
		dataIndex: 'nbPathways',
		flex:1
	},{
		header     : 'Rxn',
		dataIndex: 'nbReactions',
		flex:1
	},{
		header     : 'Met',
		dataIndex: 'nbMetabolites',
		flex:1
	},{
		header     : 'E. Cplx',
		dataIndex: 'nbEnzymes',
		flex:1
	},{
		header     : 'G. Prod',
		dataIndex: 'nbProteins',
		flex:1
	},{
		header     : 'Genes',
		dataIndex: 'nbGenes',
		flex:1
	}],

/**
 * 
 * @param {} params
 */
	constructor : function(params) {
		

		var biosourceId=params.id;
		config = this.config;
		
		var storeBioSourceInfo=Ext.create('MetExplore.store.S_BioSourceInfo');
		storeBioSourceInfo.load({
			params: { idBioSource: biosourceId}
		});
		
		config.store=storeBioSourceInfo;

		this.callParent([config]);
	}


});