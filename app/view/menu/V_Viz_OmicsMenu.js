/**
 * @author Fabien Jourdan
 * @description Menu to call mapping functions on cytoscape view
 */

Ext.define('MetExplore.view.menu.V_Viz_OmicsMenu', {
        extend: 'Ext.menu.Menu', 
        alias: 'widget.vizOmicsMenu',
        
//        requires: ['MetExplore.controller.C_GraphPanel'],

        items:  [
             {
                 text: 'Import Mapping',
                 action:'GraphMapping',
                 tooltip:'Display mapping info on Graph',
                 iconCls:'importData'
             }
        ]
});