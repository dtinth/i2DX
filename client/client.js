var I2DX = function(options) {

	var s = new WebSocket("ws://" + location.host.replace(/:\d+$|$/, ':9876') + "/");
	(function() {
		function setStatus(text) {
			document.getElementById('status').innerHTML = text;
		}
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

	var buttons = [];

	if (options.buttons) {
		options.buttons.forEach(function(id, i) {
			var el = buttons[i] = document.getElementById(id);
			el.className = 'up';
			if (options.initButton) {
				options.initButton(el, i);
			}
		});
	}

	var updateButtons = (function() {

		var lastKeys = {};

		return function(e) {
			var newKeys = {}
			for (var i = 0; i < e.touches.length; i ++) {
				var c = e.touches[i];
				buttons.forEach(function(el, k) {
					var t = el.offsetTop,
						l = el.offsetLeft,
						b = t + el.offsetHeight,
						r = l + el.offsetWidth;
					var th = options.buttonThreshould || 0;
					t -= th; l -= th;
					r += th; b += th;
					if (l <= c.pageX && c.pageX <= r && t <= c.pageY && c.pageY <= b) {
						newKeys[k] = true;
					}
				});
			}
			for (var k in newKeys) {
				if (newKeys[k] && !lastKeys[k]) {
					buttons[k].className = 'down';
					lastKeys[k] = true;
					s.send('1' + k);
				}
			}
			for (var k in lastKeys) {
				if (lastKeys[k] && !newKeys[k]) {
					buttons[k].className = 'up';
					delete lastKeys[k];
					s.send('0' + k);
				}
			}
		};

	})();

	var updateTurntable = (function() {

		if (!options.turntable) return function() {};

		var el = document.getElementById(options.turntable);
		var display;
		if (options.turntableDisplay) display = document.getElementById(options.turntableDisplay);
		var turntables = {};
		var value = 0;
		var turntable = 0;
		var spinAngle = 0;
		function updateClass() {
			el.className = 'sc sc' + turntable;
		}
		updateClass();
		setInterval(function() {
			var nt = 0;
			var max = 120 / options.turntableSensitivity;
			if (value > max)  value = max;
			if (value < -max) value = -max;
			if (Math.abs(value) > 60 / options.turntableSensitivity) {
				if (value > 0) {
					nt = 9;
				} else {
					nt = 8;
				}
			}
			value *= 0.96;
			spinAngle += Math.max(Math.abs(value) - 40, 0) * (value < 0 ? -1 : 1) * 0.06;
			if (display) {
				display.style.WebkitTransform = 'translateZ(0) rotate(' + spinAngle + 'deg)';
			}
			if (turntable != nt) {
				if (turntable != 0) {
					s.send('0' + turntable);
				}
				turntable = nt;
				if (turntable != 0) {
					s.send('1' + turntable);
				}
				updateClass();
			}
		}, 10);

		return function(e) {
			for (var i = 0; i < e.changedTouches.length; i ++) {
				var c = e.changedTouches[i];
				if ((options.turntableWidth == 0 || c.pageX < options.turntableWidth) && e.type != 'touchend') {
					var position;
					if (options.turntableMode == 'angular') {
						position = (function() {
							var dy = (c.clientY - window.innerHeight / 2);
							var dx = c.clientX - window.innerWidth / 2;
							var angle = Math.atan(dy / dx) * 180 / Math.PI;
							if (dx < 0) { angle += 180; }
							else if (dy < 0) { angle += 360; }
							while (turntables[c.identifier] != null && Math.abs(angle + 360 - turntables[c.identifier]) < Math.abs(angle - turntables[c.identifier])) {
								angle += 360;
							}
							while (turntables[c.identifier] != null && Math.abs(angle - 360 - turntables[c.identifier]) < Math.abs(angle - turntables[c.identifier])) {
								angle -= 360;
							}
							return angle;
						})();
					} else {
						position = c.screenY;
					}
					if (turntables[c.identifier] != null) {
						var delta = position - turntables[c.identifier];
						value += delta * Math.abs(delta);
					}
					turntables[c.identifier] = position;
				} else {
					if (turntables[c.identifier]) {
						delete turntables[c.identifier];
					}
				}
			}
		};

	})();

	document.ontouchstart = document.ontouchmove = document.ontouchend = function(e) {
		return updateTouch(e);
	};

	function updateTouch(e) {
		updateButtons(e);
		updateTurntable(e);
		return false;
	}

};
