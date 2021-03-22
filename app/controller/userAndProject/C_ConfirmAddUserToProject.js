/**
 * C_ConfirmAddUserToProject
 * Controls all V_AddUserToProject events.
 */
Ext.define('MetExplore.controller.userAndProject.C_ConfirmAddUserToProject', {
    extend: 'Ext.app.Controller',

    config: {
        views: ['form.V_ConfirmAddUserToProject']
    },

    init: function() {
        this.control({
            'ConfirmAddUserToProject button[action=cancel]': {
                click: this.cancel
            },
            'ConfirmAddUserToProject button[action=confirm]': {
                click: this.confirmAddUser
            }
        });

    },

    /**
     * Cancel form
     * @param {} button
     */
    cancel: function(button) {
        var win = button.up('window');
        if (win)
            win.close();
    },

    /**
     * Confirm form
     * @param {} button
     */
    confirmAddUser: function(button) {
        var win = button.up('ConfirmAddUserToProject');
        var access = win.down('combo[name="access"]').value;
        var newUser = win.newUser;
        var gridUinP = win.gridUinP;
        var storeUinP = gridUinP.getStore();
        var user = {
            id: newUser['id'],
            name: newUser['name'],
            access: access,
            valid: 0
        };
        //If we add the item, it fails if a precedent project has been opened without refreshing screen.
        //To do not have this bug, we must remove all items, and then re-add all items, including the new one.
        //Not optimized but it works...
        /*var users = [];
        storeUinP.each(function(rec) {
        	users.push(rec.data);
        });
        users.push(user);
        storeUinP.removeAll();
        storeUinP.add(users);*/
        storeUinP.add(user);
        var deletedUsers = gridUinP.deletedUsers;
        var it = 0;
        var cancelAdd = false;
        while (it < deletedUsers.length && !cancelAdd) {
            if (deletedUsers[it] == newUser['id']) {
                deletedUsers.splice(it, 1);
                cancelAdd = true;
            }
            it++;
        }
        if (!cancelAdd)
            gridUinP.addedUsers.push(user['id']);
        var pwin = button.up('window');
        if (pwin)
            pwin.close();

        if (!gridUinP.down('toolbar').hidden) {
            gridUinP.down('button[action="save-users"]').enable();
            Ext.MessageBox.alert('Remember', 'After all changes, save to apply modifications.');
        }
    }

});