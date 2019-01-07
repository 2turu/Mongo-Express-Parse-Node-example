chai = require('chai');
expect = chai.expect;
sinon = require('sinon');
_ = require('underscore');
proxyquire = function(request, stubs) {
    return require('proxyquire')(`${request}`, stubs);
};

describe('locations tests', () => {
    let findStub = sinon.stub();
    let locationStub = sinon.stub();
    const parseMock = {
        Query: function() {
            return {
                find: findStub,
            };
        }
    }
    const locations = proxyquire('../../app_server/controllers/locations', {'parse/node': parseMock});
    let res = {};
    
    it('should have callback on valid query', (done) => {
        findStub.resolves({
            get: locationStub,
        });
        locationStub.withArgs('name').returns('name test');
        locations.homelist(null, res, () => {
            expect(res).to.be();
            done();
        });
    });
    it('should do x', (done) => {
        locations.homelist(null, res, () => {
            expect(res);
            done();
        });
    });
});
