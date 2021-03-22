/**
 * @author MC
 * S_Scale
 * Store containing the currently Scale of graph
 * model: 'MetExplore.model.Scale'
 **/
Ext.define('MetExplore.store.S_Scale', {
    extend: 'Ext.data.Store',
    model: 'MetExplore.model.Scale',
    autoload: true,
    /**
     * getStoreByGraphName
     * @param name
     * @returns {*}
     */
    getStoreByGraphName: function(name) {
        var theScale;
        this
            .each(function(scale) {
                if (scale.getGraphName() == name) {
                    theScale = scale;
                }
            });
        return theScale;
    }
});