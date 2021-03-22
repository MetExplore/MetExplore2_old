/**
 * C_ManageProject
 * Controls all V_ManageProject events.
 */
Ext.define('MetExplore.controller.userAndProject.C_ManageProject', {
    extend: 'Ext.app.Controller',

    config: {
        views: ['form.V_ManageProject']
    },

    init: function() {
        this.control({
            'ManageProject button[action=cancel]': {
                click: this.cancel
            },
            'ManageProject button[action=save]': {
                click: this.save
            }
        });

    },

    /**
     * Cancel button clicked
     * @param {} button
     */
    cancel: function(button) {
        var win = button.up('window');
        if (win)
            win.close();
    },

    /**
     * Save button clicked
     * @param {} button
     */
    save: function(button) {
        var win = button.up('form');
        var name = win.down('textfield[name="name"]').value;
        if (name != "") {
            var desc = win.down('textarea[name="desc"]').value;
            var gridUinP = win.down('gridUsersInProject');
            var usersStore = gridUinP.getStore();
            var action = win.action;
            var projectHasOwner = false;
            var deletedUsers = gridUinP.deletedUsers;
            var addedUsers = gridUinP.addedUsers;
            var users = [];
            usersStore.each(function(record) {
                if (record.get('access') == 'owner') {
                    projectHasOwner = true;
                }
                users.push(record.data);
            });
            if (usersStore.getCount() > 0 && projectHasOwner) {

                MetExplore.globals.Session.isSessionExpired(function(isExpired) {
                    if (!isExpired) {
                        //Save data:
                        Ext.Ajax.request({
                            url: 'resources/src/php/userAndProject/saveProject.php',
                            params: {
                                name: name,
                                desc: desc,
                                users: Ext.encode(users),
                                deletedUsers: Ext.encode(deletedUsers),
                                idProject: win.idProject,
                                action: action
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
                                    storeUP = Ext.getStore('S_UserProjects');
                                    var idProject = repJson['idProject'];
                                    var dateC = repJson['dateC'];
                                    var access = repJson['access'];
                                    if (action == "add") { //Then add project to the store
                                        storeUP.add({
                                            idProject: idProject,
                                            name: name,
                                            description: desc,
                                            dateC: dateC,
                                            access: access,
                                            users: users,
                                            active: true,
                                            neverOpened: true
                                        });
                                        var idRec = storeUP.find('idProject', idProject);
                                        project = storeUP.getAt(idRec);
                                    } else { //update the row on the store
                                        var idRec = storeUP.find('idProject', idProject);
                                        var project = storeUP.getAt(idRec);
                                        project.set('name', name);
                                        project.set('description', desc);
                                        project.set('access', access);
                                        project.set('users', users);
                                    }
                                    MetExplore.globals.Project.openProject(project, true, true);
                                    var pwin = win.up('window');
                                    if (pwin)
                                        pwin.close();
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


            } else {
                Ext.MessageBox.alert('Owner required', 'The project must have at least one owner');
            }
        } else {
            Ext.MessageBox.alert('Name required', 'You need to give a name!');
        }
    }

});