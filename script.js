//IIFE single instance gameboard function
const Gameboard = (function () {
  const rows = 3;
  const cols = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = []; //create an array for each row
    for (let j = 0; j < cols; j++) {
      board[i].push(Cell()); //place a cell object in each cell and append cell to array
    }
  }
  const getBoard = () => board;

  const printBoard = () => {
    const boardWithValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithValues);
  };

  const checkAvailableCells = () => {
    let availableCells = false;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (board[i][j].getValue() == 0) {
          availableCells = true;
          return availableCells;
        }
      }
    }
    return availableCells;
  };
  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = []; //create an array for each row
      for (let j = 0; j < cols; j++) {
        board[i].push(Cell()); //place a cell object in each cell and append cell to array
      }
    }
  };
  //function that returns the winning player
  const checkForWin = (player1, player2) => {
    //check diagonals
    if (
      (board[0][0].getValue() === board[1][1].getValue().move &&
        board[1][1].getValue() === board[2][2].getValue().move &&
        board[0][0] != 0) ||
      (board[0][2].getValue().move === board[1][1].getValue().move &&
        board[1][1].getValue().move === board[2][0].getValue().move &&
        board[1][1] != 0)
    ) {
      if (board[1][1].getValue().move === "X") {
        return player1;
      } else if (board[1][1].getValue().move === "O") {
        //if there are 3 O's in a row
        return player2;
      }
    }
    // check rows/columns for 3 in a row
    for (let i = 0; i < 3; i++) {
      //check if there are 3 rows in a row for a winner
      console.log(board[i][0].getValue());
      if (
        board[i][0].getValue().move === board[i][1].getValue().move &&
        board[i][1].getValue().move === board[i][2].getValue().move &&
        board[i][0] != 0 &&
        board[i][1] != 0 &&
        board[i][2] != 0
      ) {
        if (board[i][1].getValue().move === "X") {
          return player1;
        } else if (board[i][1].getValue().move === "O") {
          //if there are 3 O's in a row
          return player2;
        }
      }
      //check if there are 3 column values in a row for a winner
      else if (
        board[0][i].getValue().move === board[1][i].getValue().move &&
        board[1][i].getValue().move === board[2][i].getValue().move &&
        board[0][i] != 0 &&
        board[1][i] != 0 &&
        board[2][i] != 0
      ) {
        if (board[0][i].getValue().move === "X") {
          return player1;
        } else if (board[0][i].getValue().move === "O") {
          //if there are 3 O's in a row
          return player2;
        }
      }
    }
    return;
  };
  //function for player making a move and the board updating:

  const Move = (row, column, player, square) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].playerMove(player);
      displayController.updateDisplayBoard(player, square);
    } else {
      return;
    }
  };

  return {
    getBoard,
    printBoard,
    Move,
    checkAvailableCells,
    checkForWin,
    resetBoard,
  };
})();

// A cell represents a square on the board and has the value of the player assigned to it. If Cell value is 0 (default) then no moves were made on that cell, and if the cell is 1 then player 1's move has made
function Cell() {
  let value = 0;

  //using closure, we can retrieve the current value of this cell
  const getValue = () => value;

  //change the value of playerMove through Cell.playerMove('X') - this will make the value of the Cell X indicating X has been played
  const playerMove = (player) => {
    value = player;
  };
  return { getValue, playerMove };
}
//runs the game logic

const gameController = (function () {
  let player1 = { playerName: "Player One", move: "X" };
  let player2 = { playerName: "Player Two", move: "O" };

  const setPlayerNames = (playerOneName, playerTwoName) => {
    player1.playerName = playerOneName;
    player2.playerName = playerTwoName;
  };

  let activePlayer = player1;

  //function used to switch the current player turn
  const switchPlayerTurn = () => {
    if (activePlayer === player1) {
      activePlayer = player2;
    } else {
      activePlayer = player1;
    }
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    Gameboard.printBoard();
    console.log(`${getActivePlayer().playerName}'s turn.`);
  };

  const playRound = (row, column, square) => {
    // Check if the selected cell is already occupied
    if (Gameboard.getBoard()[row][column].getValue() !== 0) {
      console.log("Cell is already occupied. Please choose another cell.");
      return;
    }
    //print current move
    console.log(
      `${
        getActivePlayer().playerName
      } has selected row ${row} and column ${column}`
    );
    // Make the move
    Gameboard.Move(row, column, getActivePlayer(), square);

    //check first for winner/if its a valid move
    const winner = Gameboard.checkForWin(player1, player2);
    // Check for available cells to check for tie game
    const availableCells = Gameboard.checkAvailableCells();
    if (winner) {
      console.log(`The winner is ${winner.playerName}`);
      // displayController.resetDisplayBoard();
      Gameboard.resetBoard();
      // add "start new game?" button
      return;
    } else if (!availableCells) {
      console.log("Game Over: Tie Game");
      displayController.resetDisplayBoard();
      Gameboard.resetBoard();
      return; // Indicating the game is over/tied
    } else {
      switchPlayerTurn();
      printNewRound();
    }
  };
  return { getActivePlayer, playRound, setPlayerNames };
})();

const displayController = (function () {
  const setupSquares = () => {
    const board_squares = document.querySelectorAll(".square button");
    board_squares.forEach((square) => {
      square.addEventListener("click", (e) => {
        const square = e.currentTarget;
        //extract the row and column from the data attribute in each button
        const row = parseInt(square.dataset.rowcol.slice(0, 1), 10);
        const col = parseInt(square.dataset.rowcol.slice(1, 2), 10);

        //make a player move using the row and col
        gameController.playRound(row, col, square);
      });
    });
  };

  const updateDisplayBoard = (player, square) => {
    const displayO = document.createElement("img");

    if (player.move === "X") {
      const displayX = document.createElement("img");
      displayX.src = "img/X.svg";
      square.appendChild(displayX);
    } else if (player.move === "O") {
      const displayO = document.createElement("img");
      displayO.src = "img/O.svg";
      square.appendChild(displayO);
    }
  };

  const resetDisplayBoard = () => {
    const board_squares = document.querySelectorAll(".square button");
    board_squares.forEach((square) => {
      const displayMove = document.querySelector("img");
      if (displayMove) {
        //if there is an image in the div
        displayMove.remove();
      }
    });
  };

  const startGame = () => {
    const startGameButton = document.getElementById("gameStartButton");
    const player1Input = document.querySelector(".player1Input");
    const player2Input = document.querySelector(".player2Input");

    startGameButton.addEventListener("click", (e) => {
      e.preventDefault();
      const playerOneName = player1Input.value || "Player One";
      const playerTwoName = player2Input.value || "Player Two";
      gameController.setPlayerNames(playerOneName, playerTwoName);
      displayController.setupSquares();
      switchDisplays("start");
    });
  };

  const switchDisplays = (gameState) => {
    const startGameWindow = document.querySelector(".user-selection");
    const gameBoardWindow = document.querySelector(".game-board");

    if (gameState === "start") {
      startGameWindow.style.display = "none";
      gameBoardWindow.style.display = "grid";
    }
  };

  return {
    setupSquares,
    updateDisplayBoard,
    resetDisplayBoard,
    startGame,
    switchDisplays,
  };
})();
displayController.startGame();

//tic tac toe:

// choose to be player 1 or player 2- player 1 is X and player 2 is O; player 1 goes first when they select a place to put an X, the cell object value should be X so Cell.Value(activePlayer.move).
