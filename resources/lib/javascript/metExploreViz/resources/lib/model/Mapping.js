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
 * Model to handle List of Mappings liste des mappings effectues
 * id : M<num>	<num> = numero du mapping
 * object : objet sur leque a ete fait le mapping (par defaut : Metabolite)
 * element : element sur lequel a ete fait le mapping (par defaut : dbIdentifier)
 * ListId : liste des id mysql qui ont ete mappes
 */

var Mapping = function(title, conditions, targetLabel, id){

	this.name = title;
	this.conditions = conditions;
	this.targetLabel = targetLabel;
	this.data = [];
	this.id = id;
};

Mapping.prototype = {
	getId : function(){
		return this.id;
	},
	setId : function(newid){
		this.id = newid;
	},

	getName : function(){
		return this.name;
	},

	setName : function(newName){
		this.name = newName;
	},

	getConditions : function(){
		return this.conditions;
	},
	
	getTargetLabel : function(){
		return this.targetLabel;
	},

	getConditionByName : function(name){
		var theCondition = null;
        this.comparedPanels.forEach(function(aCondition){            
            if(aCondition.name==name)
                theCondition = aCondition;
        });
        return theCondition;
	},

	addMap : function(map){
		this.data.push(map);
	},

	getData : function(){
		return this.data;
	}
};