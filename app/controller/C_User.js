/**
 * C_User
 * Checks the login button og the LoginForm. When it is clicked, submit the
 * form, inits the currentUser store, enables the selectionMyBioSources combo
 * box
 * 
 */

Ext.define('MetExplore.controller.C_User', {
	extend : 'Ext.app.Controller',

	/**
	 * 
	 * @type config
	 */
	config : {
		views : ['form.V_LoginForm', 'main.V_UserPanel', 'form.V_SelectMyBioSources','button.V_JavaApplicationMenuItem','V_BannerPanel', 'V_UserPanel'],
		stores : ['S_CurrentUser', 'S_MyBioSource', 'S_CurrentBioSource']
	},
	requires :['MetExplore.globals.Session','MetExplore.globals.Project','MetExplore.globals.Feature'],

	/**
	 * init function
	 */
	init : function() {

		this.control({
			'loginForm button[action=loginForm]' : {
				click : this.submitLoginForm
			},
			'bannerPanel button[action=logout]' :{
				click:this.logout
			},
			'UserPanel button[action=logout]' :{
				click:this.logout
			}
		});
	},


	initLogin : function(idUser) {


		//console.log("initLogin");

		/**
		 * 
		 * 
		 * Sets the currentUserStore
		 */
		MetExplore.globals.Session.idUser = idUser;
        MetExplore.globals.Feature.loadFeatureMetexplore();
		var myBioSources = Ext.getStore("S_MyBioSource");
		myBioSources.proxy.extraParams.idUser = idUser;
		myBioSources.load({
			callback: function(){
				var cmp= Ext.getCmp('comboMyBioSources');
				if (cmp) cmp.setVisible(true);
		
				/**
				 * inits menu les menus sont tous avec id (=menu_n... n est
				 * numerique) dans base de donnees table UserMenu avec id et
				 * visible apres le chargement du store S_UserMenu recuperation
				 * la valeur n (champs idMenu) pour composer l'id du menu
				 * recuperation la valeur contenue dans champs visible du store
				 */
				// var myMenu = Ext.getStore("S_UserMenu");
				// myMenu.proxy.extraParams.idUser = idUser;
				// myMenu.load({
				// 	callback :
				// 		function(records, operation, success) {
				// 		count = myMenu.getCount();
				// 		for (var i = 0; i < count; i++) {
                //
				// 			var id = myMenu.getAt(i).get('idMenu');
				// 			var visible = myMenu.getAt(i).get('visible');
				// 			var nomMenu = "menu_" + id;
				// 			var cmp= Ext.getCmp(nomMenu);
				// 			if (cmp) cmp.setVisible(visible);
                //
				// 		}
                //
				// 		var visible = false;
                //
				// 	}
				// });



				var ctrlSession= MetExplore.app.getController('C_Session');

				ctrlSession.completeSession('-1',MetExplore.globals.Session.idUser, false, true);
		
				// Enables all the external java application buttons
				Ext.each(Ext.ComponentQuery.query('ja_menu_item'), 
						function(menu_item) {
		
					var disabled = false;
		
					var application = menu_item.java_application;
		
					if(! application){
						disabled = true;
					}else if (application.get("require_bioSource")) {
						// Get current idBioSource
		
						if (MetExplore.globals.Session.idBioSource == -1) {
							disabled = true;
						}
					}
		
					menu_item.setDisabled(disabled);
				});
			}
		});

		Ext.getStore("S_Analyses").reload();
		
		var cmp=Ext.ComponentQuery.query('dataBioSource')[0];
		
		if (cmp){
			cmp.fireEvent('beforerender');
		}
	},

	/**
	 * Submit the login form, inits the current User, and displays the
	 * private BioSources combo box
	 */
	submitLoginForm : function(button) {
		//console.log("Submit login form");
		var form = button.up('form');
		if (form.isValid())
		{
			form.submit({
				method : 'POST',
				success : function(form, action) {

					idUser = action.result.idUser;

					//var nom = Ext.getCmp('loginUsername').getRawValue();

					//Ext.state.Manager.set("metexploreidUser",idUser);

					//Ext.getCmp('winLogin').setVisible(false);
					if (Ext.getCmp('winLogin'))
						Ext.getCmp('winLogin').destroy();
					//Ext.getCmp('nameUser').update('<span id="name">Welcome ' + nom + '</span>');
					var logout= Ext.getCmp('logout_user_button');
					//console.log('logoooooooooout', logout);
					logout.setVisible(true);
					Ext.getCmp('login_button').setVisible(false);
					var ctrl= MetExplore.app.getController('C_User');
					ctrl.initLogin(idUser);							
				},

				failure : function(form, action) {
					if (action.failureType == 'server') {
						Ext.Msg.alert('Login Failed!');
					} else {
						Ext.Msg
						.alert('Warning!',
						'Authentication server is unreachable : ');
					}
					form.reset();
				}
			});
		}

	},


	logout : function() {
	   Ext.Msg.confirm("Logout", "Are you sure you want to log out?", function(btn){
            if (btn == 'yes'){


            
		        //console.log("logout");
		        Ext.state.Manager.clear("metexploreidUser");
		        Ext.state.Manager.clear("metexploreidBioSource");

		        MetExplore.globals.Session.idUser=-1;
		        if (MetExplore.globals.Session.idProject != -1) {
			        MetExplore.globals.Project.closeOpenedProject();
		        }

		        if (typeof metExploreViz !== 'undefined') {
                    metExploreViz.resetMetExploreViz();
                }
        
		        Ext.Ajax.request({
			        url : 'resources/src/php/database/logout.php',
			        failure : function(response, opts) {
				        Ext.MessageBox
				        .alert('Ajax error',
				        'logout failed: Ajax error!');
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
					        'logout failed: JSON incorrect!');
				        }

				        if (repJson != null)
				        {
					        var login= Ext.getCmp('login_button');
					        if (login) login.setVisible(true);
					        var logout= Ext.getCmp('logout_user_button');
					        if (logout) logout.setVisible(false);

					        var cmp= Ext.getCmp('nameUser');
					        if (cmp) cmp.update('<span id="name"></span>');

					        Ext.getStore('S_MyBioSource').removeAll();
					        Ext.getCmp('comboMyBioSources').getStore().removeAll();

					        var ctrl= MetExplore.app.getController('C_BioSource');
					        //ctrl.changeCurrentBioSource();

					        ctrl.unselectBioSource();

					        Ext.getStore("S_Analyses").reload();

					        if (Ext.ComponentQuery.query('userPanel')[0])
					        {
						        MetExplore.globals.Session.logged = false;
						        Ext.getStore('S_TodoList').removeAll();
						        Ext.getStore('S_UserProjects').removeAll();
						        var userPanel = Ext.ComponentQuery.query('userPanel')[0];
						        userPanel.removeAll();
						        userPanel.add(userPanel.setLoginPanel());
						        userPanel.setTitle("User Profile");
					        }

                            MetExplore.globals.Feature.loadFeatureMetexplore();
				        }
			        }
		        });
		    }
		});
	}


});