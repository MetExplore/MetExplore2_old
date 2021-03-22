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
 * ComparedPanel
 */
var ComparedPanel = function(panel, visible, parent, title){
    this.panel = panel;
    this.visible = visible;
    this.parent = parent;
    this.title = title;
};

ComparedPanel.prototype = {

    // Getters & Setters
    getPanel:function()
    {
      return this.panel;
    },

    setPanel:function(newData)
    {
      this.panel = newData;
    },

    isVisible:function()
    {
      return this.visible;
    },

    setVisible:function(newData)
    {
      this.visible = newData;
    },

    getParent:function()
    {
      return this.parent;
    },

    setParent:function(newData)
    {
      this.parent = newData;
    },

    getTitle:function()
    {
      return this.title;
    },

    setTitle:function(newData)
    {
      this.title = newData;
    }

};