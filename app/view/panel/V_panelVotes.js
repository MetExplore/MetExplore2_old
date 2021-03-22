/**
 * panel Info reaction
 * Show panel of votes
 */
Ext.define('MetExplore.view.panel.V_panelVotes', {

	extend : 'Ext.tab.Panel',
	alias : 'widget.panelVotes',
	xtype: 'panelVotes',
	name: 'panelVotes',
	layout: 'fit',
	items: [],
	border: false,

	constructor : function(params) {
		var config = this.config;
		config.canAnnot = params.canAnnot;
		config.typeObj = params.typeObj;
		config.idObj = params.idObj;
		var votes = ["Exists in this organism",
		             "Exists but contains some errors",
		             "Does not exist in this organism", 
		             "I have no idea"];

		//Get votes:
		if (config.canAnnot && !MetExplore.globals.Session.publicBioSource)
		{
			Ext.Ajax.request({
				url:'resources/src/php/dataNetwork/dataVotePresence.php',
				params: {idObject:config.idObj, type: config.typeObj, idUser: MetExplore.globals.Session.idUser},
				failure : function(response, opts) {
					Ext.MessageBox
					.alert('Ajax error',
					'get data of window failed on Vote!');
				},
				success : function(response, opts) {
					var repJson = null;

					try
					{
						repJson=Ext.decode(response.responseText);
					}
					catch (exception) {
						Ext.MessageBox
						.alert('Ajax error',
						'get data of window failed on Vote!');
					}

					if (repJson != null && repJson['success'])
					{
						if(repJson['userChoice'] == "objectExists")
						{
							var buttonToToggle = "objectExists";
							var $it = 0;
						}
						else if(repJson['userChoice'] == 'objectHasErrors')
						{
							var buttonToToggle = "objectHasErrors";
							var $it = 1;
						}
						else if(repJson['userChoice'] == 'objectNotExists')
						{
							var buttonToToggle = "objectNotExists";
							var $it = 2;
						}
						else
						{
							var buttonToToggle = "objectNoIdea";
							var $it = 3;
						}

						this.query("button[action='" + buttonToToggle + "']")[0].toggle(true);
						this.query("button[action='" + buttonToToggle + "']")[0].setText('<b style="font-size: 115%"><u>' + votes[$it] + '</u></b>');
						this.query("label[name='voteTotal']")[0].setText(String(repJson['nbTotal']));
						this.query("label[name='voteYes']")[0].setText(String(repJson['nbYes']) + " (" + String(repJson['nbYesPct']) + "%)");
						this.query("label[name='voteYesNo']")[0].setText(String(repJson['nbHasErrors']) + " (" + String(repJson['nbHasErrorsPct']) + "%)");
						this.query("label[name='voteNo']")[0].setText(String(repJson['nbNo']) + " (" + String(repJson['nbNoPct']) + "%)");
						this.up('window').down('panel[name=votePanel]').setTitle("<b>Votes for this " + config.typeObj + " (" + repJson['nbTotal'] + ")</b>");
					}
					else
					{
						Ext.MessageBox
						.alert('Error in get vote data',
								repJson['message']);
					}


				},
				scope: this
			});
		}

		items = [{
			title: 'My opinion',
			cls: 'titles',
			xtype: 'panel',
			border: false,
			header: false,
			hidden: !config.canAnnot,
			layout: {
				type: 'vbox',
				align: 'stretch',
				animate: true
			},
			items: [{
				xtype: 'label',
				cls: 'head-votes',
				text: 'I think that this ' + config.typeObj + ':'
			},{
				xtype:'button',
				baseCls:'objectExists',
				text: votes[0],
				toggleGroup: 'votePathway',
				action: 'objectExists',
				enableToggle: true
			}, {
				xtype:'button',
				baseCls:'objectHasErrors',
				text: votes[1],
				toggleGroup: 'votePathway',
				action: 'objectHasErrors',
				enableToggle: true
			},{
				xtype:'button',
				baseCls:'objectNotExists',
				text: votes[2],
				toggleGroup: 'votePathway',
				action: 'objectNotExists',
				enableToggle: true
			}, {
				xtype:'button',
				baseCls:'objectNoIdea',
				text: votes[3],
				toggleGroup: 'votePathway',
				action: 'objectNoIdea',
				enableToggle:true,
				pressed: true
			}]
		},{
			title: 'All votes',
			cls: 'titles',
			xtype: 'panel',
			border: false,
			header: false,
			layout: {
				type: 'vbox',
				align: 'left',
				animate: true
			},
			items: [{
				xtype: 'panel',
				margins: '0 0 10 0',
				border: false,
				header: false,
				layout: {
					type: 'hbox',
					align: 'stretch',
					animate: true
				},
				items: [{
					xtype: 'label',
					cls: 'titleVoteNb',
					name: 'voteTotal'
				},{
					xtype: 'label',
					cls: 'titleVote',
					text: 'persons vote for this ' + config.typeObj + ':',
					margins: '0 0 0 4'
				}]

			},{
				xtype: 'panel',
				border: false,
				header: false,
				cls: 'yesVotePanel',
				width: '100%',
				layout: {
					type: 'hbox',
					align: 'stretch',
					animate: true
				},
				items: [{
					xtype: 'label',
					cls: 'yesVoteNb',
					name: 'voteYes',
					width: 65
				},{
					xtype: 'label',
					cls: 'yesVote',
					text: 'Exists',
					margins: '0 0 0 4'
				}]
			},{
				xtype: 'panel',
				border: false,
				header: false,
				cls: 'yesnoVotePanel',
				width: '100%',
				layout: {
					type: 'hbox',
					align: 'stretch',
					animate: true
				},
				items: [{
					xtype: 'label',
					cls: 'yesnoVoteNb',
					name: 'voteYesNo',
					width: 65
				},{
					xtype: 'label',
					cls: 'yesnoVote',
					text: 'Has errors',
					margins: '0 0 0 4'
				}]
			},{
				xtype: 'panel',
				border: false,
				header: false,
				cls: 'noVotePanel',
				width: '100%',
				layout: {
					type: 'hbox',
					align: 'stretch',
					animate: true
				},
				items: [{
					xtype: 'label',
					cls: 'noVoteNb',
					name: 'voteNo',
					width: 65
				},{
					xtype: 'label',
					cls: 'noVote',
					text: 'Not exists',
					margins: '0 0 0 4'
				}]
			},{
				xtype: 'button',
				text: 'Details',
				action: 'detailsVotes',
				margins: '10 0 0 0',
				width: 100
			}]
		}];

		config.items = items;

		this.callParent([config]);

	}
});