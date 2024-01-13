class SudokuSolver {

  createTwoDimensionalArray(puzzleString) {
    const size = 9;
    const sudokuArray = [];

    for (let i = 0; i < size; i++) {
      sudokuArray.push(puzzleString.slice(i * size, (i + 1) * size).split(''));
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        sudokuArray[i][j] = sudokuArray[i][j] === '.' ? 0 : parseInt(sudokuArray[i][j])
      }
    }
    return sudokuArray;
  }

  arrayToString(array) {
    return array.map(row => row.join('')).join('');
  }

  validate(puzzleString) {
    if (puzzleString.length === 81) {
      return /^[1-9.]+$/.test(puzzleString);
    }else {
      return "too many characters";
    }
  }

  checkRowPlacement(puzzleArray, row, column, value) {
    if (puzzleArray[row][column] === value) {
      return true;
    }
    
    if (puzzleArray[row][column] !== 0) {
      return false;
    }
    
    for (let i = 0; i < 9; i++) {
      if (puzzleArray[row][i] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleArray, row, column, value) {
    if (puzzleArray[row][column] === value) {
      return true;
    }

    if (puzzleArray[row][column] !== 0) {
      return false;
    }
   
    for (let i = 0; i < 9; i++) {
      if (puzzleArray[i][column] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleArray, row, column, value) {
    const subgridRow = Math.floor(row / 3) * 3;
    const subgridCol = Math.floor(column / 3) * 3;

    if (puzzleArray[row][column] === value) {
      return true;
    }

    if (puzzleArray[row][column] !== 0) {
      return false;
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzleArray[subgridRow + i][subgridCol + j] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleArray) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzleArray[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.checkRowPlacement(puzzleArray, row, col, num) && this.checkColPlacement(puzzleArray, row, col, num) && this.checkRegionPlacement(puzzleArray, row, col, num)) {
              puzzleArray[row][col] = num;
              
              if (this.solve(puzzleArray)) {
                return this.arrayToString(puzzleArray);
              }
              puzzleArray[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return puzzleArray;
  }
}

module.exports = SudokuSolver;

