/**
 * @author FC
 * @description Export menu
 */

Ext.define('MetExplore.view.menu.V_ExportMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.exportMenu',

    requires: ['MetExplore.view.button.V_JavaApplicationMenuItem'],


    items: [{
        xtype: 'menuitem',
        text: 'Export network to Excel',
        id : 'exportNetworkExcel',
        action: 'exportNetworkExcel' //Controlled by C_ExportExcel
    }, {
        xtype: 'ja_menu_item',
        text: 'Export as SBML',
        action: 'showcustomSBMLUI',
        id : 'exportNetworkSBML'
    }]
});