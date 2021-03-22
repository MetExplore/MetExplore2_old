/**
 * @author MC
 * @description 
 */
 /**
 * Scale
 */
Ext.define('MetExplore.model.Scale', {
    extend: 'Ext.data.Model',
    fields : ['graphName','xScale', 'yScale', 'zoomScale', 'xScaleCompare', 'yScaleCompare', 'zoomScaleCompare', 'zoom'],
	  
    // Getters & Setters
    setScale:function(newxScale, newyScale, newzoomScale, newxScaleCompare, newyScaleCompare, newzoomScaleCompare, newzoom)
    {
        this.set('xScale', newxScale);
        this.set('yScale', newyScale);
        this.set('zoomScale', newzoomScale);
        this.set('xScaleCompare', newxScaleCompare);
        this.set('yScaleCompare', newyScaleCompare);
        this.set('zoomScaleCompare', newzoomScaleCompare);
        this.set('zoom', newzoom);
    },

    getGraphName:function()
    {
      return this.get('graphName');
    },

    setGraphName:function(newData)
    {
      this.set('graphName', newData);
    },

    getXScale:function()
    {
      return this.get('xScale');
    },

    setXScale:function(newData)
    {
      this.set('xScale', newData);
    },

    getYScale:function()
    {
      return this.get('yScale');
    },

    setYScale:function(newData)
    {
      this.set('yScale', newData);
    },

    getZoomScale:function()
    {
      return this.get('zoomScale');
    },

    setZoomScale:function(newData)
    {
      this.set('zoomScale', newData);
    },
    getXScaleCompare:function()
    {
      return this.get('xScaleCompare');
    },

    setXScaleCompare:function(newData)
    {
      this.set('xScaleCompare', newData);
    },

    getYScaleCompare:function()
    {
      return this.get('yScaleCompare');
    },

    setYScaleCompare:function(newData)
    {
      this.set('yScaleCompare', newData);
    },

    getZoomScaleCompare:function()
    {
      return this.get('zoomScaleCompare');
    },

    setZoomScaleCompare:function(newData)
    {
      this.set('zoomScaleCompare', newData);
    },
    getZoom:function()
    {
      return this.get('zoom');
    },

    setZoom:function(newData)
    {
      this.set('zoom', newData);
    }
});