var I2DX = function(options) {

	('' + location.search).replace(/(?:^\??|&)([^=]+)=([^&]+)/, function(all, k, v) {
		options[k] = v;
	});

	var s = new WebSocket("ws://" + location.host + "/ws");
	function setStatus(text) {
		document.getElementById('status').innerHTML = text;
	}
	(function() {
		s.onopen = function(e) {
			setStatus('Connected!');
		};
		s.onclose = function(e) {
			setStatus('Disconnected from i2DX Server.');
		};
		s.onmessage = function(e) {
			setStatus(e.data);
		};
		s.onerror = function(e) {
			setStatus("error: " + e.data);
		};
	})();
	
	var send, flush;
	(function() {
		var sent = false, junk;
		for (junk = 'junk'; junk.length < 4096; junk += junk) {};
		send = function(x) {
			s.send(x);
			sent = true;
		};
		flush = function() {
			if (sent) {
				s.send(junk);
				sent = false;
			}
		};
	})();

	var availableHandlers = [];

	function BaseClass() {
	}
	Function.prototype.implement = BaseClass.prototype.implement = function(x) {
		for (var i in x) {
			if (x.hasOwnProperty(i)) this[i] = x[i];
		}
		return this;
	};

	function ButtonHandler(element, index) {
		this._element = element;
		this._index = index;
		this._touches = 0;
		this._element.className = 'up';
		if (options.initButton) {
			options.initButton(this._element, this._index);
		}
	}
	ButtonHandler.prototype = new BaseClass().implement({
		canHandle: function(c) {
			var el = this._element;
			var t = el.offsetTop,
				l = el.offsetLeft,
				b = t + el.offsetHeight,
				r = l + el.offsetWidth;
			var th = options.buttonThreshould || 0;
			t -= th; l -= th;
			r += th; b += th;
			return (l <= c.pageX && c.pageX <= r && t <= c.pageY && c.pageY <= b);
		},
		createTouchHandler: function() {
			return new ButtonTouchHandler(this);
		},
		down: function() {
			if (this._touches == 0) {
				send('1' + this._index);
				this._element.className = 'down';
			}
			this._touches++;
		},
		up: function() {
			this._touches--;
			if (this._touches == 0) {
				send('0' + this._index);
				this._element.className = 'up';
			}
		}
	});
	
	function ButtonTouchHandler(main) {
		this._main = main;
		this._main.down();
	}
	ButtonTouchHandler.prototype = new BaseClass().implement({
		canHandle: function(c) {
			return this._main.canHandle(c);
		},
		update: function(c) {
		},
		onrelease: function(c) {
			this._main.up();
		}
	});

	if (options.buttons) {
		options.buttons.forEach(function(id, i) {
			var el = document.getElementById(id);
			availableHandlers.push(new ButtonHandler(el, i));
		});
	}
	
	function TurntableHandler(element, display) {
		this._element = element;
		this._display = display;
		this._lastState = null;
		this._state = 0;
		this._rotation = 0;
		this._displayAngle = 0;
		this._interval = setInterval(function(that) {
			return function() {
				that.doTurntableUpdate();
			};
		}(this), 10);
		this.updateState();
	}
	TurntableHandler.prototype = new BaseClass().implement({
		canHandle: function(c) {
			return options.turntableWidth == 0 || (options.turntablePosition == 'right' ? document.documentElement.offsetWidth - c.pageX : c.pageX) < options.turntableWidth;
		},
		createTouchHandler: function() {
			return new TurntableTouchHandler(this);
		},
		updateState: function() {
			if (this._state != this._lastState) {
				this._element.className = 'sc sc' + this._state;
				if (this._lastState != null && this._lastState != 0) {
					send('0' + this._lastState);
				}
				if (this._state != 0) {
					send('1' + this._state);
				}
				this._lastState = this._state;
			}
		},
		getMaxRotation: function() {
			return 200 / options.turntableSensitivity;
		},
		getMinRotation: function() {
			return 160 / options.turntableSensitivity;
		},
		commitDelta: function(delta) {
			var max = this.getMaxRotation();
			var min = this.getMinRotation();
			this._rotation += delta;
			if (this._rotation > max) this._rotation = max;
			else if (this._rotation < -max) this._rotation = -max;
			if (this._rotation >= min) this._state = 9;
			else if (this._rotation <= -min) this._state = 8;
			this.updateState();
		},
		doTurntableUpdate: function() {
			this._rotation *= 0.99;
			if (Math.abs(this._rotation) < this.getMinRotation()) this._state = 0;
			this._displayAngle += Math.max(Math.abs(this._rotation) - 150, 0) * (this._rotation < 0 ? -1 : 1) * 0.1;
			if (this._display) {
				this._display.style.WebkitTransform = 'translateZ(0) rotate(' + this._displayAngle + 'deg)';
			}
			this.updateState();
		}
	});
	
	function TurntableTouchHandler(main) {
		this._main = main;
		this._lastPosition = null;
	}
	TurntableTouchHandler.prototype = new BaseClass().implement({
		canHandle: function(c) {
			return this._main.canHandle(c);
		},
		getNewPosition: function(c) {
			if (options.turntableMode == 'angular') {
				var dy = c.clientY - window.innerHeight / 2;
				var dx = c.clientX - window.innerWidth / 2;
				var angle = Math.atan2(dy, dx) * 180 / Math.PI;
				for (var i = 0; i < 10 && this._lastPosition != null && Math.abs(this._lastPosition - angle) > 180; i ++) {
					if (this._lastPosition < angle) {
						this._lastPosition += 360;
					} else {
						this._lastPosition -= 360;
					}
				}
				return angle;
			} else {
				return c.screenY;
			}
		},
		update: function(c) {
			var newPosition = this.getNewPosition(c);
			if (this._lastPosition != null) {
				var delta = newPosition - this._lastPosition;
				delta *= (options.turntableMode == 'angular' ? 2 : 1);
				this._main.commitDelta(delta * Math.abs(delta));
			}
			this._lastPosition = newPosition;
		},
		onrelease: function(c) {
		}
	});
	

	if (options.turntable) {
		availableHandlers.push(new TurntableHandler(
			document.getElementById(options.turntable),
			options.turntableDisplay ? document.getElementById(options.turntableDisplay) : null
		));
	}
	
	function isHardMode() {
		return options.hardMode;
	}
	function TouchHandler() {
		this._handler = null;
		this._invalidated = false;
	}
	TouchHandler.prototype.update = function(c) {
		if (this._invalidated) return;
		if (this._handler == null) {
			for (var i = 0; i < availableHandlers.length; i ++) {
				if (availableHandlers[i].canHandle(c)) {
					this._handler = availableHandlers[i].createTouchHandler();
					break;
				}
			}
		}
		if (this._handler == null && isHardMode()) {
			this._invalidated = true;
		}
		if (this._handler != null) {
			if (this._handler.canHandle(c)) {
				this._handler.update(c);
			} else {
				this._handler.onrelease(c);
				delete this._handler;
				if (isHardMode()) {
					this._invalidated = true;
				}
			}
		}
	};
	TouchHandler.prototype.onrelease = function(c) {
		if (this._handler != null) {
			this._handler.onrelease(c);
			delete this._handler;
		}
	};

	var updateTouches = (function() {
		var activeTouches = {};
		return function(e) {
			for (var i = 0; i < e.changedTouches.length; i ++) {
				var c = e.changedTouches[i];
				if (e.type != 'touchend') {
					if (!activeTouches[c.identifier]) {
						activeTouches[c.identifier] = new TouchHandler();
					}
					activeTouches[c.identifier].update(c);
				} else {
					if (activeTouches[c.identifier]) {
						activeTouches[c.identifier].onrelease(c);
						delete activeTouches[c.identifier];
					}
				}
			}
		};
	})();

	document.ontouchstart = document.ontouchmove = document.ontouchend = function(e) {
		return updateTouch(e);
	};

	function updateTouch(e) {
		updateTouches(e);
		flush();
		return false;
	}

};
