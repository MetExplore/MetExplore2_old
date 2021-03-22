/**
 * panel Details Attachemnt
 * Show informations of one given attachment, with right in edit if user can do it
 */
Ext.define('MetExplore.view.grid.V_GridDetailsHistory', {

	extend : 'Ext.grid.Panel',
	alias : 'widget.gridDetailsHistory',
		
	autoScroll: true,

	/**
	 * Constructor
	 * Get params given to the window and apply
	 */
	constructor : function(params) {
		var config = this.config;
		
		fields = params.fields.slice(2); //Fields of the grid store are set in the fields given in params except the two firsts items
		var data = params.data; //Data of the store
		
		config.store = Ext.create('Ext.data.Store', {
			fields: fields,
			data: data
		});
				
		var bbar = {items: [], height: 15}; //This toolbar is not "useful" but if we remove it, we have not horizontal scrollbar anymore. In practice, we don't see it
		
		config.bbar = bbar;
		
		var columns = [{text: "", dataIndex: "old/new", width: 37}];
		
		Ext.each(fields.slice(1), function(field, index) { //We add columns for each item in the field list, except the first one (correspond to the date)
			columns.push({
				text: field,
				dataIndex: field,
				renderer : function(value, metadata, record) {
					var store = record.store;
					var idxComp = record.index % 2 == 0 ? record.index + 1 : record.index - 1; //If we have to compare two rows, give for each row the id of the row to compare with: if id of the current row is odd, the compared row id is the next row id, else if id of the current row is even, the compared row id is the previous row id 
					if (idxComp < store.getCount() && store.getAt(idxComp).get(field) != value && store.getAt(idxComp).get("old/new") != record.get("old/new")) { //In this case, we make a comparison between paired rows
						metadata.style = "background-color:yellow;"; //if compared values are differents, we set the background color of the cell yellow
					}
	                metadata.tdAttr = 'data-qtip="' + value.replace(/"/g, "'") + '"'; //Set tooltip : replace " with ' to prevent bugs
	                return value;
				}
			})
		});
		
		config.columns = columns;
		
		this.callParent([config]);
	},
	
	//Set row background color:
	viewConfig: { 
        stripeRows: false, 
        getRowClass: function(record) { 
            return record.get('old/new') == "new" ? 'newValueInHistory' : 'oldValueInHistory'; //if old/new value is new, background of the cell is green, else it is red
        } 
    } 
});