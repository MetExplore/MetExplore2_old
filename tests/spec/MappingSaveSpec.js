'use strict';
//require("../data/dataMappingSave");

var app = null;
var mainPanel = null;
var questionStore = null;
var storeLength = -1;
var controller = null;
var controllerBioSource = null;
var in1;
var in2 = 4;
var in1_network;
var in2_network;
var out_attendu;
var out_attendu_network;
var json_mapping;
var gridBioSource;
var gridPathway;
var gridReaction;
var gridMetabolite;
var gridEnzyme;
var gridProtein;
var gridGene;

$.getJSON("tests/data/in1_MappingSave_datamapping.json", function(json) {
    in1 = json;
});
$.getJSON("tests/data/out_MappingSave_datamapping.json", function(json) {
    out_attendu = json;
    //console.log(out_attendu);
});
$.getJSON("tests/data/in1_MappingSave_datanetwork.json", function(json) {
    in1_network = json;
});
$.getJSON("tests/data/in2_MappingSave_datanetwork.json", function(json) {
    in2_network = json;
});
$.getJSON("tests/data/json_Mapping.json", function(json) {
    json_mapping = json;
});
$.getJSON("tests/data/out_MappingSave_datanetwork.json", function(json) {
    out_attendu_network = json;
});

var flag = false;

function testAsync(done) {
    // Wait two seconds, then set the flag to true
    setTimeout(function() {
        flag = true;

        // Invoke the special done callback
        done();
    }, 2000);
}


describe("Feature Mapping Save", function() {

    var originalTimeout;
    beforeEach(function(done) {
        jasmine.addMatchers(DOMCustomMatchers);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
        // Make an async call, passing the special done callback
        testAsync(done);

        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

        // Wait store load
        setTimeout(function() {
            var ctrlGenericGrid = MetExplore.app.getController('MetExplore.controller.C_GenericGrid')
            ctrlGenericGrid.selectBioSource("1363");
        }, 5000);

        controller = MetExplore.app.getController('C_Map');
        //controller.init();
        gridBioSource = Ext.getCmp('gridBioSource');
        var panel = gridBioSource.up('panel');

        gridPathway = Ext.getCmp('gridPathway');
        gridReaction = Ext.getCmp('gridReaction');
        // gridMetabolite= Ext.getCmp('gridMetabolite');
        // gridProtein= Ext.getCmp('gridProtein');
        // gridEnzyme= Ext.getCmp('gridEnzyme');
        // gridGene= Ext.getCmp('gridGene');
        panel.setActiveTab(gridBioSource);
        panel.setActiveTab(gridPathway);
        panel.setActiveTab(gridReaction);
        // panel.setActiveTab(gridMetabolite);
        // panel.setActiveTab(gridProtein);
        // panel.setActiveTab(gridEnzyme);
        // panel.setActiveTab(gridGene);
        //btn_gridReaction= document.getElementsByTagName()

    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });


    it("Should be true if the async call has completed", function() {
        expect(flag).toEqual(true);
    });

    it("Controller shouldnt be null", function() {
        expect(controller != null).toBeTruthy();
    });


    /*-----------------------------------------------------------------------------
    1- test unitaire des functions presentes dans le code (basée sur json in & out)
    2- test du contenu des stores extjs impactés par la feature
    3- test du contenu des vues extjs impactés par la feature
    4- test présence de la vue dans le dom
     */
    /*
    creation json :
        - info de mapping (id, field, object (contenu du store S_MappingInfo)
        - data_mapping : info des datas saisies par user (dans la grid)
        - data_network: info de calcul de mapping
                - grid de l'objet mappes (data +valeur de conditions)
                - grid des objets parent pour coverage + calculs enrichissements)

    chargement json : loadJsonMapping
         - lecture des infos
         - chargement dans la grid de l'objet mappe
         - chargement dans les grid parent
        */


    /*
     data_mapping
     in1 : json issue de la grid copy/paste du mapping
     in2 : nb de conditions (ici 4)
     out : json des data apres mapping
     */


    it("data_mapping", function() {
        //controllerBioSource.updateGrid(1363);
        var out = controller.data_mapping(in1, in2);
        //suppression de label "datamapping"
        out = out.substring(8);
        // console.log('out_attendu',out_attendu);
        // console.log(out);
        expect(_.isEqual(JSON.parse(out), out_attendu)).toBe(true);
    });



    it("load mapping", function() {
        //test store
        controller.loadJsonMapping(json_mapping);

        // test store Reaction valeurs de la 1er ligne
        var storeR = Ext.getStore('S_Reaction');
        storeR.sort({
            property: 'M1identified',
            direction: 'DESC'
        });
        expect(storeR.data.items[0].get('M1identified')).toBe(true);
        expect(storeR.data.items[0].get('M1idMap')).toBe('R_ALAR');

        // test store Pathway valeurs de la 1er ligne
        var storeP = Ext.getStore('S_Pathway');
        storeP.sort({
            property: 'M1coverage',
            direction: 'DESC'
        });
        expect(storeP.data.items[0].get('M1coverage')).toBe(62.5);
        expect(storeP.data.items[0].get('M1nbMapped')).toBe(10);
        expect(storeP.data.items[0].get('M1pathEnrich')).toBe(5.625817527309857e-29);
        expect(storeP.data.items[0].get('M1pathSignif')).toBe(5.625817527309857e-29);
        console.log(storeP.data.items[0]);

        //test des vues
        //récupération de tous les dataIndex de la grid
        var gridRindex = Ext.Array.pluck(gridReaction.headerCt.gridDataColumns, 'dataIndex');
        expect(gridRindex.indexOf("M1identified") > -1).toBe(true);
        expect(gridRindex.indexOf("M1map0") > -1).toBe(true);
        expect(gridRindex.indexOf("M1map0") > -1).toBe(true);
        expect(gridRindex.indexOf("M1map0") > -1).toBe(true);
        expect(gridRindex.indexOf("M1map3") > -1).toBe(true);
        //console.log(gridRindex);

        //récupération de tous les dataIndex de la grid
        var gridPindex = Ext.Array.pluck(gridPathway.headerCt.gridDataColumns, 'dataIndex');
        expect(gridPindex.indexOf("M1coverage") > -1).toBe(true);
        expect(gridPindex.indexOf("M1nbMapped") > -1).toBe(true);
        expect(gridPindex.indexOf("M1pathEnrich") > -1).toBe(true);
        expect(gridPindex.indexOf("M1pathSignif") > -1).toBe(true);

        //test dom
        var gridR = document.getElementById('gridReaction');
        expect(gridR).toBeHTMLElement();

        var gridP = document.getElementById('gridPathway');
        expect(gridP).toBeHTMLElement();

    });

    // //ne fonctionne que si le load data a eu lieu
    // it("data network", function(done) {
    //     setTimeout(function(){
    //         var out= controller.data_network(["M1"],"Reaction" );
    //         // modification du out en json
    //         out= "{"+ out.substring(2)+"}";
    //         console.log(out);
    //         expect(_.isEqual(JSON.parse(out), out_attendu_network)).toBe(true);
    //         done();
    //     }, 8000);
    // });
});