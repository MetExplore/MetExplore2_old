/*
 Highcharts JS v5.0.7 (2017-01-17)
 Boost module

 (c) 2010-2016 Highsoft AS
 Author: Torstein Honsi

 License: www.highcharts.com/license
*/
(function(q) {
    "object" === typeof module && module.exports ? module.exports = q : q(Highcharts)
})(function(q) {
    (function(f) {
        function q(a, b, c, e, g) {
            g = g || 0;
            e = e || 5E4;
            for (var k = g + e, f = !0; f && g < k && g < a.length;) f = b(a[g], g), g += 1;
            f && (g < a.length ? setTimeout(function() {
                q(a, b, c, e, g)
            }) : c && c())
        }
        var x = f.win.document,
            U = function() {},
            V = f.Color,
            l = f.Series,
            d = f.seriesTypes,
            p = f.each,
            y = f.extend,
            W = f.addEvent,
            X = f.fireEvent,
            z = f.grep,
            u = f.isNumber,
            Y = f.merge,
            Z = f.pick,
            n = f.wrap,
            v = f.getOptions().plotOptions,
            G;
        p("area arearange bubble column line scatter".split(" "),
            function(a) {
                v[a] && (v[a].boostThreshold = 5E3)
            });
        p(["translate", "generatePoints", "drawTracker", "drawPoints", "render"], function(a) {
            function b(c) {
                var b = this.options.stacking && ("translate" === a || "generatePoints" === a);
                if ((this.processedXData || this.options.data).length < (this.options.boostThreshold || Number.MAX_VALUE) || b) "render" === a && this.image && (this.image.attr({
                    href: ""
                }), this.animate = null), c.call(this);
                else if (this[a + "Canvas"]) this[a + "Canvas"]()
            }
            n(l.prototype, a, b);
            "translate" === a && p(["arearange", "bubble",
                "column"
            ], function(c) {
                d[c] && n(d[c].prototype, a, b)
            })
        });
        n(l.prototype, "getExtremes", function(a) {
            this.hasExtremes() || a.apply(this, Array.prototype.slice.call(arguments, 1))
        });
        n(l.prototype, "setData", function(a) {
            this.hasExtremes(!0) || a.apply(this, Array.prototype.slice.call(arguments, 1))
        });
        n(l.prototype, "processData", function(a) {
            this.hasExtremes(!0) || a.apply(this, Array.prototype.slice.call(arguments, 1))
        });
        f.extend(l.prototype, {
            pointRange: 0,
            allowDG: !1,
            hasExtremes: function(a) {
                var b = this.options,
                    c = this.xAxis &&
                    this.xAxis.options,
                    e = this.yAxis && this.yAxis.options;
                return b.data.length > (b.boostThreshold || Number.MAX_VALUE) && u(e.min) && u(e.max) && (!a || u(c.min) && u(c.max))
            },
            destroyGraphics: function() {
                var a = this,
                    b = this.points,
                    c, e;
                if (b)
                    for (e = 0; e < b.length; e += 1)(c = b[e]) && c.graphic && (c.graphic = c.graphic.destroy());
                p(["graph", "area", "tracker"], function(b) {
                    a[b] && (a[b] = a[b].destroy())
                })
            },
            getContext: function() {
                var a = this.chart,
                    b = a.plotWidth,
                    c = a.plotHeight,
                    e = this.ctx,
                    g = function(a, b, c, e, g, f, d) {
                        a.call(this, c, b, e, g, f, d)
                    };
                this.canvas ?
                    e.clearRect(0, 0, b, c) : (this.canvas = x.createElement("canvas"), this.image = a.renderer.image("", 0, 0, b, c).add(this.group), this.ctx = e = this.canvas.getContext("2d"), a.inverted && p(["moveTo", "lineTo", "rect", "arc"], function(a) {
                        n(e, a, g)
                    }));
                this.canvas.width = b;
                this.canvas.height = c;
                this.image.attr({
                    width: b,
                    height: c
                });
                return e
            },
            canvasToSVG: function() {
                this.image.attr({
                    href: this.canvas.toDataURL("image/png")
                })
            },
            cvsLineTo: function(a, b, c) {
                a.lineTo(b, c)
            },
            renderCanvas: function() {
                var a = this,
                    b = a.options,
                    c = a.chart,
                    e = this.xAxis,
                    g = this.yAxis,
                    k, d = 0,
                    l = a.processedXData,
                    n = a.processedYData,
                    p = b.data,
                    m = e.getExtremes(),
                    v = m.min,
                    x = m.max,
                    m = g.getExtremes(),
                    z = m.min,
                    aa = m.max,
                    H = {},
                    A, ba = !!a.sampling,
                    I, B = b.marker && b.marker.radius,
                    J = this.cvsDrawPoint,
                    C = b.lineWidth ? this.cvsLineTo : !1,
                    K = B && 1 >= B ? this.cvsMarkerSquare : this.cvsMarkerCircle,
                    ca = this.cvsStrokeBatch || 1E3,
                    da = !1 !== b.enableMouseTracking,
                    L, m = b.threshold,
                    r = g.getThreshold(m),
                    M = u(m),
                    N = r,
                    ea = this.fill,
                    O = a.pointArrayMap && "low,high" === a.pointArrayMap.join(","),
                    P = !!b.stacking,
                    fa = a.cropStart || 0,
                    m = c.options.loading,
                    ga = a.requireSorting,
                    Q, ha = b.connectNulls,
                    R = !l,
                    D, E, t, w, ia = a.fillOpacity ? (new V(a.color)).setOpacity(Z(b.fillOpacity, .75)).get() : a.color,
                    S = function() {
                        ea ? (k.fillStyle = ia, k.fill()) : (k.strokeStyle = a.color, k.lineWidth = b.lineWidth, k.stroke())
                    },
                    T = function(b, c, e, g) {
                        0 === d && (k.beginPath(), C && (k.lineJoin = "round"));
                        Q ? k.moveTo(b, c) : J ? J(k, b, c, e, L) : C ? C(k, b, c) : K && K.call(a, k, b, c, B, g);
                        d += 1;
                        d === ca && (S(), d = 0);
                        L = {
                            clientX: b,
                            plotY: c,
                            yBottom: e
                        }
                    },
                    F = function(a, b, f) {
                        da && !H[a + "," + b] && (H[a + "," + b] = !0, c.inverted &&
                            (a = e.len - a, b = g.len - b), I.push({
                                clientX: a,
                                plotX: a,
                                plotY: b,
                                i: fa + f
                            }))
                    };
                (this.points || this.graph) && this.destroyGraphics();
                a.plotGroup("group", "series", a.visible ? "visible" : "hidden", b.zIndex, c.seriesGroup);
                a.markerGroup = a.group;
                W(a, "destroy", function() {
                    a.markerGroup = null
                });
                I = this.points = [];
                k = this.getContext();
                a.buildKDTree = U;
                99999 < p.length && (c.options.loading = Y(m, {
                        labelStyle: {
                            backgroundColor: f.color("#ffffff").setOpacity(.75).get(),
                            padding: "1em",
                            borderRadius: "0.5em"
                        },
                        style: {
                            backgroundColor: "none",
                            opacity: 1
                        }
                    }),
                    clearTimeout(G), c.showLoading("Drawing..."), c.options.loading = m);
                q(P ? a.data : l || p, function(b, f) {
                        var d, h, k, l = "undefined" === typeof c.index,
                            m = !0;
                        if (!l) {
                            R ? (d = b[0], h = b[1]) : (d = b, h = n[f]);
                            O ? (R && (h = b.slice(1, 3)), k = h[0], h = h[1]) : P && (d = b.x, h = b.stackY, k = h - b.y);
                            b = null === h;
                            ga || (m = h >= z && h <= aa);
                            if (!b && d >= v && d <= x && m)
                                if (d = Math.round(e.toPixels(d, !0)), ba) {
                                    if (void 0 === t || d === A) {
                                        O || (k = h);
                                        if (void 0 === w || h > E) E = h, w = f;
                                        if (void 0 === t || k < D) D = k, t = f
                                    }
                                    d !== A && (void 0 !== t && (h = g.toPixels(E, !0), r = g.toPixels(D, !0), T(d, M ? Math.min(h, N) :
                                        h, M ? Math.max(r, N) : r, f), F(d, h, w), r !== h && F(d, r, t)), t = w = void 0, A = d)
                                } else h = Math.round(g.toPixels(h, !0)), T(d, h, r, f), F(d, h, f);
                            Q = b && !ha;
                            0 === f % 5E4 && a.canvasToSVG()
                        }
                        return !l
                    }, function() {
                        var b = c.loadingDiv,
                            e = c.loadingShown;
                        S();
                        a.canvasToSVG();
                        X(a, "renderedCanvas");
                        e && (y(b.style, {
                            transition: "opacity 250ms",
                            opacity: 0
                        }), c.loadingShown = !1, G = setTimeout(function() {
                            b.parentNode && b.parentNode.removeChild(b);
                            c.loadingDiv = c.loadingSpan = null
                        }, 250));
                        a.directTouch = !1;
                        a.options.stickyTracking = !0;
                        delete a.buildKDTree;
                        a.buildKDTree()
                    },
                    c.renderer.forExport ? Number.MAX_VALUE : void 0)
            }
        });
        d.scatter.prototype.cvsMarkerCircle = function(a, b, c, e) {
            a.moveTo(b, c);
            a.arc(b, c, e, 0, 2 * Math.PI, !1)
        };
        d.scatter.prototype.cvsMarkerSquare = function(a, b, c, e) {
            a.rect(b - e, c - e, 2 * e, 2 * e)
        };
        d.scatter.prototype.fill = !0;
        d.bubble && (d.bubble.prototype.cvsMarkerCircle = function(a, b, c, e, d) {
            a.moveTo(b, c);
            a.arc(b, c, this.radii && this.radii[d], 0, 2 * Math.PI, !1)
        }, d.bubble.prototype.cvsStrokeBatch = 1);
        y(d.area.prototype, {
            cvsDrawPoint: function(a, b, c, e, d) {
                d && b !== d.clientX && (a.moveTo(d.clientX,
                    d.yBottom), a.lineTo(d.clientX, d.plotY), a.lineTo(b, c), a.lineTo(b, e))
            },
            fill: !0,
            fillOpacity: !0,
            sampling: !0
        });
        y(d.column.prototype, {
            cvsDrawPoint: function(a, b, c, d) {
                a.rect(b - 1, c, 1, d - c)
            },
            fill: !0,
            sampling: !0
        });
        l.prototype.getPoint = function(a) {
            var b = a,
                c = this.xData || this.options.xData || this.processedXData || !1;
            !a || a instanceof this.pointClass || (b = (new this.pointClass).init(this, this.options.data[a.i], c ? c[a.i] : void 0), b.category = b.x, b.dist = a.dist, b.distX = a.distX, b.plotX = a.plotX, b.plotY = a.plotY);
            return b
        };
        n(l.prototype,
            "destroy",
            function(a) {
                var b = this,
                    c = b.chart;
                c.hoverPoints && (c.hoverPoints = z(c.hoverPoints, function(a) {
                    return a.series === b
                }));
                c.hoverPoint && c.hoverPoint.series === b && (c.hoverPoint = null);
                a.call(this)
            });
        n(l.prototype, "searchPoint", function(a) {
            return this.getPoint(a.apply(this, [].slice.call(arguments, 1)))
        })
    })(q)
});