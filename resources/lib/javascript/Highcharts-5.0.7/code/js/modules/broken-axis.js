/*
 Highcharts JS v5.0.7 (2017-01-17)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(h) {
    "object" === typeof module && module.exports ? module.exports = h : h(Highcharts)
})(function(h) {
    (function(e) {
        function h() {
            return Array.prototype.slice.call(arguments, 1)
        }

        function v(c) {
            c.apply(this);
            this.drawBreaks(this.xAxis, ["x"]);
            this.drawBreaks(this.yAxis, t(this.pointArrayMap, ["y"]))
        }
        var t = e.pick,
            q = e.wrap,
            u = e.each,
            y = e.extend,
            z = e.isArray,
            w = e.fireEvent,
            r = e.Axis,
            A = e.Series;
        y(r.prototype, {
            isInBreak: function(c, d) {
                var f = c.repeat || Infinity,
                    b = c.from,
                    a = c.to - c.from;
                d = d >= b ? (d - b) % f : f - (b - d) % f;
                return c.inclusive ?
                    d <= a : d < a && 0 !== d
            },
            isInAnyBreak: function(c, d) {
                var f = this.options.breaks,
                    b = f && f.length,
                    a, g, n;
                if (b) {
                    for (; b--;) this.isInBreak(f[b], c) && (a = !0, g || (g = t(f[b].showPoints, this.isXAxis ? !1 : !0)));
                    n = a && d ? a && !g : a
                }
                return n
            }
        });
        q(r.prototype, "setTickPositions", function(c) {
            c.apply(this, Array.prototype.slice.call(arguments, 1));
            if (this.options.breaks) {
                var d = this.tickPositions,
                    f = this.tickPositions.info,
                    b = [],
                    a;
                for (a = 0; a < d.length; a++) this.isInAnyBreak(d[a]) || b.push(d[a]);
                this.tickPositions = b;
                this.tickPositions.info = f
            }
        });
        q(r.prototype, "init", function(c, d, f) {
            var b = this;
            f.breaks && f.breaks.length && (f.ordinal = !1);
            c.call(this, d, f);
            c = this.options.breaks;
            b.isBroken = z(c) && !!c.length;
            b.isBroken && (b.val2lin = function(a) {
                    var g = a,
                        n, c;
                    for (c = 0; c < b.breakArray.length; c++)
                        if (n = b.breakArray[c], n.to <= a) g -= n.len;
                        else if (n.from >= a) break;
                    else if (b.isInBreak(n, a)) {
                        g -= a - n.from;
                        break
                    }
                    return g
                }, b.lin2val = function(a) {
                    var g, c;
                    for (c = 0; c < b.breakArray.length && !(g = b.breakArray[c], g.from >= a); c++) g.to < a ? a += g.len : b.isInBreak(g, a) && (a += g.len);
                    return a
                },
                b.setExtremes = function(a, b, c, f, d) {
                    for (; this.isInAnyBreak(a);) a -= this.closestPointRange;
                    for (; this.isInAnyBreak(b);) b -= this.closestPointRange;
                    r.prototype.setExtremes.call(this, a, b, c, f, d)
                }, b.setAxisTranslation = function(a) {
                    r.prototype.setAxisTranslation.call(this, a);
                    var c = b.options.breaks;
                    a = [];
                    var f = [],
                        d = 0,
                        m, k, p = b.userMin || b.min,
                        e = b.userMax || b.max,
                        l, h;
                    for (h in c) k = c[h], m = k.repeat || Infinity, b.isInBreak(k, p) && (p += k.to % m - p % m), b.isInBreak(k, e) && (e -= e % m - k.from % m);
                    for (h in c) {
                        k = c[h];
                        l = k.from;
                        for (m = k.repeat ||
                            Infinity; l - m > p;) l -= m;
                        for (; l < p;) l += m;
                        for (; l < e; l += m) a.push({
                            value: l,
                            move: "in"
                        }), a.push({
                            value: l + (k.to - k.from),
                            move: "out",
                            size: k.breakSize
                        })
                    }
                    a.sort(function(b, c) {
                        return b.value === c.value ? ("in" === b.move ? 0 : 1) - ("in" === c.move ? 0 : 1) : b.value - c.value
                    });
                    c = 0;
                    l = p;
                    for (h in a) k = a[h], c += "in" === k.move ? 1 : -1, 1 === c && "in" === k.move && (l = k.value), 0 === c && (f.push({
                        from: l,
                        to: k.value,
                        len: k.value - l - (k.size || 0)
                    }), d += k.value - l - (k.size || 0));
                    b.breakArray = f;
                    w(b, "afterBreaks");
                    b.transA *= (e - b.min) / (e - p - d);
                    b.min = p;
                    b.max = e
                })
        });
        q(A.prototype,
            "generatePoints",
            function(c) {
                c.apply(this, h(arguments));
                var d = this.xAxis,
                    f = this.yAxis,
                    b = this.points,
                    a, g = b.length,
                    e = this.options.connectNulls,
                    x;
                if (d && f && (d.options.breaks || f.options.breaks))
                    for (; g--;) a = b[g], x = null === a.y && !1 === e, x || !d.isInAnyBreak(a.x, !0) && !f.isInAnyBreak(a.y, !0) || (b.splice(g, 1), this.data[g] && this.data[g].destroyElements())
            });
        e.Series.prototype.drawBreaks = function(c, d) {
            var f = this,
                b = f.points,
                a, g, e, h;
            c && u(d, function(d) {
                a = c.breakArray || [];
                g = c.isXAxis ? c.min : t(f.options.threshold, c.min);
                u(b, function(b) {
                    h = t(b["stack" + d.toUpperCase()], b[d]);
                    u(a, function(a) {
                        e = !1;
                        if (g < a.from && h > a.to || g > a.from && h < a.from) e = "pointBreak";
                        else if (g < a.from && h > a.from && h < a.to || g > a.from && h > a.to && h < a.from) e = "pointInBreak";
                        e && w(c, e, {
                            point: b,
                            brk: a
                        })
                    })
                })
            })
        };
        q(e.seriesTypes.column.prototype, "drawPoints", v);
        q(e.Series.prototype, "drawPoints", v)
    })(h)
});