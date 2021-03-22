Ext.define('MetExplore.controller.C_gridReaction', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session'],
    views: ['grid.V_gridReaction', 'grid.V_gridReactionsInPathway'],
    stores: ['S_Reaction','S_IdentifiersDBName','S_Identifiersgit'],

    /*
     * Definition des evenements Definition des boutons dans barre tbarReaction
     * (definie dans view/grid/V_gridReaction
     */
    init: function() {
        //this.getS_ReactionStore().addListener('beforeload', MetExplore.globals.Session.removeVotesColumn, this);
        this.getS_ReactionStore().addListener('load', MetExplore.globals.Session.showHideLinkColumn, this);
        this.getS_ReactionStore().addListener('datachanged', this.UpdateTitle, this);
        this.getS_ReactionStore().addListener('filterchange', this.UpdateTitle, this);

        this.control({
            'gridReaction': {
                // afterrender:this.hideColumn,
                edit: this.editChange,
                viewready: MetExplore.globals.Session.showHideLinkColumn
                // selectionchange:this.editCommentBiblio,
                // itemcontextmenu:this.editMenu
                // sortchange:this.sortChange
            },
            'gridReaction checkcolumn': {
                checkchange: this.checkChange
            },
            'gridReaction button[action=ReactionChange]': {
                click: this.ReactionChange
            },
            'gridReaction button[action=ReactionDel]': {
                click: this.ReactionDel
            },
            'gridReaction button[action=ReactionSetting]': {
                click: this.ReactionSetting
            },
            'gridReaction button[action=ReactionComment]': {
                click: this.ReactionComment
            },
            'gridReaction button[action=ReactionBiblio]': {
                click: this.ReactionBiblio
            },
            'gridReaction button[action=statistics]': {
                click: this.showStatistics
            },
            'gridReaction button[action=showEquations]': {
                click: this.showEquations
            },
            'gridReaction button[action=geneAssociations]': {
                click: this.geneAssociations
            },
            'gridReaction button[action=showIdsReaction]': {
                click: this.showIdsReaction
            }
            // 'gridReactionsInPathway':{'viewInfos': this.openWindowInfo}
            // 'gridReaction
            // button[action=ReactionStatus]':{click:this.ReactionStatus}
        });

    },

    /**
     * Show the window statistics of the reaction
     * 
     * @param {}
     *            button
     */
    showStatistics: function(button) {
        var win_Statistics = new Ext.create('MetExplore.view.window.V_WindowStatisticsReaction');
        win_Statistics.show();
        win_Statistics.focus()
    },

    /*
     * Creation du tip pour chaque Reaction
     */
    // editTip: function(grid){

    // grid.tip = Ext.create('Ext.tip.ToolTip', {
    // target: grid.el,
    // delegate: grid.view.cellSelector,
    // trackMouse: true,
    // renderTo: Ext.getBody(),
    // listeners: {
    // beforeshow: function (tip) {
    // record = grid.view.getRecord(tip.triggerElement.parentNode);
    // myToolTipText = "<b>Substrats: </b>"+ record.get('leftR');
    // myToolTipText = myToolTipText + "<br/><b>Products: </b>"+
    // record.get('rightR');
    // myToolTipText = myToolTipText + "<br/><b>Status: </b>"+
    // record.get('statusName');
    // myToolTipText = myToolTipText + "<br/><b>Score: </b>"+
    // record.get('scoreName');
    // tip.update(myToolTipText);
    // }
    // }
    // });DBLink
    // //Ext.Msg.alert('test');
    // },

    /**
     * Lors d'une edition si changement mettre l'info dans le store annotation
     * pour futur commit
     */
    editChange: function(editor, e) {

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
            // ajout dans tableau : id/ field / oldValue / NewValue
            var annot = Ext.getStore('S_AnnotationReaction');
            var rec = e.record;
            var result = annot.findBy(function(record) {
                if ((record.get('idMysql') == rec.get('id')) & record.get('field') == e.field)
                    return true;
            });

            if (result > -1) annot.removeAt(result);

            var idR = rec.get('id');

            annot.add({
                'id': idR + '_' + e.field,
                'idMysql': idR,
                'table': 'Reaction',
                'field': e.field,
                'name': e.record.get('name'),
                'dbIdentifier': e.record.get('dbIdentifier'),
                'oldV': oldV,
                'newV': newV
            });
            // console.log('annot: ',annot);
        };

    },


    UpdateTitle: function(store) {

        var visibleElt = store.getCount(),
            total = store.getTotalCount();
        if (MetExplore.globals.Session.idBioSource == -1) total = 0;
        var grid = Ext.getCmp('gridReaction');

        grid.setTitle('Reactions (' + visibleElt + '/' + total + ')');
    },


    checkChange: function(col, id, val) {
        var store = Ext.getStore('S_Reaction');
        var rec = store.getAt(id);
        var oldV = !val;
        var idR = rec.get('id');
        var annot = Ext.getStore('S_AnnotationReaction');

        var result = annot.findBy(function(record) {
            if ((record.get('idMysql') == rec.get('id')) & record.get('field') == 'sideCompound')
                return true;
        });

        if (result > -1) annot.removeAt(result);
        annot.add({
            'id': idR + '_reversible',
            'idMysql': idR,
            'table': 'Reaction',
            'field': 'reversible',
            'name': rec.get('name'),
            'dbIdentifier': rec.get('dbIdentifier'),
            'oldV': oldV,
            'newV': val
        });

        MetExploreViz.onloadMetExploreViz(function() {
            metExploreViz.onloadSession(function() {
                metExploreViz.GraphNode.setIsReversibleById(idR, val);
                metExploreViz.GraphNetwork.tick('viz');
            });
        });
    },


    /*
     * Lors de selection mise a jour du panel Comment et Biblio
     */
    editCommentBiblio: function(grid, record) {
        var gridReaction = Ext.getCmp('gridReaction');

        var nb = gridReaction.getSelectionModel().getSelection().length;
        if (nb > 0) {
            // var rec= gridReaction.getSelectionModel().getSelection()[0];
            var rec = record[0];
            var storeC = Ext.getStore('S_Comment');
            storeC.proxy.extraParams.idReaction = rec.get('id');
            storeC.load();
            var storeB = Ext.getStore('S_Biblio');
            storeB.proxy.extraParams.idReaction = rec.get('id');
            storeB.load();
        }
        // console.log(nb);
    },


    /*
     * Executer lors du comit Reprend les donn�es stock�es dans store Annotation
     * Presente ces donn�es dans un grid envoi ces donn�es a changereaction.php
     * qui execute les update dans les tables
     */
    ReactionChange: function(grid, record) {
        //ajouté pour accelerer multi affectation
        Ext.suspendLayouts();

        var sm = Ext.create('Ext.selection.CheckboxModel');

        var gridChangeReaction = Ext.create('Ext.grid.Panel', {
            stateful: true,
            multiSelect: true,
            selModel: sm,
            store: 'S_AnnotationReaction',
            columns: [ // {text : 'id', hidden : true, dataIndex: 'id'},
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
        // gridChangeReaction.on('viewready', function(){
        // gridChangeReaction.selModel.doSelect(gridChangeReaction.store.data.items[0]);
        // });

        var form_ChangeReaction = Ext.create('Ext.FormPanel', {
            items: [gridChangeReaction]
        });

        var win_ChangeReaction = Ext.create('Ext.Window', {
            title: 'Change Reactions',
            items: [form_ChangeReaction],
            buttons: [{
                text: 'Submit',
                tooltip: 'submit selected annotations in database',

                handler: function(button) {
                    var gridComp = Ext.getCmp("gridReaction");
                    var myMask = new Ext.LoadMask({
                        target: gridComp,
                        msg: "Please wait..."
                    });
                    myMask.show();
                    var annot = Ext.getStore('S_AnnotationReaction');
                    // console.log(gridChangeReaction.selModel);
                    var records = gridChangeReaction.selModel.getSelection();

                    //console.log(Ext.Array.pluck(records,'data'));

                    // var aOptions;
                    // var aArrays = new Array;
                    // Ext.each(records, function(record) {
                    //     // console.log(record);
                    //     aOptions = new Array; // vide
                    //     aOptions[0] = record.get('idMysql');
                    //     aOptions[1] = record.get('table');
                    //     aOptions[2] = record.get('field');
                    //     aOptions[3] = record.get('name');
                    //     aOptions[4] = record.get('dbIdentifier');
                    //     aOptions[5] = record.get('oldV');
                    //     aOptions[6] = record.get('newV');
                    //     if (record.get('field') == 'dbIdentifier') {
                    //         aOptions[7] = record.get('oldV');
                    //     } else {
                    //         aOptions[7] = record.get('dbIdentifier');
                    //     }
                    //     aArrays.push(aOptions);
                    //     annot.remove(record);
                    //     // record.commitChanges();
                    // });
                    //
                    // console.log(aArrays);
                    //
                    // console.log(MetExplore.globals.StoreUtils.storeTojson('S_AnnotationReaction'));

                    var idUser = MetExplore.globals.Session.idUser;
                    var idBioSource = MetExplore.globals.Session.idBioSource;
                    var jsonModif = Ext.encode(Ext.Array.pluck(records,'data'));

                    // console.log(jsonModif);
                    Ext.Ajax.request({
                        url: 'resources/src/php/modifNetwork/changeReaction.php',
                        params: {
                            Reactions: jsonModif,
                            idUser: idUser,
                            idBioSource : idBioSource,
                        },
                        success: function(response, opts) {
                            annot.removeAll();
                            var storeR = Ext.getStore('S_Reaction');
                            MetExplore.globals.History.updateAllHistories();
                            // storeR.commitChanges();
                            /**
                             * reste a faire : pouvoir faire commit uniquement
                             * sur les selected object
                             */
                            myMask.hide();
                        },
                        failure: function(response, opts) {
                            Ext.MessageBox.alert('server-side failure with status code ' + response.status);
                            myMask.hide();
                        }
                    });
                    // remise a zero du tableau des modifs
                    // TabReactionChange = new Array;
                    // storeReaction.load();
                    win_ChangeReaction.hide();
                }
            }, {
                text: 'Cancel',
                tooltip: 'cancel selected annotations',
                handler: function() {
                    var annot = Ext.getStore('S_AnnotationReaction');
                    // console.log(gridChangeReaction.selModel);
                    var records = gridChangeReaction.selModel.getSelection();
                    Ext.each(records, function(record) {
                        // console.log(record);
                        annot.remove(record);
                        /**
                         * reste a faire : remettre les old Value dans le
                         * store de la grid
                         */
                    });

                    win_ChangeReaction.hide();
                }
            }, {
                text: 'Close',
                tooltip: 'close without change in database',
                handler: function() {
                    win_ChangeReaction.hide();
                }
            }]
        });
        win_ChangeReaction.show();
        Ext.resumeLayouts(true);
    },

    /*
     * Delete Reaction presente la liste des reactions selectionn�es et demande
     * confirmation Envoi les donn�es a deletereaction.php
     */
    ReactionDel: function(grid, record) {
        // console.log('del');
        // ajout liste des reactions selectionnees dans tableau
        var TabReactionDel = new Array;
        var gridReaction = Ext.getCmp('gridReaction');

        var nb = gridReaction.getSelectionModel().getSelection().length;
        for (var i = 0; i < nb; i++) {
            var rec = gridReaction.getSelectionModel().getSelection()[i];
            TabReactionDel.push([rec.get('id'), rec.get('name'), rec.get('dbIdentifier')]);
        }
        var storeDelReaction = new Ext.data.ArrayStore({
            data: TabReactionDel,
            fields: ['id', 'name', 'dbIdentifier']
        });

        // creation du gridPanel avec les delete
        var gridDelReaction = Ext.create('Ext.grid.Panel', {
            stateful: true,
            multiSelect: true,
            store: storeDelReaction,
            columns: [{
                    text: 'id',
                    hidden: true,
                    flex: 1,
                    sortable: false,
                    dataIndex: 'id'
                },
                {
                    text: 'name',
                    flex: 1,
                    sortable: false,
                    dataIndex: 'name'
                },
                {
                    text: 'dbIdentifier',
                    width: 250,
                    sortable: true,
                    dataIndex: 'dbIdentifier'
                }
            ],
            height: 350,
            width: 400
        });

        // creation d'un formulaire et de la fenetre associee
        // submit : creation d'un json du TabReactionDel
        // envoi du json en parametre au php deletereaction.php
        var form_DelReaction = Ext.create('Ext.FormPanel', {
            items: [gridDelReaction]
        });
        var win_DelReaction = Ext.create('Ext.Window', {
            title: 'Delete Reactions',
            items: [form_DelReaction],
            buttons: [{
                text: 'Submit',
                handler: function(widget, event) {
                    var jsonDel = Ext.encode(TabReactionDel);
                    Ext.Ajax.request({
                        url: 'resources/src/php/modifNetwork/deleteReaction.php',
                        params: {
                            Reactions: jsonDel,
                            idBioSource: MetExplore.globals.Session.idBioSource
                        },
                        success: function(response, opts) {
                            // recharge les reactions du grid
                            win_DelReaction.close();
                            gridReaction.getStore().reload();
                            Ext.getCmp('panelBioSource').down('gridBioSourceInfo').getStore().reload();

                            MetExplore.globals.History.updateAllHistories();
                        }
                    });
                }
            }, {
                text: 'Close',
                handler: function() {
                    win_DelReaction.close();
                }
            }]
        });
        win_DelReaction.show();
    },

    /*
     * Multiple affectation affectation d'une valeur pour plusieurs ligne
     * s�lectionn�es rempli aussi le store Annotation qui permettra une ecriture
     * dans la base lors du commit
     */
    ReactionSetting: function(grid, record) {

        Ext.suspendLayouts();
        // /////////////////////////////////////////////////////
        var comboField = Ext.create('Ext.form.ComboBox', {
            emptyText: '-- Select Field --',
            width: 200,
            store: ['upperBound', 'lowerBound', 'reversible'], // store:
            // ['upperBound','lowerBound','hole','reversible'],
            queryMode: 'local',
            typeAhead: true,
            margin: '5 5 5 5',
            // Selon champs selectionn� affichage de checkbox ou saisie
            // numerique
            onChange: function() {
                if (comboField.value == 'hole' || comboField.value == 'reversible') {
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

        var win_SettingReaction = Ext.create('Ext.Window', {
            items: [comboField, checkbox, numvalue],
            title: 'Settings',
            buttons: [{
                text: 'Submit',
                handler: function() {
                    // ajout des affectations dans le store d'annotation pour un
                    // futur commit
                    // ajout des affectations dans le grid
                    var gridReaction = Ext.getCmp('gridReaction');
                    var annot = Ext.getStore('S_AnnotationReaction');
                    var nb = gridReaction.getSelectionModel().getSelection().length;
                    for (var i = 0; i < nb; i++) {
                        var rec = gridReaction.getSelectionModel().getSelection()[i];
                        // si hole ou reversible affectation du contenu de
                        // checkbox sinon (upperou lowerbound affectation
                        // contenu dans value
                        if (comboField.value == 'hole' || comboField.value == 'reversible') {
                            //recherche si pas deja affectation dans annot
                            var result = annot.findBy(function(record) {
                                if ((record.get('idMysql') == rec.get('id')) & record.get('field') == comboField.value)
                                    return true;
                            });

                            if (result > -1) annot.removeAt(result);
                            var idR = rec.get('id');
                            var field = comboField.value;
                            annot.add({
                                'id': idR + '_' + field,
                                'idMysql': idR,
                                'table': 'Reaction',
                                'field': field,
                                'name': rec.get('name'),
                                'dbIdentifier': rec.get('dbIdentifier'),
                                'oldV': rec.get(comboField.value),
                                'newV': checkbox.value
                            });
                            rec.set(comboField.value, checkbox.value);
                        } else {

                            var result = annot.findBy(function(record) {
                                if ((record.get('idMysql') == rec.get('id')) & record.get('field') == comboField.value)
                                    return true;
                            });

                            if (result > -1) annot.removeAt(result);

                            var idR = rec.get('id');
                            var field = comboField.value;
                            annot.add({
                                'id': idR + '_' + field,
                                'idMysql': idR,
                                'table': 'Reaction',
                                'field': comboField.value,
                                'name': rec.get('name'),
                                'dbIdentifier': rec.get('dbIdentifier'),
                                'oldV': rec.get(comboField.value),
                                'newV': numvalue.value
                            });
                            rec.set(comboField.value, numvalue.value);
                        }
                    }
                }
            }, {
                text: 'Close',
                handler: function() {
                    win_SettingReaction.hide();
                }
            }]
        });
        checkbox.hide();
        numvalue.hide();
        win_SettingReaction.show();
        Ext.resumeLayouts(true);

    },

    /*
     * Ajout de commentaire pour plusieurs reactions selectionnees
     */
    ReactionComment: function(grid, record) {
        //console.log('comment');
        // ajout liste des reactions selectionnees dans tableau
        var TabReaction = new Array;
        var gridReaction = Ext.getCmp('gridReaction');

        var nb = gridReaction.getSelectionModel().getSelection().length;
        for (var i = 0; i < nb; i++) {
            var rec = gridReaction.getSelectionModel().getSelection()[i];
            if (i == 0) var idReaction = rec.get('id');
            TabReaction.push([rec.get('id')]);
        }
        /*
         * creation d'un formulaire et de la fenetre associee submit : creation
         * d'un json du TabReaction envoi du json en parametre au php
         * insertcomment.php
         */
        var form_ReactionComment = Ext.create('Ext.FormPanel', {
            bodyPadding: 5,
            items: [{
                xtype: 'textareafield',
                name: 'comment',
                fieldLabel: 'Comment'
            }]
        });

        var win_ReactionComment = Ext.create('Ext.Window', {
            title: 'Add Comment',
            margins: '5 5 5 5',
            items: [form_ReactionComment],
            buttons: [{
                text: 'Submit',
                handler: function(widget, event) {
                    var jsonReaction = Ext.encode(TabReaction);
                    // console.log(TabReaction);

                    var idUser = MetExplore.globals.Session.idUser;

                    form_ReactionComment.getForm().submit({
                        method: 'POST',
                        url: 'resources/src/php/modifNetwork/insertComment.php',
                        params: {
                            Reactions: jsonReaction,
                            idUser: idUser
                        },
                        success: function() {
                            // recharge les comments de la reaction
                            var storeComment = Ext.getStore('S_Comment');
                            storeComment.proxy.extraParams.idUser = idUser;
                            storeComment.proxy.extraParams.idReaction = idReaction;
                            storeComment.load();
                        }
                    });
                    win_ReactionComment.hide();
                }
            }, {
                text: 'Close',
                handler: function() {
                    win_ReactionComment.hide();
                }
            }]
        });
        form_ReactionComment.getForm().reset();
        win_ReactionComment.show();

    },

    /*
     * Ajout de biblio pour plusieurs reactions selectionnees
     */
    ReactionBiblio: function(grid, record) {
        // console.log('biblio');
        // ajout liste des reactions selectionnees dans tableau
        var TabReaction = new Array;
        var gridReaction = Ext.getCmp('gridReaction');

        var nb = gridReaction.getSelectionModel().getSelection().length;
        for (var i = 0; i < nb; i++) {
            var rec = gridReaction.getSelectionModel().getSelection()[i];
            if (i == 0) var idReaction = rec.get('id');
            TabReaction.push([rec.get('id')]);
        }

        // creation d'un formulaire et de la fenetre associee
        // submit : creation d'un json du TabReaction
        // envoi du json en parametre au php insertbiblio.php
        var form_ReactionBiblio = Ext.create('Ext.FormPanel', {
            bodyPadding: 5,
            items: [{
                    xtype: 'numberfield',
                    name: 'pubmedid',
                    fieldLabel: 'Pubmed Id '
                },
                {
                    xtype: 'textfield',
                    name: 'title',
                    fieldLabel: 'Title '
                },
                {
                    xtype: 'textfield',
                    name: 'authors',
                    fieldLabel: 'Authors '
                },
                {
                    xtype: 'textfield',
                    name: 'Journal',
                    fieldLabel: 'Journal '
                },
                {
                    xtype: 'textfield',
                    name: 'Year',
                    fieldLabel: 'Year '
                }
            ]
        });


        var win_ReactionBiblio = Ext.create('Ext.Window', {
            title: 'Add Biblio',
            margins: '5 5 5 5',
            items: [form_ReactionBiblio],
            buttons: [{
                text: 'Submit',
                handler: function(widget, event) {

                    var idUser = MetExplore.globals.Session.idUser;
                    var jsonReaction = Ext.encode(TabReaction);
                    form_ReactionBiblio.getForm().submit({
                        method: 'POST',
                        url: 'resources/src/php/modifNetwork/insertBiblio.php',
                        params: {
                            Reactions: jsonReaction,
                            idUser: idUser
                        },
                        success: function() {
                            // recharge les ref de la reaction
                            var storeBiblio = Ext.getStore('S_Biblio');
                            storeBiblio.proxy.extraParams.idUser = idUser;
                            storeBiblio.proxy.extraParams.idReaction = idReaction;
                            storeBiblio.load();
                        }
                    });

                    win_ReactionBiblio.hide();
                }
            }, {
                text: 'Close',
                handler: function() {
                    win_ReactionBiblio.hide();
                }
            }]
        });
        form_ReactionBiblio.getForm().reset();
        win_ReactionBiblio.show();

    },

    /*
     * Ajout de status pour plusieurs reactions selectionnees
     */
    ReactionStatus: function(grid, record) {
        console.log('status');

        var comboStatusType = Ext.create('Ext.form.ComboBox', {
            name: 'idStatusType',
            displayField: 'name',
            valueField: 'idStatusType',
            width: 200,
            // id :'idStatusType',
            store: 'S_StatusType',
            queryMode: 'local',
            // typeAhead: true,
            emptyText: '-- Select Status Type--',
            margin: '5 5 5 5',
            allowBlank: false,
            // lors du changement de type, chargement de la liste des status
            // possibles
            onChange: function(id) {
                var storeStatusListe = Ext.getStore('S_StatusListe');
                storeStatusListe.proxy.extraParams.idStatusType = id;
                storeStatusListe.load();
            }
        });

        // var descStatus= storeStatusListe[0].description;
        var comboStatus = Ext.create('Ext.form.ComboBox', {
            name: 'idStatus',
            displayField: 'name',
            valueField: 'idStatus',
            width: 200,
            // id :'idStatus',
            store: 'S_StatusListe',
            queryMode: 'local',
            // typeAhead: true,
            emptyText: '-- Select Status --',
            margin: '5 5 5 5',
            allowBlank: false,
            onChange: function(id) {
                // console.log(id)
                // descStatus= storeStatusListe[id].description;
            }
        });
        // ajout liste des reactions selectionnees dans tableau
        var TabReaction = new Array;
        var gridReaction = Ext.getCmp('gridReaction');

        var nb = gridReaction.getSelectionModel().getSelection().length;
        for (var i = 0; i < nb; i++) {
            var rec = gridReaction.getSelectionModel().getSelection()[i];
            if (i == 0) var idReaction = rec.get('id');
            TabReaction.push([rec.get('id')]);
        }

        var storeStatus = Ext.getStore('S_StatusReaction');
        storeStatus.proxy.extraParams.idStatusType = 1;
        // storeStatus.load();
        var storeStatusListe = Ext.getStore('S_StatusListe');
        storeStatusListe.load();
        var storeStatusType = Ext.getStore('S_StatusType');
        storeStatusType.load();


        var form_ReactionStatus = Ext.create('Ext.FormPanel', {
            bodyPadding: 5,
            items: [comboStatusType, comboStatus]
        });

        var win_ReactionStatus = Ext.create('Ext.Window', {
            margins: '5 5 5 5',
            title: 'Modify Status',
            items: [form_ReactionStatus],
            buttons: [{
                text: 'Submit',
                handler: function(widget, event) {

                    var idUser = MetExplore.globals.Session.idUser;
                    var jsonReaction = Ext.encode(TabReaction);
                    form_ReactionStatus.getForm().submit({
                        method: 'POST',
                        url: 'resources/src/php/modifNetwork/insertStatus.php',
                        params: {
                            Reactions: jsonReaction,
                            idUser: idUser
                        },
                        success: function() {
                            // recharge les status de la reaction
                            var storeReaction = Ext.getStore('S_Reaction');
                            storeReaction.load();
                        }
                    });
                    // form_ReactionStatus.getForm().reset();
                    win_ReactionStatus.hide();
                }
            }, {
                text: 'Close',
                handler: function() {
                    win_ReactionStatus.hide();
                }
            }]
        });
        form_ReactionStatus.getForm().reset();
        win_ReactionStatus.show();

    },

    showEquations: function(button) {
        //Ext.suspendLayouts();
        //var grid = button.up('gridReaction');
        var gridR = Ext.getCmp('gridReaction');
        //gridR.setLoading(true);
        if (gridR) {
            var indexName = gridR.headerCt.items.findIndex('dataIndex', 'eqName');
            var indexDB = gridR.headerCt.items.findIndex('dataIndex', 'eqDB');
            var indexForm = gridR.headerCt.items.findIndex('dataIndex', 'eqForm');

            gridR.columns[indexName].setVisible(true);
            gridR.columns[indexDB].setVisible(true);
            gridR.columns[indexForm].setVisible(true);

            gridR.getView().refresh();
        }
        //gridR.setLoading(false);
        // grid.setLoading(true);
        // var storeReaction = Ext.getStore('S_Reaction');
        // /*		var ids = [];
        // 		storeReaction.each(function(record) {
        // 			ids.push(record.get('id'));
        // 		});
        // 		*/
        // Ext.Ajax.request({
        //     url: 'resources/src/php/dataNetwork/getEquations.php',
        //     params: {
        //         //idReactions: Ext.encode(ids),
        //         idBioSource: MetExplore.globals.Session.idBioSource
        //     },
        //     timeout: 1200000,
        //     failure: function(response, opts) {
        //         Ext.MessageBox
        //             .alert('Ajax error',
        //                 'get equations failed: Ajax error!');
        //     },
        //     success: function(response, opts) {
        //         var repJson = null;
        //
        //         try {
        //             repJson = Ext.JSON.decode(response.responseText);
        //         } catch (exception) {
        //             Ext.MessageBox
        //                 .alert('Ajax error',
        //                     'get equations failed: JSON incorrect!');
        //             // 					var win = this.up('window');
        //             // 					if (win) {
        //             // 						win.close();
        //             // 					}
        //         }
        //
        //         if (repJson != null && repJson['success']) {
        //             data = repJson["data"];
        //             //Set new equation values on store:
        //             _.forEach(data, function(value, key) {
        //                 var rec = storeReaction.getById(key);
        //                 if (rec) {
        //                     rec.set('eqName', value["eqName"]);
        //                     rec.set('eqDB', value["eqDB"]);
        //                     rec.set('eqForm', value["eqForm"]);
        //                 }
        //                 //console.log(key);
        //             });
        //
        //             // storeReaction.each(function(record) {
        //             //     record.set('eqName', data[record.get('id')]["eqName"]);
        //             //     record.set('eqDB', data[record.get('id')]["eqDB"]);
        //             //     record.set('eqForm', data[record.get('id')]["eqForm"]);
        //             //     record.commit();
        //             // });
        //             //Define the new column
        //             grid.setLoading(false);
        //             dataIndex = ['eqName', 'eqDB', 'eqForm'];
        //             header = ["Equation (names)", "Equation (identifiers)", "Equation (formulas)"];
        //             for (var it = 0; it < dataIndex.length; it++) {
        //                 grid.createCol(header[it], dataIndex[it], false); //Bug : we must wreate columns hidden, and then show them
        //                 //grid.headerCt.getGridColumns()[grid.indexCol(dataIndex[it])].setVisible(true);
        //                 grid.doLayout();
        //             }
        //             //mettre non visible les equations avec nom & formules
        //             //reste accessibles dans le menu contextuel
        //             //storeReaction.commitChanges();
        //             grid.doLayout();
        //             grid.headerCt.getGridColumns()[grid.indexCol(dataIndex[0])].hidden = false; //.setVisible(false);
        //             grid.headerCt.getGridColumns()[grid.indexCol(dataIndex[1])].hidden = true;
        //             grid.headerCt.getGridColumns()[grid.indexCol(dataIndex[2])].hidden = true;
        //
        //         } else {
        //             Ext.MessageBox
        //                 .alert(
        //                     'get equations failed');
        //             grid.setLoading(false);
        //         }
        //         //Ext.resumeLayouts(true);
        //         grid.setLoading(false);
        //         //grid.doLayout();
        //     },
        //     scope: this
        // });

    },


    /* Add aliases

     */
    addAlias: function() {

    },
    /**
     * Displays the GPR in a new column
     * 
     * @param {}
     *            button
     */
    geneAssociations: function(button) {


        var idBioSource = MetExplore.globals.Session.idBioSource;

        Ext.Ajax.request({
            url: 'resources/src/php/dataNetwork/getGPRs.php',
            params: {
                idBioSource: idBioSource
            },
            failure: function(response, opts) {
                Ext.MessageBox
                    .alert('MetExplore error',
                        'Server error while getting the gene associations');

            },
            success: function(response, opts) {


                var repJson = null;

                try {
                    repJson = Ext.decode(response.responseText);
                } catch (exception) {
                    Ext.MessageBox
                        .alert('MetExplore error',
                            'Get GPRs failed (JSON incorrect!)');
                    var win = button.up('window');
                    if (win) {
                        win.close();
                    }
                }

                if (repJson != null && repJson['success']) {
                    var data = repJson["data"];
                    // Set GPRS on store :

                    storeObject.each(function(record) {
                        record.set('gpr', data[record.get('id')])
                    });

                    // Define the new column
                    var col = Ext.create('Ext.grid.column.Column', {
                        header: 'GPR',
                        hidden: true,
                        dataIndex: 'gpr',
                        filterable: true,
                        sortable: false
                    });

                    grid.addCol(col, 'gpr');
                    var index = grid.indexCol('gpr');
                    var cols = grid.headerCt.getGridColumns()[grid.indexCol('gpr')].setVisible(true);
                    grid.setLoading(false);



                } else {
                    Ext.MessageBox
                        .alert(
                            'Get GPRs failed',
                            repJson['message']);
                }
            }
        });
    },

    /*
show columns of ids
*/
    showIdsReaction: function(){
        if (MetExplore.globals.Identifiers.S_IdentifiersReaction!=MetExplore.globals.Session.idBioSource) {
            var storeIds = Ext.getStore('S_IdentifiersReaction');
            var idBioSource = MetExplore.globals.Session.idBioSource;
            storeIds.proxy.extraParams.idBioSource = idBioSource
            storeIds.load({
                callback: function () {
                    MetExplore.globals.Identifiers.S_IdentifiersReaction = idBioSource;
                    //console.log(storeIds);
                }
            });
        }
        var comboField = Ext.create('Ext.form.ComboBox', {
            emptyText: '-- Select Field --',
            width: 200,
            store: MetExplore.globals.Identifiers.extDBNameReaction, // store:
            queryMode: 'local',
            multiSelect: true,
            typeAhead: true,
            margin: '5 5 100 5'
        });
        var storeR= Ext.getStore('S_Reaction');
        var win = Ext.create('Ext.Window', {
            items: [comboField],
            title: 'Identifiers',
            buttons: [{
                text: 'Submit',
                handler: function() {
                    // ajout des identifiants
                    //console.log('add');
                    var field = comboField.value;
                    if (MetExplore.globals.Identifiers.S_IdentifiersReaction==MetExplore.globals.Session.idBioSource) {
                        storeR.addIdentifiersReaction(comboField.value);
                    } else {
                        var storeIds = Ext.getStore('S_IdentifiersReaction');
                        var idBioSource= MetExplore.globals.Session.idBioSource;
                        storeIds.proxy.extraParams.idBioSource = idBioSource
                        storeIds.load({
                            callback: function () {
                                storeG.addIdentifiersReaction(comboField.value);
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