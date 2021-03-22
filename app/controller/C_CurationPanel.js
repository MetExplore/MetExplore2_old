/**
 * C_CurationPanel
 */
Ext.define('MetExplore.controller.C_CurationPanel', {
    extend: 'Ext.app.Controller',
    /*
    	requires :['MetExplore.globals.Session',
    	           'MetExplore.view.form.V_SelectElement',
    	           'MetExplore.view.form.V_AddBioSourceForm',
    	           'MetExplore.view.form.V_ReactionAnnotationFromFile',
    	           'MetExplore.view.form.V_MetaboliteAnnotationFromFile'
    	           ],

    	           config: {
    	        	   views: ['main.V_CurationPanel']
    	           },
    */
    init: function() {

        this.control({
            'curationPanel': {
                show: this.checkSession
            },
            'curationPanel button[action=addEl]': {
                click: this.confirmAddElForm
            },
            'curationPanel button[action=createBS]': {
                click: this.confirmCreateBS
            },
            'curationPanel button[action=addAnnotFromFile]': {
                click: this.addAnnotFromFile
            }
        });
    },

    /**
     * 
     */
    checkSession: function(panel) {
        //console.log(Ext.getCmp('annotationPanel').getDockedItems('toolbar[dock="top"]'));

        if (Ext.getCmp('curationPanel')) {


            var toolbar = Ext.getCmp('curationPanel').getDockedItems('toolbar[dock="top"]')[0];

            if (MetExplore.globals.Session.idUser == '' || MetExplore.globals.Session.idUser == '-1') {
                toolbar.setDisabled(true);
                while (panel.down('panel')) {
                    panel.down('panel').close();
                }

                if (Ext.getCmp('tabPanel').getActiveTab().xtype == 'curationPanel') {
                    this.addLoginPanel();
                    // Ext.MessageBox.alert('Warning', "You need to be logged-in to use this feature. If you don't have a MetExplore account, create one <a href=\"http://metexplore.toulouse.inra.fr/joomla3/index.php/metexploreuser/registrationform\" target=\"blank\">here .</a>");
                }

            } else {
                toolbar.setDisabled(false);

                var idUser = MetExplore.globals.Session.idUser;
                var idBioSource = MetExplore.globals.Session.idBioSource;

                MetExplore.globals.BioSource.canUserEdit(idUser, idBioSource);
                // if (MetExplore.globals.Session.publicBioSource==null || MetExplore.globals.Session.idBioSource=='-1'
                //  || MetExplore.globals.Session.publicBioSource==true){
                //  for(var i=1, c=toolbar.items.length; i<c; i++){
                //   toolbar.items.getAt(i).setDisabled(true);
                //  }
                // }else{
                //  for(var i=0, c=toolbar.items.length; i<c; i++){
                //   toolbar.items.getAt(i).setDisabled(false);
                //  }
                // }
            }

        }
    },

    addLoginPanel: function() {
        var me = this;
        var curationPanel = Ext.getCmp('curationPanel');

        var loginForCuration = {
            xtype: 'panel',
            id: 'loginForCuration',
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
            height: '100%',
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
                            html: '<p>You also can test "Curation feature" using following demonstration.</p>' +
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
        };
        curationPanel.add(loginForCuration);
    },

    activateCuration: function() {
        //Highlight tbar
        if (Ext.getCmp('curationPanel')) {
            if (Ext.getCmp('curationPanel').getDockedItems()[0]) {
                if (Ext.getCmp('curationPanel').getDockedItems()[0].el) {
                    Ext.getCmp('curationPanel').getDockedItems()[0].el.dom.childNodes[0].classList.add('target-highlight');
                    setTimeout(function() {
                        Ext.getCmp('curationPanel').getDockedItems()[0].el.dom.childNodes[0].classList.remove('target-highlight');
                    }, 3000);
                }
            }

            if (Ext.getCmp('loginForCuration'))
                Ext.getCmp('loginForCuration').close();
        }
    },

    /**
     * 
     */
    confirmAddElForm: function(button) {
        var annotPanel = button.up('curationPanel');

        if (annotPanel.down('addBioSourceForm')) {
            Ext.MessageBox.confirm('Confirm', 'You are curently creating a BioSource.</br>If you continue, it will not be added to your private BioSource.', this.addElForm, annotPanel);
        } else {
            var f = this.addElForm;
            f.call(annotPanel, 'yes');
        }
    },


    /**
     * 
     */
    addElForm: function(buttonID) {

        if (buttonID == 'no') {

        } else if (buttonID == 'yes') {

            while (this.down('panel')) {
                this.down('panel').close();
            }


            var me = this;
            MetExplore.globals.Session.isSessionExpired(function(isExpired) {
                if (!isExpired) {
                    me.add({
                        xtype: 'panel',
                        id: 'newElement',
                        header: {
                            title: "Add a new Element"
                        },
                        border: false,
                        minWidth: 1000,
                        layout: 'auto',


                        collapsible: true,
                        closable: true,
                        items: {
                            xtype: 'selectElement'
                        },
                        listeners: {
                            collapse: function(p) {
                                var val = p.down("form").getValues();

                                if ('name' in val) {
                                    p.setTitle("Add a new Element : " + val['name']);
                                } else if ('mtbname' in val) {
                                    p.setTitle("Add a new Element : " + val['mtbname']);
                                } else if ('pthwname' in val) {
                                    p.setTitle("Add a new Element : " + val['pthwname']);
                                }
                            }
                        }
                    });
                }
            });


        }
    },


    /**
     * 
     */
    confirmCreateBS: function(button) {
        var annotPanel = button.up('curationPanel');
        if (annotPanel.items.getCount() > 0) {
            Ext.MessageBox.confirm('Confirm', 'You have some unsaved elements. If you continue, they will be lost.', this.createBS, annotPanel);
        } else {
            var f = this.createBS;
            f.call(annotPanel, 'yes');
        }
    },


    /**
     * 
     */
    createBS: function(buttonID) {
        if (buttonID == 'no') {

        } else if (buttonID == 'yes') {
            while (this.down('panel')) {
                this.down('panel').close();
            }

            var me = this;
            MetExplore.globals.Session.isSessionExpired(function(isExpired) {
                if (!isExpired) {
                    me.add({
                        xtype: 'addBioSourceForm'
                    });
                }
            });

        }

    },


    /**
     * 
     */
    addAnnotFromFile: function(button) {

        var combo = button.prev("combobox");
        var entry = combo.getValue();

        var annotpanel = button.up('curationPanel');

        while (annotpanel.down('panel')) {
            annotpanel.down('panel').close();
        }

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                if (entry === 'reaction') {

                    annotpanel.add({
                        xtype: 'reactionAnnotationFromFile',
                        closable: true,
                        border: false
                    });

                } else if (entry === 'metabolite') {

                    annotpanel.add({
                        xtype: 'metaboliteAnnotationFromFile',
                        closable: true,
                        border: false
                    });
                }
            }
        });



    }

});