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
 * draw a Reaction
 */
var ReactionStyle = function(
    backgroundColor,
    height,
    width,
    rx,
    ry,
    opacity,
    strokeColor,
    strokeWidth,
    fontColor,
    fontSize,
    fontWeight,
    labelOpacity,
    displayNodeName,
    useAlias){

    if(backgroundColor)
        this.backgroundColor = backgroundColor;
    else
        this.backgroundColor = "#FFFFFF";

    this.height = height;
    this.width = width;
    this.rx = rx;
    this.ry = ry;

    if(opacity)
        this.opacity = opacity;
    else
        this.opacity = 1;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    if(fontColor)
        this.fontColor = fontColor;
    else
        this.fontColor = "#000000";
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    this.labelOpacity = 1.0;
    this.label = displayNodeName;
    this.useAlias = useAlias;

};

ReactionStyle.prototype = {
    // Getters & Setters
    getBackgroundColor:function()
    {
        return this.backgroundColor;
    },

    setBackgroundColor:function(newData)
    {
        this.backgroundColor = newData;
    },
    getFontColor:function()
    {
        return this.fontColor;
    },

    setFontColor:function(newData)
    {
        this.fontColor = newData;
    },
    getHeight:function()
    {
        return this.height;
    },

    setHeight:function(newData)
    {
        this.height = newData;
    },

    getWidth:function()
    {
        return this.width;
    },

    setWidth:function(newData)
    {
        this.width = newData;
    },

    getRX:function()
    {
        return this.rx;
    },

    setRX:function(newData)
    {
        this.rx = newData;
    },

    getRY:function()
    {
        return this.ry;
    },

    setRY:function(newData)
    {
        this.ry = newData;
    },

    getStrokeColor:function()
    {
        return this.strokeColor;
    },

    setStrokeColor:function(newData)
    {
        this.strokeColor = newData;
    },

    getStrokeWidth:function()
    {
        return this.strokeWidth;
    },

    setStrokeWidth:function(newData)
    {
        this.strokeWidth = newData;
    },

    getFontSize:function()
    {
        return this.fontSize;
    },

    setFontSize:function(newData)
    {
        this.fontSize = newData;
    },

    getFontWeight:function()
    {
        return this.fontSize;
    },

    setFontWeight:function(newData)
    {
        this.fontSize = newData;
    },

    isUseAlias:function()
    {
        return this.useAlias;
    },

    setUseAlias:function(newData)
    {
        this.useAlias = newData;
    },

    getLabel:function()
    {
        return this.label;
    },

    setLabel:function(newData)
    {
        this.label = newData;
    },


    getDisplayLabel:function(node, label, useAlias)
    {
        var displayedLabel;
        if (node.getLabel()!==undefined) displayedLabel = node.getLabel();
        else
        {
            if(useAlias){
                displayedLabel = node.getAlias();
                if(displayedLabel === undefined)
                    displayedLabel = this.labelToDisplay(node, label);
                else
                if(displayedLabel.isEmpty()) displayedLabel = this.labelToDisplay(node, label);

            }
            else
            {
                displayedLabel = this.labelToDisplay(node, label);
            }
        }
        return displayedLabel;
    },

    labelToDisplay:function(node, label){
        var displayedLabel = undefined;

        if(label)
            displayedLabel = node[label];
        else
            displayedLabel = node.getName();


        if(displayedLabel === undefined)
            displayedLabel = node.getName();

        return displayedLabel.toString();
    },
    getOpacity:function()
    {
        return this.opacity;
    },

    setOpacity:function(newData)
    {
        this.opacity = newData;
    },
    getLabelOpacity:function()
    {
        return this.labelOpacity;
    },

    setLabelOpacity:function(newData)
    {
        this.labelOpacity = newData;
    }
};
