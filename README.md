# callfire-javascript-api-helper

This is a simple module for interacting with the CallFire API, made for
use with the Node.js code samples in the new REST API documentation. It's not designed to replace the official Node.js SDK, which can be found
at <https://github.com/CallFire/CallFire-NodeJS-SDK>, just to simplify
the example code provided.

## Installation

`npm install git@github.com:settermjd/callfire-javascript-api-helper.git`

## Usage

```javascript
var callfire = require('../callfire');

// Query parameters
var data  = {
    MaxResults: 10,
    FromNumber: '2092084589',
    ToNumber: '2092084589',
    LabelName: 'TestBroadcast',
    State: 'FINISHED'
};
callfire.setAuth({
    login: 'YOUR_LOGIN',
    secret: 'YOUR_SECRET'
});
callfire.appendPath('/call/');
callfire.makeRequest(data, 'GET');

```

## Tests

`npm test`

## Release History

- 0.0.1 Initial release


