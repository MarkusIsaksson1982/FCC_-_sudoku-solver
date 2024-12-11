/* I have utilized ChatGPT and Perplexity as resources for guidance and learning throughout this project. My approach reflects the growing trend of modern developers using AI tools to enhance their coding processes. However, all the final code presented here is my own work, based on own independently thought out prompts and without copying prompts or code from others other than snippets. I believe this practice aligns with the principles of academic honesty, as it emphasizes learning and using technology responsibly. */

const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  test('Valid puzzle string of 81 characters', () => {
    const result = solver.validate('1'.repeat(81));
    assert.isTrue(result.valid);
  });

  test('Puzzle string with invalid characters', () => {
    const result = solver.validate('1'.repeat(80) + 'X');
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Invalid characters in puzzle');
  });

  test('Puzzle string not 81 characters in length', () => {
    const result = solver.validate('1'.repeat(80));
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Expected puzzle to be 81 characters long');
  });

  test('Valid row placement', () => {
    const puzzle = '1'.repeat(81);
    assert.isTrue(solver.checkRowPlacement(puzzle, 0, 1, '2'));
  });

  test('Invalid row placement', () => {
    const puzzle = '1'.repeat(81);
    assert.isFalse(solver.checkRowPlacement(puzzle, 0, 1, '1'));
  });

  test('Valid column placement', () => {
    const puzzle = '1'.repeat(81);
    assert.isTrue(solver.checkColPlacement(puzzle, 0, 0, '2'));
  });

  test('Invalid column placement', () => {
    const puzzle = '1'.repeat(81);
    assert.isFalse(solver.checkColPlacement(puzzle, 0, 0, '1'));
  });

  test('Valid region placement', () => {
    const puzzle = '1'.repeat(81);
    assert.isTrue(solver.checkRegionPlacement(puzzle, 0, 0, '2'));
  });

  test('Invalid region placement', () => {
    const puzzle = '1'.repeat(81);
    assert.isFalse(solver.checkRegionPlacement(puzzle, 0, 0, '1'));
  });

  test('Solver returns a valid solution', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.solve(puzzle);
    assert.property(result, 'solution');
    assert.equal(result.solution.length, 81);
    assert.notInclude(result.solution, '.');
  });
  

  test('Solver identifies unsolvable puzzle', () => {
    const puzzle = '9'.repeat(81);
    const result = solver.solve(puzzle);
    assert.property(result, 'error');
    assert.equal(result.error, 'Puzzle cannot be solved');
  });
  
  test('Solver returns the correct solution for a valid puzzle', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const expectedSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
    const result = solver.solve(puzzle);
    assert.property(result, 'solution');
    assert.equal(result.solution, expectedSolution);
  });
    
  
});
