/**
 * LinkData class
 * id : a String for the identifier of the Link
 * Contains a source Node
 * Contains a target Node
 * Boolean telling wether the Link is directed or not
 */

    Ext.define('MetExplore.model.LinkData', {
        extend: 'Ext.data.Model',
         fields: [
        {name: 'id', type: 'string'},
        {name: 'source', type: 'auto'},
        {name: 'target', type: 'auto'},
        {name: 'interaction', type: 'string'},
        {name: 'reversible', type: 'boolean'}
        ],
/**
 * 
 * @param {} x
 * @return {Boolean}
 */
        equals : function(x){
			if(this.get('id')!=x.get('id'))
				return false;
					
  			return true;
		},

        isReversible :function(){
        return this.get('reversible');
        },

        // Getters & Setters
        getSource:function(){
            return this.get('source');
        },

        getTarget:function(){
            return this.get('target');
        }

    });