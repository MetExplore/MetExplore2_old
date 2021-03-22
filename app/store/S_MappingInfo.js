/**
 * S_Mapping
 * List of currents mappings
 * model : MetExplore.model.MappingInfo
 */
Ext.define('MetExplore.store.S_MappingInfo', {
    extend: 'Ext.data.Store',
    model: 'MetExplore.model.MappingInfo',

    autoLoad: false,
    listeners: {
        // update: function(store, record, operation, modifiedFieldNames, details, eOpts) {

        // 	if(modifiedFieldNames[0]=='nbData'){
        // 		if(record!=undefined){
        // 			var mapping = record.data;          
        // 			//this.launchMappingInVisualization(mapping);
        // 		}
        // 	}
        // },
        remove: function(store, records, index, isMove, eOpts) {

            // if(store.count()==0)
            // 	Ext.getCmp("mappingVizPanel").hide();

            MetExploreViz.onloadMetExploreViz(function() {
                metExploreViz.onloadSession(function() {
                    metExploreViz.GraphMapping.removeMappingData(records);
                });
            });
        },
        add: function(store, records) {
            // if(store.count()==1)
            //     Ext.getCmp("mappingVizPanel").show();
            var recInfo = records[0];
            var ctrlMap = MetExplore.app.getController('C_Map');
            var mapping = {
                'id': recInfo.get('id'),
                'object': recInfo.get('object'),
                'numero': recInfo.get('numero'),
                'title': recInfo.get('title'),
                'condName': recInfo.get('condName')
            };

            var itsCoverage = false;
           // ctrlMap.initMappingInVisualization(mapping, recInfo.get('numero'), itsCoverage);
            //console.log(records[0].get('idMapped'));
            //console.log(records[0].get('idMapped') != "");
            if (records[0].get('idMapped') != "") {
                this.addDataStore(records[0]);
            }
        }
    },
    /**
     * 
     * @param {} objectName
     * @param {} fieldName
     * @param {} idBioSource
     * @param {} idMapped : an array of mysql ids
     * @param {} condName : an array of conditions
     * @param {} storeMap
     * @param {} nbMapped : number of mapped elements
     * @param {} nbData : number of data sent to the mapping
     * @param {} title
     * @return {}
     */
    addMappingInfo: function(objectName, fieldName, idBioSource, idMapped, condName, storeMap, nbMapped, nbData, title) {
        if (condName == '') condName = [];
        if (nbMapped == undefined) nbMapped = 0;
        if (nbData == undefined) nbData = 0;
        //var storeMapInfo
        if (this.last())
            var numero = this.last().get('numero') + 1;
        else
            var numero = 1;
        //var numero = storeMap.last().get('numero')


        if (title == undefined)
            title = 'Mapping_' + numero;

        var mapping = {
            'id': 'M' + numero,
            'title': title,
            'object': objectName,
            'field': fieldName,
            'numero': numero,
            'idBioSource': idBioSource,
            'idMapped': idMapped,
            'condName': condName,
            'storeMap': storeMap,
            'nbMapped': nbMapped,
            'nbData': nbData
        };

        this.add(mapping);
        // if(mapping.title!='Knock out Analysis')
        // 	this.launchMappingInVisualization(mapping);

        return numero;
    },

    /**
     * special multimapping avec class
     * @param gridData
     * @param title
     * @returns {*|number}
     */
    addMappingInfoMulti: function(gridData, title) {

        var numero = 1;
        if (this.last()) {
            numero = this.last().get('numero') + 1;
        }

        if (title == undefined || title == "" || title == "Mapping")
            title = 'Mapping_' + numero;

        var nbData = gridData.getStore().getCount();
        var sizeObj = Ext.getStore('S_Metabolite').getCount();


        var mapping = {
            'id': 'M' + numero,
            'title': title,
            'object': "Metabolite",
            'field': "multi-identifiers",
            'numero': numero,
            'idBioSource': MetExplore.globals.Session.idBioSource,
            'idMapped': "",
            'condName': ["Min distance"],
            'storeMap': "",
            'nbMapped': 0,
            'nbData': nbData,
            'nbDataInNetwork': 0,
            'sizeObject': sizeObj,
            'coverCondition': 0,
            'coverPathway': false,
            'coverReaction': false
        };

        this.add(mapping);
        // if(mapping.title!='Knock out Analysis')
        // 	this.launchMappingInVisualization(mapping);

        return 'M' + numero;
    },


    /**
     * mapping gene
     * @param gridData
     * @param title
     * @returns {*|number}
     */
    addMappingInfoGene :function(gridData, title) {

        var numero = 1;
        if (this.last()) {
            numero = this.last().get('numero') + 1;
        }

        if (title == undefined || title =="" || title=="Mapping")
            title= 'Mapping_'+ numero;

        var nbData= gridData.getStore().getCount();
        var sizeObj= Ext.getStore('S_Gene').getCount();


        var mapping = {
            'id' : 'M' + numero,
            'title' : title,
            'object' : "Gene",
            'field' : "dbIdentifier",
            'numero' : numero,
            'idBioSource': MetExplore.globals.Session.idBioSource,
            'idMapped' : "",
            'condName': "",
            'storeMap': "",
            'nbMapped': 0,
            'nbData':nbData,
            'nbDataInNetwork':0,
            'sizeObject': sizeObj,
            'coverCondition':0,
            'coverPathway':false,
            'coverReaction':false
        };

        this.add(mapping);
        // if(mapping.title!='Knock out Analysis')
        // 	this.launchMappingInVisualization(mapping);

        return 'M'+numero;
    },

	addDataStore : function(recInfo) {


		var object= recInfo.get('object');
		var mappingId= recInfo.get('id');
		var me= this;

		var ctrlMap= MetExplore.app.getController('C_Map');
		var mapping = 
		{
			'id' : recInfo.get('id'),
			'object' : recInfo.get('object'),
			'numero' : recInfo.get('numero'),
			'title' : recInfo.get('title'),
			'condName' :recInfo.get('condName')
		};

		var itsCoverage = false;
		
		var store1= Ext.getStore('S_'+object);

		var allStores = [store1],
			len = allStores.length,
			loadedStores = 0,
			i = 0;

		function checkMap() {
            if (++loadedStores === len) {
				AllStoresLoadedMap();
			}
		}

		for (; i < len; ++i) {
			allStores[i].on('load', checkMap, null, {single: true});
        }

        // if(MetExplore.globals.Session.mappingObjViz[recInfo.get('numero')]){
        //     MetExploreViz.onloadMetExploreViz(function(){
        //         metExploreViz.onloadSession(function(){
        //             //Load mapping
        //             console.log("loadDataFromJSON");console.log(MetExplore.globals.Session.mappingObjViz[recInfo.get('numero')]);metExploreViz.GraphMapping.loadDataFromJSON(JSON.stringify(MetExplore.globals.Session.mappingObjViz[recInfo.get('numero')]));
        //         });
        //     });
        // }

		function AllStoresLoadedMap(callback) {
			var ids= recInfo.get('idMapped').replace(' ','');
			var ListId= ids.split(',');
			//var ListId= recInfo.get('idMapped').split(', ');

			store1.each(function(rec){
				var index= ListId.indexOf(rec.get('id'));
				if (index > -1) {
					rec.set(mappingId+'identified', true);
					var mapped= rec.get('mapped');
					rec.set('mapped', mapped+1);
					//ctrlMap.dataMappingInVisualization("Identified", rec.get('dbIdentifier'),'' , recInfo.get('numero'), itsCoverage)
								
				} else {
					rec.set(mappingId+'identified', false);
				}

			});
			store1.sort({
				property : 'mapped',
				direction : 'DESC'
			});

			if ((object == 'Reaction' || object == 'Metabolite' || object == 'Gene' || object == 'Protein' || object == 'Enzyme') && ListId.length > 0 ) { //&& fieldName!= 'name') {
				var ctrl= MetExplore.app.getController('C_Map');
				ctrl.coverage('1');
			}

			var grid= Ext.getCmp('grid'+object);
			if (grid) {
				grid.createGroupCol(recInfo.get('title'),['Identified'],[mappingId+'identified'],false);
				grid.colorRowMapped();
			}
		}
	}
});

