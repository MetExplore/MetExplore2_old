/**
 * selectElement
 */
Ext.define('MetExplore.view.form.V_SelectElement', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.selectElement',

	width: 340,
	store: {
		fields: ['name','id','priority'],
		data: [{'name':'Compartment','id':'Compartment','priority':1},
		       {'name':'Pathway','id':'Pathway','priority':1},
		       {'name':'Reaction','id':'Reaction','priority':3},
		       {'name':'Metabolite','id':'Metabolite','priority':2},
		       {'name':'Enzymatic Complex','id':'Enzyme','priority':2},
		       {'name':'Gene Product','id':'Protein','priority':2},
		       {'name':'Gene','id':'Gene','priority':1}
		       ]
	},
	displayField: 'name',
	valueField: 'id',
	typeAhead: true,
	emptyText:'-- Select Element type --',
	margin:'5 5 5 5',
	anyMatch : true,

	listeners:{
		beforeselect:{
			fn:function(combo, record, index, eOpts){

				if (Ext.getCmp('sidePanel') && Ext.getCmp('sidePanel').down('gridBioSourceInfo')){
					var bsInfo=Ext.getCmp('sidePanel').down('gridBioSourceInfo').getStore();

					if(record.get('priority')>1 && bsInfo.getAt(0).get('nbCompartments')==0){
						Ext.MessageBox.alert('Priority Alert','You need to create at least one Compartment element before creating a '+record.get('name'));
						return false;
					}
					if((record.get('priority')>2 && bsInfo.getAt(0).get('nbMetabolites')==0)){
						Ext.MessageBox.alert('Priority Alert','You need to create at least one Metabolite element before creating a '+record.get('name'));
						return false;
					}
				}
				return true;
			}
		}
	}



});