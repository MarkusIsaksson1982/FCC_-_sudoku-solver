/* I have utilized ChatGPT and Perplexity as resources for guidance and learning throughout this project. My approach reflects the growing trend of modern developers using AI tools to enhance their coding processes. However, all the final code presented here is my own work, based on own independently thought out prompts and without copying prompts or code from others other than snippets. I believe this practice aligns with the principles of academic honesty, as it emphasizes learning and using technology responsibly. */

const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('POST /api/solve', () => {
    test('Solve a puzzle that cannot be solved', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '9'.repeat(81) })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
    

    test('Solve a puzzle with missing puzzle string', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

    test('Solve a puzzle with invalid characters', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9..@..6.62.71...9......1945....4.37.4.3..6..' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Solve a puzzle with incorrect length', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Solve a puzzle that cannot be solved', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '9'.repeat(81) })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
    
    
  });

  suite('POST /api/check', () => {
    test('Check a puzzle placement with all fields', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A1',
          value: '7'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test('Check a puzzle placement with single placement conflict', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A1',
          value: '5'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.include(res.body.conflict, 'row');
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A1',
          value: '1'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'column');
          done();
        });
    });

    test('Check a puzzle placement with missing required fields', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('Check a puzzle placement with invalid characters', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9..@..6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A1',
          value: '7'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Check a puzzle placement with invalid coordinate', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'Z9',
          value: '7'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });

    test('Check a puzzle placement with invalid value', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A1',
          value: '10'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });

    test('Solve a puzzle with valid puzzle string', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'solution');
          assert.equal(res.body.solution.length, 81);
          assert.notInclude(res.body.solution, '.');
          done();
        });
    });
    test('Solve a puzzle with valid puzzle string of all periods', (done) => {
  chai.request(server)
    .post('/api/solve')
    .send({ puzzle: '.'.repeat(81) })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.property(res.body, 'solution');
      assert.equal(res.body.solution.length, 81);
      assert.notInclude(res.body.solution, '.');
      done();
    });
    test('Solve a puzzle with valid puzzle string of all periods', (done) => {
        chai.request(server)
          .post('/api/solve')
          .send({ puzzle: '.'.repeat(81) })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'solution');
            assert.equal(res.body.solution.length, 81);
            assert.notInclude(res.body.solution, '.');
            done();
          });
      });
      
});

  });
});

