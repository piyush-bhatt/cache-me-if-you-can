const should = require('chai').should();
const expect = require('chai').expect;
const supertest = require('supertest');
const api = supertest('http://localhost:8080/cache');

describe('Cache response', function () {

    before(function (done) {

        api.post('/')
            .set('Content-Type', 'application/json')
            .send({
                "key": "key1",
                "value": "value1"
            })
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function (err, res) {
                done();
            });
    });

    it('should return a 200 response', function (done) {
        api.get('/keys/key1')
            .expect(200, done);
    });

    it('should be the provided value during creation', function (done) {
        api.get('/keys/key1')
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.be.equal('value1');
                expect(res.body).to.not.equal(null);
                done();
            });
    });

    it('should be updated with a new value if posted with same key', function (done) {
        api.post('/keys/key1')
            .set('Content-Type', 'application/json')
            .send({
                "key": "key1",
                "value": "changedValue"
            })
            .expect(201)
            .end(function (err, res) {
                expect(res.body).to.be.equal('changedValue');
                expect(res.body).to.equal("Cache updated successfully");
                expect(res.body).to.not.equal(null);
                done();
            });
    });

    it('should create a new item', function (done) {
        api.post('/keys/key4')
            .set('Content-Type', 'application/json')
            .send({
                "key": "key4",
                "value": "value4"
            })
            .expect(201)
            .end(function (err, res) {
                expect(res.body).to.equal("Data cached successfully");
                expect(res.body).to.not.equal(null);
                done();
            });
    });

    it('should return all keys', function (done) {
        api.get('/keys')
            .expect(200)
            .end(function (err, res) {
                expect(res.body).to.be.instanceof(Array);
                expect(res.body).to.not.equal(null);
                done();
            });
    });

});