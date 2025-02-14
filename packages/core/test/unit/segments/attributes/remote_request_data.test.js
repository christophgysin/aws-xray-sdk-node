var assert = require('chai').assert;
var chai = require('chai');

var RemoteRequestData = require('../../../../lib/segments/attributes/remote_request_data');

chai.should();

describe('RemoteRequestData', function() {
  const defaultRequest = {
    agent: {
      protocol: 'https:'
    },
    getHeader: (key) => {
      if (key === 'host') {
        return 'host.com';
      }
      return undefined;
    },
    path: '/path/to/resource'
  };

  const defaultResponse = {
    statusCode: 200,
    headers: {
      'content-length': 10,
    }
  };

  var request = defaultRequest;
  var response = defaultResponse;

  this.beforeEach(function () {
    request = defaultRequest;
    response = defaultResponse;
  });

  describe('#constructor', function() {
    it('should mask out query string in path', function() {
      const requestWithPathQueryString = Object.assign(request, { path: '/path/to/resource?qs=qs' });
      
      assert.propertyVal(
        new RemoteRequestData(requestWithPathQueryString, response, true).request,
        'url',
        'https://host.com/path/to/resource'
      );
    });
    it('should return empty url if request agent is missing', function() {
      const requestWithoutAgent = {};
      
      assert.propertyVal(
        new RemoteRequestData(requestWithoutAgent, response, true).request,
        'url',
        ''
      );
    });
    it('should use the host from the request object over headers', () => {
      const requestWithHost = Object.assign(request, { host: 'different-site.com' });
      
      assert.propertyVal(
        new RemoteRequestData(requestWithHost, response, true).request,
        'url',
        'https://different-site.com/path/to/resource'
      );
    });
  });
});
