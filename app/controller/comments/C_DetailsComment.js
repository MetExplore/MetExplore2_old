/**
 * C_windowDetailsComment 
 * Controls windowDetailsComment events.
 */
Ext.define('MetExplore.controller.comments.C_DetailsComment', {
	extend : 'Ext.app.Controller',

	config : {
		views : ['form.V_DetailsComment']
	},
	init : function() {
		this.control({
					'detailsComment button[action=cancel]' : {
						click : this.CancelComment
					},
					'detailsComment button[action=save]' : {
						click : this.SaveComment
					}
				});

	},

	/**
	 * Cancel comment form
	 * @param {} button
	 */
	CancelComment : function(button) {
		var win = button.up('window');
		if (win)
			win.close();
	},

	/**
	 * Save comment
	 * @param {} button
	 */
	SaveComment : function(button) {
		var win = button.up('form');
		var title = win.down('textfield[name=title]').value;
		var text = win.down('textarea[name=text]').value;
		var idComment = win.idComment;
		var nameUser = win.nameUser;
		var idObject = win.idObject;
		var typeObject = win.typeObject;
		var tmpAttachments = Ext.encode(win.tmpAttachments); // UPDATE THIS
																// ROW WHEN
																// READY
		var attachments = win.down('gridAttachment').getStore().getRange();
		var addNew = win.addNew;

		MetExplore.globals.Session.isSessionExpired(function(isExpired){
	        if(!isExpired){
						// Update comment:
				Ext.Ajax.request({
					url : 'resources/src/php/updateComment.php',
					params : {
						idComment : idComment,
						title : title,
						text : text,
						idObject : idObject,
						typeObject : typeObject,
						attachments : tmpAttachments,
						addNew : addNew
					},
					failure : function(response, opts) {
						Ext.MessageBox.alert('Ajax error',
							'save comment failed!');
					},
					success : function(response, opts) {
						var repJson = Ext.decode(response.responseText);
						if (repJson['success']) {
							var changeIds = repJson['idAttachments']; //New MySQL ids
							var idUser = repJson['idUser'];
							for (var it = 0; it < changeIds.length; it++) { //Update attachments ids
								var oldId = changeIds[it]["old"];
								var newId = changeIds[it]["new"];
								for (var nb = 0; nb < attachments.length; nb++) {
									if (attachments[nb].get('id') == oldId) {
										attachments[nb].set("id", newId.toString());
									}
								}
							}
							//Add new attachments
							var newAtt = [];
							for (var nb = 0; nb < attachments.length; nb++) {
								var oldId = attachments[nb].get('id'); 
								if (oldId < 0)
								{
									var it = 0;
									var changed = false;
									while (it < changeIds.length && !changed) {
										if (changeIds[it]["old"] == oldId) {
											attachments[nb].set("id", changeIds[it]["new"]);
											changed = true;
										}
										it++;
									}
								}
								newAtt.push(attachments[nb].data)
							}
							win.commentStore.reload();
							if (win.updateNbComments && win.parent && addNew) {
								win.parent.down('gridObjectComment').updateNbComments("++");
							}
							var pwin = win.up('window');
							if (pwin)
								pwin.close();
						} else {
							var msg = 'save comment failed!';

							if (repJson['message'] && repJson['message'] != "") {
								msg = repJson['message'];
							}

							Ext.MessageBox.alert('Ajax error', msg);
						}
					}
				});
			}
		});


	}

});
