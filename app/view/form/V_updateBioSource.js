/**
 * updateBioSource
 */
Ext.define('MetExplore.view.form.V_updateBioSource', {	
	extend: 'Ext.form.Panel',

	alias: 'widget.updateBioSource',

	requires:['MetExplore.globals.Session','MetExplore.view.grid.V_gridBioSourceInfo','MetExplore.view.grid.V_gridBiblioLinks'],


	border:false,
	url:'', 
	layout:'fit',
	monitorValid:true,
	bodyPadding: 5,
	items:[],


	constructor : function(params) {

		var head=params.header;
		var idBS=params.id;
		formConfig = this.config;

		formConfig.header=head;
		formConfig.idBS = idBS;

		formConfig.tbar = {
				items: [{
					xtype:'button',
					text: 'Save',
					action:'save',
					tooltip:'Save the modifications done on this BioSource',
					iconCls:'save'
				},{
					xtype:'button',
					text: 'Reset',
					action:'reset',
					tooltip:'Reset all changes',
					iconCls:'reset'
				},{
					xtype:'button',
					text: 'Add Publication',
					action:'addref',
					tooltip:'Add a PMID to this BioSource',
					iconCls:'add'
				},{
					xtype:'button',
					text: 'Share',
					action:'manage',
					tooltip: ["owner","p"].indexOf(params.access) > -1 && params.idProject == -1 ? 'Share this BioSource or manage users' : (["owner","p"].indexOf(params.access) == -1 ? "Only an owner of this BioSource can share it" : "You cannot share this BioSource alone because it is part of a project"),
							iconCls:'team',
							disabled: ["owner","p"].indexOf(params.access) == -1 || params.idProject > -1
				},{
					xtype:'button',
					text: 'Delete',
					action:'delete',
					tooltip: params.idProject == -1 ? 'Delete this biosource' : "You cannot delete this BioSource because it is part of a project",
							iconCls:'del',
							disabled: params.idProject > -1
				},{
					xtype:'button',
					text: 'Duplicate',
					action: 'duplicate',
					tooltip: 'Duplicate this BioSource',
					iconCls:'copyNetwork'
				}]
		};

		var jStore=Ext.getStore('S_BioSource');
		var rec=jStore.findRecord( 'id', idBS);

		if (!rec){
			jStore=Ext.getStore('S_MyBioSource');
			rec=jStore.findRecord( 'id', idBS);
		}

		if (rec) {
			var items={
					border:false,					
					items:[{
						xtype:'gridBioSourceInfo',
						id: idBS
					},{
						xtype:'fieldset',
						defaults:{
							labelWidth : 105,
							width: 400,
							enforceMaxLength :true
						},
						title:'BioSource Data',
						items:[{
							xtype:'hiddenfield',
							name:'idBiosource',
							value:idBS
						},{
							xtype:"displayfield",
							fieldLabel:'MetExplore Id',
							value:idBS
						},{
							xtype:'textfield',
							fieldLabel: 'Name (100 chars)',
							name: 'BSName',
							value: rec.get('nameBioSource'),
							maxLength : 100,
							allowBlank:false
						},{
							xtype:"displayfield",
							fieldLabel:'Organism',
							value:rec.get('orgName')
						},{
							xtype:'textfield',
							fieldLabel: 'Tissue (45 chars)',
							name: 'BSTissue',
							maxLength : 45,
							value: rec.get('tissue')
						},{
							xtype:'textfield',
							fieldLabel: 'Cell Type (100 chars)',
							name: 'BSCellType',
							maxLength : 100,
							value: rec.get('cellType')
						},{
							xtype:'textfield',
							fieldLabel: 'Strain (45 chars)',
							name: 'BSStrain',
							maxLength : 45,
							value: rec.get('strain')
						},{
							xtype:'hiddenfield',
							name:'idDBRef',
							value:rec.get('dbId')
						},{
							xtype:'textfield',
							fieldLabel: 'Source Database (200 chars)',
							name: 'DBRefSource',
							maxLength : 200,
							value: rec.get('dbSource')
						},{
							xtype:'textfield',
							fieldLabel: 'URL (200 chars)',
							name: 'DBRefURL',
							maxLength : 200,
							value: rec.get('dbUrl')
						},{
							xtype:'textfield',
							fieldLabel: 'Id in Database (100 chars)',
							name: 'IdinDBref',
							maxLength : 100,
							value: rec.get('IdinDBref')
						},{
							xtype:'textfield',
							fieldLabel: 'Version (45 chars)',
							name: 'DBRefVersion',
							maxLength : 45,
							value: rec.get('dbVersion')
						},{
							xtype:"displayfield",
							fieldLabel:'Database type',
							value:rec.get('dbType')
						}]

					},{
						xtype:'gridBiblioLinks',
						id: idBS,
						status:false
					}]
			};

			formConfig.rec = rec;

			formConfig.items = items;
		}

		this.callParent([formConfig]);
	},

	updateForm: function() {
		var storeBS = Ext.getStore('S_gridBioSource');
		var rec = storeBS.getById(this.idBS);

		var ctrlBS = MetExplore.app.getController('C_gridBioSource');
		ctrlBS.setBiosourceInfo(this.idBS, rec.get('nameBioSource'), rec.get('public'), rec.get('access'), rec.get('idProject'));
	}



});