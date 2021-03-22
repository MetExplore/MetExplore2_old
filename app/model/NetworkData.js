/**
 * @author MC
 * @description 
 */
 /**
* NetworkData class
* nodes is an array of Node objects
* link is an array of Link objects
*/
Ext.define('MetExplore.model.NetworkData', {
    extend: 'Ext.data.Model',
    config: {
            models: ['NodeData','LinkData']
    },
    fields:[{name: 'id', type: 'string'}],
    hasMany: {     
            name: 'nodes',                                                         
            model: 'NodeData'                                              
        },
        hasMany: {     
            name: 'links',                                                         
            model: 'LinkData'                                             
        },

    getNodes:function()
    {
      return this.nodes;
    },

    setId:function(newId)
    {
       this.set('id', newId);
    },
        

    getId:function()
    {
       return this.get('id');
    }, 

    copyData:function(aData)
    {
      this.set('nodes', aData.getNodes());
      this.set('links', aData.getLinks());
    },
    getNodesLength:function()
    {
      return this.get('nodes').length;
    },

    getLinks:function()
    {
      return this.get('links');
    },

    containsNode: function(id)
    {
        var allNodes=[];
        var contains=false;
        allNodes=this.get('nodes');
        for(i=0;i<allNodes.length;i++)
        {
            if(allNodes[i].getId()==(id))
                {contains=true;break;}
        }
        return contains;
    },

    getNodeById: function(id){
        var allNodes=[];
        allNodes=this.raw.nodes;
        //console.log(this.data.nodes);
        var node;
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

    getLinkById: function(id){
        var allLinks=[];
        allLinks=this.get('links');
        var link;
        for(i=0;i<allLinks.length;i++)
        {
            if(allLinks[i].getId()==(id))
                {link=allLinks[i];break;}
        }
        return link;
    },

    getNode: function(indice){
        return this.get('nodes')[indice];
    },

    getLink: function(indice){
        return this.get('links')[indice];
    },

    addLink:function(id,source,target,interaction,reversible){
      if(this.get('links') == undefined)
        this.set('links', []);

      var object= Ext.create('MetExplore.model.LinkData', {
                            id :id,
                            source :source,
                            target :target,
                            interaction :interaction,
                            reversible :reversible                         
                        });
      this.get('links').push(object.getData());
    },

    getDataNodes:function(){
        var nodes=[];

        this.get('nodes').forEach(function(node){
            nodes.push(node.getData());
        });

        return nodes;
    },

    addNodeCopy:function(node){
         this.get('nodes').push(node);
    },
   
    addNode:function(name,compartment,dbIdentifier,id,reactionReversibility,biologicalType,selected,labelVisible,svg,svgWidth,svgHeight,isSideCompound,ec){
        if(this.get('nodes') == undefined)
            this.set('nodes', []);

        var object= Ext.create('MetExplore.model.NodeData', {
            name :name,
            compartment :compartment,
            dbIdentifier :dbIdentifier,
            id :id,
            reactionReversibility :reactionReversibility ,
            biologicalType :biologicalType,
            selected :selected,
            labelVisible :labelVisible,
            svg :svg,
            svgWidth :svgWidth,
            svgHeight :svgHeight,
            isSideCompound : isSideCompound,
            ec : ec                       
        });
        //console.log('ec '+ec);
        //console.log('ec '+object.getEC());
        this.get('nodes').push(object);
        return object;
    },
    
    //get the array of link adjacent to a node
    getAdjLink : function (node)
    {
    	var adjLink=[];
    	var cpt=0;
    	for(var i=0;i<this.get('links').length;i++)
    	{
    		var link = this.get('links')[i];
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
			for(k=0;k<this.get('links').length;k++)
			{
			 	if(link.id == this.get('links')[k].id)
			 	{this.get('links').splice(k, 1);}
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

    			//for(j=0;j<adjLink.length;j++){console.log('-'+adjLink[j].get('id'));}
    			var link2remove=adjLink[i];
    			this.removeLink(link2remove);
    			//for(j=0;j<adjLink.length;j++){console.log('-'+adjLink[j].get('id'));}
    		}
    		
    	}
    	for(var k=0;k<this.get('nodes').length;k++)
		{
		 	if(node.id == this.get('nodes')[k].id)
		 	{this.get('nodes').splice(k, 1);}
		}
    }
});