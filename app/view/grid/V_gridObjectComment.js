/**
 * gridObjectComment
 * Affiche les commentaires associés à un objet (reaction, pathway)
 */

Ext.define('MetExplore.view.grid.V_gridObjectComment', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridObjectComment',
    config: {
        idObject: -1,
        typeObject: ""
    },

    columns: [{
        xtype: 'rownumberer',
        width: 30,
        sortable: false
    }, {
        text: 'User',
        flex: 2,
        hidden: false,
        sortable: true,
        dataIndex: 'nameUser'
    }, {
        text: 'Title',
        flex: 4,
        hidden: false,
        sortable: true,
        dataIndex: 'title'
    }, {
        text: 'Attachments',
        width: 70,
        hidden: false,
        sortable: true,
        dataIndex: 'attachments',
        renderer: function(value) {
            if (value.length == 0) {
                return "None"
            } else if (value.length == 1) {
                return value.length + " File";
            } else {
                return value.length + " Files";
            }
        }
    }],

    /**
     * Constructor
     * @param {} params: parameters given to the view:
     * 		- idObject: id of the object [REQ]
     * 		- typeObject: type of the object [REQ]
     * 		- parent: parent of the view [REQ]
     * 		- win: the window containing the view (if any) [OPT]
     */
    constructor: function(params) {
        var config = this.config;
        config.idObject = params.idObject;
        config.typeObject = params.typeObject;
        config.bbar = [{
            xtype: 'button',
            action: 'refresh',
            tooltip: 'Refresh the comments',
            iconCls: 'refresh'
        }, '-', {
            xtype: 'button',
            text: 'Add',
            action: 'addComment',
            iconCls: 'add-project',
            disabled: ['p', 'owner', 'rw', 'read/write', 'a', 'annotator'].indexOf( /*Projects:*/ params.access ? params.access : /*Other objects:*/ MetExplore.globals.Session.access) == -1
        }, {
            xtype: 'button',
            text: 'Delete',
            action: 'deleteComment',
            iconCls: 'delete-project',
            disabled: true
        }, {
            xtype: 'button',
            text: 'Open',
            action: 'openComment',
            iconCls: 'open-project',
            disabled: true
        }];

        config.parent = params.parent;
        if (Ext.getStore('MetExplore.store.S_Comment')) {
            var storeComment = getStore('MetExplore.store.S_Comment');
            storeComment.removeAll();
        } else {
            var storeComment = Ext.create('MetExplore.store.S_Comment');
        }

        if (MetExplore.globals.Session.publicBioSource == false || config.typeObject == "project") {
            storeComment.load({
                params: {
                    'idUser': MetExplore.globals.Session.idUser,
                    'idObject': config.idObject,
                    'typeObject': config.typeObject
                },
                callback: function(records, operation, success) {
                    if (success && params.win) {
                        var nbComments = records.length;
                        if (params.win && nbComments > 1)
                            params.win.query("panel[name=panelComments]")[0].setTitle("This " + this.config.typeObject + " has <b>" + nbComments + " Comments</b>");
                        else if (params.win)
                            params.win.query("panel[name=panelComments]")[0].setTitle("This " + this.config.typeObject + " has <b>" + nbComments + " Comment</b>");
                        this.nbComments = nbComments;
                    }
                },
                scope: this
            });
        }

        config.store = storeComment;

        this.callParent([config]);
    },

    /**
     * Update the number of comments
     * @param {} change: ++ if number increase or -- if it decrease
     */
    updateNbComments: function(change) {
        var win = this.up('window');
        if (win) {
            if (change == "++") {
                this.nbComments++;
            } else if (change == "--") {
                this.nbComments--;
            }
            if (this.nbComments > 1)
                win.query("panel[name=panelComments]")[0].setTitle("This " + this.typeObject + " has <b>" + this.nbComments + " Comments</b>");
            else
                win.query("panel[name=panelComments]")[0].setTitle("This " + this.typeObject + " has <b>" + this.nbComments + " Comment</b>");
        }
    }
});