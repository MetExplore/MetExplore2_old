/**
 * bioSourcebiblio
 */
Ext.define('MetExplore.view.grid.V_gridBiblioLinks',{
	extend:'Ext.grid.Panel',
	
	alias: 'widget.gridBiblioLinks',
	
	requires : ['MetExplore.model.BioSourceBiblio'],

	header:false,
	border:false,
	layout:'fit',
	
	store: {},

	columns: [{ 
		text: 'Publication',
		flex:1,
		dataIndex: 'link' 
	},{
		xtype: 'actioncolumn',
		width: 24,
		iconCls: 'del',
		hidden:true
	}],

/**
 * 
 * @param {} params
 */
	constructor : function(params) {

		var idBS=params.id;
		var BSstatus=params.status;
		var gridConfig = this.config;


		var jStore=Ext.getStore('S_BioSource');
		var rec=jStore.findRecord( 'id', idBS);

		if (!rec){
			jStore=Ext.getStore('S_MyBioSource');
			rec=jStore.findRecord( 'id', idBS);
		}

		var storeBiblio;

		if(!rec){
			
			/**
			 * stores not loaded yet, we add an event (single) on store load to create the biblioStore 
			 */
			storeBiblio= Ext.create('Ext.data.Store', {
				model: 'MetExplore.model.BioSourceBiblio',
				data:[]
			});
			if(BSstatus){
				
				Ext.getStore('S_BioSource').on({
					load:{fn:function(store, records){
						if (idBS!=-1){
							var rec=store.findRecord( 'id', idBS);
							var refData=this.createStore(rec.get('biblio'),idBS);
							this.getStore().add(refData);
						}
					},
					scope:this,
					single : true
					}
				});
			}else{
				Ext.getStore('S_MyBioSource').on({
					load:{fn:function(store, records){
						if (idBS!=-1){
							var rec=store.findRecord( 'id', idBS);
							var refData=this.createStore(rec.get('biblio'),idBS);
							this.getStore().add(refData);
						}
					},
					scope:this,
					single : true
					}
				});
			}
		}else{
			var refData=this.createStore(rec.get('biblio'),idBS);

			storeBiblio= Ext.create('Ext.data.Store', {
				model: 'MetExplore.model.BioSourceBiblio',
				data : refData
			});

			if (!rec.get('public')){
				this.columns[1].hidden=false;
			}else{
				this.columns[1].hidden=true;
			}
		}
		gridConfig.store=storeBiblio;

		this.callParent([gridConfig]);

	},
/**
 * 
 * @param {} StringBiblio
 * @return {}
 */
	createStore:function(StringBiblio,idbs){

		var refData=[];
		var arrayOfStrings = StringBiblio.split("-");

		for (var i=0; i < arrayOfStrings.length; i++){
			var ref={};
			if (arrayOfStrings[i]!=""){
				
				ref['idbs']=idbs;
				
				var data=arrayOfStrings[i].split("|");
				ref['id']=data[0];
				if(data[1]!=""){						
					ref['link']='<a target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/?term='+data[0]+'">'+data[1]+'</a>';
				}else{
					ref['link']='<a target="_blank" href="http://www.ncbi.nlm.nih.gov/pubmed/?term='+data[0]+'">'+data[0]+'</a>';
				}
				refData.push(ref);
			}
		}
		return refData;
	}

});