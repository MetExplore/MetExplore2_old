/**
 * @author MC
 * @description class to control MeSH fuzzy maching
 * C_SelectMapping
 */
Ext.define('MetExplore.controller.C_SelectMeSH', {
    extend: 'Ext.app.Controller',
    config: {
        views: ['form.V_SelectMeSH']
    },
    init: function() {
        var me = this;
        d3.json('resources/files/meshTerms.json', function(data) {
            me.datameshterms = data;
            var storeMeSHFiltered = Ext.getStore('S_MeSH4Select');
            storeMeSHFiltered.loadData([]);
        });
    },
    quering: function(newValue) {
        var me = this;
        var compounds;
        var fuse;

        var options = {
            shouldSort: true,
            includeScore: true,
            threshold: 0.4,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            keys: [
                "term"
            ],
            minMatchCharLength: 1
        };

        var meshterms = me.datameshterms;

        // the operation object
        // contains all of the details of the load operation

        init();

        function init() {
            fuse = new Fuse(meshterms, options);
        }

        function stringProcessing(word) {

            var processedWord = word.toLowerCase();

            var myRegex = new RegExp("^(.+),\\s(.+)$", "gm");
            if (myRegex.test(processedWord)) {
                var match = myRegexp.exec(processedWord);
                processedWord = match[1].concat(match[2]);
            }


            processedWord = processedWord.replace(new RegExp("cis[^a-z]", "gm"), "z"); //cis abbreviation
            processedWord = processedWord.replace(new RegExp("trans[^a-z]", "gm"), "e"); //trans abbreviation
            processedWord = processedWord.replace(new RegExp("ic[_\\-\\s]*acid", "gm"), "ate"); //acid form
            processedWord = processedWord.replace(new RegExp("inium", "gm"), "ine"); //ion form
            processedWord = processedWord.replace(new RegExp("coenzyme", "gm"), "co"); //coenzyme abreviation
            processedWord = processedWord.replace(new RegExp("\\(\\d[+-]\\)", "gm"), ""); //charge
            //	processedWord = processedWord.replace(new RegExp("\\s\\([^\\)]+\\)$", ""); //info

            processedWord = processedWord.replace(new RegExp("ofuranose", "gm"), "ose"); //Monosaccharides cyclic form
            processedWord = processedWord.replace(new RegExp("opyranose", "gm"), "ose"); //Monosaccharides cyclic form

            //greek letters
            processedWord = processedWord.replace(new RegExp("alpha", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("beta", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("gamma", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("delta", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("epsilon", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("zeta", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("theta", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("iota", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("kappa", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("lambda", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("ksi", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("omicron", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("rho", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("sigma", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("upsilon", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("khi", "gm"), "??");
            processedWord = processedWord.replace(new RegExp("omega", "gm"), "??");

            processedWord = processedWord.replace(new RegExp("[^\\da-z??-??]", "gm"), "");

            return processedWord;

        }

        function getMatches(query) {
            if (query) {
                return fuse.search(query);
            }
            return [];
        }

        var store = Ext.getStore('S_MeSH4Select');
        if (newValue) {
            var suggestions = getMatches(newValue).slice(0, 30);

            suggestions.forEach(function(sugg, i) {
                if (i < 30)
                    sugg.score = i;
            });
            store.loadData(suggestions);
        }

    }
});