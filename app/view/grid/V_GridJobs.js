Ext.define('MetExplore.view.grid.V_GridJobs', {
    extend: 'Ext.grid.Panel',
    requires: ['MetExplore.globals.Jobs'],
    alias: 'widget.gridJobs',
    autoScroll: false,
    disableSelection: true,

    store: 'S_Analyses',

    title: "List of analyses",

    /**
     * Event for the view action column
     */
    bubbleEvents: ['viewresult', 'viewjob', 'deleteresult'],

    dockedItems: [{
        xtype: 'toolbar',
        items: [{
            iconCls: 'refresh',
            text: 'Reload',
            action: 'reloadJobs'
        }]
    }],

    columns: [{
        text: "Status",
        dataIndex: "status",
        width: 40,
        renderer: function(currentCellValue, metadata, record,
            rowIndex, colIndex, store, view) {

            var qtip = "";

            if (currentCellValue == "error") {
                qtip = "Finished with error";
                metadata.tdAttr = 'style="background-color:red !important;" data-qtip="' + qtip + '"';
            } else if (currentCellValue == "log") {
                qtip = "Being processed";
                metadata.tdAttr = 'style="background-color:orange !important;" data-qtip="' + qtip + '"';
            } else if (currentCellValue == "success") {
                qtip = "Finished with success";
                metadata.tdAttr = 'style="background-color:green !important;" data-qtip="' + qtip + '"';
            } else if (currentCellValue == "queue") {
                qtip = "In the data center cluster queue";
                metadata.tdAttr = 'style="background-color:lightgrey !important;" data-qtip="' + qtip + '"';
            }

            return "";
        }
    }, {
        xtype: 'actioncolumn',
        text: "Result",
        width: 45,
        align: 'center',
        items: [{
            getClass: function(val, meta, record) {

                if (record.get('resultType') === 'biosource' && record.get('status') !== 'error') {
                    return 'load';
                } else if (record.get('resultType') === 'file' && record.get('status') !== 'error') {
                    return 'download';
                } else if (record.get('status') !== 'error') {
                    return 'open';
                } else {
                    return 'error';
                }
            },
            getTip: function(val, meta, record) {
                if (record.get('status') === 'log' || record.get('status') === 'queue') {
                    return 'No result available yet';
                } else if (record.get('resultType') === 'biosource' && record.get('status') !== 'error') {
                    return 'Load this biosource';
                } else if (record.get('resultType') === 'file' && record.get('status') !== 'error') {
                    return 'Download File';
                } else if (record.get('status') !== 'error') {
                    return 'View results';
                } else {
                    return 'View error file';
                }
            },
            isDisabled: function(view, rowIndex, colIndex, item, record) {
                return record.get('status') === 'log' || record.get('status') === 'queue';
            },
            handler: function(grid, rowIndex, colIndex, item, e, record, row) {

                /**
                 * Controlled in C_ViewResult
                 */

                grid.up('panel').fireEvent("viewresult", record, rowIndex);


            }
        }]
    }, {
        xtype: 'actioncolumn',
        text: "Delete",
        width: 45,
        items: [{
            iconCls: "x-grid-center-icon del",
            tooltip: 'Delete analysis',
            isDisabled: function(view, rowIndex, colIndex, item, record) {
                return record.get('status') === 'log' || record.get('status') === 'queue';
            },
            handler: function(grid, rowIndex, colIndex, item, e, record, row) {

                Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this analysis and all the related results?',
                    function(button) {
                        if (button == "yes") {
                            /**
                             * Controlled in C_ViewResult
                             */
                            grid.up('panel').fireEvent("deleteresult", record, rowIndex);
                        }

                    });
            }
        }]
    }, {
        text: "Title",
        dataIndex: "title",
        minWidth: 100,
        flex: 1
    }, {
        text: "Launch Date",
        dataIndex: "date",
        maxWidth: 120,
        flex: 1
    }, {
        text: "Info",
        dataIndex: "log",
        flex: 1,
        renderer: function(value, metaData, record) {

            var qtip = record.data.log;

            qtip = qtip.replace(/\n/g, "</br>");
            qtip = qtip.replace(/"/g, '&quot;');

            metaData.tdAttr = 'data-qtip="' + qtip + '"';

            return value;

        }
    }, {
        xtype: 'actioncolumn',
        text: "Log",
        width: 45,
        items: [{
            icon: './resources/icons/info.svg',
            region: 'center',
            tooltip: 'See log information',
            handler: function(grid, rowIndex, colIndex, item, e, record, row) {

                /**
                 * Controlled in C_ViewLog
                 */
                grid.up('panel').fireEvent("viewlog", record, rowIndex);
            }
        }]
    }]

});