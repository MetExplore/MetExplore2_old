/**
 *  The main application viewport
 */
/*
default viewport
Ext.define('MetExplore.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.layout.container.Fit',
        'MetExplore.view.Main'
    ],

    layout: {
        type: 'fit'
    },

    items: [{
        xtype: 'app-main'
    }]
});
*/
Ext.define('MetExplore.view.Viewport', {
		extend: 'Ext.container.Viewport',
		layout: 'border',
		id:'viewport',
		// All the requires must be in the same array !
		/*requires: ['MetExplore.view.V_BannerPanel', 
		           'MetExplore.view.V_MainPanel',
		           'MetExplore.view.V_SidePanel'
		           ],*/
		
		items :  [
			        {
                		xtype: 'bannerPanel'
                	}
			        ,
                	{
						xtype: 'mainPanel'	
                	 },
                	{
                		xtype: 'mappingVizPanel'
                	},
                	{
                		xtype: 'sidePanel'
                	}
                	]
            
				
});