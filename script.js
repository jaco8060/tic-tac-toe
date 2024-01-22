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

  //function that returns the winning player
  const checkForWin = (player) => {
    //check diagonals

    // check rows/columns for 3 in a row
    for (let i = 0; i < 3; i++) {
      //check if there are 3 rows in a row for a winner

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
        } else {
          return;
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
        if (board[1][i].getValue().move === "X") {
          return player1;
        } else if (board[i][1].getValue().move === "O") {
          //if there are 3 O's in a row
          return player2;
        } else {
          return;
        }
      }
    }
  };
  //function for player making a move and the board updating:

  const Move = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].playerMove(player);
    } else {
      return;
    }
  };

  return { getBoard, printBoard, Move, checkAvailableCells, checkForWin };
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

const gameController = (function (
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const player1 = { playerName: playerOneName, move: "X" };
  const player2 = { playerName: playerTwoName, move: "O" };

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

  const playRound = (row, column) => {
    // Check if the selected cell is already occupied
    if (Gameboard.getBoard()[row][column].getValue() !== 0) {
      console.log("Cell is already occupied. Please choose another cell.");
      return;
    }
    // Check for available cells to check for tie game
    const availableCells = checkAvailableCells();
    if (!availableCells) {
      console.log("Game Over: Tie Game");
      return; // Indicating the game is over/tied
    }
    console.log(
      `${
        getActivePlayer().playerName
      } has selected row ${row} and column ${column}`
    );
    //check first for winner/if its a valid move
    const winner = Gameboard.checkForWin(player1, player2);

    if (winner) {
      console.log(`The winner is ${winner}`);
      return;
    } else if (winner != -1) {
      Gameboard.Move(row, column, getActivePlayer());
      switchPlayerTurn();
      printNewRound();
    }
  };
  return { getActivePlayer, playRound };
})();
gameController.playRound(0, 0);
gameController.playRound(0, 2);
gameController.playRound(1, 0);
gameController.playRound(1, 0);
gameController.playRound(2, 2);
gameController.playRound(2, 0);

//tic tac toe:

// choose to be player 1 or player 2- player 1 is X and player 2 is O; player 1 goes first when they select a place to put an X, the cell object value should be X so Cell.Value(activePlayer.move).
