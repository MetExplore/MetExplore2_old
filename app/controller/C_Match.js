/**
 * C_Match
 * 
 */

Ext.define('MetExplore.controller.C_Match', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session'],

    config: {
        views: ['form.V_Annotation_TabFile']
    },

    /**
     * init function Checks the changes on the bioSource selection
     * 
     */
    init: function() {
        this.control({
            'formAnnotation button': {
                click: this.match
            }
        });
    },

    /**
     * add context menu on grid
     * @param {} button
     */
    /**
     * @method matchp
     * Recupere le contenu du formulaire de match data tab
     * Execute match
     * Copie les data dans Store Annotation
     */
    match: function(button) {
        console.log('match');
        var ctrl = this;
        /**
         * recuperation info du formulaire
         */
        var panel = Ext.getCmp('tabPanel').getActiveTab();

        var objectName = panel.query('combo')[0].getRawValue();

        var grid = panel.query('gridAnnotation')[0];

        var tabMatch = new Array;
        var matchCol = 0;
        var fieldMatch = 'name';
        for (var i = 0; i < 25; i++) {
            var textCol = grid.columns[i].text;
            if (textCol.search('Col_') == -1)
                tabMatch.push(textCol);
            if (i == matchCol) fieldMatch = textCol;
        }

        var dataTab = panel.query('gridAnnotation')[0].getStore();

        //console.log('objectName : ',objectName);
        //console.log('dataTab : ',dataTab);
        //console.log('fieldMatch : ',fieldMatch);
        //console.log('tabMatch : ',tabMatch);
        //				
        var storeObject = Ext.getStore('S_' + objectName);
        var annot = Ext.getStore('S_Annotation' + objectName);
        var storeData = grid.getStore();

        /**
         * Pour chaque ligne du tableau
         * recuperer la valeur de la colonne de match
         * recuperer le field
         * chercher dans store du network si cette valeur 
         */
        storeData.each(function(recAnnot) {
            var val = recAnnot.get('tab' + matchCol);
            //console.log(val);
            var record = storeObject.findRecord(fieldMatch, val, 0, false, true, true);
            if (record) {
                /**
                 * pour tous les enr sauf matchCol
                 * mettre valeur dans store
                 * voir si plusieurs record avec meme valeur
                 */
                for (i = 0; i < tabMatch.length; i++) {
                    if (i != matchCol) {
                        var field = tabMatch[i];

                        annot.add({
                            'id': record.get('id'),
                            'table': objectName,
                            'field': field,
                            'name': record.get('name'),
                            'dbIdentifier': record.get('dbIdentifier'),
                            'oldV': record.get(field),
                            'newV': recAnnot.get('tab' + i)
                        });
                        record.set(field, recAnnot.get('tab' + i));
                    }
                }
            }
        })
    }
});