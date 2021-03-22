/**
 * Grid of users of a project
 */

Ext.define('MetExplore.view.grid.V_GridUsersInProject', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridUsersInProject',
    store: "S_UsersInProject",

    layout: 'fit',

    multiSelect: true,

    columns: [{
        text: 'Name',
        dataIndex: 'name',
        flex: 1,
        sortable: true,
        renderer: function(value, rec) {
            if (rec.record.get('valid') == 1) {
                return value;
            } else {
                return '<i style="color: #585858;">' + value + '</i>';
            }
        }
    }, {
        text: 'Access',
        dataIndex: 'access',
        width: 100,
        sortable: true,
        editor: {
            xtype: 'combo',
            store: 'S_Access',
            valueField: 'name',
            displayField: 'name',
            editable: false
        }
    }],

    /**
     * Set configs variables, initialize store of the grid, initialize bottom toolbar (bbar)
     * @param {} params: parameters
     */
    constructor: function(params) {
        config = this.config;
        config.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            {
                ptype: 'bufferedrenderer',
                pluginId: params.pluginIn
            }
        ];
        if (params.showToolbar && params.showToolbar == true) {
            config.showToolbar = true;
        } else {
            config.showToolbar = false;
        }
        config.type = params.type;
        config.editMenu = params.editMenu;
        config.users = params.users;
        config.deletedUsers = [];
        config.addedUsers = [];
        var parent = params.parent;
        if (Ext.getStore(params.storeId)) {
            var storeUsersInProject = Ext.getStore(params.storeId);
            storeUsersInProject.removeAll();
        } else {
            var storeUsersInProject = Ext.create('MetExplore.store.S_UsersInProject', {
                storeId: params.storeId
            });
        }
        if (params.action && params.action == "add") {
            var user = {
                id: MetExplore.globals.Session.idUser,
                name: MetExplore.globals.Session.nameUser,
                access: 'owner',
                valid: 1
            };
            storeUsersInProject.add(user);
            config.addedUsers.push(user['id']);
        } else if (config.users != undefined) {
            for (var it = 0; it < config.users.length; it++) {
                storeUsersInProject.add({
                    id: config.users[it]['id'],
                    name: config.users[it]['name'],
                    access: config.users[it]['access'],
                    valid: config.users[it]['valid']
                });
            }
        }

        /*storeUsersInProject.load({
        	params: { idProject: params.idProject },
        	callback: function() {
        		if (params.action && params.action == "add")
        		{
        			this.getStore().add({
        				id: MetExplore.globals.Session.idUser,
        				name: MetExplore.globals.Session.nameUser,
        				access: 'owner',
        				valid: 1
        			});
        			this.up('ManageProject').access = 'owner';
        		}
        		else {
        			this.getStore().each(function(record){
        				if (record.get('id') == MetExplore.globals.Session.idUser)
        				{
        					var access = record.get('access');
        					var parent =this.up('ManageProject'); 
        					parent.access = access;
        					if (access != "owner" && access != "read/write")
        					{
        						parent.down('textfield[name="title"]').setEditable(false);
        						parent.down('textarea[name="desc"]').setEditable(false);
        						parent.down('panel[name="addUSer"]').setVisible(false);
        					}
        				}
        			});
        			if (!config.access) {
        				console.log ("access not found!");
        				this.up('ManageProject').access = 'read';
        			}
        		}
        	},
        	scope:  this
        });*/

        config.bbar = {
            height: 25,
            name: 'toolbarUsers',
            hidden: !config.showToolbar,
            items: [{
                    xtype: 'button',
                    action: 'refresh',
                    tooltip: 'Refresh the list of users',
                    iconCls: 'refresh'
                }, '-', {
                    text: 'Add',
                    action: 'add-user',
                    iconCls: 'add-user'
                }, {
                    text: 'Delete',
                    action: 'delete-user',
                    iconCls: 'delete-user',
                    disabled: 'true'
                },
                '->',
                {
                    text: 'Save',
                    iconCls: 'button-save-projet',
                    action: 'save-users',
                    disabled: true
                }
            ]
        };

        config.store = storeUsersInProject;

        this.callParent([config]);
    }
});