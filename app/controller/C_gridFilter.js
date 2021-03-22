/**
 * Controls the action column of the grid that removes a filter
 */
Ext.define('MetExplore.controller.C_gridFilter', {
    extend: 'Ext.app.Controller',
    views: ['grid.V_gridFilter'],
    //requires: ['MetExplore.globals.Session'],

    init: function() {
        this.control({
            'gridFilter': {
                deletefilter: this.deleteFilter,
            },
            'gridFilter actioncolumn[action=seeInfos]': {
                click: this.seeInfos
            },
            'gridFilter button[action=delAllFilters]': {
                click: this.delAllFilters
            },
        });

    },

    /**
     * 
     */
    delAllFilters : function() {
        var storeFilter= Ext.getStore('S_Filter');
        if (storeFilter.count()>0) {
            //Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete all filters?',
              //  function(button) {
                //    if (button == "yes") {
                        var ctrl = MetExplore.app.getController('C_GenericGrid');
                        ctrl.delfilterGrid();
                        storeFilter.removeAll();
                //     }
                // });
        }

    },

    /**
     * delete filtre selectionné
     * il faut deleter tous les filtres et apres les recreer
     * pour les recreer : il faut faire l'intersection de tous les elements du store
     *
     * @param record
     * @param rowIndex
     */
    deleteFilter: function(record, rowIndex) {
        //console.log(record);
        //var data = record.store.getAt(rowIndex).data;
        var ctrl = MetExplore.app.getController('C_GenericGrid');
        ctrl.delfilterGrid();
        var storeFilter= Ext.getStore('S_Filter');
        storeFilter.remove(record);

        //refaire filtre sur chaque element du store
        var ctrl= MetExplore.app.getController('C_GenericGrid');
        storeFilter.each(function(rec) {
            //console.log(rec);
            ctrl.filterStore('S_CompartmentInBioSource',rec.get("CompartmentInBioSource"));
            ctrl.filterStore('S_Pathway',rec.get("Pathway"));
            ctrl.filterStore('S_Reaction',rec.get("Reaction"));
            ctrl.filterStore('S_Metabolite',rec.get("Metabolite"));
            ctrl.filterStore('S_Enzyme',rec.get("Enzyme"));
            ctrl.filterStore('S_Protein',rec.get("Protein"));
            ctrl.filterStore('S_Gene',rec.get("Gene"));

        });
        //console.log('refaire search');
        //refaire les search
        var tabGrid= ['gridCompartment','gridPathway','gridReaction','gridMetabolite','gridEnzyme','gridProtein','gridGene'];
        for (i=0; i<tabGrid.length; i++) {
            var grid= Ext.getCmp(tabGrid[i]);
            var gridCol= grid.columns;
            //console.log(gridCol);

            for (j=0 ; j<gridCol.length; j++){
                //console.log(gridCol[j].search);
                //gridCol[j] != undefined && gridCol[j].items != undefined &&
                if (gridCol[j].search != undefined && gridCol[j].items.items[0].value !=undefined)
                //if ( gridCol[j] != undefined && gridCol[j].items != undefined && gridCol[j].items.items != undefined && gridCol[j].items.items[0] != undefined && gridCol[j].items.items[0].value != undefined && gridCol[j].items.items[0].value !='')
                {
                    //console.log(gridCol[j].items.items[0].search);
                    // console.log(gridCol[j]);
                    //if (gridCol[j].items.items[0].search == "fuzzy") {
                    if (gridCol[j].search == "fuzzy") {
                        MetExplore.globals.StoreUtils.fuzzysearch(gridCol[j].items.items[0].value);
                    } else {
                       // if (gridCol[j].items.items[0].value !=undefined) {
                            var filter = {id: gridCol[j].dataIndex,  property: gridCol[j].dataIndex, value: gridCol[j].items.items[0].value, anyMatch:true};
                            grid.getStore().addFilter(filter);
                        //}

                    }
                }
            }
        }
    },
    /**---------------------------------------------------------------------
     * delete all search
     */
    delAllSearch : function() {
        var tabGrid= ['gridCompartment','gridPathway','gridReaction','gridMetabolite','gridEnzyme','gridProtein','gridGene'];
        for (i=0; i<tabGrid.length; i++) {
            var grid = Ext.getCmp(tabGrid[i]);
            var gridCol = grid.columns;
            //console.log(gridCol);
            for (j = 0; j < gridCol.length; j++) {
                if (gridCol[j] != undefined && gridCol[j].items != undefined && gridCol[j].items.items != undefined && gridCol[j].items.items[0] != undefined && gridCol[j].items.items[0].value != undefined && gridCol[j].items.items[0].value != '') {
                    gridCol[j].items.items[0].setValue('');
                }

            }
        }
    },

    seeInfos: function(grid, rowIndex, colIndex, item, e, record, row) {
        var storeFilter= Ext.getStore('S_Filter');
        //console.log(record);
        //console.log(rowIndex);

        var msg= record.get('dbIdentifiers').split(',').join("<br>");
        Ext.Msg.show({
            msg: msg,
            title: 'Detail Filter : '+ record.get('object'),
            buttons: Ext.Msg.OK,
        });

    },

});