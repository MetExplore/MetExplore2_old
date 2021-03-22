/**
 * C_gridObjectComment
 * Control events of V_gridObjectComment window
 */

Ext.define('MetExplore.controller.comments.C_gridObjectComment', {
	extend: 'Ext.app.Controller',
/*	requires: ['MetExplore.globals.Session'],
	views: ['grid.V_gridObjectComment'],
*/
	//requires: ['MetExplore.view.form.V_DetailsComment'],
	
	/*
	 * Define evenements
	 */	
	init: function() {
		this.control({
			'gridObjectComment': 
			{
				itemcontextmenu : this.editMenu,
				selectionchange: this.activeEditButtons,
				itemdblclick: this.openCommentForm
			},
			'gridObjectComment button[action="addComment"]':
			{
				click: this.addComment
			},
			'gridObjectComment button[action="openComment"]':
			{
				click: this.openCommentButton
			},
			'gridObjectComment button[action="deleteComment"]':
			{
				click: this.deleteCommentButton
			},
			'gridObjectComment button[action="refresh"]':
			{
				click: this.refreshComments
			}
		});

	},
	
	/**
	 * (De)activate edit buttons (open, delete) while selection change on comments grid
	 * @param {} selected: items selected
	 * @param {} eOpts
	 */
	activeEditButtons: function(selected, eOpts)
	{
		var grid = selected.view.up('gridObjectComment');
		if(grid.getSelectionModel().getSelection().length > 0)
		{
			var idUser = selected.selected.items[0].get('idUser');
			var idUserCo = MetExplore.globals.Session.idUser;
			grid.down("button[action=openComment]").setDisabled(false);
			if (idUser == idUserCo || ['p', 'rw'].indexOf(MetExplore.globals.Session.access) > -1)
				grid.down("button[action=deleteComment]").setDisabled(false);
			else
				grid.down("button[action=deleteComment]").setDisabled(true);
		}
		else {
			grid.down("button[action=openComment]").setDisabled(true);
			grid.down("button[action=deleteComment]").setDisabled(true);
		}
	},
	
	/**
	 * Add a comment clicked
	 * @param {} button
	 */
	addComment: function(button) {
		var commentStore = button.up('gridObjectComment').store;
		data = {'title': '', 'text': '', 
			    'attachments': [], 
			    'nameUser':  MetExplore.globals.Session.nameUser, 
			    'idUser': MetExplore.globals.Session.idUser,
			    'idComment': -1,
			    'typeObject': button.up('gridObjectComment').typeObject,
			    'idObject': button.up('gridObjectComment').idObject
	    };
		var win= Ext.create('Ext.Window',{
			title: 'Add new comment',
			layout: 'fit',
			items:[{
				xtype:'detailsComment',
				canEdit: true,
				data: data,
				addNew: true,
				store: commentStore,
				parent: button.up('window'),
				updateNbComments: true
			}]
		});
		win.show();
		win.focus();
	},
	
	/**
	 * Edit menu: opens while right click on the grid
	 * @param {} grid
	 * @param {} record
	 * @param {} item
	 * @param {} index
	 * @param {} e
	 * @param {} eOpts
	 */
	editMenu: function(grid, record, item, index, e, eOpts) {
		e.preventDefault();
		var idUser = record.get('idUser');
		var idUserCo = MetExplore.globals.Session.idUser;
		if (idUser == idUserCo || ['p', 'rw'].indexOf(MetExplore.globals.Session.access) > -1)
			var canDelete = true;
		else
			var canDelete = false;
		grid.CtxMenu = new Ext.menu.Menu({
			items : [{
				text : 'Open comment',
				handler: function() {this.openCommentForm(grid, record);},
				scope: this
			}, {
				
				text : 'Delete comment',
				handler: function() {this.deleteComment(grid, record);},
				scope: this,
				hidden: !canDelete
			}]
		});
		// positionner le menu au niveau de la souris
		grid.CtxMenu.showAt(e.getXY());
	},
	
	/**
	 * Open comment button clicked
	 * @param {} button
	 */
	openCommentButton: function(button) {
		var grid = button.up('gridObjectComment');
		var selection = grid.getSelectionModel().getSelection(); 
		if(selection.length == 1)
		{
			this.openCommentForm(grid, selection[0]);
		}
	},
	
	/**
	 * Do open comment
	 * @param {} grid: grid containing the comments list
	 * @param {} record: record of the comment to open
	 */
	openCommentForm: function(grid, record)
	{
		var idUser = record.get('idUser');
		var idUserCo = MetExplore.globals.Session.idUser;
		if (idUser == idUserCo || ['p', 'rw'].indexOf(MetExplore.globals.Session.access) > -1)
			var canEditComment = true;
		else
			var canEditComment = false;
		data = {'title': record.get('title'), 
		        'text': record.get('text'), 
			    'attachments': record.get('attachments'), 
			    'nameUser':  record.get('nameUser'),
			    'idUser': record.get('idUser'),
			    'idComment': record.get('idComment'),
			    'typeObject': record.get('typeObj'),
			    'idObject': record.get('idObj')};
		var parent = grid.up('window');
		if (parent == undefined) {
			parent = grid.up('projectPanel');
		}
		var win= Ext.create('Ext.Window',{
			title: data['title'],
			layout: 'fit',
			items:[{
				xtype:'detailsComment',
				data: data,
				canEdit: canEditComment,
				addNew: false,
				store: grid.getStore(),
				record: record,
				parent: parent
			}]
		});
		win.show();
		win.focus();
	},
	
	/**
	 * Delete comment button clicked
	 * @param {} button
	 */
	deleteCommentButton: function(button) {
		var grid = button.up('gridObjectComment');
		var selection = grid.getSelectionModel().getSelection(); 
		if(selection.length == 1)
		{
			this.deleteComment(grid, selection[0]);
		}
	},
	
	/**
	 * Do deletion of the comment
	 *@param {} grid: grid containing the comments list
	 * @param {} record: record of the comment to delete
	 */
	deleteComment: function(grid, record)
	{
		Ext.MessageBox.confirm('Confirm deletion', 'Confirm deletion of comment named "' + record.get('title') + '"?', function(btn){
			if(btn == 'yes')
			{

				MetExplore.globals.Session.isSessionExpired(function(isExpired){
					if(!isExpired){
						Ext.Ajax.request({
							url:'resources/src/php/deleteComment.php',
							params: {idComment: record.get('idComment'), idObject: record.get('idObj'), typeObject: record.get('typeObj')},
							failure : function(response, opts) {
								Ext.MessageBox
								.alert('Ajax error',
									'Delete comment has failed!');
							},
							success : function(response, opts) {
								var repJson=Ext.decode(response.responseText);
								if (repJson && repJson['success'])
								{
									grid.getStore().remove(record);
									var win = grid.up('window');
									if (win && win.down('gridObjectComment').updateNbComments)
									{
										win.down('gridObjectComment').updateNbComments("--");
									}
								}
								else
								{
									Ext.MessageBox
									.alert('Ajax error',
										repJson ? repJson['message'] : 'Delete comment has failed, without error message!');
								}
							}
						});
					}
				});
				
			}
		});
		
	},
	
	/**
	 * Refresh comments (reload store)
	 * @param {} button
	 */
	refreshComments: function(button) {
		MetExplore.globals.Session.isSessionExpired(function(isExpired){
	        if(!isExpired){
				button.up('gridObjectComment').getStore().reload();
			}
		});
		
	}
	
});