/**
 * gridMetaboliteIds
 */
Ext.define('MetExplore.view.grid.V_gridMetaboliteIds', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridMetaboliteIds',

    enableTextSelection: true,
    border: false,
    layout: 'fit',


    store: 'storeMetaboliteIdentifiers',

    hideHeaders: true,
    cls: "MultirowGrid",

    columns: [{
        dataIndex: 'dbname',
        header: "Source",
        sortable: false,
        flex: 1
    }, {
        dataIndex: 'dbid',
        header: "id",
        sortable: false,
        renderer: function(value, meta, record) {

            var values = value.split("<br/>");
            var links = "";
            values.forEach(function(val, i) {

                // Fix url in function of database
                switch (record.get("dbname")) {
                    case "hmdb":
                        if (i > 0) {
                            links += "<br/>"
                        };
                        links += Ext.String.format('<a target="_blank" href="http://www.hmdb.ca/metabolites/{0}">{0}</a>', val);
                        break;
                    case "chemspider":
                        if (i > 0) {
                            links += "<br/>"
                        };
                        links += Ext.String.format('<a target="_blank" href="http://www.chemspider.com/Chemical-Structure.{0}.html">{0}</a>', val);
                        break;
                    case "kegg.compound":
                        if (i > 0) {
                            links += "<br/>"
                        };
                        links += Ext.String.format('<a target="_blank" href="http://www.genome.jp/dbget-bin/www_bget?cpd:{0}">{0}</a>', val);
                        break;
                    case "pubchem.compound":
                        if (i > 0) {
                            links += "<br/>"
                        };
                        links += Ext.String.format('<a target="_blank" href="https://pubchem.ncbi.nlm.nih.gov/compound/{0}">{0}</a>', val);
                        break;
                    case "SBO":
                        if (i > 0) {
                            links += "<br/>"
                        };
                        links += Ext.String.format('<a target="_blank" href="http://www.ebi.ac.uk/sbo/main/{0}">{0}</a>', val);
                        break;
                    case "chebi":
                        if (i > 0) {
                            links += "<br/>"
                        };
                        links += Ext.String.format('<a target="_blank" href="https://www.ebi.ac.uk/chebi/searchId.do?chebiId={0}">{0}</a>', val);
                        break;
                    default:
                        links += val;
                }
            });
            return links;
        },
        flex: 3
    }],

    /**
     * 
     * @param {} param
     */
    constructor: function(param) {
        var rec = param.record;
        var mysqlid = rec.get('id');
        config = this.config;

        if (Ext.getStore('MetExplore.store.S_MetaboliteIdentifiers')) {
            var storeMetaboIDs = getStore('MetExplore.store.S_MetaboliteIdentifiers');
            storeMetaboIDs.removeAll();
        } else {
            var storeMetaboIDs = Ext.create('MetExplore.store.S_MetaboliteIdentifiers');
        }

        storeMetaboIDs.load({
            params: {
                idMySql: mysqlid
            },
            callback: function() {
                storeMetaboIDs.insert(0, [{
                    dbname: "Name",
                    dbid: rec.get('name')
                }, {
                    dbname: "Formula",
                    dbid: rec.get('chemicalFormula')
                }]);
            }
        });

        config.store = storeMetaboIDs;

        this.callParent([config]);

    }

});