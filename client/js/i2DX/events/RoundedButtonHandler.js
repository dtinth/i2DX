
i2DX.ns('events');

/**
 * @class
 * @extends i2DX.events.TouchHandler
 * A button handler.
 */
i2DX.events.RoundedButtonHandler = function(component) {
	var s = new i2DX.events.ButtonHandler(component);
	s._checkBounds = function(touch) {
		var bounds = this._component.getBounds();
		var threshould = 25;
		var dx = touch.x - (bounds.left + bounds.width / 2);
		var dy = touch.y - (bounds.top + bounds.height / 2);
		var radius = bounds.width / 2;
		var max = radius + threshould;
		return dx * dx + dy * dy < max * max;
	};
	return s;
};
