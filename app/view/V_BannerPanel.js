/**
 *
 */
Ext.define('MetExplore.view.V_BannerPanel', {
    extend: 'Ext.Panel',
    alias: 'widget.bannerPanel',
    region: 'north',
    height: 50,
    margins:'2 2 0 2',
    //split:true,
    id: 'bannerPanel',
    requires: [
        'MetExplore.view.form.V_LoginForm',
        'MetExplore.view.menu.V_OmicsMenu',
        'MetExplore.view.menu.V_AboutMenu',
        'MetExplore.view.menu.V_ToolMenu',
        'MetExplore.view.menu.V_TestMenu',
        'MetExplore.view.menu.V_ExportMenu',
        'MetExplore.view.menu.V_ImportMenu',
        'Ext.toolbar.Toolbar'
    ],

    layout: {
        type: 'hbox',
        padding: '0'
    },

    bodyStyle: 'background: rgba(16, 37, 63);',
    items: [{
            id: 'logotitre',
            xtype: 'label',
            text: 'MetExplore',
            bodyStyle: 'background:rgba(255, 255, 255, 0);border:0;'
        }, {
            id: 'versionAppli',
            html: '<span id="versionAppli">version</span>',
            bodyStyle: 'color: #ffffff; background:rgba(255, 255, 255, 0);border:0;'
        },
        {
            xtype:"panel",
            height:"100%",
            width: "100%",
            style: 'padding-right:100px',
            // contentEl: 'content',
            autoScroll: true,
            tbar:Ext.create('Ext.toolbar.Toolbar', {
                    layout: {
                        overflowHandler: 'Menu'
                    },
                id: 'menu',
                itemId: 'toolbar',
                layout: {
                    overflowHandler: 'Menu'
                },
                height:"100%",
                items: [{
                    text: 'About',
                    xtype: 'button',
                    href: "http://www.metexplore.fr",
                    id: 'menu_1',
                    hidden: false,
                    scale: 'large',
                    style: 'webkit-border-radius: 0px; ' +
                        '    -moz-border-radius: 0px;' +
                        '    -ms-border-radius: 0px;' +
                        '    -o-border-radius: 0px;' +
                        '    border-radius: 0px; '
                }, {
                    text: 'Omics',
                    menu: {
                        xtype: 'omicsMenu'
                    },
                    id: 'menu_2',
                    scale: 'large',
                    iconCls: 'importDatawhite',
                    style: 'webkit-border-radius: 0px; ' +
                        '    -moz-border-radius: 0px;' +
                        '    -ms-border-radius: 0px;' +
                        '    -o-border-radius: 0px;' +
                        '    border-radius: 0px; ',
                    hidden: false

                }, {
                    text: 'Toolbox',
                    menu: {
                        xtype: 'toolMenu'
                    },
                    id: 'toolMenu',
                    hidden: false,
                    scale: 'large',
                    iconCls: 'toolboxwhite',
                    style: 'webkit-border-radius: 0px; ' +
                        '    -moz-border-radius: 0px;' +
                        '    -ms-border-radius: 0px;' +
                        '    -o-border-radius: 0px;' +
                        '    border-radius: 0px; '

                }, {
                    text: 'Import',
                    menu: {
                        xtype: 'importMenu',
                        id: 'importmenuid'
                    },
                    id: 'menu_6',
                    iconCls: 'importwhite',
                    scale: 'large',
                    style: 'webkit-border-radius: 0px; ' +
                        '    -moz-border-radius: 0px;' +
                        '    -ms-border-radius: 0px;' +
                        '    -o-border-radius: 0px;' +
                        '    border-radius: 0px; ',
                    hidden: false
                }, {
                    text: 'Export',
                    menu: {
                        xtype: 'exportMenu',
                        id: 'exportmenuid'
                    },
                    id: 'menu_7',
                    iconCls: 'exportwhite',
                    style: 'webkit-border-radius: 0px; ' +
                        '    -moz-border-radius: 0px;' +
                        '    -ms-border-radius: 0px;' +
                        '    -o-border-radius: 0px;' +
                        '    border-radius: 0px; ' ,
                    scale: 'large',
                    hidden: false
                }, {
                    text: 'Login',
                    xtype: 'button',
                    id: 'login_button',
                    bodyStyle: 'float:right',
                    iconCls: 'signinwhite',
                    scale: 'large',
                    style: 'webkit-border-radius: 0px; ' +
                        '    -moz-border-radius: 0px;' +
                        '    -ms-border-radius: 0px;' +
                        '    -o-border-radius: 0px;' +
                        '    border-radius: 0px; ',
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
                }, {
                    text: 'Logout',
                    xtype: 'button',
                    id: 'logout_user_button',
                    iconCls: 'signoutwhite',
                    hidden: true,
                    scale: 'large',
                    style: 'webkit-border-radius: 0px; ' +
                        '    -moz-border-radius: 0px;' +
                        '    -ms-border-radius: 0px;' +
                        '    -o-border-radius: 0px;' +
                        '    border-radius: 0px; ',
                    action: 'logout'
                }]
            })
        }, {
            id: 'nameUser',
            html: '<span id="name"></span>',
            bodyStyle: 'color: #ffffff; background:rgba(255, 255, 255, 0);border:0;',
            margins: '5 0 0 0',
            width: 200,
            border: 0,
            flex: 1
        },{
            html: '<div id="logoheader"></div>',
            bodyStyle: 'background:rgba(255, 255, 255, 0);border:0;'
        }
        /*,{
                           id:'logoheaderMedDayid',
                           html:'<div id="logoheaderMedDay"></div>',
                           bodyStyle:'background:rgba(255, 255, 255, 0);border:0;'
                       },{
                           id:'logoheaderSpecMetid',
                           html:'<div id="logoheaderSpecMet"></div>',
                           bodyStyle:'background:rgba(255, 255, 255, 0);border:0;'
                       }*/
    ]
});