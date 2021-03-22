/**
 * Controls the action column of the grid that list analyses Display a new panel
 * of results
 */
Ext.define('MetExplore.controller.jobs.C_ViewLog', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'gridJobs': {
                viewlog: this.viewLog
            }
        });
    },

    /**
     * viewLog
     * @param record
     * @param rowIndex
     */
    viewLog: function(record, rowIndex) {

        var data = record.data;
        var pathLog = data.logpath;

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                if (pathLog != "") {
                    MetExplore.globals.Jobs.displayLog(pathLog, data.title);
                } else {
                    MetExplore.globals.Utils.displayShortMessage(
                        "No log for now", null, 2000);
                }
            }
        });
    }
});