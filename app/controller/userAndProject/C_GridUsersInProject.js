/**
 * C_GridUsersInProject
 * Controls all V_GridUsersInProject events.
 */
Ext.define('MetExplore.controller.userAndProject.C_GridUsersInProject', {
    extend: 'Ext.app.Controller',
    /*
    	config : {
    		views : ['form.V_AddUserToProject', 'form.V_ConfirmAddUserToProject', 'grid.GridUsersInProject']
    	},
    	
    	requires: ['MetExplore.view.form.V_ConfirmAddUserToProject', 'MetExplore.view.grid.V_GridUsersInProject'],
    */
    init: function() {
        this.control({
            'addUserToProject textfield[name=newUser]': {
                keyup: this.enterNewUser
            },
            'addUserToProject button[action=submitNewUser]': {
                click: this.addNewUser
            },
            'gridUsersInProject': {
                beforeedit: this.checkCanEdit,
                itemcontextmenu: this.editMenu,
                selectionchange: this.selectionChange,
                edit: this.updateUser
            },
            'gridUsersInProject button[action="add-user"]': {
                click: this.addUserButton
            },
            'gridUsersInProject button[action="delete-user"]': {
                click: this.deleteUserButton
            },
            'gridUsersInProject button[action="save-users"]': {
                click: this.saveUsers
            },
            'gridUsersInProject button[action="refresh"]': {
                click: this.refreshUsers
            }
        });

    },

    /**
     * Valid add user form by enter key
     * @param {} e
     * @param {} eOpts
     */
    enterNewUser: function(e, eOpts) {
        var newValue = e.value;
        var win = e.up('form');
        var button = win.down('button[action=submitNewUser]');
        if (newValue != "" && newValue != undefined) {
            button.setDisabled(false);
            if (eOpts.getCharCode() == Ext.EventObject.ENTER) {
                this.addNewUser(button);
            }
        } else {
            button.setDisabled(true);
        }
    },

    /**
     * Launch add of a new user
     * @param {} value : user identifiant or email
     * @param {} win : parent panel
     */
    doAddNewUser: function(value, gridUinP) {
        //Get all info for user selected:
        Ext.Ajax.request({
            url: 'resources/src/php/userAndProject/getDataUserFromUsernameOrEmail.php',
            params: {
                identifiant: value
            },
            failure: function(response, opts) {
                Ext.MessageBox
                    .alert('Ajax error',
                        'add user failed: Ajax error!');
            },
            success: function(response, opts) {
                var repJson = null;

                try {
                    repJson = Ext.decode(response.responseText);
                } catch (exception) {
                    Ext.MessageBox
                        .alert('Ajax error',
                            'add user failed: JSON incorrect!');
                }

                if (repJson != null && repJson['success']) {
                    var newUser = repJson["results"];
                    var nameUser = newUser["name"];
                    var storeUinP = gridUinP.getStore();
                    var alreadyExists = false;
                    storeUinP.each(function(record) {
                        if (record.get('id') == newUser['id']) {
                            alreadyExists = true;
                        }
                    });
                    if (alreadyExists) {
                        Ext.MessageBox.alert('User already in project', 'User ' + nameUser + ' (' + value + ') is already part of the project!');
                    } else {
                        var winConf = Ext.create('Ext.window.Window', {
                            title: "Add new user",
                            items: [{
                                xtype: 'ConfirmAddUserToProject',
                                nameUser: nameUser,
                                value: value,
                                gridUinP: gridUinP, //we pass the grid as parameter, because ConfirmAddUserToProject must know which grid (so which store) to update.
                                newUser: newUser
                            }]
                        });
                        winConf.show();
                        winConf.focus();
                    }
                } else {
                    Ext.MessageBox
                        .alert(
                            'add user failed!',
                            repJson['message']);
                }

            },
            scope: this
        });
    },

    /**
     * Add new user by clicking on button in AddUserToProject form
     * @param {} button
     */
    addNewUser: function(button) {
        var win = button.up('form');
        var value = win.down('textfield[name="newUser"]').value;
        if (value != "" && value != undefined) {
            this.doAddNewUser(value, win.down('gridUsersInProject'));
        }
    },

    /**
     * Selection change on grid
     * @param {} selected: selected elements
     * @param {} eOpts
     */
    selectionChange: function(selected, eOpts) {
        if (selected.selected.length > 0) {
            selected.view.up('gridUsersInProject').down('button[action="delete-user"]').enable();
        } else {
            selected.view.up('gridUsersInProject').down('button[action="delete-user"]').disable();
        }
    },

    /**
     * Update user
     * @param {} editor
     * @param {} eOpts
     */
    updateUser: function(plugin, context, eOpts) {

        if (context.originalValue === "owner") {
            if (context.store.findExact("access", "owner") === -1) {

                context.record.set("access", "owner");
                Ext.MessageBox.alert("Last Owner", "You are the last owner of this project, you cannot change your rights.</br>You have to name another owner for this project before you can do this");
                return;
            }
        }
        plugin.view.up('gridUsersInProject').down('button[action="save-users"]').enable();
    },

    /**
     * Add user using toolbar button
     * @param {} button
     */
    addUserButton: function(button) {
        Ext.MessageBox.prompt('Add new user to project ' + MetExplore.globals.Session.getCurrentProject().get('name'), 'Username or e-mail of the new user:', function(btn, text, cfg) {
            if (btn == 'ok') {
                this.doAddNewUser(text, button.up('gridUsersInProject'));
            }
        }, this);
    },

    /**
     * Check user can edit before start editing
     * @param {} editor
     * @param {} e
     * @return {Boolean}
     */
    checkCanEdit: function(editor, e) {
        if (editor.grid.type == "inAddUserForm") {
            var access = editor.grid.up('addUserToProject').access
        } else {
            var access = MetExplore.globals.Session.getCurrentProject().get('access');
        }
        if (access != "owner")
            return false;
    },

    /**
     * Custom context menu
     * @param {} grid
     * @param {} record
     * @param {} item
     * @param {} index
     * @param {} e
     * @param {} eOpts
     */
    editMenu: function(grid, record, item, index, e, eOpts) {
        if (grid.up('gridUsersInProject').editMenu) {
            e.preventDefault();
            var idUser = record.get('id');
            var idUserCo = MetExplore.globals.Session.idUser;
            if (grid.up('gridUsersInProject').type == "inAddUserForm") {
                var access = grid.up('addUserToProject').access
            } else {
                var access = MetExplore.globals.Session.getCurrentProject().get('access');
            }
            if (idUser == idUserCo || access == "owner")
                var canDelete = true;
            else
                var canDelete = false;
            grid.CtxMenu = new Ext.menu.Menu({
                items: [{

                    text: 'Delete user',
                    handler: function() {
                        this.deleteUser(grid, record);
                    },
                    scope: this,
                    hidden: !canDelete
                }]
            });
            // positionner le menu au niveau de la souris
            grid.CtxMenu.showAt(e.getXY());
        }
    },

    /**
     * Do delete of users from the grid
     * @param {} grid
     */
    doDeletion: function(grid) {
        var selection = grid.getSelectionModel().getSelection();

        for (var i = 0; i < selection.length; i++) {
            if (selection[i].get('access') === "owner") {
                Ext.MessageBox.alert('User is an Owner', 'One of the selected user is an Owner of the project. Deleting owners of project is not permitted');
                return;
            }
        }

        for (var it = 0; it < selection.length; it++) {

            grid.getStore().remove(selection[it]);
            var addCancel = false;
            var nb = 0;
            var addedUsers = grid.addedUsers;
            while (nb < addedUsers.length && !addCancel) {
                if (addedUsers[nb] == selection[it].get('id')) {
                    addCancel = true;
                    addedUsers.splice(nb, 1);
                }
                nb++;
            }
            if (!addCancel) {
                grid.deletedUsers.push(selection[it].get('id'));
            }
        }

        if (!grid.down('toolbar').hidden) {
            grid.down('button[action="save-users"]').enable();
            Ext.MessageBox.alert('Remember', 'After all changes, save to apply modifications.');
        }
    },

    /**
     * Click on delete user button
     * @param {} button
     */
    deleteUserButton: function(button) {
        var grid = button.up('gridUsersInProject');
        this.doDeletion(grid);
    },

    /**
     * Delete user from context menu
     * @param {} grid
     * @param {} record
     */
    deleteUser: function(grid, record) {
        gridUinP = grid.up('gridUsersInProject');
        this.doDeletion(gridUinP);
    },

    /**
     * Save users
     * @param {} button
     */
    saveUsers: function(button) {
        var grid = button.up('gridUsersInProject');
        var users = [];
        grid.getStore().each(function(record) {
            if (record.get('access') == 'owner') {
                projectHasOwner = true;
            }
            users.push(record.data);
        });
        var deletedUsers = grid.deletedUsers;

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                Ext.Ajax.request({
                    url: 'resources/src/php/userAndProject/saveProject.php',
                    params: {
                        users: Ext.encode(users),
                        deletedUsers: Ext.encode(deletedUsers),
                        idProject: MetExplore.globals.Session.idProject,
                        action: "updateUsers"
                    },
                    failure: function(response, opts) {
                        Ext.MessageBox
                            .alert('Ajax error',
                                'save project failed: Ajax error!');
                    },
                    success: function(response, opts) {
                        var repJson = null;

                        try {
                            repJson = Ext.decode(response.responseText);
                        } catch (exception) {
                            Ext.MessageBox
                                .alert('Ajax error',
                                    'save project failed: JSON incorrect!');
                        }

                        if (repJson != null && repJson['success']) {
                            button.disable();
                            MetExplore.globals.Session.getCurrentProject().set('users', users);
                        } else {
                            Ext.MessageBox
                                .alert(
                                    'save project failed!',
                                    repJson['message']);
                        }

                    }
                });
            }
        });



    },

    /**
     * Do the refresh of users
     * @param {} gridUinP: grid Users in Project
     */
    doRefreshUsers: function(gridUinP) {

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                //Reload project store:
                Ext.getStore('S_UserProjects').load({
                    callback: function() {
                        //Refresh users list:
                        var storeUinP = gridUinP.getStore();
                        storeUinP.removeAll();
                        storeUinP.add(MetExplore.globals.Session.getCurrentProject().get('users'));
                        gridUinP.down('button[action="save-users"]').disable();
                    }
                });
            }
        });


    },

    /**
     * Button refresh users clicked
     * @param {} button
     */
    refreshUsers: function(button) {
        var ctrl = this;
        var gridUinP = button.up('gridUsersInProject');
        if (!gridUinP.down('button[action="save-users"]').disabled) {
            Ext.MessageBox.confirm('Ignore changes', 'This will delete your unsaved modifications. Continue?', function(btn) {
                if (btn == "yes") {
                    ctrl.doRefreshUsers(gridUinP);
                }
            });
        } else {
            ctrl.doRefreshUsers(gridUinP);
        }
    }

});