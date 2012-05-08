
i2DX.layout('popn', function(ui) {

	function style(index) {
		return {
			width: '140px',
			height: '140px',
			left: '50%',
			bottom: (40 + 150 * (index % 2)) + 'px',
			marginLeft: ((index - 4) * (400 / 4) - 140 / 2) + 'px'
		};
	}

	ui.roundedButton('popn_1', style(0));
	ui.roundedButton('popn_2', style(1));
	ui.roundedButton('popn_3', style(2));
	ui.roundedButton('popn_4', style(3));
	ui.roundedButton('popn_5', style(4));
	ui.roundedButton('popn_6', style(5));
	ui.roundedButton('popn_7', style(6));
	ui.roundedButton('popn_8', style(7));
	ui.roundedButton('popn_9', style(8));

});
