/**
 * Drag & Drop de gridREaction vers Cart pour creation nouveau BioSOurce
 */

Ext.define('MetExplore.view.grid.V_gridCart', {
    extend: 'Ext.grid.Panel',
    //stateful: true,
    store: 'S_Cart',
    multiSelect: true,
    autoScroll: false,
    alias: 'widget.gridCart',

    requires: ['MetExplore.view.button.V_CytoscapeWebStartButton'],

    tbar: {
        items: [{
            xtype: 'cytoscapeWebStartButton'
        }, {
            xtype: 'button',
            action: 'delFlux',
            tooltip: 'Delete all the reactions for which the lower and upper flux bounds equal to 0',
            text: 'Delete Flux=0'
        }, {
            xtype: 'tbtext',
            text: '<b>Nb Reactions : 0</b>'
        }, '->', {
            iconCls: 'help',
            tooltip: 'Documentation for cart',
            handler: function() {
                MetExplore.app.getController('C_HelpRedirection').goTo('visu.php');
            }
        }]
    },

    columns: [{
            text: 'idInBio',
            hidden: true,
            flex: 1,
            sortable: false,
            dataIndex: 'idInBio'
        },
        {
            text: 'id',
            hidden: true,
            flex: 1,
            sortable: true,
            dataIndex: 'id'
        },
        {
            text: 'name',
            flex: 1,
            sortable: true,
            dataIndex: 'name'
        },
        {
            text: 'dbIdentifier',
            sortable: true,
            dataIndex: 'dbIdentifier'
        }
    ],


    viewConfig: {
        //forceFit:true,
        //preserveScrollOnRefresh: true,	
        plugins: {

            ptype: 'gridviewdragdrop',
            ddGroup: 'genericDDgroup'

        },
        copy: true,
        listeners: {
            beforeDrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
                if (data.view.getStore().storeId !== "S_Reaction") {
                    Ext.MessageBox.show({
                        title: "Tip",
                        msg: "The Cart can only be filled with reactions.</br>These are then used to draw a sub-network in the vizualisation panel!",
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                    return false;
                } else {
                    return true;
                }
            },
            drop: function(node, data, dropRec, dropPosition) {
                var grid = Ext.getCmp('gridCart');
                var cart = Ext.getStore('S_Cart');
                var txt = grid.query('tbtext')[0];
                var nb = cart.count();
                txt.setText('<b>Nb Reactions : ' + nb + '</b>');
                //var panel= Ext.getCmp('gridCart');
                //this.getSelectionModel().deselectAll();
                //panel.updateLayout();
                //console.log(data);
            }
            //  var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
            //Ext.example.msg("Drag from left to right", 'Dropped ' + data.records[0].get('name') + dropOn);
        }

    }
});