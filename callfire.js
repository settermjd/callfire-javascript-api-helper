// Copyright Matthew Setter.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
/**
 * Required Imports
 */
var querystring = require('querystring'),
    https = require('https');

/**
 * This is a simple module for interacting with the CallFire API, made for 
 * use with the Node.js code samples in the new REST API documentation. 
 *
 * It's not designed to replace the official Node.js SDK, which can be found
 * at <https://github.com/CallFire/CallFire-NodeJS-SDK>, just to simplify
 * the example code provided.
 *
 * @type {{
 *    options: {host: string, path: string, query: string, auth: string},
 *    createEndpoint: Function,
 *    appendPath: Function,
 *    getRequest: Function
 * }}
 */
var callfire = {
    /**
     * A set of constants for specifying the request type
     */
    REQUEST_PUT: 'PUT',
    REQUEST_POST: 'POST',
    REQUEST_DELETE: 'DELETE',

    /**
     * Initially set debug to false
     */
    debug: false,

    /**
     * Core configuration options
     */
    options: {
        host: 'www.callfire.com',
        path: '/api/1.1/rest',
        auth: '',
        query: ''
    },

    /**
     * Build an endpoint based on the data supplied.
     *
     * @param data
     * @returns {string}
     */
    createEndpoint: function (data) {
        return '?' + querystring.stringify(data);
    },

    /**
     * Set the authentication credentials
     */
    setAuth: function (data) {
        this.options.auth = data.login + ':' + data.secret; 
    },

    /**
     * Set debugging to be true
     */
    enableDebugging: function () {
        this.debug = true; 
    },

    /**
     * Add the path suffix to the existing REST URI/Path
     *
     * @param pathSuffix
     */
    appendPath: function (pathSuffix) {
        this.options.path += pathSuffix
    },

    /**
     * Make a GET request to the CallFire API
     *
     * @param data
     */
    getRequest: function (data) {
        var req = https.get(this.options, function (res) {
            res.on('data', function (d) {
                var headers = res.headers;
                process.stdout.write(d);
            });
        }).on('error', function (e) {
            console.error(e);
        });

        req.end();
    },

    /**
     * Make a GET request to the CallFire API
     *
     * @param {array} data The request arguments
     * @param {string} requestType - The type of request to make. Can be GET, POST, PUT, or DELETE
     */
    makeRequest: function (data, requestType) {
        if (this.options.auth === '') {
          throw new Error('Authentication options not set');
        }

        // Provide a default value for requestType
        requestType = typeof requestType !== 'undefined' ? requestType : 'GET';

        if (requestType === 'GET') {
            this.options.path += this.createEndpoint(data);
            this.getRequest(data);
        } else {
            this.options.method = requestType;
            this.addFormHeaders(data);
            this._request(data);
        }

    },

    /**
     * Make a request of any type
     *
     * @param {array} data The request arguments
     * @private
     */
    _request: function (data) {
        var that = this;
        var req = https.request(this.options, function (res) {
            res.setEncoding('utf8');
            // Only add the data, if there's data to add
            if (Object.keys(data).length !== 0) {
                res.on('data', function (d) {
                    process.stdout.write(d);
                });
            }
            var headers = res.headers;
            console.log("Request is: " + that.options.method);
            console.log('HTTP/1.1 ' + res.statusCode);
            console.log('Content-Type: ' + headers['content-type']);
        }).on('error', function(e) {
            console.error(e);
        });

        if (Object.keys(data).length !== 0) {
            // write the post data to the request
            req.write(querystring.stringify(data));
        }

        // end the request
        req.end();
    },

    /**
     * Add headers required for a POST, PUT, or DELETE request
     *
     * @param data
     */
    addFormHeaders: function (data) {
        this.options.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': querystring.stringify(data).length
        }
    }
};

module.exports = callfire;
