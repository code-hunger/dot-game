var WIDTH = 10, HEIGHT = 10, SPACE = 70, SIZE = 5, nodes = [];

function drawDots(context) {
    for (var i = 0, len = WIDTH * SPACE; i < len; i += SPACE) {
        for (var j = 0, len_j = HEIGHT * SPACE; j < len_j; j += SPACE) {
            context.rect(i, j, SIZE, SIZE);
        }
    }
    context.fill();
}

window.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.width = SPACE * (WIDTH - 1) + SIZE;
    canvas.height = SPACE * (HEIGHT - 1) + SIZE;
    document.body.appendChild(canvas);

    drawDots(canvas.getContext('2d'));
};
