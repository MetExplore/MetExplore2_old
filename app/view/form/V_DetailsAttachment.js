/**
 * panel Details Attachemnt
 * Show informations of one given attachment, with right in edit if user can do it
 */
Ext.define('MetExplore.view.form.V_DetailsAttachment', {

	extend : 'Ext.form.Panel',
	alias : 'widget.detailsAttachment',
	
	fileUpload: true,
	height: 400,
	width: 500,
	layout: 'fit',
	items : [],
	bbar :[],

	/**
	 * Constructor
	 * Get params given to the window and apply
	 */
	constructor : function(params) {
		var config = this.config;
		config.parent = params.parent;
		config.data = params.data;
		config.storeAtt = params.storeAtt;
		config.addNew = params.addNew;
		var canEdit = params.canEdit;

		var urlTitle;

		config.header = false;
		if (config.addNew)
		{
			//config.title="Add new attachment";
			var canOpen = false;
		}
		else
		{
			//config.title=data['nameDoc'] + " - DETAILS";
			var canOpen = true;
			if (config.data['type']=="upload")
				canOpen = false;
		}
		if (config.data['filePath'] != "" && !config.addNew)
		{
			var hideUpload = true;
			urlTitle="Link by URL (cannot be edited):"
		}
		else
		{
			var hideUpload = false;
			urlTitle="Link by URL :"
		}
		config.items = [];
		
		var bbar = [{ xtype: 'button', text: 'Open', action:'open', disabled: !canOpen},'->', { xtype: 'button', text: 'Save', action:'save', disabled: !canEdit}, 
		   { xtype: 'button', text: 'Cancel', action:'cancel'}];
		
		config.bbar = bbar;
		
		items=[ {
			xtype:'fieldset',
			autoScroll: true,
			border: false,
			header: false,
			layout: {
		    	type: 'vbox',
		    	align: 'stretch',
		    	animate: true,
		    	padding: 5
		    },
		    instructions: '<code>(*)</code> REQUIRED',
			items: [{
				xtype: 'textfield',
				name: 'name',
				fieldLabel: 'Name',
				labelWidth: 40,
				labelStyle: 'font-weight: bold',
				value: config.data['nameDoc'],
				required: true,
				readOnly: !canEdit
			},{
				xtype: 'textfield',
				name: 'author',
				fieldLabel: 'Author',
				labelWidth: 40,
				labelStyle: 'font-weight: bold',
				value: config.data['author'],
				readOnly: !canEdit
			},{
				xtype: 'textarea',
				name: 'description',
				flex: 1,
				fieldLabel: 'Description',
				labelAlign: 'top',
				labelStyle: 'font-weight: bold',
				value: config.data['desc'],
				readOnly: !canEdit
			},{
				xtype: 'label',
				style: 'font-weight: bold',
				margins: '10 0 0 0',
				text: 'File:'
			},{
				xtype: 'radio',
				action: 'upload',
				boxLabel: 'Upload new file:',
				hidden: hideUpload
			},{
				xtype: 'fileuploadfield',
				name: 'selectFile',
				hidden: hideUpload,
				disabled: !canEdit
			},{
				xtype: 'label',
				text: 'MetExplore team is not responsible for any content you upload. Please verify you have rights before doing it.',
				style: 'color: #FF9933',
				margins: '0 0 5 0'
			},{
				xtype: 'radio',
				action: 'linkUrl',
				boxLabel: urlTitle,
				checked: config.data['filePath'].length > 0
			},{
				xtype: 'textfield',
				name: 'fileUrl',
				value: config.data['filePath'],
				readOnly:hideUpload
				//readOnly: !canEdit
			}]
		}];
		
		config.items = items;
		
		this.callParent([config]);
	}
});