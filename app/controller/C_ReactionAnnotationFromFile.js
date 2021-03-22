/**
 * C_Add_TabFile
 * 
 */

Ext.define('MetExplore.controller.C_ReactionAnnotationFromFile', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session'],

    config: {
        views: ['form.V_ReactionAnnotationFromFile']
    },

    /**
     * init function Checks the changes on the bioSource selection
     * 
     */
    init: function() {
        this.control({
            'reactionAnnotationFromFile button[action=uploadFile]': {
                click: this.uploadFile
            },
            'reactionAnnotationFromFile button[action=validateForm]': {
                click: this.validateForm
            },
            'reactionAnnotationFromFile selectTabDataColumn': {
                select: this.changeGridHeader
            }
        });
    },


    uploadFile: function(button) {


        var formVal = button.up('form').getValues();
        var fname = button.up('form').down('fileuploadfield').getRawValue();

        if (fname.substr((~-fname.lastIndexOf(".") >>> 0) + 2).toLowerCase() === 'csv') {

            var form = button.up('form').getForm();
            var grid = button.up('panel').down('gridAddReactionFromFile');
            form.submit({
                url: 'resources/src/php/fileCSV-custom-upload.php',
                waitMsg: 'Uploading your csv File...',
                params: formVal,
                success: function(fp, o) {

                    var storeData = grid.getStore();
                    storeData.removeAll();
                    storeData.proxy.extraParams.fileName = o.result.rows[1];
                    storeData.proxy.extraParams.separator = formVal['separator'];
                    storeData.proxy.extraParams.delimiter = formVal['textSep'];
                    storeData.proxy.extraParams.skip = formVal['skip'];
                    storeData.proxy.extraParams.comment = formVal['comment'];

                    storeData.load({
                        scope: button,
                        callback: function(records, operation, success) {
                            this.up('fieldset').up('fieldset').collapse();
                        }
                    });
                },
                failure: function(form, action) {
                    switch (action.failureType) {
                        case Ext.form.action.Action.CLIENT_INVALID:
                            Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                            break;
                        case Ext.form.action.Action.CONNECT_FAILURE:
                            Ext.Msg.alert('Failure', 'Ajax communication failed');
                            break;
                        case Ext.form.action.Action.SERVER_INVALID:
                            Ext.Msg.alert('Failure', action.result.msg);
                    }
                }
            });

        } else {
            Ext.MessageBox.alert('Error On File', 'The file you are trying to upload is not a CSV file.');
        }


    },



    /**
     * 
     */
    validateForm: function(button) {
        var me = this;

        var panel = Ext.getCmp('tabPanel').getActiveTab();
        var grid = panel.down('gridAddReactionFromFile');

        if (grid.getStore().getCount() < 2) {

            Ext.MessageBox.alert('Warning: Empty Table', "You need to upload a file in order to fill the table.");

            return;
        }



        var eqIsPresent = false;
        var dbIdIsPresent = false;

        for (var i = 1; i < 27; i++) {
            var header = grid.columns[i].text;
            if (header === "Reaction Equation") {
                eqIsPresent = true;
            } else if (header === "Identifier") {
                dbIdIsPresent = true;
            }
        }

        if (!eqIsPresent || !dbIdIsPresent) {
            Ext.MessageBox.alert('Warning: required column not defined', "You need to define which columns define the reactions' Identifier and Equation.");
            return;
        }

        var json = me.checkData(panel);

        if (!json.success) {
            Ext.MessageBox.alert('Warning: Invalid Data', json.msg);
            return;
        }


        me.doAnnotation(button);
    },


    checkData: function(panel) {

        var jsonresult = {
            success: true,
            msg: ''
        };

        var form = panel.down('form'),
            formValues = form.getForm().getValues(),
            grid = panel.down('gridAddReactionFromFile'),
            tabStore = grid.getStore(),
            eqIndex;

        var errIndexes = new Array;

        for (var i = 1; i < 27; i++) {
            var header = grid.columns[i].text;
            if (header === "Reaction Equation") {
                eqIndex = i - 1;
                break;
            }
        }


        tabStore.each(function(rec) {
            var formula = rec.get("tab" + eqIndex);

            if (formula.indexOf(formValues['irrReaction']) === -1 && formula.indexOf(formValues['revReaction']) === -1) {
                jsonresult.success = false;
                jsonresult.msg += "Reaction sign not understood at line " + (rec.index + 1) + "</br>";
            }

        });

        return jsonresult;
    },




    /**
     * add context menu on grid
     * @param {} button
     */
    /**
     * @method matchp
     * Recupere le contenu du formulaire de match data tab
     * Execute match
     * Copie les data dans Store Annotation
     */
    doAnnotation: function(button) {

        var ctrl = this;
        /**
         * recuperation info de la grid
         */
        var panel = Ext.getCmp('tabPanel').getActiveTab();

        var grid = panel.down('gridAddReactionFromFile');

        var store = grid.getStore();

        /**
         * Encode the columns config to be able to use it to filter the data sent to the server
         */
        var configTab = new Array;
        var configHash = {};

        var regexp1 = new RegExp('^Col_');

        for (var i = 1; i < 27; i++) {
            var header = grid.columns[i].text;
            if (regexp1.test(header) | header == "Not Used") {
                configHash["tab" + (i - 1)] = 0;
            } else {
                configHash["tab" + (i - 1)] = 1;
                configTab.push(header);
            }

        }

        var dataTab = new Array;
        store.each(function(dataTabFile) {
            var recordData = new Array;

            for (var prop in dataTabFile.data) {
                if (configHash[prop] == 1) {
                    recordData.push(dataTabFile.data[prop]);
                }
            }
            dataTab.push(recordData);
        });


        var formValues = button.up('form').getForm().getValues();

        var idBioSource = MetExplore.globals.Session.idBioSource;
        formValues['idBioSource'] = idBioSource;

        var ibDB = MetExplore.globals.Session.idDB;
        formValues['idDB'] = ibDB;

        var idUser = MetExplore.globals.Session.idUser;
        formValues['idUser'] = idUser;

        var mail = MetExplore.globals.Session.mailUser;
        formValues['mail'] = mail;

        var formVal = Ext.encode(formValues);

        var Data = {};
        Data['conf'] = configTab;
        Data['data'] = dataTab;

        var formData = Ext.encode(Data);

        Ext.Ajax.request({
            url: 'resources/src/php/modifNetwork/AddTabData.php',
            params: {
                formVal: formVal,
                formData: formData
            },
            reader: {
                type: 'json',
                successProperty: 'success'
            },
            success: function(response, opts) {
                var json = Ext.decode(response.responseText);
                if (json.success) {
                    Ext.MessageBox.alert("Application message", json.message);
                } else {
                    Ext.MessageBox.alert("Application message", json.message);
                    Ext.getCmp('logout_user_button').fireEvent('click', Ext.getCmp('logout_user_button'));
                }
            },
            failure: function(response, opts) {
                Ext.MessageBox.alert('server-side failure with status code ' + response.status);
            }
        });

    },


    changeGridHeader: function(combo, records, eOpts) {

        var grid = combo.up().up().prev('gridAddReactionFromFile'),
            newheader = combo.name;

        if (newheader !== 'Not Used') {
            for (var i in grid.columns) {
                if (grid.columns[i].text === newheader) {
                    grid.columns[i].setText('Not Used');
                }
            }
        }

        for (var i in records) {
            grid.columns[records[i].get('index')].setText(newheader);
        }

    }
});