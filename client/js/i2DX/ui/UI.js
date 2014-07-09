
i2DX.ns('ui');

/**
 * The user interface. Creates the interface and responds to touch events.
 */
i2DX.ui.UI = function() {
	this._handlers = [];
	this._touches = {};
	this._defaultPlayer = {};
	this._addTouchHandler();
	this._addMouseHandler();
};

i2DX.ui.UI.prototype = {

	/**
	 * Adds a new component to the interface.
	 * @param {i2DX.ui.Component} component the component to add
	 * @param {i2DX.events.TouchHandler} the touch handler
	 */
	add: function(component, handler) {
		component.renderTo(document.body);
		if (handler) {
			this._handlers.push(handler);
		}
	},

	/**
	 * Adds a button to the UI.
	 * @param {String} name name of the button.
	 * @param {Object} style the style to pass to i2DX.ui.Component#button
	 */
	button: function(name, style, player) {
		player = player || this._defaultPlayer;
		var component = new i2DX.ui.Component(name, style, player);
		this.add(component, new i2DX.events.ButtonHandler(component));
	},

	/**
	 * Adds a rounded button to the UI.
	 * @param {String} name name of the button.
	 * @param {Object} style the style to pass to i2DX.ui.Component#button
	 */
	roundedButton: function(name, style, player) {
		player = player || this._defaultPlayer;
		var component = new i2DX.ui.Component(name, style, player);
		this.add(component, new i2DX.events.RoundedButtonHandler(component));
	},

	/**
	 * Adds a button to the UI whose bound is check by actual element.
	 * @param {String} name name of the button.
	 * @param {Object} style the style to pass to i2DX.ui.Component#button
	 */
	elementButton: function(name, style, player) {
		player = player || this._defaultPlayer;
		var component = new i2DX.ui.Component(name, style, player);
		this.add(component, new i2DX.events.ElementButtonHandler(component));
	},

	/**
	 * Adds a turntable to the UI.
	 * @param {Number} width width of the turntable.
	 * @param {String} placement either "left" or "right"
	 */
	turntable: function(width, placement, player) {
		player = player || this._defaultPlayer;
		var style = { top: 0, bottom: 0, width: width };
		style[placement] = 0;
		var component = new i2DX.ui.Component('turntable', style, player);
		this.add(component, new i2DX.events.TurntableHandler(component, placement));
	},
	
	/**
	 * Adds a full-screen turntable to the UI.
	 */
	turntableFullscreen: function(player) {
		player = player || this._defaultPlayer;
		var component = new i2DX.ui.Component('turntable', { top: 0, right: 0, bottom: 0, left: 0 }, player);
		this.add(component, new i2DX.events.TurntableHandler(component, 'fullscreen'));
	},

	/**
	 * Sets the default player number for newly created components.
	 * @param {Number} playerNumber the player number
	 */
	setDefaultPlayer: function(playerNumber) {
		this._defaultPlayer = playerNumber;
	},

	/**
	 * Gets the default player number.
	 * @return {Number} the default player number
	 */
	getDefaultPlayer: function() {
		return this._defaultPlayer;
	},

	_addTouchHandler: function() {
		document.addEventListener('touchstart', i2DX.proxy(this, '_updateTouches'), false);
		document.addEventListener('touchmove', i2DX.proxy(this, '_updateTouches'), false);
		document.addEventListener('touchend', i2DX.proxy(this, '_updateTouches'), false);
	},
	_addMouseHandler: function() {
		var that = this;
		var touch;
		document.addEventListener('mousedown', function(e) {
			touch = new i2DX.events.Touch('mouse');
			touch.move(e, that._handlers);
			e.preventDefault();
			e.stopPropagation();
		}, false);
		document.addEventListener('mousemove', function(e) {
			if (touch) touch.move(e, that._handlers);
			e.preventDefault();
			e.stopPropagation();
		}, false);
		document.addEventListener('mouseup', function(e) {
			touch.release();
			touch = null;
			e.preventDefault();
			e.stopPropagation();
		}, false);
	},
	_updateTouches: function(e) {
		e.preventDefault();
		e.stopPropagation();
		var map = {};
		var touches = e.touches;
		for (var i = 0; i < touches.length; i ++) {
			var touch = this._touches[touches[i].identifier] || (this._touches[touches[i].identifier] = new i2DX.events.Touch(touches[i].identifier));
			touch.move(touches[i], this._handlers);
			map[touches[i].identifier] = true;
		}
		for (var i in this._touches) {
			if (!map[i]) {
				this._touches[i].release();
				delete this._touches[i];
			}
		}
	}
};
