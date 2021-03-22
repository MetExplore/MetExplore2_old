/**
 * selectInsertReaction
 */
 Ext.define('MetExplore.view.form.V_SelectInsertReaction', {
 	extend : 'MetExplore.view.form.V_SelectInsertGeneric',

 	alias : 'widget.selectInsertReaction',

 	requires : ['MetExplore.view.form.V_SelectReactions'],

 	items : [{

 		xtype:'fieldset',
	 	border:false,
	 	padding:0,
		margin:0, 		
 		items : [{

	 		xtype : 'selectReactions',
	 		name : 'rxns',
	 		store : 'S_Reaction',
	 		valueField : 'idInBio',
	 		displayField :'dbIdentifier',
	 		fieldLabel : 'Reactions',
	 		emptyText : '-- Select Reaction(s) --',
	 		width : 390
	 	},{
	 		xtype:'button',
	 		text : "Report Table selection",
	 		action : "reportReactionSelection"
	 	},{
	 		xtype:'button',
	 		text : 'Create New Reaction',
	 		action : 'newReaction'
	 	}]
	}]


	
	

 });