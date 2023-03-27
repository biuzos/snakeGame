const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score")
const highScoreElement = document.querySelector(".high-score")
const controls = document.querySelector(".controls i")

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

//pegando highscore do armazenamento local
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;


const changeFoodPosition = () => {
    // PASSANDO UM VALOR RANDOM DE 0 - 30 COMO POSIÇÃO
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // limpando o  timer e dando reload na página no game over
    clearInterval(setIntervalId);
    alert("GameOver! Pressione Ok para recomeçar...")
    location.reload();
}

const changeDirection = (e) => {
    // mudando a velocidade baseado na tecla pressionada
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown"&& velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft"&& velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight"&& velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
  
}

controls.forEach(key => {
    key.addEventListener("click", () => console.log(key))
});

const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX} "></div>`;

    //checando se a cobra pegou a comida
    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // dando push da food position para a body snake
        score++; // incrementando por 1

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for(let i = snakeBody.length - 1; i > 0; i--){
        //passando para frente os valores do elemento na snake body unitariamente
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX,snakeY]; //setando primeiro elemento da snake body para a atual snake

    //atualizando a posição da cabeça da cobra baseada na velocidade
    snakeX += velocityX;
    snakeY += velocityY

    if(snakeX <= 0  || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }

    //checando se a cobra está fora da parede, se sim setando game over para true
    for(let i = 0; i < snakeBody.length; i++){
        //adicionando uma div para cada parte da snakeBody
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]} "></div>`;
        // checando se a cabeça da cobra pega no corpo, se pegar gameover vira true
        if(i !== 0 && snakeBody[0][1] === snakeBody[1][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection)
