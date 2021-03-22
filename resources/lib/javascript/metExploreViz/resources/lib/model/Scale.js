/*
 This file is part of MetExploreViz 

 Copyright © 2020 INRA 
 Contact: http://metexplore.toulouse.inra.fr/metexploreViz/doc/contact 
 GNU General Public License Usage 
 This file may be used under the terms of the GNU General Public License version 3.0 as 
 published by the Free Software Foundation and appearing in the file LICENSE included in the 
 packaging of this file. 
 Please review the following information to ensure the GNU General Public License version 3.0 
 requirements will be met: http://www.gnu.org/copyleft/gpl.html. 
 If you are unsure which license is appropriate for your use, please contact us 
 at http://metexplore.toulouse.inra.fr/metexploreViz/doc/contact
 Version: 3.0.18 
 Build Date: Tue Jun 30 16:03:55 CEST 2020 
 */
/**
 * @author MC
 * (a)description 
 */
 /**
 * Scale
 */
var Scale = function(graphName){
   this.graphName = graphName;
};

Scale.prototype = {
 
    // Getters & Setters
    setScale:function(newzoomScale, newzoomScaleCompare, newzoom)
    {
        this.zoomScale = newzoomScale;
        this.zoomScaleCompare = newzoomScaleCompare;
        this.zoom = newzoom;
    },

    getGraphName:function()
    {
      return this.graphName;
    },

    setGraphName:function(newData)
    {
      this.graphName = newData;
    },

    getZoomScale:function()
    {
      return this.zoomScale;
    },

    setZoomScale:function(newData)
    {
      this.zoomScale = newData;
    },

    getZoomScaleCompare:function()
    {
      return this.zoomScaleCompare;
    },

    setZoomScaleCompare:function(newData)
    {
      this.zoomScaleCompare = newData;
    },
    getZoom:function()
    {
      return this.zoom;
    },

    setZoom:function(newData)
    {
      this.zoom = newData;
    }
};