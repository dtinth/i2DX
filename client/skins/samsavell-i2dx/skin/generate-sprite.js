
var Canvas = require('canvas');
var Image = Canvas.Image;
var fs = require('fs');

function place(ctx, prefix, filename, dx, dy) {
	var image = new Image;
	image.src = fs.readFileSync(filename);
	ctx.drawImage(image, 0, 0, image.width, image.height, dx, dy, image.width, image.height);
	console.log(prefix + ' { background-position: ' + (-dx) + 'px ' + (-dy) + 'px; }');
}

function css(list, pressed) {
	var l = [];
	list.forEach(function(x) {
		l.push('.component[data-name="iidx_' + x + '"]' + (pressed ? '[data-state="pressed"]' : ''));
	});
	return l.join(',\n');
}

(function() {
	var out = new Canvas(128 * 3, 256 * 2);
	var ctx = out.getContext('2d');
	place(ctx, css([1, 3, 5, 7]), 'key.png', 256, 0);
	place(ctx, css([1, 3, 5, 7], true), 'key_down.png', 128, 0);
	place(ctx, css([2, 4, 6]), 'key_b.png', 256, 256);
	place(ctx, css([2, 4, 6], true), 'key_b_down.png', 128, 256);
	fs.writeFileSync('keys.png', out.toBuffer());
})();
(function() {
	var out = new Canvas(256 * 3, 768);
	var ctx = out.getContext('2d');
	place(ctx, '.component[data-name="turntable"]', 'scratch.png', 256 * 0, 0);
	place(ctx,
		'.component[data-name="turntable"][data-placement="left"][data-state="cw"],\n' +
		'.component[data-name="turntable"][data-placement="right"][data-state="ccw"]', 'scratch-up.png', 256 * 1, 0);
	place(ctx,
		'.component[data-name="turntable"][data-placement="left"][data-state="ccw"],\n' +
		'.component[data-name="turntable"][data-placement="right"][data-state="cw"]', 'scratch-down.png', 256 * 2, 0);
	fs.writeFileSync('scratch-sprite.png', out.toBuffer());
})();

