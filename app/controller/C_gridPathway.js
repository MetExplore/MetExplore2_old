/**
 * C_gridPathway
 */
Ext.define('MetExplore.controller.C_gridPathway', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session'],
    views: ['grid.V_gridPathway', 'grid.V_gridPathwaysInReaction', 'window.V_WindowStatisticsPathway'],
    stores: ['S_Pathway'],

    /*
     * Definition des evenements
     * Definition des boutons dans barre tbarReaction (definie dans view/grid/V_gridReaction
     */
    init: function() {
        //this.getS_PathwayStore().addListener('beforeload', MetExplore.globals.Session.removeVotesColumn, this);
        this.getS_PathwayStore().addListener('load', MetExplore.globals.Session.showHideLinkColumn, this);
        this.getS_PathwayStore().addListener('datachanged', this.UpdateTitle, this);
        this.getS_PathwayStore().addListener('filterchange', this.UpdateTitle, this);
        this.control({
            //'gridPathway': {edit: this.editChange},
            'gridPathway': {
                viewready: MetExplore.globals.Session.showHideLinkColumn
            },
            /*'gridPathwaysInReaction': {'viewInfos': this.openWindowInfo},*/
            'gridPathway button[action=statistics]': {
                click: this.showStatistics
            }
        });

    },

    /**
     * Show the window statistics of the pathway
     * @param {} button
     */
    showStatistics: function(button) {
        var win_Statistics = new Ext.create('MetExplore.view.window.V_WindowStatisticsPathway', {
            storePathway: button.up('panel').getStore()
        });
        win_Statistics.show();
        win_Statistics.focus()
    },

    UpdateTitle: function(store) {

        var visibleElt = store.getCount(),
            total = store.getTotalCount();
        if (MetExplore.globals.Session.idBioSource == -1) total = 0;
        var grid = Ext.getCmp('gridPathway');

        grid.setTitle('Pathways (' + visibleElt + '/' + total + ')');
    }

    /**
     * When a row is edited (until now, only confidence is editable)
     * @param {} editor
     * @param {} e
     */
    /*editChange: function(editor,e){
    	var oldV= e.originalValue;
    	var newV= e.value;
    	if (oldV != newV) {
    		
    		//Put values in array:
    		var aArrays = new Array();
    		aOptions= new Array;	// vide
    		aOptions[0]= e.record.get('id');
    		aOptions[1]= 'Pathway';
    		aOptions[2]= e.field;
    		aOptions[3]= e.record.get('name');
    		aOptions[4]= e.record.get('dbIdentifier');
    		aOptions[5]= oldV;
    		aOptions[6]= newV;
    		aArrays.push(aOptions);
    		
    		//Make json data:
    		var jsonModif= Ext.encode(aArrays);
    		
    		//Update database:
    		Ext.Ajax.request({
    					url:'resources/src/php/modifNetwork/changePathway.php',
    					params: {Pathways:jsonModif},
    					failure : function(response, opts) {
    						Ext.MessageBox
    								.alert('Ajax error',
    										'Update confidence value in Database failed!');
    						this.win_wait.close();
    					}
    		});
    	};
    }*/

});