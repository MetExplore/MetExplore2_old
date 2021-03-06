/*
 Highcharts JS v5.0.7 (2017-01-17)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(n) {
    "object" === typeof module && module.exports ? module.exports = n : n(Highcharts)
})(function(n) {
    (function(f) {
        var q = f.defined,
            k = f.isNumber,
            n = f.inArray,
            v = f.isArray,
            w = f.merge,
            B = f.Chart,
            x = f.extend,
            C = f.each,
            r, D;
        D = ["path", "rect", "circle"];
        r = {
            top: 0,
            left: 0,
            center: .5,
            middle: .5,
            bottom: 1,
            right: 1
        };
        var E = function() {
            this.init.apply(this, arguments)
        };
        E.prototype = {
            init: function(a, d) {
                var c = d.shape && d.shape.type;
                this.chart = a;
                var b;
                b = {
                    xAxis: 0,
                    yAxis: 0,
                    title: {
                        style: {},
                        text: "",
                        x: 0,
                        y: 0
                    },
                    shape: {
                        params: {
                            stroke: "#000000",
                            fill: "transparent",
                            strokeWidth: 2
                        }
                    }
                };
                a = {
                    circle: {
                        params: {
                            x: 0,
                            y: 0
                        }
                    }
                };
                a[c] && (b.shape = w(b.shape, a[c]));
                this.options = w({}, b, d)
            },
            render: function(a) {
                var d = this.chart,
                    c = this.chart.renderer,
                    b = this.group,
                    f = this.title,
                    e = this.shape,
                    h = this.options,
                    k = h.title,
                    p = h.shape;
                b || (b = this.group = c.g());
                !e && p && -1 !== n(p.type, D) && (e = this.shape = c[h.shape.type](p.params), e.add(b));
                !f && k && (f = this.title = c.label(k), f.add(b));
                b.add(d.annotations.group);
                this.linkObjects();
                !1 !== a && this.redraw()
            },
            redraw: function() {
                var a = this.options,
                    d = this.chart,
                    c = this.group,
                    b = this.title,
                    F = this.shape,
                    e = this.linkedObject,
                    h = d.xAxis[a.xAxis],
                    d = d.yAxis[a.yAxis],
                    y = a.width,
                    p = a.height,
                    z = r[a.anchorY],
                    A = r[a.anchorX],
                    t, l, g, u;
                e && (t = e instanceof f.Point ? "point" : e instanceof f.Series ? "series" : null, "point" === t ? (a.xValue = e.x, a.yValue = e.y, l = e.series) : "series" === t && (l = e), c.visibility !== l.group.visibility && c.attr({
                    visibility: l.group.visibility
                }));
                e = q(a.xValue) ? h.toPixels(a.xValue + h.minPointOffset) - h.minPixelPadding : a.x;
                l = q(a.yValue) ? d.toPixels(a.yValue) : a.y;
                if (k(e) &&
                    k(l)) {
                    b && (b.attr(a.title), b.css(a.title.style));
                    if (F) {
                        b = x({}, a.shape.params);
                        if ("values" === a.units) {
                            for (g in b) - 1 < n(g, ["width", "x"]) ? b[g] = h.translate(b[g]) : -1 < n(g, ["height", "y"]) && (b[g] = d.translate(b[g]));
                            b.width && (b.width -= h.toPixels(0) - h.left);
                            b.x && (b.x += h.minPixelPadding);
                            if ("path" === a.shape.type) {
                                g = b.d;
                                t = e;
                                for (var v = l, w = g.length, m = 0; m < w;) k(g[m]) && k(g[m + 1]) ? (g[m] = h.toPixels(g[m]) - t, g[m + 1] = d.toPixels(g[m + 1]) - v, m += 2) : m += 1
                            }
                        }
                        "circle" === a.shape.type && (b.x += b.r, b.y += b.r);
                        F.attr(b)
                    }
                    c.bBox = null;
                    k(y) ||
                        (u = c.getBBox(), y = u.width);
                    k(p) || (u || (u = c.getBBox()), p = u.height);
                    k(A) || (A = r.center);
                    k(z) || (z = r.center);
                    e -= y * A;
                    l -= p * z;
                    q(c.translateX) && q(c.translateY) ? c.animate({
                        translateX: e,
                        translateY: l
                    }) : c.translate(e, l)
                }
            },
            destroy: function() {
                var a = this,
                    d = this.chart.annotations.allItems,
                    c = d.indexOf(a); - 1 < c && d.splice(c, 1);
                C(["title", "shape", "group"], function(b) {
                    a[b] && (a[b].destroy(), a[b] = null)
                });
                a.group = a.title = a.shape = a.chart = a.options = null
            },
            update: function(a, d) {
                x(this.options, a);
                this.linkObjects();
                this.render(d)
            },
            linkObjects: function() {
                var a = this.chart,
                    d = this.linkedObject,
                    c = d && (d.id || d.options.id),
                    b = this.options.linkedTo;
                q(b) ? q(d) && b === c || (this.linkedObject = a.get(b)) : this.linkedObject = null
            }
        };
        x(B.prototype, {
            annotations: {
                add: function(a, d) {
                    var c = this.allItems,
                        b = this.chart,
                        f, e;
                    v(a) || (a = [a]);
                    for (e = a.length; e--;) f = new E(b, a[e]), c.push(f), f.render(d)
                },
                redraw: function() {
                    C(this.allItems, function(a) {
                        a.redraw()
                    })
                }
            }
        });
        B.prototype.callbacks.push(function(a) {
            var d = a.options.annotations,
                c;
            c = a.renderer.g("annotations");
            c.attr({
                zIndex: 7
            });
            c.add();
            a.annotations.allItems = [];
            a.annotations.chart = a;
            a.annotations.group = c;
            v(d) && 0 < d.length && a.annotations.add(a.options.annotations);
            f.addEvent(a, "redraw", function() {
                a.annotations.redraw()
            })
        })
    })(n)
});