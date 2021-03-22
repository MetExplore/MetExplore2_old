Ext.define('MetExplore.view.form.V_SelectTabDataColumn', {
		extend: 'Ext.form.ComboBox',
		alias: 'widget.selectTabDataColumn',
		
        displayField: 'text',
        valueField: 'index',

        queryMode: 'local',
        typeAhead: true,
        forceSelection: true,
        emptyText:'-- Select Column --',
        
        store:{
			fields: ['index','text'],
			data: [{
				index: '1',
				text : 'Col_A'
			},
			{
				index: '2',
				text : 'Col_B'
			},
			{
				index: '3',
				text : 'Col_C'
			},
			{
				index: '4',
				text : 'Col_D'
			},
			{
				index: '5',
				text : 'Col_E'
			},
			{
				index: '6',
				text : 'Col_F'
			},
			{
				index: '7',
				text : 'Col_G'
			},
			{
				index: '8',
				text : 'Col_H'
			},
			{
				index: '9',
				text : 'Col_I'
			},
			{
				index: '10',
				text : 'Col_J'
			},
			{
				index: '11',
				text : 'Col_K'
			},
			{
				index: '12',
				text : 'Col_L'
			},
			{
				index: '13',
				text : 'Col_M'
			},
			{
				index: '14',
				text : 'Col_N'
			},
			{
				index: '15',
				text : 'Col_O'
			},
			{
				index: '16',
				text : 'Col_P'
			},
			{
				index: '17',
				text : 'Col_Q'
			},
			{
				index: '18',
				text : 'Col_R'
			},
			{
				index: '19',
				text : 'Col_S'
			},
			{
				index: '20',
				text : 'Col_T'
			},
			{
				index: '21',
				text : 'Col_U'
			},
			{
				index: '22',
				text : 'Col_V'
			},
			{
				index: '23',
				text : 'Col_W'
			},
			{
				index: '24',
				text : 'Col_X'
			},
			{
				index: '25',
				text : 'Col_Y'
			},
			{
				index: '25',
				text : 'Col_Z'
			}]
		}
    });