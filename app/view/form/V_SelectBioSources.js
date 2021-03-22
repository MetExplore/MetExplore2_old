/**
 * selectBioSources
 */
Ext.define('MetExplore.view.form.V_SelectBioSources', {
		extend: 'Ext.form.ComboBox',
		alias: 'widget.selectBioSources',
		
        displayField: 'NomComplet',
        valueField: 'id',
        width: 340,
        id :'selBioSource',
        store: 'S_BioSource',
        queryMode: 'local',
        typeAhead: true,
        emptyText:'-- Select public BioSource --',
        margin:'5 5 5 5',
        anyMatch : true
    });