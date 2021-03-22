Ext.define('MetExplore.view.main.V_UserPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.UserPanel',
    xtype: 'userPanel',
    requires: ['MetExplore.view.grid.V_GridTodoList', 'MetExplore.view.grid.V_gridUserProjects',
        'MetExplore.view.grid.V_GridHistory', 'MetExplore.view.grid.V_GridUserProjectBioSource'
    ],
    bodyStyle: {
        "background-color": "#e0e5ea"
    },
    layout: {
        type: 'vbox',
        align: 'stretch',
        animate: true,
        padding: 10
    },
    autoScroll: true,
    items: [],

    defaults: {
        border: false
    },

    /**
     * Set login panel, when the user is not connected
     * @return {} items of the login panel
     */
    setLoginPanel: function() {
        return [{
            xtype: 'panel',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center',
                animate: true,
                padding: 10
            },
            bodyStyle: {
                "background-color": "#e0e5ea"
            },
            width: '100%',
            items: [{
                    width: '100%',
                    xtype: 'panel',
                    defaults: {
                        border: false
                    },
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center',
                        animate: true,
                        padding: 10
                    },
                    style: {
                        marginBottom: '20px'
                    },
                    items: [{
                            xtype: 'panel',
                            html: 'You need to be logged-in to use this feature. If you don\'t have a MetExplore account, create one .       ',
                            style: {
                                width: '95%',
                                marginBottom: '10px',
                                marginTop: '10px',
                                'text-align': 'center'
                            }
                        },
                        {
                            xtype: 'panel',
                            defaults: {
                                border: false
                            },
                            style: {
                                width: '95%',
                                marginBottom: '10px',
                                'text-align': 'center'
                            },
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: "center",
                                animate: true
                            },
                            items: [{
                                text: 'Login',
                                xtype: 'button',
                                iconCls: 'signinwhite',
                                scale: 'medium',
                                border: 1,
                                style: {
                                    borderColor: 'grey',
                                    borderStyle: 'solid'
                                },
                                handler: function() {
                                    var win_Login = Ext.getCmp('winLogin');

                                    if (!win_Login) {
                                        win_Login = Ext.create('Ext.Window', {
                                            id: 'winLogin',
                                            title: 'Login',
                                            layout: 'fit',
                                            iconCls: 'signinwhite',
                                            width: 350,
                                            height: 160,
                                            items: [{
                                                xtype: 'loginForm'
                                            }],
                                            border: false
                                        });
                                    }
                                    win_Login.show(null, function() {
                                        this.down("loginForm").down('textfield').focus();
                                    }, win_Login);

                                }
                            }]
                        }
                    ]
                },
                {
                    width: '100%',
                    xtype: 'panel',
                    defaults: {
                        border: false
                    },
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center',
                        animate: true,
                        padding: 10
                    },
                    items: [{
                            xtype: 'panel',
                            html: '<p>You also can test "Project feature" using following demonstration.</p>' +
                                'This demonstration will be reset daily. If you need persistent analysis, you need to use your account .</p>',
                            style: {
                                width: '95%',
                                marginBottom: '10px',
                                marginTop: '10px',
                                'text-align': 'center'
                            }
                        },
                        {
                            xtype: 'panel',
                            defaults: {
                                border: false
                            },
                            style: {
                                width: '95%',
                                marginBottom: '10px',
                                'text-align': 'center'
                            },
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: "center",
                                animate: true
                            },
                            items: [{
                                text: 'Demo',
                                xtype: 'button',
                                scale: 'medium',
                                border: 1,
                                style: {
                                    borderColor: 'grey',
                                    borderStyle: 'solid'
                                },
                                handler: function() {
                                    //Connection to demo user
                                    //Display project of this user
                                    Ext.Ajax.request({
                                        method: 'POST',
                                        params: {
                                            loginUsername: 'usertest1',
                                            loginPassword: 'usertest'
                                        },
                                        url: 'resources/src/php/database/login.php',

                                        success: function(response) {
                                            var result = Ext.decode(response.responseText);
                                            idUser = result.idUser;

                                            //var nom = Ext.getCmp('loginUsername').getRawValue();

                                            //Ext.state.Manager.set("metexploreidUser",idUser);

                                            //Ext.getCmp('winLogin').setVisible(false);
                                            if (Ext.getCmp('winLogin'))
                                                Ext.getCmp('winLogin').destroy();
                                            //Ext.getCmp('nameUser').update('<span id="name">Welcome ' + nom + '</span>');
                                            var logout = Ext.getCmp('logout_user_button');
                                            //console.log('logoooooooooout', logout);
                                            logout.setVisible(true);
                                            Ext.getCmp('login_button').setVisible(false);
                                            var ctrl = MetExplore.app.getController('C_User');
                                            ctrl.initLogin(idUser);
                                        },

                                        failure: function(form, action) {
                                            if (action.failureType == 'server') {
                                                Ext.Msg.alert('Login Failed!');
                                            } else {
                                                Ext.Msg
                                                    .alert('Warning!',
                                                        'Authentication server is unreachable : ');
                                            }
                                            form.reset();
                                        }
                                    })
                                }
                            }]
                        }
                    ]
                }
            ]
        }]
    },

    /*
     * Set user panel, when user is connected
     * @return {} items of the user panel
     */
    setItemsUserConnected: function() {
        //Load store BioSource:
        var theStore = Ext.create("MetExplore.store.S_MyBioSource", {
            storeId: "S_UserBioSource",
            autoLoad: false,
            groupField: 'groupNameProject'
        });
        //theStore.removeAll(); //Don't do this, it's not necessary and provoc bugs on main biosource grid
        var storeMyBioSource = Ext.getStore('S_MyBioSource');
        theStore.add(storeMyBioSource.getRange());
        return [{ //Header
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
                    border: false,
                    flex: 1,
                    bodyStyle: {
                        "background-color": "#e0e5ea"
                    },
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'end',
                        animate: true,
                        padding: 0
                    },
                    items: [{ //Name of active user
                            xtype: 'label',
                            name: 'userNameLabel',
                            cls: 'user-name',
                            margins: '0 20 0 0'
                        },
                        {
                            xtype: 'button',
                            action: 'editProfile',
                            iconCls: 'user-edit-profile',
                            scale: 'medium',
                            tooltip: 'Edit your profil'
                        },
                        {
                            xtype: 'button',
                            action: 'logout',
                            scale: 'medium',
                            iconCls: 'user-logout',
                            tooltip: 'Log out',
                            margins: '0 10 0 10'
                        },
                        {
                            xtype: 'button',
                            iconCls: 'help',
                            scale: 'medium',
                            tooltip: 'Documentation for user panel',
                            handler: function() {
                                MetExplore.app.getController('C_HelpRedirection').goTo('annotate.php#userPanel');
                            }
                        }
                    ]
                }]

            },
            { //ToDolist
                xtype: 'panel',
                title: 'TODO list',
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
                plain: true,
                cls: 'tabUserPanel',
                margins: '20 0 0 0',
                minHeight: 230,
                //maxHeight: 400,
                flex: 1,
                items: [{
                    title: 'My projects',
                    xtype: 'gridUserProjects',
                    autoscroll: true,
                    flex: 1
                }, {
                    xtype: 'panel',
                    layout: 'fit',
                    title: 'My BioSources',
                    border: "0 1 1 1",
                    items: [{
                        xtype: 'gridUserProjectBioSource',
                        name: 'gridUserBioSource',
                        border: false,
                        idProject: -1,
                        autoscroll: true,
                        flex: 1,
                        groupEl: true,
                        hiddenColumns: ['project', 'status', 'rownumberer'],
                        store: theStore
                    }],
                    flex: 1
                }, {
                    xtype: 'panel',
                    layout: 'fit',
                    title: 'History',
                    border: "0 1 1 1",
                    items: [{
                        xtype: 'gridHistory',
                        border: false,
                        idProject: -1,
                        autoscroll: true,
                        store: "S_UserHistory",
                        loadStore: false,
                        flex: 1,
                        type: 'user'
                    }],
                    flex: 1
                }]
            }
        ];
    },

    /**
     * Fill the name user label
     */
    setNameUser: function() {
        var nameLabel = Ext.ComponentQuery.query('label[name=userNameLabel]')[0];
        nameLabel.setText(MetExplore.globals.Session.nameUser);
    },

    /**
     * Clear the name user label
     */
    clearNameUser: function() {
        var nameLabel = Ext.ComponentQuery.query('label[name=userNameLabel]')[0];
        nameLabel.setText("");
    }


});