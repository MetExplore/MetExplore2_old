/**
 * metaboliteSearch
 */
Ext.define('MetExplore.view.form.V_MetaboliteSearch', {
	extend: 'Ext.form.Panel',
	alias: 'widget.metaboliteSearch',

	minWidth:950,
	//layout:'auto',

	//margin:'5 5 5 5',
	layout: 'hbox',
	//textAlign:'right',
	//bodyStyle: 'text-align:right;',

	items: 
		[{
			xtype:'textfield',
			name:'coeff',
			value:'1',
			width:50
		},{
			xtype: 'combo',
			store: 'S_Metabolite',
			emptyText: 'Search Metabolite in the Biosource',
			name:'metabolite',
			displayField: 'name',
			valueField:'id',
			queryMode: 'local',
			forceSelection: true,
			anyMatch:true,
			width:400,
			//minWidth:150,
			listConfig: {
				loadingText: 'Searching...',
				emptyText: 'No metabolite found.',
				getInnerTpl: function() {
					return '<h6> {name} in compartment: {compartment}<br /> {dbIdentifier} {chemicalFormula}</h6>';
				}
			},
			pageSize: 5
		// },{
		// 	xtype:'checkbox',
		// 	name:'cofactor',
		// 	inputValue	: '1',
		// 	padding:'0 0 0 40',
		// 	width:90
		},{
			xtype:'checkbox',
			name:'side',
            align : 'center',
			inputValue	: '1',
            padding:'0 0 0 40',
			width:90
		// },{
		// 	xtype:'checkbox',
		// 	name:'constantCoeff',
         //    align : 'center',
		// 	inputValue	: '1',
         //    //padding:'0 0 0 40',
		// 	width:90
		},{
			xtype:'combo',
			store: Ext.create('Ext.data.ArrayStore', {
				fields: [ 'type','val' ],
				data: [['Substrate','1'],['Product','2']]
			}),
			displayField: 'type',
			valueField:'type',
			forceSelection: true,
			name:'type',
			value:'Substrate',
			width:90
		},{
			xtype:'button',
			iconCls:'add',
			handler: function(){
				var form = this.up('form').getForm();

				var val= form.getValues();

				if(val['metabolite']!=''){

					var name_metabolite= this.up('form').down('combo').getRawValue();
					var tab= this.up("reactionCreate").getStore('S_ReactionCreation');

					if(!('cofactor' in val)){val['cofactor']=0}
					if(!('side' in val)){val['side']=0}
					if(!('constantCoeff' in val)){val['constantCoeff']=0}

					tab.add({'coeff':form.getValues().coeff,
						'metabolite':name_metabolite,
						'idMetabolite':form.getValues().metabolite,
						'type':form.getValues().type,
						'cofactor':val['cofactor'],
						'side':val['side'],
						'constantCoeff':val['constantCoeff']
					}); 

					form.reset();
				}

			}

		},{
			xtype: 'tbfill' 
		},{
			xtype:'button',
			text:'Create New Metabolite',
			action:'newMetabolite'
		}]
});