/**
 * panel Info reaction
 * Show panel of votes
 */
Ext.define('MetExplore.view.panel.V_PanelMappingViz', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.panelMappingViz',
    name: 'panelMappingViz',

    width: '100%',
    style: 'padding: 10px; overflow:auto;',
    closable: false,
    region: 'south',
    flex: 1,
    items: [],
    border: false,
    autoScroll: true
});