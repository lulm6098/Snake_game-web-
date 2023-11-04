var canvas, ctx;
var n = 3, score = 0, a = 0;
var p = [10, 10, 10, 10];
var segLength = 10;
var x = Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0);
var y = Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0);
var mousePos;
var fx, fy;
var time = 0;
var snakeLength = 3;
var speed = 1;  // 뱀의 속도를 지정하는 변수를 추가

function init() {
    canvas = document.getElementById("myCanvas");
    if (canvas) {
        ctx = canvas.getContext('2d');
        canvas.width = 800; 
        canvas.height = 600; 

        canvas.style.margin = "auto";
        canvas.style.display = "block";

        canvas.addEventListener('mousemove', function (evt) {
            mousePos = getMousePos(canvas, evt);
        }, false);

        // 마우스 클릭 이벤트를 등록
        canvas.addEventListener('mousedown', function (evt) {
            speed = 2;  // 클릭 시 속도를 빠르게 변경
        }, false);

        // 마우스 클릭 해제 이벤트를 등록
        canvas.addEventListener('mouseup', function (evt) {
            speed = 1;  // 클릭 해제 시 속도를 원래대로 돌림
        }, false);

        fx = 10 + Math.random() * (canvas.width - 20);
        fy = 10 + Math.random() * (canvas.height - 20);
        requestAnimationFrame(animate);
        intervalId = setInterval(updateGameInfo, 1000);
    } else {
        console.error("Canvas element not found.");
    }
}
function updateGameInfo() {
    time++;
    snakeLength = n;
    document.getElementById("time").innerHTML = time;

    if (a === 1) {
        clearInterval(intervalId); 
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    p = ctx.getImageData(evt.clientX - rect.left, evt.clientY - rect.top, 1, 1).data;
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function animate() {
    if (a == 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        foodRandom(fx, fy);

        if (mousePos !== undefined) {
            if (mousePos.x > (fx - 1) && mousePos.x < (fx + 13) && mousePos.y > (fy - 1) && mousePos.y < (fy + 13)) {
                n++;
                score++;
                document.getElementById("score").innerHTML = score;
                changes(n);
                fx = 10 + Math.random() * (canvas.width - 20);
                fy = 10 + Math.random() * (canvas.height - 20);
                foodRandom(fx, fy);
            }
            drawSnake(mousePos.x, mousePos.y);
        }
        requestAnimationFrame(animate);
    }
}

function drawSnake(posX, posY) {
    for (var i = 0; i < x.length; i++) {
        var dx = posX - x[i];
        var dy = posY - y[i];
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < segLength * 2 / 3) {
            a = 1;
            return;
        }
    }

    if (p[2] == 255 || posX > canvas.width - 2 || posY > canvas.height - 2 || posX < 2 || posY < 2) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.font = "20px Georgia";
        ctx.fillText("Game Over", canvas.width / 2 - 50, canvas.height / 2 - 20);

        a = 1;
        return 0;
    }
    SnakeColor(0, posX, posY, 'red');
    for (var i = 1; i < x.length; i++) {
        SnakeColor(i, x[i-1], y[i-1], 'white');
    }
}

function lerp(start, end, amt){
    return (1-amt)*start+amt*end;
  }

function SnakeColor(i, xin, yin, color) {
    var amt = 0.05 * speed;
    dx = xin - x[i];
    dy = yin - y[i];
    angle = Math.atan2(dy, dx);
    x[i] = xin - Math.cos(angle) * segLength;
    y[i] = yin - Math.sin(angle) * segLength;

    ctx.save();
    ctx.translate(x[i], y[i]);
    ctx.rotate(angle);

    drawCircle(0, 0, segLength, color);
    ctx.restore();
}

function changes(n) {
    x[n - 1] = x[n - 2] + 100;
    y[n - 1] = y[n - 2] + 100;
}

function foodRandom(fx, fy) {
    ctx.fillStyle = "rgb(0,255,0)";
    ctx.fillRect(fx, fy, 12, 12);
}

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}
