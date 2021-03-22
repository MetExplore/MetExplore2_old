/**
 * formMap
 * 
 */

Ext.define('MetExplore.view.form.V_Map', {
    extend: 'Ext.form.Panel',
    alias: 'widget.formMap',
    requires: ['MetExplore.view.grid.V_gridData'],

    bodyPadding: 5,
    header: false,
    anchor: '100%',
    layout: 'vbox',
    fileUpload: true,

    fieldDefaults: {
        labelAlign: 'left',
        labelWidth: 150,
        anchor: '100%'
    },
    items: [{
            xtype: 'textfield',
            name: 'id',
            hidden: true
        },
        {
            //permet de savoir si les inchi sont chargés
            xtype: 'checkboxfield',
            hidden: true,
            formBind: true,
            allowBlank: false,
            name: 'inchi',
            listeners: {
                'afterrender': function() {
                    var storeInchi = Ext.getStore('S_MetaboliteInchiSvg');
                    this.setValue(storeInchi.isLoading());
                }
            }
        },
        {
            //permet de savoir si les inchi sont chargés
            xtype: 'checkboxfield',
            hidden: true,
            formBind: true,
            allowBlank: false,
            name: 'inchikey',
            listeners: {
                'afterrender': function() {
                    var storeInchikey = Ext.getStore('S_MetaboliteInchikey');
                    this.setValue(storeInchikey.isLoading());
                }
            }
        },
        //{
        // xtype: 'panel',
        // layout: {
        //     type: 'table',
        //     columns: 2,
        //     width: '100%'
        //     //bodyStyle: 'padding:5px'
        // },
        // items: [{xtype: 'panel',
        //     html: '<p>You load data to  test Mapping',
        //     style: {
        //         width: '95%',
        //         marginBottom: '10px',
        //         marginTop: '10px',
        //         'text-align': 'center'
        //     }
        // },
        {
            text: 'Demo',
            xtype: 'button',
            scale: 'medium',
            tooltip: 'load data for demonstration',
            border: 1,
            width: 80,
            style: {
                borderColor: 'grey',
                borderStyle: 'solid',
                marginBottom: '10px',
                marginTop: '10px',
                'text-align': 'center'
            },
            handler: function() {
                var me = this;
                if (MetExplore.globals.Session.idBioSource == -1) {
                    var ctrl = MetExplore.app.getController('C_GenericGrid');
                    ctrl.selectBioSource(1363, fillMappingGrid);
                } else fillMappingGrid();

                function fillMappingGrid() {

                    var storeM = Ext.getStore('S_Metabolite');
                    var grid = me.up('panel').down('gridData');
                    var storeData = grid.getStore();
                    var ctrl = MetExplore.app.getController('C_gridData');
                    var nbCol = 2;
                    //console.log(nbCol);
                    //ajout column grid
                    //ctrl.removeColumnGrid(grid);
                    //ctrl.addColumnGrid(grid, nbCol, false, "");
                    storeData.removeAll();
                    //console.log(storeM);
                    if (storeM != undefined && storeM.getCount() > 30) {
                        //console.log(storeM);
                        for (i = 0; i < 20; i++) {
                            var id = storeM.getAt(i + 1).get('dbIdentifier');
                            storeData.add({
                                'idMap': id,
                                'map0': i * 1.2
                            });
                        }
                        storeData.add({
                            'idMap': 'M_test',
                            'map0': 4.5
                        });
                        var count = storeM.getCount() - 20;
                        for (i = count; i < count + 20; i++) {
                            var id = storeM.getAt(i).get('dbIdentifier');
                            storeData.add({
                                'idMap': id,
                                'map0': i * 0.011
                            });
                        }
                        storeData.add({
                            'idMap': 'M_test2',
                            'map0': 4.5
                        });
                    }
                    me.disable();
                }


            }
            //}]
        },

        {
            xtype: 'fieldset',
            style: {
                borderColor: 'blank',
                borderStyle: 'solid',
                width: '95%',
                marginBottom: '10px',
                marginTop: '5px'
            },
            layout: {
                type: 'table',
                columns: 3,
                width: '100%'
                //bodyStyle: 'padding:5px'
            },
            items: [{
                    xtype: 'fileuploadfield',
                    fieldLabel: 'Upload file (.csv .txt) ',
                    allowBlank: true,
                    tooltip: 'upload file',
                    width: 100,
                    labelWidth: 150,
                    name: 'fileData',
                    buttonText: '',
                    buttonConfig: {
                        iconCls: 'upload-icon'
                    },
                    formBind: false,
                    listeners: {
                        'change': function(file, value, eOpts) {
                            var form = this.up('form').getForm();
                            var grid = this.up('panel').down('gridData');
                            var separator = this.up('panel').query('combo[name=separator]')[0].getRawValue();
                            var header = this.up('panel').query('checkboxfield[name=header]')[0].getRawValue();
                            // console.log(separator);
                            // console.log(header);

                            form.submit({
                                url: 'resources/src/php/fileCSV-upload.php',
                                waitMsg: 'Uploading your csv File...',
                                timeout: 100000,
                                params: {
                                    sep: separator
                                    //header:header
                                },

                                success: function(fp, o) {

                                    var ctrl = MetExplore.app.getController('C_gridData');
                                    var nbCol = o.result.rows[0];
                                    //console.log(nbCol);
                                    //ajout column grid
                                    ctrl.removeColumnGrid(grid);
                                    ctrl.addColumnGrid(grid, nbCol, header, o.result.rows[2]);


                                    var storeData = grid.getStore();
                                    storeData.removeAll();
                                    storeData.proxy.extraParams.fileName = o.result.rows[1];
                                    storeData.proxy.extraParams.sep = separator;
                                    storeData.proxy.extraParams.header = header;

                                    storeData.load({
                                        callback: function(records) {
                                            // if (header) {
                                            // 	var tabCol= o.result.rows[2];
                                            // 	console.log(tabCol);
                                            // 	var currentRec = storeData.getAt(0);
                                            // 	var columnsMapping = grid.headerCt.gridDataColumns;
                                            //
                                            // 	for (var i = 3; i < columnsMapping.length; i++) {
                                            // 		var textCol = tabCol[i-2];//currentRec.get('map' + (i - 3));
                                            // 		grid.headerCt.gridDataColumns[i].titleEl.dom.innerHTML = textCol;
                                            // 		grid.headerCt.gridDataColumns[i].text = textCol;
                                            //
                                            // 	}
                                            // 	//storeData.removeAt(0);
                                            // }
                                        }
                                    })
                                }
                            })
                        }
                    }
                },
                {
                    xtype: 'combobox',
                    padding: 5,
                    width: 220,
                    labelWidth: 150,
                    labelAlign: 'right',
                    fieldLabel: 'separator',
                    name: 'separator',
                    store: {
                        fields: ['name', 'id'],
                        data: [{
                                'id': 0,
                                'name': 'tab'
                            },
                            {
                                'id': 1,
                                'name': ';'
                            },
                            {
                                'id': 2,
                                'name': ','
                            }
                        ]
                    },
                    displayField: 'name',
                    valueField: 'id',
                    value: 'tab'
                    //tooltip:'select separator'
                    //emptyText:';',
                }
            ]
        },
        {
            xtype: 'checkboxfield',
            name: 'header',
            fieldLabel: 'Consider first row as header of columns',
            checked: false,
            labelWidth: 300,
            width: "100%",
            labelAlign: 'left',
            helpText: 'header'
        },
        {
            xtype: 'textfield',
            name: 'mapping_name',
            afterLabelTextTpl: '<img src="./resources/icons/info.svg" data-qtip="enter name" width="20" height="20" style="float:right">', //style="float:right"
            fieldLabel: 'Mapping name',
            value: '',
            width: 400,
            allowBlank: false
            //helpText: 'name'
        },
        {
            xtype: 'checkboxfield',
            name: 'mapping_type',
            fieldLabel: 'Perform one separate mapping for each column',
            checked: false,
            labelWidth: 300,
            //width: 800,
            labelAlign: 'left',
            //helpText: 'header'
        }
        ,{
            xtype:'hiddenfield',
            name: "takingInAccountChemicalLibrary",
            value :false
        },
        {
            xtype: 'fieldset',
            name: "takingInAccountChemicalLibrary",
            collapsed:true,
            disabled:true,
            title:'<label><input name="takingInAccountChemicalLibraryInput" type="checkbox" />Taking into account chemical library</label>',
            style: {
                borderColor: 'blank',
                borderStyle: 'solid',
                width: '95%',
                marginBottom: '10px',
                marginTop: '5px'
            },
            layout: {
                type: 'table',
                columns: 1,
                width: '100%,' ,
                tableAttrs: {
                    style: {
                        width: '100%'
                    }
                }
            },
            width : "100%",

            items: [{
                xtype: 'label',
                forId: 'myFieldId',
                text: 'Pathway enrichment has some limitations when applied to metabolomics data. One of the main challenge is the fact that metabolomics doesn\'t allow to detect all metabolites present in the network. To overcome this limitation, it is possible in MetExplore to define a "background set" which corresponds to all the metabolites which can be detected in a metabolomics experiment (e.g. your own spectral library). The pathway enrichment will then be computed only on the metabolites which can be detected hence providing a more faithfull result.',
                margin: '0 0 0 0'
            },{
                xtype: 'fileuploadfield',
                name: "inputChemicalLibrary",
                fieldLabel: 'Upload file (.txt) ',
                allowBlank: true,
                tooltip: 'upload file',
                width: 100,
                labelWidth: 150,
                buttonText: '',
                buttonConfig: {
                    iconCls: 'upload-icon'
                },
                formBind: false
            },{
                xtype: 'panel',
                forId: 'venn',
                title: '',
                border: false,
                text: '10',
                width: "100%",
                height:0,
                margin: '0 0 0 0'
            }
            ]
        },
        {
            xtype: 'gridData',
            height: 300,
            width: "100%",
            border: "1px",
            //frame: true,
            //id			  : 'gridData',
            title: 'Copy/Paste in grid'

        },
        {
            xtype: 'textfield',
            name: 'ppm',
            padding: 5,
            width: 400,
            fieldLabel: 'Indicate the allowed error in ppm (used in mass mapping)',
            value: '2.0',
            allowBlank: false,
            hidden: true


        },
        {
            padding: 5,
            xtype: 'combobox',
            width: 400,
            fieldLabel: 'Propagate',
            name: 'coverage',
            store: {
                fields: ['name', 'id'],
                data: [{
                        'id': 0,
                        'name': 'without conditions values'
                    },
                    {
                        'id': 1,
                        'name': 'with conditions (min value)'
                    },
                    {
                        'id': 2,
                        'name': 'with conditions (max value)'
                    },
                    {
                        'id': 3,
                        'name': 'with conditions (average value)'
                    }
                ]
            },
            displayField: 'name',
            valueField: 'id',
            value: 0,
            afterLabelTextTpl: '<img src="./resources/icons/info.svg" data-qtip="propagate mapped condition values to other objects" width="20" height="20" style="float:right">'
            //tip: 'coverage with conditions',

            // listeners	: {
            //
            // 	render: function(c) {
            // 		Ext.create('Ext.tip.ToolTip', {
            // 			target: c.getEl(),
            // 			html: c.tip
            // 		});
            // 	}
            // },
        },

        {
            xtype: 'textfield',
            text: 'Warning: mapping was performed on the filtered Network Data',
            //width: 400, height: 300,
            hidden: true
        },
        {
            xtype: 'displayfield',
            text: 'Nb',
            name: 'resultMapping',
            hidden: true
        }
    ],
    buttonAlign: 'left',
    buttons: [{
            text: 'Map',
            action: 'map'

        }, {
            text: 'Save Mapping in File',
            action: 'exportJsonFile',
            name: 'save_mapping',
            hidden: true
            //disabled: true
        }
        // {
        //     text : 'Save Mapping in Database',
        //     action : 'saveMappingDB',
        //     name : 'save_mappingDB',
        //     hidden:true,
        //     //disabled: true
        // }
    ]
});