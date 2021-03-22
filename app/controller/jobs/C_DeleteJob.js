/**
 * Controls the action column of the grid that removes a result
 */
Ext.define('MetExplore.controller.jobs.C_DeleteJob', {
    extend: 'Ext.app.Controller',

    requires: ['MetExplore.globals.Session'],

    init: function() {
        this.control({
            'gridJobs': {
                deleteresult: this.deleteResult
            }
        });

    },

    /**
     * deleteResult
     * @param record
     * @param rowIndex
     */
    deleteResult: function(record, rowIndex) {

        var data = record.store.getAt(rowIndex).data;

        var session = data["session"];

        var id = data["id"];

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                Ext.Ajax.request({
                    url: 'resources/src/php/application_binding/deleteJob.php',
                    params: {
                        "stored_in_session": session,
                        "dir_id": id
                    },
                    waitMsg: 'Stop and delete analysis...',
                    success: function(response, o) {

                        var json = null;

                        try {
                            json = Ext.decode(response.responseText);
                        } catch (err) {
                            Ext.MessageBox.alert('Ajax error',
                                'Error while deleting analysis. Error: ' +
                                err);
                        }

                        if (json["success"] == true) {

                            Ext.ComponentQuery.query("gridJobs")[0].down('button[action="reloadJobs"]').fireEvent("click");

                            var store = Ext.getStore('S_MappingInfo');

                            var rec = store.findRecord('id', "M" + record.get('id'));
                            if (rec) {
                                var object = rec.get('object');
                                MetExplore.app.getController('C_BioSource').delMappingRecord(object, rec);
                            }

                        } else {
                            Ext.Msg.alert("Failed", json["message"]);
                        }

                    },
                    failure: function(fp, o) {
                        Ext.Msg.alert("Failure",
                            "Failure while deleting analysis");
                    }

                });
            }
        });
    }
});