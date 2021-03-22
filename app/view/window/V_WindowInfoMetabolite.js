/**
 * panel Info metabolite
 */
Ext.define('MetExplore.view.window.V_WindowInfoMetabolite', {

	extend : 'MetExplore.view.window.V_WindowInfoGeneric',
	alias : 'widget.windowInfoMetabolite',

	requires:['MetExplore.view.grid.V_gridMetaboliteIds', 'MetExplore.view.panel.V_panelVotes'],

	
	constructor : function(params) {
		var rec=params.rec;
		config = this.config;
		config.title=rec.get('name') + " [" + rec.get('dbIdentifier') + "] ";
		var mySQlId = rec.get('id');

		var svgFile=rec.getSvg();
		var itemsArray=[];
		var img;

		if (svgFile!='undefined'){

			img=Ext.create('Ext.Img', {
				src: 'http://metexplore.toulouse.inra.fr/resources/images/structure_metabolite/'+svgFile
			});
		}

		items=[{
			xtype:'panel',
			title: '<b>About metabolite</b>',
			autoScroll: true,
			border: false,
			items: [img,
			{
				xtype:'gridMetaboliteIds',
				record: rec
			}]
		},{
			xtype: 'panel',
			title: '<b>Votes for this metabolite</b>',
			name: 'votePanel',
			hidden: MetExplore.globals.Session.publicBioSource,
			items: [{
				xtype: 'panelVotes',
				typeObj: "metabolite",
				idObj: mySQlId,
				canAnnot: true
			}]
		}];

		config.items = items;

		this.callParent([config]);

	}


});
