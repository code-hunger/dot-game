(function(){
    'use strict';
    var WIDTH = 10, HEIGHT = 10, SPACE = 70, SIZE = 5, PADDING = 3, NEAR = 0.1,
    NEAR_BOTTOM = SPACE * NEAR + SIZE,
    NEAR_TOP = SPACE * (1 - NEAR),
    NEAR_LEFT = NEAR_TOP, NEAR_RIGHT = NEAR_BOTTOM,
    OFFSET_X, OFFSET_Y,
    LAST_HOVER_X, LAST_HOVER_Y, LAST_HOVER_RIGHT, LAST_HOVER_DOWN, HOVER,
    nodes = {};

    function drawDots(context) {
        for (var i = 0, len = WIDTH * SPACE; i < len; i += SPACE) {
            for (var j = 0, len_j = HEIGHT * SPACE; j < len_j; j += SPACE) {
                context.rect(i, j, SIZE, SIZE);
            }
        }
        context.fill();
    }

    function fromNode2(dot) {
        return (dot.x - 1) * WIDTH + dot.y;
    }

    function surfaceClicked(context) {
        if(!HOVER) return;

        var goesRight = LAST_HOVER_RIGHT / SPACE == 1,
            dotFirst = {
                x: LAST_HOVER_X / SPACE,
                y: LAST_HOVER_Y / SPACE,
            }, 
            dotSecond = {
                x: dotFirst.x + goesRight,
                y: dotFirst.y + !goesRight, 
            }, 
            dotFirstIndex = fromNode2(dotFirst), 
            dotSecondIndex = fromNode2(dotSecond); 

        if(!nodes[dotFirstIndex]) nodes[dotFirstIndex] = [dotSecondIndex];
        else nodes[dotFirstIndex].push(dotSecondIndex);
        if(!nodes[dotSecondIndex]) nodes[dotSecondIndex] = [dotFirstIndex];
        else nodes[dotSecondIndex].push(dotFirstIndex);

        context.fillRect(LAST_HOVER_X, LAST_HOVER_Y, LAST_HOVER_RIGHT, LAST_HOVER_DOWN);
    }

    function mouseMove(context, x, y) {
        var relativeX = x % SPACE, relativeY = y % SPACE,
        lineX = x - relativeX, lineY = y - relativeY;

        context.clearRect(LAST_HOVER_X, LAST_HOVER_Y, LAST_HOVER_RIGHT, LAST_HOVER_DOWN);

        HOVER = true;

        if(relativeY < NEAR_BOTTOM){
            LAST_HOVER_X = lineX;
            LAST_HOVER_Y = lineY;
            LAST_HOVER_RIGHT = SPACE;
            LAST_HOVER_DOWN = SIZE;
        } else if (relativeY > NEAR_TOP) {
            LAST_HOVER_X = lineX;
            LAST_HOVER_Y = lineY + SPACE;
            LAST_HOVER_RIGHT = SPACE;
            LAST_HOVER_DOWN = SIZE;
        } else if (relativeX < NEAR_RIGHT ) {
            LAST_HOVER_X = lineX;
            LAST_HOVER_Y = lineY;
            LAST_HOVER_RIGHT = SIZE;
            LAST_HOVER_DOWN = SPACE;
        } else if (relativeX > NEAR_LEFT) {
            LAST_HOVER_X = lineX + SPACE;
            LAST_HOVER_Y = lineY;
            LAST_HOVER_RIGHT = SIZE;
            LAST_HOVER_DOWN = SPACE;
        } else {
            HOVER = false;
        }

        if(HOVER) {
            context.fillRect(LAST_HOVER_X, LAST_HOVER_Y, LAST_HOVER_RIGHT, LAST_HOVER_DOWN);
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
        canvas_hover.addEventListener('click', function(e) {
            surfaceClicked(context);
        });
    });
})();
