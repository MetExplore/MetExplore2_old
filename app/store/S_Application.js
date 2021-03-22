/**
 * S_Application
 * model : MetExplore.model.Application
 * Store in a json all the hierarchy packages->functions
 */
Ext.define('MetExplore.store.S_Application', {
    extend: 'Ext.data.Store',

    //requires:["MetExplore.view.button.V_JavaApplicationMenuItem"],

    model: 'MetExplore.model.Application',
    id: 'application',
    proxy: {
        type: 'ajax',
        url: 'resources/src/php/application_binding/listApplications.php',
        reader: {
            type: 'json',
            root: 'functions',
            successProperty: 'success'
        }
    },

    autoLoad: true,
    listeners: {
        /**
         * @event load
         * @param store
         * @param records
         * @param success
         * @param operation
         * @param opts
         */
        load: function(store, records, success, operation, opts) {
            // Get the menuPanel
            var menuPanel = Ext.ComponentQuery.query("bannerPanel")[0];
            if (menuPanel)
                var toolbar = menuPanel.down("toolbar");

            /*
             * add java
             */
            Ext.Array.each(records, function(record) {
                var application_name = record.get("name");
                var package_name = record.get("package");
                var java_class = record.get("java_class");
                var description = record.get("description");
                var require_login = record.get("require_login");
                var require_bioSource = record.get("require_bioSource");
                var require_admin = record.get("require_admin");

                var rec = store.findRecord('component', application_name, 0,
                    false, true, true);
                var visible = true;
                if (rec)
                    visible = false;
                var rec = store.findRecord('component', package_name, 0, false,
                    true, true);
                if (rec)
                    visible = false;

                if (require_admin == false && visible == true) {

                    // checks if the package tab already exists
                    var packageTab = Ext.ComponentQuery
                        .query('bannerPanel toolbar [text="' + package_name +
                            '"]')[0];


                    if (typeof packageTab === "undefined") {

                        // Insert menu after toolbox
                        toolbar.insert(3,{

                            scale: 'large',
                            style: 'webkit-border-radius: 0px; '+
                                '    -moz-border-radius: 0px;'+
                                '    -ms-border-radius: 0px;'+
                                '    -o-border-radius: 0px;'+
                                '    border-radius: 0px; ',
                            iconCls: package_name.toLowerCase()+"white",
                            text: package_name,
                            menu: {
                                id: package_name.toLowerCase() + "menuid"
                            }
                        });
                    }

                    packageTab = Ext.ComponentQuery
                        .query('bannerPanel toolbar [text="' + package_name +
                            '"]')[0];

                    var disabled = false;

                    if (require_login == true) {
                        var idUser = MetExplore.globals.Session.idUser;
                        if (idUser == -1) {
                            disabled = true;

                        }
                    }

                    if (require_bioSource == true) {

                        var idBioSource = MetExplore.globals.Session.idBioSource;
                        if (idBioSource == -1) {
                            disabled = true;

                        }
                    }
                    // console.log(application_name," disabled : ", disabled);

                    var button = Ext.ComponentQuery.query('bannerPanel toolbar ja_menu_item[text="' + application_name + '"] ')[0];
                    if (typeof button === "undefined") {
                        button = Ext.create(
                            "MetExplore.view.button.V_JavaApplicationMenuItem", {
                                text: application_name,
                                java_application: record,
                                tooltip: description,
                                disabled: disabled
                            });

                        packageTab.menu.add(button);
                    } else {
                        button.java_application = record;
                        button.setDisabled(disabled);
                        button.setTooltip(description);

                    }


                }

                // });
                // }
            });
            MetExplore.app.getController('C_HelpRedirection').addHelpsForJavaApplications();

            // store.sort();

        }
        // callback: funct
    }
});