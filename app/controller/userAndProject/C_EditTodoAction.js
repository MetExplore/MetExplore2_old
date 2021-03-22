/**
 * C_WindowEditTodoAction 
 * Controls all V_WindowEditTodoAction events.
 */
Ext.define('MetExplore.controller.userAndProject.C_EditTodoAction', {
	extend : 'Ext.app.Controller',

	config : {
		views : ['form.V_EditTodoAction']
	},
	
	init : function() {
		this.control({
					'EditTodoAction button[action=cancel]' : {
						click : this.cancel
					},
					'EditTodoAction button[action=save]' : {
						click : this.save
					},
					'EditTodoAction combo[name=project]' : {
						change: this.updateUsers
					}
				});

	},
	
	/**
	 * Update the combobox of the list of users while the project change, to show the users of the selected project
	 * @param {} ele: the combobox of project
	 * @param {} newValue
	 * @param {} oldValue
	 */
	updateUsers: function(ele, newValue, oldValue)
	{
		var win = ele.up('form');
		dataUsers = win.users[newValue];
		var comboUser = win.down('combo[name=user]');
		idUser = comboUser.value;
		//Create new store (only way to update store of combobox without bug):
		var storeUsers = Ext.create('Ext.data.Store', {
			model: 'MetExplore.model.User',
			proxy :{
				type: 'memory'
			},
			data: dataUsers
		});
		//Update combobox store:
		comboUser.bindStore(storeUsers);
		//If in the new project, the selected user does not exist, set user to connected user:
		var isIn = false;
		for (var it = 0; it < dataUsers.length; it++) {
			if (dataUsers[it]['id'] == idUser)
			{
				isIn = true;
			}
		}
		if (!isIn)
		{
			comboUser.setValue(MetExplore.globals.Session.idUser);
		}
	},
	
	/**
	 * Cancel button clicked
	 * @param {} button
	 */
	cancel : function(button) {
		var win = button.up('window');
		if (win)
			win.close();
	},

	/**
	 * Save button clicked
	 * @param {} button
	 */
	save : function(button) {

		var me=this;

		var now = new Date(Date.now());
		var win = button.up('form');
		var rec = win.rec; //Record to update
		var grid = win.gridTD; //TodoList grid
		var storeTodo = grid.getStore();
		//Get new values:
		var newDesc = win.down('[name="desc"]').value;
		var newProject = win.down('[name="project"]').value;
		var newUser = win.down('[name="user"]').value;
		var newLimitDate = win.down('[name="limitDate"]').getRawValue();
		var newStatus = win.down('[name="status"]').value;
		var newPriotity = win.down('[name="priority"]').value;
		var dataUpdt = [{'id': win.idTodo, 'todo': newDesc, 'idProject': newProject, 'idUser': newUser, 'limitDate': newLimitDate, 'status': newStatus, 'priority': newPriotity}];
		

		if (newDesc != "" && newProject != "") //Check required fields are filled
		{
			MetExplore.globals.Session.isSessionExpired(function(isExpired){
		        if(!isExpired){
					//Update ToDolist
					Ext.Ajax.request({
						url : 'resources/src/php/userAndProject/updateTodoList.php',
						params : {
							todoListUpdt: Ext.encode(dataUpdt),
							todoListOrig: Ext.encode(win.dataOrig),
							action: win.action,
							nameUser: win.nameUser
						},
						scope : me,
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
								pwin = win.up('window');
								if (pwin)
									pwin.close();
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
		else
		{
			Ext.MessageBox.alert('Fields are empty', 'Please fill all fields!');
		}
	}
});