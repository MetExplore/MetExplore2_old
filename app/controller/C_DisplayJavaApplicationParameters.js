/**
 * C_DisplayJavaApplicationParameters
 */
 Ext.define('MetExplore.controller.C_DisplayJavaApplicationParameters', {
 	extend : 'Ext.app.Controller',

 	init : function() {

 		this.control({
 			'ja_menu_item[action="display_java_application_params"]' : {
 				click : this.displayForm
 			},
 			'ja_menu_item[action="showcustomSBMLUI"]' :{
 				click : this.displayCustomSBMLForm
 			}
 		});
 	},

 	displayForm : function(button) {

 		var application = button.java_application;

 		var parameter_panel = Ext.create(
 			"MetExplore.view.form.V_JavaApplicationParametersForm",
 			{
 				java_application : application,
 				title : application.get("name")
 			});

 		var main_panel = Ext.ComponentQuery.query('mainPanel')[0];

 		main_panel.add(parameter_panel);

 		main_panel.setActiveTab(parameter_panel);

 	},


 	/**
 	* Display custom forms for SBML Import and Export. These applications are separated from the 
 	* automatic UI generation because they are too complex and need proper controllers.
 	* However, the php that will be launched will be the same as the other java applications
 	*/
 	displayCustomSBMLForm: function(button){

 		var application = button.java_application;

 		var upButton=button.up('button');
 		var main_panel = Ext.ComponentQuery.query('mainPanel')[0];

 		var added;	

 		if(upButton.text==="Import"){

			var added = Ext.create("MetExplore.view.form.V_SBMLImportUI",{
 				java_application : application,
 				title : application.get("name")
 			});


 		}else if(upButton.getText()==="Export"){

 			var added = Ext.create("MetExplore.view.form.V_SBMLExportUI",{
 				java_application : application,
 				title : application.get("name")
 			});

 		}else{
 			console.log(upButton.text);
 			console.log("error");
 		}

 		main_panel.add(added);
 		main_panel.setActiveTab(added);
 	}
 });
