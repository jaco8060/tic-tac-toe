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

  return { getBoard, printBoard };
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
