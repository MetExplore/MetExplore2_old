/**
 * NodeData class
 * For now, only contains the id
 */
    Ext.define('MetExplore.model.NodeData', {
        extend: 'Ext.data.Model',
        fields: [
          {name: 'name', type: 'string'},
          {name: 'compartment', type: 'string'},
          {name: 'dbIdentifier', type: 'string'},
          {name: 'ec', type:'string'},
          {name: 'id', type: 'string'},          
          {name: 'reactionReversibility', type: 'boolean'},
          {name: 'isSideCompound', type: 'boolean'},
          //a reaction or a metabolite...later a gene?
          {name: 'biologicalType', type: 'string'},
          {name: 'selected', type: 'boolean'},
          {name: 'labelVisible', type: 'boolean'},
          {name: 'svg', type: 'string'},
          {name: 'svgWidth', type: 'string'},
          {name: 'svgHeight', type: 'string'}
        	],
     
        equals : function(x){
        	var equal=true;
			    if(this.get('id')!=x.get('id'))
				    {equal=false;}
  			return equal;
    		},
    		
    		toString :function(){
    		return this.get('id');
    		},

        isSelected :function(){
        return this.get('selected');
        },

        setIsSelected : function(b){
          this.set('selected',b);
        },

        isSideCompound : function(){
          return this.get('isSideCompound');
        },
        setIsSideCompound : function(b){
          this.set('isSideCompound',b);
        },

        getId:function()
        {
          return this.get('id');
        },

        getDbIdentifier:function()
        {
          return this.get('dbIdentifier');
        },

        getBiologicalType:function()
        {
          return this.get('biologicalType');
        },

        getLabelVisible:function()
        {
          return this.get('labelVisible');
        },

        getReactionReversibility:function()
        {
          return this.get('reactionReversibility');
        },

        getName:function()
        {
          return this.get('name');
        },

        getId:function()
        {
          return this.get('id');
        },

        getSvg:function()
        {
          return this.get('svg');
        },

        getSvgHeight:function()
        {
          return this.get('svgHeight');
        },

        getSvgWidth:function()
        {
          return this.get('svgWidth');
        },

        getCompartment:function()
        {
          return this.get('compartment');
        },
        getEC:function()
        {
          return this.get('ec');
        }       
    });