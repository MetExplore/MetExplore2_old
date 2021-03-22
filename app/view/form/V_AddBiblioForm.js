/**
 * addBiblioForm
 */
Ext.define('MetExplore.view.form.V_AddBiblioForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.addBiblioForm',

	//margin:'5 5 5 5',
	border: false,
	bodyStyle : 'background:none',

	layout: 'hbox',
	defaults:{
		labelAlign:'top'
	},
	defaultType:'textfield',
	items:[{
		name: 'PMID',
		width:100
	},{
		//flex: 2,
		name: 'title',
        width:300
	},{
		//flex: 2,
		name: 'authors',
        width:200
	},{
		//flex: 2,
		name: 'Journal',
        width:200
	},{
		width:100,
		name: 'Year'
	},{
		xtype:'button',
		//width:200,
		text:'Complete with PubMed Web service',
		action:'PubMedWS'
	},{
		xtype:'button',
		width:25,
		iconCls:'add',
		action:'addBiblio'

	}]

});