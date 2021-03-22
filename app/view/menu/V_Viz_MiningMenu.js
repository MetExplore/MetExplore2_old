/**
 * @author Fabien Jourdan
 * @description Menu to call graph algorithms on Cytoscape network
 */

Ext.define('MetExplore.view.menu.V_Viz_MiningMenu', {
        extend: 'Ext.menu.Menu', 
        alias: 'widget.vizMiningMenu',
        
//        requires: ['MetExplore.controller.C_GraphPanel'],

        items:  [
             {
                 text: 'Highlight Subnetwork',
                 action:'highlightSubnetwork',
                 tooltip:'Hihglight sub-network based on node selection or mapped nodes',
                 iconCls:'highlightSubnetwork'
             },
              {
                 text: 'Extract Subnetwork',
                 action:'keepOnlySubnetwork',
                 tooltip:'Extract sub-network based on node selection',
                 iconCls:'subnetwork'
              }
            //  {
            //     text: 'Extract Subnetwork',action:'subnetwork',tooltip:'Extract sub-network based on node selection',iconCls:'subnetwork',
            //  },
            //  '-',
            // {
            //     text: 'Make Acyclic',action:'makeAcyclic',tooltip:'Delete edges to get an acyclic network',iconCls:'makeAcyclic',
            //  },

        ]
});