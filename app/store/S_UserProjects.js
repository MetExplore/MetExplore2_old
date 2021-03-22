/**
 * S_UserProjects
 * model: 'MetExplore.model.Project'
 */
Ext.define('MetExplore.store.S_UserProjects',{
	extend : 'Ext.data.Store',
	storeId: 'storeUserProjects',
	model: 'MetExplore.model.Project',
	autoLoad: false,
	sorters: [{
     	property: 'name',
     	direction: 'ASC'
   	}],

	proxy: {
		type: 'ajax',
		url: 'resources/src/php/userAndProject/dataUserProjects.php',
		extraParams: {
			iduser: "",
			idproject: ""
		},
		reader : {
			type : 'json',
			root : 'results',
			successProperty : 'success'
		},
		listeners : {
			/**
			 * @event
			 * @param {} proxy
			 * @param {} response
			 * @param {} operation
			 * @param {} eOpts
			 */
			'exception' : function(proxy, response, operation, eOpts) {
				if (response.status !== 200) {
					Ext.Msg.alert("Failed", "Server Error. Status: " + response.status);
				} else {
					var responseText = Ext.decode(response.responseText);
					Ext.Msg.alert("Failed", responseText.message);
				}
			}
		}
	},

	/**
	 * loadUserProjects
	 */
	loadUserProjects: function()
	{
		this.load();
	},

	/**
	 * clearStore
	 */
	clearStore: function()
	{
		this.removeAll();
	},
	/**
	 * getProjectsName
	 * @returns {*}
	 */
	getProjectsName: function()
	{
		var fields = this.fields;
		var projectsName = array();
		for (var i = 0, len = fields.length; i < len; i++) {
		    projectsName.push(field.name);
		}
		return projectsName;
	}
});