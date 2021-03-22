/*
 * List History of a user.
 */

Ext.define('MetExplore.view.grid.V_GridHistory',{
	extend:'Ext.grid.Panel',
	alias: 'widget.gridHistory',

	multiSelect : true,
	
	config : {
		hiddenColumns : [], 
		type: "generic" // or project or user
	},
	
	

	/**
	 * Constructor : initialize the view with given parameters (params)
	 * If params.store, set the store of the grid as given store, and if loadStore also, load it
	 * @param {} params
	 */
	constructor: function(params) {
		var config = this.config;
		if (params.hiddenColumns != undefined) {
			config.hiddenColumns = params.hiddenColumns;
		}
		else {
			config.hiddenColumns = [];
		}
		if (params.store)
		{
			config.store = params.store;
			if (params.loadStore) {
				config.store.load({
					params: {idProject: params.idProject},
					callback: function() {
						this.clearFilter();
						var idUser = MetExplore.globals.Session.idUser;
						this.filter('idUser', idUser);
					}
				})
			}
		}
		if (params.type) {
			config.type = params.type;
		}
		else {
			config.type = "generic";
		}

		config.bbar = [{
			xtype:'button',
			action:'refresh',
			tooltip:'Refresh history',
			iconCls:'refresh',
			margins: '0 2.5 0 0'
		},'-',{
			xtype:'button',
			action:'backward-date',
			cls:'backward-date',
			margins: '0 10 0 2.5',
			tooltip: 'Past history entries'
		},{                  
			xtype: 'datefield',
			name: 'historyFrom',
			fieldLabel: 'From',
			labelWidth: 30,
			width: 125,
			format: 'Y-m-d',
			editable: false
		},{                  
			xtype: 'datefield',
			name: 'historyTo',
			fieldLabel: 'To',
			labelWidth: 30,
			labelStyle: 'text-align: right;',
			width: 125,
			format: 'Y-m-d',
			editable: false
		},{
			xtype:'button',
			action:'forward-date',
			cls:'forward-date',
			margins: '0 0 0 10',
			tooltip: 'Future history entries'
		},"-",
		{
			xtype:'button',
			text:'Report',
			action:'show-report',
			cls:'show-report',
			margins: '0 0 0 5',
			tooltip: 'Report summary of history'
		},"-",
		{
			xtype:'button',
			text:'Delete',
			action:'delete',
			cls:'delete-history',
			margins: '0 0 0 5',
			tooltip: 'Delete selected items',
			disabled: true
		},
		"->",
		{
			xtype: 'button',
			enableToggle: false,
			toggleGroup: 'historyView' + config.type,
			text: 'Personal',
			cls: 'button-personal',
			action: 'historyPersonal',
			width: 100,
			margins: '0 5 0 0',
			pressed: true
		}, {
			xtype: 'button',
			enableToggle: false,
			toggleGroup: 'historyView' + config.type,
			text: 'All',
			cls: 'button-all',
			action: 'historyAll',
			width: 100
		}];

		config.columns = [{
			text     : 'Date',
			dataIndex: 'date',
			xtype    : 'datecolumn',
			width	 : 78,
			sortable : true,
			//format: 'Y-m-d',
			renderer : function(value, metadata, record) {
				metadata.tdAttr = 'data-qtip="' + value + '"';
				return value.split(/\s/)[0];
			}
		}, {
			text	 : 'User',
			dataIndex: 'user',
			width    : 120,
			sortable : true
		},{
			text	 : 'Project',
			dataIndex: 'project',
			flex     : 1,
			sortable : true,
			hidden   : config.hiddenColumns.indexOf('project') != -1,
			renderer : function(value, metadata, record) {
				metadata.tdAttr = 'data-qtip="' + value.replace(/"/g, "'") + '"';
				return value;
			}
		},{
			text	 : 'BioSource',
			dataIndex: 'bioSource',
			flex     : 1,
			sortable : true,
			renderer : function(value, metadata, record) {
				metadata.tdAttr = 'data-qtip="' + value.replace(/"/g, "'") + '"';
				return value;
			}
		},{
			text	 : 'Action',
			dataIndex: 'action',
			flex     : 2,
			sortable : true,
			renderer : function(value, metadata, record) {
				metadata.tdAttr = 'data-qtip="' + value.replace(/"/g, "'") + '"';
				return value;
			}
		},{
			xtype:'actioncolumn',
			width:20,
			action: 'seeDetailsHistory',
			items: [{
				icon: './resources/icons/details2.svg',
				tooltip: 'See details',
				isDisabled: function(view, rowIndex, colIndex, item, record) {
					// Returns true if 'editable' is false (, null, or undefined)
					return (record.get('fileDetails') == "");
				}
			}]
		}];

		this.callParent([config]);
	}
});