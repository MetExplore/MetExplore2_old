Ext.define('MetExplore.view.form.V_MeSHUI', {
    extend: 'Ext.form.Panel',

    alias: 'widget.meshUI',

    requires: ['MetExplore.globals.Session', 'MetExplore.view.form.V_SelectMeSH'],

    bodyPadding: 5,

    fieldDefaults: {
        labelAlign: 'left',
        width: 300,
        labelWidth: 200,
        margin: '5 5 5 5'
    },

    defaults: {
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
        xtype: 'label',
        html: '<h1>MeSH mining from MeSH</h1>'
    }, {
        xtype: 'textfield',
        name: 'id',
        hidden: true
    }, {
        xtype: 'fieldset',
        title: 'Description',
        items: [{
            border: false,
            colspan: 3,
            html: 'Get metabolites of the network associated with a MeSH term.<br><br>' +
                ' Medical Subject Headings (MeSH) is a comprehensive controlled vocabulary for the purpose of indexing journal articles and books in the life sciences; it serves as a thesaurus that facilitates searching. Created and updated by the United States National Library of Medicine (NLM), it is used by the MEDLINE/PubMed article database and by NLM\'s catalog of book holdings. MeSH is also used by ClinicalTrials.gov registry to classify which diseases are studied by trials registered in ClinicalTrials.gov.<br>' +
                '<a target="_blank" href="https://www.nlm.nih.gov/mesh/">MeSH website</a><br><br>'
        }, {
            xtype: 'image',
            height: "140px",
            width: "120px",
            src: 'resources/images/logo_partners/meshLogo.jpg',
            border: false,
            colspan: 1,
            margin: '0 0 5 12'
        }, {
            xtype: 'checkbox',
            boxLabel: "Show Tips",
            name: "showtips",
            hidden: true,
            checked: true,
            handler: function(box, newVal) {

                var UI = this.up('MeSHUI');


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
            value: 'Ranks',
            colspan: 2
        }, {
            xtype: 'displayfield',
            cls: 'tips',
            value: "<em>Set the title of this job to retrieve it easily in the job list.</em>",
            colspan: 2
        }]
    }, {
        xtype: 'fieldset',
        colspan: 4,
        title: 'MeSH term',
        items: [{
            xtype: 'selectMeSH',
            name: "analysis_term",
            value: '',
            colspan: 2
        }, {
            xtype: 'displayfield',
            cls: 'tips',
            value: "<em>The MeSH term.</em>",
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
        xtype: 'button',
        text: 'Launch',
        action: 'launch',
        width: 100,
        formBind: true
    }]

});