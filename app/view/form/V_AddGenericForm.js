/**
 * addGenericForm
 */
Ext.define('MetExplore.view.form.V_AddGenericForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.addGenericForm',

    // frame: true,
    layout: 'auto',


    defaultType: 'textfield',
    buttonAlign: 'left',
    //float:'right',
    monitorValid: true,

    constructor: function(params) {

        config = this.config;

        var re = new RegExp("^add(.+)Form");
        var result = re.exec(this.xtype);

        var element = result[1];

        if (params.passedRecord) {
            config.passedRecord = params.passedRecord;
            config.buttons = [{
                text: 'Save',
                action: 'update' + element,
                formBind: true
            }, {
                text: 'Save, and go back to table',
                action: 'update' + element,
                formBind: true
            }];
        } else {
            config.passedRecord = null;
            config.buttons = [{
                text: 'Save',
                formBind: true,
                width: 100,
                action: 'add' + element
            }, {
                text: 'Save, and go back to table',
                action: 'add' + element,
                formBind: true
            }];
        }

        this.callParent([config]);


    }
});