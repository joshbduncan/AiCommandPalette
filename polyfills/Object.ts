interface Object {
	keys (inObj: Record<string, unknown>): string[];
	create (inObj: Record<string, unknown>): Record<string, unknown>;
	toArray (inObj: Record<string, unknown>): Record<string, unknown>[];
	hasKeys (inObj: Record<string, unknown>): boolean;
	assign <T, U> (target: T, source: U): U;
	assign (target: Record<string, unknown>, source: Record<string, unknown>): object;
}

interface ObjectConstructor {
	toArray<T>(inObj: Record<string, T>): Array<T>;
}

interface Object {
	toSource(): string;
}

if (!Object.keys) {
	Object.keys = (function () {
		let hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({ toString : null }).propertyIsEnumerable('toString'),
			dontEnums = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			],
			dontEnumsLength = dontEnums.length;
		return function (obj: Record<string, unknown>) {
			const wasNull = obj === null;
			const errorMessageTypeReadout = (wasNull)? "input was null" : `input was ${typeof obj}`;
			if (typeof obj !== 'object' && typeof obj !== 'function' || wasNull) throw new TypeError(`Object.keys called on non-object (${errorMessageTypeReadout}).`);
			const result = [];
			for (let prop in obj) {
				if (hasOwnProperty.call(obj, prop)) result.push(prop);
			}
			if (hasDontEnumBug) {
				for (let i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
				}
			}
			return result;
		}
	})()
}

if (typeof Object.create != 'function') {
	Object.create = (function () {
		const Temp = function () {};
		return function (prototype) {
			if (arguments.length > 1) {
				throw Error('Second argument not supported');
			}
			if(prototype !== Object(prototype) && prototype !== null) {
				throw new TypeError('Argument must be an object or null');
			}
			if (prototype === null) { 
				throw Error('null [[Prototype]] not supported');
			}
			Temp.prototype = prototype;
			const result = new Temp();
			Temp.prototype = null;
			return result;
		};
	})();
}

if (!Object.entries)
  Object.entries = function (obj) {
    let ownProps = Object.keys(obj),
			i = ownProps.length,
			resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
	return resArray;
}

if (typeof Object.toArray != 'function') {
	Object.toArray = (function () {
		return function (obj) {
			return Object.keys(obj).map(function (m) {
				return obj[m];
			});
		};
	})();
}

if (typeof Object.hasKeys != 'function') {
	Object.hasKeys = (function () {
		return function (obj) {
			if (obj == null) {
				return false;
			}
			return Object.keys(obj).length > 0;
		};
	})();
}

if (!('assign' in Object)) {
	///@ts-ignore
  Object.assign = function (has) {
    'use strict';
    return assign;
    function assign (target, source) {
      for (let i = 1; i < arguments.length; i++) {
        copy(target, arguments[i]);
      }
      return target;
    }
    function copy (target, source) {
      for (let key in source) {
        if (has.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
  }({}.hasOwnProperty);
}

function clone (obj: Record<string, unknown> | any): Record<string, unknown> | any {
	let copy;
	// Handle the 3 simple types, and null or undefined
	if (null == obj || "object" != typeof obj) return obj;
	// Handle Date
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}
	// Handle Array
	if (obj instanceof Array) {
		copy = [];
		for (let i = 0, len = obj.length; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}
	// Handle Object
	if (obj instanceof Object) {
		copy = {};
		for (let attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr] as any);
		}
		return copy;
	}
	throw new Error("Unable to copy obj! Its type isn't supported.");
}

/**
 * Transfers properties from one object to another for those properties which are mutually inclusive.
 * @param srcObj - Object which will be scanned for property keys and values.
 * @param destObj - Object which will receive source object's values for properties which are also found inside it.
 * @returns True if changes were made (or values are not primitive), or false if all values are primitive
 * and satisfy a comparison of equality in values of the property inside both source & target objects.
 */
function copyObjectPropertyValues (srcObj: Record<string, unknown>, destObj: Record<string, unknown>): boolean {
	let primitivesAndEqual = true;
	let srcProp, destProp
	for (let all in srcObj) {
		if (all in destObj) {
			srcProp = srcObj[all];
			destProp = destObj[all];
			if (srcProp !== destProp) {
				primitivesAndEqual = false;
			}
			destObj[all] = srcObj[all];
		}
	}
	return !primitivesAndEqual;
}

/**
 * Checks all properties of a source object against a target object and verifies if all source properties are included in the target.
 * @param srcObj - Object which will be scanned for property keys.
 * @param destObj - Object which will be checked to see if properties of the source object are found inside it.
 * @returns True if all source properties are included in the target object.
 */
function checkAllPropertyInclusion (srcObj: Record<string, unknown>, destObj: Record<string, unknown>): boolean {
	if (typeof(srcObj) != "object" || typeof(destObj) != "object") {
		return false;
	}
	for (let all in srcObj) {
		if (!(all in destObj)) {
			return false;
		}
	}
	return true;
}