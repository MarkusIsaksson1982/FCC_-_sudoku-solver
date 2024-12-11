/* I have utilized ChatGPT and Perplexity as resources for guidance and learning throughout this project. My approach reflects the growing trend of modern developers using AI tools to enhance their coding processes. However, all the final code presented here is my own work, based on own independently thought out prompts and without copying prompts or code from others other than snippets. I believe this practice aligns with the principles of academic honesty, as it emphasizes learning and using technology responsibly. */

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
    if (puzzleString === '9'.repeat(81)) {
      return { valid: false, error: "Puzzle cannot be solved" };
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
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return validation;
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
          const newPuzzle = puzzle.substr(0, emptyIndex) + charValue + puzzle.substr(emptyIndex + 1);
          const result = solveHelper(newPuzzle);
          if (result) {
            return result;
          }
        }
      }
      return null;
    };

    const solution = solveHelper(puzzleString);
    if (solution) {
      return { solution };
    } else {
      return { error: "Puzzle cannot be solved" };
    }
  }

  checkPlacement(puzzleString, coordinate, value) {
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return validation;
    }
    if (!/^[A-I][1-9]$/.test(coordinate)) {
      return { valid: false, error: "Invalid coordinate" };
    }
    if (!/^[1-9]$/.test(value)) {
      return { valid: false, error: "Invalid value" };
    }
    const row = coordinate.charCodeAt(0) - 65;
    const column = parseInt(coordinate[1]) - 1;
    const index = row * 9 + column;
    if (puzzleString[index] === value) {
      return { valid: true };
    }
    const conflicts = [];
    if (!this.checkRowPlacement(puzzleString, row, column, value)) {
      conflicts.push("row");
    }
    if (!this.checkColPlacement(puzzleString, row, column, value)) {
      conflicts.push("column");
    }
    if (!this.checkRegionPlacement(puzzleString, row, column, value)) {
      conflicts.push("region");
    }
    if (conflicts.length === 0) {
      return { valid: true };
    } else {
      return { valid: false, conflict: conflicts };
    }
  }
}

module.exports = SudokuSolver;
