/**
 * gridReactionsInPathway
 * Show the grid with the reactions of given pathway.
 */
Ext.define('MetExplore.view.grid.V_gridReactionsInPathway',{
	extend : 'MetExplore.view.grid.V_GenericGrid',
	alias : 'widget.gridReactionsInPathway',
	
	enableTextSelection: true,
	border: false,
	layout:'fit',
	config: {
		typeObject: "Reaction",
		noExportExcel: true
	},
	
	autoScroll: false,
	

	store: 'storeReactionsInPathway',

	cls:"MultirowGrid",
	
	columns: [{
		xtype: 'actioncolumn',
		header: '',
		menuText: '',
		width: 20,
		action: 'seeInfos',
		dataIndex: 'seeInfos',
		sortable: false,
		items: [{
			icon: './resources/icons/info.svg',
			region: 'center',
			tooltip: 'See more information on this Reaction'
		}]
	},{
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
			tooltip: 'See this Reaction in the source database website'
		}]
	},{
		dataIndex:'name',
		header: "Name",
		sortable:true,
		flex: 1.5
	},{
		dataIndex:'dbIdentifier',
		header:"Identifier",
		sortable:true,
		flex: 1
	},{
		text     : 'E.C.',
		flex     : 1,
		sortable : true,
		dataIndex: 'ec',
		filter: {type:'string'},
		hidden: true
	},{
		text     : 'Reversible',
		width    : 70, 	
		sortable : true,
		type	 : 'bool',
		filter: true,
		dataIndex: 'reversible',
		hidden: true
	},{
		text     : 'Flux Lower Bound',
		width    : 70,
		sortable : true,
		filter: true,
		dataIndex: 'lowerBound',
		hidden: true
	},{
		text     : 'Flux Upper Bound',
		width    : 70,
		sortable : true,
		filter: true,
		dataIndex: 'upperBound',
		hidden: true
	}],
/**
 * Constructor
 * Refresh values : get values with get functions of a pathway
 * information of this reaction.
 */
	constructor :function(param){
		
		var config = this.config;
		
		var grid = this;
		
		var storeRinP = param.rec.getReactions(function(){
			var nbReactions = grid.store.data.items.length;
			if (nbReactions > 1)
				param.win.query("gridReactionsInPathway")[0].setTitle("This pathway contains <b>" + nbReactions + " Reactions</b>");
			else
				param.win.query("gridReactionsInPathway")[0].setTitle("This pathway contains <b>" + nbReactions + " Reaction</b>");
			});
				
		config.store=storeRinP;
		
		this.callParent([config]);

	}

});