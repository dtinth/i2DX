
(function() {

	function iidxlayout(axis) {

		var map = {
			left:  axis == 'left' ? 'left'  : 'right',
			right: axis == 'left' ? 'right' : 'left'
		};

		function x(index) {
			return 310 + 85 * index;
		}

		function y(index) {
			return 108 + 245 * (index % 2);
		}

		function style(index) {
			var style = {
				bottom: (108 + 245 * (index % 2)) + 'px',
				width: '120px',
				height: '200px'
			};
			style[map.left] = (310 + 85 * index) + 'px';
			return style;
		}

		return function(ui) {
			ui.button('iidx_1', style(0));
			ui.button('iidx_2', style(1));
			ui.button('iidx_3', style(2));
			ui.button('iidx_4', style(3));
			ui.button('iidx_5', style(4));
			ui.button('iidx_6', style(5));
			ui.button('iidx_7', style(6));
			ui.turntable('220px', map.left);
		};

	}

	i2DX.layout('iidx_left', iidxlayout('left'));
	i2DX.layout('iidx_right', iidxlayout('right'));

	i2DX.layout('turntable', function(ui) {
		ui.turntableFullscreen();
	});

})();
