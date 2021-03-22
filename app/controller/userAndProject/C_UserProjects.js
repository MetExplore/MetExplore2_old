/**
 * C_UserProjects
 */
Ext.define('MetExplore.controller.userAndProject.C_UserProjects',{
	extend : 'Ext.app.Controller',
/*
	config : {
		views: ['grid.V_gridUserProjects']
	},
	
	requires: ['MetExplore.view.form.V_ManageProject'],
*/	
	init : function() {
		this.control({
			'gridUserProjects button[action=addProject]':{
				click:this.addProject
			},
			'gridUserProjects button[action=openProject]':{
				click:this.openProject
			},
			'gridUserProjects button[action=deleteProject]':{
				click:this.deleteProject
			},
			'gridUserProjects button[action=unsubscribeProject]':{
				click:this.unsubscribeProject
			},
			'gridUserProjects button[action=refresh]':{
				click:this.refreshProjects
			},
			'gridUserProjects':{
				itemcontextmenu : this.editMenu,
				selectionchange: this.activeEditButtons,
				itemdblclick: this.doubleClickOnItem
			}
		});
	},
	
	/**
	 * on right click, open a custom menu
	 * @param {} grid: the grid view
	 * @param {} record: the record linked to the item
	 * @param {} item: the item's element
	 * @param {} index: row index
	 * @param {} e: the raw event object
	 * @param {} eOpts: the options object passed to Ext.util.Observable.addListener
	 */
	editMenu: function(grid, record, item, index, e, eOpts) {
		e.preventDefault();
		var ctrl= this;
		var active = record.get('active');
		grid.CtxMenu = new Ext.menu.Menu({
			items : [{
				text : 'Accept invitation',
				hidden : active,
				handler: function() {
					ctrl.acceptInvitation(record.get('idProject'), record, grid, index, false);
				}
			},{
				text : 'Reject invitation',
				hidden : active,
				handler: function() {
					ctrl.unsubscribeProject(grid.panel.down('button[action=unsubscribeProject]'));
				}
			},{
				text : 'Open',
				hidden : !active,
				handler: function() {
					ctrl.openProject(grid.panel.down('button[action=openProject]'));
				}
			},{
				text : 'Unsubscribe',
				hidden : !active,
				handler: function() {
					ctrl.unsubscribeProject(grid.panel.down('button[action=unsubscribeProject]'));
				}
			},{
				text : 'Delete',
				hidden : !active && record.get('access') != 'owner',
				handler: function() {
					ctrl.deleteProject(grid.panel.down('button[action=deleteProject]'));
				}
			}]
		});
		
		// positionner le menu au niveau de la souris
		grid.CtxMenu.showAt(e.getXY());
	},
	
	/**
	 * Change enable status of buttons while selection change
	 * @param {} selected: selected rows
	 * @param {} eOpts: the options object passed to Ext.util.Observable.addListener
	 */
	activeEditButtons: function(selected, eOpts) {
		var grid = selected.view.up('gridUserProjects');
		var selection = grid.getSelectionModel().getSelection();
		var selLength = selection.length;
		if (selLength == 1) {
			if (selection[0].get('active') == true) {
				grid.down("button[action=openProject]").setDisabled(false);
				grid.down("button[action=unsubscribeProject]").setDisabled(false);
			}
			else {
				grid.down("button[action=openProject]").setDisabled(true);
				grid.down("button[action=unsubscribeProject]").setDisabled(true);
			}
			if (selection[0].get('access') == 'owner' && selection[0].get('active') == true) {
				grid.down("button[action=deleteProject]").setDisabled(false);
			}
			else {
				grid.down("button[action=deleteProject]").setDisabled(true);
			}
		}
		else {
			grid.down("button[action=deleteProject]").setDisabled(true);
			grid.down("button[action=openProject]").setDisabled(true);
			grid.down("button[action=unsubscribeProject]").setDisabled(true);
		}
	},
	
	/**
	 * Add project button clicked
	 * @param {} button
	 */
	addProject: function(button) {
		var win = Ext.create('Ext.window.Window',
		{
			title: "PROJECT: new project",
			layout: "fit",
			items: [{
				xtype: "ManageProject",
				name: "",
				description: "",
				idProject: -1,
				action: "add",
				users: [],
				access: "owner"
			}]
		});
		win.show();
		win.focus();
	},
	
	/**
	 * Accept invitation to a project
	 * @param {} idProject
	 * @param {} record
	 * @param {} gridView
	 * @param {} indexRow
	 * @param {} openAfter: open project after accept invitation if true
	 */
	acceptInvitation: function(idProject, record, gridView, indexRow, openAfter) {

		MetExplore.globals.Session.isSessionExpired(function(isExpired){
	        if(!isExpired){
				Ext.Ajax.request({
					url : 'resources/src/php/userAndProject/acceptInvitationProject.php',
					params : {
						idProject: idProject
					},
					failure : function(response, opts) {
						Ext.MessageBox
								.alert('Ajax error',
										'accept invitation failed: Ajax error!');
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
										'accept invitation failed: JSON incorrect!');
						}

						if (repJson != null && repJson['success'])
						{
							Ext.MessageBox.alert('Success!', 'You are now an active participant to this project!');
							record.set('active', true);
							gridView.deselect(indexRow);
							gridView.select(indexRow);
							if (openAfter) {
								MetExplore.globals.Project.openProject(record, true, true);
							}
						}
						else {
							Ext.MessageBox
								.alert(
										'accept invitation failed!',
										repJson['message']);
						}

					}
				});
			}
		});


		
	},
	
	/**
	 * Open selected project
	 * @param {} button
	 */
	openProject: function(button) {
		var projectSelected = button.up('UserPanel').down('gridUserProjects').getSelectionModel().getSelection();
		if (projectSelected.length == 1)
		{
			var project = projectSelected[0];
			//Set values:
			MetExplore.globals.Project.openProject(project, true, true);
		}
		else
		{
			Ext.MessageBox.alert('Error in selection', 'Please select extactly one project');
		}
	},
	
	/**
	 * Double-click on item: open project if active, ask accept invitation else
	 * @param {} view
	 * @param {} rec
	 * @param {} node
	 * @param {} index
	 * @param {} e
	 * @param {} options
	 */
	doubleClickOnItem: function(view, rec, node, index, e, options) {
		var ctrl = this;
		if (rec.get('active') == true)
			MetExplore.globals.Project.openProject(rec, true, true);
		else {
			Ext.MessageBox.confirm('Accept invitation', 'Do you want accept the invitation to this project?', function(btn) {
				if (btn == "yes") {
					ctrl.acceptInvitation(rec.get('idProject'), rec, view, index, true);
				}
			});
		}
	},
	
	/**
	 * do unsubscribe to, or delete, a project
	 * @param {} deleteProject: the project to delete
	 * @param {} action: unsubscribe or delete
	 * @param {} bsToDelete: if delete, the BioSources the user ask to delete
	 */
	doQuitOrDeleteProject: function(deleteProject, action, bsToDelete) {
		var idProject = deleteProject.get('idProject');
		if (idProject == MetExplore.globals.Session.idProject) {
			MetExplore.globals.Project.closeOpenedProject();
		}

		MetExplore.globals.Session.isSessionExpired(function(isExpired){
	        if(!isExpired){
				Ext.Ajax.request({
					url : 'resources/src/php/userAndProject/deleteProject.php',
					params : {
						idProject: idProject,
						action: action
					},
					failure : function(response, opts) {
						Ext.MessageBox
								.alert('Ajax error',
										'delete project failed: Ajax error!');
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
										'delete project failed: JSON incorrect!');
						}

						if (repJson != null && repJson['success'])
						{
							storeUP = Ext.getStore('S_UserProjects');
							storeUP.remove(deleteProject);
							if (idProject == MetExplore.globals.Session.idProject) { //If idProject is opened project
								var mainPanel = Ext.ComponentQuery.query('mainPanel')[0];
								var projectPanel = mainPanel.down('projectPanel');
								projectPanel.tab.hide();
							}
							
							if (bsToDelete) { //If user asked to delete BioSources of the project, do it:
								jsonModif = Ext.encode(bsToDelete);
								MetExplore.globals.BioSource.doDeleteBioSources(bsToDelete, jsonModif);
							}
							
							//Update BioSources grid:
							var grid=Ext.ComponentQuery.query('networkData gridBioSource')[0];

							grid.setLoading(true);
							
							grid.getStore().reload(function(){
								grid.setLoading(false);
								var storeMyBioSource = Ext.getStore('S_MyBioSource');
								var storeUserBioSource = Ext.getStore('S_UserBioSource');
								storeUserBioSource.add(storeMyBioSource.clone());
							});
						}
						else {
							Ext.MessageBox
								.alert(
										'delete project failed!',
										repJson['message']);
						}

					}
				});
			}
		});

		
	},
	
	/**
	 * Start unsubscribe or delete a project
	 * @param {} deleteProject: the project to delete
	 * @param {} action: unsubscribe or delete
	 */
	quitOrDeleteProject: function(deleteProject, action) {
		
		var ctrl = this;
		
		Ext.MessageBox.confirm('Confirm deletion', 'Confirm '+ action +' project named "' + deleteProject.get('name') + '"?', function(btn){
			if(btn == 'yes')
			{
				var idProject = deleteProject.get('idProject');
				
				if (action == 'delete') {
					//Propose to user delete also BioSources of the project, if any:
					var storeMyBioSources = Ext.getStore('S_MyBioSource');
					var projectBS = [];
					storeMyBioSources.each(function(rec){
						if (rec.get('idProject') == idProject) {
							projectBS.push({'ids': {'idBioSource': rec.get('id'), 'databaseRef': rec.get('dbId')}, 'name': rec.get('NomComplet')});
						}
					});
					
					if (projectBS.length > 0) {
					
						var win= Ext.create('Ext.window.Window',
						{
							title: 'BioSource deletion',
							width: 400,
							height: Math.min(100 + (projectBS.length * 25), 400),
							modal: true,
							layout: {
						    	type: 'vbox',
						    	align: 'stretch',
						    	animate: true
						    },
							items: [{
								xtype: 'label',
								text: 'Delete associated BioSources?',
								cls: 'boldText',
								height: 20,
								margins: '5 0 0 5'
							},{
								xtype: 'form',
								name: 'deletedBS',
								autoScroll: true,
								flex: 1,
								buttons: [{
									text: 'Yes',
									action: 'deleteBS',
									handler: function(button) {
										//Select selected BioSource
										var items = button.up('form').query('checkboxfield');
										var bsToDelete = [];
										Ext.each(items, function(item) {
											if (item.getValue() == true) {
												bsToDelete.push(item.inputValue);
											}
										});
										var values = {"idBioSources": [], "databaseRefs": {}};
										for (var it = 0; it < bsToDelete.length; it++) {
											values["idBioSources"].push(bsToDelete[it]['idBioSource']);
											values["databaseRefs"][bsToDelete[it]['idBioSource']] = bsToDelete[it]['databaseRef'];
										}
										ctrl.doQuitOrDeleteProject(deleteProject, action, values);
										button.up('window').close();
									}
								},{
									text: 'No',
									action: 'noDeleteBS',
									handler: function(button) {
										button.up('window').close();
										ctrl.doQuitOrDeleteProject(deleteProject, action);
									},
									listeners: {
								        render: function(f) {
								            f.findParentByType('window').defaultButton = f; //Set this button as default
								        }
								     }
								},{
									text: 'Cancel',
									action: 'cancelDelete',
									handler: function(button) {
										button.up('window').close();
									}
								}]
							}]
						});
						var form = win.down('form');
						for (var it = 0; it < projectBS.length; it++) {
							form.add({
								xtype: 'checkboxfield',
								boxLabel: projectBS[it]['name'],
								inputValue: projectBS[it]['ids'],
								checked: true
							});
						}
						win.show();
						win.focus();
					}
					else {
						ctrl.doQuitOrDeleteProject(deleteProject, action);
					}
				}
				else {
					ctrl.doQuitOrDeleteProject(deleteProject, action);
				}
			}
		});
	},
	
	/**
	 * Unsubscribe project button clicked
	 * @param {} button
	 */
	unsubscribeProject: function(button) {
		var projectSelected = button.up('UserPanel').down('gridUserProjects').getSelectionModel().getSelection();
		if (projectSelected.length == 1)
		{
			var deleteProject = projectSelected[0];
			var hasAnOwner = true;
			if (deleteProject.get('access') == 'owner') {
				var users = deleteProject.get('users');
				if (deleteProject.get('access') == 'owner') {
					//Search if project has an other owner:
					hasAnOwner = false;
					var it = 0;
					while (it < users.length && !hasAnOwner) {
						if (users[it]['access'] == 'owner' && users[it]['id'] != MetExplore.globals.Session.idUser) {
							hasAnOwner = true;
						}
						it++;
					}
				}
			}
			if (hasAnOwner)
				this.quitOrDeleteProject(deleteProject, 'quit');
			else {
				Ext.MessageBox.alert('Project must have an owner', 'You are the only owner. You must set an other owner before quit the project.');
			}
		}
		else
		{
			Ext.MessageBox.alert('Error in selection', 'Please select extactly one project');
		}
	},
	
	/**
	 * Delete project button clicked
	 * @param {} button
	 */
	deleteProject: function(button) {
		var projectSelected = button.up('UserPanel').down('gridUserProjects').getSelectionModel().getSelection();
		if (projectSelected.length == 1)
		{
			var deleteProject = projectSelected[0];
			this.quitOrDeleteProject(deleteProject, 'delete');
		}
		else
		{
			Ext.MessageBox.alert('Error in selection', 'Please select extactly one project');
		}
	},
	
	/**
	 * Refresh list of projects clicked
	 * @param {} button
	 */
	refreshProjects: function(button) {

		MetExplore.globals.Session.isSessionExpired(function(isExpired){
	        if(!isExpired){
				Ext.getStore('S_UserProjects').load();
			}
		});
		//reload store:
		
	}
});