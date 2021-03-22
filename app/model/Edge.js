/**
 * Edge class
 * id : a String for the identifier of the edge
 * Contains a source Node
 * Contains a target Node
 * Boolean telling wether the edge is directed or not
 */

    Ext.define('MetExplore.model.Edge', {
        extend: 'Ext.data.Model',
         fields: [
        {name: 'id', type: 'string'},
        {name: 'source', type: 'auto'},
        {name: 'target', type: 'auto'},
        {name: 'directed', type: 'boolean'}
        ],
        
        // Getters & Setters
        getSource:function(){
            return this.source;
        },
/**
 * 
 * @param {} x
 * @return {Boolean}
 */
        equals : function(x){
			if(this.get('id')!=x.get('id'))
				return false;
			/*if(!this.get('source').equals(x.get('source')))
				return false;
			if(!this.get('target').equals(x.get('target')))
				return false;	
			if(!this.get('directed')==x.get('directed'))
				return false;	*/
					
  			return true;
		}
    });