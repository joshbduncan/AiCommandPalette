// Array.prototype.indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (
    searchElement: string | number | boolean,
    fromIndex: number
  ): number {
    let k;
    if (this == null) throw new TypeError('"this" is null or not defined');
    let o = Object(this);
    let len = o.length >>> 0;
    if (len === 0) return -1;
    let n = +fromIndex || 0;
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

// Array.prototype.every
if (!Array.prototype.every) {
  Array.prototype.every = function (callbackfn, thisArg) {
    "use strict";
    let T, k;
    if (this == null) throw new TypeError("this is null or not defined");
    let O = Object(this);
    let len = O.length >>> 0;
    if (typeof callbackfn !== "function") throw new TypeError();
    if (arguments.length > 1) T = thisArg;
    k = 0;
    while (k < len) {
      if (k in O) {
        const kValue = O[k];
        const testResult = T
          ? callbackfn.call(T, kValue, k, O)
          : callbackfn(kValue, k, O);
        if (!testResult) return false;
      }
      k++;
    }
    return true;
  };
}

// Array.prototype.map
if (!Array.prototype.map) {
  Array.prototype.map = function (callback, thisArg) {
    let T, A, k;
    if (this == null) throw new TypeError("this is null or not defined");
    const O = Object(this);
    const len = O.length >>> 0;
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

// Array.prototype.filter
if (!Array.prototype.filter) {
  Array.prototype.filter = function (func, thisArg) {
    "use strict";
    if (!(typeof func === "function" && this)) throw new TypeError();
    const len = this.length >>> 0;
    const res = [];
    const t = this;
    let c = 0;
    for (let i = 0; i < len; i++) {
      if (i in t) {
        const val = t[i];
        if (func.call(thisArg, val, i, t)) {
          res[c++] = val;
        }
      }
    }
    return res;
  };
}

// Array.prototype.findIndex
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function (callback, thisArg) {
    if (this === null) throw new TypeError("called on null or undefined");
    if (typeof callback !== "function")
      throw new TypeError("callback must be a function");
    const list = Object(this);
    const length = list.length >>> 0;
    for (let i = 0; i < length; i++) {
      if (callback.call(thisArg, list[i], i, list)) return i;
    }
    return -1;
  };
}

// Array.prototype.find
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate, thisArg) {
    if (this == null) throw new TypeError('"this" is null or not defined');
    const o = Object(this);
    const len = o.length >>> 0;
    if (typeof predicate !== "function")
      throw new TypeError("predicate must be a function");
    for (let k = 0; k < len; k++) {
      const value = o[k];
      if (predicate.call(thisArg, value, k, o)) return value;
    }
    return undefined;
  };
}

// Array.prototype.includes
if (!Array.prototype.includes) {
  Array.prototype.includes = function (search) {
    return this.indexOf(search) !== -1;
  };
}

// Array.prototype.last
if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this.length > 0 ? this[this.length - 1] : null;
  };
}

// Array.prototype.forEach
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback, thisArg) {
    if (this == null) throw new TypeError("this is null or not defined");
    const O = Object(this);
    const len = O.length >>> 0;
    if (typeof callback !== "function")
      throw new TypeError(callback + " is not a function");
    for (let k = 0; k < len; k++) {
      if (k in O) callback.call(thisArg, O[k], k, O);
    }
  };
}

// Array.from
if (!Array.from) {
  Array.from = function (arrayLikeObject) {
    const arr = [];
    for (let i = 0; i < arrayLikeObject.length; i++) {
      arr.push(arrayLikeObject[i]);
    }
    return arr;
  };
}

// Array.prototype.some
if (!Array.prototype.some) {
  Array.prototype.some = function (fun, thisArg) {
    if (this == null)
      throw new TypeError("Array.prototype.some called on null or undefined");
    if (typeof fun !== "function") throw new TypeError();
    const t = Object(this);
    const len = t.length >>> 0;
    for (let i = 0; i < len; i++) {
      if (i in t && fun.call(thisArg, t[i], i, t)) return true;
    }
    return false;
  };
}

// Array.prototype.reduce
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (callback, initialValue) {
    if (this === null) throw new TypeError("called on null or undefined");
    if (typeof callback !== "function")
      throw new TypeError(callback + " is not a function");
    const o = Object(this);
    const len = o.length >>> 0;
    let k = 0;
    let value = arguments.length >= 2 ? initialValue : undefined;
    if (value === undefined) {
      while (k < len && !(k in o)) k++;
      if (k >= len) throw new TypeError("Reduce of empty array with no initial value");
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

// Array.prototype.addUnique
if (!Array.prototype.addUnique) {
  Array.prototype.addUnique = function (searchElement) {
    if (this.indexOf(searchElement) < 0) {
      this.push(searchElement);
      return true;
    }
    return false;
  };
}

// Array.prototype.removeUnique
if (!Array.prototype.removeUnique) {
  Array.prototype.removeUnique = function (searchElement) {
    const idx = this.indexOf(searchElement);
    if (idx > -1) {
      this.splice(idx, 1);
      return true;
    }
    return false;
  };
}

// Array.prototype.removeAtIndex
if (!Array.prototype.removeAtIndex) {
  Array.prototype.removeAtIndex = function (idx) {
    if (idx > -1) {
      this.splice(idx, 1);
      return true;
    }
    return false;
  };
}

// Array.prototype.makeUnique
if (!Array.prototype.makeUnique) {
  Array.prototype.makeUnique = function () {
    return this.sort().filter(function (current, index, array) {
      return index === 0 || current !== array[index - 1];
    });
  };
}
