/**
 * selectOrganism
 */
Ext.define('MetExplore.view.form.V_SelectOrganism', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.selectOrganism',

	displayField: 'name',
	valueField: 'id',
	//width: 400,
//	id :'selOrganism',
	store:"",
	queryMode: 'local',
	typeAhead: false,
	editable:true,
	forceSelection:true,
	emptyText:'-- Select Organism --',
	margin:'0 0 5 0',



	initComponent:function(){

		var compartStore=Ext.create('MetExplore.store.S_Organism');
	
		this.store=compartStore;
		this.callParent();

	}
});