
i2DX.ns('events');

/**
 * @class
 * @extends i2DX.events.TouchHandler
 * A turntable handler.
 */
i2DX.events.TurntableHandler = function(component, placement) {
	this._component = component;
	this._placement = placement;
	this._inner = document.createElement('div');
	this._inner.innerHTML = '<span class="text">i2DX</span>';
	this._inner.className = 'turntable-inner';
	this._clearState();
	this._component.getElement().appendChild(this._inner);
	this._component.set('extended', 'no');
	this._component.set('fullscreen', placement == 'fullscreen' ? 'yes' : 'no');
	this._component.set('placement', placement);
	this._sum = 0;
	this._count = 0;
	this._last = 0;
	this._spinning = false;
	this._history = null;
	this._extended = false;
	this._lastState = null;
	this._addDelta(0);
	this._getCenter();
};

i2DX.events.TurntableHandler.prototype = {
	check: function(touch) {
		if (this._checkBounds(touch)) {
			touch.stopChecking();
			return this._createHandler();
		}
	},
	_triggerState: function(stateName) {
		clearTimeout(this._stateTimeout);
		this._component.set('state', stateName);
		this._stateTimeout = setTimeout(i2DX.proxy(this, '_clearState'), 150);
		this._spinning = true;
		this._broadcastState(stateName);
	},
	_clearState: function() {
		this._component.set('state', 'normal');
		this._broadcastState(null);
		this._spinning = false;
	},
	_broadcastState: function(stateName) {
		if (this._lastState == stateName) return;
		if (this._lastState != null) {
			i2DX.broadcast('up', this._component.getName() + '_' + this._lastState, this._component.getPlayer());
		}
		this._lastState = stateName;
		if (this._lastState != null) {
			i2DX.broadcast('down', this._component.getName() + '_' + this._lastState, this._component.getPlayer());
		}
	},
	_checkBounds: function(touch) {
		if (this._placement == 'fullscreen') return true;
		var distance = { left: touch.x, right: window.innerWidth - touch.x };
		return distance[this._placement] < this._component.getBounds().width + 25;
	},
	_getCenter: function() {
		var center;
		if (this._placement == 'left') center = { x: window.innerHeight / 2, y: window.innerHeight / 2 };
		else if (this._placement == 'right') center = { x: window.innerWidth - window.innerHeight / 2, y: window.innerHeight / 2 };
		else center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		var bounds = this._component.getBounds();
		this._inner.style.top = (center.y - bounds.top) + 'px';
		this._inner.style.left = (center.x - bounds.left) + 'px';
		return center;
	},
	_createHandler: function() {
		var that = this;
		var center = that._getCenter();
		that._down();
		return {
			_lastAngle: null,
			_extended: false,
			move: function(touch) {
				var angle = Math.atan2(touch.y - center.y, touch.x - center.x) * 180 / Math.PI;
				if (this._lastAngle != null) {
					var delta = angle - this._lastAngle;
					for (var i = 0; i < 10; i ++) {
						if (Math.abs(delta - 180) < Math.abs(delta)) delta -= 180;
						else if (Math.abs(delta + 180) < Math.abs(delta)) delta += 180;
						else break;
					}
					that._addDelta(delta);
				}
				if (!that._checkBounds(touch)) {
					if (!this._extended) {
						this._extended = true;
						if (that._extended == 0) {
							that._component.set('extended', 'yes');
						}
						that._extended++;
					}
				}
				this._lastAngle = angle;
				return true;
			},
			release: function() {
				that._up();
				if (this._extended) {
					that._extended--;
					if (that._extended == 0) {
						that._component.set('extended', 'no');
					}
				}
			}
		};
	},
	_addDelta: function(delta) {
		this._sum += delta;
		if (this._history != null) {
			this._history.push({ time: new Date().getTime(), angle: this._sum });
			this._purgeHistory();
		}
		var angularThreshould = 5;
		var current = Math.round(this._sum / angularThreshould);
		if (this._last != current) {
			this._triggerState(current > this._last ? 'cw' : 'ccw');
			this._last = current;
		}
		var transform = 'rotate(' + this._sum + 'deg)';
		this._inner.style.WebkitTransform = 'translateZ(0) ' + transform;
	},
	_purgeHistory: function() {
		while (this._history.length > 0) {
			if (new Date().getTime() - this._history[0].time <= 150) {
				break;
			}
			this._history.shift();
		}
	},
	_down: function() {
		if (this._count == 0) {
			this._stopAnimation();
			this._history = [];
		}
		this._count++;
	},
	_up: function() {
		this._count--;
		if (this._count == 0) {
			this._purgeHistory();
			if (this._history != null && this._history.length >= 2) {
				var first = this._history[0];
				var last = this._history[this._history.length - 1];
				if (last.time > first.time) {
					var velocity = (last.angle - first.angle) / (last.time - first.time);
					this._startAnimation(velocity);
				}
			}
		}
	},
	_startAnimation: function(_velocity) {
		var that = this;
		this._animation = {
			_initialVelocity: Math.abs(_velocity),
			_direction: _velocity < 0 ? -1 : 1,
			_start: new Date().getTime(),
			_last: 0,
			start: function() {
				this._timer = setInterval(i2DX.proxy(this, '_animate'), 1000 / 60);
			},
			stop: function() {
				clearInterval(this._timer);
			},
			_animate: function() {
				var u = this._initialVelocity;
				var t = new Date().getTime() - this._start;
				var a = -0.005;
				var tFinish = -u / a;
				if (t > tFinish) {
					t = tFinish;
					this.stop();
				}
				var s = (u * t + a * t * t / 2) * this._direction;
				that._addDelta(s - this._last);
				this._last = s;
			}
		};
		this._animation.start();
	},
	_stopAnimation: function() {
		if (this._animation) {
			this._animation.stop();
		}
	}
};
