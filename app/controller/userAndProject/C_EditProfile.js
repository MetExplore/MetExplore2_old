/**
 * C_EditProfile
 * Edit the user profile - control actions
 */
Ext.define('MetExplore.controller.userAndProject.C_EditProfile', {
    extend: 'Ext.app.Controller',
    /*
    	config : {
    		views: ['grid.V_UserPanel', 'form.EditUserProfile']
    	},
    	
    	requires: ['MetExplore.view.form.V_EditUserProfile'],
    */
    init: function() {
        this.control({
            'UserPanel button[action=editProfile]': {
                click: this.openEditProfileForm
            },
            'EditUserProfile button[action="cancel"]': {
                click: this.closeWindow
            },
            'EditUserProfile button[action="confirm"]': {
                click: this.validForm
            },
            'EditUserProfile checkbox[name="doChangePasswd"]': {
                change: this.doChangePassword
            }
        });
    },

    /**
     * Cancel button clicked
     * @param {} button
     */
    closeWindow: function(button) {
        var win = button.up('window');
        if (win) {
            win.close();
        }
    },

    /***
     * Confirm button clicked
     * @param {} button
     */
    validForm: function(button) {
        var textfields = button.up("EditUserProfile").query('textfield[property="bdd"], textarea[property="bdd"]'); //Get all textfields and all textareas
        var params = {};
        for (var it = 0; it < textfields.length; it++) { //Store values of all textfields and textareas
            params[textfields[it].getName()] = textfields[it].getValue();
        }
        params["changePwd"] = button.up("EditUserProfile").down('checkbox[name="doChangePasswd"]').getValue().toString(); //Do change pathword ?

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                Ext.Ajax.request({
                    url: 'resources/src/php/userAndProject/updateUserProfileData.php',
                    params: params,
                    scope: this,
                    failure: function(response, opts) {
                        Ext.MessageBox
                            .alert('Ajax error',
                                'get user details failed: Ajax error!');
                        var win = this.up('window');
                        if (win) {
                            win.close();
                        }
                    },
                    success: function(response, opts) {
                        var repJson = null;

                        try {
                            repJson = Ext.decode(response.responseText);
                        } catch (exception) {
                            Ext.MessageBox
                                .alert('Ajax error',
                                    'get user details failed: JSON incorrect!');
                            var win = this.up('window');
                            if (win) {
                                win.close();
                            }
                        }

                        if (repJson != null && repJson['success']) {
                            //Close window if any:
                            var win = button.up('window');
                            if (win) {
                                win.close();
                            }
                            //Update name of user in user panel:
                            var labelNameUser = Ext.ComponentQuery.query('UserPanel label[name="userNameLabel"]');
                            if (labelNameUser.length > 0) {
                                labelNameUser[0].setText(params['name']);
                            }
                        } else {
                            Ext.MessageBox
                                .alert(
                                    'get user details failed',
                                    repJson['message']);
                        }

                    }
                });
            }
        });
    },

    /**
     * Change pathword (un)checked : (dis)/(en)able new password textfields
     * @param {} box
     * @param {} newValue
     * @param {} oldValue
     */
    doChangePassword: function(box, newValue, oldValue) {
        if (newValue == true) {
            var form = box.up('EditUserProfile');
            form.down('textfield[name="newPasswd"]').setDisabled(false);
            form.down('textfield[name="newPasswdConfirm"]').setDisabled(false);
        } else {
            var form = box.up('EditUserProfile');
            form.down('textfield[name="newPasswd"]').setDisabled(true);
            form.down('textfield[name="newPasswdConfirm"]').setDisabled(true);
        }
    },

    /**
     * Edit profile button clicked: opens the form V_EditUserProfile, of focus on it if already opened
     * @param {} button
     */
    openEditProfileForm: function(button) {
        var userProfileSearch = Ext.ComponentQuery.query('EditUserProfile');
        if (userProfileSearch.length == 0) {
            var win = Ext.create('Ext.window.Window', {
                title: "EDIT user: " + MetExplore.globals.Session.nameUser,
                height: 320,
                iconCls: 'user-edit-profile',
                layout: 'fit',
                width: 400,
                items: [{
                    xtype: "EditUserProfile"
                }]
            });
            win.show();
            win.focus();
        } else {
            var userProfile = userProfileSearch[0];
            var win = userProfile.up('window');
            win.show();
            win.focus();
        }
    }

});