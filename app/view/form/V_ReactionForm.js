/**
 * reactionForm
 */
Ext.define('MetExplore.view.form.V_ReactionForm', {
    extend: 'Ext.form.Panel',
    requires: ['MetExplore.view.form.V_SelectInsertEnzymes',
        'MetExplore.view.form.V_SelectInsertPathway',
        'MetExplore.view.form.V_SelectReactionStatus',
        'MetExplore.view.grid.V_gridReactionBiblio',
        'MetExplore.override.form.field.VTypes'
    ],

    alias: 'widget.reactionForm',
    layout: 'auto',

    padding: '0 0 0 0',
    bodyStyle: 'background:none',
    border: false,

    items: [{
        xtype: 'fieldset',
        title: 'Reaction Information',
        //minWidth:950,
        layout: 'auto',

        defaults: {
            //bodyStyle: 'padding:5px'
        },

        defaultType: 'textfield',

        items: [{
            fieldLabel: 'Reaction Identifier *',
            vtype: 'dbIdentifier',
            name: 'dbIdentifier',
            allowBlank: false,
            labelWidth: 130,
            width: 350
        }, {
            fieldLabel: 'Name *',
            name: 'name',
            allowBlank: false,
            labelWidth: 130,
            width: 350
        }, {
            fieldLabel: 'EC',
            name: 'EC',
            labelWidth: 130,
            width: 350
        }, {
            xtype: 'selectInsertPathway',
            bodyStyle: 'background:none',
            colspan: 5
        }, {
            xtype: 'checkboxfield',
            boxLabel: 'Reversible reaction',
            name: 'reversible',
            inputValue: '1'
        }, {
            xtype: 'checkboxfield',
            boxLabel: 'Spontaneous reaction',
            name: 'fast',
            inputValue: '1'
        }, {
            xtype: 'checkboxfield',
            boxLabel: 'Generic Reaction',
            name: 'generic',
            inputValue: '1'
        }, {
            xtype: 'checkboxfield',
            boxLabel: 'Hole Reaction (has no known GPR)',
            name: 'hole',
            inputValue: '1'
        }, {
            xtype: 'selectInsertEnzymes',
            bodyStyle: 'background:none'

        }, {
            xtype: 'selectReactionStatus',
            name: 'idstatus',
            fieldLabel: 'Confidence level (Definition by Palsson)'
        }, {
            xtype: 'fieldset',
            title: 'Gene Ontology',
            layout: 'hbox',

            defaults: {
                border: false,
                xtype: 'panel',
                bodyStyle: 'background:none',
                flex: 1,
                layout: 'vbox'
            },

            items: [{
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'GO number',
                    name: 'go'
                }]
            }, {
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'GO Name',
                    name: 'goName'
                }]
            }]
        }, {
            xtype: 'fieldset',
            title: 'Fluxes and Kinetics',

            layout: 'hbox',

            items: [{
                xtype: 'fieldcontainer',
                //padding:'0 5 0 0',
                flex: 1,
                fieldLabel: 'Flux bounds',
                defaultType: 'textfield',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    fieldLabel: 'Upper Bound',
                    name: 'ubound',
                    width: 100
                }, {
                    fieldLabel: 'Lower Bound',
                    name: 'lbound',
                    width: 100
                }]
                // },{
                //   xtype: 'fieldcontainer',
                //   //padding:'0 0 0 5',
                //   flex:1,
                //   fieldLabel: 'Kinetic Law',
                //   defaultType: 'textfield',
                //   // layout:{
                // 	//   type:'vbox',
                // 	//   align:'stretch'
                //   // },
                //   items:[{
                // 	  name:'klaw'
                //   }]
            }]
        }, {
            xtype: 'gridReactionBiblio'
            // bodyStyle: 'padding:0px'
        }]
    }]

});