/**
 * C_gridProtein
 */
Ext.define('MetExplore.controller.C_gridProtein', {
    extend: 'Ext.app.Controller',

    views: ['grid.V_gridProtein'],
    stores: ['S_Protein'],
    /*
     * Definition des evenements
     * Definition des boutons dans barre tbarReaction (definie dans view/grid/V_gridReaction
     */
    init: function() {

        //this.getS_ProteinStore().addListener('beforeload', MetExplore.globals.Session.removeVotesColumn, this);
        this.getS_ProteinStore().addListener('load', MetExplore.globals.Session.showHideLinkColumn, this);
        this.getS_ProteinStore().addListener('datachanged', this.UpdateTitle, this);
        this.getS_ProteinStore().addListener('filterchange', this.UpdateTitle, this);
        this.control({
            'gridProtein': {
                viewready: MetExplore.globals.Session.showHideLinkColumn
            }
            //				'gridProtein': {
            //				sortchange:this.sortChange
            //				}
        });

    },
    /*
     * Modification du sort sur colonne :
     * relancer le php avec sql ordre
     */
    //	sortChange: function(ct, column, direction, eOpts) {
    //		/* sur sort colonne, l'evanement s'execute 2 fois pourquoi?
    //		 * 
    //		 */
    //		console.log(ct);
    //		console.log(eOpts);
    //		console.log(column.dataIndex);
    //		console.log(direction);
    //		var store= Ext.getStore('S_Protein');
    //		store.proxy.extraParams.order= column.dataIndex;
    //		store.proxy.extraParams.dir= direction;
    //		store.load();
    //
    //
    //	},


    UpdateTitle: function(store) {

        var visibleElt = store.getCount(),
            total = store.getTotalCount();
        if (MetExplore.globals.Session.idBioSource == -1) total = 0;
        var grid = Ext.getCmp('gridProtein');

        grid.setTitle('Gene Products (' + visibleElt + '/' + total + ')');
    }


});