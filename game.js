(function(){
    'use strict';
    var WIDTH = 10, HEIGHT = 10, SPACE = 70, SIZE = 5, PADDING = 3, NEAR = 0.1,
    NEAR_BOTTOM = SPACE * NEAR + SIZE,
    NEAR_TOP = SPACE * (1 - NEAR),
    NEAR_LEFT = NEAR_TOP, NEAR_RIGHT = NEAR_BOTTOM,
    OFFSET_X, OFFSET_Y,
    LAST_HOVER_X, LAST_HOVER_Y, LAST_HOVER_DIR, // DIR: 0 = right, 1 = down
    nodes = [];

    function drawDots(context) {
        for (var i = 0, len = WIDTH * SPACE; i < len; i += SPACE) {
            for (var j = 0, len_j = HEIGHT * SPACE; j < len_j; j += SPACE) {
                context.rect(i, j, SIZE, SIZE);
            }
        }
        context.fill();
    }

    function mouseMove(context, x, y) {
        var relativeX = x % SPACE, relativeY = y % SPACE,
        lineX = x - relativeX, lineY = y - relativeY;

        if(LAST_HOVER_DIR == 1)
            context.clearRect(LAST_HOVER_X, LAST_HOVER_Y, SIZE, SPACE);
        else
            context.clearRect(LAST_HOVER_X, LAST_HOVER_Y, SPACE, SIZE);

        if(relativeY < NEAR_BOTTOM){
            context.fillRect(lineX, lineY, SPACE, SIZE);
            LAST_HOVER_X = lineX;
            LAST_HOVER_Y = lineY;
            LAST_HOVER_DIR = 0;
        } else if (relativeY > NEAR_TOP) {
            context.fillRect(lineX, lineY + SPACE, SPACE, SIZE);
            LAST_HOVER_X = lineX;
            LAST_HOVER_Y = lineY + SPACE;
            LAST_HOVER_DIR = 0;
        } else if (relativeX < NEAR_RIGHT ) {
            context.fillRect(lineX, lineY, SIZE, SPACE);
            LAST_HOVER_X = lineX;
            LAST_HOVER_Y = lineY;
            LAST_HOVER_DIR = 1;
        } else if (relativeX > NEAR_LEFT) {
            context.fillRect(lineX + SPACE, lineY, SIZE, SPACE);
            LAST_HOVER_X = lineX + SPACE;
            LAST_HOVER_Y = lineY;
            LAST_HOVER_DIR = 1;
        }
    }

    window.addEventListener('load', function () {
        var canvas = document.createElement('canvas');
        canvas.width = SPACE * (WIDTH - 1) + SIZE;
        canvas.height = SPACE * (HEIGHT - 1) + SIZE;
        canvas.style = 'display: table; margin: auto; border: 1px solid black;';
        canvas.style.padding = PADDING + 'px';
        document.body.appendChild(canvas);

        OFFSET_X = canvas.offsetLeft + PADDING;
        OFFSET_Y = canvas.offsetTop + PADDING;

        var context = canvas.getContext('2d');

        drawDots(context);

        var canvas_hover = canvas.cloneNode(false);
        canvas_hover.style.position = 'absolute';
        canvas_hover.style.top = canvas.offsetTop + 'px';
        canvas_hover.style.left = canvas.offsetLeft + 'px';
        document.body.appendChild(canvas_hover);

        var hover_context = canvas_hover.getContext('2d');

        canvas_hover.addEventListener('mousemove', function (e) {
            mouseMove(hover_context, e.pageX - OFFSET_X, e.pageY - OFFSET_Y);
        });
    });
})();
