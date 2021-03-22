Ext.define('MetExplore.view.form.V_MetaboliteAnnotationFromFile', {
	extend : 'Ext.form.Panel',
	alias : 'widget.metaboliteAnnotationFromFile',
	
	requires: [	'MetExplore.view.grid.V_gridAddMetaboliteFromFile'],
	
	title: 'Metabolite Annotation',
	
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
		value:'metabolite'
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
		xtype         : 'gridAddMetaboliteFromFile',
		height:350,
		width:'90%'
	}]
	
	
});