/**
 * panel Details Comment
 * Show informations of one comment, with right in edit if user can do it
 */
Ext.define('MetExplore.view.form.V_DetailsComment', {

	extend : 'Ext.form.Panel',
	alias : 'widget.detailsComment',
	
	requires:['MetExplore.view.grid.V_gridAttachment'],
	
	config:
	{
		canEdit: false
	},
	
	height: 400,
	width: 800,
	layout: 'fit',
	constrainHeader : true,
	items : [],
	bbar : [],

	/**
	 * Constructor
	 * Get params given to the window and apply
	 */
	constructor : function(params) {
		var data=params.data;
		var config = this.config;
		/*if (params.addNew)
			config.title='Add new comment';
		else
			config.title=data['title'];*/
		config.addNew = String(params.addNew);
		config.idComment = data['idComment'];
		config.idObject = data['idObject'];
		config.typeObject = data['typeObject'];
		config.idUser = data['idUser'];
		config.nameUser = data['nameUser'];
		config.attachments = data['attachments'];
		config.commentStore = params.store;
		config.commentRecord = params.record;
		config.parent = params.parent;
		config.updateNbComments = params.updateNbComments;
		config.tmpAttachments = [];
		config.delAttachments = [];
		config.idTmpAttachment = -1;
		config.items = [];
		var itemsArray=[];
		
		config.canEdit = params.canEdit;
		config.addNew = params.addNew;
		
		var canDelete = true;
		
		if (!config.canEdit || config.addNew)
		{
			canDelete = false;
		}
		
		if (config.canEdit)
		{
			var closeButton = 'Cancel';
		}
		else
		{
			var closeButton = 'Close';
		}
		
		var bbar = ['->', { xtype: 'button', text: 'Save', action:'save', disabled: !config.canEdit}, 
		   { xtype: 'button', text: closeButton, action:'cancel'}];
		
		items=[ {
			xtype:'panel',
			autoScroll: true,
			border: false,
			header: false,
			layout: {
		    	type: 'vbox',
		    	align: 'stretch',
		    	animate: true,
		    	padding: 5
		    },
			items: [{
				xtype: 'textfield',
				name: 'title',
				fieldLabel: 'Title',
				labelWidth: 30,
				labelStyle: 'font-weight: bold',
				value: data['title'],
				readOnly: !config.canEdit
			},{
				xtype:'panel',
				autoScroll: true,
				border: false,
				header: false,
				layout: {
			    	type: 'hbox',
			    	align: 'stretch',
			    	animate: true
			    },
			    defaults: { margin:'5 0 10 0' },
				items: [{
					xtype: 'label',
					text: 'User :',
					cls: 'titleField',
					width: 40
				},{
					xtype: 'label',
					text: config.nameUser,
					cls: 'userNameField'
				}]
			},{
				xtype:'panel',
				autoScroll: true,
				border: false,
				header: false,
				flex: 1,
				layout: {
			    	type: 'hbox',
			    	align: 'stretch',
			    	animate: true
			    },
			    defaults: { margin:'5 0 5 0' },
				items: [{
					xtype:'panel',
					autoScroll: true,
					border: false,
					header: false,
					margin: '5 5 0 0',
					flex: 2,
					layout: {
				    	type: 'vbox',
				    	align: 'stretch',
				    	animate: true
				    },
					items: [{
						xtype: 'label',
						text: 'Text:',
						cls: 'titleField'
					},{
						xtype: 'textarea',
						name: 'text',
						value: data['text'],
						flex: 1,
						readOnly: !config.canEdit
					}]
				},{
					xtype:'panel',
					autoScroll: true,
					border: false,
					header: false,
					margin: '5 0 0 5',
					minWidth: 250,
					flex: 1,
					layout: {
				    	type: 'vbox',
				    	align: 'stretch',
				    	animate: true
				    },
					items: [{
						xtype: 'label',
						text: 'Attachments:',
						cls: 'titleField'
					},{
						xtype: 'gridAttachment',
						attachments: config.attachments,
						flex: 1,
						canEdit: config.canEdit
					}]
				}]
			}]
		}];
		
		config.bbar = bbar;
		config.items = items;
		
		this.callParent([config]);
	}
});