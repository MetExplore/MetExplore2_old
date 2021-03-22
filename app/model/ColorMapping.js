/**
 * @author MC
 * @description 
 */
Ext.define('MetExplore.model.ColorMapping', {
    extend: 'Ext.data.Model',
    fields : [{
          name:'name',
          type:'string'
        },{
          name : 'value',
          type : 'string'
        }
    ],


	// Getters & Setters
    getName:function()
    {
      return this.get('name');
    },

    setName:function(newData)
    {
      this.set('name',newData);
    },
    getValue:function()
    {
      return this.get('value');
    },

    setValue:function(newData)
    {
        this.set('value',newData);
    }
});