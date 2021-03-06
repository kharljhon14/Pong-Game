// variables to keep track of ball position
let ballX = 75,
   ballY = 75;
let ballSpeedX = 20,
   ballSpeedY = 4;

let paddle1Score = 0,
   paddle2Score = 0;
let paddle1Y = 250,
   paddle2Y = 250;
let showingWinScreen = false;

const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const WINNING_SCORE = 11;

const PADDLE_COMPUTER_MOVE_SPEED = 9.0;

// save the canvas for dimensions, and its 2d context for drawing to it
let canvas, canvasContext;

function calculateMousePos(evt) {
   let rect = canvas.getBoundingClientRect(),
      root = document.documentElement;

   // account for the margins, canvas position on page, scroll amount, etc.
   let mouseX = evt.clientX - rect.left - root.scrollLeft;
   let mouseY = evt.clientY - rect.top - root.scrollTop;
   return {
      x: mouseX,
      y: mouseY,
   };
}

function handleMouseClick(evt) {
   if (showingWinScreen) {
      paddle1Score = 0;
      paddle2Score = 0;
      showingWinScreen = false;
   }
}

window.onload = function () {
   canvas = document.getElementById("gameCanvas");
   canvasContext = canvas.getContext("2d");

   // these next few lines set up our game logic and render to happen 30 times per second
   let framesPerSecond = 60;
   setInterval(function () {
      moveEverything();
      drawEverything();
   }, 1000 / framesPerSecond);

   canvas.addEventListener("mousedown", handleMouseClick);

   canvas.addEventListener("mousemove", function (evt) {
      let mousePos = calculateMousePos(evt);
      paddle1Y = mousePos.y - PADDLE_HEIGHT / 2; // minus half paddle height to center
   });

   // lets set all text in the program to be centered instead of left justified
   canvasContext.textAlign = "center";
   // we could override this by setting it otherwise, but if we don't ever change
   // it then it will just stay centered for any text calls
};

function ballReset() {
   if (paddle1Score >= WINNING_SCORE || paddle2Score >= WINNING_SCORE) {
      showingWinScreen = true;
   }

   // reverse ball heading, so whoever scored a point "serves"
   ballSpeedX = -ballSpeedX;

   // give ball some slightly randomized diagonal, but not too steep ////
   ballSpeedY = 5.0 + Math.random() * 4.0; ////
   // and half the time reverse whether it goes up or down first ////
   if (Math.random() < 0.5) {
      ////
      ballSpeedY *= -1.0; ////
   } ////

   // center ball on screen
   ballX = canvas.width / 2;
   ballY = canvas.height / 2;
}

function moveComputerPaddle() {
   let paddle2Center = paddle2Y + PADDLE_HEIGHT / 2;
   const AI_SIT_STILL_MARGIN = 35;
   let topChaseLine = paddle2Center - AI_SIT_STILL_MARGIN;
   let bottomChaseLine = paddle2Center + AI_SIT_STILL_MARGIN;

   if (ballY < topChaseLine) {
      paddle2Y -= PADDLE_COMPUTER_MOVE_SPEED;
   } else if (ballY > bottomChaseLine) {
      paddle2Y += PADDLE_COMPUTER_MOVE_SPEED;
   }
}

function moveEverything() {
   if (showingWinScreen) {
      return;
   }

   moveComputerPaddle();

   if (ballX < 0) {
      // if ball has moved beyond the left edge
      if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
         ballSpeedX *= -1; // reverse ball's horizontal direction

         let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
         ballSpeedY = deltaY * 0.35;
      } else {
         paddle2Score++;
         ballReset();
      }
   }

   if (ballX > canvas.width) {
      // if ball has moved beyond the right edge
      if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
         ballSpeedX *= -1; // reverse ball's horizontal direction

         let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
         ballSpeedY = deltaY * 0.35;
      } else {
         paddle1Score++;
         ballReset();
      }
   }

   if (ballY < 0) {
      // if ball has moved beyond the top edge
      ballSpeedY *= -1; // reverse ball's vertical direction
   }

   if (ballY > canvas.height) {
      // if ball has moved beyond the bottom edge
      ballSpeedY *= -1; // reverse ball's vertical direction
   }

   ballX += ballSpeedX; // move the ball based on its current horizontal speed
   ballY += ballSpeedY; // same as above, but for vertical
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
   canvasContext.fillStyle = fillColor;
   canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
   canvasContext.fillStyle = fillColor;
   canvasContext.beginPath();
   canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
   canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
   canvasContext.fillStyle = fillColor;
   canvasContext.fillText(showWords, textX, textY);
}

function drawNet() {
   for (let i = 0; i < canvas.height; i += 40) {
      colorRect(canvas.width / 2 - 1, i, 2, 20, "#50514f");
   }
}

function drawEverything() {
   // clear the game view by filling it with black
   colorRect(0, 0, canvas.width, canvas.height, "white");

   if (showingWinScreen) {
      if (paddle1Score >= WINNING_SCORE) {
         colorText("LEFT PLAYER WINS!", canvas.width / 2, canvas.height / 2, "#50514f");
      } else if (paddle2Score >= WINNING_SCORE) {
         colorText("RIGHT PLAYER WINS!", canvas.width / 2, canvas.height / 2, "#50514f");
      }
      colorText("-- click anywhere to begin a new match --", canvas.width / 2, canvas.height - 20, "#50514f");
   } else {
      // draw a white rectangle to use as the left player's paddle
      colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "#50514f");

      // draw a white rectangle to use as the right player's paddle
      colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "#50514f");

      // draw net in the middle of the playfield
      drawNet();

      // draw the ball
      colorCircle(ballX, ballY, 10, "#f25f5c");
   }
   // display text on screen - will be used for score
   colorText(paddle1Score, 100, 100, "#50514f");
   colorText(paddle2Score, canvas.width - 100, 100, "#50514f");
}
