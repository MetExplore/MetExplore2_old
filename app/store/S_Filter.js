Ext.define('MetExplore.store.S_Filter', {
	extend : 'Ext.data.Store',

	requires : [],

	model : 'MetExplore.model.Filter',

    addStoreFilter: function(grid, id, dbid) {
		//console.log(grid);
        //console.log(grid.panel.typeObject);

        if (this.last())
            var num = this.last().get('num') + 1;
        else
            var num = 1;

        var object= grid.panel.typeObject;
        if (object== "CompartmentInBioSource") object= "Compartment";

        var filter = {
            'num': num,
			'object': grid.panel.typeObject,
			'ids':id,
            'dbIdentifiers': dbid,
			'Compartment':"",
			'Pathway':"",
			'Reaction':"",
			'Metabolite':"",
			'Enzyme':"",
			'Protein':"",
			'Gene':""
        };


		filter[object]= id;
        this.add(filter);
        // if(mapping.title!='Knock out Analysis')
        // 	this.launchMappingInVisualization(mapping);

        return num
    },

});