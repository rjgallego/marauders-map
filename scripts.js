const delta = 1;
const imgSide = 25;
let footprints;
let score = 0;
let highScore = 0;

let interval, head;
const canvas = document.getElementById('board');
const canvasCtx = canvas.getContext('2d');
const symbolImg = document.getElementById('symbol');
let symbol;

const startButton = document.getElementById('start');
const newButton = document.getElementById('new-game');

window.onload = function() {
    document.addEventListener('keydown', (event) => keyListener(event.code));

    startButton.addEventListener('click', () => {
        interval = setInterval(run, 10)
        startButton.disabled = true;
    })

    newButton.addEventListener('click', () => {
        document.getElementById('window').style = "display: none";
        startButton.disabled = false;

        newGame()
    })

    startButton.disabled = true;
}

function newGame(){
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

    initiateImgs();
    symbol = createNewSymbol();

    drawImgs();
    canvasCtx.drawImage(symbolImg, symbol.x, symbol.y, imgSide, imgSide)
}

function initiateImgs() {
    const x = 85;
    const y = 250;
    footprints = [];

    for(let i = 0; i < 4; i++){
        footprints.push({
            x: x - (i * imgSide),
            y: y,
            d: 'r'
        })
    }

    head = footprints[0]
}

function run() {

    if(isEdge(head.x, head.y) || isHittingSelf()) {
        endGame()
    }

    if(isColliding(head.x, head.y, symbol.x, symbol.y)){
        eatSymbol()
    }

    drawBoard()

}

function drawBoard() {
    footprints.forEach(img => {
        checkDirection(img);
        move(img);
    })

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
    canvasCtx.drawImage(symbolImg, symbol.x, symbol.y, imgSide, imgSide)

    drawImgs();
}

function endGame() {
    clearInterval(interval);
    updateScore(true)
    updateWindow();

    startButton.disabled = true;
}

function updateWindow() {
    document.getElementById('window').style = "display: flex";
    document.getElementById('message').textContent = "Mischief Managed"
}

function updateScore(isEnd) {
    if(isEnd) {
        highScore = score > highScore ? score : highScore;
        score = 0;
    
        document.getElementById("score").textContent = `: ${score}`;
        document.getElementById("high-score").textContent = `: ${highScore}`;

        return;
    }

    score = score + 1;
    document.getElementById("score").textContent = `: ${score}`;
}

function eatSymbol() {
    symbol = createNewSymbol()

    addImg()
    updateScore(false);
}

function isColliding(firstX, firstY, secondX, secondY) {
    return !( firstX + imgSide < secondX
           || firstX > secondX + imgSide
           || firstY + imgSide < secondY
           || firstY > secondY + imgSide);
}

function isHittingSelf() {
    let img;
    for(let i = 3; i < footprints.length; i++){
        img = footprints[i];
        if(isColliding(head.x, head.y, img.x, img.y)){
            return true;
        }
    }
    return false;
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
    head.d = direction;
}

function isEdge(x, y) {
    return ( y - delta <= 0
          || x - delta <= 0
          || y + imgSide >= canvas.height
          || x + imgSide >= canvas.width
    )
}

function drawImgs() {
    footprints.forEach(line => {
        canvasCtx.drawImage(document.getElementById(`shoes-${line.d}`), line.x, line.y, imgSide, imgSide);
    })
}

function addImg(){
    const lastImg = footprints[footprints.length - 1];
    const newImg = {};

    switch(lastImg.d){
        case 'u':
            newImg.x = lastImg.x;
            newImg.y = lastImg.y + imgSide;
            break;
        case 'd':
            newImg.x = lastImg.x;
            newImg.y = lastImg.y - imgSide;
            break;
        case 'r':
            newImg.x = lastImg.x - imgSide;
            newImg.y = lastImg.y;
            break;
        case 'l':
            newImg.x = lastImg.x + imgSide;
            newImg.y = lastImg.y;
            break; 
    }

    newImg.d = lastImg.d;
    footprints.push(newImg)
}

function checkSymbolLoc(x, y){
    footprints.forEach(img => {
        if(isColliding(img.x, img.y, x, y)){
            return true;
        }
    })
    return false;
}

function createNewSymbol(){
    let x, y;
    do{
        x = parseInt(Math.random() * (canvas.width - imgSide))
        y = parseInt(Math.random() * (canvas.height - imgSide))
    } while(checkSymbolLoc(x, y))

    return {
        x: parseInt(Math.random() * (canvas.width - imgSide)),
        y: parseInt(Math.random() * (canvas.height - imgSide))
    }
} 

function checkDirection(img) {
    const index = footprints.indexOf(img);
    if(index !== 0){
        const prevImg = footprints[index - 1];
        if(img.d !== prevImg.d && (img.x === prevImg.x || img.y === prevImg.y)){
            img.d = prevImg.d;
        }
    }
}

function move(img) {
    switch(img.d){
        case 'u':
            img.y = img.y - delta;
            break;
        case 'd':
            img.y = img.y + delta;
            break;
        case 'l':
            img.x = img.x - delta;
            break;
        case 'r':
            img.x = img.x + delta;
            break;
    }
}