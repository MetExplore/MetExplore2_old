/**
 * formMap
 * 
 */

Ext.define('MetExplore.view.form.V_MapMulti', {
    extend: 'Ext.form.Panel',
    alias: 'widget.formMapMulti',
    requires: ['MetExplore.view.grid.V_gridDataIdentifiers'],

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
            xtype: 'checkboxfield',
            name: 'header',
            fieldLabel: 'Consider first row as header of columns',
            checked: true,
            labelWidth: 300,
            width: 800,
            labelAlign: 'left',
            helpText: 'header'
        },
        {
            xtype: 'checkboxfield',
            name: 'classmapping',
            fieldLabel: 'Class mapping',
            checked: false,
            labelWidth: 300,
            width: 800,
            labelAlign: 'left',
            helpText: 'class mapping'
        },
        {
            xtype: 'textfield',
            name: 'mapping_name',
            afterLabelTextTpl: '<img src="./resources/icons/info.svg" data-qtip="enter name" width="20" height="20" style="float:right">', //style="float:right"
            fieldLabel: 'Mapping name',
            value: '',
            allowBlank: false
            //helpText: 'name'
        },
        {
            xtype: 'gridDataIdentifiers',
            height: 300,
            width: 700,
            //frame: true,
            //id			  : 'gridData',
            title: 'Copy/Paste in grid'

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
    buttons: [
        {
            text: 'Map',
            action: 'mapMulti'

        }, {
            text: 'Save Mapping in File',
            action: 'exportJsonFile',
            name: 'save_mapping',
            hidden: true
            //disabled: true
        }
    ]
});