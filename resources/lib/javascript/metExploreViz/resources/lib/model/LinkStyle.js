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
 * draw a link
 */
var LinkStyle = function(size, lineWidth, markerWidth, markerHeight, markerInColor, markerOutColor, markerStrokeColor, markerStrokeWidth, strokeColor, opacity, fontColor, fontSize, fontWeight, labelOpacity){
    this.size = size ;
    this.lineWidth = lineWidth;
    this.markerWidth = markerWidth;
    this.markerHeight = markerHeight;
    this.markerInColor = markerInColor;
    this.markerOutColor = markerOutColor;
    this.markerStrokeColor = markerStrokeColor;
    this.markerStrokeWidth = markerStrokeWidth;

    if(opacity)
        this.opacity = opacity;
    else
        this.opacity = "1.0";

    if(strokeColor)
        this.strokeColor = strokeColor;
    else
        this.strokeColor = "#000000";

    if(fontColor)
        this.fontColor = fontColor;
    else
        this.fontColor = "#000000";

    if(fontSize)
        this.fontSize = fontSize;
    else
        this.fontSize = 10;

    this.fontWeight = fontWeight;

    if(labelOpacity)
        this.labelOpacity = labelOpacity;
    else
        this.labelOpacity = 1.0;
};

LinkStyle.prototype = {
    // Getters & Setters
    getMarkerInColor:function()
    {
        return this.markerInColor;
    },

    getLineWidth:function()
    {
        return this.lineWidth;
    },

    getMarkerOutColor:function()
    {
        return this.markerOutColor;
    },

    getSize:function()
    {
        return this.size;
    },

    getMarkerWidth:function()
    {
        return this.markerWidth;
    },

    getMarkerStrokeWidth:function()
    {
        return this.markerStrokeWidth;
    },

    getMarkerHeight:function()
    {
        return this.markerHeight;
    },

    getMarkerStrokeColor:function()
    {
        return this.markerStrokeColor;
    },

    getStrokeColor:function()
    {
        return this.strokeColor;
    },

    getOpacity:function()
    {
        return this.opacity;
    },

    setMarkerInColor:function(newData)
    {
        this.markerInColor = newData;
    },

    setLineWidth:function(newData)
    {
        this.lineWidth = newData;
    },

    setMarkerOutColor:function(newData)
    {
        this.markerOutColor = newData;
    },

    setSize:function(newData)
    {
        this.size =  newData;
    },

    setMarkerWidth:function(newData)
    {
        this.markerWidth = newData;
    }

    ,setMarkerStrokeWidth:function(newData)
    {
        this.markerStrokeWidth = newData;;
    },

    setMarkerHeight:function(newData)
    {
        this.markerHeight = newData;;
    },

    setMarkerStrokeColor:function(newData)
    {
        this.markerStrokeColor = newData;;
    },

    setStrokeColor:function(newData)
    {
        this.strokeColor = newData;;
    }
};