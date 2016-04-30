(function(){
    'use strict';
    var WIDTH = 10, HEIGHT = 10, SPACE = 70, SIZE = 5, PADDING = 3, NEAR = 0.1,
    NEAR_BOTTOM = SPACE * NEAR + SIZE,
    NEAR_TOP = SPACE * (1 - NEAR),
    NEAR_LEFT = NEAR_TOP, NEAR_RIGHT = NEAR_BOTTOM,
    OFFSET_X, OFFSET_Y,
    LAST_HOVER_X, LAST_HOVER_Y, LAST_HOVER_RIGHT, LAST_HOVER_DOWN, HOVER,
    nodes = {}, mouse = {};

    function drawDots(context) {
        for (var i = 0, len = WIDTH * SPACE; i < len; i += SPACE) {
            for (var j = 0, len_j = HEIGHT * SPACE; j < len_j; j += SPACE) {
                context.rect(i, j, SIZE, SIZE);
            }
        }
        context.fill();
    }

    function fromNode2(a, b) {
        if(typeof a == 'object')
            return a.y * WIDTH + a.x;
        else 
            return b * WIDTH + a;
    }

    function toNode2(nodeIndex) {
        return { x: nodeIndex % WIDTH, y: Math.floor(nodeIndex / WIDTH) };
    }

    function thereIsNode(pointA, pointB) {
        if(typeof pointA != 'number' || typeof pointB != 'number') throw 'pointA or pointB is not a number!';
        return nodes[pointA].indexOf(pointB) > -1;
    }

    function drawSquare(context, pointA) {
        if(typeof pointA == "number") pointA = toNode2(pointA);
        context.fillStyle = 'red';
        var x = pointA.x * SPACE + SIZE, y = pointA.y * SPACE + SIZE;
        // console.log("Space is: ", SPACE, ", coords: ", x1, y1, x2, y2);
        context.fillRect(x, y, SPACE - SIZE, SPACE - SIZE);
        context.fillStyle = 'black';
    }

    function surfaceClicked(context) {
        if(!HOVER) return;

        var goesRight = LAST_HOVER_RIGHT / SPACE == 1,
            horizontal = goesRight,
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

        var topLeft, topRight, bottomLeft, bottomRight;
        if(horizontal) {
            topLeft = fromNode2(dotFirst.x, dotFirst.y - 1);
            topRight = fromNode2(dotSecond.x, dotSecond.y - 1);
            bottomLeft = fromNode2(dotFirst.x, dotFirst.y + 1);
            bottomRight = fromNode2(dotSecond.x, dotSecond.y + 1);

            if(thereIsNode(dotFirstIndex, topLeft) && thereIsNode(topLeft, topRight) && thereIsNode(topRight, dotSecondIndex)) {
                // square on the top
                drawSquare(context, topLeft);
            }
            if(thereIsNode(dotFirstIndex, bottomLeft) && thereIsNode(bottomLeft, bottomRight) && thereIsNode(bottomRight, dotSecondIndex)) {
                // square on the bottom
                drawSquare(context, dotFirst);
            }
        } else {
            topLeft = fromNode2(dotFirst.x - 1, dotFirst.y);
            topRight = fromNode2(dotFirst.x + 1, dotFirst.y);
            bottomLeft = fromNode2(dotSecond.x - 1, dotSecond.y);
            bottomRight = fromNode2(dotSecond.x + 1, dotSecond.y);

            if(thereIsNode(dotFirstIndex, topLeft) && thereIsNode(topLeft, bottomLeft) && thereIsNode(bottomLeft, dotSecondIndex)) {
                // square on the left
                drawSquare(context, topLeft);
            }
            if(thereIsNode(dotFirstIndex, topRight) && thereIsNode(topRight, bottomRight) && thereIsNode(bottomRight, dotSecondIndex)) {
                // square on the right
                drawSquare(context, dotFirst);
            }
        }
    }

    function mouseMove(context, x, y) {
        var relativeX = x % SPACE, relativeY = y % SPACE,
        lineX = x - relativeX, lineY = y - relativeY;

        document.getElementById('info').innerText = 'mouse: [ ' + x + ' : ' + y + ' ]';

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

        var info = document.createElement('div');
        info.id = 'info';
        document.body.appendChild(info);
    });
})();
