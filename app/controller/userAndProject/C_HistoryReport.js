/**
 * C_HistoryReport 
 * Controls all V_HistoryReport events.
 */
Ext.define('MetExplore.controller.userAndProject.C_HistoryReport', {
    extend: 'Ext.app.Controller',

    config: {
        views: ['form.V_HistoryReport']
    },

    init: function() {
        this.control({
            'historyReport button[action=close]': {
                click: this.close
            },
            'historyReport combobox[action="selectBioSource"]': {
                change: this.changeBioSource
            }
        });

    },

    /**
     * Close history report
     * @param {} button
     */
    close: function(button) {
        var win = button.up('window');
        if (win) {
            win.close();
        }
    },

    /**
     * Change BioSource for history report
     * @param {} combo
     * @param {} newValue
     * @param {} oldValue
     * @param {} eOpts
     */
    changeBioSource: function(combo, newValue, oldValue, eOpts) {
        combo.up('historyReport').refreshReport(newValue);
    }
});