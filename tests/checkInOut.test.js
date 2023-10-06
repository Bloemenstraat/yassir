import chai from 'chai';
import request from 'supertest';
import app from '../src/index.js'; 
import { faker } from '@faker-js/faker';

const expect = chai.expect;

const validID = "1933";
const fakeID = "6666";


describe('Employee check in and check out tests', () => {

    it('Should successfully check in', (done) => {
        const checkInData = {
            "employeeId": validID,
            "comment": ""
        };

        request(app)
        .post('/employees/check-in')
        .send(checkInData)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.text).to.be.a('string');
            expect(res.text).to.equal(`Successfully checked in employee ${validID}`);
            done();
        });
    });

    it('Should fail check in the same employee again', (done) => {
        const checkInData = {
            "employeeId": validID,
            "comment": ""
        };

        request(app)
        .post('/employees/check-in')
        .send(checkInData)
        .expect(409)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.text).to.be.a('string');
            expect(res.text).to.equal('This employee is already checked-in. Please check him out.');
            done();
        });
    });

    it('Should fail check out with a comment longer than 150 characters', (done) => {
        const checkInData = {
            "employeeId": validID,
            "comment": faker.string.alpha(151)
        };

        request(app)
        .post('/employees/check-out')
        .send(checkInData)
        .expect(400)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.text).to.be.a('string');
            expect(res.text).to.equal("Comment length shouldn't exceed 150 characters");
            done();
        });
    });

    it('Should successfully check out the employee', (done) => {
        const checkInData = {
            "employeeId": validID,
            "comment": ""
        };

        request(app)
        .post('/employees/check-out')
        .send(checkInData)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.text).to.be.a('string');
            expect(res.text).to.equal(`Successfully checked out employee ${validID}`);
            done();
        });
    });

    it('Should fail check out the same employee again', (done) => {
        const checkInData = {
            "employeeId": validID,
            "comment": ""
        };

        request(app)
        .post('/employees/check-out')
        .send(checkInData)
        .expect(409)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.text).to.be.a('string');
            expect(res.text).to.equal('This employee is not checked-in. Please check him in.');
            done();
        });
    });

    it('Should fail check in an ID that doesn\'t exist', (done) => {
        const checkInData = {
            "employeeId": fakeID,
            "comment": ""
        };

        request(app)
        .post('/employees/check-in')
        .send(checkInData)
        .expect(404)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.text).to.be.a('string');
            expect(res.text).to.equal('Employee ID invalid.');
            done();
        });
    });

    it('Should fail check out an ID that doesn\'t exist', (done) => {
        const checkInData = {
            "employeeId": fakeID,
            "comment": ""
        };

        request(app)
        .post('/employees/check-out')
        .send(checkInData)
        .expect(404)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.text).to.be.a('string');
            expect(res.text).to.equal('Employee ID invalid.');
            done();
        });
    });

    it('Should fail check in with a comment longer than 150 characters', (done) => {
        const checkInData = {
            "employeeId": validID,
            "comment": faker.string.alpha(151)
        };

        request(app)
        .post('/employees/check-in')
        .send(checkInData)
        .expect(400)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.text).to.be.a('string');
            expect(res.text).to.equal("Comment length shouldn't exceed 150 characters");
            done();
        });
    });  

});