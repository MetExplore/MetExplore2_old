/**
 * gridDelReaction
 */
 Ext.define('MetExplore.view.grid.V_gridDelReaction',{
   	extend:'Ext.grid.Panel',
       stateful: true,
       multiSelect: true,
       store :'S_DelReaction',
       alias: 'widget.gridDelReaction',
       columns: [
           {
               text     : 'id',
               hidden	 : true,
               flex     : 1,
               sortable : false,
               dataIndex: 'id'
           },
           {
               text     : 'name',
               flex     : 1,
               sortable : false,
               dataIndex: 'name'
           },
           {
               text     : 'dbIdentifier',
               width    : 250,
               sortable : true,
               dataIndex: 'dbIdentifier'
           }
        ],
       height: 350,
       width: 400
 
 });
