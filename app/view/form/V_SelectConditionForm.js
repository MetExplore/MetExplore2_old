/**
 * @author MC
 * @description 
 */
Ext.define('MetExplore.view.form.V_SelectConditionForm', {
    extend: 'Ext.Panel',  
    alias: 'widget.selectConditionForm',
    id:'selectConditionForm',
    requires: [
        'MetExplore.view.form.V_SelectConditionType',
        'MetExplore.view.form.V_SelectCondition',
        'MetExplore.view.form.V_SelectMapping'
    ],

    collapsible: true,
    collapsed:false,
    region:'north',
    height: 200,
    width:'100%', 
    margins:'0 0 0 0',
    split:true,
    animation: true,
    autoScroll: true,

    items: [
    {
        id:'selectMappingVisu',
        xtype:'selectMapping',
        editable: false,
        disabled:true
    },{
        xtype: 'menuseparator'
    },{
        id:'selectCondition',
        xtype:'selectCondition',
        disabled:true
    },{   
        border:false,
        id:'chooseCondition',
        xtype:'panel',
        autoScroll: true,
        layout:{
           type:'hbox',
           align:'stretch'
        },
        items:[{
            id:'selectConditionType',
            xtype:'selectConditionType',
            disabled:true
        },{
            xtype:'button',
            iconCls:'add',
            tooltip:'You must choose a condition to add it',
            //formBind: true,
            width: 22,
            margin:'5 5 5 0',
            id:'addCondition',
            action:'addCondition',
            disabled:true
        }]
    },{
            xtype: 'menuseparator'
    }]  
});