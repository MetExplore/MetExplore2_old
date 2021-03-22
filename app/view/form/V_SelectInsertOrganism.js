/**
 * selectInsertOrganism
 * @description Insert New Organism
 */
Ext.define("MetExplore.view.form.V_SelectInsertOrganism", {
    extend: "Ext.form.Panel",
    alias: "widget.selectInsertOrganism",
    layout: "vbox",
    border: false,
    requires: ["MetExplore.view.form.V_SelectOrganism"],
    items: [{
            fieldLabel: "Organism name*",
            xtype: "selectOrganism",
            name: "idOrg",
            width: 400,
            allowBlank: false,
            margin: "0 10 0 0",
        },
        {
            xtype: "button",
            buttonAlign: "right",
            text: "New Organism",
            handler: function(addButton) {
                var form_Organism = Ext.create("Ext.FormPanel", {
                    items: [{
                        xtype: "textfield",
                        fieldLabel: "Organism Name ",
                        name: "nameOrganism",
                        width: 400,
                        allowBlank: false,
                    }, ],
                    bodyPadding: 5,
                });
                var win_Organism = Ext.create("Ext.Window", {
                    title: "New organism",
                    width: 600,
                    height: 300,
                    items: [form_Organism],
                    buttons: [{
                            text: "Insert",
                            handler: function(widget, event) {
                                form_Organism.getForm().submit({
                                    method: "POST",
                                    url: "resources/src/php/modifNetwork/insertOrganism.php",
                                    success: function(fp, o) {
                                        var storeOrganism = addButton
                                            .prev("selectOrganism")
                                            .getStore();
                                        storeOrganism.load({
                                            callback: function(records, operation, success) {
                                                var i = storeOrganism.findExact(
                                                    "id",
                                                    o.result.data["id"]
                                                );
                                                var panel = Ext.getCmp("tabPanel");
                                                var form = panel.getActiveTab();
                                                var sel = form.query("selectOrganism")[0];
                                                sel.select(sel.store.data.items[i]);
                                            },
                                        });
                                    },
                                });
                                win_Organism.hide();
                            },
                        },
                        {
                            text: "Cancel",
                            handler: function() {
                                win_Organism.hide();
                            },
                        },
                    ],
                });
                win_Organism.show();
            },
        },
    ],
});