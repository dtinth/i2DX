
var Canvas = require('canvas');
var Image = Canvas.Image;
var fs = require('fs');

var nlayout = new Image;
nlayout.src = fs.readFileSync('input/nlayout.png');
var nlayoutpressed = new Image;
nlayoutpressed.src = fs.readFileSync('input/nlayoutpressed.png');

var bg = new Canvas(1024, 768);
with (bg.getContext('2d')) {
	drawImage(nlayout, 0, 0);
	for (var x = 32; x < 988; x ++) {
		drawImage(nlayout, 32, 430, 1, 300, x, 430, 1, 300);
	}
}
fs.writeFileSync('images/bg.png', bg.toBuffer());

var rowY = [40, 190];
var btn = [
	['white', 41, 0],
	['yellow', 137, 1],
	['green', 244, 0],
	['blue', 344, 1],
	['red', 455, 0]
];
var size = 140;

function css(index, post) {
	var a = index + 1;
	var b = 9 - index;
	var c = ['.component[data-name="popn_' + a + '"]' + post];
	if (a != b) c.push('.component[data-name="popn_' + b + '"]' + post);
	return c.join(',\n');
}

var buttons = new Canvas(size * 2, size * btn.length);
btn.forEach(function(button, index) {
	with (buttons.getContext('2d')) {
		var sx = button[1];
		var sy = 768 - rowY[button[2]] - size;
		var dy = index * size;
		drawImage(nlayout,        sx, sy, size, size, 0, dy, size, size);
		drawImage(nlayoutpressed, sx, sy, size, size, size, dy, size, size);
		console.log(css(index, '') + ' { background-position: ' + (0) + 'px ' + (-dy) + 'px; }');
		console.log(css(index, '[data-state="pressed"]') + ' { background-position: ' + (-140) + 'px ' + (-dy) + 'px; }');
	}
});

fs.writeFileSync('images/buttons.png', buttons.toBuffer());
