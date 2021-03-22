/**
 * gridPathwaysInReaction
 * Show the grid with the pathways of given reaction.
 */
Ext.define('MetExplore.view.grid.V_gridPathwaysInReaction',{
	extend : 'MetExplore.view.grid.V_GenericGrid',
	alias : 'widget.gridPathwaysInReaction',
	
	enableTextSelection: true,
	border: false,
	layout:'fit',
	config: {
		//noEditMenu: true
		typeObject: "Pathway",
		noExportExcel: true
	},
	
	//autoScroll: true,
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

	store: 'storeGenesInPathway',

	cls:"MultirowGrid",
	
	//bubbleEvents : [ 'viewInfos' ],

	columns: [{
		xtype: 'actioncolumn',
		header: '',
		menuText: '',
		action: 'seeInfos',
		width: 20,
		sortable: false,
		items: [{
			icon: './resources/icons/info.svg',
			region: 'center',
			tooltip: 'See more information on this Reaction'
			/*handler: function(grid, rowIndex, colIndex, item, e, record, row) 
			{
				grid.up('panel').fireEvent("viewInfos", record,rowIndex);
			}*/
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
		flex: 3
	},{
		dataIndex:'dbIdentifier',
		header:"Identifier",
		sortable:true,
		width: 100
	},{
     	text	 : 'Nb Reactions',
     	width	  : 80,
     	sortable : true,
     	filter: {type: 'int'},
     	dataIndex: 'nbReaction',
     	hidden   : true
     },{
     	text	 : 'Nb Reactions with Enz.',
     	width	  : 130,
     	sortable : true,
     	filter: {type: 'int'},
     	dataIndex: 'nbReactionWithEnz',
     	hidden   : true
     },{
		text	 : '% Reactions with Enz.',
     	width    : 115,
     	hidden   : true,
     	sortable : true,
     	filter: {type: 'int'},
     	dataIndex: 'completeness',
     	renderer: function(value){
	        if (value < 25) {
	            return '<span class="veryLowCompletude">' + value + ' %</span>';
	        }
	        else if (value < 50) {
	        	return '<span class="lowCompletude">' + value + ' %</span>';
	        }
	        else if (value < 75) {
	        	return '<span class="mediumCompletude">' + value + ' %</span>';
	        }
	        else {
	        	return '<span class="highCompletude">' + value + ' %</span>';
	        }
	    }
	}],
/**
 * Constructor
 * Refresh values : get values with get functions of a pathway
 * information of this reaction.
 */
	constructor :function(param){
		
		var config = this.config;
		
		var grid = this;
		
		var storePinR = param.rec.getPathways(
			function(records, operation, success)
			{
				var nbPathways = grid.store.data.items.length;
				if (nbPathways > 1)
					param.win.query("gridPathwaysInReaction")[0].setTitle("This reaction exists in <b>" + nbPathways + " Pathways</b>");
				else
					param.win.query("gridPathwaysInReaction")[0].setTitle("This reaction exists in <b>" + nbPathways + " Pathways</b>");
			}
		);
		
		config.store=storePinR;
		
		this.callParent([config]);

	}

});