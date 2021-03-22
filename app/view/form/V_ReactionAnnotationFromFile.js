/**
 * Merlet Benjamin
 */

Ext.define('MetExplore.view.form.V_ReactionAnnotationFromFile', {
	extend : 'Ext.form.Panel',
	alias : 'widget.reactionAnnotationFromFile',
	requires: [	'MetExplore.view.grid.V_gridAddReactionFromFile','MetExplore.view.form.V_SelectInsertCompartment','MetExplore.view.form.V_SelectTabDataColumn'],

	title: 'Reaction Annotation',
	
	// frame :true,
	minWidth:1200,
	autoScroll: true,
	fileUpload: true,
	//bodyStyle: 'padding:5px',
	layout: {
		type:'vbox',
		align:'stretch'
	},

	items : [{
		xtype:'hiddenfield',
		name:'entry',
		value:'reaction'
	},{
		xtype		: 'fieldset',
		title: 'File Upload',
		collapsible: true,
		margin:'5 5 10 5',
		defaults: {
			labelWidth: 100
		},
		items:[{
			xtype		: 'fieldset',
			layout:{
				type:'hbox',
				align: 'center'
			},
			border :false,


			items :[{
				align: 'up',
				xtype : 'fileuploadfield',
				fieldLabel : 'Upload a CSV/TSV file',
				margin:'10 0 0 0',				
				width:350,
				labelWidth: 100,
				name : 'fileData',
				buttonText: '',
				buttonConfig: { iconCls: 'upload-icon'}
			},{
				xtype		: 'fieldset',
				layout:{
					type:'vbox'
				},
				border :false,
				defaults:{
					width: 500
				},

				items :[{
					xtype		: 'fieldset',
					title		:'Value Separator',
					items:[{
						xtype: 'radiogroup',
						columns: 3,
						vertical:true,
						defaults:{
							width:175
						},
						items: [{
							boxLabel  : 'Tabulation',
							name      : 'separator',
							checked:true,
							inputValue: '\t'
						}, {
							boxLabel  : 'Semicolon',
							name      : 'separator',
							inputValue: ','
						}, {
							boxLabel  : 'Coma',
							name      : 'separator',
							width: 75,
							inputValue: ','
						}, {
							boxLabel  : 'Space',
							name      : 'separator',
							width: 75,
							inputValue: ' '
						}, {
							boxLabel  : 'Other :',
							name      : 'separator',
							inputValue: '',
							listeners:{
								'change':function(){
									if(this.getValue()){
										this.next().focus(true);
									}else{
										this.next().setValue('')
									}
								}
							}
						},{
							xtype		: 'textfield',
							name		:"othervalsep",
							listeners:{
								'change':function( txtField, newValue){
									this.prev().inputValue=newValue;
								}
							}

						}]
					}]
				},{
					xtype		: 'fieldset',
					title		:'Text delimiter',
					items:[{
						xtype: 'radiogroup',
						columns: 3,
						vertical:true,
						defaults:{
							width:175
						},
						items: [{
							boxLabel  : "Simple quotes: '",
							name      : 'textSep',
							checked:true,
							inputValue: "'"
						}, {
							boxLabel  : 'Double quotes: "',
							name      : 'textSep',
							inputValue: '"'
						}, {
							boxLabel  : 'Other : (a single character)',
							name      : 'textSep',
							inputValue: '',
							listeners:{
								'change':function(){
									if(this.getValue()){
										this.next().focus(true);
									}else{
										this.next().setValue('')
									}
								}
							}
						},{
							xtype		: 'textfield',
							name		:"othertxtsep",
							maxLength :1,
							listeners:{
								'change':function( txtField, newValue){
									this.prev().inputValue=newValue;
								}
							}

						}]
					}]
				},{
					xtype		: 'fieldset',
					title		:'Unused lines',
					items:[{
						xtype: 'numberfield',
						name: 'skip',
						width: 400,
						labelWidth: 250,
						fieldLabel: 'Number of lines to skip at the begining of file',
						value: 1,
						minValue: 0
					},{
						xtype		: 'textfield',
						fieldLabel: 'Consider line as commented when starting with',
						width: 400,
						labelWidth: 250,
						name:'comment',
						value:'#'						
					}]
				}]
			},{
				xtype: 'button',
				text:'Upload file',
				margin:'10 0 0 0',
				height:50,
				action:'uploadFile'
			}]
		}]
	},{
		xtype         : 'gridAddReactionFromFile',
		height:350,
		width:'90%'
	},{
		xtype		: 'fieldset',
		title		: 'Grid columns definition',
		layout:'hbox',
		defaults:{
			labelWidth:150
		},
		items:[{
			xtype		: 'fieldset',
			border :false,
			items:[{
				xtype:'selectTabDataColumn',
				name:'Identifier',
				fieldLabel:'Identifier *'

			},{
				xtype:'selectTabDataColumn',
				name:'Reaction Equation',
				fieldLabel:'Reaction Equation *'

			},{
				xtype:'selectTabDataColumn',
				name:'Name',
				fieldLabel:'Name'
			}]	

		},{
			xtype		: 'fieldset',
			border :false,
			items:[{
				xtype:'selectTabDataColumn',
				name:'Pathway List',
				fieldLabel:'Pathway List'
			},{
				xtype:'selectTabDataColumn',
				name:'GPR',
				fieldLabel:'GPR'
			},{
				xtype:'selectTabDataColumn',
				name:'EC Number',
				fieldLabel:'EC Number'
			}]	

		},{
			xtype		: 'fieldset',
			border :false,
			items:[{
				xtype:'selectTabDataColumn',
				name:'Flux lower Bound',
				fieldLabel:'Flux lower Bound'
			},{
				xtype:'selectTabDataColumn',
				name:'Flux upper Bound',
				fieldLabel:'Flux upper Bound'
			},{
				xtype:'selectTabDataColumn',
				name:'Reaction Status',
				fieldLabel:'Reaction Status/Score'
			}]	

		},{
			xtype		: 'fieldset',
			border :false,
			items:[{
				xtype:'selectTabDataColumn',
				name:'Comment',
				fieldLabel:'Comment'
			},{
				xtype:'selectTabDataColumn',
				name:'Biblio',
				fieldLabel:'Biblio'
			},{
				xtype:'selectTabDataColumn',
				name:'Not Used',
				fieldLabel:'Unused Columns (multiple selection)',
				typeAhead: false,
				multiSelect: true

			}]
		}]
	},{
		xtype		: 'fieldset',
		layout:{
			type:'hbox',
			align: 'stretch'
		},
		minWidth:1100,
		padding:'0 5 5 0',
		margin:'0 5 5 0',
		border :false,
		items :[{
			xtype		: 'fieldset',
			title		: 'List of Pathways',
			qtip : 'If the pathway parameter is a list, please enter how it is defined.',
			listeners : {
				render : function(c) {
					Ext.QuickTips.register({
						target : c.getEl().id,
						trackMouse : false,
						title : 'Pathways',
						text : c.qtip,
						width : 200
					});
				}
			},
			padding:'5 5 5 5',
			flex:1,
			layout:{
				type:'vbox',
				align: 'align'
			},
			margin:'5 5 5 5',
			defaults: {
				labelWidth: 150
			},
			items:[{
				xtype		: 'fieldset',
				border :false,
				margin:'0',
				padding:'0',
				layout:{
					type:'hbox',
					align: 'align'
				},
				items:[{		
					xtype:'textfield',
					fieldLabel: "List Delimiter",
					name:"pListSt",
					labelWidth: 150,
					//margin:'0 0 0 0',
					width:180,
					value:'['
				},{
					xtype:'textfield',
					hideLabel : true,
					width:30,
					//padding:'5 0 0 0',
					margin:'0 0 0 10',
					name:"pListEnd",
					value:']'
				}]
			},{		
				xtype:'textfield',
				padding:'5 0 5 0',
				fieldLabel: "Item Separator",
				width:200,
				name:"pathwaySep",
				value:','
			}]
		},{
			xtype		: 'fieldset',
			title		: 'GPR',
			padding:'5 0 5 5',
			margin:'5 0 5 5',
			flex:1,
			defaults: {
				labelWidth: 100
			},
			items:[{
				xtype:'checkboxfield',
				fieldLabel: "And/Or relations",
				name:"gprLogic",
				checked: true,
				value:true
			},{
				xtype		: 'fieldset',
				border :false,
				margin:'0',
				padding:'0',
				layout:{
					type:'hbox',
					align: 'align'
				},
				items:[{		
					xtype:'textfield',
					fieldLabel: "Co-activating genes are grouped with :",
					name:"gprSt",
					labelWidth: 220,
					width:250,
					value:'('
				},{
					xtype:'textfield',
					hideLabel : true,
					width:30,
					margin:'0 0 0 10',
					name:"gprEnd",
					value:')'
				}]
			}]
		}]
	},{

		xtype		: 'fieldset',
		title		: 'Reaction Equation',
		padding:'5 5 5 5',
		layout:{
			type:'hbox',
			align: 'stretch'
		},
		margin:'5 5 5 5',
		flex:1,
		defaults: {
			labelWidth: 150
		},
		items:[{
			xtype		: 'fieldset',
			border :false,
			margin:'0',
			padding:'0',
			flex:1,
			layout:{
				type:'vbox',
				align: 'align'
			},
			items:[{
				xtype:'textfield',
				fieldLabel: "Irreversible",
				name:"irrReaction",
				width:200,
				allowBlank:false,
				value:'=>'
			},{		
				xtype:'textfield',
				fieldLabel: "Reversible",
				name:"revReaction",
				width:200,
				allowBlank:false,
				value:'<=>'
			},{
				xtype:'checkbox',
				boxLabel  : 'Convert Identifiers to Palsson format',
				name      : 'palsson',
				inputValue: true,
				qtip : "Reactions' identifiers will start with 'R_' and Metabolites' Identifiers will start with 'M_' and end with an underscore followed by the identifier of its compartment.",
				listeners : {
					render : function(c) {
						Ext.QuickTips.register({
							target : c.getEl().id,
							trackMouse : false,
							title : "Palsson's Identifier format",
							text : c.qtip,
							width : 200
						});
					}
				}
			}]
		},{
			xtype		: 'fieldset',
			border :false,
			margin:'0',
			padding:'0',
			flex:1,
			layout:{
				type:'vbox',
				align: 'align'
			},
			items:[{
				xtype:'checkbox',
				boxLabel  : 'Reaction Equation specifies metabolites compartment',
				name      : 'hasCompart',
				inputValue: true,
				checked:true,
				listeners:{
					'change':function(box, newValue){
						box.next().setDisabled(!box.getValue());
						box.next('selectInsertCompartment').setDisabled(box.getValue());
					}
				}

			},{
				xtype		: 'fieldset',
				border :false,
				margin:'0',
				padding:'0',
				layout:{
					type:'hbox',
					align: 'align'
				},
				items:[{		
					xtype:'textfield',
					fieldLabel: "Metabolite Compartment",
					name:"stCompart",
					labelWidth: 150,
					allowBlank:false,
					//margin:'0 0 0 0',
					width:180,
					value:'['
				},{
					xtype:'textfield',
					hideLabel : true,
					width:30,
					//padding:'5 0 0 0',
					margin:'0 0 0 10',
					name:"endCompart",
					allowBlank:false,
					value:']'
				}]
			},{
				disabled:true,
				margin:'5 0 0 0',
				xtype:'selectInsertCompartment',
				listeners:{
					'render':function(combo){
						combo.down().name='compId',
						combo.down().valueField='identifier'
					}
				}
			}]
		}]


	},{
		xtype:'fieldset',
		title		: 'Merging Attribute',
		minWidth:1100,
		margin:'5 5 5 5',
		defaults: {
			labelWidth: 150,
			padding: 5,
			margin:5
			//width:200
		},
		items:[{
			xtype:'radiogroup',
			fieldLabel: 'Reaction Identification attribute',
			items: [{ 
				boxLabel: 'Use Reaction Identifier', 
				name: 'rxnMatch', 
				checked:true,
				inputValue: 'dbIdentifier' 
			},{ 
				boxLabel: 'Use Reaction equation',
				name: 'rxnMatch', 
				inputValue: 'equation' 
			}]
		},{
			xtype:'hiddenfield',
			name:'metMatch',
			value:'dbIdentifier'
		}]

	},{
		xtype:'fieldset',
		title		: 'Update Type',
		minWidth:1100,
		margin:'5 5 5 5',
		defaults: {
			labelWidth: 150,
			padding: 5,
			margin:5
			//width:200
		},
		items:[{
			xtype:'checkbox',
			boxLabel  : 'Manual validation of conflicts after file import',
			name      : 'manual',
			inputValue: true,
			listeners:{
				'change':function(){
					var component=this.next().down();
					for( var i=0; i<4; i++){
						component.setDisabled(this.getValue());
						component=component.next();
					}
					component.setValue(true);
				}
			}
		},{
			xtype:'radiogroup',
			fieldLabel: 'On Conflict',
			disabled: false,
			columns: 3,
			vertical: true,
			items: [{
				boxLabel: 'Keep existing entries',
				name: 'mergeRule', 
				inputValue: 'KEEPOLD' 
			},{ 
				boxLabel: 'Update only empty fields with new values', 
				name: 'mergeRule', 
				inputValue: 'EMPTYFIELDS',
				checked:true
			},{ 
				boxLabel: 'Update all fields except the formula',
				name: 'mergeRule', 
				inputValue: 'UPEXCEPTFORMULA' 
			},{ 
				boxLabel: 'Update all fields INCLUDING the formula',
				name: 'mergeRule', 
				inputValue: 'UPALL'
			},{ 
				boxLabel: 'Duplicate entities on match', 
				name: 'mergeRule',
				inputValue: 'DUPLICATE',
				listeners:{
					'change':function(){
						this.next().setDisabled(!this.getValue())
					}
				}
			},{ 
				xtype: 'textfield',
				fieldLabel:'Suffix to add on Reaction Identifier:',
				name:'suffix',
				labelWidth: 150,
				disabled:true,
				value:'*'
			}]
		}]
	}],


	buttonAlign : 'left',
	buttons : [{
		text : 'Add',
		action : 'validateForm',
		formBind: true
	}]

});