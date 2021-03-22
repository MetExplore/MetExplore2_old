/**
 * S_UserMenu
 * Stores the current menu. Liste des menu visibles ;
 * model: 'MetExplore.model.UserMenu'
 */

Ext.define('MetExplore.store.S_UserMenu',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.UserMenu',
	id: 'currentMenu',
	proxy: {
		type: 'ajax',
		url: 'resources/src/php/dataUserMenu.php',
		extraParams:{idUser:-1},
		reader: {
			type: 'json'
		}
	},
	loaded:false,
	data: [{"idMenu": -1, "visible": 'undefined'}]
});
