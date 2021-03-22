/**
 * formAnnotation
 * 
 */

Ext.define('MetExplore.view.form.V_Annotation_TabFile', {
	extend : 'Ext.form.Panel',
	alias : 'widget.formAnnotation',
	requires: [	'MetExplore.view.grid.V_gridAnnotation'],
	// frame :true,
	fileUpload: true,
	items : [{
					//colspan:1,
					align: 'up',
					xtype : 'fileuploadfield',
					fieldLabel : 'Upload a tabulated file',
					allowBlank : false,
					width:350,
					labelWidth: 150,
					name : 'fileData',
	   				buttonText: '',
	   				buttonConfig: { iconCls: 'upload-icon'},
	   				formBind : false,
	   				listeners :{
	   					'change': function ( file, value, eOpts ) {
	   						var form = this.up('form').getForm();
	   						var grid= this.up('panel').down('gridAnnotation');
	   						form.submit({
	                        	url: 'resources/src/php/fileCSV-upload.php',
	                        	waitMsg: 'Uploading your csv File...',
	                        	success: function(fp, o) { 
	                        		var ctrl= MetExplore.app.getController('C_gridAnnotation');
			  						var nbCol = o.result.rows[0];			

								var storeData= grid.getStore();
	    						storeData.removeAll();
	    						storeData.proxy.extraParams.fileName=o.result.rows[1];
	
				        		storeData.load({
				        		callback : function(records){
				        			
				        			}
	   							})
	   							}
	   						})
	 					}
   					}
 				},{
	                xtype         : 'gridAnnotation',
	                height		  : 300
	       			//width         : 800,
	       			//frame :true,
				}
			],	
				

	buttonAlign : 'left',
	buttons : [
			{
				text : 'Match',
				action : 'match'
				// Activated only if the form is valid
				//formBind : true
			}]
/*	render : function() {
		var storeCol= Ext.create('MetExplore.store.S_ColumnConfig');
		this.bindStore(storeCol);
		console.log('viewready---V_Map',this.getStore());
	}*/
});
