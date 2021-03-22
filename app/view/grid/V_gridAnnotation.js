/**
 * gridAnnotation
 * utilise dans V_Annotation_TabFile
 */
 

Ext.define('MetExplore.view.grid.V_gridAnnotation',{
		extend:'Ext.grid.Panel',
		alias: 'widget.gridAnnotation',
		//requires:[	'MetExplore.view.form.V_SelectField'],
		store : 'S_DataTab',
	    resizable:true,
		resizeHandles: 'all',
		width: 800,
    	plugins:[Ext.create('Ext.grid.plugin.CellEditing', {
        			clicksToEdit: 2})],
    	autoScroll: true,
    	columns: [
    	{
    		dataIndex: 'tab0',
    		text : 'Col_A'
    		//tdCls:'col-match'
    	},
    	{
    		dataIndex: 'tab1',
    		text : 'Col_B'
    	},
    	{
    		dataIndex: 'tab2',
    		text : 'Col_C'
    	},
    	{
    		dataIndex: 'tab3',
    		text : 'Col_D'
    	},
    	    	{
    		dataIndex: 'tab4',
    		text : 'Col_E'
    	},
    	{
    		dataIndex: 'tab5',
    		text : 'Col_F'
    	},
    	{
    		dataIndex: 'tab6',
    		text : 'Col_G'
    	},
    	{
    		dataIndex: 'tab7',
    		text : 'Col_H'
    	},
    	    	{
    		dataIndex: 'tab8',
    		text : 'Col_I'
    	},
    	{
    		dataIndex: 'tab9',
    		text : 'Col_J'
    	},
    	    	{
    		dataIndex: 'tab10',
    		text : 'Col_K'
    		//tdCls:'col-match'
    	},
    	{
    		dataIndex: 'tab11',
    		text : 'Col_L'
    	},
    	{
    		dataIndex: 'tab12',
    		text : 'Col_M'
    	},
    	{
    		dataIndex: 'tab13',
    		text : 'Col_N'
    	},
    	    	{
    		dataIndex: 'tab14',
    		text : 'Col_O'
    	},
    	{
    		dataIndex: 'tab15',
    		text : 'Col_P'
    	},
    	{
    		dataIndex: 'tab16',
    		text : 'Col_Q'
    	},
    	{
    		dataIndex: 'tab17',
    		text : 'Col_R'
    	},
    	    	{
    		dataIndex: 'tab18',
    		text : 'Col_S'
    	},
    	{
    		dataIndex: 'tab19',
    		text : 'Col_T'
    	},
    	    	{
    		dataIndex: 'tab20',
    		text : 'Col_U'
    	},
    	{
    		dataIndex: 'tab21',
    		text : 'Col_V'
    	},
    	{
    		dataIndex: 'tab22',
    		text : 'Col_W'
    	},
    	    	{
    		dataIndex: 'tab23',
    		text : 'Col_X'
    	},
    	{
    		dataIndex: 'tab24',
    		text : 'Col_Y'
    	},
    	{
    		dataIndex: 'tab25',
    		text : 'Col_Z'
    	}
       ],
        listeners: {
        	afterrender: function() {
        		var ctrl= MetExplore.app.getController('C_gridAnnotation');
        		ctrl.updateMenu(this, 'Metabolite');
        	}
    	},
    		    tbar: [{ 
		    		xtype: 'combo', 
		    		fieldLabel: 'Object' ,
		    		//colspan:2,
		    		labelWidth: 60,
		    		//width:350,
		    		store : ['Pathway','Reaction','Metabolite','Enzyme','Protein','Gene'],
		    		value: 'Metabolite',	    		
		    		listeners :{
		    			change : function(combo, newValue, oldValue, eOpts ) {
							//console.log(newValue);
	    					if (newValue!=oldValue) {
	    						var panel= combo.up('panel');
	    						var gridAnnot= panel.up('panel').query('gridAnnotation')[0];
								var ctrl= MetExplore.app.getController('C_gridAnnotation');
								ctrl.updateMenu(gridAnnot, newValue);
	    					}
		    			}
		    		}
	    		},{
	    		xtype: 'combo', 
	    		//id:'comboElt',
				fieldLabel: 'Match column' ,
				store:['dbIdentifier','name'],
				value:'dbIdentifier',
				labelWidth: 100
	    		}
			 ]


	    });

