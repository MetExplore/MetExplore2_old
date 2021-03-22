/**
 * C_gridAttachment
 * Controls gridAttachement events.
 */
Ext.define('MetExplore.controller.comments.C_gridAttachment',{
	extend : 'Ext.app.Controller',

	config : {
		views : ['grid.V_gridAttachment, window.V_DetailsComment']
	},
/*	
	requires: ['MetExplore.view.form.V_DetailsAttachment'],
*/	
	init : function() {
		this.control({
			'gridAttachment button[action=detailsAttachment]':{
				click:this.detailsAttachment
			},
			'gridAttachment button[action=deleteAttachment]':{
				click:this.deleteAttachment
			},
			'gridAttachment button[action=addAttachment]':{
				click:this.addAttachment
			},
			'gridAttachment': 
			{
				selectionchange: this.activateEditButtons,
				itemdblclick: this.openAttachment
			}
			
		});

	},
	
	/**
	 * Active toolbar buttons while selection change
	 * @param {} selected
	 * @param {} eOpts
	 */
	activateEditButtons: function(selected, eOpts)
	{
		var grid = selected.view.up('gridAttachment');
		win = grid.up('form');
		if(win.canEdit)
		{
			if(grid.getSelectionModel().getSelection().length > 0)
			{
				win.down("button[action=detailsAttachment]").setDisabled(false);
				win.down("button[action=deleteAttachment]").setDisabled(false);
			}
			else
			{
				win.down("button[action=detailsAttachment]").setDisabled(true);
				win.down("button[action=deleteAttachment]").setDisabled(true);
			}
		}
		else {
			if(grid.getSelectionModel().getSelection().length > 0)
			{
				win.down("button[action=detailsAttachment]").setDisabled(false);
			}
			else
			{
				win.down("button[action=detailsAttachment]").setDisabled(true);
			}
		}
	},
	
	/**
	 * Show/Edit details of attachments
	 * @param {} button
	 */
	detailsAttachment: function(button)
	{
		var grid = button.up('gridAttachment');
		var form = grid.up('form');
		var storeAtt = grid.getStore();
		var slct = grid.getSelectionModel().getSelection();
		if (slct.length == 1)
		{
			var win= Ext.create('Ext.Window',{
				title: "Add new attachment",
				layout: 'fit',
				items:[{
					xtype:'detailsAttachment',
					canEdit: form.canEdit,
					data: slct[0].data,
					addNew: false,
					storeAtt: storeAtt,
					parent: button.up('form'),
					canEdit: button.up('form').canEdit
				}]
			});
			win.show();
			win.focus();
		}
		else
		{
			Ext.MessageBox.alert('Bad selection', 'Please select exactly one attachment in grid!')
		}
	},
	
	/**
	 * Do the deletion
	 * @param {} att: record of the attachment
	 * @param {} win: the parent window
	 * @param {} storeAtt: store of attachments
	 */
	doDeletion: function(att, win, storeAtt)
	{
		var delId = att.get('id');
		var url = att.get('filePath');

		var me=this;

		MetExplore.globals.Session.isSessionExpired(function(isExpired){
	        if(!isExpired){
				// Delete deleted attachments:
				Ext.Ajax.request({
					url : 'resources/src/php/deleteAttachment.php',
					params : {
						idAttachment: delId,
						url: url,
						typeObject: win.typeObject,
						idObject: win.idObject,
						idComment: win.idComment
					},
					failure : function(response, opts) {
						Ext.MessageBox
								.alert('Ajax error',
										'delete deleted attachments on disk failed!');
					},
					success : function(response, opts) {
						var repJson = Ext.decode(response.responseText);
						if (repJson['success']) {
							me.afterDelete(delId, win, storeAtt)
						}
						else {
							Ext.MessageBox
									.alert(
											'delete file failed!',
											repJson['message']);
						}

					}
				});
			}
		});

		
	},
	
	/**
	 * After delete on BDD (when necessary), delete attachment on the grid and on grid comment
	 * @param {} delId: id of the attachment to delete on the store
	 * @param {} win: the parent window
	 * @param {} storeAtt: store of attachments
	 */
	afterDelete: function(delId, win, storeAtt) {
		for (var it = 0; it < win.tmpAttachments.length; it++) {
			if(win.tmpAttachments[it]['id'] == delId)
			{
				delete win.tmpAttachments[it];
			}
		}
		var index = storeAtt.findExact('id',delId);
		storeAtt.removeAt(index);
		
		//Delete on comment grid:
		if (delId > -1) { //Else, we are in a new attachment, so it is not in comment store already
			var storeComm = win.parent.down('gridObjectComment').getStore();
			var idComment = win.idComment;
			var idx = storeComm.findExact('idComment', idComment);
			var rec = storeComm.getAt(idx);
			var attachOld = rec.get('attachments');
			var attachNew = [];
			//Delete the attachment: redifine new attachments and add to it all attachments except the deleted one
			for (var i = 0; i < attachOld.length; i++) {
				if (attachOld[i]['id'] != delId)
				{
					attachNew.push(attachOld[i]);
				}
			}
			rec.set('attachments', attachNew);
		}
	},
	
	/**
	 * Delete attachment button clicked
	 * @param {} button
	 */
	deleteAttachment: function(button)
	{
		var ctrl = this;
		var win = button.up('form');
		var grid = win.down('gridAttachment');
		var storeAtt = grid.getStore();
		var slct = grid.getSelectionModel().getSelection();
		if (slct.length == 1)
		{
			var att = slct[0];
			if (att.get('id') >= 0)
			{
				Ext.MessageBox.confirm('Confirm deletion', 'Confirm deletion of attachment named "' + att.get('nameDoc') + '"?', function(btn){
					if(btn == 'yes')
					{
						ctrl.doDeletion(att, win, storeAtt);
					}
				});
			}
			else
			{
				Ext.MessageBox.confirm('Confirm deletion', 'Confirm deletion of attachment named "' + att.get('nameDoc') + '"?', function(btn){
					if(btn == 'yes')
					{
						ctrl.afterDelete(att.get('id'), win, storeAtt);
					}
				});
			}
		}
	},
	
	/**
	 * Add an attachment
	 * @param {} button
	 */
	addAttachment: function(button)
	{
		var idNewAtt = button.up('form').idNewAtt;
		var storeAtt = button.up('gridAttachment').getStore();
		var dataAtt = {
			id: idNewAtt,
			nameDoc: '',
			desc: '',
			author: '',
			filePath: '',
			type: ''
		};
		var win= Ext.create('Ext.Window',{
			title: "Add new attachment",
			layout: 'fit',
			items:[{
				xtype:'detailsAttachment',
				data: dataAtt,
				addNew: true,
				storeAtt: storeAtt,
				parent: button.up('form'),
				canEdit: button.up('form').canEdit
			}]
		});
		idNewAtt--;
		win.show();
		win.focus();
	},
	
	/**
	 * Open selected attachment
	 * @param {} grid
	 * @param {} record
	 */
	openAttachment: function(grid, record)
	{
		var url = record.get('filePath');
		window.open(url,'_blank');
	}
	
});