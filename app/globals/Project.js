/**
 * Functions to manage projects
 */

Ext.define('MetExplore.globals.Project', {

    singleton: true,
    //requires : ['MetExplore.view.form.V_ChooseRightsOnUserProject','MetExplore.globals.Utils'],
    __project: null, // DO NOT USE ACCES OR CHANGE THIS VARIABLE. Please use
    // MetExplore.globals.Session.getCurrentProject instead

    /**
     * Open a project from an Id
     * 
     * @param {} idProject
     * @param {} filterUser : do filter user
     * @param {} showProject : show project after open it
     */
    openProjectById: function(idProject, filterUser, showProject) {
        var storeUserProjects = Ext.getStore('S_UserProjects');
        var records = storeUserProjects.getRange();
        var it = 0;
        var pFound = false;
        while (it < records.length && !pFound) {
            if (records[it].get('idProject') == idProject) {
                this.openProject(records[it], filterUser, showProject);
                pFound = true;
            }
            it++;
        }
    },

    /**
     * Open a project
     * 
     * @param {} project : object containing all infos of a project (record)
     * @param {} filterUser : do filter user
     * @param {} showProject : show project after open it
     */
    openProject: function(project, filterUser, showProject) {

        // Close old project BioSource if any:
        if (MetExplore.globals.Session.idProject != -1 &&
            MetExplore.globals.Session.idProject != project
            .get('idProject'))
            this.closeProjectBioSourceIfAny();

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                Ext.Ajax.request({
                    url: 'resources/src/php/userAndProject/openProject.php',
                    params: {
                        idProject: project.get('idProject')
                    },
                    failure: function(response, opts) {
                        Ext.MessageBox.alert('Ajax error',
                            'open project failed: Ajax error!');
                    },
                    success: function(response, opts) {
                        var repJson = null;

                        try {
                            repJson = Ext.decode(response.responseText);
                        } catch (exception) {
                            Ext.MessageBox.alert('Ajax error',
                                'open project failed: JSON incorrect!');
                        }

                        if (repJson != null && repJson['success']) {
                            var mainPanel = Ext.ComponentQuery.query('mainPanel')[0];
                            var projectPanel = mainPanel.down('projectPanel');

                            // We must remove all and recreate all, otherwise we have
                            // some VERY STRANGES bugs...
                            projectPanel.removeAll();
                            projectPanel.add(projectPanel.getItems());
                            projectPanel.setTitle('Project Details');

                            // Set name & date of the opened project:
                            projectPanel.down('label[name="title"]').setText(project
                                .get('name'));
                            projectPanel.down('label[name="dateC"]').setText('Created ' +
                                project.get('dateC'));

                            // Set project's ToDolist:
                            var idOpenProject = project.get('idProject');
                            var storeUTD = Ext.getStore('S_TodoList');
                            var storePTD = Ext.create("MetExplore.store.S_TodoList", {
                                storeId: "S_ProjectTodoList"
                            });
                            MetExplore.globals.Session.idProject = idOpenProject;
                            storePTD.updateProjectTodoList(filterUser);
                            /*
                             * storePTD.clearFilter(); storePTD.filter('idUser',
                             * MetExplore.globals.Session.idUser);
                             */
                            var gridTodo= projectPanel.down('gridTodoList');
                            if (gridTodo) {
                                gridTodo.bindStore(storePTD);
                                gridTodo.idProject = idOpenProject;
                                //gridTodo.getView().refresh();
                            }
                            // projectPanel.down('gridTodoList').bindStore(storePTD);
                            // projectPanel.down('gridTodoList').idProject = idOpenProject;


                            // Set project's BioSources :
                            var theStore = Ext.create("MetExplore.store.S_MyBioSource", {
                                storeId: "S_ProjectBioSource",
                                autoLoad: false,
                                groupField: null
                            });
                            var storeMyBioSource = Ext.getStore('S_MyBioSource');
                            theStore.add(storeMyBioSource
                                .getProjectBioSource(idOpenProject));
                            projectPanel.down('gridUserProjectBioSource')
                                .bindStore(theStore);
                            var gridProjectBioSource = Ext.ComponentQuery
                                .query('projectPanel gridUserProjectBioSource')[0];
                            if (project.get('access') != "owner") {
                                gridProjectBioSource
                                    .down('button[action="addBioSourceToProject"]')
                                    .hide();
                            } else {
                                gridProjectBioSource
                                    .down('button[action="addBioSourceToProject"]')
                                    .show();
                            }

                            // Set comments:
                            var removed = projectPanel
                                .down('panel[name="panelComments"]').removeAll();
                            projectPanel.down('panel[name="panelComments"]').add({
                                xtype: 'gridObjectComment',
                                idObject: idOpenProject,
                                typeObject: "project",
                                access: project.get('access'),
                                canAnnot: true,
                                border: false
                            });

                            // Set project's history:
                            var storeProjectHistory = Ext.getStore("S_ProjectHistory");

                            storeProjectHistory.proxy.extraParams = {
                                idUser: -1,
                                idProject: idOpenProject
                            };

                            storeProjectHistory.load();

                            storeProjectHistory.filter('idUser',
                                MetExplore.globals.Session.idUser);
                            var gridHistory = projectPanel.down('gridHistory');
                            gridHistory
                                .down('datefield[name="historyFrom"]')
                                .setValue(Ext.ComponentQuery
                                    .query('userPanel gridHistory datefield[name="historyFrom"]')[0].value);
                            gridHistory
                                .down('datefield[name="historyTo"]')
                                .setValue(Ext.ComponentQuery
                                    .query('userPanel gridHistory datefield[name="historyTo"]')[0].value);
                            if (project.get('access') != "owner") {
                                gridHistory.down('button[action="delete"]').hide();
                            } else {
                                gridHistory.down('button[action="delete"]').show();
                            }

                            // Set project's description:
                            projectPanel.down('textarea[name="descriptionProject"]')
                                .setValue(project.get('description'));
                            if (project.get('access') != "owner" &&
                                project.get('access') != "read/write") {
                                projectPanel
                                    .down('textarea[name="descriptionProject"]')
                                    .setReadOnly(true);
                                // projectPanel.down('panel[name="panelDescription"]').hideBbar();
                                // projectPanel.down('toolbar[name=descBbar]').hide();
                                projectPanel.down('button[action="save-desc-project"]')
                                    .hide();
                            } else {
                                projectPanel
                                    .down('textarea[name="descriptionProject"]')
                                    .setReadOnly(false);
                                // projectPanel.down('panel[name="panelDescription"]').getBottomToolbar().show();
                                // projectPanel.down('toolbar[name=descBbar]').show();
                                projectPanel.down('button[action="save-desc-project"]')
                                    .show();
                                projectPanel.down('button[action="save-desc-project"]')
                                    .disable();
                            }

                            // Set project's users:
                            var users = project.get('users');
                            var gridUsers = projectPanel.down('gridUsersInProject');
                            var storeUsersInProject = gridUsers.getStore();
                            storeUsersInProject.removeAll();
                            storeUsersInProject.add(users);
                            if (project.get('access') != "owner") {
                                // gridUsers.down('toolbar[name=toolbarUsers]').hide();
                                projectPanel.down('button[action="save-users"]').hide();
                                projectPanel.down('button[action="add-user"]').hide();
                                projectPanel.down('button[action="delete-user"]')
                                    .hide();
                            } else {
                                projectPanel.down('button[action="save-users"]').show();
                                projectPanel.down('button[action="add-user"]').show();
                                projectPanel.down('button[action="delete-user"]')
                                    .show();
                            }

                            // Set active tab to BioSource:
                            mainPanel.down('tabpanel[name=projectTabs]')
                                .setActiveTab(0);

                            // Edit project becomes project details if user is not an
                            // owner:
                            if (project.get('access') != "owner") {
                                projectPanel.down('button[action="editProject"]')
                                    .hide();
                            } else {
                                projectPanel.down('button[action="editProject"]')
                                    .show();
                            }

                            // Show:
                            projectPanel.tab.show();
                            if (showProject) {
                                mainPanel.setActiveTab(projectPanel);
                            }

                            // Show project's BioSources:
                            var comboProjectBS = Ext.ComponentQuery
                                .query("selectProjectBioSources")[0];
                            var storeCombo = Ext.create('Ext.data.Store', {
                                storeId: 'storeComboAddBSToProject',
                                fields: ['id', 'nameBioSource'],
                                data: Ext
                                    .getStore('S_MyBioSource')
                                    .getProjectBioSource(MetExplore.globals.Session.idProject)
                            });
                            comboProjectBS.bindStore(storeCombo);
                            if (storeCombo
                                .getById(MetExplore.globals.Session.idBioSource)) {
                                comboProjectBS
                                    .setValue(MetExplore.globals.Session.idBioSource);
                            }
                            comboProjectBS.show();
                            MetExplore.globals.Utils.displayShortMessage('Project ' +
                                project.get('name') + ' opened',
                                Ext.ComponentQuery.query("mainPanel")[0], 2000);

                            // Set project opened:
                            project.set('lastVisit', MetExplore.globals.Utils
                                .formatDate(new Date(), true));
                            project.set('neverOpened', false);
                        } else {
                            Ext.MessageBox.alert('open project failed!',
                                repJson['message']);
                        }

                    }
                });
            }
        });


    },

    /**
     * Close the opened project
     */
    closeOpenedProject: function() {

        var me = this;

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                Ext.Ajax.request({
                    url: 'resources/src/php/userAndProject/closeProject.php',
                    failure: function(response, opts) {
                        Ext.MessageBox.alert('Ajax error',
                            'close project failed: Ajax error!');
                    },
                    success: function(response, opts) {
                        var repJson = null;

                        try {
                            repJson = Ext.decode(response.responseText);
                        } catch (exception) {
                            Ext.MessageBox.alert('Ajax error',
                                'close project failed: JSON incorrect!');
                        }

                        if (repJson != null && repJson['success']) {
                            Ext.ComponentQuery.query('projectPanel')[0].tab.hide();
                            var userPanel = Ext.ComponentQuery.query('UserPanel')[0];
                            var mainPanel = userPanel.up('mainPanel');
                            mainPanel.setActiveTab(userPanel);
                            MetExplore.globals.Session.idProject = -1;
                            me.__project = null;
                            // If current BioSource is in opened project, close also
                            // BioSource :
                            me.closeProjectBioSourceIfAny();
                            MetExplore.globals.Utils.displayShortMessage(
                                'Project closed', Ext.ComponentQuery
                                .query("mainPanel")[0], 2000);
                        } else if (repJson != null) {
                            Ext.MessageBox.alert('close project failed!',
                                repJson['message']);
                        } else {
                            Ext.MessageBox.alert('close project failed!', 'no message');
                        }

                    }
                });
            }
        });


    },

    /**
     * Close BioSources of the opened project, if any
     */
    closeProjectBioSourceIfAny: function() {
        var idBioSource = MetExplore.globals.Session.idBioSource;
        if (idBioSource != -1) {
            var storeMyBS = Ext.getStore('S_MyBioSource');
            var bioSource = storeMyBS.getById(idBioSource);
            if (bioSource &&
                bioSource.get('idProject') != -1 &&
                bioSource.get('idProject') != MetExplore.globals.Session.idProject) {
                var ctrl = MetExplore.app.getController('C_BioSource');
                ctrl.unselectBioSource();
            }
        }
        Ext.ComponentQuery.query("selectProjectBioSources")[0].hide();
    },

    /**
     * Call add a BioSource to a project : launch required checks and launch add
     * if possible, else inform user of what to do
     * 
     * @param {} idBioSources
     * @param {} bioSources
     */
    callAddBioSourceToCurrentProject: function(idBioSources, bioSources) {

        var me = this;

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                Ext.Ajax.request({
                    url: 'resources/src/php/userAndProject/checkAddBioSourceToProject.php',
                    params: {
                        idBioSources: Ext.encode(idBioSources)
                    },
                    failure: function(response, opts) {
                        Ext.MessageBox
                            .alert('Ajax error',
                                'Add BioSource to project failed: Ajax error on check!');
                    },
                    success: function(response, opts) {
                        var repJson = null;

                        try {
                            repJson = Ext.decode(response.responseText);
                        } catch (exception) {
                            Ext.MessageBox
                                .alert('Ajax error',
                                    'Add BioSource to project failed: JSON incorrect on check!');
                        }

                        if (repJson != null && repJson['success']) {
                            if (repJson['hasOtherUsers']) {
                                var win = Ext.create('Ext.window.Window', {
                                    title: "Choose rights for other users of the BioSource",
                                    layout: "fit",
                                    items: [{
                                        xtype: "chooseRightsOnUserProject",
                                        users: repJson['otherUsers'],
                                        idBioSources: idBioSources,
                                        bioSources: bioSources
                                    }]
                                });
                                win.show();
                                win.focus();
                            } else {
                                me.addBioSourceToCurrentProject(idBioSources,
                                    bioSources);
                            }
                        } else if (repJson != null) {
                            Ext.MessageBox.alert('Add BioSource to project failed!',
                                repJson['message']);
                        } else {
                            Ext.MessageBox.alert(
                                'Add BioSource to project failed on check!',
                                'no message');
                        }

                    }
                });
            }
        });


    },

    /**
     * Add a given BioSource to current project. Make sure check have been done
     * before (function above)
     * 
     * @param {} idBioSources
     * @param {} bioSources: records of the edited BioSources
     * @param {}  usersToAdd (optional): list of users that need to be added to
     *            the project (because they are in the added BioSource)
     */
    addBioSourceToCurrentProject: function(idBioSources, bioSources,
        usersToAdd) {
        if (usersToAdd == undefined) {
            usersToAdd = [];
        }
        Ext.Ajax.request({
            url: 'resources/src/php/userAndProject/addBioSourceToProject.php',
            params: {
                idBioSources: Ext.encode(idBioSources),
                usersToAdd: Ext.encode(usersToAdd)
            },
            failure: function(response, opts) {
                Ext.MessageBox.alert('Ajax error',
                    'Add BioSource to project failed: Ajax error!');
            },
            success: function(response, opts) {
                var repJson = null;

                try {
                    repJson = Ext.decode(response.responseText);
                } catch (exception) {
                    Ext.MessageBox.alert('Ajax error',
                        'Add BioSource to project failed: JSON incorrect!');
                }

                if (repJson != null && repJson['success']) {
                    MetExplore.globals.Utils
                        .displayShortMessage(
                            'The selected BioSource(s) have been <br/>successfully added to current project!',
                            Ext.ComponentQuery.query("mainPanel")[0],
                            2000);
                    MetExplore.globals.Utils.refreshBioSources();
                } else if (repJson != null) {
                    Ext.MessageBox.alert('Add BioSource to project failed!',
                        repJson['message']);
                } else {
                    Ext.MessageBox.alert('Add BioSource to project failed!',
                        'no message');
                }

            }
        });
    },

    /**
     * Delete a BioSource from a project
     * 
     * @param {} idBioSources
     * @param {}  bioSources
     */
    deleteBioSourceFromProject: function(idBioSources, bioSources) {
        $haveAccesses = true;
        for (var it = 0; it < bioSources.length; it++) {
            if (bioSources[it].get("access") != "owner") {
                $haveAccesses = false;
            }
        }
        if ($haveAccesses) {

            MetExplore.globals.Session.isSessionExpired(function(isExpired) {
                if (!isExpired) {
                    Ext.Ajax.request({
                        url: 'resources/src/php/userAndProject/deleteBioSourceFromProject.php',
                        params: {
                            idBioSources: Ext.encode(idBioSources)
                        },
                        failure: function(response, opts) {
                            Ext.MessageBox
                                .alert('Ajax error',
                                    'Delete BioSource from project failed: Ajax error!');
                        },
                        success: function(response, opts) {
                            var repJson = null;

                            try {
                                repJson = Ext.decode(response.responseText);
                            } catch (exception) {
                                Ext.MessageBox
                                    .alert('Ajax error',
                                        'Delete BioSource from project failed: JSON incorrect!');
                            }

                            if (repJson != null && repJson['success']) {
                                MetExplore.globals.Utils
                                    .displayShortMessage(
                                        'The selected BioSource(s) have been <br/>successfully deleted from project!',
                                        Ext.ComponentQuery.query("mainPanel")[0],
                                        2000);
                                MetExplore.globals.Utils.refreshBioSources();
                            } else if (repJson != null) {
                                Ext.MessageBox.alert(
                                    'Delete BioSource from project failed!',
                                    repJson['message']);
                            } else {
                                Ext.MessageBox.alert(
                                    'Delete BioSource from project failed!',
                                    'no message');
                            }

                        }
                    });
                }
            });


        } else {
            Ext.MessageBox
                .alert(
                    "Denied!",
                    "You are not an owner of at least one selected BioSource, so you can't delete BioSources from project!")
        }
    }

});