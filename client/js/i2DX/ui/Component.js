
i2DX.ns('ui');

/**
 * A class represents a component on the UI.
 * @param {String} name name of the component
 * @param {Object} style CSS styles to apply
 */
i2DX.ui.Component = function(name, style, player) {
	this._element = document.createElement('div');
	this._element.className = 'component';
	this._name = name;
	this._player = player;
	this._stateMap = {};
	this.set('name', name);
	if (style) {
		for (var key in style) {
			this._element.style[key] = style[key];
		}
	}
};

i2DX.ui.Component.prototype = {

	/**
	 * Returns the name of the component
	 * @return {String} name
	 */
	getName: function() {
		return this._name;
	},

	/**
	 * Returns the player number associated with this component.
	 * @return {Number} the player number
	 */
	getPlayer: function() {
		return this._player;
	},

	/**
	 * Sets the data-attribute of the component
	 * @param {String} key key
	 * @param {String} value value
	 */
	set: function(key, value) {
		this._stateMap[key] = value;
		var className = ['component', this.getName()];
		for (var i in this._stateMap) {
			className.push(i + '-' + this._stateMap[i]);
		}
		this._element.className = className.join(' ');
		//this._element.setAttribute('data-' + key, value);
	},

	/**
	 * Renders the element to a DOM element
	 * @param {HTMLElement} container the element to render to
	 */
	renderTo: function(container) {
		container.appendChild(this._element);
	},

	/**
	 * Returns the bounds of this component.
	 * @return {Object} an object with following keys:
	 *
	 * * left
	 * * top
	 * * right
	 * * bottom
	 * * width
	 * * height
	 */
	getBounds: function() {
		var b = {};
		b.left = this._element.offsetLeft;
		b.top = this._element.offsetTop;
		b.width = this._element.offsetWidth;
		b.height = this._element.offsetHeight;
		b.right = b.left + b.width;
		b.bottom = b.top + b.height;
		return b;
	},

	/**
	 * Checks if the X, Y coordinate is the current component.
	 */
	isAtPoint: function(x, y) {
		var element = document.elementFromPoint(x, y);
		while (element) {
			if (element == this._element) return true;
			element = element.parentNode;
		}
		return false;
	},

	/**
	 * Returns the DOM element.
	 * @return {HTMLElement} the element that represents this component
	 */
	getElement: function() {
		return this._element;
	}
};

