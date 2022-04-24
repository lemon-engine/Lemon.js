'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global$1 =
  // eslint-disable-next-line es-x/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

var functionBindNative = !fails(function () {
  // eslint-disable-next-line es-x/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

var FunctionPrototype$2 = Function.prototype;
var apply = FunctionPrototype$2.apply;
var call$2 = FunctionPrototype$2.call;

// eslint-disable-next-line es-x/no-reflect -- safe
var functionApply = typeof Reflect == 'object' && Reflect.apply || (functionBindNative ? call$2.bind(apply) : function () {
  return call$2.apply(apply, arguments);
});

var FunctionPrototype$1 = Function.prototype;
var bind$1 = FunctionPrototype$1.bind;
var call$1 = FunctionPrototype$1.call;
var uncurryThis = functionBindNative && bind$1.bind(call$1, call$1);

var functionUncurryThis = functionBindNative ? function (fn) {
  return fn && uncurryThis(fn);
} : function (fn) {
  return fn && function () {
    return call$1.apply(fn, arguments);
  };
};

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
var isCallable = function (argument) {
  return typeof argument == 'function';
};

// Detect IE8's incomplete defineProperty implementation
var descriptors = !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var call = Function.prototype.call;

var functionCall = functionBindNative ? call.bind(call) : function () {
  return call.apply(call, arguments);
};

var $propertyIsEnumerable$1 = {}.propertyIsEnumerable;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable$1.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
var f$7 = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor$1(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable$1;

var objectPropertyIsEnumerable = {
	f: f$7
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var toString$2 = functionUncurryThis({}.toString);
var stringSlice$1 = functionUncurryThis(''.slice);

var classofRaw = function (it) {
  return stringSlice$1(toString$2(it), 8, -1);
};

var Object$5 = global$1.Object;
var split = functionUncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object$5('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split(it, '') : Object$5(it);
} : Object$5;

var TypeError$b = global$1.TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError$b("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings



var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

var isObject = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};

var path = {};

var aFunction = function (variable) {
  return isCallable(variable) ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global$1[namespace])
    : path[namespace] && path[namespace][method] || global$1[namespace] && global$1[namespace][method];
};

var objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);

var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

var process = global$1.process;
var Deno = global$1.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && engineUserAgent) {
  match = engineUserAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = engineUserAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

var engineV8Version = version;

/* eslint-disable es-x/no-symbol -- required for testing */

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- required for testing
var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && engineV8Version && engineV8Version < 41;
});

/* eslint-disable es-x/no-symbol -- required for testing */

var useSymbolAsUid = nativeSymbol
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

var Object$4 = global$1.Object;

var isSymbol = useSymbolAsUid ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && objectIsPrototypeOf($Symbol.prototype, Object$4(it));
};

var String$4 = global$1.String;

var tryToString = function (argument) {
  try {
    return String$4(argument);
  } catch (error) {
    return 'Object';
  }
};

var TypeError$a = global$1.TypeError;

// `Assert: IsCallable(argument) is true`
var aCallable = function (argument) {
  if (isCallable(argument)) return argument;
  throw TypeError$a(tryToString(argument) + ' is not a function');
};

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
var getMethod = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable(func);
};

var TypeError$9 = global$1.TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
var ordinaryToPrimitive = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = functionCall(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
  throw TypeError$9("Can't convert object to primitive value");
};

// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty$9 = Object.defineProperty;

var setGlobal = function (key, value) {
  try {
    defineProperty$9(global$1, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global$1[key] = value;
  } return value;
};

var SHARED = '__core-js_shared__';
var store$1 = global$1[SHARED] || setGlobal(SHARED, {});

var sharedStore = store$1;

var shared = createCommonjsModule(function (module) {
(module.exports = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.22.1',
  mode: 'pure' ,
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.22.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});
});

var Object$3 = global$1.Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object$3(requireObjectCoercible(argument));
};

var hasOwnProperty = functionUncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es-x/no-object-hasown -- safe
var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};

var id = 0;
var postfix = Math.random();
var toString$1 = functionUncurryThis(1.0.toString);

var uid = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$1(++id + postfix, 36);
};

var WellKnownSymbolsStore$1 = shared('wks');
var Symbol$1 = global$1.Symbol;
var symbolFor = Symbol$1 && Symbol$1['for'];
var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

var wellKnownSymbol = function (name) {
  if (!hasOwnProperty_1(WellKnownSymbolsStore$1, name) || !(nativeSymbol || typeof WellKnownSymbolsStore$1[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (nativeSymbol && hasOwnProperty_1(Symbol$1, name)) {
      WellKnownSymbolsStore$1[name] = Symbol$1[name];
    } else if (useSymbolAsUid && symbolFor) {
      WellKnownSymbolsStore$1[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore$1[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore$1[name];
};

var TypeError$8 = global$1.TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
var toPrimitive = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = functionCall(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw TypeError$8("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
var toPropertyKey = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

var document$1 = global$1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS$1 = isObject(document$1) && isObject(document$1.createElement);

var documentCreateElement = function (it) {
  return EXISTS$1 ? document$1.createElement(it) : {};
};

// Thanks to IE8 for its funny defineProperty
var ie8DomDefine = !descriptors && !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
var f$6 = descriptors ? $getOwnPropertyDescriptor$2 : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (ie8DomDefine) try {
    return $getOwnPropertyDescriptor$2(O, P);
  } catch (error) { /* empty */ }
  if (hasOwnProperty_1(O, P)) return createPropertyDescriptor(!functionCall(objectPropertyIsEnumerable.f, O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$6
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

var isForced_1 = isForced;

var bind = functionUncurryThis(functionUncurryThis.bind);

// optional / simple context binding
var functionBindContext = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : functionBindNative ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
var v8PrototypeDefineBug = descriptors && fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});

var String$3 = global$1.String;
var TypeError$7 = global$1.TypeError;

// `Assert: Type(argument) is Object`
var anObject = function (argument) {
  if (isObject(argument)) return argument;
  throw TypeError$7(String$3(argument) + ' is not an object');
};

var TypeError$6 = global$1.TypeError;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var $defineProperty$1 = Object.defineProperty;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE$1 = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
var f$5 = descriptors ? v8PrototypeDefineBug ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor$1(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty$1(O, P, Attributes);
} : $defineProperty$1 : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return $defineProperty$1(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError$6('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f$5
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;






var wrapConstructor = function (NativeConstructor) {
  var Wrapper = function (a, b, c) {
    if (this instanceof Wrapper) {
      switch (arguments.length) {
        case 0: return new NativeConstructor();
        case 1: return new NativeConstructor(a);
        case 2: return new NativeConstructor(a, b);
      } return new NativeConstructor(a, b, c);
    } return functionApply(NativeConstructor, this, arguments);
  };
  Wrapper.prototype = NativeConstructor.prototype;
  return Wrapper;
};

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
  options.name        - the .name of the function if it does not match the key
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var PROTO = options.proto;

  var nativeSource = GLOBAL ? global$1 : STATIC ? global$1[TARGET] : (global$1[TARGET] || {}).prototype;

  var target = GLOBAL ? path : path[TARGET] || createNonEnumerableProperty(path, TARGET, {})[TARGET];
  var targetPrototype = target.prototype;

  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

  for (key in source) {
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contains in native
    USE_NATIVE = !FORCED && nativeSource && hasOwnProperty_1(nativeSource, key);

    targetProperty = target[key];

    if (USE_NATIVE) if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(nativeSource, key);
      nativeProperty = descriptor && descriptor.value;
    } else nativeProperty = nativeSource[key];

    // export native or implementation
    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

    if (USE_NATIVE && typeof targetProperty == typeof sourceProperty) continue;

    // bind timers to global for call from export context
    if (options.bind && USE_NATIVE) resultProperty = functionBindContext(sourceProperty, global$1);
    // wrap global constructors for prevent changs in this version
    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
    // make static versions for prototype methods
    else if (PROTO && isCallable(sourceProperty)) resultProperty = functionUncurryThis(sourceProperty);
    // default case
    else resultProperty = sourceProperty;

    // add a flag to not completely full polyfills
    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(resultProperty, 'sham', true);
    }

    createNonEnumerableProperty(target, key, resultProperty);

    if (PROTO) {
      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
      if (!hasOwnProperty_1(path, VIRTUAL_PROTOTYPE)) {
        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
      }
      // export virtual prototype methods
      createNonEnumerableProperty(path[VIRTUAL_PROTOTYPE], key, sourceProperty);
      // export real prototype methods
      if (options.real && targetPrototype && !targetPrototype[key]) {
        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
      }
    }
  }
};

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es-x/no-array-isarray -- safe
var isArray$7 = Array.isArray || function isArray(argument) {
  return classofRaw(argument) == 'Array';
};

// `Array.isArray` method
// https://tc39.es/ecma262/#sec-array.isarray
_export({ target: 'Array', stat: true }, {
  isArray: isArray$7
});

var isArray$6 = path.Array.isArray;

var isArray$5 = isArray$6;

var isArray$4 = isArray$5;

var isArray$3 = isArray$4;

var isArray$2 = isArray$3;

var isArray$1 = isArray$2;

function _arrayWithHoles(arr) {
  if (isArray$1(arr)) return arr;
}

var ceil = Math.ceil;
var floor = Math.floor;

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
var toIntegerOrInfinity = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- safe
  return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
};

var min$1 = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
var toLength = function (argument) {
  return argument > 0 ? min$1(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
var lengthOfArrayLike = function (obj) {
  return toLength(obj.length);
};

var createProperty = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG$3] = 'z';

var toStringTagSupport = String(test) === '[object z]';

var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
var Object$2 = global$1.Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof = toStringTagSupport ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object$2(it), TO_STRING_TAG$2)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};

var functionToString = functionUncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(sharedStore.inspectSource)) {
  sharedStore.inspectSource = function (it) {
    return functionToString(it);
  };
}

var inspectSource = sharedStore.inspectSource;

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec$1 = functionUncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec$1(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
var isConstructor = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;

var SPECIES$2 = wellKnownSymbol('species');
var Array$4 = global$1.Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesConstructor = function (originalArray) {
  var C;
  if (isArray$7(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === Array$4 || isArray$7(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES$2];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array$4 : C;
};

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

var SPECIES$1 = wellKnownSymbol('species');

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return engineV8Version >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$1] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';
var TypeError$5 = global$1.TypeError;

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray$7(O);
};

var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
_export({ target: 'Array', proto: true, forced: FORCED$1 }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = lengthOfArrayLike(E);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError$5(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError$5(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

var String$2 = global$1.String;

var toString = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return String$2(argument);
};

var max$2 = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max$2(integer + length, 0) : min(integer, length);
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod$2 = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod$2(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod$2(false)
};

var hiddenKeys$1 = {};

var indexOf = arrayIncludes.indexOf;


var push$2 = functionUncurryThis([].push);

var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwnProperty_1(hiddenKeys$1, key) && hasOwnProperty_1(O, key) && push$2(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwnProperty_1(O, key = names[i++])) {
    ~indexOf(result, key) || push$2(result, key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es-x/no-object-keys -- safe
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es-x/no-object-defineproperties -- safe
var f$4 = descriptors && !v8PrototypeDefineBug ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], props[key]);
  return O;
};

var objectDefineProperties = {
	f: f$4
};

var html = getBuiltIn('document', 'documentElement');

var keys = shared('keys');

var sharedKey = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

/* global ActiveXObject -- old IE, WSH */

var GT = '>';
var LT = '<';
var PROTOTYPE$1 = 'prototype';
var SCRIPT = 'script';
var IE_PROTO$1 = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE$1][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys$1[IE_PROTO$1] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es-x/no-object-create -- safe
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE$1] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : objectDefineProperties.f(result, Properties);
};

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es-x/no-object-getownpropertynames -- safe
var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys);
};

var objectGetOwnPropertyNames = {
	f: f$3
};

var Array$3 = global$1.Array;
var max$1 = Math.max;

var arraySliceSimple = function (O, start, end) {
  var length = lengthOfArrayLike(O);
  var k = toAbsoluteIndex(start, length);
  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
  var result = Array$3(max$1(fin - k, 0));
  for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
  result.length = n;
  return result;
};

/* eslint-disable es-x/no-object-getownpropertynames -- safe */

var $getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;


var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames$1(it);
  } catch (error) {
    return arraySliceSimple(windowNames);
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var f$2 = function getOwnPropertyNames(it) {
  return windowNames && classofRaw(it) == 'Window'
    ? getWindowNames(it)
    : $getOwnPropertyNames$1(toIndexedObject(it));
};

var objectGetOwnPropertyNamesExternal = {
	f: f$2
};

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- safe
var f$1 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$1
};

var redefine = function (target, key, value, options) {
  if (options && options.enumerable) target[key] = value;
  else createNonEnumerableProperty(target, key, value);
};

var f = wellKnownSymbol;

var wellKnownSymbolWrapped = {
	f: f
};

var defineProperty$8 = objectDefineProperty.f;

var defineWellKnownSymbol = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!hasOwnProperty_1(Symbol, NAME)) defineProperty$8(Symbol, NAME, {
    value: wellKnownSymbolWrapped.f(NAME)
  });
};

var symbolDefineToPrimitive = function () {
  var Symbol = getBuiltIn('Symbol');
  var SymbolPrototype = Symbol && Symbol.prototype;
  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
    // `Symbol.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
    // eslint-disable-next-line no-unused-vars -- required for .length
    redefine(SymbolPrototype, TO_PRIMITIVE, function (hint) {
      return functionCall(valueOf, this);
    });
  }
};

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
var objectToString = toStringTagSupport ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

var defineProperty$7 = objectDefineProperty.f;





var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC, SET_METHOD) {
  if (it) {
    var target = STATIC ? it : it.prototype;
    if (!hasOwnProperty_1(target, TO_STRING_TAG$1)) {
      defineProperty$7(target, TO_STRING_TAG$1, { configurable: true, value: TAG });
    }
    if (SET_METHOD && !toStringTagSupport) {
      createNonEnumerableProperty(target, 'toString', objectToString);
    }
  }
};

var WeakMap$1 = global$1.WeakMap;

var nativeWeakMap = isCallable(WeakMap$1) && /native code/.test(inspectSource(WeakMap$1));

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError$4 = global$1.TypeError;
var WeakMap = global$1.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError$4('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (nativeWeakMap || sharedStore.state) {
  var store = sharedStore.state || (sharedStore.state = new WeakMap());
  var wmget = functionUncurryThis(store.get);
  var wmhas = functionUncurryThis(store.has);
  var wmset = functionUncurryThis(store.set);
  set = function (it, metadata) {
    if (wmhas(store, it)) throw new TypeError$4(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget(store, it) || {};
  };
  has = function (it) {
    return wmhas(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys$1[STATE] = true;
  set = function (it, metadata) {
    if (hasOwnProperty_1(it, STATE)) throw new TypeError$4(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwnProperty_1(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

var push$1 = functionUncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod$1 = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = indexedObject(O);
    var boundFunction = functionBindContext(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push$1(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push$1(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod$1(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod$1(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod$1(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod$1(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod$1(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod$1(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod$1(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod$1(7)
};

var $forEach$1 = arrayIteration.forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';

var setInternalState$2 = internalState.set;
var getInternalState$2 = internalState.getterFor(SYMBOL);

var ObjectPrototype$1 = Object[PROTOTYPE];
var $Symbol = global$1.Symbol;
var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE];
var TypeError$3 = global$1.TypeError;
var QObject = global$1.QObject;
var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
var nativeDefineProperty = objectDefineProperty.f;
var nativeGetOwnPropertyNames = objectGetOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = objectPropertyIsEnumerable.f;
var push = functionUncurryThis([].push);

var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var WellKnownSymbolsStore = shared('wks');

// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = descriptors && fails(function () {
  return objectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype$1, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
    nativeDefineProperty(ObjectPrototype$1, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = objectCreate(SymbolPrototype);
  setInternalState$2(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!descriptors) symbol.description = description;
  return symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype$1) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPropertyKey(P);
  anObject(Attributes);
  if (hasOwnProperty_1(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!hasOwnProperty_1(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (hasOwnProperty_1(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach$1(keys, function (key) {
    if (!descriptors || functionCall($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPropertyKey(V);
  var enumerable = functionCall(nativePropertyIsEnumerable, this, P);
  if (this === ObjectPrototype$1 && hasOwnProperty_1(AllSymbols, P) && !hasOwnProperty_1(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !hasOwnProperty_1(this, P) || !hasOwnProperty_1(AllSymbols, P) || hasOwnProperty_1(this, HIDDEN) && this[HIDDEN][P]
    ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype$1 && hasOwnProperty_1(AllSymbols, key) && !hasOwnProperty_1(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && hasOwnProperty_1(AllSymbols, key) && !(hasOwnProperty_1(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach$1(names, function (key) {
    if (!hasOwnProperty_1(AllSymbols, key) && !hasOwnProperty_1(hiddenKeys$1, key)) push(result, key);
  });
  return result;
};

var $getOwnPropertySymbols = function (O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach$1(names, function (key) {
    if (hasOwnProperty_1(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwnProperty_1(ObjectPrototype$1, key))) {
      push(result, AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!nativeSymbol) {
  $Symbol = function Symbol() {
    if (objectIsPrototypeOf(SymbolPrototype, this)) throw TypeError$3('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : toString(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype$1) functionCall(setter, ObjectPrototypeSymbols, value);
      if (hasOwnProperty_1(this, HIDDEN) && hasOwnProperty_1(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  SymbolPrototype = $Symbol[PROTOTYPE];

  redefine(SymbolPrototype, 'toString', function toString() {
    return getInternalState$2(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
  objectDefineProperty.f = $defineProperty;
  objectDefineProperties.f = $defineProperties;
  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

  wellKnownSymbolWrapped.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (descriptors) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty(SymbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        return getInternalState$2(this).description;
      }
    });
  }
}

_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
  Symbol: $Symbol
});

$forEach$1(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
symbolDefineToPrimitive();

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys$1[HIDDEN] = true;

/* eslint-disable es-x/no-symbol -- safe */
var nativeSymbolRegistry = nativeSymbol && !!Symbol['for'] && !!Symbol.keyFor;

var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry$1 = shared('symbol-to-string-registry');

// `Symbol.for` method
// https://tc39.es/ecma262/#sec-symbol.for
_export({ target: 'Symbol', stat: true, forced: !nativeSymbolRegistry }, {
  'for': function (key) {
    var string = toString(key);
    if (hasOwnProperty_1(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = getBuiltIn('Symbol')(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry$1[symbol] = string;
    return symbol;
  }
});

var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.keyFor` method
// https://tc39.es/ecma262/#sec-symbol.keyfor
_export({ target: 'Symbol', stat: true, forced: !nativeSymbolRegistry }, {
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(tryToString(sym) + ' is not a symbol');
    if (hasOwnProperty_1(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  }
});

var arraySlice = functionUncurryThis([].slice);

var $stringify = getBuiltIn('JSON', 'stringify');
var exec = functionUncurryThis(/./.exec);
var charAt$2 = functionUncurryThis(''.charAt);
var charCodeAt$1 = functionUncurryThis(''.charCodeAt);
var replace = functionUncurryThis(''.replace);
var numberToString = functionUncurryThis(1.0.toString);

var tester = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var WRONG_SYMBOLS_CONVERSION = !nativeSymbol || fails(function () {
  var symbol = getBuiltIn('Symbol')();
  // MS Edge converts symbol values to JSON as {}
  return $stringify([symbol]) != '[null]'
    // WebKit converts symbol values to JSON as null
    || $stringify({ a: symbol }) != '{}'
    // V8 throws on boxed symbols
    || $stringify(Object(symbol)) != '{}';
});

// https://github.com/tc39/proposal-well-formed-stringify
var ILL_FORMED_UNICODE = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

var stringifyWithSymbolsFix = function (it, replacer) {
  var args = arraySlice(arguments);
  var $replacer = replacer;
  if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
  if (!isArray$7(replacer)) replacer = function (key, value) {
    if (isCallable($replacer)) value = functionCall($replacer, this, key, value);
    if (!isSymbol(value)) return value;
  };
  args[1] = replacer;
  return functionApply($stringify, null, args);
};

var fixIllFormed = function (match, offset, string) {
  var prev = charAt$2(string, offset - 1);
  var next = charAt$2(string, offset + 1);
  if ((exec(low, match) && !exec(hi, next)) || (exec(hi, match) && !exec(low, prev))) {
    return '\\u' + numberToString(charCodeAt$1(match, 0), 16);
  } return match;
};

if ($stringify) {
  // `JSON.stringify` method
  // https://tc39.es/ecma262/#sec-json.stringify
  _export({ target: 'JSON', stat: true, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = arraySlice(arguments);
      var result = functionApply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
    }
  });
}

// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FORCED = !nativeSymbol || fails(function () { objectGetOwnPropertySymbols.f(1); });

// `Object.getOwnPropertySymbols` method
// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
_export({ target: 'Object', stat: true, forced: FORCED }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    var $getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
  }
});

// `Symbol.asyncIterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');

// `Symbol.hasInstance` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.hasinstance
defineWellKnownSymbol('hasInstance');

// `Symbol.isConcatSpreadable` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.isconcatspreadable
defineWellKnownSymbol('isConcatSpreadable');

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');

// `Symbol.match` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.match
defineWellKnownSymbol('match');

// `Symbol.matchAll` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.matchall
defineWellKnownSymbol('matchAll');

// `Symbol.replace` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.replace
defineWellKnownSymbol('replace');

// `Symbol.search` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.search
defineWellKnownSymbol('search');

// `Symbol.species` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.species
defineWellKnownSymbol('species');

// `Symbol.split` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.split
defineWellKnownSymbol('split');

// `Symbol.toPrimitive` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol('toPrimitive');

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
symbolDefineToPrimitive();

// `Symbol.toStringTag` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag(getBuiltIn('Symbol'), 'Symbol');

// `Symbol.unscopables` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.unscopables
defineWellKnownSymbol('unscopables');

// JSON[@@toStringTag] property
// https://tc39.es/ecma262/#sec-json-@@tostringtag
setToStringTag(global$1.JSON, 'JSON', true);

var symbol$5 = path.Symbol;

var iterators = {};

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwnProperty_1(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!descriptors || (descriptors && getDescriptor(FunctionPrototype, 'name').configurable));

var functionName = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

var correctPrototypeGetter = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es-x/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO = sharedKey('IE_PROTO');
var Object$1 = global$1.Object;
var ObjectPrototype = Object$1.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
var objectGetPrototypeOf = correctPrototypeGetter ? Object$1.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwnProperty_1(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof Object$1 ? ObjectPrototype : null;
};

var ITERATOR$4 = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS$1 = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype$1, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es-x/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$1 = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$1 == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype$1[ITERATOR$4].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$1 = {};
else IteratorPrototype$1 = objectCreate(IteratorPrototype$1);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype$1[ITERATOR$4])) {
  redefine(IteratorPrototype$1, ITERATOR$4, function () {
    return this;
  });
}

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype$1,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
};

var IteratorPrototype = iteratorsCore.IteratorPrototype;





var returnThis$1 = function () { return this; };

var createIteratorConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  iterators[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var String$1 = global$1.String;
var TypeError$2 = global$1.TypeError;

var aPossiblePrototype = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw TypeError$2("Can't set " + String$1(argument) + ' as a prototype');
};

/* eslint-disable no-proto -- safe */

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es-x/no-object-setprototypeof -- safe
Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
    setter = functionUncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var PROPER_FUNCTION_NAME = functionName.PROPER;
var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$3 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$3]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return functionCall(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if ((FORCED) && IterablePrototype[ITERATOR$3] !== defaultIterator) {
    redefine(IterablePrototype, ITERATOR$3, defaultIterator, { name: DEFAULT });
  }
  iterators[NAME] = defaultIterator;

  return methods;
};

objectDefineProperty.f;




var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState$1 = internalState.set;
var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState$1(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState$1(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
iterators.Arguments = iterators.Array;

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

for (var COLLECTION_NAME in domIterables) {
  var Collection = global$1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype && classof(CollectionPrototype) !== TO_STRING_TAG) {
    createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
  }
  iterators[COLLECTION_NAME] = iterators.Array;
}

var symbol$4 = symbol$5;

var symbol$3 = symbol$4;

// `Symbol.asyncDispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol('asyncDispose');

// `Symbol.dispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol('dispose');

// `Symbol.matcher` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol('matcher');

// `Symbol.metadata` well-known symbol
// https://github.com/tc39/proposal-decorators
defineWellKnownSymbol('metadata');

// `Symbol.observable` well-known symbol
// https://github.com/tc39/proposal-observable
defineWellKnownSymbol('observable');

// TODO: remove from `core-js@4`


// `Symbol.patternMatch` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol('patternMatch');

// TODO: remove from `core-js@4`


defineWellKnownSymbol('replaceAll');

// TODO: Remove from `core-js@4`

// TODO: Remove from `core-js@4`


var symbol$2 = symbol$3;

var symbol$1 = symbol$2;

var symbol = symbol$1;

var charAt$1 = functionUncurryThis(''.charAt);
var charCodeAt = functionUncurryThis(''.charCodeAt);
var stringSlice = functionUncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt$1(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};

var charAt = stringMultibyte.charAt;




var STRING_ITERATOR = 'String Iterator';
var setInternalState = internalState.set;
var getInternalState = internalState.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

var ITERATOR$2 = wellKnownSymbol('iterator');

var getIteratorMethod$5 = function (it) {
  if (it != undefined) return getMethod(it, ITERATOR$2)
    || getMethod(it, '@@iterator')
    || iterators[classof(it)];
};

var getIteratorMethod_1 = getIteratorMethod$5;

var getIteratorMethod$4 = getIteratorMethod_1;

var getIteratorMethod$3 = getIteratorMethod$4;

var getIteratorMethod$2 = getIteratorMethod$3;

var getIteratorMethod$1 = getIteratorMethod$2;

var getIteratorMethod = getIteratorMethod$1;

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof symbol !== "undefined" && getIteratorMethod(arr) || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('slice');

var SPECIES = wellKnownSymbol('species');
var Array$2 = global$1.Array;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = lengthOfArrayLike(O);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray$7(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (isConstructor(Constructor) && (Constructor === Array$2 || isArray$7(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array$2 || Constructor === undefined) {
        return arraySlice(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array$2 : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

var entryVirtual = function (CONSTRUCTOR) {
  return path[CONSTRUCTOR + 'Prototype'];
};

var slice$7 = entryVirtual('Array').slice;

var ArrayPrototype$3 = Array.prototype;

var slice$6 = function (it) {
  var own = it.slice;
  return it === ArrayPrototype$3 || (objectIsPrototypeOf(ArrayPrototype$3, it) && own === ArrayPrototype$3.slice) ? slice$7 : own;
};

var slice$5 = slice$6;

var slice$4 = slice$5;

var slice$3 = slice$4;

var slice$2 = slice$3;

var slice$1 = slice$2;

var iteratorClose = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = functionCall(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};

var ITERATOR$1 = wellKnownSymbol('iterator');
var ArrayPrototype$2 = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype$2[ITERATOR$1] === it);
};

var TypeError$1 = global$1.TypeError;

var getIterator = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod$5(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(functionCall(iteratorMethod, argument));
  throw TypeError$1(tryToString(argument) + ' is not iterable');
};

var Array$1 = global$1.Array;

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var IS_CONSTRUCTOR = isConstructor(this);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
  var iteratorMethod = getIteratorMethod$5(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod && !(this == Array$1 && isArrayIteratorMethod(iteratorMethod))) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    result = IS_CONSTRUCTOR ? new this() : [];
    for (;!(step = functionCall(next, iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = lengthOfArrayLike(O);
    result = IS_CONSTRUCTOR ? new this(length) : Array$1(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es-x/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  // eslint-disable-next-line es-x/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: arrayFrom
});

var from$5 = path.Array.from;

var from$4 = from$5;

var from$3 = from$4;

var from$2 = from$3;

var from$1 = from$2;

var from = from$1;

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  var _context;

  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);

  var n = slice$1(_context = Object.prototype.toString.call(o)).call(_context, 8, -1);

  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var defineProperty$6 = objectDefineProperty.f;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
_export({ target: 'Object', stat: true, forced: Object.defineProperty !== defineProperty$6, sham: !descriptors }, {
  defineProperty: defineProperty$6
});

var defineProperty_1 = createCommonjsModule(function (module) {
var Object = path.Object;

var defineProperty = module.exports = function defineProperty(it, key, desc) {
  return Object.defineProperty(it, key, desc);
};

if (Object.defineProperty.sham) defineProperty.sham = true;
});

var defineProperty$5 = defineProperty_1;

var defineProperty$4 = defineProperty$5;

var defineProperty$3 = defineProperty$4;

var defineProperty$2 = defineProperty$3;

var defineProperty$1 = defineProperty$2;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;

    defineProperty$1(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);

  defineProperty$1(Constructor, "prototype", {
    writable: false
  });

  return Constructor;
}

function _arrayWithoutHoles(arr) {
  if (isArray$1(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof symbol !== "undefined" && getIteratorMethod(iter) != null || iter["@@iterator"] != null) return from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

// `Math.sign` method implementation
// https://tc39.es/ecma262/#sec-math.sign
// eslint-disable-next-line es-x/no-math-sign -- safe
var mathSign = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare -- NaN check
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

// `Math.sign` method
// https://tc39.es/ecma262/#sec-math.sign
_export({ target: 'Math', stat: true }, {
  sign: mathSign
});

var sign$2 = path.Math.sign;

var sign$1 = sign$2;

var sign = sign$1;

var $map = arrayIteration.map;


var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var map$3 = entryVirtual('Array').map;

var ArrayPrototype$1 = Array.prototype;

var map$2 = function (it) {
  var own = it.map;
  return it === ArrayPrototype$1 || (objectIsPrototypeOf(ArrayPrototype$1, it) && own === ArrayPrototype$1.map) ? map$3 : own;
};

var map$1 = map$2;

var map = map$1;

function clamp(value, min, max) {
  var fixedMin = isNaN(min) ? -Infinity : min;
  var fixedMax = isNaN(max) ? Infinity : max;
  var lower = Math.min(fixedMin, fixedMax);
  var upper = Math.max(fixedMin, fixedMax);
  return Math.min(Math.max(value, lower), upper);
}

function roundNumber(number, precision) {
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Math.round;
  var decimal = Math.pow(10, precision);
  return method(number * decimal) / decimal;
}

function intMultiplyFloat(int, floatMultiplier) {
  var precision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if (floatMultiplier % 1 !== 0) {
    return intMultiplyFloat(int, floatMultiplier * 10, precision * 10);
  }

  return int * floatMultiplier / precision;
}

/**
 * 是否是的 2 的指数值
 * 无法用来处理小数
 * @param  {Number} value
 * @return {Number}
 */
function isPowerIntegerOfTwo(testNum) {
  return !isNaN(testNum) && testNum !== Infinity && testNum !== -Infinity && testNum % 1 === 0 && (testNum & testNum - 1) === 0 && testNum !== 0;
}

/**
 * 最近的 2 的指数值
 * 无法用来处理小于 1 的数
 * @param  {Number} value
 * @return {Number}
 */
function nearestPowerIntegerOfTwo(value) {
  if (isNaN(value) || value === Infinity || value === -Infinity || value <= 1) {
    return 1;
  }

  var upper = 2,
      lower = 1;

  while (upper < value || lower > value) {
    var _ref = [upper * 2, upper];
    upper = _ref[0];
    lower = _ref[1];
  }

  var dis1 = upper - value;
  var dis2 = value - lower;
  return dis1 >= dis2 ? lower : upper;
}

var seed = 1234567;
var PI2 = Math.PI * 2;
var kfRadius = 2;
var DEG2RAD = Math.PI / 180;
var RAD2DEG = 180 / Math.PI;
var fixed = function fixed(value, size) {
  return Math.round(value * Math.pow(10, size)) / Math.pow(10, size);
}; // compute euclidian modulo of m % n
// https://en.wikipedia.org/wiki/Modulo_operation

var euclideanModulo = function euclideanModulo(n, m) {
  return (n % m + m) % m;
}; // Linear mapping from range <a1, a2> to range <b1, b2>

var mapLinear = function mapLinear(x, a1, a2, b1, b2) {
  return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
}; // https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/inverse-lerp-a-super-useful-yet-often-overlooked-function-r5230/

var inverseLerp = function inverseLerp(x, y, value) {
  if (x !== y) {
    return (value - x) / (y - x);
  } else {
    return 0;
  }
}; // https://en.wikipedia.org/wiki/Linear_interpolation

var lerp = function lerp(x, y, t) {
  return (1 - t) * x + t * y;
}; // http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/

var damp = function damp(x, y, lambda, dt) {
  return lerp(x, y, 1 - Math.exp(-lambda * dt));
}; // https://www.desmos.com/calculator/vcsjnyz7x4

var pingpong = function pingpong(x) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return length - Math.abs(euclideanModulo(x, length * 2) - length);
}; // http://en.wikipedia.org/wiki/Smoothstep

var smoothstep = function smoothstep(x, min, max) {
  if (x <= min) {
    return 0;
  }

  if (x >= max) {
    return 1;
  }

  x = (x - min) / (max - min);
  return x * x * (3 - 2 * x);
};
var smootherstep = function smootherstep(x, min, max) {
  if (x <= min) {
    return 0;
  }

  if (x >= max) {
    return 1;
  }

  x = (x - min) / (max - min);
  return x * x * x * (x * (x * 6 - 15) + 10);
}; // Random integer from <low, high> interval

var randInt = function randInt(low, high) {
  return low + Math.floor(Math.random() * (high - low + 1));
}; // Random float from <low, high> interval

var randFloat = function randFloat(low, high) {
  return low + Math.random() * (high - low);
}; // Random float from <-range/2, range/2> interval

var randFloatSpread = function randFloatSpread(range) {
  return range * (0.5 - Math.random());
}; // Deterministic pseudo-random float in the interval [ 0, 1 ]

var seededRandom = function seededRandom(s) {
  if (s !== undefined) {
    seed = s % 2147483647;
  } // Park-Miller algorithm


  seed = seed * 16807 % 2147483647;
  return (seed - 1) / 2147483646;
};
var degToRad = function degToRad(degrees) {
  return degrees * DEG2RAD;
};
var radToDeg = function radToDeg(radians) {
  return radians * RAD2DEG;
};
var isPowerOfTwo = function isPowerOfTwo(value) {
  return (value & value - 1) === 0 && value !== 0;
};
var ceilPowerOfTwo = function ceilPowerOfTwo(value) {
  return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
};
var floorPowerOfTwo = function floorPowerOfTwo(value) {
  return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
};
/**
 * 最近的 2 的指数值
 * @param {number} value
 * @return {number}
 */

function nearestPowerOfTwo(value) {
  var n = Math.log(value) / Math.LN2;
  n = n % 1 > 0.9 ? Math.ceil(n) : Math.floor(n);
  return Math.pow(2, n);
}
function modByFloat(number, mod) {
  var left = number % mod;
  number -= left;

  if (Math.abs(left) >= mod / 2) {
    number += mod * sign(number);
  }

  return number;
}

function isNumberArrayType(obj) {
  return typeof obj[0] === 'number';
}

function resetObjectByRatio(obj, ratio) {
  var isIn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (ratio === 1 || !obj) {
    return obj;
  } // obj[0] 是数字


  if (isNumberArrayType(obj)) {
    return map(obj).call(obj, function (value, index) {
      return isIn && index < 2 ? value * ratio : value / ratio;
    });
  } // obj[0] 是字符串


  if (obj[0] === 'random') {
    var _context;

    var random = map(_context = obj[1]).call(_context, function (n) {
      return isIn ? n * ratio : n / ratio;
    });

    return ['random', random];
  }

  if (obj[0] === 'lines') {
    var _context2;

    // lines [time, value];
    var lines = map(_context2 = obj[1]).call(_context2, function (v) {
      return [v[0], isIn ? v[1] * ratio : v[1] / ratio];
    });

    return ['lines', lines];
  }

  if (obj[0] === 'line') {
    var _context3;

    // line [time, value];
    var line = map(_context3 = obj[1]).call(_context3, function (v) {
      return [v[0], isIn ? v[1] * ratio : v[1] / ratio];
    });

    return ['line', line];
  }

  if (obj[0] === 'curve') {
    var _context4;

    // curve [time, value];
    var curve = map(_context4 = obj[1]).call(_context4, function (v) {
      return [v[0], isIn ? v[1] * ratio : v[1] / ratio, v[2], v[3]];
    });

    return ['curve', curve];
  }

  if (obj[0] === 'bezier') {
    var _context5, _context6, _context7;

    var times = map(_context5 = obj[1][0]).call(_context5, function (time) {
      return _toConsumableArray(time);
    });

    var positions = map(_context6 = obj[1][1]).call(_context6, function (p) {
      return isIn ? [p[0] * ratio, p[1] * ratio, p[2]] : [p[0] / ratio, p[1] / ratio, p[2]];
    });

    var controls = map(_context7 = obj[1][2]).call(_context7, function (c) {
      return isIn ? [c[0] * ratio, c[1] * ratio, c[2] * ratio] : [c[0] / ratio, c[1] / ratio, c[2] / ratio];
    });

    return ['bezier', [times, positions, controls]];
  }

  if (obj[0] === 'path') {
    var _context8, _context9;

    var _times = map(_context8 = obj[1][0]).call(_context8, function (time) {
      return _toConsumableArray(time);
    });

    var _positions = map(_context9 = obj[1][1]).call(_context9, function (p) {
      return isIn ? [p[0] * ratio, p[1] * ratio, p[2]] : [p[0] / ratio, p[1] / ratio, p[2]];
    });

    return ['path', [_times, _positions]];
  }

  return [];
}
function resetPropertyByRatio(obj, ratio) {
  var isIn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (typeof obj === 'number') {
    return obj * ratio;
  } else {
    return resetObjectByRatio(obj, ratio, isIn);
  }
}

/**
 * @class 二维向量 | 二维点
 */

var Vec2 = /*#__PURE__*/function () {
  /**
   * 构造函数，默认为二维零向量 | 二维原点
   * @param {number} [x=0] x分量,默认为0
   * @param {number} [y=0] y分量,默认为0
   */
  function Vec2() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Vec2);

    this.x = x;
    this.y = y;
  }
  /**
   * @static 复制二维向量
   * @param {Vec2} other 二维向量
   * @return {Vec2} 复制结果
   */


  _createClass(Vec2, [{
    key: "width",
    get:
    /**
     * @member {number} 宽度
     */
    function get() {
      return this.x;
    },
    set: function set(value) {
      this.x = value;
    }
    /**
     * @member {number} 高度
     */

  }, {
    key: "height",
    get: function get() {
      return this.y;
    },
    set: function set(value) {
      this.y = value;
    }
    /**
     * 设置二维向量
     * @param {number} x x轴分量
     * @param {number} [y=x] y轴分量，默认为x分量值
     * @return {Vec2}
     */

  }, {
    key: "set",
    value: function set(x, y) {
      this.x = x;
      this.y = y === undefined ? x : y;
      return this;
    }
    /**
     * 设置x轴分量
     * @param {number} x x轴分量
     * @return {Vec2} 二维向量
     */

  }, {
    key: "setX",
    value: function setX(x) {
      this.x = x;
      return this;
    }
    /**
     * 设置Y轴分量
     * @param {number} y y轴分量
     * @return {Vec2} 二维向量
     */

  }, {
    key: "setY",
    value: function setY(y) {
      this.y = y;
      return this;
    }
    /**
     * 复制二维向量
     * @param {Vec2} v 二维向量
     * @return {Vec2} 复制结果
     */

  }, {
    key: "copy",
    value: function copy(v) {
      this.x = v.x;
      this.y = v.y;
      return this;
    }
    /**
     * 克隆二维向量
     * @return {Vec2} 克隆结果
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Vec2(this.x, this.y);
    }
    /**
     * 二维向量求和
     * @param {Vec2|number} v 二维向量 | 数字
     * @return {Vec2} 二维向量
     */

  }, {
    key: "add",
    value: function add(v) {
      if (typeof v === 'number') {
        this.x += v;
        this.y += v;
      } else {
        this.x += v.x;
        this.y += v.y;
      }

      return this;
    }
    /**
     * 二维向量求和(a + b)
     * @param {Vec2} a 二维向量
     * @param {Vec2} b 二维向量
     * @return {Vec2} 求和结果
     */

  }, {
    key: "addVectors",
    value: function addVectors(a, b) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      return this;
    }
    /**
     * 二维向量比例求和
     * @param {Vec2} v 二维向量
     * @param {number} s 比例值
     * @return {Vec2} 求和结果
     */

  }, {
    key: "addScaledVector",
    value: function addScaledVector(v, s) {
      this.x += v.x * s;
      this.y += v.y * s;
      return this;
    }
    /**
     * 二维向量求差
     * @param {Vec2|number} v 二维向量 |  数字
     * @return {Vec2} 求差结果
     */

  }, {
    key: "sub",
    value: function sub(v) {
      if (typeof v === 'number') {
        this.x -= v;
        this.y -= v;
      } else {
        this.x -= v.x;
        this.y -= v.y;
      }

      return this;
    }
    /**
     * 二维向量求差
     * @param {Vec2} a 二维向量
     * @param {Vec2} b 二维向量
     * @return {Vec2} 求差结果
     */

  }, {
    key: "subVectors",
    value: function subVectors(a, b) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      return this;
    }
    /**
     * 二维向量求乘
     * @param {Vec2|number} v 二维向量 | 数字
     * @return {Vec2} 求乘结果
     */

  }, {
    key: "multiply",
    value: function multiply(v) {
      if (typeof v === 'number') {
        this.x *= v;
        this.y *= v;
      } else {
        this.x *= v.x;
        this.y *= v.y;
      }

      return this;
    }
    /**
     * 二维向量求除
     * @param {Vec2|number} v 二维向量 | 数字
     * @return {Vec2} 求除结果
     */

  }, {
    key: "divide",
    value: function divide(v) {
      if (typeof v === 'number') {
        this.x /= v;
        this.y /= v;
      } else {
        this.x /= v.x;
        this.y /= v.y;
      }

      return this;
    }
    /**
     * 二维向量取反
     * @return {Vec2} 取反结果
     */

  }, {
    key: "inverse",
    value: function inverse() {
      return this.clone().multiply(-1);
    }
    /**
     * 二维向量矩阵变换
     * @param {Matrix3} m 变换矩阵
     * @return {Vec2} 变换结果
     */

  }, {
    key: "applyMatrix3",
    value: function applyMatrix3(m) {
      var x = this.x;
      var y = this.y;
      var e = m.elements;
      this.x = e[0] * x + e[3] * y + e[6];
      this.y = e[1] * x + e[4] * y + e[7];
      return this;
    }
    /**
     * 二维向量求最小值
     * @param {Vec2} v 二维向量
     * @return {Vec2} 最小值
     */

  }, {
    key: "min",
    value: function min(v) {
      this.x = Math.min(this.x, v.x);
      this.y = Math.min(this.y, v.y);
      return this;
    }
    /**
     * 二维向量求最大值
     * @param {Vec2} v 二维向量
     * @return {Vec2} 最大值
     */

  }, {
    key: "max",
    value: function max(v) {
      this.x = Math.max(this.x, v.x);
      this.y = Math.max(this.y, v.y);
      return this;
    }
    /**
     * 二维向量阈值约束
     * @param {Vec2} min 极小值
     * @param {Vec2} max 极大值
     * @return {Vec2} 二维向量
     */

  }, {
    key: "clamp",
    value: function clamp(min, max) {
      // assumes min < max, componentwise
      this.x = Math.max(min.x, Math.min(max.x, this.x));
      this.y = Math.max(min.y, Math.min(max.y, this.y));
      return this;
    }
    /**
     * 二维向量向下取整
     * @return {Vec2} 取整结果
     */

  }, {
    key: "floor",
    value: function floor() {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      return this;
    }
    /**
     * 二维向量向上取整
     * @return {Vec2} 取整结果
     */

  }, {
    key: "ceil",
    value: function ceil() {
      this.x = Math.ceil(this.x);
      this.y = Math.ceil(this.y);
      return this;
    }
    /**
     * 二维向量取四舍五入
     * @return {Vec2} 四舍五入结果
     */

  }, {
    key: "round",
    value: function round() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      return this;
    }
    /**
     * 二维向量取反
     * @return {Vec2} 取反结果
     */

  }, {
    key: "negate",
    value: function negate() {
      this.x = -this.x;
      this.y = -this.y;
      return this;
    }
    /**
     * 二维向量点乘
     * @abstract 可以用来辅助运算向量之间的夹角
     * @param {Vec2} v 二维向量
     * @return {number} 点乘结果
     */

  }, {
    key: "dot",
    value: function dot(v) {
      return this.x * v.x + this.y * v.y;
    }
    /**
     * 二维向量叉乘
     * @abstract 表示与this && v 向量所在平面垂直的向量
     * @param {Vec2} v 二维向量
     * @return {number} 叉乘结果
     */

  }, {
    key: "cross",
    value: function cross(v) {
      return this.x * v.y - this.y * v.x;
    }
    /**
     * 二维向量长度平方
     * @abstract Math.sqrt的效率低于乘法，可以在运算中使用乘法结果与lengthSq的对比替代length与距离的对比
     * @return {number} 求值结果
     */

  }, {
    key: "lengthSq",
    value: function lengthSq() {
      return this.x * this.x + this.y * this.y;
    }
    /**
     * 二维向量长度
     * @return {number} 求值结果
     */

  }, {
    key: "length",
    value: function length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * 二维向量曼哈顿长度
     * @return {number} 求值结果
     */

  }, {
    key: "manhattanLength",
    value: function manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y);
    }
    /**
     * 二维向量归一化
     * @abstract 归一化向量可以用用作单位方向
     * @return {Vec2} 归一化结果
     */

  }, {
    key: "normalize",
    value: function normalize() {
      if (this.length() !== 0) {
        return this.divide(this.length());
      } else {
        console.warn('divide value can not be zero');
        return this;
      }
    }
    /**
     * 二维向量与x轴夹角
     * @return {number} 弧度值
     */

  }, {
    key: "angle",
    value: function angle() {
      // computes the angle in radians with respect to the positive x-axis
      var angle = Math.atan2(-this.y, -this.x) + Math.PI;
      return angle;
    }
    /**
     * 二维向量夹角
     * @param {Vec2} other 二维向量
     * @return {number} 夹角
     */

  }, {
    key: "angleToVec2",
    value: function angleToVec2(other) {
      var cosValue = Math.min(Math.max(this.dot(other) / this.length() / other.length(), -1), 1);
      var angle = Math.acos(cosValue);
      angle = this.x * other.y - this.y * other.x > 0 ? angle : -angle;
      return angle;
    }
    /**
     * 二维向量this向二维向量other投影
     * @param {Vec2} other 二维向量
     * @return {Vec2} 投影值
     */

  }, {
    key: "projectionToVec2",
    value: function projectionToVec2(other) {
      var angle = this.angleToVec2(other);
      return Vec2.copy(other).normalize().multiply(this.length() * Math.cos(angle));
    }
    /**
     * 二维向量视图转换
     * @param {number} width 视图宽度
     * @param {number} height 视图高度
     * @return {Vec2} 转换结果
     */

  }, {
    key: "toView",
    value: function toView(width, height) {
      this.x = (this.x + 1) / 2 * width;
      this.y = (1 - (this.y + 1) / 2) * height;
      return this;
    }
    /**
     * 二维点距离平方
     * @param {Vec2} v 二维点
     * @return {number} 距离平方
     */

  }, {
    key: "distanceToSquared",
    value: function distanceToSquared(v) {
      var dx = this.x - v.x;
      var dy = this.y - v.y;
      return dx * dx + dy * dy;
    }
    /**
     * 二维点距离
     * @param {Vec2} v 二维点
     * @return {number} 距离
     */

  }, {
    key: "distanceTo",
    value: function distanceTo(v) {
      var dx = this.x - v.x;
      var dy = this.y - v.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * 二维点曼哈顿距离
     * @param {Vec2} v 二维点
     * @return {number} 曼哈顿距离
     */

  }, {
    key: "manhattanDistanceTo",
    value: function manhattanDistanceTo(v) {
      return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    }
    /**
     * 根据长度修改二维向量
     * @param {number} length 长度值
     * @return {Vec2} 计算结果
     */

  }, {
    key: "setLength",
    value: function setLength(length) {
      return this.normalize().multiply(length);
    }
    /**
     * 二维点(this与other)求线性插值
     * @param {Vec2} other 二维点
     * @param {number} alpha 插值比
     * @return {Vec2} 计算结果
     */

  }, {
    key: "lerp",
    value: function lerp(other, alpha) {
      this.x += (other.x - this.x) * alpha;
      this.y += (other.y - this.y) * alpha;
      return this;
    }
    /**
     * 二维点(v1与v2)求线性插值
     * @param {Vec2} v1 二维点
     * @param {Vec2} v2 二维点
     * @param {number} alpha 插值比
     * @return {Vec2} 计算结果
     */

  }, {
    key: "lerpVectors",
    value: function lerpVectors(v1, v2, alpha) {
      this.x = v1.x + (v2.x - v1.x) * alpha;
      this.y = v1.y + (v2.y - v1.y) * alpha;
      return this;
    }
    /**
     * 二维向量判等
     * @param {Vec2} v 二维向量
     * @return {boolean} 判等结果
     */

  }, {
    key: "equals",
    value: function equals(v) {
      return v.x === this.x && v.y === this.y;
    }
    /**
     * 由数组组装二维向量
     * @param {[x: number, y: number]} array 数组
     * @return {Vec2} 二维向量
     */

  }, {
    key: "fromArray",
    value: function fromArray(array) {
      var _array = _slicedToArray(array, 2);

      this.x = _array[0];
      this.y = _array[1];
      return this;
    }
    /**
     * 二维向量转数组
     * @return {[x: number, y: number]} 数组
     */

  }, {
    key: "toArray",
    value: function toArray() {
      return [this.x, this.y];
    }
    /**
     * 二维点绕点旋转
     * @param {Vec2} center 旋转中心
     * @param {number} angle 旋转角度
     * @return {Vec2} 旋转结果
     */

  }, {
    key: "rotateAround",
    value: function rotateAround(center, angle) {
      var c = Math.cos(angle),
          s = Math.sin(angle);
      var x = this.x - center.x;
      var y = this.y - center.y;
      this.x = x * c - y * s + center.x;
      this.y = x * s + y * c + center.y;
      return this;
    }
    /**
     * 随机生成二维向量
     * @return {Vec2} 二维向量
     */

  }, {
    key: "random",
    value: function random() {
      this.x = Math.random();
      this.y = Math.random();
      return this;
    }
    /**
     * 二维点旋转
     * @param {number} angle 旋转角度
     * @param {Vec2} [center=new Vec2()] 旋转中心，默认值为原点
     * @return {Vec2} 旋转结果
     */

  }, {
    key: "rotate",
    value: function rotate(angle) {
      var center = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vec2();
      var origin = Vec2.copy(this).sub(center);
      this.x = origin.x * Math.cos(angle) + origin.y * Math.sin(angle) + center.x;
      this.y = origin.x * -Math.sin(angle) + origin.y * Math.cos(angle) + center.y;
      return this;
    } // TODO: 容错机制

    /**
     * 二维点到线的垂直距离
     * @param {Line2} line 二维线
     * @return {number} 距离值
     */

  }, {
    key: "verticalDistanceToLine",
    value: function verticalDistanceToLine(line) {
      var a = (line.end.y - line.start.y) / (line.end.x - line.start.x);
      var b = -1;
      var c = line.start.y - a * line.start.x;
      var v1 = new Vec2(this.x - line.start.x, this.y - line.start.y);
      var v2 = new Vec2(line.end.x - line.start.x, line.end.y - line.start.y);
      var angle = v1.angleToVec2(v2);

      if (angle > -Math.PI / 2 && angle < Math.PI / 2) {
        var dis = (a * this.x + b * this.y + c) / Math.sqrt(a * a + 1);
        return Math.abs(dis);
      } else {
        return -1;
      }
    }
    /**
     * 点到直线的最短距离
     * @return {{d: number, t: number}} d表示距离，t表示最近点在直线的比例
     */

  }, {
    key: "distanceToLine",
    value: function distanceToLine(line) {
      var l2 = Math.pow(line.length(), 2);
      var start = line.start,
          end = line.end;

      if (l2 === 0) {
        return {
          d: new Vec2().subVectors(this, start).length(),
          t: 0
        };
      }

      var t = ((this.x - start.x) * (end.x - start.x) + (this.y - start.y) * (end.y - start.y)) / l2;
      var clampedT = clamp(t, 0, 1);
      return {
        d: new Vec2().subVectors(this, line.at(clampedT)).length(),
        t: clampedT
      };
    }
    /**
     * 二维向量判空
     * @return {boolean} 判空结果
     */

  }, {
    key: "isZero",
    value: function isZero() {
      return this.length() === 0;
    }
  }], [{
    key: "copy",
    value: function copy(other) {
      return new Vec2(other.x, other.y);
    }
    /**
     * @static 二维向量判等
     * @param {Vec2} a 二维向量
     * @param {Vec2} b 二维向量
     * @return {boolean} 判等结果
     */

  }, {
    key: "equal",
    value: function equal(a, b) {
      return a.x === b.x && a.y === b.y;
    }
    /**
     * @static 二维点x方向差值
     * @param {Vec2} a 二维点
     * @param {Vec2} b 二维点
     * @return {number} 差值
     */

  }, {
    key: "distanceX",
    value: function distanceX(a, b) {
      return Math.abs(a.x - b.x);
    }
    /**
     * @static 二维点y方向差值
     * @param {Vec2} a 二维点
     * @param {Vec2} b 二维点
     * @return {number} 差值
     */

  }, {
    key: "distanceY",
    value: function distanceY(a, b) {
      return Math.abs(a.y - b.y);
    }
    /**
     * @static 二维点求距离
     * @param {Vec2} a 二维点
     * @param {Vec2} b 二维点
     * @return {number} 距离
     */

  }, {
    key: "distance",
    value: function distance(a, b) {
      return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }
    /**
     * @static 二维向量求分轴最大值
     * @param {Vec2} a 二维向量
     * @param {Vec2} b 二维向量
     * @return {Vec2} 求值结果
     */

  }, {
    key: "max",
    value: function max(a, b) {
      return new Vec2(Math.max(a.x, b.x), Math.max(a.y, b.y));
    }
    /**
     * @static 二维向量求分轴最小值
     * @param {Vec2} a 二维向量
     * @param {Vec2} b 二维向量
     * @return {Vec2} 求值结果
     */

  }, {
    key: "min",
    value: function min(a, b) {
      return new Vec2(Math.min(a.x, b.x), Math.min(a.y, b.y));
    }
    /**
     * 二维向量求混合值
     * @param {Vec2} a 二维向量
     * @param {Vec2} b 二维向量
     * @param {number} [ratio=0.5] 混合比例，默认为0.5
     * @return {Vec2} 求值结果
     */

  }, {
    key: "mix",
    value: function mix(a, b, ratio) {
      ratio = ratio ? ratio : 0.5;
      return new Vec2(ratio * a.x + (1 - ratio) * b.x, ratio * a.y + (1 - ratio) * b.y);
    }
  }, {
    key: "addVectors",
    value: function addVectors(a, b) {
      return new Vec2(a.x + b.x, a.y + b.y);
    }
  }]);

  return Vec2;
}();

// eslint-disable-next-line es-x/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;
var concat = functionUncurryThis([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
var objectAssign = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (descriptors && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es-x/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
  while (argumentsLength > index) {
    var S = indexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!descriptors || functionCall(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es-x/no-object-assign -- required for testing
_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
  assign: objectAssign
});

var assign$2 = path.Object.assign;

var assign$1 = assign$2;

var assign = assign$1;

var slice = slice$5;

var isArray = isArray$5;

// `Number.EPSILON` constant
// https://tc39.es/ecma262/#sec-number.epsilon
_export({ target: 'Number', stat: true }, {
  EPSILON: Math.pow(2, -52)
});

var epsilon$2 = Math.pow(2, -52);

var epsilon$1 = epsilon$2;

var epsilon = epsilon$1;

/**
 * @class 四维矩阵[三维空间变换矩阵 || 四维空间旋转缩放矩阵]
 */

var Matrix4 = /*#__PURE__*/function () {
  /**
   * 构造函数，初始值为单位矩阵
   */
  function Matrix4() {
    _classCallCheck(this, Matrix4);

    this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    if (arguments.length > 0) {
      console.error('THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.');
    }
  }
  /**
   * @static 克隆四维矩阵
   * @param {Matrix4} other 四维矩阵
   * @return {Matrix4} 克隆结果
   */


  _createClass(Matrix4, [{
    key: "set",
    value:
    /**
     * 设置四维矩阵
     * @param {number} n00 矩阵[0, 0]值
     * @param {number} n01 矩阵[0, 1]值
     * @param {number} n02 矩阵[0, 2]值
     * @param {number} n03 矩阵[0, 3]值
     * @param {number} n10 矩阵[1, 0]值
     * @param {number} n11 矩阵[1, 1]值
     * @param {number} n12 矩阵[1, 2]值
     * @param {number} n13 矩阵[1, 2]值
     * @param {number} n20 矩阵[2, 0]值
     * @param {number} n21 矩阵[2, 1]值
     * @param {number} n22 矩阵[2, 2]值
     * @param {number} n23 矩阵[2, 3]值
     * @param {number} n30 矩阵[3, 0]值
     * @param {number} n32 矩阵[3, 1]值
     * @param {number} n32 矩阵[3, 2]值
     * @param {number} n33 矩阵[3, 3]值
     * @return {Matrix4} 四维矩阵
     */
    function set(n00, n01, n02, n03, n10, n11, n12, n13, n20, n21, n22, n23, n30, n31, n32, n33) {
      var te = this.elements;
      te[0] = n00;
      te[4] = n01;
      te[8] = n02;
      te[12] = n03;
      te[1] = n10;
      te[5] = n11;
      te[9] = n12;
      te[13] = n13;
      te[2] = n20;
      te[6] = n21;
      te[10] = n22;
      te[14] = n23;
      te[3] = n30;
      te[7] = n31;
      te[11] = n32;
      te[15] = n33;
      return this;
    }
    /**
     * 四维矩阵单位化
     * @return {Matrix4} 单位矩阵
     */

  }, {
    key: "identity",
    value: function identity() {
      this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      return this;
    }
    /**
     * 四维矩阵单位判断
     * @return {boolean} 判断结果
     */

  }, {
    key: "isIdentity",
    value: function isIdentity() {
      var te = this.elements;
      return te[0] === 1 && te[4] === 0 && te[8] === 0 && te[12] === 0 && te[1] === 0 && te[5] === 1 && te[9] === 0 && te[13] === 0 && te[2] === 0 && te[6] === 0 && te[10] === 1 && te[14] === 0 && te[3] === 0 && te[7] === 0 && te[11] === 0 && te[15] === 1;
    }
    /**
     * 四维矩阵克隆
     * @return {Matrix4} 克隆结果
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Matrix4().fromArray(this.elements);
    }
    /**
     * 四维矩阵复制
     * @param {Matrix4} m 复制对象
     * @return {Matrix4} 复制结果
     */

  }, {
    key: "copy",
    value: function copy(m) {
      var te = this.elements;
      var me = m.elements;
      te[0] = me[0];
      te[1] = me[1];
      te[2] = me[2];
      te[3] = me[3];
      te[4] = me[4];
      te[5] = me[5];
      te[6] = me[6];
      te[7] = me[7];
      te[8] = me[8];
      te[9] = me[9];
      te[10] = me[10];
      te[11] = me[11];
      te[12] = me[12];
      te[13] = me[13];
      te[14] = me[14];
      te[15] = me[15];
      return this;
    }
    /**
     * 四维矩阵位置信息复制
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix4} 复制结果
     */

  }, {
    key: "copyPosition",
    value: function copyPosition(m) {
      var te = this.elements;
      var me = m.elements;
      te[12] = me[12];
      te[13] = me[13];
      te[14] = me[14];
      return this;
    }
    /**
     * 由三维矩阵构建四维矩阵
     * @param {Matrix3} m 三维矩阵
     * @return {Matrix4} 构建结果
     */

  }, {
    key: "setFromMatrix3",
    value: function setFromMatrix3(m) {
      var me = m.elements;
      this.set(me[0], me[3], me[6], 0, me[1], me[4], me[7], 0, me[2], me[5], me[8], 0, 0, 0, 0, 1);
      return this;
    }
    /**
     * 导出四维矩阵[三维空间变换矩阵]分量
     * @param {Vec3} xAxis x轴分量
     * @param {Vec3} yAxis y轴分量
     * @param {Vec3} zAxis z轴分量
     * @return {Matrix4} 四维矩阵
     */

  }, {
    key: "extractBasis",
    value: function extractBasis(xAxis, yAxis, zAxis) {
      xAxis.setFromMatrixColumn(this, 0);
      yAxis.setFromMatrixColumn(this, 1);
      zAxis.setFromMatrixColumn(this, 2);
      return this;
    }
    /**
     * 由分量构建四维矩阵[三维空间变换矩阵]
     * @param {Vec3} xAxis x轴分量
     * @param {Vec3} yAxis y轴分量
     * @param {Vec3} zAxis z轴分量
     * @return {Matrix4} 四维矩阵
     */

  }, {
    key: "makeBasis",
    value: function makeBasis(xAxis, yAxis, zAxis) {
      this.set(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, 0, 0, 0, 1);
      return this;
    }
    /**
     * 导出四维矩阵[三维空间变换矩阵]旋转部分
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix4} 导出结果
     */

  }, {
    key: "extractRotation",
    value: function extractRotation(m) {
      // this method does not support reflection matrices
      var _v = new Vec3();

      var me = m.elements;
      var te = this.elements;

      var scaleX = 1 / _v.setFromMatrixColumn(m, 0).length();

      var scaleY = 1 / _v.setFromMatrixColumn(m, 1).length();

      var scaleZ = 1 / _v.setFromMatrixColumn(m, 2).length();

      te[0] = me[0] * scaleX;
      te[1] = me[1] * scaleX;
      te[2] = me[2] * scaleX;
      te[3] = 0;
      te[4] = me[4] * scaleY;
      te[5] = me[5] * scaleY;
      te[6] = me[6] * scaleY;
      te[7] = 0;
      te[8] = me[8] * scaleZ;
      te[9] = me[9] * scaleZ;
      te[10] = me[10] * scaleZ;
      te[11] = 0;
      te[12] = 0;
      te[13] = 0;
      te[14] = 0;
      te[15] = 1;
      return this;
    }
    /**
     * 由欧拉角设置四维矩阵
     * @param {Euler} euler 欧拉角
     * @return {Matrix4} 四维矩阵
     */

  }, {
    key: "makeRotationFromEuler",
    value: function makeRotationFromEuler(euler) {
      var te = this.elements;
      var x = euler.x;
      var y = euler.y;
      var z = euler.z;
      var a = Math.cos(x);
      var b = Math.sin(x);
      var c = Math.cos(y);
      var d = Math.sin(y);
      var e = Math.cos(z);
      var f = Math.sin(z);

      if (euler.order === exports.EulerOrder.XYZ) {
        var ae = a * e;
        var af = a * f;
        var be = b * e;
        var bf = b * f;
        te[0] = c * e;
        te[4] = -c * f;
        te[8] = d;
        te[1] = af + be * d;
        te[5] = ae - bf * d;
        te[9] = -b * c;
        te[2] = bf - ae * d;
        te[6] = be + af * d;
        te[10] = a * c;
      } else if (euler.order === exports.EulerOrder.YXZ) {
        var ce = c * e;
        var cf = c * f;
        var de = d * e;
        var df = d * f;
        te[0] = ce + df * b;
        te[4] = de * b - cf;
        te[8] = a * d;
        te[1] = a * f;
        te[5] = a * e;
        te[9] = -b;
        te[2] = cf * b - de;
        te[6] = df + ce * b;
        te[10] = a * c;
      } else if (euler.order === exports.EulerOrder.ZXY) {
        var _ce = c * e;

        var _cf = c * f;

        var _de = d * e;

        var _df = d * f;

        te[0] = _ce - _df * b;
        te[4] = -a * f;
        te[8] = _de + _cf * b;
        te[1] = _cf + _de * b;
        te[5] = a * e;
        te[9] = _df - _ce * b;
        te[2] = -a * d;
        te[6] = b;
        te[10] = a * c;
      } else if (euler.order === exports.EulerOrder.ZYX) {
        var _ae = a * e;

        var _af = a * f;

        var _be = b * e;

        var _bf = b * f;

        te[0] = c * e;
        te[4] = _be * d - _af;
        te[8] = _ae * d + _bf;
        te[1] = c * f;
        te[5] = _bf * d + _ae;
        te[9] = _af * d - _be;
        te[2] = -d;
        te[6] = b * c;
        te[10] = a * c;
      } else if (euler.order === exports.EulerOrder.YZX) {
        var ac = a * c;
        var ad = a * d;
        var bc = b * c;
        var bd = b * d;
        te[0] = c * e;
        te[4] = bd - ac * f;
        te[8] = bc * f + ad;
        te[1] = f;
        te[5] = a * e;
        te[9] = -b * e;
        te[2] = -d * e;
        te[6] = ad * f + bc;
        te[10] = ac - bd * f;
      } else if (euler.order === exports.EulerOrder.XZY) {
        var _ac = a * c;

        var _ad = a * d;

        var _bc = b * c;

        var _bd = b * d;

        te[0] = c * e;
        te[4] = -f;
        te[8] = d * e;
        te[1] = _ac * f + _bd;
        te[5] = a * e;
        te[9] = _ad * f - _bc;
        te[2] = _bc * f - _ad;
        te[6] = b * e;
        te[10] = _bd * f + _ac;
      } // bottom row


      te[3] = 0;
      te[7] = 0;
      te[11] = 0; // last column

      te[12] = 0;
      te[13] = 0;
      te[14] = 0;
      te[15] = 1;
      return this;
    }
    /**
     * 由四元数这是四维矩阵
     * @param {Quaternion} q 四元数
     * @return {Matrix4} 四维矩阵
     */

  }, {
    key: "makeRotationFromQuaternion",
    value: function makeRotationFromQuaternion(q) {
      return this.compose(new Vec3(), q, new Vec3());
    }
    /**
     * 由相机位置与目标位置以及向上方向设置四维矩阵[相机视图矩阵]
     * @param {Vec3} eye 相机位置
     * @param {Vec3} target 目标位置
     * @param {Vec3} up 相机方向
     * @return {Matrix4} 四维矩阵[相机视图矩阵]
     */

  }, {
    key: "lookAt",
    value: function lookAt(eye, target, up) {
      var a = new Vec3();
      var b = new Vec3();
      var c = new Vec3();
      var te = this.elements;
      c.subVectors(eye, target);

      if (c.lengthSq() === 0) {
        // eye and target are in the same position
        c.z = 1;
      }

      c.normalize();
      a.crossVectors(up, c);

      if (a.lengthSq() === 0) {
        // up and z are parallel
        if (Math.abs(up.z) === 1) {
          c.x += 0.0001;
        } else {
          c.z += 0.0001;
        }

        c.normalize();
        a.crossVectors(up, c);
      }

      a.normalize();
      b.crossVectors(c, a);
      te[0] = a.x;
      te[4] = b.x;
      te[8] = c.x;
      te[1] = a.y;
      te[5] = b.y;
      te[9] = c.y;
      te[2] = a.z;
      te[6] = b.z;
      te[10] = c.z;
      return this;
    }
    /**
     * 四维矩阵右乘
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix4} 右乘结果
     */

  }, {
    key: "multiply",
    value: function multiply(m) {
      return this.multiplyMatrices(this, m);
    }
    /**
     * 四维矩阵左乘
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix4} 左乘结果
     */

  }, {
    key: "premultiply",
    value: function premultiply(m) {
      return this.multiplyMatrices(m, this);
    }
    /**
     * 四维矩阵相乘(a * b)
     * @param {Matrix4} a 四维矩阵
     * @param {Matrix4} b 四维矩阵
     * @return {Matrix4} 相乘结果
     */

  }, {
    key: "multiplyMatrices",
    value: function multiplyMatrices(a, b) {
      var ae = a.elements;
      var be = b.elements;
      var te = this.elements;
      var a11 = ae[0];
      var a12 = ae[4];
      var a13 = ae[8];
      var a14 = ae[12];
      var a21 = ae[1];
      var a22 = ae[5];
      var a23 = ae[9];
      var a24 = ae[13];
      var a31 = ae[2];
      var a32 = ae[6];
      var a33 = ae[10];
      var a34 = ae[14];
      var a41 = ae[3];
      var a42 = ae[7];
      var a43 = ae[11];
      var a44 = ae[15];
      var b11 = be[0];
      var b12 = be[4];
      var b13 = be[8];
      var b14 = be[12];
      var b21 = be[1];
      var b22 = be[5];
      var b23 = be[9];
      var b24 = be[13];
      var b31 = be[2];
      var b32 = be[6];
      var b33 = be[10];
      var b34 = be[14];
      var b41 = be[3];
      var b42 = be[7];
      var b43 = be[11];
      var b44 = be[15];
      te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
      te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
      te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
      te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
      te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
      te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
      te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
      te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
      te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
      te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
      te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
      te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
      te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
      te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
      te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
      te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
      return this;
    }
    /**
     * 四维矩阵缩放
     * @param {number} s 缩放比例
     * @return {Matrix4} 缩放结果
     */

  }, {
    key: "multiplyScalar",
    value: function multiplyScalar(s) {
      var te = this.elements;
      te[0] *= s;
      te[4] *= s;
      te[8] *= s;
      te[12] *= s;
      te[1] *= s;
      te[5] *= s;
      te[9] *= s;
      te[13] *= s;
      te[2] *= s;
      te[6] *= s;
      te[10] *= s;
      te[14] *= s;
      te[3] *= s;
      te[7] *= s;
      te[11] *= s;
      te[15] *= s;
      return this;
    }
    /**
     * 四维矩阵求行列式值
     * @return {number} 行列式值
     */

  }, {
    key: "determinant",
    value: function determinant() {
      var te = this.elements;
      var n11 = te[0];
      var n12 = te[4];
      var n13 = te[8];
      var n14 = te[12];
      var n21 = te[1];
      var n22 = te[5];
      var n23 = te[9];
      var n24 = te[13];
      var n31 = te[2];
      var n32 = te[6];
      var n33 = te[10];
      var n34 = te[14];
      var n41 = te[3];
      var n42 = te[7];
      var n43 = te[11];
      var n44 = te[15];
      return n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) + n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
    }
    /**
     * 四维矩阵转置
     * @return {Matrix4} 转置结果
     */

  }, {
    key: "transpose",
    value: function transpose() {
      var te = this.elements;
      var tmp;
      tmp = te[1];
      te[1] = te[4];
      te[4] = tmp;
      tmp = te[2];
      te[2] = te[8];
      te[8] = tmp;
      tmp = te[6];
      te[6] = te[9];
      te[9] = tmp;
      tmp = te[3];
      te[3] = te[12];
      te[12] = tmp;
      tmp = te[7];
      te[7] = te[13];
      te[13] = tmp;
      tmp = te[11];
      te[11] = te[14];
      te[14] = tmp;
      return this;
    }
    /**
     * 设置四维矩阵[三维空间变换矩阵]位置信息
     * @param {number|Vec3} x 位置信息
     * @param {number} [y=x] y轴位置信息
     * @param {number} [z=x] z轴位置信息
     * @return {Matrix4}
     */

  }, {
    key: "setPosition",
    value: function setPosition(x, y, z) {
      var te = this.elements;

      if (x instanceof Vec3) {
        te[12] = x.x;
        te[13] = x.y;
        te[14] = x.z;
      } else {
        te[12] = x;
        te[13] = y ? y : x;
        te[14] = z ? z : x;
      }

      return this;
    }
    /**
     * 四维矩阵求逆
     * @return {Matrix4} 逆矩阵
     */

  }, {
    key: "invert",
    value: function invert() {
      // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
      var te = this.elements;
      var n11 = te[0];
      var n21 = te[1];
      var n31 = te[2];
      var n41 = te[3];
      var n12 = te[4];
      var n22 = te[5];
      var n32 = te[6];
      var n42 = te[7];
      var n13 = te[8];
      var n23 = te[9];
      var n33 = te[10];
      var n43 = te[11];
      var n14 = te[12];
      var n24 = te[13];
      var n34 = te[14];
      var n44 = te[15];
      var t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
      var t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
      var t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
      var t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
      var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

      if (det === 0) {
        return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      }

      var detInv = 1 / det;
      te[0] = t11 * detInv;
      te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
      te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
      te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
      te[4] = t12 * detInv;
      te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
      te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
      te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
      te[8] = t13 * detInv;
      te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
      te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
      te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
      te[12] = t14 * detInv;
      te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
      te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
      te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
      return this;
    }
    /**
     * 四维矩阵[三维空间变换矩阵]分轴缩放
     * @param {Vec3} v 分轴缩放向量
     * @return {Matrix4} 缩放结果
     */

  }, {
    key: "scale",
    value: function scale(v) {
      var te = this.elements;
      te[0] *= v.x;
      te[4] *= v.y;
      te[8] *= v.z;
      te[1] *= v.x;
      te[5] *= v.y;
      te[9] *= v.z;
      te[2] *= v.x;
      te[6] *= v.y;
      te[10] *= v.z;
      te[3] *= v.x;
      te[7] *= v.y;
      te[11] *= v.z;
      return this;
    }
    /**
     * 获取四维矩阵[三维空间变换矩阵]分轴缩放最大值
     * @return {number} 计算结果
     */

  }, {
    key: "getMaxScaleOnAxis",
    value: function getMaxScaleOnAxis() {
      var te = this.elements;
      var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
      var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
      var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
      return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
    }
    /**
     * 根据三维空间位移信息设置四维矩阵
     * @param {number} x x轴坐标信息
     * @param {number} y y轴坐标信息
     * @param {number} z z轴坐标信息
     * @return {Matrix4} 四维矩阵
     */

  }, {
    key: "makeTranslation",
    value: function makeTranslation(x, y, z) {
      this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
      return this;
    }
    /**
     * 根据x轴旋转信息设置四维矩阵
     * @param {number} theta x轴旋转弧度
     * @return {Matrix4} 四维矩阵
     */

  }, {
    key: "makeRotationX",
    value: function makeRotationX(theta) {
      var c = Math.cos(theta);
      var s = Math.sin(theta);
      this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);
      return this;
    }
    /**
     * 根据y轴旋转信息设置四维矩阵
     * @param {number} theta y轴旋转弧度
     * @return {Matrix4} 四维矩阵
     */

  }, {
    key: "makeRotationY",
    value: function makeRotationY(theta) {
      var c = Math.cos(theta);
      var s = Math.sin(theta);
      this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);
      return this;
    }
    /**
     * 根据z轴旋转信息设置四维矩阵
     * @param {number} theta z轴旋转弧度
     * @return {Matrix4} 四维矩阵
     */

  }, {
    key: "makeRotationZ",
    value: function makeRotationZ(theta) {
      var c = Math.cos(theta);
      var s = Math.sin(theta);
      this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      return this;
    }
    /**
     * 根据三维旋转轴与弧度设置四维矩阵
     * @param {Vec3} axis 三维旋转轴
     * @param {number} angle 旋转弧度
     * @return {Matrix4} 四维矩阵
     */

  }, {
    key: "makeRotationAxis",
    value: function makeRotationAxis(axis, angle) {
      // Based on http://www.gamedev.net/reference/articles/article1199.asp
      var c = Math.cos(angle);
      var s = Math.sin(angle);
      var t = 1 - c;
      var x = axis.x;
      var y = axis.y;
      var z = axis.z;
      var tx = t * x;
      var ty = t * y;
      this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
      return this;
    }
    /**
     * 根据缩放比例设置四维矩阵
     * @param {number} x 缩放比例
     * @param {number} [y=x] y方向缩放比例
     * @param {number} [z=x] z方向缩放比例
     * @return {Matrix4}
     */

  }, {
    key: "makeScale",
    value: function makeScale(x, y, z) {
      if (y === undefined || z === undefined) {
        this.set(x, 0, 0, 0, 0, x, 0, 0, 0, 0, x, 0, 0, 0, 0, 1);
      } else {
        this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
      }

      return this;
    }
    /**
     * 设置倾斜矩阵
     * @param {number} x x方向倾斜分量
     * @param {number} y y方向倾斜分量
     * @param {number} z z方向倾斜分量
     * @return {Matrix4} 倾斜矩阵
     */

  }, {
    key: "makeShear",
    value: function makeShear(x, y, z) {
      this.set(1, y, z, 0, x, 1, z, 0, x, y, 1, 0, 0, 0, 0, 1);
      return this;
    }
    /**
     * 根据基础信息组装四维矩阵
     * @param {Vec3} position 位置信息
     * @param {Euler|Quaternion} rotation 旋转信息
     * @param {Vec3} scale 缩放信息
     * @return {Matrix4} 四维矩阵
     */

  }, {
    key: "compose",
    value: function compose(position, rotation, scale) {
      var te = this.elements;

      if (rotation instanceof Euler || rotation instanceof Quaternion) {
        var quaternion = rotation instanceof Euler ? new Quaternion().setFromEuler(rotation) : rotation;
        var x = quaternion.x;
        var y = quaternion.y;
        var z = quaternion.z;
        var w = quaternion.w;
        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;
        var xx = x * x2;
        var xy = x * y2;
        var xz = x * z2;
        var yy = y * y2;
        var yz = y * z2;
        var zz = z * z2;
        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;
        var sx = scale.x;
        var sy = scale.y;
        var sz = scale.z;
        te[0] = (1 - (yy + zz)) * sx;
        te[1] = (xy + wz) * sx;
        te[2] = (xz - wy) * sx;
        te[3] = 0;
        te[4] = (xy - wz) * sy;
        te[5] = (1 - (xx + zz)) * sy;
        te[6] = (yz + wx) * sy;
        te[7] = 0;
        te[8] = (xz + wy) * sz;
        te[9] = (yz - wx) * sz;
        te[10] = (1 - (xx + yy)) * sz;
        te[11] = 0;
        te[12] = position.x;
        te[13] = position.y;
        te[14] = position.z;
        te[15] = 1;
        return this;
      } else {
        console.warn('Type of rotation can not be other type beside Euler or Quaternion.');
        return new Matrix4();
      }
    }
    /**
     * 四维矩阵拆分为基础信息
     * @param {Vec3} position 位置信息
     * @param {Quaternion} quaternion 旋转信息
     * @param {Vec3} scale 缩放信息
     * @returns 四维矩阵
     */

  }, {
    key: "decompose",
    value: function decompose(position, quaternion, scale) {
      var v = new Vec3();
      var m = new Matrix4();
      var te = this.elements;
      var sx = v.set(te[0], te[1], te[2]).length();
      var sy = v.set(te[4], te[5], te[6]).length();
      var sz = v.set(te[8], te[9], te[10]).length(); // if determine is negative, we need to invert one scale

      var det = this.determinant();

      if (det < 0) {
        sx = -sx;
      }

      position.x = te[12];
      position.y = te[13];
      position.z = te[14]; // scale the rotation part

      m.copy(this);
      var invSX = 1 / sx;
      var invSY = 1 / sy;
      var invSZ = 1 / sz;
      m.elements[0] *= invSX;
      m.elements[1] *= invSX;
      m.elements[2] *= invSX;
      m.elements[4] *= invSY;
      m.elements[5] *= invSY;
      m.elements[6] *= invSY;
      m.elements[8] *= invSZ;
      m.elements[9] *= invSZ;
      m.elements[10] *= invSZ;
      quaternion.setFromRotationMatrix(m);
      scale.x = sx;
      scale.y = sy;
      scale.z = sz;
      return this;
    }
    /**
     * 根据视窗信息设置透视相机投影矩阵
     * @param {number} left 视窗左平面位置
     * @param {number} right 视窗右平面位置
     * @param {number} top 视窗上平面位置
     * @param {number} bottom 视窗下平面位置
     * @param {number} near 视窗近平面位置
     * @param {number} far 视窗远平面位置
     * @return {Matrix4} 四维矩阵
     */

  }, {
    key: "makePerspective",
    value: function makePerspective(left, right, top, bottom, near, far) {
      var te = this.elements;
      var x = 2 * near / (right - left);
      var y = 2 * near / (top - bottom);
      var a = (right + left) / (right - left);
      var b = (top + bottom) / (top - bottom);
      var c = -(far + near) / (far - near);
      var d = -2 * far * near / (far - near);
      te[0] = x;
      te[4] = 0;
      te[8] = a;
      te[12] = 0;
      te[1] = 0;
      te[5] = y;
      te[9] = b;
      te[13] = 0;
      te[2] = 0;
      te[6] = 0;
      te[10] = c;
      te[14] = d;
      te[3] = 0;
      te[7] = 0;
      te[11] = -1;
      te[15] = 0;
      return this;
    }
    /**
     * 根据视窗信息设置正交相机投影矩阵
     * @param {number} left 视窗左平面位置
     * @param {number} right 视窗右平面位置
     * @param {number} top 视窗上平面位置
     * @param {number} bottom 视窗下平面位置
     * @param {number} near 视窗近平面位置
     * @param {number} far 视窗远平面位置
     * @return {Matrix4} 四维矩阵
     */

  }, {
    key: "makeOrthographic",
    value: function makeOrthographic(left, right, top, bottom, near, far) {
      var te = this.elements;
      var w = 1.0 / (right - left);
      var h = 1.0 / (top - bottom);
      var p = 1.0 / (far - near);
      var x = (right + left) * w;
      var y = (top + bottom) * h;
      var z = (far + near) * p;
      te[0] = 2 * w;
      te[4] = 0;
      te[8] = 0;
      te[12] = -x;
      te[1] = 0;
      te[5] = 2 * h;
      te[9] = 0;
      te[13] = -y;
      te[2] = 0;
      te[6] = 0;
      te[10] = -2 * p;
      te[14] = -z;
      te[3] = 0;
      te[7] = 0;
      te[11] = 0;
      te[15] = 1;
      return this;
    }
    /**
     * 四维矩阵判等
     * @param {Matrix4} matrix 四维矩阵
     * @return {boolean} 判等结果
     */

  }, {
    key: "equals",
    value: function equals(matrix) {
      var te = this.elements;
      var me = matrix.elements;

      for (var i = 0; i < 16; i++) {
        if (te[i] !== me[i]) {
          return false;
        }
      }

      return true;
    }
    /**
     * 由数组设置四维矩阵
     * @param {number[]} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Matrix4} 四维矩阵
     */

  }, {
    key: "fromArray",
    value: function fromArray(array) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      for (var i = 0; i < 16; i++) {
        this.elements[i] = array[i + offset];
      }

      return this;
    }
    /**
     * 四维矩阵转数组
     * @param {number[]} [array=[]] 结果保存对象
     * @param {number} [offset=0] 保存起始偏移值
     * @return {number[]} 四维矩阵
     */

  }, {
    key: "toArray",
    value: function toArray() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var te = this.elements;
      array[offset] = te[0];
      array[offset + 1] = te[1];
      array[offset + 2] = te[2];
      array[offset + 3] = te[3];
      array[offset + 4] = te[4];
      array[offset + 5] = te[5];
      array[offset + 6] = te[6];
      array[offset + 7] = te[7];
      array[offset + 8] = te[8];
      array[offset + 9] = te[9];
      array[offset + 10] = te[10];
      array[offset + 11] = te[11];
      array[offset + 12] = te[12];
      array[offset + 13] = te[13];
      array[offset + 14] = te[14];
      array[offset + 15] = te[15];
      return array;
    }
  }], [{
    key: "clone",
    value: function clone(other) {
      var result = new Matrix4();
      result.elements = _toConsumableArray(other.elements);
      return result;
    }
    /**
     * @static 由透视相机基础参数设置投影矩阵
     * @param {number} near 近平面
     * @param {number} far 远平面
     * @param {number} fov 视角
     * @param {number} aspect 视窗比例
     * @param {number} clipMode 裁切模式, 0表示垂直裁切, 1表示水平裁切
     * @return {Matrix4} 投影矩阵
     */

  }, {
    key: "makePerspective",
    value: function makePerspective(near, far, fov, aspect, clipMode) {
      var ratio = clipMode ? aspect : 1;
      var matrix = new Matrix4();
      var te = matrix.elements;
      var f = 1.0 / Math.tan(fov * DEG2RAD / 2) * ratio;
      var a = f / aspect;
      var b = -(near + far) / (far - near);
      var c = -2 * near * far / (far - near);
      te[0] = a;
      te[4] = 0;
      te[8] = 0;
      te[12] = 0;
      te[1] = 0;
      te[5] = f;
      te[9] = 0;
      te[13] = 0;
      te[2] = 0;
      te[6] = 0;
      te[10] = b;
      te[14] = c;
      te[3] = 0;
      te[7] = 0;
      te[11] = -1;
      te[15] = 0;
      return matrix;
    }
  }]);

  return Matrix4;
}();

exports.EulerOrder = void 0;

(function (EulerOrder) {
  EulerOrder[EulerOrder["XYZ"] = 0] = "XYZ";
  EulerOrder[EulerOrder["XZY"] = 1] = "XZY";
  EulerOrder[EulerOrder["YXZ"] = 2] = "YXZ";
  EulerOrder[EulerOrder["YZX"] = 3] = "YZX";
  EulerOrder[EulerOrder["ZXY"] = 4] = "ZXY";
  EulerOrder[EulerOrder["ZYX"] = 5] = "ZYX";
})(exports.EulerOrder || (exports.EulerOrder = {}));
/**
 * @class 欧拉角
 */


var Euler = /*#__PURE__*/function () {
  /**
   * 构造函数,传入值为x, y, z方向分量以及欧拉角计算顺序
   * @param {number} x x方向分量
   * @param {number} y y方向分量
   * @param {number} z z方向分量
   * @param {EulerOrder} order 欧拉角顺序，默认为XYZ顺序
   */
  function Euler() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var order = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : exports.EulerOrder.XYZ;

    _classCallCheck(this, Euler);

    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }
  /**
   * 设置欧拉角
   * @param {number} x x方向分量
   * @param {number} y y方向分量
   * @param {number} z z方向分量
   * @param {EulerOrder} [order='XYZ'] 欧拉角顺序，默认为XYZ顺序
   * @return {Euler}
   */


  _createClass(Euler, [{
    key: "set",
    value: function set(x, y, z) {
      var order = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : exports.EulerOrder.XYZ;
      this.x = x;
      this.y = y;
      this.z = z;
      this.order = order;
      this.onChangeCallback();
      return this;
    }
    /**
     * 克隆欧拉角
     * @return {Euler} 克隆结果
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Euler(this.x, this.y, this.z, this.order);
    }
    /**
     * 复制欧拉角
     * @param {Euler} euler 复制对象
     * @return {Euler} 复制结果
     */

  }, {
    key: "copy",
    value: function copy(euler) {
      this.x = euler.x;
      this.y = euler.y;
      this.z = euler.z;
      this.order = euler.order;
      this.onChangeCallback();
      return this;
    }
    /**
     * 有三维空间矩阵设置欧拉角
     * @param {Matrix4} m 三维空间矩阵
     * @param {EulerOrder} [order='XYZ'] 欧拉角顺序
     * @param {boolean} [update=true] 允许设置回调函数
     * @return {Euler} 构建结果
     */

  }, {
    key: "setFromRotationMatrix",
    value: function setFromRotationMatrix(m) {
      var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : exports.EulerOrder.XYZ;
      var update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var te = m.elements;
      var m11 = te[0];
      var m12 = te[4];
      var m13 = te[8];
      var m21 = te[1];
      var m22 = te[5];
      var m23 = te[9];
      var m31 = te[2];
      var m32 = te[6];
      var m33 = te[10];
      order = order || this.order;

      switch (order) {
        case exports.EulerOrder.XYZ:
          this.y = Math.asin(clamp(m13, -1, 1));

          if (Math.abs(m13) < 0.9999999) {
            this.x = Math.atan2(-m23, m33);
            this.z = Math.atan2(-m12, m11);
          } else {
            this.x = Math.atan2(m32, m22);
            this.z = 0;
          }

          break;

        case exports.EulerOrder.YXZ:
          this.x = Math.asin(-clamp(m23, -1, 1));

          if (Math.abs(m23) < 0.9999999) {
            this.y = Math.atan2(m13, m33);
            this.z = Math.atan2(m21, m22);
          } else {
            this.y = Math.atan2(-m31, m11);
            this.z = 0;
          }

          break;

        case exports.EulerOrder.ZXY:
          this.x = Math.asin(clamp(m32, -1, 1));

          if (Math.abs(m32) < 0.9999999) {
            this.y = Math.atan2(-m31, m33);
            this.z = Math.atan2(-m12, m22);
          } else {
            this.y = 0;
            this.z = Math.atan2(m21, m11);
          }

          break;

        case exports.EulerOrder.ZYX:
          this.y = Math.asin(-clamp(m31, -1, 1));

          if (Math.abs(m31) < 0.9999999) {
            this.x = Math.atan2(m32, m33);
            this.z = Math.atan2(m21, m11);
          } else {
            this.x = 0;
            this.z = Math.atan2(-m12, m22);
          }

          break;

        case exports.EulerOrder.YZX:
          this.z = Math.asin(clamp(m21, -1, 1));

          if (Math.abs(m21) < 0.9999999) {
            this.x = Math.atan2(-m23, m22);
            this.y = Math.atan2(-m31, m11);
          } else {
            this.x = 0;
            this.y = Math.atan2(m13, m33);
          }

          break;

        case exports.EulerOrder.XZY:
          this.z = Math.asin(-clamp(m12, -1, 1));

          if (Math.abs(m12) < 0.9999999) {
            this.x = Math.atan2(m32, m22);
            this.y = Math.atan2(m13, m11);
          } else {
            this.x = Math.atan2(-m23, m33);
            this.y = 0;
          }

          break;

        default:
          console.warn('THREE.Euler: .setFromRotationMatrix() encountered an unknown order: ' + order);
      }

      this.order = order;

      if (update !== false) {
        this.onChangeCallback();
      }

      return this;
    }
    /**
     * 由四元数构建欧拉角
     * @param {Quaternion} q 四元数
     * @param {EulerOrder} [order='XYZ'] 欧拉角顺序，默认为XYZ
     * @param {boolean} [update=true] 允许设置回调函数
     * @return {Euler} 构建结果
     */

  }, {
    key: "setFromQuaternion",
    value: function setFromQuaternion(q) {
      var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : exports.EulerOrder.XYZ;
      var update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var matrix = new Matrix4();
      matrix.makeRotationFromQuaternion(q);
      return this.setFromRotationMatrix(matrix, order, update);
    }
    /**
     * 有三维向量构建欧拉角
     * @param {Vec3} v 三维向量
     * @param {EulerOrder} [order] 欧拉角顺序，默认为XYZ
     * @return {Euler} 欧拉角
     */

  }, {
    key: "setFromVector3",
    value: function setFromVector3(v, order) {
      return this.set(v.x, v.y, v.z, order || this.order);
    }
    /**
     * 修改欧拉角顺序
     * @param {EulerOrder} newOrder 欧拉角顺序
     * @return {Euler} 修改结果
     */

  }, {
    key: "reorder",
    value: function reorder(newOrder) {
      var quaternion = new Quaternion();
      quaternion.setFromEuler(this);
      return this.setFromQuaternion(quaternion, newOrder);
    }
    /**
     * 欧拉角判等
     * @param {Euler} euler 欧拉角
     * @return {boolean} 判等结果
     */

  }, {
    key: "equals",
    value: function equals(euler) {
      return euler.x === this.x && euler.y === this.y && euler.z === this.z && euler.order === this.order;
    }
    /**
     * 由数组构建欧拉角
     * @param {number[]} array 数组
     * @return {Euler} 构建结果
     */

  }, {
    key: "fromArray",
    value: function fromArray(array) {
      this.x = array[0];
      this.y = array[1];
      this.z = array[2];

      if (array[3] !== undefined) {
        this.order = array[3];
      }

      this.onChangeCallback();
      return this;
    }
    /**
     * 欧拉角保存于数组(应用于计算)
     * @param {number[]} [array=[]] 目标保存对象
     * @param {number} [offset=0] 起始偏移值
     * @return {number[]} 保存结果
     */

  }, {
    key: "toArray",
    value: function toArray() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      array[offset] = this.x;
      array[offset + 1] = this.y;
      array[offset + 2] = this.z;
      array[offset + 3] = this.order;
      return array;
    }
    /**
     * 欧拉角保存于三维向量(应用于计算)
     * @param {Vec3} [optionalResult] 目标保存对象
     * @return {Vec3} 保存结果
     */

  }, {
    key: "toVector3",
    value: function toVector3(optionalResult) {
      if (optionalResult) {
        return optionalResult.set(this.x, this.y, this.z);
      } else {
        return new Vec3(this.x, this.y, this.z);
      }
    }
    /**
     * 欧拉角变更回调函数
     * @param {function} callback 回调函数
     * @return {Euler} 欧拉角
     */

  }, {
    key: "onChange",
    value: function onChange(callback) {
      this.onChangeCallback = callback;
      return this;
    }
  }, {
    key: "onChangeCallback",
    value: function onChangeCallback() {}
  }]);

  return Euler;
}();

/**
 * @class 四元数
 */

var Quaternion = /*#__PURE__*/function () {
  /**
   * 四元数构造函数，默认为单位值
   * @param {number} [x=0] x分量
   * @param {number} [y=0] y分量
   * @param {number} [z=0] z分量
   * @param {number} [w=1] w分量
   */
  function Quaternion() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    _classCallCheck(this, Quaternion);

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  /**
   * 设置四元数的值
   * @param {number} x x分量
   * @param {number} y y分量
   * @param {number} z z分量
   * @param {number} w w分量
   * @return {Quaternion} 四元数
   */


  _createClass(Quaternion, [{
    key: "set",
    value: function set(x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
      this.onChangeCallback();
      return this;
    }
    /**
     * 四元数克隆
     * @return {Quaternion} 克隆结果
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Quaternion(this.x, this.y, this.z, this.w);
    }
    /**
     * 深拷贝四元数
     * @param {Quaternion} quaternion
     * @return {Quaternion}
     */

  }, {
    key: "copy",
    value: function copy(quaternion) {
      this.x = quaternion.x;
      this.y = quaternion.y;
      this.z = quaternion.z;
      this.w = quaternion.w;
      this.onChangeCallback();
      return this;
    }
    /**
     * 由欧拉角设置四元数
     * @param {Euler} euler 欧拉角
     * @param {boolean} [update] 是否触发回调
     * @return {Quaternion} 四元数
     */

  }, {
    key: "setFromEuler",
    value: function setFromEuler(euler, update) {
      var cos = Math.cos;
      var sin = Math.sin;
      var c1 = cos(euler.x / 2);
      var c2 = cos(euler.y / 2);
      var c3 = cos(euler.z / 2);
      var s1 = sin(euler.x / 2);
      var s2 = sin(euler.y / 2);
      var s3 = sin(euler.z / 2);

      switch (euler.order) {
        case exports.EulerOrder.XYZ:
          this.x = s1 * c2 * c3 + c1 * s2 * s3;
          this.y = c1 * s2 * c3 - s1 * c2 * s3;
          this.z = c1 * c2 * s3 + s1 * s2 * c3;
          this.w = c1 * c2 * c3 - s1 * s2 * s3;
          break;

        case exports.EulerOrder.YXZ:
          this.x = s1 * c2 * c3 + c1 * s2 * s3;
          this.y = c1 * s2 * c3 - s1 * c2 * s3;
          this.z = c1 * c2 * s3 - s1 * s2 * c3;
          this.w = c1 * c2 * c3 + s1 * s2 * s3;
          break;

        case exports.EulerOrder.ZXY:
          this.x = s1 * c2 * c3 - c1 * s2 * s3;
          this.y = c1 * s2 * c3 + s1 * c2 * s3;
          this.z = c1 * c2 * s3 + s1 * s2 * c3;
          this.w = c1 * c2 * c3 - s1 * s2 * s3;
          break;

        case exports.EulerOrder.ZYX:
          this.x = s1 * c2 * c3 - c1 * s2 * s3;
          this.y = c1 * s2 * c3 + s1 * c2 * s3;
          this.z = c1 * c2 * s3 - s1 * s2 * c3;
          this.w = c1 * c2 * c3 + s1 * s2 * s3;
          break;

        case exports.EulerOrder.YZX:
          this.x = s1 * c2 * c3 + c1 * s2 * s3;
          this.y = c1 * s2 * c3 + s1 * c2 * s3;
          this.z = c1 * c2 * s3 - s1 * s2 * c3;
          this.w = c1 * c2 * c3 - s1 * s2 * s3;
          break;

        case exports.EulerOrder.XZY:
          this.x = s1 * c2 * c3 - c1 * s2 * s3;
          this.y = c1 * s2 * c3 - s1 * c2 * s3;
          this.z = c1 * c2 * s3 + s1 * s2 * c3;
          this.w = c1 * c2 * c3 + s1 * s2 * s3;
          break;

        default:
          console.warn('THREE.Quaternion: .setFromEuler() encountered an unknown order: ' + euler.order);
      }

      if (update !== false) {
        this.onChangeCallback();
      }

      return this;
    }
    /**
     * 由旋转轴和旋转角度设置四元数
     * @param {Vec3} axis 旋转轴
     * @param {number} angle 旋转角
     * @return {Quaternion} 四元数
     */

  }, {
    key: "setFromAxisAngle",
    value: function setFromAxisAngle(axis, angle) {
      var halfAngle = angle / 2;
      var s = Math.sin(halfAngle);
      this.x = axis.x * s;
      this.y = axis.y * s;
      this.z = axis.z * s;
      this.w = Math.cos(halfAngle);
      this.onChangeCallback();
      return this;
    }
    /**
     * 由空间变换矩阵设置四元数
     * @param {Matrix4} m 四维矩阵
     * @return {Quaternion} 四元数
     */

  }, {
    key: "setFromRotationMatrix",
    value: function setFromRotationMatrix(m) {
      var te = m.elements;
      var m11 = te[0];
      var m12 = te[4];
      var m13 = te[8];
      var m21 = te[1];
      var m22 = te[5];
      var m23 = te[9];
      var m31 = te[2];
      var m32 = te[6];
      var m33 = te[10];
      var trace = m11 + m22 + m33;

      if (trace > 0) {
        var s = 0.5 / Math.sqrt(trace + 1.0);
        this.w = 0.25 / s;
        this.x = (m32 - m23) * s;
        this.y = (m13 - m31) * s;
        this.z = (m21 - m12) * s;
      } else if (m11 > m22 && m11 > m33) {
        var _s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

        this.w = (m32 - m23) / _s;
        this.x = 0.25 * _s;
        this.y = (m12 + m21) / _s;
        this.z = (m13 + m31) / _s;
      } else if (m22 > m33) {
        var _s2 = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

        this.w = (m13 - m31) / _s2;
        this.x = (m12 + m21) / _s2;
        this.y = 0.25 * _s2;
        this.z = (m23 + m32) / _s2;
      } else {
        var _s3 = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

        this.w = (m21 - m12) / _s3;
        this.x = (m13 + m31) / _s3;
        this.y = (m23 + m32) / _s3;
        this.z = 0.25 * _s3;
      }

      this.onChangeCallback();
      return this;
    }
  }, {
    key: "setFromUnitVectors",
    value: function setFromUnitVectors(vFrom, vTo) {
      // assumes direction vectors vFrom and vTo are normalized
      var r = vFrom.dot(vTo) + 1;

      if (r < epsilon) {
        r = 0;

        if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
          this.x = -vFrom.y;
          this.y = vFrom.x;
          this.z = 0;
          this.w = r;
        } else {
          this.x = 0;
          this.y = -vFrom.z;
          this.z = vFrom.y;
          this.w = r;
        }
      } else {
        // crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
        this.x = vFrom.y * vTo.z - vFrom.z * vTo.y;
        this.y = vFrom.z * vTo.x - vFrom.x * vTo.z;
        this.z = vFrom.x * vTo.y - vFrom.y * vTo.x;
        this.w = r;
      }

      return this.normalize();
    }
    /**
     * 与四元数other之间的夹角
     * @param {Quaternion} other 四元数
     * @return {number} 夹角
     */

  }, {
    key: "angleTo",
    value: function angleTo(other) {
      return 2 * Math.acos(Math.abs(clamp(this.dot(other), -1, 1)));
    } // TODO

    /**
     * 四元数向目标旋转
     * @param {Quaternion} q 四元数
     * @param {number} step 旋转弧度
     * @return {Quaternion} 目标四元数
     */

  }, {
    key: "rotateTowards",
    value: function rotateTowards(q, step) {
      var angle = this.angleTo(q);

      if (angle === 0) {
        return this;
      }

      var t = Math.min(1, step / angle);
      this.slerp(q, t);
      return this;
    }
    /**
     * 四元数单位化
     * @return {Quaternion} 单位四元数
     */

  }, {
    key: "identity",
    value: function identity() {
      return this.set(0, 0, 0, 1);
    }
    /**
     * 四元数求逆
     * @return {Quaternion} 四元数的逆
     */

  }, {
    key: "invert",
    value: function invert() {
      // quaternion is assumed to have unit length
      return this.conjugate();
    }
    /**
     * 四元数求共轭值
     * @return {Quaternion} 四元数的共轭值
     */

  }, {
    key: "conjugate",
    value: function conjugate() {
      this.x *= -1;
      this.y *= -1;
      this.z *= -1;
      this.onChangeCallback();
      return this;
    }
    /**
     * 四元数点乘结果
     * @param {Quaternion} v
     * @return {number}
     */

  }, {
    key: "dot",
    value: function dot(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }
    /**
     * 四元数的模平方
     * @return {number}
     */

  }, {
    key: "lengthSq",
    value: function lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    /**
     * 四元数的欧式长度
     * @return {number} 长度
     */

  }, {
    key: "length",
    value: function length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    /**
     * 四元数归一化
     * @return {Quaternion} 归一化值
     */

  }, {
    key: "normalize",
    value: function normalize() {
      var l = this.length();

      if (l === 0) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
      } else {
        l = 1 / l;
        this.x = this.x * l;
        this.y = this.y * l;
        this.z = this.z * l;
        this.w = this.w * l;
      }

      this.onChangeCallback();
      return this;
    }
    /**
     * 右乘四元数other
     * @param {Quaternion} other
     * @return {Quaternion}
     */

  }, {
    key: "multiply",
    value: function multiply(other) {
      return this.multiplyQuaternions(this, other);
    }
    /**
     * 左乘四元数other
     * @param {Quaternion} other
     * @return {Quaternion}
     */

  }, {
    key: "premultiply",
    value: function premultiply(other) {
      return this.multiplyQuaternions(other, this);
    }
    /**
     * 四元数乘法(a * b)
     * @param {Quaternion} a 四元数
     * @param {Quaternion} b 四元数
     * @return {Quaternion} 四元数
     */

  }, {
    key: "multiplyQuaternions",
    value: function multiplyQuaternions(a, b) {
      // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
      var qax = a.x;
      var qay = a.y;
      var qaz = a.z;
      var qaw = a.w;
      var qbx = b.x;
      var qby = b.y;
      var qbz = b.z;
      var qbw = b.w;
      this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
      this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
      this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
      this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
      this.onChangeCallback();
      return this;
    }
    /**
     * 与四元数other取线性插值
     * @see http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
     * @param {Quaternion} other 四元数
     * @param {number} t 插值比
     * @return {Quaternion} 插值结果
     */

  }, {
    key: "slerp",
    value: function slerp(other, t) {
      if (t === 0) {
        return this;
      }

      if (t === 1) {
        return this.copy(other);
      }

      var x = this.x,
          y = this.y,
          z = this.z,
          w = this.w;
      var cosHalfTheta = w * other.w + x * other.x + y * other.y + z * other.z;

      if (cosHalfTheta < 0) {
        this.w = -other.w;
        this.x = -other.x;
        this.y = -other.y;
        this.z = -other.z;
        cosHalfTheta = -cosHalfTheta;
      } else {
        this.copy(other);
      }

      if (cosHalfTheta >= 1.0) {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
      }

      var sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

      if (sqrSinHalfTheta <= epsilon) {
        var s = 1 - t;
        this.w = s * w + t * this.w;
        this.x = s * x + t * this.x;
        this.y = s * y + t * this.y;
        this.z = s * z + t * this.z;
        this.normalize();
        this.onChangeCallback();
        return this;
      }

      var sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
      var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
      var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
      var ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
      this.w = w * ratioA + this.w * ratioB;
      this.x = x * ratioA + this.x * ratioB;
      this.y = y * ratioA + this.y * ratioB;
      this.z = z * ratioA + this.z * ratioB;
      this.onChangeCallback();
      return this;
    }
    /**
     * 取两个四元数的线性插值
     * @param {Quaternion} qa 四元数
     * @param {Quaternion} qb 四元数
     * @param {number} t 插值比
     */

  }, {
    key: "slerpQuaternions",
    value: function slerpQuaternions(qa, qb, t) {
      this.copy(qa).slerp(qb, t);
    }
    /**
     * 四元数判等
     * @param {Quaternion} quaternion 四元数
     * @return {boolean} 判等结果
     */

  }, {
    key: "equals",
    value: function equals(quaternion) {
      return quaternion.x === this.x && quaternion.y === this.y && quaternion.z === this.z && quaternion.w === this.w;
    }
    /**
     * 由数组获取四元数
     * @param {number[]} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Quaternion} 四元数
     */

  }, {
    key: "fromArray",
    value: function fromArray(array) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.x = array[offset];
      this.y = array[offset + 1];
      this.z = array[offset + 2];
      this.w = array[offset + 3];
      this.onChangeCallback();
      return this;
    }
    /**
     * 四元数保存为数组
     * @param {number[]} [array=[]] 目标保存结果
     * @param {number} [offset=0] 保存起始偏移值
     * @return {number[]} 数组
     */

  }, {
    key: "toArray",
    value: function toArray() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      array[offset] = this.x;
      array[offset + 1] = this.y;
      array[offset + 2] = this.z;
      array[offset + 3] = this.w;
      return array;
    }
    /**
     * 四元数回调函数
     * @param {funciton} callback 回调函数
     * @return {Quaternion} 四元数
     */

  }, {
    key: "onChange",
    value: function onChange(callback) {
      this.onChangeCallback = callback;
      return this;
    }
    /**
     * 四元数回调函数
     */

  }, {
    key: "onChangeCallback",
    value: function onChangeCallback() {}
  }]);

  return Quaternion;
}();

/**
 * @class 三维向量
 */

var Vec3 = /*#__PURE__*/function () {
  /**
   * 构造函数，默认值为三维零向量 | 三维原点
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   */
  function Vec3() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, Vec3);

    this.x = x;
    this.y = y;
    this.z = z;
  }
  /**
   * @static 克隆三维向量
   * @param {Vec3} other 克隆对象
   * @return {Vec3} 克隆结果
   */


  _createClass(Vec3, [{
    key: "setByPart",
    value:
    /**
     * 由对象设置三维向量
     * @param {object} part 对象
     * @param {number} [part.x] x分量，默认值为0
     * @param {number} [part.y] y分量，默认值为0
     * @param {number} [part.z] z分量，默认值为0
     */
    function setByPart(part) {
      assign(this, part);
    }
    /**
     * @static 三维向量比例混合
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @param {number} [ratio=0.5] 混合比例
     * @return {Vec3} 三维向量
     */

  }, {
    key: "set",
    value:
    /**
     * 设置三维向量
     * @param {number|number[]} x 值，数字 | 数组
     * @param {number} [y=x] y轴分量，默认值为x轴分量
     * @param {number} [z=x] z轴分量，默认值为x轴分量
     * @return {Vec3} 三维向量
     */
    function set(x, y, z) {
      if (typeof x !== 'number') {
        if (x.length === 3) {
          this.x = x[0];
          this.y = x[1];
          this.z = x[2];
        } else {
          console.warn('Length of array input as Vec3 must be three');
          this.x = this.y = this.z = 0;
        }
      } else if (y !== undefined && z !== undefined) {
        this.x = x;
        this.y = y;
        this.z = z;
      } else {
        this.x = this.y = this.z = x;
      }

      return this;
    }
    /**
     * 三维向量根据下标转二维向量
     * @param {number} [index=2] 下标
     * @return {Vec2} 二维向量
     */

  }, {
    key: "toVec2",
    value: function toVec2() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
      var res = new Vec2();

      switch (index) {
        case 0:
          res.x = this.y;
          res.y = this.z;
          break;

        case 1:
          res.x = this.z;
          res.y = this.x;
          break;

        case 2:
        default:
          res.x = this.x;
          res.y = this.y;
          break;
      }

      return res;
    }
    /**
     * 克隆三维向量
     * @return {Vec3} 三维向量
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Vec3(this.x, this.y, this.z);
    }
    /**
     * 复制三维向量
     * @param {Vec3} v 复制对象
     * @return {Vec3} 三维向量
     */

  }, {
    key: "copy",
    value: function copy(v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
    }
    /**
     * 三维向量求和
     * @param {Vec3|number} v 三维向量 | 数字
     * @return {Vec3} 求和结果
     */

  }, {
    key: "add",
    value: function add(v) {
      if (typeof v === 'number') {
        this.x += v;
        this.y += v;
        this.z += v;
      } else {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
      }

      return this;
    }
    /**
     * 三维向量求和
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @return {Vec3} 求和结果
     */

  }, {
    key: "addVectors",
    value: function addVectors(a, b) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      this.z = a.z + b.z;
      return this;
    }
    /**
     * 三维向量比例相交
     * @param {Vec3} v 三维向量
     * @param {number} s 比例
     * @returns {Vec3} 三维向量
     */

  }, {
    key: "addScaledVector",
    value: function addScaledVector(v, s) {
      this.x += v.x * s;
      this.y += v.y * s;
      this.z += v.z * s;
      return this;
    }
    /**
     * 三维向量求差
     * @param {Vec3|number} v 三维向量 | 数字
     * @return {Vec3} 三维向量
     */

  }, {
    key: "sub",
    value: function sub(v) {
      if (typeof v === 'number') {
        this.x -= v;
        this.y -= v;
        this.z -= v;
      } else {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
      }

      return this;
    }
    /**
     * 三维向量求差
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @return {Vec3} 求差结果
     */

  }, {
    key: "subVectors",
    value: function subVectors(a, b) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      this.z = a.z - b.z;
      return this;
    }
    /**
     * 三维向量比例求差
     * @param {Vec3} v 三维向量
     * @param {number} s 比例
     * @return {Vec3} 求差结果
     */

  }, {
    key: "subScaledVector",
    value: function subScaledVector(v, s) {
      this.x -= v.x * s;
      this.y -= v.y * s;
      this.z -= v.z * s;
      return this;
    }
    /**
     * 三维向量取反
     * @return {Vec3} 取反结果
     */

  }, {
    key: "inverse",
    value: function inverse() {
      return this.clone().multiply(-1);
    }
    /**
     * 三维向量求乘
     * @param {Vec3|number} v 三维向量 | 数字
     * @returns 三维向量
     */

  }, {
    key: "multiply",
    value: function multiply(v) {
      if (typeof v === 'number') {
        this.x *= v;
        this.y *= v;
        this.z *= v;
      } else {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
      }

      return this;
    }
    /**
     * 三维向量求乘
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @return {Vec3} 三维向量
     */

  }, {
    key: "multiplyVectors",
    value: function multiplyVectors(a, b) {
      this.x = a.x * b.x;
      this.y = a.y * b.y;
      this.z = a.z * b.z;
      return this;
    }
    /**
     * 三维点以center为中心欧拉角euler旋转结果
     * @param {Euler} euler 欧拉角
     * @param {Vec3} [center] 旋转中心
     * @return {Vec3} 三维点
     */

  }, {
    key: "applyEuler",
    value: function applyEuler(euler, center) {
      return this.applyQuaternion(new Quaternion().setFromEuler(euler), center);
    }
    /**
     * 三维点以center为中心绕axis轴旋转angle角度的结果
     * @param {Vec3} axis 旋转轴
     * @param {number} angle 旋转角度
     * @param {Vec3} [center] 旋转中心
     * @return {Vec3} 三维点
     */

  }, {
    key: "applyAxisAngle",
    value: function applyAxisAngle(axis, angle, center) {
      return this.applyQuaternion(new Quaternion().setFromAxisAngle(axis, angle), center);
    }
    /**
     * 三维点根据三维矩阵选准
     * @param {Matrix3} m 旋转矩阵
     * @return {Vec3} 三维点
     */

  }, {
    key: "applyMatrix3",
    value: function applyMatrix3(m) {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      var e = m.elements;
      this.x = e[0] * x + e[3] * y + e[6] * z;
      this.y = e[1] * x + e[4] * y + e[7] * z;
      this.z = e[2] * x + e[5] * y + e[8] * z;
      return this;
    }
    /**
     * 三维向量旋转归一化
     * @param {Matrix3} m 旋转矩阵
     * @return {Vec3} 三维向量
     */

  }, {
    key: "applyNormalMatrix",
    value: function applyNormalMatrix(m) {
      return this.applyMatrix3(m).normalize();
    }
    /**
     * 三维点根据矩阵进变换
     * @param {Matrix4} m 四维矩阵
     * @return {Vec3} 三维点
     */

  }, {
    key: "applyMatrix4",
    value: function applyMatrix4(m) {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      var e = m.elements;

      {
        var w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
      }

      return this;
    }
    /**
     * 三维点根据四元数绕点的旋转
     * @param {Quaternion} q 四元数
     * @param {Vec3} [center=new Vec3()] 旋转中心
     * @return {Vec3} 旋转结果
     */

  }, {
    key: "applyQuaternion",
    value: function applyQuaternion(q) {
      var center = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vec3();
      var x = this.x;
      var y = this.y;
      var z = this.z;
      var qx = q.x,
          qy = q.y,
          qz = q.z,
          qw = q.w;
      var centerX = center.x,
          centerY = center.y,
          centerZ = center.z;
      var ix = qw * (x - centerX) + qy * (z - centerZ) - qz * (y - centerY);
      var iy = qw * (y - centerY) + qz * (x - centerX) - qx * (z - centerZ);
      var iz = qw * (z - centerZ) + qx * (y - centerY) - qy * (x - centerX);
      var iw = -qx * (x - centerX) - qy * (y - centerY) - qz * (z - centerZ);
      this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy + centerX;
      this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz + centerY;
      this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx + centerZ;
      return this;
    }
    /**
     * 三维点投影
     * @param camera 相机
     * @return {Vec3} 投影结果
     */

  }, {
    key: "project",
    value: function project(camera) {
      return this.applyMatrix4(camera.viewProjectMatrix);
    }
    /**
     * 三维点逆投影
     * @param camera 相机
     * @return {Vec3} 逆投影结果
     */

  }, {
    key: "unproject",
    value: function unproject(camera) {
      // TODO: 补齐 camera 类型
      return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
    }
    /**
     * 三维向量空间变换归一化
     * @param {Matrix4} m 四维矩阵
     * @return {Vec3} 三维向量
     */

  }, {
    key: "transformDirection",
    value: function transformDirection(m) {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      var e = m.elements;
      this.x = e[0] * x + e[4] * y + e[8] * z;
      this.y = e[1] * x + e[5] * y + e[9] * z;
      this.z = e[2] * x + e[6] * y + e[10] * z;
      return this.normalize();
    }
    /**
     * 三维向量求除
     * @param {Vec3|number} v 三维向量 | 数字
     * @return {Vec3} 求除结果
     */

  }, {
    key: "divide",
    value: function divide(v) {
      if (typeof v === 'number') {
        this.x /= v;
        this.y /= v;
        this.z /= v;
      } else {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
      }

      return this;
    }
    /**
     * 三维向量求最小值
     * @param {Vec3} v 三维向量
     * @return {Vec3} 求值结果
     */

  }, {
    key: "min",
    value: function min(v) {
      this.x = Math.min(this.x, v.x);
      this.y = Math.min(this.y, v.y);
      this.z = Math.min(this.z, v.z);
      return this;
    }
    /**
     * 三维向量求最大值
     * @param {Vec3} v 三维向量
     * @return {Vec3} 求值结果
     */

  }, {
    key: "max",
    value: function max(v) {
      this.x = Math.max(this.x, v.x);
      this.y = Math.max(this.y, v.y);
      this.z = Math.max(this.z, v.z);
      return this;
    }
    /**
     * 三维向量阈值约束
     * @param {Vec3} min 三维向量
     * @param {Vec3} max 三维向量
     * @return {Vec3} 求值结果
     */

  }, {
    key: "clamp",
    value: function clamp(min, max) {
      // assumes min < max, componentwise
      this.x = Math.max(min.x, Math.min(max.x, this.x));
      this.y = Math.max(min.y, Math.min(max.y, this.y));
      this.z = Math.max(min.z, Math.min(max.z, this.z));
      return this;
    }
    /**
     * 三维向量根据数值阈值约束
     * @param {number} minVal 最小值
     * @param {number} maxVal 最大值
     * @return {Vec3} 求值结果
     */

  }, {
    key: "clampScalar",
    value: function clampScalar(minVal, maxVal) {
      this.x = Math.max(minVal, Math.min(maxVal, this.x));
      this.y = Math.max(minVal, Math.min(maxVal, this.y));
      this.z = Math.max(minVal, Math.min(maxVal, this.z));
      return this;
    }
    /**
     * 三维向量根据阈值约束长度
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @return {Vec3} 三维向量
     */

  }, {
    key: "clampLength",
    value: function clampLength(min, max) {
      var length = this.length();
      return this.divide(length || 1).multiply(Math.max(min, Math.min(max, length)));
    }
    /**
     * 三维向量向下取整
     * @return {Vec3} 取整结果
     */

  }, {
    key: "floor",
    value: function floor() {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      this.z = Math.floor(this.z);
      return this;
    }
    /**
     * 三维向量向上取整
     * @return {Vec3} 取整结果
     */

  }, {
    key: "ceil",
    value: function ceil() {
      this.x = Math.ceil(this.x);
      this.y = Math.ceil(this.y);
      this.z = Math.ceil(this.z);
      return this;
    }
    /**
     * 三维向量四舍五入
     * @return {Vec3} 计算结果
     */

  }, {
    key: "round",
    value: function round() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      this.z = Math.round(this.z);
      return this;
    }
    /**
     * 三维向量分类处理
     * @return {Vec3} 三维向量
     */

  }, {
    key: "roundToZero",
    value: function roundToZero() {
      this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
      this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
      this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z);
      return this;
    }
    /**
     * 三维向量取反
     * @return {Vec3} 三维向量
     */

  }, {
    key: "negate",
    value: function negate() {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      return this;
    }
    /**
     * 三维向量求点积
     * @param {Vec3} v 三维向量
     * @return {number} 点积结果
     */

  }, {
    key: "dot",
    value: function dot(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    /**
     * 三维向量长度平方
     * @return {number} 长度平方
     */

  }, {
    key: "lengthSq",
    value: function lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    /**
     * 三维向量长度
     * @return {number} 长度
     */

  }, {
    key: "length",
    value: function length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    /**
     * 三维向量曼哈顿长度
     * @return {number} 曼哈顿长度
     */

  }, {
    key: "manhattanLength",
    value: function manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    /**
     * 三维向量归一化
     * @return {Vec3} 三维向量
     */

  }, {
    key: "normalize",
    value: function normalize() {
      return this.divide(this.length() || 1);
    }
    /**
     * 根据长度设置三维向量
     * @param {number} length 长度
     * @return {Vec3} 三维向量
     */

  }, {
    key: "setLength",
    value: function setLength(length) {
      return this.normalize().multiply(length);
    }
    /**
     * 三维点(this与other)求线性插值
     * @param {Vec3} other 三维点
     * @param {number} alpha 插值比例
     * @return {Vec3} 求值结果
     */

  }, {
    key: "lerp",
    value: function lerp(other, alpha) {
      this.x += (other.x - this.x) * alpha;
      this.y += (other.y - this.y) * alpha;
      this.z += (other.z - this.z) * alpha;
      return this;
    }
    /**
     * 三维点(v1与v2)求线性插值
     * @param {Vec3} v1 三维点
     * @param {Vec3} v2 三维点
     * @param {number} alpha 插值比例
     * @return {Vec3} 求值结果
     */

  }, {
    key: "lerpVectors",
    value: function lerpVectors(v1, v2, alpha) {
      this.x = v1.x + (v2.x - v1.x) * alpha;
      this.y = v1.y + (v2.y - v1.y) * alpha;
      this.z = v1.z + (v2.z - v1.z) * alpha;
      return this;
    }
    /**
     * 三维向量(this与other)求叉积
     * @param {Vec3} v 三维向量
     * @return {Vec3} 叉积结果
     */

  }, {
    key: "cross",
    value: function cross(v) {
      return this.crossVectors(this, v);
    }
    /**
     * 三维向量(a与b)求叉积
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @return {Vec3} 叉积结果
     */

  }, {
    key: "crossVectors",
    value: function crossVectors(a, b) {
      var ax = a.x,
          ay = a.y,
          az = a.z;
      var bx = b.x,
          by = b.y,
          bz = b.z;
      this.x = ay * bz - az * by;
      this.y = az * bx - ax * bz;
      this.z = ax * by - ay * bx;
      return this;
    }
    /**
     * 三维向量this在三维向量v的投影
     * @param {Vec3} v 三维向量
     * @return {Vec3} 投影结果
     */

  }, {
    key: "projectOnVector",
    value: function projectOnVector(v) {
      var denominator = v.lengthSq();

      if (denominator === 0) {
        return this.set(0, 0, 0);
      }

      var scalar = v.dot(this) / denominator;
      return this.copy(v).multiply(scalar);
    }
    /**
     * 三维点在平面的投影
     * @param {Vec3} planeNormal 平面法线
     * @return {Vec3} 投影结果
     */

  }, {
    key: "projectOnPlane",
    value: function projectOnPlane(planeNormal) {
      var vector = new Vec3();
      vector.copy(this).projectOnVector(planeNormal);
      return this.sub(vector);
    }
    /**
     * 三维向量反射
     * @param {Vec3} normal 法线
     * @return {Vec3} 反射结果
     */

  }, {
    key: "reflect",
    value: function reflect(normal) {
      // reflect incident vector off plane orthogonal to normal
      // normal is assumed to have unit length
      var vector = new Vec3();
      return this.sub(vector.copy(normal).multiply(2 * this.dot(normal)));
    }
    /**
     * 三维向量求夹角
     * @param {Vec3} v 三维向量
     * @return {number} 夹角
     */

  }, {
    key: "angleTo",
    value: function angleTo(v) {
      var denominator = Math.sqrt(this.lengthSq() * v.lengthSq());

      if (denominator === 0) {
        return Math.PI / 2;
      }

      var theta = this.dot(v) / denominator; // clamp, to handle numerical problems

      return Math.acos(clamp(theta, -1, 1));
    }
    /**
     * 三维点求距离
     * @param {Vec3} v 三维点
     * @return {number} 距离
     */

  }, {
    key: "distanceTo",
    value: function distanceTo(v) {
      return Math.sqrt(this.distanceToSquared(v));
    }
    /**
     * 三维点距离平方
     * @param {Vec3} v 三维点
     * @return {number} 距离平方
     */

  }, {
    key: "distanceToSquared",
    value: function distanceToSquared(v) {
      var dx = this.x - v.x;
      var dy = this.y - v.y;
      var dz = this.z - v.z;
      return dx * dx + dy * dy + dz * dz;
    }
    /**
     * 三维点曼哈顿距离
     * @param {Vec3} v 三维点
     * @return {number} 曼哈顿距离
     */

  }, {
    key: "manhattanDistanceTo",
    value: function manhattanDistanceTo(v) {
      return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
    }
    /**
     * 由球坐标获取笛卡尔坐标
     * @param s 球坐标
     * @returns 笛卡尔坐标
     */

  }, {
    key: "setFromSpherical",
    value: function setFromSpherical(s) {
      return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
    }
    /**
     * 根据值设置球坐标
     * @param {number} radius 半径
     * @param {number} phi y轴的极坐标角
     * @param {number} theta 绕y轴的方位角
     * @return {Vec3} 三维向量
     */

  }, {
    key: "setFromSphericalCoords",
    value: function setFromSphericalCoords(radius, phi, theta) {
      var sinPhiRadius = Math.sin(phi) * radius;
      this.x = sinPhiRadius * Math.sin(theta);
      this.y = Math.cos(phi) * radius;
      this.z = sinPhiRadius * Math.cos(theta);
      return this;
    } // setFromCylindrical(c) {
    //   return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
    // }

    /**
     * 根据圆柱设置三维向量
     * @param {number} radius 半径
     * @param {number} theta 方位角
     * @param {number} y 高
     * @return {Vec3} 三维向量
     */

  }, {
    key: "setFromCylindricalCoords",
    value: function setFromCylindricalCoords(radius, theta, y) {
      this.x = radius * Math.sin(theta);
      this.y = y;
      this.z = radius * Math.cos(theta);
      return this;
    }
    /**
     * 由空间变换矩阵保存三维偏移值
     * @param {Matrix4} m 四维矩阵
     * @return {Vec3} 偏移值
     */

  }, {
    key: "setFromMatrixPosition",
    value: function setFromMatrixPosition(m) {
      var e = m.elements;
      this.x = e[12];
      this.y = e[13];
      this.z = e[14];
      return this;
    }
    /**
     * 由空间变换矩阵保存三维缩放值
     * @param {Matrix4} m 四维矩阵
     * @return {Vec3} 缩放至
     */

  }, {
    key: "setFromMatrixScale",
    value: function setFromMatrixScale(m) {
      var sx = this.setFromMatrixColumn(m, 0).length();
      var sy = this.setFromMatrixColumn(m, 1).length();
      var sz = this.setFromMatrixColumn(m, 2).length();
      this.x = sx;
      this.y = sy;
      this.z = sz;
      return this;
    }
    /**
     * 由空间变换矩阵保存三维分量
     * @param {Matrix4} m 四维矩阵
     * @param {number} index 下标
     * @return {Vec3} 指定三维分量
     */

  }, {
    key: "setFromMatrixColumn",
    value: function setFromMatrixColumn(m, index) {
      var _context;

      // 这里断言了，类型不安全，之后加 lint，必须有明显的 disable lint 起提示作用
      return this.fromArray(slice(_context = m.elements).call(_context, index * 4));
    }
    /**
     * 由三维矩阵下标保存分量
     * @param {Matrix3} m 三维矩阵
     * @param {number} index 下标
     * @return {Vec3} 三维向量
     */

  }, {
    key: "setFromMatrix3Column",
    value: function setFromMatrix3Column(m, index) {
      var _context2;

      // 这里断言了，类型不安全，之后加 lint，必须有明显的 disable lint 起提示作用
      return this.fromArray(slice(_context2 = m.elements).call(_context2, index * 3));
    }
    /**
     * 三维向量判等
     * @param {Vec3} v 三维向量
     * @return {boolean} 判等结果
     */

  }, {
    key: "equals",
    value: function equals(v) {
      return v.x === this.x && v.y === this.y && v.z === this.z;
    }
    /**
     * 由数组组装三维向量
     * @param {[x: number, y: number, z: number]|object} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Vec3} 三维向量
     */

  }, {
    key: "fromArray",
    value: function fromArray(array) {
      if (isArray(array)) {
        var _array = _slicedToArray(array, 3);

        this.x = _array[0];
        this.y = _array[1];
        this.z = _array[2];
      } else {
        this.x = array.x;
        this.y = array.y;
        this.z = array.z;
      }

      return this;
    }
    /**
     * 三维向量转数组
     * @param {number[]} array 目标保存对象
     * @return {number[]} 数组
     */

  }, {
    key: "toArray",
    value: function toArray() {
      return [this.x, this.y, this.z];
    }
    /**
     * 获取随机三维向量
     * @return {Vec3}
     */

  }, {
    key: "random",
    value: function random() {
      this.x = Math.random();
      this.y = Math.random();
      this.z = Math.random();
      return this;
    }
  }], [{
    key: "clone",
    value: function clone(other) {
      var result = new Vec3();
      result.x = other.x;
      result.y = other.y;
      result.z = other.z;
      return result;
    }
    /**
     * @static 由指定对象设置三维向量
     * @param {object} [other] 对象
     * @param {number} [other.x=0] x分量，默认值为0
     * @param {number} [other.y=0] y分量，默认值为0
     * @param {number} [other.z=0] z分量，默认值为0
     * @return {Vec3} 三维向量
     */

  }, {
    key: "from",
    value: function from(_ref) {
      var _ref$x = _ref.x,
          x = _ref$x === void 0 ? 0 : _ref$x,
          _ref$y = _ref.y,
          y = _ref$y === void 0 ? 0 : _ref$y,
          _ref$z = _ref.z,
          z = _ref$z === void 0 ? 0 : _ref$z;
      return new Vec3(x, y, z);
    }
  }, {
    key: "mix",
    value: function mix(a, b, ratio) {
      ratio = ratio ? ratio : 0.5;
      return new Vec3(ratio * a.x + (1 - ratio) * b.x, ratio * a.y + (1 - ratio) * b.y);
    }
    /**
     * @static 屏幕坐标转视口坐标
     * @param {Vec2} view 屏幕坐标
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {number} z 坐标z值
     * @return {Vec3} 三维向量
     */

  }, {
    key: "to3DWorld",
    value: function to3DWorld(view, width, height, z) {
      var x = view.x / width;
      var y = view.y / height;
      return new Vec3((x - 0.5) * 2, (0.5 - y) * 2, z);
    }
  }]);

  return Vec3;
}();

/**
 * @class 四维向量
 */
var Vec4 = /*#__PURE__*/function () {
  /**
   * 构造函数，默认为w为1的单位四维向量
   * @param {number} [x=0] x轴分量
   * @param {number} [y=0] y轴分量
   * @param {number} [z=0] z轴分量
   * @param {number} [w=1] w轴分量
   */
  function Vec4() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    _classCallCheck(this, Vec4);

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  /**
   * @member {number} 宽度
   */


  _createClass(Vec4, [{
    key: "width",
    get: function get() {
      return this.z;
    },
    set: function set(value) {
      this.z = value;
    }
    /**
     * @member {number} 高度
     */

  }, {
    key: "height",
    get: function get() {
      return this.w;
    },
    set: function set(value) {
      this.w = value;
    }
    /**
     * 设置四维向量
     * @param {number|Vec3} x 数字 | 三维向量
     * @param {number} [y=x] y轴分量
     * @param {number} [z=x] z轴分量
     * @param {number} [w=x] w轴分量
     * @returns
     */

  }, {
    key: "set",
    value: function set(x, y, z, w) {
      if (typeof x === 'number') {
        if (y === undefined || z === undefined || w === undefined) {
          this.x = this.y = this.z = this.w = x;
        } else {
          this.x = x;
          this.y = y;
          this.z = z;
          this.w = w;
        }
      } else {
        this.x = x.x;
        this.y = x.y;
        this.z = x.z;
        this.w = y === undefined ? 1 : y;
      }

      return this;
    }
    /**
     * 设置x轴分量
     * @param {number} x x轴分量
     * @return {Vec4} 四维向量
     */

  }, {
    key: "setX",
    value: function setX(x) {
      this.x = x;
      return this;
    }
    /**
     * 设置y轴分量
     * @param {number} y y轴分量
     * @return {Vec4} 四维向量
     */

  }, {
    key: "setY",
    value: function setY(y) {
      this.y = y;
      return this;
    }
    /**
     * 设置z轴分量
     * @param {number} z z轴分量
     * @return {Vec4} 四维向量
     */

  }, {
    key: "setZ",
    value: function setZ(z) {
      this.z = z;
      return this;
    }
    /**
     * 设置w轴分量
     * @param {number} w w轴分量
     * @return {Vec4} 四维向量
     */

  }, {
    key: "setW",
    value: function setW(w) {
      this.w = w;
      return this;
    }
    /**
     * 根据下标设置四维向量
     * @param {number} index 下标值
     * @param {number} value 数字
     * @return {Vec4} 四维向量
     */

  }, {
    key: "setComponent",
    value: function setComponent(index, value) {
      switch (index) {
        case 0:
          this.x = value;
          break;

        case 1:
          this.y = value;
          break;

        case 2:
          this.z = value;
          break;

        case 3:
          this.w = value;
          break;

        default:
          throw new Error('index is out of range: ' + index);
      }

      return this;
    }
    /**
     * 根据下标获取值
     * @param {number} index 下标
     * @return {number} 值
     */

  }, {
    key: "getComponent",
    value: function getComponent(index) {
      switch (index) {
        case 0:
          return this.x;

        case 1:
          return this.y;

        case 2:
          return this.z;

        case 3:
          return this.w;

        default:
          throw new Error('index is out of range: ' + index);
      }
    }
    /**
     * 克隆四维向量
     * @return {Vec4} 克隆结果
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Vec4(this.x, this.y, this.z, this.w);
    }
    /**
     * 复制四维向量
     * @param {Vec4} v 复制对象
     * @return {Vec4} 复制结果
     */

  }, {
    key: "copy",
    value: function copy(v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      this.w = v.w;
      return this;
    }
    /**
     * 四维向量求和
     * @param {Vec4|number} v 求和对象，四维向量 | 数字
     * @return {Vec4} 求和结果
     */

  }, {
    key: "add",
    value: function add(v) {
      if (typeof v === 'number') {
        this.x += v;
        this.y += v;
        this.z += v;
        this.w += v;
      } else {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
      }

      return this;
    }
    /**
     * 四维向量求和
     * @param {Vec3} a 四维向量
     * @param {Vec4} b 四维向量
     * @return {Vec4} 求和结果
     */

  }, {
    key: "addVectors",
    value: function addVectors(a, b) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      this.z = a.z + b.z;
      this.w = a.w + b.w;
      return this;
    }
    /**
     * 四维向量比例求和
     * @param {Vec4} v 四维向量
     * @param {number} s 比例
     * @returns {Vec4} 求和结果
     */

  }, {
    key: "addScaledVec",
    value: function addScaledVec(v, s) {
      this.x += v.x * s;
      this.y += v.y * s;
      this.z += v.z * s;
      this.w += v.w * s;
      return this;
    }
    /**
     * 四维向量求差
     * @param {Vec4|number} v 求差对象，四维向量 | 数字
     * @return {Vec4} 四维向量
     */

  }, {
    key: "sub",
    value: function sub(v) {
      if (typeof v === 'number') {
        this.x -= v;
        this.y -= v;
        this.z -= v;
        this.w -= v;
      } else {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
      }

      return this;
    }
    /**
     * 四维向量取反
     * @return {Vec4} 取反结果
     */

  }, {
    key: "inverse",
    value: function inverse() {
      return this.clone().multiply(-1);
    }
    /**
     * 四维向量求差
     * @param {Vec4} a 四维向量
     * @param {Vec4} b 四维向量
     * @return {Vec4} 四维向量
     */

  }, {
    key: "subVectors",
    value: function subVectors(a, b) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      this.z = a.z - b.z;
      this.w = a.w - b.w;
      return this;
    }
    /**
     * 四维向量求乘
     * @param {Vec4|number} v 求乘对象，四维对象 | 数字
     * @return {Vec4} 四维向量
     */

  }, {
    key: "multiply",
    value: function multiply(v) {
      if (typeof v === 'number') {
        this.x *= v;
        this.y *= v;
        this.z *= v;
        this.w *= v;
      } else {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        this.w *= v.w;
      }

      return this;
    }
    /**
     * 四维向量矩阵变换
     * @param {Matrix4} m 变换矩阵
     * @return {Vec4} 四维向量
     */

  }, {
    key: "applyMatrix4",
    value: function applyMatrix4(m) {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      var w = this.w;
      var e = m.elements;
      this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
      this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
      this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
      this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;
      return this;
    }
    /**
     * 四维向量求除
     * @param {number} scalar 除数
     * @return {Vec4} 求除结果
     */

  }, {
    key: "divideScalar",
    value: function divideScalar(scalar) {
      return this.multiply(1 / scalar);
    }
    /**
     * 根据四元数设置四维向量[旋转轴，旋转角度]
     * @param {Quaternion} q 四元数
     * @return {Vec4} 四维向量
     */

  }, {
    key: "setAxisAngleFromQuaternion",
    value: function setAxisAngleFromQuaternion(q) {
      // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
      // q is assumed to be normalized
      this.w = 2 * Math.acos(q.w);
      var s = Math.sqrt(1 - q.w * q.w);

      if (s < 0.0001) {
        this.x = 1;
        this.y = 0;
        this.z = 0;
      } else {
        this.x = q.x / s;
        this.y = q.y / s;
        this.z = q.z / s;
      }

      return this;
    }
    /**
     * 根据矩阵设置四维向量[旋转轴，旋转角度]
     * @param {Matrix4} m 矩阵
     * @return {Vec4} 四维向量
     */

  }, {
    key: "setAxisAngleFromRotationMatrix",
    value: function setAxisAngleFromRotationMatrix(m) {
      // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
      // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
      var angle;
      var x;
      var y;
      var z; // variables for result

      var epsilon = 0.01; // margin to allow for rounding errors

      var epsilon2 = 0.1; // margin to distinguish between 0 and 180 degrees

      var te = m.elements;
      var m11 = te[0];
      var m12 = te[4];
      var m13 = te[8];
      var m21 = te[1];
      var m22 = te[5];
      var m23 = te[9];
      var m31 = te[2];
      var m32 = te[6],
          m33 = te[10];

      if (Math.abs(m12 - m21) < epsilon && Math.abs(m13 - m31) < epsilon && Math.abs(m23 - m32) < epsilon) {
        // singularity found
        // first check for identity matrix which must have +1 for all terms
        // in leading diagonal and zero in other terms
        if (Math.abs(m12 + m21) < epsilon2 && Math.abs(m13 + m31) < epsilon2 && Math.abs(m23 + m32) < epsilon2 && Math.abs(m11 + m22 + m33 - 3) < epsilon2) {
          // this singularity is identity matrix so angle = 0
          this.set(1, 0, 0, 0);
          return this; // zero angle, arbitrary axis
        } // otherwise this singularity is angle = 180


        angle = Math.PI;
        var xx = (m11 + 1) / 2;
        var yy = (m22 + 1) / 2;
        var zz = (m33 + 1) / 2;
        var xy = (m12 + m21) / 4;
        var xz = (m13 + m31) / 4;
        var yz = (m23 + m32) / 4;

        if (xx > yy && xx > zz) {
          // m11 is the largest diagonal term
          if (xx < epsilon) {
            x = 0;
            y = 0.707106781;
            z = 0.707106781;
          } else {
            x = Math.sqrt(xx);
            y = xy / x;
            z = xz / x;
          }
        } else if (yy > zz) {
          // m22 is the largest diagonal term
          if (yy < epsilon) {
            x = 0.707106781;
            y = 0;
            z = 0.707106781;
          } else {
            y = Math.sqrt(yy);
            x = xy / y;
            z = yz / y;
          }
        } else {
          // m33 is the largest diagonal term so base result on this
          if (zz < epsilon) {
            x = 0.707106781;
            y = 0.707106781;
            z = 0;
          } else {
            z = Math.sqrt(zz);
            x = xz / z;
            y = yz / z;
          }
        }

        this.set(x, y, z, angle);
        return this; // return 180 deg rotation
      } // as we have reached here there are no singularities so we can handle normally


      var s = Math.sqrt((m32 - m23) * (m32 - m23) + (m13 - m31) * (m13 - m31) + (m21 - m12) * (m21 - m12)); // used to normalize

      if (Math.abs(s) < 0.001) {
        s = 1;
      } // prevent divide by zero, should not happen if matrix is orthogonal and should be
      // caught by singularity test above, but I've left it in just in case


      this.x = (m32 - m23) / s;
      this.y = (m13 - m31) / s;
      this.z = (m21 - m12) / s;
      this.w = Math.acos((m11 + m22 + m33 - 1) / 2);
      return this;
    }
    /**
     * 四维向量求最小值
     * @param {Vec4} v 四维向量
     * @return {Vec4} 最小值
     */

  }, {
    key: "min",
    value: function min(v) {
      this.x = Math.min(this.x, v.x);
      this.y = Math.min(this.y, v.y);
      this.z = Math.min(this.z, v.z);
      this.w = Math.min(this.w, v.w);
      return this;
    }
    /**
     * 四维向量求最大值
     * @param {Vec4} v 四维向量
     * @return {Vec4} 最大值
     */

  }, {
    key: "max",
    value: function max(v) {
      this.x = Math.max(this.x, v.x);
      this.y = Math.max(this.y, v.y);
      this.z = Math.max(this.z, v.z);
      this.w = Math.max(this.w, v.w);
      return this;
    }
    /**
     * 四维向量阈值约束
     * @param {Vec4} min 最小值
     * @param {Vec4} max 最大值
     * @return {Vec4} 四维向量
     */

  }, {
    key: "clamp",
    value: function clamp(min, max) {
      // assumes min < max, componentwise
      this.x = Math.max(min.x, Math.min(max.x, this.x));
      this.y = Math.max(min.y, Math.min(max.y, this.y));
      this.z = Math.max(min.z, Math.min(max.z, this.z));
      this.w = Math.max(min.w, Math.min(max.w, this.w));
      return this;
    }
    /**
     * 四维向量数值阈值约束
     * @param {number} minVal 最小数值
     * @param {number} maxVal 最大数值
     * @return {Vec4} 四维向量
     */

  }, {
    key: "clampScalar",
    value: function clampScalar(minVal, maxVal) {
      this.x = Math.max(minVal, Math.min(maxVal, this.x));
      this.y = Math.max(minVal, Math.min(maxVal, this.y));
      this.z = Math.max(minVal, Math.min(maxVal, this.z));
      this.w = Math.max(minVal, Math.min(maxVal, this.w));
      return this;
    }
    /**
     * 四维向量根据数值约束长度
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @return {Vec4} 四维向量
     */

  }, {
    key: "clampLength",
    value: function clampLength(min, max) {
      var length = this.length();
      return this.divideScalar(length || 1).multiply(Math.max(min, Math.min(max, length)));
    }
    /**
     * 四维向量向下取整
     * @return {Vec4} 取整结果
     */

  }, {
    key: "floor",
    value: function floor() {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      this.z = Math.floor(this.z);
      this.w = Math.floor(this.w);
      return this;
    }
    /**
     * 四维向量向上取整
     * @return {Vec4} 取整结果
     */

  }, {
    key: "ceil",
    value: function ceil() {
      this.x = Math.ceil(this.x);
      this.y = Math.ceil(this.y);
      this.z = Math.ceil(this.z);
      this.w = Math.ceil(this.w);
      return this;
    }
    /**
     * 四维向量四舍五入
     * @return {Vec4} 求值结果
     */

  }, {
    key: "round",
    value: function round() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      this.z = Math.round(this.z);
      this.w = Math.round(this.w);
      return this;
    }
    /**
     * 四维向量分类处理
     * @return {Vec4} 计算结果
     */

  }, {
    key: "roundToZero",
    value: function roundToZero() {
      this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
      this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
      this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z);
      this.w = this.w < 0 ? Math.ceil(this.w) : Math.floor(this.w);
      return this;
    }
    /**
     * 四维向量取反
     * @return {Vec4} 取反结果
     */

  }, {
    key: "negate",
    value: function negate() {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      this.w = -this.w;
      return this;
    }
    /**
     * 四维向量求点积
     * @param {Vec4} v 四维向量
     * @return {number} 点积结果
     */

  }, {
    key: "dot",
    value: function dot(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }
    /**
     * 四维向量长度平方
     * @return {number} 长度平方
     */

  }, {
    key: "lengthSq",
    value: function lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    /**
     * 四维向量长度
     * @return {number} 长度
     */

  }, {
    key: "length",
    value: function length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    /**
     * 四维向量曼哈顿长度
     * @return {number} 曼哈顿长度
     */

  }, {
    key: "manhattanLength",
    value: function manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
    }
    /**
     * 四维向量归一化
     * @return {Vec4} 归一化结果
     */

  }, {
    key: "normalize",
    value: function normalize() {
      return this.divideScalar(this.length() || 1);
    }
    /**
     * 根据四维向量方向与长度设置四维向量
     * @param {number} length 长度
     * @return {Vec4} 四维向量
     */

  }, {
    key: "setLength",
    value: function setLength(length) {
      return this.normalize().multiply(length);
    }
    /**
     * 四维点求线性插值
     * @param {Vec4} v 四维点
     * @param {number} alpha 插值比例
     * @return {Vec4} 求值结果
     */

  }, {
    key: "lerp",
    value: function lerp(v, alpha) {
      this.x += (v.x - this.x) * alpha;
      this.y += (v.y - this.y) * alpha;
      this.z += (v.z - this.z) * alpha;
      this.w += (v.w - this.w) * alpha;
      return this;
    }
    /**
     * 四维点求线性插值
     * @param {Vec4} v1 四维点
     * @param {Vec4} v2 思维点
     * @param {number} alpha 插值比例
     * @returns {Vec4} 求值结果
     */

  }, {
    key: "lerpVecs",
    value: function lerpVecs(v1, v2, alpha) {
      this.x = v1.x + (v2.x - v1.x) * alpha;
      this.y = v1.y + (v2.y - v1.y) * alpha;
      this.z = v1.z + (v2.z - v1.z) * alpha;
      this.w = v1.w + (v2.w - v1.w) * alpha;
      return this;
    }
    /**
     * 四维向量判等
     * @param {Vec4} v 四维向量
     * @return {boolean} 判等结果
     */

  }, {
    key: "equals",
    value: function equals(v) {
      return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
    }
    /**
     * 由数组组装四维向量
     * @param {[x: number, y: number, z: number, z: number]} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Vec4} 四维向量
     */

  }, {
    key: "fromArray",
    value: function fromArray(array) {
      var _array = _slicedToArray(array, 4);

      this.x = _array[0];
      this.y = _array[1];
      this.z = _array[2];
      this.w = _array[3];
      return this;
    }
    /**
     * 四维向量转数组
     * @param {number[]} [array=[]] 目标保存对象
     * @param {number} [offset=0] 保存起始偏移值
     * @return {number[]} 数组
     */

  }, {
    key: "toArray",
    value: function toArray() {
      return [this.x, this.y, this.z, this.w];
    }
    /**
     * 生成随机四维向量
     * @return {Vec4} 四维向量
     */

  }, {
    key: "random",
    value: function random() {
      this.x = Math.random();
      this.y = Math.random();
      this.z = Math.random();
      this.w = Math.random();
      return this;
    }
  }]);

  return Vec4;
}();

/**
 * @class 三维矩阵[二维空间变换矩阵 || 三维空间旋转缩放矩阵(列矩阵)]
 */
var Matrix3 = /*#__PURE__*/function () {
  /**
   * 构造函数，初始值为单位矩阵
   */
  function Matrix3() {
    _classCallCheck(this, Matrix3);

    this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];

    if (arguments.length > 0) {
      console.error('THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.');
    }
  }
  /**
   * 设置三维矩阵矩阵
   * @param {number} n00 矩阵[0, 0]值
   * @param {number} n01 矩阵[0, 1]值
   * @param {number} n02 矩阵[0, 2]值
   * @param {number} n10 矩阵[1, 0]值
   * @param {number} n11 矩阵[1, 1]值
   * @param {number} n12 矩阵[1, 2]值
   * @param {number} n20 矩阵[2, 0]值
   * @param {number} n21 矩阵[2, 1]值
   * @param {number} n22 矩阵[2, 2]值
   * @return {Matrix3}
   */


  _createClass(Matrix3, [{
    key: "set",
    value: function set(n00, n01, n02, n10, n11, n12, n20, n21, n22) {
      var te = this.elements;
      te[0] = n00;
      te[1] = n10;
      te[2] = n20;
      te[3] = n01;
      te[4] = n11;
      te[5] = n21;
      te[6] = n02;
      te[7] = n12;
      te[8] = n22;
      return this;
    }
    /**
     * 三维矩阵矩阵单位化
     * @return {Matrix3} 单位矩阵
     */

  }, {
    key: "identity",
    value: function identity() {
      this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
      return this;
    }
    /**
     * 复制三维矩阵矩阵
     * @param {Matrix3} m 复制对象
     * @return {Matrix3} 复制结果
     */

  }, {
    key: "copy",
    value: function copy(m) {
      var te = this.elements;
      var me = m.elements;
      te[0] = me[0];
      te[1] = me[1];
      te[2] = me[2];
      te[3] = me[3];
      te[4] = me[4];
      te[5] = me[5];
      te[6] = me[6];
      te[7] = me[7];
      te[8] = me[8];
      return this;
    }
    /**
     * 由分轴向量构建三维矩阵
     * @param {Vec3} xAxis x轴分量
     * @param {Vec3} yAxis y轴分量
     * @param {Vec3} zAxis z轴分量
     * @return {Matrix3} 三维矩阵
     */

  }, {
    key: "extractBasis",
    value: function extractBasis(xAxis, yAxis, zAxis) {
      xAxis.setFromMatrix3Column(this, 0);
      yAxis.setFromMatrix3Column(this, 1);
      zAxis.setFromMatrix3Column(this, 2);
      return this;
    }
    /**
     * 由四维矩阵构建三维矩阵(获取三维空间变换矩阵旋转缩放部分)
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix3} 三维矩阵
     */

  }, {
    key: "setFromMatrix4",
    value: function setFromMatrix4(m) {
      var me = m.elements;
      this.set(me[0], me[4], me[8], me[1], me[5], me[9], me[2], me[6], me[10]);
      return this;
    }
    /**
     * 三维矩阵右乘
     * @param {Matrix3} m 相乘矩阵
     * @return {Matrix3} 右乘结果
     */

  }, {
    key: "multiply",
    value: function multiply(m) {
      return this.multiplyMatrices(this, m);
    }
    /**
     * 三维矩阵左乘
     * @param {Matrix3} m 相乘矩阵
     * @return {Matrix3} 左乘结果
     */

  }, {
    key: "premultiply",
    value: function premultiply(m) {
      return this.multiplyMatrices(m, this);
    }
    /**
     * 三维矩阵乘法(a * b)
     * @param {Matrix3} a 三维矩阵
     * @param {Matrix3} b 三维矩阵
     * @return {Matrix3} 相乘结果
     */

  }, {
    key: "multiplyMatrices",
    value: function multiplyMatrices(a, b) {
      var ae = a.elements;
      var be = b.elements;
      var te = this.elements;
      var a11 = ae[0];
      var a12 = ae[3];
      var a13 = ae[6];
      var a21 = ae[1];
      var a22 = ae[4];
      var a23 = ae[7];
      var a31 = ae[2];
      var a32 = ae[5];
      var a33 = ae[8];
      var b11 = be[0];
      var b12 = be[3];
      var b13 = be[6];
      var b21 = be[1];
      var b22 = be[4];
      var b23 = be[7];
      var b31 = be[2];
      var b32 = be[5];
      var b33 = be[8];
      te[0] = a11 * b11 + a12 * b21 + a13 * b31;
      te[3] = a11 * b12 + a12 * b22 + a13 * b32;
      te[6] = a11 * b13 + a12 * b23 + a13 * b33;
      te[1] = a21 * b11 + a22 * b21 + a23 * b31;
      te[4] = a21 * b12 + a22 * b22 + a23 * b32;
      te[7] = a21 * b13 + a22 * b23 + a23 * b33;
      te[2] = a31 * b11 + a32 * b21 + a33 * b31;
      te[5] = a31 * b12 + a32 * b22 + a33 * b32;
      te[8] = a31 * b13 + a32 * b23 + a33 * b33;
      return this;
    }
    /**
     * 三维矩阵倍数缩放
     * @param {number} s 放大倍数
     * @return {Matrix3} 缩放结果
     */

  }, {
    key: "multiplyScalar",
    value: function multiplyScalar(s) {
      var te = this.elements;
      te[0] *= s;
      te[3] *= s;
      te[6] *= s;
      te[1] *= s;
      te[4] *= s;
      te[7] *= s;
      te[2] *= s;
      te[5] *= s;
      te[8] *= s;
      return this;
    }
    /**
     * 三维矩阵求行列式值
     * @return {number} 行列式结果
     */

  }, {
    key: "determinant",
    value: function determinant() {
      var te = this.elements;
      var a = te[0];
      var b = te[1];
      var c = te[2];
      var d = te[3];
      var e = te[4];
      var f = te[5];
      var g = te[6];
      var h = te[7];
      var i = te[8];
      return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
    }
    /**
     * 三维矩阵求逆
     * @return {Matrix3} 逆矩阵
     */

  }, {
    key: "invert",
    value: function invert() {
      var te = this.elements;
      var n11 = te[0];
      var n21 = te[1];
      var n31 = te[2];
      var n12 = te[3];
      var n22 = te[4];
      var n32 = te[5];
      var n13 = te[6];
      var n23 = te[7];
      var n33 = te[8];
      var t11 = n33 * n22 - n32 * n23;
      var t12 = n32 * n13 - n33 * n12;
      var t13 = n23 * n12 - n22 * n13;
      var det = n11 * t11 + n21 * t12 + n31 * t13;

      if (det === 0) {
        return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
      }

      var detInv = 1 / det;
      te[0] = t11 * detInv;
      te[1] = (n31 * n23 - n33 * n21) * detInv;
      te[2] = (n32 * n21 - n31 * n22) * detInv;
      te[3] = t12 * detInv;
      te[4] = (n33 * n11 - n31 * n13) * detInv;
      te[5] = (n31 * n12 - n32 * n11) * detInv;
      te[6] = t13 * detInv;
      te[7] = (n21 * n13 - n23 * n11) * detInv;
      te[8] = (n22 * n11 - n21 * n12) * detInv;
      return this;
    }
    /**
     * 三维矩阵转置
     * @return {Matrix3} 转置结果
     */

  }, {
    key: "transpose",
    value: function transpose() {
      var tmp;
      var m = this.elements;
      tmp = m[1];
      m[1] = m[3];
      m[3] = tmp;
      tmp = m[2];
      m[2] = m[6];
      m[6] = tmp;
      tmp = m[5];
      m[5] = m[7];
      m[7] = tmp;
      return this;
    }
    /**
     * 根据四维矩阵设置法线矩阵
     * @param {Matrix4} matrix4 四维矩阵
     * @return {Matrix3} 法线矩阵
     */

  }, {
    key: "getNormalMatrix",
    value: function getNormalMatrix(matrix4) {
      return this.setFromMatrix4(matrix4).invert().transpose();
    }
    /**
     * 三维矩阵转置并保存于数组中
     * @param {number[]} r 结果保存对象
     * @return {Matrix3} 三维矩阵
     */

  }, {
    key: "transposeIntoArray",
    value: function transposeIntoArray(r) {
      var m = this.elements;
      r[0] = m[0];
      r[1] = m[3];
      r[2] = m[6];
      r[3] = m[1];
      r[4] = m[4];
      r[5] = m[7];
      r[6] = m[2];
      r[7] = m[5];
      r[8] = m[8];
      return this;
    }
    /**
     * 设置UV变换矩阵
     * @param {number} tx x方向平移
     * @param {number} ty y方向平移
     * @param {number} sx x方向缩放
     * @param {number} sy y方向缩放
     * @param {number} rotation 旋转帧
     * @param {number} cx x方向切变
     * @param {number} cy y方向切变
     * @return {Matrix3} UV变换矩阵
     */

  }, {
    key: "setUvTransform",
    value: function setUvTransform(tx, ty, sx, sy, rotation, cx, cy) {
      var c = Math.cos(rotation);
      var s = Math.sin(rotation);
      this.set(sx * c, sx * s, -sx * (c * cx + s * cy) + cx + tx, -sy * s, sy * c, -sy * (-s * cx + c * cy) + cy + ty, 0, 0, 1);
      return this;
    }
    /**
     * 三维矩阵缩放
     * @param {number} sx x轴缩放分量
     * @param {number} sy y轴缩放分量
     * @return {Matrix3} 缩放结果
     */

  }, {
    key: "scale",
    value: function scale(sx, sy) {
      var te = this.elements;
      te[0] *= sx;
      te[3] *= sx;
      te[6] *= sx;
      te[1] *= sy;
      te[4] *= sy;
      te[7] *= sy;
      return this;
    }
    /**
     * 三维矩阵旋转
     * @param {number} theta 旋转值
     * @return {Matrix3} 旋转结果
     */

  }, {
    key: "rotate",
    value: function rotate(theta) {
      var c = Math.cos(theta);
      var s = Math.sin(theta);
      var te = this.elements;
      var a11 = te[0],
          a12 = te[3],
          a13 = te[6];
      var a21 = te[1],
          a22 = te[4],
          a23 = te[7];
      te[0] = c * a11 + s * a21;
      te[3] = c * a12 + s * a22;
      te[6] = c * a13 + s * a23;
      te[1] = -s * a11 + c * a21;
      te[4] = -s * a12 + c * a22;
      te[7] = -s * a13 + c * a23;
      return this;
    }
    /**
     * 三维矩阵平移
     * @param {number} tx x轴平移分量
     * @param {number} ty y轴平移分量
     * @return {Matrix3} 平移结果
     */

  }, {
    key: "translate",
    value: function translate(tx, ty) {
      var te = this.elements;
      te[0] += tx * te[2];
      te[3] += tx * te[5];
      te[6] += tx * te[8];
      te[1] += ty * te[2];
      te[4] += ty * te[5];
      te[7] += ty * te[8];
      return this;
    }
    /**
     * 三维矩阵判等
     * @param {Matrix3} matrix 三维矩阵
     * @return {boolean} 判等结果
     */

  }, {
    key: "equals",
    value: function equals(matrix) {
      var te = this.elements;
      var me = matrix.elements;

      for (var i = 0; i < 9; i++) {
        if (te[i] !== me[i]) {
          return false;
        }
      }

      return true;
    }
    /**
     * 由数组构建三维矩阵
     * @param {number[]} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Matrix3} 三维矩阵
     */

  }, {
    key: "fromArray",
    value: function fromArray(array) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      for (var i = 0; i < 9; i++) {
        this.elements[i] = array[i + offset];
      }

      return this;
    }
    /**
     * 三维矩阵转为数组
     * @param {number[]} [array=[]] 目标保存对象
     * @param {number} [offset=0] 保存起始偏移值
     * @return {number[]} 保存结果
     */

  }, {
    key: "toArray",
    value: function toArray() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var te = this.elements;
      array[offset] = te[0];
      array[offset + 1] = te[1];
      array[offset + 2] = te[2];
      array[offset + 3] = te[3];
      array[offset + 4] = te[4];
      array[offset + 5] = te[5];
      array[offset + 6] = te[6];
      array[offset + 7] = te[7];
      array[offset + 8] = te[8];
      return array;
    }
    /**
     * 三维矩阵克隆
     * @return {Matrix3} 克隆结果
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Matrix3().fromArray(this.elements);
    }
  }]);

  return Matrix3;
}();

var arrayMethodIsStrict = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};

var $forEach = arrayIteration.forEach;


var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
var arrayForEach = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es-x/no-array-prototype-foreach -- safe
} : [].forEach;

// `Array.prototype.forEach` method
// https://tc39.es/ecma262/#sec-array.prototype.foreach
// eslint-disable-next-line es-x/no-array-prototype-foreach -- safe
_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
  forEach: arrayForEach
});

var forEach$3 = entryVirtual('Array').forEach;

var forEach$2 = forEach$3;

var ArrayPrototype = Array.prototype;

var DOMIterables = {
  DOMTokenList: true,
  NodeList: true
};

var forEach$1 = function (it) {
  var own = it.forEach;
  return it === ArrayPrototype || (objectIsPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.forEach)
    || hasOwnProperty_1(DOMIterables, classof(it)) ? forEach$2 : own;
};

var forEach = forEach$1;

/**
 * @class 二维线段
 */

var Line2 = /*#__PURE__*/function () {
  /**
   * 构造函数
   * @param {Vec2} [start=new Vec2()] 线段起点，默认值为(0, 0)
   * @param {Vec2} [end=new Vec2()] 线段终点，默认值为(0, 0)
   */
  function Line2() {
    var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vec2();
    var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vec2();

    _classCallCheck(this, Line2);

    this.start = start;
    this.end = end;
  }
  /**
   * 设置二维线段
   * @param {Vec2} start 线段起点
   * @param {Vec2} end 线段终点
   * @return {Line2} 二维线段
   */


  _createClass(Line2, [{
    key: "set",
    value: function set(start, end) {
      this.start.copy(start);
      this.end.copy(end);
      return this;
    }
    /**
     * 复制二维线段
     * @param {Line2} line 复制对象
     * @return {Line2} 复制结果
     */

  }, {
    key: "copy",
    value: function copy(line) {
      this.start.copy(line.start);
      this.end.copy(line.end);
      return this;
    }
    /**
     * 二维线段求方向
     * @return {Vec2} 二维线段方向
     */

  }, {
    key: "direction",
    value: function direction() {
      return new Vec2().subVectors(this.end, this.start).normalize();
    }
    /**
     * 二维线段求中点
     * @param {Vec2} [target=new Vec2()] 目标保存对象
     * @return {Vec2} 二维线段中点
     */

  }, {
    key: "getCenter",
    value: function getCenter() {
      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vec2();
      return target.addVectors(this.start, this.end).multiply(0.5);
    }
    /**
     * 二维线段向量值
     * @param {Vec2} [target=new Vec2()] 目标保存对象
     * @return {Vec2} 二维线段向量值
     */

  }, {
    key: "delta",
    value: function delta() {
      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vec2();
      return target.subVectors(this.end, this.start);
    }
    /**
     * 二维线段欧式距离平方(应用于计算)
     * @return {number} 计算结果
     */

  }, {
    key: "distanceSq",
    value: function distanceSq() {
      return this.start.distanceToSquared(this.end);
    }
    /**
     * 二维线段欧式距离
     * @return {number} 计算结果
     */

  }, {
    key: "distance",
    value: function distance() {
      return this.start.distanceTo(this.end);
    }
    /**
     * 求二维线段比例点
     * @param {number} t 比例值
     * @param {Vec2} target 目标保存对象
     * @return {Vec2} 比例点结果
     */

  }, {
    key: "at",
    value: function at(t) {
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vec2();
      return this.delta(target).multiply(t).add(this.start);
    }
    /**
     * 求点与线段的最短距离
     * @param {Vec2} point 二维空间点
     * @param {boolean} clampToLine 是否限制于线段内
     * @return {number} 距离结果
     */

  }, {
    key: "closestPointToPointParameter",
    value: function closestPointToPointParameter(point, clampToLine) {
      var startP = new Vec2();
      var startEnd = new Vec2();
      startP.subVectors(point, this.start);
      startEnd.subVectors(this.end, this.start);
      var se2se = startEnd.dot(startEnd);
      var se2sp = startEnd.dot(startP);
      var t = se2sp / se2se;

      if (clampToLine) {
        t = clamp(t, 0, 1);
      }

      return t;
    }
    /**
     * 求点与线段的最近交点
     * @param {Vec2} point 二维空间点
     * @param {boolean} clampToLine 是否限制于线段内
     * @param {Vec2} target 目标保存对象
     * @return {Vec2} 最近交点
     */

  }, {
    key: "closestPointToPoint",
    value: function closestPointToPoint(point, clampToLine) {
      var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Vec2();
      var t = this.closestPointToPointParameter(point, clampToLine);
      return this.delta(target).multiply(t).add(this.start);
    }
    /**
     * 二维线段判等
     * @param {Line2} line 二维线段
     * @return {boolean} 判等结果
     */

  }, {
    key: "equals",
    value: function equals(line) {
      return line.start.equals(this.start) && line.end.equals(this.end);
    }
    /**
     * 克隆二维线段
     * @return {Line2} 克隆结果
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Line2().copy(this);
    }
    /**
     * 二维线段求长度
     * @return {number} 长度
     */

  }, {
    key: "length",
    value: function length() {
      return new Vec2().subVectors(this.end, this.start).length();
    }
    /**
     * 二维线段判断相交
     * @param {Line2} other 二维线段
     * @return {boolean} 相交判断结果
     */

  }, {
    key: "crossWithLine",
    value: function crossWithLine(other) {
      var vecA = this.delta();
      var vecB = other.delta();
      var vecAStart = new Vec2().subVectors(other.start, this.start);
      var vecAEnd = new Vec2().subVectors(other.end, this.start);
      var vecBStart = new Vec2().subVectors(this.start, other.start);
      var vecBEnd = new Vec2().subVectors(this.end, other.start);
      var crossA2BStart = vecAStart.cross(vecA);
      var crossA2BEnd = vecAEnd.cross(vecA);
      var crossB2AStart = vecBStart.cross(vecB);
      var crossB2AEnd = vecBEnd.cross(vecB);

      if (crossA2BStart * crossA2BEnd < 0 && crossB2AStart * crossB2AEnd < 0) {
        return true;
      }

      return false;
    }
  }]);

  return Line2;
}();

/**
 * @class 二维包围盒
 */

var Box2 = /*#__PURE__*/function () {
  /**
   * 构造函数，传入值为空时表示空包围盒
   * @param {Vec2} [min=new Vec2(+Infinity, +Infinity)] 最小点
   * @param {Vec2} [max=new Vec2(-Infinity, -Infinity)] 最大点
   */
  function Box2() {
    var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vec2(+Infinity, +Infinity);
    var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vec2(-Infinity, -Infinity);

    _classCallCheck(this, Box2);

    this.min = min;
    this.max = max;

    if (!min.equals(new Vec2(+Infinity, +Infinity)) && !max.equals(new Vec2(-Infinity, -Infinity))) {
      this.corners = [Vec2.copy(min), new Vec2(max.x, min.y), Vec2.copy(max), new Vec2(min.x, max.y)];
    } else {
      this.corners = [];
    }
  }
  /**
   * 通过最大最小点设置二维包围盒
   * @param {Vec2} min 最小点
   * @param {Vec2} max 最大点
   * @return {Box2} 二维包围盒
   */


  _createClass(Box2, [{
    key: "set",
    value: function set(min, max) {
      this.min.copy(min);
      this.max.copy(max);
      this.corners = [Vec2.copy(min), new Vec2(max.x, min.y), Vec2.copy(max), new Vec2(min.x, max.y)];
      return this;
    }
    /**
     * 通过角点设置二维包围盒
     * @param {Vec2[]} vecArray 二维空间点数组
     * @return {Box2} 二维包围盒
     */

  }, {
    key: "setFromVec2Array",
    value: function setFromVec2Array(vecArray) {
      var _this = this;

      this.min = new Vec2().copy(vecArray[0]);
      this.max = new Vec2().copy(vecArray[0]);

      forEach(vecArray).call(vecArray, function (v) {
        _this.min = Vec2.min(v, _this.min);
        _this.max = Vec2.max(v, _this.max);

        _this.corners.push(Vec2.copy(v));
      });

      return this;
    }
    /**
     * 通过中心与大小设置二维包围盒
     * @param {Vec2} center 二维中心点
     * @param {Vec2} size 二维大小
     * @return {Box2} 二维包围盒
     */

  }, {
    key: "setFromCenterAndSize",
    value: function setFromCenterAndSize(center, size) {
      var halfSize = new Vec2().copy(size).multiply(0.5);
      this.min.copy(center).sub(halfSize);
      this.max.copy(center).add(halfSize);
      this.corners = [Vec2.copy(this.min), new Vec2(this.max.x, this.min.y), Vec2.copy(this.max), new Vec2(this.min.x, this.max.y)];
      return this;
    }
    /**
     * 克隆二维包围盒
     * @return {Box2} 克隆结果
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Box2().copy(this);
    }
    /**
     * 复制二维包围盒
     * @param {Box2} box 二维包围盒
     * @return {Box2} 复制结果
     */

  }, {
    key: "copy",
    value: function copy(box) {
      var _context,
          _this2 = this;

      this.min.copy(box.min);
      this.max.copy(box.max);

      forEach(_context = box.corners).call(_context, function (corner) {
        _this2.corners.push(Vec2.copy(corner));
      });

      return this;
    }
    /**
     * 二维包围盒置空
     * @return {Box2} 置空结果
     */

  }, {
    key: "makeEmpty",
    value: function makeEmpty() {
      this.min.x = this.min.y = +Infinity;
      this.max.x = this.max.y = -Infinity;
      this.corners = [];
      return this;
    }
    /**
     * 二维包围盒判空
     * @return {boolean} 判空结果
     */

  }, {
    key: "isEmpty",
    value: function isEmpty() {
      // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
      return this.max.x <= this.min.x || this.max.y <= this.min.y;
    }
    /**
     * 获取二维包围盒角点
     * @return {Vec2[]} 二维包围盒角点
     */

  }, {
    key: "getCorners",
    value: function getCorners() {
      var _context2;

      var res = [];

      forEach(_context2 = this.corners).call(_context2, function (corner) {
        res.push(Vec2.copy(corner));
      });

      return res;
    }
    /**
     * 获取二维包围盒左上角点
     * @return {Vec2} 二维包围盒左上角点
     */

  }, {
    key: "getLeftTopCorner",
    value: function getLeftTopCorner() {
      return Vec2.copy(this.corners[0]);
    }
    /**
     * 获取二维包围盒右上角点
     * @return {Vec2} 二维包围盒右上角点
     */

  }, {
    key: "getRightTopCorner",
    value: function getRightTopCorner() {
      return Vec2.copy(this.corners[1]);
    }
    /**
     * 获取二维包围盒右下角点
     * @return {Vec2} 二维包围盒右下角点
     */

  }, {
    key: "getRightBottomCorner",
    value: function getRightBottomCorner() {
      return Vec2.copy(this.corners[2]);
    }
    /**
     * 获取二维包围盒左下角点
     * @return {Vec2} 二维包围盒左下角点
     */

  }, {
    key: "getLeftBottomCorner",
    value: function getLeftBottomCorner() {
      return Vec2.copy(this.corners[3]);
    } // type 0 = 'center'
    // type 1 = 'left top'
    // type 2 = 'left center'
    // type 3 = 'left bottom'
    // type 4 = 'middle top'
    // type 5 = 'middle bottom'
    // type 6 = 'right top'
    // type 7 = 'right center'
    // type 8 = 'right bottom'

    /**
     * 通过类型获取二维包围盒指定点
     * @param {number} type 包围盒顶点顺序
     * @return {Vec2} 二维包围盒指定点
     */

  }, {
    key: "getPoint",
    value: function getPoint(type) {
      var size = this.getSize();
      var center = this.getCenter();

      switch (type) {
        case 0:
          {
            return center;
          }

        case 1:
          {
            return center.add(size.multiply(-1 / 2));
          }

        case 2:
          {
            return center.add(new Vec2(-size.x / 2, 0));
          }

        case 3:
          {
            return center.add(new Vec2(-size.x / 2, size.y / 2));
          }

        case 4:
          {
            return center.add(new Vec2(0, -size.y / 2));
          }

        case 5:
          {
            return center.add(new Vec2(0, size.y / 2));
          }

        case 6:
          {
            return center.add(new Vec2(size.x / 2, -size.y / 2));
          }

        case 7:
          {
            return center.add(new Vec2(size.x / 2, 0));
          }

        case 8:
          {
            return center.add(size.multiply(1 / 2));
          }

        default:
          {
            return center;
          }
      }
    }
    /**
     * 获取二维包围盒中心点
     * @param {Vec2} [target=new Vec2()] 目标点(用以存放二维包围盒中心点)
     * @return {Vec2} 二维包围盒中心点
     */

  }, {
    key: "getCenter",
    value: function getCenter() {
      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vec2();
      return this.isEmpty() ? target.set(0, 0) : target.addVectors(this.min, this.max).multiply(0.5);
    }
    /**
     * 获取二维包围盒大小
     * @param {Vec2} [target=new Vec2()] 目标向量(用以存放二维包围盒大小)
     * @return {Vec2} 二维包围盒大小
     */

  }, {
    key: "getSize",
    value: function getSize() {
      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vec2();
      return this.isEmpty() ? target.set(0, 0) : target.subVectors(this.max, this.min);
    }
    /**
     * 通过二维空间点扩展二维包围盒
     * @param {Vec2} point 二维空间点
     * @return {Box2} 扩展包围盒
     */

  }, {
    key: "expandByPoint",
    value: function expandByPoint(point) {
      this.min.min(point);
      this.max.max(point);
      return this;
    }
    /**
     * 通过向量扩展二维包围盒
     * @param {Vec2} vector 二维向量
     * @return {Box2} 扩展结果
     */

  }, {
    key: "expandByVector",
    value: function expandByVector(vector) {
      this.min.sub(vector);
      this.max.add(vector);
      return this;
    }
    /**
     * 通过大小扩展二维包围盒
     * @param {number} scalar 扩展大小
     * @return {Box2} 扩展结果
     */

  }, {
    key: "expandByScalar",
    value: function expandByScalar(scalar) {
      this.min.add(-scalar);
      this.max.add(scalar);
      return this;
    }
    /**
     * 判断二维包围盒是否包含二维空间点
     * @param {Vec2} point 二维空间点
     * @param {boolean} [isOrthogonal=true] 包围盒正交判断(默认为true)
     * @return {boolean} 点包含判断结果
     */

  }, {
    key: "containsPoint",
    value: function containsPoint(point) {
      var isOrthogonal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (isOrthogonal) {
        return point.x < this.min.x || point.x > this.max.x || point.y < this.min.y || point.y > this.max.y ? false : true;
      } else {
        if (this.isEmpty()) {
          return false;
        }

        for (var i = 0; i < this.corners.length; i++) {
          var corner = this.corners[i];
          var next = this.corners[(i + 1) % 4];
          var edge = new Vec2(next.x - corner.x, next.y - corner.y);
          var vec = new Vec2(point.x - corner.x, point.y - corner.y);

          if (edge.cross(vec) < 0) {
            return false;
          }
        }

        return true;
      }
    }
    /**
     * 判断二维包围盒包含关系(if this contains other)
     * @param {Box2} box 其它包围盒
     * @return {boolean} 二维包围盒包含判断结果
     */

  }, {
    key: "containsBox",
    value: function containsBox(box) {
      return this.min.x <= box.min.x && box.max.x <= this.max.x && this.min.y <= box.min.y && box.max.y <= this.max.y;
    }
    /**
     * 获取点以包围盒左上角顶点为原点的相对位置
     * @param {Vec2} point 指定二维空间点
     * @param {Vec2} [target=new Vec2()] 目标空间点
     * @return {Vec2} 计算结果空间点
     */

  }, {
    key: "getParameter",
    value: function getParameter(point) {
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vec2();
      // This can potentially have a divide by zero if the box
      // has a size dimension of 0.
      return target.set((point.x - this.min.x) / (this.max.x - this.min.x), (point.y - this.min.y) / (this.max.y - this.min.y));
    }
    /**
     * 判断二维包围盒相交关系(if this intersect other)
     * @param {Box2} box 二维包围盒
     * @param {boolean} [isOrthogonal=true] 正交判断(当前包围盒)
     * @return {boolean} 相交判断结果
     */

  }, {
    key: "intersectsBox",
    value: function intersectsBox(box) {
      var isOrthogonal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      // using 4 splitting planes to rule out intersections
      // 基于点判断
      if (isOrthogonal) {
        return !(box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y);
      } else {
        if (!this.isEmpty()) {
          for (var i = 0; i < this.corners.length; i++) {
            var line = new Line2(this.corners[i], this.corners[(i + 1) % 4]);

            if (box.containsPoint(this.corners[i], false)) {
              return true;
            }

            for (var j = 0; j < box.corners.length; j++) {
              var boxLine = new Line2(box.corners[j], box.corners[(j + 1) % 4]);

              if (this.containsPoint(box.corners[j], false)) {
                return true;
              }

              if (line.crossWithLine(boxLine)) {
                return true;
              }
            }
          }
        }

        for (var _i = 0; _i < box.corners.length; _i++) {
          var state = this.containsPoint(box.corners[_i], false);
          var stateOther = box.containsPoint(this.corners[_i], false);

          if (state || stateOther) {
            return true;
          }
        }

        return false;
      }
    }
    /**
     * 求点与二维包围盒的最近点
     * @param {Vec2} point 二维空间点
     * @param {Vec2} [target=new Vec2()] 结果点
     * @return {Vec2} 二维空间点
     */

  }, {
    key: "clampPoint",
    value: function clampPoint(point) {
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vec2();
      return target.copy(point).clamp(this.min, this.max);
    }
    /**
     * 求点到二维包围盒的距离
     * @param {Vec2} point 二维空间点
     * @return {number} 距离
     */

  }, {
    key: "distanceToPoint",
    value: function distanceToPoint(point) {
      var clampedPoint = new Vec2().copy(point).clamp(this.min, this.max);
      return clampedPoint.sub(point).length();
    }
    /**
     * 二维包围盒求交集
     * @param {Box2} box 二维包围盒
     * @return {Box2} 求交结果
     */

  }, {
    key: "intersect",
    value: function intersect(box) {
      this.min.max(box.min);
      this.max.min(box.max);

      if (this.min.x > this.max.x || this.min.y > this.max.y) {
        return this.makeEmpty();
      }

      return this;
    }
    /**
     * 二维包围盒求并集
     * @param {Box2} box 二维包围盒
     * @return {Box2} 求并结果
     */

  }, {
    key: "union",
    value: function union(box) {
      this.min.min(box.min);
      this.max.max(box.max);
      this.corners = [Vec2.copy(this.min), new Vec2(this.max.x, this.min.y), Vec2.copy(this.max), new Vec2(this.min.x, this.max.y)];
      return this;
    }
    /**
     * 二维包围盒位移
     * @param {Vec2} offset 位移向量
     * @return {Box2} 位移结果
     */

  }, {
    key: "translate",
    value: function translate(offset) {
      this.min.add(offset);
      this.max.add(offset);
      return this;
    }
    /**
     * 二维包围盒判等
     * @param {Box2} box 二维包围盒
     * @return {boolean} 判等结果
     */

  }, {
    key: "equals",
    value: function equals(box) {
      return box.min.equals(this.min) && box.max.equals(this.max);
    }
  }]);

  return Box2;
}();

/**
 * 三维包围盒
 * @class
 */

var Box3 = /*#__PURE__*/function () {
  /**
   * 构造函数，传入值为空时表示空包围盒
   * @param {Vec3} [min=new Vec3(Number(Infinity))] 最小角点
   * @param {Vec3} [max=new Vec3(-Infinity)] 最大角点
   */
  function Box3() {
    var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vec3(Number(Infinity));
    var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vec3(-Infinity);

    _classCallCheck(this, Box3);

    this.min = min;
    this.max = max;
  }

  _createClass(Box3, [{
    key: "intersectsSphere",
    value: function intersectsSphere(sphere) {
      throw new Error('Method not implemented.');
    }
    /**
     * 设置三维包围盒的值
     * @param {Vec3} min 三维包围盒最小点
     * @param {Vec3} max 三维包围盒最大点
     * @return {Box3}
     */

  }, {
    key: "set",
    value: function set(min, max) {
      this.min.copy(min);
      this.max.copy(max);
      return this;
    }
    /**
     * 由数组构建三维包围盒
     * @param {number[]} array 数组集合(每三个数视为一个三维空间点)
     * @return {Box3} 三维包围盒
     */

  }, {
    key: "setFromArray",
    value: function setFromArray(array) {
      var minX = Number(Infinity);
      var minY = Number(Infinity);
      var minZ = Number(Infinity);
      var maxX = -Infinity;
      var maxY = -Infinity;
      var maxZ = -Infinity;

      for (var i = 0, l = array.length; i < l; i += 3) {
        var x = array[i];
        var y = array[i + 1];
        var z = array[i + 2];

        if (x < minX) {
          minX = x;
        }

        if (y < minY) {
          minY = y;
        }

        if (z < minZ) {
          minZ = z;
        }

        if (x > maxX) {
          maxX = x;
        }

        if (y > maxY) {
          maxY = y;
        }

        if (z > maxZ) {
          maxZ = z;
        }
      }

      this.min.set(minX, minY, minZ);
      this.max.set(maxX, maxY, maxZ);
      return this;
    }
    /**
     * 由三维空间点构建三维包围盒
     * @param {Vec3[]} points 三维空间点集合
     * @return {Box3} 三维包围盒
     */

  }, {
    key: "setFromPoints",
    value: function setFromPoints(points) {
      this.makeEmpty();

      for (var i = 0, il = points.length; i < il; i++) {
        this.expandByPoint(points[i]);
      }

      return this;
    }
    /**
     * 由三维空间点（包围盒中心）和大小确定包围盒
     * @param {Vec3} center 三维包围盒中心点
     * @param {Vec3} size 三维包围盒大小值
     * @return {Box3} 三维包围盒
     */

  }, {
    key: "setFromCenterAndSize",
    value: function setFromCenterAndSize(center, size) {
      var halfSize = new Vec3().copy(size).multiply(0.5);
      this.min.copy(center).sub(halfSize);
      this.max.copy(center).add(halfSize);
      return this;
    } // TODO

    /**
     * 由实体构建包围盒
     * @param object 构件实体
     * @returns 三维包围盒
     */

  }, {
    key: "setFromObject",
    value: function setFromObject(object) {
      this.makeEmpty();
      return this.expandByObject(object);
    }
    /**
     * 克隆三维包围盒
     * @return {Box3} 克隆结果
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Box3().copy(this);
    }
    /**
     * 复制三维包围盒
     * @param {Box3} box 复制对象
     * @return {Box3} 复制结果
     */

  }, {
    key: "copy",
    value: function copy(box) {
      this.min.copy(box.min);
      this.max.copy(box.max);
      return this;
    }
    /**
     * 三维包围盒置空
     * @return {Box3} 置空结果
     */

  }, {
    key: "makeEmpty",
    value: function makeEmpty() {
      this.min.x = this.min.y = this.min.z = Number(Infinity);
      this.max.x = this.max.y = this.max.z = -Infinity;
      return this;
    }
    /**
     * 三维包围盒判空
     * @return {boolean} 判空结果
     */

  }, {
    key: "isEmpty",
    value: function isEmpty() {
      // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
      return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
    }
    /**
     * 获取三维包围盒中心
     * @param {Vec3} [target=new Vec3()]
     * @return {Vec3}
     */

  }, {
    key: "getCenter",
    value: function getCenter() {
      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vec3();
      return this.isEmpty() ? target.set(0, 0, 0) : target.addVectors(this.min, this.max).multiply(0.5);
    }
    /**
     * 获取三维包围盒大小
     * @param {Vec3} [target=new Vec3()] 结果保存对象
     * @return {Vec3} 三维包围盒大小
     */

  }, {
    key: "getSize",
    value: function getSize() {
      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vec3();
      return this.isEmpty() ? target.set(0, 0, 0) : target.subVectors(this.max, this.min);
    }
    /**
     * 通过三维空间点扩展三维包围盒
     * @param {Vec3} point 三维空间点
     * @return {Box3} 扩展结果
     */

  }, {
    key: "expandByPoint",
    value: function expandByPoint(point) {
      this.min.min(point);
      this.max.max(point);
      return this;
    }
    /**
     * 通过三维向量扩展三维包围盒
     * @param {Vec3} vector 三维向量
     * @return {Box3} 扩展结果
     */

  }, {
    key: "expandByVector",
    value: function expandByVector(vector) {
      this.min.sub(vector);
      this.max.add(vector);
      return this;
    }
    /**
     * 通过实数扩展三维包围盒
     * @param {number} scalar 扩展大小
     * @return {Box3} 扩展结果
     */

  }, {
    key: "expandByScalar",
    value: function expandByScalar(scalar) {
      this.min.add(-scalar);
      this.max.add(scalar);
      return this;
    } // TODO

    /**
     * 通过实体扩展三维包围盒
     * @param object 构件实体
     * @return {Box3} 扩展结果
     */

  }, {
    key: "expandByObject",
    value: function expandByObject(object) {
      // Computes the world-axis-aligned bounding box of an object (including its children),
      // accounting for both the object's, and children's, world transforms
      object.updateWorldMatrix(false, false);
      var geometry = object.geometry;

      if (geometry !== undefined) {
        if (geometry.boundingBox === null) {
          geometry.computeBoundingBox();
        }

        var box3 = new Box3();
        box3.copy(geometry.boundingBox);
        box3.applyMatrix4(object.matrixWorld);
        this.union(box3);
      }

      var children = object.children;

      for (var i = 0, l = children.length; i < l; i++) {
        this.expandByObject(children[i]);
      }

      return this;
    }
    /**
     * 判断三维包围盒相交关系(if this intersect other)
     * @param {Vec3} point 三维空间点
     * @return {boolean} 点包含判断结果
     */

  }, {
    key: "containsPoint",
    value: function containsPoint(point) {
      return !(point.x < this.min.x || point.x > this.max.x || point.y < this.min.y || point.y > this.max.y || point.z < this.min.z || point.z > this.max.z);
    }
    /**
     * 判断三维包围盒与三维包围盒的包含关系
     * @param {Box3} other 三维包围盒
     * @return {boolean} 包围盒包含结果(true表示this包含other, false表示this不包含other)
     */

  }, {
    key: "containsBox",
    value: function containsBox(other) {
      return this.min.x <= other.min.x && this.max.x >= other.max.x && this.min.y <= other.min.y && this.max.y >= other.max.y && this.min.z <= other.min.z && this.max.z >= other.max.z;
    } // TODO

    /**
     * 获取点在三维包围盒的比例位置
     * @param {Vec3} point 三维空间点
     * @param {Vec3} [target=new Vec3()] 结果保存对象
     * @return {Vec3} 点在包围盒比例位置
     */

  }, {
    key: "getParameter",
    value: function getParameter(point) {
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vec3();
      // This can potentially have a divide by zero if the box
      // has a size dimension of 0.
      return target.set((point.x - this.min.x) / (this.max.x - this.min.x), (point.y - this.min.y) / (this.max.y - this.min.y), (point.z - this.min.z) / (this.max.z - this.min.z));
    }
    /**
     * 判断三维包围盒相交关系(if this intersect other)
     * @param {Box3} other 三维包围盒
     * @return {boolean} 相交判断结果
     */

  }, {
    key: "intersectsBox",
    value: function intersectsBox(other) {
      // using 6 splitting planes to rule out intersections.
      return !(other.max.x < this.min.x || other.min.x > this.max.x || other.max.y < this.min.y || other.min.y > this.max.y || other.max.z < this.min.z || other.min.z > this.max.z);
    }
    /**
     * 求点与三维包围盒的最近点
     * @param {Vec3} point 三维空间点
     * @param {Vec3} [target=new Vec3()] 结果存放对象
     * @return {Vec3} 计算结果
     */

  }, {
    key: "clampPoint",
    value: function clampPoint(point) {
      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vec3();
      return target.copy(point).clamp(this.min, this.max);
    }
    /**
     * 三维空间点到三维包围盒的距离
     * @param {Vec3} point 三维包围盒
     * @return {number} 距离结果
     */

  }, {
    key: "distanceToPoint",
    value: function distanceToPoint(point) {
      var clampedPoint = new Vec3().copy(point).clamp(this.min, this.max);
      return clampedPoint.sub(point).length();
    }
    /**
     * 三维包围盒求交集
     * @param {Box3} box 三维包围盒
     * @return {Box3} 求交结果
     */

  }, {
    key: "intersect",
    value: function intersect(box) {
      this.min.max(box.min);
      this.max.min(box.max); // ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.

      if (this.isEmpty()) {
        this.makeEmpty();
      }

      return this;
    }
    /**
     * 三维包围盒求并集
     * @param {Box3} box 三维包围盒
     * @return {Box3} 求并结果
     */

  }, {
    key: "union",
    value: function union(box) {
      this.min.min(box.min);
      this.max.max(box.max);
      return this;
    }
    /**
     * 通过三维变换矩阵变化三维包围盒
     * @param {Matrix4} matrix 三维变换矩阵
     * @return {Box3} 变换结果
     */

  }, {
    key: "applyMatrix4",
    value: function applyMatrix4(matrix) {
      // transform of empty box is an empty box.
      if (this.isEmpty()) {
        return this;
      }

      var points = [new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3()]; // NOTE: I am using a binary pattern to specify all 2^3 combinations below

      points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix); // 000

      points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix); // 001

      points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix); // 010

      points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix); // 011

      points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix); // 100

      points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix); // 101

      points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix); // 110

      points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix); // 111

      this.setFromPoints(points);
      return this;
    }
    /**
     * 三维包围盒位移
     * @param {Vec3} offset 三维位移向量
     * @return {Box3} 位移结果
     */

  }, {
    key: "translate",
    value: function translate(offset) {
      this.min.add(offset);
      this.max.add(offset);
      return this;
    }
    /**
     * 三维包围盒判等
     * @param {Box3} other 三维包围盒
     * @return {boolean} 判等结果
     */

  }, {
    key: "equals",
    value: function equals(other) {
      return other.min.equals(this.min) && other.max.equals(this.max);
    }
  }]);

  return Box3;
}();

/**
 * @class 三维线段
 */

var Line3 = /*#__PURE__*/_createClass(
/**
 * 构造函数
 * @param {Vec3} [start=new Vec3()] 线段起点，默认值为(0, 0, 0)
 * @param {Vec3} [end=new Vec3()] 线段终点，默认值为(0, 0, 0)
 */
function Line3() {
  var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vec3();
  var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vec3();

  _classCallCheck(this, Line3);

  this.start = start;
  this.end = end;
});

/**
 * @class 二维圆
 */

var Circle = /*#__PURE__*/function () {
  /**
   * 构造函数，默认值为圆心为原点,半径为0
   * @param {Vec2} [center=new Vec2()] 圆心
   * @param {number} [radius=0] 半径
   */
  function Circle() {
    var center = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vec2();
    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Circle);

    this.center = center;
    this.radius = radius;
    this.center = Vec2.copy(center);
  }
  /**
   * 通过中心点与大小设置圆
   * @param {Vec2} center 圆心
   * @param {number} radius 半径
   * @return {Circle}
   */


  _createClass(Circle, [{
    key: "set",
    value: function set(center, radius) {
      this.center = Vec2.copy(center);
      this.radius = radius;
      return this;
    }
    /**
     * 克隆圆
     * @return {Circle} 克隆结果
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Circle().copy(this);
    }
    /**
     * 复制圆
     * @param {Circle} circle 复制对象
     * @return {Circle} 复制结果
     */

  }, {
    key: "copy",
    value: function copy(circle) {
      this.center.copy(circle.center);
      this.radius = circle.radius;
      return this;
    }
    /**
     * 圆置空
     * @return {Circle} 置空结果
     */

  }, {
    key: "makeEmpty",
    value: function makeEmpty() {
      this.center = new Vec2();
      this.radius = 0;
      return this;
    }
    /**
     * 圆判空
     * @return {boolean} 判空结果
     */

  }, {
    key: "isEmpty",
    value: function isEmpty() {
      // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
      return this.radius === 0;
    }
    /**
     * 获取圆心
     * @param {Vec2} [target=new Vec2()] 目标结果对象
     * @return {Vec2} 圆心
     */

  }, {
    key: "getCenter",
    value: function getCenter() {
      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vec2();
      target.copy(this.center);
      return target;
    }
    /**
     * 获取半径
     * @param {number} [radius] 目标结果对象
     * @return {number} 半径
     */

  }, {
    key: "getRadius",
    value: function getRadius(radius) {
      return this.radius;
    }
    /**
     * 通过二维空间点扩展圆
     * @param {Vec2} point 二维空间点
     * @return {Circle} 扩展结果
     */

  }, {
    key: "expandByPoint",
    value: function expandByPoint(point) {
      this.radius = this.center.distanceTo(point);
      return this;
    }
    /**
     * 通过大小扩展圆
     * @param {number} scalar 扩展大小
     * @return {Circle} 扩展结果
     */

  }, {
    key: "expandByScalar",
    value: function expandByScalar(scalar) {
      this.radius += scalar;
      return this;
    }
    /**
     * 判断圆是否包含二维空间点
     * @param {Vec2} point 二维空间点
     * @return {boolean}  包含判断结果
     */

  }, {
    key: "containsPoint",
    value: function containsPoint(point) {
      return this.center.distanceTo(point) < this.radius;
    }
    /**
     * 判断圆是否包含二维包围盒
     * @param {Box2} box 二维包围盒
     * @return {boolean} 包含判断结果
     */

  }, {
    key: "containsBox",
    value: function containsBox(box) {
      for (var i = 0; i < 4; i++) {
        if (!this.containsPoint(box.corners[i])) {
          return false;
        }
      }

      return true;
    }
    /**
     * 判断圆与二维包围盒的相交关系
     * @param {Box2} box 二维包围盒
     * @return {boolean} 相交判断结果
     */

  }, {
    key: "intersectsBox",
    value: function intersectsBox(box) {
      // using 4 splitting planes to rule out intersections
      for (var i = 0; i < 4; i++) {
        if (this.containsPoint(box.corners[i])) {
          return true;
        }
      }

      return false;
    }
    /**
     * 求点与圆的最短距离
     * @param {Vec2} point 二维空间点
     * @return {number} 距离
     */

  }, {
    key: "distanceToPoint",
    value: function distanceToPoint(point) {
      return this.center.distanceTo(point) - this.radius;
    }
    /**
     * 圆求交集
     * @param {Circle} circle 二维圆
     * @return {Circle} 求交结果
     */

  }, {
    key: "intersect",
    value: function intersect(circle) {
      this.center = this.center.add(circle.center);
      this.radius = this.radius + circle.radius - this.center.distanceTo(circle.center);
      this.radius = this.radius < 0 ? 0 : this.radius;
      return this;
    }
    /**
     * 圆求并集
     * @param {Circle} circle 二维圆
     * @return {Circle} 求并结果
     */

  }, {
    key: "union",
    value: function union(circle) {
      this.center = this.center.add(circle.center);
      this.radius = (this.radius + circle.radius + this.center.distanceTo(circle.center)) / 2;
      return this;
    }
    /**
     * 圆的位移
     * @param {Vec2} offset 二维向量
     * @return {Circle} 位移结果
     */

  }, {
    key: "translate",
    value: function translate(offset) {
      this.center.add(offset);
      return this;
    }
    /**
     * 圆判等
     * @param {Circle} circle 二维圆
     * @return {boolean} 判等结果
     */

  }, {
    key: "equals",
    value: function equals(circle) {
      return this.center.equals(circle.center) && this.radius === circle.radius;
    }
  }]);

  return Circle;
}();

exports.Box2 = Box2;
exports.Box3 = Box3;
exports.Circle = Circle;
exports.DEG2RAD = DEG2RAD;
exports.Euler = Euler;
exports.Line2 = Line2;
exports.Line3 = Line3;
exports.Matrix3 = Matrix3;
exports.Matrix4 = Matrix4;
exports.PI2 = PI2;
exports.Quaternion = Quaternion;
exports.RAD2DEG = RAD2DEG;
exports.Vec2 = Vec2;
exports.Vec3 = Vec3;
exports.Vec4 = Vec4;
exports.ceilPowerOfTwo = ceilPowerOfTwo;
exports.clamp = clamp;
exports.damp = damp;
exports.degToRad = degToRad;
exports.euclideanModulo = euclideanModulo;
exports.fixed = fixed;
exports.floorPowerOfTwo = floorPowerOfTwo;
exports.intMultiplyFloat = intMultiplyFloat;
exports.inverseLerp = inverseLerp;
exports.isPowerIntegerOfTwo = isPowerIntegerOfTwo;
exports.isPowerOfTwo = isPowerOfTwo;
exports.kfRadius = kfRadius;
exports.lerp = lerp;
exports.mapLinear = mapLinear;
exports.modByFloat = modByFloat;
exports.nearestPowerIntegerOfTwo = nearestPowerIntegerOfTwo;
exports.nearestPowerOfTwo = nearestPowerOfTwo;
exports.pingpong = pingpong;
exports.radToDeg = radToDeg;
exports.randFloat = randFloat;
exports.randFloatSpread = randFloatSpread;
exports.randInt = randInt;
exports.resetObjectByRatio = resetObjectByRatio;
exports.resetPropertyByRatio = resetPropertyByRatio;
exports.roundNumber = roundNumber;
exports.seededRandom = seededRandom;
exports.smootherstep = smootherstep;
exports.smoothstep = smoothstep;
//# sourceMappingURL=index.js.map
