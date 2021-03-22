/**
 * C_ChooseRightsOnUserProject
 * Controls all V_ChooseRightsOnUserProject events.
 */
Ext.define('MetExplore.controller.userAndProject.C_ChooseRightsOnUserProject', {
    extend: 'Ext.app.Controller',

    config: {
        views: ['form.V_ChooseRightsOnUserProject']
    },

    requires: ['MetExplore.globals.Project', 'MetExplore.globals.Session'],

    init: function() {
        this.control({
            'chooseRightsOnUserProject button[action=cancel]': {
                click: this.cancel
            },
            'chooseRightsOnUserProject button[action=confirm]': {
                click: this.confirm
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
    confirm: function(button) {
        var win = button.up('chooseRightsOnUserProject');
        var gridStore = win.down('gridUsersInProject').getStore();
        var usersToAdd = [];
        gridStore.each(function(record) {
            var user = {
                'id': record.get('id'),
                'access': record.get('access')
            };
            usersToAdd.push(user);
        });
        var pwin = win.up('window');
        if (pwin)
            pwin.close();

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                MetExplore.globals.Project.addBioSourceToCurrentProject(win.idBioSources, win.bioSources, usersToAdd);
            }
        });


    }

});