import chai from 'chai';
import request from 'supertest';
import app from '../src/index.js'; 

const expect = chai.expect;

describe('Employee listing tests', () => {

    it('Should successfully list all employees', (done) => {
        request(app)
        .get('/employees')
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.be.a('array');
            done();
        });
    });

    it('Should successfully list filtered employees', (done) => {
        const date = "2023-10-05";

        request(app)
        .get(`/employees/${date}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.be.a('array');
            done();
        });
    });

    it('Should successfully return empty list of employees', (done) => {
        const date = "2028-10-05";

        request(app)
        .get(`/employees/${date}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.equal(0);
            done();
        });
    });

    it('Should fail because of wrong date format', (done) => {
        const date = "2023-10-005";

        request(app)
        .get(`/employees/${date}`)
        .expect(400)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.text).to.be.a('string');
            expect(res.text).to.equal("The parameters isn't in the correct date format: YYYY-MM-DD");
            done();
        });
    });

});