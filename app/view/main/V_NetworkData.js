/**
 * @author FV
 * @description Curation Menu
 * Onglet Curation dans lequel ouverture des onglets Pathway/Reaction/
 */
Ext.define('MetExplore.view.main.V_NetworkData', {
		extend: 'Ext.tab.Panel', 
		alias: 'widget.networkData',
		id:'networkData',
       	//layout:'fit',
       	//autoScroll:true,
		requires: [	'MetExplore.view.grid.V_gridCompartment',
					'MetExplore.view.grid.V_gridPathway', 
					'MetExplore.view.grid.V_gridReaction',
					'MetExplore.view.grid.V_gridMetabolite',
					'MetExplore.view.grid.V_gridEnzyme',
					'MetExplore.view.grid.V_gridProtein',
					'MetExplore.view.grid.V_gridGene',
					'MetExplore.view.grid.V_gridBioSource'
				],
       	items: [{title:'BioSources',       	
   				xtype:'gridBioSource',
   				id:'gridBioSource',
   				closable: false  				
   				},
   				{title:'Compartments',       	
       			xtype:'gridCompartment',
       			id:'gridCompartment',
       			closable: false
       			},
       			{title:'Pathways',       	
       			xtype:'gridPathway',
       			id:'gridPathway',
       			closable: false
       			},
     			{title:'Reactions',
       			xtype:'gridReaction',
       			id:'gridReaction',
       			closable: false
       			},
       			{title:'Metabolites',
       			xtype:'gridMetabolite',
       			id:'gridMetabolite',
       			closable: false
       			},
       			{title:'Enzymatic Complex',
       			xtype:'gridEnzyme',
       			id:'gridEnzyme',
       			closable: false
       			},
       			{title:'Gene Products',
       			xtype:'gridProtein',
       			id:'gridProtein',
       			closable: false
       			},
       			{title:'Genes',
       			xtype:'gridGene',
       			id:'gridGene',
       			closable: false
       			}] ,
       			
       	activeTab:0,
       	
 		initComponent: function() {
 			this.callParent(arguments);
       	},
       	
       	listeners :{
       		
			'tabchange': 
				function(tabPanel, newCard, oldCard, eOpts ) {
							/**
							 * resolution du ticket bug bufferedrenderer
							 * scenario : on est sur 1 BioSOurce / on regarde Gene / on bouge scroll / on va sur Protein / on change de BioSource 
							 * /on reviens sur Gene / on n'en a plus que 100 affiches 
							 */
							var store= newCard.getStore();
							newCard.reconfigure(store);
							newCard.getView().refresh();
							var bufferId= 'buffer'+newCard.id;
							//console.log(bufferId);
							var plugin= newCard.getPlugin(bufferId);
							//console.log(plugin);
							if (plugin && store.getCount()!==0) {
								plugin.scrollTo(0); //This creates an error when grids are empty : "Uncaught TypeError: Cannot read property 'el' of null     ext-all-debug.js:20085 ""
//								console.log(plugin);
							}
				},
			'beforerender':
				function(tabpanel){
				
				Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
				
				var savedBioSourceId=Ext.state.Manager.get("metexploreidBioSource");
				
//				if (savedBioSourceId){
//					
//					tabpanel.setActiveTab(3)
//				}
			}
		}
 });

