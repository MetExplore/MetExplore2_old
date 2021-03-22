/**
 * selectMyBioSources
 */
Ext.define('MetExplore.view.form.V_SelectMyBioSources', {
		extend: 'Ext.form.ComboBox',
		alias: 'widget.selectMyBioSources',
		
        displayField: 'NomComplet',
        valueField: 'id',
      	width: 340,
        name :'selMyBioSource',
        store: 'S_MyBioSource',
        queryMode: 'local',
        typeAhead: true,
        emptyText:'-- Select private BioSource --',
        margin:'5 5 5 5',
        anyMatch : true
        
    });