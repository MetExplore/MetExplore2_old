/**
 * formMap
 * 
 */

Ext.define('MetExplore.view.form.V_IdentifierMatcher', {
    extend: 'Ext.form.Panel',
    alias: 'widget.formIdentifierMatcher',
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
            fieldLabel: 'Class identifier for chebi',
            checked: false,
            labelWidth: 300,
            width: 800,
            labelAlign: 'left',
            helpText: 'class chebi'
        },

        {
            xtype: 'gridDataIdentifiers',
            height: 300,
            width: 700,
            border: true,
            //frame: true,
            //id			  : 'gridData',
            title: 'Copy/Paste in grid'

        },

    ],
    buttonAlign: 'left',
    buttons: [
        {
            text: 'Matcher Identifier',
            action: 'matchIdentifier'

        }, {
            text: 'Save Result in File',
            action: 'saveMatch',
            name: 'saveMatch',
            hidden: true,
            tag:0
            //disabled: true
        }
    ]
});