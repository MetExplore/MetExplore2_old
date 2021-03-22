/**
 * S_CompartmentInBioSource
 * model : MetExplore.model.CompartmentInBioSource
 */
Ext.define('MetExplore.store.S_CompartmentInBioSource', {
    extend: 'Ext.data.Store',
    model: 'MetExplore.model.CompartmentInBioSource',
    autoLoad: false,

    proxy: {
        type: 'ajax',
        url: 'resources/src/php/datacompartmentInBioSource.php',
        extraParams: {
            idBioSource: "",
            req: "R_Compart",
            getfake: false,
            id: ""
        },
        reader: {
            type: 'json'
        }
    },
    /**
     *
     * @param id
     * @returns {*}
     */
    getStoreByIdentifier: function(id) {
        var theCompartment;
        this.each(function(comp) {
            if (comp.getIdentifier() == id) {
                theCompartment = comp;
            }
        });
        return theCompartment;
    },
    /**
     *
     * @param id
     * @returns {*}
     */
    getStoreByIdentifierFullStore: function(id) {
        var theCompartment;

        if (this.snapshot != undefined) {
            this.snapshot.each(function(comp) {
                if (comp.getIdentifier() == id) {
                    theCompartment = comp;
                }
            });
        } else
            theCompartment = this.getStoreByIdentifier(id);
        return theCompartment;
    },

    /**
     * Loads the compartment store to include the FakeCompartment
     * @param callback
     */
    loadWithFake_Compartment: function(callback) {

        this.getProxy().setExtraParam("getfake", true);

        this.load(callback);

        this.getProxy().setExtraParam("getfake", false);
        // },

        // listeners:{
        // 	'load' : function(store, records) {
        // 		Ext.each(records,function(rec){
        // 			Ext.getStore("S_ModelIdentifier").add({'dbIdentifier':rec.get('identifier')});
        // 		})
        // 	}
    }
});