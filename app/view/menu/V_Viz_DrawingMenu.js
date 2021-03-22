/**
 * @author Fabien Jourdan
 * @description Menu to call mapping functions on cytoscape view
 */

Ext.define('MetExplore.view.menu.V_Viz_DrawingMenu', {
        extend: 'Ext.menu.Menu', 
        alias: 'widget.vizDrawingMenu',
        
 //       requires: ['MetExplore.controller.C_GraphPanel'],

        items:  [
             {
                 text: 'Remove side compounds',
                 action:'removeSideCompounds',
                 tooltip:'Remove metabolites annotated as side compounds',
                 iconCls:'delete-sideCompounds'
             },
             {
                 text: 'Duplicate all side compounds and selected nodes',
                 action:'duplicateSideCompounds',
                 tooltip:'Duplicate metabolites annotated as side compounds',
                 iconCls:'duplicate-sideCompounds'
             }
        ]
});