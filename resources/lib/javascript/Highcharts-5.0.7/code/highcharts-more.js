/*
 Highcharts JS v5.0.7 (2017-01-17)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(u) {
    "object" === typeof module && module.exports ? module.exports = u : u(Highcharts)
})(function(u) {
    (function(a) {
        function p(a, b, d) {
            this.init(a, b, d)
        }
        var v = a.each,
            w = a.extend,
            l = a.merge,
            q = a.splat;
        w(p.prototype, {
            init: function(a, b, d) {
                var k = this,
                    m = k.defaultOptions;
                k.chart = b;
                k.options = a = l(m, b.angular ? {
                    background: {}
                } : void 0, a);
                (a = a.background) && v([].concat(q(a)).reverse(), function(b) {
                    var c, m = d.userOptions;
                    c = l(k.defaultBackgroundOptions, b);
                    b.backgroundColor && (c.backgroundColor = b.backgroundColor);
                    c.color = c.backgroundColor;
                    d.options.plotBands.unshift(c);
                    m.plotBands = m.plotBands || [];
                    m.plotBands !== d.options.plotBands && m.plotBands.unshift(c)
                })
            },
            defaultOptions: {
                center: ["50%", "50%"],
                size: "85%",
                startAngle: 0
            },
            defaultBackgroundOptions: {
                className: "highcharts-pane",
                shape: "circle",
                borderWidth: 1,
                borderColor: "#cccccc",
                backgroundColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, "#ffffff"],
                        [1, "#e6e6e6"]
                    ]
                },
                from: -Number.MAX_VALUE,
                innerRadius: 0,
                to: Number.MAX_VALUE,
                outerRadius: "105%"
            }
        });
        a.Pane = p
    })(u);
    (function(a) {
        var p = a.CenteredSeriesMixin,
            v = a.each,
            w = a.extend,
            l = a.map,
            q = a.merge,
            f = a.noop,
            b = a.Pane,
            d = a.pick,
            k = a.pInt,
            m = a.splat,
            n = a.wrap,
            c, g, h = a.Axis.prototype;
        a = a.Tick.prototype;
        c = {
            getOffset: f,
            redraw: function() {
                this.isDirty = !1
            },
            render: function() {
                this.isDirty = !1
            },
            setScale: f,
            setCategories: f,
            setTitle: f
        };
        g = {
            defaultRadialGaugeOptions: {
                labels: {
                    align: "center",
                    x: 0,
                    y: null
                },
                minorGridLineWidth: 0,
                minorTickInterval: "auto",
                minorTickLength: 10,
                minorTickPosition: "inside",
                minorTickWidth: 1,
                tickLength: 10,
                tickPosition: "inside",
                tickWidth: 2,
                title: {
                    rotation: 0
                },
                zIndex: 2
            },
            defaultRadialXOptions: {
                gridLineWidth: 1,
                labels: {
                    align: null,
                    distance: 15,
                    x: 0,
                    y: null
                },
                maxPadding: 0,
                minPadding: 0,
                showLastLabel: !1,
                tickLength: 0
            },
            defaultRadialYOptions: {
                gridLineInterpolation: "circle",
                labels: {
                    align: "right",
                    x: -3,
                    y: -2
                },
                showLastLabel: !1,
                title: {
                    x: 4,
                    text: null,
                    rotation: 90
                }
            },
            setOptions: function(b) {
                b = this.options = q(this.defaultOptions, this.defaultRadialOptions, b);
                b.plotBands || (b.plotBands = [])
            },
            getOffset: function() {
                h.getOffset.call(this);
                this.chart.axisOffset[this.side] = 0;
                this.center = this.pane.center =
                    p.getCenter.call(this.pane)
            },
            getLinePath: function(b, e) {
                b = this.center;
                var c = this.chart,
                    k = d(e, b[2] / 2 - this.offset);
                this.isCircular || void 0 !== e ? e = this.chart.renderer.symbols.arc(this.left + b[0], this.top + b[1], k, k, {
                    start: this.startAngleRad,
                    end: this.endAngleRad,
                    open: !0,
                    innerR: 0
                }) : (e = this.postTranslate(this.angleRad, k), e = ["M", b[0] + c.plotLeft, b[1] + c.plotTop, "L", e.x, e.y]);
                return e
            },
            setAxisTranslation: function() {
                h.setAxisTranslation.call(this);
                this.center && (this.transA = this.isCircular ? (this.endAngleRad - this.startAngleRad) /
                    (this.max - this.min || 1) : this.center[2] / 2 / (this.max - this.min || 1), this.minPixelPadding = this.isXAxis ? this.transA * this.minPointOffset : 0)
            },
            beforeSetTickPositions: function() {
                if (this.autoConnect = this.isCircular && void 0 === d(this.userMax, this.options.max) && this.endAngleRad - this.startAngleRad === 2 * Math.PI) this.max += this.categories && 1 || this.pointRange || this.closestPointRange || 0
            },
            setAxisSize: function() {
                h.setAxisSize.call(this);
                this.isRadial && (this.center = this.pane.center = p.getCenter.call(this.pane), this.isCircular &&
                    (this.sector = this.endAngleRad - this.startAngleRad), this.len = this.width = this.height = this.center[2] * d(this.sector, 1) / 2)
            },
            getPosition: function(b, e) {
                return this.postTranslate(this.isCircular ? this.translate(b) : this.angleRad, d(this.isCircular ? e : this.translate(b), this.center[2] / 2) - this.offset)
            },
            postTranslate: function(b, e) {
                var d = this.chart,
                    c = this.center;
                b = this.startAngleRad + b;
                return {
                    x: d.plotLeft + c[0] + Math.cos(b) * e,
                    y: d.plotTop + c[1] + Math.sin(b) * e
                }
            },
            getPlotBandPath: function(b, e, c) {
                var m = this.center,
                    t = this.startAngleRad,
                    h = m[2] / 2,
                    a = [d(c.outerRadius, "100%"), c.innerRadius, d(c.thickness, 10)],
                    r = Math.min(this.offset, 0),
                    g = /%$/,
                    n, f = this.isCircular;
                "polygon" === this.options.gridLineInterpolation ? m = this.getPlotLinePath(b).concat(this.getPlotLinePath(e, !0)) : (b = Math.max(b, this.min), e = Math.min(e, this.max), f || (a[0] = this.translate(b), a[1] = this.translate(e)), a = l(a, function(b) {
                        g.test(b) && (b = k(b, 10) * h / 100);
                        return b
                    }), "circle" !== c.shape && f ? (b = t + this.translate(b), e = t + this.translate(e)) : (b = -Math.PI / 2, e = 1.5 * Math.PI, n = !0), a[0] -= r, a[2] -=
                    r, m = this.chart.renderer.symbols.arc(this.left + m[0], this.top + m[1], a[0], a[0], {
                        start: Math.min(b, e),
                        end: Math.max(b, e),
                        innerR: d(a[1], a[0] - a[2]),
                        open: n
                    }));
                return m
            },
            getPlotLinePath: function(b, e) {
                var c = this,
                    d = c.center,
                    k = c.chart,
                    m = c.getPosition(b),
                    a, h, g;
                c.isCircular ? g = ["M", d[0] + k.plotLeft, d[1] + k.plotTop, "L", m.x, m.y] : "circle" === c.options.gridLineInterpolation ? (b = c.translate(b)) && (g = c.getLinePath(0, b)) : (v(k.xAxis, function(b) {
                    b.pane === c.pane && (a = b)
                }), g = [], b = c.translate(b), d = a.tickPositions, a.autoConnect && (d =
                    d.concat([d[0]])), e && (d = [].concat(d).reverse()), v(d, function(c, d) {
                    h = a.getPosition(c, b);
                    g.push(d ? "L" : "M", h.x, h.y)
                }));
                return g
            },
            getTitlePosition: function() {
                var b = this.center,
                    c = this.chart,
                    d = this.options.title;
                return {
                    x: c.plotLeft + b[0] + (d.x || 0),
                    y: c.plotTop + b[1] - {
                        high: .5,
                        middle: .25,
                        low: 0
                    }[d.align] * b[2] + (d.y || 0)
                }
            }
        };
        n(h, "init", function(k, e, a) {
            var h = e.angular,
                n = e.polar,
                t = a.isX,
                r = h && t,
                f, x = e.options,
                l = a.pane || 0;
            if (h) {
                if (w(this, r ? c : g), f = !t) this.defaultRadialOptions = this.defaultRadialGaugeOptions
            } else n && (w(this,
                g), this.defaultRadialOptions = (f = t) ? this.defaultRadialXOptions : q(this.defaultYAxisOptions, this.defaultRadialYOptions));
            h || n ? (this.isRadial = !0, e.inverted = !1, x.chart.zoomType = null) : this.isRadial = !1;
            k.call(this, e, a);
            r || !h && !n || (k = this.options, e.panes || (e.panes = []), this.pane = e = e.panes[l] = e.panes[l] || new b(m(x.pane)[l], e, this), e = e.options, this.angleRad = (k.angle || 0) * Math.PI / 180, this.startAngleRad = (e.startAngle - 90) * Math.PI / 180, this.endAngleRad = (d(e.endAngle, e.startAngle + 360) - 90) * Math.PI / 180, this.offset = k.offset ||
                0, this.isCircular = f)
        });
        n(h, "autoLabelAlign", function(b) {
            if (!this.isRadial) return b.apply(this, [].slice.call(arguments, 1))
        });
        n(a, "getPosition", function(b, c, d, k, a) {
            var e = this.axis;
            return e.getPosition ? e.getPosition(d) : b.call(this, c, d, k, a)
        });
        n(a, "getLabelPosition", function(b, c, k, a, m, h, g, n, f) {
            var e = this.axis,
                t = h.y,
                r = 20,
                z = h.align,
                x = (e.translate(this.pos) + e.startAngleRad + Math.PI / 2) / Math.PI * 180 % 360;
            e.isRadial ? (b = e.getPosition(this.pos, e.center[2] / 2 + d(h.distance, -25)), "auto" === h.rotation ? a.attr({
                    rotation: x
                }) :
                null === t && (t = e.chart.renderer.fontMetrics(a.styles.fontSize).b - a.getBBox().height / 2), null === z && (e.isCircular ? (this.label.getBBox().width > e.len * e.tickInterval / (e.max - e.min) && (r = 0), z = x > r && x < 180 - r ? "left" : x > 180 + r && x < 360 - r ? "right" : "center") : z = "center", a.attr({
                    align: z
                })), b.x += h.x, b.y += t) : b = b.call(this, c, k, a, m, h, g, n, f);
            return b
        });
        n(a, "getMarkPath", function(b, c, d, k, a, m, h) {
            var e = this.axis;
            e.isRadial ? (b = e.getPosition(this.pos, e.center[2] / 2 + k), c = ["M", c, d, "L", b.x, b.y]) : c = b.call(this, c, d, k, a, m, h);
            return c
        })
    })(u);
    (function(a) {
        var p = a.each,
            v = a.noop,
            w = a.pick,
            l = a.Series,
            q = a.seriesType,
            f = a.seriesTypes;
        q("arearange", "area", {
            lineWidth: 1,
            marker: null,
            threshold: null,
            tooltip: {
                pointFormat: '\x3cspan style\x3d"color:{series.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e'
            },
            trackByArea: !0,
            dataLabels: {
                align: null,
                verticalAlign: null,
                xLow: 0,
                xHigh: 0,
                yLow: 0,
                yHigh: 0
            },
            states: {
                hover: {
                    halo: !1
                }
            }
        }, {
            pointArrayMap: ["low", "high"],
            dataLabelCollections: ["dataLabel",
                "dataLabelUpper"
            ],
            toYData: function(b) {
                return [b.low, b.high]
            },
            pointValKey: "low",
            deferTranslatePolar: !0,
            highToXY: function(b) {
                var d = this.chart,
                    k = this.xAxis.postTranslate(b.rectPlotX, this.yAxis.len - b.plotHigh);
                b.plotHighX = k.x - d.plotLeft;
                b.plotHigh = k.y - d.plotTop
            },
            translate: function() {
                var b = this,
                    d = b.yAxis,
                    k = !!b.modifyValue;
                f.area.prototype.translate.apply(b);
                p(b.points, function(a) {
                    var m = a.low,
                        c = a.high,
                        g = a.plotY;
                    null === c || null === m ? a.isNull = !0 : (a.plotLow = g, a.plotHigh = d.translate(k ? b.modifyValue(c, a) : c, 0, 1,
                        0, 1), k && (a.yBottom = a.plotHigh))
                });
                this.chart.polar && p(this.points, function(d) {
                    b.highToXY(d)
                })
            },
            getGraphPath: function(b) {
                var d = [],
                    k = [],
                    a, n = f.area.prototype.getGraphPath,
                    c, g, h;
                h = this.options;
                var r = this.chart.polar && !1 !== h.connectEnds,
                    e = h.step;
                b = b || this.points;
                for (a = b.length; a--;) c = b[a], c.isNull || r || b[a + 1] && !b[a + 1].isNull || k.push({
                        plotX: c.plotX,
                        plotY: c.plotY,
                        doCurve: !1
                    }), g = {
                        polarPlotY: c.polarPlotY,
                        rectPlotX: c.rectPlotX,
                        yBottom: c.yBottom,
                        plotX: w(c.plotHighX, c.plotX),
                        plotY: c.plotHigh,
                        isNull: c.isNull
                    },
                    k.push(g), d.push(g), c.isNull || r || b[a - 1] && !b[a - 1].isNull || k.push({
                        plotX: c.plotX,
                        plotY: c.plotY,
                        doCurve: !1
                    });
                b = n.call(this, b);
                e && (!0 === e && (e = "left"), h.step = {
                    left: "right",
                    center: "center",
                    right: "left"
                }[e]);
                d = n.call(this, d);
                k = n.call(this, k);
                h.step = e;
                h = [].concat(b, d);
                this.chart.polar || "M" !== k[0] || (k[0] = "L");
                this.graphPath = h;
                this.areaPath = this.areaPath.concat(b, k);
                h.isArea = !0;
                h.xMap = b.xMap;
                this.areaPath.xMap = b.xMap;
                return h
            },
            drawDataLabels: function() {
                var b = this.data,
                    d = b.length,
                    a, m = [],
                    n = l.prototype,
                    c = this.options.dataLabels,
                    g = c.align,
                    h = c.verticalAlign,
                    r = c.inside,
                    e, t, f = this.chart.inverted;
                if (c.enabled || this._hasPointLabels) {
                    for (a = d; a--;)
                        if (e = b[a]) t = r ? e.plotHigh < e.plotLow : e.plotHigh > e.plotLow, e.y = e.high, e._plotY = e.plotY, e.plotY = e.plotHigh, m[a] = e.dataLabel, e.dataLabel = e.dataLabelUpper, e.below = t, f ? g || (c.align = t ? "right" : "left") : h || (c.verticalAlign = t ? "top" : "bottom"), c.x = c.xHigh, c.y = c.yHigh;
                    n.drawDataLabels && n.drawDataLabels.apply(this, arguments);
                    for (a = d; a--;)
                        if (e = b[a]) t = r ? e.plotHigh < e.plotLow : e.plotHigh > e.plotLow, e.dataLabelUpper =
                            e.dataLabel, e.dataLabel = m[a], e.y = e.low, e.plotY = e._plotY, e.below = !t, f ? g || (c.align = t ? "left" : "right") : h || (c.verticalAlign = t ? "bottom" : "top"), c.x = c.xLow, c.y = c.yLow;
                    n.drawDataLabels && n.drawDataLabels.apply(this, arguments)
                }
                c.align = g;
                c.verticalAlign = h
            },
            alignDataLabel: function() {
                f.column.prototype.alignDataLabel.apply(this, arguments)
            },
            setStackedPoints: v,
            getSymbol: v,
            drawPoints: v
        })
    })(u);
    (function(a) {
        var p = a.seriesType;
        p("areasplinerange", "arearange", null, {
            getPointSpline: a.seriesTypes.spline.prototype.getPointSpline
        })
    })(u);
    (function(a) {
        var p = a.defaultPlotOptions,
            v = a.each,
            w = a.merge,
            l = a.noop,
            q = a.pick,
            f = a.seriesType,
            b = a.seriesTypes.column.prototype;
        f("columnrange", "arearange", w(p.column, p.arearange, {
            lineWidth: 1,
            pointRange: null
        }), {
            translate: function() {
                var d = this,
                    a = d.yAxis,
                    m = d.xAxis,
                    n = m.startAngleRad,
                    c, g = d.chart,
                    h = d.xAxis.isRadial,
                    r;
                b.translate.apply(d);
                v(d.points, function(b) {
                    var e = b.shapeArgs,
                        k = d.options.minPointLength,
                        f, l;
                    b.plotHigh = r = a.translate(b.high, 0, 1, 0, 1);
                    b.plotLow = b.plotY;
                    l = r;
                    f = q(b.rectPlotY, b.plotY) - r;
                    Math.abs(f) <
                        k ? (k -= f, f += k, l -= k / 2) : 0 > f && (f *= -1, l -= f);
                    h ? (c = b.barX + n, b.shapeType = "path", b.shapeArgs = {
                        d: d.polarArc(l + f, l, c, c + b.pointWidth)
                    }) : (e.height = f, e.y = l, b.tooltipPos = g.inverted ? [a.len + a.pos - g.plotLeft - l - f / 2, m.len + m.pos - g.plotTop - e.x - e.width / 2, f] : [m.left - g.plotLeft + e.x + e.width / 2, a.pos - g.plotTop + l + f / 2, f])
                })
            },
            directTouch: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            drawGraph: l,
            crispCol: b.crispCol,
            drawPoints: b.drawPoints,
            drawTracker: b.drawTracker,
            getColumnMetrics: b.getColumnMetrics,
            animate: function() {
                return b.animate.apply(this,
                    arguments)
            },
            polarArc: function() {
                return b.polarArc.apply(this, arguments)
            },
            pointAttribs: b.pointAttribs
        })
    })(u);
    (function(a) {
        var p = a.each,
            v = a.isNumber,
            w = a.merge,
            l = a.pick,
            q = a.pInt,
            f = a.Series,
            b = a.seriesType,
            d = a.TrackerMixin;
        b("gauge", "line", {
            dataLabels: {
                enabled: !0,
                defer: !1,
                y: 15,
                borderRadius: 3,
                crop: !1,
                verticalAlign: "top",
                zIndex: 2,
                borderWidth: 1,
                borderColor: "#cccccc"
            },
            dial: {},
            pivot: {},
            tooltip: {
                headerFormat: ""
            },
            showInLegend: !1
        }, {
            angular: !0,
            directTouch: !0,
            drawGraph: a.noop,
            fixedBox: !0,
            forceDL: !0,
            noSharedTooltip: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            translate: function() {
                var b = this.yAxis,
                    a = this.options,
                    d = b.center;
                this.generatePoints();
                p(this.points, function(c) {
                    var k = w(a.dial, c.dial),
                        h = q(l(k.radius, 80)) * d[2] / 200,
                        m = q(l(k.baseLength, 70)) * h / 100,
                        e = q(l(k.rearLength, 10)) * h / 100,
                        n = k.baseWidth || 3,
                        f = k.topWidth || 1,
                        p = a.overshoot,
                        y = b.startAngleRad + b.translate(c.y, null, null, null, !0);
                    v(p) ? (p = p / 180 * Math.PI, y = Math.max(b.startAngleRad - p, Math.min(b.endAngleRad + p, y))) : !1 === a.wrap && (y = Math.max(b.startAngleRad, Math.min(b.endAngleRad,
                        y)));
                    y = 180 * y / Math.PI;
                    c.shapeType = "path";
                    c.shapeArgs = {
                        d: k.path || ["M", -e, -n / 2, "L", m, -n / 2, h, -f / 2, h, f / 2, m, n / 2, -e, n / 2, "z"],
                        translateX: d[0],
                        translateY: d[1],
                        rotation: y
                    };
                    c.plotX = d[0];
                    c.plotY = d[1]
                })
            },
            drawPoints: function() {
                var b = this,
                    a = b.yAxis.center,
                    d = b.pivot,
                    c = b.options,
                    g = c.pivot,
                    h = b.chart.renderer;
                p(b.points, function(a) {
                    var d = a.graphic,
                        k = a.shapeArgs,
                        g = k.d,
                        m = w(c.dial, a.dial);
                    d ? (d.animate(k), k.d = g) : (a.graphic = h[a.shapeType](k).attr({
                        rotation: k.rotation,
                        zIndex: 1
                    }).addClass("highcharts-dial").add(b.group), a.graphic.attr({
                        stroke: m.borderColor ||
                            "none",
                        "stroke-width": m.borderWidth || 0,
                        fill: m.backgroundColor || "#000000"
                    }))
                });
                d ? d.animate({
                    translateX: a[0],
                    translateY: a[1]
                }) : (b.pivot = h.circle(0, 0, l(g.radius, 5)).attr({
                    zIndex: 2
                }).addClass("highcharts-pivot").translate(a[0], a[1]).add(b.group), b.pivot.attr({
                    "stroke-width": g.borderWidth || 0,
                    stroke: g.borderColor || "#cccccc",
                    fill: g.backgroundColor || "#000000"
                }))
            },
            animate: function(b) {
                var a = this;
                b || (p(a.points, function(b) {
                    var d = b.graphic;
                    d && (d.attr({
                        rotation: 180 * a.yAxis.startAngleRad / Math.PI
                    }), d.animate({
                            rotation: b.shapeArgs.rotation
                        },
                        a.options.animation))
                }), a.animate = null)
            },
            render: function() {
                this.group = this.plotGroup("group", "series", this.visible ? "visible" : "hidden", this.options.zIndex, this.chart.seriesGroup);
                f.prototype.render.call(this);
                this.group.clip(this.chart.clipRect)
            },
            setData: function(b, a) {
                f.prototype.setData.call(this, b, !1);
                this.processData();
                this.generatePoints();
                l(a, !0) && this.chart.redraw()
            },
            drawTracker: d && d.drawTrackerPoint
        }, {
            setState: function(b) {
                this.state = b
            }
        })
    })(u);
    (function(a) {
        var p = a.each,
            v = a.noop,
            w = a.pick,
            l = a.seriesType,
            q = a.seriesTypes;
        l("boxplot", "column", {
            threshold: null,
            tooltip: {
                pointFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e \x3cb\x3e {series.name}\x3c/b\x3e\x3cbr/\x3eMaximum: {point.high}\x3cbr/\x3eUpper quartile: {point.q3}\x3cbr/\x3eMedian: {point.median}\x3cbr/\x3eLower quartile: {point.q1}\x3cbr/\x3eMinimum: {point.low}\x3cbr/\x3e'
            },
            whiskerLength: "50%",
            fillColor: "#ffffff",
            lineWidth: 1,
            medianWidth: 2,
            states: {
                hover: {
                    brightness: -.3
                }
            },
            whiskerWidth: 2
        }, {
            pointArrayMap: ["low", "q1", "median",
                "q3", "high"
            ],
            toYData: function(a) {
                return [a.low, a.q1, a.median, a.q3, a.high]
            },
            pointValKey: "high",
            pointAttribs: function(a) {
                var b = this.options,
                    d = a && a.color || this.color;
                return {
                    fill: a.fillColor || b.fillColor || d,
                    stroke: b.lineColor || d,
                    "stroke-width": b.lineWidth || 0
                }
            },
            drawDataLabels: v,
            translate: function() {
                var a = this.yAxis,
                    b = this.pointArrayMap;
                q.column.prototype.translate.apply(this);
                p(this.points, function(d) {
                    p(b, function(b) {
                        null !== d[b] && (d[b + "Plot"] = a.translate(d[b], 0, 1, 0, 1))
                    })
                })
            },
            drawPoints: function() {
                var a =
                    this,
                    b = a.options,
                    d = a.chart.renderer,
                    k, m, n, c, g, h, r = 0,
                    e, t, l, q, y = !1 !== a.doQuartiles,
                    v, B = a.options.whiskerLength;
                p(a.points, function(f) {
                    var p = f.graphic,
                        z = p ? "animate" : "attr",
                        x = f.shapeArgs,
                        u = {},
                        D = {},
                        H = {},
                        I = f.color || a.color;
                    void 0 !== f.plotY && (e = x.width, t = Math.floor(x.x), l = t + e, q = Math.round(e / 2), k = Math.floor(y ? f.q1Plot : f.lowPlot), m = Math.floor(y ? f.q3Plot : f.lowPlot), n = Math.floor(f.highPlot), c = Math.floor(f.lowPlot), p || (f.graphic = p = d.g("point").add(a.group), f.stem = d.path().addClass("highcharts-boxplot-stem").add(p),
                        B && (f.whiskers = d.path().addClass("highcharts-boxplot-whisker").add(p)), y && (f.box = d.path(void 0).addClass("highcharts-boxplot-box").add(p)), f.medianShape = d.path(void 0).addClass("highcharts-boxplot-median").add(p), u.stroke = f.stemColor || b.stemColor || I, u["stroke-width"] = w(f.stemWidth, b.stemWidth, b.lineWidth), u.dashstyle = f.stemDashStyle || b.stemDashStyle, f.stem.attr(u), B && (D.stroke = f.whiskerColor || b.whiskerColor || I, D["stroke-width"] = w(f.whiskerWidth, b.whiskerWidth, b.lineWidth), f.whiskers.attr(D)), y && (p =
                            a.pointAttribs(f), f.box.attr(p)), H.stroke = f.medianColor || b.medianColor || I, H["stroke-width"] = w(f.medianWidth, b.medianWidth, b.lineWidth), f.medianShape.attr(H)), h = f.stem.strokeWidth() % 2 / 2, r = t + q + h, f.stem[z]({
                        d: ["M", r, m, "L", r, n, "M", r, k, "L", r, c]
                    }), y && (h = f.box.strokeWidth() % 2 / 2, k = Math.floor(k) + h, m = Math.floor(m) + h, t += h, l += h, f.box[z]({
                        d: ["M", t, m, "L", t, k, "L", l, k, "L", l, m, "L", t, m, "z"]
                    })), B && (h = f.whiskers.strokeWidth() % 2 / 2, n += h, c += h, v = /%$/.test(B) ? q * parseFloat(B) / 100 : B / 2, f.whiskers[z]({
                        d: ["M", r - v, n, "L", r + v, n,
                            "M", r - v, c, "L", r + v, c
                        ]
                    })), g = Math.round(f.medianPlot), h = f.medianShape.strokeWidth() % 2 / 2, g += h, f.medianShape[z]({
                        d: ["M", t, g, "L", l, g]
                    }))
                })
            },
            setStackedPoints: v
        })
    })(u);
    (function(a) {
        var p = a.each,
            v = a.noop,
            w = a.seriesType,
            l = a.seriesTypes;
        w("errorbar", "boxplot", {
            color: "#000000",
            grouping: !1,
            linkedTo: ":previous",
            tooltip: {
                pointFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e'
            },
            whiskerWidth: null
        }, {
            type: "errorbar",
            pointArrayMap: ["low", "high"],
            toYData: function(a) {
                return [a.low, a.high]
            },
            pointValKey: "high",
            doQuartiles: !1,
            drawDataLabels: l.arearange ? function() {
                var a = this.pointValKey;
                l.arearange.prototype.drawDataLabels.call(this);
                p(this.data, function(f) {
                    f.y = f[a]
                })
            } : v,
            getColumnMetrics: function() {
                return this.linkedParent && this.linkedParent.columnMetrics || l.column.prototype.getColumnMetrics.call(this)
            }
        })
    })(u);
    (function(a) {
        var p = a.correctFloat,
            v = a.isNumber,
            w = a.pick,
            l = a.Point,
            q = a.Series,
            f = a.seriesType,
            b = a.seriesTypes;
        f("waterfall", "column", {
            dataLabels: {
                inside: !0
            },
            lineWidth: 1,
            lineColor: "#333333",
            dashStyle: "dot",
            borderColor: "#333333",
            states: {
                hover: {
                    lineWidthPlus: 0
                }
            }
        }, {
            pointValKey: "y",
            translate: function() {
                var a = this.options,
                    k = this.yAxis,
                    m, f, c, g, h, r, e, t, l, q = w(a.minPointLength, 5),
                    y = a.threshold,
                    v = a.stacking,
                    u = 0,
                    x = 0,
                    A;
                b.column.prototype.translate.apply(this);
                e = t = y;
                f = this.points;
                m = 0;
                for (a = f.length; m < a; m++) c = f[m], r = this.processedYData[m], g = c.shapeArgs, h = v && k.stacks[(this.negStacks && r < y ? "-" : "") + this.stackKey], A = this.getStackIndicator(A,
                        c.x), l = h ? h[c.x].points[this.index + "," + m + "," + A.index] : [0, r], c.isSum ? c.y = p(r) : c.isIntermediateSum && (c.y = p(r - t)), h = Math.max(e, e + c.y) + l[0], g.y = k.toPixels(h, !0), c.isSum ? (g.y = k.toPixels(l[1], !0), g.height = Math.min(k.toPixels(l[0], !0), k.len) - g.y + u + x) : c.isIntermediateSum ? (g.y = k.toPixels(l[1], !0), g.height = Math.min(k.toPixels(t, !0), k.len) - g.y + u + x, t = l[1]) : (g.height = 0 < r ? k.toPixels(e, !0) - g.y : k.toPixels(e, !0) - k.toPixels(e - r, !0), e += r), 0 > g.height && (g.y += g.height, g.height *= -1), c.plotY = g.y = Math.round(g.y) - this.borderWidth %
                    2 / 2, g.height = Math.max(Math.round(g.height), .001), c.yBottom = g.y + g.height, g.y -= x, g.height <= q && !c.isNull && (g.height = q, 0 > c.y ? x -= q : u += q), g.y -= u, g = c.plotY - x - u + (c.negative && 0 <= x ? g.height : 0), this.chart.inverted ? c.tooltipPos[0] = k.len - g : c.tooltipPos[1] = g
            },
            processData: function(b) {
                var a = this.yData,
                    d = this.options.data,
                    f, c = a.length,
                    g, h, r, e, t, l;
                h = g = r = e = this.options.threshold || 0;
                for (l = 0; l < c; l++) t = a[l], f = d && d[l] ? d[l] : {}, "sum" === t || f.isSum ? a[l] = p(h) : "intermediateSum" === t || f.isIntermediateSum ? a[l] = p(g) : (h += t, g += t),
                    r = Math.min(h, r), e = Math.max(h, e);
                q.prototype.processData.call(this, b);
                this.dataMin = r;
                this.dataMax = e
            },
            toYData: function(b) {
                return b.isSum ? 0 === b.x ? null : "sum" : b.isIntermediateSum ? 0 === b.x ? null : "intermediateSum" : b.y
            },
            pointAttribs: function(a, k) {
                var d = this.options.upColor;
                d && !a.options.color && (a.color = 0 < a.y ? d : null);
                a = b.column.prototype.pointAttribs.call(this, a, k);
                delete a.dashstyle;
                return a
            },
            getGraphPath: function() {
                return ["M", 0, 0]
            },
            getCrispPath: function() {
                var b = this.data,
                    a = b.length,
                    f = this.graph.strokeWidth() +
                    this.borderWidth,
                    f = Math.round(f) % 2 / 2,
                    n = [],
                    c, g, h;
                for (h = 1; h < a; h++) g = b[h].shapeArgs, c = b[h - 1].shapeArgs, g = ["M", c.x + c.width, c.y + f, "L", g.x, c.y + f], 0 > b[h - 1].y && (g[2] += c.height, g[5] += c.height), n = n.concat(g);
                return n
            },
            drawGraph: function() {
                q.prototype.drawGraph.call(this);
                this.graph.attr({
                    d: this.getCrispPath()
                })
            },
            getExtremes: a.noop
        }, {
            getClassName: function() {
                var b = l.prototype.getClassName.call(this);
                this.isSum ? b += " highcharts-sum" : this.isIntermediateSum && (b += " highcharts-intermediate-sum");
                return b
            },
            isValid: function() {
                return v(this.y, !0) || this.isSum || this.isIntermediateSum
            }
        })
    })(u);
    (function(a) {
        var p = a.Series,
            v = a.seriesType,
            u = a.seriesTypes;
        v("polygon", "scatter", {
            marker: {
                enabled: !1,
                states: {
                    hover: {
                        enabled: !1
                    }
                }
            },
            stickyTracking: !1,
            tooltip: {
                followPointer: !0,
                pointFormat: ""
            },
            trackByArea: !0
        }, {
            type: "polygon",
            getGraphPath: function() {
                for (var a = p.prototype.getGraphPath.call(this), q = a.length + 1; q--;)(q === a.length || "M" === a[q]) && 0 < q && a.splice(q, 0, "z");
                return this.areaPath = a
            },
            drawGraph: function() {
                this.options.fillColor = this.color;
                u.area.prototype.drawGraph.call(this)
            },
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
            drawTracker: p.prototype.drawTracker,
            setStackedPoints: a.noop
        })
    })(u);
    (function(a) {
        var p = a.arrayMax,
            v = a.arrayMin,
            u = a.Axis,
            l = a.color,
            q = a.each,
            f = a.isNumber,
            b = a.noop,
            d = a.pick,
            k = a.pInt,
            m = a.Point,
            n = a.Series,
            c = a.seriesType,
            g = a.seriesTypes;
        c("bubble", "scatter", {
            dataLabels: {
                formatter: function() {
                    return this.point.z
                },
                inside: !0,
                verticalAlign: "middle"
            },
            marker: {
                lineColor: null,
                lineWidth: 1,
                radius: null,
                states: {
                    hover: {
                        radiusPlus: 0
                    }
                },
                symbol: "circle"
            },
            minSize: 8,
            maxSize: "20%",
            softThreshold: !1,
            states: {
                hover: {
                    halo: {
                        size: 5
                    }
                }
            },
            tooltip: {
                pointFormat: "({point.x}, {point.y}), Size: {point.z}"
            },
            turboThreshold: 0,
            zThreshold: 0,
            zoneAxis: "z"
        }, {
            pointArrayMap: ["y", "z"],
            parallelArrays: ["x", "y", "z"],
            trackerGroups: ["markerGroup", "dataLabelsGroup"],
            bubblePadding: !0,
            zoneAxis: "z",
            pointAttribs: function(b, a) {
                var c = d(this.options.marker.fillOpacity, .5);
                b = n.prototype.pointAttribs.call(this, b, a);
                1 !== c && (b.fill = l(b.fill).setOpacity(c).get("rgba"));
                return b
            },
            getRadii: function(b, a, c, d) {
                var e, k, h, g =
                    this.zData,
                    f = [],
                    m = this.options,
                    n = "width" !== m.sizeBy,
                    t = m.zThreshold,
                    l = a - b;
                k = 0;
                for (e = g.length; k < e; k++) h = g[k], m.sizeByAbsoluteValue && null !== h && (h = Math.abs(h - t), a = Math.max(a - t, Math.abs(b - t)), b = 0), null === h ? h = null : h < b ? h = c / 2 - 1 : (h = 0 < l ? (h - b) / l : .5, n && 0 <= h && (h = Math.sqrt(h)), h = Math.ceil(c + h * (d - c)) / 2), f.push(h);
                this.radii = f
            },
            animate: function(b) {
                var a = this.options.animation;
                b || (q(this.points, function(b) {
                    var c = b.graphic,
                        d;
                    c && c.width && (d = {
                        x: c.x,
                        y: c.y,
                        width: c.width,
                        height: c.height
                    }, c.attr({
                        x: b.plotX,
                        y: b.plotY,
                        width: 1,
                        height: 1
                    }), c.animate(d, a))
                }), this.animate = null)
            },
            translate: function() {
                var b, a = this.data,
                    c, d, k = this.radii;
                g.scatter.prototype.translate.call(this);
                for (b = a.length; b--;) c = a[b], d = k ? k[b] : 0, f(d) && d >= this.minPxSize / 2 ? (c.marker = {
                    radius: d,
                    width: 2 * d,
                    height: 2 * d
                }, c.dlBox = {
                    x: c.plotX - d,
                    y: c.plotY - d,
                    width: 2 * d,
                    height: 2 * d
                }) : c.shapeArgs = c.plotY = c.dlBox = void 0
            },
            alignDataLabel: g.column.prototype.alignDataLabel,
            buildKDTree: b,
            applyZones: b
        }, {
            haloPath: function(b) {
                return m.prototype.haloPath.call(this, 0 === b ? 0 : this.marker.radius +
                    b)
            },
            ttBelow: !1
        });
        u.prototype.beforePadding = function() {
            var b = this,
                a = this.len,
                c = this.chart,
                g = 0,
                m = a,
                n = this.isXAxis,
                l = n ? "xData" : "yData",
                u = this.min,
                w = {},
                x = Math.min(c.plotWidth, c.plotHeight),
                A = Number.MAX_VALUE,
                E = -Number.MAX_VALUE,
                F = this.max - u,
                C = a / F,
                G = [];
            q(this.series, function(a) {
                var e = a.options;
                !a.bubblePadding || !a.visible && c.options.chart.ignoreHiddenSeries || (b.allowZoomOutside = !0, G.push(a), n && (q(["minSize", "maxSize"], function(b) {
                        var a = e[b],
                            c = /%$/.test(a),
                            a = k(a);
                        w[b] = c ? x * a / 100 : a
                    }), a.minPxSize = w.minSize,
                    a.maxPxSize = Math.max(w.maxSize, w.minSize), a = a.zData, a.length && (A = d(e.zMin, Math.min(A, Math.max(v(a), !1 === e.displayNegative ? e.zThreshold : -Number.MAX_VALUE))), E = d(e.zMax, Math.max(E, p(a))))))
            });
            q(G, function(a) {
                var c = a[l],
                    d = c.length,
                    e;
                n && a.getRadii(A, E, a.minPxSize, a.maxPxSize);
                if (0 < F)
                    for (; d--;) f(c[d]) && b.dataMin <= c[d] && c[d] <= b.dataMax && (e = a.radii[d], g = Math.min((c[d] - u) * C - e, g), m = Math.max((c[d] - u) * C + e, m))
            });
            G.length && 0 < F && !this.isLog && (m -= a, C *= (a + g - m) / a, q([
                ["min", "userMin", g],
                ["max", "userMax", m]
            ], function(a) {
                void 0 ===
                    d(b.options[a[0]], b[a[1]]) && (b[a[0]] += a[2] / C)
            }))
        }
    })(u);
    (function(a) {
        function p(b, a) {
            var d = this.chart,
                f = this.options.animation,
                n = this.group,
                c = this.markerGroup,
                g = this.xAxis.center,
                h = d.plotLeft,
                l = d.plotTop;
            d.polar ? d.renderer.isSVG && (!0 === f && (f = {}), a ? (b = {
                translateX: g[0] + h,
                translateY: g[1] + l,
                scaleX: .001,
                scaleY: .001
            }, n.attr(b), c && c.attr(b)) : (b = {
                translateX: h,
                translateY: l,
                scaleX: 1,
                scaleY: 1
            }, n.animate(b, f), c && c.animate(b, f), this.animate = null)) : b.call(this, a)
        }
        var u = a.each,
            w = a.pick,
            l = a.seriesTypes,
            q = a.wrap,
            f =
            a.Series.prototype;
        a = a.Pointer.prototype;
        f.searchPointByAngle = function(b) {
            var a = this.chart,
                k = this.xAxis.pane.center;
            return this.searchKDTree({
                clientX: 180 + -180 / Math.PI * Math.atan2(b.chartX - k[0] - a.plotLeft, b.chartY - k[1] - a.plotTop)
            })
        };
        q(f, "buildKDTree", function(b) {
            this.chart.polar && (this.kdByAngle ? this.searchPoint = this.searchPointByAngle : this.kdDimensions = 2);
            b.apply(this)
        });
        f.toXY = function(b) {
            var a, k = this.chart,
                f = b.plotX;
            a = b.plotY;
            b.rectPlotX = f;
            b.rectPlotY = a;
            a = this.xAxis.postTranslate(b.plotX, this.yAxis.len -
                a);
            b.plotX = b.polarPlotX = a.x - k.plotLeft;
            b.plotY = b.polarPlotY = a.y - k.plotTop;
            this.kdByAngle ? (k = (f / Math.PI * 180 + this.xAxis.pane.options.startAngle) % 360, 0 > k && (k += 360), b.clientX = k) : b.clientX = b.plotX
        };
        l.spline && q(l.spline.prototype, "getPointSpline", function(b, a, k, f) {
            var d, c, g, h, m, e, l;
            this.chart.polar ? (d = k.plotX, c = k.plotY, b = a[f - 1], g = a[f + 1], this.connectEnds && (b || (b = a[a.length - 2]), g || (g = a[1])), b && g && (h = b.plotX, m = b.plotY, a = g.plotX, e = g.plotY, h = (1.5 * d + h) / 2.5, m = (1.5 * c + m) / 2.5, g = (1.5 * d + a) / 2.5, l = (1.5 * c + e) / 2.5, a = Math.sqrt(Math.pow(h -
                d, 2) + Math.pow(m - c, 2)), e = Math.sqrt(Math.pow(g - d, 2) + Math.pow(l - c, 2)), h = Math.atan2(m - c, h - d), m = Math.atan2(l - c, g - d), l = Math.PI / 2 + (h + m) / 2, Math.abs(h - l) > Math.PI / 2 && (l -= Math.PI), h = d + Math.cos(l) * a, m = c + Math.sin(l) * a, g = d + Math.cos(Math.PI + l) * e, l = c + Math.sin(Math.PI + l) * e, k.rightContX = g, k.rightContY = l), f ? (k = ["C", b.rightContX || b.plotX, b.rightContY || b.plotY, h || d, m || c, d, c], b.rightContX = b.rightContY = null) : k = ["M", d, c]) : k = b.call(this, a, k, f);
            return k
        });
        q(f, "translate", function(a) {
            var b = this.chart;
            a.call(this);
            if (b.polar &&
                (this.kdByAngle = b.tooltip && b.tooltip.shared, !this.preventPostTranslate))
                for (a = this.points, b = a.length; b--;) this.toXY(a[b])
        });
        q(f, "getGraphPath", function(a, d) {
            var b = this,
                f, l;
            if (this.chart.polar) {
                d = d || this.points;
                for (f = 0; f < d.length; f++)
                    if (!d[f].isNull) {
                        l = f;
                        break
                    }!1 !== this.options.connectEnds && void 0 !== l && (this.connectEnds = !0, d.splice(d.length, 0, d[l]));
                u(d, function(a) {
                    void 0 === a.polarPlotY && b.toXY(a)
                })
            }
            return a.apply(this, [].slice.call(arguments, 1))
        });
        q(f, "animate", p);
        l.column && (l = l.column.prototype,
            l.polarArc = function(a, d, f, l) {
                var b = this.xAxis.center,
                    c = this.yAxis.len;
                return this.chart.renderer.symbols.arc(b[0], b[1], c - d, null, {
                    start: f,
                    end: l,
                    innerR: c - w(a, c)
                })
            }, q(l, "animate", p), q(l, "translate", function(a) {
                var b = this.xAxis,
                    f = b.startAngleRad,
                    l, n, c;
                this.preventPostTranslate = !0;
                a.call(this);
                if (b.isRadial)
                    for (l = this.points, c = l.length; c--;) n = l[c], a = n.barX + f, n.shapeType = "path", n.shapeArgs = {
                            d: this.polarArc(n.yBottom, n.plotY, a, a + n.pointWidth)
                        }, this.toXY(n), n.tooltipPos = [n.plotX, n.plotY], n.ttBelow = n.plotY >
                        b.center[1]
            }), q(l, "alignDataLabel", function(a, d, k, l, n, c) {
                this.chart.polar ? (a = d.rectPlotX / Math.PI * 180, null === l.align && (l.align = 20 < a && 160 > a ? "left" : 200 < a && 340 > a ? "right" : "center"), null === l.verticalAlign && (l.verticalAlign = 45 > a || 315 < a ? "bottom" : 135 < a && 225 > a ? "top" : "middle"), f.alignDataLabel.call(this, d, k, l, n, c)) : a.call(this, d, k, l, n, c)
            }));
        q(a, "getCoordinates", function(a, d) {
            var b = this.chart,
                f = {
                    xAxis: [],
                    yAxis: []
                };
            b.polar ? u(b.axes, function(a) {
                var c = a.isXAxis,
                    g = a.center,
                    h = d.chartX - g[0] - b.plotLeft,
                    g = d.chartY - g[1] -
                    b.plotTop;
                f[c ? "xAxis" : "yAxis"].push({
                    axis: a,
                    value: a.translate(c ? Math.PI - Math.atan2(h, g) : Math.sqrt(Math.pow(h, 2) + Math.pow(g, 2)), !0)
                })
            }) : f = a.call(this, d);
            return f
        })
    })(u)
});