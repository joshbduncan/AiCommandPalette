//@target illustrator

/*
Ai Command Palette
Copyright 2026 Josh Duncan
https://joshbduncan.com

This script is distributed under the MIT License.
See the LICENSE file for details.
*/

(function () {
    var __spreadArray =
        (this && this.__spreadArray) ||
        function (to, from, pack) {
            if (pack || arguments.length === 2)
                for (var i = 0, l = from.length, ar; i < l; i++) {
                    if (ar || !(i in from)) {
                        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                        ar[i] = from[i];
                    }
                }
            return to.concat(ar || Array.prototype.slice.call(from));
        };
    var _title = "Ai Command Palette";
    var _version = "0.16.1";
    var _copyright = "Copyright 2026 Josh Duncan";
    var _website = "joshbduncan.com";
    var _github = "https://github.com/joshbduncan";
    if (typeof JSON !== "object") {
        JSON = {};
    }
    (function () {
        "use strict";
        var rx_one = /^[\],:{}\s]*$/;
        var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
        var rx_three =
            /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
        var rx_escapable =
            /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        var rx_dangerous =
            /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        function f(n) {
            return n < 10 ? "0" + n : n;
        }
        function this_value() {
            return this.valueOf();
        }
        if (typeof Date.prototype.toJSON !== "function") {
            Date.prototype.toJSON = function () {
                return isFinite(this.valueOf())
                    ? this.getUTCFullYear() +
                          "-" +
                          f(this.getUTCMonth() + 1) +
                          "-" +
                          f(this.getUTCDate()) +
                          "T" +
                          f(this.getUTCHours()) +
                          ":" +
                          f(this.getUTCMinutes()) +
                          ":" +
                          f(this.getUTCSeconds()) +
                          "Z"
                    : null;
            };
            Boolean.prototype.toJSON = this_value;
            Number.prototype.toJSON = this_value;
            String.prototype.toJSON = this_value;
        }
        var gap;
        var indent;
        var meta;
        var rep;
        function quote(string) {
            rx_escapable.lastIndex = 0;
            return rx_escapable.test(string)
                ? '"' +
                      string.replace(rx_escapable, function (a) {
                          var c = meta[a];
                          return typeof c === "string"
                              ? c
                              : "\\u" +
                                    ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                      }) +
                      '"'
                : '"' + string + '"';
        }
        function str(key, holder) {
            var i;
            var k;
            var v;
            var length;
            var mind = gap;
            var partial;
            var value = holder[key];
            if (
                value &&
                typeof value === "object" &&
                typeof value.toJSON === "function"
            ) {
                value = value.toJSON(key);
            }
            if (typeof rep === "function") {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
                case "string":
                    return quote(value);
                case "number":
                    return isFinite(value) ? String(value) : "null";
                case "boolean":
                case "null":
                    return String(value);
                case "object":
                    if (!value) {
                        return "null";
                    }
                    gap += indent;
                    partial = [];
                    if (Object.prototype.toString.apply(value) === "[object Array]") {
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || "null";
                        }
                        v =
                            partial.length === 0
                                ? "[]"
                                : gap
                                  ? "[\n" +
                                    gap +
                                    partial.join(",\n" + gap) +
                                    "\n" +
                                    mind +
                                    "]"
                                  : "[" + partial.join(",") + "]";
                        gap = mind;
                        return v;
                    }
                    if (rep && typeof rep === "object") {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === "string") {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ": " : ":") + v);
                                }
                            }
                        }
                    } else {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ": " : ":") + v);
                                }
                            }
                        }
                    }
                    v =
                        partial.length === 0
                            ? "{}"
                            : gap
                              ? "{\n" +
                                gap +
                                partial.join(",\n" + gap) +
                                "\n" +
                                mind +
                                "}"
                              : "{" + partial.join(",") + "}";
                    gap = mind;
                    return v;
            }
        }
        if (typeof JSON.stringify !== "function") {
            meta = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\",
            };
            JSON.stringify = function (value, replacer, space) {
                var i;
                gap = "";
                indent = "";
                if (typeof space === "number") {
                    for (i = 0; i < space; i += 1) {
                        indent += " ";
                    }
                } else if (typeof space === "string") {
                    indent = space;
                }
                rep = replacer;
                if (
                    replacer &&
                    typeof replacer !== "function" &&
                    (typeof replacer !== "object" ||
                        typeof replacer.length !== "number")
                ) {
                    throw new Error("JSON.stringify");
                }
                return str("", { "": value });
            };
        }
        if (typeof JSON.parse !== "function") {
            JSON.parse = function (text, reviver) {
                var j;
                function walk(holder, key) {
                    var k;
                    var v;
                    var value = holder[key];
                    if (value && typeof value === "object") {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }
                text = String(text);
                rx_dangerous.lastIndex = 0;
                if (rx_dangerous.test(text)) {
                    text = text.replace(rx_dangerous, function (a) {
                        return (
                            "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                        );
                    });
                }
                if (
                    rx_one.test(
                        text
                            .replace(rx_two, "@")
                            .replace(rx_three, "]")
                            .replace(rx_four, "")
                    )
                ) {
                    j = eval("(" + text + ")");
                    return typeof reviver === "function" ? walk({ "": j }, "") : j;
                }
                throw new SyntaxError("JSON.parse");
            };
        }
    })();
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            var k;
            if (this == null) throw new TypeError('"this" is null or not defined');
            var o = Object(this);
            var len = o.length >>> 0;
            if (len === 0) return -1;
            var n = +fromIndex || 0;
            if (Math.abs(n) === Infinity) n = 0;
            if (n >= len) return -1;
            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            while (k < len) {
                if (k in o && o[k] === searchElement) return k;
                k++;
            }
            return -1;
        };
    }
    if (!Array.prototype.every) {
        Array.prototype.every = function (callbackfn, thisArg) {
            "use strict";
            var T, k;
            if (this == null) throw new TypeError("this is null or not defined");
            var O = Object(this);
            var len = O.length >>> 0;
            if (typeof callbackfn !== "function") throw new TypeError();
            if (arguments.length > 1) T = thisArg;
            k = 0;
            while (k < len) {
                if (k in O) {
                    var kValue = O[k];
                    var testResult = T
                        ? callbackfn.call(T, kValue, k, O)
                        : callbackfn(kValue, k, O);
                    if (!testResult) return false;
                }
                k++;
            }
            return true;
        };
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function (callback, thisArg) {
            var T, A, k;
            if (this == null) throw new TypeError("this is null or not defined");
            var O = Object(this);
            var len = O.length >>> 0;
            if (typeof callback !== "function")
                throw new TypeError(callback + " is not a function");
            if (arguments.length > 1) T = thisArg;
            A = new Array(len);
            k = 0;
            while (k < len) {
                if (k in O) {
                    A[k] = callback.call(T, O[k], k, O);
                }
                k++;
            }
            return A;
        };
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (func, thisArg) {
            "use strict";
            if (!(typeof func === "function" && this)) throw new TypeError();
            var len = this.length >>> 0;
            var res = [];
            var t = this;
            var c = 0;
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    var val = t[i];
                    if (func.call(thisArg, val, i, t)) {
                        res[c++] = val;
                    }
                }
            }
            return res;
        };
    }
    if (!Array.prototype.findIndex) {
        Array.prototype.findIndex = function (callback, thisArg) {
            if (this === null) throw new TypeError("called on null or undefined");
            if (typeof callback !== "function")
                throw new TypeError("callback must be a function");
            var list = Object(this);
            var length = list.length >>> 0;
            for (var i = 0; i < length; i++) {
                if (callback.call(thisArg, list[i], i, list)) return i;
            }
            return -1;
        };
    }
    if (!Array.prototype.find) {
        Array.prototype.find = function (predicate, thisArg) {
            if (this == null) throw new TypeError('"this" is null or not defined');
            var o = Object(this);
            var len = o.length >>> 0;
            if (typeof predicate !== "function")
                throw new TypeError("predicate must be a function");
            for (var k = 0; k < len; k++) {
                var value = o[k];
                if (predicate.call(thisArg, value, k, o)) return value;
            }
            return undefined;
        };
    }
    if (!Array.prototype.includes) {
        Array.prototype.includes = function (search) {
            return this.indexOf(search) !== -1;
        };
    }
    if (!Array.prototype.last) {
        Array.prototype.last = function () {
            return this.length > 0 ? this[this.length - 1] : null;
        };
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (callback, thisArg) {
            if (this == null) throw new TypeError("this is null or not defined");
            var O = Object(this);
            var len = O.length >>> 0;
            if (typeof callback !== "function")
                throw new TypeError(callback + " is not a function");
            for (var k = 0; k < len; k++) {
                if (k in O) callback.call(thisArg, O[k], k, O);
            }
        };
    }
    if (!Array.from) {
        Array.from = function (arrayLikeObject) {
            var arr = [];
            for (var i = 0; i < arrayLikeObject.length; i++) {
                arr.push(arrayLikeObject[i]);
            }
            return arr;
        };
    }
    if (!Array.prototype.some) {
        Array.prototype.some = function (fun, thisArg) {
            if (this == null)
                throw new TypeError("Array.prototype.some called on null or undefined");
            if (typeof fun !== "function") throw new TypeError();
            var t = Object(this);
            var len = t.length >>> 0;
            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(thisArg, t[i], i, t)) return true;
            }
            return false;
        };
    }
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function (callback, initialValue) {
            if (this === null) throw new TypeError("called on null or undefined");
            if (typeof callback !== "function")
                throw new TypeError(callback + " is not a function");
            var o = Object(this);
            var len = o.length >>> 0;
            var k = 0;
            var value = arguments.length >= 2 ? initialValue : undefined;
            if (value === undefined) {
                while (k < len && !(k in o)) k++;
                if (k >= len)
                    throw new TypeError("Reduce of empty array with no initial value");
                value = o[k++];
            }
            while (k < len) {
                if (k in o) {
                    value = callback(value, o[k], k, o);
                }
                k++;
            }
            return value;
        };
    }
    if (!Array.prototype.addUnique) {
        Array.prototype.addUnique = function (searchElement) {
            if (this.indexOf(searchElement) < 0) {
                this.push(searchElement);
                return true;
            }
            return false;
        };
    }
    if (!Array.prototype.removeUnique) {
        Array.prototype.removeUnique = function (searchElement) {
            var idx = this.indexOf(searchElement);
            if (idx > -1) {
                this.splice(idx, 1);
                return true;
            }
            return false;
        };
    }
    if (!Array.prototype.removeAtIndex) {
        Array.prototype.removeAtIndex = function (idx) {
            if (idx > -1) {
                this.splice(idx, 1);
                return true;
            }
            return false;
        };
    }
    if (!Array.prototype.makeUnique) {
        Array.prototype.makeUnique = function () {
            return this.sort().filter(function (current, index, array) {
                return index === 0 || current !== array[index - 1];
            });
        };
    }
    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) === "[object Array]";
        };
    }
    Number.prototype.toRadians = function () {
        return this * (Math.PI / 180);
    };
    Number.prototype.toDegrees = function () {
        return this * (180 / Math.PI);
    };
    Number.prototype.padZero = function (decimals) {
        if (typeof decimals === "undefined") {
            decimals = 2;
        }
        var numStr = this.toString();
        var decimalsFound = numStr.length;
        if (decimalsFound >= decimals) {
            return numStr;
        }
        while (decimalsFound < decimals) {
            numStr = "0" + numStr;
            decimalsFound += 1;
        }
        return numStr;
    };
    function round2(num) {
        return Math.round(num * 100) / 100;
    }
    if (!Object.keys) {
        Object.keys = (function () {
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var hasDontEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
            var dontEnums = [
                "toString",
                "toLocaleString",
                "valueOf",
                "hasOwnProperty",
                "isPrototypeOf",
                "propertyIsEnumerable",
                "constructor",
            ];
            var dontEnumsLength = dontEnums.length;
            return function (obj) {
                var wasNull = obj === null;
                var typeDesc = wasNull
                    ? "input was null"
                    : "input was ".concat(typeof obj);
                if ((typeof obj !== "object" && typeof obj !== "function") || wasNull)
                    throw new TypeError(
                        "Object.keys called on non-object (".concat(typeDesc, ").")
                    );
                var result = [];
                for (var prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) result.push(prop);
                }
                if (hasDontEnumBug) {
                    for (var i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i]))
                            result.push(dontEnums[i]);
                    }
                }
                return result;
            };
        })();
    }
    if (typeof Object.create !== "function") {
        Object.create = (function () {
            var Temp = function () {};
            return function (prototype) {
                if (arguments.length > 1) throw Error("Second argument not supported");
                if (prototype !== Object(prototype) && prototype !== null)
                    throw new TypeError("Argument must be an object or null");
                if (prototype === null) throw Error("null [[Prototype]] not supported");
                Temp.prototype = prototype;
                var result = new Temp();
                Temp.prototype = null;
                return result;
            };
        })();
    }
    if (!Object.entries) {
        Object.entries = function (obj) {
            var ownProps = Object.keys(obj);
            var resArray = new Array(ownProps.length);
            for (var i = ownProps.length; i--;) {
                resArray[i] = [ownProps[i], obj[ownProps[i]]];
            }
            return resArray;
        };
    }
    if (typeof Object.toArray !== "function") {
        Object.toArray = function (obj) {
            return Object.keys(obj).map(function (key) {
                return obj[key];
            });
        };
    }
    if (typeof Object.hasKeys !== "function") {
        Object.hasKeys = function (obj) {
            if (obj == null) return false;
            return Object.keys(obj).length > 0;
        };
    }
    if (!("assign" in Object)) {
        Object.assign = (function (has) {
            "use strict";
            return function assign(target) {
                var sources = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    sources[_i - 1] = arguments[_i];
                }
                for (var i = 0; i < sources.length; i++) {
                    var source = sources[i];
                    for (var key in source) {
                        if (has.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
                return target;
            };
        })({}.hasOwnProperty);
    }
    function clone(obj) {
        if (obj == null || typeof obj !== "object") return obj;
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        if (Array.isArray(obj)) {
            return obj.map(clone);
        }
        if (typeof obj === "object") {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }
    function copyObjectPropertyValues(srcObj, destObj) {
        var primitivesAndEqual = true;
        for (var key in srcObj) {
            if (key in destObj) {
                var srcProp = srcObj[key];
                var destProp = destObj[key];
                if (srcProp !== destProp) primitivesAndEqual = false;
                destObj[key] = srcProp;
            }
        }
        return !primitivesAndEqual;
    }
    function checkAllPropertyInclusion(srcObj, destObj) {
        if (typeof srcObj !== "object" || typeof destObj !== "object") return false;
        for (var key in srcObj) {
            if (!(key in destObj)) return false;
        }
        return true;
    }
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
    String.prototype.replaceAt = function (index, replacement) {
        return (
            this.substr(0, index) +
            replacement +
            this.substr(index + replacement.length)
        );
    };
    String.prototype.hexDecode = function () {
        var r = "";
        for (var i = 0; i < this.length; i += 2) {
            r += unescape("%" + this.substr(i, 2));
        }
        return r;
    };
    String.prototype.hexEncode = function () {
        var r = "";
        var i = 0;
        var h;
        while (i < this.length) {
            h = this.charCodeAt(i++).toString(16);
            while (h.length < 2) {
                h = h;
            }
            r += h;
        }
        return r;
    };
    String.prototype.zeroPad = function (num) {
        var str = this;
        for (var i = 0; i < num; i++) {
            if (i > str.length) {
                str = "0" + str;
            }
        }
        return str;
    };
    String.prototype.toNumbers = function () {
        var number = "0x";
        var length = this.length;
        for (var i = 0; i < length; i++) number += this.charCodeAt(i).toString(16);
        return number;
    };
    String.prototype.fromNumbers = function () {
        var number = this;
        var string = "";
        number = number.slice(2);
        var length = number.length;
        for (var i = 0; i < length;) {
            var code = number.slice(i, (i += 2));
            string += String.fromCharCode(parseInt(code, 16));
        }
        return string;
    };
    String.prototype.escapeForRegexp = function () {
        return this.replace(/([\/.*+?|()[\]{}\\^$])/g, "\\$1");
    };
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (search, rawPos) {
            var pos = rawPos > 0 ? rawPos | 0 : 0;
            return this.substring(pos, pos + search.length) === search;
        };
    }
    if (!String.prototype.includes) {
        String.prototype.includes = function (search, start) {
            "use strict";
            if (search instanceof RegExp) {
                throw new TypeError("first argument must not be a RegExp");
            }
            if (start === undefined) {
                start = 0;
            }
            return this.indexOf(search, start) !== -1;
        };
    }
    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function (search, this_len) {
            if (this_len === undefined || this_len > this.length) {
                this_len = this.length;
            }
            return this.substring(this_len - search.length, this_len) === search;
        };
    }
    function unCamelCaseSplit(str) {
        if (!str.match(/([a-z][A-Z])/)) {
            return str;
        }
        var newStr =
            str[0].toUpperCase() +
            str
                .split(/([A-Z][a-z]+)/g)
                .join(" ")
                .replace(/\s{2}/g, " ")
                .substr(1)
                .replace(/\s+$/, "");
        return newStr;
    }
    function capitalize(str) {
        return str[0].toUpperCase() + str.substr(1);
    }
    function replacePercentMessage(str) {
        var filledMessage = str;
        for (var i = 1; i < arguments.length; i++) {
            filledMessage = filledMessage.replace(
                new RegExp("(%" + i.toString() + ")", "g"),
                arguments[i].toString()
            );
        }
        return filledMessage;
    }
    var strings = {
        about: {
            en: "About",
            de: "\u00dcber Kurzbefehle \u2026",
            ru: "\u041e \u0441\u043a\u0440\u0438\u043f\u0442\u0435",
            zh_TW: "\u95dc\u65bc",
        },
        ac_error_execution: {
            en: "Error executing action:\n%1\n\n%2",
            de: "Fehler beim Ausf\u00fchren der Aktion:\n%1\n\n%2",
            ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u043f\u0443\u0441\u043a\u0430 \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0438:\n%1\n\n%2",
            zh_TW: "\u57f7\u884c\u52d5\u4f5c\u6642\u767c\u751f\u932f\u8aa4\uff1a\n%1\n\n%2",
        },
        action: { en: "Action", de: "Action", ru: "Action", zh_TW: "\u52d5\u4f5c" },
        Actions: {
            en: "Actions",
            de: "Aktionen",
            ru: "Actions",
            zh_TW: "\u52d5\u4f5c",
        },
        active_document_not_saved: {
            en: "Active document not yet saved to the file system.",
            de: "Das aktuelle Dokument wurde noch nicht gespeichert.",
            ru: "Active document not yet saved to the file system.",
            zh_TW: "\u76ee\u524d\u7684\u6587\u4ef6\u5c1a\u672a\u5132\u5b58\u5230\u6a94\u6848\u7cfb\u7d71\u3002",
        },
        add_custom_commands_dialog_title: {
            en: "Add Custom Commands",
            de: "Add Custom Commands",
            ru: "Add Custom Commands",
            zh_TW: "\u65b0\u589e\u81ea\u8a02\u6307\u4ee4",
        },
        artboard: {
            en: "Artboard",
            de: "Artboard",
            ru: "Artboard",
            zh_TW: "\u5de5\u4f5c\u5340\u57df",
        },
        artboards: {
            en: "Artboards",
            de: "Zeichenfl\u00e4chen",
            ru: "Artboards",
            zh_TW: "\u5de5\u4f5c\u5340\u57df",
        },
        bm_already_loaded: {
            en: "Bookmark already loaded.",
            de: "Dieses Lesezeichen wurde bereits erstellt.",
            ru: "Bookmark already loaded.",
            zh_TW: "\u66f8\u7c64\u5df2\u8f09\u5165\u3002",
        },
        bm_error_execution: {
            en: "Error opening bookmark:\n%1\n\n%2",
            de: "Fehler beim \u00d6ffnen des Lesezeichens:\n%1\n\n%2",
            ru: "Error opening bookmark:\n%1\n\n%2",
            zh_TW: "\u958b\u555f\u66f8\u7c64\u6642\u767c\u751f\u932f\u8aa4\uff1a\n%1\n\n%2",
        },
        bm_error_exists: {
            en: "Bookmark no longer exists at original path. Try reloading.\n%1",
            de: "Das Lesezeichen ist an dieser Stelle nicht mehr vorhanden. Versuchen Sie, es nochmal zu laden.\n%1",
            ru: "Bookmark no longer exists at original path. Try reloading.\n%1",
            zh_TW: "\u539f\u59cb\u8def\u5f91\u4e2d\u7684\u66f8\u7c64\u5df2\u4e0d\u5b58\u5728\u3002\u8acb\u5617\u8a66\u91cd\u65b0\u8f09\u5165\u3002\n%1",
        },
        bm_error_loading: {
            en: "Error loading bookmark:\n%1",
            de: "Fehler beim Ladenn des Lesezeichens:\n%1",
            ru: "Error loading bookmark:\n%1",
            zh_TW: "\u8f09\u5165\u66f8\u7c64\u6642\u767c\u751f\u932f\u8aa4\uff1a\n%1",
        },
        bm_load_bookmark: {
            en: "Load Bookmark(s)",
            de: "Lesezeichen erstellen",
            ru: "Load Bookmark(s)",
            zh_TW: "\u8f09\u5165\u66f8\u7c64",
        },
        bm_total_loaded: {
            en: "Total bookmarks loaded:\n%1",
            de: "Anzahl der geladenen Lesezeichen:\n%1",
            ru: "Total bookmarks loaded:\n%1",
            zh_TW: "\u5df2\u8f09\u5165\u7684\u66f8\u7c64\u7e3d\u6578\uff1a\n%1",
        },
        bookmark: {
            en: "Bookmark",
            de: "Lesezeichen",
            ru: "Bookmark",
            zh_TW: "\u66f8\u7c64",
        },
        Bookmarks: {
            en: "Bookmarks",
            de: "Lesezeichen",
            ru: "Bookmarks",
            zh_TW: "\u66f8\u7c64",
        },
        builtin: {
            en: "Built-In",
            de: "Built-In",
            ru: "Built-In",
            zh_TW: "\u5167\u5efa",
        },
        button_ok: { en: "OK", de: "OK", ru: "OK", zh_TW: "\u78ba\u5b9a" },
        cancel: {
            en: "Cancel",
            de: "Abbrechen",
            ru: "\u041e\u0442\u043c\u0435\u043d\u0430",
            zh_TW: "\u53d6\u6d88",
        },
        cd_active_document_required: {
            en: "Command '%1' requires an active document. Continue Anyway?",
            de: "Der Befehl '%1' erfordert ein ge\u00f6ffnetes Dokument. Trotzdem fortfahren?",
            ru: "Command '%1' requires an active document. Continue Anyway?",
            zh_TW: "\u6307\u4ee4\u300c%1\u300d\u9700\u8981\u5148\u958b\u555f\u6587\u4ef6\u3002\u4ecd\u8981\u7e7c\u7e8c\u55ce\uff1f",
        },
        cd_active_selection_required: {
            en: "Command '%1' requires an active selection. Continue Anyway?",
            de: "Der Befehl '%1' erfordert eine Auswahl. Trotzdem fortfahren?",
            ru: "Command '%1' requires an active selection. Continue Anyway?",
            zh_TW: "\u6307\u4ee4\u300c%1\u300d\u9700\u8981\u5148\u9078\u53d6\u7269\u4ef6\u3002\u4ecd\u8981\u7e7c\u7e8c\u55ce\uff1f",
        },
        cd_all: {
            en: "Built-In Commands",
            de: "Built-In Commands",
            ru: "Built-In Commands",
            zh_TW: "\u5167\u5efa\u6307\u4ee4",
        },
        cd_clear_history_confirm: {
            en: "Are you sure you want to clear your history?\n\n PLEASE NOTE: This will remove any keyword latches you have.",
            de: "Are you sure you want to clear your history?\n\n PLEASE NOTE: This will remove any keyword latches you have.",
            ru: "Are you sure you want to clear your history?\n\n PLEASE NOTE: This will remove any keyword latches you have.",
            zh_TW: "\u78ba\u5b9a\u8981\u6e05\u9664\u6b77\u53f2\u7d00\u9304\u55ce\uff1f\n\n\u6ce8\u610f\uff1a\u9019\u4e5f\u6703\u79fb\u9664\u5df2\u8a18\u9304\u7684\u641c\u5c0b\u95dc\u9375\u5b57\u504f\u597d\u3002",
        },
        cd_clear_history_title: {
            en: "Clear History",
            de: "Clear History",
            ru: "Clear History",
            zh_TW: "\u6e05\u9664\u6b77\u53f2\u7d00\u9304",
        },
        cd_add_to_startup: {
            en: "Add new command(s) to your startup?",
            de: "Add new command(s) to your startup?",
            ru: "Add new command(s) to your startup?",
            zh_TW: "\u8981\u5c07\u65b0\u6307\u4ee4\u52a0\u5165\u555f\u52d5\u756b\u9762\u55ce\uff1f",
        },
        cd_add_to_startup_title: {
            en: "Add To Startup Commands",
            de: "Add To Startup Commands",
            ru: "Add To Startup Commands",
            zh_TW: "\u52a0\u5165\u555f\u52d5\u756b\u9762",
        },
        cd_delete_confirm: {
            en: "Delete Commands?\nDeleted commands will longer work in any workflows you previously created where they were used as a step.\n\n%1",
            de: "Befehle l\u00f6schen?\nGel\u00f6schte Befehle werden in bestehenden Arbeitsabl\u00e4ufen nicht mehr funktionieren.\n\n%1",
            ru: "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043a\u043e\u043c\u0430\u043d\u0434\u0443?\n\u0423\u0434\u0430\u043b\u0435\u043d\u043d\u044b\u0435 \u043a\u043e\u043c\u0430\u043d\u0434\u044b \u0431\u043e\u043b\u044c\u0448\u0435 \u043d\u0435 \u0431\u0443\u0434\u0443\u0442 \u0440\u0430\u0431\u043e\u0442\u0430\u0442\u044c \u0432 \u043b\u044e\u0431\u044b\u0445 \u0441\u043e\u0437\u0434\u0430\u043d\u043d\u044b\u0445 \u043d\u0430\u0431\u043e\u0440\u0430\u0445, \u0433\u0434\u0435 \u043e\u043d\u0438 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043b\u0438\u0441\u044c\n\n%1",
            zh_TW: "\u8981\u522a\u9664\u6307\u4ee4\u55ce\uff1f\n\u82e5\u5148\u524d\u5efa\u7acb\u7684\u5de5\u4f5c\u6d41\u7a0b\u4f7f\u7528\u4e86\u9019\u4e9b\u6307\u4ee4\uff0c\u522a\u9664\u5f8c\u76f8\u95dc\u6b65\u9a5f\u5c07\u7121\u6cd5\u518d\u57f7\u884c\u3002\n\n%1",
        },
        cd_delete_confirm_title: {
            en: "Confirm Commands To Delete",
            de: "Best\u00e4tigen Sie die zu l\u00f6schenden Befehle.",
            ru: "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u0435 \u043a\u043e\u043c\u0430\u043d\u0434",
            zh_TW: "\u78ba\u8a8d\u522a\u9664\u6307\u4ee4",
        },
        cd_delete_select: {
            en: "Select Commands To Delete",
            de: "W\u00e4hlen Sie die zu l\u00f6schenden Men\u00fcbefehle aus.",
            ru: "\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u043a\u043e\u043c\u0430\u043d\u0434\u044b \u043c\u0435\u043d\u044e \u0434\u043b\u044f \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u044f",
            zh_TW: "\u9078\u64c7\u8981\u522a\u9664\u7684\u6307\u4ee4",
        },
        cd_error_delete: {
            en: "Command couldn't be deleted.\n%1",
            de: "Befehl konnte nicht gel\u00f6scht werden.\n%1",
            ru: "\u041a\u043e\u043c\u0430\u043d\u0434\u0430 \u043d\u0435 \u043c\u043e\u0436\u0435\u0442 \u0431\u044b\u0442\u044c \u0443\u0434\u0430\u043b\u0435\u043d\u0430\n%1",
            zh_TW: "\u7121\u6cd5\u522a\u9664\u6307\u4ee4\u3002\n%1",
        },
        cd_error_executing: {
            en: "Error executing command:\n%1\n\n%2",
            de: "Fehler beim Ausf\u00fchren des Befehls:\n%1\n\n%2",
            ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u043f\u0443\u0441\u043a\u0430 \u043a\u043e\u043c\u0430\u043d\u0434\u044b:\n%1\n\n%2",
            zh_TW: "\u57f7\u884c\u6307\u4ee4\u6642\u767c\u751f\u932f\u8aa4\uff1a\n%1\n\n%2",
        },
        cd_exception: {
            en: "Command Exception",
            de: "Befehls-Ausnahme",
            ru: "Command Exception",
            zh_TW: "\u6307\u4ee4\u4f8b\u5916\u932f\u8aa4",
        },
        cd_helptip: {
            en: "Double-click a command to add it as a workflow step below.",
            de: "Doppelklicken Sie auf einen Befehl, um ihn unten als benutzerdefinierten Schritt hinzuzuf\u00fcgen.",
            ru: "\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u0434\u0432\u0430\u0436\u0434\u044b \u043d\u0430 \u043a\u043e\u043c\u0430\u043d\u0434\u0443, \u0447\u0442\u043e\u0431\u044b \u0434\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0435\u0435 \u043a\u0430\u043a \u0448\u0430\u0433 \u043d\u0430\u0431\u043e\u0440\u0430",
            zh_TW: "\u9023\u6309\u5169\u4e0b\u6307\u4ee4\uff0c\u53ef\u5c07\u5b83\u52a0\u5165\u4e0b\u65b9\u7684\u5de5\u4f5c\u6d41\u7a0b\u6b65\u9a5f\u3002",
        },
        cd_hide_confirm_title: {
            en: "Confirm Commands To Hide",
            de: "Auszublendende Befehle best\u00e4tigen",
            ru: "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c \u0441\u043a\u0440\u044b\u0442\u0438\u0435 \u043a\u043e\u043c\u0430\u043d\u0434",
            zh_TW: "\u78ba\u8a8d\u96b1\u85cf\u6307\u4ee4",
        },
        cd_hide_select: {
            en: "Select Commands To Hide",
            de: "W\u00e4hlen Sie die auszublendenden Men\u00fcbefehle aus.",
            ru: "\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u043a\u043e\u043c\u0430\u043d\u0434\u044b \u043c\u0435\u043d\u044e \u0434\u043b\u044f \u0441\u043a\u0440\u044b\u0442\u0438\u044f",
            zh_TW: "\u9078\u64c7\u8981\u96b1\u85cf\u7684\u6307\u4ee4",
        },
        cd_invalid: {
            en: "Invalid command type:\n%1",
            de: "Ung\u00fcltiger Befehlstyp:\n%1",
            ru: "\u041d\u0435\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0439 \u0442\u0438\u043f:\n%1",
            zh_TW: "\u7121\u6548\u7684\u6307\u4ee4\u985e\u578b\uff1a\n%1",
        },
        cd_none_delete: {
            en: "There are no commands to delete.",
            de: "Es gibt keine Befehle zum L\u00f6schen.",
            ru: "\u041d\u0435\u0442 \u043a\u043e\u043c\u0430\u043d\u0434 \u0434\u043b\u044f \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u044f",
            zh_TW: "\u6c92\u6709\u53ef\u522a\u9664\u7684\u6307\u4ee4\u3002",
        },
        cd_none_hide: {
            en: "There are no commands to hide.",
            de: "Es gibt keine Befehle zum Ausblenden.",
            ru: "\u041d\u0435\u0442 \u043a\u043e\u043c\u0430\u043d\u0434 \u0434\u043b\u044f \u0441\u043a\u0440\u044b\u0442\u0438\u044f",
            zh_TW: "\u6c92\u6709\u53ef\u96b1\u85cf\u7684\u6307\u4ee4\u3002",
        },
        cd_none_reveal: {
            en: "There are no hidden commands to reveal.",
            de: "Keine verborgenen Befehle vorhanden.",
            ru: "\u041d\u0435\u0442 \u0441\u043a\u0440\u044b\u0442\u044b\u0445 \u043a\u043e\u043c\u0430\u043d\u0434",
            zh_TW: "\u6c92\u6709\u53ef\u91cd\u65b0\u986f\u793a\u7684\u96b1\u85cf\u6307\u4ee4\u3002",
        },
        cd_q_helptip: {
            en: "Search for commands, actions, and loaded scripts.",
            de: "Befehle, Aktionen und geladene Skripte suchen.",
            ru: "\u041f\u043e\u0438\u0441\u043a \u043a\u043e\u043c\u0430\u043d\u0434, \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0439 \u0438 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u043d\u044b\u0445 \u0441\u043a\u0440\u0438\u043f\u0442\u043e\u0432",
            zh_TW: "\u641c\u5c0b\u6307\u4ee4\u3001\u52d5\u4f5c\u8207\u5df2\u8f09\u5165\u7684\u6307\u4ee4\u78bc\u3002",
        },
        cd_reveal_confirm: {
            en: "Unhide Commands?\n%1",
            de: "Verborgene Befehle anzeigen?\n%1",
            ru: "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0441\u043a\u0440\u044b\u0442\u044b\u0435 \u043a\u043e\u043c\u0430\u043d\u0434\u044b?\n%1",
            zh_TW: "\u8981\u91cd\u65b0\u986f\u793a\u6307\u4ee4\u55ce\uff1f\n%1",
        },
        cd_reveal_confirm_title: {
            en: "Confirm Commands To Unhide",
            de: "Die ausgew\u00e4hlten Befehle anzeigen?",
            ru: "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c \u043f\u043e\u043a\u0430\u0437 \u043a\u043e\u043c\u0430\u043d\u0434",
            zh_TW: "\u78ba\u8a8d\u91cd\u65b0\u986f\u793a\u6307\u4ee4",
        },
        cd_reveal_menu_select: {
            en: "Select Hidden Menu Commands To Unhide",
            de: "W\u00e4hlen Sie die ausgeblendeten Men\u00fcbefehle aus, die angezeigt werden sollen.",
            ru: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u043a\u0440\u044b\u0442\u044b\u0435 \u043a\u043e\u043c\u0430\u043d\u0434\u044b \u0434\u043b\u044f \u043f\u043e\u043a\u0430\u0437\u0430",
            zh_TW: "\u9078\u64c7\u8981\u91cd\u65b0\u986f\u793a\u7684\u96b1\u85cf\u6307\u4ee4",
        },
        cd_revealed_total: {
            en: "Total hidden commands revealed:\n%1",
            de: "Anzahl der verborgenen Befehle, die wieder angezeigt werden:\n%1",
            ru: "\u041f\u043e\u043a\u0430\u0437\u0430\u043d\u043e \u0441\u043a\u0440\u044b\u0442\u044b\u0445 \u043a\u043e\u043c\u0430\u043d\u0434:\n%1",
            zh_TW: "\u5df2\u91cd\u65b0\u986f\u793a\u7684\u96b1\u85cf\u6307\u4ee4\u7e3d\u6578\uff1a\n%1",
        },
        cd_search_for: {
            en: "Search for commands, actions, and loaded scripts.",
            de: "Befehle, Aktionen und geladene Skripte suchen.",
            ru: "\u041f\u043e\u0438\u0441\u043a \u043a\u043e\u043c\u0430\u043d\u0434, \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0439 \u0438 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u043d\u044b\u0445 \u0441\u043a\u0440\u0438\u043f\u0442\u043e\u0432",
            zh_TW: "\u641c\u5c0b\u6307\u4ee4\u3001\u52d5\u4f5c\u8207\u5df2\u8f09\u5165\u7684\u6307\u4ee4\u78bc\u3002",
        },
        close: {
            en: "Close",
            de: "Schlie\u00dfen",
            ru: "\u0417\u0430\u043a\u0440\u044b\u0432\u0430\u0442\u044c",
            zh_TW: "\u95dc\u9589",
        },
        config: {
            en: "Configuration",
            de: "Configuration",
            ru: "Configuration",
            zh_TW: "\u8a2d\u5b9a",
        },
        copyright: {
            en: "Copyright 2026 Josh Duncan",
            de: "Copyright 2026 Josh Duncan",
            ru: "Copyright 2026 Josh Duncan",
            zh_TW: "Copyright 2026 Josh Duncan",
        },
        cp_config: {
            en: "Palette Settings and Configuration",
            de: "Paletteneinstellungen und -konfiguration",
            ru: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430 \u0438 \u043a\u043e\u043d\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044f \u043f\u0430\u043d\u0435\u043b\u0438",
            zh_TW: "\u6307\u4ee4\u9762\u677f\u8a2d\u5b9a",
        },
        cp_q_helptip: {
            en: "Search for commands, actions, and loaded scripts.",
            de: "Befehle, Aktionen und geladene Skripte suchen.",
            ru: "\u041f\u043e\u0438\u0441\u043a \u043a\u043e\u043c\u0430\u043d\u0434, \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0439 \u0438 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u043d\u044b\u0445 \u0441\u043a\u0440\u0438\u043f\u0442\u043e\u0432",
            zh_TW: "\u641c\u5c0b\u6307\u4ee4\u3001\u52d5\u4f5c\u8207\u5df2\u8f09\u5165\u7684\u6307\u4ee4\u78bc\u3002",
        },
        custom: { en: "Custom", de: "Custom", ru: "Custom", zh_TW: "\u81ea\u8a02" },
        custom_commands_all: {
            en: "All Custom Commands",
            de: "All Custom Commands",
            ru: "All Custom Commands",
            zh_TW: "\u6240\u6709\u81ea\u8a02\u6307\u4ee4",
        },
        custom_commands_header: {
            en: "Enter your custom commands below (one per line).\n\nCommands should be in the comma separated (CSV) format:\n'Command Name,Command Action,Command Type'\n\n* No extraneous spaces between commands.",
            de: "Enter your custom commands below (one per line).\n\nCommands should be in the comma separated (CSV) format:\n'Command Name,Command Action,Command Type'\n\n* No extraneous spaces between commands.",
            ru: "Enter your custom commands below (one per line).\n\nCommands should be in the comma separated (CSV) format:\n'Command Name,Command Action,Command Type'\n\n* No extraneous spaces between commands.",
            zh_TW: "\u8acb\u5728\u4e0b\u65b9\u8f38\u5165\u81ea\u8a02\u6307\u4ee4\uff0c\u6bcf\u884c\u4e00\u500b\u3002\n\n\u6307\u4ee4\u8acb\u4f7f\u7528\u9017\u865f\u5206\u9694\uff08CSV\uff09\u683c\u5f0f\uff1a\n\u300c\u986f\u793a\u540d\u7a31,Command Action,\u985e\u578b\uff08menu \u6216 tool\uff09\u300d\n\n* \u9017\u865f\u524d\u5f8c\u8acb\u52ff\u52a0\u5165\u7a7a\u683c\u3002",
        },
        defaults: {
            en: "Defaults",
            de: "Defaults",
            ru: "Defaults",
            zh_TW: "\u9810\u8a2d\u503c",
        },
        description: {
            en: "Boost your Adobe Illustrator efficiency with quick access to most menu commands and tools, all of your actions, and any scripts right from your keyboard. And, with custom workflows, you can combine multiple commands, actions, and scripts to get things done in your own way. Replace repetitive tasks with workflows and boost your productivity.",
            de: "Steigern Sie Ihre Effizienz in Adobe Illustrator mit schnellem Zugriff auf die meisten Men\u00fcbefehle und Werkzeuge sowie alle Aktionen und Skripte, die direkt \u00fcber die Tastatur ausgef\u00fchrt werden k\u00f6nnen. Mit benutzerdefinierten Arbeitsabl\u00e4ufen k\u00f6nnen Sie mehrere Befehle, Aktionen und Skripte kombinieren. Erledigen Sie wiederkehrende Aufgaben mit Arbeitsabl\u00e4ufen und steigern Sie Ihre Produktivit\u00e4t.",
            ru: "\u041f\u043e\u0432\u044b\u0441\u044c\u0442\u0435 \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u044c \u0440\u0430\u0431\u043e\u0442\u044b \u0432 Adobe Illustrator \u0431\u043b\u0430\u0433\u043e\u0434\u0430\u0440\u044f \u0431\u044b\u0441\u0442\u0440\u043e\u043c\u0443 \u0434\u043e\u0441\u0442\u0443\u043f\u0443 \u043a \u0431\u043e\u043b\u044c\u0448\u0438\u043d\u0441\u0442\u0432\u0443 \u043a\u043e\u043c\u0430\u043d\u0434 \u043c\u0435\u043d\u044e, \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u0430\u043c, \u0432\u0441\u0435\u043c \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u044f\u043c \u0438 \u043b\u044e\u0431\u044b\u043c \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u043d\u044b\u043c \u0441\u043a\u0440\u0438\u043f\u0442\u0430\u043c \u043f\u0440\u044f\u043c\u043e \u0441 \u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u044b. \u0410 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u0441\u043a\u0438\u0435 \u043d\u0430\u0431\u043e\u0440\u044b \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u044e\u0442 \u043a\u043e\u043c\u0431\u0438\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e \u043a\u043e\u043c\u0430\u043d\u0434, \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0439 \u0438 \u0441\u043a\u0440\u0438\u043f\u0442\u043e\u0432. \u0417\u0430\u043c\u0435\u043d\u0438\u0442\u0435 \u043f\u043e\u0432\u0442\u043e\u0440\u044f\u044e\u0449\u0438\u0435\u0441\u044f \u0437\u0430\u0434\u0430\u0447\u0438 \u043d\u0430\u0431\u043e\u0440\u0430\u043c\u0438 \u043a\u043e\u043c\u0430\u043d\u0434 \u0438 \u043f\u043e\u0432\u044b\u0441\u044c\u0442\u0435 \u0441\u0432\u043e\u044e \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c.",
            zh_TW: "\u900f\u904e\u9375\u76e4\u5feb\u901f\u5b58\u53d6 Adobe Illustrator \u7684\u5927\u591a\u6578\u9078\u55ae\u6307\u4ee4\u3001\u5de5\u5177\u3001\u6240\u6709\u52d5\u4f5c\u8207\u6307\u4ee4\u78bc\u3002\u4e5f\u53ef\u4ee5\u4f7f\u7528\u81ea\u8a02\u5de5\u4f5c\u6d41\u7a0b\u7d44\u5408\u591a\u500b\u6307\u4ee4\u3001\u52d5\u4f5c\u8207\u6307\u4ee4\u78bc\uff0c\u4f9d\u7167\u81ea\u5df1\u7684\u65b9\u5f0f\u5b8c\u6210\u5de5\u4f5c\uff0c\u6e1b\u5c11\u91cd\u8907\u64cd\u4f5c\u4e26\u63d0\u5347\u6548\u7387\u3002",
        },
        document: {
            en: "Document",
            de: "Document",
            ru: "Document",
            zh_TW: "\u6587\u4ef6",
        },
        document_report: {
            en: "Active Document Report",
            de: "Dokumentinformationen",
            ru: "Active Document Report",
            zh_TW: "\u76ee\u524d\u6587\u4ef6\u5831\u544a",
        },
        document_report_warning: {
            en: "FILE NOT SAVED. Save and rerun report for updated information.",
            de: "FILE NOT SAVED. Save and rerun report for updated information.",
            ru: "FILE NOT SAVED. Save and rerun report for updated information.",
            zh_TW: "\u6587\u4ef6\u5c1a\u672a\u5132\u5b58\u3002\u8acb\u5148\u5132\u5b58\uff0c\u518d\u91cd\u65b0\u7522\u751f\u5831\u544a\u4ee5\u53d6\u5f97\u6700\u65b0\u8cc7\u8a0a\u3002",
        },
        color_space_title_case: {
            en: "Color Space",
            de: "Color Space",
            ru: "Color Space",
            zh_TW: "\u8272\u5f69\u7a7a\u9593",
        },
        dr_color_space: {
            en: "Color Space: ",
            de: "Farbmodus: ",
            ru: "Color Space: ",
            zh_TW: "\u8272\u5f69\u7a7a\u9593\uff1a",
        },
        dr_file_created: {
            en: "File Created: ",
            de: "Datei erstellt am: ",
            ru: "File Created: ",
            zh_TW: "\u5831\u544a\u7522\u751f\u6642\u9593\uff1a",
        },
        dr_file_found: {
            en: "File Found: ",
            de: "Datei gefunden: ",
            ru: "File Found: ",
            zh_TW: "\u627e\u5230\u6a94\u6848\uff1a",
        },
        dr_filename: {
            en: "File: ",
            de: "Datei: ",
            ru: "File: ",
            zh_TW: "\u6a94\u6848\uff1a",
        },
        dr_header: {
            en: "File Information\n-----\n",
            de: "Datei-Information\n-----\n",
            ru: "File Information\n-----\n",
            zh_TW: "\u6a94\u6848\u8cc7\u8a0a\n-----\n",
        },
        dr_include: {
            en: "Include",
            de: "Include",
            ru: "Include",
            zh_TW: "\u5305\u542b\u9805\u76ee",
        },
        dr_height: {
            en: "Height: ",
            de: "H\u00f6he: ",
            ru: "Height: ",
            zh_TW: "\u9ad8\u5ea6\uff1a",
        },
        dr_info_string: {
            en: "Ai Document Information",
            de: "AI-Dokument-Information",
            ru: "Ai Document Information",
            zh_TW: "Illustrator \u6587\u4ef6\u8cc7\u8a0a",
        },
        dr_name: {
            en: "Name: ",
            de: "Name: ",
            ru: "Name: ",
            zh_TW: "\u540d\u7a31\uff1a",
        },
        dr_path: {
            en: "Path: ",
            de: "Pfad: ",
            ru: "Path: ",
            zh_TW: "\u8def\u5f91\uff1a",
        },
        dr_width: {
            en: "Width: ",
            de: "Breite: ",
            ru: "Width: ",
            zh_TW: "\u5bec\u5ea6\uff1a",
        },
        file: { en: "File", de: "File", ru: "File", zh_TW: "\u6a94\u6848" },
        file_saved: {
            en: "File Saved:\n%1",
            de: "Datei gespeichert:\n%1",
            ru: "File Saved:\n%1",
            zh_TW: "\u6a94\u6848\u5df2\u5132\u5b58\uff1a\n%1",
        },
        fl_error_loading: {
            en: "Error loading file:\n%1",
            de: "Fehler beim Laden der Datei:\n%1",
            ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0438 \u0444\u0430\u0439\u043b\u0430:\n%1",
            zh_TW: "\u8f09\u5165\u6a94\u6848\u6642\u767c\u751f\u932f\u8aa4\uff1a\n%1",
        },
        fl_error_writing: {
            en: "Error writing file:\n%1",
            de: "Fehler beim Schreiben der Datei:\n%1",
            ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u043f\u0438\u0441\u0438 \u0444\u0430\u0439\u043b\u0430:\n%1",
            zh_TW: "\u5beb\u5165\u6a94\u6848\u6642\u767c\u751f\u932f\u8aa4\uff1a\n%1",
        },
        folder: {
            en: "Folder",
            de: "Folder",
            ru: "Folder",
            zh_TW: "\u8cc7\u6599\u593e",
        },
        folder_already_watched: {
            en: "Folder $1 already watched.",
            de: "Folder $1 already watched.",
            ru: "Folder $1 already watched.",
            zh_TW: "\u8cc7\u6599\u593e\u300c%1\u300d\u5df2\u5728\u76e3\u770b\u4e2d\u3002",
        },
        fonts: { en: "Fonts", de: "Schriften", ru: "Fonts", zh_TW: "\u5b57\u9ad4" },
        github: {
            en: "Click here to learn more",
            de: "Klicken Sie hier f\u00fcr weitere Informationen",
            ru: "\u041d\u0430\u0436\u043c\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u0443\u0437\u043d\u0430\u0442\u044c \u0431\u043e\u043b\u044c\u0448\u0435",
            zh_TW: "\u6309\u4e00\u4e0b\u4ee5\u9032\u4e00\u6b65\u4e86\u89e3",
        },
        go_to_artboard: {
            en: "Go To Artboard",
            de: "Gehen Sie zur Zeichenfl\u00e4che",
            ru: "\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u043a \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
            zh_TW: "\u524d\u5f80\u5de5\u4f5c\u5340\u57df",
        },
        go_to_named_object: {
            en: "Go To Named Object",
            de: "Gehen Sie zum benannten Objekt",
            ru: "\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u043a \u0438\u043c\u0435\u043d\u043e\u0432\u0430\u043d\u043d\u043e\u043c\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u0443",
            zh_TW: "\u524d\u5f80\u5df2\u547d\u540d\u7269\u4ef6",
        },
        go_to_named_object_limit: {
            en: "Attention:\nThis document contains a lot of page items (%1). Please be patient while they load.",
            de: "Attention:\nThis document contains a lot of page items (%1). Please be patient while they load.",
            ru: "Attention:\nThis document contains a lot of page items (%1). Please be patient while they load.",
            zh_TW: "\u6ce8\u610f\uff1a\n\u9019\u4efd\u6587\u4ef6\u5305\u542b\u5927\u91cf\u9801\u9762\u9805\u76ee\uff08%1\uff09\u3002\u8f09\u5165\u6642\u8acb\u7a0d\u5019\u3002",
        },
        go_to_named_object_no_objects: {
            en: "No named page items found.",
            de: "Keine benannten Objekte vorhanden.",
            ru: "No named page items found.",
            zh_TW: "\u627e\u4e0d\u5230\u5df2\u547d\u540d\u7684\u9801\u9762\u9805\u76ee\u3002",
        },
        go_to_open_document: {
            en: "Go To Open Document",
            de: "Ge\u00f6ffnete Dokumente ausw\u00e4hlen",
            ru: "Go To Open Document",
            zh_TW: "\u524d\u5f80\u5df2\u958b\u555f\u7684\u6587\u4ef6",
        },
        history_cleared: {
            en: "History cleared!",
            de: "Zuletzt verwendete Befehle wurden gel\u00f6scht!",
            ru: "History cleared!",
            zh_TW: "\u6b77\u53f2\u7d00\u9304\u5df2\u6e05\u9664\uff01",
        },
        layer_title_case: {
            en: "Layer",
            de: "Layer",
            ru: "Layer",
            zh_TW: "\u5716\u5c64",
        },
        layers: { en: "Layers", de: "Ebenen", ru: "Layers", zh_TW: "\u5716\u5c64" },
        listbox_missing: {
            en: "Missing",
            de: "Missing",
            ru: "Missing",
            zh_TW: "\u7f3a\u5c11\u8cc7\u6599",
        },
        menu: { en: "Menu", de: "Menu", ru: "Menu", zh_TW: "\u9078\u55ae" },
        menu_commands: {
            en: "Menu Commands",
            de: "Menu Commands",
            ru: "Menu Commands",
            zh_TW: "\u9078\u55ae\u6307\u4ee4",
        },
        name_title_case: { en: "Name", de: "Name", ru: "Name", zh_TW: "\u540d\u7a31" },
        no_active_document: {
            en: "No active documents.",
            de: "Keine ge\u00f6ffneten Dokumente vorhanden..",
            ru: "No active documents.",
            zh_TW: "\u76ee\u524d\u6c92\u6709\u958b\u555f\u4e2d\u7684\u6587\u4ef6\u3002",
        },
        no_document_variables: {
            en: "No document variables.",
            de: "Keine Variablen vorhanden.",
            ru: "No document variables.",
            zh_TW: "\u6587\u4ef6\u4e2d\u6c92\u6709\u8b8a\u6578\u3002",
        },
        none: { en: "None", de: "Ohne", ru: "None", zh_TW: "\u7121" },
        open_recent_file: {
            en: "Open Recent File",
            de: "Zuletzt benutzte Datei \u00f6ffnen",
            ru: "Open Recent File",
            zh_TW: "\u958b\u555f\u6700\u8fd1\u4f7f\u7528\u7684\u6a94\u6848",
        },
        picker: {
            en: "Picker",
            de: "Picker",
            ru: "Picker",
            zh_TW: "\u9078\u64c7\u5668",
        },
        picker_option_type: {
            en: "Option",
            de: "Option",
            ru: "Option",
            zh_TW: "\u9078\u9805",
        },
        placed_items: {
            en: "Placed Items",
            de: "Platzierte Objecte",
            ru: "Placed Items",
            zh_TW: "\u7f6e\u5165\u9805\u76ee",
        },
        history_file_loading_error: {
            en: "Error Loading History\nA backup copy of your history has been created.",
            de: "Error Loading History\nA backup copy of your history has been created.",
            ru: "Error Loading History\nA backup copy of your history has been created.",
            zh_TW: "\u8f09\u5165\u6b77\u53f2\u7d00\u9304\u6642\u767c\u751f\u932f\u8aa4\n\u5df2\u5efa\u7acb\u6b77\u53f2\u7d00\u9304\u7684\u5099\u4efd\u3002",
        },
        path_title_case: { en: "Path", de: "Path", ru: "Path", zh_TW: "\u8def\u5f91" },
        picker_builder_header: {
            en: "Enter your custom commands below (one per line).",
            de: "Enter your custom commands below (one per line).",
            ru: "Enter your custom commands below (one per line).",
            zh_TW: "\u8acb\u5728\u4e0b\u65b9\u8f38\u5165\u9078\u9805\uff0c\u6bcf\u884c\u4e00\u500b\u3002",
        },
        picker_builder_multi_select: {
            en: "Multi-Select Enabled?",
            de: "Multi-Select Enabled?",
            ru: "Multi-Select Enabled?",
            zh_TW: "\u5141\u8a31\u591a\u91cd\u9078\u53d6",
        },
        picker_builder_name: {
            en: "Custom Picker Name",
            de: "Custom Picker Name",
            ru: "Custom Picker Name",
            zh_TW: "\u81ea\u8a02\u9078\u64c7\u5668\u540d\u7a31",
        },
        picker_builder_title: {
            en: "Custom Picker Builder",
            de: "Custom Picker Builder",
            ru: "Custom Picker Builder",
            zh_TW: "\u81ea\u8a02\u9078\u64c7\u5668\u5efa\u7acb\u5de5\u5177",
        },
        picker_builder_save_conflict_message: {
            en: "A custom picker with that name already exists.\nWould you like to overwrite the previous picker with the new one?\n%1",
            de: "A custom picker with that name already exists.\nWould you like to overwrite the previous picker with the new one?\n%1",
            ru: "A custom picker with that name already exists.\nWould you like to overwrite the previous picker with the new one?\n%1",
            zh_TW: "\u5df2\u6709\u76f8\u540c\u540d\u7a31\u7684\u81ea\u8a02\u9078\u64c7\u5668\u3002\n\u8981\u7528\u65b0\u7684\u9078\u64c7\u5668\u8986\u5beb\u539f\u6709\u5167\u5bb9\u55ce\uff1f\n%1",
        },
        picker_builder_save_conflict_title: {
            en: "Save Custom Picker Conflict",
            de: "Save Custom Picker Conflict",
            ru: "Save Custom Picker Conflict",
            zh_TW: "\u5132\u5b58\u81ea\u8a02\u9078\u64c7\u5668\u6642\u767c\u751f\u885d\u7a81",
        },
        picker_to_edit: {
            en: "Choose a custom picker to edit.",
            de: "Choose a custom picker to edit.",
            ru: "Choose a custom picker to edit.",
            zh_TW: "\u9078\u64c7\u8981\u7de8\u8f2f\u7684\u81ea\u8a02\u9078\u64c7\u5668\u3002",
        },
        pickers_all: {
            en: "All Pickers",
            de: "All Pickers",
            ru: "All Pickers",
            zh_TW: "\u6240\u6709\u9078\u64c7\u5668",
        },
        pref_file_loading_error: {
            en: "Error Loading Preferences\nA backup copy of your settings has been created.\n\n%1",
            de: "Fehler beim Laden der Voreinstellungen\nEine Sicherungskopie Ihrer Einstellungen wurde erstellt.\n\n%1",
            ru: "Error Loading Preferences\nA backup copy of your settings has been created.\n\n%1",
            zh_TW: "\u8f09\u5165\u504f\u597d\u8a2d\u5b9a\u6642\u767c\u751f\u932f\u8aa4\n\u5df2\u5efa\u7acb\u8a2d\u5b9a\u7684\u5099\u4efd\u3002\n\n%1",
        },
        pref_file_non_compatible: {
            en: "Incompatible Preferences\nYour preferences file isn't compatible with your current version of Ai Command Palette. Your preferences file will be updated.\n\nA backup copy of your settings has been created.",
            de: "Incompatible Preferences\nYour preferences file isn't compatible with your current version of Ai Command Palette. Your preferences file will be updated.\n\nA backup copy of your settings has been created.",
            ru: "Incompatible Preferences\nYour preferences file isn't compatible with your current version of Ai Command Palette. Your preferences file will be updated.\n\nA backup copy of your settings has been created.",
            zh_TW: "\u504f\u597d\u8a2d\u5b9a\u4e0d\u76f8\u5bb9\n\u504f\u597d\u8a2d\u5b9a\u6a94\u8207\u76ee\u524d\u7248\u672c\u7684 Ai Command Palette \u4e0d\u76f8\u5bb9\uff0c\u7cfb\u7d71\u5c07\u66f4\u65b0\u6b64\u6a94\u6848\u3002\n\n\u5df2\u5efa\u7acb\u8a2d\u5b9a\u7684\u5099\u4efd\u3002",
        },
        pref_update_complete: {
            en: "Preferences Update Complete.",
            de: "Aktualisierung der Voreinstellungen fertiggestellt",
            ru: "Preferences Update Complete",
            zh_TW: "\u504f\u597d\u8a2d\u5b9a\u66f4\u65b0\u5b8c\u6210\u3002",
        },
        recent_commands: {
            en: "Recent Commands",
            de: "Zuletzt verwendete Befehle",
            ru: "Recent Commands",
            zh_TW: "\u6700\u8fd1\u4f7f\u7528\u7684\u6307\u4ee4",
        },
        remove_watched_folders: {
            en: "Select Watched Folder(s) To Remove...",
            de: "Select Watched Folder(s) To Remove...",
            ru: "Select Watched Folder(s) To Remove...",
            zh_TW: "\u9078\u64c7\u8981\u79fb\u9664\u7684\u76e3\u770b\u8cc7\u6599\u593e\u2026",
        },
        remove_watched_folders_confirm: {
            en: "Remove Watched Folder(s)?\nScripts from removed folders will longer load or work in any workflows you previously created where they were used as a step.\n\n%1",
            de: "Remove Watched Folder(s)?\nScripts from removed folders will longer load or work in any workflows you previously created where they were used as a step.\n\n%1",
            ru: "Remove Watched Folder(s)?\nScripts from removed folders will longer load or work in any workflows you previously created where they were used as a step.\n\n%1",
            zh_TW: "\u8981\u79fb\u9664\u76e3\u770b\u8cc7\u6599\u593e\u55ce\uff1f\n\u79fb\u9664\u8cc7\u6599\u593e\u5f8c\uff0c\u5176\u4e2d\u7684\u6307\u4ee4\u78bc\u5c07\u4e0d\u518d\u8f09\u5165\uff1b\u5148\u524d\u5de5\u4f5c\u6d41\u7a0b\u4e2d\u4f7f\u7528\u9019\u4e9b\u6307\u4ee4\u78bc\u7684\u6b65\u9a5f\u4e5f\u5c07\u7121\u6cd5\u57f7\u884c\u3002\n\n%1",
        },
        remove_watched_folders_confirm_title: {
            en: "Confirm Watched Folder(s) To Delete",
            de: "Confirm Watched Folder(s) To Delete",
            ru: "Confirm Watched Folder(s) To Delete",
            zh_TW: "\u78ba\u8a8d\u79fb\u9664\u76e3\u770b\u8cc7\u6599\u593e",
        },
        ruler_units_title_case: {
            en: "Ruler Units",
            de: "Ruler Units",
            ru: "Ruler Units",
            zh_TW: "\u5c3a\u6a19\u55ae\u4f4d",
        },
        save: {
            en: "Save",
            de: "Speichern",
            ru: "\u0421\u043e\u0445\u0440\u0430\u043d\u044f\u0442\u044c",
            zh_TW: "\u5132\u5b58",
        },
        save_active_document_report: {
            en: "Save Active Document Report",
            de: "Save Active Document Report",
            ru: "Save Active Document Report",
            zh_TW: "\u5132\u5b58\u76ee\u524d\u6587\u4ef6\u5831\u544a",
        },
        sc_already_loaded_title: {
            en: "Script Load Conflict",
            de: "Skriptladekonflikt",
            ru: "\u041f\u0440\u043e\u0431\u043b\u0435\u043c\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0438 \u0441\u043a\u0440\u0438\u043f\u0442\u0430",
            zh_TW: "\u6307\u4ee4\u78bc\u8f09\u5165\u885d\u7a81",
        },
        sc_error_execution: {
            en: "Error executing script:\n%1\n\n%2",
            de: "Fehler beim Ausf\u00fchren des Skripts:\n%1\n\n%2",
            ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u043f\u0443\u0441\u043a\u0430 \u0441\u043a\u0440\u0438\u043f\u0442\u0430:\n%1\n\n%2",
            zh_TW: "\u57f7\u884c\u6307\u4ee4\u78bc\u6642\u767c\u751f\u932f\u8aa4\uff1a\n%1\n\n%2",
        },
        sc_error_exists: {
            en: "Script no longer exists at original path. Try reloading.\n%1",
            de: "Skript existiert nicht mehr am urspr\u00fcnglichen Ort.\n%1",
            ru: "\u0421\u043a\u0440\u0438\u043f\u0442 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d \u0432 \u0443\u043a\u0430\u0437\u0430\u043d\u043d\u043e\u0439 \u043f\u0430\u043f\u043a\u0435\n%1",
            zh_TW: "\u539f\u59cb\u8def\u5f91\u4e2d\u7684\u6307\u4ee4\u78bc\u5df2\u4e0d\u5b58\u5728\u3002\u8acb\u5617\u8a66\u91cd\u65b0\u8f09\u5165\u3002\n%1",
        },
        sc_error_loading: {
            en: "Error loading script:\n%1",
            de: "Fehler beim Laden des Skripts:\n%1",
            ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0438 \u0441\u043a\u0440\u0438\u043f\u0442\u0430:\n%1",
            zh_TW: "\u8f09\u5165\u6307\u4ee4\u78bc\u6642\u767c\u751f\u932f\u8aa4\uff1a\n%1",
        },
        sc_load_script: {
            en: "Load Script(s)",
            de: "Skripte laden",
            ru: "Load Script(s)",
            zh_TW: "\u8f09\u5165\u6307\u4ee4\u78bc",
        },
        sc_none_selected: {
            en: "No script files selected.\nMust be JavaScript '.js' or '.jsx' files.",
            de: "Keine Skriptdateien ausgew\u00e4hlt.\nEs m\u00fcssen JavaScript-'.js'- oder '.jsx'-Dateien sein.",
            ru: "\u041d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d\u044b \u0441\u043a\u0440\u0438\u043f\u0442\u044b\n\u0424\u0430\u0439\u043b\u044b JavaScript \u0438\u043c\u0435\u044e\u0442 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u0438\u0435 '.js' \u0438\u043b\u0438 '.jsx'",
            zh_TW: "\u672a\u9078\u53d6\u6307\u4ee4\u78bc\u6a94\u6848\u3002\n\u8acb\u9078\u64c7 JavaScript\u300c.js\u300d\u6216\u300c.jsx\u300d\u6a94\u6848\u3002",
        },
        sc_total_loaded: {
            en: "Total scripts loaded:\n%1",
            de: "Geladene Skripte insgesamt:\n%1",
            ru: "\u0417\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u043e \u0441\u043a\u0440\u0438\u043f\u0442\u043e\u0432:\n%1",
            zh_TW: "\u5df2\u8f09\u5165\u7684\u6307\u4ee4\u78bc\u7e3d\u6578\uff1a\n%1",
        },
        script: {
            en: "Script",
            de: "Skript",
            ru: "\u0421\u043a\u0440\u0438\u043f\u0442",
            zh_TW: "\u6307\u4ee4\u78bc",
        },
        Scripts: {
            en: "Scripts",
            de: "Skripte laden",
            ru: "Scripts",
            zh_TW: "\u6307\u4ee4\u78bc",
        },
        set_title_case: {
            en: "Set",
            de: "Set",
            ru: "Set",
            zh_TW: "\u52d5\u4f5c\u96c6",
        },
        spot_colors: {
            en: "Spot Colors",
            de: "Volltonfarben",
            ru: "Spot Colors",
            zh_TW: "\u7279\u5225\u8272",
        },
        startup_builder: {
            en: "Startup Screen Customizer",
            de: "Startup Screen Customizer",
            ru: "Startup Screen Customizer",
            zh_TW: "\u555f\u52d5\u756b\u9762\u81ea\u8a02\u5de5\u5177",
        },
        startup_error_saving: {
            en: "Error saving startup commands.\nPrevious settings were reloaded.",
            de: "Error saving startup commands.\nPrevious settings were reloaded.",
            ru: "Error saving startup commands.\nPrevious settings were reloaded.",
            zh_TW: "\u5132\u5b58\u555f\u52d5\u756b\u9762\u6307\u4ee4\u6642\u767c\u751f\u932f\u8aa4\u3002\n\u5df2\u91cd\u65b0\u8f09\u5165\u5148\u524d\u7684\u8a2d\u5b9a\u3002",
        },
        startup_helptip: {
            en: "Double-click a command to add it to your startup command list below.",
            de: "Double-click a command to add it to your startup command list below.",
            ru: "Double-click a command to add it to your startup command list below.",
            zh_TW: "\u9023\u6309\u5169\u4e0b\u6307\u4ee4\uff0c\u53ef\u5c07\u5b83\u52a0\u5165\u4e0b\u65b9\u7684\u555f\u52d5\u756b\u9762\u6307\u4ee4\u6e05\u55ae\u3002",
        },
        startup_steps: {
            en: "Startup Commands",
            de: "Startup Commands",
            ru: "Startup Commands",
            zh_TW: "\u555f\u52d5\u756b\u9762\u6307\u4ee4",
        },
        startup_steps_helptip: {
            en: "Startup commands will displayed in order from top to bottom.",
            de: "Startup commands will displayed in order from top to bottom.",
            ru: "Startup commands will displayed in order from top to bottom.",
            zh_TW: "\u555f\u52d5\u756b\u9762\u6307\u4ee4\u6703\u4f9d\u7167\u7531\u4e0a\u5230\u4e0b\u7684\u9806\u5e8f\u986f\u793a\u3002",
        },
        step_delete: {
            en: "Delete",
            de: "L\u00f6schen",
            ru: "\u0423\u0434\u0430\u043b\u0438\u0442\u044c",
            zh_TW: "\u522a\u9664",
        },
        step_down: {
            en: "Move Down",
            de: "Nach unten",
            ru: "\u0412\u043d\u0438\u0437",
            zh_TW: "\u4e0b\u79fb",
        },
        step_edit: { en: "Edit", de: "Edit", ru: "Edit", zh_TW: "\u7de8\u8f2f" },
        step_up: {
            en: "Move Up",
            de: "Nach oben",
            ru: "\u041d\u0430\u0432\u0435\u0440\u0445",
            zh_TW: "\u4e0a\u79fb",
        },
        title: {
            en: "Ai Command Palette",
            de: "Kurzbefehle",
            ru: "Ai Command Palette",
            zh_TW: "Ai Command Palette",
        },
        tl_all: {
            en: "Tools",
            de: "Alle integrierten Werkzeuge",
            ru: "\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u044b\u0435 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u044b",
            zh_TW: "\u5de5\u5177",
        },
        tl_error_selecting: {
            en: "Error selecting tool:\n%1\n\n%2",
            de: "Fehler beim Ausw\u00e4hlen des Werkzeugs:\n%1\n\n%2",
            ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0432\u044b\u0431\u043e\u0440\u0430 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u0430:\n%1\n\n%2",
            zh_TW: "\u9078\u53d6\u5de5\u5177\u6642\u767c\u751f\u932f\u8aa4\uff1a\n%1\n\n%2",
        },
        tl_none_available: {
            en: "No tools are currently available.",
            de: "Zurzeit sind keine Werkzeuge verf\u00fcgbar.",
            ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u044b \u0432 \u0434\u0430\u043d\u043d\u044b\u0439 \u043c\u043e\u043c\u0435\u043d\u0442 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b",
            zh_TW: "\u76ee\u524d\u6c92\u6709\u53ef\u7528\u7684\u5de5\u5177\u3002",
        },
        tool: { en: "Tool", de: "Tool", ru: "Tool", zh_TW: "\u5de5\u5177" },
        type_title_case: { en: "Type", de: "Type", ru: "Type", zh_TW: "\u985e\u578b" },
        user_prefs_inconsistency: {
            en: "User Preferences Inconsistency\nIt seems your preferences file may be from a different computer than this one.\n\n PLEASE NOTE: There is a small chance this could cause some features to break.",
            de: "User Preferences Inconsistency\nIt seems your preferences file may be from a different computer than this one.\n\n PLEASE NOTE: There is a small chance this could cause some features to break.",
            ru: "User Preferences Inconsistency\nIt seems your preferences file may be from a different computer than this one.\n\n PLEASE NOTE: There is a small chance this could cause some features to break.",
            zh_TW: "\u4f7f\u7528\u8005\u504f\u597d\u8a2d\u5b9a\u4e0d\u4e00\u81f4\n\u504f\u597d\u8a2d\u5b9a\u6a94\u53ef\u80fd\u4f86\u81ea\u53e6\u4e00\u90e8\u96fb\u8166\u3002\n\n\u6ce8\u610f\uff1a\u5c11\u6578\u60c5\u6cc1\u4e0b\u53ef\u80fd\u9020\u6210\u90e8\u5206\u529f\u80fd\u7121\u6cd5\u6b63\u5e38\u904b\u4f5c\u3002",
        },
        version: {
            en: "Version %1",
            de: "Ausf\u00fchrung %1",
            ru: "\u0432\u0435\u0440\u0441\u0438\u044f %1",
            zh_TW: "\u7248\u672c %1",
        },
        watched_folder_not_found: {
            en: "Watched folder '%1' not found!\nYou can remove this folder using the 'Remove Watched Folders' command.",
            de: "Watched folder '%1' not found!\nYou can remove this folder using the 'Remove Watched Folders' command.",
            ru: "Watched folder '%1' not found!\nYou can remove this folder using the 'Remove Watched Folders' command.",
            zh_TW: "\u627e\u4e0d\u5230\u76e3\u770b\u8cc7\u6599\u593e\u300c%1\u300d\uff01\n\u53ef\u4ee5\u4f7f\u7528\u300c\u79fb\u9664\u76e3\u770b\u8cc7\u6599\u593e\uff08Remove Watched Folder(s)\uff09\u300d\u6307\u4ee4\u79fb\u9664\u6b64\u8cc7\u6599\u593e\u3002",
        },
        watched_folder_title_case: {
            en: "Watched Folder",
            de: "Watched Folder",
            ru: "Watched Folder",
            zh_TW: "\u76e3\u770b\u8cc7\u6599\u593e",
        },
        wf_already_exists: {
            en: "A workflow with that name already exists.\nWould you like to overwrite the previous workflow with the new one?",
            de: "Ein Arbeitsablauf mit diesem Namen existiert bereits.\nSoll der bestehende Arbeitsablauf \u00fcberschrieben werden?",
            ru: "\u041d\u0430\u0431\u043e\u0440 \u0441 \u0442\u0430\u043a\u0438\u043c \u0438\u043c\u0435\u043d\u0435\u043c \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442\n\u0425\u043e\u0442\u0438\u0442\u0435 \u043f\u0435\u0440\u0435\u0437\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u043f\u0440\u0435\u0434\u044b\u0434\u0443\u0449\u0438\u0439?",
            zh_TW: "\u5df2\u6709\u76f8\u540c\u540d\u7a31\u7684\u5de5\u4f5c\u6d41\u7a0b\u3002\n\u8981\u7528\u65b0\u7684\u5de5\u4f5c\u6d41\u7a0b\u8986\u5beb\u539f\u6709\u5167\u5bb9\u55ce\uff1f",
        },
        wf_already_exists_title: {
            en: "Save Workflow Conflict",
            de: "Arbeitsablauf-Konflikt speichern?",
            ru: "\u041f\u0440\u043e\u0431\u043b\u0435\u043c\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u044f \u043d\u0430\u0431\u043e\u0440\u0430",
            zh_TW: "\u5132\u5b58\u5de5\u4f5c\u6d41\u7a0b\u6642\u767c\u751f\u885d\u7a81",
        },
        wf_builder: {
            en: "Workflow Builder",
            de: "Arbeitsabl\u00e4ufe erstellen",
            ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440 \u043d\u0430\u0431\u043e\u0440\u043e\u0432 \u043a\u043e\u043c\u0430\u043d\u0434",
            zh_TW: "\u5de5\u4f5c\u6d41\u7a0b\u5efa\u7acb\u5de5\u5177",
        },
        wf_choose: {
            en: "Choose A Workflow To Edit",
            de: "W\u00e4hlen Sie einen Arbeitsablauf zum Bearbeiten aus.",
            ru: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0430\u0431\u043e\u0440 \u0434\u043b\u044f \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f",
            zh_TW: "\u9078\u64c7\u8981\u7de8\u8f2f\u7684\u5de5\u4f5c\u6d41\u7a0b",
        },
        wf_error_saving: {
            en: "Error saving workflow:\n%1",
            de: "Fehler beim Speichern des Arbeitsablaufs:\n%1",
            ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u044f \u043d\u0430\u0431\u043e\u0440\u0430:\n%1",
            zh_TW: "\u5132\u5b58\u5de5\u4f5c\u6d41\u7a0b\u6642\u767c\u751f\u932f\u8aa4\uff1a\n%1",
        },
        wf_needs_attention: {
            en: "Workflow needs attention.\nThe following action steps from your workflow are not currently available.\n\n%1",
            de: "Achtung!\nDie folgenden Aktionsschritte sind nicht mehr vorhanden\n\n%1",
            ru: "\u041d\u0430\u0431\u043e\u0440 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u0432\u043d\u0438\u043c\u0430\u043d\u0438\u044f\n\u0423\u043a\u0430\u0437\u0430\u043d\u043d\u044b\u0435 \u0448\u0430\u0433\u0438 \u0432 \u0432\u0430\u0448\u0435\u043c \u043d\u0430\u0431\u043e\u0440\u0435 \u043a\u043e\u043c\u0430\u043d\u0434 \u0431\u043e\u043b\u044c\u0448\u0435 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b.\n\n%1",
            zh_TW: "\u5de5\u4f5c\u6d41\u7a0b\u9700\u8981\u8655\u7406\u3002\n\u4e0b\u5217\u6b65\u9a5f\u76ee\u524d\u7121\u6cd5\u4f7f\u7528\uff1a\n\n%1",
        },
        wf_none_attention: {
            en: "There are no workflows that need attention.",
            de: "Es gibt keine Arbeitsabl\u00e4ufe, die beachtet werden m\u00fcssen.",
            ru: "\u041d\u0435\u0442 \u043d\u0430\u0431\u043e\u0440\u043e\u0432 \u0442\u0440\u0435\u0431\u0443\u044e\u0449\u0438\u0445 \u0432\u043d\u0438\u043c\u0430\u043d\u0438\u044f",
            zh_TW: "\u6c92\u6709\u9700\u8981\u8655\u7406\u7684\u5de5\u4f5c\u6d41\u7a0b\u3002",
        },
        wf_none_edit: {
            en: "There are no workflows to edit.",
            de: "Es gibt keine Arbeitsabl\u00e4ufe zum Bearbeiten.",
            ru: "\u041d\u0435\u0442 \u043d\u0430\u0431\u043e\u0440\u043e\u0432 \u0434\u043b\u044f \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f",
            zh_TW: "\u6c92\u6709\u53ef\u7de8\u8f2f\u7684\u5de5\u4f5c\u6d41\u7a0b\u3002",
        },
        wf_not_saved: {
            en: "Workflow not saved.",
            de: "Arbeitsablauf nicht gespeichert",
            ru: "\u041d\u0430\u0431\u043e\u0440 \u043d\u0435 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d",
            zh_TW: "\u5de5\u4f5c\u6d41\u7a0b\u5c1a\u672a\u5132\u5b58\u3002",
        },
        wf_save: { en: "Save", de: "Save", ru: "Save", zh_TW: "\u5132\u5b58" },
        wf_save_as: {
            en: "Save Workflow As",
            de: "Arbeitsablauf speichern als",
            ru: "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043d\u0430\u0431\u043e\u0440 \u043a\u0430\u043a",
            zh_TW: "\u5de5\u4f5c\u6d41\u7a0b\u53e6\u5b58\u70ba",
        },
        wf_step_incompatible_ai_version: {
            en: "INCOMPATIBLE ILLUSTRATOR VERSION",
            de: "INCOMPATIBLE ILLUSTRATOR VERSION",
            ru: "INCOMPATIBLE ILLUSTRATOR VERSION",
            zh_TW: "Illustrator \u7248\u672c\u4e0d\u76f8\u5bb9",
        },
        wf_step_not_found: {
            en: "NOT FOUND",
            de: "NOT FOUND",
            ru: "NOT FOUND",
            zh_TW: "\u627e\u4e0d\u5230\u6307\u4ee4",
        },
        wf_step_not_editable: {
            en: "Selected Step Not Editable",
            de: "Selected Step Not Editable",
            ru: "Selected Step Not Editable",
            zh_TW: "\u7121\u6cd5\u7de8\u8f2f\u6240\u9078\u6b65\u9a5f",
        },
        wf_steps: {
            en: "Workflow Steps",
            de: "Befehlskombinationen",
            ru: "\u0428\u0430\u0433\u0438 \u043d\u0430\u0431\u043e\u0440\u0430",
            zh_TW: "\u5de5\u4f5c\u6d41\u7a0b\u6b65\u9a5f",
        },
        wf_steps_helptip: {
            en: "Workflows will run in order from top to bottom.",
            de: "Die Befehlskombinationen werden in der Reihenfolge von oben nach unten ausgef\u00fchrt.",
            ru: "\u041d\u0430\u0431\u043e\u0440 \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442\u0441\u044f \u0441\u0432\u0435\u0440\u0445\u0443 \u0432\u043d\u0438\u0437",
            zh_TW: "\u5de5\u4f5c\u6d41\u7a0b\u6703\u4f9d\u7167\u7531\u4e0a\u5230\u4e0b\u7684\u9806\u5e8f\u57f7\u884c\u3002",
        },
        watched_folder_select: {
            en: "Select script a folder to watch.",
            de: "Select script a folder to watch.",
            ru: "Select script a folder to watch.",
            zh_TW: "\u9078\u64c7\u8981\u76e3\u770b\u7684\u6307\u4ee4\u78bc\u8cc7\u6599\u593e\u3002",
        },
        workflow: {
            en: "Workflow",
            de: "Arbeitsablauf",
            ru: "\u041d\u0430\u0431\u043e\u0440\u044b",
            zh_TW: "\u5de5\u4f5c\u6d41\u7a0b",
        },
        Workflows: {
            en: "Workflows",
            de: "Arbeitsabl\u00e4ufe",
            ru: "Workflows",
            zh_TW: "\u5de5\u4f5c\u6d41\u7a0b",
        },
    };
    var commandsData = {
        menu_1000: {
            id: "menu_new",
            action: "new",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "File > New...",
                de: "Datei > Neu \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u041d\u043e\u0432\u044b\u0439...",
                "zh-cn": "\u6587\u4ef6>\u65b0\u5efa\u2026",
                zh_TW: "\u6a94\u6848 > \u65b0\u5efa\u2026",
            },
            hidden: false,
        },
        menu_1001: {
            id: "menu_newFromTemplate",
            action: "newFromTemplate",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "File > New from Template...",
                de: "Datei > Neu aus Vorlage \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u041d\u043e\u0432\u044b\u0439 \u0438\u0437 \u0448\u0430\u0431\u043b\u043e\u043d\u0430...",
                "zh-cn": "\u6587\u4ef6>\u4ece\u6a21\u677f\u65b0\u5efa\u2026",
                zh_TW: "\u6a94\u6848 > \u5f9e\u6a21\u677f\u65b0\u5efa\u2026",
            },
            hidden: false,
        },
        menu_1002: {
            id: "menu_open",
            action: "open",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "File > Open...",
                de: "Datei > \u00d6ffnen \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u041e\u0442\u043a\u0440\u044b\u0442\u044c...",
                "zh-cn": "\u6587\u4ef6>\u6253\u5f00\u2026",
                zh_TW: "\u6a94\u6848 > \u958b\u555f\u2026",
            },
            hidden: false,
        },
        menu_1003: {
            id: "menu_Adobe_Bridge_Browse",
            action: "Adobe Bridge Browse",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "File > Browse in Bridge...",
                de: "Datei > Bridge durchsuchen \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u041e\u0431\u0437\u043e\u0440 \u0432 Bridge...",
                "zh-cn": "\u6587\u4ef6>\u5728Bridge\u4e2d\u6d4f\u89c8\u2026",
                zh_TW: "\u6a94\u6848 > \u5728Bridge\u4e2d\u700f\u89bd\u2026",
            },
            hidden: false,
        },
        menu_1004: {
            id: "menu_close",
            action: "close",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Close",
                de: "Datei > Schlie\u00dfen",
                ru: "\u0424\u0430\u0439\u043b > \u0417\u0430\u043a\u0440\u044b\u0442\u044c",
                "zh-cn": "\u6587\u4ef6>\u5173\u95ed\u2026",
                zh_TW: "\u6a94\u6848 > \u95dc\u9589\u2026",
            },
            hidden: false,
        },
        menu_2000: {
            id: "menu_closeAll",
            action: "closeAll",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Close All",
                de: "File > Close All",
                ru: "File > Close All",
                "zh-cn": "File > Close All",
                zh_TW: "\u6a94\u6848 > Close All",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_1005: {
            id: "menu_save",
            action: "save",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Save",
                de: "Datei > Speichern",
                ru: "\u0424\u0430\u0439\u043b > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c",
                "zh-cn": "\u6587\u4ef6>\u4fdd\u5b58\u2026",
                zh_TW: "\u6a94\u6848 > \u5132\u5b58\u2026",
            },
            hidden: false,
        },
        menu_1006: {
            id: "menu_saveas",
            action: "saveas",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Save As...",
                de: "Datei > Speichern unter \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043a\u0430\u043a...",
                "zh-cn": "\u6587\u4ef6>\u53e6\u5b58\u4e3a\u2026",
                zh_TW: "\u6a94\u6848 > \u53e6\u5b58\u65b0\u6a94\u2026",
            },
            hidden: false,
        },
        menu_1007: {
            id: "menu_saveacopy",
            action: "saveacopy",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Save a Copy...",
                de: "Datei > Kopie speichern \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043a\u043e\u043f\u0438\u044e...",
                "zh-cn": "\u6587\u4ef6>\u4fdd\u5b58\u526f\u672c\u2026",
                zh_TW: "\u6a94\u6848 > \u5132\u5b58\u526f\u672c\u2026",
            },
            hidden: false,
        },
        menu_1008: {
            id: "menu_saveastemplate",
            action: "saveastemplate",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Save as Template...",
                de: "Datei > Als Vorlage speichern \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043a\u0430\u043a \u0448\u0430\u0431\u043b\u043e\u043d...",
                "zh-cn": "\u6587\u4ef6>\u53e6\u5b58\u4e3a\u6a21\u677f\u2026",
                zh_TW: "\u6a94\u6848 > \u53e6\u5b58\u65b0\u6a94\u6a21\u677f\u2026",
            },
            hidden: false,
        },
        menu_1009: {
            id: "menu_Adobe_AI_Save_Selected_Slices",
            action: "Adobe AI Save Selected Slices",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "File > Save Selected Slices...",
                de: "Datei > Ausgew\u00e4hlte Slices speichern \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u0424\u0430\u0439\u043b > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0435 \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b...",
                "zh-cn":
                    "\u6587\u4ef6>\u4fdd\u5b58\u9009\u4e2d\u7684\u5207\u7247\u2026",
                zh_TW: "\u6a94\u6848 > \u5132\u5b58\u9078\u4e2d\u7684\u5207\u7247\u2026",
            },
            hidden: false,
        },
        menu_2070: {
            id: "menu_Adobe_Version_History_File_Menu_Item",
            action: "Adobe Version History File Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Version History",
                de: "Fenster > Versionsverlauf",
                ru: "\u041e\u043a\u043d\u043e > \u0416\u0443\u0440\u043d\u0430\u043b \u0432\u0435\u0440\u0441\u0438\u0439",
                "zh-cn": "Window > Version History",
                zh_TW: "\u8996\u7a97 > Version History",
            },
            hidden: false,
            minVersion: "30.5.0",
        },
        menu_1010: {
            id: "menu_revert",
            action: "revert",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Revert",
                de: "Datei > Zur\u00fcck zur letzten Version",
                ru: "\u0424\u0430\u0439\u043b > \u0412\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c",
                "zh-cn": "\u6587\u4ef6>\u8fd8\u539f\u2026",
                zh_TW: "\u6a94\u6848 > \u9084\u539f\u2026",
            },
            hidden: false,
        },
        menu_1011: {
            id: "menu_Search_Adobe_Stock",
            action: "Search Adobe Stock",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "File > Search Adobe Stock...",
                de: "Datei > Adobe Stock durchsuchen \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u041f\u043e\u0438\u0441\u043a \u0432 Adobe Stock...",
                "zh-cn": "\u6587\u4ef6>\u641c\u7d22Adobe Stock\u2026",
                zh_TW: "\u6a94\u6848 > \u641c\u7d22Adobe Stock\u2026",
            },
            hidden: false,
            minVersion: "19",
        },
        menu_1012: {
            id: "menu_AI_Place",
            action: "AI Place",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Place...",
                de: "Datei > Platzieren \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u041f\u043e\u043c\u0435\u0441\u0442\u0438\u0442\u044c...",
                "zh-cn": "\u6587\u4ef6>\u653e\u7f6e\u2026",
                zh_TW: "\u6a94\u6848 > \u653e\u7f6e\u2026",
            },
            hidden: false,
        },
        menu_2071: {
            id: "menu_Invite_People",
            action: "Invite People",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Invite to Edit...",
                de: "File > Invite to Edit...",
                ru: "File > Invite to Edit...",
                "zh-cn": "File > Invite to Edit...",
                zh_TW: "\u6a94\u6848 > Invite to Edit...",
            },
            hidden: false,
            minVersion: "27.0",
        },
        menu_2072: {
            id: "menu_Share_For_Review",
            action: "Share For Review",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Share for Review...",
                de: "File > Share for Review...",
                ru: "File > Share for Review...",
                "zh-cn": "File > Share for Review...",
                zh_TW: "\u6a94\u6848 > Share for Review...",
            },
            hidden: false,
            minVersion: "27.0",
        },
        menu_1013: {
            id: "menu_Generate_Modal_File_Menu_",
            action: "Generate Modal File Menu ",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Generate Vectors...",
                de: "File > Generate Vectors...",
                ru: "File > Generate Vectors...",
                "zh-cn": "\u6587\u4ef6>\u751f\u6210\u77e2\u91cf\u2026",
                zh_TW: "\u6a94\u6848 > \u751f\u6210\u77e2\u91cf\u2026",
            },
            hidden: false,
            minVersion: "28.6",
            maxVersion: "29.999",
        },
        menu_1014: {
            id: "menu_exportForScreens",
            action: "exportForScreens",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Export > Export for Screens...",
                de: "Datei > Exportieren > F\u00fcr Bildschirme exportieren \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u042d\u043a\u0441\u043f\u043e\u0440\u0442 \u0434\u043b\u044f \u044d\u043a\u0440\u0430\u043d\u043e\u0432...",
                "zh-cn": "\u6587\u4ef6>\u5bfc\u51fa>\u5c4f\u5e55\u5bfc\u51fa\u2026",
                zh_TW: "\u6a94\u6848 > \u5c0e\u51fa > \u5c4f\u5e55\u5c0e\u51fa\u2026",
            },
            hidden: false,
            minVersion: "20",
        },
        menu_1015: {
            id: "menu_export",
            action: "export",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Export > Export As...",
                de: "Datei > Exportieren \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u042d\u043a\u0441\u043f\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043a\u0430\u043a...",
                "zh-cn": "\u6587\u4ef6>\u5bfc\u51fa>\u5bfc\u51fa\u4e3a\u2026",
                zh_TW: "\u6a94\u6848 > \u5c0e\u51fa > \u5c0e\u51fa\u70ba\u2026",
            },
            hidden: false,
        },
        menu_1016: {
            id: "menu_Adobe_AI_Save_For_Web",
            action: "Adobe AI Save For Web",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Export > Save for Web (Legacy)...",
                de: "Datei > F\u00fcr Web speichern (Legacy) \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0434\u043b\u044f \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u043e\u0432...",
                "zh-cn":
                    "\u6587\u4ef6>\u5bfc\u51fa>\u5b58\u50a8\u4e3aWeb\u683c\u5f0f(\u65e7\u7248)\u2026",
                zh_TW: "\u6a94\u6848 > \u5c0e\u51fa > \u5b58\u5132\u70baWeb\u683c\u5f0f(\u820a\u7248)\u2026",
            },
            hidden: false,
        },
        menu_1017: {
            id: "menu_exportSelection",
            action: "exportSelection",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Export Selection...",
                de: "Datei > Auswahl exportieren \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u042d\u043a\u0441\u043f\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0435 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u044b...",
                "zh-cn": "\u6587\u4ef6>\u5bfc\u51fa\u9009\u62e9\u2026",
                zh_TW: "\u6a94\u6848 > \u5c0e\u51fa\u9078\u53d6\u2026",
            },
            hidden: false,
            minVersion: "20",
        },
        menu_1018: {
            id: "menu_Package_Menu_Item",
            action: "Package Menu Item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Package...",
                de: "Datei > Verpacken \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u0423\u043f\u0430\u043a\u043e\u0432\u0430\u0442\u044c...",
                "zh-cn": "\u6587\u4ef6>\u6253\u5305\u2026",
                zh_TW: "\u6a94\u6848 > \u6253\u5305\u2026",
            },
            hidden: false,
        },
        menu_1019: {
            id: "menu_ai_browse_for_script",
            action: "ai_browse_for_script",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "File > Scripts > Other Script...",
                de: "Datei > Skripten > Anderes Skript \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u0421\u0446\u0435\u043d\u0430\u0440\u0438\u0438 > \u0414\u0440\u0443\u0433\u043e\u0439 \u0441\u0446\u0435\u043d\u0430\u0440\u0438\u0439...",
                "zh-cn": "\u6587\u4ef6>\u811a\u672c>\u5176\u4ed6\u811a\u672c\u2026",
                zh_TW: "\u6a94\u6848 > \u8173\u672c > \u5176\u4ed6\u8173\u672c\u2026",
            },
            hidden: false,
        },
        menu_1021: {
            id: "menu_doc-color-cmyk",
            action: "doc-color-cmyk",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Document Color Mode > CMYK Color",
                de: "Datei > Dokumentfarbmodus > CMYK-Farbe",
                ru: "\u0424\u0430\u0439\u043b > \u0426\u0432\u0435\u0442\u043e\u0432\u043e\u0439 \u0440\u0435\u0436\u0438\u043c \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430 > CMYK",
                "zh-cn":
                    "\u6587\u4ef6>\u6587\u6863\u989c\u8272\u6a21\u5f0f> CMYK\u989c\u8272\u2026",
                zh_TW: "\u6a94\u6848 > \u6587\u6a94\u984f\u8272\u6a21\u5f0f > CMYK\u984f\u8272\u2026",
            },
            hidden: false,
        },
        menu_1022: {
            id: "menu_doc-color-rgb",
            action: "doc-color-rgb",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Document Color Mode > RGB Color",
                de: "Datei > Dokumentfarbmodus > RGB-Farbe",
                ru: "\u0424\u0430\u0439\u043b > \u0426\u0432\u0435\u0442\u043e\u0432\u043e\u0439 \u0440\u0435\u0436\u0438\u043c \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430 > RGB",
                "zh-cn":
                    "\u6587\u4ef6>\u6587\u6863\u989c\u8272\u6a21\u5f0f> RGB\u989c\u8272\u2026",
                zh_TW: "\u6a94\u6848 > \u6587\u6a94\u984f\u8272\u6a21\u5f0f > RGB\u984f\u8272\u2026",
            },
            hidden: false,
        },
        menu_1023: {
            id: "menu_File_Info",
            action: "File Info",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > File Info...",
                de: "Datei > Dateiinformationen \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u0421\u0432\u0435\u0434\u0435\u043d\u0438\u044f \u043e \u0444\u0430\u0439\u043b\u0435...",
                "zh-cn": "\u6587\u4ef6>\u6587\u4ef6\u4fe1\u606f\u2026",
                zh_TW: "\u6a94\u6848 > \u6a94\u6848\u4fe1\u606f\u2026",
            },
            hidden: false,
        },
        menu_1024: {
            id: "menu_Print",
            action: "Print",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "File > Print...",
                de: "Datei > Drucken \u2026",
                ru: "\u0424\u0430\u0439\u043b > \u041f\u0435\u0447\u0430\u0442\u044c...",
                "zh-cn": "\u6587\u4ef6>\u6253\u5370\u2026",
                zh_TW: "\u6a94\u6848 > \u6253\u5370\u2026",
            },
            hidden: false,
        },
        menu_1025: {
            id: "menu_quit",
            action: "quit",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "File > Exit",
                de: "Datei > Illustrator beenden",
                ru: "\u0424\u0430\u0439\u043b > \u0412\u044b\u0445\u043e\u0434",
                "zh-cn": "\u6587\u4ef6>\u9000\u51fa\u2026",
                zh_TW: "\u6a94\u6848 > \u9000\u51fa\u2026",
            },
            hidden: false,
        },
        menu_1026: {
            id: "menu_undo",
            action: "undo",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Edit > Undo",
                de: "Bearbeiten > R\u00fcckg\u00e4ngig",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
                "zh-cn": "\u7f16\u8f91>\u64a4\u9500\u2026",
                zh_TW: "\u7de8\u8f2f > \u64a4\u92b7\u2026",
            },
            hidden: false,
        },
        menu_1027: {
            id: "menu_redo",
            action: "redo",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Edit > Redo",
                de: "Bearbeiten > Wiederholen",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c",
                "zh-cn": "\u7f16\u8f91>\u91cd\u505a\u2026",
                zh_TW: "\u7de8\u8f2f > \u91cd\u505a\u2026",
            },
            hidden: false,
        },
        menu_1028: {
            id: "menu_cut",
            action: "cut",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Cut",
                de: "Bearbeiten > Ausschneiden",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0412\u044b\u0440\u0435\u0437\u0430\u0442\u044c",
                "zh-cn": "\u7f16\u8f91>\u526a\u5207\u2026",
                zh_TW: "\u7de8\u8f2f > \u526a\u5207\u2026",
            },
            hidden: false,
        },
        menu_1029: {
            id: "menu_copy",
            action: "copy",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Copy",
                de: "Bearbeiten > Kopieren",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
                "zh-cn": "\u7f16\u8f91>\u590d\u5236\u2026",
                zh_TW: "\u7de8\u8f2f > \u5fa9\u5236\u2026",
            },
            hidden: false,
        },
        menu_1030: {
            id: "menu_paste",
            action: "paste",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Edit > Paste",
                de: "Bearbeiten > Einf\u00fcgen",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c",
                "zh-cn": "\u7f16\u8f91>\u7c98\u8d34\u2026",
                zh_TW: "\u7de8\u8f2f > \u7c98\u8cbc\u2026",
            },
            hidden: false,
        },
        menu_1031: {
            id: "menu_pasteFront",
            action: "pasteFront",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Edit > Paste in Front",
                de: "Bearbeiten > Davor einf\u00fcgen",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u043f\u0435\u0440\u0435\u0434\u043d\u0438\u0439 \u043f\u043b\u0430\u043d",
                "zh-cn": "Edit > Paste in Front",
                zh_TW: "\u7de8\u8f2f > Paste in Front",
            },
            hidden: false,
        },
        menu_1032: {
            id: "menu_pasteBack",
            action: "pasteBack",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Edit > Paste in Back",
                de: "Bearbeiten > Dahinter einf\u00fcgen",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u0437\u0430\u0434\u043d\u0438\u0439 \u043f\u043b\u0430\u043d",
                "zh-cn": "Edit > Paste in Back",
                zh_TW: "\u7de8\u8f2f > Paste in Back",
            },
            hidden: false,
        },
        menu_1033: {
            id: "menu_pasteInPlace",
            action: "pasteInPlace",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Edit > Paste in Place",
                de: "Bearbeiten > An Originalposition einf\u00fcgen",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u0442\u043e \u0436\u0435 \u043c\u0435\u0441\u0442\u043e",
                "zh-cn": "Edit > Paste in Place",
                zh_TW: "\u7de8\u8f2f > Paste in Place",
            },
            hidden: false,
        },
        menu_1034: {
            id: "menu_pasteInAllArtboard",
            action: "pasteInAllArtboard",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Edit > Paste on All Artboards",
                de: "Bearbeiten > In alle Zeichenfl\u00e4chen einf\u00fcgen",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u0432\u0441\u0435 \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
                "zh-cn": "Edit > Paste on All Artboards",
                zh_TW: "\u7de8\u8f2f > Paste on All Artboards",
            },
            hidden: false,
        },
        menu_1035: {
            id: "menu_pasteWithoutFormatting",
            action: "pasteWithoutFormatting",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Edit > Paste without Formatting",
                de: "Bearbeiten > Ohne Formatierung einf\u00fcgen",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0431\u0435\u0437 \u0444\u043e\u0440\u043c\u0430\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f",
                "zh-cn": "Edit > Paste without Formatting",
                zh_TW: "\u7de8\u8f2f > Paste without Formatting",
            },
            hidden: false,
            minVersion: "25.3",
        },
        menu_1036: {
            id: "menu_clear",
            action: "clear",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Clear",
                de: "Bearbeiten > L\u00f6schen",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c",
                "zh-cn": "Edit > Clear",
                zh_TW: "\u7de8\u8f2f > Clear",
            },
            hidden: false,
        },
        menu_1037: {
            id: "menu_Find_and_Replace",
            action: "Find and Replace",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Edit > Find and Replace...",
                de: "Bearbeiten > Suchen und ersetzen \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041d\u0430\u0439\u0442\u0438 \u0438 \u0437\u0430\u043c\u0435\u043d\u0438\u0442\u044c...",
                "zh-cn": "Edit > Find and Replace...",
                zh_TW: "\u7de8\u8f2f > Find and Replace...",
            },
            hidden: false,
        },
        menu_1038: {
            id: "menu_Find_Next",
            action: "Find Next",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Edit > Find Next",
                de: "Bearbeiten > Weitersuchen",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041d\u0430\u0439\u0442\u0438 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439",
                "zh-cn": "Edit > Find Next",
                zh_TW: "\u7de8\u8f2f > Find Next",
            },
            hidden: false,
        },
        menu_1039: {
            id: "menu_Auto_Spell_Check",
            action: "Auto Spell Check",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Edit > Spelling > Auto Spell Check",
                de: "Bearbeiten > Rechtschreibung > Automatische Rechtschreibpr\u00fcfung",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041e\u0440\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u044f > \u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u043e\u0440\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u0438",
                "zh-cn": "Edit > Spelling > Auto Spell Check",
                zh_TW: "\u7de8\u8f2f > Spelling > Auto Spell Check",
            },
            hidden: false,
            minVersion: "24",
        },
        menu_1040: {
            id: "menu_Check_Spelling",
            action: "Check Spelling",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Edit > Spelling > Check Spelling...",
                de: "Bearbeiten > Rechtschreibung > Rechtschreibpr\u00fcfung \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041e\u0440\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u044f > \u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u043e\u0440\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u0438\u2026",
                "zh-cn": "Edit > Spelling > Check Spelling...",
                zh_TW: "\u7de8\u8f2f > Spelling > Check Spelling...",
            },
            hidden: false,
            minVersion: "24",
        },
        menu_1041: {
            id: "menu_Edit_Custom_Dictionary",
            action: "Edit Custom Dictionary...",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Edit > Edit Custom Dictionary...",
                de: "Bearbeiten > Eigenes W\u00f6rterbuch bearbeiten \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0437\u0430\u043a\u0430\u0437\u043d\u043e\u0439 \u0441\u043b\u043e\u0432\u0430\u0440\u044c...",
                "zh-cn": "Edit > Edit Custom Dictionary...",
                zh_TW: "\u7de8\u8f2f > Edit Custom Dictionary...",
            },
            hidden: false,
        },
        menu_1042: {
            id: "menu_Recolor_Art_Dialog",
            action: "Recolor Art Dialog",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Edit Colors > Recolor Artwork...",
                de: "Bearbeiten > Farben bearbeiten > Bildmaterial neu f\u00e4rben \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041f\u0435\u0440\u0435\u043a\u0440\u0430\u0441\u0438\u0442\u044c \u0433\u0440\u0430\u0444\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u043e\u0431\u044a\u0435\u043a\u0442...",
                "zh-cn": "Edit > Edit Colors > Recolor Artwork...",
                zh_TW: "\u7de8\u8f2f > Edit Colors > Recolor Artwork...",
            },
            hidden: false,
        },
        menu_1043: {
            id: "menu_Adjust3",
            action: "Adjust3",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Edit Colors > Adjust Color Balance...",
                de: "Bearbeiten > Farben bearbeiten > Farbbalance einstellen \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041a\u043e\u0440\u0440\u0435\u043a\u0446\u0438\u044f \u0446\u0432\u0435\u0442\u043e\u0432\u043e\u0433\u043e \u0431\u0430\u043b\u0430\u043d\u0441\u0430...",
                "zh-cn": "Edit > Edit Colors > Adjust Color Balance...",
                zh_TW: "\u7de8\u8f2f > Edit Colors > Adjust Color Balance...",
            },
            hidden: false,
        },
        menu_1044: {
            id: "menu_Colors3",
            action: "Colors3",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Edit Colors > Blend Front to Back",
                de: "Bearbeiten > Farben bearbeiten > Vorne -> Hinten angleichen",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043e\u0442 \u0432\u0435\u0440\u0445\u043d\u0435\u0433\u043e \u043a \u043d\u0438\u0436\u043d\u0435\u043c\u0443",
                "zh-cn": "Edit > Edit Colors > Blend Front to Back",
                zh_TW: "\u7de8\u8f2f > Edit Colors > Blend Front to Back",
            },
            hidden: false,
        },
        menu_1045: {
            id: "menu_Colors4",
            action: "Colors4",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Edit Colors > Blend Horizontally",
                de: "Bearbeiten > Farben bearbeiten > Horizontal angleichen",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043f\u043e \u0433\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u0438",
                "zh-cn": "Edit > Edit Colors > Blend Horizontally",
                zh_TW: "\u7de8\u8f2f > Edit Colors > Blend Horizontally",
            },
            hidden: false,
        },
        menu_1046: {
            id: "menu_Colors5",
            action: "Colors5",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Edit Colors > Blend Vertically",
                de: "Bearbeiten > Farben bearbeiten > Vertikal angleichen",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043f\u043e \u0432\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u0438",
                "zh-cn": "Edit > Edit Colors > Blend Vertically",
                zh_TW: "\u7de8\u8f2f > Edit Colors > Blend Vertically",
            },
            hidden: false,
        },
        menu_1047: {
            id: "menu_Colors8",
            action: "Colors8",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Edit Colors > Convert to CMYK",
                de: "Bearbeiten > Farben bearbeiten > In CMYK konvertieren",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 CMYK",
                "zh-cn": "Edit > Edit Colors > Convert to CMYK",
                zh_TW: "\u7de8\u8f2f > Edit Colors > Convert to CMYK",
            },
            hidden: false,
        },
        menu_1048: {
            id: "menu_Colors7",
            action: "Colors7",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Edit Colors > Convert to Grayscale",
                de: "Bearbeiten > Farben bearbeiten > In Graustufen konvertieren",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 \u0433\u0440\u0430\u0434\u0430\u0446\u0438\u0438 \u0441\u0435\u0440\u043e\u0433\u043e",
                "zh-cn": "Edit > Edit Colors > Convert to Grayscale",
                zh_TW: "\u7de8\u8f2f > Edit Colors > Convert to Grayscale",
            },
            hidden: false,
        },
        menu_1049: {
            id: "menu_Colors9",
            action: "Colors9",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Edit Colors > Convert to RGB",
                de: "Bearbeiten > Farben bearbeiten > In RGB konvertieren",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 RGB",
                "zh-cn": "Edit > Edit Colors > Convert to RGB",
                zh_TW: "\u7de8\u8f2f > Edit Colors > Convert to RGB",
            },
            hidden: false,
        },
        menu_1050: {
            id: "menu_Generative_Recolor_Art_Dialog",
            action: "Generative Recolor Art Dialog",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Edit Colors > Generative Recolor",
                de: "Bearbeiten > Farben bearbeiten > Generative Neuf\u00e4rbung",
                ru: "Edit > Edit Colors > Generative Recolor",
                "zh-cn": "Edit > Edit Colors > Generative Recolor",
                zh_TW: "\u7de8\u8f2f > Edit Colors > Generative Recolor",
            },
            hidden: false,
            minVersion: "27.6",
        },
        menu_1051: {
            id: "menu_Colors6",
            action: "Colors6",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Edit Colors > Invert Colors",
                de: "Bearbeiten > Farben bearbeiten > Farben invertieren",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041d\u0435\u0433\u0430\u0442\u0438\u0432",
                "zh-cn": "Edit > Edit Colors > Invert Colors",
                zh_TW: "\u7de8\u8f2f > Edit Colors > Invert Colors",
            },
            hidden: false,
        },
        menu_1052: {
            id: "menu_Overprint2",
            action: "Overprint2",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Edit Colors > Overprint Black...",
                de: "Bearbeiten > Farben bearbeiten > Schwarz \u00fcberdrucken \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041d\u0430\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0447\u0435\u0440\u043d\u043e\u0433\u043e \u0446\u0432\u0435\u0442\u0430...",
                "zh-cn": "Edit > Edit Colors > Overprint Black...",
                zh_TW: "\u7de8\u8f2f > Edit Colors > Overprint Black...",
            },
            hidden: false,
        },
        menu_1053: {
            id: "menu_Saturate3",
            action: "Saturate3",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Edit Colors > Saturate...",
                de: "Bearbeiten > Farben bearbeiten > S\u00e4ttigung erh\u00f6hen \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u043d\u0430\u0441\u044b\u0449\u0435\u043d\u043d\u043e\u0441\u0442\u044c...",
                "zh-cn": "Edit > Edit Colors > Saturate...",
                zh_TW: "\u7de8\u8f2f > Edit Colors > Saturate...",
            },
            hidden: false,
        },
        menu_1054: {
            id: "menu_EditOriginal_Menu_Item",
            action: "EditOriginal Menu Item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Edit Original",
                de: "Bearbeiten > Original bearbeiten",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b",
                "zh-cn": "Edit > Edit Original",
                zh_TW: "\u7de8\u8f2f > Edit Original",
            },
            hidden: false,
        },
        menu_2079: {
            id: "menu_EditGeneratedObjectEditMenu",
            action: "EditGeneratedObjectEditMenu",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Edit > Prompt to edit",
                de: "Edit > Prompt to edit",
                ru: "Edit > Prompt to edit",
                "zh-cn": "Edit > Prompt to edit",
                zh_TW: "\u7de8\u8f2f > Prompt to edit",
            },
            hidden: false,
            minVersion: "30.5",
        },
        menu_1055: {
            id: "menu_Transparency_Presets",
            action: "Transparency Presets",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Edit > Transparency Flattener Presets...",
                de: "Bearbeiten > Transparenzreduzierungsvorgaben \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0421\u0442\u0438\u043b\u0438 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u0438...",
                "zh-cn": "Edit > Transparency Flattener Presets...",
                zh_TW: "\u7de8\u8f2f > Transparency Flattener Presets...",
            },
            hidden: false,
        },
        menu_1056: {
            id: "menu_Print_Presets",
            action: "Print Presets",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Edit > Print Presets...",
                de: "Bearbeiten > Druckvorgaben \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0421\u0442\u0438\u043b\u0438 \u043f\u0435\u0447\u0430\u0442\u0438...",
                "zh-cn": "Edit > Print Presets...",
                zh_TW: "\u7de8\u8f2f > Print Presets...",
            },
            hidden: false,
        },
        menu_1057: {
            id: "menu_PDF_Presets",
            action: "PDF Presets",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Edit > Adobe PDF Presets...",
                de: "Bearbeiten > Adobe PDF-Vorgaben \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0421\u0442\u0438\u043b\u0438 \u043f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u044f \u0432 Adobe PDF...",
                "zh-cn": "Edit > Adobe PDF Presets...",
                zh_TW: "\u7de8\u8f2f > Adobe PDF Presets...",
            },
            hidden: false,
        },
        menu_1058: {
            id: "menu_PerspectiveGridPresets",
            action: "PerspectiveGridPresets",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Edit > Perspective Grid Presets...",
                de: "Bearbeiten > Vorgaben f\u00fcr Perspektivenraster \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0421\u0442\u0438\u043b\u0438 \u0441\u0435\u0442\u043a\u0438 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b...",
                "zh-cn": "Edit > Perspective Grid Presets...",
                zh_TW: "\u7de8\u8f2f > Perspective Grid Presets...",
            },
            hidden: false,
        },
        menu_1059: {
            id: "menu_color",
            action: "color",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Edit > Color Settings...",
                de: "Bearbeiten > Farbeinstellungen \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430 \u0446\u0432\u0435\u0442\u043e\u0432...",
                "zh-cn": "Edit > Color Settings...",
                zh_TW: "\u7de8\u8f2f > Color Settings...",
            },
            hidden: false,
        },
        menu_1060: {
            id: "menu_assignprofile",
            action: "assignprofile",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Edit > Assign Profile...",
                de: "Bearbeiten > Profil zuweisen \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041d\u0430\u0437\u043d\u0430\u0447\u0438\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c...",
                "zh-cn": "Edit > Assign Profile...",
                zh_TW: "\u7de8\u8f2f > Assign Profile...",
            },
            hidden: false,
        },
        menu_1061: {
            id: "menu_KBSC_Menu_Item",
            action: "KBSC Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Edit > Keyboard Shortcuts...",
                de: "Bearbeiten > Tastaturbefehle \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041a\u043e\u043c\u0431\u0438\u043d\u0430\u0446\u0438\u0438 \u043a\u043b\u0430\u0432\u0438\u0448...",
                "zh-cn": "Edit > Keyboard Shortcuts...",
                zh_TW: "\u7de8\u8f2f > Keyboard Shortcuts...",
            },
            hidden: false,
        },
        menu_1062: {
            id: "menu_SWFPresets",
            action: "SWFPresets",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Edit > SWF Presets...",
                de: "Bearbeiten > SWF-Vorgaben \u2026",
                ru: "Edit > SWF Presets...",
                "zh-cn": "Edit > SWF Presets...",
                zh_TW: "\u7de8\u8f2f > SWF Presets...",
            },
            hidden: false,
            minVersion: "22",
            maxVersion: "25.9",
        },
        menu_1064: {
            id: "menu_transformagain",
            action: "transformagain",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Transform > Transform Again",
                de: "Objekt > Transformieren > Erneut transformieren",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435",
                "zh-cn": "Object > Transform > Transform Again",
                zh_TW: "\u7269\u4ef6 > Transform > Transform Again",
            },
            hidden: false,
        },
        menu_1065: {
            id: "menu_transformmove",
            action: "transformmove",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Transform > Move...",
                de: "Objekt > Transformieren > Verschieben \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041f\u0435\u0440\u0435\u043c\u0435\u0449\u0435\u043d\u0438\u0435...",
                "zh-cn": "Object > Transform > Move...",
                zh_TW: "\u7269\u4ef6 > Transform > Move...",
            },
            hidden: false,
        },
        menu_1066: {
            id: "menu_transformrotate",
            action: "transformrotate",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Transform > Rotate...",
                de: "Objekt > Transformieren > Drehen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041f\u043e\u0432\u043e\u0440\u043e\u0442...",
                "zh-cn": "Object > Transform > Rotate...",
                zh_TW: "\u7269\u4ef6 > Transform > Rotate...",
            },
            hidden: false,
        },
        menu_1067: {
            id: "menu_transformreflect",
            action: "transformreflect",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Transform > Reflect...",
                de: "Objekt > Transformieren > Spiegeln \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u043e\u0435 \u043e\u0442\u0440\u0430\u0436\u0435\u043d\u0438\u0435...",
                "zh-cn": "Object > Transform > Reflect...",
                zh_TW: "\u7269\u4ef6 > Transform > Reflect...",
            },
            hidden: false,
        },
        menu_1068: {
            id: "menu_transformscale",
            action: "transformscale",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Transform > Scale...",
                de: "Objekt > Transformieren > Skalieren \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041c\u0430\u0441\u0448\u0442\u0430\u0431\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435...",
                "zh-cn": "Object > Transform > Scale...",
                zh_TW: "\u7269\u4ef6 > Transform > Scale...",
            },
            hidden: false,
        },
        menu_1069: {
            id: "menu_transformshear",
            action: "transformshear",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Transform > Shear...",
                de: "Objekt > Transformieren > Verbiegen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041d\u0430\u043a\u043b\u043e\u043d...",
                "zh-cn": "Object > Transform > Shear...",
                zh_TW: "\u7269\u4ef6 > Transform > Shear...",
            },
            hidden: false,
        },
        menu_1070: {
            id: "menu_Transform_v23",
            action: "Transform v23",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Transform > Transform Each...",
                de: "Objekt > Transformieren > Einzeln transformieren \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043a\u0430\u0436\u0434\u044b\u0439...",
                "zh-cn": "Object > Transform > Transform Each...",
                zh_TW: "\u7269\u4ef6 > Transform > Transform Each...",
            },
            hidden: false,
        },
        menu_1071: {
            id: "menu_AI_Reset_Bounding_Box",
            action: "AI Reset Bounding Box",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Transform > Reset Bounding Box",
                de: "Objekt > Transform > Begrenzungsrahmen zur\u00fccksetzen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u0412\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0439 \u0440\u0430\u043c\u043a\u0438",
                "zh-cn": "Object > Transform > Reset Bounding Box",
                zh_TW: "\u7269\u4ef6 > Transform > Reset Bounding Box",
            },
            hidden: false,
        },
        menu_1072: {
            id: "menu_sendToFront",
            action: "sendToFront",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Arrange > Bring to Front",
                de: "Objekt > Anordnen > In den Vordergrund",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436 > \u041d\u0430 \u043f\u0435\u0440\u0435\u0434\u043d\u0438\u0439 \u043f\u043b\u0430\u043d",
                "zh-cn": "Object > Arrange > Bring to Front",
                zh_TW: "\u7269\u4ef6 > Arrange > Bring to Front",
            },
            hidden: false,
        },
        menu_1073: {
            id: "menu_sendForward",
            action: "sendForward",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Arrange > Bring Forward",
                de: "Objekt > Anordnen > Schrittweise nach vorne",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436 > \u041d\u0430 \u0437\u0430\u0434\u043d\u0438\u0439 \u043f\u043b\u0430\u043d",
                "zh-cn": "Object > Arrange > Bring Forward",
                zh_TW: "\u7269\u4ef6 > Arrange > Bring Forward",
            },
            hidden: false,
        },
        menu_1074: {
            id: "menu_sendBackward",
            action: "sendBackward",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Arrange > Send Backward",
                de: "Objekt > Anordnen > Schrittweise nach hinten",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436 > \u041f\u0435\u0440\u0435\u043b\u043e\u0436\u0438\u0442\u044c \u0432\u043f\u0435\u0440\u0435\u0434",
                "zh-cn": "Object > Arrange > Send Backward",
                zh_TW: "\u7269\u4ef6 > Arrange > Send Backward",
            },
            hidden: false,
        },
        menu_1075: {
            id: "menu_sendToBack",
            action: "sendToBack",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Arrange > Send to Back",
                de: "Objekt > Anordnen > In den Hintergrund",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436 > \u041f\u0435\u0440\u0435\u043b\u043e\u0436\u0438\u0442\u044c \u043d\u0430\u0437\u0430\u0434",
                "zh-cn": "Object > Arrange > Send to Back",
                zh_TW: "\u7269\u4ef6 > Arrange > Send to Back",
            },
            hidden: false,
        },
        menu_1076: {
            id: "menu_Selection_Hat_2",
            action: "Selection Hat 2",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Arrange > Send to Current Layer",
                de: "Objekt > Anordnen > In aktuelle Ebene verschieben",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436 > \u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u0442\u0435\u043a\u0443\u0449\u0438\u0439 \u0441\u043b\u043e\u0439",
                "zh-cn": "Object > Arrange > Send to Current Layer",
                zh_TW: "\u7269\u4ef6 > Arrange > Send to Current Layer",
            },
            hidden: false,
        },
        menu_1077: {
            id: "menu_Horizontal_Align_Left",
            action: "Horizontal Align Left",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Align > Horizontal Align Left",
                de: "Objekt > Ausrichten > Horizontal links ausrichten",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435 > \u0413\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435, \u0432\u043b\u0435\u0432\u043e",
                "zh-cn": "Object > Align > Horizontal Align Left",
                zh_TW: "\u7269\u4ef6 > Align > Horizontal Align Left",
            },
            hidden: false,
            minVersion: "24",
        },
        menu_1078: {
            id: "menu_Horizontal_Align_Center",
            action: "Horizontal Align Center",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Align > Horizontal Align Center",
                de: "Objekt > Ausrichten > Horizontal zentriert ausrichten",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435 > \u0413\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435, \u0446\u0435\u043d\u0442\u0440",
                "zh-cn": "Object > Align > Horizontal Align Center",
                zh_TW: "\u7269\u4ef6 > Align > Horizontal Align Center",
            },
            hidden: false,
            minVersion: "24",
        },
        menu_1079: {
            id: "menu_Horizontal_Align_Right",
            action: "Horizontal Align Right",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Align > Horizontal Align Right",
                de: "Objekt > Ausrichten > Horizontal rechts ausrichten",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435 > \u0413\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435, \u0432\u043f\u0440\u0430\u0432\u043e",
                "zh-cn": "Object > Align > Horizontal Align Right",
                zh_TW: "\u7269\u4ef6 > Align > Horizontal Align Right",
            },
            hidden: false,
            minVersion: "24",
        },
        menu_2083: {
            id: "menu_Horizontal_&&_Vertical_Align_Center",
            action: "Horizontal && Vertical Align Center",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Horizontal & Vertical Align Center",
                de: "Horizontal & Vertical Align Center",
                ru: "Horizontal & Vertical Align Center",
                "zh-cn": "Horizontal & Vertical Align Center",
                zh_TW: "Horizontal & Vertical Align Center",
            },
            hidden: false,
            minVersion: "30.5.0",
        },
        menu_1080: {
            id: "menu_Vertical_Align_Top",
            action: "Vertical Align Top",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Align > Vertical Align Top",
                de: "Objekt > Ausrichten > Vertikal oben ausrichten",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435 > \u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435, \u0432\u0432\u0435\u0440\u0445",
                "zh-cn": "Object > Align > Vertical Align Top",
                zh_TW: "\u7269\u4ef6 > Align > Vertical Align Top",
            },
            hidden: false,
            minVersion: "24",
        },
        menu_1081: {
            id: "menu_Vertical_Align_Center",
            action: "Vertical Align Center",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Align > Vertical Align Center",
                de: "Objekt > Ausrichten > Vertikal zentriert ausrichten",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435 > \u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435, \u0446\u0435\u043d\u0442\u0440",
                "zh-cn": "Object > Align > Vertical Align Center",
                zh_TW: "\u7269\u4ef6 > Align > Vertical Align Center",
            },
            hidden: false,
            minVersion: "24",
        },
        menu_1082: {
            id: "menu_Vertical_Align_Bottom",
            action: "Vertical Align Bottom",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Align > Vertical Align Bottom",
                de: "Objekt > Ausrichten > Vertikal unten ausrichten",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435 > \u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435, \u0432\u043d\u0438\u0437",
                "zh-cn": "Object > Align > Vertical Align Bottom",
                zh_TW: "\u7269\u4ef6 > Align > Vertical Align Bottom",
            },
            hidden: false,
            minVersion: "24",
        },
        menu_2170: {
            id: "menu_Align_To_Selection",
            action: "Align To Selection",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Align > Align To Selection",
                de: "Object > Align > Align To Selection",
                ru: "Object > Align > Align To Selection",
                "zh-cn": "Object > Align > Align To Selection",
                zh_TW: "\u7269\u4ef6 > Align > Align To Selection",
            },
            hidden: false,
            minVersion: "30.6",
        },
        menu_2171: {
            id: "menu_Align_To_Key_Object",
            action: "Align To Key Object",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Align > Align To Key Object",
                de: "Object > Align > Align To Key Object",
                ru: "Object > Align > Align To Key Object",
                "zh-cn": "Object > Align > Align To Key Object",
                zh_TW: "\u7269\u4ef6 > Align > Align To Key Object",
            },
            hidden: false,
            minVersion: "30.6",
        },
        menu_2172: {
            id: "menu_Align_To_Artboard",
            action: "Align To Artboard",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Align > Align To Artboard",
                de: "Object > Align > Align To Artboard",
                ru: "Object > Align > Align To Artboard",
                "zh-cn": "Object > Align > Align To Artboard",
                zh_TW: "\u7269\u4ef6 > Align > Align To Artboard",
            },
            hidden: false,
            minVersion: "30.6",
        },
        menu_1083: {
            id: "menu_Vertical_Distribute_Top",
            action: "Vertical Distribute Top",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Distribute > Vertical Distribute Top",
                de: "Object > Distribute > Vertical Distribute Top",
                ru: "Object > Distribute > Vertical Distribute Top",
                "zh-cn": "Object > Distribute > Vertical Distribute Top",
                zh_TW: "\u7269\u4ef6 > Distribute > Vertical Distribute Top",
            },
            hidden: false,
            minVersion: "27",
        },
        menu_1084: {
            id: "menu_Vertical_Distribute_Center",
            action: "Vertical Distribute Center",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Distribute > Vertical Distribute Center",
                de: "Object > Distribute > Vertical Distribute Center",
                ru: "Object > Distribute > Vertical Distribute Center",
                "zh-cn": "Object > Distribute > Vertical Distribute Center",
                zh_TW: "\u7269\u4ef6 > Distribute > Vertical Distribute Center",
            },
            hidden: false,
            minVersion: "27",
        },
        menu_1085: {
            id: "menu_Vertical_Distribute_Bottom",
            action: "Vertical Distribute Bottom",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Distribute > Vertical Distribute Bottom",
                de: "Object > Distribute > Vertical Distribute Bottom",
                ru: "Object > Distribute > Vertical Distribute Bottom",
                "zh-cn": "Object > Distribute > Vertical Distribute Bottom",
                zh_TW: "\u7269\u4ef6 > Distribute > Vertical Distribute Bottom",
            },
            hidden: false,
            minVersion: "27",
        },
        menu_1086: {
            id: "menu_Horizontal_Distribute_Left",
            action: "Horizontal Distribute Left",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Distribute > Horizontal Distribute Left",
                de: "Object > Distribute > Horizontal Distribute Left",
                ru: "Object > Distribute > Horizontal Distribute Left",
                "zh-cn": "Object > Distribute > Horizontal Distribute Left",
                zh_TW: "\u7269\u4ef6 > Distribute > Horizontal Distribute Left",
            },
            hidden: false,
            minVersion: "27",
        },
        menu_1087: {
            id: "menu_Horizontal_Distribute_Center",
            action: "Horizontal Distribute Center",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Distribute > Horizontal Distribute Center",
                de: "Object > Distribute > Horizontal Distribute Center",
                ru: "Object > Distribute > Horizontal Distribute Center",
                "zh-cn": "Object > Distribute > Horizontal Distribute Center",
                zh_TW: "\u7269\u4ef6 > Distribute > Horizontal Distribute Center",
            },
            hidden: false,
            minVersion: "27",
        },
        menu_1088: {
            id: "menu_Horizontal_Distribute_Right",
            action: "Horizontal Distribute Right",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Distribute > Horizontal Distribute Right",
                de: "Object > Distribute > Horizontal Distribute Right",
                ru: "Object > Distribute > Horizontal Distribute Right",
                "zh-cn": "Object > Distribute > Horizontal Distribute Right",
                zh_TW: "\u7269\u4ef6 > Distribute > Horizontal Distribute Right",
            },
            hidden: false,
            minVersion: "27",
        },
        menu_2173: {
            id: "menu_Vertical_Distribute_Space",
            action: "Vertical Distribute Space",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Distribute > Vertical Distribute Space",
                de: "Object > Distribute > Vertical Distribute Space",
                ru: "Object > Distribute > Vertical Distribute Space",
                "zh-cn": "Object > Distribute > Vertical Distribute Space",
                zh_TW: "\u7269\u4ef6 > Distribute > Vertical Distribute Space",
            },
            hidden: false,
            minVersion: "30.6",
        },
        menu_2174: {
            id: "menu_Horizontal_Distribute_Space",
            action: "Horizontal Distribute Space",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Distribute > Horizontal Distribute Space",
                de: "Object > Distribute > Horizontal Distribute Space",
                ru: "Object > Distribute > Horizontal Distribute Space",
                "zh-cn": "Object > Distribute > Horizontal Distribute Space",
                zh_TW: "\u7269\u4ef6 > Distribute > Horizontal Distribute Space",
            },
            hidden: false,
            minVersion: "30.6",
        },
        menu_1089: {
            id: "menu_group",
            action: "group",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Group",
                de: "Objekt > Gruppieren",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u0433\u0440\u0443\u043f\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
                "zh-cn": "Object > Group",
                zh_TW: "\u7269\u4ef6 > Group",
            },
            hidden: false,
        },
        menu_1090: {
            id: "menu_ungroup",
            action: "ungroup",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Ungroup",
                de: "Objekt > Gruppierung aufheben",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0420\u0430\u0437\u0433\u0440\u0443\u043f\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
                "zh-cn": "Object > Ungroup",
                zh_TW: "\u7269\u4ef6 > Ungroup",
            },
            hidden: false,
        },
        menu_1091: {
            id: "menu_ungroup_all",
            action: "ungroup all",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Ungroup All",
                de: "Object > Ungroup All",
                ru: "Object > Ungroup All",
                "zh-cn": "Object > Ungroup All",
                zh_TW: "\u7269\u4ef6 > Ungroup All",
            },
            hidden: false,
            minVersion: "29.3",
        },
        menu_1092: {
            id: "menu_lock",
            action: "lock",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Lock > Selection",
                de: "Objekt > Sperren > Auswahl",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c > \u0412\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u043e\u0435",
                "zh-cn": "Object > Lock > Selection",
                zh_TW: "\u7269\u4ef6 > Lock > Selection",
            },
            hidden: false,
        },
        menu_1093: {
            id: "menu_Selection_Hat_5",
            action: "Selection Hat 5",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Lock > All Artwork Above",
                de: "Objekt > Sperren > S\u00e4mtliches Bildmaterial dar\u00fcber",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c > \u0412\u0441\u0435 \u043e\u0431\u044a\u0435\u043a\u0442\u044b \u0432\u044b\u0448\u0435",
                "zh-cn": "Object > Lock > All Artwork Above",
                zh_TW: "\u7269\u4ef6 > Lock > All Artwork Above",
            },
            hidden: false,
        },
        menu_1094: {
            id: "menu_Selection_Hat_7",
            action: "Selection Hat 7",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Lock > Other Layers",
                de: "Objekt > Sperren > Andere Ebenen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c > \u041e\u0441\u0442\u0430\u043b\u044c\u043d\u044b\u0435 \u0441\u043b\u043e\u0438",
                "zh-cn": "Object > Lock > Other Layers",
                zh_TW: "\u7269\u4ef6 > Lock > Other Layers",
            },
            hidden: false,
        },
        menu_1095: {
            id: "menu_unlockAll",
            action: "unlockAll",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Unlock All",
                de: "Objekt > Alle entsperren",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0441\u0432\u043e\u0431\u043e\u0434\u0438\u0442\u044c \u0432\u0441\u0435",
                "zh-cn": "Object > Unlock All",
                zh_TW: "\u7269\u4ef6 > Unlock All",
            },
            hidden: false,
        },
        menu_1096: {
            id: "menu_hide",
            action: "hide",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Hide > Selection",
                de: "Objekt > Ausblenden > Auswahl",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043a\u0440\u044b\u0442\u044c > \u0412\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u043e\u0435",
                "zh-cn": "Object > Hide > Selection",
                zh_TW: "\u7269\u4ef6 > Hide > Selection",
            },
            hidden: false,
        },
        menu_1097: {
            id: "menu_Selection_Hat_4",
            action: "Selection Hat 4",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Hide > All Artwork Above",
                de: "Objekt > Ausblenden > S\u00e4mtliches Bildmaterial dar\u00fcber",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043a\u0440\u044b\u0442\u044c > \u0412\u0441\u0435 \u043e\u0431\u044a\u0435\u043a\u0442\u044b \u0432\u044b\u0448\u0435",
                "zh-cn": "Object > Hide > All Artwork Above",
                zh_TW: "\u7269\u4ef6 > Hide > All Artwork Above",
            },
            hidden: false,
        },
        menu_1098: {
            id: "menu_Selection_Hat_6",
            action: "Selection Hat 6",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Hide > Other Layers",
                de: "Objekt > Ausblenden > Andere Ebenen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043a\u0440\u044b\u0442\u044c > \u041e\u0441\u0442\u0430\u043b\u044c\u043d\u044b\u0435 \u0441\u043b\u043e\u0438",
                "zh-cn": "Object > Hide > Other Layers",
                zh_TW: "\u7269\u4ef6 > Hide > Other Layers",
            },
            hidden: false,
        },
        menu_1099: {
            id: "menu_showAll",
            action: "showAll",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Show All",
                de: "Objekt > Alles einblenden",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0432\u0441\u0435",
                "zh-cn": "Object > Show All",
                zh_TW: "\u7269\u4ef6 > Show All",
            },
            hidden: false,
        },
        menu_2085: {
            id: "menu_Remove_Background_Object_Menu",
            action: "Remove Background Object Menu",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Remove Background",
                de: "Object > Remove Background",
                ru: "Object > Remove Background",
                "zh-cn": "Object > Remove Background",
                zh_TW: "\u7269\u4ef6 > Remove Background",
            },
            hidden: false,
            minVersion: "30.4",
        },
        menu_1100: {
            id: "menu_Crop_Image",
            action: "Crop Image",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Crop Image",
                de: "Objekt > Bild zuschneiden",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0440\u0435\u0437\u0430\u0442\u044c \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435",
                "zh-cn": "Object > Crop Image",
                zh_TW: "\u7269\u4ef6 > Crop Image",
            },
            hidden: false,
            minVersion: "23",
        },
        menu_1101: {
            id: "menu_Rasterize_8_menu_item",
            action: "Rasterize 8 menu item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Rasterize...",
                de: "Objekt > In Pixelbild umwandeln \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0420\u0430\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c...",
                "zh-cn": "Object > Rasterize...",
                zh_TW: "\u7269\u4ef6 > Rasterize...",
            },
            hidden: false,
        },
        menu_1102: {
            id: "menu_make_mesh",
            action: "make mesh",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Create Gradient Mesh...",
                de: "Objekt > Verlaufsgitter erstellen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0441\u0435\u0442\u0447\u0430\u0442\u044b\u0439 \u0433\u0440\u0430\u0434\u0438\u0435\u043d\u0442...",
                "zh-cn": "Object > Create Gradient Mesh...",
                zh_TW: "\u7269\u4ef6 > Create Gradient Mesh...",
            },
            hidden: false,
        },
        menu_1103: {
            id: "menu_AI_Object_Mosaic_Plug-in4",
            action: "AI Object Mosaic Plug-in4",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Create Object Mosaic...",
                de: "Objekt > Objektmosaik erstellen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044e...",
                "zh-cn": "Object > Create Object Mosaic...",
                zh_TW: "\u7269\u4ef6 > Create Object Mosaic...",
            },
            hidden: false,
        },
        menu_1104: {
            id: "menu_TrimMark_v25",
            action: "TrimMark v25",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Create Trim Marks",
                de: "Objekt > Schnittmarken erstellen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043c\u0435\u0442\u043a\u0438 \u043e\u0431\u0440\u0435\u0437\u0430",
                "zh-cn": "Object > Create Trim Marks",
                zh_TW: "\u7269\u4ef6 > Create Trim Marks",
            },
            hidden: false,
        },
        menu_1105: {
            id: "menu_Flatten_Transparency",
            action: "Flatten Transparency",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Flatten Transparency...",
                de: "Objekt > Transparenz reduzieren \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u0438...",
                "zh-cn": "Object > Flatten Transparency...",
                zh_TW: "\u7269\u4ef6 > Flatten Transparency...",
            },
            hidden: false,
        },
        menu_1106: {
            id: "menu_Make_Pixel_Perfect",
            action: "Make Pixel Perfect",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Make Pixel Perfect",
                de: "Objekt > Pixelgenaue Darstellung anwenden",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u0440\u0440\u0435\u043a\u0446\u0438\u044f \u043d\u0430 \u0443\u0440\u043e\u0432\u043d\u0435 \u043f\u0438\u043a\u0441\u0435\u043b\u043e\u0432",
                "zh-cn": "Object > Make Pixel Perfect",
                zh_TW: "\u7269\u4ef6 > Make Pixel Perfect",
            },
            hidden: false,
        },
        menu_1107: {
            id: "menu_GenAIConsolidatedGenerateVectors",
            action: "GenAIConsolidatedGenerateVectors",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Generative > Generate Vectors...",
                de: "Object > Generative > Generate Vectors...",
                ru: "Object > Generative > Generate Vectors...",
                "zh-cn": "Object > Generative > Generate Vectors...",
                zh_TW: "\u7269\u4ef6 > Generative > Generate Vectors...",
            },
            hidden: false,
            minVersion: "30.0",
        },
        menu_1108: {
            id: "menu_GenAIConsolidatedShapeFill",
            action: "GenAIConsolidatedShapeFill",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Generative > Generative Shape Fill...",
                de: "Object > Generative > Generative Shape Fill...",
                ru: "Object > Generative > Generative Shape Fill...",
                "zh-cn": "Object > Generative > Generative Shape Fill...",
                zh_TW: "\u7269\u4ef6 > Generative > Generative Shape Fill...",
            },
            hidden: false,
            minVersion: "30.0",
        },
        menu_2086: {
            id: "menu_SketchToVectorUnified",
            action: "SketchToVectorUnified",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Generative > Concept to Vector",
                de: "Object > Generative > Concept to Vector",
                ru: "Object > Generative > Concept to Vector",
                "zh-cn": "Object > Generative > Concept to Vector",
                zh_TW: "\u7269\u4ef6 > Generative > Concept to Vector",
            },
            hidden: false,
            minVersion: "30.5.0",
        },
        menu_2087: {
            id: "menu_GenAIConsolidatedTurntable",
            action: "GenAIConsolidatedTurntable",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Generative > Turntable",
                de: "Object > Generative > Turntable",
                ru: "Object > Generative > Turntable",
                "zh-cn": "Object > Generative > Turntable",
                zh_TW: "\u7269\u4ef6 > Generative > Turntable",
            },
            hidden: false,
            minVersion: "30.3",
        },
        menu_2088: {
            id: "menu_GenerateTextTypeMenu",
            action: "GenerateTextTypeMenu",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Generative > Text > Rewrite...",
                de: "Object > Generative > Text > Rewrite...",
                ru: "Object > Generative > Text > Rewrite...",
                "zh-cn": "Object > Generative > Text > Rewrite...",
                zh_TW: "\u7269\u4ef6 > Generative > Text > Rewrite...",
            },
            hidden: false,
            minVersion: "30.5.0",
            maxVersion: "30.5.999",
        },
        menu_2180: {
            id: "menu_GenAIConsolidatedGenerateTextGenerate",
            action: "GenAIConsolidatedGenerateTextGenerate",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Generative > Rewrite > Generate Text...",
                de: "Object > Generative > Rewrite > Generate Text...",
                ru: "Object > Generative > Rewrite > Generate Text...",
                "zh-cn": "Object > Generative > Rewrite > Generate Text...",
                zh_TW: "\u7269\u4ef6 > Generative > Rewrite > Generate Text...",
            },
            hidden: false,
            minVersion: "30.6",
        },
        menu_2091: {
            id: "menu_GenAIConsolidatedGenerateTextRephraseToFit",
            action: "GenAIConsolidatedGenerateTextRephraseToFit",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Generative > Rewrite > Fit text",
                de: "Object > Generative > Rewrite > Fit text",
                ru: "Object > Generative > Rewrite > Fit text",
                "zh-cn": "Object > Generative > Rewrite > Fit text",
                zh_TW: "\u7269\u4ef6 > Generative > Rewrite > Fit text",
            },
            hidden: false,
            minVersion: "30.5.0",
        },
        menu_2090: {
            id: "menu_GenAIConsolidatedGenerateTextProofread",
            action: "GenAIConsolidatedGenerateTextProofread",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Generative > Rewrite > Proofread",
                de: "Object > Generative > Rewrite > Proofread",
                ru: "Object > Generative > Rewrite > Proofread",
                "zh-cn": "Object > Generative > Rewrite > Proofread",
                zh_TW: "\u7269\u4ef6 > Generative > Rewrite > Proofread",
            },
            hidden: false,
            minVersion: "30.5.0",
        },
        menu_2089: {
            id: "menu_GenAIConsolidatedGenerateTextTranslate",
            action: "GenAIConsolidatedGenerateTextTranslate",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Generative > Rewrite > Translate...",
                de: "Object > Generative > Rewrite > Translate...",
                ru: "Object > Generative > Rewrite > Translate...",
                "zh-cn": "Object > Generative > Rewrite > Translate...",
                zh_TW: "\u7269\u4ef6 > Generative > Rewrite > Translate...",
            },
            hidden: false,
            minVersion: "30.5.0",
        },
        menu_1109: {
            id: "menu_Gen_Expand_Object_Make",
            action: "Gen Expand Object Make",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Generative > Generative Expand > Make",
                de: "Object > Generative > Generative Expand > Make",
                ru: "Object > Generative > Generative Expand > Make",
                "zh-cn": "Object > Generative > Generative Expand > Make",
                zh_TW: "\u7269\u4ef6 > Generative > Generative Expand > \u5efa\u7acb",
            },
            hidden: false,
            minVersion: "30.0",
        },
        menu_1110: {
            id: "menu_Gen_Expand_Object_Combine",
            action: "Gen Expand Object Combine",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Generative > Generative Expand > Combine",
                de: "Object > Generative > Generative Expand > Combine",
                ru: "Object > Generative > Generative Expand > Combine",
                "zh-cn": "Object > Generative > Generative Expand > Combine",
                zh_TW: "\u7269\u4ef6 > Generative > Generative Expand > Combine",
            },
            hidden: false,
            minVersion: "30.0",
        },
        menu_1111: {
            id: "menu_GenAIConsolidatedBleed",
            action: "GenAIConsolidatedBleed",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Generative > Print Bleed",
                de: "Object > Generative > Print Bleed",
                ru: "Object > Generative > Print Bleed",
                "zh-cn": "Object > Generative > Print Bleed",
                zh_TW: "\u7269\u4ef6 > Generative > Print Bleed",
            },
            hidden: false,
            minVersion: "30.0",
        },
        menu_1112: {
            id: "menu_GenAIConsolidatedRecolor",
            action: "GenAIConsolidatedRecolor",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Generative > Generative Recolor",
                de: "Object > Generative > Generative Recolor",
                ru: "Object > Generative > Generative Recolor",
                "zh-cn": "Object > Generative > Generative Recolor",
                zh_TW: "\u7269\u4ef6 > Generative > Generative Recolor",
            },
            hidden: false,
            minVersion: "30.0",
        },
        menu_1113: {
            id: "menu_GenAIConsolidatedPatterns",
            action: "GenAIConsolidatedPatterns",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Generative > Generate Patterns",
                de: "Object > Generative > Generate Patterns",
                ru: "Object > Generative > Generate Patterns",
                "zh-cn": "Object > Generative > Generate Patterns",
                zh_TW: "\u7269\u4ef6 > Generative > Generate Patterns",
            },
            hidden: false,
            minVersion: "30.0",
        },
        menu_1114: {
            id: "menu_GenAIConsolidatedVariations",
            action: "GenAIConsolidatedVariations",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Generative > Generation History",
                de: "Object > Generative > Generation History",
                ru: "Object > Generative > Generation History",
                "zh-cn": "Object > Generative > Generation History",
                zh_TW: "\u7269\u4ef6 > Generative > Generation History",
            },
            hidden: false,
            minVersion: "30.0",
        },
        menu_1115: {
            id: "menu_AISlice_Make_Slice",
            action: "AISlice Make Slice",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Slice > Make",
                de: "Objekt > Slice > Erstellen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
                "zh-cn": "Object > Slice > Make",
                zh_TW: "\u7269\u4ef6 > Slice > \u5efa\u7acb",
            },
            hidden: false,
        },
        menu_1116: {
            id: "menu_AISlice_Release_Slice",
            action: "AISlice Release Slice",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Slice > Release",
                de: "Objekt > Slice > Zur\u00fcckwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u0420\u0430\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
                "zh-cn": "Object > Slice > Release",
                zh_TW: "\u7269\u4ef6 > Slice > \u91cb\u653e",
            },
            hidden: false,
        },
        menu_1117: {
            id: "menu_AISlice_Create_from_Guides",
            action: "AISlice Create from Guides",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Slice > Create from Guides",
                de: "Objekt > Slice > Aus Hilfslinien erstellen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u043e \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u043c",
                "zh-cn": "Object > Slice > Create from Guides",
                zh_TW: "\u7269\u4ef6 > Slice > Create from Guides",
            },
            hidden: false,
        },
        menu_1118: {
            id: "menu_AISlice_Create_from_Selection",
            action: "AISlice Create from Selection",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Slice > Create from Selection",
                de: "Objekt > Slice > Aus Auswahl erstellen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u043e \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
                "zh-cn": "Object > Slice > Create from Selection",
                zh_TW: "\u7269\u4ef6 > Slice > Create from Selection",
            },
            hidden: false,
        },
        menu_1119: {
            id: "menu_AISlice_Duplicate",
            action: "AISlice Duplicate",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Slice > Duplicate Slice",
                de: "Objekt > Slice > Slice duplizieren",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0434\u0443\u0431\u043b\u0438\u043a\u0430\u0442 \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u0430",
                "zh-cn": "Object > Slice > Duplicate Slice",
                zh_TW: "\u7269\u4ef6 > Slice > Duplicate Slice",
            },
            hidden: false,
        },
        menu_1120: {
            id: "menu_AISlice_Combine",
            action: "AISlice Combine",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Slice > Combine Slices",
                de: "Objekt > Slice > Slices kombinieren",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0438\u0442\u044c \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b",
                "zh-cn": "Object > Slice > Combine Slices",
                zh_TW: "\u7269\u4ef6 > Slice > Combine Slices",
            },
            hidden: false,
        },
        menu_1121: {
            id: "menu_AISlice_Divide",
            action: "AISlice Divide",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Slice > Divide Slices...",
                de: "Objekt > Slice > Slices unterteilen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u0420\u0430\u0437\u0434\u0435\u043b\u0438\u0442\u044c \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b...",
                "zh-cn": "Object > Slice > Divide Slices...",
                zh_TW: "\u7269\u4ef6 > Slice > Divide Slices...",
            },
            hidden: false,
        },
        menu_1122: {
            id: "menu_AISlice_Delete_All_Slices",
            action: "AISlice Delete All Slices",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Slice > Delete All",
                de: "Objekt > Slice > Alle l\u00f6schen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0432\u0441\u0435",
                "zh-cn": "Object > Slice > Delete All",
                zh_TW: "\u7269\u4ef6 > Slice > Delete All",
            },
            hidden: false,
        },
        menu_1123: {
            id: "menu_AISlice_Slice_Options",
            action: "AISlice Slice Options",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Slice > Slice Options...",
                de: "Objekt > Slice > Slice-Optionen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u0430...",
                "zh-cn": "Object > Slice > Slice Options...",
                zh_TW: "\u7269\u4ef6 > Slice > Slice Options...",
            },
            hidden: false,
        },
        menu_1124: {
            id: "menu_AISlice_Clip_to_Artboard",
            action: "AISlice Clip to Artboard",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Slice > Clip to Artboard",
                de: "Objekt > Slice > Ganze Zeichenfl\u00e4che exportieren",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u041e\u0431\u0440\u0435\u0437\u0430\u0442\u044c \u043f\u043e \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
                "zh-cn": "Object > Slice > Clip to Artboard",
                zh_TW: "\u7269\u4ef6 > Slice > Clip to Artboard",
            },
            hidden: false,
        },
        menu_1125: {
            id: "menu_Generate_Modal_File_Menu_",
            action: "Generate Modal File Menu ",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Generate Vectors...",
                de: "Object > Generate Vectors...",
                ru: "Object > Generate Vectors...",
                "zh-cn": "Object > Generate Vectors...",
                zh_TW: "\u7269\u4ef6 > Generate Vectors...",
            },
            hidden: false,
            minVersion: "28.6",
            maxVersion: "29.999",
        },
        menu_1126: {
            id: "menu_Expand3",
            action: "Expand3",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Expand...",
                de: "Objekt > Umwandeln \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c\u2026",
                "zh-cn": "Object > Expand...",
                zh_TW: "\u7269\u4ef6 > Expand...",
            },
            hidden: false,
        },
        menu_1127: {
            id: "menu_expandStyle",
            action: "expandStyle",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Expand Appearance",
                de: "Objekt > Aussehen umwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435",
                "zh-cn": "Object > Expand Appearance",
                zh_TW: "\u7269\u4ef6 > Expand Appearance",
            },
            hidden: false,
        },
        menu_1128: {
            id: "menu_join",
            action: "join",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Path > Join",
                de: "Objekt > Pfad > Zusammenf\u00fcgen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0421\u043e\u0435\u0434\u0438\u043d\u0438\u0442\u044c",
                "zh-cn": "Object > Path > Join",
                zh_TW: "\u7269\u4ef6 > \u8def\u5f91 > \u9023\u63a5",
            },
            hidden: false,
        },
        menu_1129: {
            id: "menu_average",
            action: "average",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Path > Average...",
                de: "Objekt > Pfad > Durchschnitt berechnen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0423\u0441\u0440\u0435\u0434\u043d\u0438\u0442\u044c\u2026",
                "zh-cn": "Object > Path > Average...",
                zh_TW: "\u7269\u4ef6 > \u8def\u5f91 > \u5e73\u5747\u2026",
            },
            hidden: false,
        },
        menu_1130: {
            id: "menu_OffsetPath_v22",
            action: "OffsetPath v22",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Path > Outline Stroke",
                de: "Objekt > Pfad > Konturlinie",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u043e\u0431\u0432\u043e\u0434\u043a\u0443 \u0432 \u043a\u0440\u0438\u0432\u044b\u0435",
                "zh-cn": "Object > Path > Outline Stroke",
                zh_TW: "\u7269\u4ef6 > \u8def\u5f91 > \u5916\u6846\u7b46\u756b",
            },
            hidden: false,
        },
        menu_1131: {
            id: "menu_OffsetPath_v23",
            action: "OffsetPath v23",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Path > Offset Path...",
                de: "Objekt > Pfad > Pfad verschieben \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0430\u0440\u0430\u043b\u043b\u0435\u043b\u044c\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0443\u0440\u2026",
                "zh-cn": "Object > Path > Offset Path...",
                zh_TW: "\u7269\u4ef6 > \u8def\u5f91 > \u4f4d\u79fb\u8def\u5f91\u2026",
            },
            hidden: false,
        },
        menu_1132: {
            id: "menu_Reverse_Path_Direction",
            action: "Reverse Path Direction",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Path > Reverse Path Direction",
                de: "Objekt > Pfad > Pfadrichtung umkehren",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u043a\u043e\u043d\u0442\u0443\u0440\u0430",
                "zh-cn": "Object > Path > Reverse Path Direction",
                zh_TW: "\u7269\u4ef6 > \u8def\u5f91 > \u53cd\u8f49\u8def\u5f91\u65b9\u5411",
            },
            hidden: false,
            minVersion: "21",
        },
        menu_1133: {
            id: "menu_simplify_menu_item",
            action: "simplify menu item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Path > Simplify...",
                de: "Objekt > Pfad > Vereinfachen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0423\u043f\u0440\u043e\u0441\u0442\u0438\u0442\u044c\u2026",
                "zh-cn": "Object > Path > Simplify...",
                zh_TW: "\u7269\u4ef6 > \u8def\u5f91 > \u7c21\u5316\u2026",
            },
            hidden: false,
        },
        menu_1134: {
            id: "menu_Add_Anchor_Points2",
            action: "Add Anchor Points2",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Path > Add Anchor Points",
                de: "Objekt > Pfad > Ankerpunkte hinzuf\u00fcgen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043e\u043f\u043e\u0440\u043d\u044b\u0435 \u0442\u043e\u0447\u043a\u0438",
                "zh-cn": "Object > Path > Add Anchor Points",
                zh_TW: "\u7269\u4ef6 > \u8def\u5f91 > \u589e\u52a0\u9328\u9ede",
            },
            hidden: false,
        },
        menu_1135: {
            id: "menu_Remove_Anchor_Points_menu",
            action: "Remove Anchor Points menu",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Path > Remove Anchor Points",
                de: "Objekt > Pfad > Ankerpunkte entfernen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043e\u043f\u043e\u0440\u043d\u044b\u0435 \u0442\u043e\u0447\u043a\u0438",
                "zh-cn": "Object > Path > Remove Anchor Points",
                zh_TW: "\u7269\u4ef6 > \u8def\u5f91 > \u79fb\u9664\u9328\u9ede",
            },
            hidden: false,
        },
        menu_1136: {
            id: "menu_Knife_Tool2",
            action: "Knife Tool2",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Path > Divide Objects Below",
                de: "Objekt > Pfad > Darunter liegende Objekte aufteilen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0420\u0430\u0437\u0434\u0435\u043b\u0438\u0442\u044c \u043d\u0438\u0436\u043d\u0438\u0435 \u043e\u0431\u044a\u0435\u043a\u0442\u044b",
                "zh-cn": "Object > Path > Divide Objects Below",
                zh_TW: "\u7269\u4ef6 > \u8def\u5f91 > \u5206\u5272\u4e0b\u65b9\u7269\u4ef6",
            },
            hidden: false,
        },
        menu_1137: {
            id: "menu_Rows_and_Columns",
            action: "Rows and Columns....",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Path > Split Into Grid...",
                de: "Objekt > Pfad > In Raster teilen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0441\u0435\u0442\u043a\u0443...",
                "zh-cn": "Object > Path > Split Into Grid...",
                zh_TW: "\u7269\u4ef6 > \u8def\u5f91 > \u5206\u5272\u6210\u7db2\u683c\u2026",
            },
            hidden: false,
        },
        menu_1138: {
            id: "menu_cleanup_menu_item",
            action: "cleanup menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Path > Clean Up...",
                de: "Objekt > Pfad > Aufr\u00e4umen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0412\u044b\u0447\u0438\u0441\u0442\u0438\u0442\u044c\u2026",
                "zh-cn": "Object > Path > Clean Up...",
                zh_TW: "\u7269\u4ef6 > \u8def\u5f91 > \u6e05\u9664\u2026",
            },
            hidden: false,
        },
        menu_1139: {
            id: "menu_smooth_menu_item",
            action: "smooth menu item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Path > Smooth...",
                de: "Object > Path > Smooth...",
                ru: "Object > Path > Smooth...",
                "zh-cn": "Object > Path > Smooth...",
                zh_TW: "\u7269\u4ef6 > \u8def\u5f91 > \u5e73\u6ed1\u2026",
            },
            hidden: false,
            minVersion: "28",
        },
        menu_1140: {
            id: "menu_Convert_to_Shape",
            action: "Convert to Shape",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Shape > Convert to Shape",
                de: "Objekt > Form > In Form umwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0438\u0433\u0443\u0440\u0430 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 \u0444\u0438\u0433\u0443\u0440\u044b",
                "zh-cn": "Object > Shape > Convert to Shape",
                zh_TW: "\u7269\u4ef6 > Shape > Convert to Shape",
            },
            hidden: false,
            minVersion: "18",
        },
        menu_1141: {
            id: "menu_Expand_Shape",
            action: "Expand Shape",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Shape > Expand Shape",
                de: "Objekt > Form > Form umwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0438\u0433\u0443\u0440\u0430 > \u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c \u0444\u0438\u0433\u0443\u0440\u0443",
                "zh-cn": "Object > Shape > Expand Shape",
                zh_TW: "\u7269\u4ef6 > Shape > Expand Shape",
            },
            hidden: false,
            minVersion: "18",
        },
        menu_1142: {
            id: "menu_Shape_Fill_Object_Menu",
            action: "Shape Fill Object Menu",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Gen Shape Fill...",
                de: "Object > Gen Shape Fill...",
                ru: "Object > Gen Shape Fill...",
                "zh-cn": "Object > Gen Shape Fill...",
                zh_TW: "\u7269\u4ef6 > Gen Shape Fill...",
            },
            hidden: false,
            minVersion: "28.6",
            maxVersion: "29.999",
        },
        menu_1143: {
            id: "menu_Gen_Expand_Object_Make",
            action: "Gen Expand Object Make",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Generative Expand > Make...",
                de: "Object > Generative Expand > Make...",
                ru: "Object > Generative Expand > Make...",
                "zh-cn": "Object > Generative Expand > Make...",
                zh_TW: "\u7269\u4ef6 > Generative Expand > Make...",
            },
            hidden: false,
            minVersion: "29.6",
            maxVersion: "29.999",
        },
        menu_1144: {
            id: "menu_Gen_Expand_Object_Combine",
            action: "Gen Expand Object Combine",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Generative Expand > Combine",
                de: "Object > Generative Expand > Combine",
                ru: "Object > Generative Expand > Combine",
                "zh-cn": "Object > Generative Expand > Combine",
                zh_TW: "\u7269\u4ef6 > Generative Expand > Combine",
            },
            hidden: false,
            minVersion: "29.6",
            maxVersion: "29.999",
        },
        menu_1145: {
            id: "menu_Gen_Bleed_Object_Menu",
            action: "Gen Bleed Object Menu",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Print Bleed...",
                de: "Object > Print Bleed...",
                ru: "Object > Print Bleed...",
                "zh-cn": "Object > Print Bleed...",
                zh_TW: "\u7269\u4ef6 > Print Bleed...",
            },
            hidden: false,
            minVersion: "29.6",
            maxVersion: "29.999",
        },
        menu_1146: {
            id: "menu_Adobe_Make_Pattern",
            action: "Adobe Make Pattern",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Pattern > Make",
                de: "Objekt > Muster > Erstellen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0423\u0437\u043e\u0440 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
                "zh-cn": "Object > Pattern > Make",
                zh_TW: "\u7269\u4ef6 > Pattern > \u5efa\u7acb",
            },
            hidden: false,
        },
        menu_1147: {
            id: "menu_Adobe_Edit_Pattern",
            action: "Adobe Edit Pattern",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Pattern > Edit Pattern",
                de: "Objekt > Muster > Muster bearbeiten",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0423\u0437\u043e\u0440 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0443\u0437\u043e\u0440",
                "zh-cn": "Object > Pattern > Edit Pattern",
                zh_TW: "\u7269\u4ef6 > Pattern > Edit Pattern",
            },
            hidden: false,
        },
        menu_1148: {
            id: "menu_Adobe_Pattern_Tile_Color",
            action: "Adobe Pattern Tile Color",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Object > Pattern > Tile Edge Color...",
                de: "Objekt > Muster > Farbe f\u00fcr Musterelement-Kante",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0423\u0437\u043e\u0440 > \u0426\u0432\u0435\u0442 \u043a\u0440\u0430\u044f \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u0430...",
                "zh-cn": "Object > Pattern > Tile Edge Color...",
                zh_TW: "\u7269\u4ef6 > Pattern > Tile Edge Color...",
            },
            hidden: false,
        },
        menu_1149: {
            id: "menu_Adobe_Generative_Patterns_Panel",
            action: "Adobe Generative Patterns Panel",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Pattern > Generate Patterns",
                de: "Object > Pattern > Generate Patterns",
                ru: "Object > Pattern > Generate Patterns",
                "zh-cn": "Object > Pattern > Generate Patterns",
                zh_TW: "\u7269\u4ef6 > Pattern > Generate Patterns",
            },
            hidden: false,
            minVersion: "28.6",
            maxVersion: "29.999",
        },
        menu_1150: {
            id: "menu_GenAIConsolidatedPatterns",
            action: "GenAIConsolidatedPatterns",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Pattern > Generate Patterns",
                de: "Object > Pattern > Generate Patterns",
                ru: "Object > Pattern > Generate Patterns",
                "zh-cn": "Object > Pattern > Generate Patterns",
                zh_TW: "\u7269\u4ef6 > Pattern > Generate Patterns",
            },
            hidden: false,
            minVersion: "30.0",
        },
        menu_1151: {
            id: "menu_Partial_Rearrange_Make",
            action: "Partial Rearrange Make",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Intertwine > Make",
                de: "Objekt > Verflechtung > Erstellen",
                ru: "Object > Intertwine > Make",
                "zh-cn": "Object > Intertwine > Make",
                zh_TW: "\u7269\u4ef6 > Intertwine > \u5efa\u7acb",
            },
            hidden: false,
            minVersion: "27",
        },
        menu_1152: {
            id: "menu_Partial_Rearrange_Release",
            action: "Partial Rearrange Release",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Intertwine > Release",
                de: "Objekt > Verflechtung > Zur\u00fcckwandeln",
                ru: "Object > Intertwine > Release",
                "zh-cn": "Object > Intertwine > Release",
                zh_TW: "\u7269\u4ef6 > Intertwine > \u91cb\u653e",
            },
            hidden: false,
            minVersion: "27",
        },
        menu_1153: {
            id: "menu_Partial_Rearrange_Edit",
            action: "Partial Rearrange Edit",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Intertwine > Edit",
                de: "Objekt > Verflechtung > Bearbeiten",
                ru: "Object > Intertwine > Edit",
                "zh-cn": "Object > Intertwine > Edit",
                zh_TW: "\u7269\u4ef6 > Intertwine > \u7de8\u8f2f",
            },
            hidden: false,
            minVersion: "27",
        },
        menu_1154: {
            id: "menu_Make_Radial_Repeat",
            action: "Make Radial Repeat",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Repeat > Radial",
                de: "Objekt > Wiederholen > Radial",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c > \u0420\u0430\u0434\u0438\u0430\u043b\u044c\u043d\u044b\u0439",
                "zh-cn": "Object > Repeat > Radial",
                zh_TW: "\u7269\u4ef6 > Repeat > Radial",
            },
            hidden: false,
            minVersion: "25.1",
        },
        menu_1155: {
            id: "menu_Make_Grid_Repeat",
            action: "Make Grid Repeat",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Repeat > Grid",
                de: "Objekt > Wiederholen > Raster",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c > \u0421\u0435\u0442\u043a\u0430",
                "zh-cn": "Object > Repeat > Grid",
                zh_TW: "\u7269\u4ef6 > Repeat > Grid",
            },
            hidden: false,
            minVersion: "25.1",
        },
        menu_1156: {
            id: "menu_Make_Symmetry_Repeat",
            action: "Make Symmetry Repeat",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Repeat > Mirror",
                de: "Objekt > Wiederholen > Spiegeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c > \u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u043e",
                "zh-cn": "Object > Repeat > Mirror",
                zh_TW: "\u7269\u4ef6 > Repeat > Mirror",
            },
            hidden: false,
            minVersion: "25.1",
        },
        menu_1157: {
            id: "menu_Release_Repeat_Art",
            action: "Release Repeat Art",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Repeat > Release",
                de: "Objekt > Wiederholen > Zur\u00fcckwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c > \u041e\u0441\u0432\u043e\u0431\u043e\u0434\u0438\u0442\u044c",
                "zh-cn": "Object > Repeat > Release",
                zh_TW: "\u7269\u4ef6 > Repeat > \u91cb\u653e",
            },
            hidden: false,
            minVersion: "25.1",
        },
        menu_1158: {
            id: "menu_Repeat_Art_Options",
            action: "Repeat Art Options",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Repeat > Options...",
                de: "Objekt > Wiederholen > Optionen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b\u2026",
                "zh-cn": "Object > Repeat > Options...",
                zh_TW: "\u7269\u4ef6 > Repeat > \u9078\u9805\u2026",
            },
            hidden: false,
            minVersion: "25.1",
        },
        menu_1159: {
            id: "menu_Attach_Objects_on_Path",
            action: "Attach Objects on Path",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Objects on Path > Attach...",
                de: "Object > Objects on Path > Attach...",
                ru: "Object > Objects on Path > Attach...",
                "zh-cn": "Object > Objects on Path > Attach...",
                zh_TW: "\u7269\u4ef6 > \u6cbf\u8def\u5f91\u6392\u5217\u7269\u4ef6 > \u9644\u52a0\u2026",
            },
            hidden: false,
            minVersion: "29",
        },
        menu_1160: {
            id: "menu_Options_Objects_on_Path",
            action: "Options Objects on Path",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Objects on Path > Options...",
                de: "Object > Objects on Path > Options...",
                ru: "Object > Objects on Path > Options...",
                "zh-cn": "Object > Objects on Path > Options...",
                zh_TW: "\u7269\u4ef6 > \u6cbf\u8def\u5f91\u6392\u5217\u7269\u4ef6 > \u9078\u9805\u2026",
            },
            hidden: false,
            minVersion: "29",
        },
        menu_1161: {
            id: "menu_Expand_Objects_on_Path",
            action: "Expand Objects on Path",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Objects on Path > Expand",
                de: "Object > Objects on Path > Expand",
                ru: "Object > Objects on Path > Expand",
                "zh-cn": "Object > Objects on Path > Expand",
                zh_TW: "\u7269\u4ef6 > \u6cbf\u8def\u5f91\u6392\u5217\u7269\u4ef6 > \u5c55\u958b",
            },
            hidden: false,
            minVersion: "29",
        },
        menu_1162: {
            id: "menu_Path_Blend_Make",
            action: "Path Blend Make",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Blend > Make",
                de: "Objekt > Angleichen > Erstellen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
                "zh-cn": "Object > Blend > Make",
                zh_TW: "\u7269\u4ef6 > Blend > \u5efa\u7acb",
            },
            hidden: false,
        },
        menu_1163: {
            id: "menu_Path_Blend_Release",
            action: "Path Blend Release",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Blend > Release",
                de: "Objekt > Angleichen > Zur\u00fcckwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 > \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
                "zh-cn": "Object > Blend > Release",
                zh_TW: "\u7269\u4ef6 > Blend > \u91cb\u653e",
            },
            hidden: false,
        },
        menu_1164: {
            id: "menu_Path_Blend_Options",
            action: "Path Blend Options",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Object > Blend > Blend Options...",
                de: "Objekt > Angleichen > Angleichung-Optionen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u043f\u0435\u0440\u0435\u0445\u043e\u0434\u0430\u2026",
                "zh-cn": "Object > Blend > Blend Options...",
                zh_TW: "\u7269\u4ef6 > Blend > Blend Options...",
            },
            hidden: false,
        },
        menu_1165: {
            id: "menu_Path_Blend_Expand",
            action: "Path Blend Expand",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Blend > Expand",
                de: "Objekt > Angleichen > Umwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 > \u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c",
                "zh-cn": "Object > Blend > Expand",
                zh_TW: "\u7269\u4ef6 > Blend > \u5c55\u958b",
            },
            hidden: false,
        },
        menu_1166: {
            id: "menu_Path_Blend_Replace_Spine",
            action: "Path Blend Replace Spine",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Blend > Replace Spine",
                de: "Objekt > Angleichen > Achse ersetzen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 > \u0417\u0430\u043c\u0435\u043d\u0438\u0442\u044c \u0442\u0440\u0430\u0435\u043a\u0442\u043e\u0440\u0438\u044e",
                "zh-cn": "Object > Blend > Replace Spine",
                zh_TW: "\u7269\u4ef6 > Blend > Replace Spine",
            },
            hidden: false,
        },
        menu_1167: {
            id: "menu_Path_Blend_Reverse_Spine",
            action: "Path Blend Reverse Spine",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Blend > Reverse Spine",
                de: "Objekt > Angleichen > Achse umkehren",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 > \u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435",
                "zh-cn": "Object > Blend > Reverse Spine",
                zh_TW: "\u7269\u4ef6 > Blend > Reverse Spine",
            },
            hidden: false,
        },
        menu_1168: {
            id: "menu_Path_Blend_Reverse_Stack",
            action: "Path Blend Reverse Stack",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Blend > Reverse Front to Back",
                de: "Objekt > Angleichen > Farbrichtung umkehren",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 > \u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u043f\u043e\u0440\u044f\u0434\u043e\u043a",
                "zh-cn": "Object > Blend > Reverse Front to Back",
                zh_TW: "\u7269\u4ef6 > Blend > Reverse Front to Back",
            },
            hidden: false,
        },
        menu_1169: {
            id: "menu_Make_Warp",
            action: "Make Warp",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Envelope Distort > Make with Warp...",
                de: "Objekt > Verzerrungsh\u00fclle > Mit Verkr\u00fcmmung erstellen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f...",
                "zh-cn": "Object > Envelope Distort > Make with Warp...",
                zh_TW: "\u7269\u4ef6 > Envelope Distort > Make with Warp...",
            },
            hidden: false,
        },
        menu_1170: {
            id: "menu_Create_Envelope_Grid",
            action: "Create Envelope Grid",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Envelope Distort > Make with Mesh...",
                de: "Objekt > Verzerrungsh\u00fclle > Mit Gitter erstellen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 > \u041f\u043e \u0441\u0435\u0442\u043a\u0435...",
                "zh-cn": "Object > Envelope Distort > Make with Mesh...",
                zh_TW: "\u7269\u4ef6 > Envelope Distort > Make with Mesh...",
            },
            hidden: false,
        },
        menu_1171: {
            id: "menu_Make_Envelope",
            action: "Make Envelope",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Envelope Distort > Make with Top Object",
                de: "Objekt > Verzerrungsh\u00fclle > Mit oberstem Objekt erstellen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 > \u041f\u043e \u0444\u043e\u0440\u043c\u0435 \u0432\u0435\u0440\u0445\u043d\u0435\u0433\u043e \u043e\u0431\u044a\u0435\u043a\u0442\u0430",
                "zh-cn": "Object > Envelope Distort > Make with Top Object",
                zh_TW: "\u7269\u4ef6 > Envelope Distort > Make with Top Object",
            },
            hidden: false,
        },
        menu_1172: {
            id: "menu_Release_Envelope",
            action: "Release Envelope",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Envelope Distort > Release",
                de: "Objekt > Verzerrungsh\u00fclle > Zur\u00fcckwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 > \u041e\u0442\u0434\u0435\u043b\u0438\u0442\u044c",
                "zh-cn": "Object > Envelope Distort > Release",
                zh_TW: "\u7269\u4ef6 > Envelope Distort > \u91cb\u653e",
            },
            hidden: false,
        },
        menu_1173: {
            id: "menu_Envelope_Options",
            action: "Envelope Options",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Object > Envelope Distort > Envelope Options...",
                de: "Objekt > Verzerrungsh\u00fclle > H\u00fcllen-Optionen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438...",
                "zh-cn": "Object > Envelope Distort > Envelope Options...",
                zh_TW: "\u7269\u4ef6 > Envelope Distort > Envelope Options...",
            },
            hidden: false,
        },
        menu_1174: {
            id: "menu_Expand_Envelope",
            action: "Expand Envelope",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Envelope Distort > Expand",
                de: "Objekt > Verzerrungsh\u00fclle > Umwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 > \u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c",
                "zh-cn": "Object > Envelope Distort > Expand",
                zh_TW: "\u7269\u4ef6 > Envelope Distort > \u5c55\u958b",
            },
            hidden: false,
        },
        menu_1175: {
            id: "menu_Edit_Envelope_Contents",
            action: "Edit Envelope Contents",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Envelope Distort > Edit Contents",
                de: "Objekt > Verzerrungsh\u00fclle > Inhalt bearbeiten",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0441\u043e\u0434\u0435\u0440\u0436\u0438\u043c\u043e\u0435",
                "zh-cn": "Object > Envelope Distort > Edit Contents",
                zh_TW: "\u7269\u4ef6 > Envelope Distort > Edit Contents",
            },
            hidden: false,
        },
        menu_1176: {
            id: "menu_Attach_to_Active_Plane",
            action: "Attach to Active Plane",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Perspective > Attach to Active Plane",
                de: "Objekt > Perspektive > Aktiver Ebene anh\u00e4ngen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u0430 > \u041f\u0440\u0438\u043a\u0440\u0435\u043f\u0438\u0442\u044c \u043a \u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0439 \u043f\u043b\u043e\u0441\u043a\u043e\u0441\u0442\u0438",
                "zh-cn": "Object > Perspective > Attach to Active Plane",
                zh_TW: "\u7269\u4ef6 > Perspective > Attach to Active Plane",
            },
            hidden: false,
        },
        menu_1177: {
            id: "menu_Release_with_Perspective",
            action: "Release with Perspective",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Perspective > Release with Perspective",
                de: "Objekt > Perspektive > Aus Perspektive freigeben",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u0430 > \u041e\u0442\u043a\u0440\u0435\u043f\u0438\u0442\u044c \u0441 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435\u043c \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b",
                "zh-cn": "Object > Perspective > Release with Perspective",
                zh_TW: "\u7269\u4ef6 > Perspective > Release with Perspective",
            },
            hidden: false,
        },
        menu_1178: {
            id: "menu_Show_Object_Grid_Plane",
            action: "Show Object Grid Plane",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Perspective > Move Plane to Match Object",
                de: "Objekt > Perspektive > Ebene an Objekt ausrichten",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u0430 > \u041f\u0435\u0440\u0435\u043c\u0435\u0441\u0442\u0438\u0442\u044c \u043f\u043b\u043e\u0441\u043a\u043e\u0441\u0442\u044c \u0434\u043b\u044f \u043f\u043e\u0434\u0433\u043e\u043d\u043a\u0438 \u043f\u043e \u043e\u0431\u044a\u0435\u043a\u0442\u0443",
                "zh-cn": "Object > Perspective > Move Plane to Match Object",
                zh_TW: "\u7269\u4ef6 > Perspective > Move Plane to Match Object",
            },
            hidden: false,
        },
        menu_1179: {
            id: "menu_Edit_Original_Object",
            action: "Edit Original Object",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Perspective > Edit Text",
                de: "Objekt > Perspektive > Text bearbeiten",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u0430 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0442\u0435\u043a\u0441\u0442",
                "zh-cn": "Object > Perspective > Edit Text",
                zh_TW: "\u7269\u4ef6 > Perspective > Edit Text",
            },
            hidden: false,
        },
        menu_1180: {
            id: "menu_Make_Planet_X",
            action: "Make Planet X",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Live Paint > Make",
                de: "Objekt > Interaktiv malen > Erstellen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0411\u044b\u0441\u0442\u0440\u0430\u044f \u0437\u0430\u043b\u0438\u0432\u043a\u0430 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
                "zh-cn": "Object > Live Paint > Make",
                zh_TW: "\u7269\u4ef6 > Live Paint > \u5efa\u7acb",
            },
            hidden: false,
        },
        menu_1181: {
            id: "menu_Marge_Planet_X",
            action: "Marge Planet X",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Live Paint > Merge",
                de: "Objekt > Interaktiv malen > Zusammenf\u00fcgen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0411\u044b\u0441\u0442\u0440\u0430\u044f \u0437\u0430\u043b\u0438\u0432\u043a\u0430 > \u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0438\u0442\u044c",
                "zh-cn": "Object > Live Paint > Merge",
                zh_TW: "\u7269\u4ef6 > Live Paint > Merge",
            },
            hidden: false,
        },
        menu_1182: {
            id: "menu_Release_Planet_X",
            action: "Release Planet X",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Live Paint > Release",
                de: "Objekt > Interaktiv malen > Zur\u00fcckwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0411\u044b\u0441\u0442\u0440\u0430\u044f \u0437\u0430\u043b\u0438\u0432\u043a\u0430 > \u0420\u0430\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
                "zh-cn": "Object > Live Paint > Release",
                zh_TW: "\u7269\u4ef6 > Live Paint > \u91cb\u653e",
            },
            hidden: false,
        },
        menu_1183: {
            id: "menu_Planet_X_Options",
            action: "Planet X Options",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Object > Live Paint > Gap Options...",
                de: "Objekt > Interaktiv malen > L\u00fcckenoptionen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0411\u044b\u0441\u0442\u0440\u0430\u044f \u0437\u0430\u043b\u0438\u0432\u043a\u0430 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0437\u0430\u0437\u043e\u0440\u043e\u0432\u2026",
                "zh-cn": "Object > Live Paint > Gap Options...",
                zh_TW: "\u7269\u4ef6 > Live Paint > Gap Options...",
            },
            hidden: false,
        },
        menu_1184: {
            id: "menu_Expand_Planet_X",
            action: "Expand Planet X",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Live Paint > Expand",
                de: "Objekt > Interaktiv malen > Umwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0411\u044b\u0441\u0442\u0440\u0430\u044f \u0437\u0430\u043b\u0438\u0432\u043a\u0430 > \u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c",
                "zh-cn": "Object > Live Paint > Expand",
                zh_TW: "\u7269\u4ef6 > Live Paint > \u5c55\u958b",
            },
            hidden: false,
        },
        menu_1185: {
            id: "menu_Make_Image_Tracing",
            action: "Make Image Tracing",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Image Trace > Make",
                de: "Objekt > Bildnachzeichner > Erstellen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u0441\u0441\u0438\u0440\u043e\u0432\u043a\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
                "zh-cn": "Object > Image Trace > Make",
                zh_TW: "\u7269\u4ef6 > Image Trace > \u5efa\u7acb",
            },
            hidden: false,
        },
        menu_1186: {
            id: "menu_Make_and_Expand_Image_Tracing",
            action: "Make and Expand Image Tracing",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Image Trace > Make and Expand",
                de: "Objekt > Bildnachzeichner > Erstellen und umwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u0441\u0441\u0438\u0440\u043e\u0432\u043a\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0438 \u0440\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c",
                "zh-cn": "Object > Image Trace > Make and Expand",
                zh_TW: "\u7269\u4ef6 > Image Trace > Make and Expand",
            },
            hidden: false,
        },
        menu_1187: {
            id: "menu_Release_Image_Tracing",
            action: "Release Image Tracing",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Image Trace > Release",
                de: "Objekt > Bildnachzeichner > Zur\u00fcckwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u0441\u0441\u0438\u0440\u043e\u0432\u043a\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f > \u0420\u0430\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
                "zh-cn": "Object > Image Trace > Release",
                zh_TW: "\u7269\u4ef6 > Image Trace > \u91cb\u653e",
            },
            hidden: false,
        },
        menu_1188: {
            id: "menu_Expand_Image_Tracing",
            action: "Expand Image Tracing",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Image Trace > Expand",
                de: "Objekt > Bildnachzeichner > Umwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u0441\u0441\u0438\u0440\u043e\u0432\u043a\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f > \u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c",
                "zh-cn": "Object > Image Trace > Expand",
                zh_TW: "\u7269\u4ef6 > Image Trace > \u5c55\u958b",
            },
            hidden: false,
        },
        menu_1189: {
            id: "menu_Make_Vector_Edge",
            action: "Make Vector Edge",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Mockup > Make / Preview",
                de: "Object > Mockup > Make / Preview",
                ru: "Object > Mockup > Make / Preview",
                "zh-cn": "Object > Mockup > Make / Preview",
                zh_TW: "\u7269\u4ef6 > Mockup > Make / Preview",
            },
            hidden: false,
            minVersion: "28",
        },
        menu_1190: {
            id: "menu_Release_Vector_Edge",
            action: "Release Vector Edge",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Mockup > Release",
                de: "Object > Mockup > Release",
                ru: "Object > Mockup > Release",
                "zh-cn": "Object > Mockup > Release",
                zh_TW: "\u7269\u4ef6 > Mockup > \u91cb\u653e",
            },
            hidden: false,
            minVersion: "28",
        },
        menu_1191: {
            id: "menu_Edit_Vector_Edge",
            action: "Edit Vector Edge",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Mockup > Edit",
                de: "Object > Mockup > Edit",
                ru: "Object > Mockup > Edit",
                "zh-cn": "Object > Mockup > Edit",
                zh_TW: "\u7269\u4ef6 > Mockup > \u7de8\u8f2f",
            },
            hidden: false,
            minVersion: "28",
        },
        menu_1192: {
            id: "menu_Make_Text_Wrap",
            action: "Make Text Wrap",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Text Wrap > Make",
                de: "Objekt > Textumfluss > Erstellen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0442\u0435\u043a\u0430\u043d\u0438\u0435 \u0442\u0435\u043a\u0441\u0442\u043e\u043c > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
                "zh-cn": "Object > Text Wrap > Make",
                zh_TW: "\u7269\u4ef6 > Text Wrap > \u5efa\u7acb",
            },
            hidden: false,
        },
        menu_1193: {
            id: "menu_Release_Text_Wrap",
            action: "Release Text Wrap",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Text Wrap > Release",
                de: "Objekt > Textumfluss > Zur\u00fcckwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0442\u0435\u043a\u0430\u043d\u0438\u0435 \u0442\u0435\u043a\u0441\u0442\u043e\u043c > \u041e\u0441\u0432\u043e\u0431\u043e\u0434\u0438\u0442\u044c",
                "zh-cn": "Object > Text Wrap > Release",
                zh_TW: "\u7269\u4ef6 > Text Wrap > \u91cb\u653e",
            },
            hidden: false,
        },
        menu_1194: {
            id: "menu_Text_Wrap_Options",
            action: "Text Wrap Options...",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Object > Text Wrap > Text Wrap Options...",
                de: "Objekt > Textumfluss > Textumflussoptionen \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0442\u0435\u043a\u0430\u043d\u0438\u0435 \u0442\u0435\u043a\u0441\u0442\u043e\u043c > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u043e\u0431\u0442\u0435\u043a\u0430\u043d\u0438\u044f \u0442\u0435\u043a\u0441\u0442\u043e\u043c...",
                "zh-cn": "Object > Text Wrap > Text Wrap Options...",
                zh_TW: "\u7269\u4ef6 > Text Wrap > Text Wrap Options...",
            },
            hidden: false,
        },
        menu_1195: {
            id: "menu_makeMask",
            action: "makeMask",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Clipping Mask > Make",
                de: "Objekt > Schnittmaske > Erstellen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0442\u0440\u0430\u0432\u043e\u0447\u043d\u0430\u044f \u043c\u0430\u0441\u043a\u0430 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
                "zh-cn": "Object > Clipping Mask > Make",
                zh_TW: "\u7269\u4ef6 > Clipping Mask > \u5efa\u7acb",
            },
            hidden: false,
        },
        menu_1196: {
            id: "menu_releaseMask",
            action: "releaseMask",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Clipping Mask > Release",
                de: "Objekt > Schnittmaske > Zur\u00fcckwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0442\u0440\u0430\u0432\u043e\u0447\u043d\u0430\u044f \u043c\u0430\u0441\u043a\u0430 > \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
                "zh-cn": "Object > Clipping Mask > Release",
                zh_TW: "\u7269\u4ef6 > Clipping Mask > \u91cb\u653e",
            },
            hidden: false,
        },
        menu_1197: {
            id: "menu_editMask",
            action: "editMask",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Clipping Mask > Edit Mask",
                de: "Objekt > Schnittmaske > Maske bearbeiten",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0442\u0440\u0430\u0432\u043e\u0447\u043d\u0430\u044f \u043c\u0430\u0441\u043a\u0430 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043c\u0430\u0441\u043a\u0443",
                "zh-cn": "Object > Clipping Mask > Edit Mask",
                zh_TW: "\u7269\u4ef6 > Clipping Mask > Edit Mask",
            },
            hidden: false,
        },
        menu_1198: {
            id: "menu_compoundPath",
            action: "compoundPath",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Compound Path > Make",
                de: "Objekt > Zusammengesetzter Pfad > Erstellen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043e\u0441\u0442\u0430\u0432\u043d\u043e\u0439 \u043a\u043e\u043d\u0442\u0443\u0440 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
                "zh-cn": "Object > Compound Path > Make",
                zh_TW: "\u7269\u4ef6 > \u8907\u5408\u8def\u5f91 > \u5efa\u7acb",
            },
            hidden: false,
        },
        menu_1199: {
            id: "menu_noCompoundPath",
            action: "noCompoundPath",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Compound Path > Release",
                de: "Objekt > Zusammengesetzter Pfad > Zur\u00fcckwandeln",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043e\u0441\u0442\u0430\u0432\u043d\u043e\u0439 \u043a\u043e\u043d\u0442\u0443\u0440 > \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
                "zh-cn": "Object > Compound Path > Release",
                zh_TW: "\u7269\u4ef6 > \u8907\u5408\u8def\u5f91 > \u91cb\u653e",
            },
            hidden: false,
        },
        menu_1200: {
            id: "menu_setCropMarks",
            action: "setCropMarks",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Artboards > Convert to Artboards",
                de: "Objekt > Zeichenfl\u00e4chen > In Zeichenfl\u00e4chen konvertieren",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
                "zh-cn": "Object > Artboards > Convert to Artboards",
                zh_TW: "\u7269\u4ef6 > Artboards > Convert to Artboards",
            },
            hidden: false,
        },
        menu_1201: {
            id: "menu_ReArrange_Artboards",
            action: "ReArrange Artboards",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Artboards > Rearrange Artboards",
                de: "Objekt > Zeichenfl\u00e4chen > Alle Zeichenfl\u00e4chen neu anordnen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 > \u041f\u0435\u0440\u0435\u0443\u043f\u043e\u0440\u044f\u0434\u043e\u0447\u0438\u0442\u044c \u0432\u0441\u0435 \u043c\u043e\u043d\u0442. \u043e\u0431\u043b.",
                "zh-cn": "Object > Artboards > Rearrange Artboards",
                zh_TW: "\u7269\u4ef6 > Artboards > Rearrange Artboards",
            },
            hidden: false,
        },
        menu_1202: {
            id: "menu_Fit_Artboard_to_artwork_bounds",
            action: "Fit Artboard to artwork bounds",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Artboards > Fit to Artwork Bounds",
                de: "Objekt > Zeichenfl\u00e4chen > An Bildmaterialbegrenzungen anpassen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 > \u041f\u043e\u0434\u043e\u0433\u043d\u0430\u0442\u044c \u043f\u043e \u0433\u0440\u0430\u043d\u0438\u0446\u0430\u043c \u0438\u043b\u043b\u044e\u0441\u0442\u0440\u0430\u0446\u0438\u0438",
                "zh-cn": "Object > Artboards > Fit to Artwork Bounds",
                zh_TW: "\u7269\u4ef6 > Artboards > Fit to Artwork Bounds",
            },
            hidden: false,
        },
        menu_1203: {
            id: "menu_Switch_Orientation",
            action: "Switch Orientation",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Artboards > Switch Orientation",
                de: "Object > Artboards > Switch Orientation",
                ru: "Object > Artboards > Switch Orientation",
                "zh-cn": "Object > Artboards > Switch Orientation",
                zh_TW: "\u7269\u4ef6 > Artboards > Switch Orientation",
            },
            hidden: false,
            minVersion: "30.0",
        },
        menu_1204: {
            id: "menu_Fit_Artboard_to_selected_Art",
            action: "Fit Artboard to selected Art",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Artboards > Fit to Selected Art",
                de: "Objekt > Zeichenfl\u00e4chen > An ausgew\u00e4hlte Grafik anpassen",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 > \u041f\u043e\u0434\u043e\u0433\u043d\u0430\u0442\u044c \u043f\u043e \u0433\u0440\u0430\u043d\u0438\u0446\u0430\u043c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u043e\u0439 \u0438\u043b\u043b\u044e\u0441\u0442\u0440\u0430\u0446\u0438\u0438",
                "zh-cn": "Object > Artboards > Fit to Selected Art",
                zh_TW: "\u7269\u4ef6 > Artboards > Fit to Selected Art",
            },
            hidden: false,
        },
        menu_1205: {
            id: "menu_setGraphStyle",
            action: "setGraphStyle",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Object > Graph > Type...",
                de: "Objekt > Diagramm > Art \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 > \u0422\u0438\u043f\u2026",
                "zh-cn": "Object > Graph > Type...",
                zh_TW: "\u7269\u4ef6 > Graph > Type...",
            },
            hidden: false,
        },
        menu_1206: {
            id: "menu_editGraphData",
            action: "editGraphData",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Graph > Data...",
                de: "Objekt > Diagramm > Daten \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 > \u0414\u0430\u043d\u043d\u044b\u0435\u2026",
                "zh-cn": "Object > Graph > Data...",
                zh_TW: "\u7269\u4ef6 > Graph > Data...",
            },
            hidden: false,
        },
        menu_1207: {
            id: "menu_graphDesigns",
            action: "graphDesigns",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Graph > Design...",
                de: "Objekt > Diagramm > Designs \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435\u2026",
                "zh-cn": "Object > Graph > Design...",
                zh_TW: "\u7269\u4ef6 > Graph > Design...",
            },
            hidden: false,
        },
        menu_1208: {
            id: "menu_setBarDesign",
            action: "setBarDesign",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Graph > Column...",
                de: "Objekt > Diagramm > Balken \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 > \u0421\u0442\u043e\u043b\u0431\u0435\u0446\u2026",
                "zh-cn": "Object > Graph > Column...",
                zh_TW: "\u7269\u4ef6 > Graph > Column...",
            },
            hidden: false,
        },
        menu_1209: {
            id: "menu_setIconDesign",
            action: "setIconDesign",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Object > Graph > Marker...",
                de: "Objekt > Diagramm > Punkte \u2026",
                ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 > \u041c\u0430\u0440\u043a\u0435\u0440\u2026",
                "zh-cn": "Object > Graph > Marker...",
                zh_TW: "\u7269\u4ef6 > Graph > Marker...",
            },
            hidden: false,
        },
        menu_1210: {
            id: "menu_Browse_Typekit_Fonts_Menu_IllustratorUI",
            action: "Browse Typekit Fonts Menu IllustratorUI",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Type > More from Adobe Fonts...",
                de: "Schrift > Mehr bei Adobe Fonts \u2026",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u041d\u0430\u0439\u0442\u0438 \u0431\u043e\u043b\u044c\u0448\u0435 \u0432 Adobe Fonts...",
                "zh-cn": "Type > More from Adobe Fonts...",
                zh_TW: "\u6587\u5b57 > More from Adobe Fonts...",
            },
            hidden: false,
            minVersion: "17.1",
        },
        menu_1211: {
            id: "menu_alternate_glyph_palette_plugin",
            action: "alternate glyph palette plugin",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Type > Glyphs",
                de: "Schrift > Glyphen",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0413\u043b\u0438\u0444\u044b",
                "zh-cn": "Type > Glyphs",
                zh_TW: "\u6587\u5b57 > Glyphs",
            },
            hidden: false,
        },
        menu_1212: {
            id: "menu_point-area",
            action: "point-area",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Convert to Area Type / Point Type",
                de: "Type > Convert to Area Type / Point Type",
                ru: "Type > Convert to Area Type / Point Type",
                "zh-cn": "Type > Convert to Area Type / Point Type",
                zh_TW: "\u6587\u5b57 > Convert to Area Type / Point Type",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_1213: {
            id: "menu_area-type-options",
            action: "area-type-options",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Area Type Options...",
                de: "Schrift > Fl\u00e4chentextoptionen \u2026",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0442\u0435\u043a\u0441\u0442\u0430 \u0432 \u043e\u0431\u043b\u0430\u0441\u0442\u0438\u2026",
                "zh-cn": "Type > Area Type Options...",
                zh_TW: "\u6587\u5b57 > Area Type Options...",
            },
            hidden: false,
        },
        menu_1214: {
            id: "menu_Rainbow",
            action: "Rainbow",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Type on a Path > Rainbow",
                de: "Schrift > Pfadtext > Regenbogen",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443 > \u0420\u0430\u0434\u0443\u0433\u0430",
                "zh-cn": "Type > Type on a Path > Rainbow",
                zh_TW: "\u6587\u5b57 > \u8def\u5f91\u6587\u5b57 > Rainbow",
            },
            hidden: false,
        },
        menu_1215: {
            id: "menu_Skew",
            action: "Skew",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Type on a Path > Skew",
                de: "Schrift > Pfadtext > Asymmetrie",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443 > \u041d\u0430\u043a\u043b\u043e\u043d",
                "zh-cn": "Type > Type on a Path > Skew",
                zh_TW: "\u6587\u5b57 > \u8def\u5f91\u6587\u5b57 > Skew",
            },
            hidden: false,
        },
        menu_1216: {
            id: "menu_3D_ribbon",
            action: "3D ribbon",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Type on a Path > 3D Ribbon",
                de: "Schrift > Pfadtext > 3D-Band",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443 > \u041a\u0430\u0441\u043a\u0430\u0434",
                "zh-cn": "Type > Type on a Path > 3D Ribbon",
                zh_TW: "\u6587\u5b57 > \u8def\u5f91\u6587\u5b57 > 3D Ribbon",
            },
            hidden: false,
        },
        menu_1217: {
            id: "menu_Stair_Step",
            action: "Stair Step",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Type on a Path > Stair Step",
                de: "Schrift > Pfadtext > Treppenstufe",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443 > \u041b\u0435\u0441\u0435\u043d\u043a\u0430",
                "zh-cn": "Type > Type on a Path > Stair Step",
                zh_TW: "\u6587\u5b57 > \u8def\u5f91\u6587\u5b57 > Stair Step",
            },
            hidden: false,
        },
        menu_1218: {
            id: "menu_Gravity",
            action: "Gravity",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Type on a Path > Gravity",
                de: "Schrift > Pfadtext > Schwerkraft",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443 > \u0413\u0440\u0430\u0432\u0438\u0442\u0430\u0446\u0438\u044f",
                "zh-cn": "Type > Type on a Path > Gravity",
                zh_TW: "\u6587\u5b57 > \u8def\u5f91\u6587\u5b57 > Gravity",
            },
            hidden: false,
        },
        menu_1219: {
            id: "menu_typeOnPathOptions",
            action: "typeOnPathOptions",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Type on a Path > Type on a Path Options...",
                de: "Schrift > Pfadtext > Pfadtextoptionen \u2026",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0442\u0435\u043a\u0441\u0442\u0430 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443...",
                "zh-cn": "Type > Type on a Path > Type on a Path Options...",
                zh_TW: "\u6587\u5b57 > \u8def\u5f91\u6587\u5b57 > \u8def\u5f91\u6587\u5b57\u9078\u9805\u2026",
            },
            hidden: false,
        },
        menu_1220: {
            id: "menu_updateLegacyTOP",
            action: "updateLegacyTOP",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Type on a Path > Update Legacy Type on a Path",
                de: "Schrift > Pfadtext > Alten Pfadtext aktualisieren",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443 > \u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u043f\u0440\u0435\u0436\u043d\u044e\u044e \u0432\u0435\u0440\u0441\u0438\u044e \u0442\u0435\u043a\u0441\u0442\u0430 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443",
                "zh-cn": "Type > Type on a Path > Update Legacy Type on a Path",
                zh_TW: "\u6587\u5b57 > \u8def\u5f91\u6587\u5b57 > \u66f4\u65b0\u820a\u7248\u8def\u5f91\u6587\u5b57",
            },
            hidden: false,
        },
        menu_1221: {
            id: "menu_threadTextCreate",
            action: "threadTextCreate",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Threaded Text > Create",
                de: "Schrift > Verketteter Text > Erstellen",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0421\u0432\u044f\u0437\u0430\u043d\u043d\u044b\u0435 \u0442\u0435\u043a\u0441\u0442\u043e\u0432\u044b\u0435 \u0431\u043b\u043e\u043a\u0438 > \u0421\u0432\u044f\u0437\u0430\u0442\u044c",
                "zh-cn": "Type > Threaded Text > Create",
                zh_TW: "\u6587\u5b57 > Threaded Text > Create",
            },
            hidden: false,
        },
        menu_1222: {
            id: "menu_releaseThreadedTextSelection",
            action: "releaseThreadedTextSelection",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Threaded Text > Release Selection",
                de: "Schrift > Verketteter Text > Auswahl zur\u00fcckwandeln",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0421\u0432\u044f\u0437\u0430\u043d\u043d\u044b\u0435 \u0442\u0435\u043a\u0441\u0442\u043e\u0432\u044b\u0435 \u0431\u043b\u043e\u043a\u0438 > \u0418\u0441\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0435",
                "zh-cn": "Type > Threaded Text > Release Selection",
                zh_TW: "\u6587\u5b57 > Threaded Text > Release Selection",
            },
            hidden: false,
        },
        menu_1223: {
            id: "menu_removeThreading",
            action: "removeThreading",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Threaded Text > Remove Threading",
                de: "Schrift > Verketteter Text > Verkettung entfernen",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0421\u0432\u044f\u0437\u0430\u043d\u043d\u044b\u0435 \u0442\u0435\u043a\u0441\u0442\u043e\u0432\u044b\u0435 \u0431\u043b\u043e\u043a\u0438 > \u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0441\u0432\u044f\u0437\u044c \u0442\u0435\u043a\u0441\u0442\u043e\u0432\u044b\u0445 \u0431\u043b\u043e\u043a\u043e\u0432",
                "zh-cn": "Type > Threaded Text > Remove Threading",
                zh_TW: "\u6587\u5b57 > Threaded Text > Remove Threading",
            },
            hidden: false,
        },
        menu_1224: {
            id: "menu_fitHeadline",
            action: "fitHeadline",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Fit Headline",
                de: "Schrift > \u00dcberschrift einpassen",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0420\u0430\u0437\u043e\u0433\u043d\u0430\u0442\u044c \u0437\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a",
                "zh-cn": "Type > Fit Headline",
                zh_TW: "\u6587\u5b57 > Fit Headline",
            },
            hidden: false,
        },
        menu_1225: {
            id: "menu_Adobe_IllustratorUI_Resolve_Missing_Font",
            action: "Adobe IllustratorUI Resolve Missing Font",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Type > Resolve Missing Fonts...",
                de: "Schrift > Fehlende Schriftarten aufl\u00f6sen \u2026",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0421\u043e\u043f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044e\u0449\u0438\u0435 \u0448\u0440\u0438\u0444\u0442\u044b...",
                "zh-cn": "Type > Resolve Missing Fonts...",
                zh_TW: "\u6587\u5b57 > Resolve Missing Fonts...",
            },
            hidden: false,
        },
        menu_1226: {
            id: "menu_Adobe_Illustrator_Find_Font_Menu_Item",
            action: "Adobe Illustrator Find Font Menu Item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Type > Find/Replace Font...",
                de: "Schrift > Schriftart suchen/ersetzen \u2026",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u041d\u0430\u0439\u0442\u0438/\u0437\u0430\u043c\u0435\u043d\u0438\u0442\u044c \u0448\u0440\u0438\u0444\u0442...",
                "zh-cn": "Type > Find/Replace Font...",
                zh_TW: "\u6587\u5b57 > Find/Replace Font...",
            },
            hidden: false,
        },
        menu_1227: {
            id: "menu_UpperCase_Change_Case_Item",
            action: "UpperCase Change Case Item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Change Case > UPPERCASE",
                de: "Schrift > Gro\u00df-/Kleinschreibung \u00e4ndern > GROSSBUCHSTABEN",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0440\u0435\u0433\u0438\u0441\u0442\u0440 > \u0412\u0421\u0415 \u041f\u0420\u041e\u041f\u0418\u0421\u041d\u042b\u0415",
                "zh-cn": "Type > Change Case > UPPERCASE",
                zh_TW: "\u6587\u5b57 > Change Case > UPPERCASE",
            },
            hidden: false,
        },
        menu_1228: {
            id: "menu_LowerCase_Change_Case_Item",
            action: "LowerCase Change Case Item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Change Case > lowercase",
                de: "Schrift > Gro\u00df-/Kleinschreibung \u00e4ndern > kleinbuchstaben",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0440\u0435\u0433\u0438\u0441\u0442\u0440 > \u0432\u0441\u0435 \u0441\u0442\u0440\u043e\u0447\u043d\u044b\u0435",
                "zh-cn": "Type > Change Case > lowercase",
                zh_TW: "\u6587\u5b57 > Change Case > lowercase",
            },
            hidden: false,
        },
        menu_1229: {
            id: "menu_Title_Case_Change_Case_Item",
            action: "Title Case Change Case Item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Change Case > Title Case",
                de: "Schrift > Gro\u00df-/Kleinschreibung \u00e4ndern > Erster Buchstabe Im Wort Gro\u00df",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0440\u0435\u0433\u0438\u0441\u0442\u0440 > \u041f\u0440\u043e\u043f\u0438\u0441\u043d\u0430\u044f \u0412 \u041d\u0430\u0447\u0430\u043b\u0435 \u041a\u0430\u0436\u0434\u043e\u0433\u043e \u0421\u043b\u043e\u0432\u0430",
                "zh-cn": "Type > Change Case > Title Case",
                zh_TW: "\u6587\u5b57 > Change Case > Title Case",
            },
            hidden: false,
        },
        menu_1230: {
            id: "menu_Sentence_case_Change_Case_Item",
            action: "Sentence case Change Case Item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Change Case > Sentence case",
                de: "Schrift > Gro\u00df-/Kleinschreibung \u00e4ndern > Erster buchstabe im satz gro\u00df",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0440\u0435\u0433\u0438\u0441\u0442\u0440 > \u041f\u0440\u043e\u043f\u0438\u0441\u043d\u0430\u044f \u0432 \u043d\u0430\u0447\u0430\u043b\u0435 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f",
                "zh-cn": "Type > Change Case > Sentence case",
                zh_TW: "\u6587\u5b57 > Change Case > Sentence case",
            },
            hidden: false,
        },
        menu_1231: {
            id: "menu_Adobe_Illustrator_Smart_Punctuation_Menu_Item",
            action: "Adobe Illustrator Smart Punctuation Menu Item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Type > Smart Punctuation...",
                de: "Schrift > Satz-/Sonderzeichen \u2026",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0438\u043f\u043e\u0433\u0440\u0430\u0444\u0441\u043a\u0430\u044f \u043f\u0443\u043d\u043a\u0442\u0443\u0430\u0446\u0438\u044f...",
                "zh-cn": "Type > Smart Punctuation...",
                zh_TW: "\u6587\u5b57 > Smart Punctuation...",
            },
            hidden: false,
        },
        menu_1232: {
            id: "menu_outline",
            action: "outline",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Create Outlines",
                de: "Schrift > In Pfade umwandeln",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 \u043a\u0440\u0438\u0432\u044b\u0435",
                "zh-cn": "Type > Create Outlines",
                zh_TW: "\u6587\u5b57 > Create Outlines",
            },
            hidden: false,
        },
        menu_1233: {
            id: "menu_Adobe_Optical_Alignment_Item",
            action: "Adobe Optical Alignment Item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Optical Margin Alignment",
                de: "Schrift > Optischer Randausgleich",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u0412\u0438\u0437\u0443\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435 \u043f\u043e\u043b\u0435\u0439",
                "zh-cn": "Type > Optical Margin Alignment",
                zh_TW: "\u6587\u5b57 > Optical Margin Alignment",
            },
            hidden: false,
        },
        menu_2094: {
            id: "menu_ReTypeTypeMenu",
            action: "ReTypeTypeMenu",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Retype",
                de: "Type > Retype",
                ru: "Type > Retype",
                "zh-cn": "Type > Retype",
                zh_TW: "\u6587\u5b57 > Retype",
            },
            hidden: false,
            minVersion: "30.5",
        },
        menu_2095: {
            id: "menu_GenerateTextTypeMenu",
            action: "GenerateTextTypeMenu",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Rewrite...",
                de: "Type > Rewrite...",
                ru: "Type > Rewrite...",
                "zh-cn": "Type > Rewrite...",
                zh_TW: "\u6587\u5b57 > Rewrite...",
            },
            hidden: false,
            minVersion: "30.5.0",
        },
        menu_1234: {
            id: "menu_convert_list_style_to_text",
            action: "convert list style to text",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Bullets and Numbering > Convert to text",
                de: "Schrift > Aufz\u00e4hlungszeichen und Nummerierung > In Text konvertieren",
                ru: "Type > Bullets and Numbering > Convert to text",
                "zh-cn": "Type > Bullets and Numbering > Convert to text",
                zh_TW: "\u6587\u5b57 > Bullets and Numbering > Convert to text",
            },
            hidden: false,
            minVersion: "27.1",
        },
        menu_2001: {
            id: "menu_~bullet",
            action: "~bullet",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Type > Insert Special Character > Symbols > Bullet",
                de: "Type > Insert Special Character > Symbols > Bullet",
                ru: "Type > Insert Special Character > Symbols > Bullet",
                "zh-cn": "Type > Insert Special Character > Symbols > Bullet",
                zh_TW: "\u6587\u5b57 > Insert Special Character > Symbols > Bullet",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2002: {
            id: "menu_~copyright",
            action: "~copyright",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert Special Character > Symbols > Copyright Symbol",
                de: "Type > Insert Special Character > Symbols > Copyright Symbol",
                ru: "Type > Insert Special Character > Symbols > Copyright Symbol",
                "zh-cn": "Type > Insert Special Character > Symbols > Copyright Symbol",
                zh_TW: "\u6587\u5b57 > Insert Special Character > Symbols > Copyright Symbol",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2003: {
            id: "menu_~ellipsis",
            action: "~ellipsis",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert Special Character > Symbols > Ellipsis",
                de: "Type > Insert Special Character > Symbols > Ellipsis",
                ru: "Type > Insert Special Character > Symbols > Ellipsis",
                "zh-cn": "Type > Insert Special Character > Symbols > Ellipsis",
                zh_TW: "\u6587\u5b57 > Insert Special Character > Symbols > Ellipsis",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2004: {
            id: "menu_~paragraphSymbol",
            action: "~paragraphSymbol",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert Special Character > Symbols > Paragraph Symbol",
                de: "Type > Insert Special Character > Symbols > Paragraph Symbol",
                ru: "Type > Insert Special Character > Symbols > Paragraph Symbol",
                "zh-cn": "Type > Insert Special Character > Symbols > Paragraph Symbol",
                zh_TW: "\u6587\u5b57 > Insert Special Character > Symbols > Paragraph Symbol",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2005: {
            id: "menu_~registeredTrademark",
            action: "~registeredTrademark",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert Special Character > Symbols > Registered Trademark Symbol",
                de: "Type > Insert Special Character > Symbols > Registered Trademark Symbol",
                ru: "Type > Insert Special Character > Symbols > Registered Trademark Symbol",
                "zh-cn":
                    "Type > Insert Special Character > Symbols > Registered Trademark Symbol",
                zh_TW: "\u6587\u5b57 > Insert Special Character > Symbols > Registered Trademark Symbol",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2006: {
            id: "menu_~sectionSymbol",
            action: "~sectionSymbol",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert Special Character > Symbols > Section Symbol",
                de: "Type > Insert Special Character > Symbols > Section Symbol",
                ru: "Type > Insert Special Character > Symbols > Section Symbol",
                "zh-cn": "Type > Insert Special Character > Symbols > Section Symbol",
                zh_TW: "\u6587\u5b57 > Insert Special Character > Symbols > Section Symbol",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2007: {
            id: "menu_~trademarkSymbol",
            action: "~trademarkSymbol",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert Special Character > Symbols > Trademark Symbol",
                de: "Type > Insert Special Character > Symbols > Trademark Symbol",
                ru: "Type > Insert Special Character > Symbols > Trademark Symbol",
                "zh-cn": "Type > Insert Special Character > Symbols > Trademark Symbol",
                zh_TW: "\u6587\u5b57 > Insert Special Character > Symbols > Trademark Symbol",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2008: {
            id: "menu_~emDash",
            action: "~emDash",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert Special Character > Hyphens And Dashes > Em Dash",
                de: "Type > Insert Special Character > Hyphens And Dashes > Em Dash",
                ru: "Type > Insert Special Character > Hyphens And Dashes > Em Dash",
                "zh-cn":
                    "Type > Insert Special Character > Hyphens And Dashes > Em Dash",
                zh_TW: "\u6587\u5b57 > Insert Special Character > Hyphens And Dashes > Em Dash",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2009: {
            id: "menu_~enDash",
            action: "~enDash",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert Special Character > Hyphens And Dashes > En Dash",
                de: "Type > Insert Special Character > Hyphens And Dashes > En Dash",
                ru: "Type > Insert Special Character > Hyphens And Dashes > En Dash",
                "zh-cn":
                    "Type > Insert Special Character > Hyphens And Dashes > En Dash",
                zh_TW: "\u6587\u5b57 > Insert Special Character > Hyphens And Dashes > En Dash",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2010: {
            id: "menu_~discretionaryHyphen",
            action: "~discretionaryHyphen",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert Special Character > Hyphens And Dashes > Discretionary Hyphen",
                de: "Type > Insert Special Character > Hyphens And Dashes > Discretionary Hyphen",
                ru: "Type > Insert Special Character > Hyphens And Dashes > Discretionary Hyphen",
                "zh-cn":
                    "Type > Insert Special Character > Hyphens And Dashes > Discretionary Hyphen",
                zh_TW: "\u6587\u5b57 > Insert Special Character > Hyphens And Dashes > Discretionary Hyphen",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2011: {
            id: "menu_~doubleLeftQuote",
            action: "~doubleLeftQuote",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert Special Character > Quotation Marks > Double Left Quotation Marks",
                de: "Type > Insert Special Character > Quotation Marks > Double Left Quotation Marks",
                ru: "Type > Insert Special Character > Quotation Marks > Double Left Quotation Marks",
                "zh-cn":
                    "Type > Insert Special Character > Quotation Marks > Double Left Quotation Marks",
                zh_TW: "\u6587\u5b57 > Insert Special Character > Quotation Marks > Double Left Quotation Marks",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2012: {
            id: "menu_~doubleRightQuote",
            action: "~doubleRightQuote",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert Special Character > Quotation Marks > Double Right Quotation Marks",
                de: "Type > Insert Special Character > Quotation Marks > Double Right Quotation Marks",
                ru: "Type > Insert Special Character > Quotation Marks > Double Right Quotation Marks",
                "zh-cn":
                    "Type > Insert Special Character > Quotation Marks > Double Right Quotation Marks",
                zh_TW: "\u6587\u5b57 > Insert Special Character > Quotation Marks > Double Right Quotation Marks",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2013: {
            id: "menu_~singleLeftQuote",
            action: "~singleLeftQuote",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert Special Character > Quotation Marks > Single Left Quotation Marks",
                de: "Type > Insert Special Character > Quotation Marks > Single Left Quotation Marks",
                ru: "Type > Insert Special Character > Quotation Marks > Single Left Quotation Marks",
                "zh-cn":
                    "Type > Insert Special Character > Quotation Marks > Single Left Quotation Marks",
                zh_TW: "\u6587\u5b57 > Insert Special Character > Quotation Marks > Single Left Quotation Marks",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2014: {
            id: "menu_~singleRightQuote",
            action: "~singleRightQuote",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert Special Character > Quotation Marks > Single Right Quotation Marks",
                de: "Type > Insert Special Character > Quotation Marks > Single Right Quotation Marks",
                ru: "Type > Insert Special Character > Quotation Marks > Single Right Quotation Marks",
                "zh-cn":
                    "Type > Insert Special Character > Quotation Marks > Single Right Quotation Marks",
                zh_TW: "\u6587\u5b57 > Insert Special Character > Quotation Marks > Single Right Quotation Marks",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2015: {
            id: "menu_~emSpace",
            action: "~emSpace",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert WhiteSpace Character > Em Space",
                de: "Type > Insert WhiteSpace Character > Em Space",
                ru: "Type > Insert WhiteSpace Character > Em Space",
                "zh-cn": "Type > Insert WhiteSpace Character > Em Space",
                zh_TW: "\u6587\u5b57 > Insert WhiteSpace Character > Em Space",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2016: {
            id: "menu_~enSpace",
            action: "~enSpace",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert WhiteSpace Character > En Space",
                de: "Type > Insert WhiteSpace Character > En Space",
                ru: "Type > Insert WhiteSpace Character > En Space",
                "zh-cn": "Type > Insert WhiteSpace Character > En Space",
                zh_TW: "\u6587\u5b57 > Insert WhiteSpace Character > En Space",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2017: {
            id: "menu_~hairSpace",
            action: "~hairSpace",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert WhiteSpace Character > Hair Space",
                de: "Type > Insert WhiteSpace Character > Hair Space",
                ru: "Type > Insert WhiteSpace Character > Hair Space",
                "zh-cn": "Type > Insert WhiteSpace Character > Hair Space",
                zh_TW: "\u6587\u5b57 > Insert WhiteSpace Character > Hair Space",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2018: {
            id: "menu_~thinSpace",
            action: "~thinSpace",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert WhiteSpace Character > Thin Space",
                de: "Type > Insert WhiteSpace Character > Thin Space",
                ru: "Type > Insert WhiteSpace Character > Thin Space",
                "zh-cn": "Type > Insert WhiteSpace Character > Thin Space",
                zh_TW: "\u6587\u5b57 > Insert WhiteSpace Character > Thin Space",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2019: {
            id: "menu_~forcedLineBreak",
            action: "~forcedLineBreak",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Insert Break Character > Forced Line Break",
                de: "Type > Insert Break Character > Forced Line Break",
                ru: "Type > Insert Break Character > Forced Line Break",
                "zh-cn": "Type > Insert Break Character > Forced Line Break",
                zh_TW: "\u6587\u5b57 > Insert Break Character > Forced Line Break",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_1235: {
            id: "menu_showHiddenChar",
            action: "showHiddenChar",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Type > Show Hidden Characters",
                de: "Schrift > Verborgene Zeichen einblenden / ausblenden",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0441\u043a\u0440\u044b\u0442\u044b\u0435 \u0441\u0438\u043c\u0432\u043e\u043b\u044b",
                "zh-cn": "Type > Show Hidden Characters",
                zh_TW: "\u6587\u5b57 > Show Hidden Characters",
            },
            hidden: false,
        },
        menu_1236: {
            id: "menu_type-horizontal",
            action: "type-horizontal",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Type Orientation > Horizontal",
                de: "Schrift > Textausrichtung > Horizontal",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u041e\u0440\u0438\u0435\u043d\u0442\u0430\u0446\u0438\u044f \u0442\u0435\u043a\u0441\u0442\u0430 > \u0413\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u0430\u044f",
                "zh-cn": "Type > Type Orientation > Horizontal",
                zh_TW: "\u6587\u5b57 > Type Orientation > Horizontal",
            },
            hidden: false,
        },
        menu_1237: {
            id: "menu_type-vertical",
            action: "type-vertical",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Type > Type Orientation > Vertical",
                de: "Schrift > Textausrichtung > Vertikal",
                ru: "\u0422\u0435\u043a\u0441\u0442 > \u041e\u0440\u0438\u0435\u043d\u0442\u0430\u0446\u0438\u044f \u0442\u0435\u043a\u0441\u0442\u0430 > \u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u0430\u044f",
                "zh-cn": "Type > Type Orientation > Vertical",
                zh_TW: "\u6587\u5b57 > Type Orientation > Vertical",
            },
            hidden: false,
        },
        menu_1238: {
            id: "menu_selectall",
            action: "selectall",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > All",
                de: "Auswahl > Alles ausw\u00e4hlen",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0412\u0441\u0435",
                "zh-cn": "Select > All",
                zh_TW: "\u9078\u53d6 > All",
            },
            hidden: false,
        },
        menu_1239: {
            id: "menu_selectallinartboard",
            action: "selectallinartboard",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > All on Active Artboard",
                de: "Auswahl > Alles auf der aktiven Zeichenfl\u00e4che",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0412\u0441\u0435 \u043e\u0431\u044a\u0435\u043a\u0442\u044b \u0432 \u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0439 \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
                "zh-cn": "Select > All on Active Artboard",
                zh_TW: "\u9078\u53d6 > All on Active Artboard",
            },
            hidden: false,
        },
        menu_1240: {
            id: "menu_deselectall",
            action: "deselectall",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Deselect",
                de: "Auswahl > Auswahl aufheben",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
                "zh-cn": "Select > Deselect",
                zh_TW: "\u9078\u53d6 > Deselect",
            },
            hidden: false,
        },
        menu_1241: {
            id: "menu_Find_Reselect_menu_item",
            action: "Find Reselect menu item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Reselect",
                de: "Auswahl > Erneut ausw\u00e4hlen",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0412\u044b\u0434\u0435\u043b\u0438\u0442\u044c \u0441\u043d\u043e\u0432\u0430",
                "zh-cn": "Select > Reselect",
                zh_TW: "\u9078\u53d6 > Reselect",
            },
            hidden: false,
        },
        menu_1242: {
            id: "menu_Inverse_menu_item",
            action: "Inverse menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Inverse",
                de: "Auswahl > Auswahl umkehren",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0418\u043d\u0432\u0435\u0440\u0441\u0438\u044f",
                "zh-cn": "Select > Inverse",
                zh_TW: "\u9078\u53d6 > Inverse",
            },
            hidden: false,
        },
        menu_1243: {
            id: "menu_Selection_Hat_8",
            action: "Selection Hat 8",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Next Object Above",
                de: "Auswahl > N\u00e4chstes Objekt dar\u00fcber",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u043e\u0431\u044a\u0435\u043a\u0442 \u0441\u0432\u0435\u0440\u0445\u0443",
                "zh-cn": "Select > Next Object Above",
                zh_TW: "\u9078\u53d6 > Next Object Above",
            },
            hidden: false,
        },
        menu_1244: {
            id: "menu_Selection_Hat_9",
            action: "Selection Hat 9",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Next Object Below",
                de: "Auswahl > N\u00e4chstes Objekt darunter",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u043e\u0431\u044a\u0435\u043a\u0442 \u0441\u043d\u0438\u0437\u0443",
                "zh-cn": "Select > Next Object Below",
                zh_TW: "\u9078\u53d6 > Next Object Below",
            },
            hidden: false,
        },
        menu_1245: {
            id: "menu_Find_Appearance_menu_item",
            action: "Find Appearance menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Same > Appearance",
                de: "Auswahl > Gleich > Aussehen",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435",
                "zh-cn": "Select > Same > Appearance",
                zh_TW: "\u9078\u53d6 > Same > Appearance",
            },
            hidden: false,
        },
        menu_1246: {
            id: "menu_Find_Appearance_Attributes_menu_item",
            action: "Find Appearance Attributes menu item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Same > Appearance Attribute",
                de: "Auswahl > Gleich > Aussehensattribute",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0410\u0442\u0440\u0438\u0431\u0443\u0442\u044b \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u044f",
                "zh-cn": "Select > Same > Appearance Attribute",
                zh_TW: "\u9078\u53d6 > Same > Appearance Attribute",
            },
            hidden: false,
        },
        menu_1247: {
            id: "menu_Find_Blending_Mode_menu_item",
            action: "Find Blending Mode menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Same > Blending Mode",
                de: "Auswahl > Gleich > F\u00fcllmethode",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u043c \u0440\u0435\u0436\u0438\u043c\u043e\u043c \u043d\u0430\u043b\u043e\u0436\u0435\u043d\u0438\u044f",
                "zh-cn": "Select > Same > Blending Mode",
                zh_TW: "\u9078\u53d6 > Same > Blending Mode",
            },
            hidden: false,
        },
        menu_1248: {
            id: "menu_Find_Fill_&_Stroke_menu_item",
            action: "Find Fill & Stroke menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Same > Fill & Stroke",
                de: "Auswahl > Gleich > Fl\u00e4che und Kontur",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u043c\u0438 \u0437\u0430\u043b\u0438\u0432\u043a\u043e\u0439 \u0438 \u043e\u0431\u0432\u043e\u0434\u043a\u043e\u0439",
                "zh-cn": "Select > Same > Fill & Stroke",
                zh_TW: "\u9078\u53d6 > Same > Fill & Stroke",
            },
            hidden: false,
        },
        menu_1249: {
            id: "menu_Find_Fill_Color_menu_item",
            action: "Find Fill Color menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Same > Fill Color",
                de: "Auswahl > Gleich > Fl\u00e4chenfarbe",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u043c \u0446\u0432\u0435\u0442\u043e\u043c \u0437\u0430\u043b\u0438\u0432\u043a\u0438",
                "zh-cn": "Select > Same > Fill Color",
                zh_TW: "\u9078\u53d6 > Same > Fill Color",
            },
            hidden: false,
        },
        menu_1250: {
            id: "menu_Find_Opacity_menu_item",
            action: "Find Opacity menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Same > Opacity",
                de: "Auswahl > Gleich > Deckkraft",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u043e\u0439 \u043d\u0435\u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c\u044e",
                "zh-cn": "Select > Same > Opacity",
                zh_TW: "\u9078\u53d6 > Same > Opacity",
            },
            hidden: false,
        },
        menu_1251: {
            id: "menu_Find_Stroke_Color_menu_item",
            action: "Find Stroke Color menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Same > Stroke Color",
                de: "Auswahl > Gleich > Konturfarbe",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u043c \u0446\u0432\u0435\u0442\u043e\u043c \u043e\u0431\u0432\u043e\u0434\u043a\u0438",
                "zh-cn": "Select > Same > Stroke Color",
                zh_TW: "\u9078\u53d6 > Same > Stroke Color",
            },
            hidden: false,
        },
        menu_1252: {
            id: "menu_Find_Stroke_Weight_menu_item",
            action: "Find Stroke Weight menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Same > Stroke Weight",
                de: "Auswahl > Gleich > Konturst\u00e4rke",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u043e\u0439 \u0442\u043e\u043b\u0449\u0438\u043d\u043e\u0439 \u043e\u0431\u0432\u043e\u0434\u043a\u0438",
                "zh-cn": "Select > Same > Stroke Weight",
                zh_TW: "\u9078\u53d6 > Same > Stroke Weight",
            },
            hidden: false,
        },
        menu_1253: {
            id: "menu_Find_Style_menu_item",
            action: "Find Style menu item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Same > Graphic Style",
                de: "Auswahl > Gleich > Grafikstil",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421\u0442\u0438\u043b\u044c \u0433\u0440\u0430\u0444\u0438\u043a\u0438",
                "zh-cn": "Select > Same > Graphic Style",
                zh_TW: "\u9078\u53d6 > Same > Graphic Style",
            },
            hidden: false,
        },
        menu_1254: {
            id: "menu_Find_Live_Shape_menu_item",
            action: "Find Live Shape menu item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Same > Shape",
                de: "Auswahl > Gleich > Form",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0424\u0438\u0433\u0443\u0440\u0430",
                "zh-cn": "Select > Same > Shape",
                zh_TW: "\u9078\u53d6 > Same > Shape",
            },
            hidden: false,
        },
        menu_1255: {
            id: "menu_Find_Symbol_Instance_menu_item",
            action: "Find Symbol Instance menu item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Same > Symbol Instance",
                de: "Auswahl > Gleich > Symbolinstanz",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u041e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u0435 \u043e\u0431\u0440\u0430\u0437\u0446\u044b \u0441\u0438\u043c\u0432\u043e\u043b\u0430",
                "zh-cn": "Select > Same > Symbol Instance",
                zh_TW: "\u9078\u53d6 > Same > Symbol Instance",
            },
            hidden: false,
        },
        menu_1256: {
            id: "menu_Find_Link_Block_Series_menu_item",
            action: "Find Link Block Series menu item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Same > Link Block Series",
                de: "Auswahl > Gleich > Verkn\u00fcpfungsblockreihen",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u041f\u043e\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u0441\u0432\u044f\u0437\u0430\u043d\u043d\u044b\u0445 \u0431\u043b\u043e\u043a\u043e\u0432",
                "zh-cn": "Select > Same > Link Block Series",
                zh_TW: "\u9078\u53d6 > Same > Link Block Series",
            },
            hidden: false,
        },
        menu_1257: {
            id: "menu_Find_Text_Font_Family_menu_item",
            action: "Find Text Font Family menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Same > Font Family",
                de: "Auswahl > Gleich > Schriftfamilie",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421\u0435\u043c\u0435\u0439\u0441\u0442\u0432\u043e \u0448\u0440\u0438\u0444\u0442\u043e\u0432",
                "zh-cn": "Select > Same > Font Family",
                zh_TW: "\u9078\u53d6 > Same > Font Family",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1258: {
            id: "menu_Find_Text_Font_Family_Style_menu_item",
            action: "Find Text Font Family Style menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Same > Font Family & Style",
                de: "Auswahl > Gleich > Schriftfamilie und -schnitt",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421\u0435\u043c\u0435\u0439\u0441\u0442\u0432\u043e \u0438 \u0441\u0442\u0438\u043b\u044c \u0448\u0440\u0438\u0444\u0442\u043e\u0432",
                "zh-cn": "Select > Same > Font Family & Style",
                zh_TW: "\u9078\u53d6 > Same > Font Family & Style",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1259: {
            id: "menu_Find_Text_Font_Family_Style_Size_menu_item",
            action: "Find Text Font Family Style Size menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Same > Font Family, Style & Size",
                de: "Auswahl > Gleich > Schriftfamilie, -schnitt und -grad",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421\u0435\u043c\u0435\u0439\u0441\u0442\u0432\u043e, \u0441\u0442\u0438\u043b\u044c \u0438 \u0440\u0430\u0437\u043c\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u043e\u0432",
                "zh-cn": "Select > Same > Font Family, Style & Size",
                zh_TW: "\u9078\u53d6 > Same > Font Family, Style & Size",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1260: {
            id: "menu_Find_Text_Font_Size_menu_item",
            action: "Find Text Font Size menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Same > Font Size",
                de: "Auswahl > Gleich > Schriftgrad",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0420\u0430\u0437\u043c\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430",
                "zh-cn": "Select > Same > Font Size",
                zh_TW: "\u9078\u53d6 > Same > Font Size",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1261: {
            id: "menu_Find_Text_Fill_Color_menu_item",
            action: "Find Text Fill Color menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Same > Text Fill Color",
                de: "Auswahl > Gleich > Textfl\u00e4chenfarbe",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0426\u0432\u0435\u0442 \u0437\u0430\u043b\u0438\u0432\u043a\u0438 \u0442\u0435\u043a\u0441\u0442\u0430",
                "zh-cn": "Select > Same > Text Fill Color",
                zh_TW: "\u9078\u53d6 > Same > Text Fill Color",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1262: {
            id: "menu_Find_Text_Stroke_Color_menu_item",
            action: "Find Text Stroke Color menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Same > Text Stroke Color",
                de: "Auswahl > Gleich > Textkonturfarbe",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0426\u0432\u0435\u0442 \u043e\u0431\u0432\u043e\u0434\u043a\u0438 \u0442\u0435\u043a\u0441\u0442\u0430",
                "zh-cn": "Select > Same > Text Stroke Color",
                zh_TW: "\u9078\u53d6 > Same > Text Stroke Color",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1263: {
            id: "menu_Find_Text_Fill_Stroke_Color_menu_item",
            action: "Find Text Fill Stroke Color menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Same > Text Fill & Stroke Color",
                de: "Auswahl > Gleich > Textfl\u00e4chen- und -konturfarbe",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0426\u0432\u0435\u0442 \u0437\u0430\u043b\u0438\u0432\u043a\u0438 \u0438 \u043e\u0431\u0432\u043e\u0434\u043a\u0438 \u0442\u0435\u043a\u0441\u0442\u0430",
                "zh-cn": "Select > Same > Text Fill & Stroke Color",
                zh_TW: "\u9078\u53d6 > Same > Text Fill & Stroke Color",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1264: {
            id: "menu_Selection_Hat_3",
            action: "Selection Hat 3",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Object > All on Same Layers",
                de: "Auswahl > Objekt > Alles auf denselben Ebenen",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u0412\u0441\u0435 \u043d\u0430 \u044d\u0442\u043e\u043c \u0436\u0435 \u0441\u043b\u043e\u0435",
                "zh-cn": "Select > Object > All on Same Layers",
                zh_TW: "\u9078\u53d6 > \u7269\u4ef6 > All on Same Layers",
            },
            hidden: false,
        },
        menu_1265: {
            id: "menu_Selection_Hat_1",
            action: "Selection Hat 1",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Object > Direction Handles",
                de: "Auswahl > Objekt > Richtungsgriffe",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u0423\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435 \u043c\u0430\u043d\u0438\u043f\u0443\u043b\u044f\u0442\u043e\u0440\u044b",
                "zh-cn": "Select > Object > Direction Handles",
                zh_TW: "\u9078\u53d6 > \u7269\u4ef6 > Direction Handles",
            },
            hidden: false,
        },
        menu_1266: {
            id: "menu_Bristle_Brush_Strokes_menu_item",
            action: "Bristle Brush Strokes menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Object > Bristle Brush Strokes",
                de: "Auswahl > Objekt > Borstenpinselstriche",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u041c\u0430\u0437\u043a\u0438 \u0434\u043b\u044f \u043a\u0438\u0441\u0442\u0438 \u0438\u0437 \u0449\u0435\u0442\u0438\u043d\u044b",
                "zh-cn": "Select > Object > Bristle Brush Strokes",
                zh_TW: "\u9078\u53d6 > \u7269\u4ef6 > Bristle Brush Strokes",
            },
            hidden: false,
        },
        menu_1267: {
            id: "menu_Brush_Strokes_menu_item",
            action: "Brush Strokes menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Object > Brush Strokes",
                de: "Auswahl > Objekt > Pinselkonturen",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u041c\u0430\u0437\u043a\u0438 \u043a\u0438\u0441\u0442\u0438",
                "zh-cn": "Select > Object > Brush Strokes",
                zh_TW: "\u9078\u53d6 > \u7269\u4ef6 > Brush Strokes",
            },
            hidden: false,
        },
        menu_1268: {
            id: "menu_Clipping_Masks_menu_item",
            action: "Clipping Masks menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Object > Clipping Masks",
                de: "Auswahl > Objekt > Schnittmasken",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u041e\u0431\u0442\u0440\u0430\u0432\u043e\u0447\u043d\u044b\u0435 \u043c\u0430\u0441\u043a\u0438",
                "zh-cn": "Select > Object > Clipping Masks",
                zh_TW: "\u9078\u53d6 > \u7269\u4ef6 > Clipping Masks",
            },
            hidden: false,
        },
        menu_1269: {
            id: "menu_Stray_Points_menu_item",
            action: "Stray Points menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Object > Stray Points",
                de: "Auswahl > Objekt > Einzelne Ankerpunkte",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u0418\u0437\u043e\u043b\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0435 \u0442\u043e\u0447\u043a\u0438",
                "zh-cn": "Select > Object > Stray Points",
                zh_TW: "\u9078\u53d6 > \u7269\u4ef6 > Stray Points",
            },
            hidden: false,
        },
        menu_1270: {
            id: "menu_Text_Objects_menu_item",
            action: "Text Objects menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Object > All Text Objects",
                de: "Auswahl > Objekt > Alle Textobjekte",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u0412\u0441\u0435 \u043e\u0431\u044a\u0435\u043a\u0442\u044b \u0442\u0435\u043a\u0441\u0442\u0430",
                "zh-cn": "Select > Object > All Text Objects",
                zh_TW: "\u9078\u53d6 > \u7269\u4ef6 > All Text Objects",
            },
            hidden: false,
        },
        menu_1271: {
            id: "menu_Point_Text_Objects_menu_item",
            action: "Point Text Objects menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Object > Point Type Objects",
                de: "Auswahl > Objekt > Punkttextobjekte",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u041e\u0431\u044a\u0435\u043a\u0442\u044b \u0442\u0435\u043a\u0441\u0442\u0430 \u0438\u0437 \u0442\u043e\u0447\u043a\u0438",
                "zh-cn": "Select > Object > Point Type Objects",
                zh_TW: "\u9078\u53d6 > \u7269\u4ef6 > Point Type Objects",
            },
            hidden: false,
        },
        menu_1272: {
            id: "menu_Area_Text_Objects_menu_item",
            action: "Area Text Objects menu item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Select > Object > Area Type Objects",
                de: "Auswahl > Objekt > Fl\u00e4chenttextobjekte",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u041e\u0431\u044a\u0435\u043a\u0442\u044b \u0442\u0435\u043a\u0441\u0442\u0430 \u0432 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
                "zh-cn": "Select > Object > Area Type Objects",
                zh_TW: "\u9078\u53d6 > \u7269\u4ef6 > Area Type Objects",
            },
            hidden: false,
        },
        menu_1273: {
            id: "menu_SmartEdit_Menu_Item",
            action: "SmartEdit Menu Item",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Start/Stop Global Edit",
                de: "Auswahl > Globale Bearbeitung starten/anhalten",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041d\u0430\u0447\u0430\u0442\u044c \u0433\u043b\u043e\u0431\u0430\u043b\u044c\u043d\u043e\u0435 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0435",
                "zh-cn": "Select > Start/Stop Global Edit",
                zh_TW: "\u9078\u53d6 > Start/Stop Global Edit",
            },
            hidden: false,
            minVersion: "23",
        },
        menu_1274: {
            id: "menu_Selection_Hat_10",
            action: "Selection Hat 10",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Save Selection...",
                de: "Auswahl > Auswahl speichern \u2026",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u0443\u044e \u043e\u0431\u043b\u0430\u0441\u0442\u044c\u2026",
                "zh-cn": "Select > Save Selection...",
                zh_TW: "\u9078\u53d6 > Save Selection...",
            },
            hidden: false,
        },
        menu_1275: {
            id: "menu_Selection_Hat_11",
            action: "Selection Hat 11",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Edit Selection...",
                de: "Auswahl > Auswahl bearbeiten \u2026",
                ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u0443\u044e \u043e\u0431\u043b\u0430\u0441\u0442\u044c\u2026",
                "zh-cn": "Select > Edit Selection...",
                zh_TW: "\u9078\u53d6 > Edit Selection...",
            },
            hidden: false,
        },
        menu_1276: {
            id: "menu_Selection_Hat_14",
            action: "Selection Hat 14",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Select > Update Selection",
                de: "Select > Update Selection",
                ru: "Select > Update Selection",
                "zh-cn": "Select > Update Selection",
                zh_TW: "\u9078\u53d6 > Update Selection",
            },
            hidden: false,
            minVersion: "28",
        },
        menu_1277: {
            id: "menu_Adobe_Apply_Last_Effect",
            action: "Adobe Apply Last Effect",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Apply Last Effect",
                de: "Effekt > Letzten Effekt anwenden",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c \u043f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0439 \u044d\u0444\u0444\u0435\u043a\u0442",
                "zh-cn": "Effect > Apply Last Effect",
                zh_TW: "\u6548\u679c > Apply Last Effect",
            },
            hidden: false,
        },
        menu_1278: {
            id: "menu_Adobe_Last_Effect",
            action: "Adobe Last Effect",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Last Effect",
                de: "Effekt > Letzter Effekt",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0439 \u044d\u0444\u0444\u0435\u043a\u0442",
                "zh-cn": "Effect > Last Effect",
                zh_TW: "\u6548\u679c > Last Effect",
            },
            hidden: false,
        },
        menu_1279: {
            id: "menu_Live_Rasterize_Effect_Setting",
            action: "Live Rasterize Effect Setting",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Document Raster Effects Settings...",
                de: "Effekt > Dokument-Rastereffekt-Einstellungen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0440\u0430\u0441\u0442\u0440\u043e\u0432\u044b\u0445 \u044d\u0444\u0444\u0435\u043a\u0442\u043e\u0432 \u0432 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0435...",
                "zh-cn": "Effect > Document Raster Effects Settings...",
                zh_TW: "\u6548\u679c > Document Raster Effects Settings...",
            },
            hidden: false,
        },
        menu_1280: {
            id: "menu_Live_Adobe_Geometry3D_Extrude",
            action: "Live Adobe Geometry3D Extrude",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > 3D and Materials > Extrude & Bevel...",
                de: "Effekt > 3D und Materialien > Extrudieren und abgeflachte Kante \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D \u0438 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b > \u0412\u044b\u0442\u044f\u0433\u0438\u0432\u0430\u043d\u0438\u0435 \u0438 \u0444\u0430\u0441\u043a\u0430...",
                "zh-cn": "Effect > 3D and Materials > Extrude & Bevel...",
                zh_TW: "\u6548\u679c > 3D and Materials > Extrude & Bevel...",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1281: {
            id: "menu_Live_Adobe_Geometry3D_Revolve",
            action: "Live Adobe Geometry3D Revolve",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > 3D and Materials > Revolve...",
                de: "Effekt > 3D und Materialien > Kreiseln \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D \u0438 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b > \u0412\u0440\u0430\u0449\u0435\u043d\u0438\u0435\u2026",
                "zh-cn": "Effect > 3D and Materials > Revolve...",
                zh_TW: "\u6548\u679c > 3D and Materials > Revolve...",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1282: {
            id: "menu_Live_Adobe_Geometry3D_Inflate",
            action: "Live Adobe Geometry3D Inflate",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > 3D and Materials > Inflate...",
                de: "Effekt > 3D und Materialien > Aufblasen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D \u0438 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b > \u0420\u0430\u0437\u0434\u0443\u0432\u0430\u043d\u0438\u0435\u2026",
                "zh-cn": "Effect > 3D and Materials > Inflate...",
                zh_TW: "\u6548\u679c > 3D and Materials > Inflate...",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1283: {
            id: "menu_Live_Adobe_Geometry3D_Rotate",
            action: "Live Adobe Geometry3D Rotate",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > 3D and Materials > Rotate...",
                de: "Effekt > 3D und Materialien > Drehen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D \u0438 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b > \u041f\u043e\u0432\u043e\u0440\u043e\u0442\u2026",
                "zh-cn": "Effect > 3D and Materials > Rotate...",
                zh_TW: "\u6548\u679c > 3D and Materials > Rotate...",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1284: {
            id: "menu_Live_Adobe_Geometry3D_Materials",
            action: "Live Adobe Geometry3D Materials",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > 3D and Materials > Materials...",
                de: "Effekt > 3D und Materialien > Materialien \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D \u0438 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b > \u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b\u2026",
                "zh-cn": "Effect > 3D and Materials > Materials...",
                zh_TW: "\u6548\u679c > 3D and Materials > Materials...",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1285: {
            id: "menu_Live_3DExtrude",
            action: "Live 3DExtrude",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > 3D and Materials > 3D (Classic) > Extrude & Bevel (Classic)...",
                de: "Effekt > 3D (klassisch) > Extrudieren und abgeflachte Kante (klassisch) \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D (\u043a\u043b\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043a\u043e\u0435) > \u0412\u044b\u0442\u044f\u0433\u0438\u0432\u0430\u043d\u0438\u0435 \u0438 \u0444\u0430\u0441\u043a\u0430 (\u043a\u043b\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043a\u0438\u0439)\u2026",
                "zh-cn":
                    "Effect > 3D and Materials > 3D (Classic) > Extrude & Bevel (Classic)...",
                zh_TW: "\u6548\u679c > 3D and Materials > 3D (Classic) > Extrude & Bevel (Classic)...",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1286: {
            id: "menu_Live_3DRevolve",
            action: "Live 3DRevolve",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > 3D and Materials > 3D (Classic) > Revolve (Classic)...",
                de: "Effekt > 3D (klassisch) > Kreiseln (klassisch) \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D (\u043a\u043b\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043a\u043e\u0435) > \u0412\u0440\u0430\u0449\u0435\u043d\u0438\u0435 (\u043a\u043b\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043a\u043e\u0435)\u2026",
                "zh-cn":
                    "Effect > 3D and Materials > 3D (Classic) > Revolve (Classic)...",
                zh_TW: "\u6548\u679c > 3D and Materials > 3D (Classic) > Revolve (Classic)...",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1287: {
            id: "menu_Live_3DRotate",
            action: "Live 3DRotate",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > 3D and Materials > 3D (Classic) > Rotate (Classic)...",
                de: "Effekt > 3D (klassisch) > Drehen (klassisch) \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D (\u043a\u043b\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043a\u043e\u0435) > \u041f\u043e\u0432\u043e\u0440\u043e\u0442 (\u043a\u043b\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043a\u0438\u0439)\u2026",
                "zh-cn":
                    "Effect > 3D and Materials > 3D (Classic) > Rotate (Classic)...",
                zh_TW: "\u6548\u679c > 3D and Materials > 3D (Classic) > Rotate (Classic)...",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1288: {
            id: "menu_Live_Rectangle",
            action: "Live Rectangle",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Convert to Shape > Rectangle...",
                de: "Effekt > In Form umwandeln > Rechteck \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 \u0444\u0438\u0433\u0443\u0440\u0443> \u041f\u0440\u044f\u043c\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a\u2026",
                "zh-cn": "Effect > Convert to Shape > Rectangle...",
                zh_TW: "\u6548\u679c > Convert to Shape > Rectangle...",
            },
            hidden: false,
        },
        menu_1289: {
            id: "menu_Live_Rounded_Rectangle",
            action: "Live Rounded Rectangle",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Convert to Shape > Rounded Rectangle...",
                de: "Effekt > In Form umwandeln > Abgerundetes Rechteck \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 \u0444\u0438\u0433\u0443\u0440\u0443> \u041f\u0440\u044f\u043c\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a \u0441\u043e \u0441\u043a\u0440\u0443\u0433\u043b\u0435\u043d\u043d\u044b\u043c\u0438 \u0443\u0433\u043b\u0430\u043c\u0438\u2026",
                "zh-cn": "Effect > Convert to Shape > Rounded Rectangle...",
                zh_TW: "\u6548\u679c > Convert to Shape > Rounded Rectangle...",
            },
            hidden: false,
        },
        menu_1290: {
            id: "menu_Live_Ellipse",
            action: "Live Ellipse",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Convert to Shape > Ellipse...",
                de: "Effekt > In Form umwandeln > Ellipse \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 \u0444\u0438\u0433\u0443\u0440\u0443> \u042d\u043b\u043b\u0438\u043f\u0441\u2026",
                "zh-cn": "Effect > Convert to Shape > Ellipse...",
                zh_TW: "\u6548\u679c > Convert to Shape > Ellipse...",
            },
            hidden: false,
        },
        menu_1291: {
            id: "menu_Live_Trim_Marks",
            action: "Live Trim Marks",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Crop Marks",
                de: "Effekt > Schnittmarken",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041c\u0435\u0442\u043a\u0438 \u043e\u0431\u0440\u0435\u0437\u043a\u0438",
                "zh-cn": "Effect > Crop Marks",
                zh_TW: "\u6548\u679c > Crop Marks",
            },
            hidden: false,
        },
        menu_1292: {
            id: "menu_Live_Free_Distort",
            action: "Live Free Distort",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Distort & Transform > Free Distort...",
                de: "Effekt > Verzerrungs- und Transformationsfilter > Frei verzerren \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0437\u0438\u0442\u044c \u0438 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041f\u0440\u043e\u0438\u0437\u0432\u043e\u043b\u044c\u043d\u043e\u0435 \u0438\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435...",
                "zh-cn": "Effect > Distort & Transform > Free Distort...",
                zh_TW: "\u6548\u679c > Distort & Transform > Free Distort...",
            },
            hidden: false,
        },
        menu_1293: {
            id: "menu_Live_Pucker_&_Bloat",
            action: "Live Pucker & Bloat",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Distort & Transform > Pucker & Bloat...",
                de: "Effekt > Verzerrungs- und Transformationsfilter > Zusammenziehen und aufblasen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0437\u0438\u0442\u044c \u0438 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u0412\u0442\u044f\u0433\u0438\u0432\u0430\u043d\u0438\u0435 \u0438 \u0440\u0430\u0437\u0434\u0443\u0432\u0430\u043d\u0438\u0435...",
                "zh-cn": "Effect > Distort & Transform > Pucker & Bloat...",
                zh_TW: "\u6548\u679c > Distort & Transform > Pucker & Bloat...",
            },
            hidden: false,
        },
        menu_1294: {
            id: "menu_Live_Roughen",
            action: "Live Roughen",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Distort & Transform > Roughen...",
                de: "Effekt > Verzerrungs- und Transformationsfilter > Aufrauen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0437\u0438\u0442\u044c \u0438 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041e\u0433\u0440\u0443\u0431\u043b\u0435\u043d\u0438\u0435...",
                "zh-cn": "Effect > Distort & Transform > Roughen...",
                zh_TW: "\u6548\u679c > Distort & Transform > Roughen...",
            },
            hidden: false,
        },
        menu_1295: {
            id: "menu_Live_Transform",
            action: "Live Transform",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Distort & Transform > Transform...",
                de: "Effekt > Verzerrungs- und Transformationsfilter > Transformieren \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0437\u0438\u0442\u044c \u0438 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c...",
                "zh-cn": "Effect > Distort & Transform > Transform...",
                zh_TW: "\u6548\u679c > Distort & Transform > Transform...",
            },
            hidden: false,
        },
        menu_1296: {
            id: "menu_Live_Scribble_and_Tweak",
            action: "Live Scribble and Tweak",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Distort & Transform > Tweak...",
                de: "Effekt > Verzerrungs- und Transformationsfilter > Tweak \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0437\u0438\u0442\u044c \u0438 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041f\u043e\u043c\u0430\u0440\u043a\u0438...",
                "zh-cn": "Effect > Distort & Transform > Tweak...",
                zh_TW: "\u6548\u679c > Distort & Transform > Tweak...",
            },
            hidden: false,
        },
        menu_1297: {
            id: "menu_Live_Twist",
            action: "Live Twist",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Distort & Transform > Twist...",
                de: "Effekt > Verzerrungs- und Transformationsfilter > Wirbel \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0437\u0438\u0442\u044c \u0438 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u0421\u043a\u0440\u0443\u0447\u0438\u0432\u0430\u043d\u0438\u0435...",
                "zh-cn": "Effect > Distort & Transform > Twist...",
                zh_TW: "\u6548\u679c > Distort & Transform > Twist...",
            },
            hidden: false,
        },
        menu_1298: {
            id: "menu_Live_Zig_Zag",
            action: "Live Zig Zag",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Distort & Transform > Zig Zag...",
                de: "Effekt > Verzerrungs- und Transformationsfilter > Zickzack \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0437\u0438\u0442\u044c \u0438 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u0417\u0438\u0433\u0437\u0430\u0433...",
                "zh-cn": "Effect > Distort & Transform > Zig Zag...",
                zh_TW: "\u6548\u679c > Distort & Transform > Zig Zag...",
            },
            hidden: false,
        },
        menu_1299: {
            id: "menu_Live_Offset_Path",
            action: "Live Offset Path",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Path > Offset Path...",
                de: "Effekt > Pfad > Pfad verschieben \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0430\u0440\u0430\u043b\u043b\u0435\u043b\u044c\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0443\u0440...",
                "zh-cn": "Effect > Path > Offset Path...",
                zh_TW: "\u6548\u679c > \u8def\u5f91 > \u4f4d\u79fb\u8def\u5f91\u2026",
            },
            hidden: false,
        },
        menu_1300: {
            id: "menu_Live_Outline_Object",
            action: "Live Outline Object",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Path > Outline Object",
                de: "Effekt > Pfad > Kontur nachzeichnen",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u041a\u043e\u043d\u0442\u0443\u0440\u043d\u044b\u0439 \u043e\u0431\u044a\u0435\u043a\u0442",
                "zh-cn": "Effect > Path > Outline Object",
                zh_TW: "\u6548\u679c > \u8def\u5f91 > \u7269\u4ef6\u5916\u6846",
            },
            hidden: false,
        },
        menu_1301: {
            id: "menu_Live_Outline_Stroke",
            action: "Live Outline Stroke",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Path > Outline Stroke",
                de: "Effekt > Pfad > Konturlinie",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u043e\u0431\u0432\u043e\u0434\u043a\u0443 \u0432 \u043a\u0440\u0438\u0432\u044b\u0435",
                "zh-cn": "Effect > Path > Outline Stroke",
                zh_TW: "\u6548\u679c > \u8def\u5f91 > \u5916\u6846\u7b46\u756b",
            },
            hidden: false,
        },
        menu_1302: {
            id: "menu_Live_Pathfinder_Add",
            action: "Live Pathfinder Add",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pathfinder > Add",
                de: "Effekt > Pathfinder > Hinzuf\u00fcgen",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c",
                "zh-cn": "Effect > Pathfinder > Add",
                zh_TW: "\u6548\u679c > \u8def\u5f91\u7ba1\u7406\u54e1 > Add",
            },
            hidden: false,
        },
        menu_1303: {
            id: "menu_Live_Pathfinder_Intersect",
            action: "Live Pathfinder Intersect",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pathfinder > Intersect",
                de: "Effekt > Pathfinder > Schnittmenge bilden",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u041f\u0435\u0440\u0435\u0441\u0435\u0447\u0435\u043d\u0438\u0435",
                "zh-cn": "Effect > Pathfinder > Intersect",
                zh_TW: "\u6548\u679c > \u8def\u5f91\u7ba1\u7406\u54e1 > Intersect",
            },
            hidden: false,
        },
        menu_1304: {
            id: "menu_Live_Pathfinder_Exclude",
            action: "Live Pathfinder Exclude",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pathfinder > Exclude",
                de: "Effekt > Pathfinder > Schnittmenge entfernen",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u0418\u0441\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435",
                "zh-cn": "Effect > Pathfinder > Exclude",
                zh_TW: "\u6548\u679c > \u8def\u5f91\u7ba1\u7406\u54e1 > Exclude",
            },
            hidden: false,
        },
        menu_1305: {
            id: "menu_Live_Pathfinder_Subtract",
            action: "Live Pathfinder Subtract",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pathfinder > Subtract",
                de: "Effekt > Pathfinder > Subtrahieren",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u0412\u044b\u0447\u0438\u0442\u0430\u043d\u0438\u0435",
                "zh-cn": "Effect > Pathfinder > Subtract",
                zh_TW: "\u6548\u679c > \u8def\u5f91\u7ba1\u7406\u54e1 > Subtract",
            },
            hidden: false,
        },
        menu_1306: {
            id: "menu_Live_Pathfinder_Minus_Back",
            action: "Live Pathfinder Minus Back",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pathfinder > Minus Back",
                de: "Effekt > Pathfinder > Hinteres Objekt abziehen",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u041c\u0438\u043d\u0443\u0441 \u043d\u0438\u0436\u043d\u0438\u0439",
                "zh-cn": "Effect > Pathfinder > Minus Back",
                zh_TW: "\u6548\u679c > \u8def\u5f91\u7ba1\u7406\u54e1 > Minus Back",
            },
            hidden: false,
        },
        menu_1307: {
            id: "menu_Live_Pathfinder_Divide",
            action: "Live Pathfinder Divide",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pathfinder > Divide",
                de: "Effekt > Pathfinder > Unterteilen",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u0420\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
                "zh-cn": "Effect > Pathfinder > Divide",
                zh_TW: "\u6548\u679c > \u8def\u5f91\u7ba1\u7406\u54e1 > Divide",
            },
            hidden: false,
        },
        menu_1308: {
            id: "menu_Live_Pathfinder_Trim",
            action: "Live Pathfinder Trim",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pathfinder > Trim",
                de: "Effekt > Pathfinder > \u00dcberlappungsbereich entfernen",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u041e\u0431\u0440\u0435\u0437\u043a\u0430",
                "zh-cn": "Effect > Pathfinder > Trim",
                zh_TW: "\u6548\u679c > \u8def\u5f91\u7ba1\u7406\u54e1 > Trim",
            },
            hidden: false,
        },
        menu_1309: {
            id: "menu_Live_Pathfinder_Merge",
            action: "Live Pathfinder Merge",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pathfinder > Merge",
                de: "Effekt > Pathfinder > Verdeckte Fl\u00e4che entfernen",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435",
                "zh-cn": "Effect > Pathfinder > Merge",
                zh_TW: "\u6548\u679c > \u8def\u5f91\u7ba1\u7406\u54e1 > Merge",
            },
            hidden: false,
        },
        menu_1310: {
            id: "menu_Live_Pathfinder_Crop",
            action: "Live Pathfinder Crop",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pathfinder > Crop",
                de: "Effekt > Pathfinder > Schnittmengenfl\u00e4che",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u041a\u0430\u0434\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
                "zh-cn": "Effect > Pathfinder > Crop",
                zh_TW: "\u6548\u679c > \u8def\u5f91\u7ba1\u7406\u54e1 > Crop",
            },
            hidden: false,
        },
        menu_1311: {
            id: "menu_Live_Pathfinder_Outline",
            action: "Live Pathfinder Outline",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pathfinder > Outline",
                de: "Effekt > Pathfinder > Kontur aufteilen",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u041a\u043e\u043d\u0442\u0443\u0440",
                "zh-cn": "Effect > Pathfinder > Outline",
                zh_TW: "\u6548\u679c > \u8def\u5f91\u7ba1\u7406\u54e1 > Outline",
            },
            hidden: false,
        },
        menu_1312: {
            id: "menu_Live_Pathfinder_Hard_Mix",
            action: "Live Pathfinder Hard Mix",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pathfinder > Hard Mix",
                de: "Effekt > Pathfinder > Hart mischen",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u0416\u0435\u0441\u0442\u043a\u043e\u0435 \u0441\u043c\u0435\u0448\u0438\u0432\u0430\u043d\u0438\u0435",
                "zh-cn": "Effect > Pathfinder > Hard Mix",
                zh_TW: "\u6548\u679c > \u8def\u5f91\u7ba1\u7406\u54e1 > Hard Mix",
            },
            hidden: false,
        },
        menu_1313: {
            id: "menu_Live_Pathfinder_Soft_Mix",
            action: "Live Pathfinder Soft Mix",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pathfinder > Soft Mix...",
                de: "Effekt > Pathfinder > Weich mischen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u041d\u0435\u0436\u0435\u0441\u0442\u043a\u043e\u0435 \u0441\u043c\u0435\u0448\u0438\u0432\u0430\u043d\u0438\u0435...",
                "zh-cn": "Effect > Pathfinder > Soft Mix...",
                zh_TW: "\u6548\u679c > \u8def\u5f91\u7ba1\u7406\u54e1 > Soft Mix...",
            },
            hidden: false,
        },
        menu_1314: {
            id: "menu_Live_Pathfinder_Trap",
            action: "Live Pathfinder Trap",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pathfinder > Trap...",
                de: "Effekt > Pathfinder > \u00dcberf\u00fcllen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u0422\u0440\u0435\u043f\u043f\u0438\u043d\u0433\u2026",
                "zh-cn": "Effect > Pathfinder > Trap...",
                zh_TW: "\u6548\u679c > \u8def\u5f91\u7ba1\u7406\u54e1 > Trap...",
            },
            hidden: false,
        },
        menu_1315: {
            id: "menu_Live_Rasterize",
            action: "Live Rasterize",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Rasterize...",
                de: "Effekt > In Pixelbild umwandeln \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0420\u0430\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c...",
                "zh-cn": "Effect > Rasterize...",
                zh_TW: "\u6548\u679c > Rasterize...",
            },
            hidden: false,
        },
        menu_1316: {
            id: "menu_Live_Adobe_Drop_Shadow",
            action: "Live Adobe Drop Shadow",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Stylize > Drop Shadow...",
                de: "Effekt > Stilisierungsfilter > Schlagschatten \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0421\u0442\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f > \u0422\u0435\u043d\u044c...",
                "zh-cn": "Effect > Stylize > Drop Shadow...",
                zh_TW: "\u6548\u679c > Stylize > Drop Shadow...",
            },
            hidden: false,
        },
        menu_1317: {
            id: "menu_Live_Feather",
            action: "Live Feather",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Stylize > Feather...",
                de: "Effekt > Stilisierungsfilter > Weiche Kante \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0421\u0442\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f > \u0420\u0430\u0441\u0442\u0443\u0448\u0435\u0432\u043a\u0430...",
                "zh-cn": "Effect > Stylize > Feather...",
                zh_TW: "\u6548\u679c > Stylize > Feather...",
            },
            hidden: false,
        },
        menu_1318: {
            id: "menu_Live_Inner_Glow",
            action: "Live Inner Glow",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Stylize > Inner Glow...",
                de: "Effekt > Stilisierungsfilter > Schein nach innen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0421\u0442\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f > \u0412\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0435\u0435 \u0441\u0432\u0435\u0447\u0435\u043d\u0438\u0435...",
                "zh-cn": "Effect > Stylize > Inner Glow...",
                zh_TW: "\u6548\u679c > Stylize > Inner Glow...",
            },
            hidden: false,
        },
        menu_1319: {
            id: "menu_Live_Outer_Glow",
            action: "Live Outer Glow",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Stylize > Outer Glow...",
                de: "Effekt > Stilisierungsfilter > Schein nach au\u00dfen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0421\u0442\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f > \u0412\u043d\u0435\u0448\u043d\u0435\u0435 \u0441\u0432\u0435\u0447\u0435\u043d\u0438\u0435...",
                "zh-cn": "Effect > Stylize > Outer Glow...",
                zh_TW: "\u6548\u679c > Stylize > Outer Glow...",
            },
            hidden: false,
        },
        menu_1320: {
            id: "menu_Live_Adobe_Round_Corners",
            action: "Live Adobe Round Corners",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Stylize > Round Corners...",
                de: "Effekt > Stilisierungsfilter > Ecken abrunden \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0421\u0442\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f > \u0421\u043a\u0440\u0443\u0433\u043b\u0435\u043d\u043d\u044b\u0435 \u0443\u0433\u043b\u044b...",
                "zh-cn": "Effect > Stylize > Round Corners...",
                zh_TW: "\u6548\u679c > Stylize > Round Corners...",
            },
            hidden: false,
        },
        menu_1321: {
            id: "menu_Live_Scribble_Fill",
            action: "Live Scribble Fill",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Stylize > Scribble...",
                de: "Effekt > Stilisierungsfilter > Scribble \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0421\u0442\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f > \u041a\u0430\u0440\u0430\u043a\u0443\u043b\u0438\u2026",
                "zh-cn": "Effect > Stylize > Scribble...",
                zh_TW: "\u6548\u679c > Stylize > Scribble...",
            },
            hidden: false,
        },
        menu_1324: {
            id: "menu_Live_Deform_Arc",
            action: "Live Deform Arc",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Arc...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Bogen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0414\u0443\u0433\u0430\u2026",
                "zh-cn": "Effect > Warp > Arc...",
                zh_TW: "\u6548\u679c > Warp > Arc...",
            },
            hidden: false,
        },
        menu_1325: {
            id: "menu_Live_Deform_Arc_Lower",
            action: "Live Deform Arc Lower",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Arc Lower...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Bogen unten \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0414\u0443\u0433\u0430 \u0432\u043d\u0438\u0437\u2026",
                "zh-cn": "Effect > Warp > Arc Lower...",
                zh_TW: "\u6548\u679c > Warp > Arc Lower...",
            },
            hidden: false,
        },
        menu_1326: {
            id: "menu_Live_Deform_Arc_Upper",
            action: "Live Deform Arc Upper",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Arc Upper...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Bogen oben \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0414\u0443\u0433\u0430 \u0432\u0432\u0435\u0440\u0445\u2026",
                "zh-cn": "Effect > Warp > Arc Upper...",
                zh_TW: "\u6548\u679c > Warp > Arc Upper...",
            },
            hidden: false,
        },
        menu_1327: {
            id: "menu_Live_Deform_Arch",
            action: "Live Deform Arch",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Arch...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Torbogen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0410\u0440\u043a\u0430\u2026",
                "zh-cn": "Effect > Warp > Arch...",
                zh_TW: "\u6548\u679c > Warp > Arch...",
            },
            hidden: false,
        },
        menu_1328: {
            id: "menu_Live_Deform_Bulge",
            action: "Live Deform Bulge",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Bulge...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Wulst \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0412\u044b\u043f\u0443\u043a\u043b\u043e\u0441\u0442\u044c\u2026",
                "zh-cn": "Effect > Warp > Bulge...",
                zh_TW: "\u6548\u679c > Warp > Bulge...",
            },
            hidden: false,
        },
        menu_1329: {
            id: "menu_Live_Deform_Shell_Lower",
            action: "Live Deform Shell Lower",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Shell Lower...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Muschel unten \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u041f\u0430\u043d\u0446\u0438\u0440\u044c \u0432\u043d\u0438\u0437\u2026",
                "zh-cn": "Effect > Warp > Shell Lower...",
                zh_TW: "\u6548\u679c > Warp > Shell Lower...",
            },
            hidden: false,
        },
        menu_1330: {
            id: "menu_Live_Deform_Shell_Upper",
            action: "Live Deform Shell Upper",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Shell Upper...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Muschel oben \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u041f\u0430\u043d\u0446\u0438\u0440\u044c \u0432\u0432\u0435\u0440\u0445\u2026",
                "zh-cn": "Effect > Warp > Shell Upper...",
                zh_TW: "\u6548\u679c > Warp > Shell Upper...",
            },
            hidden: false,
        },
        menu_1331: {
            id: "menu_Live_Deform_Flag",
            action: "Live Deform Flag",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Flag...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Flagge \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0424\u043b\u0430\u0433\u2026",
                "zh-cn": "Effect > Warp > Flag...",
                zh_TW: "\u6548\u679c > Warp > Flag...",
            },
            hidden: false,
        },
        menu_1332: {
            id: "menu_Live_Deform_Wave",
            action: "Live Deform Wave",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Wave...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Schwingungen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0412\u043e\u043b\u043d\u0430\u2026",
                "zh-cn": "Effect > Warp > Wave...",
                zh_TW: "\u6548\u679c > Warp > Wave...",
            },
            hidden: false,
        },
        menu_1333: {
            id: "menu_Live_Deform_Fish",
            action: "Live Deform Fish",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Fish...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Fisch \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0420\u044b\u0431\u0430\u2026",
                "zh-cn": "Effect > Warp > Fish...",
                zh_TW: "\u6548\u679c > Warp > Fish...",
            },
            hidden: false,
        },
        menu_1334: {
            id: "menu_Live_Deform_Rise",
            action: "Live Deform Rise",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Rise...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Ansteigend \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u041f\u043e\u0434\u044a\u0435\u043c\u2026",
                "zh-cn": "Effect > Warp > Rise...",
                zh_TW: "\u6548\u679c > Warp > Rise...",
            },
            hidden: false,
        },
        menu_1335: {
            id: "menu_Live_Deform_Fisheye",
            action: "Live Deform Fisheye",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Fisheye...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Fischauge \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0420\u044b\u0431\u0438\u0439 \u0433\u043b\u0430\u0437\u2026",
                "zh-cn": "Effect > Warp > Fisheye...",
                zh_TW: "\u6548\u679c > Warp > Fisheye...",
            },
            hidden: false,
        },
        menu_1336: {
            id: "menu_Live_Deform_Inflate",
            action: "Live Deform Inflate",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Inflate...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Aufblasen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0420\u0430\u0437\u0434\u0443\u0432\u0430\u043d\u0438\u0435\u2026",
                "zh-cn": "Effect > Warp > Inflate...",
                zh_TW: "\u6548\u679c > Warp > Inflate...",
            },
            hidden: false,
        },
        menu_1337: {
            id: "menu_Live_Deform_Squeeze",
            action: "Live Deform Squeeze",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Squeeze...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Stauchen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0421\u0436\u0430\u0442\u0438\u0435\u2026",
                "zh-cn": "Effect > Warp > Squeeze...",
                zh_TW: "\u6548\u679c > Warp > Squeeze...",
            },
            hidden: false,
        },
        menu_1338: {
            id: "menu_Live_Deform_Twist",
            action: "Live Deform Twist",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Warp > Twist...",
                de: "Effekt > Verkr\u00fcmmungsfilter > Wirbel \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0421\u043a\u0440\u0443\u0447\u0438\u0432\u0430\u043d\u0438\u0435\u2026",
                "zh-cn": "Effect > Warp > Twist...",
                zh_TW: "\u6548\u679c > Warp > Twist...",
            },
            hidden: false,
        },
        menu_1339: {
            id: "menu_Live_PSAdapter_plugin_GEfc",
            action: "Live PSAdapter_plugin_GEfc",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Effect Gallery...",
                de: "Effekt > Effekte-Galerie \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0413\u0430\u043b\u0435\u0440\u0435\u044f \u044d\u0444\u0444\u0435\u043a\u0442\u043e\u0432\u2026",
                "zh-cn": "Effect > Effect Gallery...",
                zh_TW: "\u6548\u679c > Effect Gallery...",
            },
            hidden: false,
        },
        menu_1340: {
            id: "menu_Live_PSAdapter_plugin_ClrP",
            action: "Live PSAdapter_plugin_ClrP",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Colored Pencil...",
                de: "Effekt > Kunstfilter > Buntstiftschraffur \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0426\u0432\u0435\u0442\u043d\u044b\u0435 \u043a\u0430\u0440\u0430\u043d\u0434\u0430\u0448\u0438\u2026",
                "zh-cn": "Effect > Artistic > Colored Pencil...",
                zh_TW: "\u6548\u679c > Artistic > Colored Pencil...",
            },
            hidden: false,
        },
        menu_1341: {
            id: "menu_Live_PSAdapter_plugin_Ct",
            action: "Live PSAdapter_plugin_Ct",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Cutout...",
                de: "Effekt > Kunstfilter > Farbpapier-Collage \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0410\u043f\u043f\u043b\u0438\u043a\u0430\u0446\u0438\u044f\u2026",
                "zh-cn": "Effect > Artistic > Cutout...",
                zh_TW: "\u6548\u679c > Artistic > Cutout...",
            },
            hidden: false,
        },
        menu_1342: {
            id: "menu_Live_PSAdapter_plugin_DryB",
            action: "Live PSAdapter_plugin_DryB",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Dry Brush...",
                de: "Effekt > Kunstfilter > Grobe Malerei \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0421\u0443\u0445\u0430\u044f \u043a\u0438\u0441\u0442\u044c\u2026",
                "zh-cn": "Effect > Artistic > Dry Brush...",
                zh_TW: "\u6548\u679c > Artistic > Dry Brush...",
            },
            hidden: false,
        },
        menu_1343: {
            id: "menu_Live_PSAdapter_plugin_FlmG",
            action: "Live PSAdapter_plugin_FlmG",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Film Grain...",
                de: "Effekt > Kunstfilter > K\u00f6rnung & Aufhellung \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0417\u0435\u0440\u043d\u0438\u0441\u0442\u043e\u0441\u0442\u044c \u043f\u043b\u0435\u043d\u043a\u0438\u2026",
                "zh-cn": "Effect > Artistic > Film Grain...",
                zh_TW: "\u6548\u679c > Artistic > Film Grain...",
            },
            hidden: false,
        },
        menu_1344: {
            id: "menu_Live_PSAdapter_plugin_Frsc",
            action: "Live PSAdapter_plugin_Frsc",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Fresco...",
                de: "Effekt > Kunstfilter > Fresko \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0424\u0440\u0435\u0441\u043a\u0430\u2026",
                "zh-cn": "Effect > Artistic > Fresco...",
                zh_TW: "\u6548\u679c > Artistic > Fresco...",
            },
            hidden: false,
        },
        menu_1345: {
            id: "menu_Live_PSAdapter_plugin_NGlw",
            action: "Live PSAdapter_plugin_NGlw",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Neon Glow...",
                de: "Effekt > Kunstfilter > Neonschein \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u041d\u0435\u043e\u043d\u043e\u0432\u044b\u0439 \u0441\u0432\u0435\u0442\u2026",
                "zh-cn": "Effect > Artistic > Neon Glow...",
                zh_TW: "\u6548\u679c > Artistic > Neon Glow...",
            },
            hidden: false,
        },
        menu_1346: {
            id: "menu_Live_PSAdapter_plugin_PntD",
            action: "Live PSAdapter_plugin_PntD",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Paint Daubs...",
                de: "Effekt > Kunstfilter > \u00d6lfarbe getupft \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u041c\u0430\u0441\u043b\u044f\u043d\u0430\u044f \u0436\u0438\u0432\u043e\u043f\u0438\u0441\u044c\u2026",
                "zh-cn": "Effect > Artistic > Paint Daubs...",
                zh_TW: "\u6548\u679c > Artistic > Paint Daubs...",
            },
            hidden: false,
        },
        menu_1347: {
            id: "menu_Live_PSAdapter_plugin_PltK",
            action: "Live PSAdapter_plugin_PltK",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Palette Knife...",
                de: "Effekt > Kunstfilter > Malmesser \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0428\u043f\u0430\u0442\u0435\u043b\u044c\u2026",
                "zh-cn": "Effect > Artistic > Palette Knife...",
                zh_TW: "\u6548\u679c > Artistic > Palette Knife...",
            },
            hidden: false,
        },
        menu_1348: {
            id: "menu_Live_PSAdapter_plugin_PlsW",
            action: "Live PSAdapter_plugin_PlsW",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Plastic Wrap...",
                de: "Effekt > Kunstfilter > Kunststofffolie \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0426\u0435\u043b\u043b\u043e\u0444\u0430\u043d\u043e\u0432\u0430\u044f \u0443\u043f\u0430\u043a\u043e\u0432\u043a\u0430\u2026",
                "zh-cn": "Effect > Artistic > Plastic Wrap...",
                zh_TW: "\u6548\u679c > Artistic > Plastic Wrap...",
            },
            hidden: false,
        },
        menu_1349: {
            id: "menu_Live_PSAdapter_plugin_PstE",
            action: "Live PSAdapter_plugin_PstE",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Poster Edges...",
                de: "Effekt > Kunstfilter > Tontrennung & Kantenbetonung \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u041e\u0447\u0435\u0440\u0447\u0435\u043d\u043d\u044b\u0435 \u043a\u0440\u0430\u044f\u2026",
                "zh-cn": "Effect > Artistic > Poster Edges...",
                zh_TW: "\u6548\u679c > Artistic > Poster Edges...",
            },
            hidden: false,
        },
        menu_1350: {
            id: "menu_Live_PSAdapter_plugin_RghP",
            action: "Live PSAdapter_plugin_RghP",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Rough Pastels...",
                de: "Effekt > Kunstfilter > Grobes Pastell \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u041f\u0430\u0441\u0442\u0435\u043b\u044c\u2026",
                "zh-cn": "Effect > Artistic > Rough Pastels...",
                zh_TW: "\u6548\u679c > Artistic > Rough Pastels...",
            },
            hidden: false,
        },
        menu_1351: {
            id: "menu_Live_PSAdapter_plugin_SmdS",
            action: "Live PSAdapter_plugin_SmdS",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Smudge Stick...",
                de: "Effekt > Kunstfilter > Diagonal verwischen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0420\u0430\u0441\u0442\u0443\u0448\u0435\u0432\u043a\u0430\u2026",
                "zh-cn": "Effect > Artistic > Smudge Stick...",
                zh_TW: "\u6548\u679c > Artistic > Smudge Stick...",
            },
            hidden: false,
        },
        menu_1352: {
            id: "menu_Live_PSAdapter_plugin_Spng",
            action: "Live PSAdapter_plugin_Spng",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Sponge...",
                de: "Effekt > Kunstfilter > Schwamm \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0413\u0443\u0431\u043a\u0430\u2026",
                "zh-cn": "Effect > Artistic > Sponge...",
                zh_TW: "\u6548\u679c > Artistic > Sponge...",
            },
            hidden: false,
        },
        menu_1353: {
            id: "menu_Live_PSAdapter_plugin_Undr",
            action: "Live PSAdapter_plugin_Undr",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Underpainting...",
                de: "Effekt > Kunstfilter > Malgrund \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0420\u0438\u0441\u043e\u0432\u0430\u043d\u0438\u0435 \u043d\u0430 \u043e\u0431\u043e\u0440\u043e\u0442\u0435\u2026",
                "zh-cn": "Effect > Artistic > Underpainting...",
                zh_TW: "\u6548\u679c > Artistic > Underpainting...",
            },
            hidden: false,
        },
        menu_1354: {
            id: "menu_Live_PSAdapter_plugin_Wtrc",
            action: "Live PSAdapter_plugin_Wtrc",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Artistic > Watercolor...",
                de: "Effekt > Kunstfilter > Aquarell \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0410\u043a\u0432\u0430\u0440\u0435\u043b\u044c\u2026",
                "zh-cn": "Effect > Artistic > Watercolor...",
                zh_TW: "\u6548\u679c > Artistic > Watercolor...",
            },
            hidden: false,
        },
        menu_1355: {
            id: "menu_Live_Adobe_PSL_Gaussian_Blur",
            action: "Live Adobe PSL Gaussian Blur",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Blur > Gaussian Blur...",
                de: "Effekt > Weichzeichnungsfilter > Gau\u00dfscher Weichzeichner \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0420\u0430\u0437\u043c\u044b\u0442\u0438\u0435 > \u0420\u0430\u0437\u043c\u044b\u0442\u0438\u0435 \u043f\u043e \u0413\u0430\u0443\u0441\u0441\u0443...",
                "zh-cn": "Effect > Blur > Gaussian Blur...",
                zh_TW: "\u6548\u679c > Blur > Gaussian Blur...",
            },
            hidden: false,
        },
        menu_1356: {
            id: "menu_Live_PSAdapter_plugin_RdlB",
            action: "Live PSAdapter_plugin_RdlB",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Blur > Radial Blur...",
                de: "Effekt > Weichzeichnungsfilter > Radialer Weichzeichner \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0420\u0430\u0437\u043c\u044b\u0442\u0438\u0435 > \u0420\u0430\u0434\u0438\u0430\u043b\u044c\u043d\u043e\u0435 \u0440\u0430\u0437\u043c\u044b\u0442\u0438\u0435...",
                "zh-cn": "Effect > Blur > Radial Blur...",
                zh_TW: "\u6548\u679c > Blur > Radial Blur...",
            },
            hidden: false,
        },
        menu_1357: {
            id: "menu_Live_PSAdapter_plugin_SmrB",
            action: "Live PSAdapter_plugin_SmrB",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Blur > Smart Blur...",
                de: "Effekt > Weichzeichnungsfilter > Selektiver Weichzeichner \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0420\u0430\u0437\u043c\u044b\u0442\u0438\u0435 > \u0423\u043c\u043d\u043e\u0435 \u0440\u0430\u0437\u043c\u044b\u0442\u0438\u0435...",
                "zh-cn": "Effect > Blur > Smart Blur...",
                zh_TW: "\u6548\u679c > Blur > Smart Blur...",
            },
            hidden: false,
        },
        menu_1358: {
            id: "menu_Live_PSAdapter_plugin_AccE",
            action: "Live PSAdapter_plugin_AccE",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Brush Strokes > Accented Edges...",
                de: "Effekt > Malfilter > Kanten betonen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u0410\u043a\u0446\u0435\u043d\u0442 \u043d\u0430 \u043a\u0440\u0430\u044f\u0445\u2026",
                "zh-cn": "Effect > Brush Strokes > Accented Edges...",
                zh_TW: "\u6548\u679c > Brush Strokes > Accented Edges...",
            },
            hidden: false,
        },
        menu_1359: {
            id: "menu_Live_PSAdapter_plugin_AngS",
            action: "Live PSAdapter_plugin_AngS",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Brush Strokes > Angled Strokes...",
                de: "Effekt > Malfilter > Gekreuzte Malstriche \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u041d\u0430\u043a\u043b\u043e\u043d\u043d\u044b\u0435 \u0448\u0442\u0440\u0438\u0445\u0438\u2026",
                "zh-cn": "Effect > Brush Strokes > Angled Strokes...",
                zh_TW: "\u6548\u679c > Brush Strokes > Angled Strokes...",
            },
            hidden: false,
        },
        menu_1360: {
            id: "menu_Live_PSAdapter_plugin_Crsh",
            action: "Live PSAdapter_plugin_Crsh",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Brush Strokes > Crosshatch...",
                de: "Effekt > Malfilter > Kreuzschraffur \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u041f\u0435\u0440\u0435\u043a\u0440\u0435\u0441\u0442\u043d\u044b\u0435 \u0448\u0442\u0440\u0438\u0445\u0438\u2026",
                "zh-cn": "Effect > Brush Strokes > Crosshatch...",
                zh_TW: "\u6548\u679c > Brush Strokes > Crosshatch...",
            },
            hidden: false,
        },
        menu_1361: {
            id: "menu_Live_PSAdapter_plugin_DrkS",
            action: "Live PSAdapter_plugin_DrkS",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Brush Strokes > Dark Strokes...",
                de: "Effekt > Malfilter > Dunkle Malstriche \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u0422\u0435\u043c\u043d\u044b\u0435 \u0448\u0442\u0440\u0438\u0445\u0438\u2026",
                "zh-cn": "Effect > Brush Strokes > Dark Strokes...",
                zh_TW: "\u6548\u679c > Brush Strokes > Dark Strokes...",
            },
            hidden: false,
        },
        menu_1362: {
            id: "menu_Live_PSAdapter_plugin_InkO",
            action: "Live PSAdapter_plugin_InkO",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Brush Strokes > Ink Outlines...",
                de: "Effekt > Malfilter > Konturen mit Tinte nachzeichnen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u041e\u0431\u0432\u043e\u0434\u043a\u0430\u2026",
                "zh-cn": "Effect > Brush Strokes > Ink Outlines...",
                zh_TW: "\u6548\u679c > Brush Strokes > Ink Outlines...",
            },
            hidden: false,
        },
        menu_1363: {
            id: "menu_Live_PSAdapter_plugin_Spt",
            action: "Live PSAdapter_plugin_Spt",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Brush Strokes > Spatter...",
                de: "Effekt > Malfilter > Spritzer \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u0420\u0430\u0437\u0431\u0440\u044b\u0437\u0433\u0438\u0432\u0430\u043d\u0438\u0435\u2026",
                "zh-cn": "Effect > Brush Strokes > Spatter...",
                zh_TW: "\u6548\u679c > Brush Strokes > Spatter...",
            },
            hidden: false,
        },
        menu_1364: {
            id: "menu_Live_PSAdapter_plugin_SprS",
            action: "Live PSAdapter_plugin_SprS",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Brush Strokes > Sprayed Strokes...",
                de: "Effekt > Malfilter > Verwackelte Striche \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u0410\u044d\u0440\u043e\u0433\u0440\u0430\u0444\u2026",
                "zh-cn": "Effect > Brush Strokes > Sprayed Strokes...",
                zh_TW: "\u6548\u679c > Brush Strokes > Sprayed Strokes...",
            },
            hidden: false,
        },
        menu_1365: {
            id: "menu_Live_PSAdapter_plugin_Smie",
            action: "Live PSAdapter_plugin_Smie",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Brush Strokes > Sumi-e...",
                de: "Effekt > Malfilter > Sumi-e \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u0421\u0443\u043c\u0438-\u044d\u2026",
                "zh-cn": "Effect > Brush Strokes > Sumi-e...",
                zh_TW: "\u6548\u679c > Brush Strokes > Sumi-e...",
            },
            hidden: false,
        },
        menu_1366: {
            id: "menu_Live_PSAdapter_plugin_DfsG",
            action: "Live PSAdapter_plugin_DfsG",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Distort > Diffuse Glow...",
                de: "Effekt > Verzerrungsfilter > Weiches Licht \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 > \u0420\u0430\u0441\u0441\u0435\u044f\u043d\u043d\u043e\u0435 \u0441\u0432\u0435\u0447\u0435\u043d\u0438\u0435\u2026",
                "zh-cn": "Effect > Distort > Diffuse Glow...",
                zh_TW: "\u6548\u679c > Distort > Diffuse Glow...",
            },
            hidden: false,
        },
        menu_1367: {
            id: "menu_Live_PSAdapter_plugin_Gls",
            action: "Live PSAdapter_plugin_Gls",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Distort > Glass...",
                de: "Effekt > Verzerrungsfilter > Glas \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 > \u0421\u0442\u0435\u043a\u043b\u043e\u2026",
                "zh-cn": "Effect > Distort > Glass...",
                zh_TW: "\u6548\u679c > Distort > Glass...",
            },
            hidden: false,
        },
        menu_1368: {
            id: "menu_Live_PSAdapter_plugin_OcnR",
            action: "Live PSAdapter_plugin_OcnR",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Distort > Ocean Ripple...",
                de: "Effekt > Verzerrungsfilter > Ozeanwellen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 > \u041e\u043a\u0435\u0430\u043d\u0441\u043a\u0438\u0435 \u0432\u043e\u043b\u043d\u044b\u2026",
                "zh-cn": "Effect > Distort > Ocean Ripple...",
                zh_TW: "\u6548\u679c > Distort > Ocean Ripple...",
            },
            hidden: false,
        },
        menu_1369: {
            id: "menu_Live_PSAdapter_plugin_ClrH",
            action: "Live PSAdapter_plugin_ClrH",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pixelate > Color Halftone...",
                de: "Effekt > Vergr\u00f6berungsfilter > Farbraster \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 > \u0426\u0432\u0435\u0442\u043d\u044b\u0435 \u043f\u043e\u043b\u0443\u0442\u043e\u043d\u0430\u2026",
                "zh-cn": "Effect > Pixelate > Color Halftone...",
                zh_TW: "\u6548\u679c > Pixelate > Color Halftone...",
            },
            hidden: false,
        },
        menu_1370: {
            id: "menu_Live_PSAdapter_plugin_Crst",
            action: "Live PSAdapter_plugin_Crst",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pixelate > Crystallize...",
                de: "Effekt > Vergr\u00f6berungsfilter > Kristallisieren \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 > \u041a\u0440\u0438\u0441\u0442\u0430\u043b\u043b\u0438\u0437\u0430\u0446\u0438\u044f\u2026",
                "zh-cn": "Effect > Pixelate > Crystallize...",
                zh_TW: "\u6548\u679c > Pixelate > Crystallize...",
            },
            hidden: false,
        },
        menu_1371: {
            id: "menu_Live_PSAdapter_plugin_Mztn",
            action: "Live PSAdapter_plugin_Mztn",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pixelate > Mezzotint...",
                de: "Effekt > Vergr\u00f6berungsfilter > Mezzotint \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 > \u041c\u0435\u0446\u0446\u043e-\u0442\u0438\u043d\u0442\u043e\u2026",
                "zh-cn": "Effect > Pixelate > Mezzotint...",
                zh_TW: "\u6548\u679c > Pixelate > Mezzotint...",
            },
            hidden: false,
        },
        menu_1372: {
            id: "menu_Live_PSAdapter_plugin_Pntl",
            action: "Live PSAdapter_plugin_Pntl",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Pixelate > Pointillize...",
                de: "Effekt > Vergr\u00f6berungsfilter > Punktieren \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 > \u041f\u0443\u0430\u043d\u0442\u0438\u043b\u0438\u0437\u043c\u2026",
                "zh-cn": "Effect > Pixelate > Pointillize...",
                zh_TW: "\u6548\u679c > Pixelate > Pointillize...",
            },
            hidden: false,
        },
        menu_1373: {
            id: "menu_Live_PSAdapter_plugin_BsRl",
            action: "Live PSAdapter_plugin_BsRl",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Sketch > Bas Relief...",
                de: "Effekt > Zeichenfilter > Basrelief \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0420\u0435\u043b\u044c\u0435\u0444\u2026",
                "zh-cn": "Effect > Sketch > Bas Relief...",
                zh_TW: "\u6548\u679c > Sketch > Bas Relief...",
            },
            hidden: false,
        },
        menu_1374: {
            id: "menu_Live_PSAdapter_plugin_ChlC",
            action: "Live PSAdapter_plugin_ChlC",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Sketch > Chalk & Charcoal...",
                de: "Effekt > Zeichenfilter > Chalk & Charcoal \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u041c\u0435\u043b \u0438 \u0443\u0433\u043e\u043b\u044c\u2026",
                "zh-cn": "Effect > Sketch > Chalk & Charcoal...",
                zh_TW: "\u6548\u679c > Sketch > Chalk & Charcoal...",
            },
            hidden: false,
        },
        menu_1375: {
            id: "menu_Live_PSAdapter_plugin_Chrc",
            action: "Live PSAdapter_plugin_Chrc",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Sketch > Charcoal...",
                de: "Effekt > Zeichenfilter > Kohleumsetzung \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0423\u0433\u043e\u043b\u044c\u2026",
                "zh-cn": "Effect > Sketch > Charcoal...",
                zh_TW: "\u6548\u679c > Sketch > Charcoal...",
            },
            hidden: false,
        },
        menu_1376: {
            id: "menu_Live_PSAdapter_plugin_Chrm",
            action: "Live PSAdapter_plugin_Chrm",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Sketch > Chrome...",
                de: "Effekt > Zeichenfilter > Chrom \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0425\u0440\u043e\u043c\u2026",
                "zh-cn": "Effect > Sketch > Chrome...",
                zh_TW: "\u6548\u679c > Sketch > Chrome...",
            },
            hidden: false,
        },
        menu_1377: {
            id: "menu_Live_PSAdapter_plugin_CntC",
            action: "Live PSAdapter_plugin_CntC",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Sketch > Cont\u00e9 Crayon...",
                de: "Effekt > Zeichenfilter > Cont\\u00E9-Stifte \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0412\u043e\u043b\u0448\u0435\u0431\u043d\u044b\u0439 \u043a\u0430\u0440\u0430\u043d\u0434\u0430\u0448\u2026",
                "zh-cn": "Effect > Sketch > Cont\u00e9 Crayon...",
                zh_TW: "\u6548\u679c > Sketch > Cont\u00e9 Crayon...",
            },
            hidden: false,
        },
        menu_1378: {
            id: "menu_Live_PSAdapter_plugin_GraP",
            action: "Live PSAdapter_plugin_GraP",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Sketch > Graphic Pen...",
                de: "Effekt > Zeichenfilter > Strichumsetzung \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0422\u0443\u0448\u044c\u2026",
                "zh-cn": "Effect > Sketch > Graphic Pen...",
                zh_TW: "\u6548\u679c > Sketch > Graphic Pen...",
            },
            hidden: false,
        },
        menu_1379: {
            id: "menu_Live_PSAdapter_plugin_HlfS",
            action: "Live PSAdapter_plugin_HlfS",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Sketch > Halftone Pattern...",
                de: "Effekt > Zeichenfilter > Rasterungseffekt \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u041f\u043e\u043b\u0443\u0442\u043e\u043d\u043e\u0432\u044b\u0439 \u0443\u0437\u043e\u0440\u2026",
                "zh-cn": "Effect > Sketch > Halftone Pattern...",
                zh_TW: "\u6548\u679c > Sketch > Halftone Pattern...",
            },
            hidden: false,
        },
        menu_1380: {
            id: "menu_Live_PSAdapter_plugin_NtPr",
            action: "Live PSAdapter_plugin_NtPr",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Sketch > Note Paper...",
                de: "Effekt > Zeichenfilter > Pr\u00e4gepapier \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u041f\u043e\u0447\u0442\u043e\u0432\u0430\u044f \u0431\u0443\u043c\u0430\u0433\u0430\u2026",
                "zh-cn": "Effect > Sketch > Note Paper...",
                zh_TW: "\u6548\u679c > Sketch > Note Paper...",
            },
            hidden: false,
        },
        menu_1381: {
            id: "menu_Live_PSAdapter_plugin_Phtc",
            action: "Live PSAdapter_plugin_Phtc",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Sketch > Photocopy...",
                de: "Effekt > Zeichenfilter > Fotokopie \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u041a\u0441\u0435\u0440\u043e\u043a\u043e\u043f\u0438\u044f\u2026",
                "zh-cn": "Effect > Sketch > Photocopy...",
                zh_TW: "\u6548\u679c > Sketch > Photocopy...",
            },
            hidden: false,
        },
        menu_1382: {
            id: "menu_Live_PSAdapter_plugin_Plst",
            action: "Live PSAdapter_plugin_Plst",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Sketch > Plaster...",
                de: "Effekt > Zeichenfilter > Stuck \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0413\u0438\u043f\u0441\u2026",
                "zh-cn": "Effect > Sketch > Plaster...",
                zh_TW: "\u6548\u679c > Sketch > Plaster...",
            },
            hidden: false,
        },
        menu_1383: {
            id: "menu_Live_PSAdapter_plugin_Rtcl",
            action: "Live PSAdapter_plugin_Rtcl",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Sketch > Reticulation...",
                de: "Effekt > Zeichenfilter > Punktierstich \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0420\u0435\u0442\u0438\u043a\u0443\u043b\u044f\u0446\u0438\u044f\u2026",
                "zh-cn": "Effect > Sketch > Reticulation...",
                zh_TW: "\u6548\u679c > Sketch > Reticulation...",
            },
            hidden: false,
        },
        menu_1384: {
            id: "menu_Live_PSAdapter_plugin_Stmp",
            action: "Live PSAdapter_plugin_Stmp",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Sketch > Stamp...",
                de: "Effekt > Zeichenfilter > Stempel \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u041b\u0438\u043d\u043e\u0433\u0440\u0430\u0432\u044e\u0440\u0430\u2026",
                "zh-cn": "Effect > Sketch > Stamp...",
                zh_TW: "\u6548\u679c > Sketch > Stamp...",
            },
            hidden: false,
        },
        menu_1385: {
            id: "menu_Live_PSAdapter_plugin_TrnE",
            action: "Live PSAdapter_plugin_TrnE",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Sketch > Torn Edges...",
                de: "Effekt > Zeichenfilter > Gerissene Kanten \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0420\u0432\u0430\u043d\u044b\u0435 \u043a\u0440\u0430\u044f\u2026",
                "zh-cn": "Effect > Sketch > Torn Edges...",
                zh_TW: "\u6548\u679c > Sketch > Torn Edges...",
            },
            hidden: false,
        },
        menu_1386: {
            id: "menu_Live_PSAdapter_plugin_WtrP",
            action: "Live PSAdapter_plugin_WtrP",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Sketch > Water Paper...",
                de: "Effekt > Zeichenfilter > Feuchtes Papier \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u041c\u043e\u043a\u0440\u0430\u044f \u0431\u0443\u043c\u0430\u0433\u0430\u2026",
                "zh-cn": "Effect > Sketch > Water Paper...",
                zh_TW: "\u6548\u679c > Sketch > Water Paper...",
            },
            hidden: false,
        },
        menu_1387: {
            id: "menu_Live_PSAdapter_plugin_GlwE",
            action: "Live PSAdapter_plugin_GlwE",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Stylize > Glowing Edges...",
                de: "Effekt > Stilisierungsfilter > Leuchtende Konturen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0421\u0442\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f > \u0421\u0432\u0435\u0447\u0435\u043d\u0438\u0435 \u043a\u0440\u0430\u0435\u0432\u2026",
                "zh-cn": "Effect > Stylize > Glowing Edges...",
                zh_TW: "\u6548\u679c > Stylize > Glowing Edges...",
            },
            hidden: false,
        },
        menu_1388: {
            id: "menu_Live_PSAdapter_plugin_Crql",
            action: "Live PSAdapter_plugin_Crql",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Texture > Craquelure...",
                de: "Effekt > Strukturierungsfilter > Risse \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0422\u0435\u043a\u0441\u0442\u0443\u0440\u0430 > \u041a\u0440\u0430\u043a\u0435\u043b\u044e\u0440\u044b\u2026",
                "zh-cn": "Effect > Texture > Craquelure...",
                zh_TW: "\u6548\u679c > Texture > Craquelure...",
            },
            hidden: false,
        },
        menu_1389: {
            id: "menu_Live_PSAdapter_plugin_Grn",
            action: "Live PSAdapter_plugin_Grn",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Texture > Grain...",
                de: "Effekt > Strukturierungsfilter > K\u00f6rnung \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0422\u0435\u043a\u0441\u0442\u0443\u0440\u0430 > \u0417\u0435\u0440\u043d\u043e\u2026",
                "zh-cn": "Effect > Texture > Grain...",
                zh_TW: "\u6548\u679c > Texture > Grain...",
            },
            hidden: false,
        },
        menu_1390: {
            id: "menu_Live_PSAdapter_plugin_MscT",
            action: "Live PSAdapter_plugin_MscT",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Texture > Mosaic Tiles...",
                de: "Effekt > Strukturierungsfilter > Kacheln \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0422\u0435\u043a\u0441\u0442\u0443\u0440\u0430 > \u041c\u043e\u0437\u0430\u0438\u0447\u043d\u044b\u0435 \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b\u2026",
                "zh-cn": "Effect > Texture > Mosaic Tiles...",
                zh_TW: "\u6548\u679c > Texture > Mosaic Tiles...",
            },
            hidden: false,
        },
        menu_1391: {
            id: "menu_Live_PSAdapter_plugin_Ptch",
            action: "Live PSAdapter_plugin_Ptch",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Texture > Patchwork...",
                de: "Effekt > Strukturierungsfilter > Patchwork \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0422\u0435\u043a\u0441\u0442\u0443\u0440\u0430 > \u0426\u0432\u0435\u0442\u043d\u0430\u044f \u043f\u043b\u0438\u0442\u043a\u0430\u2026",
                "zh-cn": "Effect > Texture > Patchwork...",
                zh_TW: "\u6548\u679c > Texture > Patchwork...",
            },
            hidden: false,
        },
        menu_1392: {
            id: "menu_Live_PSAdapter_plugin_StnG",
            action: "Live PSAdapter_plugin_StnG",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Texture > Stained Glass...",
                de: "Effekt > Strukturierungsfilter > Buntglas-Mosaik \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0422\u0435\u043a\u0441\u0442\u0443\u0440\u0430 > \u0412\u0438\u0442\u0440\u0430\u0436\u2026",
                "zh-cn": "Effect > Texture > Stained Glass...",
                zh_TW: "\u6548\u679c > Texture > Stained Glass...",
            },
            hidden: false,
        },
        menu_1393: {
            id: "menu_Live_PSAdapter_plugin_Txtz",
            action: "Live PSAdapter_plugin_Txtz",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Texture > Texturizer...",
                de: "Effekt > Strukturierungsfilter > Mit Struktur versehen \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0422\u0435\u043a\u0441\u0442\u0443\u0440\u0430 > \u0422\u0435\u043a\u0441\u0442\u0443\u0440\u0438\u0437\u0430\u0442\u043e\u0440\u2026",
                "zh-cn": "Effect > Texture > Texturizer...",
                zh_TW: "\u6548\u679c > Texture > Texturizer...",
            },
            hidden: false,
        },
        menu_1394: {
            id: "menu_Live_PSAdapter_plugin_Dntr",
            action: "Live PSAdapter_plugin_Dntr",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Video > De-Interlace...",
                de: "Effekt > Videofilter > De-Interlace \u2026",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0412\u0438\u0434\u0435\u043e > \u0423\u0441\u0442\u0440\u0430\u043d\u0435\u043d\u0438\u0435 \u0447\u0435\u0440\u0435\u0441\u0441\u0442\u0440\u043e\u0447\u043d\u043e\u0439 \u0440\u0430\u0437\u0432\u0435\u0440\u0442\u043a\u0438...",
                "zh-cn": "Effect > Video > De-Interlace...",
                zh_TW: "\u6548\u679c > Video > De-Interlace...",
            },
            hidden: false,
        },
        menu_1395: {
            id: "menu_Live_PSAdapter_plugin_NTSC",
            action: "Live PSAdapter_plugin_NTSC",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Effect > Video > NTSC Colors",
                de: "Effekt > Videofilter > NTSC-Farben",
                ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0412\u0438\u0434\u0435\u043e > \u0426\u0432\u0435\u0442\u0430 NTSC",
                "zh-cn": "Effect > Video > NTSC Colors",
                zh_TW: "\u6548\u679c > Video > NTSC Colors",
            },
            hidden: false,
        },
        menu_1396: {
            id: "menu_preview",
            action: "preview",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Outline / Preview",
                de: "Ansicht > Vorschau / Pfadansicht",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041a\u043e\u043d\u0442\u0443\u0440\u044b / \u0418\u043b\u043b\u044e\u0441\u0442\u0440\u0430\u0446\u0438\u044f",
                "zh-cn": "View > Outline / Preview",
                zh_TW: "\u6aa2\u8996 > Outline / Preview",
            },
            hidden: false,
        },
        menu_1397: {
            id: "menu_GPU_Preview",
            action: "GPU Preview",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View using GPU / CPU",
                de: "Ansicht > Mit GPU anzeigen / Mit CPU anzeigen",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u0441 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435\u043c \u0426\u041f / \u0413\u041f",
                "zh-cn": "View using GPU / CPU",
                zh_TW: "View using GPU / CPU",
            },
            hidden: false,
        },
        menu_1398: {
            id: "menu_ink",
            action: "ink",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Overprint Preview",
                de: "Ansicht > \u00dcberdruckenvorschau",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u043d\u0430\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u0446\u0432\u0435\u0442\u043e\u0432",
                "zh-cn": "View > Overprint Preview",
                zh_TW: "\u6aa2\u8996 > Overprint Preview",
            },
            hidden: false,
        },
        menu_1399: {
            id: "menu_raster",
            action: "raster",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Pixel Preview",
                de: "Ansicht > Pixelvorschau",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u0432 \u0432\u0438\u0434\u0435 \u043f\u0438\u043a\u0441\u0435\u043b\u043e\u0432",
                "zh-cn": "View > Pixel Preview",
                zh_TW: "\u6aa2\u8996 > Pixel Preview",
            },
            hidden: false,
        },
        menu_1400: {
            id: "menu_proof-document",
            action: "proof-document",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Proof Setup > Working CMYK",
                de: "Ansicht > Proof einrichten > Dokument-CMYK",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0446\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u044b > \u0420\u0430\u0431\u043e\u0447\u0435\u0435 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e CMYK",
                "zh-cn": "View > Proof Setup > Working CMYK",
                zh_TW: "\u6aa2\u8996 > Proof Setup > Working CMYK",
            },
            hidden: false,
        },
        menu_1401: {
            id: "menu_proof-mac-rgb",
            action: "proof-mac-rgb",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Proof Setup > Legacy Macintosh RGB (Gamma 1.8)",
                de: "Ansicht > Proof einrichten > Altes Macintosh-RGB (Gamma 1.8)",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0446\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u044b > \u0420\u0430\u043d\u043d\u044f\u044f \u0432\u0435\u0440\u0441\u0438\u044f Macintosh RGB (Gamma 1.8)",
                "zh-cn": "View > Proof Setup > Legacy Macintosh RGB (Gamma 1.8)",
                zh_TW: "\u6aa2\u8996 > Proof Setup > Legacy Macintosh RGB (Gamma 1.8)",
            },
            hidden: false,
        },
        menu_1402: {
            id: "menu_proof-win-rgb",
            action: "proof-win-rgb",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Proof Setup > Internet Standard RGB (sRGB)",
                de: "Ansicht > Proof einrichten > Internet-Standard-RGB (sRGB)",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0446\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u044b > \u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u0430\u044f \u043f\u0430\u043b\u0438\u0442\u0440\u0430 RGB (sRGB) \u0434\u043b\u044f \u0441\u0435\u0442\u0438 \u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442",
                "zh-cn": "View > Proof Setup > Internet Standard RGB (sRGB)",
                zh_TW: "\u6aa2\u8996 > Proof Setup > Internet Standard RGB (sRGB)",
            },
            hidden: false,
        },
        menu_1403: {
            id: "menu_proof-monitor-rgb",
            action: "proof-monitor-rgb",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Proof Setup > Monitor RGB",
                de: "Ansicht > Proof einrichten > Monitor-RGB",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0446\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u044b > \u041f\u0430\u043b\u0438\u0442\u0440\u0430 RGB \u043c\u043e\u043d\u0438\u0442\u043e\u0440\u0430",
                "zh-cn": "View > Proof Setup > Monitor RGB",
                zh_TW: "\u6aa2\u8996 > Proof Setup > Monitor RGB",
            },
            hidden: false,
        },
        menu_1404: {
            id: "menu_proof-colorblindp",
            action: "proof-colorblindp",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Proof Setup > Color blindness - Protanopia-type",
                de: "Ansicht > Proof einrichten > Farbenblindheit (Protanopie)",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0446\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u044b > \u0414\u0430\u043b\u044c\u0442\u043e\u043d\u0438\u0437\u043c - \u043f\u0440\u043e\u0442\u0430\u043d\u043e\u043f\u0438\u044f",
                "zh-cn": "View > Proof Setup > Color blindness - Protanopia-type",
                zh_TW: "\u6aa2\u8996 > Proof Setup > Color blindness - Protanopia-type",
            },
            hidden: false,
        },
        menu_1405: {
            id: "menu_proof-colorblindd",
            action: "proof-colorblindd",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Proof Setup > Color blindness - Deuteranopia-type",
                de: "Ansicht > Proof einrichten > Farbenblindheit (Deuteranopie)",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0446\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u044b > \u0414\u0430\u043b\u044c\u0442\u043e\u043d\u0438\u0437\u043c - \u0434\u0435\u0439\u0442\u0435\u0440\u0430\u043d\u043e\u043f\u0438\u044f",
                "zh-cn": "View > Proof Setup > Color blindness - Deuteranopia-type",
                zh_TW: "\u6aa2\u8996 > Proof Setup > Color blindness - Deuteranopia-type",
            },
            hidden: false,
        },
        menu_1406: {
            id: "menu_proof-custom",
            action: "proof-custom",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Proof Setup > Customize...",
                de: "Ansicht > Proof einrichten > Anpassen \u2026",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0446\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u044b > \u0417\u0430\u043a\u0430\u0437\u043d\u044b\u0435 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b\u2026",
                "zh-cn": "View > Proof Setup > Customize...",
                zh_TW: "\u6aa2\u8996 > Proof Setup > Customize...",
            },
            hidden: false,
        },
        menu_1407: {
            id: "menu_proofColors",
            action: "proofColors",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Proof Colors",
                de: "Ansicht > Farbproof",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0426\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u0430",
                "zh-cn": "View > Proof Colors",
                zh_TW: "\u6aa2\u8996 > Proof Colors",
            },
            hidden: false,
        },
        menu_1408: {
            id: "menu_zoomin",
            action: "zoomin",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Zoom In",
                de: "Ansicht > Einzoomen",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0423\u0432\u0435\u043b\u0438\u0447\u0435\u043d\u0438\u0435",
                "zh-cn": "View > Zoom In",
                zh_TW: "\u6aa2\u8996 > Zoom In",
            },
            hidden: false,
        },
        menu_1409: {
            id: "menu_zoomout",
            action: "zoomout",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Zoom Out",
                de: "Ansicht > Auszoomen",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0423\u043c\u0435\u043d\u044c\u0448\u0435\u043d\u0438\u0435",
                "zh-cn": "View > Zoom Out",
                zh_TW: "\u6aa2\u8996 > Zoom Out",
            },
            hidden: false,
        },
        menu_1410: {
            id: "menu_fitin",
            action: "fitin",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Fit Artboard in Window",
                de: "Ansicht > Zeichenfl\u00e4che in Fenster einpassen",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u0434\u043e\u0433\u043d\u0430\u0442\u044c \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u0443\u044e \u043e\u0431\u043b\u0430\u0441\u0442\u044c \u043f\u043e \u0440\u0430\u0437\u043c\u0435\u0440\u0443 \u043e\u043a\u043d\u0430",
                "zh-cn": "View > Fit Artboard in Window",
                zh_TW: "\u6aa2\u8996 > Fit Artboard in Window",
            },
            hidden: false,
        },
        menu_1411: {
            id: "menu_fitall",
            action: "fitall",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Fit All in Window",
                de: "Ansicht > Alle in Fenster einpassen",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u0434\u043e\u0433\u043d\u0430\u0442\u044c \u0432\u0441\u0435 \u043f\u043e \u0440\u0430\u0437\u043c\u0435\u0440\u0443 \u043e\u043a\u043d\u0430",
                "zh-cn": "View > Fit All in Window",
                zh_TW: "\u6aa2\u8996 > Fit All in Window",
            },
            hidden: false,
        },
        menu_1412: {
            id: "menu_AISlice_Feedback_Menu",
            action: "AISlice Feedback Menu",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "View > Show / Hide Slices",
                de: "Ansicht > Slices einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b",
                "zh-cn": "View > Show / Hide Slices",
                zh_TW: "\u6aa2\u8996 > Show / Hide Slices",
            },
            hidden: false,
        },
        menu_1413: {
            id: "menu_AISlice_Lock_Menu",
            action: "AISlice Lock Menu",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "View > Lock Slices",
                de: "Ansicht > Slices fixieren",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b",
                "zh-cn": "View > Lock Slices",
                zh_TW: "\u6aa2\u8996 > Lock Slices",
            },
            hidden: false,
        },
        menu_1414: {
            id: "menu_AI_Bounding_Box_Toggle",
            action: "AI Bounding Box Toggle",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "View > Show / Hide Bounding Box",
                de: "Ansicht > Begrenzungsrahmen einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0438\u0442\u0435\u043b\u044c\u043d\u0443\u044e \u0440\u0430\u043c\u043a\u0443",
                "zh-cn": "View > Show / Hide Bounding Box",
                zh_TW: "\u6aa2\u8996 > Show / Hide Bounding Box",
            },
            hidden: false,
        },
        menu_1415: {
            id: "menu_TransparencyGrid_Menu_Item",
            action: "TransparencyGrid Menu Item",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Show / Hide Transparency Grid",
                de: "Ansicht > Transparenzraster einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0441\u0435\u0442\u043a\u0443 \u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u0438",
                "zh-cn": "View > Show / Hide Transparency Grid",
                zh_TW: "\u6aa2\u8996 > Show / Hide Transparency Grid",
            },
            hidden: false,
        },
        menu_1416: {
            id: "menu_actualsize",
            action: "actualsize",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Actual Size",
                de: "Ansicht > Originalgr\u00f6\u00dfe",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0420\u0435\u0430\u043b\u044c\u043d\u044b\u0439 \u0440\u0430\u0437\u043c\u0435\u0440",
                "zh-cn": "View > Actual Size",
                zh_TW: "\u6aa2\u8996 > Actual Size",
            },
            hidden: false,
        },
        menu_1417: {
            id: "menu_Show_Gaps_Planet_X",
            action: "Show Gaps Planet X",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "View > Show / Hide Live Paint Gaps",
                de: "Ansicht > Interaktive Mall\u00fccken einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0437\u0430\u0437\u043e\u0440\u044b \u0431\u044b\u0441\u0442\u0440\u044b\u0445 \u0437\u0430\u043b\u0438\u0432\u043e\u043a",
                "zh-cn": "View > Show / Hide Live Paint Gaps",
                zh_TW: "\u6aa2\u8996 > Show / Hide Live Paint Gaps",
            },
            hidden: false,
        },
        menu_1418: {
            id: "menu_Gradient_Feedback",
            action: "Gradient Feedback",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "View > Show / Hide Gradient Annotator",
                de: "Ansicht > Verlaufsoptimierer einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0433\u0440\u0430\u0434\u0438\u0435\u043d\u0442\u043d\u044b\u0439 \u0430\u043d\u043d\u043e\u0442\u0430\u0442\u043e\u0440",
                "zh-cn": "View > Show / Hide Gradient Annotator",
                zh_TW: "\u6aa2\u8996 > Show / Hide Gradient Annotator",
            },
            hidden: false,
        },
        menu_1419: {
            id: "menu_Live_Corner_Annotator",
            action: "Live Corner Annotator",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "View > Show / Hide Corner Widget",
                de: "Ansicht > Ecken-Widget einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043a\u0440\u044b\u0442\u044c \u0432\u0438\u0434\u0436\u0435\u0442 \u0443\u0433\u043b\u043e\u0432",
                "zh-cn": "View > Show / Hide Corner Widget",
                zh_TW: "\u6aa2\u8996 > Show / Hide Corner Widget",
            },
            hidden: false,
            minVersion: "17.1",
        },
        menu_1420: {
            id: "menu_edge",
            action: "edge",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Show / Hide Edges",
                de: "Ansicht > Ecken einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0433\u0440\u0430\u043d\u0438\u0446\u044b",
                "zh-cn": "View > Show / Hide Edges",
                zh_TW: "\u6aa2\u8996 > Show / Hide Edges",
            },
            hidden: false,
        },
        menu_1421: {
            id: "menu_Snapomatic_on-off_menu_item",
            action: "Snapomatic on-off menu item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "View > Smart Guides",
                de: "Ansicht > Intelligente Hilfslinien",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0411\u044b\u0441\u0442\u0440\u044b\u0435 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435",
                "zh-cn": "View > Smart Guides",
                zh_TW: "\u6aa2\u8996 > Smart Guides",
            },
            hidden: false,
            minVersion: "16.0",
        },
        menu_1422: {
            id: "menu_Show_Perspective_Grid",
            action: "Show Perspective Grid",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Perspective Grid > Show / Hide Grid",
                de: "Ansicht > Perspektivenraster > Raster einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043a\u0440\u044b\u0442\u044c \u0441\u0435\u0442\u043a\u0443",
                "zh-cn": "View > Perspective Grid > Show / Hide Grid",
                zh_TW: "\u6aa2\u8996 > Perspective Grid > Show / Hide Grid",
            },
            hidden: false,
        },
        menu_1423: {
            id: "menu_Show_Ruler",
            action: "Show Ruler",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Perspective Grid > Show / Hide Rulers",
                de: "Ansicht > Perspektivenraster > Lineale einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043a\u0440\u044b\u0442\u044c \u043b\u0438\u043d\u0435\u0439\u043a\u0438",
                "zh-cn": "View > Perspective Grid > Show / Hide Rulers",
                zh_TW: "\u6aa2\u8996 > Perspective Grid > Show / Hide Rulers",
            },
            hidden: false,
        },
        menu_1424: {
            id: "menu_Snap_to_Grid",
            action: "Snap to Grid",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Perspective Grid > Snap to Grid",
                de: "Ansicht > Perspektivenraster > Am Raster ausrichten",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b > \u041f\u0440\u0438\u0432\u044f\u0437\u0430\u0442\u044c \u043a \u0441\u0435\u0442\u043a\u0435",
                "zh-cn": "View > Perspective Grid > Snap to Grid",
                zh_TW: "\u6aa2\u8996 > Perspective Grid > Snap to Grid",
            },
            hidden: false,
        },
        menu_1425: {
            id: "menu_Lock_Perspective_Grid",
            action: "Lock Perspective Grid",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Perspective Grid > Lock Grid",
                de: "Ansicht > Perspektivenraster > Raster sperren",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b > \u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c \u0441\u0435\u0442\u043a\u0443",
                "zh-cn": "View > Perspective Grid > Lock Grid",
                zh_TW: "\u6aa2\u8996 > Perspective Grid > Lock Grid",
            },
            hidden: false,
        },
        menu_1426: {
            id: "menu_Lock_Station_Point",
            action: "Lock Station Point",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Perspective Grid > Lock Station Point",
                de: "Ansicht > Perspektivenraster > Bezugspunkt sperren",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b > \u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c \u0442\u043e\u0447\u043a\u0443 \u043d\u0430\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u044f",
                "zh-cn": "View > Perspective Grid > Lock Station Point",
                zh_TW: "\u6aa2\u8996 > Perspective Grid > Lock Station Point",
            },
            hidden: false,
        },
        menu_1427: {
            id: "menu_Define_Perspective_Grid",
            action: "Define Perspective Grid",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Perspective Grid > Define Grid...",
                de: "Ansicht > Perspektivenraster > Raster definieren",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b > \u041e\u043f\u0440\u0435\u0434\u0435\u043b\u0438\u0442\u044c \u0441\u0435\u0442\u043a\u0443...",
                "zh-cn": "View > Perspective Grid > Define Grid...",
                zh_TW: "\u6aa2\u8996 > Perspective Grid > Define Grid...",
            },
            hidden: false,
        },
        menu_1429: {
            id: "menu_artboard",
            action: "artboard",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Show / Hide Artboards",
                de: "Ansicht > Zeichenfl\u00e4chen einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043a\u0440\u044b\u0442\u044c \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
                "zh-cn": "View > Show / Hide Artboards",
                zh_TW: "\u6aa2\u8996 > Show / Hide Artboards",
            },
            hidden: false,
        },
        menu_1430: {
            id: "menu_pagetiling",
            action: "pagetiling",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Show / Hide Print Tiling",
                de: "Ansicht > Druckaufteilung einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0440\u0430\u0437\u0431\u0438\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u043f\u0435\u0447\u0430\u0442\u0438",
                "zh-cn": "View > Show / Hide Print Tiling",
                zh_TW: "\u6aa2\u8996 > Show / Hide Print Tiling",
            },
            hidden: false,
        },
        menu_1431: {
            id: "menu_showtemplate",
            action: "showtemplate",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Show / Hide Template",
                de: "Ansicht > Vorlage einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0448\u0430\u0431\u043b\u043e\u043d",
                "zh-cn": "View > Show / Hide Template",
                zh_TW: "\u6aa2\u8996 > Show / Hide Template",
            },
            hidden: false,
        },
        menu_1432: {
            id: "menu_ruler",
            action: "ruler",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Rulers > Show / Hide Rulers",
                de: "Ansicht > Lineale > Lineale einblende / ausblendenn",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043a\u0440\u044b\u0442\u044c \u043b\u0438\u043d\u0435\u0439\u043a\u0438",
                "zh-cn": "View > Rulers > Show / Hide Rulers",
                zh_TW: "\u6aa2\u8996 > Rulers > Show / Hide Rulers",
            },
            hidden: false,
        },
        menu_1433: {
            id: "menu_rulerCoordinateSystem",
            action: "rulerCoordinateSystem",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Rulers > Change to Global Rulers",
                de: "Ansicht > Lineale > In globale Lineale \u00e4ndern",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041b\u0438\u043d\u0435\u0439\u043a\u0438 > \u0421\u043c\u0435\u043d\u0438\u0442\u044c \u043d\u0430 \u043e\u0431\u0449\u0438\u0435 \u043b\u0438\u043d\u0435\u0439\u043a\u0438 / \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
                "zh-cn": "View > Rulers > Change to Global Rulers",
                zh_TW: "\u6aa2\u8996 > Rulers > Change to Global Rulers",
            },
            hidden: false,
        },
        menu_1434: {
            id: "menu_videoruler",
            action: "videoruler",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Rulers > Show / Hide Video Rulers",
                de: "Ansicht > Lineale > Videolineale einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043a\u0440\u044b\u0442\u044c \u043b\u0438\u043d\u0435\u0439\u043a\u0438 \u0432\u0438\u0434\u0435\u043e",
                "zh-cn": "View > Rulers > Show / Hide Video Rulers",
                zh_TW: "\u6aa2\u8996 > Rulers > Show / Hide Video Rulers",
            },
            hidden: false,
        },
        menu_1435: {
            id: "menu_textthreads",
            action: "textthreads",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Show / Hide Text Threads",
                de: "Ansicht > Textverkettungen einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0441\u0432\u044f\u0437\u0438 \u0442\u0435\u043a\u0441\u0442\u043e\u0432\u044b\u0445 \u0431\u043b\u043e\u043a\u043e\u0432",
                "zh-cn": "View > Show / Hide Text Threads",
                zh_TW: "\u6aa2\u8996 > Show / Hide Text Threads",
            },
            hidden: false,
        },
        menu_1436: {
            id: "menu_showguide",
            action: "showguide",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Guides > Show / Hide Guides",
                de: "Ansicht > Hilfslinien > Hilfslinien einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435",
                "zh-cn": "View > Guides > Show / Hide Guides",
                zh_TW: "\u6aa2\u8996 > Guides > Show / Hide Guides",
            },
            hidden: false,
        },
        menu_1437: {
            id: "menu_lockguide",
            action: "lockguide",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Guides > Lock / Unlock Guides",
                de: "Ansicht > Hilfslinien > Hilfslinien sperren",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435 > \u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435",
                "zh-cn": "View > Guides > Lock / Unlock Guides",
                zh_TW: "\u6aa2\u8996 > Guides > Lock / Unlock Guides",
            },
            hidden: false,
        },
        menu_1438: {
            id: "menu_makeguide",
            action: "makeguide",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "View > Guides > Make Guides",
                de: "Ansicht > Hilfslinien > Hilfslinien erstellen",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435",
                "zh-cn": "View > Guides > Make Guides",
                zh_TW: "\u6aa2\u8996 > Guides > Make Guides",
            },
            hidden: false,
        },
        menu_1439: {
            id: "menu_releaseguide",
            action: "releaseguide",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Guides > Release Guides",
                de: "Ansicht > Hilfslinien > Hilfslinien zur\u00fcckwandeln",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435 > \u041e\u0441\u0432\u043e\u0431\u043e\u0434\u0438\u0442\u044c \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435",
                "zh-cn": "View > Guides > Release Guides",
                zh_TW: "\u6aa2\u8996 > Guides > Release Guides",
            },
            hidden: false,
        },
        menu_1440: {
            id: "menu_clearguide",
            action: "clearguide",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Guides > Clear Guides",
                de: "Ansicht > Hilfslinien > Hilfslinien l\u00f6schen",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435 > \u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435",
                "zh-cn": "View > Guides > Clear Guides",
                zh_TW: "\u6aa2\u8996 > Guides > Clear Guides",
            },
            hidden: false,
        },
        menu_1441: {
            id: "menu_showgrid",
            action: "showgrid",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Show / Hide Grid",
                de: "Ansicht > Raster einblenden / ausblenden",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0441\u0435\u0442\u043a\u0443",
                "zh-cn": "View > Show / Hide Grid",
                zh_TW: "\u6aa2\u8996 > Show / Hide Grid",
            },
            hidden: false,
        },
        menu_1442: {
            id: "menu_snapgrid",
            action: "snapgrid",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Snap to Grid",
                de: "Ansicht > Am Raster ausrichten",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u0442\u044c \u043f\u043e \u0441\u0435\u0442\u043a\u0435",
                "zh-cn": "View > Snap to Grid",
                zh_TW: "\u6aa2\u8996 > Snap to Grid",
            },
            hidden: false,
        },
        menu_1443: {
            id: "menu_snappoint",
            action: "snappoint",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Snap to Point",
                de: "Ansicht > An Punkt ausrichten",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u0442\u044c \u043f\u043e \u0442\u043e\u0447\u043a\u0430\u043c",
                "zh-cn": "View > Snap to Point",
                zh_TW: "\u6aa2\u8996 > Snap to Point",
            },
            hidden: false,
        },
        menu_1444: {
            id: "menu_newview",
            action: "newview",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > New View...",
                de: "Ansicht > Neue Ansicht \u2026",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041d\u043e\u0432\u044b\u0439 \u0432\u0438\u0434\u2026",
                "zh-cn": "View > New View...",
                zh_TW: "\u6aa2\u8996 > New View...",
            },
            hidden: false,
        },
        menu_1445: {
            id: "menu_editview",
            action: "editview",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "View > Edit Views...",
                de: "Ansicht > Ansicht bearbeiten \u2026",
                ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0432\u0438\u0434\u044b\u2026",
                "zh-cn": "View > Edit Views...",
                zh_TW: "\u6aa2\u8996 > Edit Views...",
            },
            hidden: false,
        },
        menu_1446: {
            id: "menu_newwindow",
            action: "newwindow",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Window > New Window",
                de: "Fenster > Neues Fenster",
                ru: "\u041e\u043a\u043d\u043e > \u041d\u043e\u0432\u043e\u0435 \u043e\u043a\u043d\u043e",
                "zh-cn": "Window > New Window",
                zh_TW: "\u8996\u7a97 > New Window",
            },
            hidden: false,
        },
        menu_1447: {
            id: "menu_cascade",
            action: "cascade",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Window > Arrange > Cascade",
                de: "Fenster > Anordnen > \u00dcberlappend",
                ru: "\u041e\u043a\u043d\u043e > \u0423\u043f\u043e\u0440\u044f\u0434\u0438\u0442\u044c > \u041a\u0430\u0441\u043a\u0430\u0434\u043e\u043c",
                "zh-cn": "Window > Arrange > Cascade",
                zh_TW: "\u8996\u7a97 > Arrange > Cascade",
            },
            hidden: false,
        },
        menu_1448: {
            id: "menu_tile",
            action: "tile",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Window > Arrange > Tile",
                de: "Fenster > Anordnen > Nebeneinander",
                ru: "\u041e\u043a\u043d\u043e > \u0423\u043f\u043e\u0440\u044f\u0434\u0438\u0442\u044c > \u041c\u043e\u0437\u0430\u0438\u043a\u043e\u0439",
                "zh-cn": "Window > Arrange > Tile",
                zh_TW: "\u8996\u7a97 > Arrange > Tile",
            },
            hidden: false,
        },
        menu_1449: {
            id: "menu_floatInWindow",
            action: "floatInWindow",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Window > Arrange > Float in Window",
                de: "Fenster > Anordnen > In Fenster verschiebbar machen",
                ru: "\u041e\u043a\u043d\u043e > \u0423\u043f\u043e\u0440\u044f\u0434\u0438\u0442\u044c > \u041f\u043b\u0430\u0432\u0430\u044e\u0449\u0435\u0435 \u0432 \u043e\u043a\u043d\u0435",
                "zh-cn": "Window > Arrange > Float in Window",
                zh_TW: "\u8996\u7a97 > Arrange > Float in Window",
            },
            hidden: false,
        },
        menu_1450: {
            id: "menu_floatAllInWindows",
            action: "floatAllInWindows",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Window > Arrange > Float All in Windows",
                de: "Fenster > Anordnen > Alle in Fenstern verschiebbar machen",
                ru: "\u041e\u043a\u043d\u043e > \u0423\u043f\u043e\u0440\u044f\u0434\u0438\u0442\u044c > \u0412\u0441\u0435 \u043f\u043b\u0430\u0432\u0430\u044e\u0449\u0438\u0435 \u0432 \u043e\u043a\u043d\u0430\u0445",
                "zh-cn": "Window > Arrange > Float All in Windows",
                zh_TW: "\u8996\u7a97 > Arrange > Float All in Windows",
            },
            hidden: false,
        },
        menu_1451: {
            id: "menu_consolidateAllWindows",
            action: "consolidateAllWindows",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Window > Arrange > Consolidate All Windows",
                de: "Fenster > Anordnen > Alle Fenster zusammenf\u00fchren",
                ru: "\u041e\u043a\u043d\u043e > \u0423\u043f\u043e\u0440\u044f\u0434\u0438\u0442\u044c > \u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0438\u0442\u044c \u0432\u0441\u0435 \u043e\u043a\u043d\u0430",
                "zh-cn": "Window > Arrange > Consolidate All Windows",
                zh_TW: "\u8996\u7a97 > Arrange > Consolidate All Windows",
            },
            hidden: false,
        },
        menu_1452: {
            id: "menu_Browse_Add-Ons_Menu",
            action: "Browse Add-Ons Menu",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Find Extensions on Exchange...",
                de: "Fenster > Erweiterungen auf Exchange suchen \u2026",
                ru: "\u041e\u043a\u043d\u043e > \u041f\u043e\u0438\u0441\u043a \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u0438\u0439 \u043d\u0430 Exchange...",
                "zh-cn": "Window > Find Extensions on Exchange...",
                zh_TW: "\u8996\u7a97 > Find Extensions on Exchange...",
            },
            hidden: false,
            minVersion: "19",
        },
        menu_1453: {
            id: "menu_Adobe_Reset_Workspace",
            action: "Adobe Reset Workspace",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Reset Workspace",
                de: "Fenster > Arbeitsbereich > Zur\u00fccksetzen",
                ru: "\u041e\u043a\u043d\u043e > \u0412\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c \u0440\u0430\u0431\u043e\u0447\u0443\u044e \u0441\u0440\u0435\u0434\u0443",
                "zh-cn": "Window > Reset Workspace",
                zh_TW: "\u8996\u7a97 > Reset Workspace",
            },
            hidden: false,
        },
        menu_1454: {
            id: "menu_Adobe_New_Workspace",
            action: "Adobe New Workspace",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Workspace > New Workspace...",
                de: "Fenster > Arbeitsbereich > Neuer Arbeitsbereich \u2026",
                ru: "\u041e\u043a\u043d\u043e > \u0420\u0430\u0431\u043e\u0447\u0430\u044f \u0441\u0440\u0435\u0434\u0430 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0440\u0430\u0431\u043e\u0447\u0443\u044e \u0441\u0440\u0435\u0434\u0443...",
                "zh-cn": "Window > Workspace > New Workspace...",
                zh_TW: "\u8996\u7a97 > Workspace > New Workspace...",
            },
            hidden: false,
        },
        menu_1455: {
            id: "menu_Adobe_Manage_Workspace",
            action: "Adobe Manage Workspace",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Workspace > Manage Workspaces...",
                de: "Fenster > Arbeitsbereich > Arbeitsbereiche verwalten \u2026",
                ru: "\u041e\u043a\u043d\u043e > \u0420\u0430\u0431\u043e\u0447\u0430\u044f \u0441\u0440\u0435\u0434\u0430 > \u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0440\u0430\u0431\u043e\u0447\u0438\u043c\u0438 \u0441\u0440\u0435\u0434\u0430\u043c\u0438...",
                "zh-cn": "Window > Workspace > Manage Workspaces...",
                zh_TW: "\u8996\u7a97 > Workspace > Manage Workspaces...",
            },
            hidden: false,
        },
        menu_1457: {
            id: "menu_drover_control_palette_plugin",
            action: "drover control palette plugin",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Control",
                de: "Fenster > Steuerung",
                ru: "\u041e\u043a\u043d\u043e > \u041f\u0430\u043d\u0435\u043b\u044c \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f",
                "zh-cn": "Window > Control",
                zh_TW: "\u8996\u7a97 > Control",
            },
            hidden: false,
        },
        menu_1458: {
            id: "menu_Adobe_Advanced_Toolbar_Menu",
            action: "Adobe Advanced Toolbar Menu",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Toolbars > Advanced",
                de: "Fenster > Werkzeugleisten > Erweitert",
                ru: "\u041e\u043a\u043d\u043e > \u041f\u0430\u043d\u0435\u043b\u0438 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u043e\u0432 > \u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435",
                "zh-cn": "Window > Toolbars > Advanced",
                zh_TW: "\u8996\u7a97 > Toolbars > Advanced",
            },
            hidden: false,
            minVersion: "23",
        },
        menu_1459: {
            id: "menu_Adobe_Basic_Toolbar_Menu",
            action: "Adobe Basic Toolbar Menu",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Toolbars > Basic",
                de: "Fenster > Werkzeugleisten > Einfach",
                ru: "\u041e\u043a\u043d\u043e > \u041f\u0430\u043d\u0435\u043b\u0438 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u043e\u0432 > \u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435",
                "zh-cn": "Window > Toolbars > Basic",
                zh_TW: "\u8996\u7a97 > Toolbars > Basic",
            },
            hidden: false,
            minVersion: "23",
        },
        menu_1460: {
            id: "menu_Adobe_Quick_Toolbar_Menu",
            action: "Adobe Quick Toolbar Menu",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Toolbars > Getting Started",
                de: "Window > Toolbars > Getting Started",
                ru: "Window > Toolbars > Getting Started",
                "zh-cn": "Window > Toolbars > Getting Started",
                zh_TW: "\u8996\u7a97 > Toolbars > Getting Started",
            },
            hidden: false,
            minVersion: "29.3",
        },
        menu_1461: {
            id: "menu_New_Tools_Panel",
            action: "New Tools Panel",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Toolbars > New Toolbar...",
                de: "Fenster > Werkzeugleisten > Neue Werkzeugleiste \u2026",
                ru: "\u041e\u043a\u043d\u043e > \u041f\u0430\u043d\u0435\u043b\u0438 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u043e\u0432 > \u041d\u043e\u0432\u0430\u044f \u043f\u0430\u043d\u0435\u043b\u044c \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u043e\u0432...",
                "zh-cn": "Window > Toolbars > New Toolbar...",
                zh_TW: "\u8996\u7a97 > Toolbars > New Toolbar...",
            },
            hidden: false,
            minVersion: "17",
        },
        menu_1462: {
            id: "menu_Manage_Tools_Panel",
            action: "Manage Tools Panel",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Toolbars > Manage Toolbars...",
                de: "Fenster > Werkzeugleisten > Werkzeugleisten verwalten \u2026",
                ru: "\u041e\u043a\u043d\u043e > \u041f\u0430\u043d\u0435\u043b\u0438 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u043e\u0432 > \u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u0430\u043d\u0435\u043b\u044f\u043c\u0438 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u043e\u0432...",
                "zh-cn": "Window > Toolbars > Manage Toolbars...",
                zh_TW: "\u8996\u7a97 > Toolbars > Manage Toolbars...",
            },
            hidden: false,
            minVersion: "17",
        },
        menu_1463: {
            id: "menu_Adobe_3D_Panel",
            action: "Adobe 3D Panel",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > 3D and Materials",
                de: "Fenster > 3D und Materialien",
                ru: "\u041e\u043a\u043d\u043e > 3D \u0438 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b",
                "zh-cn": "Window > 3D and Materials",
                zh_TW: "\u8996\u7a97 > 3D and Materials",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1464: {
            id: "menu_Adobe_Action_Palette",
            action: "Adobe Action Palette",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Actions",
                de: "Fenster > Aktionen",
                ru: "\u041e\u043a\u043d\u043e > \u041e\u043f\u0435\u0440\u0430\u0446\u0438\u0438",
                "zh-cn": "Window > Actions",
                zh_TW: "\u8996\u7a97 > Actions",
            },
            hidden: false,
        },
        menu_1465: {
            id: "menu_AdobeAlignObjects2",
            action: "AdobeAlignObjects2",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Align",
                de: "Fenster > Ausrichten",
                ru: "\u041e\u043a\u043d\u043e > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435",
                "zh-cn": "Window > Align",
                zh_TW: "\u8996\u7a97 > Align",
            },
            hidden: false,
        },
        menu_1466: {
            id: "menu_Style_Palette",
            action: "Style Palette",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Appearance",
                de: "Fenster > Aussehen",
                ru: "\u041e\u043a\u043d\u043e > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435",
                "zh-cn": "Window > Appearance",
                zh_TW: "\u8996\u7a97 > Appearance",
            },
            hidden: false,
        },
        menu_1467: {
            id: "menu_Adobe_Artboard_Palette",
            action: "Adobe Artboard Palette",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Artboards",
                de: "Fenster > Zeichenfl\u00e4chen",
                ru: "\u041e\u043a\u043d\u043e > \u041c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
                "zh-cn": "Window > Artboards",
                zh_TW: "\u8996\u7a97 > Artboards",
            },
            hidden: false,
        },
        menu_1468: {
            id: "menu_Adobe_SmartExport_Panel_Menu_Item",
            action: "Adobe SmartExport Panel Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Asset Export",
                de: "Fenster > Export von Element",
                ru: "\u041e\u043a\u043d\u043e > \u042d\u043a\u0441\u043f\u043e\u0440\u0442 \u0440\u0435\u0441\u0443\u0440\u0441\u043e\u0432",
                "zh-cn": "Window > Asset Export",
                zh_TW: "\u8996\u7a97 > Asset Export",
            },
            hidden: false,
            minVersion: "20",
        },
        menu_1469: {
            id: "menu_internal_palettes_posing_as_plug-in_menus-attributes",
            action: "internal palettes posing as plug-in menus-attributes",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Attributes",
                de: "Fenster > Attribute",
                ru: "\u041e\u043a\u043d\u043e > \u0410\u0442\u0440\u0438\u0431\u0443\u0442\u044b",
                "zh-cn": "Window > Attributes",
                zh_TW: "\u8996\u7a97 > Attributes",
            },
            hidden: false,
        },
        menu_2181: {
            id: "menu_",
            action: "",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Blend",
                de: "Window > Blend",
                ru: "Window > Blend",
                "zh-cn": "Window > Blend",
                zh_TW: "\u8996\u7a97 > Blend",
            },
            hidden: false,
            minVersion: "30.7",
        },
        menu_1470: {
            id: "menu_Adobe_BrushManager_Menu_Item",
            action: "Adobe BrushManager Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Brushes",
                de: "Fenster > Pinsel",
                ru: "\u041e\u043a\u043d\u043e > \u041a\u0438\u0441\u0442\u0438",
                "zh-cn": "Window > Brushes",
                zh_TW: "\u8996\u7a97 > Brushes",
            },
            hidden: false,
        },
        menu_1471: {
            id: "menu_Adobe_Color_Palette",
            action: "Adobe Color Palette",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Color",
                de: "Fenster > Farbe",
                ru: "\u041e\u043a\u043d\u043e > \u0426\u0432\u0435\u0442",
                "zh-cn": "Window > Color",
                zh_TW: "\u8996\u7a97 > Color",
            },
            hidden: false,
        },
        menu_1472: {
            id: "menu_Adobe_Harmony_Palette",
            action: "Adobe Harmony Palette",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Color Guide",
                de: "Fenster > Farbhilfe",
                ru: "\u041e\u043a\u043d\u043e > \u041a\u0430\u0442\u0430\u043b\u043e\u0433 \u0446\u0432\u0435\u0442\u043e\u0432",
                "zh-cn": "Window > Color Guide",
                zh_TW: "\u8996\u7a97 > Color Guide",
            },
            hidden: false,
        },
        menu_1473: {
            id: "menu_Adobe_Illustrator_Kuler_Panel",
            action: "Adobe Illustrator Kuler Panel",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Color Themes",
                de: "Window > Color Themes",
                ru: "Window > Color Themes",
                "zh-cn": "Window > Color Themes",
                zh_TW: "\u8996\u7a97 > Color Themes",
            },
            hidden: false,
            minVersion: "22",
            maxVersion: "25.9",
        },
        menu_1474: {
            id: "menu_Adobe_Commenting_Palette",
            action: "Adobe Commenting Palette",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Comments",
                de: "Fenster > Kommentare",
                ru: "\u041e\u043a\u043d\u043e > \u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438",
                "zh-cn": "Window > Comments",
                zh_TW: "\u8996\u7a97 > Comments",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_2160: {
            id: "menu_SketchToVectorUnified",
            action: "SketchToVectorUnified",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Window > Concept to Vector",
                de: "Window > Concept to Vector",
                ru: "Window > Concept to Vector",
                "zh-cn": "Window > Concept to Vector",
                zh_TW: "\u8996\u7a97 > Concept to Vector",
            },
            hidden: false,
            minVersion: "30.5.0",
        },
        menu_1475: {
            id: "menu_CSS_Menu_Item",
            action: "CSS Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > CSS Properties (Deprecated)",
                de: "CSS-Eigenschaften",
                ru: "\u041e\u043a\u043d\u043e > \u0421\u0432\u043e\u0439\u0441\u0442\u0432\u0430 CSS",
                "zh-cn": "Window > CSS Properties (Deprecated)",
                zh_TW: "\u8996\u7a97 > CSS Properties (Deprecated)",
            },
            hidden: false,
        },
        menu_1476: {
            id: "menu_DocInfo1",
            action: "DocInfo1",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Document Info",
                de: "Fenster > Dokumentinformationen",
                ru: "\u041e\u043a\u043d\u043e > \u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u043e \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0435",
                "zh-cn": "Window > Document Info",
                zh_TW: "\u8996\u7a97 > Document Info",
            },
            hidden: false,
        },
        menu_1477: {
            id: "menu_Adobe_Flattening_Preview",
            action: "Adobe Flattening Preview",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Flattener Preview",
                de: "Fenster > Reduzierungsvorschau",
                ru: "\u041e\u043a\u043d\u043e > \u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432 \u0441\u0432\u0435\u0434\u0435\u043d\u0438\u044f",
                "zh-cn": "Window > Flattener Preview",
                zh_TW: "\u8996\u7a97 > Flattener Preview",
            },
            hidden: false,
        },
        menu_1478: {
            id: "menu_Adobe_Generative_Patterns_Panel",
            action: "Adobe Generative Patterns Panel",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Window > Generation History",
                de: "Window > Generation History",
                ru: "Window > Generation History",
                "zh-cn": "Window > Generation History",
                zh_TW: "\u8996\u7a97 > Generation History",
            },
            hidden: false,
            minVersion: "28.6",
        },
        menu_1479: {
            id: "menu_Generate",
            action: "Generate",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Generated Variations",
                de: "Window > Generated Variations",
                ru: "Window > Generated Variations",
                "zh-cn": "Window > Generated Variations",
                zh_TW: "\u8996\u7a97 > Generated Variations",
            },
            hidden: false,
            minVersion: "28",
            maxVersion: "30.4.999",
        },
        menu_1480: {
            id: "menu_Adobe_Gradient_Palette",
            action: "Adobe Gradient Palette",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Gradient",
                de: "Fenster > Verlauf",
                ru: "\u041e\u043a\u043d\u043e > \u0413\u0440\u0430\u0434\u0438\u0435\u043d\u0442",
                "zh-cn": "Window > Gradient",
                zh_TW: "\u8996\u7a97 > Gradient",
            },
            hidden: false,
        },
        menu_1481: {
            id: "menu_Adobe_Style_Palette",
            action: "Adobe Style Palette",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Graphic Styles",
                de: "Fenster > Grafikstile",
                ru: "\u041e\u043a\u043d\u043e > \u0421\u0442\u0438\u043b\u0438 \u0433\u0440\u0430\u0444\u0438\u043a\u0438",
                "zh-cn": "Window > Graphic Styles",
                zh_TW: "\u8996\u7a97 > Graphic Styles",
            },
            hidden: false,
        },
        menu_1482: {
            id: "menu_Adobe_HistoryPanel_Menu_Item",
            action: "Adobe HistoryPanel Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > History",
                de: "Fenster > Versionsverlauf",
                ru: "\u041e\u043a\u043d\u043e > \u0418\u0441\u0442\u043e\u0440\u0438\u044f",
                "zh-cn": "Window > History",
                zh_TW: "\u8996\u7a97 > History",
            },
            hidden: false,
            minVersion: "26.4",
            maxVersion: "26.9",
        },
        menu_1483: {
            id: "menu_Adobe_History_Panel_Menu_Item",
            action: "Adobe History Panel Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > History",
                de: "Fenster > Versionsverlauf",
                ru: "\u041e\u043a\u043d\u043e > \u0418\u0441\u0442\u043e\u0440\u0438\u044f",
                "zh-cn": "Window > History",
                zh_TW: "\u8996\u7a97 > History",
            },
            hidden: false,
            minVersion: "27",
        },
        menu_1484: {
            id: "menu_Adobe_Vectorize_Panel",
            action: "Adobe Vectorize Panel",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Image Trace",
                de: "Fenster > Bildnachzeichner",
                ru: "Window > Image Trace",
                "zh-cn": "Window > Image Trace",
                zh_TW: "\u8996\u7a97 > Image Trace",
            },
            hidden: false,
        },
        menu_1485: {
            id: "menu_internal_palettes_posing_as_plug-in_menus-info",
            action: "internal palettes posing as plug-in menus-info",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Info",
                de: "Fenster > Info",
                ru: "\u041e\u043a\u043d\u043e > \u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f",
                "zh-cn": "Window > Info",
                zh_TW: "\u8996\u7a97 > Info",
            },
            hidden: false,
        },
        menu_1486: {
            id: "menu_AdobeLayerPalette1",
            action: "AdobeLayerPalette1",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Layers",
                de: "Fenster > Ebenen",
                ru: "\u041e\u043a\u043d\u043e > \u0421\u043b\u043e\u0438",
                "zh-cn": "Window > Layers",
                zh_TW: "\u8996\u7a97 > Layers",
            },
            hidden: false,
        },
        menu_1487: {
            id: "menu_Adobe_Learn_Panel_Menu_Item",
            action: "Adobe Learn Panel Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Learn",
                de: "Window > Learn",
                ru: "Window > Learn",
                "zh-cn": "Window > Learn",
                zh_TW: "\u8996\u7a97 > Learn",
            },
            hidden: false,
            minVersion: "22",
            maxVersion: "25.9",
        },
        menu_1488: {
            id: "menu_Adobe_CSXS_Extension_comadobeDesignLibrariesangularLibraries",
            action: "Adobe CSXS Extension com.adobe.DesignLibraries.angularLibraries",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Libraries",
                de: "Fenster > Bibliotheken",
                ru: "\u041e\u043a\u043d\u043e > \u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438",
                "zh-cn": "Window > Libraries",
                zh_TW: "\u8996\u7a97 > Libraries",
            },
            hidden: false,
        },
        menu_1489: {
            id: "menu_Adobe_LinkPalette_Menu_Item",
            action: "Adobe LinkPalette Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Links",
                de: "Fenster > Verkn\u00fcpfungen",
                ru: "\u041e\u043a\u043d\u043e > \u0421\u0432\u044f\u0437\u0438",
                "zh-cn": "Window > Links",
                zh_TW: "\u8996\u7a97 > Links",
            },
            hidden: false,
        },
        menu_1490: {
            id: "menu_AI_Magic_Wand",
            action: "AI Magic Wand",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Magic Wand",
                de: "Fenster > Zauberstab",
                ru: "\u041e\u043a\u043d\u043e > \u0412\u043e\u043b\u0448\u0435\u0431\u043d\u0430\u044f \u043f\u0430\u043b\u043e\u0447\u043a\u0430",
                "zh-cn": "Window > Magic Wand",
                zh_TW: "\u8996\u7a97 > Magic Wand",
            },
            hidden: false,
        },
        menu_1491: {
            id: "menu_Adobe_Vector_Edge_Panel",
            action: "Adobe Vector Edge Panel",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Mockup",
                de: "Window > Mockup",
                ru: "Window > Mockup",
                "zh-cn": "Window > Mockup",
                zh_TW: "\u8996\u7a97 > Mockup",
            },
            hidden: false,
            minVersion: "28",
        },
        menu_1492: {
            id: "menu_AdobeNavigator",
            action: "AdobeNavigator",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Navigator",
                de: "Fenster > Navigator",
                ru: "\u041e\u043a\u043d\u043e > \u041d\u0430\u0432\u0438\u0433\u0430\u0442\u043e\u0440",
                "zh-cn": "Window > Navigator",
                zh_TW: "\u8996\u7a97 > Navigator",
            },
            hidden: false,
        },
        menu_1493: {
            id: "menu_Adobe_PathfinderUI",
            action: "Adobe PathfinderUI",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Pathfinder",
                de: "Fenster > Pathfinder",
                ru: "\u041e\u043a\u043d\u043e > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432",
                "zh-cn": "Window > Pathfinder",
                zh_TW: "\u8996\u7a97 > \u8def\u5f91\u7ba1\u7406\u54e1",
            },
            hidden: false,
        },
        menu_1494: {
            id: "menu_Adobe_Pattern_Panel_Toggle",
            action: "Adobe Pattern Panel Toggle",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Pattern Options",
                de: "Fenster > Musteroptionen",
                ru: "\u041e\u043a\u043d\u043e > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0443\u0437\u043e\u0440\u0430",
                "zh-cn": "Window > Pattern Options",
                zh_TW: "\u8996\u7a97 > Pattern Options",
            },
            hidden: false,
        },
        menu_1496: {
            id: "menu_ReTypeWindowMenu",
            action: "ReTypeWindowMenu",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Retype",
                de: "Fenster > Retype",
                ru: "Window > Retype",
                "zh-cn": "Window > Retype",
                zh_TW: "\u8996\u7a97 > Retype",
            },
            hidden: false,
            minVersion: "27.6",
        },
        menu_1497: {
            id: "menu_Adobe_Separation_Preview_Panel",
            action: "Adobe Separation Preview Panel",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Separations Preview",
                de: "Fenster > Separationenvorschau",
                ru: "\u041e\u043a\u043d\u043e > \u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u0446\u0432\u0435\u0442\u043e\u0434\u0435\u043b\u0435\u043d\u0438\u0439",
                "zh-cn": "Window > Separations Preview",
                zh_TW: "\u8996\u7a97 > Separations Preview",
            },
            hidden: false,
        },
        menu_1498: {
            id: "menu_Adobe_Stroke_Palette",
            action: "Adobe Stroke Palette",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Stroke",
                de: "Fenster > Kontur",
                ru: "\u041e\u043a\u043d\u043e > \u041e\u0431\u0432\u043e\u0434\u043a\u0430",
                "zh-cn": "Window > Stroke",
                zh_TW: "\u8996\u7a97 > Stroke",
            },
            hidden: false,
        },
        menu_1499: {
            id: "menu_Adobe_SVG_Interactivity_Palette",
            action: "Adobe SVG Interactivity Palette",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > SVG Interactivity",
                de: "Fenster > SVG-Interaktivit\u00e4t",
                ru: "\u041e\u043a\u043d\u043e > \u0418\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0441\u0442\u044c SVG",
                "zh-cn": "Window > SVG Interactivity",
                zh_TW: "\u8996\u7a97 > SVG Interactivity",
            },
            hidden: false,
        },
        menu_1500: {
            id: "menu_Adobe_Swatches_Menu_Item",
            action: "Adobe Swatches Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Swatches",
                de: "Fenster > Farbfelder",
                ru: "\u041e\u043a\u043d\u043e > \u041e\u0431\u0440\u0430\u0437\u0446\u044b",
                "zh-cn": "Window > Swatches",
                zh_TW: "\u8996\u7a97 > Swatches",
            },
            hidden: false,
        },
        menu_1501: {
            id: "menu_Adobe_Symbol_Palette",
            action: "Adobe Symbol Palette",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Symbols",
                de: "Fenster > Symbole",
                ru: "\u041e\u043a\u043d\u043e > \u0421\u0438\u043c\u0432\u043e\u043b\u044b",
                "zh-cn": "Window > Symbols",
                zh_TW: "\u8996\u7a97 > Symbols",
            },
            hidden: false,
        },
        menu_1502: {
            id: "menu_AdobeTransformObjects1",
            action: "AdobeTransformObjects1",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Transform",
                de: "Fenster > Transformieren",
                ru: "\u041e\u043a\u043d\u043e > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435",
                "zh-cn": "Window > Transform",
                zh_TW: "\u8996\u7a97 > Transform",
            },
            hidden: false,
        },
        menu_1503: {
            id: "menu_Adobe_Transparency_Palette_Menu_Item",
            action: "Adobe Transparency Palette Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Transparency",
                de: "Fenster > Transparenz",
                ru: "\u041e\u043a\u043d\u043e > \u041f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c",
                "zh-cn": "Window > Transparency",
                zh_TW: "\u8996\u7a97 > Transparency",
            },
            hidden: false,
        },
        menu_1504: {
            id: "menu_internal_palettes_posing_as_plug-in_menus-character",
            action: "internal palettes posing as plug-in menus-character",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Type > Character",
                de: "Fenster > Schrift > Zeichen",
                ru: "\u041e\u043a\u043d\u043e > \u0422\u0435\u043a\u0441\u0442 > \u0421\u0438\u043c\u0432\u043e\u043b",
                "zh-cn": "Window > Type > Character",
                zh_TW: "\u8996\u7a97 > \u6587\u5b57 > Character",
            },
            hidden: false,
        },
        menu_1505: {
            id: "menu_Character_Styles",
            action: "Character Styles",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Type > Character Styles",
                de: "Fenster > Schrift > Zeichenformate",
                ru: "\u041e\u043a\u043d\u043e > \u0422\u0435\u043a\u0441\u0442 > \u0421\u0442\u0438\u043b\u0438 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
                "zh-cn": "Window > Type > Character Styles",
                zh_TW: "\u8996\u7a97 > \u6587\u5b57 > Character Styles",
            },
            hidden: false,
        },
        menu_1506: {
            id: "menu_alternate_glyph_palette_plugin_2",
            action: "alternate glyph palette plugin 2",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Type > Glyphs",
                de: "Fenster > Schrift > Glyphen",
                ru: "\u041e\u043a\u043d\u043e > \u0422\u0435\u043a\u0441\u0442 > \u0413\u043b\u0438\u0444\u044b",
                "zh-cn": "Window > Type > Glyphs",
                zh_TW: "\u8996\u7a97 > \u6587\u5b57 > Glyphs",
            },
            hidden: false,
        },
        menu_1507: {
            id: "menu_internal_palettes_posing_as_plug-in_menus-opentype",
            action: "internal palettes posing as plug-in menus-opentype",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Type > OpenType",
                de: "Fenster > Schrift > OpenType",
                ru: "\u041e\u043a\u043d\u043e > \u0422\u0435\u043a\u0441\u0442 > OpenType",
                "zh-cn": "Window > Type > OpenType",
                zh_TW: "\u8996\u7a97 > \u6587\u5b57 > OpenType",
            },
            hidden: false,
        },
        menu_1508: {
            id: "menu_internal_palettes_posing_as_plug-in_menus-paragraph",
            action: "internal palettes posing as plug-in menus-paragraph",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Type > Paragraph",
                de: "Fenster > Schrift > Absatz",
                ru: "\u041e\u043a\u043d\u043e > \u0422\u0435\u043a\u0441\u0442 > \u0410\u0431\u0437\u0430\u0446",
                "zh-cn": "Window > Type > Paragraph",
                zh_TW: "\u8996\u7a97 > \u6587\u5b57 > Paragraph",
            },
            hidden: false,
        },
        menu_1509: {
            id: "menu_Adobe_Paragraph_Styles_Palette",
            action: "Adobe Paragraph Styles Palette",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Type > Paragraph Styles",
                de: "Fenster > Schrift > Absatzformate",
                ru: "\u041e\u043a\u043d\u043e > \u0422\u0435\u043a\u0441\u0442 > \u0421\u0442\u0438\u043b\u0438 \u0430\u0431\u0437\u0430\u0446\u0435\u0432",
                "zh-cn": "Window > Type > Paragraph Styles",
                zh_TW: "\u8996\u7a97 > \u6587\u5b57 > Paragraph Styles",
            },
            hidden: false,
        },
        menu_1510: {
            id: "menu_ReflowWindowMenu",
            action: "ReflowWindowMenu",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Type > Reflow Viewer",
                de: "Window > Type > Reflow Viewer",
                ru: "Window > Type > Reflow Viewer",
                "zh-cn": "Window > Type > Reflow Viewer",
                zh_TW: "\u8996\u7a97 > \u6587\u5b57 > Reflow Viewer",
            },
            hidden: false,
            minVersion: "29",
        },
        menu_1511: {
            id: "menu_internal_palettes_posing_as_plug-in_menus-tab",
            action: "internal palettes posing as plug-in menus-tab",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Type > Tabs",
                de: "Fenster > Schrift > Tabulatoren",
                ru: "\u041e\u043a\u043d\u043e > \u0422\u0435\u043a\u0441\u0442 > \u0422\u0430\u0431\u0443\u043b\u044f\u0446\u0438\u044f",
                "zh-cn": "Window > Type > Tabs",
                zh_TW: "\u8996\u7a97 > \u6587\u5b57 > Tabs",
            },
            hidden: false,
        },
        menu_1512: {
            id: "menu_Adobe_Variables_Palette_Menu_Item",
            action: "Adobe Variables Palette Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Variables",
                de: "Fenster > Variablen",
                ru: "\u041e\u043a\u043d\u043e > \u041f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435",
                "zh-cn": "Window > Variables",
                zh_TW: "\u8996\u7a97 > Variables",
            },
            hidden: false,
        },
        menu_1513: {
            id: "menu_Adobe_Version_History_File_Menu_Item",
            action: "Adobe Version History File Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Version History",
                de: "Fenster > Versionsverlauf",
                ru: "\u041e\u043a\u043d\u043e > \u0416\u0443\u0440\u043d\u0430\u043b \u0432\u0435\u0440\u0441\u0438\u0439",
                "zh-cn": "Window > Version History",
                zh_TW: "\u8996\u7a97 > Version History",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1539: {
            id: "menu_AdobeBrushMgrUI_Other_libraries_menu_item",
            action: "AdobeBrushMgrUI Other libraries menu item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Brush Libraries > Other Library...",
                de: "Fenster > Pinsel-Bibliotheken > Andere Bibliothek \u2026",
                ru: "\u041e\u043a\u043d\u043e > \u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438 \u043a\u0438\u0441\u0442\u0435\u0439 > \u0414\u0440\u0443\u0433\u0430\u044f \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430...",
                "zh-cn": "Window > Brush Libraries > Other Library...",
                zh_TW: "\u8996\u7a97 > Brush Libraries > Other Library...",
            },
            hidden: false,
        },
        menu_1552: {
            id: "menu_Adobe_Art_Style_Plugin_Other_libraries_menu_item",
            action: "Adobe Art Style Plugin Other libraries menu item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Graphic Style Libraries > Other Library...",
                de: "Fenster > Grafikstil-Bibliotheken > Andere Bibliothek \u2026",
                ru: "\u041e\u043a\u043d\u043e > \u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438 \u0441\u0442\u0438\u043b\u0435\u0439 \u0433\u0440\u0430\u0444\u0438\u043a\u0438 > \u0414\u0440\u0443\u0433\u0430\u044f \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430...",
                "zh-cn": "Window > Graphic Style Libraries > Other Library...",
                zh_TW: "\u8996\u7a97 > Graphic Style Libraries > Other Library...",
            },
            hidden: false,
        },
        menu_1654: {
            id: "menu_AdobeSwatch__Other_libraries_menu_item",
            action: "AdobeSwatch_ Other libraries menu item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Swatch Libraries > Other Library...",
                de: "Fenster > Farbfeld-Bibliotheken > Andere Bibliothek \u2026",
                ru: "\u041e\u043a\u043d\u043e > \u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438 \u043e\u0431\u0440\u0430\u0437\u0446\u043e\u0432 > \u0414\u0440\u0443\u0433\u0430\u044f \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430...",
                "zh-cn": "Window > Swatch Libraries > Other Library...",
                zh_TW: "\u8996\u7a97 > Swatch Libraries > Other Library...",
            },
            hidden: false,
        },
        menu_1683: {
            id: "menu_Adobe_Symbol_Palette_Plugin_Other_libraries_menu_item",
            action: "Adobe Symbol Palette Plugin Other libraries menu item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Window > Symbol Libraries > Other Library...",
                de: "Fenster > Symbol-Bibliotheken > Andere Bibliothek \u2026",
                ru: "\u041e\u043a\u043d\u043e > \u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432 > \u0414\u0440\u0443\u0433\u0430\u044f \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430...",
                "zh-cn": "Window > Symbol Libraries > Other Library...",
                zh_TW: "\u8996\u7a97 > Symbol Libraries > Other Library...",
            },
            hidden: false,
        },
        menu_1684: {
            id: "menu_helpcontent",
            action: "helpcontent",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Help > Illustrator Help...",
                de: "Hilfe > Illustrator-Hilfe \u2026",
                ru: "\u0421\u043f\u0440\u0430\u0432\u043a\u0430 > \u0421\u043f\u0440\u0430\u0432\u043a\u0430 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b Illustrator...",
                "zh-cn": "Help > Illustrator Help...",
                zh_TW: "\u8aaa\u660e > Illustrator Help...",
            },
            hidden: false,
        },
        menu_1685: {
            id: "menu_whatsNewContent",
            action: "whatsNewContent",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Help > Tutorials...",
                de: "Help > Tutorials...",
                ru: "Help > Tutorials...",
                "zh-cn": "Help > Tutorials...",
                zh_TW: "\u8aaa\u660e > Tutorials...",
            },
            hidden: false,
            minVersion: "27.9",
        },
        menu_2161: {
            id: "menu_whatsNewContent",
            action: "whatsNewContent",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Help > What's New...",
                de: "Help > What's New...",
                ru: "Help > What's New...",
                "zh-cn": "Help > What's New...",
                zh_TW: "\u8aaa\u660e > What's New...",
            },
            hidden: false,
            minVersion: "27.9",
        },
        menu_1686: {
            id: "menu_supportCommunity",
            action: "supportCommunity",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Help > Support Community",
                de: "Hilfe > Support-Community",
                ru: "\u0421\u043f\u0440\u0430\u0432\u043a\u0430 > \u0421\u043e\u043e\u0431\u0449\u0435\u0441\u0442\u0432\u043e \u0441\u043b\u0443\u0436\u0431\u044b \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0438",
                "zh-cn": "Help > Support Community",
                zh_TW: "\u8aaa\u660e > Support Community",
            },
            hidden: false,
            minVersion: "26",
        },
        menu_1687: {
            id: "menu_wishform",
            action: "wishform",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Help > Submit Bug/Feature Request...",
                de: "Hilfe > Fehlermeldung / Funktionswunsch senden \u2026",
                ru: "\u0421\u043f\u0440\u0430\u0432\u043a\u0430 > \u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435 \u043e\u0431 \u043e\u0448\u0438\u0431\u043a\u0435/\u0437\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043d\u043e\u0432\u044b\u0445 \u0444\u0443\u043d\u043a\u0446\u0438\u0439...",
                "zh-cn": "Help > Submit Bug/Feature Request...",
                zh_TW: "\u8aaa\u660e > Submit Bug/Feature Request...",
            },
            hidden: false,
            minVersion: "25",
        },
        menu_1688: {
            id: "menu_System_Info",
            action: "System Info",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Help > System Info...",
                de: "Hilfe > Systeminformationen \u2026",
                ru: "\u0421\u043f\u0440\u0430\u0432\u043a\u0430 > \u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u043e \u0441\u0438\u0441\u0442\u0435\u043c\u0435\u2026",
                "zh-cn": "Help > System Info...",
                zh_TW: "\u8aaa\u660e > System Info...",
            },
            hidden: false,
        },
        menu_1694: {
            id: "menu_Adobe_Actions_Batch",
            action: "Adobe Actions Batch",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Palette > Actions > Batch...",
                de: "Anderes Bedienfeld > Aktionsstapel \u2026",
                ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u041e\u043f\u0435\u0440\u0430\u0446\u0438\u0438 > \u041f\u0430\u043a\u0435\u0442\u043d\u0430\u044f \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430\u2026",
                "zh-cn": "Palette > Actions > Batch...",
                zh_TW: "Palette > Actions > Batch...",
            },
            hidden: false,
        },
        menu_1695: {
            id: "menu_Adobe_New_Fill_Shortcut",
            action: "Adobe New Fill Shortcut",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Palette > Appearance > Add New Fill",
                de: "Anderes Bedienfeld > Neue Fl\u00e4che hinzuf\u00fcgen",
                ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 > \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043d\u043e\u0432\u0443\u044e \u0437\u0430\u043b\u0438\u0432\u043a\u0443",
                "zh-cn": "Palette > Appearance > Add New Fill",
                zh_TW: "Palette > Appearance > Add New Fill",
            },
            hidden: false,
        },
        menu_1696: {
            id: "menu_Adobe_New_Stroke_Shortcut",
            action: "Adobe New Stroke Shortcut",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Palette > Appearance > Add New Stroke",
                de: "Anderes Bedienfeld > Neue Kontur hinzuf\u00fcgen",
                ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 > \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043d\u043e\u0432\u0443\u044e \u043e\u0431\u0432\u043e\u0434\u043a\u0443",
                "zh-cn": "Palette > Appearance > Add New Stroke",
                zh_TW: "Palette > Appearance > Add New Stroke",
            },
            hidden: false,
        },
        menu_1697: {
            id: "menu_Adobe_New_Style_Shortcut",
            action: "Adobe New Style Shortcut",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Palette > Graphic Styles > New Graphic Style...",
                de: "Anderes Bedienfeld > Neuer Grafikstil \u2026",
                ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u0421\u0442\u0438\u043b\u0438 \u0433\u0440\u0430\u0444\u0438\u043a\u0438 > \u041d\u043e\u0432\u044b\u0439 \u0441\u0442\u0438\u043b\u044c \u0433\u0440\u0430\u0444\u0438\u043a\u0438",
                "zh-cn": "Palette > Graphic Styles > New Graphic Style...",
                zh_TW: "Palette > Graphic Styles > New Graphic Style...",
            },
            hidden: false,
        },
        menu_1698: {
            id: "menu_AdobeLayerPalette2",
            action: "AdobeLayerPalette2",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Palette > Layers > New Layer",
                de: "Anderes Bedienfeld > Neue Ebene",
                ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u0421\u043b\u043e\u0438 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043d\u043e\u0432\u044b\u0439 \u0441\u043b\u043e\u0439",
                "zh-cn": "Palette > Layers > New Layer",
                zh_TW: "Palette > Layers > New Layer",
            },
            hidden: false,
        },
        menu_1699: {
            id: "menu_AdobeLayerPalette3",
            action: "AdobeLayerPalette3",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Palette > Layers > New Layer with Dialog...",
                de: "Anderes Bedienfeld > Neue Ebene mit Dialog \u2026",
                ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u0421\u043b\u043e\u0438 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043d\u043e\u0432\u044b\u0439 \u0441 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u0430\u043c\u0438...",
                "zh-cn": "Palette > Layers > New Layer with Dialog...",
                zh_TW: "Palette > Layers > New Layer with Dialog...",
            },
            hidden: false,
        },
        menu_1700: {
            id: "menu_Adobe_Update_Link_Shortcut",
            action: "Adobe Update Link Shortcut",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Palette > Links > Update Link",
                de: "Anderes Bedienfeld > Verkn\u00fcpfung aktualisieren",
                ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u0421\u0432\u044f\u0437\u0438 > \u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u0441\u0432\u044f\u0437\u044c",
                "zh-cn": "Palette > Links > Update Link",
                zh_TW: "Palette > Links > Update Link",
            },
            hidden: false,
        },
        menu_1701: {
            id: "menu_Adobe_New_Swatch_Shortcut_Menu",
            action: "Adobe New Swatch Shortcut Menu",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Palette > Swatches > New Swatch...",
                de: "Anderes Bedienfeld > Neues Farbfeld \u2026",
                ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u041e\u0431\u0440\u0430\u0437\u0446\u044b > \u041d\u043e\u0432\u044b\u0439 \u043e\u0431\u0440\u0430\u0437\u0435\u0446",
                "zh-cn": "Palette > Swatches > New Swatch...",
                zh_TW: "Palette > Swatches > New Swatch...",
            },
            hidden: false,
        },
        menu_1702: {
            id: "menu_Adobe_New_Symbol_Shortcut",
            action: "Adobe New Symbol Shortcut",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Palette > Symbols > New Symbol...",
                de: "Anderes Bedienfeld > Neues Symbol \u2026",
                ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u0421\u0438\u043c\u0432\u043e\u043b\u044b > \u041d\u043e\u0432\u044b\u0439 \u0441\u0438\u043c\u0432\u043e\u043b",
                "zh-cn": "Palette > Symbols > New Symbol...",
                zh_TW: "Palette > Symbols > New Symbol...",
            },
            hidden: false,
        },
        menu_1703: {
            id: "menu_about",
            action: "about",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "About Illustrator...",
                de: "\u00dcber Illustrator \u2026",
                ru: "\u041e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0435 Illustrator\u2026",
                "zh-cn": "About Illustrator...",
                zh_TW: "About Illustrator...",
            },
            hidden: false,
        },
        menu_1704: {
            id: "menu_preference",
            action: "preference",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > General...",
                de: "Voreinstellungen > Allgemein \u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435\u2026",
                "zh-cn": "Preferences > General...",
                zh_TW: "Preferences > General...",
            },
            hidden: false,
        },
        menu_1705: {
            id: "menu_selectPref",
            action: "selectPref",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > Selection & Anchor Display...",
                de: "Voreinstellungen > Auswahl und Ankerpunkt-Anzeige \u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u041e\u0442\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u044f \u0438 \u043e\u043f\u043e\u0440\u043d\u044b\u0445 \u0442\u043e\u0447\u0435\u043a\u2026",
                "zh-cn": "Preferences > Selection & Anchor Display...",
                zh_TW: "Preferences > Selection & Anchor Display...",
            },
            hidden: false,
        },
        menu_1706: {
            id: "menu_keyboardPref",
            action: "keyboardPref",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > Type...",
                de: "Voreinstellungen > Schrift \u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0422\u0435\u043a\u0441\u0442\u2026",
                "zh-cn": "Preferences > Type...",
                zh_TW: "Preferences > Type...",
            },
            hidden: false,
        },
        menu_1707: {
            id: "menu_unitundoPref",
            action: "unitundoPref",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > Units...",
                de: "Voreinstellungen > Einheit \u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0415\u0434\u0438\u043d\u0438\u0446\u044b \u0438\u0437\u043c\u0435\u0440\u0435\u043d\u0438\u044f\u2026",
                "zh-cn": "Preferences > Units...",
                zh_TW: "Preferences > Units...",
            },
            hidden: false,
        },
        menu_1708: {
            id: "menu_guidegridPref",
            action: "guidegridPref",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > Guides & Grid...",
                de: "Voreinstellungen > Hilfslinien und Raster \u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435 \u0438 \u0441\u0435\u0442\u043a\u0430\u2026",
                "zh-cn": "Preferences > Guides & Grid...",
                zh_TW: "Preferences > Guides & Grid...",
            },
            hidden: false,
        },
        menu_1709: {
            id: "menu_snapPref",
            action: "snapPref",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > Smart Guides...",
                de: "Voreinstellungen > Intelligente Hilfslinien \u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0411\u044b\u0441\u0442\u0440\u044b\u0435 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435\u2026",
                "zh-cn": "Preferences > Smart Guides...",
                zh_TW: "Preferences > Smart Guides...",
            },
            hidden: false,
        },
        menu_1710: {
            id: "menu_slicePref",
            action: "slicePref",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > Slices...",
                de: "Voreinstellungen > Slices \u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b\u2026",
                "zh-cn": "Preferences > Slices...",
                zh_TW: "Preferences > Slices...",
            },
            hidden: false,
        },
        menu_1711: {
            id: "menu_hyphenPref",
            action: "hyphenPref",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > Hyphenation...",
                de: "Voreinstellungen > Silbentrennung \u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0420\u0430\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430 \u043f\u0435\u0440\u0435\u043d\u043e\u0441\u043e\u0432\u2026",
                "zh-cn": "Preferences > Hyphenation...",
                zh_TW: "Preferences > Hyphenation...",
            },
            hidden: false,
        },
        menu_1712: {
            id: "menu_pluginPref",
            action: "pluginPref",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > Plug-ins & Scratch Disks...",
                de: "Voreinstellungen > Zusatzmodule und virtueller Speicher \u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0412\u043d\u0435\u0448\u043d\u0438\u0435 \u043c\u043e\u0434\u0443\u043b\u0438 \u0438 \u0440\u0430\u0431\u043e\u0447\u0438\u0435 \u0434\u0438\u0441\u043a\u0438\u2026",
                "zh-cn": "Preferences > Plug-ins & Scratch Disks...",
                zh_TW: "Preferences > Plug-ins & Scratch Disks...",
            },
            hidden: false,
        },
        menu_1713: {
            id: "menu_UIPref",
            action: "UIPref",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > User Interface...",
                de: "Voreinstellungen > Benutzeroberfl\u00e4che \u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0418\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f\u2026",
                "zh-cn": "Preferences > User Interface...",
                zh_TW: "Preferences > User Interface...",
            },
            hidden: false,
        },
        menu_1714: {
            id: "menu_GPUPerformancePref",
            action: "GPUPerformancePref",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > Performance",
                de: "Voreinstellungen > Leistung \u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u041f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c\u2026",
                "zh-cn": "Preferences > Performance",
                zh_TW: "Preferences > Performance",
            },
            hidden: false,
            minVersion: "19",
        },
        menu_1715: {
            id: "menu_FilePref",
            action: "FilePref",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > File Handling...",
                de: "Voreinstellungen > Dateihandhabung\u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u0444\u0430\u0439\u043b\u043e\u0432\u2026",
                "zh-cn": "Preferences > File Handling...",
                zh_TW: "Preferences > File Handling...",
            },
            hidden: false,
        },
        menu_1716: {
            id: "menu_ClipboardPref",
            action: "ClipboardPref",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > Clipboard Handling",
                de: "Voreinstellungen > Zwischenablageoptionen \u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u0431\u0443\u0444\u0435\u0440\u0430\u2026",
                "zh-cn": "Preferences > Clipboard Handling",
                zh_TW: "Preferences > Clipboard Handling",
            },
            hidden: false,
            minVersion: "25",
        },
        menu_1717: {
            id: "menu_BlackPref",
            action: "BlackPref",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > Appearance of Black...",
                de: "Bearbeiten > Voreinstellungen > Aussehen von Schwarz \u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0412\u043e\u0441\u043f\u0440\u043e\u0438\u0437\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u0447\u0435\u0440\u043d\u043e\u0433\u043e \u0446\u0432\u0435\u0442\u0430...",
                "zh-cn": "Preferences > Appearance of Black...",
                zh_TW: "Preferences > Appearance of Black...",
            },
            hidden: false,
        },
        menu_1718: {
            id: "menu_DevicesPref",
            action: "DevicesPref",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Preferences > Devices",
                de: "Voreinstellungen > Ger\u00e4te \u2026",
                ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0423\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430\u2026",
                "zh-cn": "Preferences > Devices",
                zh_TW: "Preferences > Devices",
            },
            hidden: false,
            minVersion: "24",
        },
        menu_1719: {
            id: "menu_Debug_Panel",
            action: "Debug Panel",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Debug Panel",
                de: "Debug Panel",
                ru: "Debug Panel",
                "zh-cn": "Debug Panel",
                zh_TW: "Debug Panel",
            },
            hidden: false,
        },
        menu_2020: {
            id: "menu_faceSizeUp",
            action: "faceSizeUp",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Point Size Up",
                de: "Other Text > Point Size Up",
                ru: "Other Text > Point Size Up",
                "zh-cn": "Other Text > Point Size Up",
                zh_TW: "Other Text > Point Size Up",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2021: {
            id: "menu_faceSizeDown",
            action: "faceSizeDown",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Point Size Down",
                de: "Other Text > Point Size Down",
                ru: "Other Text > Point Size Down",
                "zh-cn": "Other Text > Point Size Down",
                zh_TW: "Other Text > Point Size Down",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2022: {
            id: "menu_sizeStepUp",
            action: "sizeStepUp",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Font Size Step Up",
                de: "Other Text > Font Size Step Up",
                ru: "Other Text > Font Size Step Up",
                "zh-cn": "Other Text > Font Size Step Up",
                zh_TW: "Other Text > Font Size Step Up",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2023: {
            id: "menu_sizeStepDown",
            action: "sizeStepDown",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Font Size Step Down",
                de: "Other Text > Font Size Step Down",
                ru: "Other Text > Font Size Step Down",
                "zh-cn": "Other Text > Font Size Step Down",
                zh_TW: "Other Text > Font Size Step Down",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2024: {
            id: "menu_~kernFurther",
            action: "~kernFurther",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Other Text > Kern Looser",
                de: "Other Text > Kern Looser",
                ru: "Other Text > Kern Looser",
                "zh-cn": "Other Text > Kern Looser",
                zh_TW: "Other Text > Kern Looser",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2025: {
            id: "menu_~kernCloser",
            action: "~kernCloser",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Other Text > Kern Tighter",
                de: "Other Text > Kern Tighter",
                ru: "Other Text > Kern Tighter",
                "zh-cn": "Other Text > Kern Tighter",
                zh_TW: "Other Text > Kern Tighter",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2026: {
            id: "menu_tracking",
            action: "tracking",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Tracking",
                de: "Other Text > Tracking",
                ru: "Other Text > Tracking",
                "zh-cn": "Other Text > Tracking",
                zh_TW: "Other Text > Tracking",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2027: {
            id: "menu_clearTrack",
            action: "clearTrack",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Clear Tracking",
                de: "Other Text > Clear Tracking",
                ru: "Other Text > Clear Tracking",
                "zh-cn": "Other Text > Clear Tracking",
                zh_TW: "Other Text > Clear Tracking",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2028: {
            id: "menu_spacing",
            action: "spacing",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Spacing",
                de: "Other Text > Spacing",
                ru: "Other Text > Spacing",
                "zh-cn": "Other Text > Spacing",
                zh_TW: "Other Text > Spacing",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2029: {
            id: "menu_clearTypeScale",
            action: "clearTypeScale",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Uniform Type",
                de: "Other Text > Uniform Type",
                ru: "Other Text > Uniform Type",
                "zh-cn": "Other Text > Uniform Type",
                zh_TW: "Other Text > Uniform Type",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2030: {
            id: "menu_highlightFont",
            action: "highlightFont",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Highlight Font",
                de: "Other Text > Highlight Font",
                ru: "Other Text > Highlight Font",
                "zh-cn": "Other Text > Highlight Font",
                zh_TW: "Other Text > Highlight Font",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2031: {
            id: "menu_highlightFont2",
            action: "highlightFont2",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Highlight Font (Secondary)",
                de: "Other Text > Highlight Font (Secondary)",
                ru: "Other Text > Highlight Font (Secondary)",
                "zh-cn": "Other Text > Highlight Font (Secondary)",
                zh_TW: "Other Text > Highlight Font (Secondary)",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2032: {
            id: "menu_leftAlign",
            action: "leftAlign",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Left Align Text",
                de: "Other Text > Left Align Text",
                ru: "Other Text > Left Align Text",
                "zh-cn": "Other Text > Left Align Text",
                zh_TW: "Other Text > Left Align Text",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2033: {
            id: "menu_centerAlign",
            action: "centerAlign",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Center Text",
                de: "Other Text > Center Text",
                ru: "Other Text > Center Text",
                "zh-cn": "Other Text > Center Text",
                zh_TW: "Other Text > Center Text",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2034: {
            id: "menu_rightAlign",
            action: "rightAlign",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Right Align Text",
                de: "Other Text > Right Align Text",
                ru: "Other Text > Right Align Text",
                "zh-cn": "Other Text > Right Align Text",
                zh_TW: "Other Text > Right Align Text",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2035: {
            id: "menu_justify",
            action: "justify",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Justify Text Left",
                de: "Other Text > Justify Text Left",
                ru: "Other Text > Justify Text Left",
                "zh-cn": "Other Text > Justify Text Left",
                zh_TW: "Other Text > Justify Text Left",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2036: {
            id: "menu_justifyCenter",
            action: "justifyCenter",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Justify Text Center",
                de: "Other Text > Justify Text Center",
                ru: "Other Text > Justify Text Center",
                "zh-cn": "Other Text > Justify Text Center",
                zh_TW: "Other Text > Justify Text Center",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2037: {
            id: "menu_justifyRight",
            action: "justifyRight",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Justify Text Right",
                de: "Other Text > Justify Text Right",
                ru: "Other Text > Justify Text Right",
                "zh-cn": "Other Text > Justify Text Right",
                zh_TW: "Other Text > Justify Text Right",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2038: {
            id: "menu_justifyAll",
            action: "justifyAll",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Justify All Lines",
                de: "Other Text > Justify All Lines",
                ru: "Other Text > Justify All Lines",
                "zh-cn": "Other Text > Justify All Lines",
                zh_TW: "Other Text > Justify All Lines",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2039: {
            id: "menu_toggleAutoHyphen",
            action: "toggleAutoHyphen",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Toggle Auto Hyphenation",
                de: "Other Text > Toggle Auto Hyphenation",
                ru: "Other Text > Toggle Auto Hyphenation",
                "zh-cn": "Other Text > Toggle Auto Hyphenation",
                zh_TW: "Other Text > Toggle Auto Hyphenation",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2040: {
            id: "menu_toggleLineComposer",
            action: "toggleLineComposer",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Toggle Line Composer",
                de: "Other Text > Toggle Line Composer",
                ru: "Other Text > Toggle Line Composer",
                "zh-cn": "Other Text > Toggle Line Composer",
                zh_TW: "Other Text > Toggle Line Composer",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2041: {
            id: "menu_~subscript",
            action: "~subscript",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Subscript",
                de: "Other Text > Subscript",
                ru: "Other Text > Subscript",
                "zh-cn": "Other Text > Subscript",
                zh_TW: "Other Text > Subscript",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2042: {
            id: "menu_~superScript",
            action: "~superScript",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Superscript",
                de: "Other Text > Superscript",
                ru: "Other Text > Superscript",
                "zh-cn": "Other Text > Superscript",
                zh_TW: "Other Text > Superscript",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2043: {
            id: "menu_~textBold",
            action: "~textBold",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Bold",
                de: "Other Text > Bold",
                ru: "Other Text > Bold",
                "zh-cn": "Other Text > Bold",
                zh_TW: "Other Text > Bold",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2044: {
            id: "menu_~textItalic",
            action: "~textItalic",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Italic",
                de: "Other Text > Italic",
                ru: "Other Text > Italic",
                "zh-cn": "Other Text > Italic",
                zh_TW: "Other Text > Italic",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2045: {
            id: "menu_~textUnderline",
            action: "~textUnderline",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Text > Underline",
                de: "Other Text > Underline",
                ru: "Other Text > Underline",
                "zh-cn": "Other Text > Underline",
                zh_TW: "Other Text > Underline",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2046: {
            id: "menu_lock2",
            action: "lock2",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Object > Lock Others",
                de: "Other Object > Lock Others",
                ru: "Other Object > Lock Others",
                "zh-cn": "Other Object > Lock Others",
                zh_TW: "Other Object > Lock Others",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2047: {
            id: "menu_hide2",
            action: "hide2",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Object > Hide Others",
                de: "Other Object > Hide Others",
                ru: "Other Object > Hide Others",
                "zh-cn": "Other Object > Hide Others",
                zh_TW: "Other Object > Hide Others",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2048: {
            id: "menu_repeatPathfinder",
            action: "repeatPathfinder",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Object > Repeat Pathfinder",
                de: "Other Object > Repeat Pathfinder",
                ru: "Other Object > Repeat Pathfinder",
                "zh-cn": "Other Object > Repeat Pathfinder",
                zh_TW: "Other Object > Repeat Pathfinder",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2049: {
            id: "menu_avgAndJoin",
            action: "avgAndJoin",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Object > Average & Join",
                de: "Other Object > Average & Join",
                ru: "Other Object > Average & Join",
                "zh-cn": "Other Object > Average & Join",
                zh_TW: "Other Object > Average & Join",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2050: {
            id: "menu_enterFocus",
            action: "enterFocus",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Object > Isolate Selected Object",
                de: "Other Object > Isolate Selected Object",
                ru: "Other Object > Isolate Selected Object",
                "zh-cn": "Other Object > Isolate Selected Object",
                zh_TW: "Other Object > Isolate Selected Object",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2051: {
            id: "menu_exitFocus",
            action: "exitFocus",
            type: "menu",
            docRequired: true,
            selRequired: true,
            name: {
                en: "Other Object > Exit Isolation Mode",
                de: "Other Object > Exit Isolation Mode",
                ru: "Other Object > Exit Isolation Mode",
                "zh-cn": "Other Object > Exit Isolation Mode",
                zh_TW: "Other Object > Exit Isolation Mode",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2052: {
            id: "menu_switchSelTool",
            action: "switchSelTool",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Other Select > Switch Selection Tool",
                de: "Other Select > Switch Selection Tool",
                ru: "Other Select > Switch Selection Tool",
                "zh-cn": "Other Select > Switch Selection Tool",
                zh_TW: "Other Select > Switch Selection Tool",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2053: {
            id: "menu_new2",
            action: "new2",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Other Misc > New File (No Dialog)",
                de: "Other Misc > New File (No Dialog)",
                ru: "Other Misc > New File (No Dialog)",
                "zh-cn": "Other Misc > New File (No Dialog)",
                zh_TW: "Other Misc > New File (No Dialog)",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2060: {
            id: "menu_navigateToNextDocument",
            action: "navigateToNextDocument",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Other Misc > Navigate to Next Document",
                de: "Other Misc > Navigate to Next Document",
                ru: "Other Misc > Navigate to Next Document",
                "zh-cn": "Other Misc > Navigate to Next Document",
                zh_TW: "Other Misc > Navigate to Next Document",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2061: {
            id: "menu_navigateToPreviousDocument",
            action: "navigateToPreviousDocument",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Other Misc > Navigate to Previous Document",
                de: "Other Misc > Navigate to Previous Document",
                ru: "Other Misc > Navigate to Previous Document",
                "zh-cn": "Other Misc > Navigate to Previous Document",
                zh_TW: "Other Misc > Navigate to Previous Document",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2062: {
            id: "menu_navigateToNextDocumentGroup",
            action: "navigateToNextDocumentGroup",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Other Misc > Navigate to Next Document Group",
                de: "Other Misc > Navigate to Next Document Group",
                ru: "Other Misc > Navigate to Next Document Group",
                "zh-cn": "Other Misc > Navigate to Next Document Group",
                zh_TW: "Other Misc > Navigate to Next Document Group",
            },
            hidden: false,
            minVersion: "29.4",
        },
        menu_2063: {
            id: "menu_navigateToPreviousDocumentGroup",
            action: "navigateToPreviousDocumentGroup",
            type: "menu",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Other Misc > Navigate to Previous Document Group",
                de: "Other Misc > Navigate to Previous Document Group",
                ru: "Other Misc > Navigate to Previous Document Group",
                "zh-cn": "Other Misc > Navigate to Previous Document Group",
                zh_TW: "Other Misc > Navigate to Previous Document Group",
            },
            hidden: false,
            minVersion: "29.4",
        },
        tool_1000: {
            id: "tool_Adobe_Add_Anchor_Point_Tool",
            action: "Adobe Add Anchor Point Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Add Anchor Point Tool",
                de: "Ankerpunkt-hinzuf\u00fcgen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043e\u043f\u043e\u0440\u043d\u0443\u044e \u0442\u043e\u0447\u043a\u0443",
                zh_TW: "Add Anchor Point Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1001: {
            id: "tool_Adobe_Anchor_Point_Tool",
            action: "Adobe Anchor Point Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Anchor Point Tool",
                de: "Ankerpunkt-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041e\u043f\u043e\u0440\u043d\u0430\u044f \u0442\u043e\u0447\u043a\u0430",
                zh_TW: "Anchor Point Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1002: {
            id: "tool_Adobe_Arc_Tool",
            action: "Adobe Arc Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Arc Tool",
                de: "Bogen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0443\u0433\u0430",
                zh_TW: "Arc Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1003: {
            id: "tool_Adobe_Area_Graph_Tool",
            action: "Adobe Area Graph Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Area Graph Tool",
                de: "Fl\u00e4chendiagramm",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 \u0441 \u043e\u0431\u043b\u0430\u0441\u0442\u044f\u043c\u0438",
                zh_TW: "Area Graph Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1004: {
            id: "tool_Adobe_Area_Type_Tool",
            action: "Adobe Area Type Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Area Type Tool",
                de: "Fl\u00e4chentext-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0422\u0435\u043a\u0441\u0442 \u0432 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
                zh_TW: "Area Type Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1005: {
            id: "tool_Adobe_Constraints_Tool",
            action: "Adobe Constraints Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Objects on Path",
                de: "Objects on Path",
                ru: "Objects on Path",
                zh_TW: "\u6cbf\u8def\u5f91\u6392\u5217\u7269\u4ef6",
            },
            hidden: false,
            minVersion: "29",
        },
        tool_1006: {
            id: "tool_Adobe_Crop_Tool",
            action: "Adobe Crop Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Artboard Tool",
                de: "Zeichenfl\u00e4chen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041c\u043e\u043d\u0442\u0430\u0436\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c",
                zh_TW: "Artboard Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1007: {
            id: "tool_Adobe_Bar_Graph_Tool",
            action: "Adobe Bar Graph Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Bar Graph Tool",
                de: "Horizontales Balkendiagramm",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 \u0433\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u044b\u0435 \u043f\u043e\u043b\u043e\u0441\u044b",
                zh_TW: "Bar Graph Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1008: {
            id: "tool_Adobe_Blend_Tool",
            action: "Adobe Blend Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Blend Tool",
                de: "Angleichen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0435\u0440\u0435\u0445\u043e\u0434",
                zh_TW: "Blend Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1009: {
            id: "tool_Adobe_Bloat_Tool",
            action: "Adobe Bloat Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Bloat Tool",
                de: "Aufblasen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0420\u0430\u0437\u0434\u0443\u0432\u0430\u043d\u0438\u0435",
                zh_TW: "Bloat Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1010: {
            id: "tool_Adobe_Blob_Brush_Tool",
            action: "Adobe Blob Brush Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Blob Brush Tool",
                de: "Tropfenpinsel-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041a\u0438\u0441\u0442\u044c-\u043a\u043b\u044f\u043a\u0441\u0430",
                zh_TW: "Blob Brush Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1011: {
            id: "tool_Adobe_Column_Graph_Tool",
            action: "Adobe Column Graph Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Column Graph Tool",
                de: "Vertikales Balkendiagramm",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 \u0432\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0435 \u043f\u043e\u043b\u043e\u0441\u044b",
                zh_TW: "Column Graph Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1012: {
            id: "tool_Adobe_Cyrstallize_Tool",
            action: "Adobe Cyrstallize Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Crystallize Tool",
                de: "Kristallisieren-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041a\u0440\u0438\u0441\u0442\u0430\u043b\u043b\u0438\u0437\u0430\u0446\u0438\u044f",
                zh_TW: "Crystallize Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1013: {
            id: "tool_Adobe_Curvature_Tool",
            action: "Adobe Curvature Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Curvature Tool",
                de: "Kurvenzeichner",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041a\u0440\u0438\u0432\u0438\u0437\u043d\u0430",
                zh_TW: "Curvature Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1014: {
            id: "tool_Adobe_Delete_Anchor_Point_Tool",
            action: "Adobe Delete Anchor Point Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Delete Anchor Point Tool",
                de: "Ankerpunkt-l\u00f6schen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043e\u043f\u043e\u0440\u043d\u0443\u044e \u0442\u043e\u0447\u043a\u0443",
                zh_TW: "Delete Anchor Point Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1015: {
            id: "tool_Adobe_Dimension_Tool",
            action: "Adobe Dimension Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Dimension Tool",
                de: "Dimension Tool",
                ru: "Dimension Tool",
                zh_TW: "Dimension Tool",
            },
            hidden: false,
            minVersion: "28.1",
        },
        tool_1016: {
            id: "tool_Adobe_Direct_Select_Tool",
            action: "Adobe Direct Select Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Direct Selection Tool",
                de: "Direktauswahl-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0440\u044f\u043c\u043e\u0435 \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
                zh_TW: "Direct Selection Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1017: {
            id: "tool_Adobe_Ellipse_Shape_Tool",
            action: "Adobe Ellipse Shape Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Ellipse Tool",
                de: "Ellipse-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u042d\u043b\u043b\u0438\u043f\u0441",
                zh_TW: "Ellipse Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1018: {
            id: "tool_Adobe_Eraser_Tool",
            action: "Adobe Eraser Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Eraser Tool",
                de: "Radiergummi-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041b\u0430\u0441\u0442\u0438\u043a",
                zh_TW: "Eraser Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1019: {
            id: "tool_Adobe_Eyedropper_Tool",
            action: "Adobe Eyedropper Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Eyedropper Tool",
                de: "Pipette-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0438\u043f\u0435\u0442\u043a\u0430",
                zh_TW: "Eyedropper Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1020: {
            id: "tool_Adobe_Flare_Tool",
            action: "Adobe Flare Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Flare Tool",
                de: "Blendenflecke-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0411\u043b\u0438\u043a",
                zh_TW: "Flare Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1021: {
            id: "tool_Adobe_Free_Transform_Tool",
            action: "Adobe Free Transform Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Free Transform Tool",
                de: "Frei-transformieren-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u0432\u043e\u0431\u043e\u0434\u043d\u043e\u0435 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435",
                zh_TW: "Free Transform Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1022: {
            id: "tool_Adobe_Gradient_Vector_Tool",
            action: "Adobe Gradient Vector Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Gradient Tool",
                de: "Verlauf-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0413\u0440\u0430\u0434\u0438\u0435\u043d\u0442",
                zh_TW: "Gradient Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1023: {
            id: "tool_Adobe_Direct_Object_Select_Tool",
            action: "Adobe Direct Object Select Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Group Selection Tool",
                de: "Gruppenauswahl-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0413\u0440\u0443\u043f\u043f\u043e\u0432\u043e\u0435 \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
                zh_TW: "Group Selection Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1024: {
            id: "tool_Adobe_Scroll_Tool",
            action: "Adobe Scroll Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Hand Tool",
                de: "Hand-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0420\u0443\u043a\u0430",
                zh_TW: "Hand Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1025: {
            id: "tool_Adobe_Intertwine_Zone_Marker_Tool",
            action: "Adobe Intertwine Zone Marker Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Intertwine Tool",
                de: "Intertwine Tool",
                ru: "Intertwine Tool",
                zh_TW: "Intertwine Tool",
            },
            hidden: false,
            minVersion: "27",
        },
        tool_1026: {
            id: "tool_Adobe_Corner_Join_Tool",
            action: "Adobe Corner Join Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Join Tool",
                de: "Zusammenf\u00fcgen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435",
                zh_TW: "Join Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1027: {
            id: "tool_Adobe_Knife_Tool",
            action: "Adobe Knife Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Knife Tool",
                de: "Messer-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041d\u043e\u0436",
                zh_TW: "Knife Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1028: {
            id: "tool_Adobe_Direct_Lasso_Tool",
            action: "Adobe Direct Lasso Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Lasso Tool",
                de: "Lasso-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041b\u0430\u0441\u0441\u043e",
                zh_TW: "Lasso Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1029: {
            id: "tool_Adobe_Line_Graph_Tool",
            action: "Adobe Line Graph Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Line Graph Tool",
                de: "Liniendiagramm",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041b\u0438\u043d\u0435\u0439\u043d\u0430\u044f \u0434\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430",
                zh_TW: "Line Graph Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1030: {
            id: "tool_Adobe_Line_Tool",
            action: "Adobe Line Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Line Segment Tool",
                de: "Liniensegment-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041e\u0442\u0440\u0435\u0437\u043e\u043a \u043b\u0438\u043d\u0438\u0438",
                zh_TW: "Line Segment Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1031: {
            id: "tool_Adobe_Planar_Paintbucket_Tool",
            action: "Adobe Planar Paintbucket Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Live Paint Bucket Tool",
                de: "Interaktiv-malen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0411\u044b\u0441\u0442\u0440\u0430\u044f \u0437\u0430\u043b\u0438\u0432\u043a\u0430",
                zh_TW: "Live Paint Bucket Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1032: {
            id: "tool_Adobe_Planar_Face_Select_Tool",
            action: "Adobe Planar Face Select Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Live Paint Selection Tool",
                de: "Interaktiv-malen-Auswahlwerkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u0431\u044b\u0441\u0442\u0440\u044b\u0445 \u0437\u0430\u043b\u0438\u0432\u043e\u043a",
                zh_TW: "Live Paint Selection Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1033: {
            id: "tool_Adobe_Magic_Wand_Tool",
            action: "Adobe Magic Wand Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Magic Wand Tool",
                de: "Zauberstab-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u043e\u043b\u0448\u0435\u0431\u043d\u0430\u044f \u043f\u0430\u043b\u043e\u0447\u043a\u0430",
                zh_TW: "Magic Wand Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1034: {
            id: "tool_Adobe_Measure_Tool",
            action: "Adobe Measure Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Measure Tool",
                de: "Mess-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041b\u0438\u043d\u0435\u0439\u043a\u0430",
                zh_TW: "Measure Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1035: {
            id: "tool_Adobe_Mesh_Editing_Tool",
            action: "Adobe Mesh Editing Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Mesh Tool",
                de: "Gitter-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u0435\u0442\u043a\u0430",
                zh_TW: "Mesh Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1036: {
            id: "tool_Adobe_Brush_Tool",
            action: "Adobe Brush Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Paintbrush Tool",
                de: "Pinsel-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041a\u0438\u0441\u0442\u044c",
                zh_TW: "Paintbrush Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1037: {
            id: "tool_Adobe_Freehand_Erase_Tool",
            action: "Adobe Freehand Erase Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Path Eraser Tool",
                de: "L\u00f6schen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u0442\u0438\u0440\u0430\u043d\u0438\u0435 \u043a\u043e\u043d\u0442\u0443\u0440\u0430",
                zh_TW: "Path Eraser Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1038: {
            id: "tool_Adobe_Pattern_Tile_Tool",
            action: "Adobe Pattern Tile Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Pattern Tile Tool",
                de: "Musterelement-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u042d\u043b\u0435\u043c\u0435\u043d\u0442 \u0443\u0437\u043e\u0440\u0430",
                zh_TW: "Pattern Tile Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1039: {
            id: "tool_Adobe_Pen_Tool",
            action: "Adobe Pen Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Pen Tool",
                de: "Zeichenstift-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0435\u0440\u043e",
                zh_TW: "Pen Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1040: {
            id: "tool_Adobe_Freehand_Tool",
            action: "Adobe Freehand Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Pencil Tool",
                de: "Buntstift-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041a\u0430\u0440\u0430\u043d\u0434\u0430\u0448",
                zh_TW: "Pencil Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1041: {
            id: "tool_Perspective_Grid_Tool",
            action: "Perspective Grid Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Perspective Grid Tool",
                de: "Perspektivenraster-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b",
                zh_TW: "Perspective Grid Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1042: {
            id: "tool_Perspective_Selection_Tool",
            action: "Perspective Selection Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Perspective Selection Tool",
                de: "Perspektivenauswahl-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u044b\u0431\u043e\u0440 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b",
                zh_TW: "Perspective Selection Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1043: {
            id: "tool_Adobe_Pie_Graph_Tool",
            action: "Adobe Pie Graph Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Pie Graph Tool",
                de: "Kreisdiagramm-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041a\u0440\u0443\u0433\u043e\u0432\u0430\u044f \u0434\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430",
                zh_TW: "Pie Graph Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1045: {
            id: "tool_Adobe_Polar_Grid_Tool",
            action: "Adobe Polar Grid Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Polar Grid Tool",
                de: "Radiales-Raster-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u043e\u043b\u044f\u0440\u043d\u0430\u044f \u0441\u0435\u0442\u043a\u0430",
                zh_TW: "Polar Grid Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1046: {
            id: "tool_Adobe_Shape_Construction_Regular_Polygon_Tool",
            action: "Adobe Shape Construction Regular Polygon Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Polygon Tool",
                de: "Polygon-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041c\u043d\u043e\u0433\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a",
                zh_TW: "Polygon Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1047: {
            id: "tool_Adobe_Page_Tool",
            action: "Adobe Page Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Print Tiling Tool",
                de: "Druckaufteilungs-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0420\u0430\u0437\u0431\u0438\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u043f\u0435\u0447\u0430\u0442\u0438",
                zh_TW: "Print Tiling Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1048: {
            id: "tool_Adobe_Pucker_Tool",
            action: "Adobe Pucker Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Pucker Tool",
                de: "Zusammenziehen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u0442\u044f\u0433\u0438\u0432\u0430\u043d\u0438\u0435",
                zh_TW: "Pucker Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1049: {
            id: "tool_Adobe_Puppet_Warp_Tool",
            action: "Adobe Puppet Warp Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Puppet Warp Tool",
                de: "Formgitter-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041c\u0430\u0440\u0438\u043e\u043d\u0435\u0442\u043e\u0447\u043d\u0430\u044f \u0434\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f",
                zh_TW: "Puppet Warp Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1050: {
            id: "tool_Adobe_Radar_Graph_Tool",
            action: "Adobe Radar Graph Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Radar Graph Tool",
                de: "Netzdiagramm",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 \u0440\u0430\u0434\u0430\u0440",
                zh_TW: "Radar Graph Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1051: {
            id: "tool_Adobe_Rectangle_Shape_Tool",
            action: "Adobe Rectangle Shape Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Rectangle Tool",
                de: "Rechteck-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0440\u044f\u043c\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a",
                zh_TW: "Rectangle Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1052: {
            id: "tool_Adobe_Rectangular_Grid_Tool",
            action: "Adobe Rectangular Grid Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Rectangular Grid Tool",
                de: "Rechteckiges-Raster-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0440\u044f\u043c\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0430\u044f \u0441\u0435\u0442\u043a\u0430",
                zh_TW: "Rectangular Grid Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1053: {
            id: "tool_Adobe_Reflect_Tool",
            action: "Adobe Reflect Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Reflect Tool",
                de: "Spiegeln-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u043e\u0435 \u043e\u0442\u0440\u0430\u0436\u0435\u043d\u0438\u0435",
                zh_TW: "Reflect Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1054: {
            id: "tool_Adobe_Reshape_Tool",
            action: "Adobe Reshape Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Reshape Tool",
                de: "Form-\u00e4ndern-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0435\u0440\u0435\u0440\u0438\u0441\u043e\u0432\u043a\u0430",
                zh_TW: "Reshape Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1055: {
            id: "tool_Adobe_Rotate_Tool",
            action: "Adobe Rotate Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Rotate Tool",
                de: "Drehen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u043e\u0432\u043e\u0440\u043e\u0442",
                zh_TW: "Rotate Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1056: {
            id: "tool_Adobe_Rotate_Canvas_Tool",
            action: "Adobe Rotate Canvas Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Rotate View Tool",
                de: "Ansichtdrehung-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u043e\u0432\u043e\u0440\u043e\u0442 \u0432\u0438\u0434\u0430",
                zh_TW: "Rotate View Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1057: {
            id: "tool_Adobe_Rounded_Rectangle_Tool",
            action: "Adobe Rounded Rectangle Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Rounded Rectangle Tool",
                de: "Abgerundetes-Rechteck-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0440\u044f\u043c\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a \u0441\u043e \u0441\u043a\u0440\u0443\u0433\u043b\u0435\u043d\u043d\u044b\u043c\u0438 \u0443\u0433\u043b\u0430\u043c\u0438",
                zh_TW: "Rounded Rectangle Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1058: {
            id: "tool_Adobe_Scale_Tool",
            action: "Adobe Scale Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Scale Tool",
                de: "Skalieren-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041c\u0430\u0441\u0448\u0442\u0430\u0431",
                zh_TW: "Scale Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1059: {
            id: "tool_Adobe_Scallop_Tool",
            action: "Adobe Scallop Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Scallop Tool",
                de: "Ausbuchten-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0417\u0443\u0431\u0446\u044b",
                zh_TW: "Scallop Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1060: {
            id: "tool_Adobe_Scatter_Graph_Tool",
            action: "Adobe Scatter Graph Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Scatter Graph Tool",
                de: "Streudiagramm",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0422\u043e\u0447\u0435\u0447\u043d\u0430\u044f \u0434\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430",
                zh_TW: "Scatter Graph Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1061: {
            id: "tool_Adobe_Scissors_Tool",
            action: "Adobe Scissors Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Scissors Tool",
                de: "Schere-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041d\u043e\u0436\u043d\u0438\u0446\u044b",
                zh_TW: "Scissors Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1062: {
            id: "tool_Adobe_Select_Tool",
            action: "Adobe Select Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Selection Tool",
                de: "Auswahl-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
                zh_TW: "Selection Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1063: {
            id: "tool_Adobe_Shape_Builder_Tool",
            action: "Adobe Shape Builder Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Shape Builder Tool",
                de: "Formerstellungs-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u043e\u0437\u0434\u0430\u043d\u0438\u0435 \u0444\u0438\u0433\u0443\u0440",
                zh_TW: "Shape Builder Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1064: {
            id: "tool_Adobe_Shaper_Tool",
            action: "Adobe Shaper Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Shaper Tool",
                de: "Shaper-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0440\u043e\u0438\u0437\u0432\u043e\u043b\u044c\u043d\u0430\u044f \u043a\u0440\u0438\u0432\u0430\u044f",
                zh_TW: "Shaper Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1065: {
            id: "tool_Adobe_Shear_Tool",
            action: "Adobe Shear Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Shear Tool",
                de: "Verbiegen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041d\u0430\u043a\u043b\u043e\u043d",
                zh_TW: "Shear Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1066: {
            id: "tool_Adobe_Slice_Tool",
            action: "Adobe Slice Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Slice Tool",
                de: "Slice-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b",
                zh_TW: "Slice Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1067: {
            id: "tool_Adobe_Slice_Select_Tool",
            action: "Adobe Slice Select Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Slice Selection Tool",
                de: "Slice-Auswahl-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u0430",
                zh_TW: "Slice Selection Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1068: {
            id: "tool_Adobe_Freehand_Smooth_Tool",
            action: "Adobe Freehand Smooth Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Smooth Tool",
                de: "Gl\u00e4tten-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u0433\u043b\u0430\u0436\u0438\u0432\u0430\u043d\u0438\u0435",
                zh_TW: "Smooth Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1069: {
            id: "tool_Adobe_Shape_Construction_Spiral_Tool",
            action: "Adobe Shape Construction Spiral Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Spiral Tool",
                de: "Spirale-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u043f\u0438\u0440\u0430\u043b\u044c",
                zh_TW: "Spiral Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1070: {
            id: "tool_Adobe_Stacked_Bar_Graph_Tool",
            action: "Adobe Stacked Bar Graph Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Stacked Bar Graph Tool",
                de: "Gestapeltes horizontales Balkendiagramm",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 \u0433\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u044b\u0439 \u0441\u0442\u0435\u043a",
                zh_TW: "Stacked Bar Graph Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1071: {
            id: "tool_Adobe_Stacked_Column_Graph_Tool",
            action: "Adobe Stacked Column Graph Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Stacked Column Graph Tool",
                de: "Gestapeltes vertikales Balkendiagramm",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 \u0432\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0441\u0442\u0435\u043a",
                zh_TW: "Stacked Column Graph Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1072: {
            id: "tool_Adobe_Shape_Construction_Star_Tool",
            action: "Adobe Shape Construction Star Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Star Tool",
                de: "Stern-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0417\u0432\u0435\u0437\u0434\u0430",
                zh_TW: "Star Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1074: {
            id: "tool_Adobe_Symbol_Screener_Tool",
            action: "Adobe Symbol Screener Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Symbol Screener Tool",
                de: "Symbol-transparent-gestalten-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
                zh_TW: "Symbol Screener Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1075: {
            id: "tool_Adobe_Symbol_Scruncher_Tool",
            action: "Adobe Symbol Scruncher Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Symbol Scruncher Tool",
                de: "Symbol-stauchen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0423\u043f\u043b\u043e\u0442\u043d\u0435\u043d\u0438\u0435 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
                zh_TW: "Symbol Scruncher Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1076: {
            id: "tool_Adobe_Symbol_Shifter_Tool",
            action: "Adobe Symbol Shifter Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Symbol Shifter Tool",
                de: "Symbol-verschieben-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u043c\u0435\u0449\u0435\u043d\u0438\u0435 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
                zh_TW: "Symbol Shifter Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1077: {
            id: "tool_Adobe_Symbol_Sizer_Tool",
            action: "Adobe Symbol Sizer Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Symbol Sizer Tool",
                de: "Symbol-skalieren-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0420\u0430\u0437\u043c\u0435\u0440 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
                zh_TW: "Symbol Sizer Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1078: {
            id: "tool_Adobe_Symbol_Spinner_Tool",
            action: "Adobe Symbol Spinner Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Symbol Spinner Tool",
                de: "Symbol-drehen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u0440\u0430\u0449\u0435\u043d\u0438\u0435 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
                zh_TW: "Symbol Spinner Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1079: {
            id: "tool_Adobe_Symbol_Sprayer_Tool",
            action: "Adobe Symbol Sprayer Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Symbol Sprayer Tool",
                de: "Symbol-aufspr\u00fchen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0420\u0430\u0441\u043f\u044b\u043b\u0435\u043d\u0438\u0435 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
                zh_TW: "Symbol Sprayer Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1080: {
            id: "tool_Adobe_Symbol_Stainer_Tool",
            action: "Adobe Symbol Stainer Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Symbol Stainer Tool",
                de: "Symbol-f\u00e4rben-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041e\u0431\u0435\u0441\u0446\u0432\u0435\u0447\u0438\u0432\u0430\u043d\u0438\u0435 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
                zh_TW: "Symbol Stainer Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1081: {
            id: "tool_Adobe_Symbol_Styler_Tool",
            action: "Adobe Symbol Styler Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Symbol Styler Tool",
                de: "Symbol-gestalten-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u0442\u0438\u043b\u0438 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
                zh_TW: "Symbol Styler Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1082: {
            id: "tool_Adobe_Touch_Type_Tool",
            action: "Adobe Touch Type Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Touch Type Tool",
                de: "Touch-Type-Textwerkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u0442\u0435\u043a\u0441\u0442\u0430",
                zh_TW: "Touch Type Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1083: {
            id: "tool_Adobe_New_Twirl_Tool",
            action: "Adobe New Twirl Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Twirl Tool",
                de: "Strudel-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u043e\u0440\u043e\u043d\u043a\u0430",
                zh_TW: "Twirl Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1084: {
            id: "tool_Adobe_Type_Tool",
            action: "Adobe Type Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Type Tool",
                de: "Text-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0422\u0435\u043a\u0441\u0442",
                zh_TW: "Type Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1085: {
            id: "tool_Adobe_Path_Type_Tool",
            action: "Adobe Path Type Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Type on a Path Tool",
                de: "Pfadtext-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443",
                zh_TW: "Type on a Path Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1086: {
            id: "tool_Adobe_Vertical_Area_Type_Tool",
            action: "Adobe Vertical Area Type Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Vertical Area Type Tool",
                de: "Vertikaler-Fl\u00e4chentext-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0442\u0435\u043a\u0441\u0442 \u0432 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
                zh_TW: "Vertical Area Type Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1087: {
            id: "tool_Adobe_Vertical_Type_Tool",
            action: "Adobe Vertical Type Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Vertical Type Tool",
                de: "Vertikaler-Text-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0442\u0435\u043a\u0441\u0442",
                zh_TW: "Vertical Type Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1088: {
            id: "tool_Adobe_Vertical_Path_Type_Tool",
            action: "Adobe Vertical Path Type Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Vertical Type on a Path Tool",
                de: "Vertikaler-Pfadtext-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0442\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443",
                zh_TW: "Vertical Type on a Path Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1089: {
            id: "tool_Adobe_Warp_Tool",
            action: "Adobe Warp Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Warp Tool",
                de: "Verkr\u00fcmmen-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f",
                zh_TW: "Warp Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1090: {
            id: "tool_Adobe_Width_Tool",
            action: "Adobe Width Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Width Tool",
                de: "Breiten-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0428\u0438\u0440\u0438\u043d\u0430",
                zh_TW: "Width Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1091: {
            id: "tool_Adobe_Wrinkle_Tool",
            action: "Adobe Wrinkle Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Wrinkle Tool",
                de: "Zerknittern-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041c\u043e\u0440\u0449\u0438\u043d\u044b",
                zh_TW: "Wrinkle Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        tool_1092: {
            id: "tool_Adobe_Zoom_Tool",
            action: "Adobe Zoom Tool",
            type: "tool",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Zoom Tool",
                de: "Zoom-Werkzeug",
                ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041c\u0430\u0441\u0448\u0442\u0430\u0431",
                zh_TW: "Zoom Tool",
            },
            hidden: false,
            minVersion: "24",
        },
        builtin_documentReport: {
            id: "builtin_documentReport",
            action: "documentReport",
            type: "builtin",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Active Document Report",
                de: "Active Document Report",
                ru: "Active Document Report",
                zh_TW: "Active Document Report",
            },
            hidden: false,
        },
        builtin_addCustomCommands: {
            id: "builtin_addCustomCommands",
            action: "addCustomCommands",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Add Custom Commands...",
                de: "Add Custom Commands...",
                ru: "Add Custom Commands...",
                zh_TW: "Add Custom Commands...",
            },
            hidden: false,
        },
        builtin_allActions: {
            id: "builtin_allActions",
            action: "allActions",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "All Actions...",
                de: "Alle Aktionen \u2026",
                ru: "All Actions...",
                zh_TW: "All Actions...",
            },
            hidden: false,
        },
        builtin_allBookmarks: {
            id: "builtin_allBookmarks",
            action: "allBookmarks",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "All Bookmarks...",
                de: "Alle Lesezeichen \u2026",
                ru: "All Bookmarks...",
                zh_TW: "All Bookmarks...",
            },
            hidden: false,
        },
        builtin_allCustomCommands: {
            id: "builtin_allCustomCommands",
            action: "allCustomCommands",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "All Custom Commands...",
                de: "All Custom Commands...",
                ru: "All Custom Commands...",
                zh_TW: "All Custom Commands...",
            },
            hidden: false,
        },
        builtin_allMenus: {
            id: "builtin_allMenus",
            action: "allMenus",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "All Menu Commands...",
                de: "All Menu Commands...",
                ru: "All Menu Commands...",
                zh_TW: "All Menu Commands...",
            },
            hidden: false,
        },
        builtin_allPickers: {
            id: "builtin_allPickers",
            action: "allPickers",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "All Pickers...",
                de: "All Pickers...",
                ru: "All Pickers...",
                zh_TW: "All Pickers...",
            },
            hidden: false,
        },
        builtin_allScripts: {
            id: "builtin_allScripts",
            action: "allScripts",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "All Scripts...",
                de: "Alle Skripte \u2026",
                ru: "All Scripts...",
                zh_TW: "All Scripts...",
            },
            hidden: false,
        },
        builtin_allTools: {
            id: "builtin_allTools",
            action: "allTools",
            type: "builtin",
            docRequired: true,
            selRequired: false,
            name: {
                en: "All Tools...",
                de: "All Tools...",
                ru: "All Tools...",
                zh_TW: "All Tools...",
            },
            hidden: false,
        },
        builtin_allWorkflows: {
            id: "builtin_allWorkflows",
            action: "allWorkflows",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "All Workflows...",
                de: "Alle Arbeitsabl\u00e4ufe \u2026",
                ru: "All Workflows...",
                zh_TW: "All Workflows...",
            },
            hidden: false,
        },
        builtin_buildWorkflow: {
            id: "builtin_buildWorkflow",
            action: "buildWorkflow",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Build Workflow...",
                de: "Arbeitsablauf erstellen \u2026",
                ru: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043d\u0430\u0431\u043e\u0440 \u043a\u043e\u043c\u0430\u043d\u0434",
                zh_TW: "Build Workflow...",
            },
            hidden: false,
        },
        builtin_editWorkflow: {
            id: "builtin_editWorkflow",
            action: "editWorkflow",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Edit Workflow...",
                de: "Arbeitsablauf bearbeiten \u2026",
                ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043d\u0430\u0431\u043e\u0440 \u043a\u043e\u043c\u0430\u043d\u0434",
                zh_TW: "Edit Workflow...",
            },
            hidden: false,
        },
        builtin_buildPicker: {
            id: "builtin_buildPicker",
            action: "buildPicker",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Build Picker...",
                de: "Build Picker...",
                ru: "Build Picker...",
                zh_TW: "Build Picker...",
            },
            hidden: false,
        },
        builtin_editPicker: {
            id: "builtin_editPicker",
            action: "editPicker",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Edit Picker...",
                de: "Edit Picker...",
                ru: "Edit Picker...",
                zh_TW: "Edit Picker...",
            },
            hidden: false,
        },
        builtin_imageCapture: {
            id: "builtin_imageCapture",
            action: "imageCapture",
            type: "builtin",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Export Active Artboard As PNG",
                de: "Ausgew\u00e4hlte Zeichenfl\u00e4che als PNG exportieren",
                ru: "Export Active Artboard As PNG",
                zh_TW: "Export Active Artboard As PNG",
            },
            hidden: false,
        },
        builtin_exportVariables: {
            id: "builtin_exportVariables",
            action: "exportVariables",
            type: "builtin",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Export Document Variables As XML",
                de: "Variablen als XML exportieren",
                ru: "Export Document Variables As XML",
                zh_TW: "Export Document Variables As XML",
            },
            hidden: false,
        },
        builtin_goToArtboard: {
            id: "builtin_goToArtboard",
            action: "goToArtboard",
            type: "builtin",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Go To Artboard...",
                de: "Zeichenfl\u00e4chen ausw\u00e4hlen \u2026",
                ru: "Gehen Sie zur Zeichenfl\u00e4che...",
                zh_TW: "Go To Artboard...",
            },
            hidden: false,
        },
        builtin_goToNamedObject: {
            id: "builtin_goToNamedObject",
            action: "goToNamedObject",
            type: "builtin",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Go To Named Object...",
                de: "Benannte Objekte ausw\u00e4hlen \u2026",
                ru: "\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u043a \u0438\u043c\u0435\u043d\u043e\u0432\u0430\u043d\u043d\u043e\u043c\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u0443...",
                zh_TW: "Go To Named Object...",
            },
            hidden: false,
        },
        builtin_goToDocument: {
            id: "builtin_goToDocument",
            action: "goToDocument",
            type: "builtin",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Go To Open Document",
                de: "Ge\u00f6ffnete Dokumente ausw\u00e4hlen \u2026",
                ru: "Go To Open Document",
                zh_TW: "Go To Open Document",
            },
            hidden: false,
        },
        builtin_loadFileBookmark: {
            id: "builtin_loadFileBookmark",
            action: "loadFileBookmark",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Load File Bookmark(s)...",
                de: "Lesezeichen erstellen \u2026",
                ru: "Load File Bookmark(s)...",
                zh_TW: "Load File Bookmark(s)...",
            },
            hidden: false,
        },
        builtin_loadFolderBookmark: {
            id: "builtin_loadFolderBookmark",
            action: "loadFolderBookmark",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Load Folder Bookmark...",
                de: "Lesezeichen-Ordner erstellen \u2026",
                ru: "Load Folder Bookmark...",
                zh_TW: "Load Folder Bookmark...",
            },
            hidden: false,
        },
        builtin_loadScript: {
            id: "builtin_loadScript",
            action: "loadScript",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Load Script(s)...",
                de: "Skripte laden \u2026",
                ru: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0441\u043a\u0440\u0438\u043f\u0442\u044b",
                zh_TW: "Load Script(s)...",
            },
            hidden: false,
        },
        builtin_recentFiles: {
            id: "builtin_recentFiles",
            action: "recentFiles",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Open Recent File...",
                de: "Letzte Datei \u00f6ffnen \u2026",
                ru: "Open Recent File...",
                zh_TW: "Open Recent File...",
            },
            hidden: false,
        },
        builtin_recentCommands: {
            id: "builtin_recentCommands",
            action: "recentCommands",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Recent Commands (History)...",
                de: "Letzte Befehle \u2026",
                ru: "Recent Commands (History)...",
                zh_TW: "Recent Commands (History)...",
            },
            hidden: false,
        },
        builtin_redrawWindows: {
            id: "builtin_redrawWindows",
            action: "redrawWindows",
            type: "builtin",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Redraw Windows",
                de: "Fenster aktualisieren",
                ru: "Redraw Windows",
                zh_TW: "Redraw Windows",
            },
            hidden: false,
        },
        builtin_revealActiveDocument: {
            id: "builtin_revealActiveDocument",
            action: "revealActiveDocument",
            type: "builtin",
            docRequired: true,
            selRequired: false,
            name: {
                en: "Reveal Active Document On System",
                de: "Aktuelles Dokument im Dateimanager anzeigen",
                ru: "Reveal Active Document On System",
                zh_TW: "Reveal Active Document On System",
            },
            hidden: false,
        },
        builtin_watchScriptFolder: {
            id: "builtin_watchScriptFolder",
            action: "watchScriptFolder",
            type: "builtin",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Watch Script Folder...",
                de: "Watch Script Folder...",
                ru: "Watch Script Folder...",
                zh_TW: "Watch Script Folder...",
            },
            hidden: false,
        },
        config_about: {
            id: "config_about",
            action: "about",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "About Ai Command Palette...",
                de: "\u00dcber Kurzbefehle \u2026",
                ru: "\u041e\u0431 Ai Command Palette",
                zh_TW: "About Ai Command Palette...",
            },
            hidden: false,
        },
        config_builtinCommands: {
            id: "config_builtinCommands",
            action: "builtinCommands",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Built-in Commands...",
                de: "Built-in Commands...",
                ru: "Built-in Commands...",
                zh_TW: "Built-in Commands...",
            },
            hidden: false,
        },
        config_clearHistory: {
            id: "config_clearHistory",
            action: "clearHistory",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Clear History",
                de: "Die letzten Befehle l\u00f6schen",
                ru: "Clear History",
                zh_TW: "Clear History",
            },
            hidden: false,
        },
        config_customizeStartup: {
            id: "config_customizeStartup",
            action: "customizeStartup",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Customize Startup Commands...",
                de: "Customize Startup Commands...",
                ru: "Customize Startup Commands...",
                zh_TW: "Customize Startup Commands...",
            },
            hidden: false,
        },
        config_deleteCommand: {
            id: "config_deleteCommand",
            action: "deleteCommand",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Delete Commands...",
                de: "Befehle l\u00f6schen \u2026",
                ru: "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043a\u043e\u043c\u0430\u043d\u0434\u044b",
                zh_TW: "Delete Commands...",
            },
            hidden: false,
        },
        config_enableFuzzyMatching: {
            id: "config_enableFuzzyMatching",
            action: "enableFuzzyMatching",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Enable Fuzzy Matching",
                de: "Enable Fuzzy Matching",
                ru: "Enable Fuzzy Matching",
                zh_TW: "Enable Fuzzy Matching",
            },
            hidden: false,
        },
        config_disableFuzzyMatching: {
            id: "config_disableFuzzyMatching",
            action: "disableFuzzyMatching",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Disable Fuzzy Matching",
                de: "Disable Fuzzy Matching",
                ru: "Disable Fuzzy Matching",
                zh_TW: "Disable Fuzzy Matching",
            },
            hidden: false,
        },
        config_enableDebugLogging: {
            id: "config_enableDebugLogging",
            action: "enableDebugLogging",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Enable Debug Logging",
                de: "Enable Debug Logging",
                ru: "Enable Debug Logging",
                zh_TW: "Enable Debug Logging",
            },
            hidden: false,
        },
        config_disableDebugLogging: {
            id: "config_disableDebugLogging",
            action: "disableDebugLogging",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Disable Debug Logging",
                de: "Disable Debug Logging",
                ru: "Disable Debug Logging",
                zh_TW: "Disable Debug Logging",
            },
            hidden: false,
        },
        config_hideCommand: {
            id: "config_hideCommand",
            action: "hideCommand",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Hide Commands...",
                de: "Befehle ausblenden \u2026",
                ru: "\u0421\u043a\u0440\u044b\u0442\u044c \u043a\u043e\u043c\u0430\u043d\u0434\u044b",
                zh_TW: "Hide Commands...",
            },
            hidden: false,
        },
        config_revealLog: {
            id: "config_revealLog",
            action: "revealLog",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Reveal Log",
                de: "Reveal Log",
                ru: "Reveal Log",
                zh_TW: "Reveal Log",
            },
            hidden: false,
        },
        config_revealPrefFile: {
            id: "config_revealPrefFile",
            action: "revealPrefFile",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Reveal Preferences File",
                de: "Einstellungen-Datei anzeigen",
                ru: "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0444\u0430\u0439\u043b \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043a",
                zh_TW: "Reveal Preferences File",
            },
            hidden: false,
        },
        config_removeWatchedFolders: {
            id: "config_removeWatchedFolders",
            action: "removeWatchedFolders",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Remove Watched Folder(s)...",
                de: "Remove Watched Folder(s)...",
                ru: "Remove Watched Folder(s)...",
                zh_TW: "Remove Watched Folder(s)...",
            },
            hidden: false,
        },
        config_settings: {
            id: "config_settings",
            action: "settings",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Ai Command Palette Settings...",
                de: "Kurzbefehle \u2013 Einstellungen \u2026",
                ru: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438",
                zh_TW: "Ai Command Palette Settings...",
            },
            hidden: false,
        },
        config_unhideCommand: {
            id: "config_unhideCommand",
            action: "unhideCommand",
            type: "config",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Unhide Commands...",
                de: "Befehle einblenden \u2026",
                ru: "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043a\u043e\u043c\u0430\u043d\u0434\u044b",
                zh_TW: "Unhide Commands...",
            },
            hidden: false,
        },
        custom_astute_0001: {
            id: "custom_astute_0001",
            action: "_GenericPluginMenuItem 14",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Edit > Rasterino > Edit Image",
                zh_TW: "Rasterino\uff5c\u7de8\u8f2f\u5f71\u50cf",
            },
            hidden: false,
        },
        custom_astute_0002: {
            id: "custom_astute_0002",
            action: "_GenericPluginMenuItem 15",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Edit > Rasterino > Update Image",
                zh_TW: "Rasterino\uff5c\u66f4\u65b0\u5f71\u50cf",
            },
            hidden: false,
        },
        custom_astute_0003: {
            id: "custom_astute_0003",
            action: "_GenericPluginMenuItem 16",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Edit > Rasterino > Link Images",
                zh_TW: "Rasterino\uff5c\u5c07\u5d4c\u5165\u5f71\u50cf\u8f49\u70ba\u9023\u7d50",
            },
            hidden: false,
        },
        custom_astute_0004: {
            id: "custom_astute_0004",
            action: "Phantasm CS Brightness Contrast Filter",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Object > Filters > Phantasm > Brightness/Contrast...",
                zh_TW: "Phantasm\uff5c\u4eae\u5ea6\uff0f\u5c0d\u6bd4\uff08\u6ffe\u93e1\uff09",
            },
            hidden: false,
        },
        custom_astute_0005: {
            id: "custom_astute_0005",
            action: "Phantasm CS Curves Filter",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Object > Filters > Phantasm > Curves...",
                zh_TW: "Phantasm\uff5c\u66f2\u7dda\uff08\u6ffe\u93e1\uff09",
            },
            hidden: false,
        },
        custom_astute_0006: {
            id: "custom_astute_0006",
            action: "Phantasm CS Desaturate Filter",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Object > Filters > Phantasm > Desaturate...",
                zh_TW: "Phantasm\uff5c\u53bb\u98fd\u548c\uff08\u6ffe\u93e1\uff09",
            },
            hidden: false,
        },
        custom_astute_0007: {
            id: "custom_astute_0007",
            action: "Phantasm CS Duotone Filter",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Object > Filters > Phantasm > Duotone...",
                zh_TW: "Phantasm\uff5c\u96d9\u8272\u8abf\uff08\u6ffe\u93e1\uff09",
            },
            hidden: false,
        },
        custom_astute_0008: {
            id: "custom_astute_0008",
            action: "Phantasm CS Exposure Filter",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Object > Filters > Phantasm > Exposure...",
                zh_TW: "Phantasm\uff5c\u66dd\u5149\uff08\u6ffe\u93e1\uff09",
            },
            hidden: false,
        },
        custom_astute_0009: {
            id: "custom_astute_0009",
            action: "Phantasm CS Halftone Filter",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Object > Filters > Phantasm > Halftone...",
                zh_TW: "Phantasm\uff5c\u7db2\u9ede\uff08\u6ffe\u93e1\uff09",
            },
            hidden: false,
        },
        custom_astute_0010: {
            id: "custom_astute_0010",
            action: "Phantasm CS Hue Saturation Filter",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Object > Filters > Phantasm > Hue/Saturation...",
                zh_TW: "Phantasm\uff5c\u8272\u76f8\uff0f\u98fd\u548c\u5ea6\uff08\u6ffe\u93e1\uff09",
            },
            hidden: false,
        },
        custom_astute_0011: {
            id: "custom_astute_0011",
            action: "Phantasm CS Invert Filter",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Object > Filters > Phantasm > Invert...",
                zh_TW: "Phantasm\uff5c\u53cd\u76f8\uff08\u6ffe\u93e1\uff09",
            },
            hidden: false,
        },
        custom_astute_0012: {
            id: "custom_astute_0012",
            action: "Phantasm CS Levels Filter",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Object > Filters > Phantasm > Levels...",
                zh_TW: "Phantasm\uff5c\u8272\u968e\uff08\u6ffe\u93e1\uff09",
            },
            hidden: false,
        },
        custom_astute_0013: {
            id: "custom_astute_0013",
            action: "Phantasm CS Prepress Correct Filter",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Object > Filters > Phantasm > Prepress Correct...",
                zh_TW: "Phantasm\uff5c\u5370\u524d\u6821\u6b63\uff08\u6ffe\u93e1\uff09",
            },
            hidden: false,
        },
        custom_astute_0014: {
            id: "custom_astute_0014",
            action: "Phantasm CS Color Shift Filter",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Object > Filters > Phantasm > Shift to Color...",
                zh_TW: "Phantasm\uff5c\u5411\u6307\u5b9a\u984f\u8272\u504f\u79fb\uff08\u6ffe\u93e1\uff09",
            },
            hidden: false,
        },
        custom_astute_0015: {
            id: "custom_astute_0015",
            action: "Phantasm CS Temperature Tint Filter",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Object > Filters > Phantasm > Temperature/Tint...",
                zh_TW: "Phantasm\uff5c\u8272\u6eab\uff0f\u8272\u8abf\uff08\u6ffe\u93e1\uff09",
            },
            hidden: false,
        },
        custom_astute_0016: {
            id: "custom_astute_0016",
            action: "AGPixelsToVector",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Object > Pixels to Vector",
                zh_TW: "SubScribe\uff5c\u50cf\u7d20\u8f49\u5411\u91cf Pixels to Vector",
            },
            hidden: false,
        },
        custom_astute_0017: {
            id: "custom_astute_0017",
            action: "Phantasm Select Effects",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Phantasm Effects",
                zh_TW: "Phantasm\uff5c\u9078\u53d6 Phantasm \u6548\u679c",
            },
            hidden: false,
        },
        custom_astute_0018: {
            id: "custom_astute_0018",
            action: "Stipplism SelectLE",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Stipplism Effects",
                zh_TW: "Stipplism\uff5c\u9078\u53d6\u9ede\u63cf\u6548\u679c",
            },
            hidden: false,
        },
        custom_astute_0019: {
            id: "custom_astute_0019",
            action: "Stylism Select Architect",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > AG Architect Effects",
                zh_TW: "Stylism\uff5c\u9078\u53d6 AG Architect \u6548\u679c",
            },
            hidden: false,
        },
        custom_astute_0020: {
            id: "custom_astute_0020",
            action: "AGBSAll Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > AG Block Shadow Effects > All",
                zh_TW: "Stylism\uff5c\u9078\u53d6\u9577\u9670\u5f71\u6548\u679c\uff1a\u5168\u90e8",
            },
            hidden: false,
        },
        custom_astute_0021: {
            id: "custom_astute_0021",
            action: "AGBSStandard Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > AG Block Shadow Effects > Standard",
                zh_TW: "Stylism\uff5c\u9078\u53d6\u9577\u9670\u5f71\u6548\u679c\uff1a\u6a19\u6e96",
            },
            hidden: false,
        },
        custom_astute_0022: {
            id: "custom_astute_0022",
            action: "AGBSVP Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > AG Block Shadow Effects > Vanishing Point",
                zh_TW: "Stylism\uff5c\u9078\u53d6\u9577\u9670\u5f71\u6548\u679c\uff1a\u6d88\u5931\u9ede",
            },
            hidden: false,
        },
        custom_astute_0023: {
            id: "custom_astute_0023",
            action: "Stylism Select Offset",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > AG Offset Effects",
                zh_TW: "Stylism\uff5c\u9078\u53d6\u504f\u79fb\u6548\u679c",
            },
            hidden: false,
        },
        custom_astute_0024: {
            id: "custom_astute_0024",
            action: "Stylism Select Splatter",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > AG Splatter Effects",
                zh_TW: "Stylism\uff5c\u9078\u53d6\u98db\u6ffa\u6548\u679c",
            },
            hidden: false,
        },
        custom_astute_0025: {
            id: "custom_astute_0025",
            action: "Randomino Select Perturb",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Perturb Effects",
                zh_TW: "Randomino\uff5c\u9078\u53d6 Perturb \u6548\u679c",
            },
            hidden: false,
        },
        custom_astute_0026: {
            id: "custom_astute_0026",
            action: "DSAll Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > All",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u5168\u90e8",
            },
            hidden: false,
        },
        custom_astute_0027: {
            id: "custom_astute_0027",
            action: "DSSquRec Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Squares & Rectangles",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u6b63\u65b9\u5f62\u8207\u77e9\u5f62",
            },
            hidden: false,
        },
        custom_astute_0028: {
            id: "custom_astute_0028",
            action: "DSCirEll Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Circles & Ellipses",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u5713\u5f62\u8207\u6a62\u5713\u5f62",
            },
            hidden: false,
        },
        custom_astute_0029: {
            id: "custom_astute_0029",
            action: "DSSquares Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Squares",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u6b63\u65b9\u5f62",
            },
            hidden: false,
        },
        custom_astute_0030: {
            id: "custom_astute_0030",
            action: "DSCircles Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Circles",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u5713\u5f62",
            },
            hidden: false,
        },
        custom_astute_0031: {
            id: "custom_astute_0031",
            action: "DSRectangles Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Rectangles",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u77e9\u5f62",
            },
            hidden: false,
        },
        custom_astute_0032: {
            id: "custom_astute_0032",
            action: "DSEllipses Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Ellipses",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u6a62\u5713\u5f62",
            },
            hidden: false,
        },
        custom_astute_0033: {
            id: "custom_astute_0033",
            action: "DSPolygons Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Polygons",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u591a\u908a\u5f62",
            },
            hidden: false,
        },
        custom_astute_0034: {
            id: "custom_astute_0034",
            action: "DSStars Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Stars",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u661f\u5f62",
            },
            hidden: false,
        },
        custom_astute_0035: {
            id: "custom_astute_0035",
            action: "DSDonuts Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Donuts",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u5713\u74b0",
            },
            hidden: false,
        },
        custom_astute_0036: {
            id: "custom_astute_0036",
            action: "DSArrows Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Arrows",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u7bad\u982d",
            },
            hidden: false,
        },
        custom_astute_0037: {
            id: "custom_astute_0037",
            action: "DSClouds Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Clouds",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u96f2\u5f62",
            },
            hidden: false,
        },
        custom_astute_0038: {
            id: "custom_astute_0038",
            action: "DSCrescents Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Crescents",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u65b0\u6708\u5f62",
            },
            hidden: false,
        },
        custom_astute_0039: {
            id: "custom_astute_0039",
            action: "DSCrosses Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Crosses",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u5341\u5b57\u5f62",
            },
            hidden: false,
        },
        custom_astute_0040: {
            id: "custom_astute_0040",
            action: "DSGears Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Gears",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u9f52\u8f2a",
            },
            hidden: false,
        },
        custom_astute_0041: {
            id: "custom_astute_0041",
            action: "DSHearts Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Hearts",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u5fc3\u5f62",
            },
            hidden: false,
        },
        custom_astute_0042: {
            id: "custom_astute_0042",
            action: "DSSpeech Bubbles Menu Item",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Select > Dynamic Shapes > Speech Bubbles",
                zh_TW: "VectorScribe\uff5c\u9078\u53d6\u52d5\u614b\u5f62\u72c0\uff1a\u5c0d\u8a71\u6ce1\u6ce1",
            },
            hidden: false,
        },
        custom_astute_0043: {
            id: "custom_astute_0043",
            action: "Live ASTGVSLEAddPoints",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Add Points...",
                zh_TW: "VectorScribe\uff5c\u589e\u52a0\u9328\u9ede\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0044: {
            id: "custom_astute_0044",
            action: "Live ASTGVSLEAGArray",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > AG Array...",
                zh_TW: "VectorScribe\uff5c\u9663\u5217\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0045: {
            id: "custom_astute_0045",
            action: "Live ASTGVSLEAGShear",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > AG Shear...",
                zh_TW: "VectorScribe\uff5c\u50be\u659c\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0046: {
            id: "custom_astute_0046",
            action: "Live ASTGVSLEAGTransform",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > AG Transform...",
                zh_TW: "VectorScribe\uff5c\u8b8a\u5f62\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0047: {
            id: "custom_astute_0047",
            action: "Live ASTGVSLEAngleCap",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Angle Cap...",
                zh_TW: "VectorScribe\uff5c\u50be\u659c\u7aef\u9ede Angle Cap\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0048: {
            id: "custom_astute_0048",
            action: "Live ASTGVSLEClosePath",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Close Path...",
                zh_TW: "VectorScribe\uff5c\u5c01\u9589\u8def\u5f91\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0049: {
            id: "custom_astute_0049",
            action: "Live ASTGVSLEConvertToSmooth",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Convert to Smooth...",
                zh_TW: "VectorScribe\uff5c\u8f49\u70ba\u5e73\u6ed1\u9ede\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0050: {
            id: "custom_astute_0050",
            action: "Live ASTGVSLEDashify",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Dashify...",
                zh_TW: "VectorScribe\uff5c\u865b\u7dda\u5316\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0051: {
            id: "custom_astute_0051",
            action: "Live ASTGVSLEExtendPath",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Extend Path...",
                zh_TW: "VectorScribe\uff5c\u5ef6\u4f38\u8def\u5f91\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0052: {
            id: "custom_astute_0052",
            action: "Live ASTGVSLEMakeCompoundPath",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Make Compound Path",
                zh_TW: "VectorScribe\uff5c\u5efa\u7acb\u8907\u5408\u8def\u5f91\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0053: {
            id: "custom_astute_0053",
            action: "Live ASTGVSLEMakeShape",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Make Shape...",
                zh_TW: "VectorScribe\uff5c\u5efa\u7acb\u5f62\u72c0\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0054: {
            id: "custom_astute_0054",
            action: "Live ASTGVSLEPathRemoval",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Path Removal...",
                zh_TW: "VectorScribe\uff5c\u79fb\u9664\u8def\u5f91\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0055: {
            id: "custom_astute_0055",
            action: "Live ASTGVSLEPathVisualizer",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Path Visualizer...",
                zh_TW: "VectorScribe\uff5c\u8def\u5f91\u8996\u89ba\u5316\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0056: {
            id: "custom_astute_0056",
            action: "Live ASTGVSLEPointRemoval",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Point Removal...",
                zh_TW: "VectorScribe\uff5c\u79fb\u9664\u9328\u9ede\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0057: {
            id: "custom_astute_0057",
            action: "Live ASTGVSLEReleaseCompoundPath",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Release Compound Path",
                zh_TW: "VectorScribe\uff5c\u91cb\u653e\u8907\u5408\u8def\u5f91\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0058: {
            id: "custom_astute_0058",
            action: "Live ASTGVSLERetractHandles",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Retract Handles...",
                zh_TW: "VectorScribe\uff5c\u6536\u56de\u65b9\u5411\u63a7\u5236\u628a\u624b\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0059: {
            id: "custom_astute_0059",
            action: "Live ASTGVSLEReversePathDirection",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Reverse Path Direction",
                zh_TW: "VectorScribe\uff5c\u53cd\u8f49\u8def\u5f91\u65b9\u5411\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0060: {
            id: "custom_astute_0060",
            action: "Live ASTGVSLESegmentRemoval",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Segment Removal...",
                zh_TW: "VectorScribe\uff5c\u79fb\u9664\u7dda\u6bb5\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0061: {
            id: "custom_astute_0061",
            action: "Live ASTGVSLESmartRemovePoints",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Smart Remove Points...",
                zh_TW: "VectorScribe\uff5c\u667a\u6167\u79fb\u9664\u9328\u9ede\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0062: {
            id: "custom_astute_0062",
            action: "Live ASTGVSLESplitPathToSegments",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Split Path to Segments...",
                zh_TW: "VectorScribe\uff5c\u5c07\u8def\u5f91\u5206\u5272\u70ba\u7dda\u6bb5\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0063: {
            id: "custom_astute_0063",
            action: "Live ASTGVSLEStrokeAttributes",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > AG Utilities > Stroke Attributes...",
                zh_TW: "VectorScribe\uff5c\u7b46\u756b\u5c6c\u6027\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0064: {
            id: "custom_astute_0064",
            action: "Live Phantasm CS Brightness Contrast",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Phantasm > Brightness/Contrast...",
                zh_TW: "Phantasm\uff5c\u4eae\u5ea6\uff0f\u5c0d\u6bd4\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0065: {
            id: "custom_astute_0065",
            action: "Live Phantasm CS Curves",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Phantasm > Curves...",
                zh_TW: "Phantasm\uff5c\u66f2\u7dda\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0066: {
            id: "custom_astute_0066",
            action: "Live Phantasm CS Desaturate",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Phantasm > Desaturate...",
                zh_TW: "Phantasm\uff5c\u53bb\u98fd\u548c\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0067: {
            id: "custom_astute_0067",
            action: "Live Phantasm CS Duotone",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Phantasm > Duotone...",
                zh_TW: "Phantasm\uff5c\u96d9\u8272\u8abf\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0068: {
            id: "custom_astute_0068",
            action: "Live Phantasm CS Exposure",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Phantasm > Exposure...",
                zh_TW: "Phantasm\uff5c\u66dd\u5149\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0069: {
            id: "custom_astute_0069",
            action: "Live Phantasm CS Halftone",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Phantasm > Halftone...",
                zh_TW: "Phantasm\uff5c\u7db2\u9ede\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0070: {
            id: "custom_astute_0070",
            action: "Live Phantasm CS Hue Saturation",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Phantasm > Hue/Saturation...",
                zh_TW: "Phantasm\uff5c\u8272\u76f8\uff0f\u98fd\u548c\u5ea6\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0071: {
            id: "custom_astute_0071",
            action: "Live Phantasm CS Invert",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Phantasm > Invert...",
                zh_TW: "Phantasm\uff5c\u53cd\u76f8\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0072: {
            id: "custom_astute_0072",
            action: "Live Phantasm CS Levels",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Phantasm > Levels...",
                zh_TW: "Phantasm\uff5c\u8272\u968e\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0073: {
            id: "custom_astute_0073",
            action: "Live Phantasm CS Prepress Correct",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Phantasm > Prepress Correct...",
                zh_TW: "Phantasm\uff5c\u5370\u524d\u6821\u6b63\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0074: {
            id: "custom_astute_0074",
            action: "Live Phantasm CS Color Shift",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Phantasm > Shift to Color...",
                zh_TW: "Phantasm\uff5c\u5411\u6307\u5b9a\u984f\u8272\u504f\u79fb\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0075: {
            id: "custom_astute_0075",
            action: "Live Phantasm CS Temperature Tint",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Phantasm > Temperature/Tint...",
                zh_TW: "Phantasm\uff5c\u8272\u6eab\uff0f\u8272\u8abf\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0076: {
            id: "custom_astute_0076",
            action: "Live ASTGRAColorRandomizer",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Randomino > Color Randomizer...",
                zh_TW: "Randomino\uff5c\u96a8\u6a5f\u984f\u8272",
            },
            hidden: false,
        },
        custom_astute_0077: {
            id: "custom_astute_0077",
            action: "Live ASTGRAOpacityRandomizer",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Randomino > Opacity Randomizer...",
                zh_TW: "Randomino\uff5c\u96a8\u6a5f\u4e0d\u900f\u660e\u5ea6",
            },
            hidden: false,
        },
        custom_astute_0078: {
            id: "custom_astute_0078",
            action: "Live ASTGRAPerturb",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Randomino > Perturb...",
                zh_TW: "Randomino\uff5c\u96a8\u6a5f\u64fe\u52d5 Perturb",
            },
            hidden: false,
        },
        custom_astute_0079: {
            id: "custom_astute_0079",
            action: "Live ASTGStipple",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Stipplism > Stipple...",
                zh_TW: "Stipplism\uff5c\u5411\u91cf\u9ede\u63cf",
            },
            hidden: false,
        },
        custom_astute_0080: {
            id: "custom_astute_0080",
            action: "Live ASTGSymbolStipple",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Stipplism > Symbol Stipple...",
                zh_TW: "Stipplism\uff5c\u7b26\u865f\u9ede\u63cf",
            },
            hidden: false,
        },
        custom_astute_0081: {
            id: "custom_astute_0081",
            action: "Live AG Architect",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Stylism > AG Architect...",
                zh_TW: "Stylism\uff5cAG Architect \u5ef6\u4f38\u7dda",
            },
            hidden: false,
        },
        custom_astute_0082: {
            id: "custom_astute_0082",
            action: "Live AG Block Shadow",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Stylism > AG Block Shadow...",
                zh_TW: "Stylism\uff5c\u9577\u9670\u5f71 Block Shadow",
            },
            hidden: false,
        },
        custom_astute_0083: {
            id: "custom_astute_0083",
            action: "Live AG Curvature Visualizer",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Stylism > AG Curvature Visualizer...",
                zh_TW: "Stylism\uff5c\u66f2\u7387\u8996\u89ba\u5316",
            },
            hidden: false,
        },
        custom_astute_0084: {
            id: "custom_astute_0084",
            action: "Live AG Offset",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Stylism > AG Offset...",
                zh_TW: "Stylism\uff5c\u504f\u79fb Offset",
            },
            hidden: false,
        },
        custom_astute_0085: {
            id: "custom_astute_0085",
            action: "Live AG Splatter",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Stylism > AG Splatter...",
                zh_TW: "Stylism\uff5c\u98db\u6ffa Splatter",
            },
            hidden: false,
        },
        custom_astute_0086: {
            id: "custom_astute_0086",
            action: "Live ASTGTexture",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > Texturino > Texture...",
                zh_TW: "Texturino\uff5c\u5957\u7528\u6750\u8cea",
            },
            hidden: false,
        },
        custom_astute_0087: {
            id: "custom_astute_0087",
            action: "Live ASTGVSAGCorners",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Effect > VectorScribe > AG Corners...",
                zh_TW: "VectorScribe\uff5cAG Corners \u8f49\u89d2\uff08\u5373\u6642\u6548\u679c\uff09",
            },
            hidden: false,
        },
        custom_astute_0088: {
            id: "custom_astute_0088",
            action: "Arc by Points Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Arc by Points",
                zh_TW: "SubScribe\uff5c\u4f9d\u9ede\u756b\u5f27 Arc by Points",
            },
            hidden: false,
        },
        custom_astute_0089: {
            id: "custom_astute_0089",
            action: "AG Block Shadow Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Block Shadow",
                zh_TW: "Stylism\uff5c\u9577\u9670\u5f71\u5de5\u5177",
            },
            hidden: false,
        },
        custom_astute_0090: {
            id: "custom_astute_0090",
            action: "Circle by Points Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Circle by Points",
                zh_TW: "SubScribe\uff5c\u4f9d\u9ede\u756b\u5713 Circle by Points",
            },
            hidden: false,
        },
        custom_astute_0091: {
            id: "custom_astute_0091",
            action: "AG Color Select Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Color Select",
                zh_TW: "SubScribe\uff5c\u984f\u8272\u53d6\u6a23 AG Color Select",
            },
            hidden: false,
        },
        custom_astute_0092: {
            id: "custom_astute_0092",
            action: "Connect Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Connect",
                zh_TW: "SubScribe\uff5c\u9023\u63a5",
            },
            hidden: false,
        },
        custom_astute_0093: {
            id: "custom_astute_0093",
            action: "Crop Image Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Crop Image",
                zh_TW: "Rasterino\uff5c\u88c1\u5207\u5f71\u50cf",
            },
            hidden: false,
        },
        custom_astute_0094: {
            id: "custom_astute_0094",
            action: "Curvature Circle Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Curvature Circle",
                zh_TW: "SubScribe\uff5c\u66f2\u7387\u5713",
            },
            hidden: false,
        },
        custom_astute_0095: {
            id: "custom_astute_0095",
            action: "Dynamic Corners Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Dynamic Corners",
                zh_TW: "VectorScribe\uff5c\u52d5\u614b\u8f49\u89d2\u5de5\u5177",
            },
            hidden: false,
        },
        custom_astute_0096: {
            id: "custom_astute_0096",
            action: "Dynamic Measure Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Dynamic Measure",
                zh_TW: "VectorScribe\uff5c\u52d5\u614b\u6e2c\u91cf",
            },
            hidden: false,
        },
        custom_astute_0097: {
            id: "custom_astute_0097",
            action: "Dynamic Shapes Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Dynamic Shapes",
                zh_TW: "VectorScribe\uff5c\u52d5\u614b\u5f62\u72c0",
            },
            hidden: false,
        },
        custom_astute_0098: {
            id: "custom_astute_0098",
            action: "Dynamic Sketch Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Dynamic Sketch",
                zh_TW: "DynamicSketch\uff5c\u52d5\u614b\u624b\u7e6a",
            },
            hidden: false,
        },
        custom_astute_0099: {
            id: "custom_astute_0099",
            action: "Extend Path Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Extend Path",
                zh_TW: "VectorScribe\uff5c\u5ef6\u4f38\u8def\u5f91\u5de5\u5177",
            },
            hidden: false,
        },
        custom_astute_0100: {
            id: "custom_astute_0100",
            action: "Gradient From Art Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Gradient From Art",
                zh_TW: "SubScribe\uff5c\u5f9e\u5716\u7a3f\u5efa\u7acb\u6f38\u5c64",
            },
            hidden: false,
        },
        custom_astute_0101: {
            id: "custom_astute_0101",
            action: "Inflate Deflate Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Inflate Deflate",
                zh_TW: "ColliderScribe\uff5c\u64f4\u6563\uff0f\u805a\u650f Inflate Deflate",
            },
            hidden: false,
        },
        custom_astute_0102: {
            id: "custom_astute_0102",
            action: "InkFlow Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - InkFlow",
                zh_TW: "InkFlow\uff5c\u7b46\u58a8\u6d41\u52d5",
            },
            hidden: false,
        },
        custom_astute_0103: {
            id: "custom_astute_0103",
            action: "InkScribe Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - InkScribe",
                zh_TW: "InkScribe\uff5c\u7cbe\u6e96\u92fc\u7b46",
            },
            hidden: false,
        },
        custom_astute_0104: {
            id: "custom_astute_0104",
            action: "Lock Unlock Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Lock Unlock",
                zh_TW: "SubScribe\uff5c\u9396\u5b9a\uff0f\u89e3\u9396",
            },
            hidden: false,
        },
        custom_astute_0105: {
            id: "custom_astute_0105",
            action: "MirrorMe Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - MirrorMe",
                zh_TW: "MirrorMe\uff5c\u93e1\u50cf\u5c0d\u7a31",
            },
            hidden: false,
        },
        custom_astute_0106: {
            id: "custom_astute_0106",
            action: "AG Offset Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Offset",
                zh_TW: "Stylism\uff5c\u504f\u79fb\u5de5\u5177",
            },
            hidden: false,
        },
        custom_astute_0107: {
            id: "custom_astute_0107",
            action: "OpacityBrushTool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Opacity Brush",
                zh_TW: "Texturino\uff5c\u4e0d\u900f\u660e\u5ea6\u7b46\u5237",
            },
            hidden: false,
        },
        custom_astute_0108: {
            id: "custom_astute_0108",
            action: "Orient Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Orient",
                zh_TW: "SubScribe\uff5c\u65b9\u5411\u5c0d\u9f4a",
            },
            hidden: false,
        },
        custom_astute_0109: {
            id: "custom_astute_0109",
            action: "Orient Transform Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Orient Transform",
                zh_TW: "SubScribe\uff5c\u65b9\u5411\u8b8a\u5f62",
            },
            hidden: false,
        },
        custom_astute_0110: {
            id: "custom_astute_0110",
            action: "PathScribe Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - PathScribe",
                zh_TW: "VectorScribe\uff5c\u8def\u5f91\u7de8\u4fee PathScribe",
            },
            hidden: false,
        },
        custom_astute_0111: {
            id: "custom_astute_0111",
            action: "Perpendicular Line Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Perpendicular Line",
                zh_TW: "SubScribe\uff5c\u5782\u7dda",
            },
            hidden: false,
        },
        custom_astute_0112: {
            id: "custom_astute_0112",
            action: "Quick Orient Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Quick Orient",
                zh_TW: "SubScribe\uff5c\u5feb\u901f\u6821\u6b63\u65b9\u5411",
            },
            hidden: false,
        },
        custom_astute_0113: {
            id: "custom_astute_0113",
            action: "RandominiTool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Randomini",
                zh_TW: "Randomino\uff5c\u96a8\u6a5f\u5de5\u5177 Randomini",
            },
            hidden: false,
        },
        custom_astute_0114: {
            id: "custom_astute_0114",
            action: "Reference Point Setter Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Randomino Start Point",
                zh_TW: "Randomino\uff5c\u8a2d\u5b9a\u96a8\u6a5f\u57fa\u6e96\u9ede",
            },
            hidden: false,
        },
        custom_astute_0115: {
            id: "custom_astute_0115",
            action: "Reform Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: { en: "Astute Graphics - Reform", zh_TW: "Reform\uff5c\u91cd\u5851" },
            hidden: false,
        },
        custom_astute_0116: {
            id: "custom_astute_0116",
            action: "Reform Text Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Reform Text",
                zh_TW: "Reform\uff5c\u6587\u5b57\u91cd\u5851",
            },
            hidden: false,
        },
        custom_astute_0117: {
            id: "custom_astute_0117",
            action: "Reprofile Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Reprofile",
                zh_TW: "Reform\uff5c\u91cd\u5851\u8f2a\u5ed3 Reprofile",
            },
            hidden: false,
        },
        custom_astute_0118: {
            id: "custom_astute_0118",
            action: "Reposition Point Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Reposition Point",
                zh_TW: "VectorScribe\uff5c\u91cd\u65b0\u5b9a\u4f4d\u9328\u9ede",
            },
            hidden: false,
        },
        custom_astute_0119: {
            id: "custom_astute_0119",
            action: "Rotate At Collision Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Rotate At Collision",
                zh_TW: "ColliderScribe\uff5c\u78b0\u649e\u6642\u65cb\u8f49",
            },
            hidden: false,
        },
        custom_astute_0120: {
            id: "custom_astute_0120",
            action: "Rotate To Collision Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Rotate To Collision",
                zh_TW: "ColliderScribe\uff5c\u65cb\u8f49\u81f3\u78b0\u649e",
            },
            hidden: false,
        },
        custom_astute_0121: {
            id: "custom_astute_0121",
            action: "Smart Remove Brush Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Smart Remove Brush",
                zh_TW: "VectorScribe\uff5c\u667a\u6167\u522a\u9664\u7b46\u5237",
            },
            hidden: false,
        },
        custom_astute_0122: {
            id: "custom_astute_0122",
            action: "Snap To Collisions Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Snap To Collisions",
                zh_TW: "ColliderScribe\uff5c\u78b0\u649e\u5438\u9644",
            },
            hidden: false,
        },
        custom_astute_0123: {
            id: "custom_astute_0123",
            action: "Straighten Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Straighten",
                zh_TW: "SubScribe\uff5c\u62c9\u76f4",
            },
            hidden: false,
        },
        custom_astute_0124: {
            id: "custom_astute_0124",
            action: "Stylism Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Stylism",
                zh_TW: "Stylism\uff5c\u6548\u679c\u64cd\u63a7\u5de5\u5177",
            },
            hidden: false,
        },
        custom_astute_0125: {
            id: "custom_astute_0125",
            action: "Super Marquee Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Super Marquee",
                zh_TW: "ColliderScribe\uff5c\u8d85\u7d1a\u6846\u9078",
            },
            hidden: false,
        },
        custom_astute_0126: {
            id: "custom_astute_0126",
            action: "Tangent Circle Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Tangent Circle",
                zh_TW: "SubScribe\uff5c\u76f8\u5207\u5713",
            },
            hidden: false,
        },
        custom_astute_0127: {
            id: "custom_astute_0127",
            action: "Tangent Line Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Tangent Line",
                zh_TW: "SubScribe\uff5c\u5207\u7dda",
            },
            hidden: false,
        },
        custom_astute_0128: {
            id: "custom_astute_0128",
            action: "TextureTool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Texture",
                zh_TW: "Texturino\uff5c\u6750\u8cea\u5de5\u5177",
            },
            hidden: false,
        },
        custom_astute_0129: {
            id: "custom_astute_0129",
            action: "TextureBrushTool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Texture Brush",
                zh_TW: "Texturino\uff5c\u6750\u8cea\u7b46\u5237",
            },
            hidden: false,
        },
        custom_astute_0130: {
            id: "custom_astute_0130",
            action: "AG Trim and Join Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Trim and Join",
                zh_TW: "DynamicSketch\uff5c\u4fee\u526a\u4e26\u63a5\u5408 Trim and Join",
            },
            hidden: false,
        },
        custom_astute_0131: {
            id: "custom_astute_0131",
            action: "Width Brush Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Width Brush",
                zh_TW: "WidthScribe\uff5c\u5bec\u5ea6\u7b46\u5237",
            },
            hidden: false,
        },
        custom_astute_0132: {
            id: "custom_astute_0132",
            action: "Width Eraser Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Width Eraser",
                zh_TW: "WidthScribe\uff5c\u5bec\u5ea6\u6a61\u76ae\u64e6",
            },
            hidden: false,
        },
        custom_astute_0133: {
            id: "custom_astute_0133",
            action: "Width Gradient Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Width Gradient",
                zh_TW: "WidthScribe\uff5c\u5bec\u5ea6\u6f38\u5c64",
            },
            hidden: false,
        },
        custom_astute_0134: {
            id: "custom_astute_0134",
            action: "Width Selector Tool",
            type: "tool",
            docRequired: false,
            selRequired: false,
            name: {
                en: "Astute Graphics - Width Selector",
                zh_TW: "WidthScribe\uff5c\u5bec\u5ea6\u9078\u53d6",
            },
            hidden: false,
        },
    };
    function resolveBaseScriptFromStack(stack) {
        var raw =
            stack !== null && stack !== void 0
                ? stack
                : typeof $ !== "undefined" && $.stack
                  ? String($.stack)
                  : "";
        if (!raw) return undefined;
        var lines = raw.split(/\r?\n/);
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (
                !line ||
                line.charAt(0) !== "[" ||
                line.charAt(line.length - 1) !== "]"
            ) {
                continue;
            }
            var inner = line.slice(1, line.length - 1).replace(/^\s+|\s+$/g, "");
            if (!inner) continue;
            if (isNaN(inner)) {
                return inner;
            }
        }
        return undefined;
    }
    var Logger = (function () {
        function Logger(fp, mode, sizeLimit, consoleOutput) {
            if (mode === void 0) {
                mode = "w";
            }
            if (sizeLimit === void 0) {
                sizeLimit = 5000000;
            }
            if (consoleOutput === void 0) {
                consoleOutput = false;
            }
            this.badPath = false;
            if (typeof fp === "undefined") {
                fp =
                    Folder.userData.fullName +
                    "/" +
                    resolveBaseScriptFromStack() +
                    ".log";
            }
            this.mode = mode.toLowerCase();
            this.consoleOutput = consoleOutput;
            this.file = new File(fp);
            if (this.file.length > sizeLimit) {
                this.backup(true);
            }
        }
        Logger.prototype.backup = function (removeOriginal) {
            if (removeOriginal === void 0) {
                removeOriginal = false;
            }
            var ts = Date.now();
            var backupFile = new File(
                "".concat(this.file.fsName, ".").concat(ts, ".bak")
            );
            this.file.copy(backupFile.fsName);
            if (removeOriginal) this.file.remove();
            return backupFile;
        };
        Logger.prototype.log = function () {
            var text = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                text[_i] = arguments[_i];
            }
            if (this.badPath) return false;
            var f = this.file;
            var ts = new Date().toLocaleString();
            if (!f.parent.exists) {
                if (!f.parent.parent.exists) {
                    alert("Bad log file path!\n'" + f.fullName + "'");
                    this.badPath = true;
                    return false;
                }
                f.parent.create();
            }
            var args = ["[".concat(ts, "]")].concat(text);
            try {
                f.encoding = "UTF-8";
                f.open(this.mode);
                f.writeln(args.join(" "));
            } catch (e) {
                $.writeln(
                    "Error writing log file: "
                        .concat(f.fullName, " - ")
                        .concat(e.message)
                );
                return false;
            } finally {
                f.close();
            }
            if (this.consoleOutput) {
                $.writeln(text.join(" "));
            }
            return true;
        };
        Logger.prototype.open = function () {
            this.file.execute();
        };
        Logger.prototype.reveal = function () {
            this.file.parent.execute();
        };
        return Logger;
    })();
    function determineCorrectString(command, prop) {
        var value = command[prop];
        if (isLocalizedEntry(value)) {
            var localizedValue = localize(value);
            return localizedValue || value.en || "";
        }
        if (strings.hasOwnProperty(value)) {
            var localizedValue = localize(strings[value]);
            return localizedValue || strings[value].en || "";
        }
        return typeof value === "string" ? value : "";
    }
    function isLocalizedEntry(value) {
        return (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value) &&
            Object.keys(value).every(function (key) {
                return typeof key === "string" && typeof value[key] === "string";
            })
        );
    }
    function getCommandSearchNames(command, fallbackId) {
        var names = [];
        var value = command.name;
        if (isLocalizedEntry(value)) {
            for (var locale in value) {
                if (!value.hasOwnProperty(locale)) continue;
                var name = value[locale];
                if (name && names.indexOf(name) === -1) names.push(name);
            }
        } else if (typeof value === "string" && value) {
            names.push(value);
        }
        var displayedName = determineCorrectString(command, "name");
        if (displayedName && names.indexOf(displayedName) === -1) {
            names.unshift(displayedName);
        }
        if (command.action && names.indexOf(command.action) === -1) {
            names.push(command.action);
        }
        if (!names.length) names.push(fallbackId.replace(/_/g, " "));
        return names;
    }
    function findLastBreadcrumbSeparator(s) {
        var p = 0;
        var re = / > /g;
        if (re.test(s)) {
            var match = s.search(re);
            while (true) {
                p += match + 3;
                match = s.substring(p).search(re);
                if (match === -1) break;
            }
        }
        return p;
    }
    function generateCommandId(s) {
        var re = /\s|\./gi;
        var id = s.replace(re, "_");
        var n = 0;
        while (commandsData.hasOwnProperty(id)) {
            n++;
            id = s + n.toString();
        }
        return id;
    }
    function addToStartup(newCommandIds) {
        for (var i = newCommandIds.length - 1; i >= 0; i--) {
            var newCommandId = newCommandIds[i];
            if (prefs.startupCommands.includes(newCommandId)) {
                newCommandIds.splice(i, 1);
            }
        }
        if (!newCommandIds.length) return;
        var confirmed = confirm(
            localize(strings.cd_add_to_startup),
            false,
            localize(strings.cd_add_to_startup_title)
        );
        if (!confirmed) return false;
        prefs.startupCommands = newCommandIds.concat(prefs.startupCommands);
    }
    function getDocumentFonts(doc) {
        var fonts = [];
        for (var i = 0; i < doc.textFrames.length; i++) {
            var textFrame = doc.textFrames[i];
            for (var j = 0; j < textFrame.textRanges.length; j++) {
                var font = textFrame.textRanges[j].characterAttributes.textFont;
                if (fonts.indexOf(font) === -1) {
                    fonts.push(font);
                }
            }
        }
        return fonts;
    }
    function zoomIntoPageItem(pageItem) {
        var view = app.activeDocument.views[0];
        var screenBounds = view.bounds;
        var screenW = screenBounds[2] - screenBounds[0];
        var screenH = screenBounds[1] - screenBounds[3];
        var bounds = pageItem.visibleBounds;
        var itemW = bounds[2] - bounds[0];
        var itemH = bounds[1] - bounds[3];
        var itemCX = bounds[0] + itemW / 2;
        var itemCY = bounds[1] - itemH / 2;
        view.centerPoint = [itemCX, itemCY];
        var ratioW = screenW / itemW;
        var ratioH = screenH / itemH;
        var zoomRatio = itemW * (screenH / screenW) >= itemH ? ratioW : ratioH;
        var padding = 0.9;
        view.zoom = zoomRatio * padding;
    }
    function getPlacedFileInfoForReport() {
        if (ExternalObject.AdobeXMPScript === undefined) {
            ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
        }
        var xmp = new XMPMeta(app.activeDocument.XMPString);
        var allFilePaths = getAllPlacedFilePaths(xmp);
        var fileObjects = allFilePaths.map(function (path) {
            return new File(path);
        });
        fileObjects.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        var result = fileObjects.map(function (f, index) {
            var fileInfo =
                localize(strings.dr_name) +
                decodeURI(f.name) +
                "\n" +
                localize(strings.dr_path) +
                f.fsName.replace(f.name, "") +
                "\n" +
                localize(strings.dr_file_found) +
                f.exists.toString().toUpperCase();
            return index === fileObjects.length - 1 ? fileInfo : fileInfo + "\n";
        });
        return result;
    }
    function getAllPlacedFilePaths(xmp) {
        var paths = [];
        for (var i = 1; i <= xmp.countArrayItems(XMPConst.NS_XMP_MM, "Manifest"); i++) {
            var xpath = "xmpMM:Manifest[".concat(i, "]/stMfs:reference/stRef:filePath");
            var prop = xmp.getProperty(XMPConst.NS_XMP_MM, xpath);
            if (prop != null && typeof prop.value === "string") {
                paths.push(prop.value);
            }
        }
        return paths;
    }
    function getBrokenFilePaths(xmp) {
        var paths = [];
        for (
            var i = 1;
            i <= xmp.countArrayItems(XMPConst.NS_XMP_MM, "Ingredients");
            i++
        ) {
            var xpath = "xmpMM:Ingredients[".concat(i, "]/stRef:filePath");
            var prop = xmp.getProperty(XMPConst.NS_XMP_MM, xpath);
            if (prop != null && typeof prop.value === "string") {
                paths.push(prop.value);
            }
        }
        return paths;
    }
    function commandVersionCheck(command) {
        var aiVersion = parseFloat(app.version);
        if (
            (command.minVersion !== undefined && command.minVersion > aiVersion) ||
            (command.maxVersion !== undefined && command.maxVersion < aiVersion)
        ) {
            return false;
        }
        return true;
    }
    function semanticVersionComparison(a, b) {
        if (a === b) {
            return 0;
        }
        var a_components = a.split(".");
        var b_components = b.split(".");
        var len = Math.min(a_components.length, b_components.length);
        for (var i = 0; i < len; i++) {
            var aNum = parseInt(a_components[i], 10);
            var bNum = parseInt(b_components[i], 10);
            if (aNum > bNum) {
                return 1;
            }
            if (aNum < bNum) {
                return -1;
            }
        }
        if (a_components.length > b_components.length) {
            return 1;
        }
        if (a_components.length < b_components.length) {
            return -1;
        }
        return 0;
    }
    function getCollectionObjectNames(collection, sorted) {
        if (sorted === void 0) {
            sorted = false;
        }
        var names = [];
        if (collection.length > 0) {
            for (var i = 0; i < collection.length; i++) {
                var item = collection[i];
                if ("typename" in collection && collection.typename == "Spots") {
                    if (item.name !== "[Registration]") {
                        names.push(item.name);
                    }
                } else {
                    names.push(item.name);
                }
            }
        }
        return sorted ? names.sort() : names;
    }
    function loadFileTypes(prompt, multiselect, fileFilter) {
        var results = [];
        var files = File.openDialog(prompt, fileFilter, multiselect);
        if (files) {
            var selectedFiles = Array.isArray(files) ? files : [files];
            for (var i = 0; i < selectedFiles.length; i++) {
                results.push(selectedFiles[i]);
            }
        }
        return results;
    }
    function simulateKeypress(k, n) {
        if (n === void 0) {
            n = 1;
        }
        var f;
        try {
            f = setupFileObject(pluginDataFolder, "SimulateKeypress.vbs");
            if (!f.exists) {
                var data = 'Set WshShell = WScript.CreateObject("WScript.Shell")\n';
                for (var i = 0; i < n; i++) {
                    data += 'WshShell.SendKeys "{'.concat(k, '}"\n');
                }
                f.encoding = "UTF-8";
                f.open("w");
                f.write(data);
            }
            f.execute();
        } catch (e) {
            logger.log("Error running script:", e.message);
            $.writeln(e);
        } finally {
            if (f) f.close();
        }
    }
    function openURL(url) {
        var html = new File(Folder.temp.absoluteURI + "/aisLink.html");
        html.open("w");
        var htmlBody =
            '<html><head><META HTTP-EQUIV="Refresh" CONTENT="0; URL=' +
            url +
            '"></head><body><p></p></body></html>';
        html.write(htmlBody);
        html.close();
        html.execute();
    }
    function findScriptFiles(folder, recursive) {
        if (recursive === void 0) {
            recursive = true;
        }
        var result = [];
        if (!(folder instanceof Folder) || !folder.exists) {
            throw new Error("Invalid or non-existent folder.");
        }
        var entries = folder.getFiles();
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (entry instanceof File) {
                var name = entry.name.toLowerCase();
                if (name.endsWith(".js") || name.endsWith(".jsx")) {
                    result.push(entry);
                }
            } else if (recursive && entry instanceof Folder) {
                result.push.apply(result, findScriptFiles(entry, true));
            }
        }
        return result;
    }
    function hashString(str) {
        if (str.length === 0) return "0";
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            hash = (hash << 5) - hash + code;
            hash |= 0;
        }
        return Math.abs(hash).toString(36);
    }
    function sortIndexes(sel) {
        return sel
            .map(function (item) {
                return item.index;
            })
            .sort(function (a, b) {
                return a - b;
            });
    }
    function contiguous(sel) {
        return sel.length === sel[sel.length - 1] - sel[0] + 1;
    }
    function setupFolderObject(path) {
        var folder = new Folder(path);
        if (!folder.exists) folder.create();
        return folder;
    }
    function setupFileObject(path, name) {
        return new File("".concat(path, "/").concat(name));
    }
    function readTextFile(f) {
        var data;
        try {
            f.encoding = "UTF-8";
            f.open("r");
            data = f.read();
        } catch (e) {
            logger.log("Error reading file:", f.fsName, e.message);
            alert(localize(strings.fl_error_loading, f));
        } finally {
            f.close();
        }
        return data;
    }
    function writeTextFile(data, fp, mode) {
        if (mode === void 0) {
            mode = "w";
        }
        var f = new File(typeof fp === "string" ? fp : fp.fsName);
        try {
            f.encoding = "UTF-8";
            f.open(mode);
            f.write(data);
        } catch (e) {
            logger.log("Error writing file:", f.fsName, e.message);
            alert(localize(strings.fl_error_writing, f));
        } finally {
            f.close();
        }
    }
    var _a, _b;
    var sysOS = /mac/i.test($.os) ? "mac" : "win";
    var windowsFlickerFix =
        sysOS === "win" && parseFloat(app.version) < 26.4 ? true : false;
    var versionUpdate0_16_0 = false;
    var pluginDataFolder = setupFolderObject(Folder.userData + "/JBD/AiCommandPalette");
    var logFilePath = pluginDataFolder + "/AiCommandPalette.log";
    var userPrefsFileName = "Preferences.json";
    var userHistoryFileName = "History.json";
    var devMode = $.getenv("USER") === "jbd" ? true : false;
    var debugLogging = $.getenv("AICP_DEBUG_LOGGING") !== "false" ? true : false;
    var logger;
    if (devMode || debugLogging) {
        logger = new Logger(logFilePath, "a", undefined, true);
    } else {
        logger = {};
        logger.log = function (text) {
            $.writeln(text);
        };
    }
    var devInfo = {
        folder: function () {
            return pluginDataFolder;
        },
        prefsFile: function () {
            var folder = this.folder();
            return setupFileObject(folder, "prefs.json");
        },
        commandsFile: function () {
            var folder = this.folder();
            return setupFileObject(folder, "commands.json");
        },
        save: function () {
            writeTextFile(JSON.stringify(prefs, undefined, 4), this.prefsFile());
            writeTextFile(
                JSON.stringify(commandsData, undefined, 4),
                this.commandsFile()
            );
        },
    };
    var paletteSettings = {
        paletteWidth: 600,
        paletteHeight: sysOS === "win" ? 211 : 201,
        bounds: [0, 0, 600, sysOS === "win" ? 211 : 201],
        columnSets: {
            standard:
                ((_a = {}),
                (_a[localize(strings.name_title_case)] = { width: 450, key: "name" }),
                (_a[localize(strings.type_title_case)] = { width: 100, key: "type" }),
                _a),
            customCommand:
                ((_b = {}),
                (_b[localize(strings.name_title_case)] = { width: 450, key: "name" }),
                (_b[localize(strings.type_title_case)] = {
                    width: 100,
                    key: "actionType",
                }),
                _b),
        },
    };
    var visibleListItems = 9;
    var mostRecentCommandsCount = 25;
    var namedObjectLimit = 2000;
    var regexEllipsis = /\.\.\.$/;
    var regexBreadcrumbSeparator = /\s>\s/g;
    var prefs = {
        startupCommands: null,
        hiddenCommands: [],
        workflows: [],
        customCommands: [],
        bookmarks: [],
        scripts: [],
        watchedFolders: [],
        pickers: [],
        fuzzy: true,
        version: _version,
        os: $.os,
        locale: $.locale,
        aiVersion: parseFloat(app.version),
        timestamp: Date.now(),
    };
    var userPrefs = {
        folder: function () {
            return pluginDataFolder;
        },
        file: function () {
            var folder = this.folder();
            return setupFileObject(folder, userPrefsFileName);
        },
        load: function (inject) {
            var file = this.file();
            logger.log("loading user preferences:", file.fsName);
            if (!file.exists) return;
            var updateVersion0_16_0 = false;
            var s = readTextFile(file);
            var data;
            try {
                data = JSON.parse(s);
                logger.log("prefs loaded as valid JSON");
            } catch (e) {
                logger.log("prefs not valid JSON, will try eval fallback:", e.message);
            }
            if (data === undefined) {
                try {
                    data = eval(s);
                    logger.log("prefs loaded as old JSON-like, saving as true JSON");
                    writeTextFile(JSON.stringify(data), file);
                } catch (e) {
                    file.rename(file.name + ".bak");
                    logger.log("error loading user prefs", e);
                    logger.log("renaming prefs file:", file.fsName);
                    this.reveal();
                    Error.runtimeError(1, localize(strings.pref_file_loading_error, e));
                }
            }
            if (!data || typeof data !== "object") return;
            if (Object.keys(data).length === 0) return;
            logger.log(
                "loaded prefs saved from ".concat(_title, " v").concat(data.version)
            );
            if (semanticVersionComparison(data.version, "0.16.0") == -1)
                versionUpdate0_16_0 = true;
            var propsToSkip = [
                "version",
                "os",
                "locale",
                "aiVersion",
                "timestamp",
                "latches",
            ];
            for (var prop in data) {
                if (propsToSkip.includes(prop)) continue;
                prefs[prop] = data[prop];
            }
            if (inject) {
                this.inject();
            }
        },
        update: function (version) {
            switch (version) {
                case "0.16.0":
                    logger.log("applying v0.16.0 prefs command id update");
                    this.backup();
                    var commandsLUT = {};
                    for (var key in commandsData) {
                        var command = commandsData[key];
                        if (key == command.id) continue;
                        if (commandsLUT.hasOwnProperty(command.id)) continue;
                        commandsLUT[command.id] = key;
                    }
                    for (var i = 0; i < prefs.startupCommands.length; i++) {
                        var oldId = prefs.startupCommands[i];
                        if (
                            !commandsLUT.hasOwnProperty(oldId) ||
                            oldId == commandsLUT[oldId]
                        )
                            continue;
                        logger.log(
                            "- updating startup command: "
                                .concat(oldId, " -> ")
                                .concat(commandsLUT[oldId])
                        );
                        prefs.startupCommands[i] = commandsLUT[oldId];
                    }
                    for (var i = 0; i < prefs.hiddenCommands.length; i++) {
                        var oldId = prefs.hiddenCommands[i];
                        if (
                            !commandsLUT.hasOwnProperty(oldId) ||
                            oldId == commandsLUT[oldId]
                        )
                            continue;
                        logger.log(
                            "- updating hidden command: "
                                .concat(oldId, " -> ")
                                .concat(commandsLUT[oldId])
                        );
                        prefs.hiddenCommands[i] = commandsLUT[oldId];
                    }
                    for (var i = 0; i < prefs.workflows.length; i++) {
                        var workflow = prefs.workflows[i];
                        for (var j = 0; j < prefs.workflows[i].actions.length; j++) {
                            var oldId = prefs.workflows[i].actions[j];
                            if (
                                !commandsLUT.hasOwnProperty(oldId) ||
                                oldId == commandsLUT[oldId]
                            )
                                continue;
                            logger.log(
                                "- updating "
                                    .concat(workflow.id, " action: ")
                                    .concat(oldId, " -> ")
                                    .concat(commandsLUT[oldId])
                            );
                            prefs.workflows[i].actions[j] = commandsLUT[oldId];
                        }
                    }
                    this.save();
                    break;
                default:
                    break;
            }
        },
        inject: function () {
            var typesToInject = [
                "workflows",
                "bookmarks",
                "scripts",
                "pickers",
                "customCommands",
            ];
            for (var i = 0; i < typesToInject.length; i++) {
                var type = typesToInject[i];
                for (var j = 0; j < prefs[type].length; j++) {
                    var item = prefs[type][j];
                    commandsData[item.id] = item;
                }
            }
        },
        loadWatchedScripts: function () {
            for (var _i = 0, _a = prefs.watchedFolders; _i < _a.length; _i++) {
                var path = _a[_i];
                var folder = new Folder(path);
                if (!folder.exists) {
                    logger.log("folder not found: ".concat(folder.fsName));
                    alert(
                        localize(
                            strings.watched_folder_not_found,
                            decodeURI(folder.name)
                        )
                    );
                    continue;
                }
                logger.log("loading watched script folder: ".concat(folder.fsName));
                var files = findScriptFiles(folder, true);
                var scripts = [];
                for (var _b = 0, files_1 = files; _b < files_1.length; _b++) {
                    var f = files_1[_b];
                    var scriptParent = decodeURI(f.parent.name);
                    var scriptName = decodeURI(f.name);
                    var id = generateCommandId(
                        "watchedScript_" + scriptName + hashString(f.fsName)
                    );
                    if (commandsData[id]) {
                        logger.log("Duplicate script ID skipped: ".concat(id));
                        continue;
                    }
                    var script = {
                        id: id,
                        name: "".concat(scriptParent, " > ").concat(scriptName),
                        action: "script",
                        type: "script",
                        path: f.fsName,
                        docRequired: false,
                        selRequired: false,
                        hidden: false,
                    };
                    commandsData[id] = script;
                    scripts.push(script);
                }
            }
        },
        save: function () {
            var file = this.file();
            logger.log("writing user prefs");
            writeTextFile(JSON.stringify(prefs, undefined, 4), file);
        },
        backup: function () {
            var file = this.file();
            var ts = Date.now();
            var backupFile = new File("".concat(file, ".").concat(ts, ".bak"));
            file.copy(backupFile);
            logger.log("user prefs backed up to:", backupFile.fsName);
            return backupFile;
        },
        reveal: function () {
            var folder = this.folder();
            logger.log("revealing user prefs");
            folder.execute();
        },
    };
    var history = [];
    var recentCommands = {};
    var recentQueries = [];
    var mostRecentCommands = [];
    var latches = {};
    var userHistory = {
        folder: function () {
            return pluginDataFolder;
        },
        file: function () {
            var folder = this.folder();
            return setupFileObject(folder, userHistoryFileName);
        },
        load: function () {
            var file = this.file();
            logger.log("loading user history:", file.fsName);
            if (!file.exists) return;
            var queryCommandsLUT = {};
            var s = readTextFile(file);
            var data;
            try {
                data = JSON.parse(s);
                logger.log("history loaded as valid JSON");
            } catch (e) {
                logger.log(
                    "history not valid JSON, will try eval fallback:",
                    e.message
                );
            }
            if (data === undefined) {
                try {
                    data = eval(s);
                    logger.log("history loaded as old JSON-like, saving as true JSON");
                    writeTextFile(JSON.stringify(data), file);
                } catch (e) {
                    file.rename(file.name + ".bak");
                    this.reveal();
                    Error.runtimeError(1, localize(strings.history_file_loading_error));
                }
            }
            if (!data || typeof data !== "object") return;
            if (Object.keys(data).length === 0) return;
            if (data === 0) return;
            var entry;
            history = data;
            for (var i = data.length - 1; i >= 0; i--) {
                entry = data[i];
                if (!queryCommandsLUT.hasOwnProperty(entry.query))
                    queryCommandsLUT[entry.query] = {};
                if (!queryCommandsLUT[entry.query].hasOwnProperty(entry.command))
                    queryCommandsLUT[entry.query][entry.command] = 0;
                queryCommandsLUT[entry.query][entry.command]++;
                if (!recentCommands.hasOwnProperty(entry.command))
                    recentCommands[entry.command] = 0;
                recentCommands[entry.command]++;
                if (!recentQueries.includes(entry.query)) {
                    recentQueries.push(entry.query);
                }
                if (
                    mostRecentCommands.length <= mostRecentCommandsCount &&
                    commandsData.hasOwnProperty(entry.command) &&
                    !mostRecentCommands.includes(entry.command)
                )
                    mostRecentCommands.push(entry.command);
            }
            var commands;
            for (var query in queryCommandsLUT) {
                commands = [];
                for (var command in queryCommandsLUT[query]) {
                    commands.push([command, queryCommandsLUT[query][command]]);
                }
                commands.sort(function (a, b) {
                    return b[1] - a[1];
                });
                latches[query] = commands[0][0];
            }
        },
        update: function (version) {
            switch (version) {
                case "0.16.0":
                    logger.log("applying v0.16.0 history command id update");
                    this.backup();
                    var commandsLUT = {};
                    for (var key in commandsData) {
                        var command = commandsData[key];
                        if (key == command.id) continue;
                        if (commandsLUT.hasOwnProperty(command.id)) continue;
                        commandsLUT[command.id] = key;
                    }
                    var entry = void 0;
                    for (var i = history.length - 1; i >= 0; i--) {
                        entry = history[i];
                        var oldId = entry.command;
                        if (
                            !commandsLUT.hasOwnProperty(oldId) ||
                            oldId == commandsLUT[oldId]
                        )
                            continue;
                        logger.log(
                            "- updating history command: "
                                .concat(oldId, " -> ")
                                .concat(commandsLUT[oldId])
                        );
                        entry.command = commandsLUT[oldId];
                    }
                    userHistory.save();
                    break;
                default:
                    break;
            }
        },
        clear: function () {
            var file = this.file();
            logger.log("clearing user history");
            file.remove();
        },
        save: function () {
            var file = this.file();
            logger.log("writing user history");
            if (history.length > 500) history = history.slice(-500);
            writeTextFile(JSON.stringify(history, undefined, 4), file);
        },
        backup: function () {
            var file = this.file();
            var ts = Date.now();
            var backupFile = new File("".concat(file, ".").concat(ts, ".bak"));
            file.copy(backupFile);
            logger.log("user history backed up to:", backupFile.fsName);
            return backupFile;
        },
        reveal: function () {
            var folder = this.folder();
            logger.log("revealing history file");
            folder.execute();
        },
    };
    var userActions = {
        loadedActions: false,
        load: function () {
            logger.log("loading user actions");
            var ct = 0;
            var currentPath;
            var set;
            var actionCount;
            var name;
            var pref = app.preferences;
            var path = "plugin/Action/SavedSets/set-";
            for (var i = 1; i <= 100; i++) {
                currentPath = "".concat(path).concat(i, "/");
                set = pref.getStringPreference("".concat(currentPath, "name"));
                if (!set) break;
                actionCount = Number(
                    pref.getIntegerPreference("".concat(currentPath, "actionCount"))
                );
                ct += actionCount;
                for (var j = 1; j <= actionCount; j++) {
                    name = pref.getStringPreference(
                        "".concat(currentPath, "action-").concat(j, "/name")
                    );
                    var id = generateCommandId(
                        "action_".concat(set, "_").concat(name.toLowerCase())
                    );
                    id = "".concat(set, "_").concat(name);
                    var obj = {
                        id: id,
                        action: "action",
                        type: "action",
                        set: set,
                        name: name,
                        docRequired: false,
                        selRequired: false,
                        hidden: false,
                    };
                    commandsData[id] = obj;
                }
            }
            this.loadedActions = ct > 0;
        },
    };
    function filterCommands(
        commands,
        types,
        showHidden,
        showNonRelevant,
        hideSpecificCommands
    ) {
        var filteredCommands = [];
        var allCommands =
            commands !== null && commands !== void 0
                ? commands
                : Object.keys(commandsData);
        for (var i = 0; i < allCommands.length; i++) {
            var id = allCommands[i];
            if (!commandsData.hasOwnProperty(id)) continue;
            var command = commandsData[id];
            if (!commandVersionCheck(command)) {
                continue;
            }
            if (!showHidden && prefs.hiddenCommands.includes(id)) {
                continue;
            }
            if (!showNonRelevant && !relevantCommand(command)) {
                continue;
            }
            if (hideSpecificCommands && hideSpecificCommands.includes(id)) {
                continue;
            }
            if (!types || types.includes(command.type.toLowerCase()))
                filteredCommands.push(id);
        }
        return filteredCommands;
    }
    function relevantCommand(command) {
        if (command.docRequired && app.documents.length < 1) return false;
        if (command.selRequired && app.activeDocument.selection.length < 1)
            return false;
        if (
            command.id === "config_removeWatchedFolders" &&
            !prefs.watchedFolders.length
        )
            return false;
        if (command.id === "builtin_editWorkflow" && !prefs.workflows.length)
            return false;
        if (command.id === "builtin_allWorkflows" && !prefs.workflows.length)
            return false;
        if (command.id === "builtin_allScripts" && !prefs.scripts.length) return false;
        if (command.id === "builtin_allBookmarks" && !prefs.bookmarks.length)
            return false;
        if (command.id === "builtin_allActions" && !userActions.loadedActions)
            return false;
        if (command.id === "builtin_editPicker" && !prefs.pickers.length) return false;
        if (command.id === "builtin_allPickers" && !prefs.pickers.length) return false;
        if (command.id === "config_enableFuzzyMatching" && prefs.fuzzy) return false;
        if (command.id === "config_disableFuzzyMatching" && !prefs.fuzzy) return false;
        if (command.id === "config_enableDebugLogging" && debugLogging) return false;
        if (command.id === "config_disableDebugLogging" && !debugLogging) return false;
        if (command.id === "config_unhideCommand" && !prefs.hiddenCommands.length)
            return false;
        if (
            command.id === "builtin_recentCommands" &&
            Object.keys(recentCommands).length === 0
        ) {
            return false;
        }
        return true;
    }
    function stripRegExpChars(input) {
        return input.replace(/[.*+?^=!:${}()|[\]\/\\]/g, "");
    }
    function fuzzy(q, commands) {
        var sanitizedQuery = stripRegExpChars(q.toLowerCase());
        var scores = {};
        var matches = [];
        for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
            var id = commands_1[_i];
            var command = commandsData[id];
            var chunks = sanitizedQuery.split(" ");
            var commandNames = getCommandSearchNames(command, id);
            var score = -1;
            for (
                var _a = 0, commandNames_1 = commandNames;
                _a < commandNames_1.length;
                _a++
            ) {
                var rawName = commandNames_1[_a];
                var commandName = stripRegExpChars(rawName.toLowerCase()).replace(
                    regexEllipsis,
                    ""
                );
                var spans = findMatches(chunks, commandName);
                if (!spans.length) continue;
                score = Math.max(score, calculateScore(commandName, spans, chunks));
            }
            if (score < 0) continue;
            var bonus = 0;
            if (latches.hasOwnProperty(q) && latches[q] == id) {
                bonus += 1;
            }
            if (recentCommands.hasOwnProperty(id)) {
                bonus += 0.5;
            }
            scores[id] = score + bonus;
            matches.push(id);
        }
        matches.sort(function (a, b) {
            return scores[b] - scores[a];
        });
        return matches;
    }
    function calculateScore(command, spans, chunks) {
        var lastSeparator = findLastBreadcrumbSeparator(command);
        var score = 0;
        var _loop_1 = function (s, e) {
            var len = e - s;
            var startBoundary = s === 0 || command.charAt(s - 1) === " ";
            var endBoundary = e === command.length || command.charAt(e) === " ";
            var boundaryMult = startBoundary && endBoundary ? 3 : startBoundary ? 2 : 1;
            var spanScore = len * boundaryMult;
            spanScore += len * len;
            if (chunks) {
                var spanText_1 = command.slice(s, e).toLowerCase();
                if (
                    chunks.some(function (c) {
                        return c.toLowerCase() === spanText_1;
                    })
                ) {
                    spanScore += len * 3;
                }
            }
            if (s >= lastSeparator) spanScore += 0.5 * len;
            score += spanScore;
        };
        for (var _i = 0, spans_1 = spans; _i < spans_1.length; _i++) {
            var _a = spans_1[_i],
                s = _a[0],
                e = _a[1];
            _loop_1(s, e);
        }
        return score;
    }
    function findMatches(chunks, str) {
        var spans = [];
        for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
            var chunk = chunks_1[_i];
            if (!chunk) continue;
            var s = 0;
            var e = 1;
            var offset = 0;
            var lastSpan = null;
            while (true) {
                var chars = chunk.substring(s, e);
                var match = str.substring(offset).match(chars);
                if (match) {
                    var spanStart = match.index + offset;
                    var spanEnd = spanStart + chars.length;
                    lastSpan = [spanStart, spanEnd];
                    e++;
                } else {
                    if (chars.length === 1) {
                        return [];
                    }
                    s = e - 1;
                    if (lastSpan !== null) {
                        var spanStart = lastSpan[0],
                            spanEnd = lastSpan[1];
                        offset = spanEnd;
                        spans.push([spanStart, spanEnd]);
                    }
                    lastSpan = null;
                }
                if (e === chunk.length + 1) {
                    if (lastSpan !== null) {
                        spans.push(lastSpan);
                    }
                    break;
                }
            }
        }
        return spans;
    }
    function scoreMatches(query, commands) {
        var words = query.toLowerCase().split(" ");
        var matches = [];
        var scores = {};
        var maxScore = 0;
        if (latches.hasOwnProperty(query) && commands.includes(latches[query])) {
            var latchedId = latches[query];
            scores[latchedId] = 1000;
            matches.push(latchedId);
        }
        for (var _i = 0, commands_2 = commands; _i < commands_2.length; _i++) {
            var id = commands_2[_i];
            var command = commandsData[id];
            if (!command) continue;
            var score = 0;
            var names = getCommandSearchNames(command, id).map(function (name) {
                return name.toLowerCase();
            });
            var type = strings.hasOwnProperty(command.type)
                ? (
                      localize(strings[command.type]) || strings[command.type].en
                  ).toLowerCase()
                : command.type.toLowerCase();
            if (
                query === type ||
                names.some(function (name) {
                    var strippedName = name
                        .replace(regexEllipsis, "")
                        .replace(regexBreadcrumbSeparator, " ");
                    return query === name || query === strippedName;
                })
            ) {
                score += query.length;
            }
            var _loop_2 = function (word) {
                if (!word) return "continue";
                if (
                    names.some(function (name) {
                        var strippedName = name
                            .replace(regexEllipsis, "")
                            .replace(regexBreadcrumbSeparator, " ");
                        return (
                            name.indexOf(word) !== -1 ||
                            strippedName.indexOf(word) !== -1
                        );
                    })
                ) {
                    score += word.length;
                }
            };
            for (var _a = 0, words_1 = words; _a < words_1.length; _a++) {
                var word = words_1[_a];
                _loop_2(word);
            }
            if (score > 0) {
                if (recentCommands.hasOwnProperty(command.id)) {
                    score += recentCommands[command.id];
                }
                scores[id] = (scores[id] || 0) + score;
                matches.push(id);
                if (scores[id] > maxScore) {
                    maxScore = scores[id];
                }
            }
        }
        return matches
            .filter(function (id, i, self) {
                return self.indexOf(id) === i;
            })
            .sort(function (a, b) {
                return scores[b] - scores[a];
            });
    }
    function selectOnDoubleClick(listbox) {
        listbox.onDoubleClick = function () {
            var _a;
            (_a = listbox.window) === null || _a === void 0 ? void 0 : _a.close(1);
        };
    }
    function addToStepsOnDoubleClick(listbox) {
        listbox.onDoubleClick = function () {
            var win = listbox.window;
            var steps = win.findElement("steps");
            var selection = listbox.selection;
            var command = commandsData[selection.id];
            var newItem;
            if (command.id === "builtin_buildPicker") {
                var newPicker = buildPicker();
                if (!newPicker) return;
                newItem = steps.add("item", newPicker.name);
                newItem.subItems[0].text = newPicker.type;
                newItem.id = newPicker.id;
            } else {
                newItem = steps.add("item", determineCorrectString(command, "name"));
                newItem.subItems[0].text = determineCorrectString(command, "type");
                newItem.id = selection.id;
            }
            steps.notify("onChange");
        };
    }
    function swapListboxItems(x, y) {
        var tempText = x.text;
        var tempSubText = x.subItems[0].text;
        var tempId = x.id;
        x.text = y.text;
        x.subItems[0].text = y.subItems[0].text;
        x.id = y.id;
        y.text = tempText;
        y.subItems[0].text = tempSubText;
        y.id = tempId;
    }
    function addListboxArrowKeyNavigation(q, list, callbacks) {
        q.addEventListener("keydown", function (e) {
            var listbox = list.listbox;
            var listboxSelection = listbox.selection;
            if (e.keyName === "Up" || e.keyName === "Down") {
                e.preventDefault();
                if (
                    typeof listboxSelection === "number" ||
                    Array.isArray(listboxSelection)
                )
                    return;
                if (!listboxSelection) {
                    listbox.selection = 0;
                    return;
                }
                if (
                    e.keyName === "Up" &&
                    (callbacks === null || callbacks === void 0
                        ? void 0
                        : callbacks.shouldBlockUpNavigation) &&
                    callbacks.shouldBlockUpNavigation()
                ) {
                    return;
                }
                if (
                    callbacks === null || callbacks === void 0
                        ? void 0
                        : callbacks.onNavigate
                ) {
                    callbacks.onNavigate();
                }
                if (e.getModifierState("Shift")) {
                    if (e.keyName === "Up") {
                        if (listboxSelection.index === 0) {
                            listbox.selection = listbox.items.length - 1;
                        } else {
                            listbox.selection = listboxSelection.index - 1;
                        }
                    } else if (e.keyName === "Down") {
                        if (listboxSelection.index === listbox.items.length - 1) {
                            listbox.selection = 0;
                        } else {
                            listbox.selection = listboxSelection.index + 1;
                        }
                    }
                } else {
                    if (e.keyName === "Up") {
                        if (listboxSelection.index == 0) {
                            listbox.selection = listbox.items.length - 1;
                            listbox.frameStart =
                                listbox.items.length - 1 - visibleListItems;
                        } else if (listboxSelection.index > 0) {
                            listbox.selection = listboxSelection.index - 1;
                            if (listboxSelection.index < listbox.frameStart)
                                listbox.frameStart--;
                        }
                    } else if (e.keyName === "Down") {
                        if (listboxSelection.index === listbox.items.length - 1) {
                            listbox.selection = 0;
                            listbox.frameStart = 0;
                        } else {
                            if (listboxSelection.index < listbox.items.length) {
                                listbox.selection = listboxSelection.index + 1;
                                if (
                                    listboxSelection.index >
                                    listbox.frameStart + visibleListItems - 1
                                ) {
                                    if (
                                        listbox.frameStart <
                                        listbox.items.length - visibleListItems
                                    ) {
                                        listbox.frameStart++;
                                    } else {
                                        listbox.frameStart = listbox.frameStart;
                                    }
                                }
                            }
                        }
                    }
                    var updatedListboxSelection = listbox.selection;
                    if (
                        updatedListboxSelection.index < listbox.frameStart ||
                        updatedListboxSelection.index >
                            listbox.frameStart + visibleListItems - 1
                    )
                        listbox.frameStart =
                            updatedListboxSelection.index -
                            Math.floor(visibleListItems / 2);
                    if (listbox.items.length <= visibleListItems) return;
                    listbox.revealItem(listbox.frameStart);
                }
            }
        });
    }
    var ListBoxWrapper = (function () {
        function ListBoxWrapper(
            commands,
            container,
            name,
            bounds,
            columns,
            multiselect,
            helptip,
            listeners
        ) {
            this.container = container;
            this.name = name;
            this.bounds = bounds;
            this.columns = columns;
            this.multiselect = multiselect;
            this.helptip = helptip;
            this.listeners = listeners;
            this.listbox = this.make(commands, this.bounds);
        }
        ListBoxWrapper.prototype.make = function (commands, bounds) {
            var columnTitles = [];
            var columnWidths = [];
            var columnKeys = [];
            for (var title in this.columns) {
                var col = this.columns[title];
                columnTitles.push(col.hideTitle ? "" : title);
                columnWidths.push(col.width);
                columnKeys.push(col.key);
            }
            var listbox = this.container.add("listbox", bounds, undefined, {
                name: this.name,
                numberOfColumns: columnTitles.length,
                showHeaders: true,
                columnTitles: columnTitles,
                columnWidths: columnWidths,
                multiselect: this.multiselect,
            });
            listbox.frameStart = 0;
            if (this.helptip) listbox.helpTip = this.helptip;
            if (commands.length > 0) {
                this.loadCommands(listbox, commands, columnKeys);
                listbox.selection = 0;
            }
            listbox.addEventListener("keydown", function (e) {
                if (
                    typeof listbox.selection === "number" ||
                    Array.isArray(listbox.selection)
                )
                    return;
                if (!listbox.selection) {
                    listbox.selection = 0;
                    return;
                }
                var listboxSelection = listbox.selection;
                if (e.keyName === "Up" && listboxSelection.index === 0) {
                    listbox.selection = listbox.items.length - 1;
                    e.preventDefault();
                } else if (
                    e.keyName === "Down" &&
                    listboxSelection.index === listbox.items.length - 1
                ) {
                    listbox.selection = 0;
                    e.preventDefault();
                }
            });
            this.addListeners(listbox);
            return listbox;
        };
        ListBoxWrapper.prototype.update = function (matches) {
            var newListbox = this.make(matches, this.listbox.bounds);
            this.container.remove(this.listbox);
            this.listbox = newListbox;
        };
        ListBoxWrapper.prototype.loadCommands = function (
            listbox,
            commands,
            columnKeys
        ) {
            for (var _i = 0, commands_3 = commands; _i < commands_3.length; _i++) {
                var id = commands_3[_i];
                var item = void 0;
                if (!commandsData.hasOwnProperty(id)) {
                    item = listbox.add("item", id);
                } else {
                    var command = commandsData[id];
                    var name = determineCorrectString(command, "name");
                    var mainText =
                        determineCorrectString(command, columnKeys[0]) || name;
                    item = listbox.add("item", mainText);
                    for (var j = 1; j < columnKeys.length; j++) {
                        var str = determineCorrectString(command, columnKeys[j]);
                        item.subItems[j - 1].text =
                            str || localize(strings.listbox_missing);
                    }
                }
                item.id = id;
            }
        };
        ListBoxWrapper.prototype.addListeners = function (listbox) {
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(listbox);
            }
        };
        return ListBoxWrapper;
    })();
    function commandPalette(
        commands,
        title,
        columns,
        multiselect,
        showOnly,
        saveHistory,
        scrollHistory
    ) {
        if (commands === void 0) {
            commands = startupCommands;
        }
        if (title === void 0) {
            title = _title;
        }
        if (columns === void 0) {
            columns = paletteSettings.columnSets.standard;
        }
        if (multiselect === void 0) {
            multiselect = false;
        }
        if (showOnly === void 0) {
            showOnly = null;
        }
        if (saveHistory === void 0) {
            saveHistory = true;
        }
        if (scrollHistory === void 0) {
            scrollHistory = false;
        }
        var qCache = {};
        var historyScrolling = true;
        var historyIndex = 0;
        var win = new Window("dialog");
        win.text = title;
        win.alignChildren = "fill";
        var q = win.add("edittext");
        q.helpTip = localize(strings.cd_q_helptip);
        var matches = showOnly !== null && showOnly !== void 0 ? showOnly : commands;
        var list = new ListBoxWrapper(
            matches,
            win,
            "commands",
            paletteSettings.bounds,
            columns,
            multiselect,
            undefined,
            [selectOnDoubleClick]
        );
        var winButtons = win.add("group");
        winButtons.orientation = "row";
        winButtons.alignChildren = ["center", "center"];
        var ok = winButtons.add("button", undefined, localize(strings.button_ok));
        ok.preferredSize.width = 100;
        var cancel = winButtons.add("button", undefined, localize(strings.cancel), {
            name: "cancel",
        });
        cancel.preferredSize.width = 100;
        if (windowsFlickerFix) {
            simulateKeypress("TAB", 1);
        } else {
            q.active = true;
        }
        win.addEventListener("keydown", function (e) {
            if (e.keyName === "Escape") {
                e.preventDefault();
                win.close();
            }
        });
        q.onChanging = function () {
            historyScrolling = false;
            historyIndex = 0;
            if (q.text === "") {
                matches =
                    showOnly !== null && showOnly !== void 0 ? showOnly : commands;
                historyScrolling = true;
            } else if (qCache.hasOwnProperty(q.text)) {
                matches = qCache[q.text];
            } else {
                matches = matcher(q.text, commands);
                qCache[q.text] = matches;
            }
            list.update(matches);
        };
        var updateHistory = function () {
            if (q.text === "") return;
            var selected = list.listbox.selection;
            if (!selected || selected.id === "builtin_recentCommands") return;
            history.push({
                query: q.text,
                command: selected.id,
                timestamp: Date.now(),
            });
            userHistory.save();
        };
        if (scrollHistory) {
            q.addEventListener("keydown", function (e) {
                if (e.keyName === "Up" && historyScrolling) {
                    e.preventDefault();
                    if (recentQueries && recentQueries.length > 0) {
                        var historyEntry = recentQueries[historyIndex];
                        q.text = historyEntry;
                        historyIndex = Math.min(
                            historyIndex + 1,
                            recentQueries.length - 1
                        );
                        if (qCache.hasOwnProperty(q.text)) {
                            matches = qCache[q.text];
                        } else {
                            matches = matcher(q.text, commands);
                            qCache[q.text] = matches;
                        }
                        list.update(matches);
                    }
                }
            });
        }
        if (!multiselect) {
            addListboxArrowKeyNavigation(q, list, {
                shouldBlockUpNavigation: function () {
                    return historyScrolling;
                },
                onNavigate: function () {
                    historyScrolling = false;
                    historyIndex = 0;
                },
            });
        }
        if (win.show() === 1) {
            if (!list.listbox.selection) return false;
            var rawSelection = list.listbox.selection;
            if (!rawSelection || typeof rawSelection === "number") return false;
            var selectedListItems = Array.isArray(rawSelection)
                ? rawSelection
                : [rawSelection];
            if (multiselect) {
                var selections = rawSelection;
                var items = selections.map(function (item) {
                    return item.id;
                });
                logger.log("user selected commands:", items.join(", "));
                return items;
            } else {
                var selected = rawSelection;
                logger.log("user selected command:", selected);
                if (saveHistory) updateHistory();
                return selected.id;
            }
        }
        return false;
    }
    function addCustomCommandsDialog() {
        var win = new Window("dialog");
        win.text = localize(strings.add_custom_commands_dialog_title);
        win.alignChildren = "fill";
        var header = win.add(
            "statictext",
            [0, 0, 500, 100],
            localize(strings.custom_commands_header),
            { justify: "center", multiline: true }
        );
        header.justify = "center";
        var customCommands = win.add("edittext", [0, 0, 400, 200], "", {
            multiline: true,
        });
        customCommands.text = "";
        var winButtons = win.add("group");
        winButtons.orientation = "row";
        winButtons.alignChildren = ["center", "center"];
        var save = winButtons.add("button", undefined, localize(strings.save), {
            name: "ok",
        });
        save.preferredSize.width = 100;
        save.enabled = false;
        var cancel = winButtons.add("button", undefined, localize(strings.cancel), {
            name: "cancel",
        });
        cancel.preferredSize.width = 100;
        customCommands.onChanging = function () {
            save.enabled = customCommands.text.length > 0;
        };
        var confirmed = win.show() === 1;
        return confirmed ? customCommands.text : "";
    }
    function pickerBuilder(editPickerId) {
        var overwrite = false;
        var win = new Window("dialog");
        win.text = localize(strings.picker_builder_title);
        win.alignChildren = "fill";
        var header = win.add(
            "statictext",
            undefined,
            localize(strings.picker_builder_header)
        );
        header.justify = "center";
        var pickerCommands = win.add("edittext", [0, 0, 400, 200], "", {
            multiline: true,
        });
        pickerCommands.text = editPickerId
            ? commandsData[editPickerId].commands.join("\n")
            : "";
        pickerCommands.active = true;
        var cbMultiselect = win.add(
            "checkbox",
            undefined,
            localize(strings.picker_builder_multi_select)
        );
        cbMultiselect.value = editPickerId
            ? commandsData[editPickerId].multiselect
            : false;
        var pName = win.add("panel", undefined, localize(strings.picker_builder_name));
        pName.alignChildren = ["fill", "center"];
        pName.margins = 20;
        var pickerNameText = editPickerId ? commandsData[editPickerId].name : "";
        var pickerName = pName.add("edittext", undefined, pickerNameText);
        pickerName.enabled = Boolean(editPickerId);
        var winButtons = win.add("group");
        winButtons.orientation = "row";
        winButtons.alignChildren = ["center", "center"];
        var save = winButtons.add("button", undefined, localize(strings.save), {
            name: "ok",
        });
        save.preferredSize.width = 100;
        save.enabled = Boolean(editPickerId);
        var cancel = winButtons.add("button", undefined, localize(strings.cancel), {
            name: "cancel",
        });
        cancel.preferredSize.width = 100;
        pickerCommands.onChanging = function () {
            var hasText = pickerCommands.text.length > 0;
            pickerName.enabled = hasText;
            save.enabled = hasText && pickerName.text.length > 0;
        };
        pickerName.onChanging = function () {
            save.enabled = pickerCommands.text.length > 0 && pickerName.text.length > 0;
        };
        save.onClick = function () {
            var nameTrimmed = pickerName.text.trim();
            var currentPickers = prefs.pickers.map(function (p) {
                return p.name;
            });
            if (currentPickers.includes(nameTrimmed)) {
                overwrite = true;
                var confirmed = confirm(
                    localize(strings.picker_builder_save_conflict_message, nameTrimmed),
                    false,
                    localize(strings.picker_builder_save_conflict_title)
                );
                if (!confirmed) return;
            }
            win.close(1);
        };
        if (win.show() === 1) {
            var newCustomCommandIds = [];
            var text = pickerCommands.text;
            var normalized = text.replace(/\r\n|\r/g, "\n");
            var commands = normalized
                .split("\n")
                .map(function (line) {
                    return line.trim();
                })
                .filter(Boolean);
            return {
                name: pickerName.text.trim(),
                commands: commands,
                multiselect: cbMultiselect.value,
                overwrite: overwrite,
            };
        }
        return false;
    }
    function workflowBuilder(commands, editWorkflowId) {
        var qCache = {};
        var overwrite = false;
        var editableCommandTypes = ["picker"];
        var win = new Window("dialog");
        win.text = localize(strings.wf_builder);
        win.alignChildren = "fill";
        var pSearch = win.add("panel", undefined, localize(strings.cd_search_for));
        pSearch.alignChildren = ["fill", "center"];
        pSearch.margins = 20;
        var q = pSearch.add("edittext");
        q.helpTip = localize(strings.cd_q_helptip);
        var matches = commands;
        var list = new ListBoxWrapper(
            matches,
            pSearch,
            "commands",
            [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
            paletteSettings.columnSets.standard,
            false,
            localize(strings.cd_helptip),
            [addToStepsOnDoubleClick]
        );
        var pSteps = win.add("panel", undefined, localize(strings.wf_steps));
        pSteps.alignChildren = ["fill", "center"];
        pSteps.margins = 20;
        var actionSteps = [];
        var actionStepStatuses = [];
        if (editWorkflowId) {
            var editWorkflow_1 = commandsData[editWorkflowId];
            for (var i = 0; i < editWorkflow_1.actions.length; i++) {
                var step = editWorkflow_1.actions[i];
                var status = "";
                if (!commandsData.hasOwnProperty(step)) {
                    status = localize(strings.wf_step_not_found);
                } else if (!commandVersionCheck(commandsData[step])) {
                    status = localize(strings.wf_step_incompatible_ai_version);
                }
                actionSteps.push(step);
                actionStepStatuses.push(status);
            }
        }
        var steps = new ListBoxWrapper(
            actionSteps,
            pSteps,
            "steps",
            [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
            paletteSettings.columnSets.standard,
            true,
            localize(strings.wf_steps_helptip),
            []
        );
        for (var i = 0; i < actionStepStatuses.length; i++) {
            if (actionStepStatuses[i]) {
                steps.listbox.items[i].text += " [".concat(actionStepStatuses[i], "]");
            }
        }
        steps.listbox.onDoubleClick = function () {
            var rawSelection = steps.listbox.selection;
            if (!rawSelection || typeof rawSelection === "number") return;
            var selectedItem = Array.isArray(rawSelection)
                ? rawSelection[0]
                : rawSelection;
            var command = commandsData[selectedItem.id];
            if (
                !command ||
                !editableCommandTypes.includes(command.type.toLowerCase())
            ) {
                alert(localize(strings.wf_step_not_editable));
                return;
            }
            var updatedPicker = buildPicker(command.id);
            if (!updatedPicker) return;
            if (updatedPicker.id !== command.id) selectedItem.id = updatedPicker.id;
            if (updatedPicker.name !== command.name)
                selectedItem.text = updatedPicker.name;
        };
        var stepButtons = pSteps.add("group");
        stepButtons.alignment = "center";
        var up = stepButtons.add("button", undefined, localize(strings.step_up));
        up.preferredSize.width = 100;
        var down = stepButtons.add("button", undefined, localize(strings.step_down));
        down.preferredSize.width = 100;
        var edit = stepButtons.add("button", undefined, localize(strings.step_edit));
        edit.preferredSize.width = 100;
        var del = stepButtons.add("button", undefined, localize(strings.step_delete));
        del.preferredSize.width = 100;
        var pName = win.add("panel", undefined, localize(strings.wf_save_as));
        pName.alignChildren = ["fill", "center"];
        pName.margins = 20;
        var workflowNameText = editWorkflowId ? commandsData[editWorkflowId].name : "";
        var workflowName = pName.add("edittext", undefined, workflowNameText);
        workflowName.enabled = Boolean(editWorkflowId);
        var winButtons = win.add("group");
        winButtons.orientation = "row";
        winButtons.alignChildren = ["center", "center"];
        var save = winButtons.add("button", undefined, localize(strings.save), {
            name: "ok",
        });
        save.preferredSize.width = 100;
        save.enabled = Boolean(editWorkflowId);
        var cancel = winButtons.add("button", undefined, localize(strings.cancel), {
            name: "cancel",
        });
        cancel.preferredSize.width = 100;
        if (windowsFlickerFix) {
            simulateKeypress("TAB", 1);
        } else {
            q.active = true;
        }
        win.addEventListener("keydown", function (e) {
            if (e.keyName === "Escape") {
                e.preventDefault();
                win.close();
            }
        });
        q.onChanging = function () {
            if (q.text === "") {
                matches = commands;
            } else if (qCache.hasOwnProperty(q.text)) {
                matches = qCache[q.text];
            } else {
                matches = matcher(q.text, commands);
                qCache[q.text] = matches;
            }
            list.update(matches);
        };
        addListboxArrowKeyNavigation(q, list);
        steps.listbox.onChange = function () {
            workflowName.enabled = steps.listbox.items.length > 0;
            save.enabled = workflowName.enabled && workflowName.text.length > 0;
        };
        workflowName.onChanging = function () {
            save.enabled = workflowName.text.length > 0;
        };
        up.onClick = function () {
            var rawSelection = steps.listbox.selection;
            if (!rawSelection || typeof rawSelection === "number") return;
            var selectedListItems = Array.isArray(rawSelection)
                ? rawSelection
                : [rawSelection];
            var selected = sortIndexes(selectedListItems);
            if (selected[0] === 0 || !contiguous(selected)) return;
            for (var i = 0; i < selected.length; i++) {
                swapListboxItems(
                    steps.listbox.items[selected[i] - 1],
                    steps.listbox.items[selected[i]]
                );
            }
            steps.listbox.selection = null;
            for (var n = 0; n < selected.length; n++) {
                steps.listbox.selection = selected[n] - 1;
            }
        };
        down.onClick = function () {
            var rawSelection = steps.listbox.selection;
            if (!rawSelection || typeof rawSelection === "number") return;
            var selectedListItems = Array.isArray(rawSelection)
                ? rawSelection
                : [rawSelection];
            var selected = sortIndexes(selectedListItems);
            if (
                selected[selected.length - 1] === steps.listbox.items.length - 1 ||
                !contiguous(selected)
            )
                return;
            for (var i = selected.length - 1; i >= 0; i--) {
                swapListboxItems(
                    steps.listbox.items[selected[i]],
                    steps.listbox.items[selected[i] + 1]
                );
            }
            steps.listbox.selection = null;
            for (var n = 0; n < selected.length; n++) {
                steps.listbox.selection = selected[n] + 1;
            }
        };
        edit.onClick = steps.listbox.onDoubleClick;
        del.onClick = function () {
            var rawSelection = steps.listbox.selection;
            if (!rawSelection || typeof rawSelection === "number") return;
            var selectedListItems = Array.isArray(rawSelection)
                ? rawSelection
                : [rawSelection];
            var selected = sortIndexes(selectedListItems);
            for (var i = selected.length - 1; i >= 0; i--) {
                steps.listbox.remove(selected[i]);
            }
            steps.listbox.selection = null;
            workflowName.enabled = steps.listbox.items.length > 0;
            save.enabled = workflowName.enabled && workflowName.text.length > 0;
        };
        save.onClick = function () {
            var existingNames = prefs.workflows.map(function (wf) {
                return wf.name;
            });
            if (existingNames.includes(workflowName.text.trim())) {
                overwrite = true;
                var confirmed = confirm(
                    ""
                        .concat(localize(strings.wf_already_exists), "\n")
                        .concat(workflowName.text.trim()),
                    false,
                    localize(strings.wf_already_exists_title)
                );
                if (!confirmed) return;
            }
            win.close(1);
        };
        if (win.show() === 1) {
            var actions = [];
            for (var i = 0; i < steps.listbox.items.length; i++) {
                var lbi = steps.listbox.items[i];
                actions.push(lbi.id);
            }
            return {
                name: workflowName.text.trim(),
                actions: actions,
                overwrite: overwrite,
            };
        }
        return false;
    }
    function startupBuilder(commands) {
        var qCache = {};
        var win = new Window("dialog");
        win.text = localize(strings.startup_builder);
        win.alignChildren = "fill";
        var pSearch = win.add("panel", undefined, localize(strings.cd_search_for));
        pSearch.alignChildren = ["fill", "center"];
        pSearch.margins = 20;
        var q = pSearch.add("edittext");
        q.helpTip = localize(strings.cd_q_helptip);
        var matches = commands;
        var list = new ListBoxWrapper(
            matches,
            pSearch,
            "commands",
            [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
            paletteSettings.columnSets.standard,
            false,
            localize(strings.startup_helptip),
            [addToStepsOnDoubleClick]
        );
        var pSteps = win.add("panel", undefined, localize(strings.startup_steps));
        pSteps.alignChildren = ["fill", "center"];
        pSteps.margins = 20;
        var steps = new ListBoxWrapper(
            prefs.startupCommands,
            pSteps,
            "steps",
            [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
            paletteSettings.columnSets.standard,
            true,
            localize(strings.startup_steps_helptip),
            []
        );
        var stepButtons = pSteps.add("group");
        stepButtons.alignment = "center";
        var up = stepButtons.add("button", undefined, localize(strings.step_up));
        up.preferredSize.width = 100;
        var down = stepButtons.add("button", undefined, localize(strings.step_down));
        down.preferredSize.width = 100;
        var del = stepButtons.add("button", undefined, localize(strings.step_delete));
        del.preferredSize.width = 100;
        var winButtons = win.add("group");
        winButtons.orientation = "row";
        winButtons.alignChildren = ["center", "center"];
        var save = winButtons.add("button", undefined, localize(strings.save), {
            name: "ok",
        });
        save.preferredSize.width = 100;
        save.enabled = true;
        var cancel = winButtons.add("button", undefined, localize(strings.cancel), {
            name: "cancel",
        });
        cancel.preferredSize.width = 100;
        if (windowsFlickerFix) {
            simulateKeypress("TAB", 1);
        } else {
            q.active = true;
        }
        win.addEventListener("keydown", function (e) {
            if (e.keyName === "Escape") {
                e.preventDefault();
                win.close();
            }
        });
        q.onChanging = function () {
            if (q.text === "") {
                matches = commands;
            } else if (qCache.hasOwnProperty(q.text)) {
                matches = qCache[q.text];
            } else {
                matches = matcher(q.text, commands);
                qCache[q.text] = matches;
            }
            list.update(matches);
        };
        addListboxArrowKeyNavigation(q, list);
        up.onClick = function () {
            var rawSelection = steps.listbox.selection;
            if (!rawSelection || typeof rawSelection === "number") return;
            var selectedListItems = Array.isArray(rawSelection)
                ? rawSelection
                : [rawSelection];
            var selected = sortIndexes(selectedListItems);
            if (selected[0] === 0 || !contiguous(selected)) return;
            for (var i = 0; i < selected.length; i++) {
                swapListboxItems(
                    steps.listbox.items[selected[i] - 1],
                    steps.listbox.items[selected[i]]
                );
            }
            steps.listbox.selection = null;
            for (var n = 0; n < selected.length; n++) {
                steps.listbox.selection = selected[n] - 1;
            }
        };
        down.onClick = function () {
            var rawSelection = steps.listbox.selection;
            if (!rawSelection || typeof rawSelection === "number") return;
            var selectedListItems = Array.isArray(rawSelection)
                ? rawSelection
                : [rawSelection];
            var selected = sortIndexes(selectedListItems);
            if (
                selected[selected.length - 1] === steps.listbox.items.length - 1 ||
                !contiguous(selected)
            )
                return;
            for (var i = selected.length - 1; i >= 0; i--) {
                swapListboxItems(
                    steps.listbox.items[selected[i]],
                    steps.listbox.items[selected[i] + 1]
                );
            }
            steps.listbox.selection = null;
            for (var n = 0; n < selected.length; n++) {
                steps.listbox.selection = selected[n] + 1;
            }
        };
        del.onClick = function () {
            var rawSelection = steps.listbox.selection;
            if (!rawSelection || typeof rawSelection === "number") return;
            var selectedListItems = Array.isArray(rawSelection)
                ? rawSelection
                : [rawSelection];
            var selected = sortIndexes(selectedListItems);
            for (var i = selected.length - 1; i >= 0; i--) {
                var lbi = steps.listbox.items[selected[i]];
                commands.push(lbi.id);
                steps.listbox.remove(selected[i]);
            }
            qCache = {};
            matches = matcher(q.text, commands);
            qCache[q.text] = matches;
            if (matches.length > 0) {
                list.update(matches);
            }
            steps.listbox.selection = null;
        };
        if (win.show() === 1) {
            var items = [];
            for (var i = 0; i < steps.listbox.items.length; i++) {
                var lbi = steps.listbox.items[i];
                items.push(lbi.id);
            }
            return items;
        }
        return false;
    }
    function processCommand(id) {
        var command = commandsData[id];
        logger.log("processing command:", command.id);
        if (command.type === "workflow") {
            var badActions = checkWorkflowActions(command.actions);
            if (badActions.length > 0) {
                alert(localize(strings.wf_needs_attention, badActions.join("\n")));
                buildWorkflow(id);
                userPrefs.save();
                return;
            }
            for (var _i = 0, _a = command.actions; _i < _a.length; _i++) {
                var actionId = _a[_i];
                processCommand(actionId);
            }
        } else {
            executeAction(command);
        }
    }
    function executeAction(command) {
        if (command.docRequired && app.documents.length < 1) {
            var shouldProceed = confirm(
                localize(strings.cd_active_document_required, command.action),
                false,
                localize(strings.cd_exception)
            );
            if (!shouldProceed) return;
        }
        if (command.selRequired && app.activeDocument.selection.length < 1) {
            var shouldProceed = confirm(
                localize(strings.cd_active_selection_required, command.action),
                false,
                localize(strings.cd_exception)
            );
            if (!shouldProceed) return;
        }
        var func;
        var alertString = strings.cd_error_executing;
        switch (command.type.toLowerCase()) {
            case "config":
            case "builtin":
                func = internalAction;
                break;
            case "custom":
                func = command.actionType === "menu" ? menuAction : toolAction;
                break;
            case "menu":
                func = menuAction;
                break;
            case "tool":
                func = toolAction;
                alertString = strings.tl_error_selecting;
                break;
            case "action":
                func = actionAction;
                alertString = strings.ac_error_execution;
                break;
            case "bookmark":
            case "file":
            case "folder":
                func = bookmarkAction;
                break;
            case "picker":
                func = runCustomPicker;
                break;
            case "script":
                func = scriptAction;
                alertString = strings.sc_error_execution;
                break;
            default:
                alert(localize(strings.cd_invalid, command.type));
                return;
        }
        try {
            func(command);
        } catch (e) {
            var name = isLocalizedEntry(command.name)
                ? localize(command.name)
                : command.name;
            logger.log("Error executing command:", command.id, "-", e.message);
            alert(localize(alertString, name, e.message));
        }
    }
    function menuAction(command) {
        app.executeMenuCommand(command.action);
    }
    function toolAction(command) {
        app.selectTool(command.action);
    }
    function actionAction(command) {
        var actionName = isLocalizedEntry(command.name)
            ? localize(command.name)
            : command.name;
        app.doScript(actionName, command.set);
        app.redraw();
    }
    function bookmarkAction(command) {
        if (command.type === "file") {
            var f = new File(command.path);
            if (!f.exists) {
                alert(localize(strings.bm_error_exists, command.path));
                return;
            }
            app.open(f);
        } else if (command.type === "folder") {
            var f = new Folder(command.path);
            if (!f.exists) {
                alert(localize(strings.bm_error_exists, command.path));
                return;
            }
            f.execute();
        }
    }
    function runCustomPicker(picker) {
        var commands = [];
        for (var i = 0; i < picker.commands.length; i++) {
            var id = "".concat(picker.name, "_option_").concat(i);
            var command = {
                id: id,
                action: "picker_option",
                type: "picker_option_type",
                docRequired: false,
                selRequired: false,
                name: picker.commands[i],
                hidden: false,
            };
            commandsData[id] = command;
            commands.push(id);
        }
        var result = commandPalette(
            commands,
            picker.name,
            paletteSettings.columnSets.standard,
            picker.multiselect
        );
        if (!result) {
            $.setenv("aic_picker_last", null);
            return;
        }
        var commandIds = Array.isArray(result) ? result : [result];
        var args = commandIds.map(function (id) {
            return commandsData[id].name;
        });
        $.setenv("aic_picker_last", args.toSource());
    }
    function scriptAction(command) {
        var f = new File(command.path);
        if (!f.exists) {
            alert(localize(strings.sc_error_exists, command.path));
            return;
        }
        $.evalFile(f);
    }
    function internalAction(command) {
        var shouldWritePrefs = true;
        var action = command.action;
        switch (action) {
            case "about":
                shouldWritePrefs = false;
                about();
                break;
            case "clearHistory":
                clearHistory();
                break;
            case "customizeStartup":
                customizeStartup();
                break;
            case "deleteCommand":
                deleteCommand();
                break;
            case "removeWatchedFolders":
                removeWatchedFolders();
                break;
            case "enableFuzzyMatching":
            case "disableFuzzyMatching":
                toggleFuzzyMatching();
                break;
            case "enableDebugLogging":
            case "disableDebugLogging":
                toggleDebugLogging();
                break;
            case "hideCommand":
                hideCommand();
                break;
            case "unhideCommand":
                unhideCommand();
                break;
            case "revealLog":
                shouldWritePrefs = false;
                revealLog();
                break;
            case "revealPrefFile":
                shouldWritePrefs = false;
                revealPrefFile();
                break;
            case "builtinCommands":
                shouldWritePrefs = false;
                builtinCommands();
                break;
            case "settings":
                shouldWritePrefs = false;
                settings();
                break;
            case "addCustomCommands":
                addCustomCommands();
                break;
            case "allActions":
                shouldWritePrefs = false;
                showAllActions();
                break;
            case "allBookmarks":
                shouldWritePrefs = false;
                showAllBookmarks();
                break;
            case "allCustomCommands":
                shouldWritePrefs = false;
                showAllCustomCommands();
                break;
            case "allMenus":
                shouldWritePrefs = false;
                showAllMenus();
                break;
            case "allPickers":
                shouldWritePrefs = false;
                showAllPickers();
                break;
            case "allScripts":
                shouldWritePrefs = false;
                showAllScripts();
                break;
            case "allTools":
                shouldWritePrefs = false;
                showAllTools();
                break;
            case "allWorkflows":
                shouldWritePrefs = false;
                showAllWorkflows();
                break;
            case "buildWorkflow":
                buildWorkflow();
                break;
            case "editWorkflow":
                editWorkflow();
                break;
            case "buildPicker":
                buildPicker();
                break;
            case "editPicker":
                editPicker();
                break;
            case "documentReport":
                shouldWritePrefs = false;
                documentReport();
                break;
            case "exportVariables":
                shouldWritePrefs = false;
                exportVariables();
                break;
            case "goToArtboard":
                shouldWritePrefs = false;
                goToArtboard();
                break;
            case "goToDocument":
                shouldWritePrefs = false;
                goToOpenDocument();
                break;
            case "goToNamedObject":
                shouldWritePrefs = false;
                goToNamedObject();
                break;
            case "imageCapture":
                shouldWritePrefs = false;
                imageCapture();
                break;
            case "loadFileBookmark":
                loadFileBookmark();
                break;
            case "loadFolderBookmark":
                loadFolderBookmark();
                break;
            case "loadScript":
                loadScripts();
                break;
            case "recentCommands":
                shouldWritePrefs = false;
                recentUserCommands();
                break;
            case "recentFiles":
                shouldWritePrefs = false;
                recentFiles();
                break;
            case "redrawWindows":
                shouldWritePrefs = false;
                redrawWindows();
                break;
            case "revealActiveDocument":
                shouldWritePrefs = false;
                revealActiveDocument();
                break;
            case "watchScriptFolder":
                watchScriptFolder();
                break;
            default:
                alert(localize(strings.cd_invalid, action));
                return;
        }
        if (shouldWritePrefs) {
            userPrefs.save();
        }
    }
    function about() {
        var win = new Window("dialog");
        win.text = localize(strings.about);
        win.alignChildren = "fill";
        var pAbout = win.add("panel");
        pAbout.margins = 20;
        pAbout.alignChildren = "fill";
        pAbout.add("statictext", [0, 0, 500, 100], localize(strings.description), {
            multiline: true,
        });
        var links = pAbout.add("group");
        links.orientation = "column";
        links.alignChildren = ["center", "center"];
        links.add("statictext", undefined, localize(strings.version, _version));
        links.add("statictext", undefined, localize(strings.copyright));
        var githubText = "".concat(
            localize(strings.github),
            ": https://github.com/joshbduncan/AiCommandPalette"
        );
        var github = links.add("statictext", undefined, githubText);
        var winButtons = win.add("group");
        winButtons.orientation = "row";
        winButtons.alignChildren = ["center", "center"];
        var ok = winButtons.add("button", undefined, localize(strings.button_ok));
        ok.preferredSize.width = 100;
        github.addEventListener("mousedown", function () {
            openURL("https://github.com/joshbduncan/AiCommandPalette");
        });
        win.show();
    }
    function settings() {
        var configCommands = filterCommands(null, ["config"], true, false, [
            "config_settings",
        ]);
        var result = commandPalette(
            configCommands,
            localize(strings.cp_config),
            paletteSettings.columnSets.standard,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        processCommand(commandId);
    }
    function buildPicker(editPickerId) {
        var result = pickerBuilder(editPickerId);
        if (!result) return;
        var id;
        var picker;
        if (result.overwrite) {
            for (var i = prefs.pickers.length - 1; i >= 0; i--) {
                if (prefs.pickers[i].name === result.name) {
                    prefs.pickers[i].commands = result.commands;
                    prefs.pickers[i].multiselect = result.multiselect;
                    id = prefs.pickers[i].id;
                    picker = prefs.pickers[i];
                    break;
                }
            }
        } else {
            id = generateCommandId("picker_".concat(result.name.toLowerCase()));
            picker = {
                id: id,
                action: "picker",
                name: result.name,
                commands: result.commands,
                type: "picker",
                docRequired: false,
                selRequired: false,
                hidden: false,
                multiselect: result.multiselect,
            };
            prefs.pickers.push(picker);
            commandsData[id] = picker;
        }
        addToStartup([id]);
        return picker;
    }
    function editPicker() {
        var pickers = filterCommands(null, ["picker"], true, false);
        var result = commandPalette(
            pickers,
            localize(strings.picker_to_edit),
            paletteSettings.columnSets.standard,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        processCommand(commandId);
    }
    function clearHistory() {
        var confirmed = confirm(
            localize(strings.cd_clear_history_confirm),
            false,
            localize(strings.cd_clear_history_title)
        );
        if (confirmed) {
            userHistory.clear();
            alert(localize(strings.history_cleared));
        }
    }
    function customizeStartup() {
        var availableStartupCommands = filterCommands(
            null,
            [
                "file",
                "folder",
                "script",
                "workflow",
                "menu",
                "tool",
                "action",
                "builtin",
                "config",
            ],
            true,
            true,
            prefs.startupCommands
        );
        var result = startupBuilder(availableStartupCommands);
        if (!result) return;
        prefs.startupCommands = result;
    }
    function addCustomCommands() {
        function parseCSVLine(line) {
            var result = [];
            var current = "";
            var quoteChar = null;
            for (var i = 0; i < line.length; i++) {
                var c = line.charAt(i);
                if (c === '"' || c === "'") {
                    if (quoteChar === null) {
                        quoteChar = c;
                    } else if (quoteChar === c) {
                        quoteChar = null;
                    } else {
                        current += c;
                    }
                } else if (c === "," && quoteChar === null) {
                    result.push(current);
                    current = "";
                } else {
                    current += c;
                }
            }
            result.push(current);
            return result;
        }
        var result = addCustomCommandsDialog();
        if (!result || result == "") return;
        var newCustomCommandIds = [];
        var normalized = result.replace(/\r\n|\r/g, "\n");
        var lines = normalized.split("\n");
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var lineRaw = lines_1[_i];
            var line = lineRaw.trim();
            if (line === "") continue;
            var parts = parseCSVLine(line);
            if (parts.length < 3) continue;
            var name = parts[0],
                action = parts[1],
                rawType = parts[2];
            var type = rawType.toLowerCase();
            if (type !== "menu" && type !== "tool") continue;
            var id = generateCommandId("custom_".concat(action.toLowerCase()));
            var obj = {
                id: id,
                action: action,
                actionType: type,
                type: "custom",
                name: name,
                docRequired: false,
                selRequired: false,
                hidden: false,
            };
            newCustomCommandIds.push(id);
            prefs.customCommands.push(obj);
            commandsData[id] = obj;
        }
        addToStartup(newCustomCommandIds);
    }
    function deleteCommand() {
        var deletableCommands = filterCommands(
            null,
            ["file", "folder", "script", "workflow", "picker", "custom"],
            false,
            true
        );
        var result = commandPalette(
            deletableCommands,
            localize(strings.cd_delete_select),
            paletteSettings.columnSets.standard,
            true
        );
        if (!result || result.length === 0) return;
        var commandIds = Array.isArray(result) ? result : [result];
        var commandNames = commandIds.map(function (id) {
            return commandsData[id].name;
        });
        var confirmed = confirm(
            localize(strings.cd_delete_confirm, commandNames.join("\n")),
            false,
            localize(strings.cd_delete_confirm_title)
        );
        if (!confirmed) return;
        var typesToCheck = [
            prefs.workflows,
            prefs.bookmarks,
            prefs.scripts,
            prefs.pickers,
        ];
        for (
            var _i = 0, typesToCheck_1 = typesToCheck;
            _i < typesToCheck_1.length;
            _i++
        ) {
            var type = typesToCheck_1[_i];
            for (var i = type.length - 1; i >= 0; i--) {
                if (result.includes(type[i].id)) {
                    type.splice(i, 1);
                }
            }
        }
        for (var i = prefs.startupCommands.length - 1; i >= 0; i--) {
            if (result.includes(prefs.startupCommands[i])) {
                prefs.startupCommands.splice(i, 1);
            }
        }
    }
    function removeWatchedFolders() {
        var commands = [];
        for (var i = 0; i < prefs.watchedFolders.length; i++) {
            var folder = new Folder(prefs.watchedFolders[i]);
            var id = generateCommandId("watchedFolder_" + hashString(folder.fsName));
            var command = {
                id: id,
                name: folder.fsName,
                action: "Remove Watched Folder",
                type: "watched_folder_title_case",
                path: folder.fsName,
                docRequired: false,
                selRequired: false,
                hidden: false,
                index: i,
            };
            commandsData[id] = command;
            commands.push(id);
        }
        var result = commandPalette(
            commands,
            localize(strings.remove_watched_folders),
            paletteSettings.columnSets.standard,
            true
        );
        if (!result || result.length === 0) return;
        var commandIds = Array.isArray(result) ? result : [result];
        var folderLocations = commandIds.map(function (id) {
            return commandsData[id].path;
        });
        var confirmed = confirm(
            localize(
                strings.remove_watched_folders_confirm,
                folderLocations.join("\n")
            ),
            false,
            localize(strings.remove_watched_folders_confirm_title)
        );
        if (!confirmed) return;
        var indexesToRemove = commandIds.map(function (id) {
            return commandsData[id].index;
        });
        indexesToRemove.sort(function (a, b) {
            return b - a;
        });
        for (
            var _i = 0, indexesToRemove_1 = indexesToRemove;
            _i < indexesToRemove_1.length;
            _i++
        ) {
            var index = indexesToRemove_1[_i];
            if (index >= 0 && index < prefs.watchedFolders.length) {
                prefs.watchedFolders.splice(index, 1);
            }
        }
    }
    function toggleFuzzyMatching() {
        prefs.fuzzy = Boolean(!prefs.fuzzy);
    }
    function toggleDebugLogging() {
        $.setenv("AICP_DEBUG_LOGGING", debugLogging ? "false" : "true");
    }
    function hideCommand() {
        var hideableCommands = filterCommands(
            null,
            [
                "bookmark",
                "custom",
                "script",
                "workflow",
                "menu",
                "tool",
                "action",
                "builtin",
                "picker",
            ],
            false,
            true
        );
        var result = commandPalette(
            hideableCommands,
            localize(strings.cd_hide_select),
            paletteSettings.columnSets.standard,
            true
        );
        if (!result) return;
        var commandIds = Array.isArray(result) ? result : [result];
        prefs.hiddenCommands = prefs.hiddenCommands.concat(commandIds);
    }
    function revealLog() {
        logger.reveal();
    }
    function revealPrefFile() {
        userPrefs.reveal();
    }
    function builtinCommands() {
        var builtins = filterCommands(null, ["builtin"], true, false);
        var result = commandPalette(
            builtins,
            localize(strings.cd_all),
            paletteSettings.columnSets.standard,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        processCommand(commandId);
    }
    function unhideCommand() {
        var result = commandPalette(
            prefs.hiddenCommands,
            localize(strings.cd_reveal_menu_select),
            paletteSettings.columnSets.standard,
            true
        );
        if (!result) return;
        var ids;
        if (typeof result === "string") {
            ids = [result];
        } else {
            ids = result;
        }
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var index = prefs.hiddenCommands.indexOf(id);
            if (index !== -1) prefs.hiddenCommands.splice(index, 1);
        }
    }
    function documentReport() {
        var doc = app.activeDocument;
        var rulerUnits = doc.rulerUnits.toString().split(".").pop();
        var docUnitValue = new UnitValue(1, rulerUnits);
        var docUnitNameAbbrev = docUnitValue.type == "?" ? "pt" : docUnitValue.type;
        function formatReportTimestamp(date) {
            function pad2(value) {
                return value < 10 ? "0" + value.toString() : value.toString();
            }
            return (
                date.getFullYear().toString() +
                "/" +
                pad2(date.getMonth() + 1) +
                "/" +
                pad2(date.getDate()) +
                " " +
                pad2(date.getHours()) +
                ":" +
                pad2(date.getMinutes()) +
                ":" +
                pad2(date.getSeconds())
            );
        }
        var fileInfo = [
            localize(strings.dr_header),
            "".concat(localize(strings.dr_filename)).concat(doc.name),
            ""
                .concat(localize(strings.dr_path))
                .concat(doc.path.fsName || localize(strings.none)),
            ""
                .concat(localize(strings.dr_color_space))
                .concat(doc.documentColorSpace.toString().split(".").pop()),
            ""
                .concat(localize(strings.dr_width))
                .concat(
                    UnitValue("".concat(doc.width, " pt")).as(docUnitNameAbbrev),
                    " "
                )
                .concat(docUnitNameAbbrev),
            ""
                .concat(localize(strings.dr_height))
                .concat(
                    UnitValue("".concat(doc.height, " pt")).as(docUnitNameAbbrev),
                    " "
                )
                .concat(docUnitNameAbbrev),
        ].join("\n");
        var artboards = getCollectionObjectNames(doc.artboards);
        var documentFonts = getDocumentFonts(doc);
        var fonts = getCollectionObjectNames(documentFonts, true);
        var layers = getCollectionObjectNames(doc.layers);
        var placedFiles = getPlacedFileInfoForReport();
        var spotColors = getCollectionObjectNames(doc.spots, true);
        var reportOptions = {
            artboards: {
                str: artboards.join("\n"),
                active: true,
            },
            fonts: {
                str: fonts.join("\n"),
                active: true,
            },
            layers: {
                str: layers.join("\n"),
                active: true,
            },
            placed_items: {
                str: getPlacedFileInfoForReport().join("\n"),
                active: true,
            },
            spot_colors: {
                str: spotColors.join("\n"),
                active: true,
            },
        };
        function buildReport() {
            var info = ""
                .concat(localize(strings.dr_info_string), "\n\n")
                .concat(fileInfo);
            for (var key in reportOptions) {
                var option = reportOptions[key];
                if (option.active && option.str) {
                    info += "\n\n"
                        .concat(localize(strings[key.toLowerCase()]), "\n-----\n")
                        .concat(option.str);
                }
            }
            return ""
                .concat(info, "\n\n")
                .concat(localize(strings.dr_file_created))
                .concat(formatReportTimestamp(new Date()));
        }
        var win = new Window("dialog");
        win.text = localize(strings.document_report);
        win.orientation = "column";
        win.alignChildren = ["center", "top"];
        win.alignChildren = "fill";
        if (!doc.saved) {
            var warning = win.add(
                "statictext",
                undefined,
                localize(strings.document_report_warning)
            );
            warning.justify = "center";
            warning.graphics.foregroundColor = warning.graphics.newPen(
                win.graphics.PenType.SOLID_COLOR,
                [1, 0, 0],
                1
            );
        }
        var pOptions = win.add("panel", undefined, localize(strings.dr_include));
        pOptions.orientation = "row";
        pOptions.margins = 20;
        var _loop_3 = function (key) {
            var option = reportOptions[key];
            var cb = pOptions.add(
                "checkbox",
                undefined,
                localize(strings[key.toLowerCase()])
            );
            cb.value = !!option.str;
            cb.enabled = !!option.str;
            cb.onClick = function () {
                option.active = this.value;
                info.text = buildReport();
            };
        };
        for (var key in reportOptions) {
            _loop_3(key);
        }
        var info = win.add("edittext", [0, 0, 400, 400], buildReport(), {
            multiline: true,
            scrollable: true,
            readonly: true,
        });
        var winButtons = win.add("group");
        winButtons.orientation = "row";
        winButtons.alignChildren = ["center", "center"];
        var saveInfo = winButtons.add("button", undefined, localize(strings.save));
        saveInfo.preferredSize.width = 100;
        var close = winButtons.add("button", undefined, localize(strings.close), {
            name: "ok",
        });
        close.preferredSize.width = 100;
        saveInfo.onClick = function () {
            var f = File.saveDialog(localize(strings.save_active_document_report));
            if (f) {
                try {
                    f.encoding = "UTF-8";
                    f.open("w");
                    f.write(info.text);
                } catch (e) {
                    logger.log("Error writing document report file:", e.message);
                    alert(localize(strings.fl_error_writing, f));
                } finally {
                    f.close();
                }
                if (f.exists) alert(localize(strings.file_saved, f.fsName));
            }
        };
        win.show();
    }
    function showAllActions() {
        var _a;
        var actionCommands = filterCommands(null, ["action"], true, false);
        var columns =
            ((_a = {}),
            (_a[localize(strings.name_title_case)] = {
                width: 100,
                key: "name",
            }),
            (_a[localize(strings.set_title_case)] = {
                width: 100,
                key: "set",
            }),
            _a);
        var result = commandPalette(
            actionCommands,
            localize(strings.Actions),
            columns,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        processCommand(commandId);
    }
    function showAllBookmarks() {
        var _a;
        var bookmarkCommands = filterCommands(null, ["file", "folder"], true, true);
        var columns =
            ((_a = {}),
            (_a[localize(strings.name_title_case)] = {
                width: 100,
                key: "name",
            }),
            (_a[localize(strings.type_title_case)] = {
                width: 100,
                key: "type",
            }),
            (_a[localize(strings.path_title_case)] = {
                width: 100,
                key: "path",
            }),
            _a);
        var result = commandPalette(
            bookmarkCommands,
            localize(strings.Bookmarks),
            columns,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        processCommand(commandId);
    }
    function showAllCustomCommands() {
        var customCommands = filterCommands(null, ["custom"], true, false);
        var result = commandPalette(
            customCommands,
            localize(strings.custom_commands_all),
            paletteSettings.columnSets.customCommand,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        processCommand(commandId);
    }
    function showAllMenus() {
        var menus = filterCommands(null, ["menu"], true, false);
        var result = commandPalette(
            menus,
            localize(strings.menu_commands),
            paletteSettings.columnSets.standard,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        processCommand(commandId);
    }
    function showAllPickers() {
        var pickers = filterCommands(null, ["picker"], true, false);
        var result = commandPalette(
            pickers,
            localize(strings.pickers_all),
            paletteSettings.columnSets.standard,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        processCommand(commandId);
    }
    function showAllScripts() {
        var _a;
        var scripts = filterCommands(null, ["script"], true, false);
        var columns =
            ((_a = {}),
            (_a[localize(strings.name_title_case)] = { width: 100, key: "name" }),
            (_a[localize(strings.type_title_case)] = { width: 100, key: "type" }),
            (_a[localize(strings.path_title_case)] = { width: 100, key: "path" }),
            _a);
        var result = commandPalette(scripts, localize(strings.Scripts), columns, false);
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        processCommand(commandId);
    }
    function showAllTools() {
        var tools = filterCommands(null, ["tool"], true, false);
        var result = commandPalette(
            tools,
            localize(strings.tl_all),
            paletteSettings.columnSets.standard,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        processCommand(commandId);
    }
    function showAllWorkflows() {
        var workflows = filterCommands(null, ["workflow"], true, false);
        var result = commandPalette(
            workflows,
            localize(strings.Workflows),
            paletteSettings.columnSets.standard,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        processCommand(commandId);
    }
    function buildWorkflow(editWorkflowId) {
        var commandsToHide = [
            "builtin_editPicker",
            "builtin_buildWorkflow",
            "builtin_editWorkflow",
        ];
        if (editWorkflowId) commandsToHide.push(editWorkflowId);
        var availableWorkflowCommands = filterCommands(
            null,
            [
                "file",
                "folder",
                "script",
                "watchedScript",
                "workflow",
                "menu",
                "tool",
                "action",
                "builtin",
                "picker",
            ],
            true,
            true,
            commandsToHide
        );
        var result = workflowBuilder(availableWorkflowCommands, editWorkflowId);
        if (!result) return;
        var id;
        if (result.overwrite) {
            for (var i = prefs.workflows.length - 1; i >= 0; i--) {
                if (prefs.workflows[i].name === result.name) {
                    prefs.workflows[i].actions = result.actions;
                    id = prefs.workflows[i].id;
                    break;
                }
            }
        } else {
            id = generateCommandId("workflow_" + result.name.toLowerCase());
            var workflow = {
                id: id,
                action: "workflow",
                name: result.name,
                actions: result.actions,
                type: "workflow",
                docRequired: false,
                selRequired: false,
                hidden: false,
            };
            prefs.workflows.push(workflow);
        }
        addToStartup([id]);
    }
    function editWorkflow() {
        var workflows = filterCommands(null, ["workflow"], true, false);
        var result = commandPalette(
            workflows,
            localize(strings.wf_choose),
            paletteSettings.columnSets.standard,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        buildWorkflow(commandId);
    }
    function imageCapture() {
        if (app.documents.length === 0) {
            alert(localize(strings.no_active_document));
            return;
        }
        var file = File.saveDialog();
        if (!file) return;
        try {
            app.activeDocument.imageCapture(file);
        } catch (e) {
            logger.log("Error capturing document image:", e.message);
            alert(localize(strings.fl_error_writing, file));
            return;
        }
        if (!file.name.toLowerCase().endsWith(".png")) {
            file.rename("".concat(file.name, ".png"));
        }
        if (file.exists) {
            alert(localize(strings.file_saved, file.fsName));
        }
    }
    function exportVariables() {
        var doc = app.activeDocument;
        if (doc.variables.length === 0) {
            alert(localize(strings.no_document_variables));
            return;
        }
        var file = File.saveDialog();
        if (!file) return;
        try {
            doc.exportVariables(file);
        } catch (e) {
            logger.log("Error exporting variables:", e.message);
            alert(localize(strings.fl_error_writing, file));
            return;
        }
        if (file.exists) {
            alert(localize(strings.file_saved, file.fsName));
        }
    }
    function loadActiveDocumentArtboards() {
        var artboardIds = [];
        var artboards = app.activeDocument.artboards;
        for (var i = 0; i < artboards.length; i++) {
            var artboard = artboards[i];
            var id = generateCommandId("artboard_".concat(i));
            var command = {
                id: id,
                name: artboard.name,
                action: "artboard",
                type: "artboard",
                idx: (i + 1).toString(),
                docRequired: false,
                selRequired: false,
                hidden: false,
            };
            commandsData[id] = command;
            artboardIds.push(id);
        }
        return artboardIds;
    }
    function goToArtboard() {
        var _a;
        var artboards = loadActiveDocumentArtboards();
        var columns =
            ((_a = {
                Index: {
                    width: 35,
                    key: "idx",
                    hideTitle: true,
                },
            }),
            (_a[localize(strings.name_title_case)] = {
                width: 100,
                key: "name",
            }),
            _a);
        var result = commandPalette(
            artboards,
            localize(strings.go_to_artboard),
            columns,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        var command = commandsData[commandId];
        if (!command.idx) {
            logger.log("idx not found for command:", commandId);
            return;
        }
        var idx = Number(command.idx) - 1;
        app.activeDocument.artboards.setActiveArtboardIndex(idx);
        app.executeMenuCommand("fitin");
    }
    function loadActiveDocumentPageItems() {
        var pageItems = [];
        for (var i = 0; i < app.activeDocument.pageItems.length; i++) {
            var cur = app.activeDocument.pageItems[i];
            if (!cur.name || cur.name.length === 0) continue;
            var id = generateCommandId("pageItem_".concat(i));
            var obj = {
                id: id,
                name: cur.name,
                action: "pageItem",
                type: cur.typename,
                pageItem: cur,
                layer: cur.layer.name,
                docRequired: false,
                selRequired: false,
                hidden: false,
            };
            pageItems.push(id);
            commandsData[id] = obj;
        }
        return pageItems;
    }
    function goToNamedObject() {
        var _a;
        var doc = app.activeDocument;
        if (doc.pageItems.length > namedObjectLimit) {
            alert(localize(strings.go_to_named_object_limit, doc.pageItems.length));
        }
        var pageItems = loadActiveDocumentPageItems();
        if (pageItems.length === 0) {
            alert(localize(strings.go_to_named_object_no_objects));
            return;
        }
        var columns =
            ((_a = {}),
            (_a[localize(strings.name_title_case)] = {
                width: 100,
                key: "name",
            }),
            (_a[localize(strings.type_title_case)] = {
                width: 100,
                key: "type",
            }),
            (_a[localize(strings.layer_title_case)] = {
                width: 100,
                key: "layer",
            }),
            _a);
        var result = commandPalette(
            pageItems,
            localize(strings.go_to_named_object),
            columns,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        var command = commandsData[commandId];
        var pageItem = command.pageItem;
        if (!pageItem) {
            logger.log("pageItem not found for command:", commandId);
            alert(localize(strings.go_to_named_object_no_objects));
            return;
        }
        doc.selection = null;
        pageItem.selected = true;
        doc.views[0].zoom = 1;
        zoomIntoPageItem(pageItem);
    }
    function loadOpenDocuments() {
        var _a, _b;
        var openDocuments = [];
        for (var i = 0; i < app.documents.length; i++) {
            var cur = app.documents[i];
            var id = generateCommandId("document_".concat(cur.name.toLowerCase()));
            var obj = {
                id: id,
                name: cur.name,
                action: "document",
                type: "document",
                document: cur,
                rulerUnits:
                    (_a = cur.rulerUnits.toString().split(".").pop()) !== null &&
                    _a !== void 0
                        ? _a
                        : "",
                colorSpace:
                    (_b = cur.documentColorSpace.toString().split(".").pop()) !==
                        null && _b !== void 0
                        ? _b
                        : "",
                path: cur.path.toString(),
                docRequired: false,
                selRequired: false,
                hidden: false,
            };
            openDocuments.push(id);
            commandsData[id] = obj;
        }
        return openDocuments;
    }
    function goToOpenDocument() {
        var _a;
        var openDocuments = loadOpenDocuments();
        var columns =
            ((_a = {}),
            (_a[localize(strings.name_title_case)] = {
                width: 100,
                key: "name",
            }),
            (_a[localize(strings.color_space_title_case)] = {
                width: 100,
                key: "colorSpace",
            }),
            (_a[localize(strings.ruler_units_title_case)] = {
                width: 100,
                key: "rulerUnits",
            }),
            (_a[localize(strings.path_title_case)] = {
                width: 100,
                key: "path",
            }),
            _a);
        var result = commandPalette(
            openDocuments,
            localize(strings.go_to_open_document),
            columns,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        var entry = commandsData[commandId];
        entry.document.activate();
    }
    function loadFileBookmark() {
        var acceptedTypes = [
            ".ai",
            ".ait",
            ".pdf",
            ".dxf",
            ".avif",
            ".BMP",
            ".RLE",
            ".DIB",
            ".cgm",
            ".cdr",
            ".eps",
            ".epsf",
            ".ps",
            ".emf",
            ".gif",
            ".heic",
            ".heif",
            ".jpg",
            ".jpe",
            ".jpeg",
            ".jpf",
            ".jpx",
            ".jp2",
            ".j2k",
            ".j2c",
            ".jpc",
            ".rtf",
            ".doc",
            ".docx",
            ".PCX",
            ".psd",
            ".psb",
            ".pdd",
            ".PXR",
            ".png",
            ".pns",
            ".svg",
            ".svgz",
            ".TGA",
            ".VDA",
            ".ICB",
            ".VST",
            ".txt",
            ".tif",
            ".tiff",
            ".webp",
            ".wmf",
        ];
        var re = new RegExp("".concat(acceptedTypes.join("|"), "$"), "i");
        var files = loadFileTypes(
            localize(strings.bm_load_bookmark),
            true,
            re.toString()
        );
        if (files.length === 0) return;
        var currentFileBookmarkPaths = prefs.bookmarks
            .filter(function (b) {
                return b.type === "file";
            })
            .map(function (b) {
                return b.path;
            });
        var newBookmarks = [];
        var newBookmarkIds = [];
        for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
            var f = files_2[_i];
            if (currentFileBookmarkPaths.includes(f.fsName)) continue;
            var bookmarkName = decodeURI(f.name);
            var id = generateCommandId("bookmark_".concat(bookmarkName.toLowerCase()));
            var bookmark = {
                id: id,
                name: bookmarkName,
                action: "bookmark",
                type: "file",
                path: f.fsName,
                docRequired: false,
                selRequired: false,
                hidden: false,
            };
            newBookmarks.push(bookmark);
            newBookmarkIds.push(id);
        }
        if (newBookmarks.length === 0) return;
        prefs.bookmarks = __spreadArray(
            __spreadArray([], prefs.bookmarks, true),
            newBookmarks,
            true
        );
        addToStartup(newBookmarkIds);
    }
    function loadFolderBookmark() {
        var folder = Folder.selectDialog(localize(strings.bm_load_bookmark));
        if (!folder) return;
        var currentFolderBookmarks = prefs.bookmarks
            .filter(function (b) {
                return b.type === "folder";
            })
            .map(function (b) {
                return b.path;
            });
        if (currentFolderBookmarks.includes(folder.fsName)) {
            alert(localize(strings.bm_already_loaded));
            return;
        }
        var bookmarkName = decodeURI(folder.name);
        var bookmark = {
            id: "bookmark_".concat(bookmarkName.toLowerCase().replace(/ /g, "_")),
            name: bookmarkName,
            action: "bookmark",
            type: "folder",
            path: folder.fsName,
            docRequired: false,
            selRequired: false,
            hidden: false,
        };
        prefs.bookmarks.push(bookmark);
        addToStartup([bookmark.id]);
    }
    function watchScriptFolder() {
        var folder = Folder.selectDialog(localize(strings.watched_folder_select));
        if (!folder) return;
        if (prefs.watchedFolders.includes(folder.fsName)) {
            logger.log("watched folder already in prefs: ".concat(folder.fsName));
            alert(localize(strings.folder_already_watched, decodeURI(folder.name)));
            return;
        }
        prefs.watchedFolders.push(folder.fsName);
    }
    function loadScripts() {
        var acceptedTypes = [".jsx", ".js"];
        var re = new RegExp("".concat(acceptedTypes.join("|"), "$"), "i");
        var files = loadFileTypes(
            localize(strings.sc_load_script),
            true,
            re.toString()
        );
        if (files.length === 0) return;
        var currentScripts = prefs.scripts.map(function (s) {
            return s.path;
        });
        var scripts = [];
        var newScriptIDs = [];
        for (var _i = 0, files_3 = files; _i < files_3.length; _i++) {
            var f = files_3[_i];
            if (currentScripts.includes(f.fsName)) continue;
            var scriptParent = decodeURI(f.parent.name);
            var scriptName = decodeURI(f.name);
            var id = generateCommandId("script_".concat(scriptName.toLowerCase()));
            var script = {
                id: id,
                name: "".concat(scriptParent, " > ").concat(scriptName),
                action: "script",
                type: "script",
                path: f.fsName,
                docRequired: false,
                selRequired: false,
                hidden: false,
            };
            scripts.push(script);
            newScriptIDs.push(id);
        }
        if (scripts.length === 0) return;
        prefs.scripts = prefs.scripts.concat(scripts);
        addToStartup(newScriptIDs);
    }
    function recentUserCommands() {
        var result = commandPalette(
            mostRecentCommands,
            localize(strings.recent_commands),
            paletteSettings.columnSets.standard,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        processCommand(commandId);
    }
    function loadRecentFiles() {
        var recentFiles = [];
        var fileCount = app.preferences.getIntegerPreference("RecentFileNumber");
        for (var i = 0; i < fileCount; i++) {
            var path = app.preferences.getStringPreference(
                "plugin/MixedFileList/file".concat(i, "/path")
            );
            var cur = new File(path);
            if (!cur.exists) continue;
            var id = generateCommandId("recentFile_".concat(i));
            var obj = {
                id: id,
                name: decodeURI(cur.name),
                action: "document",
                type: "document",
                document: cur,
                path: cur.fsName,
                docRequired: false,
                selRequired: false,
                hidden: false,
            };
            recentFiles.push(id);
            commandsData[id] = obj;
        }
        return recentFiles;
    }
    function recentFiles() {
        var _a;
        var arr = loadRecentFiles();
        var columns =
            ((_a = {}),
            (_a[localize(strings.name_title_case)] = {
                width: 100,
                key: "name",
            }),
            (_a[localize(strings.path_title_case)] = {
                width: 100,
                key: "path",
            }),
            _a);
        var result = commandPalette(
            arr,
            localize(strings.open_recent_file),
            columns,
            false
        );
        if (!result) return;
        var commandId = Array.isArray(result) ? result[0] : result;
        var documentFile = commandsData[commandId].document;
        if (!documentFile) {
            logger.log("document not found for command:", commandId);
            alert(localize(strings.fl_error_loading, result));
            return;
        }
        try {
            app.open(documentFile);
        } catch (e) {
            logger.log("Error opening recent file:", documentFile.fsName, e.message);
            alert(localize(strings.fl_error_loading, result));
        }
    }
    function redrawWindows() {
        app.redraw();
    }
    function revealActiveDocument() {
        var _a;
        if (app.documents.length === 0) {
            alert(localize(strings.no_active_document));
            return;
        }
        var path =
            (_a = app.activeDocument.path) === null || _a === void 0
                ? void 0
                : _a.fsName;
        if (path) {
            var folder = new Folder(path);
            folder.execute();
        } else {
            alert(localize(strings.active_document_not_saved));
        }
    }
    function checkWorkflowActions(actions) {
        var badActions = [];
        for (var i = 0; i < actions.length; i++) {
            var commandId = actions[i];
            if (
                !commandsData.hasOwnProperty(commandId) ||
                !commandVersionCheck(commandsData[commandId])
            ) {
                badActions.push(commandId);
            }
        }
        return badActions;
    }
    logger.log("**SCRIPT LAUNCH**", _title, "v" + _version, $.fileName);
    userPrefs.load(true);
    userActions.load();
    userHistory.load();
    userPrefs.loadWatchedScripts();
    if (versionUpdate0_16_0) {
        userPrefs.update("0.16.0");
        userHistory.update("0.16.0");
    }
    devMode && devInfo.save();
    var matcher = prefs["fuzzy"] ? fuzzy : scoreMatches;
    logger.log("fuzzy matcher ".concat(prefs["fuzzy"] ? "enabled" : "disabled"));
    if (!prefs.startupCommands) {
        prefs.startupCommands = ["builtin_recentCommands", "config_settings"];
    }
    var queryableCommands = filterCommands(null, null, false, false);
    var startupCommands = filterCommands(prefs.startupCommands, null, false, false);
    var result = commandPalette(
        queryableCommands,
        localize(strings.title),
        paletteSettings.columnSets.standard,
        false,
        startupCommands,
        true,
        true
    );
    if (result) {
        var commandId = Array.isArray(result) ? result[0] : result;
        processCommand(commandId);
    }
})();
