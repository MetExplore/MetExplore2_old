/**
 * List projects of a user
 */

Ext.define('MetExplore.view.grid.V_gridUserProjects', {
    extend: 'Ext.grid.Panel',

    requires: ["MetExplore.store.S_UserProjects"],

    alias: 'widget.gridUserProjects',

    multiSelect: false,

    border: "0 1 1 1",
    bbar: [{
        xtype: 'button',
        action: 'refresh',
        tooltip: 'Refresh the list of projects',
        iconCls: 'refresh'
    }, '-', {
        xtype: 'button',
        text: 'Add',
        action: 'addProject',
        iconCls: 'add-project'
    }, {
        xtype: 'button',
        text: 'Open',
        action: 'openProject',
        iconCls: 'open-project',
        disabled: true
    }, {
        xtype: 'button',
        text: 'Unsubscribe',
        action: 'unsubscribeProject',
        iconCls: 'unsubscribe-project',
        disabled: true
    }, {
        xtype: 'button',
        text: 'Delete',
        action: 'deleteProject',
        iconCls: 'delete-project',
        disabled: true
    }],

    columns: [{
        text: 'Name',
        dataIndex: 'name',
        flex: 1,
        sortable: true,
        renderer: function(value, metadata, record) {
            if (record.get('active') == true) {
                var lastmodifProject = record.get('lastModification') != "" ? new Date(record.get('lastModification')) : "";
                var lastvisitProject = record.get('lastVisit') != "" ? new Date(record.get('lastVisit')) : "";
                if (lastmodifProject != "" && lastvisitProject != "" && lastvisitProject < lastmodifProject && record.get('neverOpened') == true) {
                    metadata.tdAttr = 'data-qtip="This project has been modified by others until your last connection"';
                }
                return value;
            } else {
                metadata.tdAttr = 'data-qtip="You must accept invitation to this project"';
                return "<i>" + value + "</i>";
            }
        }
    }, {
        text: 'Access',
        dataIndex: 'access',
        width: 100,
        sortable: true,
        renderer: function(value, metadata, record) {
            if (record.get('active') == true) {
                return value;
            } else {
                return "";
            }
        }
    }, {
        text: 'Last modification',
        xtype: 'datecolumn',
        sortable: true,
        dataIndex: 'lastModification',
        renderer: function(value, metadata, record) {
            if (value && value != "0000-00-00 00:00:00" && record.get('active') == true) {
                metadata.tdAttr = 'data-qtip="' + value + '"';
                return value.split(/\s/)[0];
            } else if (record.get('active') == true) {
                return "unknown";
            }
        }
    }],

    viewConfig: {
        getRowClass: function(record, rowIndex, rowParams, store) {
            var lastmodifProject = record.get('lastModification') != "" ? new Date(record.get('lastModification')) : "";
            var lastvisitProject = record.get('lastVisit') != "" ? new Date(record.get('lastVisit')) : "";
            if (record.get('active') == false) return 'projectInactive';
            else if (lastmodifProject != "" && lastvisitProject != "" && lastvisitProject < lastmodifProject && record.get('neverOpened') == true) return 'projectModified';
            else return 'projectNormal';
        }
    },

    constructor: function(params) {

        config = this.config;

        var storeUserProjects = Ext.getStore("S_UserProjects");

        config.title = params.title;
        config.flex = params.flex;
        config.autoscroll = params.autoscroll;

        config.store = storeUserProjects;

        this.callParent([config]);
    }
});