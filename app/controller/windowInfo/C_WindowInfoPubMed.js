/**
 * C_windowInfoPubMed
 */
Ext.define('MetExplore.controller.windowInfo.C_WindowInfoPubMed', {
    extend: 'Ext.app.Controller',

    config: {
        views: ['window.V_WindowInfoPubMed']
    },
    init: function() {
        var me = this;
        //console.log('init');
        this.control({
            'windowInfoPubMed': {
                beforeshow: this.getImage,
                resize: function() {
                    if (window.dateChart)
                        window.dateChart.reflow();
                }
            }
        });

    },


    getImage: function(window) {
        //do stuff
    },

    updateLayout: function(panel) {

    }
});