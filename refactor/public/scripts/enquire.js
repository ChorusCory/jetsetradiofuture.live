/*!
 * enquire.js v2.1.6 - Awesome Media Queries in JavaScript
 * Copyright (c) 2017 Nick Williams - http://wicky.nillia.ms/enquire.js
 * License: MIT */

! function(a) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = a();
    else if ("function" == typeof define && define.amd) define([], a);
    else {
        var b;
        b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, b.enquire = a()
    }
}(function() {
    return function a(b, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!b[g]) { var i = "function" == typeof require && require; if (!h && i) return i(g, !0); if (f) return f(g, !0); var j = new Error("Cannot find module '" + g + "'"); throw j.code = "MODULE_NOT_FOUND", j }
                var k = c[g] = { exports: {} };
                b[g][0].call(k.exports, function(a) { var c = b[g][1][a]; return e(c ? c : a) }, k, k.exports, a, b, c, d)
            }
            return c[g].exports
        }
        for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
        return e
    }({
        1: [function(a, b, c) {
            function d(a, b) {
                this.query = a, this.isUnconditional = b, this.handlers = [], this.mql = window.matchMedia(a);
                var c = this;
                this.listener = function(a) { c.mql = a.currentTarget || a, c.assess() }, this.mql.addListener(this.listener)
            }
            var e = a(3),
                f = a(4).each;
            d.prototype = {
                constuctor: d,
                addHandler: function(a) {
                    var b = new e(a);
                    this.handlers.push(b), this.matches() && b.on()
                },
                removeHandler: function(a) {
                    var b = this.handlers;
                    f(b, function(c, d) { if (c.equals(a)) return c.destroy(), !b.splice(d, 1) })
                },
                matches: function() { return this.mql.matches || this.isUnconditional },
                clear: function() { f(this.handlers, function(a) { a.destroy() }), this.mql.removeListener(this.listener), this.handlers.length = 0 },
                assess: function() {
                    var a = this.matches() ? "on" : "off";
                    f(this.handlers, function(b) { b[a]() })
                }
            }, b.exports = d
        }, { 3: 3, 4: 4 }],
        2: [function(a, b, c) {
            function d() {
                if (!window.matchMedia) throw new Error("matchMedia not present, legacy browsers require a polyfill");
                this.queries = {}, this.browserIsIncapable = !window.matchMedia("only all").matches
            }
            var e = a(1),
                f = a(4),
                g = f.each,
                h = f.isFunction,
                i = f.isArray;
            d.prototype = {
                constructor: d,
                register: function(a, b, c) {
                    var d = this.queries,
                        f = c && this.browserIsIncapable;
                    return d[a] || (d[a] = new e(a, f)), h(b) && (b = { match: b }), i(b) || (b = [b]), g(b, function(b) { h(b) && (b = { match: b }), d[a].addHandler(b) }), this
                },
                unregister: function(a, b) { var c = this.queries[a]; return c && (b ? c.removeHandler(b) : (c.clear(), delete this.queries[a])), this }
            }, b.exports = d
        }, { 1: 1, 4: 4 }],
        3: [function(a, b, c) {
            function d(a) { this.options = a, !a.deferSetup && this.setup() }
            d.prototype = { constructor: d, setup: function() { this.options.setup && this.options.setup(), this.initialised = !0 }, on: function() {!this.initialised && this.setup(), this.options.match && this.options.match() }, off: function() { this.options.unmatch && this.options.unmatch() }, destroy: function() { this.options.destroy ? this.options.destroy() : this.off() }, equals: function(a) { return this.options === a || this.options.match === a } }, b.exports = d
        }, {}],
        4: [function(a, b, c) {
            function d(a, b) {
                var c = 0,
                    d = a.length;
                for (c; c < d && b(a[c], c) !== !1; c++);
            }

            function e(a) { return "[object Array]" === Object.prototype.toString.apply(a) }

            function f(a) { return "function" == typeof a }
            b.exports = { isFunction: f, isArray: e, each: d }
        }, {}],
        5: [function(a, b, c) {
            var d = a(2);
            b.exports = new d
        }, { 2: 2 }]
    }, {}, [5])(5)
});