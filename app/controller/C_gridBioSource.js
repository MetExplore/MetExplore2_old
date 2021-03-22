/**
 * C_gridBioSource
 */
Ext.define('MetExplore.controller.C_gridBioSource', {
    extend: 'Ext.app.Controller',
    requires: ['MetExplore.globals.Session', 'MetExplore.globals.Utils'],


    views: ['grid.V_gridBioSource', 'grid.V_gridBioSourceInfo', 'grid.V_gridBiblioLinks', 'form.V_updateBioSource', 'grid.V_GridUserProjectBioSource'],


    init: function() {
        this.control({
            'gridBioSource': {
                //cellclick: this.getBioSourceFromGrid
                celldblclick: this.selectBydblclick
            },
            'gridUserProjectBioSource': {
                //cellclick: this.getBioSourceFromGrid
                celldblclick: this.selectBydblclick
            },
            'gridBioSource button[action=refresh]': {
                click: this.refresh
            },
            'gridUserProjectBioSource button[action=refresh]': {
                click: this.refresh
            },
            'gridUserProjectBioSource button[action="addBioSourceToProject"]': {
                click: this.addBioSourceToProject
            },
            'gridUserProjectBioSource button[action="cancelAddBSToProject"]': {
                click: this.cancelAddBioSourceToProject
            },
            'gridUserProjectBioSource combo[name="chooseBSForProject"]': {
                change: this.chooseBSForProjectChange
            }
        });

    },

    /**
     * Action done when value of combovox chooseBSForProject changed
     * @param {} combo
     * @param {} newValue
     * @param {} oldValue
     * @param {} eOpts
     */
    chooseBSForProjectChange: function(combo, newValue, oldValue, eOpts) {
        var buttonAdd = combo.up('toolbar').down('button[action="addBioSourceToProject"]');
        if (newValue != "") {
            buttonAdd.enable();
        } else {
            buttonAdd.disable();
        }
    },

    /**
     * When click on addBioSourceToProject button. If first time, show list of BioSources and cancel button, else, do add and reset toolbar
     * @param {} button
     */
    addBioSourceToProject: function(button) {
        var toolbar = button.up('toolbar');
        var combo = toolbar.down('combo[name="chooseBSForProject"]');
        if (button.nbClicks == 0) {
            var storeCombo = Ext.create('Ext.data.Store', {
                storeId: 'storeComboAddBSToProject',
                fields: ['id', 'nameBioSource'],
                data: Ext.getStore('S_MyBioSource').getNonProjectBS()
            });
            combo.bindStore(storeCombo);
            combo.show();
            combo.setValue('');
            button.disable();
            button.setText("Add");
            toolbar.down('button[action="cancelAddBSToProject"]').show();
            button.nbClicks = 1;
        } else {
            //Do add:
            var idBioSource = combo.getValue();
            MetExplore.globals.Project.callAddBioSourceToCurrentProject([idBioSource], [combo.getStore().getById(idBioSource)]);

            //Reset form toolbar:
            combo.hide();
            toolbar.down('button[action="cancelAddBSToProject"]').hide();
            button.setText("Add BioSource to the project");
            button.nbClicks = 0;
        }

    },

    /**
     * Cancel add BioSource to project clicked
     * @param {} button
     */
    cancelAddBioSourceToProject: function(button) {
        var toolbar = button.up('toolbar');
        toolbar.down('combo[name="chooseBSForProject"]').hide();
        button.hide();
        buttonAdd = toolbar.down('button[action="addBioSourceToProject"]');
        buttonAdd.setText("Add BioSource to the project");
        buttonAdd.nbClicks = 0;
        buttonAdd.enable() //If it has been disabled before
    },

    /**
     * Select a biosource from bouble clicking on a line in the grid
     */
    selectBydblclick: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        //view.highlightItem( td ) //Cause bug on grid biosource on user panel and seems not required

        var idBioSource = parseInt(tr.getAttribute('data-recordid'));

        var ctrl = MetExplore.app.getController('C_GenericGrid');

        //	console.log(record);

        var idProjectBS = record.get('idProject');
        //		console.log(idProjectBS);
        var idProjectSession = MetExplore.globals.Session.idProject;

        if (idProjectBS > -1 && idProjectSession != idProjectBS) {
            Ext.Msg.confirm("Open linked project", "To select this BioSource, you need to open the linked project. Continue?",
                function(btn) {
                    if (btn == "yes") {
                        MetExplore.globals.Project.openProjectById(idProjectBS, true, false);
                        ctrl.selectBioSource(idBioSource);
                    }
                })
        } else {
            ctrl.selectBioSource(idBioSource);
        }


        //		var CtrlBiosource=MetExplore.app.getController('C_BioSource');
        //		CtrlBiosource.delNetworkData();
        //		CtrlBiosource.updateSessionBioSource(idBioSource);		
        //		CtrlBiosource.updateGrid(idBioSource);
        //		
        //		Ext.getCmp('networkData').setActiveTab(3);

    },

    getBioSourceFromGrid: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts) {

        //view.highlightItem( td )

        var idBioSource = parseInt(tr.getAttribute('data-recordid'));


        var rec = view.getStore().getById(idBioSource);

        var nameBS = rec.get('NomComplet');
        var Public = rec.get('public');
        var access = rec.get('access');
        var idProject = rec.get('idProject');

        this.setBiosourceInfo(idBioSource, nameBS, Public, access, idProject);
    },


    /**
     * Instantiate the panel with all the information on this biosource
     */
    setBiosourceInfo: function(id, Name, Public, access, idProject) {

        var biosourceId = id;
        var nameBS = Name;

        if (Ext.getCmp('bioSourceInfo')) {
            Ext.getCmp('bioSourceInfo').close();
        };

        var gridBioSourceInfo;
        if (!Public && biosourceId > -1) {

            gridBioSourceInfo = Ext.create('MetExplore.view.form.V_updateBioSource', {
                id: biosourceId,
                access: access,
                idProject: idProject
            });
        } else {

            gridBioSourceInfo = Ext.create('MetExplore.view.panel.V_dataBioSource', {
                id: biosourceId,
                header: false
            })


        };

        var newpanel = Ext.create('Ext.Panel', {
            title: nameBS,
            border: false,
            id: 'bioSourceInfo',
            items: [
                gridBioSourceInfo
            ]
        });


        Ext.getCmp('panelBioSource').insert(3, newpanel);

    },



    refresh: function(button) {

        MetExplore.globals.Utils.refreshBioSources();

    }

});