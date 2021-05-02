let snakeX = 10;
let snakeY = 250;
let snakeL = 50;
let dx = 10;
let dy = 10;
const lineWidth = 10;
const snakeRects = [];
let interval = null;
let circleX;
let circleY;

window.onload = function() {
    document.addEventListener('keydown', function(event){
        switch(event.code){
            case 'ArrowDown':
                changeDirection('d');
                break;
            case 'ArrowUp':
                changeDirection('u');
                break;
            case 'ArrowRight':
                changeDirection('r')
                break;
            case 'ArrowLeft':
                changeDirection('l');
                break;
            default: 
                return;
        }
    });

    // document.addEventListener('click', function(event) {
    //     const pixelData = canvasCtx.getImageData(event.x, event.y, 10, 10).data;
    //     console.log(pixelData);
    // })

    document.getElementById('start').addEventListener('click', function() {
        interval = setInterval(start, 100);
    })

    canvas =  document.getElementById('board');
    canvasCtx = canvas.getContext('2d');

    snakeRects.push({
        x: 50,
        y: 250,
        d: 'r'
    })
    snakeRects.push({
        x: 40,
        y: 250,
        d: 'r'
    })
    snakeRects.push({
        x: 30,
        y: 250,
        d: 'r'
    })
    snakeRects.push({
        x: 20,
        y: 250,
        d: 'r'
    })

    drawRects();
    createNewCircle();
    drawCircle();

    console.log(circleX + " " + circleY)

}

function start() {
    const head = snakeRects[0];
    if(head.x === (canvas.width - 2*dx) || head.y === 0 || head.x === 0 || head.y === (canvas.height - 2*dy)){
        clearInterval(interval);
    }

    if(
        isColliding(head.x, head.y)
    ){
        console.log('true')
        eatCircle()
    }

    snakeRects.forEach(block => {
        checkDirection(block);
    })
    drawRects();
    drawCircle();
}

function isColliding(x, y) {
    return !(x > circleX + 10 || x < circleX - 10 || y > circleY + 10 || y < circleY - 10)
}

function changeDirection(direction){
    snakeRects[0].d = direction;
}

function moveUp(block) {
    block.y = block.y - dy;
}

function moveDown(block) {
    block.y = block.y + dy;
}

function moveRight(block){
    block.x = block.x + dx;
}

function moveLeft(block){
    block.x = block.x - dx;
}

function drawRects() {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

    snakeRects.forEach(line => {
        canvasCtx.fillStyle = 'black';
        canvasCtx.fillRect(line.x, line.y, 10, 10)
    })
}

function eatCircle() {
    const lastBlock = snakeRects[snakeRects.length - 1];
    let newX, newY;
    switch(lastBlock.d){
        case 'u':
            newX = lastBlock.x;
            newY = lastBlock.y + 10;
            break;
        case 'd':
            newX = lastBlock.x;
            newY = lastBlock.y - 10;
            break;
        case 'r':
            newX = lastBlock.x - 10;
            newY = lastBlock.y;
            break;
        case 'l':
            newX = lastBlock.x + 10;
            newY = lastBlock.y;
            break; 
    }

    if(lastBlock.d === 'u'){
        newX = lastBlock.x;
        newY = lastBlock.y + dy;
    } else if(lastBlock.d === 'd'){

    }

    snakeRects.push({
        x: newX,
        y: newY,
        d: lastBlock.d
    })

    drawRects()
    createNewCircle()
    drawCircle()
}

function createNewCircle(){
    circleX = parseInt(Math.random() * (canvas.width-10));
    circleY = parseInt(Math.random() * (canvas.height + 10));
} 

function drawCircle(){
//    const pixelData = canvasCtx.getImageData(circleX, circleY, 10, 10).data;

    canvasCtx.beginPath();
    canvasCtx.fillStyle = 'red';
    canvasCtx.arc(circleX, circleY, 5, 0, 2 * Math.PI);
    canvasCtx.fill();
}

function checkDirection(block) {
    const index = snakeRects.indexOf(block);
    if(index !== 0){
        const prevBlock = snakeRects[index - 1];
        if(block.d !== prevBlock.d && (block.x === prevBlock.x || block.y === prevBlock.y)){
            block.d = prevBlock.d;
        }
    }
    move(block);
}

function move(block) {
    switch(block.d){
        case 'u':
            moveUp(block);
            break;
        case 'd':
            moveDown(block);
            break;
        case 'l':
            moveLeft(block);
            break;
        case 'r':
            moveRight(block);
            break;
    }
}