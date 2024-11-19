const gameCanvas = document.getElementById("playArea");
const ctx = gameCanvas.getContext("2d");

let blockSize = 10;
let rowSize = 40;
let colSize = 40;
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;
// These are used to determine the direction of the snake. (Negative is down/left, Positive is up/right)
let speedX = 0;
let speedY = 0;
let snakeBody = [];
let foodX;
let foodY;
let gameOver = false;
let gameInterval;
let score = 0;



function startGame() {
    gameOver = false;
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    snakeBody = [];
    speedX = 0;
    speedY = 0;
    score = 0;
    updateScoreDisplay();

    gameCanvas.height = rowSize * blockSize;
    gameCanvas.width = colSize * blockSize;

    placeFood();
    document.addEventListener("keydown", changeDirection);

    // Clear any existing game interval
    if (gameInterval) clearInterval(gameInterval);
    // Start a new game interval with a fixed speed
    gameInterval = setInterval(game, 100);
}

function game() {
    if (gameOver) return;
     // The game's background color
    ctx.fillStyle = '#66ff66';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    // setting the color of the food
    ctx.fillStyle = "#ff4d4d";
    ctx.fillRect(foodX, foodY, blockSize, blockSize);

    //this replaces the food once the snake moves over it as well as ads a segment to the body
    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        score = score + 80;
        updateScoreDisplay();
    }

    // This ensures the tail follows the head, but does not manipulate the head.
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    //this sets the 'head' as the definitive position of the snake.
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // This updates the snake's position (works in time with the Interval)
    snakeX += speedX * blockSize;
    snakeY += speedY * blockSize;

    // This is the color of the snake
    ctx.fillStyle = "white";
    ctx.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        ctx.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    //Trigger Game Over on hitting self
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) { 
            endGame();
            return;
        }
    }

    //Trigger Game Over on hitting the edge
    if (snakeX < 0 || snakeX > colSize * blockSize || snakeY < 0 || snakeY > rowSize * blockSize) {         
        endGame();
        return;
    }
}

// Place food at random.
function placeFood() {
    foodX = Math.floor(Math.random() * colSize) * blockSize; 
    foodY = Math.floor(Math.random() * rowSize) * blockSize; 
}

// Movement + not doubling back
function changeDirection(event) {
    if (event.code === "ArrowUp" && speedY != 1) { 
        speedX = 0;
        speedY = -1;
        }
        else if (event.code === "ArrowDown" && speedY != -1) {
            speedX = 0;
            speedY = 1;
        
        } else if (event.code === "ArrowLeft" && speedX != 1) {
            speedX = -1;
            speedY = 0;
        
        } else if (event.code === "ArrowRight" && speedX != -1) { 
            speedX = 1;
            speedY = 0;
        }
}



function endGame() {
    if (!gameOver) {
        gameOver = true; // Set the game state to over
        clearInterval(gameInterval); // Stop the game loop

        // Show the Game Over modal
        const modal = document.getElementById("gameOverModal");
        const modalScore = document.getElementById("modalScore");
        modalScore.innerText = score; 
        modal.classList.add("is-active"); 

        // Set up event listener for the "Play Again" button
        const playAgainButton = document.getElementById("playAgainButton");
        playAgainButton.onclick = () => {
            modal.classList.remove("is-active"); // Close the modal
            startGame(); // Restart the game
        };

        // Close modal with the close button
        const closeModal = document.querySelector(".modal-close");
        closeModal.onclick = () => {
            modal.classList.remove("is-active");
        };
    }
}


function updateScoreDisplay() {
    const scoreElement = document.getElementById("score");
    scoreElement.innerText = `Score: ${score}`;
}



// Highlight the arrow key when it is pressed
function highlightArrowKey(event) {
    let arrowElement;

    if (event.code == "ArrowUp") {
        arrowElement = document.getElementById("keyUp");
    } else if (event.code == "ArrowDown") {
        arrowElement = document.getElementById("keyDown");
    } else if (event.code == "ArrowLeft") {
        arrowElement = document.getElementById("keyLeft");
    } else if (event.code == "ArrowRight") {
        arrowElement = document.getElementById("keyRight");
    }
    
    if (arrowElement) {
        arrowElement.classList.add("active");
    
        
        setTimeout(() => {
            arrowElement.classList.remove("active");
        }, 200);
    }
}
document.addEventListener("keydown", highlightArrowKey);





window.onload = function () {
    document.getElementById("playButton").addEventListener("click", startGame);
    displayLeaderboard();
};

// This listener prevents the page from scrolling when arrow keys are pressed.
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);