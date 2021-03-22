/**
 * @author FC
 * @description Export menu
 */

Ext.define('MetExplore.view.menu.V_ImportMenu', {
	extend: 'Ext.menu.Menu', 
	alias: 'widget.importMenu',

	requires: ['MetExplore.view.button.V_JavaApplicationMenuItem'],


	items:	[
        {
            text: 'Import Mapping From file',
            iconCls: 'importData',
            tooltip: 'Load Mapping from saved file',
            handler: function() {
                Ext.getCmp('IDimportMapJson').getEl().down('input[type=file]').dom.click();
            }
        }, {
            xtype: 'filefield',
            hidden: true,
            name: 'fileMapping',
            buttonOnly: true,
            id: 'IDimportMapJsonButton',
            buttonConfig: {
                border: false,
                id: 'IDimportMapJson',
                text: 'From file'
            },
            listeners: {
                click: function() {
                    var file = form.down('filefield[name=fileMapping]').getEl().down('input[type=file]').dom.files[0];
                    //console.log(file);
                },
                change: function(sender) {
                    //console.log(sender);
                    var form = this.up('menu');
                    //console.log(form);
                    var file = form.down('filefield[name=fileMapping]').getEl().down('input[type=file]').dom.files[0];
                    //console.log(file);
                    var reader = new FileReader();
                    reader.onload = (function(theFile) {
                        return function(e) {
                            var result = Ext.JSON.decode(e.target.result);
                            MetExplore.app.getController('C_Map').loadJsonMenu(result);
                            //console.log(result);
                        };
                    })(file);
                    reader.readAsBinaryString(file);
                    //permet de pouvoir resaisir le meme fichier
                    form.down('filefield[name=fileMapping]').reset();
                }
            }
        },{
		xtype:'ja_menu_item',
		text: 'Import SBML',
		action: 'showcustomSBMLUI'
	}
	]
});