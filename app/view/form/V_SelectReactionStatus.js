/**
 * selectReactionStatus
 */
Ext.define('MetExplore.view.form.V_SelectReactionStatus', {
		extend: 'Ext.form.ComboBox',
		alias: 'widget.selectReactionStatus',
		        
        width: 390,
        store: {
        	fields: ['evidenceType','score', 'idStatus'],
        	data: [{'evidenceType':'Not Evaluated','score':'0', 'idStatus':1},
        	       {'evidenceType':'Modeling Data','score':'1', 'idStatus':2},
        	       {'evidenceType':'Physiological Data','score':'2', 'idStatus':6},
        	       {'evidenceType':'Genetic Data','score':'3', 'idStatus':7},
        	       {'evidenceType':'Biochemical Data','score':'4', 'idStatus':8}
        	       ]
        },
        displayField: 'evidenceType',
        valueField: 'idStatus',
        typeAhead: true,
        listConfig: {
			getInnerTpl: function() {
				return '{evidenceType} (score of: {score})';
			}
		},
        emptyText:'-- Select Evidence type --',
        anyMatch : true,
        forceSelection:true
    });