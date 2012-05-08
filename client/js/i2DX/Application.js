
/**
 * @class
 * The main i2DX web application. Glues everything together.
 */
i2DX.Application = function() {

	this._statusEl = document.createElement('div');
	this._statusEl.className = 'status';
	document.body.appendChild(this._statusEl);
	i2DX.listen('status', i2DX.proxy(this, '_onstatus'));

	this._layout = i2DX.getParam('layout');

	this._ui = new i2DX.ui.UI();
	this._ui.setDefaultPlayer(1);

	document.body.className = 'layout-' + this._layout;
	document.title = this._layout;

	i2DX.io.Connection.init();

	i2DX._layouts[this._layout].call(this._ui, this._ui);

};

i2DX.Application.prototype = {
	_onstatus: function(text) {
		this._statusEl.innerHTML = text;
	}
};
