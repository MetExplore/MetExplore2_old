/**
 * addReactionForm
 */
Ext.define('MetExplore.view.form.V_AddReactionForm', {
	extend: 'MetExplore.view.form.V_AddGenericForm', 

	alias: 'widget.addReactionForm',

	requires: ['MetExplore.view.form.V_ReactionCreate'],
	
	config: {
		initialValues: []
	},

	buttonAlign: 'left',
	border: false,
	items:[],
	buttons:[],
	
    
    constructor : function(params) {
    	
    	config=this.config;
    	config.passedRecord=params.passedRecord;
    	    	  	
    	if(params.passedRecord!=null){
    		config.items=[{
    			xtype:'reactionCreate',
    			Reaction:params.passedRecord
    		}];
    		
    		config.buttons=[{ 
				   text:'Update',
				   action: 'updateReaction',
				   formBind: true            
			   }];
    	}else{
    		config.items=[{
    			xtype:'reactionCreate',
    			Reaction:null
    		}];
    		
    		config.buttons=[{
    	  	  text: 'Add',
    	  	  formBind: true,
    	  	  width:100,
    	  	  action:'addReaction'
    	    }];
    	}
    	
    	this.callParent([config]);
    }

});