/**
 * gridGenesInPathway
 * Show the grid with the genes of given pathway.
 */
Ext.define('MetExplore.view.grid.V_gridGenesInPathway',{
	extend : 'MetExplore.view.grid.V_GenericGrid',
	alias : 'widget.gridGenesInPathway',
	
	enableTextSelection: true,
	border: false,
	layout:'fit',
	config: {
		//noEditMenu: true
		typeObject: "Gene",
		noExportExcel: true
	},
	
	autoScroll: false,
	

	store: 'storeGenesInPathway',

	cls:"MultirowGrid",

	columns: [{
		xtype: 'actioncolumn',
		header: '',
		menuText: '',
		width: 20,
		dataIndex: 'linkToDB',
		action: 'openLinkInDB',
		sortable: false,
		items: [{
	 		icon: './resources/icons/link.png',
			region: 'center',
			tooltip: 'See this Gene in the source database website'
		}]
	},{
		dataIndex:'name',
		header: "Name",
		sortable:true,
		flex: 2
	},{
		dataIndex:'dbIdentifier',
		header:"Identifier",
		sortable:true,
		flex: 1
	}],
/**
 * Constructor
 * Refresh values : get values with get functions of a pathway
 * information of this reaction.
 */
	constructor :function(param){
		
		var config = this.config;
		
		var grid = this;
		
		var storeGinP = param.rec.getGenes(
			function(records, operation, success)
			{
				var nbGenes = grid.store.data.items.length;
				if (nbGenes > 1)
					param.win.query("gridGenesInPathway")[0].setTitle("This pathway contains <b>" + nbGenes + " Genes</b>");
				else
					param.win.query("gridGenesInPathway")[0].setTitle("This pathway contains <b>" + nbGenes + " Gene</b>");
			}
		);
		
		config.store=storeGinP;
		
		this.callParent([config]);

	}

});