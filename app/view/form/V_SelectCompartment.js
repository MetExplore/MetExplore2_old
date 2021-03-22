/**
 * selectCompartment
 */
Ext.define('MetExplore.view.form.V_SelectCompartment', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.selectCompartment',

    displayField: 'name',
    valueField: 'id',
    width: 390,
    store: 'S_CompartmentInBioSource',
    queryMode: 'local',
    typeAhead: true,
    forceSelection: true,
    emptyText: '-- Select Compartment --'


        ,
    initComponent: function() {

        var compartStore = Ext.create('MetExplore.store.S_CompartmentInBioSource');

        compartStore.loadWithFake_Compartment();
        this.store = compartStore;

        this.callParent();

    }
});