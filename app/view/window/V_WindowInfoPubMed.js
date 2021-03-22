/**
 * panel Info metabolite
 */
Ext.define('MetExplore.view.window.V_WindowInfoPubMed', {

    extend: 'MetExplore.view.window.V_WindowInfoGeneric',
    alias: 'widget.windowInfoPubMed',

    constructor: function(params) {
        var me = this;
        var metabolite = params.metabolite;
        var mesh = params.mesh;
        var iupac;
        var pubmedAnalysis = params.pubmedAnalysis.metabolites;
        var linkToPubmed;
        var term = null;
        var title = "";
        var config = {};
        console.log(metabolite);
        console.log(mesh);
        if (metabolite && mesh) {
            console.log('Metabolite');
            console.log('MeSH');
            var associatedMeSHToMetab = pubmedAnalysis.find(function(metab) {
                return metabolite.data.name == metab.name;
            });
            iupac = associatedMeSHToMetab.iupac;
            linkToPubmed = "<a target='_blank' href='https://www.ncbi.nlm.nih.gov/pubmed?term=" + iupac + "%20AND%20" + mesh + "%5BMeSH+Terms%5D'>" + iupac + " coocurence with " + mesh + "</a>";
            linkToMeSH = "<a target='_blank' href='https://meshb.nlm.nih.gov/search?searchInField=allTerms&sort=&size=20&searchType=exactMatch&searchMethod=FullWord&q=" + mesh + "'>" + mesh + "</a>" +
                "<br/>" +
                "<a target='_blank' href='https://meshb.nlm.nih.gov/search?searchInField=allTerms&sort=&size=20&searchType=exactMatch&searchMethod=FullWord&q=" + iupac + "'>" + iupac + "</a>"
            title = metabolite.data.name;
        } else {
            if (metabolite) {
                console.log('Metabolite');
                var associatedMeSHToMetab = pubmedAnalysis.find(function(metab) {
                    return metabolite.data.name == metab.name;
                });
                iupac = associatedMeSHToMetab.iupac;
                linkToPubmed = "<a target='_blank' href='https://www.ncbi.nlm.nih.gov/pubmed?term=" + iupac + "'>" + iupac + "</a>";
                linkToMeSH = "<a target='_blank' href='https://meshb.nlm.nih.gov/search?searchInField=allTerms&sort=&size=20&searchType=exactMatch&searchMethod=FullWord&q=" + iupac + "'>" + iupac + "</a>";

                var allArticles = [];
                associatedMeSHToMetab.meshs.forEach(function(mesh) {
                    allArticles.push.apply(allArticles, mesh.documentSet);
                });
                // var pubmedRequest = allArticles.join(",");
                // console.log("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=" + pubmedRequest);
                title = metabolite.data.name;
                term = iupac;

            } else {
                console.log('MeSH');
                term = mesh;
                title = mesh;
                linkToPubmed = "<a target='_blank' href='https://www.ncbi.nlm.nih.gov/pubmed?term=" + mesh + "%5BMeSH+Terms%5D'>" + mesh + "</a>";
                linkToMeSH = "<a target='_blank' href='https://meshb.nlm.nih.gov/search?searchInField=allTerms&sort=&size=20&searchType=exactMatch&searchMethod=FullWord&q=" + mesh + "'>" + mesh + "</a>";
            }
        }


        items = [{
            xtype: 'panel',
            title: '<b>' + title + ' in pubMed</b>',
            autoScroll: true,
            border: false,
            layout: "fit",
            items: [{
                xtype: 'box',
                html: linkToPubmed
            }]
        }, {
            xtype: 'panel',
            title: '<b>' + title + ' in MeSH</b>',
            autoScroll: true,
            border: false,
            layout: "fit",
            items: [{
                xtype: 'box',
                html: linkToMeSH
            }]
        }, {
            xtype: 'panel',
            title: '<b>PubMed articles by year </b>',
            closable: false,
            region: 'south',
            flex: 1,
            layout: "fit",
            border: false,
            autoScroll: true,
            items: [{
                xtype: 'panel',
                id: 'panelVizByYear',
                name: 'panelMappingViz',
                width: '100%',
                height: '100%',
                style: 'padding: 10px; overflow:auto;',
                closable: false,
                autoScroll: true,
                listeners: {
                    afterrender: function() {
                        if (term) {
                            $.ajax({
                                url: 'https://med-by-year.appspot.com/search?q=' + term,
                                dataType: 'JSON',
                                type: 'GET',
                                async: false,
                                crossDomain: true,
                                success: function(data) {
                                    if (data.counts && ((metabolite && !mesh) || (!metabolite && mesh))) {

                                        window.dateChart = Highcharts.chart('panelVizByYear', {
                                            chart: {
                                                zoomType: 'xy'
                                            },
                                            title: {
                                                text: 'Number of articles by year'
                                            },
                                            subtitle: {
                                                text: 'Source: PubMed'
                                            },
                                            xAxis: [{
                                                categories: Object.keys(data.counts),
                                                crosshair: true
                                            }],
                                            yAxis: [{ // Primary yAxis
                                                labels: {
                                                    format: '{value}°C',
                                                    style: {
                                                        color: Highcharts.getOptions().colors[1]
                                                    }
                                                }
                                            }, { // Secondary yAxis
                                                title: {
                                                    text: 'Number of articles'
                                                },
                                                labels: {
                                                    format: '{value} articles'
                                                },
                                                opposite: true
                                            }],
                                            tooltip: {
                                                shared: true
                                            },

                                            plotOptions: {
                                                series: {
                                                    cursor: 'pointer',
                                                    events: {
                                                        click: function(event) {
                                                            window.open("https://www.ncbi.nlm.nih.gov/pubmed?term=" + term + "+AND+" + event.point.category + "[DP]", '_blank');
                                                        }
                                                    }
                                                }
                                            },
                                            series: [{
                                                name: 'Number of articles',
                                                type: 'column',
                                                yAxis: 1,
                                                data: Object.values(data.counts).map(function(val) {
                                                    return Number.parseInt(val);
                                                }),
                                                tooltip: {
                                                    valueSuffix: ' articles'
                                                }

                                            }]
                                        });
                                    } else {
                                        console.log('ok');
                                        me.ownerCt.hide();
                                    }
                                },
                                failure: function() {
                                    console.log("fail");
                                },
                                complete: function(data) {
                                    if (data.readyState == '4' && data.status == '200') {} else {
                                        console.log('fail');
                                    }
                                }
                            });
                        }
                    }
                }
            }]
        }];


        config.layout = {
            type: 'vbox',
            align: 'stretch'
        };

        config.items = items;

        this.callParent([config]);

    }


});