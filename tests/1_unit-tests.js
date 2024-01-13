const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const invalidCharacterString = '$.9..5.1.85.4....2432...$..1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
const tooShortString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....92691';
const arrayString = solver.createTwoDimensionalArray(puzzleString);
const invalidArrayString = solver.createTwoDimensionalArray('..5..5.1.85.4....2432..7...1...69.83.9.....5.62.71...9....3.1945....4.37.4.3..6..');

suite('Unit Tests', () => {
    test('handles a valid puzzle string of 81 characters', (done) => {
        assert.equal(solver.validate(puzzleString), true);
        done();
    });
    
    test('handles a puzzle string with invalid characters', (done) => {
        assert.equal(solver.validate(invalidCharacterString), false);
        done();
    });

    test('handles a puzzle string that is not 81 characters in length', (done) => {
        assert.equal(solver.validate(tooShortString), "too many characters");
        done();
    });

    test('Logic handles a valid row placement', (done) => {
        assert.equal(solver.checkRowPlacement(arrayString, 0, 0, 7), true);
        done();
    });

    test('Logic handles an invalid row placement', (done) => {
        assert.equal(solver.checkRowPlacement(arrayString, 0, 0, 5), false);
        done();
    })

    test('Logic handles a valid column placement', (done) => {
        assert.equal(solver.checkColPlacement(arrayString, 0, 0, 7), true);
        done();
    })

    test('Logic handles an invalid column placement', (done) => {
        assert.equal(solver.checkColPlacement(arrayString, 0, 0, 5), false);
        done();
    })

    test('Logic handles a valid region (3x3 grid) placement', (done) => {
        assert.equal(solver.checkRegionPlacement(arrayString, 0, 0, 7), true);
        done();
    })

    test('Logic handles an invalid region (3x3 grid) placement', (done) => {
        assert.equal(solver.checkRegionPlacement(arrayString, 0, 0, 5), false);
        done();
    })

    test('Valid puzzle strings pass the solver', (done) => {
        let arrayString1 = solver.createTwoDimensionalArray('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3');
        assert.equal(solver.solve(arrayString1), '568913724342687519197254386685479231219538467734162895926345178473891652851726943');
        done();
    })

    test('Invalid puzzle strings fail the solver', (done) => {
        assert.equal(solver.solve(invalidArrayString), false);
        done();
    })

    test('Solver returns the expected solution for an incomplete puzzle', (done) => {
        let arrayString2 = solver.createTwoDimensionalArray('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1')
        assert.equal(solver.solve(arrayString2), '218396745753284196496157832531672984649831257827549613962415378185763429374928561');
        done();
    })
});
