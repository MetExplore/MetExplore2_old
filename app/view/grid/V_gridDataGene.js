/**
 * gridData
 * utilise pour mapping
 */

Ext.define('MetExplore.view.grid.V_gridDataGene', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridDataGene',

    plugins: [
        {
            ptype: 'bufferedrenderer'
        }
    ],
    autoScroll: true,

    width: 600,
    height: 400,
    //resizable: true,
    //resizeHandles: 'all',
    columns: [{
        xtype: 'rownumberer',
        width: 50,
        sortable: false
    }, {
        text: 'Identified',
        width: 55,
        //xtype	 : 'checkcolumn', 	
        sortable: true,
        type: 'bool',
        filter: true,
        dataIndex: 'identified',
        hidden: true

    }, {
        text: 'Gene Identifier',
        width: 200,
        flex: 1,
        sortable: true,
        //filter: {type:'string'},
        dataIndex: 'idMap',
        editor: {
            allowBlank: false
        }
    }
        // {
        // text: 'condition',
        // dataIndex: 'map0',
        // id: 'map0',
        // editor: {
        //     allowBlank: false
        // }
        //}
    ]
});