/**
 * C_UserTodoList
 */
Ext.define('MetExplore.controller.userAndProject.C_TodoList',{
	extend : 'Ext.app.Controller',
/*
	config : {
		views: ['grid.V_GridTodoList'],
		autoChange: true
	},
	*/
	init : function() {
		this.control({
			'gridTodoList': {
				itemdblclick: this.updateRow
			},
			'gridTodoList button[action=todoListPersonal]':{
				click:this.showPersonalTodo
			},
			'gridTodoList button[action=todoListAll]': {
				click:this.showAllTodo
			},
			'gridTodoList button[action=todoListDone]': {
				click:this.doneTodo
			},
			'gridTodoList button[action=todoListStart]': {
				click:this.startTodo
			},
			'gridTodoList button[action=todoListStop]': {
				click:this.stopTodo
			},
			'gridTodoList button[action=todoListCancelled]': {
				click:this.cancelTodo
			},
			'gridTodoList button[action=todoListPlus]': {
				click:this.addTodo
			},
			'gridTodoList button[action=todoListMinus]': {
				click:this.delTodo
			},
			'gridTodoList button[action=refresh]': {
				click:this.refreshTodo
			}
		});
	},
	
	//requires: ['MetExplore.view.form.V_EditTodoAction'],
	
	/**
	 * Update a row of the ToDolist
	 * @param {} grid: grid TodoList
	 * @param {} record: record to update
	 */
	updateRow: function(grid, record) {
		var idProject = record.get('idProject');
		var storeP = Ext.getStore("S_UserProjects").getRange();
		var projects = [];
		var usersInProjects = {};
		var access = "denied";
		if (grid.panel.type != "project") { //In this case we get access from the corresponding project, list of available projects with corresponding users
			for (var it = 0; it < storeP.length; it++) {
				if(storeP[it].get('idProject') == idProject)
				{
					access = storeP[it].get('access');
				}
				usersInProjects[storeP[it].get('idProject')] = storeP[it].get('users');
				projects.push({idProject: storeP[it].get('idProject'), name: storeP[it].get('name')});
			}
		}
		else { //In this case, we are in the project ToDolist, so we get access and users from current project
			var project = MetExplore.globals.Session.getCurrentProject();
			access = project.get('access');
			usersInProjects[project.get('idProject')] = project.get('users');
		}
		if (record.get('idUser') == MetExplore.globals.Session.idUser || access == "owner")
		{
			var win= Ext.create('Ext.Window',{
			title: 'TODO: ' + record.get('todo'),
			items:[{
				xtype:'EditTodoAction',
				description: record.get('todo'),
				users: usersInProjects,
				user: record.get('idUser'),
				projects: projects,
				project: record.get('idProject'),
				limitDate: record.get('limitDate'),
				status: record.get('status'),
				priority: record.get('priority'),
				action: "update",
				idTodo: record.get('id'),
				storeTodo: grid.getStore(),
				gridTD: grid.panel,
				rec: record
			}]
		});
			win.show();
			win.focus();
		}
		else {
			Ext.MessageBox
			.alert(
					'Access denied',
					"You can update only your actions, even if you are not the owner of the associated project!");
		}
	},
	
	/**
	 * Show only personal ToDoitems
	 * @param {} button
	 */
	showPersonalTodo : function(button)
	{
		var idUser = MetExplore.globals.Session.idUser;
		var grid = button.up('gridTodoList');
		grid.getStore().filter('idUser', idUser); //idUser is sometimes malformated (when we refresh page, iduser seems to contain \n !!!
		button.toggle(true);
	},
	
	/**
	 * Show all ToDoitems
	 * @param {} button
	 */
	showAllTodo: function(button)
	{
		var grid = button.up('gridTodoList');
		grid.getStore().clearFilter();
		button.toggle(true);
	},
	
	/**
	 * Add ToDoitem
	 * @param {} button
	 */
	addTodo: function(button)
	{
		var idP = button.up('gridTodoList').idProject;
		var storeP = Ext.getStore('S_UserProjects').getRange();
		var projects = [];
		var usersInProjects = {};
		for (var it = 0; it < storeP.length; it++) {
			usersInProjects[storeP[it].get('idProject')] = storeP[it].get('users');
			projects.push({idProject: storeP[it].get('idProject'), name: storeP[it].get('name')});
		}
		var limitDate = new Date(Date.now());
		limitDate.setDate(limitDate.getDate() + 7);
		var win= Ext.create('Ext.Window',{
			title: 'TODO: ' + "add new",
			items:[{
				xtype:'EditTodoAction',
				description: "",
				users: usersInProjects,
				user: MetExplore.globals.Session.idUser,
				projects: projects,
				project: idP == undefined ? "-1": idP,
				limitDate: limitDate,
				status: "Not started",
				priority: "normal",
				action: "add",
				idTodo: -1,
				gridTD: button.up('gridTodoList'),
				nameUser: MetExplore.globals.Session.nameUser
			}]
		});
		win.show();
		win.focus();
	},
	
	/**
	 * Set ToDoitem(s) done
	 * @param {} button
	 */
	doneTodo: function(button)
	{
		this.updateStatusTodo(button, "Done");
	},
	
	/**
	 * Set ToDoitem(s) started
	 * @param {} button
	 */
	startTodo: function(button)
	{
		this.updateStatusTodo(button, "In progress")
	},
	
	/**
	 * Set ToDoitem(s) not started
	 * @param {} button
	 */
	stopTodo: function(button)
	{
		this.updateStatusTodo(button, "Not started")
	},
	
	/**
	 * Set ToDoitem(s) cancelled
	 * @param {} button
	 */
	cancelTodo: function(button)
	{
		this.updateStatusTodo(button, "Cancelled")
	},
	
	/**
	 * Update ToDoitem(s) with given status: ToDoitems selected in the gridTodoList up to the button will be updated
	 * @param {} button: button inside gridTodoList
	 * @param {} status: new status
	 */
	updateStatusTodo: function(button, status)
	{
		var grid = button.up('gridTodoList');
		var selection = grid.getSelectionModel().getSelection();
		if (selection.length > 0) {
			updateSelections = [];
			originalSelections = [];
			for (var it = 0; it < selection.length; it++) {
				var originalData = selection[it].data;
				var updateData = $.extend({}, originalData);
				updateData['status'] = status;
				originalSelections.push(originalData);
				updateSelections.push(updateData);
			}

			MetExplore.globals.Session.isSessionExpired(function(isExpired){
		        if(!isExpired){
					Ext.Ajax.request({
						url : 'resources/src/php/userAndProject/updateTodoList.php',
						params : {
							todoListOrig: Ext.encode(originalSelections),
							todoListUpdt: Ext.encode(updateSelections),
							action: "update"
						},
						failure : function(response, opts) {
							Ext.MessageBox
									.alert('Ajax error',
											'update todolist failed: Ajax error!');
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
											'update todolist failed: JSON incorrect!');
							}

							if (repJson != null && repJson['success'])
							{
                                MetExplore.globals.Utils.refreshTodoList();
								if (repJson["itemsUpdt"])
								{
									for (var it = 0; it < repJson["itemsUpdt"].length; it++) {
										if (repJson["itemsUpdt"][it] != null)
										{
											selection[it].set('status', status);
										}
									}
								}
								if (repJson["message"] != "done")
								{
									Ext.MessageBox
										.alert(
												'Access denied',
												repJson['message']);
								}
							}
							else {
								Ext.MessageBox
										.alert(
												'update todoList failed!',
												repJson['message']);
							}
			
						}
					});
				}
			});

			
			
		}
	},
	
	/**
	 * Delete ToDoitem
	 * @param {} button
	 */
	 delTodo: function(button)
	 {
	 	var grid = button.up('gridTodoList');
	 	var storeTodo = grid.getStore();
	 	var selection = grid.getSelectionModel().getSelection();
	 	if (selection.length > 0) {
	 		Ext.MessageBox.confirm('Confirm deletion', 'Confirm deletion of selected TODO(s)?', function(btn){
	 			if(btn == 'yes')
	 			{
	 				updateSelections = [];
	 				for (var it = 0; it < selection.length; it++) {
	 					var updateData = selection[it].data;
	 					updateSelections.push(updateData);
	 				}

	 				MetExplore.globals.Session.isSessionExpired(function(isExpired){
	 					if(!isExpired){
	 						Ext.Ajax.request({
	 							url : 'resources/src/php/userAndProject/updateTodoList.php',
	 							params : {
	 								todoListUpdt: Ext.encode(updateSelections),
	 								action: "delete"
	 							},
	 							failure : function(response, opts) {
	 								Ext.MessageBox
	 								.alert('Ajax error',
	 									'update todolist failed: Ajax error!');
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
	 										'update todolist failed: JSON incorrect!');
	 								}

	 								if (repJson != null && repJson['success'])
	 								{
                                        MetExplore.globals.Utils.refreshTodoList();
	 									if (repJson["itemsUpdt"])
	 									{
	 										MetExplore.globals.Utils.refreshTodoList();
	 									}
	 									if (repJson["message"] != "done")
	 									{
	 										Ext.MessageBox
	 										.alert(
	 											'Access denied',
	 											repJson['message']);
	 									}
	 								}
	 								else {
	 									Ext.MessageBox
	 									.alert(
	 										'update todoList failed!',
	 										repJson['message']);
	 								}

	 							}
	 						});
	 					}
	 				});



	 			}
	 		});

	 	}
	 },
	
	/**
	 * Refresh todolist grid clicked
	 * @param {} button
	 */
	refreshTodo: function(button) {
		MetExplore.globals.Utils.refreshTodoList();
	}
	
});