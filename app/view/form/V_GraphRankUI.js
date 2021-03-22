Ext.define('MetExplore.view.form.V_GraphRankUI', {
    extend: 'Ext.form.Panel',

    alias: 'widget.graphRankUI',

    requires: ['MetExplore.globals.Session', 'MetExplore.view.form.V_SelectMetabolites'],

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
            html: '<h1>MetaboRank</h1>'
        }, {
            xtype: 'textfield',
            name: 'id',
            hidden: true
        }, {
            xtype: 'fieldset',
            title: 'Description',
            items: [{
                    border: false,
                    colspan: 4,
                    html: 'Find insightful metabolites that are well connected to your metabolites of interest obtained from experimental data.<br>' +
                        'This tool uses an extended version of Recon2, the highly curated reconstruction of the human metabolic network, which contains only relevant connections selected based on biochemical criterions. It internally uses a recommendation algorithm inspired by what can be found on social networks to suggest you new users based on their network proximity.<br>'

                        +
                        'This tool executes personalized Page Rank and Chei Rank algorithms:<br>' +
                        '<em>C. Frainay, et al. Metabolites you might be interested in: a network based recommendation system to interpret and enrich metabolomics results, Bioinformatics (2017), 31(20):3383–3386.</br></br>'
                }
                // 			+'<em>C. Frainay, et al. <a href="http://bioinformatics.oxfordjournals.org/content/31/20/3383" target"_blank">Metabolites you might be interested in: a network based recommendation system to interpret and enrich metabolomics results</a>, Bioinformatics (2017), 31(20):3383–3386.</br></br>'

                , {
                    xtype: 'checkbox',
                    boxLabel: "Show Tips",
                    name: "showtips",
                    hidden: true,
                    checked: true,
                    handler: function(box, newVal) {

                        var UI = this.up('GraphRankUI');


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
                }
            ]
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
            title: 'Metabolites of interest',
            items: [
                // {
                //              itemId:"selMet",
                //              xtype:"selectMetabolites",
                // 	name : name + "[]",
                // 	store : 'S_Metabolite',
                // 	emptyText : '',
                //              colspan:2,
                // 	allowBlank : false
                // },
                // {
                // 	xtype : "button",
                // 	text : "use metabolite table selection",
                //               colspan:2,
                // 	action : "reportMetaboliteSelection"
                // },
                {
                    colspan: 2,
                    xtype: 'selectMapping'
                },
                {
                    xtype: 'displayfield',
                    cls: 'tips',
                    colspan: 2,
                    value: "<em>Choose mapping to use mapped metabolites as seeds.</em>"
                },
                {
                    colspan: 2,
                    xtype: 'selectCondition'
                },
                {
                    xtype: 'displayfield',
                    cls: 'tips',
                    colspan: 2,
                    value: "<em>Choose condition if you want use mapping values as weight in Page rank and Chei rank.</em>"
                }
            ]
        }
        // ,{
        // 	xtype:'fieldset',
        // 	title:"Network Information",
        // 	fieldDefaults : {
        // 		width : '100%'
        // 	},
        // 	items:[{
        // 		xtype: 'displayfield',
        // 		fieldLabel : 'Name of the Exported Biosource',
        // 		colspan:4,
        // 		listeners:{
        // 			afterrender:function(c){
        // 				this.setValue(MetExplore.globals.Session.nameBioSource);
        // 			}
        // 		}
        // 	},{
        // 		xtype : 'hiddenfield',
        // 		name : 'idBioSource'
        // 	},{
        // 		xtype: 'displayfield',
        // 		fieldLabel : 'MetExplore Id',
        // 		colspan:4,
        // 		listeners:{
        // 			afterrender:function(c){
        // 				this.setValue(MetExplore.globals.Session.idBioSource);
        // 				this.prev('hiddenfield').setValue(MetExplore.globals.Session.idBioSource)
        // 			}
        // 		}
        // 	}]
        // }
        , {
            xtype: 'button',
            text: 'Launch',
            tooltip: 'Launch MetaboRank with seeds from selected mapping on bioSource 3223',
            action: 'launch',
            width: 100,
            formBind: true
        }
    ]

});