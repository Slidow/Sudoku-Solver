const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('POST: /api/solve - Solve a puzzle with valid puzzle string', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
                done();
            });
    });

    test('POST: /api/solve - Solve a puzzle with missing puzzle string', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field missing');
                done();
            });
    });

    test('POST: /api/solve - Solve a puzzle with invalid characters', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '1.5..2.!4..63.12.7.2..5.....$..1....8.2.3674.3.7.2..9.47...%..1..16....926914.37.' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    })

    test('POST: /api/solve - Solve a puzzle with incorrect length', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '1.5..2.!4..63.12.7.2..5.....$..1....8.2.3674.3.7.2..9.47' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    })

    test('POST: /api/solve - Solve a puzzle that cannot be solved', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '1.5..2.34..63.12.7.2..556...9..1....8.2.3374.3.7.2..9.47...8.21..16....996914.37.' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Puzzle cannot be solved');
                done();
            });
    })

    test('POST: /api/check - Check a puzzle placement with all fields', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '7' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, true);
                done();
            });
    });

    test('POST: /api/check - Check a puzzle placement with single placement conflict', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '6' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 1);
                done();
            });
    })

    test('POST: /api/check - Check a puzzle placement with multiple placement conflicts', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '1' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 2);
                done();
            });
    })

    test('POST: /api/check - Check a puzzle placement with all placement conflicts', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '5' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 3);
                done();
            });
    })

    test('POST: /api/check - Check a puzzle placement with missing required fields', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', value: '5' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    })

    test('POST: /api/check - Check a puzzle placement with invalid characters', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: '..9..5.1.85.4....2%32......1...69.83.9..$..6.62.71...9....!.1945....4.37.4.3..6..', coordinate: 'A1', value: '5' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    })

    test('POST: /api/check - Check a puzzle placement with incorrect length', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9.', coordinate: 'A1', value: '5' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    })

    test('POST: /api/check - Check a puzzle placement with invalid placement coordinate', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'S1', value: '5' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid coordinate");
                done();
            });
    })

    test('POST; /api/check - Check a puzzle placement with invalid placement value', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '23' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid value");
                done();
            });
    })
});

