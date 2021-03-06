/*
 Highcharts JS v5.0.7 (2017-01-17)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(w) {
    "object" === typeof module && module.exports ? module.exports = w : w(Highcharts)
})(function(w) {
    (function(a) {
        function k(a, c, e) {
            this.init(a, c, e)
        }
        var t = a.each,
            u = a.extend,
            g = a.merge,
            m = a.splat;
        u(k.prototype, {
            init: function(a, c, e) {
                var h = this,
                    l = h.defaultOptions;
                h.chart = c;
                h.options = a = g(l, c.angular ? {
                    background: {}
                } : void 0, a);
                (a = a.background) && t([].concat(m(a)).reverse(), function(c) {
                    var b = e.userOptions;
                    c = g(h.defaultBackgroundOptions, c);
                    e.options.plotBands.unshift(c);
                    b.plotBands = b.plotBands || [];
                    b.plotBands !==
                        e.options.plotBands && b.plotBands.unshift(c)
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
                from: -Number.MAX_VALUE,
                innerRadius: 0,
                to: Number.MAX_VALUE,
                outerRadius: "105%"
            }
        });
        a.Pane = k
    })(w);
    (function(a) {
        var k = a.CenteredSeriesMixin,
            t = a.each,
            u = a.extend,
            g = a.map,
            m = a.merge,
            q = a.noop,
            c = a.Pane,
            e = a.pick,
            h = a.pInt,
            l = a.splat,
            n = a.wrap,
            b, f, p = a.Axis.prototype;
        a = a.Tick.prototype;
        b = {
            getOffset: q,
            redraw: function() {
                this.isDirty = !1
            },
            render: function() {
                this.isDirty = !1
            },
            setScale: q,
            setCategories: q,
            setTitle: q
        };
        f = {
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
                b = this.options = m(this.defaultOptions, this.defaultRadialOptions, b);
                b.plotBands || (b.plotBands = [])
            },
            getOffset: function() {
                p.getOffset.call(this);
                this.chart.axisOffset[this.side] = 0;
                this.center = this.pane.center = k.getCenter.call(this.pane)
            },
            getLinePath: function(b, d) {
                b = this.center;
                var c = this.chart,
                    r = e(d, b[2] / 2 - this.offset);
                this.isCircular || void 0 !== d ? d = this.chart.renderer.symbols.arc(this.left + b[0], this.top + b[1], r, r, {
                    start: this.startAngleRad,
                    end: this.endAngleRad,
                    open: !0,
                    innerR: 0
                }) : (d = this.postTranslate(this.angleRad, r), d = ["M", b[0] + c.plotLeft, b[1] + c.plotTop, "L", d.x, d.y]);
                return d
            },
            setAxisTranslation: function() {
                p.setAxisTranslation.call(this);
                this.center && (this.transA = this.isCircular ? (this.endAngleRad - this.startAngleRad) / (this.max - this.min || 1) : this.center[2] / 2 / (this.max - this.min || 1), this.minPixelPadding = this.isXAxis ? this.transA * this.minPointOffset : 0)
            },
            beforeSetTickPositions: function() {
                if (this.autoConnect = this.isCircular && void 0 === e(this.userMax,
                        this.options.max) && this.endAngleRad - this.startAngleRad === 2 * Math.PI) this.max += this.categories && 1 || this.pointRange || this.closestPointRange || 0
            },
            setAxisSize: function() {
                p.setAxisSize.call(this);
                this.isRadial && (this.center = this.pane.center = k.getCenter.call(this.pane), this.isCircular && (this.sector = this.endAngleRad - this.startAngleRad), this.len = this.width = this.height = this.center[2] * e(this.sector, 1) / 2)
            },
            getPosition: function(b, d) {
                return this.postTranslate(this.isCircular ? this.translate(b) : this.angleRad, e(this.isCircular ?
                    d : this.translate(b), this.center[2] / 2) - this.offset)
            },
            postTranslate: function(b, d) {
                var c = this.chart,
                    e = this.center;
                b = this.startAngleRad + b;
                return {
                    x: c.plotLeft + e[0] + Math.cos(b) * d,
                    y: c.plotTop + e[1] + Math.sin(b) * d
                }
            },
            getPlotBandPath: function(b, d, c) {
                var f = this.center,
                    r = this.startAngleRad,
                    l = f[2] / 2,
                    a = [e(c.outerRadius, "100%"), c.innerRadius, e(c.thickness, 10)],
                    n = Math.min(this.offset, 0),
                    p = /%$/,
                    v, m = this.isCircular;
                "polygon" === this.options.gridLineInterpolation ? f = this.getPlotLinePath(b).concat(this.getPlotLinePath(d, !0)) : (b = Math.max(b, this.min), d = Math.min(d, this.max), m || (a[0] = this.translate(b), a[1] = this.translate(d)), a = g(a, function(b) {
                    p.test(b) && (b = h(b, 10) * l / 100);
                    return b
                }), "circle" !== c.shape && m ? (b = r + this.translate(b), d = r + this.translate(d)) : (b = -Math.PI / 2, d = 1.5 * Math.PI, v = !0), a[0] -= n, a[2] -= n, f = this.chart.renderer.symbols.arc(this.left + f[0], this.top + f[1], a[0], a[0], {
                    start: Math.min(b, d),
                    end: Math.max(b, d),
                    innerR: e(a[1], a[0] - a[2]),
                    open: v
                }));
                return f
            },
            getPlotLinePath: function(b, c) {
                var d = this,
                    e = d.center,
                    f = d.chart,
                    h = d.getPosition(b),
                    a, r, l;
                d.isCircular ? l = ["M", e[0] + f.plotLeft, e[1] + f.plotTop, "L", h.x, h.y] : "circle" === d.options.gridLineInterpolation ? (b = d.translate(b)) && (l = d.getLinePath(0, b)) : (t(f.xAxis, function(b) {
                    b.pane === d.pane && (a = b)
                }), l = [], b = d.translate(b), e = a.tickPositions, a.autoConnect && (e = e.concat([e[0]])), c && (e = [].concat(e).reverse()), t(e, function(d, c) {
                    r = a.getPosition(d, b);
                    l.push(c ? "L" : "M", r.x, r.y)
                }));
                return l
            },
            getTitlePosition: function() {
                var b = this.center,
                    d = this.chart,
                    c = this.options.title;
                return {
                    x: d.plotLeft + b[0] + (c.x || 0),
                    y: d.plotTop + b[1] - {
                        high: .5,
                        middle: .25,
                        low: 0
                    }[c.align] * b[2] + (c.y || 0)
                }
            }
        };
        n(p, "init", function(h, d, a) {
            var r = d.angular,
                n = d.polar,
                p = a.isX,
                v = r && p,
                g, q = d.options,
                k = a.pane || 0;
            if (r) {
                if (u(this, v ? b : f), g = !p) this.defaultRadialOptions = this.defaultRadialGaugeOptions
            } else n && (u(this, f), this.defaultRadialOptions = (g = p) ? this.defaultRadialXOptions : m(this.defaultYAxisOptions, this.defaultRadialYOptions));
            r || n ? (this.isRadial = !0, d.inverted = !1, q.chart.zoomType = null) : this.isRadial = !1;
            h.call(this, d, a);
            v || !r && !n || (h = this.options,
                d.panes || (d.panes = []), this.pane = d = d.panes[k] = d.panes[k] || new c(l(q.pane)[k], d, this), d = d.options, this.angleRad = (h.angle || 0) * Math.PI / 180, this.startAngleRad = (d.startAngle - 90) * Math.PI / 180, this.endAngleRad = (e(d.endAngle, d.startAngle + 360) - 90) * Math.PI / 180, this.offset = h.offset || 0, this.isCircular = g)
        });
        n(p, "autoLabelAlign", function(b) {
            if (!this.isRadial) return b.apply(this, [].slice.call(arguments, 1))
        });
        n(a, "getPosition", function(b, c, e, h, f) {
            var d = this.axis;
            return d.getPosition ? d.getPosition(e) : b.call(this, c,
                e, h, f)
        });
        n(a, "getLabelPosition", function(b, c, h, f, a, l, n, p, m) {
            var d = this.axis,
                r = l.y,
                v = 20,
                z = l.align,
                g = (d.translate(this.pos) + d.startAngleRad + Math.PI / 2) / Math.PI * 180 % 360;
            d.isRadial ? (b = d.getPosition(this.pos, d.center[2] / 2 + e(l.distance, -25)), "auto" === l.rotation ? f.attr({
                rotation: g
            }) : null === r && (r = d.chart.renderer.fontMetrics(f.styles.fontSize).b - f.getBBox().height / 2), null === z && (d.isCircular ? (this.label.getBBox().width > d.len * d.tickInterval / (d.max - d.min) && (v = 0), z = g > v && g < 180 - v ? "left" : g > 180 + v && g < 360 - v ? "right" :
                "center") : z = "center", f.attr({
                align: z
            })), b.x += l.x, b.y += r) : b = b.call(this, c, h, f, a, l, n, p, m);
            return b
        });
        n(a, "getMarkPath", function(b, d, c, e, f, h, a) {
            var l = this.axis;
            l.isRadial ? (b = l.getPosition(this.pos, l.center[2] / 2 + e), d = ["M", d, c, "L", b.x, b.y]) : d = b.call(this, d, c, e, f, h, a);
            return d
        })
    })(w);
    (function(a) {
        var k = a.each,
            t = a.noop,
            u = a.pick,
            g = a.Series,
            m = a.seriesType,
            q = a.seriesTypes;
        m("arearange", "area", {
            marker: null,
            threshold: null,
            tooltip: {
                pointFormat: '\x3cspan class\x3d"highcharts-color-{series.colorIndex}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e'
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
            dataLabelCollections: ["dataLabel", "dataLabelUpper"],
            toYData: function(c) {
                return [c.low, c.high]
            },
            pointValKey: "low",
            deferTranslatePolar: !0,
            highToXY: function(c) {
                var e = this.chart,
                    h = this.xAxis.postTranslate(c.rectPlotX, this.yAxis.len - c.plotHigh);
                c.plotHighX = h.x - e.plotLeft;
                c.plotHigh = h.y - e.plotTop
            },
            translate: function() {
                var c = this,
                    e = c.yAxis,
                    h = !!c.modifyValue;
                q.area.prototype.translate.apply(c);
                k(c.points, function(a) {
                    var l = a.low,
                        b = a.high,
                        f = a.plotY;
                    null === b || null === l ? a.isNull = !0 : (a.plotLow = f, a.plotHigh = e.translate(h ? c.modifyValue(b, a) : b, 0, 1, 0, 1), h && (a.yBottom = a.plotHigh))
                });
                this.chart.polar && k(this.points, function(e) {
                    c.highToXY(e)
                })
            },
            getGraphPath: function(c) {
                var e = [],
                    a = [],
                    l, n = q.area.prototype.getGraphPath,
                    b, f, p;
                p = this.options;
                var r = this.chart.polar && !1 !== p.connectEnds,
                    d = p.step;
                c = c || this.points;
                for (l = c.length; l--;) b = c[l], b.isNull || r || c[l + 1] && !c[l + 1].isNull || a.push({
                    plotX: b.plotX,
                    plotY: b.plotY,
                    doCurve: !1
                }), f = {
                    polarPlotY: b.polarPlotY,
                    rectPlotX: b.rectPlotX,
                    yBottom: b.yBottom,
                    plotX: u(b.plotHighX, b.plotX),
                    plotY: b.plotHigh,
                    isNull: b.isNull
                }, a.push(f), e.push(f), b.isNull || r || c[l - 1] && !c[l - 1].isNull || a.push({
                    plotX: b.plotX,
                    plotY: b.plotY,
                    doCurve: !1
                });
                c = n.call(this, c);
                d && (!0 === d && (d = "left"), p.step = {
                    left: "right",
                    center: "center",
                    right: "left"
                }[d]);
                e = n.call(this, e);
                a = n.call(this, a);
                p.step = d;
                p = [].concat(c, e);
                this.chart.polar || "M" !== a[0] || (a[0] = "L");
                this.graphPath = p;
                this.areaPath = this.areaPath.concat(c, a);
                p.isArea = !0;
                p.xMap = c.xMap;
                this.areaPath.xMap = c.xMap;
                return p
            },
            drawDataLabels: function() {
                var c = this.data,
                    e = c.length,
                    a, l = [],
                    n = g.prototype,
                    b = this.options.dataLabels,
                    f = b.align,
                    p = b.verticalAlign,
                    r = b.inside,
                    d, v, m = this.chart.inverted;
                if (b.enabled || this._hasPointLabels) {
                    for (a = e; a--;)
                        if (d = c[a]) v = r ? d.plotHigh < d.plotLow : d.plotHigh > d.plotLow, d.y = d.high, d._plotY = d.plotY, d.plotY = d.plotHigh, l[a] = d.dataLabel, d.dataLabel = d.dataLabelUpper, d.below = v, m ? f || (b.align = v ? "right" : "left") : p || (b.verticalAlign = v ? "top" : "bottom"),
                            b.x = b.xHigh, b.y = b.yHigh;
                    n.drawDataLabels && n.drawDataLabels.apply(this, arguments);
                    for (a = e; a--;)
                        if (d = c[a]) v = r ? d.plotHigh < d.plotLow : d.plotHigh > d.plotLow, d.dataLabelUpper = d.dataLabel, d.dataLabel = l[a], d.y = d.low, d.plotY = d._plotY, d.below = !v, m ? f || (b.align = v ? "left" : "right") : p || (b.verticalAlign = v ? "bottom" : "top"), b.x = b.xLow, b.y = b.yLow;
                    n.drawDataLabels && n.drawDataLabels.apply(this, arguments)
                }
                b.align = f;
                b.verticalAlign = p
            },
            alignDataLabel: function() {
                q.column.prototype.alignDataLabel.apply(this, arguments)
            },
            setStackedPoints: t,
            getSymbol: t,
            drawPoints: t
        })
    })(w);
    (function(a) {
        var k = a.seriesType;
        k("areasplinerange", "arearange", null, {
            getPointSpline: a.seriesTypes.spline.prototype.getPointSpline
        })
    })(w);
    (function(a) {
        var k = a.defaultPlotOptions,
            t = a.each,
            u = a.merge,
            g = a.noop,
            m = a.pick,
            q = a.seriesType,
            c = a.seriesTypes.column.prototype;
        q("columnrange", "arearange", u(k.column, k.arearange, {
            lineWidth: 1,
            pointRange: null
        }), {
            translate: function() {
                var a = this,
                    h = a.yAxis,
                    l = a.xAxis,
                    n = l.startAngleRad,
                    b, f = a.chart,
                    p = a.xAxis.isRadial,
                    r;
                c.translate.apply(a);
                t(a.points, function(d) {
                    var c = d.shapeArgs,
                        e = a.options.minPointLength,
                        g, k;
                    d.plotHigh = r = h.translate(d.high, 0, 1, 0, 1);
                    d.plotLow = d.plotY;
                    k = r;
                    g = m(d.rectPlotY, d.plotY) - r;
                    Math.abs(g) < e ? (e -= g, g += e, k -= e / 2) : 0 > g && (g *= -1, k -= g);
                    p ? (b = d.barX + n, d.shapeType = "path", d.shapeArgs = {
                        d: a.polarArc(k + g, k, b, b + d.pointWidth)
                    }) : (c.height = g, c.y = k, d.tooltipPos = f.inverted ? [h.len + h.pos - f.plotLeft - k - g / 2, l.len + l.pos - f.plotTop - c.x - c.width / 2, g] : [l.left - f.plotLeft + c.x + c.width / 2, h.pos - f.plotTop + k + g / 2, g])
                })
            },
            directTouch: !0,
            trackerGroups: ["group",
                "dataLabelsGroup"
            ],
            drawGraph: g,
            crispCol: c.crispCol,
            drawPoints: c.drawPoints,
            drawTracker: c.drawTracker,
            getColumnMetrics: c.getColumnMetrics,
            animate: function() {
                return c.animate.apply(this, arguments)
            },
            polarArc: function() {
                return c.polarArc.apply(this, arguments)
            },
            pointAttribs: c.pointAttribs
        })
    })(w);
    (function(a) {
        var k = a.each,
            t = a.isNumber,
            u = a.merge,
            g = a.pick,
            m = a.pInt,
            q = a.Series,
            c = a.seriesType,
            e = a.TrackerMixin;
        c("gauge", "line", {
            dataLabels: {
                enabled: !0,
                defer: !1,
                y: 15,
                borderRadius: 3,
                crop: !1,
                verticalAlign: "top",
                zIndex: 2
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
                var c = this.yAxis,
                    a = this.options,
                    e = c.center;
                this.generatePoints();
                k(this.points, function(b) {
                    var f = u(a.dial, b.dial),
                        h = m(g(f.radius, 80)) * e[2] / 200,
                        l = m(g(f.baseLength, 70)) * h / 100,
                        d = m(g(f.rearLength, 10)) * h / 100,
                        n = f.baseWidth || 3,
                        k = f.topWidth || 1,
                        q = a.overshoot,
                        x = c.startAngleRad + c.translate(b.y, null, null,
                            null, !0);
                    t(q) ? (q = q / 180 * Math.PI, x = Math.max(c.startAngleRad - q, Math.min(c.endAngleRad + q, x))) : !1 === a.wrap && (x = Math.max(c.startAngleRad, Math.min(c.endAngleRad, x)));
                    x = 180 * x / Math.PI;
                    b.shapeType = "path";
                    b.shapeArgs = {
                        d: f.path || ["M", -d, -n / 2, "L", l, -n / 2, h, -k / 2, h, k / 2, l, n / 2, -d, n / 2, "z"],
                        translateX: e[0],
                        translateY: e[1],
                        rotation: x
                    };
                    b.plotX = e[0];
                    b.plotY = e[1]
                })
            },
            drawPoints: function() {
                var c = this,
                    a = c.yAxis.center,
                    e = c.pivot,
                    b = c.options,
                    f = b.pivot,
                    p = c.chart.renderer;
                k(c.points, function(a) {
                    var d = a.graphic,
                        e = a.shapeArgs,
                        f =
                        e.d;
                    u(b.dial, a.dial);
                    d ? (d.animate(e), e.d = f) : a.graphic = p[a.shapeType](e).attr({
                        rotation: e.rotation,
                        zIndex: 1
                    }).addClass("highcharts-dial").add(c.group)
                });
                e ? e.animate({
                    translateX: a[0],
                    translateY: a[1]
                }) : c.pivot = p.circle(0, 0, g(f.radius, 5)).attr({
                    zIndex: 2
                }).addClass("highcharts-pivot").translate(a[0], a[1]).add(c.group)
            },
            animate: function(c) {
                var a = this;
                c || (k(a.points, function(c) {
                        var b = c.graphic;
                        b && (b.attr({
                            rotation: 180 * a.yAxis.startAngleRad / Math.PI
                        }), b.animate({
                            rotation: c.shapeArgs.rotation
                        }, a.options.animation))
                    }),
                    a.animate = null)
            },
            render: function() {
                this.group = this.plotGroup("group", "series", this.visible ? "visible" : "hidden", this.options.zIndex, this.chart.seriesGroup);
                q.prototype.render.call(this);
                this.group.clip(this.chart.clipRect)
            },
            setData: function(c, a) {
                q.prototype.setData.call(this, c, !1);
                this.processData();
                this.generatePoints();
                g(a, !0) && this.chart.redraw()
            },
            drawTracker: e && e.drawTrackerPoint
        }, {
            setState: function(c) {
                this.state = c
            }
        })
    })(w);
    (function(a) {
        var k = a.each,
            t = a.noop,
            u = a.seriesType,
            g = a.seriesTypes;
        u("boxplot",
            "column", {
                threshold: null,
                tooltip: {
                    pointFormat: '\x3cspan class\x3d"highcharts-color-{point.colorIndex}"\x3e\u25cf\x3c/span\x3e \x3cb\x3e {series.name}\x3c/b\x3e\x3cbr/\x3eMaximum: {point.high}\x3cbr/\x3eUpper quartile: {point.q3}\x3cbr/\x3eMedian: {point.median}\x3cbr/\x3eLower quartile: {point.q1}\x3cbr/\x3eMinimum: {point.low}\x3cbr/\x3e'
                },
                whiskerLength: "50%"
            }, {
                pointArrayMap: ["low", "q1", "median", "q3", "high"],
                toYData: function(a) {
                    return [a.low, a.q1, a.median, a.q3, a.high]
                },
                pointValKey: "high",
                drawDataLabels: t,
                translate: function() {
                    var a = this.yAxis,
                        q = this.pointArrayMap;
                    g.column.prototype.translate.apply(this);
                    k(this.points, function(c) {
                        k(q, function(e) {
                            null !== c[e] && (c[e + "Plot"] = a.translate(c[e], 0, 1, 0, 1))
                        })
                    })
                },
                drawPoints: function() {
                    var a = this,
                        g = a.chart.renderer,
                        c, e, h, l, n, b, f = 0,
                        p, r, d, v, z = !1 !== a.doQuartiles,
                        t, x = a.options.whiskerLength;
                    k(a.points, function(k) {
                        var m = k.graphic,
                            q = m ? "animate" : "attr",
                            u = k.shapeArgs;
                        void 0 !== k.plotY && (p = u.width, r = Math.floor(u.x), d = r + p, v = Math.round(p / 2), c = Math.floor(z ? k.q1Plot : k.lowPlot),
                            e = Math.floor(z ? k.q3Plot : k.lowPlot), h = Math.floor(k.highPlot), l = Math.floor(k.lowPlot), m || (k.graphic = m = g.g("point").add(a.group), k.stem = g.path().addClass("highcharts-boxplot-stem").add(m), x && (k.whiskers = g.path().addClass("highcharts-boxplot-whisker").add(m)), z && (k.box = g.path(void 0).addClass("highcharts-boxplot-box").add(m)), k.medianShape = g.path(void 0).addClass("highcharts-boxplot-median").add(m)), b = k.stem.strokeWidth() % 2 / 2, f = r + v + b, k.stem[q]({
                                d: ["M", f, e, "L", f, h, "M", f, c, "L", f, l]
                            }), z && (b = k.box.strokeWidth() %
                                2 / 2, c = Math.floor(c) + b, e = Math.floor(e) + b, r += b, d += b, k.box[q]({
                                    d: ["M", r, e, "L", r, c, "L", d, c, "L", d, e, "L", r, e, "z"]
                                })), x && (b = k.whiskers.strokeWidth() % 2 / 2, h += b, l += b, t = /%$/.test(x) ? v * parseFloat(x) / 100 : x / 2, k.whiskers[q]({
                                d: ["M", f - t, h, "L", f + t, h, "M", f - t, l, "L", f + t, l]
                            })), n = Math.round(k.medianPlot), b = k.medianShape.strokeWidth() % 2 / 2, n += b, k.medianShape[q]({
                                d: ["M", r, n, "L", d, n]
                            }))
                    })
                },
                setStackedPoints: t
            })
    })(w);
    (function(a) {
        var k = a.each,
            t = a.noop,
            u = a.seriesType,
            g = a.seriesTypes;
        u("errorbar", "boxplot", {
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
            drawDataLabels: g.arearange ? function() {
                var a = this.pointValKey;
                g.arearange.prototype.drawDataLabels.call(this);
                k(this.data, function(k) {
                    k.y = k[a]
                })
            } : t,
            getColumnMetrics: function() {
                return this.linkedParent &&
                    this.linkedParent.columnMetrics || g.column.prototype.getColumnMetrics.call(this)
            }
        })
    })(w);
    (function(a) {
        var k = a.correctFloat,
            t = a.isNumber,
            u = a.pick,
            g = a.Point,
            m = a.Series,
            q = a.seriesType,
            c = a.seriesTypes;
        q("waterfall", "column", {
            dataLabels: {
                inside: !0
            }
        }, {
            pointValKey: "y",
            translate: function() {
                var a = this.options,
                    h = this.yAxis,
                    l, n, b, f, p, r, d, g, m, q = u(a.minPointLength, 5),
                    t = a.threshold,
                    w = a.stacking,
                    A = 0,
                    y = 0,
                    B;
                c.column.prototype.translate.apply(this);
                d = g = t;
                n = this.points;
                l = 0;
                for (a = n.length; l < a; l++) b = n[l], r = this.processedYData[l],
                    f = b.shapeArgs, p = w && h.stacks[(this.negStacks && r < t ? "-" : "") + this.stackKey], B = this.getStackIndicator(B, b.x), m = p ? p[b.x].points[this.index + "," + l + "," + B.index] : [0, r], b.isSum ? b.y = k(r) : b.isIntermediateSum && (b.y = k(r - g)), p = Math.max(d, d + b.y) + m[0], f.y = h.toPixels(p, !0), b.isSum ? (f.y = h.toPixels(m[1], !0), f.height = Math.min(h.toPixels(m[0], !0), h.len) - f.y + A + y) : b.isIntermediateSum ? (f.y = h.toPixels(m[1], !0), f.height = Math.min(h.toPixels(g, !0), h.len) - f.y + A + y, g = m[1]) : (f.height = 0 < r ? h.toPixels(d, !0) - f.y : h.toPixels(d, !0) - h.toPixels(d -
                        r, !0), d += r), 0 > f.height && (f.y += f.height, f.height *= -1), b.plotY = f.y = Math.round(f.y) - this.borderWidth % 2 / 2, f.height = Math.max(Math.round(f.height), .001), b.yBottom = f.y + f.height, f.y -= y, f.height <= q && !b.isNull && (f.height = q, 0 > b.y ? y -= q : A += q), f.y -= A, f = b.plotY - y - A + (b.negative && 0 <= y ? f.height : 0), this.chart.inverted ? b.tooltipPos[0] = h.len - f : b.tooltipPos[1] = f
            },
            processData: function(a) {
                var c = this.yData,
                    e = this.options.data,
                    n, b = c.length,
                    f, p, r, d, g, q;
                p = f = r = d = this.options.threshold || 0;
                for (q = 0; q < b; q++) g = c[q], n = e && e[q] ? e[q] : {}, "sum" === g || n.isSum ? c[q] = k(p) : "intermediateSum" === g || n.isIntermediateSum ? c[q] = k(f) : (p += g, f += g), r = Math.min(p, r), d = Math.max(p, d);
                m.prototype.processData.call(this, a);
                this.dataMin = r;
                this.dataMax = d
            },
            toYData: function(a) {
                return a.isSum ? 0 === a.x ? null : "sum" : a.isIntermediateSum ? 0 === a.x ? null : "intermediateSum" : a.y
            },
            getGraphPath: function() {
                return ["M", 0, 0]
            },
            getCrispPath: function() {
                var a = this.data,
                    c = a.length,
                    l = this.graph.strokeWidth() + this.borderWidth,
                    l = Math.round(l) % 2 / 2,
                    n = [],
                    b, f, p;
                for (p = 1; p < c; p++) f = a[p].shapeArgs,
                    b = a[p - 1].shapeArgs, f = ["M", b.x + b.width, b.y + l, "L", f.x, b.y + l], 0 > a[p - 1].y && (f[2] += b.height, f[5] += b.height), n = n.concat(f);
                return n
            },
            drawGraph: function() {
                m.prototype.drawGraph.call(this);
                this.graph.attr({
                    d: this.getCrispPath()
                })
            },
            getExtremes: a.noop
        }, {
            getClassName: function() {
                var a = g.prototype.getClassName.call(this);
                this.isSum ? a += " highcharts-sum" : this.isIntermediateSum && (a += " highcharts-intermediate-sum");
                return a
            },
            isValid: function() {
                return t(this.y, !0) || this.isSum || this.isIntermediateSum
            }
        })
    })(w);
    (function(a) {
        var k =
            a.Series,
            t = a.seriesType,
            u = a.seriesTypes;
        t("polygon", "scatter", {
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
                for (var a = k.prototype.getGraphPath.call(this), m = a.length + 1; m--;)(m === a.length || "M" === a[m]) && 0 < m && a.splice(m, 0, "z");
                return this.areaPath = a
            },
            drawGraph: function() {
                u.area.prototype.drawGraph.call(this)
            },
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
            drawTracker: k.prototype.drawTracker,
            setStackedPoints: a.noop
        })
    })(w);
    (function(a) {
        var k = a.arrayMax,
            t = a.arrayMin,
            u = a.Axis,
            g = a.each,
            m = a.isNumber,
            q = a.noop,
            c = a.pick,
            e = a.pInt,
            h = a.Point,
            l = a.seriesType,
            n = a.seriesTypes;
        l("bubble", "scatter", {
            dataLabels: {
                formatter: function() {
                    return this.point.z
                },
                inside: !0,
                verticalAlign: "middle"
            },
            marker: {
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
            getRadii: function(a, c, e, l) {
                var b, f, h, n = this.zData,
                    p = [],
                    r = this.options,
                    k = "width" !== r.sizeBy,
                    g = r.zThreshold,
                    m = c - a;
                f = 0;
                for (b = n.length; f < b; f++) h = n[f], r.sizeByAbsoluteValue && null !== h && (h = Math.abs(h - g), c = Math.max(c - g, Math.abs(a - g)), a = 0), null === h ? h = null : h < a ? h = e / 2 - 1 : (h = 0 < m ? (h - a) / m : .5, k && 0 <= h && (h = Math.sqrt(h)), h = Math.ceil(e + h * (l - e)) / 2), p.push(h);
                this.radii =
                    p
            },
            animate: function(a) {
                var b = this.options.animation;
                a || (g(this.points, function(a) {
                    var c = a.graphic,
                        d;
                    c && c.width && (d = {
                        x: c.x,
                        y: c.y,
                        width: c.width,
                        height: c.height
                    }, c.attr({
                        x: a.plotX,
                        y: a.plotY,
                        width: 1,
                        height: 1
                    }), c.animate(d, b))
                }), this.animate = null)
            },
            translate: function() {
                var a, c = this.data,
                    e, h, d = this.radii;
                n.scatter.prototype.translate.call(this);
                for (a = c.length; a--;) e = c[a], h = d ? d[a] : 0, m(h) && h >= this.minPxSize / 2 ? (e.marker = {
                        radius: h,
                        width: 2 * h,
                        height: 2 * h
                    }, e.dlBox = {
                        x: e.plotX - h,
                        y: e.plotY - h,
                        width: 2 * h,
                        height: 2 * h
                    }) :
                    e.shapeArgs = e.plotY = e.dlBox = void 0
            },
            alignDataLabel: n.column.prototype.alignDataLabel,
            buildKDTree: q,
            applyZones: q
        }, {
            haloPath: function(a) {
                return h.prototype.haloPath.call(this, 0 === a ? 0 : this.marker.radius + a)
            },
            ttBelow: !1
        });
        u.prototype.beforePadding = function() {
            var a = this,
                f = this.len,
                h = this.chart,
                l = 0,
                d = f,
                n = this.isXAxis,
                q = n ? "xData" : "yData",
                u = this.min,
                x = {},
                w = Math.min(h.plotWidth, h.plotHeight),
                A = Number.MAX_VALUE,
                y = -Number.MAX_VALUE,
                B = this.max - u,
                C = f / B,
                D = [];
            g(this.series, function(b) {
                var d = b.options;
                !b.bubblePadding ||
                    !b.visible && h.options.chart.ignoreHiddenSeries || (a.allowZoomOutside = !0, D.push(b), n && (g(["minSize", "maxSize"], function(a) {
                        var b = d[a],
                            c = /%$/.test(b),
                            b = e(b);
                        x[a] = c ? w * b / 100 : b
                    }), b.minPxSize = x.minSize, b.maxPxSize = Math.max(x.maxSize, x.minSize), b = b.zData, b.length && (A = c(d.zMin, Math.min(A, Math.max(t(b), !1 === d.displayNegative ? d.zThreshold : -Number.MAX_VALUE))), y = c(d.zMax, Math.max(y, k(b))))))
            });
            g(D, function(b) {
                var c = b[q],
                    e = c.length,
                    f;
                n && b.getRadii(A, y, b.minPxSize, b.maxPxSize);
                if (0 < B)
                    for (; e--;) m(c[e]) && a.dataMin <=
                        c[e] && c[e] <= a.dataMax && (f = b.radii[e], l = Math.min((c[e] - u) * C - f, l), d = Math.max((c[e] - u) * C + f, d))
            });
            D.length && 0 < B && !this.isLog && (d -= f, C *= (f + l - d) / f, g([
                ["min", "userMin", l],
                ["max", "userMax", d]
            ], function(b) {
                void 0 === c(a.options[b[0]], a[b[1]]) && (a[b[0]] += b[2] / C)
            }))
        }
    })(w);
    (function(a) {
        function k(a, e) {
            var c = this.chart,
                l = this.options.animation,
                n = this.group,
                b = this.markerGroup,
                f = this.xAxis.center,
                g = c.plotLeft,
                k = c.plotTop;
            c.polar ? c.renderer.isSVG && (!0 === l && (l = {}), e ? (a = {
                translateX: f[0] + g,
                translateY: f[1] + k,
                scaleX: .001,
                scaleY: .001
            }, n.attr(a), b && b.attr(a)) : (a = {
                translateX: g,
                translateY: k,
                scaleX: 1,
                scaleY: 1
            }, n.animate(a, l), b && b.animate(a, l), this.animate = null)) : a.call(this, e)
        }
        var t = a.each,
            u = a.pick,
            g = a.seriesTypes,
            m = a.wrap,
            q = a.Series.prototype;
        a = a.Pointer.prototype;
        q.searchPointByAngle = function(a) {
            var c = this.chart,
                h = this.xAxis.pane.center;
            return this.searchKDTree({
                clientX: 180 + -180 / Math.PI * Math.atan2(a.chartX - h[0] - c.plotLeft, a.chartY - h[1] - c.plotTop)
            })
        };
        m(q, "buildKDTree", function(a) {
            this.chart.polar && (this.kdByAngle ? this.searchPoint =
                this.searchPointByAngle : this.kdDimensions = 2);
            a.apply(this)
        });
        q.toXY = function(a) {
            var c, h = this.chart,
                l = a.plotX;
            c = a.plotY;
            a.rectPlotX = l;
            a.rectPlotY = c;
            c = this.xAxis.postTranslate(a.plotX, this.yAxis.len - c);
            a.plotX = a.polarPlotX = c.x - h.plotLeft;
            a.plotY = a.polarPlotY = c.y - h.plotTop;
            this.kdByAngle ? (h = (l / Math.PI * 180 + this.xAxis.pane.options.startAngle) % 360, 0 > h && (h += 360), a.clientX = h) : a.clientX = a.plotX
        };
        g.spline && m(g.spline.prototype, "getPointSpline", function(a, e, h, l) {
            var c, b, f, g, k, d, m;
            this.chart.polar ? (c = h.plotX,
                b = h.plotY, a = e[l - 1], f = e[l + 1], this.connectEnds && (a || (a = e[e.length - 2]), f || (f = e[1])), a && f && (g = a.plotX, k = a.plotY, e = f.plotX, d = f.plotY, g = (1.5 * c + g) / 2.5, k = (1.5 * b + k) / 2.5, f = (1.5 * c + e) / 2.5, m = (1.5 * b + d) / 2.5, e = Math.sqrt(Math.pow(g - c, 2) + Math.pow(k - b, 2)), d = Math.sqrt(Math.pow(f - c, 2) + Math.pow(m - b, 2)), g = Math.atan2(k - b, g - c), k = Math.atan2(m - b, f - c), m = Math.PI / 2 + (g + k) / 2, Math.abs(g - m) > Math.PI / 2 && (m -= Math.PI), g = c + Math.cos(m) * e, k = b + Math.sin(m) * e, f = c + Math.cos(Math.PI + m) * d, m = b + Math.sin(Math.PI + m) * d, h.rightContX = f, h.rightContY = m),
                l ? (h = ["C", a.rightContX || a.plotX, a.rightContY || a.plotY, g || c, k || b, c, b], a.rightContX = a.rightContY = null) : h = ["M", c, b]) : h = a.call(this, e, h, l);
            return h
        });
        m(q, "translate", function(a) {
            var c = this.chart;
            a.call(this);
            if (c.polar && (this.kdByAngle = c.tooltip && c.tooltip.shared, !this.preventPostTranslate))
                for (a = this.points, c = a.length; c--;) this.toXY(a[c])
        });
        m(q, "getGraphPath", function(a, e) {
            var c = this,
                l, g;
            if (this.chart.polar) {
                e = e || this.points;
                for (l = 0; l < e.length; l++)
                    if (!e[l].isNull) {
                        g = l;
                        break
                    }!1 !== this.options.connectEnds &&
                    void 0 !== g && (this.connectEnds = !0, e.splice(e.length, 0, e[g]));
                t(e, function(a) {
                    void 0 === a.polarPlotY && c.toXY(a)
                })
            }
            return a.apply(this, [].slice.call(arguments, 1))
        });
        m(q, "animate", k);
        g.column && (g = g.column.prototype, g.polarArc = function(a, e, h, l) {
            var c = this.xAxis.center,
                b = this.yAxis.len;
            return this.chart.renderer.symbols.arc(c[0], c[1], b - e, null, {
                start: h,
                end: l,
                innerR: b - u(a, b)
            })
        }, m(g, "animate", k), m(g, "translate", function(a) {
            var c = this.xAxis,
                h = c.startAngleRad,
                l, g, b;
            this.preventPostTranslate = !0;
            a.call(this);
            if (c.isRadial)
                for (l =
                    this.points, b = l.length; b--;) g = l[b], a = g.barX + h, g.shapeType = "path", g.shapeArgs = {
                    d: this.polarArc(g.yBottom, g.plotY, a, a + g.pointWidth)
                }, this.toXY(g), g.tooltipPos = [g.plotX, g.plotY], g.ttBelow = g.plotY > c.center[1]
        }), m(g, "alignDataLabel", function(a, e, h, g, k, b) {
            this.chart.polar ? (a = e.rectPlotX / Math.PI * 180, null === g.align && (g.align = 20 < a && 160 > a ? "left" : 200 < a && 340 > a ? "right" : "center"), null === g.verticalAlign && (g.verticalAlign = 45 > a || 315 < a ? "bottom" : 135 < a && 225 > a ? "top" : "middle"), q.alignDataLabel.call(this, e, h, g, k, b)) : a.call(this,
                e, h, g, k, b)
        }));
        m(a, "getCoordinates", function(a, e) {
            var c = this.chart,
                g = {
                    xAxis: [],
                    yAxis: []
                };
            c.polar ? t(c.axes, function(a) {
                var b = a.isXAxis,
                    f = a.center,
                    h = e.chartX - f[0] - c.plotLeft,
                    f = e.chartY - f[1] - c.plotTop;
                g[b ? "xAxis" : "yAxis"].push({
                    axis: a,
                    value: a.translate(b ? Math.PI - Math.atan2(h, f) : Math.sqrt(Math.pow(h, 2) + Math.pow(f, 2)), !0)
                })
            }) : g = a.call(this, e);
            return g
        })
    })(w)
});