Ext.define('MetExplore.view.form.V_SelectProjectBioSources', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.selectProjectBioSources',
	
    displayField: 'NomComplet',
    valueField: 'id',
  	width: 340,
    name :'selProjectBioSource',
    queryMode: 'local',
    typeAhead: true,
    emptyText:'-- Select project BioSource --',
    margin:'5 5 5 5',
    anyMatch : true
    
});