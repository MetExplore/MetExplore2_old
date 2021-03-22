/**
 * selectMeSH
 */
Ext.define('MetExplore.view.form.V_SelectMeSH', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.selectMeSH',
    store: 'S_MeSH4Select',
    displayField: 'term',
    valueField: 'term',
    multiSelect: false,
    delimiter: ";",
    minChars: 2,
    width: 200,
    queryMode: 'local',
    editable: true,
    forceSelection: true,
    emptyText: '',
    margin: '0 0 5 0',
    anyMatch: true,
    // listeners: {
    //     beforequery: function(qp) {
    //         // Force the query through for typeAhead
    //         this.lastQuery = null;
    //
    //         // Force an empty filter so everything shows
    //         qp.query = '';
    //     }
    // }
    doQuery: function(queryString) {
        var me = this;

        function myStopFunction() {
            clearTimeout(ctrlSelectMesh.runningQuery);
        }
        var ctrlSelectMesh = MetExplore.app.getController('C_SelectMeSH');
        if (ctrlSelectMesh.runningQuery != undefined) {
            myStopFunction();
        }

        ctrlSelectMesh.runningQuery = setTimeout(function() {
            MetExplore.app.getController('C_SelectMeSH').quering(queryString);
            // Expand after adjusting the filter unless there are no matches
            if (me.store.getCount()) {
                me.expand();
            } else {
                me.collapse();
            }
        }, 1000);
    }
});