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
var MappingData = function(node, titleMap, conditionN, val){

	this.node = node;
	this.mappingName = titleMap;
	this.conditionName = conditionN;
	this.mapValue = val;
};

MappingData.prototype = {
	getNode : function(){
		return this.node;
	},
	setNode : function(newNode){
		this.node = newNode;
	},
	
	getMappingName : function(){
		return this.mappingName;
	},

	getConditionName : function(){
		return this.conditionName;
	},
	
	getMapValue : function(){
		return this.mapValue;
	},
	setMapValue : function(val){
		this.mapValue = val;
	}
};