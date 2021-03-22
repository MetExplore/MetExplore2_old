/**
 * C_gridMetabolite
 */
Ext.define('MetExplore.controller.C_gridMetabolite', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session'],

    views: ['grid.V_gridMetabolite'],
    stores: ['S_Metabolite','S_IdentifiersDBName','S_Identifiersgit'],

    /*
     * Definition des evenements
     * Definition des boutons dans barre tbarReaction (definie dans view/grid/V_gridReaction
     */
    init: function() {
        //this.getS_MetaboliteStore().addListener('beforeload', MetExplore.globals.Session.removeVotesColumn, this);
        this.getS_MetaboliteStore().addListener('load', MetExplore.globals.Session.showHideLinkColumn, this);
        this.getS_MetaboliteStore().addListener('datachanged', this.UpdateTitle, this);
        this.getS_MetaboliteStore().addListener('filterchange', this.UpdateTitle, this);
        that = this;

        // Listen for the event.
        document.addEventListener('sideCompound', function(e) {
            var node = e.value;

            var store = Ext.getStore('S_Metabolite');
            var theMetaDBId = store.getByDBIdentifier(node.getDbIdentifier());
            var theMetaID = store.getByIdInAllMetabolite(node.getId());

            var theMeta = theMetaDBId || theMetaID;
            if (theMeta != undefined) {
                var test = store.getById(theMeta.getId());
                test.set("sideCompound", true);
                that.checkChangeByVisu(theMeta.getId(), true);
            }

        }, false);


        // Listen for the event.
        document.addEventListener('sideCompoundFromFile', function(e) {
            var node = e.value.value;
            var store = Ext.getStore('S_Metabolite');
            var theMetaDBId = store.getByDBIdentifier(node);
            var theMetaID = store.getByIdInAllMetabolite(node);

            var theMeta = theMetaDBId || theMetaID;

            if (theMeta != undefined) {
                var test = store.getById(theMeta.getId());
                test.set("sideCompound", true);
                that.checkChangeByVisu(theMeta.getId(), true);
            }

        }, false);


        this.control({
            'gridMetabolite': {
                edit: this.editChange,
                viewready: MetExplore.globals.Session.showHideLinkColumn
            },
            'gridMetabolite checkcolumn': {
                checkchange: this.checkChange
            },
            'gridMetabolite button[action=MetaboliteChange]': {
                click: this.MetaboliteChange
            },
            'gridMetabolite button[action=MetaboliteSetting]': {
                click: this.MetaboliteSetting
            },
            'gridMetabolite button[action=SearchDel]': {
                click: this.SearchDel
            },
            'gridMetabolite button[action=showIdsMetabolite]': {
                click: this.showIdsMetabolite
            }
        });
    },

    /*hideColumn:function(){
    	
    	var grid=Ext.getCmp('gridMetabolite');
    	
    	var TypeBioSource= MetExplore.globals.Session.typeDB;
    	
    	if (TypeBioSource=="TrypanoCyc"){
    		if (grid) grid.columns[2].setVisible(true);
    	}else{
    		if (grid) grid.columns[2].setVisible(false);
    	}
    },*/


    UpdateTitle: function(store) {

        var visibleElt = store.getCount(),
            total = store.getTotalCount();
        if (MetExplore.globals.Session.idBioSource == -1) total = 0;
        var grid = Ext.getCmp('gridMetabolite');

        grid.setTitle('Metabolites (' + visibleElt + '/' + total + ')');
    },


    editChange: function(editor, e) {
        /*@desc
         * si nouvelle valeur differente de ancienne ajout d'un enregistrement d'annotation
         * si enregistrement existait deja suppression avant ajout nouveau
         * si colonne tag_new, ajouter origin=git autrement origin=db
         */
        //console.log("edit", editor, e);
        var oldV = e.originalValue;
        var newV = e.value;
        if (oldV != newV) {
            if (e.field == "alias") {
                var node = e.record.data;
                MetExploreViz.onloadMetExploreViz(function() {
                    metExploreViz.onloadSession(function() {
                        console.log(node.dbIdentifier, node.alias);
                        metExploreViz.GraphNode.setAliasByDBId(node.dbIdentifier, node.alias);
                    });
                });
            }
            //console.log("diff");
            //ajout dans tableau : id/ field / oldValue / NewValue
            var annot = Ext.getStore('S_AnnotationMetabolite');
            var rec = e.record;
            var result = annot.findBy(function(record) {
                if ((record.get('idMysql') == rec.get('id')) & record.get('field') == e.field)
                    return true;
            });

            if (result > -1) annot.removeAt(result);

            var idR = rec.get('id');
            var origin = "db";
            if (e.column.tag_id != undefined) {
                if (e.column.tag_id.indexOf("git") > -1) origin = e.column.tag_id;
            }

            annot.add({
                'id': idR + '_' + e.field,
                'idMysql': idR,
                'table': 'Metabolite',
                'field': e.field,
                'name': e.record.get('name'),
                'dbIdentifier': e.record.get('dbIdentifier'),
                'oldV': oldV,
                'newV': newV,
                'origin': origin
            });
        };
    },

    checkChange: function(col, id, val) {
        var store = Ext.getStore('S_Metabolite');
        //To keep the network displayed in viz updated
        var rec = store.getAt(id);
        var oldV = !val;
        var annot = Ext.getStore('S_AnnotationMetabolite');
        var idM = rec.get('id');

        var result = annot.findBy(function(record) {
            if ((record.get('idMysql') == rec.get('id')) & record.get('field') == 'sideCompound')
                return true;
        });

        if (result > -1) annot.removeAt(result);
        annot.add({
            'id': idM + '_' + 'sideCompound',
            'idMysql': idM,
            'table': 'Metabolite',
            'field': 'sideCompound',
            'name': rec.get('name'),
            'dbIdentifier': rec.get('dbIdentifier'),
            'oldV': oldV,
            'newV': val,
            'origin': "db"
        });
        MetExploreViz.onloadMetExploreViz(function() {
            metExploreViz.onloadSession(function() {
                metExploreViz.GraphNode.setIsSideCompoundById(idM, val);
            });
        });
    },

    checkChangeByVisu: function(id, val) {
        var store = Ext.getStore('S_Metabolite');
        //To keep the network displayed in viz updated
        var networkDataStore = Ext.getStore('S_NetworkData');
        var rec = store.getMetaboliteById(id);
        var oldV = !val;
        var annot = Ext.getStore('S_AnnotationMetabolite');
        var idM = rec.get('id');

        var result = annot.findBy(function(record) {
            if ((record.get('idMysql') == rec.get('id')) & record.get('field') == 'sideCompound')
                return true;
        });

        if (result > -1) annot.removeAt(result);
        annot.add({
            'id': idM + '_' + 'sideCompound',
            'idMysql': idM,
            'table': 'Metabolite',
            'field': 'sideCompound',
            'name': rec.get('name'),
            'dbIdentifier': rec.get('dbIdentifier'),
            'oldV': oldV,
            'newV': val,
            'origin': "db"
        });
        MetExploreViz.onloadMetExploreViz(function() {
            metExploreViz.onloadSession(function() {
                metExploreViz.GraphNode.setIsSideCompoundById(idM, val);
            });
        });
    },

    MetaboliteChange: function(grid, record) {
        var sm = Ext.create('Ext.selection.CheckboxModel');

        var gridChangeMetabolite = Ext.create('Ext.grid.Panel', {
            stateful: true,
            multiSelect: true,
            selModel: sm,
            store: 'S_AnnotationMetabolite',
            columns: [{
                    text: 'id',
                    hidden: true,
                    dataIndex: 'id'
                },
                {
                    text: 'name',
                    dataIndex: 'name',
                    width: 200
                },
                {
                    text: 'dbIdentifier',
                    dataIndex: 'dbIdentifier',
                    width: 200
                },
                {
                    text: 'field',
                    dataIndex: 'field',
                    width: 60
                },
                {
                    text: 'Original Value',
                    dataIndex: 'oldV',
                    width: 150
                },
                {
                    text: 'New Value',
                    dataIndex: 'newV',
                    width: 150
                }
            ],
            height: 350,
            width: 800,
            listeners: {
                afterrender: function(thisObj, eOpts) {
                    var sm = thisObj.getSelectionModel();
                    sm.selectAll(true);
                }
            }
        });

        var form_ChangeMetabolite = Ext.create('Ext.FormPanel', {
            items: [gridChangeMetabolite]
        });
        var win_ChangeMetabolite = Ext.create('Ext.Window', {
            title: 'Change Metabolites',
            items: [form_ChangeMetabolite],
            buttons: [{
                    text: 'Submit',
                    handler: function(widget, event) {
                        var annot = Ext.getStore('S_AnnotationMetabolite');
                        // console.log(gridChangeReaction.selModel);
                        var records = gridChangeMetabolite.selModel.getSelection();
                        //console.log("annot", annot); console.log("records", records);
                        //creation d'un tableau a partir d'un objet 
                        var aOptions;
                        var aArrays = new Array;
                        Ext.each(records, function(record) {
                            //console.log(record);
                            aOptions = new Array; // vide
                            aOptions[0] = record.get('idMysql');
                            aOptions[1] = record.get('table');
                            aOptions[2] = record.get('field');
                            aOptions[3] = record.get('name');
                            aOptions[4] = record.get('dbIdentifier');
                            aOptions[5] = record.get('oldV');
                            aOptions[6] = record.get('newV');
                            if (record.get('field') == 'dbIdentifier') {
                                aOptions[7] = record.get('oldV');
                            } else {
                                aOptions[7] = record.get('dbIdentifier');
                            }
                            aOptions[8] = record.get('origin');
                            aArrays.push(aOptions);
                            annot.remove(record);
                            //record.commitChanges();
                        });

                        var jsonModif = Ext.encode(aArrays);
                        //console.log("submit");
                        Ext.Ajax.request({
                            url: 'resources/src/php/modifNetwork/changeMetabolite.php',
                            params: {
                                Metabolites: jsonModif,
                                idUser: MetExplore.globals.Session.idUser,
                                idBioSource: MetExplore.globals.Session.idBioSource
                            },
                            success: function(response, opts) {
                                annot.removeAll();
                                var storeM = Ext.getStore('S_Metabolite');
                                MetExplore.globals.History.updateAllHistories();
                                //storeM.commitChanges();
                                /**
                                 * reste a faire : pouvoir faire commit uniquement sur les selected object
                                 */
                            },
                            failure: function(response, opts) {
                                Ext.MessageBox.alert('server-side failure with status code ' + response.status);
                            }
                        });
                        //remise a zero du tableau des modifs
                        //TabReactionChange = new Array;
                        //storeReaction.load();
                        win_ChangeMetabolite.hide();
                    }
                }, {
                    text: 'Cancel',
                    tooltip: 'cancel selected annotations',
                    handler: function() {
                        var annot = Ext.getStore('S_AnnotationMetabolite');
                        var records = gridChangeMetabolite.selModel.getSelection();
                        Ext.each(records, function(record) {
                            //console.log(record);
                            annot.remove(record);
                            /**
                             * reste a faire : remettre les old Value dans le store de la grid
                             */
                            //record.commitChanges();
                        });

                        win_ChangeMetabolite.hide();
                    }
                },

                {
                    text: 'Close',
                    handler: function() {
                        win_ChangeMetabolite.hide();
                    }
                }
            ]
        });
        win_ChangeMetabolite.show();
    },
    /*
     * 
     */
    /*
     * Multiple affectation affectation d'une valeur pour plusieurs ligne
     * s�lectionn�es rempli aussi le store Annotation qui permettra une ecriture
     * dans la base lors du commit
     */
    MetaboliteSetting: function(grid, record) {
        //console.log('setting');
        // /////////////////////////////////////////////////////
        var comboField = Ext.create('Ext.form.ComboBox', {
            emptyText: '-- Select Field --',
            width: 200,
            //store: 'S_MetaboliteCurationField',
            store: ['Monoisotopic Mass', 'Neutral Monoisotopic Mass', 'Average Mass', 'sideCompound'],
            /*{'nameDB':'weight','display':'Monoisotopic Mass'},
            {'nameDB':'exactNeutralMass','display':'Neutral Monoisotopic Mass'},
            {'nameDB':'averageMass','display':'Average Mass'},
            {'nameDB':'sideCompound','display':'sideCompound'}],*/
            displayField: 'display',
            valueField: 'nameDB',
            queryMode: 'local',
            typeAhead: true,
            margin: '5 5 5 5',
            // Selon champs selectionn� affichage de checkbox ou saisie
            // numerique
            onChange: function() {
                if (comboField.value == 'sideCompound') {
                    checkbox.show();
                    numvalue.hide();
                } else {
                    checkbox.hide();
                    numvalue.show();
                }
            }
        });

        var checkbox = new Ext.form.Checkbox({
            name: 'value1',
            fieldLabel: 'Value ',
            labelWidth: 40,
            checked: true,
            inputValue: '1',
            margin: '5 5 5 5'
        });
        var numvalue = new Ext.form.TextField({
            name: 'value2',
            fieldLabel: 'Value ',
            labelWidth: 40,
            inputValue: '99999',
            margin: '5 5 5 5'
        });

        var win_SettingMetabolite = Ext.create('Ext.Window', {
            items: [comboField, checkbox, numvalue],
            title: 'Settings',
            buttons: [{
                text: 'Submit',
                handler: function() {
                    // ajout des affectations dans le store d'annotation pour un
                    // futur commit
                    // ajout des affectations dans le grid
                    var field = 'sideCompound';
                    if (comboField.value == 'Monoisotopic Mass') field = 'weight';
                    else if (comboField.value == 'Neutral Monoisotopic Mass') field = 'exactNeutralMass';
                    else if (comboField.value == 'Average Mass') field = 'averageMass';

                    //console.log(field);
                    var gridMetabolite = Ext.getCmp('gridMetabolite');
                    var annot = Ext.getStore('S_AnnotationMetabolite');
                    var nb = gridMetabolite.getSelectionModel().getSelection().length;
                    for (var i = 0; i < nb; i++) {
                        var rec = gridMetabolite.getSelectionModel().getSelection()[i];
                        // si sideCompound affectation du contenu de
                        // checkbox sinon (weight) affectation
                        // contenu dans value
                        if (field == 'sideCompound') {
                            var result = annot.findBy(function(record) {
                                if ((record.get('idMysql') == rec.get('id')) & record.get('field') == field)
                                    return true;
                            });

                            if (result > -1) annot.removeAt(result);
                            var idR = rec.get('id');
                            //var field= comboField.value;
                            annot.add({
                                'id': idR + '_' + field,
                                'idMysql': idR,
                                'table': 'Metabolite',
                                'field': field,
                                'name': rec.get('name'),
                                'dbIdentifier': rec.get('dbIdentifier'),
                                'oldV': rec.get(field),
                                'newV': checkbox.value,
                                'origin': "db"
                            });
                            rec.set(field, checkbox.value);
                        } else {
                            var result = annot.findBy(function(record) {
                                if ((record.get('idMysql') == rec.get('id')) & record.get('field') == field)
                                    return true;
                            });

                            if (result > -1) annot.removeAt(result);

                            var idR = rec.get('id');
                            //var field= comboField.value;
                            //console.log(field);
                            annot.add({
                                'id': idR + '_' + field,
                                'idMysql': idR,
                                'table': 'Metabolite',
                                'field': field,
                                'name': rec.get('name'),
                                'dbIdentifier': rec.get('dbIdentifier'),
                                'oldV': rec.get(field),
                                'newV': numvalue.value,
                                'origin': "db"
                            });
                            console.log('rec:', rec);
                            console.log('field:', field);
                            console.log('field:', numvalue.value);
                            rec.set(field, numvalue.value);
                        }
                    }
                }
            }, {
                text: 'Close',
                handler: function() {
                    win_SettingMetabolite.hide();
                }
            }]
        });
        checkbox.hide();
        numvalue.hide();
        win_SettingMetabolite.show();
    },

    /*
    show columns of ids
    */
    showIdsMetabolite: function(){
        if (MetExplore.globals.Identifiers.S_IdentifiersMetabolite!=MetExplore.globals.Session.idBioSource) {
            var storeIds = Ext.getStore('S_IdentifiersMetabolite');
            var idBioSource = MetExplore.globals.Session.idBioSource;
            storeIds.proxy.extraParams.idBioSource = idBioSource
            storeIds.load({
                callback: function () {
                    MetExplore.globals.Identifiers.S_IdentifiersMetabolite = idBioSource;
                    //console.log(storeIds);
                }
            });
        }
        var comboField = Ext.create('Ext.form.ComboBox', {
            emptyText: '-- Select Field --',
            width: 200,
            store: MetExplore.globals.Identifiers.extDBNameMetabolite, // store:
            queryMode: 'local',
            multiSelect: true,
            typeAhead: true,
            margin: '5 5 100 5'
        });
        var storeM= Ext.getStore('S_Metabolite');
        var win = Ext.create('Ext.Window', {
            items: [comboField],
            title: 'Identifiers',
            buttons: [{
                text: 'Submit',
                handler: function() {
                    // ajout des identifiants
                    //console.log('add');
                    var field = comboField.value;
                    if (MetExplore.globals.Identifiers.S_IdentifiersMetabolite==MetExplore.globals.Session.idBioSource) {
                        storeM.addIdentifiersMetabolite(comboField.value);
                    } else {
                        var storeIds = Ext.getStore('S_IdentifiersMetabolite');
                        var idBioSource= MetExplore.globals.Session.idBioSource;
                        storeIds.proxy.extraParams.idBioSource = idBioSource
                        storeIds.load({
                            callback: function () {
                                storeM.addIdentifiersMetabolite(comboField.value);
                            }
                        });
                    }
                    win.hide();
                }
            }, {
                text: 'Close',
                handler: function() {
                    //console.log('close');
                    win.hide();
                }
            }]
        });
        win.show();
        win.focus();
        Ext.resumeLayouts(true);

    },



});