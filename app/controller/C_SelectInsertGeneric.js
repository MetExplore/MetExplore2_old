/**
 * C_SelectInsertGeneric
 */
Ext.define('MetExplore.controller.C_SelectInsertGeneric', {

    extend: 'Ext.app.Controller',

    init: function() {

        this.control({
            'selectInsertGeneric button[action=newCompartment]': {
                click: this.newWin
            },
            'selectInsertGeneric button[action=newPathway]': {
                click: this.newWin
            },
            'selectInsertGeneric button[action=newReaction]': {
                click: this.newWin
            },
            'selectInsertGeneric button[action=newMetabolite]': {
                click: this.newWin
            },
            'selectInsertGeneric button[action=newEnzyme]': {
                click: this.newWin
            },
            'selectInsertGeneric button[action=newProtein]': {
                click: this.newWin
            },
            'selectInsertGeneric button[action=newGene]': {
                click: this.newWin
            }
        });
    },

    newWin: function(button) {
        var type = button.action.substring(3);
        var eltDisplayName;

        if (type === 'Protein') {
            eltDisplayName = "Gene Product";
        } else if (type === 'Enzyme') {
            eltDisplayName = "Enzymatic Complex";
        } else {
            eltDisplayName = type;
        }


        var winConfig = {
            title: 'Add New ' + eltDisplayName,
            autoScroll: true,

            border: false,
            items: [{
                xtype: 'add' + type + 'Form'
            }]
        };

        if (type == "Reaction") {
            winConfig['width'] = '1100';
        }

        var win = Ext.create('Ext.Window', winConfig);
        win.show();
    }

});