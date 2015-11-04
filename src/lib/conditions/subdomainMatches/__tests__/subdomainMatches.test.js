'use strict';

var mockDocument = {
  location: {
    hostname: 'foo.adobe.com'
  }
};

var conditionDelegateInjector = require('inject!../subdomainMatches');
var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch'),
  document: mockDocument
});

describe('subdomain matches condition delegate', function() {
  it('returns true when the subdomain matches an acceptable string', function() {
    var config = { subdomains: ['basketball.espn.com', 'foo.adobe.com'] };
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the subdomain does not match an acceptable string', function() {
    var config = { subdomains: ['basketball.espn.com', 'my.yahoo.com'] };
    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when the subdomain matches an acceptable regex', function() {
    var config = { subdomains: ['basketball.espn.com', /f.o\.adobe\.com/i] };
    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the subdomain does not match an acceptable regex', function() {
    var config = { subdomains: ['basketball.espn.com', /my\.yahoo\.com/i] };
    expect(conditionDelegate(config)).toBe(false);
  });
});
