/**
 * C_ProjectPanel
 * Controls project panel buttons (that are not into subviews) events.
 */
Ext.define('MetExplore.controller.userAndProject.C_ProjectPanel', {

    extend: 'Ext.app.Controller',

    requires: ['MetExplore.globals.Session'],

    config: {
        views: ['main.V_projectPanel']
    },
    init: function() {
        this.control({
            'projectPanel button[action=closeProject]': {
                click: this.closeProject
            },
            'projectPanel button[action=editProject]': {
                click: this.editProject
            },
            'projectPanel panel[name="panelDescription"] button[action="save-desc-project"]': {
                click: this.saveDescription
            },
            'projectPanel panel[name="panelDescription"] textarea[name="descriptionProject"]': {
                change: this.editDescription
            },
            'projectPanel panel[name="panelDescription"] button[action="refresh"]': {
                click: this.refreshDescription
            }
        });

    },

    /**
     * Close project
     * @param {} button
     */
    closeProject: function(button) {
        MetExplore.globals.Project.closeOpenedProject();
    },

    /**
     * Edit project clicked
     * @param {} button
     */
    editProject: function(button) {
        var project = MetExplore.globals.Session.getCurrentProject();
        var win = Ext.create('Ext.window.Window', {
            title: "PROJECT: new project",
            layout: 'fit',
            iconCls: 'project-button-details',
            items: [{
                xtype: "ManageProject",
                name: project.get('name'),
                description: project.get('description'),
                idProject: project.get('idProject'),
                action: "update",
                users: project.get('users'),
                access: project.get('access')
            }]
        });
        win.show();
        win.focus();
    },

    /**
     * Save description
     * @param {} button
     */
    saveDescription: function(button) {
        var description = button.up('panel').down('textarea[name="descriptionProject"]').value;

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                Ext.Ajax.request({
                    url: 'resources/src/php/userAndProject/saveProject.php',
                    params: {
                        desc: description,
                        idProject: MetExplore.globals.Session.idProject,
                        action: "updateDescription"
                    },
                    failure: function(response, opts) {
                        Ext.MessageBox
                            .alert('Ajax error',
                                'save description failed: Ajax error!');
                    },
                    success: function(response, opts) {
                        var repJson = null;

                        try {
                            repJson = Ext.decode(response.responseText);
                        } catch (exception) {
                            Ext.MessageBox
                                .alert('Ajax error',
                                    'save description failed: JSON incorrect!');
                        }

                        if (repJson != null && repJson['success']) {
                            button.disable();
                            MetExplore.globals.Session.getCurrentProject().set('description', description);
                        } else {
                            Ext.MessageBox
                                .alert(
                                    'save description failed!',
                                    repJson['message']);
                        }

                    }
                });
            }
        });


    },

    /**
     * Edit description
     * @param {} field
     * @param {} newValue
     * @param {} oldValue
     * @param {} eOpts
     */
    editDescription: function(field, newValue, oldValue, eOpts) {
        field.up('panel').down('button[action="save-desc-project"]').enable();
    },

    /**
     * Refresh description
     * @param {} panel
     */
    doRefreshDescription: function(panel) {

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                //Reload project store:
                Ext.getStore('S_UserProjects').load({
                    callback: function() {
                        //Refresh description:
                        panel.down('textarea[name="descriptionProject"]').setValue(MetExplore.globals.Session.getCurrentProject().get('description'));
                        panel.down('button[action="save-desc-project"]').disable();
                    }
                });
            }
        });

    },

    /**
     * Refresh description clicked
     * @param {} button
     */
    refreshDescription: function(button) {
        var ctrl = this;
        var panel = button.up('panel[name="panelDescription"]');
        if (!panel.down('button[action="save-desc-project"]').disabled) {
            Ext.MessageBox.confirm('Ignore changes', 'This will delete your unsaved modifications. Continue?', function(btn) {
                if (btn == "yes") {
                    ctrl.doRefreshDescription(panel);
                }
            });
        } else {
            ctrl.doRefreshDescription(panel);
        }
    }
});