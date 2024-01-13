'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let stringValue = req.body.value;
      let value = parseInt(req.body.value);

      if (!puzzle || !coordinate || !stringValue) {
        res.json({ error: 'Required field(s) missing' });
        return;
      }
      
      if (!/^[1-9]$/.test(value)) {
        res.json({ error: "Invalid value" });
        return;
      }
  
      const  coordinateMatch = coordinate.match(/([A-I])([1-9])/);

      if (coordinate.length !== 2 || !coordinateMatch) {
        res.json({ error: "Invalid coordinate" });
        return;
      }

      let columnLetterValue = coordinateMatch[1];
      let horizontalValue = parseInt(coordinateMatch[2]);
      let columnValue = columnLetterValue.charCodeAt(0) - 'A'.charCodeAt(0) + 1;

      if (!solver.validate(puzzle)) {
        res.json({ error: 'Invalid characters in puzzle' });
        return;
      }

      if (solver.validate(puzzle) === "too many characters") {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
        return;
      }

      let puzzleArray = solver.createTwoDimensionalArray(puzzle);

      let checkHorizontalConflict = solver.checkRowPlacement(puzzleArray, horizontalValue - 1, columnValue - 1, value);
      let checkVerticalConflict = solver.checkColPlacement(puzzleArray, horizontalValue - 1, columnValue - 1, value);
      let checkRegionConflict = solver.checkRegionPlacement(puzzleArray, horizontalValue - 1, columnValue - 1, value);

      let conflicts = [];

      if (!checkHorizontalConflict) {
        conflicts.push("row");
      }
      if (!checkVerticalConflict) {
        conflicts.push("column");
      }
      if (!checkRegionConflict) {
        conflicts.push('region');
      }
      
      if (conflicts.length > 0) {
        res.json({ valid: false, conflict: conflicts });
        return;
      } else {
        res.json({ valid: true });
        return;
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;

      if (!puzzle) {
        res.json({ error: 'Required field missing' });
        return;
      }
      if (!solver.validate(puzzle)) {
        res.json({ error: 'Invalid characters in puzzle' });
        return;
      }
      if (solver.validate(puzzle) === "too many characters") {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
        return;
      }

      let puzzleArray = solver.createTwoDimensionalArray(puzzle);

      let solution = solver.solve(puzzleArray);
      console.log(solution);

      if (!solution) {
        res.json({ error: 'Puzzle cannot be solved' });
        return;
      }
      // let puzzleArrayString = solution.map((row) => row.join('')).join('');

      res.json({solution: solution});
    });
};
