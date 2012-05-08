
/**
 * @class
 * @singleton
 * Main class.
 */
var i2DX = {};

/**
 * Creates a function that calls the function at the property `name` on object `obj`.
 * @param {Object} obj any object
 * @param {String} name name of property
 * @return {Function} a function that can 
 */
i2DX.proxy = function(obj, name) {
	return function() {
		return obj[name].apply(obj, arguments);
	};
};


i2DX._listeners = {};

/**
 * Listens to a broadcast
 * @param {String} name broadcast name
 * @param {Object} fn function to call on broadcast
 */
i2DX.listen = function(name, fn) {
	var arr = this._listeners[name] || (this._listeners[name] = []);
	arr.push(fn);
};

/**
 * Broadcasts a message.
 * @param {String} name broadcast name
 * @param {Object} args... arguments to send
 */
i2DX.broadcast = function() {
	var args = [].slice.call(arguments);
	var name = args.shift();
	window.console && console.log && console.log(name, args);
	var arr = this._listeners[name];
	if (!arr) return false;
	for (var i = 0; i < arr.length; i ++) {
		arr[i].apply(null, args);
	}
};

/**
 * Creates a namespace. Should be used at the top of the file.
 * @param {String} namespace name of the namespace
 * @return {Object} the namespace object
 */
i2DX.ns = function(namespace) {
	var parts = namespace.split(/\./);
	var current = i2DX;
	for (var i = 0; i < parts.length; i ++) {
		var part = parts[i];
		current = current[part] || (current[part] = {});
	}
	return current;
};


/**
 * Initializes a client!
 */
i2DX.initClient = function() {
	i2DX.mainClient = new i2DX.Application();
};

i2DX._params = {};

i2DX.setParam = function(k, v) {
	i2DX._params[k] = v;
};

i2DX.getParam = function(k, d) {
	return i2DX._params[k] != null ? i2DX._params[k] : d;
};


i2DX._layouts = {};
i2DX._skins = {};

/**
 * Registers a layout
 * @param {String} layoutName name of the layout
 * @param {Function} layoutFunction a function for the layout
 */
i2DX.layout = function(layoutName, layoutFunction) {
	i2DX._layouts[layoutName] = layoutFunction;
};

/**
 * Registers a skin
 */
i2DX.skin = function(skinName, skinInfo) {
	i2DX._skins[skinName] = skinInfo;
};
