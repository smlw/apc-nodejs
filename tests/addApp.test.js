const app = require('./helpers/app');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

let url = 'http://joomla.ru';

describe('Register new application', () => {
    describe('It expect url status 200', (done) => {
        chai.request(app)
        .post('/app/add/url')
        .send(url)
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done()
        });
    })
});