class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) {
      return { valid: false, error: "Required field missing" };
    }

    if (puzzleString.length !== 81) {
      return { valid: false, error: "Expected puzzle to be 81 characters long" };
    }

    if (/[^1-9.]/.test(puzzleString)) {
      return { valid: false, error: "Invalid characters in puzzle" };
    }

    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = row * 9;
    const rowValues = puzzleString.slice(rowStart, rowStart + 9);
    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = column; i < 81; i += 9) {
      if (puzzleString[i] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRowStart = Math.floor(row / 3) * 3;
    const regionColStart = Math.floor(column / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const index = (regionRowStart + r) * 9 + (regionColStart + c);
        if (puzzleString[index] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validateResult = this.validate(puzzleString);
    if (!validateResult.valid) {
      return validateResult;
    }

    const solveHelper = (puzzle) => {
      const emptyIndex = puzzle.indexOf(".");
      if (emptyIndex === -1) {
        return puzzle;
      }

      const row = Math.floor(emptyIndex / 9);
      const column = emptyIndex % 9;

      for (let value = 1; value <= 9; value++) {
        const charValue = value.toString();
        if (
          this.checkRowPlacement(puzzle, row, column, charValue) &&
          this.checkColPlacement(puzzle, row, column, charValue) &&
          this.checkRegionPlacement(puzzle, row, column, charValue)
        ) {
          const solved = solveHelper(
            puzzle.slice(0, emptyIndex) + charValue + puzzle.slice(emptyIndex + 1)
          );
          if (solved) {
            return solved;
          }
        }
      }

      return null;
    };

    const solution = solveHelper(puzzleString);
    return solution ? { solution } : { error: "Puzzle cannot be solved" };
  }
}

module.exports = SudokuSolver;
