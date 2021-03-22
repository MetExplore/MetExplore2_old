/**
 * loginForm
 * @description Login form. The submit is controlled by C_User which checks the click on the login button
 */


Ext.define('MetExplore.view.form.V_LoginForm', {
	extend: 'Ext.form.Panel', 
	alias: 'widget.loginForm',
	layout: {
    	type: 'vbox',
    	align: 'stretch',
    	animate: true,
    	padding: 10
    },
	url:'resources/src/php/database/login.php',
	border:false,

	constructor: function(params)
	{
		if (Ext.getCmp('winLogin')){

		}
		var config = this.config;
		if (params.width && params.height)
		{
			config.width = params.width;
			config.height = params.height;
		}


		config.defaultType = 'textfield';
		config.monitorValid = true;

		config.buttonAlign = 'right';
		config.buttons = [{
			text:'Registration',
			href: 'https://metexplore.toulouse.inra.fr/joomla/index.php/metexplore-user/user-registration',
			hrefTarget: '_blank'
		},{
			text:'Login',
			action: 'loginForm',
			formBind: true
		}];

		config.items = [{
			xtype: 'label',
			text: 'Login:',
			cls: 'title-login',
			hidden: !params.showTitle
		},{
			fieldLabel:'Username ',
			name:'loginUsername',
			allowBlank:false
		},{
			fieldLabel:'Password ',
			name:'loginPassword',
			inputType:'password',
			allowBlank:false
		}];

	    this.callParent([config]);
	},
	
	defaults: {
		enableKeyEvents:true,
		listeners: {
			keypress : function(textfield,eo){
				if (eo.getCharCode() == Ext.EventObject.ENTER) {
					var ctrl=MetExplore.app.getController('C_User');
					ctrl.submitLoginForm(this.up('loginForm').down('button[action="loginForm"]'));
				}
			}
		}
	}
});
