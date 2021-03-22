/**
 * SelectMeSHPairMetrics
 */
Ext.define('MetExplore.view.form.V_SelectMeSHPairMetrics', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.selectMeSHPairMetrics',
    store: 'S_MeSHPairMetrics',
    displayField: 'title',
    valueField: 'title',
    multiSelect: false,
    emptyText: '-- Select MeSH pair metrics analyses --',
    delimiter: ",",
    minChars: 2,
    width: 200,
    queryMode: 'local',
    editable: true,
    forceSelection: true,
    margin: '0 0 5 0',
    anyMatch: true
});