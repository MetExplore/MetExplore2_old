/**
 * C_gridProtein
 */
Ext.define('MetExplore.controller.C_gridEnzyme', {
    extend: 'Ext.app.Controller',


    views: ['grid.V_gridEnzyme'],
    stores: ['S_Enzyme'],
    /*
     * Definition des evenements
     */
    init: function() {

        //this.getS_EnzymeStore().addListener('beforeload', MetExplore.globals.Session.removeVotesColumn, this);
        this.getS_EnzymeStore().addListener('load', MetExplore.globals.Session.showHideLinkColumn, this);
        this.getS_EnzymeStore().addListener('datachanged', this.UpdateTitle, this);
        this.getS_EnzymeStore().addListener('filterchange', this.UpdateTitle, this);
        this.control({
            'gridEnzyme': {
                viewready: MetExplore.globals.Session.showHideLinkColumn
            }
        });

    },

    UpdateTitle: function(store) {

        var visibleElt = store.getCount(),
            total = store.getTotalCount();
        if (MetExplore.globals.Session.idBioSource == -1) total = 0;
        var grid = Ext.getCmp('gridEnzyme');

        grid.setTitle('Enzymatic Complexes (' + visibleElt + '/' + total + ')');
    }

});