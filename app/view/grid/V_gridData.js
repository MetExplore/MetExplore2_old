/**
 * gridData
 * utilise pour mapping
 */

Ext.define('MetExplore.view.grid.V_gridData', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridData',
    //requires: [	'MetExplore.store.S_ColumnConfig'],
    //selType: 'checkboxmodel',
    plugins: [
        //Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 2}) ,
        {
            ptype: 'bufferedrenderer'
        }
    ],
    border: true,
    autoScroll: true,

    width: 600,
    height: 400,
    //resizable: true,
    //resizeHandles: 'all',
    columns: [{
        xtype: 'rownumberer',
        width: 50,
        sortable: false
    }, {
        text: 'Identified',
        width: 55,
        //xtype	 : 'checkcolumn', 	
        sortable: true,
        type: 'bool',
        //filter: true,
        dataIndex: 'identified',
        hidden: true

    }, {
        text: 'Identifier OR Name OR Mass',
        width: 200,
        flex: 1,
        sortable: true,
        //filter: {type:'string'},
        dataIndex: 'idMap',
        editor: {
            allowBlank: false
        }
    }, {
        text: 'condition',
        dataIndex: 'map0',
        //id: 'map0',
        editor: {
            allowBlank: false
        }
    }],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        layout: {
            pack: 'center'
        },
        items: [{
            xtype: 'combo',
            fieldLabel: 'Object',
            name: 'object',
            labelWidth: 60,
            store: ['Pathway', 'Reaction', 'Metabolite', 'Enzyme', 'Protein', 'Gene'],
            value: 'Metabolite',
            listeners: {
                change: function(combo, newValue, oldValue, eOpts) {
                    var panel = combo.up('panel');
                    //console.log(panel.query('button[action=map]')[0]);
                    var store = panel.query('combo')[1].getStore();

                    var form = Ext.getCmp('tabPanel').getActiveTab();
                    var takingInAccountChemicalLibraryForm = form.query('fieldset[name=takingInAccountChemicalLibrary]')[0];
                    var input = takingInAccountChemicalLibraryForm.el.down('input').dom;

                    // si Metabolite ajouter weight dans la liste Element
                    if (newValue == 'Metabolite' && newValue != oldValue) {
                        store.add({
                            field1: 'Monoisotopic Mass'
                        });
                        store.add({
                            field1: 'inchi'
                        });
                        store.add({
                            field1: 'inchikey'
                        });

                        takingInAccountChemicalLibraryForm.show();
                    } else {
                        store.removeAt(2);
                        store.removeAt(2);
                        store.removeAt(2);
                        panel.query('combo')[1].select('Identifier');
                        if (input.checked)
                            input.click();
                        takingInAccountChemicalLibraryForm.hide();
                    }
                    //select reaction
                    if (newValue == 'Reaction' && newValue != oldValue) {
                        store.add({
                            field1: 'EC'
                        });

                    } else {
                        store.removeAt(2);
                        panel.query('combo')[1].select('Identifier');
                    }
                    //select gene
                    if (newValue == 'Gene' && newValue != oldValue) {
                        for(var i= 0; i < MetExplore.globals.Mapping.colsGene.length; i++)
                        {
                            store.add({
                                field1: MetExplore.globals.Mapping.colsGene[i]
                            });
                        }

                    } else {
                        for(var i= 0; i < MetExplore.globals.Mapping.colsGene.length; i++)  store.removeAt(2);
                        panel.query('combo')[1].select('Identifier');
                    }
                }
            }
        }, {
            xtype: 'tbspacer',
            width: 50
        }, {
            xtype: 'combo',
            name: 'field',
            fieldLabel: 'Feature',
            store: ['Identifier', 'name', 'Monoisotopic Mass', 'inchi', 'inchikey'],
            value: 'Identifier',
            labelWidth: 60,
            listeners: {
                change: function(combo, newValue, oldValue, eOpts) {
                    //console.log(panel.query('button[action=map]')[0]);
                    var panel = combo.up('panel');
                    var ppm = panel.up('panel').query('textfield[name=ppm]')[0];
                    if (newValue == 'Monoisotopic Mass') ppm.setVisible(true);
                    else ppm.setVisible(false);

                }
            }
        }]
    }]
});