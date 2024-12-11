/* I have utilized ChatGPT and Perplexity as resources for guidance and learning throughout this project. My approach reflects the growing trend of modern developers using AI tools to enhance their coding processes. However, all the final code presented here is my own work, based on own independently thought out prompts and without copying prompts or code from others other than snippets. I believe this practice aligns with the principles of academic honesty, as it emphasizes learning and using technology responsibly. */

'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      const result = solver.solve(puzzle);
      if (result.error) {
        return res.json(result);
      }
      return res.json({ solution: result.solution });
    });

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      const validationResult = solver.validate(puzzle);
      if (!validationResult.valid) {
        return res.json({ error: validationResult.error });
      }
      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }
      const row = coordinate[0].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
      const column = parseInt(coordinate[1]) - 1;
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }
      const cellIndex = row * 9 + column;
      if (puzzle[cellIndex] === value) {
        return res.json({ valid: true });
      }
      const conflicts = [];
      if (!solver.checkRowPlacement(puzzle, row, column, value)) {
        conflicts.push('row');
      }
      if (!solver.checkColPlacement(puzzle, row, column, value)) {
        conflicts.push('column');
      }
      if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
        conflicts.push('region');
      }
      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }
      return res.json({ valid: true });
    });
};
