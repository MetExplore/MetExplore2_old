/**
 * Omics menu
 * @description create Omics menu
 *
 */

Ext.define('MetExplore.view.menu.V_OmicsMenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.omicsMenu',
    disabled: false,

    requires: ['MetExplore.view.menu.V_MappingMenu', 'MetExplore.view.menu.V_MeSHMenu'],

    items: [{
            text: 'Mapping',
            iconCls: 'map',
            id: 'mapMenu',
            //tooltip: 'Maps each lines from an input file with corresponding elements from bioSource',
            menu: {
                id:'mappingmenuid',
                xtype: 'mappingMenu'
            }
        }
        // {
        //     text: 'Load MappingDB',
        //     iconCls:'importData',
        //     handler: function() {
        //
        //         Ext.Ajax.request({
        //             url: 'resources/src/php/map/loadMappingDB.php',
        //             success: function (response, opts) {
        //
        //                 //var results = Ext.decode(response.responseText)["results"];
        //             }
        //         });
        //     }
        // },
        /* rajouter dans feature aliases */
        // {
        //     xtype: 'filefield',
        //     name : 'fileAlias',
        //     buttonOnly: true,
        //     buttonConfig: {
        //         id: 'idImportAliases',
        //         text: 'Load Aliases from json',
        //     },
        //     listeners: {
        //
        //         change : function(sender) {
        //             console.log('file');
        //             var form = this.up('menu');
        //             console.log(form.down());
        //             var file = form.down('filefield[name=fileAlias]').getEl().down('input[type=file]').dom.files[0];
        //             console.log(file);
        //             var reader = new FileReader();
        //             reader.onload = (function(theFile) {
        //                 return function(e) {
        //                     var result= Ext.JSON.decode(e.target.result);
        //                     MetExplore.app.getController('C_Map').loadJsonAliases(result);
        //                     //console.log(result);
        //                 };
        //             })(file);
        //             reader.readAsBinaryString(file);
        //         }
        //     }
        // }
    ]

});