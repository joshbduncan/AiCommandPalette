// @ts-nocheck

if (!Object.keys) {
    Object.keys = (function () {
        const hasOwnProperty = Object.prototype.hasOwnProperty;
        const hasDontEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
        const dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor",
        ];
        const dontEnumsLength = dontEnums.length;

        return function (obj: Record<string, unknown>) {
            const wasNull = obj === null;
            const typeDesc = wasNull ? "input was null" : `input was ${typeof obj}`;
            if ((typeof obj !== "object" && typeof obj !== "function") || wasNull)
                throw new TypeError(`Object.keys called on non-object (${typeDesc}).`);

            const result: string[] = [];
            for (let prop in obj) {
                if (hasOwnProperty.call(obj, prop)) result.push(prop);
            }
            if (hasDontEnumBug) {
                for (let i = 0; i < dontEnumsLength; i++) {
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
        const Temp: any = function () {};
        return function (prototype: object | null): object {
            if (arguments.length > 1) throw Error("Second argument not supported");
            if (prototype !== Object(prototype) && prototype !== null)
                throw new TypeError("Argument must be an object or null");
            if (prototype === null) throw Error("null [[Prototype]] not supported");

            Temp.prototype = prototype;
            const result = new Temp();
            Temp.prototype = null;
            return result;
        };
    })();
}

if (!Object.entries) {
    Object.entries = function (obj: any) {
        const ownProps = Object.keys(obj);
        const resArray = new Array(ownProps.length);
        for (let i = ownProps.length; i--; ) {
            resArray[i] = [ownProps[i], obj[ownProps[i]]];
        }
        return resArray;
    };
}

if (typeof Object.toArray !== "function") {
    Object.toArray = function (obj: any): any[] {
        return Object.keys(obj).map(function (key) {
            return obj[key];
        });
    };
}

if (typeof Object.hasKeys !== "function") {
    Object.hasKeys = function (obj: any): boolean {
        if (obj == null) return false;
        return Object.keys(obj).length > 0;
    };
}

if (!("assign" in Object)) {
    ///@ts-ignore
    Object.assign = (function (has) {
        "use strict";
        return function assign(target: any, ...sources: any[]): any {
            for (let i = 0; i < sources.length; i++) {
                const source = sources[i];
                for (let key in source) {
                    if (has.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    })({}.hasOwnProperty);
}

function clone(obj: any): any {
    if (obj == null || typeof obj !== "object") return obj;
    if (obj instanceof Date) {
        const copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (Array.isArray(obj)) {
        return obj.map(clone);
    }
    if (typeof obj === "object") {
        const copy: any = {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function copyObjectPropertyValues(
    srcObj: Record<string, unknown>,
    destObj: Record<string, unknown>
): boolean {
    let primitivesAndEqual = true;
    for (let key in srcObj) {
        if (key in destObj) {
            const srcProp = srcObj[key];
            const destProp = destObj[key];
            if (srcProp !== destProp) primitivesAndEqual = false;
            destObj[key] = srcProp;
        }
    }
    return !primitivesAndEqual;
}

function checkAllPropertyInclusion(
    srcObj: Record<string, unknown>,
    destObj: Record<string, unknown>
): boolean {
    if (typeof srcObj !== "object" || typeof destObj !== "object") return false;
    for (let key in srcObj) {
        if (!(key in destObj)) return false;
    }
    return true;
}
