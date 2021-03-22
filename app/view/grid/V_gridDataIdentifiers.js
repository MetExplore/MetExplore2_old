/**
 * gridData
 * utilise pour matching identifier
 */

Ext.define('MetExplore.view.grid.V_gridDataIdentifiers', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridDataIdentifiers',
    plugins: [
        {
            ptype: 'bufferedrenderer'
        }
        ],
    autoScroll: true,

    width: 800,
    height: 400,
    resizable: true,
    resizeHandles: 'all',
    sortable: false,
    columns: [
        //items: [
            {
                xtype: 'rownumberer',
                width: 50,
                sortable: false,
                menuDisabled:true

            },
            {
                text:'result_BioSourceIdentifier',
                dataIndex:'result_id',
                flex: 1,
                menuDisabled:true,
                hidden:true,

            },
            {
                text:'result_distance',
                dataIndex:'result_distance',
                flex: 1,
                menuDisabled:true,
                hidden:true,

            },
            {
                text:'result_matching type',
                dataIndex:'result_mapping',
                flex: 1,
                menuDisabled:true,
                hidden:true,

            },
            {
                text:'identifier',
                items:[{
                    xtype: 'combobox',
                    store:['dataset_name', 'inchikey', 'chebi', 'formula', 'kegg', 'inchi', 'smiles', 'pubchem', 'hmdb', 'lipidmap', 'swisslipids', 'other'],
                    dataIndex:'map0'
                }],
                menuDisabled:true,

            },


    ],


});