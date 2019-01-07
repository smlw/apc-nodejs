const app = require('./helpers/app');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Register new application', () => {

    it('It expect register app page have status 200', () => {
        chai.request(app)
        .get('/app/add')
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
        });
    });

    describe('Validation url. First step of register app', () => {
        const isValidUrl = (url) => {
            const regex = /http(?:s?):\/\/([\w]+\.{1}[\w]+\.?[\w]+)+/g;
            const occurrence = url.match(regex);
            return (regex.test(url)) && (url === occurrence[0]);
        }

        describe('It should be valid.', () => {
            it('Urls will be true', (done) => {
                expect( isValidUrl('http://test.ru') ).to.be.true;
                expect( isValidUrl('http://test.ru') ).to.be.true;
                expect( isValidUrl('https://test.ru') ).to.be.true;
                expect( isValidUrl('https://test.ru.com') ).to.be.true;
                expect( isValidUrl('https://test.ru.org') ).to.be.true;
                done();
            });
    
            it('Urls will be false', (done) => {
                expect(isValidUrl('http://test.ru/')).to.be.false;
                expect(isValidUrl('https://test.ru/')).to.be.false;
                expect(isValidUrl('http//test.ru')).to.be.false;
                expect(isValidUrl('ttp://test.ru')).to.be.false;
                expect(isValidUrl('tp://test.ru')).to.be.false;
                expect(isValidUrl('p://test.ru')).to.be.false;
                expect(isValidUrl('://test.ru')).to.be.false;
                expect(isValidUrl('//test.ru')).to.be.false;
                expect(isValidUrl('/test.ru')).to.be.false;
                expect(isValidUrl('test.ru')).to.be.false;
                expect(isValidUrl('http://test.')).to.be.false;
                expect(isValidUrl('http://test')).to.be.false;
                expect(isValidUrl('http://')).to.be.false;
                expect(isValidUrl('http://string&mail.ru')).to.be.false;
                expect(isValidUrl('')).to.be.false;
                done();
            });
        })
        
        describe('It should be equals.', () => {
            it('Urls will be false', (done) => {
                expect(isValidUrl(' sad http://test.ru dasdas')).to.be.false;
                expect(isValidUrl(' http://test.ru')).to.be.false;
                expect(isValidUrl('http://test.ru ')).to.be.false;
                expect(isValidUrl('http://test.ru ')).to.be.false;
                expect(isValidUrl('string http//test.ru ')).to.be.false;
                expect(isValidUrl('http//test.ru string')).to.be.false;
                expect(isValidUrl('string http//test.ru string')).to.be.false;
                done()
            });
        })

        describe('It should be one occurrence', () => {
            it('Urls will be false', (done) => {
                expect(isValidUrl(' http://test.ru http://test.ru')).to.be.false;
                expect(isValidUrl('http://test.ruhttp://test.ru')).to.be.false;
                expect(isValidUrl('http://test.ruhtts://test.ru')).to.be.false;
                expect(isValidUrl('http://test.ru https://test.ru')).to.be.false;
                expect(isValidUrl('http://test.ru https://test.ruhttp://test.ruhttp://test.ru')).to.be.false;
                done()
            });
        })

    })
});