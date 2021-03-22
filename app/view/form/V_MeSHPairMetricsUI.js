Ext.define('MetExplore.view.form.V_MeSHPairMetricsUI', {
    extend: 'Ext.form.Panel',

    alias: 'widget.meshpairmetricsUI',

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
        html: '<h1>MeSH pair metrics</h1>'
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
            html: 'Get MeSH associated with a MeSH term.<br><br>' +
                "The Smalheiser and Bonifield similarity aims to measure co odds and co occurrence of MeSHs to define relevant filter on MeSH tree.<br/>" +
                "The article-based metric provides a measure of semantic relatedness, and MeSH term pairs that co-occur more often than expected by chance may reflect relations between the two terms.<br/>" +
                "Calculation of odds ratios is describe in this article : Smalheiser, Neil R., and Gary Bonifield. “<a href='https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4845330/' target='_blank'><em>Two Similarity Metrics for Medical Subject Headings (MeSH):: An Aid to Biomedical Text Mining and Author Name Disambiguation.</em></a>” Journal of Biomedical Discovery and Collaboration 7 (2016): e1. PMC. Web. 13 Feb. 2018."
        }, {
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
        colspan: 4,
        title: 'Job Title',
        items: [{
            xtype: 'textfield',
            name: "analysis_title",
            value: 'MeSH pair metrics',
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
            width: 300,
            colspan: 2
        }, {
            xtype: 'displayfield',
            cls: 'tips',
            value: "<em>Choose a MeSH term to find MeSH which is significantly co occurring with it.</em>",
            colspan: 2
        }]
    }, {
        xtype: 'button',
        text: 'Launch',
        action: 'launch',
        width: 100,
        formBind: true
    }]

});