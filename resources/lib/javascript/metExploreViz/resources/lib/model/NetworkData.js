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
* NetworkData class
* nodes is an array of Node objects
* link is an array of Link objects
*/
var NetworkData = function(id){
    this.id = id;
    this.biosource = undefined;
    this.nodes = [];
    this.links = [];
    this.compartments = [];
    this.pathways = [];
};

NetworkData.prototype = {
    resetMapping : function(){
        this.nodes.forEach(function(node){
            node.resetMapping();
        })
    },

    removeMapping : function(mappingTitle){
        this.nodes.forEach(function(node){
            node.removeMappingData(mappingTitle);
        })
    },

    initNodeIndex:function()
    {
        tabNodes = this.nodes;
        this.nodes.forEach(function(node){
            node.index = tabNodes.indexOf(node);
        })
    },

    getNodes:function()
    {
      return this.nodes;
    },
    
    setId:function(newId)
    {
       this.id = newId;
    },      

    getId:function()
    {
       return this.id;
    }, 

    copyData:function(aData)
    {
      this.nodes = aData.getNodes();
      this.links = aData.getLinks();
    },
    getNodesLength:function()
    {
      return this.nodes.length;
    },

    getLinks:function()
    {
      return this.links;
    },

    getCompartments:function()
    {
      return this.compartments;
    },

    getCompartmentsLength:function()
    {
      return this.compartments.length;
    },
    
    getCompartmentByName: function(name){
        var allCompartments=[];
        allCompartments=this.compartments;
        //console.log(this.data.nodes);
        var comp;
        for(i=0;i<allCompartments.length;i++)
        {
            if(allCompartments[i].getName()==(name))
            {
                comp=allCompartments[i];
                return comp;
            }
        }
        return null;
        
    },

    getCompartmentById: function(id){
        var allCompartments=[];
        allCompartments=this.compartments;
        //console.log(this.data.nodes);
        var comp;
        for(i=0;i<allCompartments.length;i++)
        {
            if(allCompartments[i].getId()==(id))
            {
                comp=allCompartments[i];
                return comp;
            }
        }
        return null;
        
    },

    sortCompartments:function()
    {
        this.compartments.sort(function (a, b) {
            if (a.name > b.name)
              return 1;
            if (a.name < b.name)
              return -1;
            // a doit être égale à b
            return 0;
        });
    },

    addCompartment:function(name){
      if(this.compartments == undefined)
        this.compartments = [];

      var object = new Compartment(this.compartments.length, name);
      this.compartments.push(object);
    },

    getPathways:function()
    {
      return this.pathways;
    },

    getPathwaysLength:function()
    {
      return this.pathways.length;
    },
    
    getPathwayByName: function(name){
        var allPathways=[];
        allPathways=this.pathways;
        //console.log(this.data.nodes);
        var comp;
        for(i=0;i<allPathways.length;i++)
        {
            if(allPathways[i].getName()==(name))
            {
                comp=allPathways[i];
                return comp;
            }
        }
        return null;
    },

    getPathwayById: function(id){
        var allPathways=[];
        allPathways=this.pathways;
        //console.log(this.data.nodes);
        var comp;
        for(i=0;i<allPathways.length;i++)
        {
            if(allPathways[i].getId()==(id))
            {
                comp=allPathways[i];
                return comp;
            }
        }
        return null;
        
    },
    removePathway : function (path){
        for(k=0;k<this.pathways.length;k++)
        {
            if(path.id == this.pathways[k].id)
            {
                this.pathways.splice(k, 1);
            }
        }
    },
    removeCompartment : function (comp){
        for(k=0;k<this.compartments.length;k++)
        {
            if(comp.id == this.compartments[k].id)
            {
                this.compartments.splice(k, 1);
            }
        }
    },

    sortPathways:function()
    {
        this.pathways.sort(function (a, b) {
            if (a.name > b.name)
              return 1;
            if (a.name < b.name)
              return -1;
            // a doit être égale à b
            return 0;
        });
    },

    addPathway:function(name){
        if(this.pathways == undefined)
            this.pathways = [];

        var object = new Pathway(name.replace(/[.*+?^${} ()|[\]\-\\]/g, ""), name);
        this.pathways.push(object);
    },

    copyPathway:function(path){
        if(this.pathways == undefined)
            this.pathways = [];

        var object = new Pathway(path.name.replace(/[.*+?^${} ()|[\]\-\\]/g, ""), path.name, path.hide, path.color, path.collapsed, path.nodes);
        this.pathways.push(object);
        return object;
    },

    containsNode: function(id)
    {
        var allNodes=[];
        var contains=false;
        allNodes=this.nodes;
        for(i=0;i<allNodes.length;i++)
        {
            if(allNodes[i].getId()==(id))
                {contains=true;break;}
        }
        return contains;
    },

    getNodeById: function(id){
        var allNodes=[];
        allNodes=this.nodes;
        //console.log(this.data.nodes);
        var node = undefined;
        for(i=0;i<allNodes.length;i++)
        {
           //  console.log(" id searched "+id);
           // console.log("node ",allNodes[i]);
           // console.log("node id ",allNodes[i].id);
            if(allNodes[i].getId()==(id))
                {node=allNodes[i];break;}
        }
        return node;
    },

    getNodeByName: function(name){
        var allNodes=[];
        allNodes=this.nodes;
        //console.log(this.data.nodes);
        var node = undefined;
        for(i=0;i<allNodes.length;i++)
        {
           //  console.log(" id searched "+id);
           // console.log("node ",allNodes[i]);
           // console.log("node id ",allNodes[i].id);
            if(allNodes[i].getName()==(name))
                {node=allNodes[i];break;}
        }
        return node;
    },

    getNodeByDbIdentifier: function(id){
        var allNodes=[];
        allNodes=this.nodes;
        //console.log(this.data.nodes);
        var node = undefined;
        for(i=0;i<allNodes.length;i++)
        {
           //  console.log(" id searched "+id);
           // console.log("node ",allNodes[i].getDbIdentifier());
           // console.log("id ",id);

            if(allNodes[i].getDbIdentifier()==(id))
                {node=allNodes[i];break;}
        }

        return node;
    },

    getNodeByMappedInchi: function(inchi){
        var allNodes=[];
        allNodes=this.nodes;
        //console.log(this.data.nodes);
        var nodes = allNodes.filter(function(node){
            return node.mappedInchi==(inchi);
        });
        
        if(nodes.length==0)
            nodes = undefined;

        return nodes;
    },
    getLinkById: function(id){
        var allLinks=[];
        allLinks=this.links;
        var link;
        for(i=0;i<allLinks.length;i++)
        {
            if(allLinks[i].getId()==(id))
                {link=allLinks[i];break;}
        }
        return link;
    },
    getLinkByDBIdReaction: function(id){
        var linksFromReaction=[];
        linksFromReaction=this.links.filter(function (link) {
            var reaction;
            if(link.getSource().getBiologicalType()==="reaction")
                reaction = link.getSource();
            else
                reaction = link.getTarget();

            if(reaction){
                if(reaction.getDbIdentifier()===id){
                    return true;
                }
            }
            return false;
        });
        return linksFromReaction;
    },

    getNode: function(indice){
        return this.nodes[indice];
    },

    getLink: function(indice){
        return this.links[indice];
    },

    addLink:function(id,source,target,interaction,reversible){
      if(this.links == undefined)
        this.links = [];

      var object = new LinkData(id, source, target, interaction, reversible);
      this.links.push(object);
      return object;
    },

    getDataNodes:function(){
        var nodes=[];

        this.nodes.forEach(function(node){
            nodes.push(node);
        });

        return nodes;
    },

    addNodeCopy:function(node){
         this.nodes.push(node);
    },

    addNode:function(
            name,
            compartment,
            dbIdentifier,
            id,
            reactionReversibility,
            biologicalType,
            selected,
            labelVisible,
            svg,
            svgWidth,
            svgHeight,
            isSideCompound,
            ec,
            isDuplicated, 
            identifier, 
            pathway, 
            locked, 
            alias, 
            label,
            labelFont,
            hidden
        ){
        if(this.nodes == undefined)
            this.nodes = [];

        var object = new NodeData(
            name, 
            compartment, 
            dbIdentifier, 
            ec, 
            id, 
            reactionReversibility, 
            isSideCompound, 
            biologicalType, 
            selected, 
            labelVisible, 
            svg, 
            svgWidth, 
            svgHeight, 
            undefined, 
            isDuplicated, 
            identifier, 
            pathway, 
            locked, 
            alias, 
            label,
            labelFont,
            hidden);
        //console.log('ec '+ec);
        //console.log('ec '+object.getEC());
        this.nodes.push(object);
        return object;
    },
    
    //get the array of link adjacent to a node
    getAdjLink : function (node)
    {
    	var adjLink=[];
    	var cpt=0;
    	for(var i=0;i<this.links.length;i++)
    	{
    		var link = this.links[i];
    		var source=link.source;
    		var target=link.target;
    		if(node.id == source.id)
    		{
    			adjLink.push(link);
    		}
    		else
    		{
    		    if(node.id==target.id)
    			{
    				adjLink.push(link);
    			} 
    		} 
    	}
    	return adjLink;	
    },
    
    //remove link function
     removeLink : function (link){
			for(k=0;k<this.links.length;k++)
			{
			 	if(link.id == this.links[k].id)
			 	{this.links.splice(k, 1);}
			}
    },

    //remove node function
    removeNode : function (node){
    	//first, remove all the link adjacent to this node
    	//for(i=0;i if(s==this[i]) this.splice(i, 1);
    	var adjLink=this.getAdjLink(node);

    	if(adjLink.length!=0)
    	{
    		for(var i=0;i<adjLink.length;i++)
    		{

    			//for(j=0;j<adjLink.length;j++){console.log('-'+adjLink[j].id);}
    			var link2remove=adjLink[i];
    			this.removeLink(link2remove);
    			//for(j=0;j<adjLink.length;j++){console.log('-'+adjLink[j].id);}
    		}

    	}
    	for(var k=0;k<this.nodes.length;k++)
		{
		 	if(node.id == this.nodes[k].id)
		 	{this.nodes.splice(k, 1);}
		}
    },

    cloneObject : function(obj){
        var that = this;

        // if(obj.compartments==undefined)
        // {


        obj.nodes.forEach(function(node){
            if(node.biologicalType=="reaction"){

                that.addNode(
                    node.name,
                    undefined,
                    node.dbIdentifier,
                    node.id,
                    node.reactionReversibility,
                    'reaction',
                    false,
                    true,
                    undefined,
                    node.svgWidth,
                    node.svgHeight,
                    undefined,
                    node.ec,
                    false,
                    undefined,
                    node.pathways,
                    node.locked,
                    node.alias,
                    node.label,
                    node.labelFont,
                    node.hidden
                    );

            }
            else
            {
                if(node.biologicalType=="pathway") {
                    that.addNode(
                        node.name,
                        undefined,
                        node.dbIdentifier,
                        node.id,
                        node.reactionReversibility,
                        'pathway',
                        false,
                        true,
                        undefined,
                        node.svgWidth,
                        node.svgHeight,
                        undefined,
                        node.ec,
                        false,
                        undefined,
                        node.pathways,
                        node.locked,
                        node.alias,
                        node.label,
                        node.labelFont,
                        node.hidden
                    );
                }
                else
                {
                    //console.log(node.labelFont);
                    that.addNode(
                    node.name,
                    node.compartment,
                    node.dbIdentifier,
                    node.id,
                    undefined,
                    'metabolite',
                    false,
                    true,
                    node.svg,
                    node.svgWidth,
                    node.svgHeight,
                    node.isSideCompound,
                    undefined,
                    node.duplicated,
                    node.identifier,
                    node.pathways,
                    node.locked,
                    node.alias,
                    node.label,
                    node.labelFont,
                    node.hidden);
                }
            }
            if(node.mappingDatas!=undefined){
                if(node.mappingDatas.length>0){
                    node.mappingDatas.forEach(function(mappingData){
                        var map = new MappingData(mappingData.node, mappingData.mappingName, mappingData.conditionName, mappingData.mapValue);
                        that.nodes[that.nodes.length-1].addMappingData(map);
                    });
                }
            }
            if (node.imagePosition != undefined){
                that.nodes[that.nodes.length-1].imagePosition = node.imagePosition;
            }

            that.nodes[that.nodes.length-1].x = node.x;
            that.nodes[that.nodes.length-1].y = node.y;
        });

        obj.links.forEach(function(link){
            var source = link.source;
            var target = link.target;
            if((source instanceof NodeData)){
                source=that.nodes.find(function (n) {
                    return source.getId()===n.getId();
                })
            }
            if((target instanceof NodeData)){
                target=that.nodes.find(function (n) {
                    return target.getId()===n.getId();
                })
            }
            that.addLink(link.id,
                source,
                target,
                link.interaction,
                link.reversible);
        });

        if(obj.pathways){
            obj.pathways.forEach(function(pathway){
                var newPath = that.copyPathway(pathway);
                var arrayNewNodes = [];
                newPath.nodes.forEach(function(node, i){
                    var newNode = that.nodes.find(function (n) {
                        return n.getId()===node.getId();
                    });
                    if(newNode)
                    {
                        arrayNewNodes.push(newNode);
                    }
                });
                newPath.nodes=[];
                arrayNewNodes.forEach(function(newNode){
                    newPath.addNode(newNode);
                });

            });
        }


    }
};