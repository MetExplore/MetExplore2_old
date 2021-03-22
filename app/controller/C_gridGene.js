/**
 * C_gridGene
 */
Ext.define('MetExplore.controller.C_gridGene', {
    extend: 'Ext.app.Controller',

    views: ['grid.V_gridGene'],
    stores: ['S_Gene','S_IdentifiersDBName','S_Identifiersgit'],
    /*
     * Definition des evenements
     */
    init: function() {

        //this.getS_GeneStore().addListener('beforeload', MetExplore.globals.Session.removeVotesColumn, this);
        this.getS_GeneStore().addListener('load', MetExplore.globals.Session.showHideLinkColumn, this);
        this.getS_GeneStore().addListener('datachanged', this.UpdateTitle, this);
        this.getS_GeneStore().addListener('filterchange', this.UpdateTitle, this);
        this.control({
            'gridGene': {
                viewready: MetExplore.globals.Session.showHideLinkColumn
            },
            'gridGene button[action=showIdsGene]': {
                click: this.showIdsGene
            }
        });

    },

    UpdateTitle: function(store) {
        //console.log('update title');
        var visibleElt = store.getCount(),
            total = store.getTotalCount();
        if (MetExplore.globals.Session.idBioSource == -1) total = 0;
        var grid = Ext.getCmp('gridGene');

        grid.setTitle('Genes (' + visibleElt + '/' + total + ')');
    },

    /*
    show columns of ids
    */
    showIdsGene: function(){
        if (MetExplore.globals.Identifiers.S_IdentifiersGene!=MetExplore.globals.Session.idBioSource) {
            var storeIds = Ext.getStore('S_IdentifiersGene');
            var idBioSource = MetExplore.globals.Session.idBioSource;
            storeIds.proxy.extraParams.idBioSource = idBioSource
            storeIds.load({
                callback: function () {
                    MetExplore.globals.Identifiers.S_IdentifiersGene = idBioSource;
                    //console.log(storeIds);
                }
            });
        }
        var comboField = Ext.create('Ext.form.ComboBox', {
            emptyText: '-- Select Field --',
            width: 200,
            store: MetExplore.globals.Identifiers.extDBNameGene, // store:
            queryMode: 'local',
            multiSelect: true,
            typeAhead: true,
            margin: '5 5 100 5'
        });
        var storeG= Ext.getStore('S_Gene');
        var win = Ext.create('Ext.Window', {
            items: [comboField],
            title: 'Identifiers',
            buttons: [{
                text: 'Submit',
                handler: function() {
                    // ajout des identifiants
                    //console.log('add');
                    var field = comboField.value;
                    if (MetExplore.globals.Identifiers.S_IdentifiersGene==MetExplore.globals.Session.idBioSource) {
                        storeG.addIdentifiersGene(comboField.value);
                    } else {
                        var storeIds = Ext.getStore('S_IdentifiersGene');
                        var idBioSource= MetExplore.globals.Session.idBioSource;
                        storeIds.proxy.extraParams.idBioSource = idBioSource
                        storeIds.load({
                            callback: function () {
                                storeG.addIdentifiersGene(comboField.value);
                            }
                        });
                    }
                    win.hide();
                }
            }, {
                text: 'Close',
                handler: function() {
                    win.hide();
                }
            }]
        });
        win.show();
        win.focus();
        Ext.resumeLayouts(true);

    },


});
