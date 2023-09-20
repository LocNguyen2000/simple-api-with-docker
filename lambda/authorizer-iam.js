const jwt = require('jsonwebtoken');

function generatePolicyDocument(state, event) {
  let policyDocument = {};
  switch (state) {
    case 'Allow': {
      policyDocument = {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.routeArn,
          },
        ],
      };
      break;
    }
    case 'Deny': {
      policyDocument = {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: event.routeArn,
          },
        ],
      };
      break;
    }
    default: {
      policyDocument = {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Forbiden',
            Resource: event.routeArn,
          },
        ],
      };
      break;
    }
  }
  return policyDocument;
}

module.exports.authorizedHandler = async (event, callback, context) => {
  console.log('event >', event);

  let response = {};

  if (event.headers['x-api-key'] === 'x-api-key') {
    response = {
      ...generatePolicyDocument('Allow', event),
      context: {
        user: {
          name: 'Lucas Nguyen',
        },
      },
    };
  } else if (event.cookies['access_token']) {
    const token = jwt.verify(event.cookies['access_token'], '1234');
    response = {
      ...generatePolicyDocument('Allow', event),
      context: {
        stringKey: 'value',
        numberKey: 1,
        booleanKey: true,
        arrayKey: ['value1', 'value2'],
        mapKey: { value1: 'value2' },
      },
    };
  }

  return generatePolicyDocument('Deny', event);
};
