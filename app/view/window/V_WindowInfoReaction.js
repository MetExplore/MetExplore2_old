/**
 * panel Info reaction
 * Show informations of one reaction when user click to the i icon on the grid
 */
Ext.define('MetExplore.view.window.V_WindowInfoReaction', {

	extend : 'MetExplore.view.window.V_WindowInfoGeneric',
	alias : 'widget.windowInfoReaction',

	requires:['MetExplore.view.grid.V_gridPathwaysInReaction',
	          'MetExplore.view.grid.V_gridGenesInReaction',
	          'MetExplore.view.grid.V_gridObjectComment',
	          'MetExplore.view.panel.V_panelVotes',
	          'MetExplore.view.panel.V_PanelVizGPR'],

	          /**
	           * Constructor : intialize view
	           * Get record (ie the reaction for which we want informations) and transmit to gridReactionIds
	           */
	          constructor : function(params) {
	        	  var rec=params.rec;
	        	  var config = this.config;
	        	  if (MetExplore.globals.Session.access == "r" || MetExplore.globals.Session.idUser == -1)
	        	  {
	        		  config.canAnnot = false;
	        	  }
	        	  else
	        	  {
	        		  config.canAnnot = true;
	        	  }
	        	  config.idObject = rec.get('id');
	        	  config.typeObject = "reaction";
	        	  config.title=rec.get('name') + " [" + rec.get('dbIdentifier') + "] ";
	        	  config.items = [];

	        	  //Charge data for GPR association visualization:
	        	  config.graphDataLoaded = false;
	        	  config.showLegend = false;

	        	  config.graph = {"nodes": [{"name": rec.get('name') + "[" + rec.get('ec') + "]", 
	        		  "identifier": identifier,
	        		  "group": "reaction",
	        		  "main": 1}],
	        		  "links": [],
	        		  "counts": {}};

	        	  var win = this;
	        	  var identifier = rec.get('dbIdentifier');

	        	  //Old manner (client-side and a lot of server requests):
	        	  /*nodes = ["react_" + rec.get('id')]; //Keep index of node in listnodes of config.graph below

		config.graph = {"nodes": [{"name": rec.get('name') + "[" + rec.get('ec') + "]", 
								   "identifier": identifier,
								   "group": "reaction",
								   "main": 1}],
						"links": [],
						"counts": {}}

		//Get enzymes of the reaction:
		var enzymes = rec.getEnzymes(function(recordsEnz, operation, success) {
			var nbEnz = recordsEnz.getCount(); //Number of enzymes
			config.graph['counts']['enzymes'] = nbEnz;
			var itEnz = 0; //If itEnz == nbEnz --> it is the last loop round
			recordsEnz.each(function(recEnz) { //For each enzymes
				//1. Check linked proteins:
				var proteins = recEnz.getProteins(function(recordsProt, operation1, success1) {
					var nbProt = recordsProt.getCount(); //Number of proteins
					config.graph['counts']['proteins'] = nbProt;
					if (nbProt > 1) { //If enzyme complex is composed of more than one protein, add enzyme complexe to the nodes:
						var idE = "enz_" + recEnz.get('id'); //Id of enzyme
						if (nodes.indexOf(idE) == -1) { //If nodes does not contain the enzyme already
							nodes.push(idE);
							config.graph['nodes'].push({
								"name": recEnz.get('name'), 
							    "identifier": recEnz.get('dbIdentifier'),
							    "group": "enzyme",
							    "main": 1,
							    "id": recEnz.get('id')
							});
						}
						config.graph['links'].push({"source":nodes.indexOf(idE),"target":0});
						var targetProts = nodes.indexOf(idE) //proteins will be connected to the enzyme
					}
					else { //Else proteins will be connected directly to the reaction (none enzyme is depicted):
						var targetProts = 0;
					}
					recordsProt.each(function(recProt){ //For each protein linked to the enzyme:
						var idP = "prot_" + recProt.get('id'); //Id of the protein
						if (nodes.indexOf(idP) == -1) { //If nodes does not contain the protein already
							nodes.push(idP);
							config.graph['nodes'].push({
								"name": recProt.get('name'), 
							    "identifier": recProt.get('dbIdentifier'),
							    "group": "protein",
							    "main": 1,
							    "id": recProt.get('id')
							});
						}
						config.graph['links'].push({"source":nodes.indexOf(idP),"target":targetProts});
						//2. Check linked genes:
						var genes = recProt.getGenes(function(recordsGene, operationGene, successGene) {
							config.graph['counts']['genes'] = recordsGene.getCount(); //number of genes
							recordsGene.each(function(recGene){ //For each gene linked to the protein
								var idG ="gene_" + recGene.get('id'); //id of the gene
								if (nodes.indexOf(idG) == -1) { //If nodes does not contain the gene already
									nodes.push(idG);
									config.graph['nodes'].push({
										"name": recGene.get('name'), 
									    "identifier": recGene.get('dbIdentifier'),
									    "group": "gene",
									    "main": 1,
									    "id": recGene.get('id')
									});
								}
								config.graph['links'].push({"source":nodes.indexOf(idG),"target":nodes.indexOf(idP)});
							});
							//3. Check other reactions linked to the enzyme:
							var reactions = recEnz.getReactions(function(recordsReact, operationReact, successReact) {
								config.graph['counts']['reactions'] = recordsReact.getCount(); //number of reactions
								recordsReact.each(function(recReact){ //For each reaction
									var idR = "react_" + recReact.get('id'); //id of the reaction
									if (nodes[0] != idR) {
										if (nodes.indexOf(idR) == -1) { //If nodes does not contain the reaction already
											nodes.push(idR);
											config.graph['nodes'].push({
												"name": recReact.get('name') + "[" + recReact.get('ec') + "]", 
											    "identifier": recReact.get('dbIdentifier'),
											    "group": "reaction",
											    "main": 0,
											    "id": recReact.get('id')
											});
										}
										if (targetProts != 0) { //if true, links it to the enzyme
											config.graph['links'].push({"source":nodes.indexOf(idE),"target":nodes.indexOf(idR)});
										}
										else { //else, links it directly to the protein, as enzyme is not depicted
											config.graph['links'].push({"source":nodes.indexOf(idP),"target":nodes.indexOf(idR)});
										}
									}
								})
								itEnz++;
								if (itEnz == nbEnz) { //Data was loaded
									win.graphDataLoaded = true;
									win.down('panelVizGPR toolbar[name="tbar"]').enable();
								}
							});
						});
					});
				});
			});
		});*/

	        	  //New manner (server-side):
	        	  Ext.Ajax.request({
	        		  url:'resources/src/php/dataNetwork/getGPRassociation.php',
	        		  params: {
	        			  idReaction:config.idObject,
	        			  nameReaction:rec.get('name'),
	        			  ecReaction:rec.get('ec'),
	        			  dbIdReaction:rec.get('dbIdentifier')
	        		  },
	        		  failure : function(response, opts) {
	        			  Ext.MessageBox
	        			  .alert('Ajax error',
	        			  'get data of window failed on GPR association!');
	        		  },
	        		  success : function(response, opts) {
	        			  var repJson = null;

	        			  try
	        			  {
	        				  repJson=Ext.decode(response.responseText);
	        			  }
	        			  catch (exception) {
	        				  Ext.MessageBox
	        				  .alert('Ajax error',
	        				  'delete history items failed: JSON incorrect!');
	        			  }

	        			  if (repJson != null && repJson['success'])
	        			  {
	        				  win.graph = repJson['graph'];
	        				  win.graphDataLoaded = true;
	        				  win.down('panelVizGPR toolbar[name="tbar"]').enable();
	        			  }
	        			  else if (repJson != null) {
	        				  Ext.MessageBox
	        				  .alert('GPR association viz failed',
	        						  repJson['message']);
	        			  }
	        			  else
	        			  {
	        				  Ext.MessageBox
	        				  .alert('Ajax error',
	        				  'get data of window failed on GPR association!');
	        			  }

	        		  },
	        		  scope: this
	        	  });

	        	  //Get equations:
	        	  Ext.Ajax.request({
	        		  url:'resources/src/php/dataNetwork/getReactionEquations.php',
	        		  params: {
	        			  idReaction:config.idObject,
	        			  idBioSource:MetExplore.globals.Session.idBioSource
	        		  },
	        		  failure : function(response, opts) {
	        			  Ext.MessageBox
	        			  .alert('Ajax error',
	        			  'get data of window failed on Equations!');
	        		  },
	        		  success : function(response, opts) {
	        			  var RepJson=Ext.decode(response.responseText);
	        			  if (RepJson['success'])
	        			  {
	        				  //Set values:
	        				  this.query("label[name='eqName']")[0].setText(RepJson["eqName"], false);
	        				  this.query("label[name='eqDB']")[0].setText(RepJson["eqDB"], false);
	        				  this.query("label[name='eqForm']")[0].setText(RepJson["eqForm"], false);
	        			  }
	        			  else
	        			  {
	        				  Ext.MessageBox
	        				  .alert('Ajax error',
	        				  'get data of window failed on Equations!');
	        			  }

	        		  },
	        		  scope: this
	        	  });

	        	  //Make a unique id for GPR viz:
	        	  var idViz = 'viz-' + identifier.replace(/[^\w]/gi, '');
	        	  var idVizOrig = idViz;
	        	  var nb = 2;
	        	  while(d3.select("#"+ idViz + "-body")[0][0] != null && nb < 50) { //n<50 to never have an infinite loop
	        		  idViz = idVizOrig + nb.toString();
	        		  nb++;
	        	  }

	        	  items=[{
	        		  title: '<b>Equations of the reaction</b>',
	        		  xtype:'panel',
	        		  name: 'panelEquations',
	        		  layout: {
	        			  type: 'vbox',
	        			  align: 'stretch',
	        			  animate: true
	        		  },
	        		  items: [{
	        			  xtype: 'label',
	        			  cls: 'eqTitle',
	        			  text: 'Equation with names:'
	        		  },{
	        			  xtype: 'label',
	        			  name: 'eqName',
	        			  text: 'NA'
	        		  },{
	        			  xtype: 'label',
	        			  cls: 'eqTitle',
	        			  text: 'Equation with identifiers:'
	        		  },{
	        			  xtype: 'label',
	        			  name: 'eqDB',
	        			  text: 'NA'
	        		  },{
	        			  xtype: 'label',
	        			  cls: 'eqTitle',
	        			  text: 'Equation with chemical formulas:'
	        		  },{
	        			  xtype: 'label',
	        			  name: 'eqForm',
	        			  text: 'NA'
	        		  }]
	        	  }, {
	        		  title: '<b>GPR association viz</b>',
	        		  xtype: 'panelVizGPR',
	        		  layout: 'fit',
	        		  id: idViz
	        	  }, {
	        		  title: 'Pathways implicated',
	        		  xtype: 'gridPathwaysInReaction',
	        		  rec: rec,
	        		  win: this,
	        		  autoScroll: true
	        	  }, {
	        		  title: 'Genes involved',
	        		  xtype: 'gridGenesInReaction',
	        		  rec: rec,
	        		  win: this,
	        		  autoScroll: true
	        	  }, {
	        		  title:'Comments',
	        		  name: 'panelComments',
	        		  xtype: 'panel',
	        		  hidden: MetExplore.globals.Session.publicBioSource,
	        		  layout:{
	        			  type:'vbox',
	        			  align:'stretch'
	        		  },
	        		  items: [{
	        			  xtype:'gridObjectComment',
	        			  idObject: config.idObject,
	        			  typeObject: config.typeObject,
	        			  canAnnot: config.canAnnot,
	        			  win: this
	        		  }]
	        	  },{
	        		  title: '<b>Votes for this reaction</b>',
	        		  xtype: 'panel',
	        		  name: 'votePanel',
	        		  hidden: MetExplore.globals.Session.publicBioSource,
	        		  items: [{
	        			  xtype: 'panelVotes',
	        			  typeObj: config.typeObject,
	        			  idObj: config.idObject,
	        			  canAnnot: config.canAnnot
	        		  }]
	        	  }];

	        	  config.items = items;

	        	  this.callParent([config]);
	          },

	          listeners: {
	        	  afterrender: function(window)
	        	  {
	        		  if(!window.canAnnot) //Then the tab 0 is not shown, so show the tab 1
	        		  {
	        			  window.down("tabpanel[name=panelVotes]").setActiveTab(1);
	        		  }
	        	  }
	          }
});