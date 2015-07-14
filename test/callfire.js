var should = require('chai').should(),
    expect = require('chai').expect,
    callfire = require('../callfire.js'),
    querystring = require('querystring'),
    https = require('https');

var data  = {
  MaxResults: 10,
  FromNumber: '2092084589',
  ToNumber: '2092084589',
  LabelName: 'TestBroadcast',
  State: 'FINISHED'
};

describe('#escape', function() {

  it('Correctly sets the request path', function() {
    // Query parameters
    callfire.appendPath('/call/');
    callfire.options.path.should.equal('/api/1.1/rest/call/');
  });

  it('Correctly enables debugging', function() {
    callfire.debug.should.equal(false);
    callfire.enableDebugging();
    callfire.debug.should.equal(true);
  });

  it('Correctly creates an endpoint', function() {
    var endpoint = callfire.createEndpoint(data);
    endpoint.should.equal('?MaxResults=10&FromNumber=2092084589&ToNumber=2092084589&LabelName=TestBroadcast&State=FINISHED');
  });

  it('Correctly sets form headers', function() {
    callfire.addFormHeaders(data);

    var contentTypeHeader = callfire.options.headers['Content-Type'];
    var contentLengthHeader = callfire.options.headers['Content-Length'];

    contentTypeHeader.should.equal('application/x-www-form-urlencoded');
    contentLengthHeader.should.equal(querystring.stringify(data).length);
  });

  it('Throws exception if auth headers are not set', function() {
      callfire.appendPath('/call/');
      expect(function () { callfire.makeRequest(data, 'GET') }).to.throw(Error);
  });

  it('Correctly sets authentication headers', function() {
      var authData = {
          'login': 'SECRET_LOGIN',
          'secret': 'BIG_SECRET'
      };

      callfire.setAuth(authData);
      callfire.options.auth.should.equal('SECRET_LOGIN:BIG_SECRET');
  });

});
