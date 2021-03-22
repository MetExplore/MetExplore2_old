/**
 * curation Panel
 */
Ext.define('MetExplore.view.main.V_CurationPanel', {

    extend: 'Ext.Panel',
    alias: 'widget.curationPanel',
    region: 'center',

    id: 'curationPanel',
    bodyStyle: {
        "background-color": "#e0e5ea"
    },
    defaults: {
        border: false
    },

    layout: 'auto',
    autoScroll: true,


    tbar: [{
            xtype: 'button',
            iconCls: 'add',
            text: 'Create Biosource',
            action: 'createBS'
        },
        '-',
        '  ',
        {
            xtype: 'button',
            iconCls: 'add',
            text: 'Add Element',
            action: 'addEl'
        },
        '-',
        '  ',
        {
            xtype: 'combobox',
            fieldLabel: 'Upload file ',
            name: 'groupfields',
            store: {
                fields: ['displayName', 'entryPoint', 'disabled', 'tooltip'],
                data: [{
                        'displayName': 'Reaction File',
                        'entryPoint': 'reaction',
                        'disabled': false,
                        'tooltip': 'add multiple reactions in your network or update existing ones'
                    },
                    {
                        'displayName': 'Metabolite File',
                        'entryPoint': 'metabolite'
                    }
                    //			       ,{'displayName':'More to come...','entryPoint':''}
                    //			       {'displayName':'Metabolite File','entryPoint':'metabolite','disabled':true, 'tooltip':'Coming soon!'},
                    //			       {'displayName':'Gene File','entryPoint':'gene','disabled':true, 'tooltip':'Coming soon!'},
                ]
            },
            displayField: 'displayName',
            editable: false,
            forceSelection: true,
            valueField: 'entryPoint',
            hidden: true
        },
        {
            xtype: 'button',
            text: 'OK',
            action: 'addAnnotFromFile',
            hidden: true
        }, '->', {
            iconCls: 'help',
            tooltip: 'Documentation for curation',
            handler: function() {
                MetExplore.app.getController('C_HelpRedirection').goTo('annotate.php');
            }
        }
    ],

    items: []

});