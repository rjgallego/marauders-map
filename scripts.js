const delta = 1;
const blockSide = 25;
const snakeRects = [];
let interval = null;
const circle = {};
const canvas = document.getElementById('board');
const canvasCtx = canvas.getContext('2d');


window.onload = function() {
    document.addEventListener('keydown', (event) => keyListener(event.code));
    document.getElementById('start').addEventListener('click', () => interval = setInterval(run, 10))

    initiateBlocks();

    drawRects();
    createNewCircle();
    drawCircle();
}


function initiateBlocks() {
    const x = 85;
    const y = 250;

    for(let i = 0; i < 4; i++){
        snakeRects.push({
            x: x - (i * blockSide),
            y: y,
            d: 'r'
        })
    }
}

function run() {
    const head = snakeRects[0];

    if(isEdge(head.x, head.y)) {
        endGame()
    }

    if(isColliding(head.x, head.y)){
        eatCircle()
    }

    snakeRects.forEach(block => {
        checkDirection(block);
        move(block);
    })

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
    drawRects();
    drawCircle();
}

function endGame() {
    clearInterval(interval);
}

function isColliding(x, y) {
    return !( x + blockSide > circle.x + circle.r 
           || x + blockSide < circle.x - circle.r 
           || y - (blockSide / 2) > circle.y + circle.r 
           || y - (blockSide / 2) < circle.y - circle.r)
}

function keyListener(keyCode){
    switch(keyCode){
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
}

function changeDirection(direction){
    snakeRects[0].d = direction;
}

function isEdge(x, y) {
    return ( y - delta <= 0
          || x - delta <= 0
          || y + blockSide >= canvas.height
          || x + blockSide >= canvas.width
    )
}

function moveUp(block) {
    block.y = block.y - delta;
}

function moveDown(block) {
    block.y = block.y + delta;
}

function moveRight(block){
    block.x = block.x + delta;
}

function moveLeft(block){
    block.x = block.x - delta;
}

function drawRects() {
    const img = document.getElementById('shoes');
    
    snakeRects.forEach(line => {
        canvasCtx.drawImage(img, line.x, line.y, blockSide, blockSide)
    })
}

function eatCircle() {

    drawRects()
    createNewCircle()
    drawCircle()
}

function addBlock(){
    const lastBlock = snakeRects[snakeRects.length - 1];
    const newBlock = {};

    switch(lastBlock.d){
        case 'u':
            newBlock.x = lastBlock.x;
            newBlock.y = lastBlock.y + blockSide;
            break;
        case 'd':
            newBlock.x = lastBlock.x;
            newBlock.y = lastBlock.y - blockSide;
            break;
        case 'r':
            newBlock.x = lastBlock.x - blockSide;
            newBlock.y = lastBlock.y;
            break;
        case 'l':
            newBlock.x = lastBlock.x + blockSide;
            newBlock.y = lastBlock.y;
            break; 
    }

    newBlock.d = lastBlock.d;
    snakeRects.push(newBlock)
}

function createNewCircle(){
    circle.x = parseInt(Math.random() * (canvas.width - (2 * circle.r)));
    circle.y = parseInt(Math.random() * (canvas.height - (2 * circle.r)));
    circle.r = 12.5;
} 

function drawCircle(){
    canvasCtx.beginPath();
    canvasCtx.fillStyle = 'red';
    canvasCtx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
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