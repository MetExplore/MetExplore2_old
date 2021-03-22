/**
 * panel Info enzyme
 */
Ext.define('MetExplore.view.window.V_WindowInfoEnzyme', {

	extend : 'MetExplore.view.window.V_WindowInfoGeneric',
	alias : 'widget.windowInfoEnzyme',

	requires:['MetExplore.view.panel.V_panelVotes'],

	height: 500,
	width: 400,
	layout: 'accordion',
	constrainHeader : true,
	items : [],
	bbar :['->', { xtype: 'button', text: 'Close', action:'close'}],


	constructor : function(params) {
		var rec=params.rec;
		config = this.config;
		config.title=rec.get('name') + " [" + rec.get('dbIdentifier') + "] ";
		var mySQlId = rec.get('id');
		if (MetExplore.globals.Session.access == "r" || MetExplore.globals.Session.idUser == -1)
		{
			config.canAnnot = false;
		}
		else
		{
			config.canAnnot = true;
		}

		items=[{
			title:'Comments',
			name: 'panelComments',
	    	xtype: 'panel',
	    	hidden: MetExplore.globals.Session.publicBioSource,
	    	layout:{
    		    type:'vbox',
    		    align:'stretch'
    	    },
	    	items: [{
				xtype:'gridObjectComment',
				idObject: mySQlId,
				typeObject: "enzyme",
				canAnnot: config.canAnnot,
				win: this
	    	}]
		},{
			xtype: 'panel',
			title: '<b>Votes for this enzyme</b>',
			name: 'votePanel',
			hidden: MetExplore.globals.Session.publicBioSource,
			items: [{
				xtype: 'panelVotes',
				typeObj: "enzyme",
				idObj: mySQlId,
				canAnnot: config.canAnnot
			}]
		}];

		config.items = items;

		this.callParent([config]);

	}


});