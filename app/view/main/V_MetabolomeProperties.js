/**
 * @author LC
 */

Ext.define('MetExplore.view.main.V_MetabolomeProperties', {
		extend: 'Ext.Component', 
		alias: 'widget.metabolome',
		title: 'Metabolome Properties',
		initComponent: function() {
			var idCurrentUser = Ext.getStore('S_CurrentUser').first().get('id');
			var idCurrentBioSource = Ext.getStore('S_CurrentBioSource').first().get('id');
			var nameCurrentBioSource = Ext.getStore('S_CurrentBioSource').first().get('NomComplet');
			var typeCurrentBioSource = Ext.getStore('S_CurrentBioSource').first().get('type');
			
			this.html = 'id current user : '+idCurrentUser+'<br />';
			
			this.html += 'id current bioSource : '+idCurrentBioSource+'<br />';
			this.html += 'name current bioSource : '+nameCurrentBioSource+'<br />';
			this.html += 'type current bioSource : '+typeCurrentBioSource+'<br />';		
			
			this.callParent(arguments);

		}
		
	}
);