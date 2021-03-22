Ext.define('MetExplore.view.form.V_SBMLExportUI', {
    extend: 'Ext.form.Panel',

    alias: 'widget.SBMLExportUI',

    requires: ['MetExplore.globals.Session'],

    config: {
        java_application: null
    },

    resizable: false,
    closable: true,
    closeAction: 'destroy',
    autoScroll: true,
    bodyPadding: 5,

    fieldDefaults: {
        labelAlign: 'left',
        width: 300,
        labelWidth: 200,
        margin: '5 5 5 5'
    },

    defaults: {
        width: 900,
        layout: {
            type: 'table',
            columns: 4,
            tableAttrs: {
                style: {
                    width: '100%'
                }
            }
        }
    },

    items: [{
        xtype: 'fieldset',
        title: 'Description',
        items: [{
            border: false,
            colspan: 4,
            html: '<em>Export the current BioSource as a SBML file. All exported SBML will use the SBML level 3 specifications and the FBC version 2 package. ' +
                'For more details on these specifications can be found here: ' +
                '<a href="http://co.mbine.org/specifications/sbml.level-3.version-1.core.release-1" target="_blank">SBML level 3</a> and ' +
                '<a href="http://co.mbine.org/specifications/sbml.level-3.version-1.fbc.version-2.release-1" target="_blank">FBC2</a>.</em></br></br>Our Export Feature uses JSBML as a Java library to write SBML files:</br>' +
                '<em>N. Rodriguez, et al.. <a href="http://bioinformatics.oxfordjournals.org/content/31/20/3383" target"_blank" >JSBML 1.0: providing a smorgasbord of options to encode systems biology models.</a> Bioinformatics (2015), 31(20):3383–3386.</br></br>' +
                'A. Dräger, et al.. <a href="http://bioinformatics.oxfordjournals.org/content/27/15/2167" target"_blank" >JSBML: a flexible Java library for working with SBML.</a> Bioinformatics (2011), 27(15):2167–2168.</em></br></br>'

        }, {
            xtype: 'checkbox',
            boxLabel: "Show Tips",
            name: "showtips",
            hidden: true,
            checked: true,
            handler: function(box, newVal) {

                var UI = this.up('SBMLExportUI');


                if (newVal) {
                    Ext.each(UI.query('fieldset'), function(fieldSet) {
                        fieldSet.setWidth((fieldSet.getWidth() - 10) * 2);
                        fieldSet.getLayout().columns = 4;
                    });
                    Ext.each(UI.query('fieldset > fieldset'), function(fieldSet) {
                        fieldSet.getLayout().columns = 4;
                    });
                } else {
                    Ext.each(UI.query('fieldset'), function(fieldSet) {
                        fieldSet.setWidth(fieldSet.getWidth() / 2 + 10);
                        fieldSet.getLayout().columns = 2;
                    });
                    Ext.each(UI.query('fieldset > fieldset'), function(fieldSet) {
                        fieldSet.getLayout().columns = 2;
                    });
                }

                Ext.each(UI.query('displayfield[cls=tips]'), function(field) {
                    field.setVisible(newVal);
                });

            }
        }]
    }, {
        xtype: 'fieldset',
        colspan: 4,
        title: 'Job Title',
        items: [{
            xtype: 'textfield',
            name: "analysis_title",
            value: 'SBML Export',
            colspan: 2
        }, {
            xtype: 'displayfield',
            cls: 'tips',
            value: "<em>Set the title of this job to retrieve it easily in the job list.</em>",
            colspan: 2
        }]
    }, {
        xtype: 'fieldset',
        title: "Network Information",
        fieldDefaults: {
            width: '100%'
        },
        items: [{
            xtype: 'displayfield',
            fieldLabel: 'Name of the Exported Biosource',
            colspan: 4,
            listeners: {
                afterrender: function(c) {
                    this.setValue(MetExplore.globals.Session.nameBioSource);
                }
            }
        }, {
            xtype: 'hiddenfield',
            name: 'idBioSource'
        }, {
            xtype: 'displayfield',
            fieldLabel: 'MetExplore Id',
            colspan: 4,
            listeners: {
                afterrender: function(c) {
                    this.setValue(MetExplore.globals.Session.idBioSource);
                    this.prev('hiddenfield').setValue(MetExplore.globals.Session.idBioSource)
                }
            }
        }]
    }, {
        xtype: 'hiddenfield',
        name: "useDefaultPluginParams",
        value: true
    }, {
        xtype: 'fieldset',
        collapsed: true,
        disabled: true,
        title: '<label><input type="checkbox" checked="true" />Use default Advanced Parameters</label>',
        listeners: {
            afterrender: function(c) {
                this.el.down('input').on('click', function(e, div, g) {
                    if (!div.checked) {
                        this.expand();
                    } else {
                        this.collapse();
                    }
                    this.setDisabled(div.checked);

                    this.prev('hiddenfield[name=useDefaultPluginParams]').setValue(div.checked);

                }, this);
            }
        },
        items: [{
                xtype: 'displayfield',
                cls: 'tips',
                width: "100%",
                value: '<em>The advanced parameters allow you to enable/disable the type of writers that will be used to create your SBML file. You can also modify ' +
                    'how each writer behave by changing their own parameters.' +
                    '</br><b>Warning:</b></br>If you are unfamiliar on how SBML files are structured, please use the default Advanced parameters</em>',
                colspan: 4
            }, {
                xtype: 'checkbox',
                boxLabel: "Use  FBC package",
                name: "useFbcPlugin",
                inputValue: true,
                uncheckedValue: false,
                checked: true,
                colspan: 2
            }, {
                xtype: 'displayfield',
                width: '100%',
                cls: 'tips',
                value: '<em>The gene-reaction associations and the flux constraints are exported with the <a href="https://co.mbine.org/specifications/sbml.level-3.version-1.fbc.version-2.release-1" target="_blank">FBC package</a></em>',
                colspan: 2
            },
            {
                xtype: 'checkbox',
                boxLabel: "Use Group plugin for pathways",
                name: "useGroupPlugin",
                inputValue: true,
                uncheckedValue: false,
                checked: true,
                colspan: 2
            }, {
                xtype: 'displayfield',
                width: '100%',
                cls: 'tips',
                value: '<em>The pathways-reaction associations and the flux constraints are exported with the <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5451322/" target="_blank">Groups package</a></em>',
                colspan: 2
            },
            {
                xtype: 'checkbox',
                boxLabel: "Export Annotation Elements",
                name: "useAnnotPlugin",
                inputValue: true,
                uncheckedValue: false,
                checked: true,
                colspan: 2
            }, {
                xtype: 'displayfield',
                width: '100%',
                cls: 'tips',
                value: '<em>The annotation Writter creates MIRIAM compliant annotations from external database identifiers that are linked to your Network constituents.' +
                    '</br>You can find more information on MIRIAM annotations <a href="http://www.ebi.ac.uk/miriam/main/mdb?section=docs" target="_blank">here</a></em>',
                colspan: 2
            }, {
                xtype: 'checkbox',
                boxLabel: "Export the Notes Elements",
                name: "useNotesPlugin",
                inputValue: true,
                uncheckedValue: false,
                checked: false,
                colspan: 2,
                // handler: function(box, newVal) {

                //     nextbox = box.next('checkbox');
                //     nextbox.setDisabled(!newVal);
                //     nextbox.next('displayfield').setDisabled(!newVal);
                // }
            }, {
                xtype: 'displayfield',
                width: '100%',
                cls: 'tips',
                value: '<em>The Notes Writter creates COBRA-compliant SBML notes (<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3319681/" target="_blank" >J. Schellenberger et al., (2011)</a>).' +
                    '</br>Notes in this format consist in Key/Value(s) pairs that allow the addittion of informations that cannot be stored in other SBML constituents.</em>',
                colspan: 2
            },
            // {
            //     xtype: 'checkbox',
            //     boxLabel: "Let the Writter update existing Notes",
            //     name: "updateExistingNoteValues",
            //     inputValue: true,
            //     uncheckedValue: false,
            //     checked: true,
            //     colspan: 2
            // }, {
            //     xtype: 'displayfield',
            //     width: '100%',
            //     cls: 'tips',
            //     value: '<em>If your Network already has notes attached to its constituents (e.g. it was creaed by the Import Feature), enableing this ' +
            //         'will update existing notes with new values.</br><b>Check this if you want to export curation data added ' +
            //         'using MetExplore\'s curation tool.</b></em>',
            //     colspan: 2
            // }
        ]
    }, {
        xtype: 'button',
        text: 'Launch',
        action: 'launch',
        width: 100,
        formBind: true
    }]

});