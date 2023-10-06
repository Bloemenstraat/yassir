import chai from 'chai';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import app from '../src/index.js'; 

const expect = chai.expect;

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const employee = {
    lastName: lastName,
    firstName: firstName,
    department: 'HR'
};

describe('Employee creation tests', () => {

    it('Should successfully create an employee', (done) => {
        request(app)
        .post('/employees')
        .send(employee)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.text).to.be.a('string');
            expect(res.text).to.equal('Employee successfully created.');
            done();
        });
    });

    it('Should fail creating duplicate employee', (done) => {
        request(app)
        .post('/employees')
        .send(employee)
        .expect(409)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.text).to.be.a('string');
            expect(res.text).to.equal('First name and last name already in use.');
            done();
        });
    });

    it('Should fail creating employee with unvalid name', (done) => {
        request(app)
        .post('/employees')
        .send({
            lastName: 'bimo',
            firstName: 'lesquimo32',
            department: 'HR'
        })
        .expect(500)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.text).to.be.a('string');
            done();
        });
    });

});