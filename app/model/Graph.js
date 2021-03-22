/**
 * Graph class
 * id is a String containing the unique id of the graph
 * nodes is an array of Node objects
 * edges is an array of Edge objects
 */

Ext.define('MetExplore.model.Graph', {
	extend: 'Ext.data.Model',
	fields: [
	         {name: 'id', type: 'string'},
	         {name: 'nodes', type: 'auto'},
	         {name: 'edges', type: 'auto'}
	         ],

	         containsNode: function(id)
	         {
	        	 var allNodes=[];
	        	 var contains=false;
	        	 allNodes=this.get('nodes');
	        	 for(i=0;i<allNodes.length;i++)
	        	 {
	        		 if(allNodes[i].get('id')==(id))
	        		 {contains=true;break;}
	        	 }
	        	 return contains;
	         },

	         getNode: function(id){
	        	 var allNodes=[];
	        	 allNodes=this.get('nodes');
	        	 var node;
	        	 for(i=0;i<allNodes.length;i++)
	        	 {
	        		 if(allNodes[i].get('id')==(id))
	        		 {node=allNodes[i];break;}
	        	 }
	        	 return node;
	         },

	         //This function will add an edge to the array of edges
	         addEdge: function(edge){
	        	 var currentLength=this.get('edges').length;

	        	 if(currentLength==0)
	        	 {
	        		 var allEdges=[];
	        		 allEdges.push(edge);
	        		 this.set('edges',allEdges);
	        	 }
	        	 else
	        	 {
	        		 var allEdges=[];
	        		 allEdges=this.get('edges');
	        		 var add=true;
	        		 for(i=0;i<allEdges.length;i++)
	        		 {
	        			 if(allEdges[i].equals(edge))
	        			 {add=false;break;}
	        		 }
	        		 if(add)
	        		 {
	        			 allEdges.push(edge);
	        			 this.set('edges',allEdges);
	        		 }        	
	        	 }
	         },

	         //This function will add a node to the array of nodes if it is not already in the list (note that equality on nodes is based on id).
	         addNode: function(node){
	        	 var currentLength=this.get('nodes').length;

	        	 if(currentLength==0)
	        	 {
	        		 var allNodes=[];
	        		 allNodes.push(node);
	        		 this.set('nodes',allNodes);
	        	 }
	        	 else
	        	 {
	        		 var allNodes=[];
	        		 allNodes=this.get('nodes');
	        		 var add=true;
	        		 for(i=0;i<allNodes.length;i++)
	        		 {
	        			 if(allNodes[i].equals(node))
	        			 {add=false;break;}
	        		 }
	        		 if(add)
	        		 {
	        			 allNodes.push(node);
	        			 this.set('nodes',allNodes);
	        		 }
	        	 }
	         },

	         //get the array of edges adjacent to a node
	         getAdjEdges : function (node)
	         {
	        	 var adjEdges=[];
	        	 var cpt=0;
	        	 for(var i=0;i<this.get('edges').length;i++)
	        	 {
	        		 var edge = this.get('edges')[i];
	        		 var source=edge.get('source');
	        		 var target=edge.get('target');
	        		 if(node.equals(source))
	        		 {
	        			 adjEdges.push(edge);
	        		 }
	        		 else
	        		 {
	        			 if(node.equals(target))
	        			 {
	        				 adjEdges.push(edge);
	        			 } 
	        		 } 
	        	 }
	        	 return adjEdges;	
	         },

	         //remove edge function
	         removeEdge : function (edge){
	        	 for(k=0;k<this.get('edges').length;k++)
	        	 {
	        		 if(edge.equals(this.get('edges')[k]))
	        		 {this.get('edges').splice(k, 1);}
	        	 }


	         },


	         //remove node function
	         removeNode : function (node){
	        	 //first, remove all the edges adjacent to this node
	        	 //for(i=0;i if(s==this[i]) this.splice(i, 1);
	        	 var adjEdges=this.getAdjEdges(node);

	        	 if(adjEdges.length!=0)
	        	 {
	        		 for(var i=0;i<adjEdges.length;i++)
	        		 {

	        			 //for(j=0;j<adjEdges.length;j++){console.log('-'+adjEdges[j].get('id'));}
	        			 var edge2remove=adjEdges[i];
	        			 this.removeEdge(edge2remove);
	        			 //for(j=0;j<adjEdges.length;j++){console.log('-'+adjEdges[j].get('id'));}
	        		 }

	        	 }
	        	 for(var k=0;k<this.get('nodes').length;k++)
	        	 {
	        		 if(node.equals(this.get('nodes')[k]))
	        		 {this.get('nodes').splice(k, 1);}
	        	 }

	         }


});