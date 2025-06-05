String.prototype.trim = function () {
  return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
};

String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
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

String.prototype.zeroPad = function (num: number) {
  let str = this;
  for (let i = 0; i < num; i++) {
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
  let number = this;
  var string = "";
  number = number.slice(2);
  var length = number.length;
  for (var i = 0; i < length; ) {
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
