const delta = 1;
const blockSide = 25;
const snakeRects = [];

let interval, head;
const canvas = document.getElementById('board');
const canvasCtx = canvas.getContext('2d');
const symbolImg = document.getElementById('symbol');
let symbol = createNewSymbol()


window.onload = function() {
    document.addEventListener('keydown', (event) => keyListener(event.code));
    document.getElementById('start').addEventListener('click', () => interval = setInterval(run, 10))

    newGame()
}

function newGame(){
    initiateBlocks();
    symbol = createNewSymbol();

    drawRects();
    canvasCtx.drawImage(symbolImg, symbol.x, symbol.y, blockSide, blockSide)
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

    head = snakeRects[0]
}

function run() {
    if(isEdge(head.x, head.y)) {
        endGame()
    }

    if(isHittingSymbol(head.x, head.y)){
        addBlock()
        symbol = createNewSymbol()
    }

    snakeRects.forEach(block => {
        checkDirection(block);
        move(block);
    })

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
    canvasCtx.drawImage(symbolImg, symbol.x, symbol.y, blockSide, blockSide)

    drawRects();
}

function endGame() {
    clearInterval(interval);
}

function isHittingSymbol(x, y) {
    return !( x + blockSide < symbol.x
           || x > symbol.x + blockSide
           || y + blockSide < symbol.y
           || y > symbol.y + blockSide);
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

function drawRects() {
    snakeRects.forEach(line => {
        canvasCtx.drawImage(document.getElementById(`shoes-${line.d}`), line.x, line.y, blockSide, blockSide);
    })
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

function createNewSymbol(){
    return {
        x: parseInt(Math.random() * (canvas.width - blockSide)),
        y: parseInt(Math.random() * (canvas.height - blockSide))
    }
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
            block.y = block.y - delta;
            break;
        case 'd':
            block.y = block.y + delta;
            break;
        case 'l':
            block.x = block.x - delta;
            break;
        case 'r':
            block.x = block.x + delta;
            break;
    }
}