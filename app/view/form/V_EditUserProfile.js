/**
 * panel profile user
 * Show informations of one comment, with right in edit if user can do it
 */
Ext.define('MetExplore.view.form.V_EditUserProfile', {

	extend : 'Ext.form.Panel',
	alias : 'widget.EditUserProfile',
	
	layout: {
    	type: 'vbox',
    	align: 'stretch',
    	animate: true
    },
	
	bodyStyle: 'background:transparent;',
	border: false,
	
	constrainHeader : true,
	items : [],
	buttonAlign: 'right',
	buttons : [{
        text: "Ok",
        action: 'confirm',
        formBind: true
	},{
		text: "Cancel",
		action: 'cancel'
	}],
	
	/**
	 * Items
	 * @type Object
	 */
	items : [{
			xtype: 'tabpanel',
			flex: 1,
			border: false,
			items: [{
				title: 'User details',
				xtype: 'panel',
				layout: {
			    	type: 'vbox',
			    	align: 'stretch',
			    	animate: true,
			    	padding: 10
			    },
				border: false,
				items: [{
					xtype: 'textfield',
					name: 'name',
					property: 'bdd', //property to bdd to directly get this field
					fieldLabel: 'Name',
					allowBlank:false
				},{
					xtype: 'textfield',
					name: 'username',
					property: 'bdd',
					fieldLabel: 'Username',
					readOnly: true
				},{
					xtype: 'textfield',
					name: 'email',
					property: 'bdd',
					fieldLabel: 'Email address',
					allowBlank:false
				},{
					xtype: 'checkbox',
					name: 'doChangePasswd',
					boxLabel: 'Change password:'
				},{
					xtype: 'textfield',
					name: 'newPasswd',
					inputType:'password',
					property: 'bdd',
					fieldLabel: 'New password',
					disabled: true,
					allowBlank:false
				},{
					xtype: 'textfield',
					name: 'newPasswdConfirm',
					inputType:'password',
					fieldLabel: 'Confirm password',
					disabled: true,
					allowBlank:false,
					validator: function(value){
				        if(Ext.ComponentQuery.query('EditUserProfile textfield[name="newPasswd"]')[0].getValue() != value) { //Suppose only one form can exists at the same time
				            return 'Error! The two passwords are not identicals';
				        } else {
				            return true;
				        }
				    }
				}]
			},{
				title: 'User profile',
				xtype: 'panel',
				layout: {
			    	type: 'vbox',
			    	align: 'stretch',
			    	animate: true,
			    	padding: 10
			    },
				border: false,
				items: [{
					xtype: 'textfield',
					name: 'address1',
					property: 'bdd',
					fieldLabel: 'Address 1'
				},{
					xtype: 'textfield',
					name: 'city',
					property: 'bdd',
					fieldLabel: 'City'
				},{
					xtype: 'textfield',
					name: 'country',
					property: 'bdd',
					fieldLabel: 'Country'
				},{
					xtype: 'textfield',
					name: 'postalCode',
					property: 'bdd',
					fieldLabel: 'Postal / ZIP code'
				},{
					xtype: 'textfield',
					name: 'website',
					property: 'bdd',
					fieldLabel: 'Web Site'
				},{
					xtype: 'textarea',
					name: 'aboutme',
					property: 'bdd',
					fieldLabel: 'About Me',
					flex: 1
				}]
			}]
		},{
			xtype: 'textfield',
			name: 'currentPassword',
			property: 'bdd',
			inputType:'password',
			fieldLabel: 'Current password (for validation)',
			allowBlank:false
		}],
	
	/**
	 * initComponent: launched after component is initialized
	 */
	initComponent: function() {
		this.callParent(arguments);
		//Get data and fill form with that
		Ext.Ajax.request({
			url : 'resources/src/php/userAndProject/getUserProfileData.php',
			failure : function(response, opts) {
				Ext.MessageBox
						.alert('Ajax error',
								'get user details failed: Ajax error!');
				var win = this.up('window');
				if (win) {
					win.close();
				}
			},
			success : function(response, opts) {
				var repJson = null;
				
				try
				{
					repJson=Ext.decode(response.responseText);
				}
				catch (exception) {
					Ext.MessageBox
						.alert('Ajax error',
								'get user details failed: JSON incorrect!');
					var win = this.up('window');
					if (win) {
						win.close();
					}
				}
	
				if (repJson != null && repJson['success'])
				{
					var data = repJson['results']; //Get date
					//Set data in form:
					for (var key in data) { //Fill the form with that
						this.down('[name="' + key + '"]').setValue(data[key]);
					}
				}
				else {
					Ext.MessageBox
						.alert(
								'get user details failed', 'Error in getting user profile data. Please contact metexplore@toulouse.inra.fr' +
								repJson['message']);
				}
	
			},
			scope : this
		});
		
	}
	
});