Ext.define('MetExplore.view.grid.V_gridFilter', {
    extend: 'Ext.grid.Panel',
    //requires: ['MetExplore.globals.Jobs'],
    alias: 'widget.gridFilter',
    autoScroll: false,
    disableSelection: true,

    store: 'S_Filter',

    dockedItems: [{
        xtype: 'toolbar',
        items: [{
            iconCls: "x-grid-center-icon del",
            text: 'Remove All',
            action: 'delAllFilters'
        }]
    }],

    columns: [{
        xtype: 'actioncolumn',
        text: "",
        width: 20,
        items: [{
            iconCls: "x-grid-center-icon del",
            tooltip: 'Delete filter',
            handler: function(grid, rowIndex, colIndex, item, e, record, row) {

                // Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this filter?',
                //     function(button) {
                //         if (button == "yes") {

                            grid.up('panel').fireEvent("deletefilter", record, rowIndex);
            //             }
            //
            //         });
            }
        }]
    }, {
        text: "Object",
        dataIndex: "object",
        //minWidth: 100,
        flex: 1
    },
    //     {
    //     text: "Type",
    //     dataIndex: "type",
    //     //minWidth: 100,
    //     flex: 1
    // },
    //         {
    //         text: "Value",
    //         dataIndex: "value",
    //         //maxWidth: 120,
    //         flex: 1
    //     },
        {
        xtype: 'actioncolumn',
        header: 'Values',
        menuText: 'info',
        action: 'seeInfos',
        dataIndex: 'seeInfos',
        width: 20,
        sortable: false,
        items: [{
            icon: './resources/icons/info.svg',
            region: 'center',
            tooltip: 'See more information on this Filter',
            // handler: function(grid, rowIndex, colIndex, item, e, record, row) {
            //     grid.up('panel').fireEvent("seeInfos", record, rowIndex);
            // }
        }]

    },
    //     {
    //     text: "Ids",
    //     dataIndex: "ids",
    //     maxWidth: 120,
    //     flex: 1
    // }
    ]

});