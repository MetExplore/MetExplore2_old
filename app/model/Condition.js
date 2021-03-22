/**
 * Condition
 */
    Ext.define('MetExplore.model.Condition', {
        extend: 'Ext.data.Model',
        fields: ['condName','condInMetabolite'],
        getCondName : function(){
        	return this.get('condName');
        },
        getCondInMetabolite : function(){
        	return this.get('condInMetabolite');
        }
    });
