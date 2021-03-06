/*
 Highcharts JS v5.0.7 (2017-01-17)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(J, a) {
    "object" === typeof module && module.exports ? module.exports = J.document ? a(J) : a : J.Highcharts = a(J)
})("undefined" !== typeof window ? window : this, function(J) {
    J = function() {
        var a = window,
            B = a.document,
            x = a.navigator && a.navigator.userAgent || "",
            D = B && B.createElementNS && !!B.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
            F = /(edge|msie|trident)/i.test(x) && !window.opera,
            q = !D,
            c = /Firefox/.test(x),
            d = c && 4 > parseInt(x.split("Firefox/")[1], 10);
        return a.Highcharts ? a.Highcharts.error(16, !0) : {
            product: "Highcharts",
            version: "5.0.7",
            deg2rad: 2 * Math.PI / 360,
            doc: B,
            hasBidiBug: d,
            hasTouch: B && void 0 !== B.documentElement.ontouchstart,
            isMS: F,
            isWebKit: /AppleWebKit/.test(x),
            isFirefox: c,
            isTouchDevice: /(Mobile|Android|Windows Phone)/.test(x),
            SVG_NS: "http://www.w3.org/2000/svg",
            chartCount: 0,
            seriesTypes: {},
            symbolSizes: {},
            svg: D,
            vml: q,
            win: a,
            charts: [],
            marginNames: ["plotTop", "marginRight", "marginBottom", "plotLeft"],
            noop: function() {}
        }
    }();
    (function(a) {
        var B = [],
            x = a.charts,
            D = a.doc,
            F = a.win;
        a.error = function(q, c) {
            q = a.isNumber(q) ? "Highcharts error #" +
                q + ": www.highcharts.com/errors/" + q : q;
            if (c) throw Error(q);
            F.console && console.log(q)
        };
        a.Fx = function(a, c, d) {
            this.options = c;
            this.elem = a;
            this.prop = d
        };
        a.Fx.prototype = {
            dSetter: function() {
                var a = this.paths[0],
                    c = this.paths[1],
                    d = [],
                    m = this.now,
                    n = a.length,
                    k;
                if (1 === m) d = this.toD;
                else if (n === c.length && 1 > m)
                    for (; n--;) k = parseFloat(a[n]), d[n] = isNaN(k) ? a[n] : m * parseFloat(c[n] - k) + k;
                else d = c;
                this.elem.attr("d", d, null, !0)
            },
            update: function() {
                var a = this.elem,
                    c = this.prop,
                    d = this.now,
                    m = this.options.step;
                if (this[c + "Setter"]) this[c +
                    "Setter"]();
                else a.attr ? a.element && a.attr(c, d, null, !0) : a.style[c] = d + this.unit;
                m && m.call(a, d, this)
            },
            run: function(a, c, d) {
                var m = this,
                    q = function(a) {
                        return q.stopped ? !1 : m.step(a)
                    },
                    k;
                this.startTime = +new Date;
                this.start = a;
                this.end = c;
                this.unit = d;
                this.now = this.start;
                this.pos = 0;
                q.elem = this.elem;
                q.prop = this.prop;
                q() && 1 === B.push(q) && (q.timerId = setInterval(function() {
                    for (k = 0; k < B.length; k++) B[k]() || B.splice(k--, 1);
                    B.length || clearInterval(q.timerId)
                }, 13))
            },
            step: function(a) {
                var c = +new Date,
                    d, q = this.options;
                d = this.elem;
                var n = q.complete,
                    k = q.duration,
                    l = q.curAnim,
                    b;
                if (d.attr && !d.element) d = !1;
                else if (a || c >= k + this.startTime) {
                    this.now = this.end;
                    this.pos = 1;
                    this.update();
                    a = l[this.prop] = !0;
                    for (b in l) !0 !== l[b] && (a = !1);
                    a && n && n.call(d);
                    d = !1
                } else this.pos = q.easing((c - this.startTime) / k), this.now = this.start + (this.end - this.start) * this.pos, this.update(), d = !0;
                return d
            },
            initPath: function(q, c, d) {
                function m(a) {
                    var e, f;
                    for (h = a.length; h--;) e = "M" === a[h] || "L" === a[h], f = /[a-zA-Z]/.test(a[h + 3]), e && f && a.splice(h + 1, 0, a[h + 1], a[h + 2], a[h + 1], a[h +
                        2])
                }

                function n(a, b) {
                    for (; a.length < e;) {
                        a[0] = b[e - a.length];
                        var f = a.slice(0, t);
                        [].splice.apply(a, [0, 0].concat(f));
                        I && (f = a.slice(a.length - t), [].splice.apply(a, [a.length, 0].concat(f)), h--)
                    }
                    a[0] = "M"
                }

                function k(a, b) {
                    for (var f = (e - a.length) / t; 0 < f && f--;) p = a.slice().splice(a.length / v - t, t * v), p[0] = b[e - t - f * t], w && (p[t - 6] = p[t - 2], p[t - 5] = p[t - 1]), [].splice.apply(a, [a.length / v, 0].concat(p)), I && f--
                }
                c = c || "";
                var l, b = q.startX,
                    E = q.endX,
                    w = -1 < c.indexOf("C"),
                    t = w ? 7 : 3,
                    e, p, h;
                c = c.split(" ");
                d = d.slice();
                var I = q.isArea,
                    v = I ? 2 : 1,
                    C;
                w && (m(c), m(d));
                if (b && E) {
                    for (h = 0; h < b.length; h++)
                        if (b[h] === E[0]) {
                            l = h;
                            break
                        } else if (b[0] === E[E.length - b.length + h]) {
                        l = h;
                        C = !0;
                        break
                    }
                    void 0 === l && (c = [])
                }
                c.length && a.isNumber(l) && (e = d.length + l * v * t, C ? (n(c, d), k(d, c)) : (n(d, c), k(c, d)));
                return [c, d]
            }
        };
        a.extend = function(a, c) {
            var d;
            a || (a = {});
            for (d in c) a[d] = c[d];
            return a
        };
        a.merge = function() {
            var q, c = arguments,
                d, m = {},
                n = function(k, l) {
                    var b, c;
                    "object" !== typeof k && (k = {});
                    for (c in l) l.hasOwnProperty(c) && (b = l[c], a.isObject(b, !0) && "renderTo" !== c && "number" !== typeof b.nodeType ?
                        k[c] = n(k[c] || {}, b) : k[c] = l[c]);
                    return k
                };
            !0 === c[0] && (m = c[1], c = Array.prototype.slice.call(c, 2));
            d = c.length;
            for (q = 0; q < d; q++) m = n(m, c[q]);
            return m
        };
        a.pInt = function(a, c) {
            return parseInt(a, c || 10)
        };
        a.isString = function(a) {
            return "string" === typeof a
        };
        a.isArray = function(a) {
            a = Object.prototype.toString.call(a);
            return "[object Array]" === a || "[object Array Iterator]" === a
        };
        a.isObject = function(q, c) {
            return q && "object" === typeof q && (!c || !a.isArray(q))
        };
        a.isNumber = function(a) {
            return "number" === typeof a && !isNaN(a)
        };
        a.erase =
            function(a, c) {
                for (var d = a.length; d--;)
                    if (a[d] === c) {
                        a.splice(d, 1);
                        break
                    }
            };
        a.defined = function(a) {
            return void 0 !== a && null !== a
        };
        a.attr = function(q, c, d) {
            var m, n;
            if (a.isString(c)) a.defined(d) ? q.setAttribute(c, d) : q && q.getAttribute && (n = q.getAttribute(c));
            else if (a.defined(c) && a.isObject(c))
                for (m in c) q.setAttribute(m, c[m]);
            return n
        };
        a.splat = function(q) {
            return a.isArray(q) ? q : [q]
        };
        a.syncTimeout = function(a, c, d) {
            if (c) return setTimeout(a, c, d);
            a.call(0, d)
        };
        a.pick = function() {
            var a = arguments,
                c, d, m = a.length;
            for (c =
                0; c < m; c++)
                if (d = a[c], void 0 !== d && null !== d) return d
        };
        a.css = function(q, c) {
            a.isMS && !a.svg && c && void 0 !== c.opacity && (c.filter = "alpha(opacity\x3d" + 100 * c.opacity + ")");
            a.extend(q.style, c)
        };
        a.createElement = function(q, c, d, m, n) {
            q = D.createElement(q);
            var k = a.css;
            c && a.extend(q, c);
            n && k(q, {
                padding: 0,
                border: "none",
                margin: 0
            });
            d && k(q, d);
            m && m.appendChild(q);
            return q
        };
        a.extendClass = function(q, c) {
            var d = function() {};
            d.prototype = new q;
            a.extend(d.prototype, c);
            return d
        };
        a.pad = function(a, c, d) {
            return Array((c || 2) + 1 - String(a).length).join(d ||
                0) + a
        };
        a.relativeLength = function(a, c) {
            return /%$/.test(a) ? c * parseFloat(a) / 100 : parseFloat(a)
        };
        a.wrap = function(a, c, d) {
            var m = a[c];
            a[c] = function() {
                var a = Array.prototype.slice.call(arguments),
                    c = arguments,
                    l = this;
                l.proceed = function() {
                    m.apply(l, arguments.length ? arguments : c)
                };
                a.unshift(m);
                a = d.apply(this, a);
                l.proceed = null;
                return a
            }
        };
        a.getTZOffset = function(q) {
            var c = a.Date;
            return 6E4 * (c.hcGetTimezoneOffset && c.hcGetTimezoneOffset(q) || c.hcTimezoneOffset || 0)
        };
        a.dateFormat = function(q, c, d) {
            if (!a.defined(c) || isNaN(c)) return a.defaultOptions.lang.invalidDate ||
                "";
            q = a.pick(q, "%Y-%m-%d %H:%M:%S");
            var m = a.Date,
                n = new m(c - a.getTZOffset(c)),
                k, l = n[m.hcGetHours](),
                b = n[m.hcGetDay](),
                E = n[m.hcGetDate](),
                w = n[m.hcGetMonth](),
                t = n[m.hcGetFullYear](),
                e = a.defaultOptions.lang,
                p = e.weekdays,
                h = e.shortWeekdays,
                I = a.pad,
                m = a.extend({
                    a: h ? h[b] : p[b].substr(0, 3),
                    A: p[b],
                    d: I(E),
                    e: I(E, 2, " "),
                    w: b,
                    b: e.shortMonths[w],
                    B: e.months[w],
                    m: I(w + 1),
                    y: t.toString().substr(2, 2),
                    Y: t,
                    H: I(l),
                    k: l,
                    I: I(l % 12 || 12),
                    l: l % 12 || 12,
                    M: I(n[m.hcGetMinutes]()),
                    p: 12 > l ? "AM" : "PM",
                    P: 12 > l ? "am" : "pm",
                    S: I(n.getSeconds()),
                    L: I(Math.round(c %
                        1E3), 3)
                }, a.dateFormats);
            for (k in m)
                for (; - 1 !== q.indexOf("%" + k);) q = q.replace("%" + k, "function" === typeof m[k] ? m[k](c) : m[k]);
            return d ? q.substr(0, 1).toUpperCase() + q.substr(1) : q
        };
        a.formatSingle = function(q, c) {
            var d = /\.([0-9])/,
                m = a.defaultOptions.lang;
            /f$/.test(q) ? (d = (d = q.match(d)) ? d[1] : -1, null !== c && (c = a.numberFormat(c, d, m.decimalPoint, -1 < q.indexOf(",") ? m.thousandsSep : ""))) : c = a.dateFormat(q, c);
            return c
        };
        a.format = function(q, c) {
            for (var d = "{", m = !1, n, k, l, b, E = [], w; q;) {
                d = q.indexOf(d);
                if (-1 === d) break;
                n = q.slice(0,
                    d);
                if (m) {
                    n = n.split(":");
                    k = n.shift().split(".");
                    b = k.length;
                    w = c;
                    for (l = 0; l < b; l++) w = w[k[l]];
                    n.length && (w = a.formatSingle(n.join(":"), w));
                    E.push(w)
                } else E.push(n);
                q = q.slice(d + 1);
                d = (m = !m) ? "}" : "{"
            }
            E.push(q);
            return E.join("")
        };
        a.getMagnitude = function(a) {
            return Math.pow(10, Math.floor(Math.log(a) / Math.LN10))
        };
        a.normalizeTickInterval = function(q, c, d, m, n) {
            var k, l = q;
            d = a.pick(d, 1);
            k = q / d;
            c || (c = n ? [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] : [1, 2, 2.5, 5, 10], !1 === m && (1 === d ? c = a.grep(c, function(a) {
                return 0 === a % 1
            }) : .1 >= d && (c = [1 / d])));
            for (m = 0; m < c.length && !(l = c[m], n && l * d >= q || !n && k <= (c[m] + (c[m + 1] || c[m])) / 2); m++);
            return l = a.correctFloat(l * d, -Math.round(Math.log(.001) / Math.LN10))
        };
        a.stableSort = function(a, c) {
            var d = a.length,
                m, n;
            for (n = 0; n < d; n++) a[n].safeI = n;
            a.sort(function(a, l) {
                m = c(a, l);
                return 0 === m ? a.safeI - l.safeI : m
            });
            for (n = 0; n < d; n++) delete a[n].safeI
        };
        a.arrayMin = function(a) {
            for (var c = a.length, d = a[0]; c--;) a[c] < d && (d = a[c]);
            return d
        };
        a.arrayMax = function(a) {
            for (var c = a.length, d = a[0]; c--;) a[c] > d && (d = a[c]);
            return d
        };
        a.destroyObjectProperties =
            function(a, c) {
                for (var d in a) a[d] && a[d] !== c && a[d].destroy && a[d].destroy(), delete a[d]
            };
        a.discardElement = function(q) {
            var c = a.garbageBin;
            c || (c = a.createElement("div"));
            q && c.appendChild(q);
            c.innerHTML = ""
        };
        a.correctFloat = function(a, c) {
            return parseFloat(a.toPrecision(c || 14))
        };
        a.setAnimation = function(q, c) {
            c.renderer.globalAnimation = a.pick(q, c.options.chart.animation, !0)
        };
        a.animObject = function(q) {
            return a.isObject(q) ? a.merge(q) : {
                duration: q ? 500 : 0
            }
        };
        a.timeUnits = {
            millisecond: 1,
            second: 1E3,
            minute: 6E4,
            hour: 36E5,
            day: 864E5,
            week: 6048E5,
            month: 24192E5,
            year: 314496E5
        };
        a.numberFormat = function(q, c, d, m) {
            q = +q || 0;
            c = +c;
            var n = a.defaultOptions.lang,
                k = (q.toString().split(".")[1] || "").length,
                l, b; - 1 === c ? c = Math.min(k, 20) : a.isNumber(c) || (c = 2);
            b = (Math.abs(q) + Math.pow(10, -Math.max(c, k) - 1)).toFixed(c);
            k = String(a.pInt(b));
            l = 3 < k.length ? k.length % 3 : 0;
            d = a.pick(d, n.decimalPoint);
            m = a.pick(m, n.thousandsSep);
            q = (0 > q ? "-" : "") + (l ? k.substr(0, l) + m : "");
            q += k.substr(l).replace(/(\d{3})(?=\d)/g, "$1" + m);
            c && (q += d + b.slice(-c));
            return q
        };
        Math.easeInOutSine =
            function(a) {
                return -.5 * (Math.cos(Math.PI * a) - 1)
            };
        a.getStyle = function(q, c) {
            return "width" === c ? Math.min(q.offsetWidth, q.scrollWidth) - a.getStyle(q, "padding-left") - a.getStyle(q, "padding-right") : "height" === c ? Math.min(q.offsetHeight, q.scrollHeight) - a.getStyle(q, "padding-top") - a.getStyle(q, "padding-bottom") : (q = F.getComputedStyle(q, void 0)) && a.pInt(q.getPropertyValue(c))
        };
        a.inArray = function(a, c) {
            return c.indexOf ? c.indexOf(a) : [].indexOf.call(c, a)
        };
        a.grep = function(a, c) {
            return [].filter.call(a, c)
        };
        a.find = function(a,
            c) {
            return [].find.call(a, c)
        };
        a.map = function(a, c) {
            for (var d = [], m = 0, n = a.length; m < n; m++) d[m] = c.call(a[m], a[m], m, a);
            return d
        };
        a.offset = function(a) {
            var c = D.documentElement;
            a = a.getBoundingClientRect();
            return {
                top: a.top + (F.pageYOffset || c.scrollTop) - (c.clientTop || 0),
                left: a.left + (F.pageXOffset || c.scrollLeft) - (c.clientLeft || 0)
            }
        };
        a.stop = function(a, c) {
            for (var d = B.length; d--;) B[d].elem !== a || c && c !== B[d].prop || (B[d].stopped = !0)
        };
        a.each = function(a, c, d) {
            return Array.prototype.forEach.call(a, c, d)
        };
        a.addEvent = function(q,
            c, d) {
            function m(a) {
                a.target = a.srcElement || F;
                d.call(q, a)
            }
            var n = q.hcEvents = q.hcEvents || {};
            q.addEventListener ? q.addEventListener(c, d, !1) : q.attachEvent && (q.hcEventsIE || (q.hcEventsIE = {}), q.hcEventsIE[d.toString()] = m, q.attachEvent("on" + c, m));
            n[c] || (n[c] = []);
            n[c].push(d);
            return function() {
                a.removeEvent(q, c, d)
            }
        };
        a.removeEvent = function(q, c, d) {
            function m(a, b) {
                q.removeEventListener ? q.removeEventListener(a, b, !1) : q.attachEvent && (b = q.hcEventsIE[b.toString()], q.detachEvent("on" + a, b))
            }

            function n() {
                var a, b;
                if (q.nodeName)
                    for (b in c ?
                        (a = {}, a[c] = !0) : a = l, a)
                        if (l[b])
                            for (a = l[b].length; a--;) m(b, l[b][a])
            }
            var k, l = q.hcEvents,
                b;
            l && (c ? (k = l[c] || [], d ? (b = a.inArray(d, k), -1 < b && (k.splice(b, 1), l[c] = k), m(c, d)) : (n(), l[c] = [])) : (n(), q.hcEvents = {}))
        };
        a.fireEvent = function(q, c, d, m) {
            var n;
            n = q.hcEvents;
            var k, l;
            d = d || {};
            if (D.createEvent && (q.dispatchEvent || q.fireEvent)) n = D.createEvent("Events"), n.initEvent(c, !0, !0), a.extend(n, d), q.dispatchEvent ? q.dispatchEvent(n) : q.fireEvent(c, n);
            else if (n)
                for (n = n[c] || [], k = n.length, d.target || a.extend(d, {
                        preventDefault: function() {
                            d.defaultPrevented = !0
                        },
                        target: q,
                        type: c
                    }), c = 0; c < k; c++)(l = n[c]) && !1 === l.call(q, d) && d.preventDefault();
            m && !d.defaultPrevented && m(d)
        };
        a.animate = function(q, c, d) {
            var m, n = "",
                k, l, b;
            a.isObject(d) || (m = arguments, d = {
                duration: m[2],
                easing: m[3],
                complete: m[4]
            });
            a.isNumber(d.duration) || (d.duration = 400);
            d.easing = "function" === typeof d.easing ? d.easing : Math[d.easing] || Math.easeInOutSine;
            d.curAnim = a.merge(c);
            for (b in c) a.stop(q, b), l = new a.Fx(q, d, b), k = null, "d" === b ? (l.paths = l.initPath(q, q.d, c.d), l.toD = c.d, m = 0, k = 1) : q.attr ? m = q.attr(b) : (m = parseFloat(a.getStyle(q,
                b)) || 0, "opacity" !== b && (n = "px")), k || (k = c[b]), k.match && k.match("px") && (k = k.replace(/px/g, "")), l.run(m, k, n)
        };
        a.seriesType = function(q, c, d, m, n) {
            var k = a.getOptions(),
                l = a.seriesTypes;
            k.plotOptions[q] = a.merge(k.plotOptions[c], d);
            l[q] = a.extendClass(l[c] || function() {}, m);
            l[q].prototype.type = q;
            n && (l[q].prototype.pointClass = a.extendClass(a.Point, n));
            return l[q]
        };
        a.uniqueKey = function() {
            var a = Math.random().toString(36).substring(2, 9),
                c = 0;
            return function() {
                return "highcharts-" + a + "-" + c++
            }
        }();
        F.jQuery && (F.jQuery.fn.highcharts =
            function() {
                var q = [].slice.call(arguments);
                if (this[0]) return q[0] ? (new(a[a.isString(q[0]) ? q.shift() : "Chart"])(this[0], q[0], q[1]), this) : x[a.attr(this[0], "data-highcharts-chart")]
            });
        D && !D.defaultView && (a.getStyle = function(q, c) {
            var d = {
                width: "clientWidth",
                height: "clientHeight"
            }[c];
            if (q.style[c]) return a.pInt(q.style[c]);
            "opacity" === c && (c = "filter");
            if (d) return q.style.zoom = 1, Math.max(q[d] - 2 * a.getStyle(q, "padding"), 0);
            q = q.currentStyle[c.replace(/\-(\w)/g, function(a, c) {
                return c.toUpperCase()
            })];
            "filter" ===
            c && (q = q.replace(/alpha\(opacity=([0-9]+)\)/, function(a, c) {
                return c / 100
            }));
            return "" === q ? 1 : a.pInt(q)
        });
        Array.prototype.forEach || (a.each = function(a, c, d) {
            for (var m = 0, n = a.length; m < n; m++)
                if (!1 === c.call(d, a[m], m, a)) return m
        });
        Array.prototype.indexOf || (a.inArray = function(a, c) {
            var d, m = 0;
            if (c)
                for (d = c.length; m < d; m++)
                    if (c[m] === a) return m;
            return -1
        });
        Array.prototype.filter || (a.grep = function(a, c) {
            for (var d = [], m = 0, n = a.length; m < n; m++) c(a[m], m) && d.push(a[m]);
            return d
        });
        Array.prototype.find || (a.find = function(a, c) {
            var d,
                m = a.length;
            for (d = 0; d < m; d++)
                if (c(a[d], d)) return a[d]
        })
    })(J);
    (function(a) {
        var B = a.each,
            x = a.isNumber,
            D = a.map,
            F = a.merge,
            q = a.pInt;
        a.Color = function(c) {
            if (!(this instanceof a.Color)) return new a.Color(c);
            this.init(c)
        };
        a.Color.prototype = {
            parsers: [{
                regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
                parse: function(a) {
                    return [q(a[1]), q(a[2]), q(a[3]), parseFloat(a[4], 10)]
                }
            }, {
                regex: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
                parse: function(a) {
                    return [q(a[1],
                        16), q(a[2], 16), q(a[3], 16), 1]
                }
            }, {
                regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
                parse: function(a) {
                    return [q(a[1]), q(a[2]), q(a[3]), 1]
                }
            }],
            names: {
                white: "#ffffff",
                black: "#000000"
            },
            init: function(c) {
                var d, m, n, k;
                if ((this.input = c = this.names[c] || c) && c.stops) this.stops = D(c.stops, function(l) {
                    return new a.Color(l[1])
                });
                else
                    for (n = this.parsers.length; n-- && !m;) k = this.parsers[n], (d = k.regex.exec(c)) && (m = k.parse(d));
                this.rgba = m || []
            },
            get: function(a) {
                var c = this.input,
                    m = this.rgba,
                    n;
                this.stops ?
                    (n = F(c), n.stops = [].concat(n.stops), B(this.stops, function(c, l) {
                        n.stops[l] = [n.stops[l][0], c.get(a)]
                    })) : n = m && x(m[0]) ? "rgb" === a || !a && 1 === m[3] ? "rgb(" + m[0] + "," + m[1] + "," + m[2] + ")" : "a" === a ? m[3] : "rgba(" + m.join(",") + ")" : c;
                return n
            },
            brighten: function(a) {
                var c, m = this.rgba;
                if (this.stops) B(this.stops, function(c) {
                    c.brighten(a)
                });
                else if (x(a) && 0 !== a)
                    for (c = 0; 3 > c; c++) m[c] += q(255 * a), 0 > m[c] && (m[c] = 0), 255 < m[c] && (m[c] = 255);
                return this
            },
            setOpacity: function(a) {
                this.rgba[3] = a;
                return this
            }
        };
        a.color = function(c) {
            return new a.Color(c)
        }
    })(J);
    (function(a) {
        var B, x, D = a.addEvent,
            F = a.animate,
            q = a.attr,
            c = a.charts,
            d = a.color,
            m = a.css,
            n = a.createElement,
            k = a.defined,
            l = a.deg2rad,
            b = a.destroyObjectProperties,
            E = a.doc,
            w = a.each,
            t = a.extend,
            e = a.erase,
            p = a.grep,
            h = a.hasTouch,
            I = a.inArray,
            v = a.isArray,
            C = a.isFirefox,
            G = a.isMS,
            y = a.isObject,
            f = a.isString,
            A = a.isWebKit,
            u = a.merge,
            L = a.noop,
            H = a.pick,
            g = a.pInt,
            r = a.removeEvent,
            R = a.splat,
            O = a.stop,
            P = a.svg,
            Q = a.SVG_NS,
            K = a.symbolSizes,
            M = a.win;
        B = a.SVGElement = function() {
            return this
        };
        B.prototype = {
            opacity: 1,
            SVG_NS: Q,
            textProps: "direction fontSize fontWeight fontFamily fontStyle color lineHeight width textDecoration textOverflow textOutline".split(" "),
            init: function(a, g) {
                this.element = "span" === g ? n(g) : E.createElementNS(this.SVG_NS, g);
                this.renderer = a
            },
            animate: function(z, g, e) {
                g = a.animObject(H(g, this.renderer.globalAnimation, !0));
                0 !== g.duration ? (e && (g.complete = e), F(this, z, g)) : this.attr(z, null, e);
                return this
            },
            colorGradient: function(z, g, e) {
                var r = this.renderer,
                    f, b, h, p, N, l, t, c, d, m, A, K = [],
                    n;
                z.linearGradient ? b = "linearGradient" : z.radialGradient && (b = "radialGradient");
                if (b) {
                    h = z[b];
                    N = r.gradients;
                    t = z.stops;
                    m = e.radialReference;
                    v(h) && (z[b] = h = {
                        x1: h[0],
                        y1: h[1],
                        x2: h[2],
                        y2: h[3],
                        gradientUnits: "userSpaceOnUse"
                    });
                    "radialGradient" === b && m && !k(h.gradientUnits) && (p = h, h = u(h, r.getRadialAttr(m, p), {
                        gradientUnits: "userSpaceOnUse"
                    }));
                    for (A in h) "id" !== A && K.push(A, h[A]);
                    for (A in t) K.push(t[A]);
                    K = K.join(",");
                    N[K] ? m = N[K].attr("id") : (h.id = m = a.uniqueKey(), N[K] = l = r.createElement(b).attr(h).add(r.defs), l.radAttr = p, l.stops = [], w(t, function(z) {
                        0 === z[1].indexOf("rgba") ? (f = a.color(z[1]), c = f.get("rgb"), d = f.get("a")) : (c = z[1], d = 1);
                        z = r.createElement("stop").attr({
                            offset: z[0],
                            "stop-color": c,
                            "stop-opacity": d
                        }).add(l);
                        l.stops.push(z)
                    }));
                    n = "url(" + r.url + "#" + m + ")";
                    e.setAttribute(g, n);
                    e.gradient = K;
                    z.toString = function() {
                        return n
                    }
                }
            },
            applyTextOutline: function(a) {
                var z = this.element,
                    g, r, f, b; - 1 !== a.indexOf("contrast") && (a = a.replace(/contrast/g, this.renderer.getContrast(z.style.fill)));
                this.fakeTS = !0;
                this.ySetter = this.xSetter;
                g = [].slice.call(z.getElementsByTagName("tspan"));
                a = a.split(" ");
                r = a[a.length - 1];
                (f = a[0]) && "none" !== f && (f = f.replace(/(^[\d\.]+)(.*?)$/g, function(a, z, g) {
                    return 2 * z + g
                }), w(g, function(a) {
                    "highcharts-text-outline" ===
                    a.getAttribute("class") && e(g, z.removeChild(a))
                }), b = z.firstChild, w(g, function(a, g) {
                    0 === g && (a.setAttribute("x", z.getAttribute("x")), g = z.getAttribute("y"), a.setAttribute("y", g || 0), null === g && z.setAttribute("y", 0));
                    a = a.cloneNode(1);
                    q(a, {
                        "class": "highcharts-text-outline",
                        fill: r,
                        stroke: r,
                        "stroke-width": f,
                        "stroke-linejoin": "round"
                    });
                    z.insertBefore(a, b)
                }))
            },
            attr: function(a, g, e, r) {
                var z, f = this.element,
                    b, h = this,
                    p;
                "string" === typeof a && void 0 !== g && (z = a, a = {}, a[z] = g);
                if ("string" === typeof a) h = (this[a + "Getter"] ||
                    this._defaultGetter).call(this, a, f);
                else {
                    for (z in a) g = a[z], p = !1, r || O(this, z), this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(z) && (b || (this.symbolAttr(a), b = !0), p = !0), !this.rotation || "x" !== z && "y" !== z || (this.doTransform = !0), p || (p = this[z + "Setter"] || this._defaultSetter, p.call(this, g, z, f));
                    this.doTransform && (this.updateTransform(), this.doTransform = !1)
                }
                e && e();
                return h
            },
            addClass: function(a, g) {
                var z = this.attr("class") || ""; - 1 === z.indexOf(a) && (g || (a = (z + (z ? " " : "") + a).replace("  ",
                    " ")), this.attr("class", a));
                return this
            },
            hasClass: function(a) {
                return -1 !== q(this.element, "class").indexOf(a)
            },
            removeClass: function(a) {
                q(this.element, "class", (q(this.element, "class") || "").replace(a, ""));
                return this
            },
            symbolAttr: function(a) {
                var z = this;
                w("x y r start end width height innerR anchorX anchorY".split(" "), function(g) {
                    z[g] = H(a[g], z[g])
                });
                z.attr({
                    d: z.renderer.symbols[z.symbolName](z.x, z.y, z.width, z.height, z)
                })
            },
            clip: function(a) {
                return this.attr("clip-path", a ? "url(" + this.renderer.url + "#" + a.id +
                    ")" : "none")
            },
            crisp: function(a, g) {
                var z, e = {},
                    r;
                g = g || a.strokeWidth || 0;
                r = Math.round(g) % 2 / 2;
                a.x = Math.floor(a.x || this.x || 0) + r;
                a.y = Math.floor(a.y || this.y || 0) + r;
                a.width = Math.floor((a.width || this.width || 0) - 2 * r);
                a.height = Math.floor((a.height || this.height || 0) - 2 * r);
                k(a.strokeWidth) && (a.strokeWidth = g);
                for (z in a) this[z] !== a[z] && (this[z] = e[z] = a[z]);
                return e
            },
            css: function(a) {
                var z = this.styles,
                    r = {},
                    e = this.element,
                    f, b, h = "";
                f = !z;
                var p = ["textOverflow", "width"];
                a && a.color && (a.fill = a.color);
                if (z)
                    for (b in a) a[b] !== z[b] &&
                        (r[b] = a[b], f = !0);
                if (f) {
                    f = this.textWidth = a && a.width && "text" === e.nodeName.toLowerCase() && g(a.width) || this.textWidth;
                    z && (a = t(z, r));
                    this.styles = a;
                    f && !P && this.renderer.forExport && delete a.width;
                    if (G && !P) m(this.element, a);
                    else {
                        z = function(a, g) {
                            return "-" + g.toLowerCase()
                        };
                        for (b in a) - 1 === I(b, p) && (h += b.replace(/([A-Z])/g, z) + ":" + a[b] + ";");
                        h && q(e, "style", h)
                    }
                    this.added && (f && this.renderer.buildText(this), a && a.textOutline && this.applyTextOutline(a.textOutline))
                }
                return this
            },
            getStyle: function(a) {
                return M.getComputedStyle(this.element ||
                    this, "").getPropertyValue(a)
            },
            strokeWidth: function() {
                var a = this.getStyle("stroke-width"),
                    r;
                a.indexOf("px") === a.length - 2 ? a = g(a) : (r = E.createElementNS(Q, "rect"), q(r, {
                    width: a,
                    "stroke-width": 0
                }), this.element.parentNode.appendChild(r), a = r.getBBox().width, r.parentNode.removeChild(r));
                return a
            },
            on: function(a, g) {
                var z = this,
                    r = z.element;
                h && "click" === a ? (r.ontouchstart = function(a) {
                    z.touchEventFired = Date.now();
                    a.preventDefault();
                    g.call(r, a)
                }, r.onclick = function(a) {
                    (-1 === M.navigator.userAgent.indexOf("Android") ||
                        1100 < Date.now() - (z.touchEventFired || 0)) && g.call(r, a)
                }) : r["on" + a] = g;
                return this
            },
            setRadialReference: function(a) {
                var g = this.renderer.gradients[this.element.gradient];
                this.element.radialReference = a;
                g && g.radAttr && g.animate(this.renderer.getRadialAttr(a, g.radAttr));
                return this
            },
            translate: function(a, g) {
                return this.attr({
                    translateX: a,
                    translateY: g
                })
            },
            invert: function(a) {
                this.inverted = a;
                this.updateTransform();
                return this
            },
            updateTransform: function() {
                var a = this.translateX || 0,
                    g = this.translateY || 0,
                    r = this.scaleX,
                    e = this.scaleY,
                    f = this.inverted,
                    b = this.rotation,
                    h = this.element;
                f && (a += this.width, g += this.height);
                a = ["translate(" + a + "," + g + ")"];
                f ? a.push("rotate(90) scale(-1,1)") : b && a.push("rotate(" + b + " " + (h.getAttribute("x") || 0) + " " + (h.getAttribute("y") || 0) + ")");
                (k(r) || k(e)) && a.push("scale(" + H(r, 1) + " " + H(e, 1) + ")");
                a.length && h.setAttribute("transform", a.join(" "))
            },
            toFront: function() {
                var a = this.element;
                a.parentNode.appendChild(a);
                return this
            },
            align: function(a, g, r) {
                var z, b, h, p, l = {};
                b = this.renderer;
                h = b.alignedObjects;
                var t, c;
                if (a) {
                    if (this.alignOptions = a, this.alignByTranslate = g, !r || f(r)) this.alignTo = z = r || "renderer", e(h, this), h.push(this), r = null
                } else a = this.alignOptions, g = this.alignByTranslate, z = this.alignTo;
                r = H(r, b[z], b);
                z = a.align;
                b = a.verticalAlign;
                h = (r.x || 0) + (a.x || 0);
                p = (r.y || 0) + (a.y || 0);
                "right" === z ? t = 1 : "center" === z && (t = 2);
                t && (h += (r.width - (a.width || 0)) / t);
                l[g ? "translateX" : "x"] = Math.round(h);
                "bottom" === b ? c = 1 : "middle" === b && (c = 2);
                c && (p += (r.height - (a.height || 0)) / c);
                l[g ? "translateY" : "y"] = Math.round(p);
                this[this.placed ?
                    "animate" : "attr"](l);
                this.placed = !0;
                this.alignAttr = l;
                return this
            },
            getBBox: function(a, g) {
                var r, z = this.renderer,
                    e, f = this.element,
                    b = this.styles,
                    h, p = this.textStr,
                    c, v = z.cache,
                    k = z.cacheKeys,
                    u;
                g = H(g, this.rotation);
                e = g * l;
                h = f && B.prototype.getStyle.call(f, "font-size");
                void 0 !== p && (u = p.toString(), -1 === u.indexOf("\x3c") && (u = u.replace(/[0-9]/g, "0")), u += ["", g || 0, h, b && b.width, b && b.textOverflow].join());
                u && !a && (r = v[u]);
                if (!r) {
                    if (f.namespaceURI === this.SVG_NS || z.forExport) {
                        try {
                            (c = this.fakeTS && function(a) {
                                w(f.querySelectorAll(".highcharts-text-outline"),
                                    function(g) {
                                        g.style.display = a
                                    })
                            }) && c("none"), r = f.getBBox ? t({}, f.getBBox()) : {
                                width: f.offsetWidth,
                                height: f.offsetHeight
                            }, c && c("")
                        } catch (T) {}
                        if (!r || 0 > r.width) r = {
                            width: 0,
                            height: 0
                        }
                    } else r = this.htmlGetBBox();
                    z.isSVG && (a = r.width, z = r.height, b && "11px" === b.fontSize && 17 === Math.round(z) && (r.height = z = 14), g && (r.width = Math.abs(z * Math.sin(e)) + Math.abs(a * Math.cos(e)), r.height = Math.abs(z * Math.cos(e)) + Math.abs(a * Math.sin(e))));
                    if (u && 0 < r.height) {
                        for (; 250 < k.length;) delete v[k.shift()];
                        v[u] || k.push(u);
                        v[u] = r
                    }
                }
                return r
            },
            show: function(a) {
                return this.attr({
                    visibility: a ? "inherit" : "visible"
                })
            },
            hide: function() {
                return this.attr({
                    visibility: "hidden"
                })
            },
            fadeOut: function(a) {
                var g = this;
                g.animate({
                    opacity: 0
                }, {
                    duration: a || 150,
                    complete: function() {
                        g.attr({
                            y: -9999
                        })
                    }
                })
            },
            add: function(a) {
                var g = this.renderer,
                    r = this.element,
                    e;
                a && (this.parentGroup = a);
                this.parentInverted = a && a.inverted;
                void 0 !== this.textStr && g.buildText(this);
                this.added = !0;
                if (!a || a.handleZ || this.zIndex) e = this.zIndexSetter();
                e || (a ? a.element : g.box).appendChild(r);
                if (this.onAdd) this.onAdd();
                return this
            },
            safeRemoveChild: function(a) {
                var g = a.parentNode;
                g && g.removeChild(a)
            },
            destroy: function() {
                var a = this.element || {},
                    g = this.renderer.isSVG && "SPAN" === a.nodeName && this.parentGroup,
                    r, f;
                a.onclick = a.onmouseout = a.onmouseover = a.onmousemove = a.point = null;
                O(this);
                this.clipPath && (this.clipPath = this.clipPath.destroy());
                if (this.stops) {
                    for (f = 0; f < this.stops.length; f++) this.stops[f] = this.stops[f].destroy();
                    this.stops = null
                }
                for (this.safeRemoveChild(a); g && g.div && 0 === g.div.childNodes.length;) a = g.parentGroup, this.safeRemoveChild(g.div),
                    delete g.div, g = a;
                this.alignTo && e(this.renderer.alignedObjects, this);
                for (r in this) delete this[r];
                return null
            },
            xGetter: function(a) {
                "circle" === this.element.nodeName && ("x" === a ? a = "cx" : "y" === a && (a = "cy"));
                return this._defaultGetter(a)
            },
            _defaultGetter: function(a) {
                a = H(this[a], this.element ? this.element.getAttribute(a) : null, 0);
                /^[\-0-9\.]+$/.test(a) && (a = parseFloat(a));
                return a
            },
            dSetter: function(a, g, r) {
                a && a.join && (a = a.join(" "));
                /(NaN| {2}|^$)/.test(a) && (a = "M 0 0");
                r.setAttribute(g, a);
                this[g] = a
            },
            alignSetter: function(a) {
                this.element.setAttribute("text-anchor", {
                    left: "start",
                    center: "middle",
                    right: "end"
                }[a])
            },
            opacitySetter: function(a, g, r) {
                this[g] = a;
                r.setAttribute(g, a)
            },
            titleSetter: function(a) {
                var g = this.element.getElementsByTagName("title")[0];
                g || (g = E.createElementNS(this.SVG_NS, "title"), this.element.appendChild(g));
                g.firstChild && g.removeChild(g.firstChild);
                g.appendChild(E.createTextNode(String(H(a), "").replace(/<[^>]*>/g, "")))
            },
            textSetter: function(a) {
                a !== this.textStr && (delete this.bBox, this.textStr = a, this.added && this.renderer.buildText(this))
            },
            fillSetter: function(a,
                g, r) {
                "string" === typeof a ? r.setAttribute(g, a) : a && this.colorGradient(a, g, r)
            },
            visibilitySetter: function(a, g, r) {
                "inherit" === a ? r.removeAttribute(g) : r.setAttribute(g, a)
            },
            zIndexSetter: function(a, r) {
                var e = this.renderer,
                    f = this.parentGroup,
                    b = (f || e).element || e.box,
                    h, z = this.element,
                    p;
                h = this.added;
                var l;
                k(a) && (z.zIndex = a, a = +a, this[r] === a && (h = !1), this[r] = a);
                if (h) {
                    (a = this.zIndex) && f && (f.handleZ = !0);
                    r = b.childNodes;
                    for (l = 0; l < r.length && !p; l++) f = r[l], h = f.zIndex, f !== z && (g(h) > a || !k(a) && k(h) || 0 > a && !k(h) && b !== e.box) && (b.insertBefore(z,
                        f), p = !0);
                    p || b.appendChild(z)
                }
                return p
            },
            _defaultSetter: function(a, g, r) {
                r.setAttribute(g, a)
            }
        };
        B.prototype.yGetter = B.prototype.xGetter;
        B.prototype.translateXSetter = B.prototype.translateYSetter = B.prototype.rotationSetter = B.prototype.verticalAlignSetter = B.prototype.scaleXSetter = B.prototype.scaleYSetter = function(a, g) {
            this[g] = a;
            this.doTransform = !0
        };
        x = a.SVGRenderer = function() {
            this.init.apply(this, arguments)
        };
        x.prototype = {
            Element: B,
            SVG_NS: Q,
            init: function(a, g, r, e, f, b) {
                var h;
                e = this.createElement("svg").attr({
                    version: "1.1",
                    "class": "highcharts-root"
                });
                h = e.element;
                a.appendChild(h); - 1 === a.innerHTML.indexOf("xmlns") && q(h, "xmlns", this.SVG_NS);
                this.isSVG = !0;
                this.box = h;
                this.boxWrapper = e;
                this.alignedObjects = [];
                this.url = (C || A) && E.getElementsByTagName("base").length ? M.location.href.replace(/#.*?$/, "").replace(/<[^>]*>/g, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20") : "";
                this.createElement("desc").add().element.appendChild(E.createTextNode("Created with Highcharts 5.0.7"));
                this.defs = this.createElement("defs").add();
                this.allowHTML =
                    b;
                this.forExport = f;
                this.gradients = {};
                this.cache = {};
                this.cacheKeys = [];
                this.imgCount = 0;
                this.setSize(g, r, !1);
                var z;
                C && a.getBoundingClientRect && (g = function() {
                    m(a, {
                        left: 0,
                        top: 0
                    });
                    z = a.getBoundingClientRect();
                    m(a, {
                        left: Math.ceil(z.left) - z.left + "px",
                        top: Math.ceil(z.top) - z.top + "px"
                    })
                }, g(), this.unSubPixelFix = D(M, "resize", g))
            },
            definition: function(a) {
                function g(a, e) {
                    var f;
                    w(R(a), function(a) {
                        var b = r.createElement(a.tagName),
                            h, z = {};
                        for (h in a) "tagName" !== h && "children" !== h && "textContent" !== h && (z[h] = a[h]);
                        b.attr(z);
                        b.add(e || r.defs);
                        a.textContent && b.element.appendChild(E.createTextNode(a.textContent));
                        g(a.children || [], b);
                        f = b
                    });
                    return f
                }
                var r = this;
                return g(a)
            },
            isHidden: function() {
                return !this.boxWrapper.getBBox().width
            },
            destroy: function() {
                var a = this.defs;
                this.box = null;
                this.boxWrapper = this.boxWrapper.destroy();
                b(this.gradients || {});
                this.gradients = null;
                a && (this.defs = a.destroy());
                this.unSubPixelFix && this.unSubPixelFix();
                return this.alignedObjects = null
            },
            createElement: function(a) {
                var g = new this.Element;
                g.init(this,
                    a);
                return g
            },
            draw: L,
            getRadialAttr: function(a, g) {
                return {
                    cx: a[0] - a[2] / 2 + g.cx * a[2],
                    cy: a[1] - a[2] / 2 + g.cy * a[2],
                    r: g.r * a[2]
                }
            },
            buildText: function(a) {
                var r = a.element,
                    e = this,
                    f = e.forExport,
                    b = H(a.textStr, "").toString(),
                    h = -1 !== b.indexOf("\x3c"),
                    z = r.childNodes,
                    l, c, t, v, u = q(r, "x"),
                    k = a.styles,
                    d = a.textWidth,
                    A = k && k.lineHeight,
                    K = k && k.textOutline,
                    n = k && "ellipsis" === k.textOverflow,
                    y = k && "nowrap" === k.whiteSpace,
                    C = z.length,
                    G = d && !a.added && this.box,
                    R = function(a) {
                        return A ? g(A) : e.fontMetrics(void 0, a.getAttribute("style") ? a : r).h
                    },
                    k = [b, n, y, A, K, k && k.fontSize, d].join();
                if (k !== a.textCache) {
                    for (a.textCache = k; C--;) r.removeChild(z[C]);
                    h || K || n || d || -1 !== b.indexOf(" ") ? (l = /<.*class="([^"]+)".*>/, c = /<.*style="([^"]+)".*>/, t = /<.*href="(http[^"]+)".*>/, G && G.appendChild(r), b = h ? b.replace(/<(b|strong)>/g, '\x3cspan style\x3d"font-weight:bold"\x3e').replace(/<(i|em)>/g, '\x3cspan style\x3d"font-style:italic"\x3e').replace(/<a/g, "\x3cspan").replace(/<\/(b|strong|i|em|a)>/g, "\x3c/span\x3e").split(/<br.*?>/g) : [b], b = p(b, function(a) {
                            return "" !== a
                        }),
                        w(b, function(g, b) {
                            var h, p = 0;
                            g = g.replace(/^\s+|\s+$/g, "").replace(/<span/g, "|||\x3cspan").replace(/<\/span>/g, "\x3c/span\x3e|||");
                            h = g.split("|||");
                            w(h, function(g) {
                                if ("" !== g || 1 === h.length) {
                                    var z = {},
                                        k = E.createElementNS(e.SVG_NS, "tspan"),
                                        A, K;
                                    l.test(g) && (A = g.match(l)[1], q(k, "class", A));
                                    c.test(g) && (K = g.match(c)[1].replace(/(;| |^)color([ :])/, "$1fill$2"), q(k, "style", K));
                                    t.test(g) && !f && (q(k, "onclick", 'location.href\x3d"' + g.match(t)[1] + '"'), m(k, {
                                        cursor: "pointer"
                                    }));
                                    g = (g.replace(/<(.|\n)*?>/g, "") || " ").replace(/&lt;/g,
                                        "\x3c").replace(/&gt;/g, "\x3e");
                                    if (" " !== g) {
                                        k.appendChild(E.createTextNode(g));
                                        p ? z.dx = 0 : b && null !== u && (z.x = u);
                                        q(k, z);
                                        r.appendChild(k);
                                        !p && b && (!P && f && m(k, {
                                            display: "block"
                                        }), q(k, "dy", R(k)));
                                        if (d) {
                                            z = g.replace(/([^\^])-/g, "$1- ").split(" ");
                                            A = 1 < h.length || b || 1 < z.length && !y;
                                            for (var w, C, G = [], N = R(k), H = a.rotation, O = g, I = O.length;
                                                (A || n) && (z.length || G.length);) a.rotation = 0, w = a.getBBox(!0), C = w.width, !P && e.forExport && (C = e.measureSpanWidth(k.firstChild.data, a.styles)), w = C > d, void 0 === v && (v = w), n && v ? (I /= 2, "" === O || !w &&
                                                .5 > I ? z = [] : (O = g.substring(0, O.length + (w ? -1 : 1) * Math.ceil(I)), z = [O + (3 < d ? "\u2026" : "")], k.removeChild(k.firstChild))) : w && 1 !== z.length ? (k.removeChild(k.firstChild), G.unshift(z.pop())) : (z = G, G = [], z.length && !y && (k = E.createElementNS(Q, "tspan"), q(k, {
                                                dy: N,
                                                x: u
                                            }), K && q(k, "style", K), r.appendChild(k)), C > d && (d = C)), z.length && k.appendChild(E.createTextNode(z.join(" ").replace(/- /g, "-")));
                                            a.rotation = H
                                        }
                                        p++
                                    }
                                }
                            })
                        }), v && a.attr("title", a.textStr), G && G.removeChild(r), K && a.applyTextOutline && a.applyTextOutline(K)) : r.appendChild(E.createTextNode(b.replace(/&lt;/g,
                        "\x3c").replace(/&gt;/g, "\x3e")))
                }
            },
            getContrast: function(a) {
                a = d(a).rgba;
                return 510 < a[0] + a[1] + a[2] ? "#000000" : "#FFFFFF"
            },
            button: function(a, g, r, e, f, b, h, p, l) {
                var z = this.label(a, g, r, l, null, null, null, null, "button"),
                    k = 0;
                z.attr(u({
                    padding: 8,
                    r: 2
                }, f));
                D(z.element, G ? "mouseover" : "mouseenter", function() {
                    3 !== k && z.setState(1)
                });
                D(z.element, G ? "mouseout" : "mouseleave", function() {
                    3 !== k && z.setState(k)
                });
                z.setState = function(a) {
                    1 !== a && (z.state = k = a);
                    z.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-" + ["normal", "hover", "pressed", "disabled"][a || 0])
                };
                return z.on("click", function(a) {
                    3 !== k && e.call(z, a)
                })
            },
            crispLine: function(a, g) {
                a[1] === a[4] && (a[1] = a[4] = Math.round(a[1]) - g % 2 / 2);
                a[2] === a[5] && (a[2] = a[5] = Math.round(a[2]) + g % 2 / 2);
                return a
            },
            path: function(a) {
                var g = {};
                v(a) ? g.d = a : y(a) && t(g, a);
                return this.createElement("path").attr(g)
            },
            circle: function(a, g, r) {
                a = y(a) ? a : {
                    x: a,
                    y: g,
                    r: r
                };
                g = this.createElement("circle");
                g.xSetter = g.ySetter = function(a, g, r) {
                    r.setAttribute("c" + g, a)
                };
                return g.attr(a)
            },
            arc: function(a, g, r, e,
                f, b) {
                y(a) && (g = a.y, r = a.r, e = a.innerR, f = a.start, b = a.end, a = a.x);
                a = this.symbol("arc", a || 0, g || 0, r || 0, r || 0, {
                    innerR: e || 0,
                    start: f || 0,
                    end: b || 0
                });
                a.r = r;
                return a
            },
            rect: function(a, g, r, e, f, b) {
                f = y(a) ? a.r : f;
                b = this.createElement("rect");
                a = y(a) ? a : void 0 === a ? {} : {
                    x: a,
                    y: g,
                    width: Math.max(r, 0),
                    height: Math.max(e, 0)
                };
                f && (a.r = f);
                b.rSetter = function(a, g, r) {
                    q(r, {
                        rx: a,
                        ry: a
                    })
                };
                return b.attr(a)
            },
            setSize: function(a, g, r) {
                var e = this.alignedObjects,
                    f = e.length;
                this.width = a;
                this.height = g;
                for (this.boxWrapper.animate({
                        width: a,
                        height: g
                    }, {
                        step: function() {
                            this.attr({
                                viewBox: "0 0 " + this.attr("width") + " " + this.attr("height")
                            })
                        },
                        duration: H(r, !0) ? void 0 : 0
                    }); f--;) e[f].align()
            },
            g: function(a) {
                var g = this.createElement("g");
                return a ? g.attr({
                    "class": "highcharts-" + a
                }) : g
            },
            image: function(a, g, r, e, f) {
                var b = {
                    preserveAspectRatio: "none"
                };
                1 < arguments.length && t(b, {
                    x: g,
                    y: r,
                    width: e,
                    height: f
                });
                b = this.createElement("image").attr(b);
                b.element.setAttributeNS ? b.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", a) : b.element.setAttribute("hc-svg-href",
                    a);
                return b
            },
            symbol: function(a, g, r, e, f, b) {
                var h = this,
                    p, l = this.symbols[a],
                    z = k(g) && l && this.symbols[a](Math.round(g), Math.round(r), e, f, b),
                    v = /^url\((.*?)\)$/,
                    u, d;
                l ? (p = this.path(z), t(p, {
                    symbolName: a,
                    x: g,
                    y: r,
                    width: e,
                    height: f
                }), b && t(p, b)) : v.test(a) && (u = a.match(v)[1], p = this.image(u), p.imgwidth = H(K[u] && K[u].width, b && b.width), p.imgheight = H(K[u] && K[u].height, b && b.height), d = function() {
                    p.attr({
                        width: p.width,
                        height: p.height
                    })
                }, w(["width", "height"], function(a) {
                    p[a + "Setter"] = function(a, g) {
                        var r = {},
                            e = this["img" + g],
                            b = "width" === g ? "translateX" : "translateY";
                        this[g] = a;
                        k(e) && (this.element && this.element.setAttribute(g, e), this.alignByTranslate || (r[b] = ((this[g] || 0) - e) / 2, this.attr(r)))
                    }
                }), k(g) && p.attr({
                    x: g,
                    y: r
                }), p.isImg = !0, k(p.imgwidth) && k(p.imgheight) ? d() : (p.attr({
                    width: 0,
                    height: 0
                }), n("img", {
                    onload: function() {
                        var a = c[h.chartIndex];
                        0 === this.width && (m(this, {
                            position: "absolute",
                            top: "-999em"
                        }), E.body.appendChild(this));
                        K[u] = {
                            width: this.width,
                            height: this.height
                        };
                        p.imgwidth = this.width;
                        p.imgheight = this.height;
                        p.element && d();
                        this.parentNode && this.parentNode.removeChild(this);
                        h.imgCount--;
                        if (!h.imgCount && a && a.onload) a.onload()
                    },
                    src: u
                }), this.imgCount++));
                return p
            },
            symbols: {
                circle: function(a, g, r, e) {
                    return this.arc(a + r / 2, g + e / 2, r / 2, e / 2, {
                        start: 0,
                        end: 2 * Math.PI,
                        open: !1
                    })
                },
                square: function(a, g, r, e) {
                    return ["M", a, g, "L", a + r, g, a + r, g + e, a, g + e, "Z"]
                },
                triangle: function(a, g, r, e) {
                    return ["M", a + r / 2, g, "L", a + r, g + e, a, g + e, "Z"]
                },
                "triangle-down": function(a, g, r, e) {
                    return ["M", a, g, "L", a + r, g, a + r / 2, g + e, "Z"]
                },
                diamond: function(a, g, r, e) {
                    return ["M", a + r / 2,
                        g, "L", a + r, g + e / 2, a + r / 2, g + e, a, g + e / 2, "Z"
                    ]
                },
                arc: function(a, g, r, e, b) {
                    var f = b.start,
                        h = b.r || r,
                        p = b.r || e || r,
                        l = b.end - .001;
                    r = b.innerR;
                    e = b.open;
                    var c = Math.cos(f),
                        t = Math.sin(f),
                        u = Math.cos(l),
                        l = Math.sin(l);
                    b = b.end - f < Math.PI ? 0 : 1;
                    h = ["M", a + h * c, g + p * t, "A", h, p, 0, b, 1, a + h * u, g + p * l];
                    k(r) && h.push(e ? "M" : "L", a + r * u, g + r * l, "A", r, r, 0, b, 0, a + r * c, g + r * t);
                    h.push(e ? "" : "Z");
                    return h
                },
                callout: function(a, g, r, e, b) {
                    var f = Math.min(b && b.r || 0, r, e),
                        h = f + 6,
                        p = b && b.anchorX;
                    b = b && b.anchorY;
                    var l;
                    l = ["M", a + f, g, "L", a + r - f, g, "C", a + r, g, a + r, g, a + r, g + f, "L",
                        a + r, g + e - f, "C", a + r, g + e, a + r, g + e, a + r - f, g + e, "L", a + f, g + e, "C", a, g + e, a, g + e, a, g + e - f, "L", a, g + f, "C", a, g, a, g, a + f, g
                    ];
                    p && p > r ? b > g + h && b < g + e - h ? l.splice(13, 3, "L", a + r, b - 6, a + r + 6, b, a + r, b + 6, a + r, g + e - f) : l.splice(13, 3, "L", a + r, e / 2, p, b, a + r, e / 2, a + r, g + e - f) : p && 0 > p ? b > g + h && b < g + e - h ? l.splice(33, 3, "L", a, b + 6, a - 6, b, a, b - 6, a, g + f) : l.splice(33, 3, "L", a, e / 2, p, b, a, e / 2, a, g + f) : b && b > e && p > a + h && p < a + r - h ? l.splice(23, 3, "L", p + 6, g + e, p, g + e + 6, p - 6, g + e, a + f, g + e) : b && 0 > b && p > a + h && p < a + r - h && l.splice(3, 3, "L", p - 6, g, p, g - 6, p + 6, g, r - f, g);
                    return l
                }
            },
            clipRect: function(g,
                r, e, b) {
                var f = a.uniqueKey(),
                    h = this.createElement("clipPath").attr({
                        id: f
                    }).add(this.defs);
                g = this.rect(g, r, e, b, 0).add(h);
                g.id = f;
                g.clipPath = h;
                g.count = 0;
                return g
            },
            text: function(a, g, r, e) {
                var b = !P && this.forExport,
                    f = {};
                if (e && (this.allowHTML || !this.forExport)) return this.html(a, g, r);
                f.x = Math.round(g || 0);
                r && (f.y = Math.round(r));
                if (a || 0 === a) f.text = a;
                a = this.createElement("text").attr(f);
                b && a.css({
                    position: "absolute"
                });
                e || (a.xSetter = function(a, g, r) {
                    var e = r.getElementsByTagName("tspan"),
                        b, f = r.getAttribute(g),
                        h;
                    for (h = 0; h < e.length; h++) b = e[h], b.getAttribute(g) === f && b.setAttribute(g, a);
                    r.setAttribute(g, a)
                });
                return a
            },
            fontMetrics: function(a, r) {
                a = r && B.prototype.getStyle.call(r, "font-size");
                a = /px/.test(a) ? g(a) : /em/.test(a) ? parseFloat(a) * (r ? this.fontMetrics(null, r.parentNode).f : 16) : 12;
                r = 24 > a ? a + 3 : Math.round(1.2 * a);
                return {
                    h: r,
                    b: Math.round(.8 * r),
                    f: a
                }
            },
            rotCorr: function(a, g, r) {
                var e = a;
                g && r && (e = Math.max(e * Math.cos(g * l), 4));
                return {
                    x: -a / 3 * Math.sin(g * l),
                    y: e
                }
            },
            label: function(a, g, e, b, f, h, p, l, c) {
                var v = this,
                    d = v.g("button" !==
                        c && "label"),
                    A = d.text = v.text("", 0, 0, p).attr({
                        zIndex: 1
                    }),
                    m, K, n = 0,
                    y = 3,
                    z = 0,
                    C, G, R, E, H, O = {},
                    I, q = /^url\((.*?)\)$/.test(b),
                    L = q,
                    M, P, N, Q;
                c && d.addClass("highcharts-" + c);
                L = !0;
                M = function() {
                    return m.strokeWidth() % 2 / 2
                };
                P = function() {
                    var a = A.element.style,
                        g = {};
                    K = (void 0 === C || void 0 === G || H) && k(A.textStr) && A.getBBox();
                    d.width = (C || K.width || 0) + 2 * y + z;
                    d.height = (G || K.height || 0) + 2 * y;
                    I = y + v.fontMetrics(a && a.fontSize, A).b;
                    L && (m || (d.box = m = v.symbols[b] || q ? v.symbol(b) : v.rect(), m.addClass(("button" === c ? "" : "highcharts-label-box") +
                        (c ? " highcharts-" + c + "-box" : "")), m.add(d), a = M(), g.x = a, g.y = (l ? -I : 0) + a), g.width = Math.round(d.width), g.height = Math.round(d.height), m.attr(t(g, O)), O = {})
                };
                N = function() {
                    var a = z + y,
                        g;
                    g = l ? 0 : I;
                    k(C) && K && ("center" === H || "right" === H) && (a += {
                        center: .5,
                        right: 1
                    }[H] * (C - K.width));
                    if (a !== A.x || g !== A.y) A.attr("x", a), void 0 !== g && A.attr("y", g);
                    A.x = a;
                    A.y = g
                };
                Q = function(a, g) {
                    m ? m.attr(a, g) : O[a] = g
                };
                d.onAdd = function() {
                    A.add(d);
                    d.attr({
                        text: a || 0 === a ? a : "",
                        x: g,
                        y: e
                    });
                    m && k(f) && d.attr({
                        anchorX: f,
                        anchorY: h
                    })
                };
                d.widthSetter = function(a) {
                    C =
                        a
                };
                d.heightSetter = function(a) {
                    G = a
                };
                d["text-alignSetter"] = function(a) {
                    H = a
                };
                d.paddingSetter = function(a) {
                    k(a) && a !== y && (y = d.padding = a, N())
                };
                d.paddingLeftSetter = function(a) {
                    k(a) && a !== z && (z = a, N())
                };
                d.alignSetter = function(a) {
                    a = {
                        left: 0,
                        center: .5,
                        right: 1
                    }[a];
                    a !== n && (n = a, K && d.attr({
                        x: R
                    }))
                };
                d.textSetter = function(a) {
                    void 0 !== a && A.textSetter(a);
                    P();
                    N()
                };
                d["stroke-widthSetter"] = function(a, g) {
                    a && (L = !0);
                    this["stroke-width"] = a;
                    Q(g, a)
                };
                d.rSetter = function(a, g) {
                    Q(g, a)
                };
                d.anchorXSetter = function(a, g) {
                    f = a;
                    Q(g, Math.round(a) -
                        M() - R)
                };
                d.anchorYSetter = function(a, g) {
                    h = a;
                    Q(g, a - E)
                };
                d.xSetter = function(a) {
                    d.x = a;
                    n && (a -= n * ((C || K.width) + 2 * y));
                    R = Math.round(a);
                    d.attr("translateX", R)
                };
                d.ySetter = function(a) {
                    E = d.y = Math.round(a);
                    d.attr("translateY", E)
                };
                var S = d.css;
                return t(d, {
                    css: function(a) {
                        if (a) {
                            var g = {};
                            a = u(a);
                            w(d.textProps, function(r) {
                                void 0 !== a[r] && (g[r] = a[r], delete a[r])
                            });
                            A.css(g)
                        }
                        return S.call(d, a)
                    },
                    getBBox: function() {
                        return {
                            width: K.width + 2 * y,
                            height: K.height + 2 * y,
                            x: K.x - y,
                            y: K.y - y
                        }
                    },
                    destroy: function() {
                        r(d.element, "mouseenter");
                        r(d.element,
                            "mouseleave");
                        A && (A = A.destroy());
                        m && (m = m.destroy());
                        B.prototype.destroy.call(d);
                        d = v = P = N = Q = null
                    }
                })
            }
        };
        a.Renderer = x
    })(J);
    (function(a) {
        var B = a.attr,
            x = a.createElement,
            D = a.css,
            F = a.defined,
            q = a.each,
            c = a.extend,
            d = a.isFirefox,
            m = a.isMS,
            n = a.isWebKit,
            k = a.pInt,
            l = a.SVGRenderer,
            b = a.win,
            E = a.wrap;
        c(a.SVGElement.prototype, {
            htmlCss: function(a) {
                var b = this.element;
                if (b = a && "SPAN" === b.tagName && a.width) delete a.width, this.textWidth = b, this.updateTransform();
                a && "ellipsis" === a.textOverflow && (a.whiteSpace = "nowrap", a.overflow =
                    "hidden");
                this.styles = c(this.styles, a);
                D(this.element, a);
                return this
            },
            htmlGetBBox: function() {
                var a = this.element;
                "text" === a.nodeName && (a.style.position = "absolute");
                return {
                    x: a.offsetLeft,
                    y: a.offsetTop,
                    width: a.offsetWidth,
                    height: a.offsetHeight
                }
            },
            htmlUpdateTransform: function() {
                if (this.added) {
                    var a = this.renderer,
                        b = this.element,
                        e = this.x || 0,
                        p = this.y || 0,
                        h = this.textAlign || "left",
                        l = {
                            left: 0,
                            center: .5,
                            right: 1
                        }[h],
                        c = this.styles;
                    D(b, {
                        marginLeft: this.translateX || 0,
                        marginTop: this.translateY || 0
                    });
                    this.inverted && q(b.childNodes,
                        function(e) {
                            a.invertChild(e, b)
                        });
                    if ("SPAN" === b.tagName) {
                        var d = this.rotation,
                            m = k(this.textWidth),
                            y = c && c.whiteSpace,
                            f = [d, h, b.innerHTML, this.textWidth, this.textAlign].join();
                        f !== this.cTT && (c = a.fontMetrics(b.style.fontSize).b, F(d) && this.setSpanRotation(d, l, c), D(b, {
                            width: "",
                            whiteSpace: y || "nowrap"
                        }), b.offsetWidth > m && /[ \-]/.test(b.textContent || b.innerText) && D(b, {
                            width: m + "px",
                            display: "block",
                            whiteSpace: y || "normal"
                        }), this.getSpanCorrection(b.offsetWidth, c, l, d, h));
                        D(b, {
                            left: e + (this.xCorr || 0) + "px",
                            top: p + (this.yCorr ||
                                0) + "px"
                        });
                        n && (c = b.offsetHeight);
                        this.cTT = f
                    }
                } else this.alignOnAdd = !0
            },
            setSpanRotation: function(a, l, e) {
                var p = {},
                    h = m ? "-ms-transform" : n ? "-webkit-transform" : d ? "MozTransform" : b.opera ? "-o-transform" : "";
                p[h] = p.transform = "rotate(" + a + "deg)";
                p[h + (d ? "Origin" : "-origin")] = p.transformOrigin = 100 * l + "% " + e + "px";
                D(this.element, p)
            },
            getSpanCorrection: function(a, b, e) {
                this.xCorr = -a * e;
                this.yCorr = -b
            }
        });
        c(l.prototype, {
            html: function(a, b, e) {
                var p = this.createElement("span"),
                    h = p.element,
                    l = p.renderer,
                    k = l.isSVG,
                    d = function(a, e) {
                        q(["opacity",
                            "visibility"
                        ], function(b) {
                            E(a, b + "Setter", function(a, b, f, h) {
                                a.call(this, b, f, h);
                                e[f] = b
                            })
                        })
                    };
                p.textSetter = function(a) {
                    a !== h.innerHTML && delete this.bBox;
                    h.innerHTML = this.textStr = a;
                    p.htmlUpdateTransform()
                };
                k && d(p, p.element.style);
                p.xSetter = p.ySetter = p.alignSetter = p.rotationSetter = function(a, b) {
                    "align" === b && (b = "textAlign");
                    p[b] = a;
                    p.htmlUpdateTransform()
                };
                p.attr({
                    text: a,
                    x: Math.round(b),
                    y: Math.round(e)
                }).css({
                    position: "absolute"
                });
                h.style.whiteSpace = "nowrap";
                p.css = p.htmlCss;
                k && (p.add = function(a) {
                    var b, e =
                        l.box.parentNode,
                        k = [];
                    if (this.parentGroup = a) {
                        if (b = a.div, !b) {
                            for (; a;) k.push(a), a = a.parentGroup;
                            q(k.reverse(), function(a) {
                                var f, h = B(a.element, "class");
                                h && (h = {
                                    className: h
                                });
                                b = a.div = a.div || x("div", h, {
                                    position: "absolute",
                                    left: (a.translateX || 0) + "px",
                                    top: (a.translateY || 0) + "px",
                                    display: a.display,
                                    opacity: a.opacity,
                                    pointerEvents: a.styles && a.styles.pointerEvents
                                }, b || e);
                                f = b.style;
                                c(a, {
                                    on: function() {
                                        p.on.apply({
                                            element: k[0].div
                                        }, arguments);
                                        return a
                                    },
                                    translateXSetter: function(g, r) {
                                        f.left = g + "px";
                                        a[r] = g;
                                        a.doTransform = !0
                                    },
                                    translateYSetter: function(g, r) {
                                        f.top = g + "px";
                                        a[r] = g;
                                        a.doTransform = !0
                                    }
                                });
                                d(a, f)
                            })
                        }
                    } else b = e;
                    b.appendChild(h);
                    p.added = !0;
                    p.alignOnAdd && p.htmlUpdateTransform();
                    return p
                });
                return p
            }
        })
    })(J);
    (function(a) {
        function B() {
            var c = a.defaultOptions.global,
                n = d.moment;
            if (c.timezone) {
                if (n) return function(a) {
                    return -n.tz(a, c.timezone).utcOffset()
                };
                a.error(25)
            }
            return c.useUTC && c.getTimezoneOffset
        }

        function x() {
            var m = a.defaultOptions.global,
                n, k = m.useUTC,
                l = k ? "getUTC" : "get",
                b = k ? "setUTC" : "set";
            a.Date = n = m.Date || d.Date;
            n.hcTimezoneOffset =
                k && m.timezoneOffset;
            n.hcGetTimezoneOffset = B();
            n.hcMakeTime = function(a, b, l, e, p, h) {
                var d;
                k ? (d = n.UTC.apply(0, arguments), d += F(d)) : d = (new n(a, b, c(l, 1), c(e, 0), c(p, 0), c(h, 0))).getTime();
                return d
            };
            D("Minutes Hours Day Date Month FullYear".split(" "), function(a) {
                n["hcGet" + a] = l + a
            });
            D("Milliseconds Seconds Minutes Hours Date Month FullYear".split(" "), function(a) {
                n["hcSet" + a] = b + a
            })
        }
        var D = a.each,
            F = a.getTZOffset,
            q = a.merge,
            c = a.pick,
            d = a.win;
        a.defaultOptions = {
            symbols: ["circle", "diamond", "square", "triangle", "triangle-down"],
            lang: {
                loading: "Loading...",
                months: "January February March April May June July August September October November December".split(" "),
                shortMonths: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
                weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
                decimalPoint: ".",
                numericSymbols: "kMGTPE".split(""),
                resetZoom: "Reset zoom",
                resetZoomTitle: "Reset zoom level 1:1",
                thousandsSep: " "
            },
            global: {
                useUTC: !0
            },
            chart: {
                borderRadius: 0,
                colorCount: 10,
                defaultSeriesType: "line",
                ignoreHiddenSeries: !0,
                spacing: [10, 10, 15, 10],
                resetZoomButton: {
                    theme: {
                        zIndex: 20
                    },
                    position: {
                        align: "right",
                        x: -10,
                        y: 10
                    }
                },
                width: null,
                height: null
            },
            title: {
                text: "Chart title",
                align: "center",
                margin: 15,
                widthAdjust: -44
            },
            subtitle: {
                text: "",
                align: "center",
                widthAdjust: -44
            },
            plotOptions: {},
            labels: {
                style: {
                    position: "absolute",
                    color: "#333333"
                }
            },
            legend: {
                enabled: !0,
                align: "center",
                layout: "horizontal",
                labelFormatter: function() {
                    return this.name
                },
                borderColor: "#999999",
                borderRadius: 0,
                navigation: {},
                itemCheckboxStyle: {
                    position: "absolute",
                    width: "13px",
                    height: "13px"
                },
                squareSymbol: !0,
                symbolPadding: 5,
                verticalAlign: "bottom",
                x: 0,
                y: 0,
                title: {}
            },
            loading: {},
            tooltip: {
                enabled: !0,
                animation: a.svg,
                borderRadius: 3,
                dateTimeLabelFormats: {
                    millisecond: "%A, %b %e, %H:%M:%S.%L",
                    second: "%A, %b %e, %H:%M:%S",
                    minute: "%A, %b %e, %H:%M",
                    hour: "%A, %b %e, %H:%M",
                    day: "%A, %b %e, %Y",
                    week: "Week from %A, %b %e, %Y",
                    month: "%B %Y",
                    year: "%Y"
                },
                footerFormat: "",
                padding: 8,
                snap: a.isTouchDevice ? 25 : 10,
                headerFormat: '\x3cspan class\x3d"highcharts-header"\x3e{point.key}\x3c/span\x3e\x3cbr/\x3e',
                pointFormat: '\x3cspan class\x3d"highcharts-color-{point.colorIndex}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e'
            },
            credits: {
                enabled: !0,
                href: "http://www.highcharts.com",
                position: {
                    align: "right",
                    x: -10,
                    verticalAlign: "bottom",
                    y: -5
                },
                text: "Highcharts.com"
            }
        };
        a.setOptions = function(c) {
            a.defaultOptions = q(!0, a.defaultOptions, c);
            x();
            return a.defaultOptions
        };
        a.getOptions = function() {
            return a.defaultOptions
        };
        a.defaultPlotOptions = a.defaultOptions.plotOptions;
        x()
    })(J);
    (function(a) {
        var B =
            a.arrayMax,
            x = a.arrayMin,
            D = a.defined,
            F = a.destroyObjectProperties,
            q = a.each,
            c = a.erase,
            d = a.merge,
            m = a.pick;
        a.PlotLineOrBand = function(a, c) {
            this.axis = a;
            c && (this.options = c, this.id = c.id)
        };
        a.PlotLineOrBand.prototype = {
            render: function() {
                var a = this,
                    c = a.axis,
                    l = c.horiz,
                    b = a.options,
                    E = b.label,
                    w = a.label,
                    t = b.to,
                    e = b.from,
                    p = b.value,
                    h = D(e) && D(t),
                    I = D(p),
                    v = a.svgElem,
                    C = !v,
                    G = [],
                    y, f = m(b.zIndex, 0),
                    A = b.events,
                    G = {
                        "class": "highcharts-plot-" + (h ? "band " : "line ") + (b.className || "")
                    },
                    u = {},
                    q = c.chart.renderer,
                    H = h ? "bands" : "lines",
                    g;
                g =
                    c.log2lin;
                c.isLog && (e = g(e), t = g(t), p = g(p));
                u.zIndex = f;
                H += "-" + f;
                (g = c[H]) || (c[H] = g = q.g("plot-" + H).attr(u).add());
                C && (a.svgElem = v = q.path().attr(G).add(g));
                if (I) G = c.getPlotLinePath(p, v.strokeWidth());
                else if (h) G = c.getPlotBandPath(e, t, b);
                else return;
                if (C && G && G.length) {
                    if (v.attr({
                            d: G
                        }), A)
                        for (y in b = function(g) {
                                v.on(g, function(r) {
                                    A[g].apply(a, [r])
                                })
                            }, A) b(y)
                } else v && (G ? (v.show(), v.animate({
                    d: G
                })) : (v.hide(), w && (a.label = w = w.destroy())));
                E && D(E.text) && G && G.length && 0 < c.width && 0 < c.height && !G.flat ? (E = d({
                    align: l &&
                        h && "center",
                    x: l ? !h && 4 : 10,
                    verticalAlign: !l && h && "middle",
                    y: l ? h ? 16 : 10 : h ? 6 : -4,
                    rotation: l && !h && 90
                }, E), this.renderLabel(E, G, h, f)) : w && w.hide();
                return a
            },
            renderLabel: function(a, c, l, b) {
                var d = this.label,
                    k = this.axis.chart.renderer;
                d || (d = {
                    align: a.textAlign || a.align,
                    rotation: a.rotation,
                    "class": "highcharts-plot-" + (l ? "band" : "line") + "-label " + (a.className || "")
                }, d.zIndex = b, this.label = d = k.text(a.text, 0, 0, a.useHTML).attr(d).add());
                b = [c[1], c[4], l ? c[6] : c[1]];
                c = [c[2], c[5], l ? c[7] : c[2]];
                l = x(b);
                k = x(c);
                d.align(a, !1, {
                    x: l,
                    y: k,
                    width: B(b) - l,
                    height: B(c) - k
                });
                d.show()
            },
            destroy: function() {
                c(this.axis.plotLinesAndBands, this);
                delete this.axis;
                F(this)
            }
        };
        a.AxisPlotLineOrBandExtension = {
            getPlotBandPath: function(a, c) {
                c = this.getPlotLinePath(c, null, null, !0);
                (a = this.getPlotLinePath(a, null, null, !0)) && c ? (a.flat = a.toString() === c.toString(), a.push(c[4], c[5], c[1], c[2], "z")) : a = null;
                return a
            },
            addPlotBand: function(a) {
                return this.addPlotBandOrLine(a, "plotBands")
            },
            addPlotLine: function(a) {
                return this.addPlotBandOrLine(a, "plotLines")
            },
            addPlotBandOrLine: function(c,
                d) {
                var l = (new a.PlotLineOrBand(this, c)).render(),
                    b = this.userOptions;
                l && (d && (b[d] = b[d] || [], b[d].push(c)), this.plotLinesAndBands.push(l));
                return l
            },
            removePlotBandOrLine: function(a) {
                for (var d = this.plotLinesAndBands, l = this.options, b = this.userOptions, m = d.length; m--;) d[m].id === a && d[m].destroy();
                q([l.plotLines || [], b.plotLines || [], l.plotBands || [], b.plotBands || []], function(b) {
                    for (m = b.length; m--;) b[m].id === a && c(b, b[m])
                })
            }
        }
    })(J);
    (function(a) {
        var B = a.correctFloat,
            x = a.defined,
            D = a.destroyObjectProperties,
            F = a.isNumber,
            q = a.pick,
            c = a.deg2rad;
        a.Tick = function(a, c, n, k) {
            this.axis = a;
            this.pos = c;
            this.type = n || "";
            this.isNew = !0;
            n || k || this.addLabel()
        };
        a.Tick.prototype = {
            addLabel: function() {
                var a = this.axis,
                    c = a.options,
                    n = a.chart,
                    k = a.categories,
                    l = a.names,
                    b = this.pos,
                    E = c.labels,
                    w = a.tickPositions,
                    t = b === w[0],
                    e = b === w[w.length - 1],
                    l = k ? q(k[b], l[b], b) : b,
                    k = this.label,
                    w = w.info,
                    p;
                a.isDatetimeAxis && w && (p = c.dateTimeLabelFormats[w.higherRanks[b] || w.unitName]);
                this.isFirst = t;
                this.isLast = e;
                c = a.labelFormatter.call({
                    axis: a,
                    chart: n,
                    isFirst: t,
                    isLast: e,
                    dateTimeLabelFormat: p,
                    value: a.isLog ? B(a.lin2log(l)) : l
                });
                x(k) ? k && k.attr({
                    text: c
                }) : (this.labelLength = (this.label = k = x(c) && E.enabled ? n.renderer.text(c, 0, 0, E.useHTML).add(a.labelGroup) : null) && k.getBBox().width, this.rotation = 0)
            },
            getLabelSize: function() {
                return this.label ? this.label.getBBox()[this.axis.horiz ? "height" : "width"] : 0
            },
            handleOverflow: function(a) {
                var d = this.axis,
                    n = a.x,
                    k = d.chart.chartWidth,
                    l = d.chart.spacing,
                    b = q(d.labelLeft, Math.min(d.pos, l[3])),
                    l = q(d.labelRight, Math.max(d.pos + d.len, k - l[1])),
                    E = this.label,
                    w = this.rotation,
                    t = {
                        left: 0,
                        center: .5,
                        right: 1
                    }[d.labelAlign],
                    e = E.getBBox().width,
                    p = d.getSlotWidth(),
                    h = p,
                    I = 1,
                    v, C = {};
                if (w) 0 > w && n - t * e < b ? v = Math.round(n / Math.cos(w * c) - b) : 0 < w && n + t * e > l && (v = Math.round((k - n) / Math.cos(w * c)));
                else if (k = n + (1 - t) * e, n - t * e < b ? h = a.x + h * (1 - t) - b : k > l && (h = l - a.x + h * t, I = -1), h = Math.min(p, h), h < p && "center" === d.labelAlign && (a.x += I * (p - h - t * (p - Math.min(e, h)))), e > h || d.autoRotation && (E.styles || {}).width) v = h;
                v && (C.width = v, (d.options.labels.style || {}).textOverflow || (C.textOverflow = "ellipsis"), E.css(C))
            },
            getPosition: function(a, c, n, k) {
                var l = this.axis,
                    b = l.chart,
                    d = k && b.oldChartHeight || b.chartHeight;
                return {
                    x: a ? l.translate(c + n, null, null, k) + l.transB : l.left + l.offset + (l.opposite ? (k && b.oldChartWidth || b.chartWidth) - l.right - l.left : 0),
                    y: a ? d - l.bottom + l.offset - (l.opposite ? l.height : 0) : d - l.translate(c + n, null, null, k) - l.transB
                }
            },
            getLabelPosition: function(a, m, n, k, l, b, E, w) {
                var d = this.axis,
                    e = d.transA,
                    p = d.reversed,
                    h = d.staggerLines,
                    I = d.tickRotCorr || {
                        x: 0,
                        y: 0
                    },
                    v = l.y;
                x(v) || (v = 0 === d.side ? n.rotation ? -8 : -n.getBBox().height : 2 ===
                    d.side ? I.y + 8 : Math.cos(n.rotation * c) * (I.y - n.getBBox(!1, 0).height / 2));
                a = a + l.x + I.x - (b && k ? b * e * (p ? -1 : 1) : 0);
                m = m + v - (b && !k ? b * e * (p ? 1 : -1) : 0);
                h && (n = E / (w || 1) % h, d.opposite && (n = h - n - 1), m += d.labelOffset / h * n);
                return {
                    x: a,
                    y: Math.round(m)
                }
            },
            getMarkPath: function(a, c, n, k, l, b) {
                return b.crispLine(["M", a, c, "L", a + (l ? 0 : -n), c + (l ? n : 0)], k)
            },
            render: function(a, c, n) {
                var d = this.axis,
                    l = d.options,
                    b = d.chart.renderer,
                    m = d.horiz,
                    w = this.type,
                    t = this.label,
                    e = this.pos,
                    p = l.labels,
                    h = this.gridLine,
                    I = d.tickSize(w ? w + "Tick" : "tick"),
                    v = this.mark,
                    C = !v,
                    G = p.step,
                    y = {},
                    f = !0,
                    A = d.tickmarkOffset,
                    u = this.getPosition(m, e, A, c),
                    L = u.x,
                    u = u.y,
                    H = m && L === d.pos + d.len || !m && u === d.pos ? -1 : 1;
                n = q(n, 1);
                this.isActive = !0;
                h || (w || (y.zIndex = 1), c && (y.opacity = 0), this.gridLine = h = b.path().attr(y).addClass("highcharts-" + (w ? w + "-" : "") + "grid-line").add(d.gridGroup));
                if (!c && h && (e = d.getPlotLinePath(e + A, h.strokeWidth() * H, c, !0))) h[this.isNew ? "attr" : "animate"]({
                    d: e,
                    opacity: n
                });
                I && (d.opposite && (I[0] = -I[0]), C && (this.mark = v = b.path().addClass("highcharts-" + (w ? w + "-" : "") + "tick").add(d.axisGroup)),
                    v[C ? "attr" : "animate"]({
                        d: this.getMarkPath(L, u, I[0], v.strokeWidth() * H, m, b),
                        opacity: n
                    }));
                t && F(L) && (t.xy = u = this.getLabelPosition(L, u, t, m, p, A, a, G), this.isFirst && !this.isLast && !q(l.showFirstLabel, 1) || this.isLast && !this.isFirst && !q(l.showLastLabel, 1) ? f = !1 : !m || d.isRadial || p.step || p.rotation || c || 0 === n || this.handleOverflow(u), G && a % G && (f = !1), f && F(u.y) ? (u.opacity = n, t[this.isNew ? "attr" : "animate"](u)) : t.attr("y", -9999), this.isNew = !1)
            },
            destroy: function() {
                D(this, this.axis)
            }
        }
    })(J);
    (function(a) {
        var B = a.addEvent,
            x =
            a.animObject,
            D = a.arrayMax,
            F = a.arrayMin,
            q = a.AxisPlotLineOrBandExtension,
            c = a.correctFloat,
            d = a.defaultOptions,
            m = a.defined,
            n = a.deg2rad,
            k = a.destroyObjectProperties,
            l = a.each,
            b = a.extend,
            E = a.fireEvent,
            w = a.format,
            t = a.getMagnitude,
            e = a.grep,
            p = a.inArray,
            h = a.isArray,
            I = a.isNumber,
            v = a.isString,
            C = a.merge,
            G = a.normalizeTickInterval,
            y = a.pick,
            f = a.PlotLineOrBand,
            A = a.removeEvent,
            u = a.splat,
            L = a.syncTimeout,
            H = a.Tick;
        a.Axis = function() {
            this.init.apply(this, arguments)
        };
        a.Axis.prototype = {
            defaultOptions: {
                dateTimeLabelFormats: {
                    millisecond: "%H:%M:%S.%L",
                    second: "%H:%M:%S",
                    minute: "%H:%M",
                    hour: "%H:%M",
                    day: "%e. %b",
                    week: "%e. %b",
                    month: "%b '%y",
                    year: "%Y"
                },
                endOnTick: !1,
                labels: {
                    enabled: !0,
                    x: 0
                },
                minPadding: .01,
                maxPadding: .01,
                minorTickLength: 2,
                minorTickPosition: "outside",
                startOfWeek: 1,
                startOnTick: !1,
                tickLength: 10,
                tickmarkPlacement: "between",
                tickPixelInterval: 100,
                tickPosition: "outside",
                title: {
                    align: "middle"
                },
                type: "linear"
            },
            defaultYAxisOptions: {
                endOnTick: !0,
                tickPixelInterval: 72,
                showLastLabel: !0,
                labels: {
                    x: -8
                },
                maxPadding: .05,
                minPadding: .05,
                startOnTick: !0,
                title: {
                    rotation: 270,
                    text: "Values"
                },
                stackLabels: {
                    enabled: !1,
                    formatter: function() {
                        return a.numberFormat(this.total, -1)
                    }
                }
            },
            defaultLeftAxisOptions: {
                labels: {
                    x: -15
                },
                title: {
                    rotation: 270
                }
            },
            defaultRightAxisOptions: {
                labels: {
                    x: 15
                },
                title: {
                    rotation: 90
                }
            },
            defaultBottomAxisOptions: {
                labels: {
                    autoRotation: [-45],
                    x: 0
                },
                title: {
                    rotation: 0
                }
            },
            defaultTopAxisOptions: {
                labels: {
                    autoRotation: [-45],
                    x: 0
                },
                title: {
                    rotation: 0
                }
            },
            init: function(a, r) {
                var g = r.isX;
                this.chart = a;
                this.horiz = a.inverted ? !g : g;
                this.isXAxis = g;
                this.coll = this.coll || (g ? "xAxis" : "yAxis");
                this.opposite = r.opposite;
                this.side = r.side || (this.horiz ? this.opposite ? 0 : 2 : this.opposite ? 1 : 3);
                this.setOptions(r);
                var b = this.options,
                    e = b.type;
                this.labelFormatter = b.labels.formatter || this.defaultLabelFormatter;
                this.userOptions = r;
                this.minPixelPadding = 0;
                this.reversed = b.reversed;
                this.visible = !1 !== b.visible;
                this.zoomEnabled = !1 !== b.zoomEnabled;
                this.hasNames = "category" === e || !0 === b.categories;
                this.categories = b.categories || this.hasNames;
                this.names = this.names || [];
                this.isLog = "logarithmic" === e;
                this.isDatetimeAxis =
                    "datetime" === e;
                this.isLinked = m(b.linkedTo);
                this.ticks = {};
                this.labelEdge = [];
                this.minorTicks = {};
                this.plotLinesAndBands = [];
                this.alternateBands = {};
                this.len = 0;
                this.minRange = this.userMinRange = b.minRange || b.maxZoom;
                this.range = b.range;
                this.offset = b.offset || 0;
                this.stacks = {};
                this.oldStacks = {};
                this.stacksTouched = 0;
                this.min = this.max = null;
                this.crosshair = y(b.crosshair, u(a.options.tooltip.crosshairs)[g ? 0 : 1], !1);
                var f;
                r = this.options.events; - 1 === p(this, a.axes) && (g ? a.axes.splice(a.xAxis.length, 0, this) : a.axes.push(this),
                    a[this.coll].push(this));
                this.series = this.series || [];
                a.inverted && g && void 0 === this.reversed && (this.reversed = !0);
                this.removePlotLine = this.removePlotBand = this.removePlotBandOrLine;
                for (f in r) B(this, f, r[f]);
                this.isLog && (this.val2lin = this.log2lin, this.lin2val = this.lin2log)
            },
            setOptions: function(a) {
                this.options = C(this.defaultOptions, "yAxis" === this.coll && this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side],
                    C(d[this.coll], a))
            },
            defaultLabelFormatter: function() {
                var g = this.axis,
                    r = this.value,
                    b = g.categories,
                    e = this.dateTimeLabelFormat,
                    f = d.lang,
                    h = f.numericSymbols,
                    f = f.numericSymbolMagnitude || 1E3,
                    p = h && h.length,
                    c, l = g.options.labels.format,
                    g = g.isLog ? r : g.tickInterval;
                if (l) c = w(l, this);
                else if (b) c = r;
                else if (e) c = a.dateFormat(e, r);
                else if (p && 1E3 <= g)
                    for (; p-- && void 0 === c;) b = Math.pow(f, p + 1), g >= b && 0 === 10 * r % b && null !== h[p] && 0 !== r && (c = a.numberFormat(r / b, -1) + h[p]);
                void 0 === c && (c = 1E4 <= Math.abs(r) ? a.numberFormat(r, -1) : a.numberFormat(r, -1, void 0, ""));
                return c
            },
            getSeriesExtremes: function() {
                var a = this,
                    r = a.chart;
                a.hasVisibleSeries = !1;
                a.dataMin = a.dataMax = a.threshold = null;
                a.softThreshold = !a.isXAxis;
                a.buildStacks && a.buildStacks();
                l(a.series, function(g) {
                    if (g.visible || !r.options.chart.ignoreHiddenSeries) {
                        var b = g.options,
                            f = b.threshold,
                            h;
                        a.hasVisibleSeries = !0;
                        a.isLog && 0 >= f && (f = null);
                        if (a.isXAxis) b = g.xData, b.length && (g = F(b), I(g) || g instanceof Date || (b = e(b, function(a) {
                                return I(a)
                            }), g = F(b)), a.dataMin = Math.min(y(a.dataMin, b[0]), g), a.dataMax =
                            Math.max(y(a.dataMax, b[0]), D(b)));
                        else if (g.getExtremes(), h = g.dataMax, g = g.dataMin, m(g) && m(h) && (a.dataMin = Math.min(y(a.dataMin, g), g), a.dataMax = Math.max(y(a.dataMax, h), h)), m(f) && (a.threshold = f), !b.softThreshold || a.isLog) a.softThreshold = !1
                    }
                })
            },
            translate: function(a, r, b, e, f, h) {
                var g = this.linkedParent || this,
                    p = 1,
                    c = 0,
                    l = e ? g.oldTransA : g.transA;
                e = e ? g.oldMin : g.min;
                var d = g.minPixelPadding;
                f = (g.isOrdinal || g.isBroken || g.isLog && f) && g.lin2val;
                l || (l = g.transA);
                b && (p *= -1, c = g.len);
                g.reversed && (p *= -1, c -= p * (g.sector || g.len));
                r ? (a = (a * p + c - d) / l + e, f && (a = g.lin2val(a))) : (f && (a = g.val2lin(a)), a = p * (a - e) * l + c + p * d + (I(h) ? l * h : 0));
                return a
            },
            toPixels: function(a, r) {
                return this.translate(a, !1, !this.horiz, null, !0) + (r ? 0 : this.pos)
            },
            toValue: function(a, r) {
                return this.translate(a - (r ? 0 : this.pos), !0, !this.horiz, null, !0)
            },
            getPlotLinePath: function(a, r, b, e, f) {
                var g = this.chart,
                    h = this.left,
                    p = this.top,
                    c, l, d = b && g.oldChartHeight || g.chartHeight,
                    v = b && g.oldChartWidth || g.chartWidth,
                    u;
                c = this.transB;
                var k = function(a, g, r) {
                    if (a < g || a > r) e ? a = Math.min(Math.max(g,
                        a), r) : u = !0;
                    return a
                };
                f = y(f, this.translate(a, null, null, b));
                a = b = Math.round(f + c);
                c = l = Math.round(d - f - c);
                I(f) ? this.horiz ? (c = p, l = d - this.bottom, a = b = k(a, h, h + this.width)) : (a = h, b = v - this.right, c = l = k(c, p, p + this.height)) : u = !0;
                return u && !e ? null : g.renderer.crispLine(["M", a, c, "L", b, l], r || 1)
            },
            getLinearTickPositions: function(a, r, b) {
                var g, e = c(Math.floor(r / a) * a),
                    f = c(Math.ceil(b / a) * a),
                    h = [];
                if (r === b && I(r)) return [r];
                for (r = e; r <= f;) {
                    h.push(r);
                    r = c(r + a);
                    if (r === g) break;
                    g = r
                }
                return h
            },
            getMinorTickPositions: function() {
                var a = this.options,
                    r = this.tickPositions,
                    b = this.minorTickInterval,
                    e = [],
                    f, h = this.pointRangePadding || 0;
                f = this.min - h;
                var h = this.max + h,
                    p = h - f;
                if (p && p / b < this.len / 3)
                    if (this.isLog)
                        for (h = r.length, f = 1; f < h; f++) e = e.concat(this.getLogTickPositions(b, r[f - 1], r[f], !0));
                    else if (this.isDatetimeAxis && "auto" === a.minorTickInterval) e = e.concat(this.getTimeTicks(this.normalizeTimeTickInterval(b), f, h, a.startOfWeek));
                else
                    for (r = f + (r[0] - f) % b; r <= h && r !== e[0]; r += b) e.push(r);
                0 !== e.length && this.trimTicks(e, a.startOnTick, a.endOnTick);
                return e
            },
            adjustForMinRange: function() {
                var a =
                    this.options,
                    r = this.min,
                    b = this.max,
                    e, f = this.dataMax - this.dataMin >= this.minRange,
                    h, p, c, d, v, u;
                this.isXAxis && void 0 === this.minRange && !this.isLog && (m(a.min) || m(a.max) ? this.minRange = null : (l(this.series, function(a) {
                    d = a.xData;
                    for (p = v = a.xIncrement ? 1 : d.length - 1; 0 < p; p--)
                        if (c = d[p] - d[p - 1], void 0 === h || c < h) h = c
                }), this.minRange = Math.min(5 * h, this.dataMax - this.dataMin)));
                b - r < this.minRange && (u = this.minRange, e = (u - b + r) / 2, e = [r - e, y(a.min, r - e)], f && (e[2] = this.isLog ? this.log2lin(this.dataMin) : this.dataMin), r = D(e), b = [r + u, y(a.max,
                    r + u)], f && (b[2] = this.isLog ? this.log2lin(this.dataMax) : this.dataMax), b = F(b), b - r < u && (e[0] = b - u, e[1] = y(a.min, b - u), r = D(e)));
                this.min = r;
                this.max = b
            },
            getClosest: function() {
                var a;
                this.categories ? a = 1 : l(this.series, function(g) {
                    var b = g.closestPointRange,
                        r = g.visible || !g.chart.options.chart.ignoreHiddenSeries;
                    !g.noSharedTooltip && m(b) && r && (a = m(a) ? Math.min(a, b) : b)
                });
                return a
            },
            nameToX: function(a) {
                var g = h(this.categories),
                    b = g ? this.categories : this.names,
                    e = a.options.x,
                    f;
                a.series.requireSorting = !1;
                m(e) || (e = !1 === this.options.uniqueNames ?
                    a.series.autoIncrement() : p(a.name, b)); - 1 === e ? g || (f = b.length) : f = e;
                this.names[f] = a.name;
                return f
            },
            updateNames: function() {
                var a = this;
                0 < this.names.length && (this.names.length = 0, this.minRange = void 0, l(this.series || [], function(g) {
                    g.xIncrement = null;
                    if (!g.points || g.isDirtyData) g.processData(), g.generatePoints();
                    l(g.points, function(b, r) {
                        var e;
                        b.options && (e = a.nameToX(b), e !== b.x && (b.x = e, g.xData[r] = e))
                    })
                }))
            },
            setAxisTranslation: function(a) {
                var g = this,
                    b = g.max - g.min,
                    e = g.axisPointRange || 0,
                    f, h = 0,
                    p = 0,
                    c = g.linkedParent,
                    d = !!g.categories,
                    u = g.transA,
                    k = g.isXAxis;
                if (k || d || e) f = g.getClosest(), c ? (h = c.minPointOffset, p = c.pointRangePadding) : l(g.series, function(a) {
                    var b = d ? 1 : k ? y(a.options.pointRange, f, 0) : g.axisPointRange || 0;
                    a = a.options.pointPlacement;
                    e = Math.max(e, b);
                    g.single || (h = Math.max(h, v(a) ? 0 : b / 2), p = Math.max(p, "on" === a ? 0 : b))
                }), c = g.ordinalSlope && f ? g.ordinalSlope / f : 1, g.minPointOffset = h *= c, g.pointRangePadding = p *= c, g.pointRange = Math.min(e, b), k && (g.closestPointRange = f);
                a && (g.oldTransA = u);
                g.translationSlope = g.transA = u = g.len / (b +
                    p || 1);
                g.transB = g.horiz ? g.left : g.bottom;
                g.minPixelPadding = u * h
            },
            minFromRange: function() {
                return this.max - this.range
            },
            setTickInterval: function(g) {
                var b = this,
                    e = b.chart,
                    f = b.options,
                    h = b.isLog,
                    p = b.log2lin,
                    d = b.isDatetimeAxis,
                    v = b.isXAxis,
                    u = b.isLinked,
                    k = f.maxPadding,
                    A = f.minPadding,
                    C = f.tickInterval,
                    w = f.tickPixelInterval,
                    n = b.categories,
                    H = b.threshold,
                    q = b.softThreshold,
                    L, B, x, D;
                d || n || u || this.getTickAmount();
                x = y(b.userMin, f.min);
                D = y(b.userMax, f.max);
                u ? (b.linkedParent = e[b.coll][f.linkedTo], e = b.linkedParent.getExtremes(),
                    b.min = y(e.min, e.dataMin), b.max = y(e.max, e.dataMax), f.type !== b.linkedParent.options.type && a.error(11, 1)) : (!q && m(H) && (b.dataMin >= H ? (L = H, A = 0) : b.dataMax <= H && (B = H, k = 0)), b.min = y(x, L, b.dataMin), b.max = y(D, B, b.dataMax));
                h && (!g && 0 >= Math.min(b.min, y(b.dataMin, b.min)) && a.error(10, 1), b.min = c(p(b.min), 15), b.max = c(p(b.max), 15));
                b.range && m(b.max) && (b.userMin = b.min = x = Math.max(b.min, b.minFromRange()), b.userMax = D = b.max, b.range = null);
                E(b, "foundExtremes");
                b.beforePadding && b.beforePadding();
                b.adjustForMinRange();
                !(n || b.axisPointRange ||
                    b.usePercentage || u) && m(b.min) && m(b.max) && (p = b.max - b.min) && (!m(x) && A && (b.min -= p * A), !m(D) && k && (b.max += p * k));
                I(f.floor) ? b.min = Math.max(b.min, f.floor) : I(f.softMin) && (b.min = Math.min(b.min, f.softMin));
                I(f.ceiling) ? b.max = Math.min(b.max, f.ceiling) : I(f.softMax) && (b.max = Math.max(b.max, f.softMax));
                q && m(b.dataMin) && (H = H || 0, !m(x) && b.min < H && b.dataMin >= H ? b.min = H : !m(D) && b.max > H && b.dataMax <= H && (b.max = H));
                b.tickInterval = b.min === b.max || void 0 === b.min || void 0 === b.max ? 1 : u && !C && w === b.linkedParent.options.tickPixelInterval ?
                    C = b.linkedParent.tickInterval : y(C, this.tickAmount ? (b.max - b.min) / Math.max(this.tickAmount - 1, 1) : void 0, n ? 1 : (b.max - b.min) * w / Math.max(b.len, w));
                v && !g && l(b.series, function(a) {
                    a.processData(b.min !== b.oldMin || b.max !== b.oldMax)
                });
                b.setAxisTranslation(!0);
                b.beforeSetTickPositions && b.beforeSetTickPositions();
                b.postProcessTickInterval && (b.tickInterval = b.postProcessTickInterval(b.tickInterval));
                b.pointRange && !C && (b.tickInterval = Math.max(b.pointRange, b.tickInterval));
                g = y(f.minTickInterval, b.isDatetimeAxis && b.closestPointRange);
                !C && b.tickInterval < g && (b.tickInterval = g);
                d || h || C || (b.tickInterval = G(b.tickInterval, null, t(b.tickInterval), y(f.allowDecimals, !(.5 < b.tickInterval && 5 > b.tickInterval && 1E3 < b.max && 9999 > b.max)), !!this.tickAmount));
                this.tickAmount || (b.tickInterval = b.unsquish());
                this.setTickPositions()
            },
            setTickPositions: function() {
                var a = this.options,
                    b, e = a.tickPositions,
                    f = a.tickPositioner,
                    h = a.startOnTick,
                    p = a.endOnTick,
                    c;
                this.tickmarkOffset = this.categories && "between" === a.tickmarkPlacement && 1 === this.tickInterval ? .5 : 0;
                this.minorTickInterval =
                    "auto" === a.minorTickInterval && this.tickInterval ? this.tickInterval / 5 : a.minorTickInterval;
                this.tickPositions = b = e && e.slice();
                !b && (b = this.isDatetimeAxis ? this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval, a.units), this.min, this.max, a.startOfWeek, this.ordinalPositions, this.closestPointRange, !0) : this.isLog ? this.getLogTickPositions(this.tickInterval, this.min, this.max) : this.getLinearTickPositions(this.tickInterval, this.min, this.max), b.length > this.len && (b = [b[0], b.pop()]), this.tickPositions =
                    b, f && (f = f.apply(this, [this.min, this.max]))) && (this.tickPositions = b = f);
                this.trimTicks(b, h, p);
                this.isLinked || (this.min === this.max && m(this.min) && !this.tickAmount && (c = !0, this.min -= .5, this.max += .5), this.single = c, e || f || this.adjustTickAmount())
            },
            trimTicks: function(a, b, e) {
                var g = a[0],
                    f = a[a.length - 1],
                    h = this.minPointOffset || 0;
                if (!this.isLinked) {
                    if (b) this.min = g;
                    else
                        for (; this.min - h > a[0];) a.shift();
                    if (e) this.max = f;
                    else
                        for (; this.max + h < a[a.length - 1];) a.pop();
                    0 === a.length && m(g) && a.push((f + g) / 2)
                }
            },
            alignToOthers: function() {
                var a = {},
                    b, e = this.options;
                !1 === this.chart.options.chart.alignTicks || !1 === e.alignTicks || this.isLog || l(this.chart[this.coll], function(g) {
                    var e = g.options,
                        e = [g.horiz ? e.left : e.top, e.width, e.height, e.pane].join();
                    g.series.length && (a[e] ? b = !0 : a[e] = 1)
                });
                return b
            },
            getTickAmount: function() {
                var a = this.options,
                    b = a.tickAmount,
                    e = a.tickPixelInterval;
                !m(a.tickInterval) && this.len < e && !this.isRadial && !this.isLog && a.startOnTick && a.endOnTick && (b = 2);
                !b && this.alignToOthers() && (b = Math.ceil(this.len / e) + 1);
                4 > b && (this.finalTickAmt =
                    b, b = 5);
                this.tickAmount = b
            },
            adjustTickAmount: function() {
                var a = this.tickInterval,
                    b = this.tickPositions,
                    e = this.tickAmount,
                    f = this.finalTickAmt,
                    h = b && b.length;
                if (h < e) {
                    for (; b.length < e;) b.push(c(b[b.length - 1] + a));
                    this.transA *= (h - 1) / (e - 1);
                    this.max = b[b.length - 1]
                } else h > e && (this.tickInterval *= 2, this.setTickPositions());
                if (m(f)) {
                    for (a = e = b.length; a--;)(3 === f && 1 === a % 2 || 2 >= f && 0 < a && a < e - 1) && b.splice(a, 1);
                    this.finalTickAmt = void 0
                }
            },
            setScale: function() {
                var a, b;
                this.oldMin = this.min;
                this.oldMax = this.max;
                this.oldAxisLength =
                    this.len;
                this.setAxisSize();
                b = this.len !== this.oldAxisLength;
                l(this.series, function(b) {
                    if (b.isDirtyData || b.isDirty || b.xAxis.isDirty) a = !0
                });
                b || a || this.isLinked || this.forceRedraw || this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax || this.alignToOthers() ? (this.resetStacks && this.resetStacks(), this.forceRedraw = !1, this.getSeriesExtremes(), this.setTickInterval(), this.oldUserMin = this.userMin, this.oldUserMax = this.userMax, this.isDirty || (this.isDirty = b || this.min !== this.oldMin || this.max !== this.oldMax)) :
                    this.cleanStacks && this.cleanStacks()
            },
            setExtremes: function(a, e, f, h, p) {
                var g = this,
                    c = g.chart;
                f = y(f, !0);
                l(g.series, function(a) {
                    delete a.kdTree
                });
                p = b(p, {
                    min: a,
                    max: e
                });
                E(g, "setExtremes", p, function() {
                    g.userMin = a;
                    g.userMax = e;
                    g.eventArgs = p;
                    f && c.redraw(h)
                })
            },
            zoom: function(a, b) {
                var g = this.dataMin,
                    e = this.dataMax,
                    f = this.options,
                    h = Math.min(g, y(f.min, g)),
                    f = Math.max(e, y(f.max, e));
                if (a !== this.min || b !== this.max) this.allowZoomOutside || (m(g) && (a < h && (a = h), a > f && (a = f)), m(e) && (b < h && (b = h), b > f && (b = f))), this.displayBtn = void 0 !==
                    a || void 0 !== b, this.setExtremes(a, b, !1, void 0, {
                        trigger: "zoom"
                    });
                return !0
            },
            setAxisSize: function() {
                var a = this.chart,
                    b = this.options,
                    e = b.offsets || [0, 0, 0, 0],
                    f = this.horiz,
                    h = y(b.width, a.plotWidth - e[3] + e[1]),
                    p = y(b.height, a.plotHeight - e[0] + e[2]),
                    c = y(b.top, a.plotTop + e[0]),
                    b = y(b.left, a.plotLeft + e[3]),
                    e = /%$/;
                e.test(p) && (p = Math.round(parseFloat(p) / 100 * a.plotHeight));
                e.test(c) && (c = Math.round(parseFloat(c) / 100 * a.plotHeight + a.plotTop));
                this.left = b;
                this.top = c;
                this.width = h;
                this.height = p;
                this.bottom = a.chartHeight - p -
                    c;
                this.right = a.chartWidth - h - b;
                this.len = Math.max(f ? h : p, 0);
                this.pos = f ? b : c
            },
            getExtremes: function() {
                var a = this.isLog,
                    b = this.lin2log;
                return {
                    min: a ? c(b(this.min)) : this.min,
                    max: a ? c(b(this.max)) : this.max,
                    dataMin: this.dataMin,
                    dataMax: this.dataMax,
                    userMin: this.userMin,
                    userMax: this.userMax
                }
            },
            getThreshold: function(a) {
                var b = this.isLog,
                    g = this.lin2log,
                    e = b ? g(this.min) : this.min,
                    b = b ? g(this.max) : this.max;
                null === a ? a = e : e > a ? a = e : b < a && (a = b);
                return this.translate(a, 0, 1, 0, 1)
            },
            autoLabelAlign: function(a) {
                a = (y(a, 0) - 90 * this.side +
                    720) % 360;
                return 15 < a && 165 > a ? "right" : 195 < a && 345 > a ? "left" : "center"
            },
            tickSize: function(a) {
                var b = this.options,
                    g = b[a + "Length"],
                    e = y(b[a + "Width"], "tick" === a && this.isXAxis ? 1 : 0);
                if (e && g) return "inside" === b[a + "Position"] && (g = -g), [g, e]
            },
            labelMetrics: function() {
                return this.chart.renderer.fontMetrics(this.options.labels.style && this.options.labels.style.fontSize, this.ticks[0] && this.ticks[0].label)
            },
            unsquish: function() {
                var a = this.options.labels,
                    b = this.horiz,
                    e = this.tickInterval,
                    f = e,
                    h = this.len / (((this.categories ? 1 :
                        0) + this.max - this.min) / e),
                    p, c = a.rotation,
                    d = this.labelMetrics(),
                    u, v = Number.MAX_VALUE,
                    k, t = function(a) {
                        a /= h || 1;
                        a = 1 < a ? Math.ceil(a) : 1;
                        return a * e
                    };
                b ? (k = !a.staggerLines && !a.step && (m(c) ? [c] : h < y(a.autoRotationLimit, 80) && a.autoRotation)) && l(k, function(a) {
                    var b;
                    if (a === c || a && -90 <= a && 90 >= a) u = t(Math.abs(d.h / Math.sin(n * a))), b = u + Math.abs(a / 360), b < v && (v = b, p = a, f = u)
                }) : a.step || (f = t(d.h));
                this.autoRotation = k;
                this.labelRotation = y(p, c);
                return f
            },
            getSlotWidth: function() {
                var a = this.chart,
                    b = this.horiz,
                    e = this.options.labels,
                    f = Math.max(this.tickPositions.length - (this.categories ? 0 : 1), 1),
                    h = a.margin[3];
                return b && 2 > (e.step || 0) && !e.rotation && (this.staggerLines || 1) * this.len / f || !b && (h && h - a.spacing[3] || .33 * a.chartWidth)
            },
            renderUnsquish: function() {
                var a = this.chart,
                    b = a.renderer,
                    e = this.tickPositions,
                    f = this.ticks,
                    h = this.options.labels,
                    p = this.horiz,
                    c = this.getSlotWidth(),
                    d = Math.max(1, Math.round(c - 2 * (h.padding || 5))),
                    u = {},
                    k = this.labelMetrics(),
                    t = h.style && h.style.textOverflow,
                    A, m = 0,
                    y, w;
                v(h.rotation) || (u.rotation = h.rotation || 0);
                l(e, function(a) {
                    (a =
                        f[a]) && a.labelLength > m && (m = a.labelLength)
                });
                this.maxLabelLength = m;
                if (this.autoRotation) m > d && m > k.h ? u.rotation = this.labelRotation : this.labelRotation = 0;
                else if (c && (A = {
                        width: d + "px"
                    }, !t))
                    for (A.textOverflow = "clip", y = e.length; !p && y--;)
                        if (w = e[y], d = f[w].label) d.styles && "ellipsis" === d.styles.textOverflow ? d.css({
                            textOverflow: "clip"
                        }) : f[w].labelLength > c && d.css({
                            width: c + "px"
                        }), d.getBBox().height > this.len / e.length - (k.h - k.f) && (d.specCss = {
                            textOverflow: "ellipsis"
                        });
                u.rotation && (A = {
                    width: (m > .5 * a.chartHeight ? .33 * a.chartHeight :
                        a.chartHeight) + "px"
                }, t || (A.textOverflow = "ellipsis"));
                if (this.labelAlign = h.align || this.autoLabelAlign(this.labelRotation)) u.align = this.labelAlign;
                l(e, function(a) {
                    var b = (a = f[a]) && a.label;
                    b && (b.attr(u), A && b.css(C(A, b.specCss)), delete b.specCss, a.rotation = u.rotation)
                });
                this.tickRotCorr = b.rotCorr(k.b, this.labelRotation || 0, 0 !== this.side)
            },
            hasData: function() {
                return this.hasVisibleSeries || m(this.min) && m(this.max) && !!this.tickPositions
            },
            addTitle: function(a) {
                var b = this.chart.renderer,
                    g = this.horiz,
                    e = this.opposite,
                    f = this.options.title,
                    h;
                this.axisTitle || ((h = f.textAlign) || (h = (g ? {
                    low: "left",
                    middle: "center",
                    high: "right"
                } : {
                    low: e ? "right" : "left",
                    middle: "center",
                    high: e ? "left" : "right"
                })[f.align]), this.axisTitle = b.text(f.text, 0, 0, f.useHTML).attr({
                    zIndex: 7,
                    rotation: f.rotation || 0,
                    align: h
                }).addClass("highcharts-axis-title").add(this.axisGroup), this.axisTitle.isNew = !0);
                this.axisTitle[a ? "show" : "hide"](!0)
            },
            generateTick: function(a) {
                var b = this.ticks;
                b[a] ? b[a].addLabel() : b[a] = new H(this, a)
            },
            getOffset: function() {
                var a = this,
                    b =
                    a.chart,
                    e = b.renderer,
                    f = a.options,
                    h = a.tickPositions,
                    p = a.ticks,
                    c = a.horiz,
                    d = a.side,
                    u = b.inverted ? [1, 0, 3, 2][d] : d,
                    v, k, t = 0,
                    A, C = 0,
                    w = f.title,
                    H = f.labels,
                    n = 0,
                    G = b.axisOffset,
                    b = b.clipOffset,
                    I = [-1, 1, 1, -1][d],
                    E, q = f.className,
                    L = a.axisParent,
                    x = this.tickSize("tick");
                v = a.hasData();
                a.showAxis = k = v || y(f.showEmpty, !0);
                a.staggerLines = a.horiz && H.staggerLines;
                a.axisGroup || (a.gridGroup = e.g("grid").attr({
                    zIndex: f.gridZIndex || 1
                }).addClass("highcharts-" + this.coll.toLowerCase() + "-grid " + (q || "")).add(L), a.axisGroup = e.g("axis").attr({
                    zIndex: f.zIndex ||
                        2
                }).addClass("highcharts-" + this.coll.toLowerCase() + " " + (q || "")).add(L), a.labelGroup = e.g("axis-labels").attr({
                    zIndex: H.zIndex || 7
                }).addClass("highcharts-" + a.coll.toLowerCase() + "-labels " + (q || "")).add(L));
                if (v || a.isLinked) l(h, function(b, e) {
                    a.generateTick(b, e)
                }), a.renderUnsquish(), !1 === H.reserveSpace || 0 !== d && 2 !== d && {
                    1: "left",
                    3: "right"
                }[d] !== a.labelAlign && "center" !== a.labelAlign || l(h, function(a) {
                    n = Math.max(p[a].getLabelSize(), n)
                }), a.staggerLines && (n *= a.staggerLines, a.labelOffset = n * (a.opposite ? -1 : 1));
                else
                    for (E in p) p[E].destroy(),
                        delete p[E];
                w && w.text && !1 !== w.enabled && (a.addTitle(k), k && (t = a.axisTitle.getBBox()[c ? "height" : "width"], A = w.offset, C = m(A) ? 0 : y(w.margin, c ? 5 : 10)));
                a.renderLine();
                a.offset = I * y(f.offset, G[d]);
                a.tickRotCorr = a.tickRotCorr || {
                    x: 0,
                    y: 0
                };
                e = 0 === d ? -a.labelMetrics().h : 2 === d ? a.tickRotCorr.y : 0;
                C = Math.abs(n) + C;
                n && (C = C - e + I * (c ? y(H.y, a.tickRotCorr.y + 8 * I) : H.x));
                a.axisTitleMargin = y(A, C);
                G[d] = Math.max(G[d], a.axisTitleMargin + t + I * a.offset, C, v && h.length && x ? x[0] : 0);
                f = f.offset ? 0 : 2 * Math.floor(a.axisLine.strokeWidth() / 2);
                b[u] = Math.max(b[u],
                    f)
            },
            getLinePath: function(a) {
                var b = this.chart,
                    e = this.opposite,
                    f = this.offset,
                    g = this.horiz,
                    h = this.left + (e ? this.width : 0) + f,
                    f = b.chartHeight - this.bottom - (e ? this.height : 0) + f;
                e && (a *= -1);
                return b.renderer.crispLine(["M", g ? this.left : h, g ? f : this.top, "L", g ? b.chartWidth - this.right : h, g ? f : b.chartHeight - this.bottom], a)
            },
            renderLine: function() {
                this.axisLine || (this.axisLine = this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup))
            },
            getTitlePosition: function() {
                var a = this.horiz,
                    b = this.left,
                    e = this.top,
                    f = this.len,
                    h = this.options.title,
                    p = a ? b : e,
                    c = this.opposite,
                    d = this.offset,
                    l = h.x || 0,
                    u = h.y || 0,
                    v = this.chart.renderer.fontMetrics(h.style && h.style.fontSize, this.axisTitle).f,
                    f = {
                        low: p + (a ? 0 : f),
                        middle: p + f / 2,
                        high: p + (a ? f : 0)
                    }[h.align],
                    b = (a ? e + this.height : b) + (a ? 1 : -1) * (c ? -1 : 1) * this.axisTitleMargin + (2 === this.side ? v : 0);
                return {
                    x: a ? f + l : b + (c ? this.width : 0) + d + l,
                    y: a ? b + u - (c ? this.height : 0) + d : f + u
                }
            },
            renderMinorTick: function(a) {
                var b = this.chart.hasRendered && I(this.oldMin),
                    e = this.minorTicks;
                e[a] || (e[a] = new H(this, a, "minor"));
                b &&
                    e[a].isNew && e[a].render(null, !0);
                e[a].render(null, !1, 1)
            },
            renderTick: function(a, b) {
                var e = this.isLinked,
                    f = this.ticks,
                    g = this.chart.hasRendered && I(this.oldMin);
                if (!e || a >= this.min && a <= this.max) f[a] || (f[a] = new H(this, a)), g && f[a].isNew && f[a].render(b, !0, .1), f[a].render(b)
            },
            render: function() {
                var a = this,
                    b = a.chart,
                    e = a.options,
                    h = a.isLog,
                    p = a.lin2log,
                    c = a.isLinked,
                    d = a.tickPositions,
                    u = a.axisTitle,
                    v = a.ticks,
                    k = a.minorTicks,
                    t = a.alternateBands,
                    A = e.stackLabels,
                    m = e.alternateGridColor,
                    C = a.tickmarkOffset,
                    w = a.axisLine,
                    y =
                    a.showAxis,
                    n = x(b.renderer.globalAnimation),
                    G, I;
                a.labelEdge.length = 0;
                a.overlap = !1;
                l([v, k, t], function(a) {
                    for (var b in a) a[b].isActive = !1
                });
                if (a.hasData() || c) a.minorTickInterval && !a.categories && l(a.getMinorTickPositions(), function(b) {
                    a.renderMinorTick(b)
                }), d.length && (l(d, function(b, e) {
                    a.renderTick(b, e)
                }), C && (0 === a.min || a.single) && (v[-1] || (v[-1] = new H(a, -1, null, !0)), v[-1].render(-1))), m && l(d, function(e, g) {
                    I = void 0 !== d[g + 1] ? d[g + 1] + C : a.max - C;
                    0 === g % 2 && e < a.max && I <= a.max + (b.polar ? -C : C) && (t[e] || (t[e] = new f(a)),
                        G = e + C, t[e].options = {
                            from: h ? p(G) : G,
                            to: h ? p(I) : I,
                            color: m
                        }, t[e].render(), t[e].isActive = !0)
                }), a._addedPlotLB || (l((e.plotLines || []).concat(e.plotBands || []), function(b) {
                    a.addPlotBandOrLine(b)
                }), a._addedPlotLB = !0);
                l([v, k, t], function(a) {
                    var e, f, g = [],
                        h = n.duration;
                    for (e in a) a[e].isActive || (a[e].render(e, !1, 0), a[e].isActive = !1, g.push(e));
                    L(function() {
                        for (f = g.length; f--;) a[g[f]] && !a[g[f]].isActive && (a[g[f]].destroy(), delete a[g[f]])
                    }, a !== t && b.hasRendered && h ? h : 0)
                });
                w && (w[w.isPlaced ? "animate" : "attr"]({
                        d: this.getLinePath(w.strokeWidth())
                    }),
                    w.isPlaced = !0, w[y ? "show" : "hide"](!0));
                u && y && (u[u.isNew ? "attr" : "animate"](a.getTitlePosition()), u.isNew = !1);
                A && A.enabled && a.renderStackTotals();
                a.isDirty = !1
            },
            redraw: function() {
                this.visible && (this.render(), l(this.plotLinesAndBands, function(a) {
                    a.render()
                }));
                l(this.series, function(a) {
                    a.isDirty = !0
                })
            },
            keepProps: "extKey hcEvents names series userMax userMin".split(" "),
            destroy: function(a) {
                var b = this,
                    e = b.stacks,
                    f, g = b.plotLinesAndBands,
                    h;
                a || A(b);
                for (f in e) k(e[f]), e[f] = null;
                l([b.ticks, b.minorTicks, b.alternateBands],
                    function(a) {
                        k(a)
                    });
                if (g)
                    for (a = g.length; a--;) g[a].destroy();
                l("stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross".split(" "), function(a) {
                    b[a] && (b[a] = b[a].destroy())
                });
                for (h in b) b.hasOwnProperty(h) && -1 === p(h, b.keepProps) && delete b[h]
            },
            drawCrosshair: function(a, b) {
                var e, f = this.crosshair,
                    g = y(f.snap, !0),
                    h, p = this.cross;
                a || (a = this.cross && this.cross.e);
                this.crosshair && !1 !== (m(b) || !g) ? (g ? m(b) && (h = this.isXAxis ? b.plotX : this.len - b.plotY) : h = a && (this.horiz ? a.chartX - this.pos : this.len - a.chartY +
                    this.pos), m(h) && (e = this.getPlotLinePath(b && (this.isXAxis ? b.x : y(b.stackY, b.y)), null, null, null, h) || null), m(e) ? (b = this.categories && !this.isRadial, p || (this.cross = p = this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-" + (b ? "category " : "thin ") + f.className).attr({
                    zIndex: y(f.zIndex, 2)
                }).add()), p.show().attr({
                    d: e
                }), b && !f.width && p.attr({
                    "stroke-width": this.transA
                }), this.cross.e = a) : this.hideCrosshair()) : this.hideCrosshair()
            },
            hideCrosshair: function() {
                this.cross && this.cross.hide()
            }
        };
        b(a.Axis.prototype, q)
    })(J);
    (function(a) {
        var B = a.Axis,
            x = a.Date,
            D = a.dateFormat,
            F = a.defaultOptions,
            q = a.defined,
            c = a.each,
            d = a.extend,
            m = a.getMagnitude,
            n = a.getTZOffset,
            k = a.normalizeTickInterval,
            l = a.pick,
            b = a.timeUnits;
        B.prototype.getTimeTicks = function(a, k, t, e) {
            var p = [],
                h = {},
                m = F.global.useUTC,
                v, C = new x(k - n(k)),
                w = x.hcMakeTime,
                y = a.unitRange,
                f = a.count,
                A;
            if (q(k)) {
                C[x.hcSetMilliseconds](y >= b.second ? 0 : f * Math.floor(C.getMilliseconds() / f));
                if (y >= b.second) C[x.hcSetSeconds](y >= b.minute ? 0 : f * Math.floor(C.getSeconds() /
                    f));
                if (y >= b.minute) C[x.hcSetMinutes](y >= b.hour ? 0 : f * Math.floor(C[x.hcGetMinutes]() / f));
                if (y >= b.hour) C[x.hcSetHours](y >= b.day ? 0 : f * Math.floor(C[x.hcGetHours]() / f));
                if (y >= b.day) C[x.hcSetDate](y >= b.month ? 1 : f * Math.floor(C[x.hcGetDate]() / f));
                y >= b.month && (C[x.hcSetMonth](y >= b.year ? 0 : f * Math.floor(C[x.hcGetMonth]() / f)), v = C[x.hcGetFullYear]());
                if (y >= b.year) C[x.hcSetFullYear](v - v % f);
                if (y === b.week) C[x.hcSetDate](C[x.hcGetDate]() - C[x.hcGetDay]() + l(e, 1));
                v = C[x.hcGetFullYear]();
                e = C[x.hcGetMonth]();
                var u = C[x.hcGetDate](),
                    E = C[x.hcGetHours]();
                if (x.hcTimezoneOffset || x.hcGetTimezoneOffset) A = (!m || !!x.hcGetTimezoneOffset) && (t - k > 4 * b.month || n(k) !== n(t)), C = C.getTime(), C = new x(C + n(C));
                m = C.getTime();
                for (k = 1; m < t;) p.push(m), m = y === b.year ? w(v + k * f, 0) : y === b.month ? w(v, e + k * f) : !A || y !== b.day && y !== b.week ? A && y === b.hour ? w(v, e, u, E + k * f) : m + y * f : w(v, e, u + k * f * (y === b.day ? 1 : 7)), k++;
                p.push(m);
                y <= b.hour && 1E4 > p.length && c(p, function(a) {
                    0 === a % 18E5 && "000000000" === D("%H%M%S%L", a) && (h[a] = "day")
                })
            }
            p.info = d(a, {
                higherRanks: h,
                totalRange: y * f
            });
            return p
        };
        B.prototype.normalizeTimeTickInterval =
            function(a, c) {
                var d = c || [
                    ["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]],
                    ["second", [1, 2, 5, 10, 15, 30]],
                    ["minute", [1, 2, 5, 10, 15, 30]],
                    ["hour", [1, 2, 3, 4, 6, 8, 12]],
                    ["day", [1, 2]],
                    ["week", [1, 2]],
                    ["month", [1, 2, 3, 4, 6]],
                    ["year", null]
                ];
                c = d[d.length - 1];
                var e = b[c[0]],
                    p = c[1],
                    h;
                for (h = 0; h < d.length && !(c = d[h], e = b[c[0]], p = c[1], d[h + 1] && a <= (e * p[p.length - 1] + b[d[h + 1][0]]) / 2); h++);
                e === b.year && a < 5 * e && (p = [1, 2, 5]);
                a = k(a / e, p, "year" === c[0] ? Math.max(m(a / e), 1) : 1);
                return {
                    unitRange: e,
                    count: a,
                    unitName: c[0]
                }
            }
    })(J);
    (function(a) {
        var B = a.Axis,
            x = a.getMagnitude,
            D = a.map,
            F = a.normalizeTickInterval,
            q = a.pick;
        B.prototype.getLogTickPositions = function(a, d, m, n) {
            var c = this.options,
                l = this.len,
                b = this.lin2log,
                E = this.log2lin,
                w = [];
            n || (this._minorAutoInterval = null);
            if (.5 <= a) a = Math.round(a), w = this.getLinearTickPositions(a, d, m);
            else if (.08 <= a)
                for (var l = Math.floor(d), t, e, p, h, I, c = .3 < a ? [1, 2, 4] : .15 < a ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; l < m + 1 && !I; l++)
                    for (e = c.length, t = 0; t < e && !I; t++) p = E(b(l) * c[t]), p > d && (!n || h <= m) && void 0 !== h && w.push(h), h > m && (I = !0), h = p;
            else d = b(d), m =
                b(m), a = c[n ? "minorTickInterval" : "tickInterval"], a = q("auto" === a ? null : a, this._minorAutoInterval, c.tickPixelInterval / (n ? 5 : 1) * (m - d) / ((n ? l / this.tickPositions.length : l) || 1)), a = F(a, null, x(a)), w = D(this.getLinearTickPositions(a, d, m), E), n || (this._minorAutoInterval = a / 5);
            n || (this.tickInterval = a);
            return w
        };
        B.prototype.log2lin = function(a) {
            return Math.log(a) / Math.LN10
        };
        B.prototype.lin2log = function(a) {
            return Math.pow(10, a)
        }
    })(J);
    (function(a) {
        var B = a.dateFormat,
            x = a.each,
            D = a.extend,
            F = a.format,
            q = a.isNumber,
            c = a.map,
            d =
            a.merge,
            m = a.pick,
            n = a.splat,
            k = a.syncTimeout,
            l = a.timeUnits;
        a.Tooltip = function() {
            this.init.apply(this, arguments)
        };
        a.Tooltip.prototype = {
            init: function(a, c) {
                this.chart = a;
                this.options = c;
                this.crosshairs = [];
                this.now = {
                    x: 0,
                    y: 0
                };
                this.isHidden = !0;
                this.split = c.split && !a.inverted;
                this.shared = c.shared || this.split
            },
            cleanSplit: function(a) {
                x(this.chart.series, function(b) {
                    var c = b && b.tt;
                    c && (!c.isActive || a ? b.tt = c.destroy() : c.isActive = !1)
                })
            },
            applyFilter: function() {
                var a = this.chart;
                a.renderer.definition({
                    tagName: "filter",
                    id: "drop-shadow-" + a.index,
                    opacity: .5,
                    children: [{
                        tagName: "feGaussianBlur",
                        in: "SourceAlpha",
                        stdDeviation: 1
                    }, {
                        tagName: "feOffset",
                        dx: 1,
                        dy: 1
                    }, {
                        tagName: "feComponentTransfer",
                        children: [{
                            tagName: "feFuncA",
                            type: "linear",
                            slope: .3
                        }]
                    }, {
                        tagName: "feMerge",
                        children: [{
                            tagName: "feMergeNode"
                        }, {
                            tagName: "feMergeNode",
                            in: "SourceGraphic"
                        }]
                    }]
                });
                a.renderer.definition({
                    tagName: "style",
                    textContent: ".highcharts-tooltip-" + a.index + "{filter:url(#drop-shadow-" + a.index + ")}"
                })
            },
            getLabel: function() {
                var a = this.chart.renderer,
                    c = this.options;
                this.label || (this.label = this.split ? a.g("tooltip") : a.label("", 0, 0, c.shape || "callout", null, null, c.useHTML, null, "tooltip").attr({
                    padding: c.padding,
                    r: c.borderRadius
                }), this.applyFilter(), this.label.addClass("highcharts-tooltip-" + this.chart.index), this.label.attr({
                    zIndex: 8
                }).add());
                return this.label
            },
            update: function(a) {
                this.destroy();
                this.init(this.chart, d(!0, this.options, a))
            },
            destroy: function() {
                this.label && (this.label = this.label.destroy());
                this.split && this.tt && (this.cleanSplit(this.chart, !0), this.tt = this.tt.destroy());
                clearTimeout(this.hideTimer);
                clearTimeout(this.tooltipTimeout)
            },
            move: function(a, c, d, l) {
                var b = this,
                    p = b.now,
                    h = !1 !== b.options.animation && !b.isHidden && (1 < Math.abs(a - p.x) || 1 < Math.abs(c - p.y)),
                    k = b.followPointer || 1 < b.len;
                D(p, {
                    x: h ? (2 * p.x + a) / 3 : a,
                    y: h ? (p.y + c) / 2 : c,
                    anchorX: k ? void 0 : h ? (2 * p.anchorX + d) / 3 : d,
                    anchorY: k ? void 0 : h ? (p.anchorY + l) / 2 : l
                });
                b.getLabel().attr(p);
                h && (clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function() {
                    b && b.move(a, c, d, l)
                }, 32))
            },
            hide: function(a) {
                var b = this;
                clearTimeout(this.hideTimer);
                a = m(a, this.options.hideDelay, 500);
                this.isHidden || (this.hideTimer = k(function() {
                    b.getLabel()[a ? "fadeOut" : "hide"]();
                    b.isHidden = !0
                }, a))
            },
            getAnchor: function(a, d) {
                var b, l = this.chart,
                    e = l.inverted,
                    p = l.plotTop,
                    h = l.plotLeft,
                    k = 0,
                    v = 0,
                    m, G;
                a = n(a);
                b = a[0].tooltipPos;
                this.followPointer && d && (void 0 === d.chartX && (d = l.pointer.normalize(d)), b = [d.chartX - l.plotLeft, d.chartY - p]);
                b || (x(a, function(a) {
                    m = a.series.yAxis;
                    G = a.series.xAxis;
                    k += a.plotX + (!e && G ? G.left - h : 0);
                    v += (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) + (!e && m ? m.top -
                        p : 0)
                }), k /= a.length, v /= a.length, b = [e ? l.plotWidth - v : k, this.shared && !e && 1 < a.length && d ? d.chartY - p : e ? l.plotHeight - k : v]);
                return c(b, Math.round)
            },
            getPosition: function(a, c, d) {
                var b = this.chart,
                    e = this.distance,
                    p = {},
                    h = d.h || 0,
                    l, v = ["y", b.chartHeight, c, d.plotY + b.plotTop, b.plotTop, b.plotTop + b.plotHeight],
                    k = ["x", b.chartWidth, a, d.plotX + b.plotLeft, b.plotLeft, b.plotLeft + b.plotWidth],
                    n = !this.followPointer && m(d.ttBelow, !b.inverted === !!d.negative),
                    y = function(a, b, f, c, d, l) {
                        var g = f < c - e,
                            u = c + e + f < b,
                            k = c - e - f;
                        c += e;
                        if (n && u) p[a] =
                            c;
                        else if (!n && g) p[a] = k;
                        else if (g) p[a] = Math.min(l - f, 0 > k - h ? k : k - h);
                        else if (u) p[a] = Math.max(d, c + h + f > b ? c : c + h);
                        else return !1
                    },
                    f = function(a, b, f, h) {
                        var g;
                        h < e || h > b - e ? g = !1 : p[a] = h < f / 2 ? 1 : h > b - f / 2 ? b - f - 2 : h - f / 2;
                        return g
                    },
                    A = function(a) {
                        var b = v;
                        v = k;
                        k = b;
                        l = a
                    },
                    u = function() {
                        !1 !== y.apply(0, v) ? !1 !== f.apply(0, k) || l || (A(!0), u()) : l ? p.x = p.y = 0 : (A(!0), u())
                    };
                (b.inverted || 1 < this.len) && A();
                u();
                return p
            },
            defaultFormatter: function(a) {
                var b = this.points || n(this),
                    c;
                c = [a.tooltipFooterHeaderFormatter(b[0])];
                c = c.concat(a.bodyFormatter(b));
                c.push(a.tooltipFooterHeaderFormatter(b[0], !0));
                return c
            },
            refresh: function(a, c) {
                var b = this.chart,
                    d, e, p, h = {},
                    l = [];
                d = this.options.formatter || this.defaultFormatter;
                var h = b.hoverPoints,
                    k = this.shared;
                clearTimeout(this.hideTimer);
                this.followPointer = n(a)[0].series.tooltipOptions.followPointer;
                p = this.getAnchor(a, c);
                c = p[0];
                e = p[1];
                !k || a.series && a.series.noSharedTooltip ? h = a.getLabelConfig() : (b.hoverPoints = a, h && x(h, function(a) {
                    a.setState()
                }), x(a, function(a) {
                    a.setState("hover");
                    l.push(a.getLabelConfig())
                }), h = {
                    x: a[0].category,
                    y: a[0].y
                }, h.points = l, a = a[0]);
                this.len = l.length;
                h = d.call(h, this);
                k = a.series;
                this.distance = m(k.tooltipOptions.distance, 16);
                !1 === h ? this.hide() : (d = this.getLabel(), this.isHidden && d.attr({
                    opacity: 1
                }).show(), this.split ? this.renderSplit(h, b.hoverPoints) : (d.attr({
                    text: h && h.join ? h.join("") : h
                }), d.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-" + m(a.colorIndex, k.colorIndex)), this.updatePosition({
                    plotX: c,
                    plotY: e,
                    negative: a.negative,
                    ttBelow: a.ttBelow,
                    h: p[2] || 0
                })), this.isHidden = !1)
            },
            renderSplit: function(b, c) {
                var d = this,
                    l = [],
                    e = this.chart,
                    p = e.renderer,
                    h = !0,
                    k = this.options,
                    v, C = this.getLabel();
                x(b.slice(0, c.length + 1), function(a, b) {
                    b = c[b - 1] || {
                        isHeader: !0,
                        plotX: c[0].plotX
                    };
                    var f = b.series || d,
                        A = f.tt,
                        u = "highcharts-color-" + m(b.colorIndex, (b.series || {}).colorIndex, "none");
                    A || (f.tt = A = p.label(null, null, null, "callout").addClass("highcharts-tooltip-box " + u).attr({
                        padding: k.padding,
                        r: k.borderRadius
                    }).add(C));
                    A.isActive = !0;
                    A.attr({
                        text: a
                    });
                    a = A.getBBox();
                    u = a.width + A.strokeWidth();
                    b.isHeader ?
                        (v = a.height, u = Math.max(0, Math.min(b.plotX + e.plotLeft - u / 2, e.chartWidth - u))) : u = b.plotX + e.plotLeft - m(k.distance, 16) - u;
                    0 > u && (h = !1);
                    a = (b.series && b.series.yAxis && b.series.yAxis.pos) + (b.plotY || 0);
                    a -= e.plotTop;
                    l.push({
                        target: b.isHeader ? e.plotHeight + v : a,
                        rank: b.isHeader ? 1 : 0,
                        size: f.tt.getBBox().height + 1,
                        point: b,
                        x: u,
                        tt: A
                    })
                });
                this.cleanSplit();
                a.distribute(l, e.plotHeight + v);
                x(l, function(a) {
                    var b = a.point,
                        f = b.series;
                    a.tt.attr({
                        visibility: void 0 === a.pos ? "hidden" : "inherit",
                        x: h || b.isHeader ? a.x : b.plotX + e.plotLeft + m(k.distance,
                            16),
                        y: a.pos + e.plotTop,
                        anchorX: b.isHeader ? b.plotX + e.plotLeft : b.plotX + f.xAxis.pos,
                        anchorY: b.isHeader ? a.pos + e.plotTop - 15 : b.plotY + f.yAxis.pos
                    })
                })
            },
            updatePosition: function(a) {
                var b = this.chart,
                    c = this.getLabel(),
                    c = (this.options.positioner || this.getPosition).call(this, c.width, c.height, a);
                this.move(Math.round(c.x), Math.round(c.y || 0), a.plotX + b.plotLeft, a.plotY + b.plotTop)
            },
            getDateFormat: function(a, c, d, k) {
                var b = B("%m-%d %H:%M:%S.%L", c),
                    p, h, m = {
                        millisecond: 15,
                        second: 12,
                        minute: 9,
                        hour: 6,
                        day: 3
                    },
                    v = "millisecond";
                for (h in l) {
                    if (a ===
                        l.week && +B("%w", c) === d && "00:00:00.000" === b.substr(6)) {
                        h = "week";
                        break
                    }
                    if (l[h] > a) {
                        h = v;
                        break
                    }
                    if (m[h] && b.substr(m[h]) !== "01-01 00:00:00.000".substr(m[h])) break;
                    "week" !== h && (v = h)
                }
                h && (p = k[h]);
                return p
            },
            getXDateFormat: function(a, c, d) {
                c = c.dateTimeLabelFormats;
                var b = d && d.closestPointRange;
                return (b ? this.getDateFormat(b, a.x, d.options.startOfWeek, c) : c.day) || c.year
            },
            tooltipFooterHeaderFormatter: function(a, c) {
                var b = c ? "footer" : "header";
                c = a.series;
                var d = c.tooltipOptions,
                    e = d.xDateFormat,
                    p = c.xAxis,
                    h = p && "datetime" ===
                    p.options.type && q(a.key),
                    b = d[b + "Format"];
                h && !e && (e = this.getXDateFormat(a, d, p));
                h && e && (b = b.replace("{point.key}", "{point.key:" + e + "}"));
                return F(b, {
                    point: a,
                    series: c
                })
            },
            bodyFormatter: function(a) {
                return c(a, function(a) {
                    var b = a.series.tooltipOptions;
                    return (b.pointFormatter || a.point.tooltipFormatter).call(a.point, b.pointFormat)
                })
            }
        }
    })(J);
    (function(a) {
        var B = a.addEvent,
            x = a.attr,
            D = a.charts,
            F = a.css,
            q = a.defined,
            c = a.doc,
            d = a.each,
            m = a.extend,
            n = a.fireEvent,
            k = a.offset,
            l = a.pick,
            b = a.removeEvent,
            E = a.splat,
            w = a.Tooltip,
            t = a.win;
        a.Pointer = function(a, b) {
            this.init(a, b)
        };
        a.Pointer.prototype = {
            init: function(a, b) {
                this.options = b;
                this.chart = a;
                this.runChartClick = b.chart.events && !!b.chart.events.click;
                this.pinchDown = [];
                this.lastValidTouch = {};
                w && b.tooltip.enabled && (a.tooltip = new w(a, b.tooltip), this.followTouchMove = l(b.tooltip.followTouchMove, !0));
                this.setDOMEvents()
            },
            zoomOption: function(a) {
                var b = this.chart,
                    e = b.options.chart,
                    c = e.zoomType || "",
                    b = b.inverted;
                /touch/.test(a.type) && (c = l(e.pinchType, c));
                this.zoomX = a = /x/.test(c);
                this.zoomY =
                    c = /y/.test(c);
                this.zoomHor = a && !b || c && b;
                this.zoomVert = c && !b || a && b;
                this.hasZoom = a || c
            },
            normalize: function(a, b) {
                var e, c;
                a = a || t.event;
                a.target || (a.target = a.srcElement);
                c = a.touches ? a.touches.length ? a.touches.item(0) : a.changedTouches[0] : a;
                b || (this.chartPosition = b = k(this.chart.container));
                void 0 === c.pageX ? (e = Math.max(a.x, a.clientX - b.left), b = a.y) : (e = c.pageX - b.left, b = c.pageY - b.top);
                return m(a, {
                    chartX: Math.round(e),
                    chartY: Math.round(b)
                })
            },
            getCoordinates: function(a) {
                var b = {
                    xAxis: [],
                    yAxis: []
                };
                d(this.chart.axes,
                    function(e) {
                        b[e.isXAxis ? "xAxis" : "yAxis"].push({
                            axis: e,
                            value: e.toValue(a[e.horiz ? "chartX" : "chartY"])
                        })
                    });
                return b
            },
            runPointActions: function(b) {
                var e = this.chart,
                    h = e.series,
                    k = e.tooltip,
                    v = k ? k.shared : !1,
                    m = !0,
                    t = e.hoverPoint,
                    n = e.hoverSeries,
                    f, A, u, q = [],
                    H;
                if (!v && !n)
                    for (f = 0; f < h.length; f++)
                        if (h[f].directTouch || !h[f].options.stickyTracking) h = [];
                n && (v ? n.noSharedTooltip : n.directTouch) && t ? q = [t] : (v || !n || n.options.stickyTracking || (h = [n]), d(h, function(a) {
                    A = a.noSharedTooltip && v;
                    u = !v && a.directTouch;
                    a.visible && !A && !u &&
                        l(a.options.enableMouseTracking, !0) && (H = a.searchPoint(b, !A && 1 === a.kdDimensions)) && H.series && q.push(H)
                }), q.sort(function(a, b) {
                    var e = a.distX - b.distX,
                        f = a.dist - b.dist,
                        g = (b.series.group && b.series.group.zIndex) - (a.series.group && a.series.group.zIndex);
                    return 0 !== e && v ? e : 0 !== f ? f : 0 !== g ? g : a.series.index > b.series.index ? -1 : 1
                }));
                if (v)
                    for (f = q.length; f--;)(q[f].x !== q[0].x || q[f].series.noSharedTooltip) && q.splice(f, 1);
                if (q[0] && (q[0] !== this.prevKDPoint || k && k.isHidden)) {
                    if (v && !q[0].series.noSharedTooltip) {
                        for (f = 0; f <
                            q.length; f++) q[f].onMouseOver(b, q[f] !== (n && n.directTouch && t || q[0]));
                        q.length && k && k.refresh(q.sort(function(a, b) {
                            return a.series.index - b.series.index
                        }), b)
                    } else if (k && k.refresh(q[0], b), !n || !n.directTouch) q[0].onMouseOver(b);
                    this.prevKDPoint = q[0];
                    m = !1
                }
                m && (h = n && n.tooltipOptions.followPointer, k && h && !k.isHidden && (h = k.getAnchor([{}], b), k.updatePosition({
                    plotX: h[0],
                    plotY: h[1]
                })));
                this.unDocMouseMove || (this.unDocMouseMove = B(c, "mousemove", function(b) {
                    if (D[a.hoverChartIndex]) D[a.hoverChartIndex].pointer.onDocumentMouseMove(b)
                }));
                d(v ? q : [l(t, q[0])], function(a) {
                    d(e.axes, function(e) {
                        (!a || a.series && a.series[e.coll] === e) && e.drawCrosshair(b, a)
                    })
                })
            },
            reset: function(a, b) {
                var e = this.chart,
                    c = e.hoverSeries,
                    p = e.hoverPoint,
                    l = e.hoverPoints,
                    k = e.tooltip,
                    m = k && k.shared ? l : p;
                a && m && d(E(m), function(b) {
                    b.series.isCartesian && void 0 === b.plotX && (a = !1)
                });
                if (a) k && m && (k.refresh(m), p && (p.setState(p.state, !0), d(e.axes, function(a) {
                    a.crosshair && a.drawCrosshair(null, p)
                })));
                else {
                    if (p) p.onMouseOut();
                    l && d(l, function(a) {
                        a.setState()
                    });
                    if (c) c.onMouseOut();
                    k && k.hide(b);
                    this.unDocMouseMove && (this.unDocMouseMove = this.unDocMouseMove());
                    d(e.axes, function(a) {
                        a.hideCrosshair()
                    });
                    this.hoverX = this.prevKDPoint = e.hoverPoints = e.hoverPoint = null
                }
            },
            scaleGroups: function(a, b) {
                var e = this.chart,
                    c;
                d(e.series, function(h) {
                    c = a || h.getPlotBox();
                    h.xAxis && h.xAxis.zoomEnabled && h.group && (h.group.attr(c), h.markerGroup && (h.markerGroup.attr(c), h.markerGroup.clip(b ? e.clipRect : null)), h.dataLabelsGroup && h.dataLabelsGroup.attr(c))
                });
                e.clipRect.attr(b || e.clipBox)
            },
            dragStart: function(a) {
                var b = this.chart;
                b.mouseIsDown = a.type;
                b.cancelClick = !1;
                b.mouseDownX = this.mouseDownX = a.chartX;
                b.mouseDownY = this.mouseDownY = a.chartY
            },
            drag: function(a) {
                var b = this.chart,
                    e = b.options.chart,
                    c = a.chartX,
                    d = a.chartY,
                    l = this.zoomHor,
                    k = this.zoomVert,
                    m = b.plotLeft,
                    f = b.plotTop,
                    A = b.plotWidth,
                    u = b.plotHeight,
                    t, n = this.selectionMarker,
                    g = this.mouseDownX,
                    r = this.mouseDownY,
                    q = e.panKey && a[e.panKey + "Key"];
                n && n.touch || (c < m ? c = m : c > m + A && (c = m + A), d < f ? d = f : d > f + u && (d = f + u), this.hasDragged = Math.sqrt(Math.pow(g - c, 2) + Math.pow(r - d, 2)), 10 < this.hasDragged &&
                    (t = b.isInsidePlot(g - m, r - f), b.hasCartesianSeries && (this.zoomX || this.zoomY) && t && !q && !n && (this.selectionMarker = n = b.renderer.rect(m, f, l ? 1 : A, k ? 1 : u, 0).attr({
                        "class": "highcharts-selection-marker",
                        zIndex: 7
                    }).add()), n && l && (c -= g, n.attr({
                        width: Math.abs(c),
                        x: (0 < c ? 0 : c) + g
                    })), n && k && (c = d - r, n.attr({
                        height: Math.abs(c),
                        y: (0 < c ? 0 : c) + r
                    })), t && !n && e.panning && b.pan(a, e.panning)))
            },
            drop: function(a) {
                var b = this,
                    e = this.chart,
                    c = this.hasPinched;
                if (this.selectionMarker) {
                    var l = {
                            originalEvent: a,
                            xAxis: [],
                            yAxis: []
                        },
                        k = this.selectionMarker,
                        t = k.attr ? k.attr("x") : k.x,
                        y = k.attr ? k.attr("y") : k.y,
                        f = k.attr ? k.attr("width") : k.width,
                        A = k.attr ? k.attr("height") : k.height,
                        u;
                    if (this.hasDragged || c) d(e.axes, function(e) {
                        if (e.zoomEnabled && q(e.min) && (c || b[{
                                xAxis: "zoomX",
                                yAxis: "zoomY"
                            }[e.coll]])) {
                            var h = e.horiz,
                                g = "touchend" === a.type ? e.minPixelPadding : 0,
                                d = e.toValue((h ? t : y) + g),
                                h = e.toValue((h ? t + f : y + A) - g);
                            l[e.coll].push({
                                axis: e,
                                min: Math.min(d, h),
                                max: Math.max(d, h)
                            });
                            u = !0
                        }
                    }), u && n(e, "selection", l, function(a) {
                        e.zoom(m(a, c ? {
                            animation: !1
                        } : null))
                    });
                    this.selectionMarker =
                        this.selectionMarker.destroy();
                    c && this.scaleGroups()
                }
                e && (F(e.container, {
                    cursor: e._cursor
                }), e.cancelClick = 10 < this.hasDragged, e.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = [])
            },
            onContainerMouseDown: function(a) {
                a = this.normalize(a);
                this.zoomOption(a);
                a.preventDefault && a.preventDefault();
                this.dragStart(a)
            },
            onDocumentMouseUp: function(b) {
                D[a.hoverChartIndex] && D[a.hoverChartIndex].pointer.drop(b)
            },
            onDocumentMouseMove: function(a) {
                var b = this.chart,
                    e = this.chartPosition;
                a = this.normalize(a, e);
                !e || this.inClass(a.target, "highcharts-tracker") || b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) || this.reset()
            },
            onContainerMouseLeave: function(b) {
                var e = D[a.hoverChartIndex];
                e && (b.relatedTarget || b.toElement) && (e.pointer.reset(), e.pointer.chartPosition = null)
            },
            onContainerMouseMove: function(b) {
                var e = this.chart;
                q(a.hoverChartIndex) && D[a.hoverChartIndex] && D[a.hoverChartIndex].mouseIsDown || (a.hoverChartIndex = e.index);
                b = this.normalize(b);
                b.returnValue = !1;
                "mousedown" === e.mouseIsDown && this.drag(b);
                !this.inClass(b.target,
                    "highcharts-tracker") && !e.isInsidePlot(b.chartX - e.plotLeft, b.chartY - e.plotTop) || e.openMenu || this.runPointActions(b)
            },
            inClass: function(a, b) {
                for (var e; a;) {
                    if (e = x(a, "class")) {
                        if (-1 !== e.indexOf(b)) return !0;
                        if (-1 !== e.indexOf("highcharts-container")) return !1
                    }
                    a = a.parentNode
                }
            },
            onTrackerMouseOut: function(a) {
                var b = this.chart.hoverSeries;
                a = a.relatedTarget || a.toElement;
                if (!(!b || !a || b.options.stickyTracking || this.inClass(a, "highcharts-tooltip") || this.inClass(a, "highcharts-series-" + b.index) && this.inClass(a, "highcharts-tracker"))) b.onMouseOut()
            },
            onContainerClick: function(a) {
                var b = this.chart,
                    e = b.hoverPoint,
                    c = b.plotLeft,
                    d = b.plotTop;
                a = this.normalize(a);
                b.cancelClick || (e && this.inClass(a.target, "highcharts-tracker") ? (n(e.series, "click", m(a, {
                    point: e
                })), b.hoverPoint && e.firePointEvent("click", a)) : (m(a, this.getCoordinates(a)), b.isInsidePlot(a.chartX - c, a.chartY - d) && n(b, "click", a)))
            },
            setDOMEvents: function() {
                var b = this,
                    d = b.chart.container;
                d.onmousedown = function(a) {
                    b.onContainerMouseDown(a)
                };
                d.onmousemove = function(a) {
                    b.onContainerMouseMove(a)
                };
                d.onclick =
                    function(a) {
                        b.onContainerClick(a)
                    };
                B(d, "mouseleave", b.onContainerMouseLeave);
                1 === a.chartCount && B(c, "mouseup", b.onDocumentMouseUp);
                a.hasTouch && (d.ontouchstart = function(a) {
                    b.onContainerTouchStart(a)
                }, d.ontouchmove = function(a) {
                    b.onContainerTouchMove(a)
                }, 1 === a.chartCount && B(c, "touchend", b.onDocumentTouchEnd))
            },
            destroy: function() {
                var e;
                b(this.chart.container, "mouseleave", this.onContainerMouseLeave);
                a.chartCount || (b(c, "mouseup", this.onDocumentMouseUp), b(c, "touchend", this.onDocumentTouchEnd));
                clearInterval(this.tooltipTimeout);
                for (e in this) this[e] = null
            }
        }
    })(J);
    (function(a) {
        var B = a.charts,
            x = a.each,
            D = a.extend,
            F = a.map,
            q = a.noop,
            c = a.pick;
        D(a.Pointer.prototype, {
            pinchTranslate: function(a, c, n, k, l, b) {
                this.zoomHor && this.pinchTranslateDirection(!0, a, c, n, k, l, b);
                this.zoomVert && this.pinchTranslateDirection(!1, a, c, n, k, l, b)
            },
            pinchTranslateDirection: function(a, c, n, k, l, b, q, w) {
                var d = this.chart,
                    e = a ? "x" : "y",
                    p = a ? "X" : "Y",
                    h = "chart" + p,
                    m = a ? "width" : "height",
                    v = d["plot" + (a ? "Left" : "Top")],
                    C, G, y = w || 1,
                    f = d.inverted,
                    A = d.bounds[a ? "h" : "v"],
                    u = 1 === c.length,
                    L = c[0][h],
                    H = n[0][h],
                    g = !u && c[1][h],
                    r = !u && n[1][h],
                    E;
                n = function() {
                    !u && 20 < Math.abs(L - g) && (y = w || Math.abs(H - r) / Math.abs(L - g));
                    G = (v - H) / y + L;
                    C = d["plot" + (a ? "Width" : "Height")] / y
                };
                n();
                c = G;
                c < A.min ? (c = A.min, E = !0) : c + C > A.max && (c = A.max - C, E = !0);
                E ? (H -= .8 * (H - q[e][0]), u || (r -= .8 * (r - q[e][1])), n()) : q[e] = [H, r];
                f || (b[e] = G - v, b[m] = C);
                b = f ? 1 / y : y;
                l[m] = C;
                l[e] = c;
                k[f ? a ? "scaleY" : "scaleX" : "scale" + p] = y;
                k["translate" + p] = b * v + (H - b * L)
            },
            pinch: function(a) {
                var d = this,
                    n = d.chart,
                    k = d.pinchDown,
                    l = a.touches,
                    b = l.length,
                    E = d.lastValidTouch,
                    w = d.hasZoom,
                    t = d.selectionMarker,
                    e = {},
                    p = 1 === b && (d.inClass(a.target, "highcharts-tracker") && n.runTrackerClick || d.runChartClick),
                    h = {};
                1 < b && (d.initiated = !0);
                w && d.initiated && !p && a.preventDefault();
                F(l, function(a) {
                    return d.normalize(a)
                });
                "touchstart" === a.type ? (x(l, function(a, b) {
                    k[b] = {
                        chartX: a.chartX,
                        chartY: a.chartY
                    }
                }), E.x = [k[0].chartX, k[1] && k[1].chartX], E.y = [k[0].chartY, k[1] && k[1].chartY], x(n.axes, function(a) {
                    if (a.zoomEnabled) {
                        var b = n.bounds[a.horiz ? "h" : "v"],
                            e = a.minPixelPadding,
                            h = a.toPixels(c(a.options.min, a.dataMin)),
                            d = a.toPixels(c(a.options.max, a.dataMax)),
                            f = Math.max(h, d);
                        b.min = Math.min(a.pos, Math.min(h, d) - e);
                        b.max = Math.max(a.pos + a.len, f + e)
                    }
                }), d.res = !0) : d.followTouchMove && 1 === b ? this.runPointActions(d.normalize(a)) : k.length && (t || (d.selectionMarker = t = D({
                    destroy: q,
                    touch: !0
                }, n.plotBox)), d.pinchTranslate(k, l, e, t, h, E), d.hasPinched = w, d.scaleGroups(e, h), d.res && (d.res = !1, this.reset(!1, 0)))
            },
            touch: function(d, m) {
                var n = this.chart,
                    k, l;
                if (n.index !== a.hoverChartIndex) this.onContainerMouseLeave({
                    relatedTarget: !0
                });
                a.hoverChartIndex =
                    n.index;
                1 === d.touches.length ? (d = this.normalize(d), (l = n.isInsidePlot(d.chartX - n.plotLeft, d.chartY - n.plotTop)) && !n.openMenu ? (m && this.runPointActions(d), "touchmove" === d.type && (m = this.pinchDown, k = m[0] ? 4 <= Math.sqrt(Math.pow(m[0].chartX - d.chartX, 2) + Math.pow(m[0].chartY - d.chartY, 2)) : !1), c(k, !0) && this.pinch(d)) : m && this.reset()) : 2 === d.touches.length && this.pinch(d)
            },
            onContainerTouchStart: function(a) {
                this.zoomOption(a);
                this.touch(a, !0)
            },
            onContainerTouchMove: function(a) {
                this.touch(a)
            },
            onDocumentTouchEnd: function(c) {
                B[a.hoverChartIndex] &&
                    B[a.hoverChartIndex].pointer.drop(c)
            }
        })
    })(J);
    (function(a) {
        var B = a.addEvent,
            x = a.charts,
            D = a.css,
            F = a.doc,
            q = a.extend,
            c = a.noop,
            d = a.Pointer,
            m = a.removeEvent,
            n = a.win,
            k = a.wrap;
        if (n.PointerEvent || n.MSPointerEvent) {
            var l = {},
                b = !!n.PointerEvent,
                E = function() {
                    var a, b = [];
                    b.item = function(a) {
                        return this[a]
                    };
                    for (a in l) l.hasOwnProperty(a) && b.push({
                        pageX: l[a].pageX,
                        pageY: l[a].pageY,
                        target: l[a].target
                    });
                    return b
                },
                w = function(b, e, d, h) {
                    "touch" !== b.pointerType && b.pointerType !== b.MSPOINTER_TYPE_TOUCH || !x[a.hoverChartIndex] ||
                        (h(b), h = x[a.hoverChartIndex].pointer, h[e]({
                            type: d,
                            target: b.currentTarget,
                            preventDefault: c,
                            touches: E()
                        }))
                };
            q(d.prototype, {
                onContainerPointerDown: function(a) {
                    w(a, "onContainerTouchStart", "touchstart", function(a) {
                        l[a.pointerId] = {
                            pageX: a.pageX,
                            pageY: a.pageY,
                            target: a.currentTarget
                        }
                    })
                },
                onContainerPointerMove: function(a) {
                    w(a, "onContainerTouchMove", "touchmove", function(a) {
                        l[a.pointerId] = {
                            pageX: a.pageX,
                            pageY: a.pageY
                        };
                        l[a.pointerId].target || (l[a.pointerId].target = a.currentTarget)
                    })
                },
                onDocumentPointerUp: function(a) {
                    w(a,
                        "onDocumentTouchEnd", "touchend",
                        function(a) {
                            delete l[a.pointerId]
                        })
                },
                batchMSEvents: function(a) {
                    a(this.chart.container, b ? "pointerdown" : "MSPointerDown", this.onContainerPointerDown);
                    a(this.chart.container, b ? "pointermove" : "MSPointerMove", this.onContainerPointerMove);
                    a(F, b ? "pointerup" : "MSPointerUp", this.onDocumentPointerUp)
                }
            });
            k(d.prototype, "init", function(a, b, c) {
                a.call(this, b, c);
                this.hasZoom && D(b.container, {
                    "-ms-touch-action": "none",
                    "touch-action": "none"
                })
            });
            k(d.prototype, "setDOMEvents", function(a) {
                a.apply(this);
                (this.hasZoom || this.followTouchMove) && this.batchMSEvents(B)
            });
            k(d.prototype, "destroy", function(a) {
                this.batchMSEvents(m);
                a.call(this)
            })
        }
    })(J);
    (function(a) {
        var B, x = a.addEvent,
            D = a.css,
            F = a.discardElement,
            q = a.defined,
            c = a.each,
            d = a.extend,
            m = a.isFirefox,
            n = a.marginNames,
            k = a.merge,
            l = a.pick,
            b = a.setAnimation,
            E = a.stableSort,
            w = a.win,
            t = a.wrap;
        B = a.Legend = function(a, b) {
            this.init(a, b)
        };
        B.prototype = {
            init: function(a, b) {
                this.chart = a;
                this.setOptions(b);
                b.enabled && (this.render(), x(this.chart, "endResize", function() {
                    this.legend.positionCheckboxes()
                }))
            },
            setOptions: function(a) {
                var b = l(a.padding, 8);
                this.options = a;
                this.itemMarginTop = a.itemMarginTop || 0;
                this.initialItemX = this.padding = b;
                this.initialItemY = b - 5;
                this.itemHeight = this.maxItemWidth = 0;
                this.symbolWidth = l(a.symbolWidth, 16);
                this.pages = []
            },
            update: function(a, b) {
                var e = this.chart;
                this.setOptions(k(!0, this.options, a));
                this.destroy();
                e.isDirtyLegend = e.isDirtyBox = !0;
                l(b, !0) && e.redraw()
            },
            colorizeItem: function(a, b) {
                a.legendGroup[b ? "removeClass" : "addClass"]("highcharts-legend-item-hidden")
            },
            positionItem: function(a) {
                var b =
                    this.options,
                    e = b.symbolPadding,
                    b = !b.rtl,
                    c = a._legendItemPos,
                    d = c[0],
                    c = c[1],
                    l = a.checkbox;
                (a = a.legendGroup) && a.element && a.translate(b ? d : this.legendWidth - d - 2 * e - 4, c);
                l && (l.x = d, l.y = c)
            },
            destroyItem: function(a) {
                var b = a.checkbox;
                c(["legendItem", "legendLine", "legendSymbol", "legendGroup"], function(b) {
                    a[b] && (a[b] = a[b].destroy())
                });
                b && F(a.checkbox)
            },
            destroy: function() {
                function a(a) {
                    this[a] && (this[a] = this[a].destroy())
                }
                c(this.getAllItems(), function(b) {
                    c(["legendItem", "legendGroup"], a, b)
                });
                c(["box", "title", "group"],
                    a, this);
                this.display = null
            },
            positionCheckboxes: function(a) {
                var b = this.group && this.group.alignAttr,
                    e, d = this.clipHeight || this.legendHeight,
                    l = this.titleHeight;
                b && (e = b.translateY, c(this.allItems, function(c) {
                    var h = c.checkbox,
                        k;
                    h && (k = e + l + h.y + (a || 0) + 3, D(h, {
                        left: b.translateX + c.checkboxOffset + h.x - 20 + "px",
                        top: k + "px",
                        display: k > e - 6 && k < e + d - 6 ? "" : "none"
                    }))
                }))
            },
            renderTitle: function() {
                var a = this.padding,
                    b = this.options.title,
                    c = 0;
                b.text && (this.title || (this.title = this.chart.renderer.label(b.text, a - 3, a - 4, null, null, null,
                    null, null, "legend-title").attr({
                    zIndex: 1
                }).add(this.group)), a = this.title.getBBox(), c = a.height, this.offsetWidth = a.width, this.contentGroup.attr({
                    translateY: c
                }));
                this.titleHeight = c
            },
            setText: function(b) {
                var e = this.options;
                b.legendItem.attr({
                    text: e.labelFormat ? a.format(e.labelFormat, b) : e.labelFormatter.call(b)
                })
            },
            renderItem: function(a) {
                var b = this.chart,
                    e = b.renderer,
                    c = this.options,
                    d = "horizontal" === c.layout,
                    k = this.symbolWidth,
                    m = c.symbolPadding,
                    n = this.padding,
                    f = d ? l(c.itemDistance, 20) : 0,
                    A = !c.rtl,
                    u = c.width,
                    t = c.itemMarginBottom || 0,
                    q = this.itemMarginTop,
                    g = this.initialItemX,
                    r = a.legendItem,
                    w = !a.series,
                    E = !w && a.series.drawLegendSymbol ? a.series : a,
                    x = E.options,
                    x = this.createCheckboxForItem && x && x.showCheckbox,
                    B = c.useHTML;
                r || (a.legendGroup = e.g("legend-item").addClass("highcharts-" + E.type + "-series highcharts-color-" + a.colorIndex + (a.options.className ? " " + a.options.className : "") + (w ? " highcharts-series-" + a.index : "")).attr({
                    zIndex: 1
                }).add(this.scrollGroup), a.legendItem = r = e.text("", A ? k + m : -m, this.baseline || 0, B).attr({
                    align: A ?
                        "left" : "right",
                    zIndex: 2
                }).add(a.legendGroup), this.baseline || (this.fontMetrics = e.fontMetrics(12, r), this.baseline = this.fontMetrics.f + 3 + q, r.attr("y", this.baseline)), this.symbolHeight = c.symbolHeight || this.fontMetrics.f, E.drawLegendSymbol(this, a), this.setItemEvents && this.setItemEvents(a, r, B), x && this.createCheckboxForItem(a));
                this.colorizeItem(a, a.visible);
                this.setText(a);
                e = r.getBBox();
                k = a.checkboxOffset = c.itemWidth || a.legendItemWidth || k + m + e.width + f + (x ? 20 : 0);
                this.itemHeight = m = Math.round(a.legendItemHeight ||
                    e.height);
                d && this.itemX - g + k > (u || b.chartWidth - 2 * n - g - c.x) && (this.itemX = g, this.itemY += q + this.lastLineHeight + t, this.lastLineHeight = 0);
                this.maxItemWidth = Math.max(this.maxItemWidth, k);
                this.lastItemY = q + this.itemY + t;
                this.lastLineHeight = Math.max(m, this.lastLineHeight);
                a._legendItemPos = [this.itemX, this.itemY];
                d ? this.itemX += k : (this.itemY += q + m + t, this.lastLineHeight = m);
                this.offsetWidth = u || Math.max((d ? this.itemX - g - f : k) + n, this.offsetWidth)
            },
            getAllItems: function() {
                var a = [];
                c(this.chart.series, function(b) {
                    var e = b &&
                        b.options;
                    b && l(e.showInLegend, q(e.linkedTo) ? !1 : void 0, !0) && (a = a.concat(b.legendItems || ("point" === e.legendType ? b.data : b)))
                });
                return a
            },
            adjustMargins: function(a, b) {
                var e = this.chart,
                    d = this.options,
                    k = d.align.charAt(0) + d.verticalAlign.charAt(0) + d.layout.charAt(0);
                d.floating || c([/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/], function(c, h) {
                    c.test(k) && !q(a[h]) && (e[n[h]] = Math.max(e[n[h]], e.legend[(h + 1) % 2 ? "legendHeight" : "legendWidth"] + [1, -1, -1, 1][h] * d[h % 2 ? "x" : "y"] + l(d.margin, 12) + b[h]))
                })
            },
            render: function() {
                var a =
                    this,
                    b = a.chart,
                    h = b.renderer,
                    l = a.group,
                    k, m, n, t, f = a.box,
                    A = a.options,
                    u = a.padding;
                a.itemX = a.initialItemX;
                a.itemY = a.initialItemY;
                a.offsetWidth = 0;
                a.lastItemY = 0;
                l || (a.group = l = h.g("legend").attr({
                    zIndex: 7
                }).add(), a.contentGroup = h.g().attr({
                    zIndex: 1
                }).add(l), a.scrollGroup = h.g().add(a.contentGroup));
                a.renderTitle();
                k = a.getAllItems();
                E(k, function(a, b) {
                    return (a.options && a.options.legendIndex || 0) - (b.options && b.options.legendIndex || 0)
                });
                A.reversed && k.reverse();
                a.allItems = k;
                a.display = m = !!k.length;
                a.lastLineHeight =
                    0;
                c(k, function(b) {
                    a.renderItem(b)
                });
                n = (A.width || a.offsetWidth) + u;
                t = a.lastItemY + a.lastLineHeight + a.titleHeight;
                t = a.handleOverflow(t);
                t += u;
                f || (a.box = f = h.rect().addClass("highcharts-legend-box").attr({
                    r: A.borderRadius
                }).add(l), f.isNew = !0);
                0 < n && 0 < t && (f[f.isNew ? "attr" : "animate"](f.crisp({
                    x: 0,
                    y: 0,
                    width: n,
                    height: t
                }, f.strokeWidth())), f.isNew = !1);
                f[m ? "show" : "hide"]();
                "none" === l.getStyle("display") && (n = t = 0);
                a.legendWidth = n;
                a.legendHeight = t;
                c(k, function(b) {
                    a.positionItem(b)
                });
                m && l.align(d({
                        width: n,
                        height: t
                    },
                    A), !0, "spacingBox");
                b.isResizing || this.positionCheckboxes()
            },
            handleOverflow: function(a) {
                var b = this,
                    e = this.chart,
                    d = e.renderer,
                    k = this.options,
                    m = k.y,
                    e = e.spacingBox.height + ("top" === k.verticalAlign ? -m : m) - this.padding,
                    m = k.maxHeight,
                    n, t = this.clipRect,
                    f = k.navigation,
                    A = l(f.animation, !0),
                    u = f.arrowSize || 12,
                    q = this.nav,
                    H = this.pages,
                    g = this.padding,
                    r, w = this.allItems,
                    E = function(a) {
                        a ? t.attr({
                            height: a
                        }) : t && (b.clipRect = t.destroy(), b.contentGroup.clip());
                        b.contentGroup.div && (b.contentGroup.div.style.clip = a ? "rect(" + g +
                            "px,9999px," + (g + a) + "px,0)" : "auto")
                    };
                "horizontal" !== k.layout || "middle" === k.verticalAlign || k.floating || (e /= 2);
                m && (e = Math.min(e, m));
                H.length = 0;
                a > e && !1 !== f.enabled ? (this.clipHeight = n = Math.max(e - 20 - this.titleHeight - g, 0), this.currentPage = l(this.currentPage, 1), this.fullHeight = a, c(w, function(a, b) {
                    var f = a._legendItemPos[1];
                    a = Math.round(a.legendItem.getBBox().height);
                    var c = H.length;
                    if (!c || f - H[c - 1] > n && (r || f) !== H[c - 1]) H.push(r || f), c++;
                    b === w.length - 1 && f + a - H[c - 1] > n && H.push(f);
                    f !== r && (r = f)
                }), t || (t = b.clipRect = d.clipRect(0,
                    g, 9999, 0), b.contentGroup.clip(t)), E(n), q || (this.nav = q = d.g().attr({
                    zIndex: 1
                }).add(this.group), this.up = d.symbol("triangle", 0, 0, u, u).on("click", function() {
                    b.scroll(-1, A)
                }).add(q), this.pager = d.text("", 15, 10).addClass("highcharts-legend-navigation").add(q), this.down = d.symbol("triangle-down", 0, 0, u, u).on("click", function() {
                    b.scroll(1, A)
                }).add(q)), b.scroll(0), a = e) : q && (E(), q.hide(), this.scrollGroup.attr({
                    translateY: 1
                }), this.clipHeight = 0);
                return a
            },
            scroll: function(a, c) {
                var e = this.pages,
                    d = e.length;
                a = this.currentPage +
                    a;
                var l = this.clipHeight,
                    k = this.pager,
                    p = this.padding;
                a > d && (a = d);
                0 < a && (void 0 !== c && b(c, this.chart), this.nav.attr({
                        translateX: p,
                        translateY: l + this.padding + 7 + this.titleHeight,
                        visibility: "visible"
                    }), this.up.attr({
                        "class": 1 === a ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"
                    }), k.attr({
                        text: a + "/" + d
                    }), this.down.attr({
                        x: 18 + this.pager.getBBox().width,
                        "class": a === d ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"
                    }), c = -e[a - 1] + this.initialItemY, this.scrollGroup.animate({
                        translateY: c
                    }),
                    this.currentPage = a, this.positionCheckboxes(c))
            }
        };
        a.LegendSymbolMixin = {
            drawRectangle: function(a, b) {
                var c = a.symbolHeight,
                    e = a.options.squareSymbol;
                b.legendSymbol = this.chart.renderer.rect(e ? (a.symbolWidth - c) / 2 : 0, a.baseline - c + 1, e ? c : a.symbolWidth, c, l(a.options.symbolRadius, c / 2)).addClass("highcharts-point").attr({
                    zIndex: 3
                }).add(b.legendGroup)
            },
            drawLineMarker: function(a) {
                var b = this.options.marker,
                    c, e = a.symbolWidth,
                    d = a.symbolHeight;
                c = d / 2;
                var m = this.chart.renderer,
                    t = this.legendGroup;
                a = a.baseline - Math.round(.3 *
                    a.fontMetrics.b);
                this.legendLine = m.path(["M", 0, a, "L", e, a]).addClass("highcharts-graph").attr({}).add(t);
                b && !1 !== b.enabled && (c = Math.min(l(b.radius, c), c), 0 === this.symbol.indexOf("url") && (b = k(b, {
                    width: d,
                    height: d
                }), c = 0), this.legendSymbol = b = m.symbol(this.symbol, e / 2 - c, a - c, 2 * c, 2 * c, b).addClass("highcharts-point").add(t), b.isMarker = !0)
            }
        };
        (/Trident\/7\.0/.test(w.navigator.userAgent) || m) && t(B.prototype, "positionItem", function(a, b) {
            var c = this,
                e = function() {
                    b._legendItemPos && a.call(c, b)
                };
            e();
            setTimeout(e)
        })
    })(J);
    (function(a) {
        var B = a.addEvent,
            x = a.animObject,
            D = a.attr,
            F = a.doc,
            q = a.Axis,
            c = a.createElement,
            d = a.defaultOptions,
            m = a.discardElement,
            n = a.charts,
            k = a.css,
            l = a.defined,
            b = a.each,
            E = a.extend,
            w = a.find,
            t = a.fireEvent,
            e = a.getStyle,
            p = a.grep,
            h = a.isNumber,
            I = a.isObject,
            v = a.isString,
            C = a.Legend,
            G = a.marginNames,
            y = a.merge,
            f = a.Pointer,
            A = a.pick,
            u = a.pInt,
            L = a.removeEvent,
            H = a.seriesTypes,
            g = a.splat,
            r = a.svg,
            R = a.syncTimeout,
            O = a.win,
            P = a.Renderer,
            Q = a.Chart = function() {
                this.getArgs.apply(this, arguments)
            };
        a.chart = function(a, b, f) {
            return new Q(a,
                b, f)
        };
        Q.prototype = {
            callbacks: [],
            getArgs: function() {
                var a = [].slice.call(arguments);
                if (v(a[0]) || a[0].nodeName) this.renderTo = a.shift();
                this.init(a[0], a[1])
            },
            init: function(b, f) {
                var c, e = b.series;
                b.series = null;
                c = y(d, b);
                c.series = b.series = e;
                this.userOptions = b;
                this.respRules = [];
                b = c.chart;
                e = b.events;
                this.margin = [];
                this.spacing = [];
                this.bounds = {
                    h: {},
                    v: {}
                };
                this.callback = f;
                this.isResizing = 0;
                this.options = c;
                this.axes = [];
                this.series = [];
                this.hasCartesianSeries = b.showAxes;
                var g;
                this.index = n.length;
                n.push(this);
                a.chartCount++;
                if (e)
                    for (g in e) B(this, g, e[g]);
                this.xAxis = [];
                this.yAxis = [];
                this.pointCount = this.colorCounter = this.symbolCounter = 0;
                this.firstRender()
            },
            initSeries: function(b) {
                var f = this.options.chart;
                (f = H[b.type || f.type || f.defaultSeriesType]) || a.error(17, !0);
                f = new f;
                f.init(this, b);
                return f
            },
            orderSeries: function(a) {
                var b = this.series;
                for (a = a || 0; a < b.length; a++) b[a] && (b[a].index = a, b[a].name = b[a].name || "Series " + (b[a].index + 1))
            },
            isInsidePlot: function(a, b, f) {
                var c = f ? b : a;
                a = f ? a : b;
                return 0 <= c && c <= this.plotWidth && 0 <= a && a <= this.plotHeight
            },
            redraw: function(f) {
                var c = this.axes,
                    e = this.series,
                    g = this.pointer,
                    d = this.legend,
                    h = this.isDirtyLegend,
                    l, k, u = this.hasCartesianSeries,
                    p = this.isDirtyBox,
                    r = e.length,
                    A = r,
                    m = this.renderer,
                    v = m.isHidden(),
                    n = [];
                this.setResponsive && this.setResponsive(!1);
                a.setAnimation(f, this);
                v && this.cloneRenderTo();
                for (this.layOutTitles(); A--;)
                    if (f = e[A], f.options.stacking && (l = !0, f.isDirty)) {
                        k = !0;
                        break
                    }
                if (k)
                    for (A = r; A--;) f = e[A], f.options.stacking && (f.isDirty = !0);
                b(e, function(a) {
                    a.isDirty && "point" === a.options.legendType && (a.updateTotals &&
                        a.updateTotals(), h = !0);
                    a.isDirtyData && t(a, "updatedData")
                });
                h && d.options.enabled && (d.render(), this.isDirtyLegend = !1);
                l && this.getStacks();
                u && b(c, function(a) {
                    a.updateNames();
                    a.setScale()
                });
                this.getMargins();
                u && (b(c, function(a) {
                    a.isDirty && (p = !0)
                }), b(c, function(a) {
                    var b = a.min + "," + a.max;
                    a.extKey !== b && (a.extKey = b, n.push(function() {
                        t(a, "afterSetExtremes", E(a.eventArgs, a.getExtremes()));
                        delete a.eventArgs
                    }));
                    (p || l) && a.redraw()
                }));
                p && this.drawChartBox();
                t(this, "predraw");
                b(e, function(a) {
                    (p || a.isDirty) && a.visible &&
                        a.redraw();
                    a.isDirtyData = !1
                });
                g && g.reset(!0);
                m.draw();
                t(this, "redraw");
                t(this, "render");
                v && this.cloneRenderTo(!0);
                b(n, function(a) {
                    a.call()
                })
            },
            get: function(a) {
                function b(b) {
                    return b.id === a || b.options && b.options.id === a
                }
                var f, c = this.series,
                    e;
                f = w(this.axes, b) || w(this.series, b);
                for (e = 0; !f && e < c.length; e++) f = w(c[e].points || [], b);
                return f
            },
            getAxes: function() {
                var a = this,
                    f = this.options,
                    c = f.xAxis = g(f.xAxis || {}),
                    f = f.yAxis = g(f.yAxis || {});
                b(c, function(a, b) {
                    a.index = b;
                    a.isX = !0
                });
                b(f, function(a, b) {
                    a.index = b
                });
                c = c.concat(f);
                b(c, function(b) {
                    new q(a, b)
                })
            },
            getSelectedPoints: function() {
                var a = [];
                b(this.series, function(b) {
                    a = a.concat(p(b.points || [], function(a) {
                        return a.selected
                    }))
                });
                return a
            },
            getSelectedSeries: function() {
                return p(this.series, function(a) {
                    return a.selected
                })
            },
            setTitle: function(a, f, c) {
                var e = this,
                    g = e.options,
                    d;
                d = g.title = y(g.title, a);
                g = g.subtitle = y(g.subtitle, f);
                b([
                    ["title", a, d],
                    ["subtitle", f, g]
                ], function(a, b) {
                    var f = a[0],
                        c = e[f],
                        g = a[1];
                    a = a[2];
                    c && g && (e[f] = c = c.destroy());
                    a && a.text && !c && (e[f] = e.renderer.text(a.text,
                        0, 0, a.useHTML).attr({
                        align: a.align,
                        "class": "highcharts-" + f,
                        zIndex: a.zIndex || 4
                    }).add(), e[f].update = function(a) {
                        e.setTitle(!b && a, b && a)
                    })
                });
                e.layOutTitles(c)
            },
            layOutTitles: function(a) {
                var f = 0,
                    c, e = this.renderer,
                    g = this.spacingBox;
                b(["title", "subtitle"], function(a) {
                    var b = this[a],
                        c = this.options[a],
                        d;
                    b && (d = e.fontMetrics(d, b).b, b.css({
                        width: (c.width || g.width + c.widthAdjust) + "px"
                    }).align(E({
                        y: f + d + ("title" === a ? -3 : 2)
                    }, c), !1, "spacingBox"), c.floating || c.verticalAlign || (f = Math.ceil(f + b.getBBox().height)))
                }, this);
                c = this.titleOffset !== f;
                this.titleOffset = f;
                !this.isDirtyBox && c && (this.isDirtyBox = c, this.hasRendered && A(a, !0) && this.isDirtyBox && this.redraw())
            },
            getChartSize: function() {
                var a = this.options.chart,
                    b = a.width,
                    a = a.height,
                    f = this.renderToClone || this.renderTo;
                l(b) || (this.containerWidth = e(f, "width"));
                l(a) || (this.containerHeight = e(f, "height"));
                this.chartWidth = Math.max(0, b || this.containerWidth || 600);
                this.chartHeight = Math.max(0, a || this.containerHeight || 400)
            },
            cloneRenderTo: function(a) {
                var b = this.renderToClone,
                    f = this.container;
                if (a) {
                    if (b) {
                        for (; b.childNodes.length;) this.renderTo.appendChild(b.firstChild);
                        m(b);
                        delete this.renderToClone
                    }
                } else f && f.parentNode === this.renderTo && this.renderTo.removeChild(f), this.renderToClone = b = this.renderTo.cloneNode(0), k(b, {
                    position: "absolute",
                    top: "-9999px",
                    display: "block"
                }), b.style.setProperty && b.style.setProperty("display", "block", "important"), F.body.appendChild(b), f && b.appendChild(f)
            },
            setClassName: function(a) {
                this.container.className = "highcharts-container " + (a || "")
            },
            getContainer: function() {
                var b,
                    f = this.options,
                    e = f.chart,
                    g, d;
                b = this.renderTo;
                var l = a.uniqueKey(),
                    k;
                b || (this.renderTo = b = e.renderTo);
                v(b) && (this.renderTo = b = F.getElementById(b));
                b || a.error(13, !0);
                g = u(D(b, "data-highcharts-chart"));
                h(g) && n[g] && n[g].hasRendered && n[g].destroy();
                D(b, "data-highcharts-chart", this.index);
                b.innerHTML = "";
                e.skipClone || b.offsetWidth || this.cloneRenderTo();
                this.getChartSize();
                g = this.chartWidth;
                d = this.chartHeight;
                this.container = b = c("div", {
                    id: l
                }, void 0, this.renderToClone || b);
                this._cursor = b.style.cursor;
                this.renderer =
                    new(a[e.renderer] || P)(b, g, d, null, e.forExport, f.exporting && f.exporting.allowHTML);
                this.setClassName(e.className);
                for (k in f.defs) this.renderer.definition(f.defs[k]);
                this.renderer.chartIndex = this.index
            },
            getMargins: function(a) {
                var b = this.spacing,
                    f = this.margin,
                    c = this.titleOffset;
                this.resetMargins();
                c && !l(f[0]) && (this.plotTop = Math.max(this.plotTop, c + this.options.title.margin + b[0]));
                this.legend.display && this.legend.adjustMargins(f, b);
                this.extraMargin && (this[this.extraMargin.type] = (this[this.extraMargin.type] ||
                    0) + this.extraMargin.value);
                this.extraTopMargin && (this.plotTop += this.extraTopMargin);
                a || this.getAxisMargins()
            },
            getAxisMargins: function() {
                var a = this,
                    f = a.axisOffset = [0, 0, 0, 0],
                    c = a.margin;
                a.hasCartesianSeries && b(a.axes, function(a) {
                    a.visible && a.getOffset()
                });
                b(G, function(b, e) {
                    l(c[e]) || (a[b] += f[e])
                });
                a.setChartSize()
            },
            reflow: function(a) {
                var b = this,
                    f = b.options.chart,
                    c = b.renderTo,
                    g = l(f.width),
                    d = f.width || e(c, "width"),
                    f = f.height || e(c, "height"),
                    c = a ? a.target : O;
                if (!g && !b.isPrinting && d && f && (c === O || c === F)) {
                    if (d !==
                        b.containerWidth || f !== b.containerHeight) clearTimeout(b.reflowTimeout), b.reflowTimeout = R(function() {
                        b.container && b.setSize(void 0, void 0, !1)
                    }, a ? 100 : 0);
                    b.containerWidth = d;
                    b.containerHeight = f
                }
            },
            initReflow: function() {
                var a = this,
                    b;
                b = B(O, "resize", function(b) {
                    a.reflow(b)
                });
                B(a, "destroy", b)
            },
            setSize: function(f, c, e) {
                var g = this,
                    d = g.renderer;
                g.isResizing += 1;
                a.setAnimation(e, g);
                g.oldChartHeight = g.chartHeight;
                g.oldChartWidth = g.chartWidth;
                void 0 !== f && (g.options.chart.width = f);
                void 0 !== c && (g.options.chart.height =
                    c);
                g.getChartSize();
                g.setChartSize(!0);
                d.setSize(g.chartWidth, g.chartHeight, e);
                b(g.axes, function(a) {
                    a.isDirty = !0;
                    a.setScale()
                });
                g.isDirtyLegend = !0;
                g.isDirtyBox = !0;
                g.layOutTitles();
                g.getMargins();
                g.redraw(e);
                g.oldChartHeight = null;
                t(g, "resize");
                R(function() {
                    g && t(g, "endResize", null, function() {
                        --g.isResizing
                    })
                }, x(void 0).duration)
            },
            setChartSize: function(a) {
                var f = this.inverted,
                    c = this.renderer,
                    e = this.chartWidth,
                    g = this.chartHeight,
                    d = this.options.chart,
                    h = this.spacing,
                    l = this.clipOffset,
                    k, u, p, r;
                this.plotLeft =
                    k = Math.round(this.plotLeft);
                this.plotTop = u = Math.round(this.plotTop);
                this.plotWidth = p = Math.max(0, Math.round(e - k - this.marginRight));
                this.plotHeight = r = Math.max(0, Math.round(g - u - this.marginBottom));
                this.plotSizeX = f ? r : p;
                this.plotSizeY = f ? p : r;
                this.plotBorderWidth = d.plotBorderWidth || 0;
                this.spacingBox = c.spacingBox = {
                    x: h[3],
                    y: h[0],
                    width: e - h[3] - h[1],
                    height: g - h[0] - h[2]
                };
                this.plotBox = c.plotBox = {
                    x: k,
                    y: u,
                    width: p,
                    height: r
                };
                e = 2 * Math.floor(this.plotBorderWidth / 2);
                f = Math.ceil(Math.max(e, l[3]) / 2);
                c = Math.ceil(Math.max(e,
                    l[0]) / 2);
                this.clipBox = {
                    x: f,
                    y: c,
                    width: Math.floor(this.plotSizeX - Math.max(e, l[1]) / 2 - f),
                    height: Math.max(0, Math.floor(this.plotSizeY - Math.max(e, l[2]) / 2 - c))
                };
                a || b(this.axes, function(a) {
                    a.setAxisSize();
                    a.setAxisTranslation()
                })
            },
            resetMargins: function() {
                var a = this,
                    f = a.options.chart;
                b(["margin", "spacing"], function(c) {
                    var e = f[c],
                        g = I(e) ? e : [e, e, e, e];
                    b(["Top", "Right", "Bottom", "Left"], function(b, e) {
                        a[c][e] = A(f[c + b], g[e])
                    })
                });
                b(G, function(b, f) {
                    a[b] = A(a.margin[f], a.spacing[f])
                });
                a.axisOffset = [0, 0, 0, 0];
                a.clipOffset = [0, 0, 0, 0]
            },
            drawChartBox: function() {
                var a = this.options.chart,
                    b = this.renderer,
                    f = this.chartWidth,
                    c = this.chartHeight,
                    e = this.chartBackground,
                    g = this.plotBackground,
                    d = this.plotBorder,
                    h, l, k = this.plotLeft,
                    u = this.plotTop,
                    p = this.plotWidth,
                    r = this.plotHeight,
                    A = this.plotBox,
                    m = this.clipRect,
                    v = this.clipBox,
                    t = "animate";
                e || (this.chartBackground = e = b.rect().addClass("highcharts-background").add(), t = "attr");
                h = l = e.strokeWidth();
                e[t]({
                    x: l / 2,
                    y: l / 2,
                    width: f - l - h % 2,
                    height: c - l - h % 2,
                    r: a.borderRadius
                });
                t = "animate";
                g || (t = "attr",
                    this.plotBackground = g = b.rect().addClass("highcharts-plot-background").add());
                g[t](A);
                m ? m.animate({
                    width: v.width,
                    height: v.height
                }) : this.clipRect = b.clipRect(v);
                t = "animate";
                d || (t = "attr", this.plotBorder = d = b.rect().addClass("highcharts-plot-border").attr({
                    zIndex: 1
                }).add());
                d[t](d.crisp({
                    x: k,
                    y: u,
                    width: p,
                    height: r
                }, -d.strokeWidth()));
                this.isDirtyBox = !1
            },
            propFromSeries: function() {
                var a = this,
                    f = a.options.chart,
                    c, e = a.options.series,
                    g, d;
                b(["inverted", "angular", "polar"], function(b) {
                    c = H[f.type || f.defaultSeriesType];
                    d = f[b] || c && c.prototype[b];
                    for (g = e && e.length; !d && g--;)(c = H[e[g].type]) && c.prototype[b] && (d = !0);
                    a[b] = d
                })
            },
            linkSeries: function() {
                var a = this,
                    f = a.series;
                b(f, function(a) {
                    a.linkedSeries.length = 0
                });
                b(f, function(b) {
                    var f = b.options.linkedTo;
                    v(f) && (f = ":previous" === f ? a.series[b.index - 1] : a.get(f)) && f.linkedParent !== b && (f.linkedSeries.push(b), b.linkedParent = f, b.visible = A(b.options.visible, f.options.visible, b.visible))
                })
            },
            renderSeries: function() {
                b(this.series, function(a) {
                    a.translate();
                    a.render()
                })
            },
            renderLabels: function() {
                var a =
                    this,
                    f = a.options.labels;
                f.items && b(f.items, function(b) {
                    var c = E(f.style, b.style),
                        e = u(c.left) + a.plotLeft,
                        g = u(c.top) + a.plotTop + 12;
                    delete c.left;
                    delete c.top;
                    a.renderer.text(b.html, e, g).attr({
                        zIndex: 2
                    }).css(c).add()
                })
            },
            render: function() {
                var a = this.axes,
                    f = this.renderer,
                    c = this.options,
                    e, g, d;
                this.setTitle();
                this.legend = new C(this, c.legend);
                this.getStacks && this.getStacks();
                this.getMargins(!0);
                this.setChartSize();
                c = this.plotWidth;
                e = this.plotHeight -= 21;
                b(a, function(a) {
                    a.setScale()
                });
                this.getAxisMargins();
                g =
                    1.1 < c / this.plotWidth;
                d = 1.05 < e / this.plotHeight;
                if (g || d) b(a, function(a) {
                    (a.horiz && g || !a.horiz && d) && a.setTickInterval(!0)
                }), this.getMargins();
                this.drawChartBox();
                this.hasCartesianSeries && b(a, function(a) {
                    a.visible && a.render()
                });
                this.seriesGroup || (this.seriesGroup = f.g("series-group").attr({
                    zIndex: 3
                }).add());
                this.renderSeries();
                this.renderLabels();
                this.addCredits();
                this.setResponsive && this.setResponsive();
                this.hasRendered = !0
            },
            addCredits: function(a) {
                var b = this;
                a = y(!0, this.options.credits, a);
                a.enabled && !this.credits &&
                    (this.credits = this.renderer.text(a.text + (this.mapCredits || ""), 0, 0).addClass("highcharts-credits").on("click", function() {
                        a.href && (O.location.href = a.href)
                    }).attr({
                        align: a.position.align,
                        zIndex: 8
                    }).add().align(a.position), this.credits.update = function(a) {
                        b.credits = b.credits.destroy();
                        b.addCredits(a)
                    })
            },
            destroy: function() {
                var f = this,
                    c = f.axes,
                    e = f.series,
                    g = f.container,
                    d, h = g && g.parentNode;
                t(f, "destroy");
                n[f.index] = void 0;
                a.chartCount--;
                f.renderTo.removeAttribute("data-highcharts-chart");
                L(f);
                for (d = c.length; d--;) c[d] =
                    c[d].destroy();
                this.scroller && this.scroller.destroy && this.scroller.destroy();
                for (d = e.length; d--;) e[d] = e[d].destroy();
                b("title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" "), function(a) {
                    var b = f[a];
                    b && b.destroy && (f[a] = b.destroy())
                });
                g && (g.innerHTML = "", L(g), h && m(g));
                for (d in f) delete f[d]
            },
            isReadyToRender: function() {
                var a = this;
                return r || O != O.top || "complete" === F.readyState ? !0 : (F.attachEvent("onreadystatechange",
                    function() {
                        F.detachEvent("onreadystatechange", a.firstRender);
                        "complete" === F.readyState && a.firstRender()
                    }), !1)
            },
            firstRender: function() {
                var a = this,
                    c = a.options;
                if (a.isReadyToRender()) {
                    a.getContainer();
                    t(a, "init");
                    a.resetMargins();
                    a.setChartSize();
                    a.propFromSeries();
                    a.getAxes();
                    b(c.series || [], function(b) {
                        a.initSeries(b)
                    });
                    a.linkSeries();
                    t(a, "beforeRender");
                    f && (a.pointer = new f(a, c));
                    a.render();
                    if (!a.renderer.imgCount && a.onload) a.onload();
                    a.cloneRenderTo(!0)
                }
            },
            onload: function() {
                b([this.callback].concat(this.callbacks),
                    function(a) {
                        a && void 0 !== this.index && a.apply(this, [this])
                    }, this);
                t(this, "load");
                t(this, "render");
                l(this.index) && !1 !== this.options.chart.reflow && this.initReflow();
                this.onload = null
            }
        }
    })(J);
    (function(a) {
        var B, x = a.each,
            D = a.extend,
            F = a.erase,
            q = a.fireEvent,
            c = a.format,
            d = a.isArray,
            m = a.isNumber,
            n = a.pick,
            k = a.removeEvent;
        B = a.Point = function() {};
        B.prototype = {
            init: function(a, b, c) {
                var d = a.chart.options.chart.colorCount;
                this.series = a;
                this.applyOptions(b, c);
                a.options.colorByPoint ? (b = a.colorCounter, a.colorCounter++, a.colorCounter ===
                    d && (a.colorCounter = 0)) : b = a.colorIndex;
                this.colorIndex = n(this.colorIndex, b);
                a.chart.pointCount++;
                return this
            },
            applyOptions: function(a, b) {
                var c = this.series,
                    d = c.options.pointValKey || c.pointValKey;
                a = B.prototype.optionsToObject.call(this, a);
                D(this, a);
                this.options = this.options ? D(this.options, a) : a;
                a.group && delete this.group;
                d && (this.y = this[d]);
                this.isNull = n(this.isValid && !this.isValid(), null === this.x || !m(this.y, !0));
                this.selected && (this.state = "select");
                "name" in this && void 0 === b && c.xAxis && c.xAxis.hasNames &&
                    (this.x = c.xAxis.nameToX(this));
                void 0 === this.x && c && (this.x = void 0 === b ? c.autoIncrement(this) : b);
                return this
            },
            optionsToObject: function(a) {
                var b = {},
                    c = this.series,
                    l = c.options.keys,
                    k = l || c.pointArrayMap || ["y"],
                    e = k.length,
                    p = 0,
                    h = 0;
                if (m(a) || null === a) b[k[0]] = a;
                else if (d(a))
                    for (!l && a.length > e && (c = typeof a[0], "string" === c ? b.name = a[0] : "number" === c && (b.x = a[0]), p++); h < e;) l && void 0 === a[p] || (b[k[h]] = a[p]), p++, h++;
                else "object" === typeof a && (b = a, a.dataLabels && (c._hasPointLabels = !0), a.marker && (c._hasPointMarkers = !0));
                return b
            },
            getClassName: function() {
                return "highcharts-point" + (this.selected ? " highcharts-point-select" : "") + (this.negative ? " highcharts-negative" : "") + (this.isNull ? " highcharts-null-point" : "") + (void 0 !== this.colorIndex ? " highcharts-color-" + this.colorIndex : "") + (this.options.className ? " " + this.options.className : "") + (this.zone && this.zone.className ? " " + this.zone.className.replace("highcharts-negative", "") : "")
            },
            getZone: function() {
                var a = this.series,
                    b = a.zones,
                    a = a.zoneAxis || "y",
                    c = 0,
                    d;
                for (d = b[c]; this[a] >= d.value;) d =
                    b[++c];
                d && d.color && !this.options.color && (this.color = d.color);
                return d
            },
            destroy: function() {
                var a = this.series.chart,
                    b = a.hoverPoints,
                    c;
                a.pointCount--;
                b && (this.setState(), F(b, this), b.length || (a.hoverPoints = null));
                if (this === a.hoverPoint) this.onMouseOut();
                if (this.graphic || this.dataLabel) k(this), this.destroyElements();
                this.legendItem && a.legend.destroyItem(this);
                for (c in this) this[c] = null
            },
            destroyElements: function() {
                for (var a = ["graphic", "dataLabel", "dataLabelUpper", "connector", "shadowGroup"], b, c = 6; c--;) b =
                    a[c], this[b] && (this[b] = this[b].destroy())
            },
            getLabelConfig: function() {
                return {
                    x: this.category,
                    y: this.y,
                    color: this.color,
                    colorIndex: this.colorIndex,
                    key: this.name || this.category,
                    series: this.series,
                    point: this,
                    percentage: this.percentage,
                    total: this.total || this.stackTotal
                }
            },
            tooltipFormatter: function(a) {
                var b = this.series,
                    d = b.tooltipOptions,
                    k = n(d.valueDecimals, ""),
                    l = d.valuePrefix || "",
                    e = d.valueSuffix || "";
                x(b.pointArrayMap || ["y"], function(b) {
                    b = "{point." + b;
                    if (l || e) a = a.replace(b + "}", l + b + "}" + e);
                    a = a.replace(b + "}",
                        b + ":,." + k + "f}")
                });
                return c(a, {
                    point: this,
                    series: this.series
                })
            },
            firePointEvent: function(a, b, c) {
                var d = this,
                    k = this.series.options;
                (k.point.events[a] || d.options && d.options.events && d.options.events[a]) && this.importEvents();
                "click" === a && k.allowPointSelect && (c = function(a) {
                    d.select && d.select(null, a.ctrlKey || a.metaKey || a.shiftKey)
                });
                q(this, a, b, c)
            },
            visible: !0
        }
    })(J);
    (function(a) {
        var B = a.addEvent,
            x = a.animObject,
            D = a.arrayMax,
            F = a.arrayMin,
            q = a.correctFloat,
            c = a.Date,
            d = a.defaultOptions,
            m = a.defined,
            n = a.each,
            k = a.erase,
            l = a.extend,
            b = a.fireEvent,
            E = a.grep,
            w = a.isArray,
            t = a.isNumber,
            e = a.isString,
            p = a.merge,
            h = a.pick,
            I = a.removeEvent,
            v = a.splat,
            C = a.SVGElement,
            G = a.syncTimeout,
            y = a.win;
        a.Series = a.seriesType("line", null, {
            allowPointSelect: !1,
            showCheckbox: !1,
            animation: {
                duration: 1E3
            },
            events: {},
            marker: {
                radius: 4,
                states: {
                    hover: {
                        animation: {
                            duration: 50
                        },
                        enabled: !0,
                        radiusPlus: 2
                    }
                }
            },
            point: {
                events: {}
            },
            dataLabels: {
                align: "center",
                formatter: function() {
                    return null === this.y ? "" : a.numberFormat(this.y, -1)
                },
                verticalAlign: "bottom",
                x: 0,
                y: 0,
                padding: 5
            },
            cropThreshold: 300,
            pointRange: 0,
            softThreshold: !0,
            states: {
                hover: {
                    lineWidthPlus: 1,
                    marker: {},
                    halo: {
                        size: 10
                    }
                },
                select: {
                    marker: {}
                }
            },
            stickyTracking: !0,
            turboThreshold: 1E3
        }, {
            isCartesian: !0,
            pointClass: a.Point,
            sorted: !0,
            requireSorting: !0,
            directTouch: !1,
            axisTypes: ["xAxis", "yAxis"],
            colorCounter: 0,
            parallelArrays: ["x", "y"],
            coll: "series",
            init: function(a, b) {
                var f = this,
                    c, e, g = a.series,
                    d;
                f.chart = a;
                f.options = b = f.setOptions(b);
                f.linkedSeries = [];
                f.bindAxes();
                l(f, {
                    name: b.name,
                    state: "",
                    visible: !1 !== b.visible,
                    selected: !0 ===
                        b.selected
                });
                e = b.events;
                for (c in e) B(f, c, e[c]);
                if (e && e.click || b.point && b.point.events && b.point.events.click || b.allowPointSelect) a.runTrackerClick = !0;
                f.getColor();
                f.getSymbol();
                n(f.parallelArrays, function(a) {
                    f[a + "Data"] = []
                });
                f.setData(b.data, !1);
                f.isCartesian && (a.hasCartesianSeries = !0);
                g.length && (d = g[g.length - 1]);
                f._i = h(d && d._i, -1) + 1;
                a.orderSeries(this.insert(g))
            },
            insert: function(a) {
                var b = this.options.index,
                    f;
                if (t(b)) {
                    for (f = a.length; f--;)
                        if (b >= h(a[f].options.index, a[f]._i)) {
                            a.splice(f + 1, 0, this);
                            break
                        } - 1 ===
                        f && a.unshift(this);
                    f += 1
                } else a.push(this);
                return h(f, a.length - 1)
            },
            bindAxes: function() {
                var b = this,
                    c = b.options,
                    e = b.chart,
                    d;
                n(b.axisTypes || [], function(f) {
                    n(e[f], function(a) {
                        d = a.options;
                        if (c[f] === d.index || void 0 !== c[f] && c[f] === d.id || void 0 === c[f] && 0 === d.index) b.insert(a.series), b[f] = a, a.isDirty = !0
                    });
                    b[f] || b.optionalAxis === f || a.error(18, !0)
                })
            },
            updateParallelArrays: function(a, b) {
                var f = a.series,
                    c = arguments,
                    e = t(b) ? function(c) {
                        var e = "y" === c && f.toYData ? f.toYData(a) : a[c];
                        f[c + "Data"][b] = e
                    } : function(a) {
                        Array.prototype[b].apply(f[a +
                            "Data"], Array.prototype.slice.call(c, 2))
                    };
                n(f.parallelArrays, e)
            },
            autoIncrement: function() {
                var a = this.options,
                    b = this.xIncrement,
                    e, d = a.pointIntervalUnit,
                    b = h(b, a.pointStart, 0);
                this.pointInterval = e = h(this.pointInterval, a.pointInterval, 1);
                d && (a = new c(b), "day" === d ? a = +a[c.hcSetDate](a[c.hcGetDate]() + e) : "month" === d ? a = +a[c.hcSetMonth](a[c.hcGetMonth]() + e) : "year" === d && (a = +a[c.hcSetFullYear](a[c.hcGetFullYear]() + e)), e = a - b);
                this.xIncrement = b + e;
                return b
            },
            setOptions: function(a) {
                var b = this.chart,
                    f = b.options.plotOptions,
                    b = b.userOptions || {},
                    c = b.plotOptions || {},
                    e = f[this.type];
                this.userOptions = a;
                f = p(e, f.series, a);
                this.tooltipOptions = p(d.tooltip, d.plotOptions[this.type].tooltip, b.tooltip, c.series && c.series.tooltip, c[this.type] && c[this.type].tooltip, a.tooltip);
                null === e.marker && delete f.marker;
                this.zoneAxis = f.zoneAxis;
                a = this.zones = (f.zones || []).slice();
                !f.negativeColor && !f.negativeFillColor || f.zones || a.push({
                    value: f[this.zoneAxis + "Threshold"] || f.threshold || 0,
                    className: "highcharts-negative"
                });
                a.length && m(a[a.length - 1].value) &&
                    a.push({});
                return f
            },
            getCyclic: function(a, b, c) {
                var f, e = this.chart,
                    g = this.userOptions,
                    d = a + "Index",
                    k = a + "Counter",
                    l = c ? c.length : h(e.options.chart[a + "Count"], e[a + "Count"]);
                b || (f = h(g[d], g["_" + d]), m(f) || (e.series.length || (e[k] = 0), g["_" + d] = f = e[k] % l, e[k] += 1), c && (b = c[f]));
                void 0 !== f && (this[d] = f);
                this[a] = b
            },
            getColor: function() {
                this.getCyclic("color")
            },
            getSymbol: function() {
                this.getCyclic("symbol", this.options.marker.symbol, this.chart.options.symbols)
            },
            drawLegendSymbol: a.LegendSymbolMixin.drawLineMarker,
            setData: function(b,
                c, d, k) {
                var f = this,
                    g = f.points,
                    l = g && g.length || 0,
                    p, m = f.options,
                    v = f.chart,
                    u = null,
                    A = f.xAxis,
                    q = m.turboThreshold,
                    C = this.xData,
                    y = this.yData,
                    G = (p = f.pointArrayMap) && p.length;
                b = b || [];
                p = b.length;
                c = h(c, !0);
                if (!1 !== k && p && l === p && !f.cropped && !f.hasGroupedData && f.visible) n(b, function(a, b) {
                    g[b].update && a !== m.data[b] && g[b].update(a, !1, null, !1)
                });
                else {
                    f.xIncrement = null;
                    f.colorCounter = 0;
                    n(this.parallelArrays, function(a) {
                        f[a + "Data"].length = 0
                    });
                    if (q && p > q) {
                        for (d = 0; null === u && d < p;) u = b[d], d++;
                        if (t(u))
                            for (d = 0; d < p; d++) C[d] = this.autoIncrement(),
                                y[d] = b[d];
                        else if (w(u))
                            if (G)
                                for (d = 0; d < p; d++) u = b[d], C[d] = u[0], y[d] = u.slice(1, G + 1);
                            else
                                for (d = 0; d < p; d++) u = b[d], C[d] = u[0], y[d] = u[1];
                        else a.error(12)
                    } else
                        for (d = 0; d < p; d++) void 0 !== b[d] && (u = {
                            series: f
                        }, f.pointClass.prototype.applyOptions.apply(u, [b[d]]), f.updateParallelArrays(u, d));
                    e(y[0]) && a.error(14, !0);
                    f.data = [];
                    f.options.data = f.userOptions.data = b;
                    for (d = l; d--;) g[d] && g[d].destroy && g[d].destroy();
                    A && (A.minRange = A.userMinRange);
                    f.isDirty = v.isDirtyBox = !0;
                    f.isDirtyData = !!g;
                    d = !1
                }
                "point" === m.legendType && (this.processData(),
                    this.generatePoints());
                c && v.redraw(d)
            },
            processData: function(b) {
                var f = this.xData,
                    c = this.yData,
                    e = f.length,
                    d;
                d = 0;
                var g, h, k = this.xAxis,
                    l, p = this.options;
                l = p.cropThreshold;
                var m = this.getExtremesFromAll || p.getExtremesFromAll,
                    v = this.isCartesian,
                    p = k && k.val2lin,
                    n = k && k.isLog,
                    t, q;
                if (v && !this.isDirty && !k.isDirty && !this.yAxis.isDirty && !b) return !1;
                k && (b = k.getExtremes(), t = b.min, q = b.max);
                if (v && this.sorted && !m && (!l || e > l || this.forceCrop))
                    if (f[e - 1] < t || f[0] > q) f = [], c = [];
                    else if (f[0] < t || f[e - 1] > q) d = this.cropData(this.xData,
                    this.yData, t, q), f = d.xData, c = d.yData, d = d.start, g = !0;
                for (l = f.length || 1; --l;) e = n ? p(f[l]) - p(f[l - 1]) : f[l] - f[l - 1], 0 < e && (void 0 === h || e < h) ? h = e : 0 > e && this.requireSorting && a.error(15);
                this.cropped = g;
                this.cropStart = d;
                this.processedXData = f;
                this.processedYData = c;
                this.closestPointRange = h
            },
            cropData: function(a, b, c, e) {
                var f = a.length,
                    d = 0,
                    k = f,
                    l = h(this.cropShoulder, 1),
                    p;
                for (p = 0; p < f; p++)
                    if (a[p] >= c) {
                        d = Math.max(0, p - l);
                        break
                    }
                for (c = p; c < f; c++)
                    if (a[c] > e) {
                        k = c + l;
                        break
                    }
                return {
                    xData: a.slice(d, k),
                    yData: b.slice(d, k),
                    start: d,
                    end: k
                }
            },
            generatePoints: function() {
                var a = this.options.data,
                    b = this.data,
                    c, e = this.processedXData,
                    d = this.processedYData,
                    g = this.pointClass,
                    h = e.length,
                    k = this.cropStart || 0,
                    l, p = this.hasGroupedData,
                    m, t = [],
                    n;
                b || p || (b = [], b.length = a.length, b = this.data = b);
                for (n = 0; n < h; n++) l = k + n, p ? (m = (new g).init(this, [e[n]].concat(v(d[n]))), m.dataGroup = this.groupMap[n]) : (m = b[l]) || void 0 === a[l] || (b[l] = m = (new g).init(this, a[l], e[n])), m.index = l, t[n] = m;
                if (b && (h !== (c = b.length) || p))
                    for (n = 0; n < c; n++) n !== k || p || (n += h), b[n] && (b[n].destroyElements(),
                        b[n].plotX = void 0);
                this.data = b;
                this.points = t
            },
            getExtremes: function(a) {
                var b = this.yAxis,
                    f = this.processedXData,
                    c, e = [],
                    d = 0;
                c = this.xAxis.getExtremes();
                var h = c.min,
                    k = c.max,
                    l, p, m, n;
                a = a || this.stackedYData || this.processedYData || [];
                c = a.length;
                for (n = 0; n < c; n++)
                    if (p = f[n], m = a[n], l = (t(m, !0) || w(m)) && (!b.isLog || m.length || 0 < m), p = this.getExtremesFromAll || this.options.getExtremesFromAll || this.cropped || (f[n + 1] || p) >= h && (f[n - 1] || p) <= k, l && p)
                        if (l = m.length)
                            for (; l--;) null !== m[l] && (e[d++] = m[l]);
                        else e[d++] = m;
                this.dataMin = F(e);
                this.dataMax = D(e)
            },
            translate: function() {
                this.processedXData || this.processData();
                this.generatePoints();
                var a = this.options,
                    b = a.stacking,
                    c = this.xAxis,
                    e = c.categories,
                    d = this.yAxis,
                    g = this.points,
                    k = g.length,
                    l = !!this.modifyValue,
                    p = a.pointPlacement,
                    n = "between" === p || t(p),
                    v = a.threshold,
                    C = a.startFromThreshold ? v : 0,
                    w, y, G, E, I = Number.MAX_VALUE;
                "between" === p && (p = .5);
                t(p) && (p *= h(a.pointRange || c.pointRange));
                for (a = 0; a < k; a++) {
                    var x = g[a],
                        B = x.x,
                        D = x.y;
                    y = x.low;
                    var F = b && d.stacks[(this.negStacks && D < (C ? 0 : v) ? "-" : "") + this.stackKey],
                        J;
                    d.isLog && null !== D && 0 >= D && (x.isNull = !0);
                    x.plotX = w = q(Math.min(Math.max(-1E5, c.translate(B, 0, 0, 0, 1, p, "flags" === this.type)), 1E5));
                    b && this.visible && !x.isNull && F && F[B] && (E = this.getStackIndicator(E, B, this.index), J = F[B], D = J.points[E.key], y = D[0], D = D[1], y === C && E.key === F[B].base && (y = h(v, d.min)), d.isLog && 0 >= y && (y = null), x.total = x.stackTotal = J.total, x.percentage = J.total && x.y / J.total * 100, x.stackY = D, J.setOffset(this.pointXOffset || 0, this.barW || 0));
                    x.yBottom = m(y) ? d.translate(y, 0, 1, 0, 1) : null;
                    l && (D = this.modifyValue(D,
                        x));
                    x.plotY = y = "number" === typeof D && Infinity !== D ? Math.min(Math.max(-1E5, d.translate(D, 0, 1, 0, 1)), 1E5) : void 0;
                    x.isInside = void 0 !== y && 0 <= y && y <= d.len && 0 <= w && w <= c.len;
                    x.clientX = n ? q(c.translate(B, 0, 0, 0, 1, p)) : w;
                    x.negative = x.y < (v || 0);
                    x.category = e && void 0 !== e[x.x] ? e[x.x] : x.x;
                    x.isNull || (void 0 !== G && (I = Math.min(I, Math.abs(w - G))), G = w);
                    x.zone = this.zones.length && x.getZone()
                }
                this.closestPointRangePx = I
            },
            getValidPoints: function(a, b) {
                var c = this.chart;
                return E(a || this.points || [], function(a) {
                    return b && !c.isInsidePlot(a.plotX,
                        a.plotY, c.inverted) ? !1 : !a.isNull
                })
            },
            setClip: function(a) {
                var b = this.chart,
                    c = this.options,
                    f = b.renderer,
                    e = b.inverted,
                    d = this.clipBox,
                    h = d || b.clipBox,
                    k = this.sharedClipKey || ["_sharedClip", a && a.duration, a && a.easing, h.height, c.xAxis, c.yAxis].join(),
                    l = b[k],
                    p = b[k + "m"];
                l || (a && (h.width = 0, b[k + "m"] = p = f.clipRect(-99, e ? -b.plotLeft : -b.plotTop, 99, e ? b.chartWidth : b.chartHeight)), b[k] = l = f.clipRect(h), l.count = {
                    length: 0
                });
                a && !l.count[this.index] && (l.count[this.index] = !0, l.count.length += 1);
                !1 !== c.clip && (this.group.clip(a ||
                    d ? l : b.clipRect), this.markerGroup.clip(p), this.sharedClipKey = k);
                a || (l.count[this.index] && (delete l.count[this.index], --l.count.length), 0 === l.count.length && k && b[k] && (d || (b[k] = b[k].destroy()), b[k + "m"] && (this.markerGroup.clip(), b[k + "m"] = b[k + "m"].destroy())))
            },
            animate: function(a) {
                var b = this.chart,
                    c = x(this.options.animation),
                    f;
                a ? this.setClip(c) : (f = this.sharedClipKey, (a = b[f]) && a.animate({
                    width: b.plotSizeX
                }, c), b[f + "m"] && b[f + "m"].animate({
                    width: b.plotSizeX + 99
                }, c), this.animate = null)
            },
            afterAnimate: function() {
                this.setClip();
                b(this, "afterAnimate")
            },
            drawPoints: function() {
                var a = this.points,
                    b = this.chart,
                    c, e, d, g, k = this.options.marker,
                    l, p, m, n, v = this.markerGroup,
                    q = h(k.enabled, this.xAxis.isRadial ? !0 : null, this.closestPointRangePx > 2 * k.radius);
                if (!1 !== k.enabled || this._hasPointMarkers)
                    for (e = 0; e < a.length; e++) d = a[e], c = d.plotY, g = d.graphic, l = d.marker || {}, p = !!d.marker, m = q && void 0 === l.enabled || l.enabled, n = d.isInside, m && t(c) && null !== d.y ? (c = h(l.symbol, this.symbol), d.hasImage = 0 === c.indexOf("url"), m = this.markerAttribs(d, d.selected && "select"),
                        g ? g[n ? "show" : "hide"](!0).animate(m) : n && (0 < m.width || d.hasImage) && (d.graphic = g = b.renderer.symbol(c, m.x, m.y, m.width, m.height, p ? l : k).add(v)), g && g.addClass(d.getClassName(), !0)) : g && (d.graphic = g.destroy())
            },
            markerAttribs: function(a, b) {
                var c = this.options.marker,
                    f = a.marker || {},
                    e = h(f.radius, c.radius);
                b && (c = c.states[b], b = f.states && f.states[b], e = h(b && b.radius, c && c.radius, e + (c && c.radiusPlus || 0)));
                a.hasImage && (e = 0);
                a = {
                    x: Math.floor(a.plotX) - e,
                    y: a.plotY - e
                };
                e && (a.width = a.height = 2 * e);
                return a
            },
            destroy: function() {
                var a =
                    this,
                    c = a.chart,
                    e = /AppleWebKit\/533/.test(y.navigator.userAgent),
                    d, h = a.data || [],
                    g, l, p;
                b(a, "destroy");
                I(a);
                n(a.axisTypes || [], function(b) {
                    (p = a[b]) && p.series && (k(p.series, a), p.isDirty = p.forceRedraw = !0)
                });
                a.legendItem && a.chart.legend.destroyItem(a);
                for (d = h.length; d--;)(g = h[d]) && g.destroy && g.destroy();
                a.points = null;
                clearTimeout(a.animationTimeout);
                for (l in a) a[l] instanceof C && !a[l].survive && (d = e && "group" === l ? "hide" : "destroy", a[l][d]());
                c.hoverSeries === a && (c.hoverSeries = null);
                k(c.series, a);
                c.orderSeries();
                for (l in a) delete a[l]
            },
            getGraphPath: function(a, b, c) {
                var f = this,
                    e = f.options,
                    d = e.step,
                    h, k = [],
                    l = [],
                    p;
                a = a || f.points;
                (h = a.reversed) && a.reverse();
                (d = {
                    right: 1,
                    center: 2
                }[d] || d && 3) && h && (d = 4 - d);
                !e.connectNulls || b || c || (a = this.getValidPoints(a));
                n(a, function(g, h) {
                    var n = g.plotX,
                        v = g.plotY,
                        r = a[h - 1];
                    (g.leftCliff || r && r.rightCliff) && !c && (p = !0);
                    g.isNull && !m(b) && 0 < h ? p = !e.connectNulls : g.isNull && !b ? p = !0 : (0 === h || p ? h = ["M", g.plotX, g.plotY] : f.getPointSpline ? h = f.getPointSpline(a, g, h) : d ? (h = 1 === d ? ["L", r.plotX, v] : 2 === d ? ["L",
                        (r.plotX + n) / 2, r.plotY, "L", (r.plotX + n) / 2, v
                    ] : ["L", n, r.plotY], h.push("L", n, v)) : h = ["L", n, v], l.push(g.x), d && l.push(g.x), k.push.apply(k, h), p = !1)
                });
                k.xMap = l;
                return f.graphPath = k
            },
            drawGraph: function() {
                var a = this,
                    b = (this.gappedPath || this.getGraphPath).call(this),
                    c = [
                        ["graph", "highcharts-graph"]
                    ];
                n(this.zones, function(a, b) {
                    c.push(["zone-graph-" + b, "highcharts-graph highcharts-zone-graph-" + b + " " + (a.className || "")])
                });
                n(c, function(c, f) {
                    f = c[0];
                    var e = a[f];
                    e ? (e.endX = b.xMap, e.animate({
                        d: b
                    })) : b.length && (a[f] = a.chart.renderer.path(b).addClass(c[1]).attr({
                        zIndex: 1
                    }).add(a.group));
                    e && (e.startX = b.xMap, e.isArea = b.isArea)
                })
            },
            applyZones: function() {
                var a = this,
                    b = this.chart,
                    c = b.renderer,
                    e = this.zones,
                    d, g, k = this.clips || [],
                    l, p = this.graph,
                    m = this.area,
                    v = Math.max(b.chartWidth, b.chartHeight),
                    t = this[(this.zoneAxis || "y") + "Axis"],
                    q, C, y = b.inverted,
                    w, G, E, x, I = !1;
                e.length && (p || m) && t && void 0 !== t.min && (C = t.reversed, w = t.horiz, p && p.hide(), m && m.hide(), q = t.getExtremes(), n(e, function(f, e) {
                    d = C ? w ? b.plotWidth : 0 : w ? 0 : t.toPixels(q.min);
                    d = Math.min(Math.max(h(g, d), 0), v);
                    g = Math.min(Math.max(Math.round(t.toPixels(h(f.value,
                        q.max), !0)), 0), v);
                    I && (d = g = t.toPixels(q.max));
                    G = Math.abs(d - g);
                    E = Math.min(d, g);
                    x = Math.max(d, g);
                    t.isXAxis ? (l = {
                        x: y ? x : E,
                        y: 0,
                        width: G,
                        height: v
                    }, w || (l.x = b.plotHeight - l.x)) : (l = {
                        x: 0,
                        y: y ? x : E,
                        width: v,
                        height: G
                    }, w && (l.y = b.plotWidth - l.y));
                    k[e] ? k[e].animate(l) : (k[e] = c.clipRect(l), p && a["zone-graph-" + e].clip(k[e]), m && a["zone-area-" + e].clip(k[e]));
                    I = f.value > q.max
                }), this.clips = k)
            },
            invertGroups: function(a) {
                function b() {
                    n(["group", "markerGroup"], function(b) {
                        c[b] && (c[b].width = c.yAxis.len, c[b].height = c.xAxis.len, c[b].invert(a))
                    })
                }
                var c = this,
                    f;
                c.xAxis && (f = B(c.chart, "resize", b), B(c, "destroy", f), b(a), c.invertGroups = b)
            },
            plotGroup: function(a, b, c, e, d) {
                var f = this[a],
                    h = !f;
                h && (this[a] = f = this.chart.renderer.g(b).attr({
                    zIndex: e || .1
                }).add(d), f.addClass("highcharts-series-" + this.index + " highcharts-" + this.type + "-series highcharts-color-" + this.colorIndex + " " + (this.options.className || "")));
                f.attr({
                    visibility: c
                })[h ? "attr" : "animate"](this.getPlotBox());
                return f
            },
            getPlotBox: function() {
                var a = this.chart,
                    b = this.xAxis,
                    c = this.yAxis;
                a.inverted && (b =
                    c, c = this.xAxis);
                return {
                    translateX: b ? b.left : a.plotLeft,
                    translateY: c ? c.top : a.plotTop,
                    scaleX: 1,
                    scaleY: 1
                }
            },
            render: function() {
                var a = this,
                    b = a.chart,
                    c, e = a.options,
                    d = !!a.animate && b.renderer.isSVG && x(e.animation).duration,
                    g = a.visible ? "inherit" : "hidden",
                    h = e.zIndex,
                    k = a.hasRendered,
                    l = b.seriesGroup,
                    p = b.inverted;
                c = a.plotGroup("group", "series", g, h, l);
                a.markerGroup = a.plotGroup("markerGroup", "markers", g, h, l);
                d && a.animate(!0);
                c.inverted = a.isCartesian ? p : !1;
                a.drawGraph && (a.drawGraph(), a.applyZones());
                a.drawDataLabels &&
                    a.drawDataLabels();
                a.visible && a.drawPoints();
                a.drawTracker && !1 !== a.options.enableMouseTracking && a.drawTracker();
                a.invertGroups(p);
                !1 === e.clip || a.sharedClipKey || k || c.clip(b.clipRect);
                d && a.animate();
                k || (a.animationTimeout = G(function() {
                    a.afterAnimate()
                }, d));
                a.isDirty = !1;
                a.hasRendered = !0
            },
            redraw: function() {
                var a = this.chart,
                    b = this.isDirty || this.isDirtyData,
                    c = this.group,
                    e = this.xAxis,
                    d = this.yAxis;
                c && (a.inverted && c.attr({
                    width: a.plotWidth,
                    height: a.plotHeight
                }), c.animate({
                    translateX: h(e && e.left, a.plotLeft),
                    translateY: h(d && d.top, a.plotTop)
                }));
                this.translate();
                this.render();
                b && delete this.kdTree
            },
            kdDimensions: 1,
            kdAxisArray: ["clientX", "plotY"],
            searchPoint: function(a, b) {
                var c = this.xAxis,
                    e = this.yAxis,
                    f = this.chart.inverted;
                return this.searchKDTree({
                    clientX: f ? c.len - a.chartY + c.pos : a.chartX - c.pos,
                    plotY: f ? e.len - a.chartX + e.pos : a.chartY - e.pos
                }, b)
            },
            buildKDTree: function() {
                function a(c, e, f) {
                    var d, g;
                    if (g = c && c.length) return d = b.kdAxisArray[e % f], c.sort(function(a, b) {
                        return a[d] - b[d]
                    }), g = Math.floor(g / 2), {
                        point: c[g],
                        left: a(c.slice(0,
                            g), e + 1, f),
                        right: a(c.slice(g + 1), e + 1, f)
                    }
                }
                this.buildingKdTree = !0;
                var b = this,
                    c = b.kdDimensions;
                delete b.kdTree;
                G(function() {
                    b.kdTree = a(b.getValidPoints(null, !b.directTouch), c, c);
                    b.buildingKdTree = !1
                }, b.options.kdNow ? 0 : 1)
            },
            searchKDTree: function(a, b) {
                function c(a, b, g, k) {
                    var l = b.point,
                        p = e.kdAxisArray[g % k],
                        n, v, t = l;
                    v = m(a[f]) && m(l[f]) ? Math.pow(a[f] - l[f], 2) : null;
                    n = m(a[d]) && m(l[d]) ? Math.pow(a[d] - l[d], 2) : null;
                    n = (v || 0) + (n || 0);
                    l.dist = m(n) ? Math.sqrt(n) : Number.MAX_VALUE;
                    l.distX = m(v) ? Math.sqrt(v) : Number.MAX_VALUE;
                    p =
                        a[p] - l[p];
                    n = 0 > p ? "left" : "right";
                    v = 0 > p ? "right" : "left";
                    b[n] && (n = c(a, b[n], g + 1, k), t = n[h] < t[h] ? n : l);
                    b[v] && Math.sqrt(p * p) < t[h] && (a = c(a, b[v], g + 1, k), t = a[h] < t[h] ? a : t);
                    return t
                }
                var e = this,
                    f = this.kdAxisArray[0],
                    d = this.kdAxisArray[1],
                    h = b ? "distX" : "dist";
                this.kdTree || this.buildingKdTree || this.buildKDTree();
                if (this.kdTree) return c(a, this.kdTree, this.kdDimensions, this.kdDimensions)
            }
        })
    })(J);
    (function(a) {
        function B(a, c, b, d, m) {
            var k = a.chart.inverted;
            this.axis = a;
            this.isNegative = b;
            this.options = c;
            this.x = d;
            this.total = null;
            this.points = {};
            this.stack = m;
            this.rightCliff = this.leftCliff = 0;
            this.alignOptions = {
                align: c.align || (k ? b ? "left" : "right" : "center"),
                verticalAlign: c.verticalAlign || (k ? "middle" : b ? "bottom" : "top"),
                y: n(c.y, k ? 4 : b ? 14 : -6),
                x: n(c.x, k ? b ? -6 : 6 : 0)
            };
            this.textAlign = c.textAlign || (k ? b ? "right" : "left" : "center")
        }
        var x = a.Axis,
            D = a.Chart,
            F = a.correctFloat,
            q = a.defined,
            c = a.destroyObjectProperties,
            d = a.each,
            m = a.format,
            n = a.pick;
        a = a.Series;
        B.prototype = {
            destroy: function() {
                c(this, this.axis)
            },
            render: function(a) {
                var c = this.options,
                    b = c.format,
                    b = b ? m(b, this) : c.formatter.call(this);
                this.label ? this.label.attr({
                    text: b,
                    visibility: "hidden"
                }) : this.label = this.axis.chart.renderer.text(b, null, null, c.useHTML).css(c.style).attr({
                    align: this.textAlign,
                    rotation: c.rotation,
                    visibility: "hidden"
                }).add(a)
            },
            setOffset: function(a, c) {
                var b = this.axis,
                    d = b.chart,
                    k = d.inverted,
                    l = b.reversed,
                    l = this.isNegative && !l || !this.isNegative && l,
                    e = b.translate(b.usePercentage ? 100 : this.total, 0, 0, 0, 1),
                    b = b.translate(0),
                    b = Math.abs(e - b);
                a = d.xAxis[0].translate(this.x) + a;
                var p = d.plotHeight,
                    k = {
                        x: k ? l ? e : e - b : a,
                        y: k ? p - a - c : l ? p - e - b : p - e,
                        width: k ? b : c,
                        height: k ? c : b
                    };
                if (c = this.label) c.align(this.alignOptions, null, k), k = c.alignAttr, c[!1 === this.options.crop || d.isInsidePlot(k.x, k.y) ? "show" : "hide"](!0)
            }
        };
        D.prototype.getStacks = function() {
            var a = this;
            d(a.yAxis, function(a) {
                a.stacks && a.hasVisibleSeries && (a.oldStacks = a.stacks)
            });
            d(a.series, function(c) {
                !c.options.stacking || !0 !== c.visible && !1 !== a.options.chart.ignoreHiddenSeries || (c.stackKey = c.type + n(c.options.stack, ""))
            })
        };
        x.prototype.buildStacks = function() {
            var a =
                this.series,
                c, b = n(this.options.reversedStacks, !0),
                d = a.length,
                m;
            if (!this.isXAxis) {
                this.usePercentage = !1;
                for (m = d; m--;) a[b ? m : d - m - 1].setStackedPoints();
                for (m = d; m--;) c = a[b ? m : d - m - 1], c.setStackCliffs && c.setStackCliffs();
                if (this.usePercentage)
                    for (m = 0; m < d; m++) a[m].setPercentStacks()
            }
        };
        x.prototype.renderStackTotals = function() {
            var a = this.chart,
                c = a.renderer,
                b = this.stacks,
                d, m, n = this.stackTotalGroup;
            n || (this.stackTotalGroup = n = c.g("stack-labels").attr({
                visibility: "visible",
                zIndex: 6
            }).add());
            n.translate(a.plotLeft,
                a.plotTop);
            for (d in b)
                for (m in a = b[d], a) a[m].render(n)
        };
        x.prototype.resetStacks = function() {
            var a = this.stacks,
                c, b;
            if (!this.isXAxis)
                for (c in a)
                    for (b in a[c]) a[c][b].touched < this.stacksTouched ? (a[c][b].destroy(), delete a[c][b]) : (a[c][b].total = null, a[c][b].cum = null)
        };
        x.prototype.cleanStacks = function() {
            var a, c, b;
            if (!this.isXAxis)
                for (c in this.oldStacks && (a = this.stacks = this.oldStacks), a)
                    for (b in a[c]) a[c][b].cum = a[c][b].total
        };
        a.prototype.setStackedPoints = function() {
            if (this.options.stacking && (!0 === this.visible ||
                    !1 === this.chart.options.chart.ignoreHiddenSeries)) {
                var a = this.processedXData,
                    c = this.processedYData,
                    b = [],
                    d = c.length,
                    m = this.options,
                    t = m.threshold,
                    e = m.startFromThreshold ? t : 0,
                    p = m.stack,
                    m = m.stacking,
                    h = this.stackKey,
                    x = "-" + h,
                    v = this.negStacks,
                    C = this.yAxis,
                    G = C.stacks,
                    y = C.oldStacks,
                    f, A, u, D, H, g, r;
                C.stacksTouched += 1;
                for (H = 0; H < d; H++) g = a[H], r = c[H], f = this.getStackIndicator(f, g, this.index), D = f.key, u = (A = v && r < (e ? 0 : t)) ? x : h, G[u] || (G[u] = {}), G[u][g] || (y[u] && y[u][g] ? (G[u][g] = y[u][g], G[u][g].total = null) : G[u][g] = new B(C,
                    C.options.stackLabels, A, g, p)), u = G[u][g], null !== r && (u.points[D] = u.points[this.index] = [n(u.cum, e)], q(u.cum) || (u.base = D), u.touched = C.stacksTouched, 0 < f.index && !1 === this.singleStacks && (u.points[D][0] = u.points[this.index + "," + g + ",0"][0])), "percent" === m ? (A = A ? h : x, v && G[A] && G[A][g] ? (A = G[A][g], u.total = A.total = Math.max(A.total, u.total) + Math.abs(r) || 0) : u.total = F(u.total + (Math.abs(r) || 0))) : u.total = F(u.total + (r || 0)), u.cum = n(u.cum, e) + (r || 0), null !== r && (u.points[D].push(u.cum), b[H] = u.cum);
                "percent" === m && (C.usePercentage = !0);
                this.stackedYData = b;
                C.oldStacks = {}
            }
        };
        a.prototype.setPercentStacks = function() {
            var a = this,
                c = a.stackKey,
                b = a.yAxis.stacks,
                m = a.processedXData,
                n;
            d([c, "-" + c], function(c) {
                for (var e = m.length, d, h; e--;)
                    if (d = m[e], n = a.getStackIndicator(n, d, a.index, c), d = (h = b[c] && b[c][d]) && h.points[n.key]) h = h.total ? 100 / h.total : 0, d[0] = F(d[0] * h), d[1] = F(d[1] * h), a.stackedYData[e] = d[1]
            })
        };
        a.prototype.getStackIndicator = function(a, c, b, d) {
            !q(a) || a.x !== c || d && a.key !== d ? a = {
                x: c,
                index: 0,
                key: d
            } : a.index++;
            a.key = [b, c, a.index].join();
            return a
        }
    })(J);
    (function(a) {
        var B = a.addEvent,
            x = a.Axis,
            D = a.createElement,
            F = a.css,
            q = a.defined,
            c = a.each,
            d = a.erase,
            m = a.extend,
            n = a.fireEvent,
            k = a.inArray,
            l = a.isNumber,
            b = a.isObject,
            E = a.merge,
            w = a.pick,
            t = a.Point,
            e = a.Series,
            p = a.seriesTypes,
            h = a.setAnimation,
            I = a.splat;
        m(a.Chart.prototype, {
            addSeries: function(a, b, c) {
                var e, d = this;
                a && (b = w(b, !0), n(d, "addSeries", {
                    options: a
                }, function() {
                    e = d.initSeries(a);
                    d.isDirtyLegend = !0;
                    d.linkSeries();
                    b && d.redraw(c)
                }));
                return e
            },
            addAxis: function(a, b, c, e) {
                var d = b ? "xAxis" : "yAxis",
                    h = this.options;
                a =
                    E(a, {
                        index: this[d].length,
                        isX: b
                    });
                new x(this, a);
                h[d] = I(h[d] || {});
                h[d].push(a);
                w(c, !0) && this.redraw(e)
            },
            showLoading: function(a) {
                var b = this,
                    c = b.options,
                    e = b.loadingDiv,
                    d = function() {
                        e && F(e, {
                            left: b.plotLeft + "px",
                            top: b.plotTop + "px",
                            width: b.plotWidth + "px",
                            height: b.plotHeight + "px"
                        })
                    };
                e || (b.loadingDiv = e = D("div", {
                    className: "highcharts-loading highcharts-loading-hidden"
                }, null, b.container), b.loadingSpan = D("span", {
                    className: "highcharts-loading-inner"
                }, null, e), B(b, "redraw", d));
                e.className = "highcharts-loading";
                b.loadingSpan.innerHTML = a || c.lang.loading;
                b.loadingShown = !0;
                d()
            },
            hideLoading: function() {
                var a = this.loadingDiv;
                a && (a.className = "highcharts-loading highcharts-loading-hidden");
                this.loadingShown = !1
            },
            propsRequireDirtyBox: "backgroundColor borderColor borderWidth margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),
            propsRequireUpdateSeries: "chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions".split(" "),
            update: function(a, b) {
                var e, d = {
                        credits: "addCredits",
                        title: "setTitle",
                        subtitle: "setSubtitle"
                    },
                    f = a.chart,
                    h, p;
                if (f) {
                    E(!0, this.options.chart, f);
                    "className" in f && this.setClassName(f.className);
                    if ("inverted" in f || "polar" in f) this.propFromSeries(), h = !0;
                    for (e in f) f.hasOwnProperty(e) && (-1 !== k("chart." + e, this.propsRequireUpdateSeries) && (p = !0), -1 !== k(e, this.propsRequireDirtyBox) && (this.isDirtyBox = !0))
                }
                for (e in a) {
                    if (this[e] && "function" === typeof this[e].update) this[e].update(a[e], !1);
                    else if ("function" === typeof this[d[e]]) this[d[e]](a[e]);
                    "chart" !== e && -1 !== k(e, this.propsRequireUpdateSeries) && (p = !0)
                }
                a.plotOptions && E(!0, this.options.plotOptions, a.plotOptions);
                c(["xAxis", "yAxis", "series"], function(b) {
                    a[b] && c(I(a[b]), function(a, c) {
                        (c = q(a.id) && this.get(a.id) || this[b][c]) && c.coll === b && c.update(a, !1)
                    }, this)
                }, this);
                h && c(this.axes, function(a) {
                    a.update({}, !1)
                });
                p && c(this.series, function(a) {
                    a.update({}, !1)
                });
                a.loading && E(!0, this.options.loading, a.loading);
                e = f && f.width;
                f = f && f.height;
                l(e) && e !== this.chartWidth || l(f) && f !== this.chartHeight ? this.setSize(e,
                    f) : w(b, !0) && this.redraw()
            },
            setSubtitle: function(a) {
                this.setTitle(void 0, a)
            }
        });
        m(t.prototype, {
            update: function(a, c, e, d) {
                function f() {
                    h.applyOptions(a);
                    null === h.y && l && (h.graphic = l.destroy());
                    b(a, !0) && (l && l.element && a && a.marker && a.marker.symbol && (h.graphic = l.destroy()), a && a.dataLabels && h.dataLabel && (h.dataLabel = h.dataLabel.destroy()));
                    p = h.index;
                    k.updateParallelArrays(h, p);
                    m.data[p] = b(m.data[p], !0) ? h.options : a;
                    k.isDirty = k.isDirtyData = !0;
                    !k.fixedBox && k.hasCartesianSeries && (g.isDirtyBox = !0);
                    "point" === m.legendType &&
                        (g.isDirtyLegend = !0);
                    c && g.redraw(e)
                }
                var h = this,
                    k = h.series,
                    l = h.graphic,
                    p, g = k.chart,
                    m = k.options;
                c = w(c, !0);
                !1 === d ? f() : h.firePointEvent("update", {
                    options: a
                }, f)
            },
            remove: function(a, b) {
                this.series.removePoint(k(this, this.series.data), a, b)
            }
        });
        m(e.prototype, {
            addPoint: function(a, b, c, e) {
                var d = this.options,
                    h = this.data,
                    k = this.chart,
                    l = this.xAxis,
                    l = l && l.hasNames && l.names,
                    p = d.data,
                    g, m, n = this.xData,
                    t, v;
                b = w(b, !0);
                g = {
                    series: this
                };
                this.pointClass.prototype.applyOptions.apply(g, [a]);
                v = g.x;
                t = n.length;
                if (this.requireSorting &&
                    v < n[t - 1])
                    for (m = !0; t && n[t - 1] > v;) t--;
                this.updateParallelArrays(g, "splice", t, 0, 0);
                this.updateParallelArrays(g, t);
                l && g.name && (l[v] = g.name);
                p.splice(t, 0, a);
                m && (this.data.splice(t, 0, null), this.processData());
                "point" === d.legendType && this.generatePoints();
                c && (h[0] && h[0].remove ? h[0].remove(!1) : (h.shift(), this.updateParallelArrays(g, "shift"), p.shift()));
                this.isDirtyData = this.isDirty = !0;
                b && k.redraw(e)
            },
            removePoint: function(a, b, c) {
                var e = this,
                    d = e.data,
                    k = d[a],
                    l = e.points,
                    p = e.chart,
                    m = function() {
                        l && l.length === d.length &&
                            l.splice(a, 1);
                        d.splice(a, 1);
                        e.options.data.splice(a, 1);
                        e.updateParallelArrays(k || {
                            series: e
                        }, "splice", a, 1);
                        k && k.destroy();
                        e.isDirty = !0;
                        e.isDirtyData = !0;
                        b && p.redraw()
                    };
                h(c, p);
                b = w(b, !0);
                k ? k.firePointEvent("remove", null, m) : m()
            },
            remove: function(a, b, c) {
                function e() {
                    d.destroy();
                    h.isDirtyLegend = h.isDirtyBox = !0;
                    h.linkSeries();
                    w(a, !0) && h.redraw(b)
                }
                var d = this,
                    h = d.chart;
                !1 !== c ? n(d, "remove", null, e) : e()
            },
            update: function(a, b) {
                var e = this,
                    d = this.chart,
                    f = this.userOptions,
                    h = this.type,
                    k = a.type || f.type || d.options.chart.type,
                    l = p[h].prototype,
                    n = ["group", "markerGroup", "dataLabelsGroup"],
                    g;
                if (k && k !== h || void 0 !== a.zIndex) n.length = 0;
                c(n, function(a) {
                    n[a] = e[a];
                    delete e[a]
                });
                a = E(f, {
                    animation: !1,
                    index: this.index,
                    pointStart: this.xData[0]
                }, {
                    data: this.options.data
                }, a);
                this.remove(!1, null, !1);
                for (g in l) this[g] = void 0;
                m(this, p[k || h].prototype);
                c(n, function(a) {
                    e[a] = n[a]
                });
                this.init(d, a);
                d.linkSeries();
                w(b, !0) && d.redraw(!1)
            }
        });
        m(x.prototype, {
            update: function(a, b) {
                var c = this.chart;
                a = c.options[this.coll][this.options.index] = E(this.userOptions,
                    a);
                this.destroy(!0);
                this.init(c, m(a, {
                    events: void 0
                }));
                c.isDirtyBox = !0;
                w(b, !0) && c.redraw()
            },
            remove: function(a) {
                for (var b = this.chart, e = this.coll, h = this.series, f = h.length; f--;) h[f] && h[f].remove(!1);
                d(b.axes, this);
                d(b[e], this);
                b.options[e].splice(this.options.index, 1);
                c(b[e], function(a, b) {
                    a.options.index = b
                });
                this.destroy();
                b.isDirtyBox = !0;
                w(a, !0) && b.redraw()
            },
            setTitle: function(a, b) {
                this.update({
                    title: a
                }, b)
            },
            setCategories: function(a, b) {
                this.update({
                    categories: a
                }, b)
            }
        })
    })(J);
    (function(a) {
        var B = a.each,
            x =
            a.map,
            D = a.pick,
            F = a.Series,
            q = a.seriesType;
        q("area", "line", {
            softThreshold: !1,
            threshold: 0
        }, {
            singleStacks: !1,
            getStackPoints: function() {
                var a = [],
                    d = [],
                    m = this.xAxis,
                    n = this.yAxis,
                    k = n.stacks[this.stackKey],
                    l = {},
                    b = this.points,
                    q = this.index,
                    w = n.series,
                    t = w.length,
                    e, p = D(n.options.reversedStacks, !0) ? 1 : -1,
                    h, I;
                if (this.options.stacking) {
                    for (h = 0; h < b.length; h++) l[b[h].x] = b[h];
                    for (I in k) null !== k[I].total && d.push(I);
                    d.sort(function(a, b) {
                        return a - b
                    });
                    e = x(w, function() {
                        return this.visible
                    });
                    B(d, function(b, c) {
                        var v = 0,
                            C, f;
                        if (l[b] && !l[b].isNull) a.push(l[b]), B([-1, 1], function(a) {
                            var m = 1 === a ? "rightNull" : "leftNull",
                                n = 0,
                                v = k[d[c + a]];
                            if (v)
                                for (h = q; 0 <= h && h < t;) C = v.points[h], C || (h === q ? l[b][m] = !0 : e[h] && (f = k[b].points[h]) && (n -= f[1] - f[0])), h += p;
                            l[b][1 === a ? "rightCliff" : "leftCliff"] = n
                        });
                        else {
                            for (h = q; 0 <= h && h < t;) {
                                if (C = k[b].points[h]) {
                                    v = C[1];
                                    break
                                }
                                h += p
                            }
                            v = n.toPixels(v, !0);
                            a.push({
                                isNull: !0,
                                plotX: m.toPixels(b, !0),
                                plotY: v,
                                yBottom: v
                            })
                        }
                    })
                }
                return a
            },
            getGraphPath: function(a) {
                var c = F.prototype.getGraphPath,
                    m = this.options,
                    n = m.stacking,
                    k = this.yAxis,
                    l, b, q = [],
                    w = [],
                    t = this.index,
                    e, p = k.stacks[this.stackKey],
                    h = m.threshold,
                    x = k.getThreshold(m.threshold),
                    v, m = m.connectNulls || "percent" === n,
                    C = function(b, c, d) {
                        var f = a[b];
                        b = n && p[f.x].points[t];
                        var l = f[d + "Null"] || 0;
                        d = f[d + "Cliff"] || 0;
                        var m, v, f = !0;
                        d || l ? (m = (l ? b[0] : b[1]) + d, v = b[0] + d, f = !!l) : !n && a[c] && a[c].isNull && (m = v = h);
                        void 0 !== m && (w.push({
                            plotX: e,
                            plotY: null === m ? x : k.getThreshold(m),
                            isNull: f
                        }), q.push({
                            plotX: e,
                            plotY: null === v ? x : k.getThreshold(v),
                            doCurve: !1
                        }))
                    };
                a = a || this.points;
                n && (a = this.getStackPoints());
                for (l = 0; l <
                    a.length; l++)
                    if (b = a[l].isNull, e = D(a[l].rectPlotX, a[l].plotX), v = D(a[l].yBottom, x), !b || m) m || C(l, l - 1, "left"), b && !n && m || (w.push(a[l]), q.push({
                        x: l,
                        plotX: e,
                        plotY: v
                    })), m || C(l, l + 1, "right");
                l = c.call(this, w, !0, !0);
                q.reversed = !0;
                b = c.call(this, q, !0, !0);
                b.length && (b[0] = "L");
                b = l.concat(b);
                c = c.call(this, w, !1, m);
                b.xMap = l.xMap;
                this.areaPath = b;
                return c
            },
            drawGraph: function() {
                this.areaPath = [];
                F.prototype.drawGraph.apply(this);
                var a = this,
                    d = this.areaPath,
                    m = this.options,
                    n = [
                        ["area", "highcharts-area"]
                    ];
                B(this.zones, function(a,
                    c) {
                    n.push(["zone-area-" + c, "highcharts-area highcharts-zone-area-" + c + " " + a.className])
                });
                B(n, function(c) {
                    var k = c[0],
                        b = a[k];
                    b ? (b.endX = d.xMap, b.animate({
                        d: d
                    })) : (b = a[k] = a.chart.renderer.path(d).addClass(c[1]).attr({
                        zIndex: 0
                    }).add(a.group), b.isArea = !0);
                    b.startX = d.xMap;
                    b.shiftUnit = m.step ? 2 : 1
                })
            },
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle
        })
    })(J);
    (function(a) {
        var B = a.pick;
        a = a.seriesType;
        a("spline", "line", {}, {
            getPointSpline: function(a, D, F) {
                var q = D.plotX,
                    c = D.plotY,
                    d = a[F - 1];
                F = a[F + 1];
                var m, n, k, l;
                if (d &&
                    !d.isNull && !1 !== d.doCurve && F && !F.isNull && !1 !== F.doCurve) {
                    a = d.plotY;
                    k = F.plotX;
                    F = F.plotY;
                    var b = 0;
                    m = (1.5 * q + d.plotX) / 2.5;
                    n = (1.5 * c + a) / 2.5;
                    k = (1.5 * q + k) / 2.5;
                    l = (1.5 * c + F) / 2.5;
                    k !== m && (b = (l - n) * (k - q) / (k - m) + c - l);
                    n += b;
                    l += b;
                    n > a && n > c ? (n = Math.max(a, c), l = 2 * c - n) : n < a && n < c && (n = Math.min(a, c), l = 2 * c - n);
                    l > F && l > c ? (l = Math.max(F, c), n = 2 * c - l) : l < F && l < c && (l = Math.min(F, c), n = 2 * c - l);
                    D.rightContX = k;
                    D.rightContY = l
                }
                D = ["C", B(d.rightContX, d.plotX), B(d.rightContY, d.plotY), B(m, q), B(n, c), q, c];
                d.rightContX = d.rightContY = null;
                return D
            }
        })
    })(J);
    (function(a) {
        var B = a.seriesTypes.area.prototype,
            x = a.seriesType;
        x("areaspline", "spline", a.defaultPlotOptions.area, {
            getStackPoints: B.getStackPoints,
            getGraphPath: B.getGraphPath,
            setStackCliffs: B.setStackCliffs,
            drawGraph: B.drawGraph,
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle
        })
    })(J);
    (function(a) {
        var B = a.animObject,
            x = a.each,
            D = a.extend,
            F = a.isNumber,
            q = a.merge,
            c = a.pick,
            d = a.Series,
            m = a.seriesType,
            n = a.svg;
        m("column", "line", {
            borderRadius: 0,
            groupPadding: .2,
            marker: null,
            pointPadding: .1,
            minPointLength: 0,
            cropThreshold: 50,
            pointRange: null,
            states: {
                hover: {
                    halo: !1
                }
            },
            dataLabels: {
                align: null,
                verticalAlign: null,
                y: null
            },
            softThreshold: !1,
            startFromThreshold: !0,
            stickyTracking: !1,
            tooltip: {
                distance: 6
            },
            threshold: 0
        }, {
            cropShoulder: 0,
            directTouch: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            negStacks: !0,
            init: function() {
                d.prototype.init.apply(this, arguments);
                var a = this,
                    c = a.chart;
                c.hasRendered && x(c.series, function(b) {
                    b.type === a.type && (b.isDirty = !0)
                })
            },
            getColumnMetrics: function() {
                var a = this,
                    d = a.options,
                    b = a.xAxis,
                    m = a.yAxis,
                    n = b.reversed,
                    t, e = {},
                    p = 0;
                !1 === d.grouping ? p = 1 : x(a.chart.series, function(b) {
                    var c = b.options,
                        d = b.yAxis,
                        f;
                    b.type === a.type && b.visible && m.len === d.len && m.pos === d.pos && (c.stacking ? (t = b.stackKey, void 0 === e[t] && (e[t] = p++), f = e[t]) : !1 !== c.grouping && (f = p++), b.columnIndex = f)
                });
                var h = Math.min(Math.abs(b.transA) * (b.ordinalSlope || d.pointRange || b.closestPointRange || b.tickInterval || 1), b.len),
                    q = h * d.groupPadding,
                    v = (h - 2 * q) / (p || 1),
                    d = Math.min(d.maxPointWidth || b.len, c(d.pointWidth, v * (1 - 2 * d.pointPadding)));
                a.columnMetrics = {
                    width: d,
                    offset: (v -
                        d) / 2 + (q + ((a.columnIndex || 0) + (n ? 1 : 0)) * v - h / 2) * (n ? -1 : 1)
                };
                return a.columnMetrics
            },
            crispCol: function(a, c, b, d) {
                var k = this.chart,
                    l = this.borderWidth,
                    e = -(l % 2 ? .5 : 0),
                    l = l % 2 ? .5 : 1;
                k.inverted && k.renderer.isVML && (l += 1);
                b = Math.round(a + b) + e;
                a = Math.round(a) + e;
                d = Math.round(c + d) + l;
                e = .5 >= Math.abs(c) && .5 < d;
                c = Math.round(c) + l;
                d -= c;
                e && d && (--c, d += 1);
                return {
                    x: a,
                    y: c,
                    width: b - a,
                    height: d
                }
            },
            translate: function() {
                var a = this,
                    l = a.chart,
                    b = a.options,
                    m = a.dense = 2 > a.closestPointRange * a.xAxis.transA,
                    m = a.borderWidth = c(b.borderWidth, m ? 0 : 1),
                    n = a.yAxis,
                    t = a.translatedThreshold = n.getThreshold(b.threshold),
                    e = c(b.minPointLength, 5),
                    p = a.getColumnMetrics(),
                    h = p.width,
                    q = a.barW = Math.max(h, 1 + 2 * m),
                    v = a.pointXOffset = p.offset;
                l.inverted && (t -= .5);
                b.pointPadding && (q = Math.ceil(q));
                d.prototype.translate.apply(a);
                x(a.points, function(b) {
                    var d = c(b.yBottom, t),
                        k = 999 + Math.abs(d),
                        k = Math.min(Math.max(-k, b.plotY), n.len + k),
                        f = b.plotX + v,
                        p = q,
                        m = Math.min(k, d),
                        C, w = Math.max(k, d) - m;
                    Math.abs(w) < e && e && (w = e, C = !n.reversed && !b.negative || n.reversed && b.negative, m = Math.abs(m - t) >
                        e ? d - e : t - (C ? e : 0));
                    b.barX = f;
                    b.pointWidth = h;
                    b.tooltipPos = l.inverted ? [n.len + n.pos - l.plotLeft - k, a.xAxis.len - f - p / 2, w] : [f + p / 2, k + n.pos - l.plotTop, w];
                    b.shapeType = "rect";
                    b.shapeArgs = a.crispCol.apply(a, b.isNull ? [b.plotX, n.len / 2, 0, 0] : [f, m, p, w])
                })
            },
            getSymbol: a.noop,
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
            drawGraph: function() {
                this.group[this.dense ? "addClass" : "removeClass"]("highcharts-dense-data")
            },
            drawPoints: function() {
                var a = this,
                    c = this.chart,
                    b = c.renderer,
                    d = a.options.animationLimit || 250,
                    m;
                x(a.points,
                    function(k) {
                        var e = k.graphic;
                        if (F(k.plotY) && null !== k.y)
                            if (m = k.shapeArgs, e) e[c.pointCount < d ? "animate" : "attr"](q(m));
                            else k.graphic = b[k.shapeType](m).attr({
                                "class": k.getClassName()
                            }).add(k.group || a.group);
                        else e && (k.graphic = e.destroy())
                    })
            },
            animate: function(a) {
                var c = this,
                    b = this.yAxis,
                    d = c.options,
                    k = this.chart.inverted,
                    m = {};
                n && (a ? (m.scaleY = .001, a = Math.min(b.pos + b.len, Math.max(b.pos, b.toPixels(d.threshold))), k ? m.translateX = a - b.len : m.translateY = a, c.group.attr(m)) : (m[k ? "translateX" : "translateY"] = b.pos, c.group.animate(m,
                    D(B(c.options.animation), {
                        step: function(a, b) {
                            c.group.attr({
                                scaleY: Math.max(.001, b.pos)
                            })
                        }
                    })), c.animate = null))
            },
            remove: function() {
                var a = this,
                    c = a.chart;
                c.hasRendered && x(c.series, function(b) {
                    b.type === a.type && (b.isDirty = !0)
                });
                d.prototype.remove.apply(a, arguments)
            }
        })
    })(J);
    (function(a) {
        a = a.seriesType;
        a("bar", "column", null, {
            inverted: !0
        })
    })(J);
    (function(a) {
        var B = a.Series;
        a = a.seriesType;
        a("scatter", "line", {
            lineWidth: 0,
            marker: {
                enabled: !0
            },
            tooltip: {
                headerFormat: '\x3cspan class\x3d"highcharts-color-{point.colorIndex}"\x3e\u25cf\x3c/span\x3e \x3cspan class\x3d"highcharts-header"\x3e {series.name}\x3c/span\x3e\x3cbr/\x3e',
                pointFormat: "x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e"
            }
        }, {
            sorted: !1,
            requireSorting: !1,
            noSharedTooltip: !0,
            trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
            takeOrdinalPosition: !1,
            kdDimensions: 2,
            drawGraph: function() {
                this.options.lineWidth && B.prototype.drawGraph.call(this)
            }
        })
    })(J);
    (function(a) {
        var B = a.pick,
            x = a.relativeLength;
        a.CenteredSeriesMixin = {
            getCenter: function() {
                var a = this.options,
                    F = this.chart,
                    q = 2 * (a.slicedOffset || 0),
                    c = F.plotWidth - 2 * q,
                    F = F.plotHeight -
                    2 * q,
                    d = a.center,
                    d = [B(d[0], "50%"), B(d[1], "50%"), a.size || "100%", a.innerSize || 0],
                    m = Math.min(c, F),
                    n, k;
                for (n = 0; 4 > n; ++n) k = d[n], a = 2 > n || 2 === n && /%$/.test(k), d[n] = x(k, [c, F, m, d[2]][n]) + (a ? q : 0);
                d[3] > d[2] && (d[3] = d[2]);
                return d
            }
        }
    })(J);
    (function(a) {
        var B = a.addEvent,
            x = a.defined,
            D = a.each,
            F = a.extend,
            q = a.inArray,
            c = a.noop,
            d = a.pick,
            m = a.Point,
            n = a.Series,
            k = a.seriesType,
            l = a.setAnimation;
        k("pie", "line", {
            center: [null, null],
            clip: !1,
            colorByPoint: !0,
            dataLabels: {
                distance: 30,
                enabled: !0,
                formatter: function() {
                    return null === this.y ?
                        void 0 : this.point.name
                },
                x: 0
            },
            ignoreHiddenPoint: !0,
            legendType: "point",
            marker: null,
            size: null,
            showInLegend: !1,
            slicedOffset: 10,
            stickyTracking: !1,
            tooltip: {
                followPointer: !0
            }
        }, {
            isCartesian: !1,
            requireSorting: !1,
            directTouch: !0,
            noSharedTooltip: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            axisTypes: [],
            pointAttribs: a.seriesTypes.column.prototype.pointAttribs,
            animate: function(a) {
                var b = this,
                    c = b.points,
                    d = b.startAngleRad;
                a || (D(c, function(a) {
                    var c = a.graphic,
                        e = a.shapeArgs;
                    c && (c.attr({
                        r: a.startR || b.center[3] / 2,
                        start: d,
                        end: d
                    }), c.animate({
                        r: e.r,
                        start: e.start,
                        end: e.end
                    }, b.options.animation))
                }), b.animate = null)
            },
            updateTotals: function() {
                var a, c = 0,
                    d = this.points,
                    k = d.length,
                    e, l = this.options.ignoreHiddenPoint;
                for (a = 0; a < k; a++) e = d[a], 0 > e.y && (e.y = null), c += l && !e.visible ? 0 : e.y;
                this.total = c;
                for (a = 0; a < k; a++) e = d[a], e.percentage = 0 < c && (e.visible || !l) ? e.y / c * 100 : 0, e.total = c
            },
            generatePoints: function() {
                n.prototype.generatePoints.call(this);
                this.updateTotals()
            },
            translate: function(a) {
                this.generatePoints();
                var b = 0,
                    c = this.options,
                    k = c.slicedOffset,
                    e = k + (c.borderWidth || 0),
                    l, h, m, n = c.startAngle || 0,
                    q = this.startAngleRad = Math.PI / 180 * (n - 90),
                    n = (this.endAngleRad = Math.PI / 180 * (d(c.endAngle, n + 360) - 90)) - q,
                    G = this.points,
                    y = c.dataLabels.distance,
                    c = c.ignoreHiddenPoint,
                    f, A = G.length,
                    u;
                a || (this.center = a = this.getCenter());
                this.getX = function(b, c) {
                    m = Math.asin(Math.min((b - a[1]) / (a[2] / 2 + y), 1));
                    return a[0] + (c ? -1 : 1) * Math.cos(m) * (a[2] / 2 + y)
                };
                for (f = 0; f < A; f++) {
                    u = G[f];
                    l = q + b * n;
                    if (!c || u.visible) b += u.percentage / 100;
                    h = q + b * n;
                    u.shapeType = "arc";
                    u.shapeArgs = {
                        x: a[0],
                        y: a[1],
                        r: a[2] /
                            2,
                        innerR: a[3] / 2,
                        start: Math.round(1E3 * l) / 1E3,
                        end: Math.round(1E3 * h) / 1E3
                    };
                    m = (h + l) / 2;
                    m > 1.5 * Math.PI ? m -= 2 * Math.PI : m < -Math.PI / 2 && (m += 2 * Math.PI);
                    u.slicedTranslation = {
                        translateX: Math.round(Math.cos(m) * k),
                        translateY: Math.round(Math.sin(m) * k)
                    };
                    l = Math.cos(m) * a[2] / 2;
                    h = Math.sin(m) * a[2] / 2;
                    u.tooltipPos = [a[0] + .7 * l, a[1] + .7 * h];
                    u.half = m < -Math.PI / 2 || m > Math.PI / 2 ? 1 : 0;
                    u.angle = m;
                    e = Math.min(e, y / 5);
                    u.labelPos = [a[0] + l + Math.cos(m) * y, a[1] + h + Math.sin(m) * y, a[0] + l + Math.cos(m) * e, a[1] + h + Math.sin(m) * e, a[0] + l, a[1] + h, 0 > y ? "center" : u.half ?
                        "right" : "left", m
                    ]
                }
            },
            drawGraph: null,
            drawPoints: function() {
                var a = this,
                    c = a.chart.renderer,
                    d, k, e;
                D(a.points, function(b) {
                    null !== b.y && (k = b.graphic, e = b.shapeArgs, d = b.sliced ? b.slicedTranslation : {}, k ? k.setRadialReference(a.center).animate(F(e, d)) : (b.graphic = k = c[b.shapeType](e).addClass(b.getClassName()).setRadialReference(a.center).attr(d).add(a.group), b.visible || k.attr({
                        visibility: "hidden"
                    })))
                })
            },
            searchPoint: c,
            sortByAngle: function(a, c) {
                a.sort(function(a, b) {
                    return void 0 !== a.angle && (b.angle - a.angle) * c
                })
            },
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
            getCenter: a.CenteredSeriesMixin.getCenter,
            getSymbol: c
        }, {
            init: function() {
                m.prototype.init.apply(this, arguments);
                var a = this,
                    c;
                a.name = d(a.name, "Slice");
                c = function(b) {
                    a.slice("select" === b.type)
                };
                B(a, "select", c);
                B(a, "unselect", c);
                return a
            },
            setVisible: function(a, c) {
                var b = this,
                    k = b.series,
                    e = k.chart,
                    l = k.options.ignoreHiddenPoint;
                c = d(c, l);
                a !== b.visible && (b.visible = b.options.visible = a = void 0 === a ? !b.visible : a, k.options.data[q(b, k.data)] = b.options, D(["graphic",
                    "dataLabel", "connector", "shadowGroup"
                ], function(c) {
                    if (b[c]) b[c][a ? "show" : "hide"](!0)
                }), b.legendItem && e.legend.colorizeItem(b, a), a || "hover" !== b.state || b.setState(""), l && (k.isDirty = !0), c && e.redraw())
            },
            slice: function(a, c, k) {
                var b = this.series;
                l(k, b.chart);
                d(c, !0);
                this.sliced = this.options.sliced = a = x(a) ? a : !this.sliced;
                b.options.data[q(this, b.data)] = this.options;
                this.graphic.animate(a ? this.slicedTranslation : {
                    translateX: 0,
                    translateY: 0
                })
            },
            haloPath: function(a) {
                var b = this.shapeArgs;
                return this.sliced || !this.visible ? [] : this.series.chart.renderer.symbols.arc(b.x, b.y, b.r + a, b.r + a, {
                    innerR: this.shapeArgs.r,
                    start: b.start,
                    end: b.end
                })
            }
        })
    })(J);
    (function(a) {
        var B = a.addEvent,
            x = a.arrayMax,
            D = a.defined,
            F = a.each,
            q = a.extend,
            c = a.format,
            d = a.map,
            m = a.merge,
            n = a.noop,
            k = a.pick,
            l = a.relativeLength,
            b = a.Series,
            E = a.seriesTypes,
            w = a.stableSort;
        a.distribute = function(a, b) {
            function c(a, b) {
                return a.target - b.target
            }
            var e, k = !0,
                l = a,
                m = [],
                n;
            n = 0;
            for (e = a.length; e--;) n += a[e].size;
            if (n > b) {
                w(a, function(a, b) {
                    return (b.rank || 0) - (a.rank || 0)
                });
                for (n = e = 0; n <=
                    b;) n += a[e].size, e++;
                m = a.splice(e - 1, a.length)
            }
            w(a, c);
            for (a = d(a, function(a) {
                    return {
                        size: a.size,
                        targets: [a.target]
                    }
                }); k;) {
                for (e = a.length; e--;) k = a[e], n = (Math.min.apply(0, k.targets) + Math.max.apply(0, k.targets)) / 2, k.pos = Math.min(Math.max(0, n - k.size / 2), b - k.size);
                e = a.length;
                for (k = !1; e--;) 0 < e && a[e - 1].pos + a[e - 1].size > a[e].pos && (a[e - 1].size += a[e].size, a[e - 1].targets = a[e - 1].targets.concat(a[e].targets), a[e - 1].pos + a[e - 1].size > b && (a[e - 1].pos = b - a[e - 1].size), a.splice(e, 1), k = !0)
            }
            e = 0;
            F(a, function(a) {
                var b = 0;
                F(a.targets,
                    function() {
                        l[e].pos = a.pos + b;
                        b += l[e].size;
                        e++
                    })
            });
            l.push.apply(l, m);
            w(l, c)
        };
        b.prototype.drawDataLabels = function() {
            var a = this,
                b = a.options,
                d = b.dataLabels,
                h = a.points,
                l, n, q = a.hasRendered || 0,
                w, y, f = k(d.defer, !0),
                A = a.chart.renderer;
            if (d.enabled || a._hasPointLabels) a.dlProcessOptions && a.dlProcessOptions(d), y = a.plotGroup("dataLabelsGroup", "data-labels", f && !q ? "hidden" : "visible", d.zIndex || 6), f && (y.attr({
                opacity: +q
            }), q || B(a, "afterAnimate", function() {
                a.visible && y.show(!0);
                y[b.animation ? "animate" : "attr"]({
                    opacity: 1
                }, {
                    duration: 200
                })
            })), n = d, F(h, function(b) {
                var e, f = b.dataLabel,
                    g, h, p, q = b.connector,
                    v = !f;
                l = b.dlOptions || b.options && b.options.dataLabels;
                if (e = k(l && l.enabled, n.enabled) && null !== b.y)
                    for (h in d = m(n, l), g = b.getLabelConfig(), w = d.format ? c(d.format, g) : d.formatter.call(g, d), p = d.rotation, g = {
                            r: d.borderRadius || 0,
                            rotation: p,
                            padding: d.padding,
                            zIndex: 1
                        }, g) void 0 === g[h] && delete g[h];
                !f || e && D(w) ? e && D(w) && (f ? g.text = w : (f = b.dataLabel = A[p ? "text" : "label"](w, 0, -9999, d.shape, null, null, d.useHTML, null, "data-label"), f.addClass("highcharts-data-label-color-" +
                    b.colorIndex + " " + (d.className || "") + (d.useHTML ? "highcharts-tracker" : ""))), f.attr(g), f.added || f.add(y), a.alignDataLabel(b, f, d, null, v)) : (b.dataLabel = f.destroy(), q && (b.connector = q.destroy()))
            })
        };
        b.prototype.alignDataLabel = function(a, b, c, d, l) {
            var e = this.chart,
                h = e.inverted,
                m = k(a.plotX, -9999),
                n = k(a.plotY, -9999),
                f = b.getBBox(),
                p, t = c.rotation,
                w = c.align,
                x = this.visible && (a.series.forceDL || e.isInsidePlot(m, Math.round(n), h) || d && e.isInsidePlot(m, h ? d.x + 1 : d.y + d.height - 1, h)),
                g = "justify" === k(c.overflow, "justify");
            x &&
                (p = e.renderer.fontMetrics(void 0, b).b, d = q({
                        x: h ? e.plotWidth - n : m,
                        y: Math.round(h ? e.plotHeight - m : n),
                        width: 0,
                        height: 0
                    }, d), q(c, {
                        width: f.width,
                        height: f.height
                    }), t ? (g = !1, h = e.renderer.rotCorr(p, t), h = {
                        x: d.x + c.x + d.width / 2 + h.x,
                        y: d.y + c.y + {
                            top: 0,
                            middle: .5,
                            bottom: 1
                        }[c.verticalAlign] * d.height
                    }, b[l ? "attr" : "animate"](h).attr({
                        align: w
                    }), m = (t + 720) % 360, m = 180 < m && 360 > m, "left" === w ? h.y -= m ? f.height : 0 : "center" === w ? (h.x -= f.width / 2, h.y -= f.height / 2) : "right" === w && (h.x -= f.width, h.y -= m ? 0 : f.height)) : (b.align(c, null, d), h = b.alignAttr),
                    g ? this.justifyDataLabel(b, c, h, f, d, l) : k(c.crop, !0) && (x = e.isInsidePlot(h.x, h.y) && e.isInsidePlot(h.x + f.width, h.y + f.height)), c.shape && !t && b.attr({
                        anchorX: a.plotX,
                        anchorY: a.plotY
                    }));
            x || (b.attr({
                y: -9999
            }), b.placed = !1)
        };
        b.prototype.justifyDataLabel = function(a, b, c, d, k, l) {
            var e = this.chart,
                h = b.align,
                m = b.verticalAlign,
                f, n, p = a.box ? 0 : a.padding || 0;
            f = c.x + p;
            0 > f && ("right" === h ? b.align = "left" : b.x = -f, n = !0);
            f = c.x + d.width - p;
            f > e.plotWidth && ("left" === h ? b.align = "right" : b.x = e.plotWidth - f, n = !0);
            f = c.y + p;
            0 > f && ("bottom" === m ? b.verticalAlign =
                "top" : b.y = -f, n = !0);
            f = c.y + d.height - p;
            f > e.plotHeight && ("top" === m ? b.verticalAlign = "bottom" : b.y = e.plotHeight - f, n = !0);
            n && (a.placed = !l, a.align(b, null, k))
        };
        E.pie && (E.pie.prototype.drawDataLabels = function() {
            var c = this,
                e = c.data,
                l, h = c.chart,
                m = c.options.dataLabels,
                n = k(m.connectorPadding, 10),
                q = k(m.connectorWidth, 1),
                w = h.plotWidth,
                y = h.plotHeight,
                f, A = m.distance,
                u = c.center,
                B = u[2] / 2,
                D = u[1],
                g = 0 < A,
                r, E, J, P, Q = [
                    [],
                    []
                ],
                K, M, z, N, S = [0, 0, 0, 0];
            c.visible && (m.enabled || c._hasPointLabels) && (b.prototype.drawDataLabels.apply(c), F(e,
                function(a) {
                    a.dataLabel && a.visible && (Q[a.half].push(a), a.dataLabel._pos = null)
                }), F(Q, function(b, e) {
                var f, g, k = b.length,
                    p, q, v;
                if (k)
                    for (c.sortByAngle(b, e - .5), 0 < A && (f = Math.max(0, D - B - A), g = Math.min(D + B + A, h.plotHeight), p = d(b, function(a) {
                            if (a.dataLabel) return v = a.dataLabel.getBBox().height || 21, {
                                target: a.labelPos[1] - f + v / 2,
                                size: v,
                                rank: a.y
                            }
                        }), a.distribute(p, g + v - f)), N = 0; N < k; N++) l = b[N], J = l.labelPos, r = l.dataLabel, z = !1 === l.visible ? "hidden" : "inherit", q = J[1], p ? void 0 === p[N].pos ? z = "hidden" : (P = p[N].size, M = f + p[N].pos) :
                        M = q, K = m.justify ? u[0] + (e ? -1 : 1) * (B + A) : c.getX(M < f + 2 || M > g - 2 ? q : M, e), r._attr = {
                            visibility: z,
                            align: J[6]
                        }, r._pos = {
                            x: K + m.x + ({
                                left: n,
                                right: -n
                            }[J[6]] || 0),
                            y: M + m.y - 10
                        }, J.x = K, J.y = M, null === c.options.size && (E = r.width, K - E < n ? S[3] = Math.max(Math.round(E - K + n), S[3]) : K + E > w - n && (S[1] = Math.max(Math.round(K + E - w + n), S[1])), 0 > M - P / 2 ? S[0] = Math.max(Math.round(-M + P / 2), S[0]) : M + P / 2 > y && (S[2] = Math.max(Math.round(M + P / 2 - y), S[2])))
            }), 0 === x(S) || this.verifyDataLabelOverflow(S)) && (this.placeDataLabels(), g && q && F(this.points, function(a) {
                var b;
                f = a.connector;
                if ((r = a.dataLabel) && r._pos && a.visible) {
                    z = r._attr.visibility;
                    if (b = !f) a.connector = f = h.renderer.path().addClass("highcharts-data-label-connector highcharts-color-" + a.colorIndex).add(c.dataLabelsGroup);
                    f[b ? "attr" : "animate"]({
                        d: c.connectorPath(a.labelPos)
                    });
                    f.attr("visibility", z)
                } else f && (a.connector = f.destroy())
            }))
        }, E.pie.prototype.connectorPath = function(a) {
            var b = a.x,
                c = a.y;
            return k(this.options.dataLabels.softConnector, !0) ? ["M", b + ("left" === a[6] ? 5 : -5), c, "C", b, c, 2 * a[2] - a[4], 2 * a[3] - a[5], a[2],
                a[3], "L", a[4], a[5]
            ] : ["M", b + ("left" === a[6] ? 5 : -5), c, "L", a[2], a[3], "L", a[4], a[5]]
        }, E.pie.prototype.placeDataLabels = function() {
            F(this.points, function(a) {
                var b = a.dataLabel;
                b && a.visible && ((a = b._pos) ? (b.attr(b._attr), b[b.moved ? "animate" : "attr"](a), b.moved = !0) : b && b.attr({
                    y: -9999
                }))
            })
        }, E.pie.prototype.alignDataLabel = n, E.pie.prototype.verifyDataLabelOverflow = function(a) {
            var b = this.center,
                c = this.options,
                d = c.center,
                k = c.minSize || 80,
                m, n;
            null !== d[0] ? m = Math.max(b[2] - Math.max(a[1], a[3]), k) : (m = Math.max(b[2] - a[1] - a[3],
                k), b[0] += (a[3] - a[1]) / 2);
            null !== d[1] ? m = Math.max(Math.min(m, b[2] - Math.max(a[0], a[2])), k) : (m = Math.max(Math.min(m, b[2] - a[0] - a[2]), k), b[1] += (a[0] - a[2]) / 2);
            m < b[2] ? (b[2] = m, b[3] = Math.min(l(c.innerSize || 0, m), m), this.translate(b), this.drawDataLabels && this.drawDataLabels()) : n = !0;
            return n
        });
        E.column && (E.column.prototype.alignDataLabel = function(a, c, d, h, l) {
            var e = this.chart.inverted,
                n = a.series,
                p = a.dlBox || a.shapeArgs,
                q = k(a.below, a.plotY > k(this.translatedThreshold, n.yAxis.len)),
                f = k(d.inside, !!this.options.stacking);
            p && (h = m(p), 0 > h.y && (h.height += h.y, h.y = 0), p = h.y + h.height - n.yAxis.len, 0 < p && (h.height -= p), e && (h = {
                x: n.yAxis.len - h.y - h.height,
                y: n.xAxis.len - h.x - h.width,
                width: h.height,
                height: h.width
            }), f || (e ? (h.x += q ? 0 : h.width, h.width = 0) : (h.y += q ? h.height : 0, h.height = 0)));
            d.align = k(d.align, !e || f ? "center" : q ? "right" : "left");
            d.verticalAlign = k(d.verticalAlign, e || f ? "middle" : q ? "top" : "bottom");
            b.prototype.alignDataLabel.call(this, a, c, d, h, l)
        })
    })(J);
    (function(a) {
        var B = a.Chart,
            x = a.each,
            D = a.pick,
            F = a.addEvent;
        B.prototype.callbacks.push(function(a) {
            function c() {
                var c = [];
                x(a.series, function(a) {
                    var d = a.options.dataLabels,
                        k = a.dataLabelCollections || ["dataLabel"];
                    (d.enabled || a._hasPointLabels) && !d.allowOverlap && a.visible && x(k, function(d) {
                        x(a.points, function(a) {
                            a[d] && (a[d].labelrank = D(a.labelrank, a.shapeArgs && a.shapeArgs.height), c.push(a[d]))
                        })
                    })
                });
                a.hideOverlappingLabels(c)
            }
            c();
            F(a, "redraw", c)
        });
        B.prototype.hideOverlappingLabels = function(a) {
            var c = a.length,
                d, m, n, k, l, b, q, w, t, e = function(a, b, c, d, e, k, l, f) {
                    return !(e > a + c || e + l < a || k > b + d || k + f < b)
                };
            for (m = 0; m < c; m++)
                if (d = a[m]) d.oldOpacity =
                    d.opacity, d.newOpacity = 1;
            a.sort(function(a, b) {
                return (b.labelrank || 0) - (a.labelrank || 0)
            });
            for (m = 0; m < c; m++)
                for (n = a[m], d = m + 1; d < c; ++d)
                    if (k = a[d], n && k && n.placed && k.placed && 0 !== n.newOpacity && 0 !== k.newOpacity && (l = n.alignAttr, b = k.alignAttr, q = n.parentGroup, w = k.parentGroup, t = 2 * (n.box ? 0 : n.padding), l = e(l.x + q.translateX, l.y + q.translateY, n.width - t, n.height - t, b.x + w.translateX, b.y + w.translateY, k.width - t, k.height - t)))(n.labelrank < k.labelrank ? n : k).newOpacity = 0;
            x(a, function(a) {
                var b, c;
                a && (c = a.newOpacity, a.oldOpacity !==
                    c && a.placed && (c ? a.show(!0) : b = function() {
                        a.hide()
                    }, a.alignAttr.opacity = c, a[a.isOld ? "animate" : "attr"](a.alignAttr, null, b)), a.isOld = !0)
            })
        }
    })(J);
    (function(a) {
        var B = a.addEvent,
            x = a.Chart,
            D = a.createElement,
            F = a.css,
            q = a.defaultOptions,
            c = a.defaultPlotOptions,
            d = a.each,
            m = a.extend,
            n = a.fireEvent,
            k = a.hasTouch,
            l = a.inArray,
            b = a.isObject,
            E = a.Legend,
            w = a.merge,
            t = a.pick,
            e = a.Point,
            p = a.Series,
            h = a.seriesTypes,
            I = a.svg;
        a = a.TrackerMixin = {
            drawTrackerPoint: function() {
                var a = this,
                    b = a.chart,
                    c = b.pointer,
                    e = function(a) {
                        for (var c = a.target,
                                d; c && !d;) d = c.point, c = c.parentNode;
                        if (void 0 !== d && d !== b.hoverPoint) d.onMouseOver(a)
                    };
                d(a.points, function(a) {
                    a.graphic && (a.graphic.element.point = a);
                    a.dataLabel && (a.dataLabel.div ? a.dataLabel.div.point = a : a.dataLabel.element.point = a)
                });
                a._hasTracking || (d(a.trackerGroups, function(b) {
                    if (a[b] && (a[b].addClass("highcharts-tracker").on("mouseover", e).on("mouseout", function(a) {
                            c.onTrackerMouseOut(a)
                        }), k)) a[b].on("touchstart", e)
                }), a._hasTracking = !0)
            },
            drawTrackerGraph: function() {
                var a = this,
                    b = a.options.trackByArea,
                    c = [].concat(b ? a.areaPath : a.graphPath),
                    e = c.length,
                    f = a.chart,
                    h = f.pointer,
                    l = f.renderer,
                    m = f.options.tooltip.snap,
                    n = a.tracker,
                    g, p = function() {
                        if (f.hoverSeries !== a) a.onMouseOver()
                    },
                    q = "rgba(192,192,192," + (I ? .0001 : .002) + ")";
                if (e && !b)
                    for (g = e + 1; g--;) "M" === c[g] && c.splice(g + 1, 0, c[g + 1] - m, c[g + 2], "L"), (g && "M" === c[g] || g === e) && c.splice(g, 0, "L", c[g - 2] + m, c[g - 1]);
                n ? n.attr({
                    d: c
                }) : a.graph && (a.tracker = l.path(c).attr({
                    "stroke-linejoin": "round",
                    visibility: a.visible ? "visible" : "hidden",
                    stroke: q,
                    fill: b ? q : "none",
                    "stroke-width": a.graph.strokeWidth() +
                        (b ? 0 : 2 * m),
                    zIndex: 2
                }).add(a.group), d([a.tracker, a.markerGroup], function(a) {
                    a.addClass("highcharts-tracker").on("mouseover", p).on("mouseout", function(a) {
                        h.onTrackerMouseOut(a)
                    });
                    if (k) a.on("touchstart", p)
                }))
            }
        };
        h.column && (h.column.prototype.drawTracker = a.drawTrackerPoint);
        h.pie && (h.pie.prototype.drawTracker = a.drawTrackerPoint);
        h.scatter && (h.scatter.prototype.drawTracker = a.drawTrackerPoint);
        m(E.prototype, {
            setItemEvents: function(a, b, c) {
                var d = this.chart,
                    e = "highcharts-legend-" + (a.series ? "point" : "series") +
                    "-active";
                (c ? b : a.legendGroup).on("mouseover", function() {
                    a.setState("hover");
                    d.seriesGroup.addClass(e)
                }).on("mouseout", function() {
                    d.seriesGroup.removeClass(e);
                    a.setState()
                }).on("click", function(b) {
                    var c = function() {
                        a.setVisible && a.setVisible()
                    };
                    b = {
                        browserEvent: b
                    };
                    a.firePointEvent ? a.firePointEvent("legendItemClick", b, c) : n(a, "legendItemClick", b, c)
                })
            },
            createCheckboxForItem: function(a) {
                a.checkbox = D("input", {
                    type: "checkbox",
                    checked: a.selected,
                    defaultChecked: a.selected
                }, this.options.itemCheckboxStyle, this.chart.container);
                B(a.checkbox, "click", function(b) {
                    n(a.series || a, "checkboxClick", {
                        checked: b.target.checked,
                        item: a
                    }, function() {
                        a.select()
                    })
                })
            }
        });
        m(x.prototype, {
            showResetZoom: function() {
                var a = this,
                    b = q.lang,
                    c = a.options.chart.resetZoomButton,
                    d = c.theme,
                    e = d.states,
                    h = "chart" === c.relativeTo ? null : "plotBox";
                this.resetZoomButton = a.renderer.button(b.resetZoom, null, null, function() {
                    a.zoomOut()
                }, d, e && e.hover).attr({
                    align: c.position.align,
                    title: b.resetZoomTitle
                }).addClass("highcharts-reset-zoom").add().align(c.position, !1, h)
            },
            zoomOut: function() {
                var a =
                    this;
                n(a, "selection", {
                    resetSelection: !0
                }, function() {
                    a.zoom()
                })
            },
            zoom: function(a) {
                var c, e = this.pointer,
                    h = !1,
                    f;
                !a || a.resetSelection ? d(this.axes, function(a) {
                    c = a.zoom()
                }) : d(a.xAxis.concat(a.yAxis), function(a) {
                    var b = a.axis;
                    e[b.isXAxis ? "zoomX" : "zoomY"] && (c = b.zoom(a.min, a.max), b.displayBtn && (h = !0))
                });
                f = this.resetZoomButton;
                h && !f ? this.showResetZoom() : !h && b(f) && (this.resetZoomButton = f.destroy());
                c && this.redraw(t(this.options.chart.animation, a && a.animation, 100 > this.pointCount))
            },
            pan: function(a, b) {
                var c = this,
                    e = c.hoverPoints,
                    f;
                e && d(e, function(a) {
                    a.setState()
                });
                d("xy" === b ? [1, 0] : [1], function(b) {
                    b = c[b ? "xAxis" : "yAxis"][0];
                    var d = b.horiz,
                        e = a[d ? "chartX" : "chartY"],
                        d = d ? "mouseDownX" : "mouseDownY",
                        h = c[d],
                        g = (b.pointRange || 0) / 2,
                        k = b.getExtremes(),
                        l = b.toValue(h - e, !0) + g,
                        g = b.toValue(h + b.len - e, !0) - g,
                        m = g < l,
                        h = m ? g : l,
                        l = m ? l : g,
                        g = Math.min(k.dataMin, k.min) - h,
                        k = l - Math.max(k.dataMax, k.max);
                    b.series.length && 0 > g && 0 > k && (b.setExtremes(h, l, !1, !1, {
                        trigger: "pan"
                    }), f = !0);
                    c[d] = e
                });
                f && c.redraw(!1);
                F(c.container, {
                    cursor: "move"
                })
            }
        });
        m(e.prototype, {
            select: function(a, b) {
                var c = this,
                    e = c.series,
                    f = e.chart;
                a = t(a, !c.selected);
                c.firePointEvent(a ? "select" : "unselect", {
                    accumulate: b
                }, function() {
                    c.selected = c.options.selected = a;
                    e.options.data[l(c, e.data)] = c.options;
                    c.setState(a && "select");
                    b || d(f.getSelectedPoints(), function(a) {
                        a.selected && a !== c && (a.selected = a.options.selected = !1, e.options.data[l(a, e.data)] = a.options, a.setState(""), a.firePointEvent("unselect"))
                    })
                })
            },
            onMouseOver: function(a, b) {
                var c = this.series,
                    d = c.chart,
                    e = d.tooltip,
                    h = d.hoverPoint;
                if (this.series) {
                    if (!b) {
                        if (h &&
                            h !== this) h.onMouseOut();
                        if (d.hoverSeries !== c) c.onMouseOver();
                        d.hoverPoint = this
                    }!e || e.shared && !c.noSharedTooltip ? e || this.setState("hover") : (this.setState("hover"), e.refresh(this, a));
                    this.firePointEvent("mouseOver")
                }
            },
            onMouseOut: function() {
                var a = this.series.chart,
                    b = a.hoverPoints;
                this.firePointEvent("mouseOut");
                b && -1 !== l(this, b) || (this.setState(), a.hoverPoint = null)
            },
            importEvents: function() {
                if (!this.hasImportedEvents) {
                    var a = w(this.series.options.point, this.options).events,
                        b;
                    this.events = a;
                    for (b in a) B(this,
                        b, a[b]);
                    this.hasImportedEvents = !0
                }
            },
            setState: function(a, b) {
                var d = Math.floor(this.plotX),
                    e = this.plotY,
                    f = this.series,
                    h = f.options.states[a] || {},
                    k = c[f.type].marker && f.options.marker,
                    l = k && !1 === k.enabled,
                    m = k && k.states && k.states[a] || {},
                    g = !1 === m.enabled,
                    n = f.stateMarkerGraphic,
                    p = this.marker || {},
                    q = f.chart,
                    v = f.halo,
                    w, x = k && f.markerAttribs;
                a = a || "";
                if (!(a === this.state && !b || this.selected && "select" !== a || !1 === h.enabled || a && (g || l && !1 === m.enabled) || a && p.states && p.states[a] && !1 === p.states[a].enabled)) {
                    x && (w = f.markerAttribs(this,
                        a));
                    if (this.graphic) this.state && this.graphic.removeClass("highcharts-point-" + this.state), a && this.graphic.addClass("highcharts-point-" + a), w && this.graphic.animate(w, t(q.options.chart.animation, m.animation, k.animation)), n && n.hide();
                    else {
                        if (a && m)
                            if (k = p.symbol || f.symbol, n && n.currentSymbol !== k && (n = n.destroy()), n) n[b ? "animate" : "attr"]({
                                x: w.x,
                                y: w.y
                            });
                            else k && (f.stateMarkerGraphic = n = q.renderer.symbol(k, w.x, w.y, w.width, w.height).add(f.markerGroup), n.currentSymbol = k);
                        n && (n[a && q.isInsidePlot(d, e, q.inverted) ?
                            "show" : "hide"](), n.element.point = this)
                    }(d = h.halo) && d.size ? (v || (f.halo = v = q.renderer.path().add(x ? f.markerGroup : f.group)), v[b ? "animate" : "attr"]({
                        d: this.haloPath(d.size)
                    }), v.attr({
                        "class": "highcharts-halo highcharts-color-" + t(this.colorIndex, f.colorIndex)
                    }), v.point = this) : v && v.point && v.point.haloPath && v.animate({
                        d: v.point.haloPath(0)
                    });
                    this.state = a
                }
            },
            haloPath: function(a) {
                return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX) - a, this.plotY - a, 2 * a, 2 * a)
            }
        });
        m(p.prototype, {
            onMouseOver: function() {
                var a =
                    this.chart,
                    b = a.hoverSeries;
                if (b && b !== this) b.onMouseOut();
                this.options.events.mouseOver && n(this, "mouseOver");
                this.setState("hover");
                a.hoverSeries = this
            },
            onMouseOut: function() {
                var a = this.options,
                    b = this.chart,
                    c = b.tooltip,
                    d = b.hoverPoint;
                b.hoverSeries = null;
                if (d) d.onMouseOut();
                this && a.events.mouseOut && n(this, "mouseOut");
                !c || a.stickyTracking || c.shared && !this.noSharedTooltip || c.hide();
                this.setState()
            },
            setState: function(a) {
                var b = this;
                a = a || "";
                b.state !== a && (d([b.group, b.markerGroup], function(c) {
                    c && (b.state &&
                        c.removeClass("highcharts-series-" + b.state), a && c.addClass("highcharts-series-" + a))
                }), b.state = a)
            },
            setVisible: function(a, b) {
                var c = this,
                    e = c.chart,
                    f = c.legendItem,
                    h, k = e.options.chart.ignoreHiddenSeries,
                    l = c.visible;
                h = (c.visible = a = c.options.visible = c.userOptions.visible = void 0 === a ? !l : a) ? "show" : "hide";
                d(["group", "dataLabelsGroup", "markerGroup", "tracker", "tt"], function(a) {
                    if (c[a]) c[a][h]()
                });
                if (e.hoverSeries === c || (e.hoverPoint && e.hoverPoint.series) === c) c.onMouseOut();
                f && e.legend.colorizeItem(c, a);
                c.isDirty = !0;
                c.options.stacking && d(e.series, function(a) {
                    a.options.stacking && a.visible && (a.isDirty = !0)
                });
                d(c.linkedSeries, function(b) {
                    b.setVisible(a, !1)
                });
                k && (e.isDirtyBox = !0);
                !1 !== b && e.redraw();
                n(c, h)
            },
            show: function() {
                this.setVisible(!0)
            },
            hide: function() {
                this.setVisible(!1)
            },
            select: function(a) {
                this.selected = a = void 0 === a ? !this.selected : a;
                this.checkbox && (this.checkbox.checked = a);
                n(this, a ? "select" : "unselect")
            },
            drawTracker: a.drawTrackerGraph
        })
    })(J);
    (function(a) {
        var B = a.Chart,
            x = a.each,
            D = a.inArray,
            F = a.isObject,
            q =
            a.pick,
            c = a.splat;
        B.prototype.setResponsive = function(a) {
            var c = this.options.responsive;
            c && c.rules && x(c.rules, function(c) {
                this.matchResponsiveRule(c, a)
            }, this)
        };
        B.prototype.matchResponsiveRule = function(c, m) {
            var d = this.respRules,
                k = c.condition,
                l;
            l = k.callback || function() {
                return this.chartWidth <= q(k.maxWidth, Number.MAX_VALUE) && this.chartHeight <= q(k.maxHeight, Number.MAX_VALUE) && this.chartWidth >= q(k.minWidth, 0) && this.chartHeight >= q(k.minHeight, 0)
            };
            void 0 === c._id && (c._id = a.uniqueKey());
            l = l.call(this);
            !d[c._id] &&
                l ? c.chartOptions && (d[c._id] = this.currentOptions(c.chartOptions), this.update(c.chartOptions, m)) : d[c._id] && !l && (this.update(d[c._id], m), delete d[c._id])
        };
        B.prototype.currentOptions = function(a) {
            function d(a, l, b, m) {
                var k, n;
                for (k in a)
                    if (!m && -1 < D(k, ["series", "xAxis", "yAxis"]))
                        for (a[k] = c(a[k]), b[k] = [], n = 0; n < a[k].length; n++) b[k][n] = {}, d(a[k][n], l[k][n], b[k][n], m + 1);
                    else F(a[k]) ? (b[k] = {}, d(a[k], l[k] || {}, b[k], m + 1)) : b[k] = l[k] || null
            }
            var n = {};
            d(a, this.options, n, 0);
            return n
        }
    })(J);
    return J
});