/**
 * ja_parameters_form
 */
Ext.define('MetExplore.view.form.V_JavaApplicationParametersForm', {
    extend: 'Ext.form.Panel',
    requires: ['MetExplore.view.form.V_SelectReactions',
        'MetExplore.view.form.V_SelectGenes',
        'MetExplore.globals.Session'
    ],

    alias: 'widget.ja_parameters_form',
    resizable: false,
    // width : 600,
    closable: true,
    fileUpload: true,
    autoScroll: true,

    bodyPadding: 5,
    // border : false,

    fieldDefaults: {
        labelAlign: 'left'

    },

    config: {
        java_application: null
    },

    constructor: function(params) {
        config = this.config || {};
        config.iconCls = params.java_application.raw.package.toLowerCase();
        config.title = params.title;

        var application = params.java_application;

        this.config.java_application = application;

        var parameters = application.parameters();

        var items = [];

        var fieldsetWidth = 430;

        var fieldSetDescription = Ext.create('Ext.form.FieldSet', {
            title: "Description",
            html: application.get("description") + "</br></br>",
            width: fieldsetWidth,
            listeners: {
                render: function(c) {
                    Ext.QuickTips.register({
                        target: c.getEl().id,
                        trackMouse: false,
                        text: "Description of the function",
                        width: 200
                    });
                }
            }
        });

        items.push(fieldSetDescription);

        if (application.get("long_job") == true) {
            // Creation of the fieldset
            var fieldSetAnalysis = Ext.create('Ext.form.FieldSet', {
                title: "Analysis title",
                qtip: "Set the analysis title to retrieve it easily in the job list",
                width: fieldsetWidth,
                listeners: {
                    render: function(c) {
                        Ext.QuickTips.register({
                            target: c.getEl().id,
                            trackMouse: false,
                            title: name,
                            text: c.qtip,
                            width: 200
                        });
                    }
                }
            });
            fieldSetAnalysis.add({
                xtype: "textfield",
                width: 200,
                name: "analysis_title",
                allowBlank: false,
                value: application.get("name"),
                margin: '5 5 5 5',
                labelAlign: 'left'
            });

            items.push(fieldSetAnalysis);
        }

        var basicParameterFieldset = Ext.create('Ext.form.FieldSet', {
            title: "Standard Parameters",
            width: fieldsetWidth
            // layout:{
            // 	type: 'table',
            // 	columns: 4,
            // 	tableAttrs: {
            // 		style: {
            // 			width: '100%'
            // 		}
            // 	}
            // }

        });



        var advancedParameterFieldset = Ext.create('Ext.form.FieldSet', {
            title: "Advanced Parameters",
            width: fieldsetWidth,
            collapsible: true,
            collapsed: true
            // layout:{
            // 	type: 'table',
            // 	columns: 4,
            // 	tableAttrs: {
            // 		style: {
            // 			width: '100%'
            // 		}
            // 	}
            // }

        });

        parameters.each(function(parameter) {

            var metavar = parameter.get("metaVar");
            var type = parameter.get("type");
            var name = parameter.get("name");
            var descr = parameter.get("description");
            var required = parameter.get("required");
            var default_value = parameter.get("default");

            if (typeof default_value === "undefined") {
                default_value = "";
            }

            if (metavar == "mail") {
                var mailUser = MetExplore.globals.Session.mailUser;
                default_value = mailUser;
            }

            var allowBlank = true;

            if (required == true) {
                allowBlank = false;
            }

            if (metavar == "idBioSource") {
                // Put the current idBioSource as hidden field

                var idBioSource = MetExplore.globals.Session.idBioSource;

                items.push({
                    xtype: 'hiddenfield',
                    name: name,
                    value: idBioSource
                });

            } else if (metavar == "idUser") {
                // Put the current idUser as hidden field

                var idUser = MetExplore.globals.Session.idUser;

                items.push({
                    xtype: 'hiddenfield',
                    name: name,
                    value: idUser
                });

            } else if (metavar == "advanced") {

                var xtype = "textfield";
                var allowDecimals = true;

                if (type.match(/String/i)) {
                    xtype = "textfield";
                } else if (type.match(/Boolean/i)) {
                    xtype = "checkboxfield";
                    if (default_value.match(/true/i)) {
                        checked = true;
                    } else {
                        checked = false;
                    }

                } else if (type.match(/Float/i) ||
                    type.match(/Number/i) ||
                    type.match(/Double/i)) {
                    xtype = "numberfield";
                    allowDecimals = true;
                } else if (type.match(/Integer/i)) {
                    xtype = "numberfield";
                    allowDecimals = false;
                }

                advancedParameterFieldset.add({
                    xtype: xtype,
                    qtip: descr,
                    width: 400,
                    labelWidth: 200,
                    fieldLabel: name,
                    // colspan:2,
                    name: name,
                    allowDecimals: allowDecimals,
                    value: default_value,
                    inputValue: true,
                    uncheckedValue: false,
                    checked: checked,
                    hideTrigger: true,
                    keyNavEnabled: false,
                    mouseWheelEnabled: false,
                    margin: '5 5 5 5',
                    labelAlign: 'left',
                    listeners: {
                        render: function(c) {
                            Ext.QuickTips.register({
                                target: c.getEl().id,
                                trackMouse: false,
                                title: name,
                                text: c.qtip,
                                width: 200
                            });
                        }
                    }
                })

            } else {

                // Creation of the fieldset
                var fieldSet = Ext.create('Ext.form.FieldSet', {
                    title: name,
                    qtip: descr,
                    width: 400,
                    colspan: 2,
                    listeners: {
                        render: function(c) {
                            Ext.QuickTips.register({
                                target: c.getEl().id,
                                // Moving within the
                                // row
                                // should not hide
                                // the tip.
                                trackMouse: false,
                                title: name,
                                text: c.qtip,
                                width: 200
                            });
                        }
                    }
                });

                if (metavar == "organism") {
                    // Displays the organism selector
                    fieldSet.add({
                        xtype: 'selectInsertOrganism',
                        width: 600,
                        allowBlank: allowBlank,
                        name: name
                    });

                } else if (metavar == "file") {
                    // displays a file selector
                    fieldSet.add({
                        xtype: 'fileuploadfield',
                        emptyText: 'Select a File ',
                        name: name,
                        buttonText: '',
                        buttonConfig: {
                            iconCls: 'upload-icon'
                        },
                        allowBlank: allowBlank
                    });

                } else if (metavar == "reactions") {

                    var store = Ext.create("MetExplore.store.S_Reaction");
                    store.load({
                        callback: function(records, operation, success) {
                            var min_flux_reaction = Ext.create(
                                'MetExplore.model.Reaction', {
                                    dbIdentifier: "FluxSum"
                                });

                            store.insert(0, min_flux_reaction);

                            var selectReactions = Ext.create(
                                "MetExplore.view.form.V_SelectReactions", {
                                    name: name + "[]",
                                    store: store,
                                    emptyText: '',
                                    allowBlank: allowBlank
                                });

                            fieldSet.add(selectReactions);

                            fieldSet.add({
                                xtype: "button",
                                text: "report reaction table selection",
                                action: "reportReactionSelection"
                            });

                            store.sort("dbIdentifier", "ASC");


                        }
                    });

                    store.sort("dbIdentifier", "ASC");

                } else if (metavar == "genes") {

                    var storeGenes = Ext.create("MetExplore.store.S_Gene");
                    storeGenes.load({
                        callback: function(records, operation, success) {

                            storeGenes.sort("dbIdentifier", "ASC");

                            var selectGenes = Ext.create(
                                "MetExplore.view.form.V_SelectGenes", {
                                    name: name + "[]",
                                    emptyText: '',
                                    allowBlank: allowBlank,
                                    store: storeGenes
                                });

                            fieldSet.add(selectGenes);

                            fieldSet.add({
                                xtype: "button",
                                text: "report gene table selection",
                                action: "reportGeneSelection"
                            });
                        }
                    });

                } else {

                    var choices = parameter.get("choices");

                    if (typeof(choices) != "undefined" && choices != "") {
                        // Creation of a checkbox group.
                        var boxes = [];

                        var a_choices = choices.split(",");

                        Ext.Array.each(a_choices, function(choice) {

                            var box = {
                                boxLabel: choice,
                                name: name,
                                inputValue: choice
                            };

                            if (choice == default_value) {
                                box.checked = true;
                            }

                            boxes.push(box);
                        });

                        var checkbox_group = {
                            xtype: 'radiogroup',
                            columns: 2,
                            vertical: true,
                            items: boxes
                        };

                        fieldSet.add(checkbox_group);

                    } else {

                        var xtype = "textfield";

                        var checked = false;

                        if (typeof type === "undefined") {
                            type = "text";
                        }

                        var min = -10000000000;
                        var max = 10000000000;

                        if (typeof parameter.get("min") != "undefined") {
                            min = parameter.get("min");
                        }

                        if (typeof parameter.get("max") != "undefined") {
                            max = parameter.get("max");
                        }

                        var allowDecimals = true;

                        if (type.match(/String/i)) {
                            xtype = "textfield";
                        } else if (type.match(/Boolean/i)) {
                            xtype = "checkboxfield";
                            if (default_value.match(/true/i)) {
                                checked = true;
                            } else {
                                checked = false;
                            }

                        } else if (type.match(/Float/i) ||
                            type.match(/Number/i) ||
                            type.match(/Double/i)) {
                            xtype = "numberfield";
                            allowDecimals = true;
                        } else if (type.match(/Integer/i)) {
                            xtype = "numberfield";
                            allowDecimals = false;
                        }

                        vtype = "";

                        if (type == "mail") {
                            vtype = "email";
                        }

                        // console.log("min :" + min);
                        // console.log("max :" + max);

                        fieldSet.add({
                            xtype: xtype,
                            vtype: vtype,
                            width: 200,
                            name: name,
                            allowDecimals: allowDecimals,
                            allowBlank: allowBlank,
                            minValue: min,
                            maxValue: max,
                            value: default_value,
                            inputValue: true,
                            uncheckedValue: false,
                            checked: checked,
                            hideTrigger: true,
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            margin: '5 5 5 5',
                            labelAlign: 'left'
                        });
                    }

                }

                basicParameterFieldset.add(fieldSet);
            }
        });

        if (basicParameterFieldset.items.getCount() >= 1) {
            items.push(basicParameterFieldset);
        }

        if (advancedParameterFieldset.items.getCount() >= 1) {
            items.push(advancedParameterFieldset);
        }



        items.push({
            xtype: 'button',
            text: 'Launch',
            action: 'launch',
            formBind: true
        });

        this.config.items = items;

        this.callParent([config]);

    }

});