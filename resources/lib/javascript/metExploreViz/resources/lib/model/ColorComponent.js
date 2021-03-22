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
var ColorComponent = function(name, value){
    this.name = name;
    this.value = value;
};


ColorComponent.prototype = {
	// Getters & Setters
    getName:function()
    {
      return this.name;
    },

    setName:function(newData)
    {
      this.name = newData;
    },

    getValue:function()
    {
      return this.value;
    },

    setValue:function(newData)
    {
        this.value = newData;
    }
};