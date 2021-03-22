/**
 * @author Fabien Jourdan
 * @description Menu export network viz
 */

Ext.define('MetExplore.view.menu.V_Viz_ExportMenu', {
        extend: 'Ext.menu.Menu', 
        alias: 'widget.vizExportMenu',
        
 //       requires: ['MetExplore.controller.C_GraphPanel'],

        items:  [
             {
                 text: 'Export Viz as svg',
                 action:'exportSVG',
                 tooltip:'Export network viz as a svg file',
                 iconCls:'exportSvg'
                },
                {
                 text: 'Export Viz as png',
                 action:'exportPNG',
                 tooltip:'Export network viz as a png file',
                 iconCls:'exportPng'
                },
                {
                 text: 'Export Viz as jpg',
                 action:'exportJPG',
                 tooltip:'Export network viz as a jpg file',
                 iconCls:'exportJpg'
                },
              {
                 text: 'Export Viz as XGMML',
                 hidden:true,
                 action:'exportXGMML',
                 tooltip:'Export network viz as a XGMML file with Cytoscape\'s graphical attibutes', 
                 iconCls:'cytoscapeWebStart'
             }

        ]
});

