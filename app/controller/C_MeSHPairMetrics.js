/**
 *   PairMetrics
 */
Ext.define('MetExplore.controller.C_MeSHPairMetrics', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session'],
    config: {
        views: ['form.V_MeSHPairMetricsUI']
    },

    init: function() {
        var me = this;
        this.control({
            'meshpairmetricsUI [action=launch]': {
                click: me.launch
            }
        });
    },

    /*
     * Launch MeSH2Metab
     * @button {} button
     */
    launch: function(button, ev) {

        console.log('launch');

        var panel = Ext.getCmp('tabPanel').getActiveTab();
        var myMask = new Ext.LoadMask({
            target: panel, // Here myPanel is the component you wish to mask
            msg: "Please wait..."
        });

        myMask.show();
        this.mesh(myMask);
        button.disable();
    },

    /*
     * Launch mesh analysis
     * @button {} button
     */
    mesh: function(myMask) {

        Ext.suspendLayouts();
        var me = this;
        console.log("mesh");
        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                var panel = Ext.getCmp('tabPanel').getActiveTab();
                var title = panel.query('textfield[name=analysis_title]')[0].getRawValue();
                var meshTerm = panel.query('textfield[name=analysis_term]')[0].getRawValue();

                console.log("isSessionExpired");
                me.getParameters(title, meshTerm, function(param) {
                    Ext.Ajax.request({
                        url: 'resources/src/php/application_binding/launchMeSHPairMetrics.php',
                        params: param,
                        timeout: 2200000,
                        success: function(form, action) {
                            var json = null;
                            if (myMask) myMask.hide();

                            try {
                                json = Ext.decode(form.responseText);
                            } catch (err) {

                                Ext.MessageBox.alert('Failed', 'Server error while getting results !')
                                return;
                            }
                            if (json["success"] == false) {
                                Ext.MessageBox.alert('Failed', 'Server error : ' + json["message"])
                                return;
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

                                }
                            }
                        },
                        failure: function(form, action) {
                            if (myMask) myMask.hide();
                        }
                    });
                });
            }
        });

        Ext.resumeLayouts(true);
    },

    /*
     * get parameter to page rank & chei rank ajax request
     * @button {} button
     */
    getParameters: function(title, meshTerm, func) {
        var ctrl = this;

        console.log("getParameters");
        var winMessage = Ext.create("Ext.window.MessageBox", {
            maximizable: true,
            resizable: true
        });

        if (MetExplore.globals.Session.idUser == "" || MetExplore.globals.Session.idUser == -1) {
            var winWarning = Ext.create("Ext.window.MessageBox", {
                height: 300
            });

            winWarning.alert('Warning',
                'You are not connected, the job will only be available during your session. ');

            winWarning.setPosition(50);
        }

        var param = {
            meshTerm: meshTerm,
            title: title
        };

        func(param);
    }
});