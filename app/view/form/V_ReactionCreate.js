/**
 * reactionCreate
 */
Ext.define('MetExplore.view.form.V_ReactionCreate', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.reactionCreate',

    requires: ['MetExplore.view.form.V_ReactionForm',
        'MetExplore.view.form.V_MetaboliteSearch',
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.column.Action',
        'Ext.grid.feature.Grouping'
    ],


    minWidth: 950,
    layout: 'auto',

    dockedItems: [{
        xtype: 'metaboliteSearch',
        dock: 'top'
        //weight: 110 //permet de mettre formulaire avant nom de colonne
    }, {
        xtype: 'reactionForm',
        dock: 'bottom',
        weight: 110 //permet de mettre formulaire avant nom de colonne
    }],

    columns: [{
        text: 'Coeff',
        defaultValue: '1',
        dataIndex: 'coeff',
        editor: {
            allowBlank: false
        },
        width: 50
    }, {
        text: 'Metabolite',
        dataIndex: 'metabolite',
        valueField: 'idMetabolite',
        width: 400
        // },{
        //    xtype: 'checkcolumn',
        //    text :'Co-factor',
        //    dataIndex:'cofactor',
        //    inputValue	: '1',
        //    width:90
    }, {
        xtype: 'checkcolumn',
        text: 'Side Compound',
        dataIndex: 'side',
        inputValue: '1',
        //padding: "0 0 0 40",
        width: 90
        // },{
        //    xtype: 'checkcolumn',
        //    text :'Constant Coeff',
        //    dataIndex:'constantCoeff',
        //    inputValue	: '1',
        //    width:90
    }, {
        hidden: true,
        dataIndex: 'type',
        name: 'type',
        width: 90
    }, {
        xtype: 'actioncolumn',
        width: 24,
        iconCls: 'del',
        handler: function(grid, rowIndex, colIndex) {
            grid.getStore().removeAt(rowIndex);
        }
    }],


    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 2
    })],
    features: [{
        ftype: 'grouping',
        groupHeaderTpl: '{name}'
    }],

    initComponent: function() {
        var me = this;

        var theStore = Ext.create('MetExplore.store.S_ReactionCreation');
        Ext.apply(me, {
            store: theStore
        });

        me.callParent();
    },


    /**
     * Constructor of the GRID
     */
    constructor: function(param) {

        config = this.config;

        var dItems = config.dockedItems;

        if (param.Reaction) {


            dItems = [{
                xtype: 'metaboliteSearch',
                dock: 'top',
                weight: 110
            }, {
                xtype: 'reactionForm',
                dock: 'bottom',
                weight: 110,
                loadRec: param.Reaction
            }];


        } else {
            dItems = [{
                xtype: 'metaboliteSearch',
                dock: 'top',
                weight: 110
            }, {
                xtype: 'reactionForm',
                dock: 'bottom',
                weight: 110,
                loadRec: null
            }];
        }

        config.dockedItems = dItems;

        this.callParent([config]);

    }
});