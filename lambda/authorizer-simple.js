const jwt = require('jsonwebtoken');

module.exports.authorizedHandler = async (event, callback, context) => {
  let response = {
    errorType: 'Unauthorized',
    httpStatus: 403,
    requestId: context.awsRequestId,
  };

  if (event.headers['x-api-key'] === '1234') {
    response = {
      isAuthorized: true,
      context: {
        stringKey: 'value',
        numberKey: 1,
        booleanKey: true,
        arrayKey: ['value1', 'value2'],
        mapKey: { value1: 'value2' },
      },
    };
    return response;
  } else if (event.cookies['access_token']) {
    const token = jwt.verify(event.cookies['access_token'], '1234');
    response = {
      isAuthorized: true,
      context: {
        stringKey: 'value',
        numberKey: 1,
        booleanKey: true,
        arrayKey: ['value1', 'value2'],
        mapKey: { value1: 'value2' },
      },
    };
    return response;
  }

  return callback(JSON.stringify(response));
};
