/**
 * CompartmentInBioSource
 */
    Ext.define('MetExplore.model.CompartmentInBioSource', {
        extend: 'Ext.data.Model',
        fields: [{name:'idCompartment',type:'string'},
        	{name:'id',type:'string'},
        	{name:'identifier',type:'string'},
        	{name:'name', type:'string'},
        	{name:'color',type:'string'},
        	{name:'inConflictWith', type:'string'}],
        

       	getIdentifier:function()
	    {
	      return this.get('identifier');
	    },
	    getName:function()
	    {
	      return this.get('name');
	    },
	    getColor:function()
	    {
	      return this.get('color');
	    },
	    setColor:function(newColor)
	    {
	      return this.set('color',newColor);
	    }
    });
