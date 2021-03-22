/**
 * NetworkVizSession
 */
Ext.define('MetExplore.model.NetworkVizSession', {
		extend : 'Ext.data.Model',
        fields:[
        {name: 'id', type: 'string'},
        {name: 'graph', type: 'auto'},
        {name: 'd3Data', model: 'MetExplore.model.NetworkData'},
        {name: 'reactionStyle', model: 'MetExplore.model.ReactionStyle'},
        {name: 'linkStyle', model: 'MetExplore.model.LinkStyle'},
        {name: 'metaboliteStyle', model: 'MetExplore.model.MetaboliteStyle'},
        {name: 'linked', type: 'boolean'},
        {name: 'sideCompoundsDuplicated', type: 'boolean'},
        {name: 'active', type: 'boolean'},
        {name: 'mapped', type: 'string'},
        {name: 'mappingDataType', type: 'string'},
        {name: 'resizable', type: 'boolean'},
        {name: 'maxDisplayedLabels', type: 'int',defaultValue:500},
        {name:'vizEngine',type:'string',defaultValue:'D3'},
        'nodesMap','force'
        ],
        hasMany: {     
            name: 'selectedNodes',                                                         
            type: 'string'                                           
        },
        hasMany: {     
            name: 'duplicatedNodes',                                                         
            type: 'string'                                           
        },
        hasMany: {     
            name: 'metabolites',                                                         
            model: 'MetExplore.model.Metabolite'                                           
        },
        hasMany: {     
            name: 'reactions',                                                         
            model: 'MetExplore.model.Reaction'                                            
        },
        /*
        toJSON: function () {
            return 'Whatever you like' + this.get('id'); // etc.
        },
        */
        addSelectedNode : function(nodeId){
            if(this.get('selectedNodes')==undefined)
                this.set('selectedNodes', []);
            this.get('selectedNodes').push(nodeId);
        },

        addDuplicatedNode : function(node){
            if(this.get('duplicatedNodes')==undefined)
                this.set('duplicatedNodes', []);
            this.get('duplicatedNodes').push(node);
        },
        isActive : function(){
            return this.get('active');
        },

        setActivity : function(bool){
            this.set('active', bool);
        },

        /**
        * Add an array of nodes to the selection
        */
        addSelectedNodes : function(nodeIds){
            if(get('selectedNodes')==undefined)
                this.set('selectedNodes', []);
            for(n in nodeIds)
            {
                this.get('selectedNodes').push(nodeId);                
            }
        },
         getDuplicatedNodes:function(){
                return this.get('duplicatedNodes');
            },
        reset : function(){
            this.emptyMetabolites();
            this.emptyReactions();
            this.set('selectedNodes', []);
            this.set('duplicatedNodes', []);
        },

        sideCompoundsIsDuplicated:function()
        {
           return this.get('sideCompoundsDuplicated');
        },

        setSideCompoundsDuplicated:function(bool)
        {
           this.set('sideCompoundsDuplicated', bool);
        },

        getId:function()
        {
           return this.get('id');
        },    
        setId:function(newId)
        {
           this.set('id', newId);
        },

        getMetaboliteStyle:function()
        {
            return this.get('metaboliteStyle');
        },
        setMetaboliteStyle:function(met)
        {
            this.set('metaboliteStyle', met);
        },
        
        getMappingDataType:function()
        {
            return this.get('mappingDataType');
        },
        setMappingDataType:function(met)
        {
            this.set('mappingDataType', met);
        },

        isResizable:function()
        {
            return this.get('resizable');
        },
        setResizable:function(bool)
        {
            this.set('resizable', bool);
        },

        isMapped:function()
        {
            return this.get('mapped');
        },
        setMapped:function(bool)
        {
            this.set('mapped', bool);
        },

        isLinked:function()
        {
            return this.get('linked');
        },
        setLinked:function(bool)
        {
            this.set('linked', bool);
        },

        getLinkStyle:function()
        {
            return this.get('linkStyle');
        },
        setLinkStyle:function(link)
        {
            this.set('linkStyle', link);
        },

        getReactionStyle:function()
        {
            return this.get('reactionStyle');
        },
        setReactionStyle:function(reac)
        {
            this.set('reactionStyle', reac);
        },

        getD3Data:function()
        {
            return this.get('d3Data');
        },
        setD3Data:function(d3Data)
        {
            this.set('d3Data', d3Data);
        },

        getForce:function()
        {
            return this.get('force');
        },
        setForce:function(force)
        {
            this.set('force', force);
        },

        getNodesMap : function(){
            if (this.get('nodesMap')==undefined)
                this.set("nodesMap", new Object());
            return this.get('nodesMap');
        },        
      
        getGraph : function(){
            return this.get('graph');
        },
        setGraph: function(graph){
            this.set('graph', graph);
        },

        //Clearly not optimal...
        removeSelectedNode:function(nodeId){
            var found=false;
            var i=0;
            while(!found)
            {
                if(this.get('selectedNodes')[i]==nodeId)
                {
                    this.get('selectedNodes').splice(i,1);
                    found=true;        
                }
                i++;
            }
            //console.log(this.selectedNodes);
        },

        removeAllSelectedNodes:function(){
            while(this.get('selectedNodes').length > 0) {
                this.get('selectedNodes').pop();
                }
        },
        getSelectedNodes:function(){
            return this.get('selectedNodes');
        },

        removeReaction : function(reactionID){
            var found=false;
            var i=0;
            while(!found)
            {
                if(this.getReactions()[i].get('id')==reactionID)
                {
                    this.getReactions().splice(i,1);
                    found=true;        
                }
                i++;
            }
        },
        removeMetabolite : function(metaboliteID){
            var found=false;
            var i=0;
            while(!found)
            {
                if(this.getMetabolites()[i].get('id')==metaboliteID)
                {
                    this.getMetabolites().splice(i,1);
                    found=true;        
                }
                i++;
            }
        },
        // getReactions:function(){return this.data.reactions;},
        getReactions:function(){return this.get("reactions");},
        getMetabolites:function(){return this.get("metabolites");},
        emptyReactions:function(){this.set("reactions", []);},
        emptyMetabolites:function(){this.set("metabolites", []);},
        //If there are less than this number of reactions in the store, then the labelled are displayed.
        getMaxDisplayedLabels:function(){return this.get('maxDisplayedLabels');},
        setMaxDisplayedLabels:function(maxLabels){this.set("maxDisplayedLabels", maxLabels);},
        //Default is 'D3' for D3.js
        //'cytoscape' is for Cytoscape.js
        setVizEngine:function(viz){this.set("vizEngine", viz);},
        getVizEngine:function(){return this.get('vizEngine');}
    });