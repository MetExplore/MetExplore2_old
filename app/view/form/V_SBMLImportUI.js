Ext.define("MetExplore.view.form.V_SBMLImportUI", {
    extend: "Ext.form.Panel",

    alias: "widget.SBMLImportUI",

    requires: ["MetExplore.globals.Session"],

    config: {
        java_application: null,
    },

    resizable: false,
    closable: true,
    fileUpload: true,
    autoScroll: true,
    bodyPadding: 5,

    fieldDefaults: {
        labelAlign: "left",
        width: 400,
        labelWidth: 100,
        margin: "5 5 5 5",
    },

    defaults: {
        width: 900,
        layout: {
            type: "table",
            columns: 4,
            tableAttrs: {
                style: {
                    width: "100%",
                },
            },
        },
    },

    items: [{
            xtype: "fieldset",
            title: "Description",
            items: [{
                    border: false,
                    colspan: 4,
                    html: "<em>Creates a BioSource from a standard SBML file. " +
                        "</br></br>The Import feature supports by default SBML Level 2 and Level 3 files.</br>" +
                        "SBML Level 3 introduced the notion of packages, each SBML Package adds new or complementary data to the model. Our Import feature, however, " +
                        "only supports the SBML FBC Package (version 2). SBML elements related to other packages will not be imported to MetExplore.</br>" +
                        'Find more information on SBML specifications <a href="http://sbml.org/" target="_blank">here</a></br></br>' +
                        "The SBML FBC package is read by a special importer that is enabled by default. You can fine tune, or disable, our importers " +
                        "in the advanced parameters section.</em></br></br>Our Import Feature uses JSBML as a Java library to read SBML files:</br>" +
                        '<em>N. Rodriguez, et al.. <a href="http://bioinformatics.oxfordjournals.org/content/31/20/3383" target"_blank" >JSBML 1.0: providing a smorgasbord of options to encode systems biology models.</a> Bioinformatics (2015), 31(20):3383–3386.</br></br>' +
                        'A. Dräger, et al.. <a href="http://bioinformatics.oxfordjournals.org/content/27/15/2167" target"_blank" >JSBML: a flexible Java library for working with SBML.</a> Bioinformatics (2011), 27(15):2167–2168.</em></br></br>',
                },
                {
                    xtype: "checkbox",
                    boxLabel: "Show Tips",
                    name: "showtips",
                    hidden: true,
                    checked: true,
                    handler: function(box, newVal) {
                        var UI = this.up("SBMLImportUI");

                        if (newVal) {
                            Ext.each(UI.query("fieldset"), function(fieldSet) {
                                fieldSet.setWidth((fieldSet.getWidth() - 10) * 2);
                                fieldSet.getLayout().columns = 4;
                            });
                            Ext.each(UI.query("fieldset > fieldset"), function(fieldSet) {
                                fieldSet.getLayout().columns = 4;
                            });
                        } else {
                            Ext.each(UI.query("fieldset"), function(fieldSet) {
                                fieldSet.setWidth(fieldSet.getWidth() / 2 + 10);
                                fieldSet.getLayout().columns = 2;
                            });
                            Ext.each(UI.query("fieldset > fieldset"), function(fieldSet) {
                                fieldSet.getLayout().columns = 2;
                            });
                        }

                        Ext.each(UI.query("displayfield"), function(field) {
                            field.setVisible(newVal);
                        });
                    },
                },
            ],
        },
        {
            xtype: "fieldset",
            colspan: 4,
            title: "Job Title",
            items: [{
                    xtype: "textfield",
                    name: "analysis_title",
                    value: "Import SBML",
                    colspan: 2,
                },
                {
                    xtype: "displayfield",
                    value: "<em>Set the title of this job to retrieve it easily in the job list.</em>",
                    colspan: 2,
                },
            ],
        },
        {
            xtype: "fieldset",
            title: "Standard Parameters",
            items: [{
                    xtype: "textfield",
                    name: "mail",
                    colspan: 2,
                    fieldLabel: "Email Address *",
                    allowBlank: false,
                    vtype: "email", // requires value to be a valid email address format
                    listeners: {
                        afterrender: function(c) {
                            this.setValue(MetExplore.globals.Session.mailUser);
                            this.next("hiddenfield").setValue(
                                MetExplore.globals.Session.idUser
                            );
                        },
                    },
                },
                {
                    xtype: "displayfield",
                    value: "<em>The email address to send informations on job completion.</em>",
                    colspan: 2,
                },
                {
                    xtype: "hiddenfield",
                    name: "idUser",
                },
                {
                    xtype: "fileuploadfield",
                    emptyText: "Select a File ",
                    buttonText: "",
                    buttonConfig: {
                        iconCls: "upload-icon",
                    },
                    name: "networkFile",
                    colspan: 2,
                    fieldLabel: "SBML File *",
                    allowBlank: false,
                },
                {
                    xtype: "displayfield",
                    value: "<em>Select your SBML File on your File System</em>",
                    colspan: 2,
                },
                {
                    xtype: "fieldset",
                    title: "Network Information",
                    colspan: 4,
                    layout: {
                        type: "table",
                        columns: 4,
                        tableAttrs: {
                            style: {
                                width: "100%",
                            },
                        },
                    },
                    items: [{
                            xtype: "selectInsertOrganism",
                            name: "idOrg",
                            allowBlank: false,
                            fieldDefaults: {
                                labelAlign: "left",
                                width: 400,
                                labelWidth: 105,
                                margin: "0",
                            },
                            colspan: 2,
                        },
                        {
                            xtype: "displayfield",
                            align: "top",
                            value: "<em>Select the organism of your network. If the organism is not present on the list, you can create it by clicking on <b>New Organism</b>.</em>",
                            colspan: 2,
                        },
                        {
                            xtype: "textfield",
                            name: "tissue",
                            colspan: 2,
                            fieldLabel: "Tissue",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>If your Network is a tissue specific network, please specify the appropriate tissue (e.g. Liver, muscle, ... )</em>",
                            colspan: 2,
                        },
                        {
                            xtype: "textfield",
                            name: "celltype",
                            colspan: 2,
                            fieldLabel: "Cellular Type",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>If your Network is a cell type specific network, please specify cell type (e.g. Hepatocyte )</em>",
                            colspan: 2,
                        },
                        {
                            xtype: "textfield",
                            name: "strain",
                            colspan: 2,
                            fieldLabel: "Strain",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>If your Network describes a specific Prokaryotic strain (e.g. E-Coli K12 strain) or a specific Eukaryote cell line (e.g. HepaRG).</em>",
                            colspan: 2,
                        },
                        {
                            xtype: "textfield",
                            name: "pmid",
                            colspan: 2,
                            fieldLabel: "Publication(s)",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>If your Network is associated to one or more publication, please enter the PMIDs of these publications separated by commas. e.g. :" +
                                '"PMID: 20444866" or "20444866"</em>',
                            colspan: 2,
                        },
                    ],
                },
                {
                    xtype: "fieldset",
                    title: "Reference Database",
                    colspan: 4,
                    layout: {
                        type: "table",
                        columns: 4,
                        tableAttrs: {
                            style: {
                                width: "100%",
                            },
                        },
                    },
                    items: [{
                            xtype: "hiddenfield",
                            name: "databaseType",
                            value: "SBML",
                        },
                        {
                            xtype: "textfield",
                            name: "databaseSource",
                            colspan: 2,
                            fieldLabel: "Source Database",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>The Database from which this network comes from. (e.g. BioCyc, Kegg, BiGG, BioModels,...)</em>",
                            colspan: 2,
                        },
                        {
                            xtype: "textfield",
                            name: "url",
                            colspan: 2,
                            fieldLabel: "URL of the Database",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>The URL of the given database. This URL is used to link the network to its original database.</em>",
                            colspan: 2,
                        },
                        {
                            xtype: "textfield",
                            name: "version",
                            colspan: 2,
                            fieldLabel: "Version",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>The version number of the imported network in its original database.</em>",
                            colspan: 2,
                        },
                    ],
                },
            ],
        },
        {
            xtype: "hiddenfield",
            name: "useDefaultPluginParams",
            value: true,
        },
        {
            xtype: "fieldset",
            collapsed: true,
            disabled: true,
            title: '<label><input type="checkbox" checked="true" />Use default Advanced Parameters</label>',
            listeners: {
                afterrender: function(c) {
                    this.el.down("input").on(
                        "click",
                        function(e, div, g) {
                            if (!div.checked) {
                                this.expand();
                            } else {
                                this.collapse();
                            }
                            this.setDisabled(div.checked);

                            this.prev("hiddenfield[name=useDefaultPluginParams]").setValue(
                                div.checked
                            );
                        },
                        this
                    );
                },
            },
            items: [{
                    xtype: "displayfield",
                    value: "<em>The advanced parameters allow you to enable/disable the type of importers that will be used to read your file. You can also modify " +
                        "how each importer behave by changing their own parameters." +
                        "</br><b>Warning:</b></br>If you are unfamiliar on how SBML files are structured, please use the default Advanced parameters</em>",
                    width: "100%",
                    colspan: 4,
                },
                {
                    xtype: "checkbox",
                    boxLabel: "Uses the FBC plugin",
                    name: "useFBC2Plugin",
                    inputValue: true,
                    uncheckedValue: false,
                    checked: true,
                    colspan: 2,
                },
                {
                    xtype: "displayfield",
                    value: "<em>The Flux Balance Constraint (FBC) Importer allows the Import process to read the SBML package FBC (version 2) contained in the SBML file " +
                        '(specifications <a href="http://co.mbine.org/specifications/sbml.level-3.version-1.fbc.version-2.release-1" target="_blank">here</a>). ' +
                        "</br><b>If you do not know whether your SBML uses the FBC version 2 package, " +
                        "keep this enabled as it will not cause any errors if the package is not present in the file.</b></em>",
                    colspan: 2,
                },
                {
                    xtype: "checkbox",
                    boxLabel: "Uses fhe Group plugin",
                    name: "useGroupPlugin",
                    inputValue: true,
                    uncheckedValue: false,
                    checked: true,
                    colspan: 2,
                },
                {
                    xtype: "displayfield",
                    value: '<em>The pathways-reaction associations and the flux constraints are imported with the <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5451322/" target="_blank">Groups package</a></em>',

                    colspan: 2,
                },
                {
                    xtype: "checkbox",
                    boxLabel: "Import the Annotation Elements",
                    name: "useAnnotPlugin",
                    inputValue: true,
                    uncheckedValue: false,
                    checked: true,
                    colspan: 2,
                    handler: function(box, newVal) {
                        box.next("fieldset").setVisible(newVal);
                    },
                },
                {
                    xtype: "displayfield",
                    value: "<em>The Annotation Importer allows the main Import process to read the annotations present in your Network file</em>",
                    colspan: 2,
                },
                {
                    xtype: "hiddenfield",
                    name: "useDefaultAnnotPluginParams",
                    value: true,
                },
                {
                    xtype: "fieldset",
                    collapsed: true,
                    colspan: 4,
                    layout: {
                        type: "table",
                        columns: 4,
                        tableAttrs: {
                            style: {
                                width: "100%",
                            },
                        },
                    },
                    disabled: true,
                    title: '<label><input type="checkbox" checked="true" />Use default Parameters for importing Annotations Elements</label>',
                    listeners: {
                        afterrender: function(c) {
                            this.el.down("input").on(
                                "click",
                                function(e, div, g) {
                                    if (!div.checked) {
                                        this.expand();
                                    } else {
                                        this.collapse();
                                    }
                                    this.setDisabled(div.checked);

                                    this.prev(
                                        "hiddenfield[name=useDefaultAnnotPluginParams]"
                                    ).setValue(div.checked);
                                },
                                this
                            );
                        },
                    },
                    items: [{
                            xtype: "displayfield",
                            width: "100%",
                            value: "<em>The annotation Importer is based on the MIRIAM annotations scheme. " +
                                'You can find more information on MIRIAM annotations <a href="http://www.ebi.ac.uk/miriam/main/mdb?section=docs" target="_blank">here</a>.</br>' +
                                "Annotations are used to create a logical link between an object of the model (reaction, metabolite,...) and a piece of biological knowledge.</br></br>" +
                                "MIRIAM annotations consist of the triplet {collection-namespace, identifier, qualifier}, they combine the collection's namespace with the identifier " +
                                "to create an unambiguous link to the piece of knowledge. This link can be enriched by an optional but unique descriptor, " +
                                'the qualifier (e.g. "is", "isDescribedBy", "isEncodedBy", ... ) that refines that meaning of that link.</br></br>' +
                                "MIRIAM can use two types of pattern to create its links, URIs or URN.</em>",
                            colspan: 4,
                        },
                        {
                            xtype: "combobox",
                            store: {
                                fields: ["pattern", "patID"],
                                data: [{
                                        pattern: "http://identifiers.org/{collection-namespace}/{identifier}",
                                        patID: "url",
                                    },
                                    {
                                        pattern: "urn:miriam:{collection-namespace}:{identifier}",
                                        patID: "urn",
                                    },
                                ],
                            },
                            value: "url",
                            displayField: "pattern",
                            valueField: "patID",
                            forceSelection: true,
                            // },{
                            // 	xtype: 'textfield',
                            // 	name: 'annotationPattern',
                            labelWidth: 120,
                            // 	value:'http://identifiers.org/',
                            colspan: 2,
                            fieldLabel: "MIRIAM Pattern",
                            listeners: {
                                change: function(me, newValue) {
                                    if (newValue === "url") {
                                        me.next("hiddenfield[name=annotationPattern]").setValue(
                                            "http://identifiers.org/"
                                        );
                                        me.next("hiddenfield[name=annotationSeparator]").setValue(
                                            "/"
                                        );
                                    } else {
                                        me.next("hiddenfield[name=annotationPattern]").setValue(
                                            "urn:miriam:"
                                        );
                                        me.next("hiddenfield[name=annotationSeparator]").setValue(
                                            ":"
                                        );
                                    }
                                },
                            },
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>Choose which annotation pattern is used in your model. " +
                                "MIRIAM compliant annotations use URIs:</br><pre>http://identifiers.org/{collection-namespace}/{identifier}</pre></br> or URNs:</br><pre>urn:miriam:{collection-namespace}:{identifier}</pre></em>",
                            colspan: 2,
                        },
                        {
                            xtype: "hiddenfield",
                            value: "http://identifiers.org/",
                            name: "annotationPattern",
                        },
                        {
                            xtype: "hiddenfield",
                            name: "annotationSeparator",
                            // 	labelWidth : 200,
                            value: "/",
                            // 	colspan:2,
                            // 	fieldLabel: 'Namespace-identifier separator'
                            // },{
                            // 	xtype: 'displayfield',
                            // 	value: "<em>This parameter is the character(s) that separate the collection's namespace and the proper identifier inside the URI. </em>",
                            // 	colspan:2
                        },
                    ],
                },
                {
                    xtype: "checkbox",
                    name: "useNotesPlugin",
                    colspan: 2,
                    checked: true,
                    inputValue: true,
                    uncheckedValue: false,
                    boxLabel: "Import the SBML Note Elements",
                    handler: function(box, newVal) {
                        box.next("fieldset").setVisible(newVal);
                    },
                },
                {
                    xtype: "displayfield",
                    value: '<em>The Note Importer allows the main Import process to read the "notes" elements present in your SBML File. In most SBML files, this is where ' +
                        "the metabolic pathways occurring in the network are specified.</em>",
                    colspan: 2,
                },
                {
                    xtype: "hiddenfield",
                    name: "useDefaultNotesPluginParams",
                    value: true,
                },
                {
                    xtype: "fieldset",
                    collapsed: true,
                    colspan: 4,
                    layout: {
                        type: "table",
                        columns: 4,
                        tableAttrs: {
                            style: {
                                width: "100%",
                            },
                        },
                    },
                    disabled: true,
                    title: '<label><input type="checkbox" checked="true" />Use default Parameters for importing Notes Elements</label>',
                    listeners: {
                        afterrender: function(c) {
                            this.el.down("input").on(
                                "click",
                                function(e, div, g) {
                                    if (!div.checked) {
                                        this.expand();
                                    } else {
                                        this.collapse();
                                    }
                                    this.setDisabled(div.checked);

                                    this.prev(
                                        "hiddenfield[name=useDefaultNotesPluginParams]"
                                    ).setValue(div.checked);
                                },
                                this
                            );
                        },
                    },
                    items: [{
                            xtype: "displayfield",
                            width: "100%",
                            value: "<em>SBML notes are user defined information that can be joined to any model constituent. In most genome scale metabolic network, " +
                                'these notes are COBRA-compliant SBML note structure (<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3319681/" target="_blank" >J. Schellenberger et al., (2011)</a>).</br>Notes in this format ' +
                                "consist in Key/Value(s) pairs that allow the addittion of informations that cannot be stored in other SBML constituents.</br></br>" +
                                "The customization of the Notes plugin allows you to modify which key/value pairs are associated with your data.</em>",
                            colspan: 4,
                        },
                        {
                            xtype: "fieldset",
                            collapsed: true,
                            colspan: 4,
                            title: "Notes for Reactions",
                        },
                        {
                            xtype: "textfield",
                            name: "pathwayKey",
                            colspan: 2,
                            value: "SUBSYSTEM",
                            fieldLabel: "Pathway Key",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>This key defines in which pathway(s) the given reaction is. e.g.:</em>" +
                                "</br><pre>SUBSYSTEM: Glycolysis/Gluconeogenesis</pre>",
                            colspan: 2,
                        },
                        {
                            xtype: "textfield",
                            name: "pathwaySep",
                            colspan: 2,
                            value: "||",
                            fieldLabel: "Pathway Separator",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>In the case in which a reaction is in multiple pathways, this defines how the pathways are separated. e.g.:</em>" +
                                "</br><pre>SUBSYSTEM: Glycolysis/Gluconeogenesis || Citrate cycle</pre>",
                            colspan: 2,
                        },
                        {
                            xtype: "textfield",
                            name: "ECKey",
                            colspan: 2,
                            value: "EC_Number",
                            fieldLabel: "EC Number Key",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>This key defines the EC Number associated with the given reaction. e.g.:</em>" +
                                "</br><pre>EC Number: 2.3.3.8</pre>",
                            colspan: 2,
                        },
                        {
                            xtype: "textfield",
                            name: "GPRKey",
                            colspan: 2,
                            value: "GENE_ASSOCIATION",
                            fieldLabel: "Gene Association Key",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>This key defines the Gene-Reaction Association of the given reaction. e.g.:</em>" +
                                "</br><pre>GENE_ASSOCIATION: (47.1) or (47.2)</pre>",
                            colspan: 2,
                        },
                        {
                            xtype: "textfield",
                            name: "scoreKey",
                            colspan: 2,
                            value: "SCORE",
                            fieldLabel: "Score Key",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>This key defines the reaction's confidence score/level. e.g:</em>" +
                                "</br><pre>Confidence Level: 2</pre>",
                            colspan: 2,
                        },
                        {
                            xtype: "textfield",
                            name: "statusKey",
                            colspan: 2,
                            value: "STATUS",
                            fieldLabel: "Status Key",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>This key defines the reaction's curation status. e.g.:</em>" +
                                "</br><pre>CURATION STATUS: 1 (Under progress)</pre>",
                            colspan: 2,
                        },
                        {
                            xtype: "textfield",
                            name: "commentKey",
                            colspan: 2,
                            value: "COMMENT",
                            fieldLabel: "Notes/Comments Key",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>This key defines user(s) comment(s) that refine the curation of this reaction. e.g.:</em>" +
                                "</br><pre>NOTES: also EC 4.1.3.22 </pre>",
                            colspan: 2,
                        },
                        {
                            xtype: "textfield",
                            name: "authorKey",
                            colspan: 2,
                            value: "AUTHORS",
                            fieldLabel: "Author/Publication Key",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>This key defines the publication(s) that support the presence of this reaction in the model. e.g.:</em>" +
                                "</br><pre>AUTHORS: PMID: 16868315, PMID: 17901542</pre>",
                            colspan: 2,
                        },
                        {
                            xtype: "fieldset",
                            collapsed: true,
                            colspan: 4,
                            title: "Notes for Metabolites",
                        },
                        {
                            xtype: "textfield",
                            name: "formulaKey",
                            colspan: 2,
                            value: "formula",
                            fieldLabel: "Metabolite Formula  Key",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>This key defines the chemical formula of this metabolite. e.g.:</em>" +
                                "</br><pre>FORMULA: H</pre>",
                            colspan: 2,
                        },
                        {
                            xtype: "textfield",
                            name: "chargeKey",
                            colspan: 2,
                            value: "charge",
                            fieldLabel: "Metabolite Charge Key",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>This key defines the charge of the metabolite. e.g.:</em>" +
                                "</br><pre>CHARGE: 1</pre>",
                            colspan: 2,
                        },
                        {
                            xtype: "checkbox",
                            name: "otherKeysAsRefs",
                            colspan: 2,
                            checked: true,
                            inputValue: true,
                            uncheckedValue: false,
                            boxLabel: "Use other Key/Value pairs in Metabolite Notes as Database Identifiers",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>Checking this option enables the plugin to consider the other Key/Value pairs in the metabolite's notes as " +
                                "external database identifiers (InChI, KEGG,...). The key will be the database name and the value, the metabolite's identifier. e.g. :</em>" +
                                "</br><pre>INCHI: InChI=1S/p+1/i/hH</pre>" +
                                "<pre>KEGG : C00080</pre>",
                            colspan: 2,
                        },
                        {
                            xtype: "fieldset",
                            collapsed: true,
                            colspan: 4,
                            title: "Global parameter for Notes",
                        },
                        {
                            xtype: "textfield",
                            name: "separator",
                            colspan: 2,
                            value: ",",
                            fieldLabel: "Global value Separator",
                        },
                        {
                            xtype: "displayfield",
                            value: "<em>Besides Pathways, other note key/value pair can actually contain multiple values. This parameter defines the " +
                                "global value separator in all Notes. By default this separator differs from the pathway separator. e.g. :</em>" +
                                "</br><pre>AUTHORS: PMID: 16868315, PMID: 17901542</pre>" +
                                "<pre>CHEBI: CHEBI:62242, CHEBI:27537</pre>",
                            colspan: 2,
                        },
                    ],
                },
            ],
        },
        {
            xtype: "button",
            text: "Launch",
            action: "launch",
            width: 100,
            formBind: true,
            // handler:function(b){
            // 	console.log(b.up('form').getValues())
            // }
        },
    ],
});