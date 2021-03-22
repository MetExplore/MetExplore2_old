/**
 * C_GridHistory Controls history actions
 */
Ext.define('MetExplore.controller.userAndProject.C_GridHistory', {
    extend: 'Ext.app.Controller',
    /*
    	config : {
    		views : ['grid.V_GridHistory'],
    		doUpdate : false
    		// Do automatic update on change dates values if true, disable grid
    		// refreshes on datefield change events and some checks else
    	},

    	requires : ['MetExplore.view.grid.V_GridDetailsHistory',
    			'MetExplore.view.form.V_HistoryReport'],
    */
    init: function() {
        this.control({
            'gridHistory': {
                selectionchange: this.selectionChanged
            },
            'gridHistory button[action=historyPersonal]': {
                click: this.showPersonalHistory
            },
            'gridHistory button[action=historyAll]': {
                click: this.showAllHistory
            },
            'gridHistory button[action=refresh]': {
                click: this.refreshHistory
            },
            'gridHistory actioncolumn[action="seeDetailsHistory"]': {
                click: this.openDetailsHistory
            },
            'gridHistory datefield[name="historyFrom"]': {
                change: this.dateFromChange
            },
            'gridHistory datefield[name="historyTo"]': {
                change: this.dateToChange
            },
            'gridHistory button[action="backward-date"]': {
                click: this.backwardDate
            },
            'gridHistory button[action="forward-date"]': {
                click: this.forwardDate
            },
            'gridHistory button[action="show-report"]': {
                click: this.showReport
            },
            'gridHistory button[action="delete"]': {
                click: this.deleteHistory
            }
        });
    },

    /**
     * Selection change on grid event
     * 
     * @param {}
     *            model
     * @param {}
     *            selected
     * @param {}
     *            eOpts
     */
    selectionChanged: function(model, selected, eOpts) {
        if (selected.length > 0) {
            model.views[0].panel.down('button[action="delete"]')
                .setDisabled(false);
        } else {
            model.views[0].panel.down('button[action="delete"]')
                .setDisabled(true);
        }
    },

    /**
     * Click on the delete button
     * 
     * @param {}
     *            button
     */
    deleteHistory: function(button) {
        var ctrl = this;
        // Get selected history items:
        var selection = button.up('gridHistory').getSelectionModel()
            .getSelection();
        var toDelete = []; // List of items id to delete
        var storeBS = Ext.getStore('S_MyBioSource'); // Store of private
        // BioSources
        var noAccess = false; // Becomes true if at least one item is not
        // deletable by the user
        // Check items, and add their id to the delete list if user can delete
        // them:
        for (var it = 0; it < selection.length; it++) {
            var idBS = selection[it].get('idBioSource');
            var index = storeBS.find('id', idBS);
            if (index > -1 && storeBS.getAt(index).get('access') == "owner") {
                toDelete.push(selection[it].get('id'));
            } else {
                noAccess = true;
            }
        }
        if (noAccess) {
            Ext.MessageBox
                .alert('Access denied',
                    'You cannot delete items if you are not an owner of the linked BioSource!')
        } else {

            Ext.MessageBox.confirm('Delete items', 'Confirm deletion of selected items?', function(btn) {
                if (btn == "yes") {
                    MetExplore.globals.Session.isSessionExpired(function(isExpired) {
                        if (!isExpired) {
                            // Delete items:
                            Ext.Ajax.request({
                                url: 'resources/src/php/userAndProject/deleteHistoryItems.php',
                                params: {
                                    items: Ext.encode(toDelete)
                                },
                                failure: function(response, opts) {
                                    Ext.MessageBox
                                        .alert('Ajax error',
                                            'delete history items failed: Ajax error!');
                                },
                                success: function(response, opts) {
                                    var repJson = null;

                                    try {
                                        repJson = Ext
                                            .decode(response.responseText);
                                    } catch (exception) {
                                        Ext.MessageBox
                                            .alert('Ajax error',
                                                'delete history items failed: JSON incorrect!');
                                    }

                                    if (repJson != null && repJson['success']) {
                                        ctrl.refreshHistory(button);
                                    } else if (repJson != null) {
                                        Ext.MessageBox.alert(
                                            'delete history items failed!',
                                            repJson['message']);
                                    } else {
                                        Ext.MessageBox
                                            .alert(
                                                'delete history items failed!',
                                                'Please contact metexplore@toulouse.inra.fr. \nError message: ');
                                    }

                                }
                            });
                        }
                    });
                }
            });
        }
    },

    /**
     * Click on backward button: see older items
     * 
     * @param {}
     *            button: button clicked
     */
    backwardDate: function(button) {
        this.doUpdate = false;
        var gridHistory = button.up("gridHistory");
        var from = gridHistory.down('datefield[name="historyFrom"]').value;
        var to = gridHistory.down('datefield[name="historyTo"]').value;
        var interval = MetExplore.globals.Utils.daysBetween(from, to);
        to = new Date(from);
        to.setDate(to.getDate() - 1);
        from.setDate(from.getDate() - interval - 1);
        gridHistory.down('datefield[name="historyFrom"]').setValue(from);
        gridHistory.down('datefield[name="historyTo"]').setValue(to);
        // Update project History if project is opened:
        if (MetExplore.globals.Session.idProject != -1) {
            var gridPHistory = Ext.ComponentQuery
                .query("projectPanel gridHistory")[0];
            gridPHistory.down('datefield[name="historyFrom"]').setValue(from);
            gridPHistory.down('datefield[name="historyTo"]').setValue(to);
        }
        this.refreshHistory(button);
        this.doUpdate = true;
    },

    /**
     * Click on forward button: see newer items
     * 
     * @param {}
     *            button
     */
    forwardDate: function(button) {
        this.doUpdate = false;
        var gridHistory = button.up("gridHistory");
        var from = gridHistory.down('datefield[name="historyFrom"]').value;
        var to = gridHistory.down('datefield[name="historyTo"]').value;
        var interval = MetExplore.globals.Utils.daysBetween(from, to);
        from = new Date(to);
        from.setDate(from.getDate() + 1);
        to.setDate(to.getDate() + interval + 1);
        gridHistory.down('datefield[name="historyTo"]').setValue(to);
        gridHistory.down('datefield[name="historyFrom"]').setValue(from);
        // Update project History if project is opened:
        if (MetExplore.globals.Session.idProject != -1) {
            var gridPHistory = Ext.ComponentQuery
                .query("projectPanel gridHistory")[0];
            gridPHistory.down('datefield[name="historyFrom"]').setValue(from);
            gridPHistory.down('datefield[name="historyTo"]').setValue(to);
        }
        this.refreshHistory(button);
        this.doUpdate = true;
    },

    /**
     * The date from which history is shown changed
     * 
     * @param {}
     *            component: the datefield component
     * @param {}
     *            newValue: the new value
     * @param {}
     *            oldValue: the old value
     * @param {}
     *            eOpts
     */
    dateFromChange: function(component, newValue, oldValue, eOpts) {
        var gridHist = component.up('gridHistory');
        var halt = false; // If becomes true, do not execute the rest of the
        // function
        var valueTo = gridHist.down('datefield[name="historyTo"]').value; // Value
        // of
        // the
        // "to"
        // date
        if (valueTo != undefined && this.doUpdate) { // Check if the "from"
            // value keeps lower
            // than the "to" value
            // (do not check that if
            // doUpdate is false)
            var valueNew = new Date(Math.min(newValue, valueTo)); // Normally,
            // newValue
            // is equals
            // to
            // valueNew,
            // else we
            // can
            // change it
            // to the
            // value of
            // "to"
            // field
            // (valueTo)
            if (MetExplore.globals.Utils.formatDate(valueNew) != MetExplore.globals.Utils
                .formatDate(newValue)) {
                component.setValue(valueNew);
                halt = true;
            }
        }
        if (!halt) {
            switch (gridHist.type) {
                case "user": // The User panel instance
                    var gridProjectHist = Ext.ComponentQuery
                        .query("projectPanel gridHistory")[0]; // The
                    // Project
                    // panel
                    // instance
                    if (gridProjectHist != undefined) { // If none project is
                        // opened, the value is
                        // undefined
                        var dateFromProject = gridHist
                            .down('datefield[name="historyFrom"]'); // The
                        // datefield
                        // of
                        // the
                        // "from"
                        // value
                        if (dateFromProject.getValue() != newValue) {
                            dateFromProject.setValue(newValue);
                        }
                    }
                    if (this.doUpdate) {
                        this.refreshHistory(component);
                    }
                    break;
                case "project": // The project panel instance
                    var gridUserHist = Ext.ComponentQuery
                        .query("userPanel gridHistory")[0]; // The User panel
                    // instance
                    if (gridUserHist != undefined) { // If none project is
                        // opened, the value is
                        // undefined
                        var dateFromProject = gridHist
                            .down('datefield[name="historyFrom"]'); // The
                        // datefield
                        // of the
                        // "from"
                        // value
                        if (dateFromProject.getValue() != newValue) {
                            dateFromProject.setValue(newValue);
                        }
                    }
                    break;;
            }
        }
    },

    /**
     * The date from which history is shown changed
     * 
     * @param {}
     *            component: the datefield component
     * @param {}
     *            newValue: the new value
     * @param {}
     *            oldValue: the old value
     * @param {}
     *            eOpts
     */
    dateToChange: function(component, newValue, oldBalue, eOpts) {
        // See dateFromChange for comments, this function is quite similar!
        var gridHist = component.up('gridHistory');
        var halt = false; // If becomes true, do not execute the rest of the
        // function
        var valueFrom = gridHist.down('datefield[name="historyFrom"]').value;
        if (valueFrom != undefined && this.doUpdate) {
            var valueNew = new Date(Math.max(newValue, valueFrom));
            if (MetExplore.globals.Utils.formatDate(valueNew) != MetExplore.globals.Utils
                .formatDate(newValue)) {
                component.setValue(valueNew);
                halt = true;
            }
        }
        if (!halt) {
            var now = new Date();
            if (MetExplore.globals.Utils.daysBetween(newValue, now) <= 0) {
                component.up('gridHistory')
                    .down('button[action="forward-date"]').disable();
            } else {
                component.up('gridHistory')
                    .down('button[action="forward-date"]').enable();
            }
            if (this.doUpdate) {
                this.refreshHistory(component);
            }

            // switch (gridHist.type) {
            // case "user" :
            // var gridProjectHist = Ext.ComponentQuery
            // .query("projectPanel gridHistory")[0];
            // if (gridProjectHist != undefined) {
            // var dateToProject = gridProjectHist
            // .down('datefield[name="historyTo"]');
            // if (dateToProject.getValue() != newValue) {
            // dateToProject.setValue(newValue);
            // }
            // }
            // if (this.doUpdate) {
            // this.refreshHistory(component);
            // }
            // break;
            // ;
            // case "project" :
            // var gridUserHist = Ext.ComponentQuery
            // .query("userPanel gridHistory")[0];
            // if (gridUserHist != undefined) {
            // var dateToProject = gridUserHist
            // .down('datefield[name="historyTo"]');
            // if (dateToProject.getValue() != newValue) {
            // dateToProject.setValue(newValue);
            // }
            // }
            // break;
            // ;
            // }
        }
    },

    /**
     * Show the details of an item history, when we click to the "..." icon
     * 
     * @param {}
     *            grid : the gridHistory instance
     * @param {}
     *            cell : the cell clicked
     * @param {}
     *            rowIndex : the row index of the grid
     */
    openDetailsHistory: function(grid, cell, rowIndex) {
        var record = grid.getStore().getAt(rowIndex);
        var fileDetails = record.get('fileDetails');
        if (fileDetails != "") {
            Ext.Ajax.request({
                url: 'resources/src/php/userAndProject/getDetailsHistory.php',
                params: {
                    idHistory: record.get('id'),
                    file: fileDetails
                    // The file containing details on the server
                },
                failure: function(response, opts) {
                    Ext.MessageBox.alert('Ajax error',
                        'get history details failed: Ajax error!');
                },
                success: function(response, opts) {
                    var repJson = null;

                    try {
                        repJson = Ext.decode(response.responseText);
                    } catch (exception) {
                        Ext.MessageBox.alert('Ajax error',
                            'get history details failed: JSON incorrect!');
                    }

                    if (repJson != null && repJson['success']) {
                        var win = Ext.create('Ext.window.Window', {
                            title: "History details",
                            width: 600,
                            height: 200,
                            layout: 'fit',
                            items: [{
                                xtype: 'label',
                                text: repJson['data'][0]["action"] +
                                    ":"
                            }, {
                                xtype: "gridDetailsHistory",
                                fields: repJson['fields'],
                                data: repJson['data'],
                                border: false
                            }],
                            bbar: ['->', {
                                xtype: 'button',
                                text: 'Close',
                                action: 'close',
                                handler: function(button) {
                                    button.up('window').close();
                                }
                            }]
                        });
                        win.show();
                        win.focus();
                    } else {
                        Ext.MessageBox.alert('get history details failed!',
                            'Please contact metexplore@toulouse.inra.fr. \nError message: ' +
                            repJson['message']);
                    }

                },
                scope: this
            });
        }
    },

    /**
     * Refresh the history
     * 
     * @param {}
     *            button: button clicked
     */
    refreshHistory: function(button) {
        var gridHistory = button.up('gridHistory');

        MetExplore.globals.Session.isSessionExpired(function(isExpired) {
            if (!isExpired) {
                MetExplore.globals.History.updateHistory(gridHistory);
            }
        });


    },

    /**
     * Show only personal history
     * 
     * @param {}
     *            button: button clicked
     */
    showPersonalHistory: function(button) {
        var idUser = MetExplore.globals.Session.idUser;
        button.up('gridHistory').getStore().filter('idUser', idUser);
        button.toggle(true);
    },

    /**
     * Show history for all users
     * 
     * @param {}
     *            button: button clicked
     */
    showAllHistory: function(button) {
        button.up('gridHistory').getStore().clearFilter();
        button.toggle(true);
    },

    /**
     * Show history report
     * 
     * @param {}
     *            button
     */
    showReport: function(button) {
        var store = button.up('gridHistory').getStore();
        var entries = {};
        var biosources = [{
            "id": -1,
            "name": "All"
        }];
        store.each(function(rec) {
            var idBioSource = rec.get('idBioSource');
            if (entries[idBioSource] == undefined) {
                entries[idBioSource] = [rec.get('action')];
                biosources.push({
                    "id": idBioSource,
                    "name": rec.get('bioSource')
                });
            } else {
                entries[idBioSource].push(rec.get('action'));
            }
        });
        if (Object.keys(entries).length > 0) {
            var win = Ext.create('Ext.window.Window', {
                title: "History summary report",
                height: 400,
                layout: 'fit',
                width: 400,
                items: [{
                    xtype: "historyReport",
                    entries: entries,
                    biosources: biosources
                }]
            });
            win.show();
            win.focus();
        } else {
            Ext.MessageBox.alert('No entries',
                'There are no entries in the history!');
        }
    }

});