// Generated by CoffeeScript 1.7.1
var Client, exports, request, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

request = require('request');

_ = require('underscore');

Client = (function() {
  function Client(sslopts) {
    this.sslopts = sslopts;
    this._handleRedirect = __bind(this._handleRedirect, this);
    this["delete"] = __bind(this["delete"], this);
    this.patch = __bind(this.patch, this);
    this.post = __bind(this.post, this);
    this.get = __bind(this.get, this);
    this.put = __bind(this.put, this);
    this.execute = __bind(this.execute, this);
  }

  Client.prototype.execute = function(method, options, callback) {
    options = _.clone(options);
    options.method = method;
    options.pool = {
      maxSockets: 100
    };
    return request(options, (function(_this) {
      return function(err, resp, body) {
        if (_this._wasRedirected(resp)) {
          return _this._handleRedirect(method, resp.headers.location, options, callback);
        } else {
          return _this._handleResponse(err, resp, body, callback);
        }
      };
    })(this));
  };

  Client.prototype.put = function(options, callback) {
    return this.execute("PUT", options, callback);
  };

  Client.prototype.get = function(options, callback) {
    return this.execute("GET", options, callback);
  };

  Client.prototype.post = function(options, callback) {
    return this.execute("POST", options, callback);
  };

  Client.prototype.patch = function(options, callback) {
    return this.execute("PATCH", options, callback);
  };

  Client.prototype["delete"] = function(options, callback) {
    return this.execute("DELETE", options, callback);
  };

  Client.prototype._wasRedirected = function(resp) {
    var _ref;
    return ((resp != null ? resp.statusCode : void 0) != null) && resp.statusCode === 307 && ((resp != null ? (_ref = resp.headers) != null ? _ref.location : void 0 : void 0) != null);
  };

  Client.prototype._handleRedirect = function(method, redirectURL, options, callback) {
    var opt;
    opt = _.clone(options);
    opt.url = redirectURL;
    return this.execute(method, opt, callback);
  };

  Client.prototype._handleResponse = function(err, resp, body, callback) {
    var error;
    if (callback == null) {
      return;
    }
    if ((body != null ? body.errorCode : void 0) != null) {
      error = new Error((body != null ? body.message : void 0) || 'Etcd error');
      error.errorCode = body.errorCode;
      error.error = body;
      return callback(error, "", (resp != null ? resp.headers : void 0) || {});
    } else if (err != null) {
      error = new Error('HTTP error');
      error.error = err;
      return callback(error, null, (resp != null ? resp.headers : void 0) || {});
    } else {
      return callback(null, body, (resp != null ? resp.headers : void 0) || {});
    }
  };

  return Client;

})();

exports = module.exports = Client;