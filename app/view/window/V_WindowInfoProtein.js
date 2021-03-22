/**
 * window Info protein
 */
Ext.define('MetExplore.view.window.V_WindowInfoProtein', {

	extend : 'MetExplore.view.window.V_WindowInfoGeneric',
	alias : 'widget.windowInfoProtein',

	requires:['MetExplore.view.panel.V_panelVotes'],


	/**
	 * Initialize view: set items in relation with parameters given
	 * @param {} params: parameters
	 */
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
				typeObject: "protein",
				canAnnot: config.canAnnot,
				win: this
	    	}]
		},{
			xtype: 'panel',
			title: '<b>Votes for this protein</b>',
			name: 'votePanel',
			hidden: MetExplore.globals.Session.publicBioSource,
			items: [{
				xtype: 'panelVotes',
				typeObj: "protein",
				idObj: mySQlId,
				canAnnot: config.canAnnot
			}]
		}];

		config.items = items;

		this.callParent([config]);

	}


});