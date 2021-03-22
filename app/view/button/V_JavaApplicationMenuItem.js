/**
 * Button to display the java application parameters
 */

Ext.define('MetExplore.view.button.V_JavaApplicationMenuItem', {
    extend: 'Ext.menu.Item',
    alias: 'widget.ja_menu_item',
    tooltip: '',
    action: "display_java_application_params",

    config: {
        java_application: null
    }

});