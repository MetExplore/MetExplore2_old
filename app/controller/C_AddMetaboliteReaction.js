Ext.define('MetExplore.controller.C_gridReaction', {
	extend: 'Ext.app.Controller',
	
	config: {
		views: ['form.V_MetaboliteSearch']
	},
/*
 * Definition des evenements
 * Definition des boutons dans barre M
 */	
	init: function() {
		this.control({
			'metaboliteSearch button[action=AddMetaboliteReaction]':{
				click:this.AddMetaboliteReaction
			}
		});
		
	},

	/*
	 * Creation du tip pour chaque Reaction
	 */
	AddMetaboliteReaction: function(grid){
/*		
		grid.tip = Ext.create('Ext.tip.ToolTip', {
        	target: grid.el,
        	delegate: grid.view.cellSelector,
        	trackMouse: true,
	        renderTo: Ext.getBody(),
    	    listeners: {
        	    beforeshow: function (tip) {
   					record = grid.view.getRecord(tip.triggerElement.parentNode);
   					myToolTipText = "<b>Substrats: </b>"+ record.get('leftR');
   					myToolTipText = myToolTipText + "<br/><b>Products: </b>"+ record.get('rightR');
   					myToolTipText = myToolTipText + "<br/><b>Status: </b>"+ record.get('statusName');
   					myToolTipText = myToolTipText + "<br/><b>Score: </b>"+ record.get('scoreName');
   					tip.update(myToolTipText);
 				}
 			}
    	});		
*/	}


});