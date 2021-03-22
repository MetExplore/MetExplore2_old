Ext.define('MetExplore.view.panel.V_dataBioSource', {

	extend : 'Ext.panel.Panel',
	alias : 'widget.dataBioSource',

	requires:['MetExplore.globals.Session',
		'MetExplore.view.grid.V_gridBioSourceInfo',
		'MetExplore.view.grid.V_gridBiblioLinks'],

	layout: 'fit',
	border: 'false',

	
	border:false,
	bodyPadding: 5,

	items: [],


	constructor : function(params) {
		//console.log(params);
		var head=params.header;
		var idBS=params.id;
		panelConfig = this.config;

		panelConfig.header=head;
		panelConfig.idBS = idBS;

		var jStore=Ext.getStore('S_BioSource');
        var rec = jStore.getById(idBS);

		if (!rec){
			jStore=Ext.getStore('S_MyBioSource');
            rec = jStore.getById(idBS);
		}
		//console.log(rec);
		if (rec) {
			var url;
			
			if (rec.get('dbType')=='biocyc'){
				url=rec.get('dbUrl')+'/'+rec.get('IdinDBref')
			}else{
				url=rec.get('dbUrl')
			}

			panelConfig.rec=rec;
			var items={
					border:false,
					
					items:[{
						xtype:'gridBioSourceInfo',
						id: idBS
					},{
						xtype:'fieldset',
						title:'BioSource Data',
						items:[{
							xtype:'hiddenfield',
							name:'idBiosource',
							value:idBS
						},{
							xtype:"displayfield",
							fieldLabel:'MetExplore Id',
							//id : 'gtm-idbiosource',
							value:idBS
						},{
							xtype:"displayfield",
							fieldLabel:'Name',
							value:rec.get('nameBioSource')
						},{
							xtype:"displayfield",
							fieldLabel:'Organism',
							value:rec.get('orgName')
						},{
							xtype:"displayfield",
							fieldLabel:'Tissue',
							value:rec.get('tissue')
						},{
							xtype:"displayfield",
							fieldLabel:'Cell Type',
							value:rec.get('cellType')
						},{
							xtype:"displayfield",
							fieldLabel:'Strain',
							value:rec.get('strain')
						},{
							xtype:"displayfield",
							fieldLabel:'Source Database',
							value: rec.get('dbSource')
						},{
							xtype:"displayfield",
							fieldLabel:'URL',
							value:'<a target="_blank" href="'+url+'">'+url+"</a>"
						},{
							xtype:"displayfield",
							fieldLabel:'Id in Database',
							value:rec.get('IdinDBref')
						},{
							xtype:"displayfield",
							fieldLabel:'Version',
							value:rec.get('dbVersion')
						},{
							xtype:"displayfield",
							fieldLabel:'Database type',
							value:rec.get('dbType')
						}]

					},{
						xtype:'gridBiblioLinks',
						id: idBS,
						status:true
					}]
			};

			panelConfig.items = items;


			panelConfig.tbar= {
					items:[{
					    	   xtype:'button',
					    	   text: 'Copy this Biosource',
					    	   action:'copyToPrivate',
					    	   tooltip:'Make a private copy of this BioSource',
					    	   iconCls:'copyNetwork',
					    	   disabled:false
					       }]
			};
		}

		this.callParent([panelConfig]);

	}

});