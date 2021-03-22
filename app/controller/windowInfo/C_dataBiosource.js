Ext.define('MetExplore.controller.windowInfo.C_dataBiosource', {
	extend : 'Ext.app.Controller',

	requires:['MetExplore.globals.Session'],

	views:['panel.V_dataBioSource'],

	init : function() {
		this.control({
			'dataBioSource' : {
				beforerender:this.activateDuplicate
			},
			'dataBioSource button[action=copyToPrivate]' :{
				click:this.duplicateBS
			}
		});
	},



	activateDuplicate: function(){

		MetExplore.globals.Session.checkSessionUserId(function(bool){
			
			var button=Ext.ComponentQuery.query("dataBioSource button[action=copyToPrivate]")[0];
			if (button) {
				button.setDisabled(!bool);
			}
		});


	},


	duplicateBS: function(button) {
		MetExplore.globals.BioSource.duplicateBS(button, button.up('dataBioSource').rec);
	}



});