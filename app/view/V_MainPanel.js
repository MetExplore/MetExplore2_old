/**
 * 
 * MetExplore page Main
 */

Ext.define('MetExplore.view.V_MainPanel', {

    extend: 'Ext.tab.Panel',
    alias: 'widget.mainPanel',
    region: 'center',
    id: 'tabPanel',
    requires: ['MetExplore.view.main.V_NetworkData',
        'MetExplore.view.main.V_NetworksPanel',
        'MetExplore.view.main.V_CurationPanel',
        'MetExplore.view.main.V_UserPanel',
        'MetExplore.view.main.V_ProjectPanel'
    ],
    layout: 'fit',
    activeTab: 2,

    margins:'0 0 2 2',
    items: [{
            title: 'User Profile',
            closable: false,
            id: 'userProfile',
            xtype: 'userPanel'
        }, {
            title: 'Project Details',
            closable: false,
            id: 'projectDetails',
            xtype: 'projectPanel'
        }, {
            title: 'Network Data',
            closable: false,
            id: 'networkData',
            xtype: 'networkData'
        },
        /*{
	        	   title: 'Network Viz',
	        	   closable: false,
	        	   id :'networksPanel',
	        	   xtype : 'networksPanel'
	           },*/
        {
            title: 'Network Curation',
            closable: false,
            //id :'annotationPanel',
            xtype: 'curationPanel'
        }
    ],


    listeners: {
        tabchange: function(tabPanel, newCard, oldCard) {
            if (newCard.xtype === "networksPanel") {
                MetExploreViz.onloadMetExploreViz(function() {
                    metExploreViz.resizeViz();
                });
            }
            // 		if(newCard.xtype==="curationPanel"){
            //
            // 			Ext.getCmp('sidePanel').collapse();
            // 		}else if(newCard.xtype==="networksPanel"){
            //
            // 			if( Ext.getStore('S_Cart').getCount()==0 ){
            // 				Ext.getCmp('sidePanel').expand();
            // 				Ext.getCmp('gridCart').expand();
            // 			}
            // 		}else if (newCard.xtype==="networkData"){
            // 			var grid=newCard.getActiveTab( );
            // 			grid.getView().refresh();
            // 		} else if (newCard.xtype==="projectPanel"){
            //            MetExplore.globals.Utils.refreshTodoList();
            //        }
        },

        beforerender: function(grid) {
            grid.down('projectPanel').tab.hide();
            var networksPanel = Ext.create('MetExplore.view.main.V_NetworksPanel', {
                title: 'Network Viz',
                closable: false,
                id: 'networksPanel',
                xtype: 'networksPanel'
            });
            Ext.getCmp('tabPanel').add(networksPanel);
        }
    }

});