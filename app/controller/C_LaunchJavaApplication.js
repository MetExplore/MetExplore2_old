/**
 * C_LaunchJavaApplication
 */
Ext.define('MetExplore.controller.C_LaunchJavaApplication', {
    extend: 'Ext.app.Controller',

    requires: ["MetExplore.globals.Utils", "MetExplore.globals.Jobs", 'MetExplore.globals.Session'],

    config: {
        views: ["form.V_JavaApplicationParametersForm", "form.V_SBMLImportUI", "form.V_SBMLExportUI"]
    },

    init: function() {

        this.control({
            'ja_parameters_form button[action=launch]': {
                click: this.launch
            },
            'SBMLImportUI button[action=launch]': {
                click: this.launch
            },
            'SBMLExportUI button[action=launch]': {
                click: this.launch
            }
        });
    },

    launch: function(button) {

        var ctrl = this;

        var nProcesses = 0;

        var panel = button.up('panel');

        var form = panel.getForm();

        var field_values = form.getFieldValues();

        var o_new_params = {};

        for (key in field_values) {
            var value = field_values[key];
            if (Object.prototype.toString.call(value) === '[object Array]') {
                var new_value = value.join(",");
                o_new_params[key] = new_value;
            } else {
                o_new_params[key] = value;
            }
        }

        var application = panel.java_application;


        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {

                o_new_params["java_class"] = application.get("java_class");

                form.baseParams = o_new_params;

                var winMessage = Ext.create("Ext.window.MessageBox", {
                    maximizable: true,
                    resizable: true
                });

                if (application.get("long_job") == false) {
                    // MetExplore.globals.Utils.displayShortMessage("Analysis launched,
                    // the results will be displayed in a few moments", null, 2000);
                    winMessage
                        .alert("Job launched",
                            "The job's results will be displayed in a few moments");
                } else {
                    if (MetExplore.globals.Session.idUser == "" || MetExplore.globals.Session.idUser == -1) {
                        var winWarning = Ext.create("Ext.window.MessageBox", {
                            height: 300
                        });

                        winWarning.alert('Warning',
                            'You are not connected, the job will only be available during your session. ');

                        winWarning.setPosition(50);
                    }
                }

                form.submit({
                    url: "resources/src/php/application_binding/launchJavaApplication.php",
                    params: o_new_params,
                    // waitMsg : 'Processing, please wait...',
                    timeout: 600000,
                    success: function(form, action) {
                        var json = null;
                        //console.log(action)
                        try {
                            json = action.result;
                        } catch (err) {
                            Ext.MessageBox.alert('Failed', 'Server error while getting results !');
                            return;
                        }
                        // console.log("action: ", action);
                        if (json["success"] == false) {
                            Ext.MessageBox.alert('Failed', 'Server error : ' + json["message"]);

                        } else {
                            if (!Ext.isDefined(json["path"])) {
                                // The job is a long job
                                var message = json["message"];

                                var win = Ext.create("Ext.window.MessageBox", {
                                    height: 300
                                });
                                win.alert("Application message", message);

                                var sidePanel = Ext.ComponentQuery.query("sidePanel")[0];
                                var gridJobs = sidePanel.down("gridJobs");
                                gridJobs.expand();

                                Ext.getStore("S_Analyses").reload();

                            } else {

                                winMessage.close();
                                var path = json["path"];

                                MetExplore.globals.Jobs.displayResult(path, application.get("name"), null);

                            }
                        }
                    },
                    failure: function(form, action) {

                        var json = action.result;
                        Ext.MessageBox.alert('Failed', 'Server error : ' + json["message"])

                    }
                });
            }


        });
    }
});