/*
 Highcharts JS v5.0.7 (2017-01-17)

 3D features for Highcharts JS

 @license: www.highcharts.com/license
*/
(function(t) {
    "object" === typeof module && module.exports ? module.exports = t : t(Highcharts)
})(function(t) {
    (function(a) {
        var r = a.deg2rad,
            d = a.pick;
        a.perspective = function(p, q, y) {
            var k = q.options.chart.options3d,
                m = y ? q.inverted : !1,
                l = q.plotWidth / 2,
                e = q.plotHeight / 2,
                f = k.depth / 2,
                n = d(k.depth, 1) * d(k.viewDistance, 0),
                c = q.scale3d || 1,
                b = r * k.beta * (m ? -1 : 1),
                k = r * k.alpha * (m ? -1 : 1),
                h = Math.cos(k),
                u = Math.cos(-b),
                z = Math.sin(k),
                A = Math.sin(-b);
            y || (l += q.plotLeft, e += q.plotTop);
            return a.map(p, function(b) {
                var a, k;
                k = (m ? b.y : b.x) - l;
                var d = (m ?
                        b.x : b.y) - e,
                    p = (b.z || 0) - f;
                a = u * k - A * p;
                b = -z * A * k + h * d - u * z * p;
                k = h * A * k + z * d + h * u * p;
                d = 0 < n && n < Number.POSITIVE_INFINITY ? n / (k + f + n) : 1;
                a = a * d * c + l;
                b = b * d * c + e;
                return {
                    x: m ? b : a,
                    y: m ? a : b,
                    z: k * c + f
                }
            })
        };
        a.pointCameraDistance = function(a, q) {
            var p = q.options.chart.options3d,
                k = q.plotWidth / 2;
            q = q.plotHeight / 2;
            p = d(p.depth, 1) * d(p.viewDistance, 0) + p.depth;
            return Math.sqrt(Math.pow(k - a.plotX, 2) + Math.pow(q - a.plotY, 2) + Math.pow(p - a.plotZ, 2))
        }
    })(t);
    (function(a) {
        function r(b) {
            var c = 0,
                g, D;
            for (g = 0; g < b.length; g++) D = (g + 1) % b.length, c += b[g].x * b[D].y -
                b[D].x * b[g].y;
            return c / 2
        }

        function d(b) {
            var c = 0,
                g;
            for (g = 0; g < b.length; g++) c += b[g].z;
            return b.length ? c / b.length : 0
        }

        function p(b, c, g, D, a, h, F, f) {
            var e = [],
                k = h - a;
            return h > a && h - a > Math.PI / 2 + .0001 ? (e = e.concat(p(b, c, g, D, a, a + Math.PI / 2, F, f)), e = e.concat(p(b, c, g, D, a + Math.PI / 2, h, F, f))) : h < a && a - h > Math.PI / 2 + .0001 ? (e = e.concat(p(b, c, g, D, a, a - Math.PI / 2, F, f)), e = e.concat(p(b, c, g, D, a - Math.PI / 2, h, F, f))) : ["C", b + g * Math.cos(a) - g * v * k * Math.sin(a) + F, c + D * Math.sin(a) + D * v * k * Math.cos(a) + f, b + g * Math.cos(h) + g * v * k * Math.sin(h) + F, c + D * Math.sin(h) -
                D * v * k * Math.cos(h) + f, b + g * Math.cos(h) + F, c + D * Math.sin(h) + f
            ]
        }
        var q = Math.cos,
            y = Math.PI,
            k = Math.sin,
            m = a.animObject,
            l = a.charts,
            e = a.color,
            f = a.defined,
            n = a.deg2rad,
            c = a.each,
            b = a.extend,
            h = a.inArray,
            u = a.map,
            z = a.merge,
            A = a.perspective,
            t = a.pick,
            G = a.SVGElement,
            C = a.SVGRenderer,
            w = a.wrap,
            v = 4 * (Math.sqrt(2) - 1) / 3 / (y / 2);
        w(C.prototype, "init", function(b) {
            b.apply(this, [].slice.call(arguments, 1));
            c([{
                name: "darker",
                slope: .6
            }, {
                name: "brighter",
                slope: 1.4
            }], function(b) {
                this.definition({
                    tagName: "filter",
                    id: "highcharts-" + b.name,
                    children: [{
                        tagName: "feComponentTransfer",
                        children: [{
                            tagName: "feFuncR",
                            type: "linear",
                            slope: b.slope
                        }, {
                            tagName: "feFuncG",
                            type: "linear",
                            slope: b.slope
                        }, {
                            tagName: "feFuncB",
                            type: "linear",
                            slope: b.slope
                        }]
                    }]
                })
            }, this)
        });
        C.prototype.toLinePath = function(b, a) {
            var g = [];
            c(b, function(b) {
                g.push("L", b.x, b.y)
            });
            b.length && (g[0] = "M", a && g.push("Z"));
            return g
        };
        C.prototype.cuboid = function(b) {
            var c = this.g(),
                g = c.destroy;
            b = this.cuboidPath(b);
            c.front = this.path(b[0]).attr({
                "class": "highcharts-3d-front",
                zIndex: b[3]
            }).add(c);
            c.top = this.path(b[1]).attr({
                "class": "highcharts-3d-top",
                zIndex: b[4]
            }).add(c);
            c.side = this.path(b[2]).attr({
                "class": "highcharts-3d-side",
                zIndex: b[5]
            }).add(c);
            c.fillSetter = function(b) {
                this.front.attr({
                    fill: b
                });
                this.top.attr({
                    fill: e(b).brighten(.1).get()
                });
                this.side.attr({
                    fill: e(b).brighten(-.1).get()
                });
                this.color = b;
                return this
            };
            c.opacitySetter = function(b) {
                this.front.attr({
                    opacity: b
                });
                this.top.attr({
                    opacity: b
                });
                this.side.attr({
                    opacity: b
                });
                return this
            };
            c.attr = function(b) {
                if (b.shapeArgs || f(b.x)) b = this.renderer.cuboidPath(b.shapeArgs || b), this.front.attr({
                    d: b[0],
                    zIndex: b[3]
                }), this.top.attr({
                    d: b[1],
                    zIndex: b[4]
                }), this.side.attr({
                    d: b[2],
                    zIndex: b[5]
                });
                else return a.SVGElement.prototype.attr.call(this, b);
                return this
            };
            c.animate = function(b, c, g) {
                f(b.x) && f(b.y) ? (b = this.renderer.cuboidPath(b), this.front.attr({
                    zIndex: b[3]
                }).animate({
                    d: b[0]
                }, c, g), this.top.attr({
                    zIndex: b[4]
                }).animate({
                    d: b[1]
                }, c, g), this.side.attr({
                    zIndex: b[5]
                }).animate({
                    d: b[2]
                }, c, g), this.attr({
                    zIndex: -b[6]
                })) : b.opacity ? (this.front.animate(b, c, g), this.top.animate(b, c, g), this.side.animate(b, c, g)) : G.prototype.animate.call(this,
                    b, c, g);
                return this
            };
            c.destroy = function() {
                this.front.destroy();
                this.top.destroy();
                this.side.destroy();
                return g.call(this)
            };
            c.attr({
                zIndex: -b[6]
            });
            return c
        };
        C.prototype.cuboidPath = function(b) {
            function c(b) {
                return n[b]
            }
            var g = b.x,
                a = b.y,
                h = b.z,
                f = b.height,
                e = b.width,
                k = b.depth,
                n = [{
                    x: g,
                    y: a,
                    z: h
                }, {
                    x: g + e,
                    y: a,
                    z: h
                }, {
                    x: g + e,
                    y: a + f,
                    z: h
                }, {
                    x: g,
                    y: a + f,
                    z: h
                }, {
                    x: g,
                    y: a + f,
                    z: h + k
                }, {
                    x: g + e,
                    y: a + f,
                    z: h + k
                }, {
                    x: g + e,
                    y: a,
                    z: h + k
                }, {
                    x: g,
                    y: a,
                    z: h + k
                }],
                n = A(n, l[this.chartIndex], b.insidePlotArea),
                h = function(b, a) {
                    var g = [];
                    b = u(b, c);
                    a = u(a, c);
                    0 > r(b) ?
                        g = b : 0 > r(a) && (g = a);
                    return g
                };
            b = h([3, 2, 1, 0], [7, 6, 5, 4]);
            g = [4, 5, 2, 3];
            a = h([1, 6, 7, 0], g);
            h = h([1, 2, 5, 6], [0, 7, 4, 3]);
            return [this.toLinePath(b, !0), this.toLinePath(a, !0), this.toLinePath(h, !0), d(b), d(a), d(h), 9E9 * d(u(g, c))]
        };
        a.SVGRenderer.prototype.arc3d = function(a) {
            function f(b) {
                var c = !1,
                    a = {},
                    g;
                for (g in b) - 1 !== h(g, l) && (a[g] = b[g], delete b[g], c = !0);
                return c ? a : !1
            }
            var g = this.g(),
                k = g.renderer,
                l = "x y r innerR start end".split(" ");
            a = z(a);
            a.alpha *= n;
            a.beta *= n;
            g.top = k.path();
            g.side1 = k.path();
            g.side2 = k.path();
            g.inn = k.path();
            g.out = k.path();
            g.onAdd = function() {
                var b = g.parentGroup,
                    a = g.attr("class");
                g.top.add(g);
                c(["out", "inn", "side1", "side2"], function(c) {
                    g[c].addClass(a + " highcharts-3d-side").add(b)
                })
            };
            g.setPaths = function(b) {
                var c = g.renderer.arc3dPath(b),
                    a = 100 * c.zTop;
                g.attribs = b;
                g.top.attr({
                    d: c.top,
                    zIndex: c.zTop
                });
                g.inn.attr({
                    d: c.inn,
                    zIndex: c.zInn
                });
                g.out.attr({
                    d: c.out,
                    zIndex: c.zOut
                });
                g.side1.attr({
                    d: c.side1,
                    zIndex: c.zSide1
                });
                g.side2.attr({
                    d: c.side2,
                    zIndex: c.zSide2
                });
                g.zIndex = a;
                g.attr({
                    zIndex: a
                });
                b.center && (g.top.setRadialReference(b.center),
                    delete b.center)
            };
            g.setPaths(a);
            g.fillSetter = function(b) {
                var c = e(b).brighten(-.1).get();
                this.fill = b;
                this.side1.attr({
                    fill: c
                });
                this.side2.attr({
                    fill: c
                });
                this.inn.attr({
                    fill: c
                });
                this.out.attr({
                    fill: c
                });
                this.top.attr({
                    fill: b
                });
                return this
            };
            c(["opacity", "translateX", "translateY", "visibility"], function(b) {
                g[b + "Setter"] = function(b, a) {
                    g[a] = b;
                    c(["out", "inn", "side1", "side2", "top"], function(c) {
                        g[c].attr(a, b)
                    })
                }
            });
            w(g, "attr", function(c, a) {
                var h;
                "object" === typeof a && (h = f(a)) && (b(g.attribs, h), g.setPaths(g.attribs));
                return c.apply(this, [].slice.call(arguments, 1))
            });
            w(g, "animate", function(b, c, a, g) {
                var h, k = this.attribs,
                    e;
                delete c.center;
                delete c.z;
                delete c.depth;
                delete c.alpha;
                delete c.beta;
                e = m(t(a, this.renderer.globalAnimation));
                e.duration && (c = z(c), h = f(c), c.dummy = 1, h && (e.step = function(b, c) {
                    function a(b) {
                        return k[b] + (t(h[b], k[b]) - k[b]) * c.pos
                    }
                    "dummy" === c.prop && c.elem.setPaths(z(k, {
                        x: a("x"),
                        y: a("y"),
                        r: a("r"),
                        innerR: a("innerR"),
                        start: a("start"),
                        end: a("end")
                    }))
                }), a = e);
                return b.call(this, c, a, g)
            });
            g.destroy = function() {
                this.top.destroy();
                this.out.destroy();
                this.inn.destroy();
                this.side1.destroy();
                this.side2.destroy();
                G.prototype.destroy.call(this)
            };
            g.hide = function() {
                this.top.hide();
                this.out.hide();
                this.inn.hide();
                this.side1.hide();
                this.side2.hide()
            };
            g.show = function() {
                this.top.show();
                this.out.show();
                this.inn.show();
                this.side1.show();
                this.side2.show()
            };
            return g
        };
        C.prototype.arc3dPath = function(b) {
            function c(b) {
                b %= 2 * Math.PI;
                b > Math.PI && (b = 2 * Math.PI - b);
                return b
            }
            var a = b.x,
                h = b.y,
                f = b.start,
                e = b.end - .00001,
                n = b.r,
                l = b.innerR,
                m = b.depth,
                d = b.alpha,
                u = b.beta,
                z = Math.cos(f),
                r = Math.sin(f);
            b = Math.cos(e);
            var A = Math.sin(e),
                x = n * Math.cos(u),
                n = n * Math.cos(d),
                v = l * Math.cos(u),
                w = l * Math.cos(d),
                l = m * Math.sin(u),
                B = m * Math.sin(d),
                m = ["M", a + x * z, h + n * r],
                m = m.concat(p(a, h, x, n, f, e, 0, 0)),
                m = m.concat(["L", a + v * b, h + w * A]),
                m = m.concat(p(a, h, v, w, e, f, 0, 0)),
                m = m.concat(["Z"]),
                C = 0 < u ? Math.PI / 2 : 0,
                u = 0 < d ? 0 : Math.PI / 2,
                C = f > -C ? f : e > -C ? -C : f,
                E = e < y - u ? e : f < y - u ? y - u : e,
                t = 2 * y - u,
                d = ["M", a + x * q(C), h + n * k(C)],
                d = d.concat(p(a, h, x, n, C, E, 0, 0));
            e > t && f < t ? (d = d.concat(["L", a + x * q(E) + l, h + n * k(E) + B]), d = d.concat(p(a,
                h, x, n, E, t, l, B)), d = d.concat(["L", a + x * q(t), h + n * k(t)]), d = d.concat(p(a, h, x, n, t, e, 0, 0)), d = d.concat(["L", a + x * q(e) + l, h + n * k(e) + B]), d = d.concat(p(a, h, x, n, e, t, l, B)), d = d.concat(["L", a + x * q(t), h + n * k(t)]), d = d.concat(p(a, h, x, n, t, E, 0, 0))) : e > y - u && f < y - u && (d = d.concat(["L", a + x * Math.cos(E) + l, h + n * Math.sin(E) + B]), d = d.concat(p(a, h, x, n, E, e, l, B)), d = d.concat(["L", a + x * Math.cos(e), h + n * Math.sin(e)]), d = d.concat(p(a, h, x, n, e, E, 0, 0)));
            d = d.concat(["L", a + x * Math.cos(E) + l, h + n * Math.sin(E) + B]);
            d = d.concat(p(a, h, x, n, E, C, l, B));
            d = d.concat(["Z"]);
            u = ["M", a + v * z, h + w * r];
            u = u.concat(p(a, h, v, w, f, e, 0, 0));
            u = u.concat(["L", a + v * Math.cos(e) + l, h + w * Math.sin(e) + B]);
            u = u.concat(p(a, h, v, w, e, f, l, B));
            u = u.concat(["Z"]);
            z = ["M", a + x * z, h + n * r, "L", a + x * z + l, h + n * r + B, "L", a + v * z + l, h + w * r + B, "L", a + v * z, h + w * r, "Z"];
            a = ["M", a + x * b, h + n * A, "L", a + x * b + l, h + n * A + B, "L", a + v * b + l, h + w * A + B, "L", a + v * b, h + w * A, "Z"];
            A = Math.atan2(B, -l);
            h = Math.abs(e + A);
            b = Math.abs(f + A);
            f = Math.abs((f + e) / 2 + A);
            h = c(h);
            b = c(b);
            f = c(f);
            f *= 1E5;
            e = 1E5 * b;
            h *= 1E5;
            return {
                top: m,
                zTop: 1E5 * Math.PI + 1,
                out: d,
                zOut: Math.max(f, e, h),
                inn: u,
                zInn: Math.max(f,
                    e, h),
                side1: z,
                zSide1: .99 * h,
                side2: a,
                zSide2: .99 * e
            }
        }
    })(t);
    (function(a) {
        function r(a, f) {
            var e = a.plotLeft,
                c = a.plotWidth + e,
                b = a.plotTop,
                h = a.plotHeight + b,
                k = e + a.plotWidth / 2,
                d = b + a.plotHeight / 2,
                l = Number.MAX_VALUE,
                m = -Number.MAX_VALUE,
                q = Number.MAX_VALUE,
                r = -Number.MAX_VALUE,
                w, v = 1;
            w = [{
                x: e,
                y: b,
                z: 0
            }, {
                x: e,
                y: b,
                z: f
            }];
            p([0, 1], function(b) {
                w.push({
                    x: c,
                    y: w[b].y,
                    z: w[b].z
                })
            });
            p([0, 1, 2, 3], function(b) {
                w.push({
                    x: w[b].x,
                    y: h,
                    z: w[b].z
                })
            });
            w = y(w, a, !1);
            p(w, function(b) {
                l = Math.min(l, b.x);
                m = Math.max(m, b.x);
                q = Math.min(q, b.y);
                r = Math.max(r,
                    b.y)
            });
            e > l && (v = Math.min(v, 1 - Math.abs((e + k) / (l + k)) % 1));
            c < m && (v = Math.min(v, (c - k) / (m - k)));
            b > q && (v = 0 > q ? Math.min(v, (b + d) / (-q + b + d)) : Math.min(v, 1 - (b + d) / (q + d) % 1));
            h < r && (v = Math.min(v, Math.abs((h - d) / (r - d))));
            return v
        }
        var d = a.Chart,
            p = a.each,
            q = a.merge,
            y = a.perspective,
            k = a.pick,
            m = a.wrap;
        d.prototype.is3d = function() {
            return this.options.chart.options3d && this.options.chart.options3d.enabled
        };
        d.prototype.propsRequireDirtyBox.push("chart.options3d");
        d.prototype.propsRequireUpdateSeries.push("chart.options3d");
        a.wrap(a.Chart.prototype,
            "isInsidePlot",
            function(a) {
                return this.is3d() || a.apply(this, [].slice.call(arguments, 1))
            });
        var l = a.getOptions();
        q(!0, l, {
            chart: {
                options3d: {
                    enabled: !1,
                    alpha: 0,
                    beta: 0,
                    depth: 100,
                    fitToPlot: !0,
                    viewDistance: 25,
                    frame: {
                        bottom: {
                            size: 1
                        },
                        side: {
                            size: 1
                        },
                        back: {
                            size: 1
                        }
                    }
                }
            }
        });
        m(d.prototype, "getContainer", function(a) {
            a.apply(this, [].slice.call(arguments, 1));
            this.renderer.definition({
                tagName: "style",
                textContent: ".highcharts-3d-top{filter: url(#highcharts-brighter)}\n.highcharts-3d-side{filter: url(#highcharts-darker)}\n"
            })
        });
        m(d.prototype, "setClassName", function(a) {
            a.apply(this, [].slice.call(arguments, 1));
            this.is3d() && (this.container.className += " highcharts-3d-chart")
        });
        a.wrap(a.Chart.prototype, "setChartSize", function(a) {
            var f = this.options.chart.options3d;
            a.apply(this, [].slice.call(arguments, 1));
            if (this.is3d()) {
                var e = this.inverted,
                    c = this.clipBox,
                    b = this.margin;
                c[e ? "y" : "x"] = -(b[3] || 0);
                c[e ? "x" : "y"] = -(b[0] || 0);
                c[e ? "height" : "width"] = this.chartWidth + (b[3] || 0) + (b[1] || 0);
                c[e ? "width" : "height"] = this.chartHeight + (b[0] || 0) + (b[2] ||
                    0);
                this.scale3d = 1;
                !0 === f.fitToPlot && (this.scale3d = r(this, f.depth))
            }
        });
        m(d.prototype, "redraw", function(a) {
            this.is3d() && (this.isDirtyBox = !0);
            a.apply(this, [].slice.call(arguments, 1))
        });
        m(d.prototype, "renderSeries", function(a) {
            var f = this.series.length;
            if (this.is3d())
                for (; f--;) a = this.series[f], a.translate(), a.render();
            else a.call(this)
        });
        d.prototype.retrieveStacks = function(a) {
            var f = this.series,
                e = {},
                c, b = 1;
            p(this.series, function(h) {
                c = k(h.options.stack, a ? 0 : f.length - 1 - h.index);
                e[c] ? e[c].series.push(h) : (e[c] = {
                    series: [h],
                    position: b
                }, b++)
            });
            e.totalStacks = b + 1;
            return e
        }
    })(t);
    (function(a) {
        var r, d = a.Axis,
            p = a.Chart,
            q = a.each,
            y = a.extend,
            k = a.merge,
            m = a.perspective,
            l = a.pick,
            e = a.splat,
            f = a.Tick,
            n = a.wrap;
        n(d.prototype, "setOptions", function(a, b) {
            a.call(this, b);
            this.chart.is3d() && (a = this.options, a.tickWidth = l(a.tickWidth, 0), a.gridLineWidth = l(a.gridLineWidth, 1))
        });
        n(d.prototype, "render", function(a) {
            a.apply(this, [].slice.call(arguments, 1));
            if (this.chart.is3d()) {
                var b = this.chart,
                    c = b.renderer,
                    f = b.options.chart.options3d,
                    e = f.frame,
                    d = e.bottom,
                    k = e.back,
                    e = e.side,
                    l = f.depth,
                    n = this.height,
                    m = this.width,
                    p = this.left,
                    q = this.top;
                this.isZAxis || (this.horiz ? (d = {
                    x: p,
                    y: q + (b.xAxis[0].opposite ? -d.size : n),
                    z: 0,
                    width: m,
                    height: d.size,
                    depth: l,
                    insidePlotArea: !1
                }, this.bottomFrame ? this.bottomFrame.animate(d) : this.bottomFrame = c.cuboid(d).attr({
                    "class": "highcharts-3d-frame highcharts-3d-frame-bottom",
                    zIndex: b.yAxis[0].reversed && 0 < f.alpha ? 4 : -1
                }).add()) : (f = {
                    x: p + (b.yAxis[0].opposite ? 0 : -e.size),
                    y: q + (b.xAxis[0].opposite ? -d.size : 0),
                    z: l,
                    width: m + e.size,
                    height: n + d.size,
                    depth: k.size,
                    insidePlotArea: !1
                }, this.backFrame ? this.backFrame.animate(f) : this.backFrame = c.cuboid(f).attr({
                    "class": "highcharts-3d-frame highcharts-3d-frame-back",
                    zIndex: -3
                }).add(), b = {
                    x: p + (b.yAxis[0].opposite ? m : -e.size),
                    y: q + (b.xAxis[0].opposite ? -d.size : 0),
                    z: 0,
                    width: e.size,
                    height: n + d.size,
                    depth: l,
                    insidePlotArea: !1
                }, this.sideFrame ? this.sideFrame.animate(b) : this.sideFrame = c.cuboid(b).attr({
                    "class": "highcharts-3d-frame highcharts-3d-frame-side",
                    zIndex: -2
                }).add()))
            }
        });
        n(d.prototype, "getPlotLinePath",
            function(a) {
                var b = a.apply(this, [].slice.call(arguments, 1));
                if (!this.chart.is3d() || null === b) return b;
                var c = this.chart,
                    e = c.options.chart.options3d,
                    c = this.isZAxis ? c.plotWidth : e.depth,
                    e = this.opposite;
                this.horiz && (e = !e);
                b = [this.swapZ({
                    x: b[1],
                    y: b[2],
                    z: e ? c : 0
                }), this.swapZ({
                    x: b[1],
                    y: b[2],
                    z: c
                }), this.swapZ({
                    x: b[4],
                    y: b[5],
                    z: c
                }), this.swapZ({
                    x: b[4],
                    y: b[5],
                    z: e ? 0 : c
                })];
                b = m(b, this.chart, !1);
                return b = this.chart.renderer.toLinePath(b, !1)
            });
        n(d.prototype, "getLinePath", function(a) {
            return this.chart.is3d() ? [] : a.apply(this, [].slice.call(arguments, 1))
        });
        n(d.prototype, "getPlotBandPath", function(a) {
            if (!this.chart.is3d()) return a.apply(this, [].slice.call(arguments, 1));
            var b = arguments,
                c = b[1],
                b = this.getPlotLinePath(b[2]);
            (c = this.getPlotLinePath(c)) && b ? c.push("L", b[10], b[11], "L", b[7], b[8], "L", b[4], b[5], "L", b[1], b[2]) : c = null;
            return c
        });
        n(f.prototype, "getMarkPath", function(a) {
            var b = a.apply(this, [].slice.call(arguments, 1));
            if (!this.axis.chart.is3d()) return b;
            b = [this.axis.swapZ({
                x: b[1],
                y: b[2],
                z: 0
            }), this.axis.swapZ({
                x: b[4],
                y: b[5],
                z: 0
            })];
            b = m(b, this.axis.chart, !1);
            return b = ["M", b[0].x, b[0].y, "L", b[1].x, b[1].y]
        });
        n(f.prototype, "getLabelPosition", function(a) {
            var b = a.apply(this, [].slice.call(arguments, 1));
            this.axis.chart.is3d() && (b = m([this.axis.swapZ({
                x: b.x,
                y: b.y,
                z: 0
            })], this.axis.chart, !1)[0]);
            return b
        });
        a.wrap(d.prototype, "getTitlePosition", function(a) {
            var b = this.chart.is3d(),
                c, e;
            b && (e = this.axisTitleMargin, this.axisTitleMargin = 0);
            c = a.apply(this, [].slice.call(arguments, 1));
            b && (c = m([this.swapZ({
                    x: c.x,
                    y: c.y,
                    z: 0
                })], this.chart, !1)[0],
                c[this.horiz ? "y" : "x"] += (this.horiz ? 1 : -1) * (this.opposite ? -1 : 1) * e, this.axisTitleMargin = e);
            return c
        });
        n(d.prototype, "drawCrosshair", function(a) {
            var b = arguments;
            this.chart.is3d() && b[2] && (b[2] = {
                plotX: b[2].plotXold || b[2].plotX,
                plotY: b[2].plotYold || b[2].plotY
            });
            a.apply(this, [].slice.call(b, 1))
        });
        n(d.prototype, "destroy", function(a) {
            q(["backFrame", "bottomFrame", "sideFrame"], function(b) {
                this[b] && (this[b] = this[b].destroy())
            }, this);
            a.apply(this, [].slice.call(arguments, 1))
        });
        d.prototype.swapZ = function(a, b) {
            if (this.isZAxis) {
                b =
                    b ? 0 : this.chart.plotLeft;
                var c = this.chart;
                return {
                    x: b + (c.yAxis[0].opposite ? a.z : c.xAxis[0].width - a.z),
                    y: a.y,
                    z: a.x - b
                }
            }
            return a
        };
        r = a.ZAxis = function() {
            this.isZAxis = !0;
            this.init.apply(this, arguments)
        };
        y(r.prototype, d.prototype);
        y(r.prototype, {
            setOptions: function(a) {
                a = k({
                    offset: 0,
                    lineWidth: 0
                }, a);
                d.prototype.setOptions.call(this, a);
                this.coll = "zAxis"
            },
            setAxisSize: function() {
                d.prototype.setAxisSize.call(this);
                this.width = this.len = this.chart.options.chart.options3d.depth;
                this.right = this.chart.chartWidth - this.width -
                    this.left
            },
            getSeriesExtremes: function() {
                var a = this,
                    b = a.chart;
                a.hasVisibleSeries = !1;
                a.dataMin = a.dataMax = a.ignoreMinPadding = a.ignoreMaxPadding = null;
                a.buildStacks && a.buildStacks();
                q(a.series, function(c) {
                    if (c.visible || !b.options.chart.ignoreHiddenSeries) a.hasVisibleSeries = !0, c = c.zData, c.length && (a.dataMin = Math.min(l(a.dataMin, c[0]), Math.min.apply(null, c)), a.dataMax = Math.max(l(a.dataMax, c[0]), Math.max.apply(null, c)))
                })
            }
        });
        n(p.prototype, "getAxes", function(a) {
            var b = this,
                c = this.options,
                c = c.zAxis = e(c.zAxis || {});
            a.call(this);
            b.is3d() && (this.zAxis = [], q(c, function(a, c) {
                a.index = c;
                a.isX = !0;
                (new r(b, a)).setScale()
            }))
        })
    })(t);
    (function(a) {
        function r(a) {
            if (this.chart.is3d()) {
                var e = this.chart.options.plotOptions.column.grouping;
                void 0 === e || e || void 0 === this.group.zIndex || this.zIndexSet || (this.group.attr({
                    zIndex: 10 * this.group.zIndex
                }), this.zIndexSet = !0)
            }
            a.apply(this, [].slice.call(arguments, 1))
        }
        var d = a.each,
            p = a.perspective,
            q = a.pick,
            y = a.Series,
            k = a.seriesTypes,
            m = a.svg;
        a = a.wrap;
        a(k.column.prototype, "translate", function(a) {
            a.apply(this, [].slice.call(arguments, 1));
            if (this.chart.is3d()) {
                var e = this.chart,
                    f = this.options,
                    k = f.depth || 25,
                    c = (f.stacking ? f.stack || 0 : this._i) * (k + (f.groupZPadding || 1));
                !1 !== f.grouping && (c = 0);
                c += f.groupZPadding || 1;
                d(this.data, function(b) {
                    if (null !== b.y) {
                        var a = b.shapeArgs,
                            f = b.tooltipPos;
                        b.shapeType = "cuboid";
                        a.z = c;
                        a.depth = k;
                        a.insidePlotArea = !0;
                        f = p([{
                            x: f[0],
                            y: f[1],
                            z: c
                        }], e, !0)[0];
                        b.tooltipPos = [f.x, f.y]
                    }
                });
                this.z = c
            }
        });
        a(k.column.prototype, "animate", function(a) {
            if (this.chart.is3d()) {
                var e = arguments[1],
                    f = this.yAxis,
                    k =
                    this,
                    c = this.yAxis.reversed;
                m && (e ? d(k.data, function(b) {
                    null !== b.y && (b.height = b.shapeArgs.height, b.shapey = b.shapeArgs.y, b.shapeArgs.height = 1, c || (b.shapeArgs.y = b.stackY ? b.plotY + f.translate(b.stackY) : b.plotY + (b.negative ? -b.height : b.height)))
                }) : (d(k.data, function(b) {
                    null !== b.y && (b.shapeArgs.height = b.height, b.shapeArgs.y = b.shapey, b.graphic && b.graphic.animate(b.shapeArgs, k.options.animation))
                }), this.drawDataLabels(), k.animate = null))
            } else a.apply(this, [].slice.call(arguments, 1))
        });
        a(k.column.prototype, "init",
            function(a) {
                a.apply(this, [].slice.call(arguments, 1));
                if (this.chart.is3d()) {
                    var e = this.options,
                        f = e.grouping,
                        d = e.stacking,
                        c = q(this.yAxis.options.reversedStacks, !0),
                        b = 0;
                    if (void 0 === f || f) {
                        f = this.chart.retrieveStacks(d);
                        b = e.stack || 0;
                        for (d = 0; d < f[b].series.length && f[b].series[d] !== this; d++);
                        b = 10 * (f.totalStacks - f[b].position) + (c ? d : -d);
                        this.xAxis.reversed || (b = 10 * f.totalStacks - b)
                    }
                    e.zIndex = b
                }
            });
        a(y.prototype, "alignDataLabel", function(a) {
            if (this.chart.is3d() && ("column" === this.type || "columnrange" === this.type)) {
                var e =
                    arguments[4],
                    f = {
                        x: e.x,
                        y: e.y,
                        z: this.z
                    },
                    f = p([f], this.chart, !0)[0];
                e.x = f.x;
                e.y = f.y
            }
            a.apply(this, [].slice.call(arguments, 1))
        });
        k.columnrange && a(k.columnrange.prototype, "drawPoints", r);
        a(k.column.prototype, "drawPoints", r)
    })(t);
    (function(a) {
        var r = a.deg2rad,
            d = a.each,
            p = a.seriesTypes,
            q = a.svg;
        a = a.wrap;
        a(p.pie.prototype, "translate", function(a) {
            a.apply(this, [].slice.call(arguments, 1));
            if (this.chart.is3d()) {
                var k = this,
                    m = k.options,
                    l = m.depth || 0,
                    e = k.chart.options.chart.options3d,
                    f = e.alpha,
                    n = e.beta,
                    c = m.stacking ? (m.stack ||
                        0) * l : k._i * l,
                    c = c + l / 2;
                !1 !== m.grouping && (c = 0);
                d(k.data, function(b) {
                    var a = b.shapeArgs;
                    b.shapeType = "arc3d";
                    a.z = c;
                    a.depth = .75 * l;
                    a.alpha = f;
                    a.beta = n;
                    a.center = k.center;
                    a = (a.end + a.start) / 2;
                    b.slicedTranslation = {
                        translateX: Math.round(Math.cos(a) * m.slicedOffset * Math.cos(f * r)),
                        translateY: Math.round(Math.sin(a) * m.slicedOffset * Math.cos(f * r))
                    }
                })
            }
        });
        a(p.pie.prototype.pointClass.prototype, "haloPath", function(a) {
            var d = arguments;
            return this.series.chart.is3d() ? [] : a.call(this, d[1])
        });
        a(p.pie.prototype, "drawPoints", function(a) {
            a.apply(this, [].slice.call(arguments, 1));
            this.chart.is3d() && d(this.points, function(a) {
                var d = a.graphic;
                if (d) d[a.y && a.visible ? "show" : "hide"]()
            })
        });
        a(p.pie.prototype, "drawDataLabels", function(a) {
            if (this.chart.is3d()) {
                var k = this.chart.options.chart.options3d;
                d(this.data, function(a) {
                    var l = a.shapeArgs,
                        e = l.r,
                        f = (l.start + l.end) / 2,
                        m = a.labelPos,
                        c = -e * (1 - Math.cos((l.alpha || k.alpha) * r)) * Math.sin(f),
                        b = e * (Math.cos((l.beta || k.beta) * r) - 1) * Math.cos(f);
                    d([0, 2, 4], function(a) {
                        m[a] += b;
                        m[a + 1] += c
                    })
                })
            }
            a.apply(this, [].slice.call(arguments,
                1))
        });
        a(p.pie.prototype, "addPoint", function(a) {
            a.apply(this, [].slice.call(arguments, 1));
            this.chart.is3d() && this.update(this.userOptions, !0)
        });
        a(p.pie.prototype, "animate", function(a) {
            if (this.chart.is3d()) {
                var d = arguments[1],
                    m = this.options.animation,
                    l = this.center,
                    e = this.group,
                    f = this.markerGroup;
                q && (!0 === m && (m = {}), d ? (e.oldtranslateX = e.translateX, e.oldtranslateY = e.translateY, d = {
                    translateX: l[0],
                    translateY: l[1],
                    scaleX: .001,
                    scaleY: .001
                }, e.attr(d), f && (f.attrSetters = e.attrSetters, f.attr(d))) : (d = {
                    translateX: e.oldtranslateX,
                    translateY: e.oldtranslateY,
                    scaleX: 1,
                    scaleY: 1
                }, e.animate(d, m), f && f.animate(d, m), this.animate = null))
            } else a.apply(this, [].slice.call(arguments, 1))
        })
    })(t);
    (function(a) {
        var r = a.perspective,
            d = a.pick,
            p = a.Point,
            q = a.seriesTypes,
            t = a.wrap;
        t(q.scatter.prototype, "translate", function(a) {
            a.apply(this, [].slice.call(arguments, 1));
            if (this.chart.is3d()) {
                var k = this.chart,
                    l = d(this.zAxis, k.options.zAxis[0]),
                    e = [],
                    f, n, c;
                for (c = 0; c < this.data.length; c++) f = this.data[c], n = l.isLog && l.val2lin ? l.val2lin(f.z) : f.z, f.plotZ = l.translate(n),
                    f.isInside = f.isInside ? n >= l.min && n <= l.max : !1, e.push({
                        x: f.plotX,
                        y: f.plotY,
                        z: f.plotZ
                    });
                k = r(e, k, !0);
                for (c = 0; c < this.data.length; c++) f = this.data[c], l = k[c], f.plotXold = f.plotX, f.plotYold = f.plotY, f.plotZold = f.plotZ, f.plotX = l.x, f.plotY = l.y, f.plotZ = l.z
            }
        });
        t(q.scatter.prototype, "init", function(a, d, l) {
            d.is3d() && (this.axisTypes = ["xAxis", "yAxis", "zAxis"], this.pointArrayMap = ["x", "y", "z"], this.parallelArrays = ["x", "y", "z"], this.directTouch = !0);
            a = a.apply(this, [d, l]);
            this.chart.is3d() && (this.tooltipOptions.pointFormat =
                this.userOptions.tooltip ? this.userOptions.tooltip.pointFormat || "x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3ez: \x3cb\x3e{point.z}\x3c/b\x3e\x3cbr/\x3e" : "x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3ez: \x3cb\x3e{point.z}\x3c/b\x3e\x3cbr/\x3e");
            return a
        });
        t(q.scatter.prototype, "pointAttribs", function(d, m) {
            var k = d.apply(this, [].slice.call(arguments, 1));
            this.chart.is3d() && m && (k.zIndex = a.pointCameraDistance(m, this.chart));
            return k
        });
        t(p.prototype, "applyOptions", function(a) {
            var d = a.apply(this, [].slice.call(arguments, 1));
            this.series.chart.is3d() && void 0 === d.z && (d.z = 0);
            return d
        })
    })(t)
});