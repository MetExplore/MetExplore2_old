Ext.define('MetExplore.view.main.V_ProjectPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.projectPanel',

    layout: {
        type: 'vbox',
        align: 'stretch',
        animate: true,
        padding: 10
    },
    bodyStyle: {
        "background-color": "#e0e5ea"
    },
    autoScroll: true,
    defaults: {
        border: false
    },
    items: [],

    requires: ['MetExplore.view.form.V_SelectMyBioSources'],

    /**
     * Set items of the project panel
     * @return {}
     */
    getItems: function() {
        return [{
                xtype: 'panel',
                margins: '0 0 10 0',
                layout: {
                    type: 'hbox',
                    align: 'bottom',
                    animate: true,
                    padding: 0
                },
                items: [{
                    xtype: 'panel',
                    bodyStyle: {
                        "background-color": "#e0e5ea"
                    },
                    border: false,
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'end',
                        animate: true,
                        padding: 0
                    },
                    items: [{
                            xtype: 'label',
                            name: 'title',
                            cls: 'project-title',
                            margins: '0 10 0 0'
                        }, {
                            xtype: 'label',
                            name: 'dateC',
                            text: 'Created 0000/00/00',
                            cls: 'project-dateC',
                            margins: '0 20 0 0'
                        }, {
                            xtype: 'button',
                            action: 'editProject',
                            iconCls: 'project-button-details',
                            tooltip: 'Edit project',
                            scale: 'medium',
                            margins: '0 0 0 10'
                        },
                        {
                            xtype: 'button',
                            action: 'closeProject',
                            iconCls: 'close-project',
                            scale: 'medium',
                            tooltip: 'Close project',
                            margins: '0 10 0 10'
                        },
                        {
                            xtype: 'button',
                            iconCls: 'help',
                            scale: 'medium',
                            tooltip: 'Documentation for project panel',
                            handler: function() {
                                MetExplore.app.getController('C_HelpRedirection').goTo('annotate.php#projectPanel');
                            }
                        }
                    ]

                }]

            },
            { //ToDolist
                xtype: 'panel',
                title: 'TODO list',
                forId: 'projectTodoListTitle',
                layout: 'fit',
                items: [{
                    xtype: 'gridTodoList',
                    border: true,
                    idProject: -1,
                    store: Ext.create("MetExplore.store.S_TodoList", {
                        storeId: "S_TodoList"
                    }),
                    loadStore: true
                }],
                //flex: 1,
                border: 1,
                minHeight: 235,
                flex: 1
            },
            {
                xtype: 'tabpanel',
                name: 'projectTabs',
                plain: true,
                cls: 'tabUserPanel',
                margins: '20 0 0 0',
                minHeight: 230,
                //maxHeight: 400,
                flex: 1,
                items: [{
                    title: 'BioSources',
                    xtype: 'panel',
                    layout: 'fit',
                    groupEl: true,
                    border: "0 1 1 1",
                    items: [{
                        xtype: 'gridUserProjectBioSource',
                        name: 'gridProjectBioSource',
                        idProject: -1,
                        autoscroll: true,
                        hiddenColumns: ['project', 'status', 'rownumberer'],
                        groupEl: false,
                        flex: 1,
                        bbar: {
                            items: [{
                                xtype: 'selectMyBioSources',
                                name: 'chooseBSForProject',
                                width: 450,
                                hidden: true
                            }, {
                                xtype: 'button',
                                text: 'Add BioSource to the project',
                                iconCls: 'add',
                                action: 'addBioSourceToProject',
                                nbClicks: 0
                            }, {
                                xtype: 'button',
                                text: 'Cancel',
                                iconCls: 'cancel',
                                action: 'cancelAddBSToProject',
                                nbClicks: 0,
                                hidden: true
                            }]
                        }
                    }]
                }, {
                    title: 'Comments',
                    name: 'panelComments',
                    xtype: 'panel',
                    layout: 'fit',
                    border: "0 1 1 1",
                    items: []
                }, {
                    title: 'History',
                    xtype: 'panel',
                    border: "0 1 1 1",
                    layout: 'fit',
                    items: [{
                        xtype: 'gridHistory',
                        idProject: -1,
                        autoscroll: true,
                        store: "S_ProjectHistory",
                        hiddenColumns: ['project'],
                        flex: 1,
                        type: 'project'
                    }]
                }, {
                    title: 'Description',
                    xtype: 'panel',
                    name: 'panelDescription',
                    layout: 'fit',
                    border: "0 1 1 1",
                    items: [{
                        xtype: 'textarea',
                        name: 'descriptionProject',
                        flex: 1
                    }],
                    bbar: {
                        height: 25,
                        name: "descBbar",
                        items: [{
                                xtype: 'button',
                                action: 'refresh',
                                tooltip: 'Refresh the description',
                                iconCls: 'refresh',
                                margins: '0 10 0 0'
                            }, '->',
                            {
                                text: 'Save',
                                iconCls: 'button-save-projet',
                                action: 'save-desc-project',
                                disabled: true
                            }
                        ]
                    }
                }, {
                    title: 'Users',
                    name: 'panelUsers',
                    xtype: 'panel',
                    layout: 'fit',
                    border: false,
                    items: [{
                        xtype: 'gridUsersInProject',
                        action: "udpate",
                        showToolbar: true,
                        type: 'inProjectPanel',
                        editMenu: true,
                        loadStore: true,
                        pluginId: 'bufferGridUsersInProject1',
                        storeId: 'usersInProjectOpened'
                    }]
                }]
            }
        ];
    }

});