/**
 * addBioSourceForm
 */
Ext.define('MetExplore.view.form.V_AddBioSourceForm', {
	extend: 'MetExplore.view.form.V_AddGenericForm',

	requires:['MetExplore.view.form.V_SelectInsertOrganism','MetExplore.view.grid.V_gridReactionBiblio','MetExplore.override.form.field.VTypes'],

	alias: 'widget.addBioSourceForm',
	layout:"fit",

	minWidth: 700,
	items:[{
		xtype		: 'fieldset',
		layout:{
			type: 'table',
			columns: 5,
			tableAttrs: {
				style: {
					width: '100%'
				}
			},
			tdAttrs:{
				style: {
					padding:'0 0 5px 5px'
				}
			}
		},
		defaults: {
			// applied to each contained panel
			bodyStyle: 'padding:5px'
		},
		margin:'0 5 5 5',
		defaultType:'textfield',
		title:'New Biosource',
		items:[{
			fieldLabel: "Name of the BioSource *",
			name:"name",
			labelWidth:100,
			maxWidth:400,
			minWidth:300,
			allowBlank:false,
			colspan:2
		},{
			fieldLabel: "Id of the BioSource *",
            vtype:'dbIdentifier',
			name:"id",
			labelWidth:100,
			allowBlank:false,
			maxWidth:400,
			minWidth:300,
			colspan:2
		},{
			fieldLabel: "Version",
			name:"version",
			labelWidth:100,
			maxWidth:200,
			minWidth:100,
			colspan:1
		},{
			fieldLabel: "Source Database",
			name:"source",
			emptyText:"BioCyc, Recon, ...",
			labelWidth:100,
			maxWidth:400,
			minWidth:300,
			colspan:2
		},{
			fieldLabel: "URL of your Website",
			labelWidth:100,
			maxWidth:400,
			minWidth:300,
			name:"url",
			colspan:2
		},{
			xtype:'panel',
			minWidth:300,
			colspan:1
		},{
			style: {
				padding:'5px 0 0 0'
			},
			xtype:'selectInsertOrganism',
			fieldLabel: "Organism",
			name:'orgid',
			labelWidth:100,
			width:600,
			bodyStyle : 'background:none',
			colspan:5
		},{
			style: {
				padding:'5px 0 0 0'
			},
			fieldLabel: "Strain",
			labelWidth:100,
			maxWidth:400,
			minWidth:300,
			name:"strain",
			colspan:2
		},{
			style: {
				padding:'5px 0 0 0'
			},
			fieldLabel: "Tissue",
			labelWidth:100,
			maxWidth:400,
			minWidth:300,
			name:"tissue",
			colspan:2
		},{
			style: {
				padding:'5px 0 0 0'
			},
			fieldLabel: "Cell Type",
			labelWidth:100,
			maxWidth:200,
			minWidth:100,
			name:"cellType",
			colspan:1
		},{
			xtype     : 'textareafield',
			grow      : true,
			name      : 'comment',
			fieldLabel: 'Comment',
			labelAlign:'top',
			width:'100%',
			colspan:5
		},{
			xtype:"fieldset",
			title:'Network Reference',
			items:[{
				xtype     : 'gridReactionBiblio'
			}],
			colspan:5
		}]
	}],

	buttonAlign: 'left',
	buttons:[{ 
		text:'Add',
		action: 'addBioSource',		
		formBind: true            
	}]

});