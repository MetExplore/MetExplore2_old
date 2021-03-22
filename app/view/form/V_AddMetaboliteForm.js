/**
 * addMetaboliteForm
 */
Ext.define('MetExplore.view.form.V_AddMetaboliteForm', {
    extend: 'MetExplore.view.form.V_AddGenericForm',

    requires:['MetExplore.view.form.V_SelectInsertCompartment','MetExplore.override.form.field.VTypes'],

    config: {
        initialValues: []
    },

    alias: 'widget.addMetaboliteForm',

    items:[{
        xtype		: 'fieldset',
        minWidth:950,
        layout:'auto',
        defaults: {
            bodyStyle: 'padding:5px'
        },
        defaultType:'textfield',
        title:'Create/update Metabolite',
        items:[{
            fieldLabel:'Metabolite Identifier*',
            vtype:'dbIdentifier',
            name:'mtbId',
            colspan:1,
            allowBlank:false
        },{
            fieldLabel:'Name *',
            allowBlank:false,
            name:'mtbname',
            colspan:1
        },{
            fieldLabel:'Formula',
            name:'formula',
            colspan:1
        },{
            fieldLabel:'Charge',
            name:'charge',
            colspan:1
        },{
            fieldLabel:'Molecular Weight',
            name:'weight',
            colspan:1
        },{
            xtype:'selectInsertCompartment',
            bodyStyle : 'background:none',
            colspan:2
        },{
            xtype: 'checkboxfield',
            boxLabel: 'Generic Compound',
            name:'generic',
            colspan:3,
            inputValue	: '1'
        },{
            xtype: 'fieldset',
            colspan:5,
            title:'External DataBase Identifiers',
            layout:'vbox',
            defaults: {
                border: false,
                xtype: 'panel',
                bodyStyle : 'background:none',
                flex: 1,
                layout: 'hbox'
            },
            items:[{
                items:[{
                    xtype:'textfield',
                    fieldLabel:'KEGG Id',
                    name:'keggid',
                    listeners :{
                        change: function(){
                            if(this.getValue()==''){
                                this.up('panel').down('button').setDisabled(true);
                            }
                            else{
                                this.up('panel').down('button').setDisabled(false);
                            }
                        }
                    }
                },{
                    xtype:'button',
                    text:'Auto-Complete',
                    disabled:true,
                    action:'AutoCompleteKegg'
                }]
            },{
                items:[{
                    xtype:'textfield',
                    fieldLabel:'ChEBI',
                    name:'ChEBI',
                    listeners :{
                        change: function(){
                            if(this.getValue()==''){
                                this.up('panel').down('button').setDisabled(true);
                            }
                            else{
                                this.up('panel').down('button').setDisabled(false);
                            }
                        }
                    }
                },{
                    xtype:'button',
                    text:'Auto-Complete',
                    disabled:true,
                    action:'AutoCompleteChEBI'
                }]
            },{
                items:[{
                    xtype:'textfield',
                    fieldLabel:'Inchi',
                    name:'inchi'
                }]
            },{
                items:[{
                    xtype:'textfield',
                    fieldLabel:'InChIKey',
                    name:'inchiKey'
                }]
            },{
                items:[{
                    xtype:'textfield',
                    fieldLabel:'SMILES',
                    name:'smiles'
                }]
            }]
        },{
            xtype: 'fieldset',
            minWidth:900,
            title: 'Modelisation Parameters (Optional)',

            layout:{
                type:'vbox'
            },
            items: [{
                xtype: 'fieldset',
                layout:'hbox',
                border: false,
                defaultType: 'checkboxfield',
                items: [{
                    boxLabel	: 'Constant Metabolite',
                    name		: 'constant',
                    padding : '5 10 0 0',
                    inputValue	: '1'
                }, {
                    boxLabel  : 'Set Boundary Condition to True',
                    name      : 'boundaryCondition',
                    padding : '5 10 0 10',
                    inputValue: '1'
                }, {
                    boxLabel  : 'Side Compound',
                    name      : 'sideCoumpound',
                    padding : '5 10 0 10',
                    inputValue: '1'
                }]
            }
                // ,{
                // 	xtype: 'fieldset',
                // 	layout:'hbox',
                // 	border: false,
                // 	defaultType: 'checkboxfield',
                // 	items: [{
                // 		boxLabel	: 'Metabolite has no concentration',
                // 		name		: 'hasOnlySubstanceUnit',
                // 		inputValue	: '1',
                // 		padding : '0 10 0 0',
                // 		listeners :{
                // 			change: function(){
                // 				this.up('fieldset').down('textfield').setDisabled(!this.getValue());
                // 			}
                // 		}
                // 	},{
                // 		fieldLabel:'Associated Unit Definition',
                // 		xtype:'textfield',
                // 		name:' 	substanceUnit',
                // 		padding : '0 10 0 10',
                // 		disabled:true
                // 	}]
                // },{
                // 	xtype: 'radiogroup',
                // 	fieldLabel: 'Initialisation type',
                // 	width:'70%',
                // 	items: [{
                // 		boxLabel: 'Amount', name: 'qty', inputValue: 'amount'
                // 	},{
                // 		boxLabel: 'Concentration', name: 'qty', inputValue: 'concentration',checked: true
                // 	}]
                // },{
                // 	fieldLabel:'Initial Value',
                // 	xtype:'textfield',
                // 	name:'iValue'
                //
                // }
            ]
        }]
    }]
});