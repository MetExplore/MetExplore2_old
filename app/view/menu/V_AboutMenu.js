/**
 * @author LC
 * @description Metabolome mapping menu
 */

Ext.define('MetExplore.view.menu.V_AboutMenu', {
	extend: 'Ext.menu.Menu', 
	alias: 'widget.aboutMenu',

//	requires: [],


	items:	[{
		text: 'Documentation',
		handler: function(){

			//Ext.getCmp('homePanel').setVisible(false);
			var tabPanel= Ext.getCmp('tabPanel');
			tabPanel.setVisible(true);

			var newTab = tabPanel.add({
				title: 'Documentation',
				html:   '<iframe style="overflow:auto;width:100%;height:100%;" frameborder="0"  src="http://metexplore.toulouse.inra.fr/joomla3/index.php/documentation"></iframe>',
				autoScroll:true,
				closable: true
			});

			newTab.show();
			tabPanel.setActiveTab(newTab);

		}
	}]
});

