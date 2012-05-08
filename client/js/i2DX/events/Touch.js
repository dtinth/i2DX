
i2DX.ns('events');

/**
 * @class
 * Represents a single "press" on the screen. Instantiated when a finger is pressed on the screen and is
 * destroyed (released) when the finger leaves the screen or is lifted up.
 */
i2DX.events.Touch = function(identifier) {
	this._checking = true;
	this._handlers = [];
	this.identifier = identifier;
};

i2DX.events.Touch.prototype = {

	/**
	 * Tells this instance of touch to stop checking for new handlers to be accepted.
	 */
	stopChecking: function() {
		this._checking = false;
	},

	/**
	 * Fire when the touch has moved.
	 * @param {Event} e event the has occured
	 * @param {Array} checkers the list of checkers to check
	 */
	move: function(e, checkers) {
		this.x = e.clientX;
		this.y = e.clientY;
		if (this._checking) {
			for (var i = 0; i < checkers.length; i ++) {
				var check = true;
				for (var j = 0; j < this._handlers.length; j ++) {
					if (this._handlers[j].checker === checkers[i]) {
						check = false;
						break;
					}
				}
				if (check) {
					var result = checkers[i].check(this);
					if (result != null) {
						this._handlers.push({
							checker: checkers[i],
							handler: result
						});
					}
				}
			}
			if (this._handlers.length > 0) {
				if (i2DX.getParam('hard', 'off') == 'on') {
					this.stopChecking();
				}
			}
		}
		var newHandlers = [];
		for (var i = 0; i < this._handlers.length; i ++) {
			var result = this._handlers[i].handler.move(this);
			if (result !== false) {
				newHandlers.push(this._handlers[i]);
			}
		}
		this._handlers = newHandlers;
	},

	/**
	 * Called when the finger is released, and releases all the handler that is collected with it.
	 */
	release: function() {
		for (var i = 0; i < this._handlers.length; i ++) {
			this._handlers[i].handler.release(this);
		}
	}
};
