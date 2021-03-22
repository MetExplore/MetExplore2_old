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
var Pathway = function(id, name, hide, color, collapsed, nodes){
	this.id = id;
	this.identifier = name;
	this.name = name;

	if(color)
	    this.color = color;
	else
	    this.color = "";

	if(nodes)
	    this.nodes = nodes;
	else
        this.nodes = [];

    if(hide)
        this.hide = hide;
    else
        this.hide = "";

    if(collapsed)
        this.collapsed = collapsed;
    else
        this.collapsed = false;
};

Pathway.prototype = {

    addNode:function(node)
    {
        this.nodes.push(node);
    },
    getNodes:function()
    {
        return this.nodes;
    },

    removeNode:function(node)
    {
        var index = this.nodes.indexOf(node);
        if(index!=-1) this.nodes.splice(index, 1);
    },

   	getId:function()
    {
      return this.id;
    },
    getIdentifier:function()
    {
      return this.identifier;
    },
    getName:function()
    {
      return this.name;
  	},
    getColor:function()
    {
      return this.color;
    },
    setColor:function(newColor)
    {
      return this.color = newColor;
    },
    hidden:function()
    {
      return this.hide;
    },
    setHidden:function(bool)
    {
      this.hide = bool;
    },
    isCollapsed:function()
    {
      return this.collapsed;
    },
    setCollapsed:function(bool)
    {
      this.collapsed = bool;
    }
};
