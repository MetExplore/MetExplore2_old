// Drop-in fix for running the export in an iframe
Highcharts.wrap(Highcharts, 'post', function(proceed, url, data, formAttributes) {
    if (!Highcharts.$exportFrame) {
        Highcharts.$exportFrame =
            $('<iframe id="hc-export-frame" style="display:none">').appendTo(document.body);
    }
    formAttributes = Highcharts.merge({
        target: 'hc-export-frame'
    }, formAttributes);
    proceed.call(this, url, data, formAttributes);
});