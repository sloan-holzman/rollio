//TESTS REDIS CONFIG

//DEPENDENCIES
const chai                            = require('chai');
const expect                          = chai.expect;
const sinonChai                       = require('sinon-chai');
const sinonExpressMock                = require('sinon-express-mock');
const { mockReq, mockRes }            = sinonExpressMock;
const redisClient                     = require('../../../controllers/db/redis-config');
const { routeLimitVendorOp }          = require('../../../controllers/routes/middleware/rate-limit');

chai.use(sinonChai);

//YOU"RE NOT DOING THIS RIGHT. FIGURE OUTHOW TO MOCK THIS TEST AND RETURN 1 FOR THAT FUNCTIOn
//THEN FIGURE OUT HOW TO MAKE IT FAIL ONEC YOU DID TOO many
//AND FIGURE OUT HOW TO DEL REMOVE THAT DAMN ERROR


//TESTS
describe('Rate Limit Middleware', function() {
  const body = {
    method: 'testMethod',
    path: 'testPath',
    params: {
      regionID: 'testId',
      vendorID: 'testId'
    },
    connection: {
      remoteAddress: 'testIP:123'
    }
  }

  const key = `rl::method::${body.method}::path::${body.path}::regionID::${body.params.regionID}::vendorID::${body.params.vendorID}`;

  const req = mockReq(body);
  const res = mockRes();

  it('Expect routeLimitVendorOp to successfully add an IP to a path', async function() {
    const result = await routeLimitVendorOp(req, res);
    expect(result).to.be.equal(1);
  });

  it('Expect routeLimitVendorOp to fail to add the same IP to the same path', async function() {
    const resultFirst = await routeLimitVendorOp(req, res);
    const resultSecond = await routeLimitVendorOp(req, res);
    expect(resultFirst).to.be.equal(1);
    expect(resultSecond).to.be.equal(0);
  });

  it('Expect routeLimitVendorOp to successfully add two IPs to the same path', async function() {
    const req2 = mockReq({...body, connection: { remoteAddress: 'testIP:456'}});
    const resultFirst = await routeLimitVendorOp(req, res);
    const resultSecond = await routeLimitVendorOp(req2, res);
    expect(resultFirst).to.be.equal(1);
    expect(resultSecond).to.be.equal(1);
  });

  afterEach(function(done) {
    redisClient.del(key);
    done();
  });
});
