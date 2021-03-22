/**
 * gridGenesInReaction
 * Show the grid with the genes of given reaction.
 */
Ext.define('MetExplore.view.grid.V_gridGenesInReaction',{
	extend : 'MetExplore.view.grid.V_GenericGrid',
	alias : 'widget.gridGenesInReaction',
	
	enableTextSelection: true,
	border: false,
	layout:'fit',
	config: {
		//noEditMenu: true
		typeObject: "Gene",
		noExportExcel: true
	},
	
	stateful : true,
	multiSelect : true,
	viewConfig : {
		stripeRows : true,
		enableTextSelection : true,
		plugins: {

			ptype: 'gridviewdragdrop',
			ddGroup :'genericDDgroup',
			enableDrop: false
		}
	},

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
			tooltip: 'See this Gene in the source database website',
			handler: function(grid, rowIndex, colIndex, item, e, record, row) 
			{
			 	grid.up('panel').fireEvent("viewLink", record.get('linkToDB'));
			}
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
 * Refresh values : get values with get functions of a gene
 * information of this reaction.
 */
	constructor :function(param){
		
		var config = this.config;
		
		var grid = this;
		
		var storeGinR = param.rec.getGenes(
			function(records, operation, success)
			{
				var nbGenes = grid.store.data.items.length;
				if (nbGenes > 1)
					param.win.query("gridGenesInReaction")[0].setTitle("This reaction involves <b>" + nbGenes + " Genes</b>");
				else
					param.win.query("gridGenesInReaction")[0].setTitle("This reaction involves <b>" + nbGenes + " Gene</b>");
			}
		);
		
		config.store=storeGinR;
		
		this.callParent([config]);

	}

});