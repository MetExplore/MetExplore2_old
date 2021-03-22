/**
 * history report informations
 * Summarize informations contained in the showed history
 */
Ext.define('MetExplore.view.form.V_HistoryReport', {

    extend: 'Ext.form.Panel',
    alias: 'widget.historyReport',

    layout: {
        type: 'vbox',
        align: 'stretch',
        animate: true
    },

    bodyStyle: 'background:transparent;',
    border: false,

    constrainHeader: true,
    buttonAlign: 'right',
    buttons: [{
        text: "Close",
        action: 'close'
    }],

    /**
     * Items
     * @type Object
     */
    items: [{
        xtype: 'combobox',
        action: 'selectBioSource',
        fieldLabel: 'For BioSource',
        displayField: 'name',
        valueField: 'id',
        editable: false
    }, {
        xtype: 'label',
        name: 'results',
        flex: 1,
        autoScroll: true,
        margins: '10 0 0 10',
        cls: 'font12'
    }],

    construction: function(params) {
        var config = this.config;
        config.entries = params.entries;
        config.biosources = params.biosources;
        this.callParent([config]);
    },

    initComponent: function() {
        this.callParent(arguments);
        //Update BioSources list:
        var store = Ext.create('Ext.data.Store', {
            fields: [{
                name: 'id',
                type: 'int'
            }, {
                name: 'name',
                type: 'string'
            }],
            data: this.biosources
        });
        var combo = this.down('combobox[action="selectBioSource"]');
        combo.bindStore(store);
        combo.setValue(-1);
        //Show reports for all BioSources:
        this.refreshReport(-1);
    },

    refreshReport: function(biosource) {
        //Get entries of interest:
        var theEntries = [];
        if (biosource == -1) {
            for (var bs in this.entries) {
                for (var it = 0; it < this.entries[bs].length; it++) {
                    theEntries.push(this.entries[bs][it]);
                }
            }
        } else {
            if (this.entries[biosource] != undefined) {
                for (var it = 0; it < this.entries[biosource].length; it++) {
                    theEntries.push(this.entries[biosource][it]);
                }
            }
        }

        //Generate report:
        //Define patterns of actions:
        var patterns = [
            //patternUpdate
            /^Update\s(compartment|pathway|reaction|metabolite|enzyme|protein|gene)\s(\S+).*$/,
            //patternAdd
            /^Add\s(compartment|pathway|reaction|metabolite|enzyme|protein|gene)\s(\S+).*$/,
            //patternRemove
            /^(Remove|Delete)\s(compartment|pathway|reaction|metabolite|enzyme|protein|gene)\s(\S+).*$/,
            //patternUpdateOn
            /^Update\s(\d+)\s(compartment|pathway|reaction|metabolite|enzyme|protein|gene)s\son\s(compartment|pathway|reaction|metabolite|enzyme|protein|gene)\s(.+)$/,
            //patternAddIn
            /^Add\s(\d+)\s(compartment|pathway|reaction|metabolite|enzyme|protein|gene)s\sto\s(compartment|pathway|reaction|metabolite|enzyme|protein|gene)\s(.+)$/,
            //patternRemoveFrom
            /^(Remove|Delete)\s(\d+)\s(compartment|pathway|reaction|metabolite|enzyme|protein|gene)s\sfrom\s(compartment|pathway|reaction|metabolite|enzyme|protein|gene)\s(.+)$/
        ];
        var nbBadEntries = 0; //Number of actions mal-formated, so they are not recognized by any pattern
        results = {};
        for (var it = 0; it < theEntries.length; it++) {
            //Check if the action is in one pattern:
            var match = null;
            var iter = patterns.length - 1; //Parse from the end to the begin as some first patterns are in some last patterns
            while (match == null && iter >= 0) {
                match = theEntries[it].match(patterns[iter]);
                iter--;
            }
            iter++; //Go back to the iter of the match if any
            if (match != null) {
                switch (iter) {
                    case 0:
                        //The object is an update:
                        var action = "2|" + match[1] + "(s) updated.";
                        var type = this.classTypeObject(match[1]);
                        if (!results[type]) {
                            results[type] = {};
                        }
                        if (results[type][action]) {
                            results[type][action]++;
                        } else {
                            results[type][action] = 1;
                        }
                        break;
                    case 1:
                        //The object is an added:
                        var action = "1|" + match[1] + "(s) added.";
                        var type = this.classTypeObject(match[1]);
                        if (!results[type]) {
                            results[type] = {};
                        }
                        if (results[type][action]) {
                            results[type][action]++;
                        } else {
                            results[type][action] = 1;
                        }
                        break;
                    case 2:
                        //The object is an removed:
                        var action = "3|" + match[2] + "(s) removed.";
                        var type = this.classTypeObject(match[2]);
                        if (!results[type]) {
                            results[type] = {};
                        }
                        if (results[type][action]) {
                            results[type][action]++;
                        } else {
                            results[type][action] = 1;
                        }
                        break;
                    case 3:
                        //The object of another is updated:
                        var action = "4|" + match[2] + "(s) updated on " + match[3] + "s.";
                        var type = this.classTypeObject(match[3]);
                        if (!results[type]) {
                            results[type] = {};
                        }
                        if (results[type][action]) {
                            results[type][action] += parseInt(match[1]);
                        } else {
                            results[type][action] = parseInt(match[1]);
                        }
                        break;
                    case 4:
                        //The object of another is added:
                        var action = "5|" + match[2] + "(s) added on " + match[3] + "s.";
                        var type = this.classTypeObject(match[3]);
                        if (!results[type]) {
                            results[type] = {};
                        }
                        if (results[type][action]) {
                            results[type][action] += parseInt(match[1]);
                        } else {
                            results[type][action] = parseInt(match[1]);
                        }
                        break;
                    case 5:
                        //The object of another is removed:
                        var action = "6|" + match[3] + "(s) removed from " + match[4] + "s.";
                        var type = this.classTypeObject(match[4]);
                        if (!results[type]) {
                            results[type] = {};
                        }
                        if (results[type][action]) {
                            results[type][action] += parseInt(match[2]);
                        } else {
                            results[type][action] = parseInt(match[2]);
                        }
                        break;
                }
            } else {
                nbBadEntries++;
                console.log("Bad entry in history: " + theEntries[it]);
            }
        }
        if (nbBadEntries > 0) {
            console.log(nbBadEntries + " bad entries on the history has not been analysed");
        }

        //Generate report:
        var sorted_keys = Object.keys(results).sort();
        var txtResults = "";
        for (var it = 0; it < sorted_keys.length; it++) {
            txtResults += "<b>" + sorted_keys[it].substring(2) + ":</b><br/>\n";
            var sorted_items = Object.keys(results[sorted_keys[it]]).sort();
            for (var nb = 0; nb < sorted_items.length; nb++) {
                txtResults += "<b>" + results[sorted_keys[it]][sorted_items[nb]] + "</b> " + sorted_items[nb].substring(2) + "<br/>\n";
            }
            txtResults += "<br/>\n";
        }
        txtResults = txtResults.substring(0, txtResults.length - 6); //Remove last line break

        //Show report:
        this.down('label[name="results"]').setText(txtResults, false);
    },

    /**
     * Add number to type of object (compartment, pathways, ...) to sort them
     * @param {} type
     */
    classTypeObject: function(type) {
        switch (type) {
            case "compartment":
                return "0|Compartments";
            case "pathway":
                return "1|Pathways";
            case "reaction":
                return "2|Reactions";
            case "metabolite":
                return "3|Metabolites";
            case "enzyme":
                return "4|Enzymatic complexes";
            case "protein":
                return "5|Proteins";
            case "gene":
                return "6|Genes";
            default:
                return "7|" + type;
        }
    }

});