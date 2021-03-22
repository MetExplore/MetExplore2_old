/**
 * MetExplore.globals.BioSource
 */
Ext.define("MetExplore.globals.BioSource", {
    singleton: true,
    //lorsqu'on modifie la liste il faut aussi la modifier dans php
    statidmetab:['bigg','chebi','hmdb','inchikey','kegg','lipidmaps','biocyc','metanetx.chemical','pubchem','seed','smiles'],
    statidgene:['ensembl','ncbigene','biocyc'],

    /**
     * canUserEdit
     * @param iduser
     * @param idBiosource
     */
    canUserEdit: function(iduser, idBiosource) {
        MetExplore.globals.Session.checkSessionUserId(function checkrights(
            validSession
        ) {
            if (validSession) {
                Ext.Ajax.request({
                    url: "resources/src/php/userAndProject/checkRightsOnEditBioSource.php",
                    method: "GET",
                    timeout: 60000,
                    params: {
                        idUser: iduser,
                        idBioSource: idBiosource,
                    },
                    success: function(response, opts) {
                        var json = Ext.decode(response.responseText);

                        var grids = Ext.getCmp("networkData").items.items;

                        if (json.success) {
                            grids.forEach(function disableEdition(grid) {
                                grid.fireEvent("modifyeditability", grid, json.hasRights);
                            });
                            var addElbtn = Ext.ComponentQuery.query(
                                "curationPanel button[action=addEl]"
                            )[0];
                            if (addElbtn) addElbtn.setDisabled(!json.hasRights);
                        } else {
                            Ext.MessageBox.alert(
                                "Mysql Error",
                                "Error in the Mysql request."
                            );

                            grids.forEach(function disableEdition(grid) {
                                grid.fireEvent("modifyeditability", grid, false);
                            });
                            var addElbtn = Ext.ComponentQuery.query(
                                "curationPanel button[action=addEl]"
                            )[0];
                            if (addElbtn) addElbtn.setDisabled(false);
                        }
                    },
                    failure: function(response, opts) {
                        if (response.timedout) {
                            Ext.MessageBox.alert("PhP Error", "PhP request was timedout");
                        } else {
                            Ext.MessageBox.alert(
                                "Server Error",
                                "Server-side failure with status code " + response.status
                            );
                        }
                    },
                });
            }
        });
    },
    /**
     * userCanDuplicate
     * @param bsrecord
     * @returns {boolean}
     */
    userCanDuplicate: function(bsrecord) {
        return true;
    },

    /**
     * Delete a BioSource
     * @param {} values : the BioSources to delete
     * @param {} jsonModif : params to send to PHP script
     * @param {} myMask
     * @param {} win
     */
    doDeleteBioSources: function(values, jsonModif, myMask, winArray) {
        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                Ext.Ajax.request({
                    url: "resources/src/php/modifNetwork/deleteBiosourceWithChecks.php",
                    timeout: 60000,
                    params: {
                        functionParam: jsonModif
                    },
                    reader: {
                        type: "json",
                        successProperty: "success",
                    },
                    success: function(response, opts) {
                        var responseText = Ext.decode(response.responseText);

                        Ext.Msg.alert("Success", responseText.message, function(btnid) {
                            var refreshBtn = Ext.ComponentQuery.query(
                                "button[action=refresh]"
                            )[0];

                            refreshBtn.fireEvent("click", refreshBtn);
                        });

                        for (var it = 0; it < values["idBioSources"].length; it++) {
                            if (
                                MetExplore.globals.Session.idBioSource ==
                                values["idBioSources"][it].idBiosource
                            ) {
                                var ctrl = MetExplore.app.getController("C_BioSource");

                                ctrl.unselectBioSource();
                            }
                        }

                        if (myMask) myMask.hide();

                        if (winArray) {
                            winArray.forEach(function(win) {
                                if (win) win.close();
                            });
                        }
                    },
                    failure: function(response, opts) {
                        if (myMask) myMask.hide();
                        if (response.status !== 200) {
                            Ext.Msg.alert(
                                "Failed",
                                "Server Error. Status: " + response.status
                            );
                        } else {
                            var responseText = Ext.decode(response.responseText);
                            Ext.Msg.alert("Failed", responseText.message);
                        }
                    },
                });
            }
        });
    },

    /**
     * Duplicate a BioSource
     * @param {} button
     * @param {} record: record containing the BioSource
     */
    duplicateBS: function(button, record) {
        if (!this.userCanDuplicate(record)) {
            Ext.Msg.alert(
                "Permission Denied",
                "Your rights on biosource " +
                record.get("NomComplet") +
                " are not high enough to allow duplication."
            );
        } else {
            /**
             * We launch the real duplication afyer the success of the biosourceSizeExccedsLimits function
             */
            this.biosourceSizeExccedsLimits(button, record);
        }
    },

    /**
     * Duplicate a BioSource
     * @param {} record: record containing the BioSource
     */
    biosourceSizeExccedsLimits: function(button, record) {
        var me = this;

        var id = record.get("id");

        Ext.Ajax.request({
            url: "resources/src/php/dataBiosourceInfo.php",
            method: "POST",
            params: {
                idBioSource: id
            },
            success: function(response, opts) {
                var json = Ext.decode(response.responseText);

                if (json["success"] == false) {
                    Ext.MessageBox.alert(
                        "Failed",
                        "PHP Error: Impossible to calculate Biosource size. Duplication is therefore impossible."
                    );
                } else if (json.results.nbReactions > 10000) {
                    Ext.MessageBox.alert(
                        "Failed",
                        "The size of this Biosource exceeds the maximum size allowed for duplication (10 000 reactions).\nPlease use the 'Export SBML' and 'Import SBML' features to copy this Biosource."
                    );
                } else {
                    // callback(button, record);
                    me.realDuplication(button, record);
                }
            },
            failure: function() {
                Ext.MessageBox.alert(
                    "Failed",
                    "PHP Error: Impossible to calculate Biosource size. Duplication is therefore impossible."
                );
            },
        });
    },

    /**
     * realDuplication
     * @param button
     * @param record
     */
    realDuplication: function(button, record) {
        var bs = {
            analysis_title: "Copy Biosource",
            java_class: "fr.inrae.toulouse.metexplore.metexplorejava.apps.gui.Admin.CopyBioSource",
            idUser: MetExplore.globals.Session.idUser,
            mail: MetExplore.globals.Session.mailUser,
            idBioSource: record.get("id"),
        };

        Ext.MessageBox.confirm(
            "Duplicate BioSource",
            'Duplicate BioSource "' + record.get("NomComplet") + '" ?',
            function(btn) {
                if (btn == "yes") {
                    MetExplore.globals.Session.isSessionExpired(function(isExpired) {
                        if (!isExpired) {
                            Ext.Ajax.request({
                                url: "resources/src/php/application_binding/launchJavaApplication.php",
                                method: "POST",
                                params: bs,
                                success: function(response, opts) {
                                    var json = Ext.decode(response.responseText);

                                    if (json["success"] == false) {
                                        Ext.Msg.alert(
                                            "Failed",
                                            "Problem in getting results from the server (success = false)"
                                        );
                                    } else {
                                        var message = json["message"];

                                        var win = Ext.create("Ext.window.MessageBox", {
                                            height: 300,
                                        });

                                        win.show({
                                            title: "Application message",
                                            msg: message,
                                        });

                                        var sidePanel = Ext.ComponentQuery.query("sidePanel")[0];
                                        var gridJobs = sidePanel.down("gridJobs");
                                        gridJobs.expand();

                                        Ext.getStore("S_Analyses").reload();

                                        if (button.up("windowInfoBioSource")) {
                                            button.up("windowInfoBioSource").close();
                                        }
                                    }
                                },
                                failure: function(response, opts) {
                                    Ext.MessageBox.alert(
                                        "Server-side failure with status code " + response.status
                                    );
                                },
                            });
                        }
                    });
                }
            }
        );
    },
    /**
     * add supplementary data from database table biosource_data
     */
    addData: function() {
        var store = Ext.getStore("S_BioSourceData");
    },
});