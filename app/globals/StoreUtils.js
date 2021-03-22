/**
 * MetExplore.globals.StoreUtils
 */
Ext.define('MetExplore.globals.StoreUtils', {

    singleton: true,
    jsonMetabolite:'',


    /**
     * json d'un store
     * @param nameStore
     * @returns {*|Array}
     */
    storeTojson: function(nameStore) {
        //console.log('nameStore',nameStore);
        var items = Ext.getStore(nameStore).data.items;
        var result = Ext.Array.pluck(items, 'data');
        //console.log(result);
        return result
    },
    /**
     * json du store d'un composant
     * @param ui
     * @returns {*|Array}
     */
    uistoreTojson: function(ui) {
        //console.log('ui',ui);
        var items = ui.getStore().data.items;
        //console.log(items);
        var result = Ext.Array.pluck(items, 'data');
        //console.log(result);
        return result
    },

    /**
     * affecter un json a un store
     * @param nameStore
     * @returns {*|Array}
     */
    jsonTostore: function(nameStore, json) {

        var store = Ext.getStore(nameStore);
        store.proxy.reader.rawData = json;

    },

    /**
     * retourne les keys qui commencent par le contenu de tab
     * @param json
     * @param tab
     */
    keyscollection: function(json, tab) {
        //console.log('keyscollection',json,tab);
        var keys = _.remove(_.keys(json[0]), function(n) {
            return tab.indexOf(n.substr(0, 2)) != -1;
        });
        //console.log(keys);
        return keys
    },
    /**
     * renvoi un json avec les keys d'un tableau d'objet
     * @param tab
     * @param keys
     */
    tabTojson: function(tab, keys) {
        //console.log('tabtojson',tab, keys);
        var result = _.map(tab, function(object) {
            return _.pick(object, keys);
        });
        //console.log(result);
        return result;
    },
    /**
     * json to tabulate
     * @param json
     * @param keys
     * @returns {*}
     */
    jsonTotab: function(json, keys) {
        //console.log('-------------------jsontotab');
        //console.log(json);
        //console.log(keys);
        var result=_.map(json, function(obj){
            var arr=[];
            for(var i= 0; i < keys.length; i++)
            {
                if (obj[keys[i]]!=undefined) {
                    arr[i]= obj[keys[i]];//.replace( /<br>/g,"\r\n");
                }

            }

            return arr;
        });
        //result=_.concat([keys],result);
        return result;

    },

    /**
     * stringProcessing
     * @param word
     * @returns {string}
     */
    stringProcessing: function(word){
        var processedWord = word.toLowerCase();
/*
        var myRegex = new RegExp("^(.+),\\s(.+)$","gm");
        if (myRegex.test(processedWord)){
            var match = myRegexp.exec(processedWord);
            processedWord = match[1].concat(match[2]);
        }
*/

        processedWord = processedWord.replace(new RegExp("cis[^a-z]","gm"), "z"); //cis abbreviation
        processedWord = processedWord.replace(new RegExp("trans[^a-z]","gm"), "e"); //trans abbreviation
        processedWord = processedWord.replace(new RegExp("ic[_\\-\\s]*acid","gm"),"ate"); //acid form
        processedWord = processedWord.replace(new RegExp("inium","gm"),"ine"); //ion form
        processedWord = processedWord.replace(new RegExp("coenzyme","gm"), "co"); //coenzyme abreviation
        processedWord = processedWord.replace(new RegExp("\\(\\d[+-]\\)","gm"), ""); //charge
        processedWord = processedWord.replace(new RegExp("ofuranose","gm"), "ose"); //Monosaccharides cyclic form
        processedWord = processedWord.replace(new RegExp("opyranose","gm"), "ose"); //Monosaccharides cyclic form

        //greek letters
        processedWord = processedWord.replace(new RegExp("alpha","gm"),"α");
        processedWord = processedWord.replace(new RegExp("beta","gm"),"β");
        processedWord = processedWord.replace(new RegExp("gamma","gm"),"γ");
        processedWord = processedWord.replace(new RegExp("delta","gm"),"δ");
        processedWord = processedWord.replace(new RegExp("epsilon","gm"),"ε");
        processedWord = processedWord.replace(new RegExp("zeta","gm"),"ζ");
        processedWord = processedWord.replace(new RegExp("theta","gm"),"θ");
        processedWord = processedWord.replace(new RegExp("iota","gm"),"ι");
        processedWord = processedWord.replace(new RegExp("kappa","gm"),"κ");
        processedWord = processedWord.replace(new RegExp("lambda","gm"),"λ");
        processedWord = processedWord.replace(new RegExp("ksi","gm"),"ξ");
        processedWord = processedWord.replace(new RegExp("omicron","gm"),"ο");
        processedWord = processedWord.replace(new RegExp("rho","gm"),"ρ");
        processedWord = processedWord.replace(new RegExp("sigma","gm"),"σ");
        processedWord = processedWord.replace(new RegExp("upsilon","gm"),"υ");
        processedWord = processedWord.replace(new RegExp("khi","gm"),"χ");
        processedWord = processedWord.replace(new RegExp("omega","gm"),"ω");

        processedWord = processedWord.replace(new RegExp("[^\\da-zα-ω]","gm"), "");
        return processedWord;
    },
    /**
     * fuzzysearch
     * @param value
     */
    fuzzysearch: function(value) {

        var options = {
            shouldSort: true,
            threshold: 0.2,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "newname"
            ]
        };
        var fuse = new Fuse(MetExplore.globals.StoreUtils.jsonMetabolite, options);
        var processedWord= MetExplore.globals.StoreUtils.stringProcessing(value);

        var result= fuse.search(processedWord);
        var resultId= _.map(result,'id');
        var storeM = Ext.getStore('S_Metabolite');
        //console.log(storeM);
        //console.log(resultId);
        for (i=0; i<resultId.length; i++) {
            var metab= storeM.findRecord('id', resultId[i], 0, false, true, true);
            if (metab){
                metab.set('orderSearch',i);
            }
        }

        //store.clearFilter();
        // if (resultId.length > 0) {
        //     storeM.filterBy(function (record) {
        //         return resultId.indexOf(record.get('id')) !== -1;
        //     });
        // }

        var ids= resultId.join('|');
        //var ids= id.replace(/,/g,"|");
        var res= "/".concat(ids,"/");
        var filter = {id: 'name',  property: 'id', value: eval(res), anyMatch:true};
        storeM.addFilter(filter);


        storeM.sort({
            property: 'orderSearch',
            direction: 'ASC'
        });
    },


});