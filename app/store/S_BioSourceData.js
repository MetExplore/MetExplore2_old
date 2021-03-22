/**
 * S_BioSourceData
 * model : MetExplore.model.BioSourceData
 * supplementary data from tab file project metexplore-data
 * table biosource_data
 */

Ext.define('MetExplore.store.S_BioSourceData',{
	extend : 'Ext.data.Store',
	model: 'MetExplore.model.BioSourceData',
	proxy: {
		type: 'ajax',
		url: 'resources/src/php/dataNetwork/biosource_data.php',
        actionMethods : {read: "GET"},
        extraParams: {
            idBioSource: "",
            idUser:"",
            object:""

        },
        reader: {
            type: 'json',
            root: 'results',
            successProperty: 'success'
        }
	},

    autoLoad: false

});
