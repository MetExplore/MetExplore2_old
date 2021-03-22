Ext.define('MetExplore.view.form.V_Metab2MeSHUI', {
    extend: 'Ext.form.Panel',

    alias: 'widget.metab2meshUI',

    requires: [
        'MetExplore.globals.Session',
        'MetExplore.view.form.V_SelectMetabolites',
        'MetExplore.view.form.V_SelectMeSH',
        'MetExplore.view.grid.V_gridMeSHPairMetrics'
    ],

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
        html: '<h1>MeSH mining from metabolite</h1>'
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
            // language=HTML
            html: 'Get MeSH term associated with fingerprint.<br><br>' +
                ' Medical Subject Headings (MeSH) is a comprehensive controlled vocabulary for the purpose of indexing journal articles and books in the life sciences; it serves as a thesaurus that facilitates searching. Created and updated by the United States National Library of Medicine (NLM), it is used by the MEDLINE/PubMed article database and by NLM\'s catalog of book holdings. MeSH is also used by ClinicalTrials.gov registry to classify which diseases are studied by trials registered in ClinicalTrials.gov.<br>' +
                '<a target="_blank" href="https://www.nlm.nih.gov/mesh/">MeSH website</a><br><br>' +
                ' Metab2MeSH uses a statistical approach to reliably and automatically annotate compounds with the concepts defined in MeSH, the National Library of Medicine’s controlled vocabulary for biology and medicine. The Metab2MeSH web application searches compounds or MeSH terms and displays resulting pairs of compounds and MeSH terms that match the search term. The compounds / MeSH term pairs displayed are those that are significantly associated in PubMed abstracts and are ordered highest to lowest by significance score.<br>' +
                ' NCIBI provides web service access to Metab2MeSH and other NCIBI databases outside of the regular web page interface. Programmatic access may be useful for integrating Metab2MeSH data into an analytic workflow or data pipeline, and for performing batch queries. <br>' +
                ' Ade, AS; States, DJ; Wright, ZC; Karnovsky, A; Sartor, MA. Metab2MeSH [Internet]. Ann Arbor (MI): National Center for Integrative Biomedical Informatics. 2011 Mar. Available from <a href="http://metab2mesh.ncibi.org/" target="_blank">http://metab2mesh.ncibi.org/. <br>' +
                '<a target="_blank" href="http://metab2mesh.ncibi.org/">Metab2MeSH website</a><br><br>' +
                ' MetExplore equaly uses PubMed API to get some bibliographic informations and Med by year API a small webservice to grab by-year counts for a PubMed search provided by <a target="_blank" href="https://github.com/esperr/med-by-year">Ed Sperr</a>.</br></br>'
        }, { //med-by-year
            xtype: 'image',
            height: "140px",
            width: "120px",
            src: 'resources/images/logo_partners/meshLogo.jpg',
            border: false,
            colspan: 1,
            margin: '0 0 5 12'
        }]
    }, {
        xtype: 'fieldset',
        title: 'Job Title',
        items: [{
            xtype: 'textfield',
            name: "analysis_title",
            value: 'MeSH mining from metabolite',
            width: "300px",
            colspan: 2
        }, {
            xtype: 'displayfield',
            value: "<em>Set the title of this job to retrieve it easily in the job list.</em>",
            colspan: 2
        }]
    }, {
        xtype: 'fieldset',
        title: 'Metabolites of interest',
        items: [{
            colspan: 2,
            width: 300,
            xtype: 'selectMapping'
        }, {
            xtype: 'displayfield',
            colspan: 2,
            value: "<em>Choose mapping to use mapped metabolites as fingerprint.</em>"
        }]
    }, {
        xtype: 'fieldset',
        title: 'MeSH term filter',
        items: [{
            xtype: 'selectMeSH',
            name: "filter_term",
            emptyText: '-- Enter MeSH term --',
            value: '',
            width: 300,
            multiSelect: false,
            colspan: 2
        }, {
            xtype: 'displayfield',
            value: '<em>Use these fields to filter the result with MeSH terms (highly recommended to reduce results).</em>',
            colspan: 2
        }, {
            xtype: 'fileuploadfield',
            fieldLabel: 'Upload file (.txt)',
            allowBlank: true,
            tooltip: 'upload file',
            name: 'fileData',
            buttonText: '',
            labelWidth: 100,
            buttonOnly: true,
            buttonConfig: {
                iconCls: 'upload-icon'
            },
            formBind: false,
            width: "300px",
            colspan: 4
        }, {
            xtype: 'panel',
            value: '',
            name: "validatedterms",
            layout: 'vbox',
            colspan: 4,
            border: false,
            items: [{
                xtype: 'fieldcontainer',
                name: "validatedterms",
                fieldLabel: 'Selected MeSH terms',
                defaultType: 'checkboxfield',
                width: "100%",
                border: false
            }]
        }]
    }, {
        xtype: 'hiddenfield',
        name: "useMeSHSimilarityFilter",
        value: false
    }, {
        xtype: 'fieldset',
        collapsed: true,
        disabled: true,
        title: '<label><input type="checkbox"/>Use MeSH Similarity Filter</label>',
        listeners: {
            afterrender: function(c) {
                this.el.down('input').on('click', function(e, div, g) {
                    if (div.checked) {
                        this.expand();
                    } else {
                        this.collapse();
                    }
                    this.setDisabled(!div.checked);
                    var panel = Ext.getCmp('tabPanel').getActiveTab();

                    panel.query('textfield[name=filter_meSHPairMetrics]')[0].setValue(!div.checked);

                }, this);
            }
        },
        items: [{
            name: "filter_meSHPairMetrics",
            value: '',
            multiSelect: false,
            colspan: 2,
            width: 300,
            xtype: 'selectMeSHPairMetrics'
        }, {
            xtype: 'displayfield',
            border: false,
            value: "<em>Select MeSH pair metrics analysis to define revelant MeSH filters</em>",
            colspan: 2
        }, {
            xtype: 'button',
            text: 'Define new filters by similarity to fill previous list',
            margin: '5 0 10 5',
            action: "meshpairmetrics",
            width: "300px",
            colspan: 2
        }, {
            xtype: 'displayfield',
            border: false,
            value: "<em>This button must be used to make new MeSH pair metrics analyses to filters by similarity and to fill previous list. Don't forget to click on view result button in job to fill the list.</em>",
            colspan: 2
        }, {
            hidden: true,
            xtype: 'gridMeSHPairMetrics',
            text: 'Define new filters by similarity',
            margin: '15 0 10 0',
            colspan: 4
        }]
    }, {
        xtype: 'fieldset',
        title: "Network Information",
        fieldDefaults: {
            width: '100%'
        },
        items: [{
            xtype: 'displayfield',
            fieldLabel: 'Name of current Biosource',
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