/**
 * @author MC
 * @description 
 */
 /**
 * ComparedPanel
 */
Ext.define('MetExplore.model.ComparedPanel', {
    extend: 'Ext.data.Model',
    fields : ['panel', 'visible', 'parent'],

    // Getters & Setters
    getPanel:function()
    {
      return this.get('panel');
    },

    setPanel:function(newData)
    {
      this.set('panel', newData);
    },

    isVisible:function()
    {
      return this.get('visible');
    },

    setVisible:function(newData)
    {
      this.set('visible', newData);
    },

    getParent:function()
    {
      return this.get('parent');
    },

    setParent:function(newData)
    {
      this.set('parent', newData);
    }
});