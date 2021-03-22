/**
 * gridAttachments
 * list all attachments of a comment.
 */
Ext.define('MetExplore.view.grid.V_gridAttachment',{
	extend : 'Ext.grid.Panel',
	alias : 'widget.gridAttachment',
	
	enableTextSelection: true,
	border: false,
	layout:'fit',
	

	store: 'S_Attachment',

	hideHeaders:true,
	
	autoHeight: false,
	
	layout: 'fit',

	columns: [{
		dataIndex:'nameDoc',
		sortable:false,
		flex: 1
	}],

	/**
	 * Constructor
	 * @param {} params
	 */
	constructor :function(params){
		var attachments=params.attachments;
		var config = this.config;
		
		config.bbar = [{
			xtype: 'button',
			text: 'Add',
			action: 'addAttachment',
			width: 70,
			disabled: !params.canEdit,
			cls: 'add-attachment'
		},{
			xtype: 'label',
			flex: 0.5
		},{
			xtype: 'button',
			text: 'Details',
			action: 'detailsAttachment',
			width: 70,
			disabled: true,
			cls: 'details-attachment'
		},{
			xtype: 'label',
			flex: 0.5
		},{
			xtype: 'button',
			text: 'Delete',
			action: 'deleteAttachment',
			width: 70,
			disabled: true,
			cls: 'delete-attachment'
		}];
		
		var storeAtt=Ext.create('MetExplore.store.S_Attachment');
		
		for (var it = 0; it < attachments.length; it++) {
			storeAtt.add(attachments[it]);
		}
				
		config.store=storeAtt;
		
		this.callParent([config]);
	}
	
});