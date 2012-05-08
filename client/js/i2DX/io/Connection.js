
i2DX.ns('io');

/**
 * @class
 * @singleton
 * A WebSockets connection to i2DX
 */
i2DX.io.Connection = {

	_ws: null,
	_statusEl: null,
	_sent: false,

	/**
	 * Initialize the Connection. Must be called before use.
	 */
	init: function() {
		i2DX.broadcast('status', 'Connecting to i2DX...');
		this._ws = new WebSocket("ws://" + location.host + "/ws");
		this._ws.onopen = i2DX.proxy(this, '_onopen');
		this._ws.onclose = i2DX.proxy(this, '_onclose');
		this._ws.onmessage = i2DX.proxy(this, '_onmessage');
		this._ws.onerror = i2DX.proxy(this, '_onerror');
		var junk;
		for (junk = 'junk'; junk.length < 4096; junk += junk) {};
		this._junk = junk;
		i2DX.listen('down', i2DX.proxy(this, '_msgDown'));
		i2DX.listen('up', i2DX.proxy(this, '_msgUp'));
	},

	/**
	 * Send raw data to server. Do not use!
	 * @param {String} x data to send
	 */
	sendRaw: function(x) {
		try {
			this._ws.send(x);
			this._sent = true;
		} catch (e) {
			i2DX.broadcast('status', 'Cannot send data: ' + e);
		}
	},

	/**
	 * Send a data to server
	 * @param {Array} data data to send, as array
	 */
	send: function(data) {
		this.sendRaw(data.join(';'));
		clearTimeout(this._timer);
		this._timer = setTimeout(i2DX.proxy(this, 'flush'), 1);
	},

	/**
	 * Sends junk to server to force clearing the output buffer and reduce latency.
	 */
	flush: function() {
		if (this._sent) {
			this._sent = false;
			this._ws.send('junk;' + this._junk);
		}
	},

	_onopen: function(e) {
		i2DX.broadcast('status', 'Connected to i2DX Server!');
	},

	_onclose: function(e) {
		i2DX.broadcast('status', 'Disconnected from i2DX Server.');
	},

	_onmessage: function(e) {
		i2DX.broadcast('status', e.data);
	},

	_onerror: function(e) {
		i2DX.broadcast('status', 'Error: ' + e);
		try {
			console.error(e);
		} catch (e) {
		}
	},
	
	_msgDown: function(key, player) {
		this.send(['1', key, player]);
	},

	_msgUp: function(key, player) {
		this.send(['0', key, player]);
	}

}
