/**
 * S_TreeUsers
 * @extend Ext.data.TreeStore
  */
Ext.define('MetExplore.store.S_TreeUsers',{
		extend : 'Ext.data.TreeStore',
        //model: 'MetExplore.model.User',
        autoLoad: false,
        leaf:false,

        proxy: {
            type: 'ajax',
            url: 'resources/src/php/datauser.php',
            extraParams: {idUser:"119"},
            reader: {type: 'json'}
        }
    });
  