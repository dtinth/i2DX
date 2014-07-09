
i2DX.ns('events');

/**
 * @class
 * @extends i2DX.events.TouchHandler
 * A button handler.
 */
i2DX.events.ElementButtonHandler = function(component) {
	var s = new i2DX.events.ButtonHandler(component);
	s._checkBounds = function(touch) {
		return this._component.isAtPoint(touch.x, touch.y);
	};
	return s;
};
