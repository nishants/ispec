const util = require('util');
const client = require('../utils/http-client');

const compare = ({actual, expected}) => {
  const header = expected.headers ? util.isDeepStrictEqual(expected.headers, actual.headers) : true;
  const body = expected.body ? util.isDeepStrictEqual(expected.body, actual.body) : true;
  const status = typeof  expected.status !== 'undefined' ? expected.status === actual.status : true;

  return {
    success: header && body && status,
    header,
    body,
    status
  };
};

module.exports = {
  run: async (spec, ispec) => {
    const response = await client.request({
      ...spec.request,
      url: ispec.getUrl(spec.request.url)
    });

    const comparison = compare({actual: response, expected: spec.response});
    if(comparison.success){
      return {
        success: true
      };
    }

    const result = {
      success: false,
      expected : {},
      actual : {},
    };

    const addError = (field) => {
      if(!spec.response[field] || comparison[result]){
        return;
      }
      result.expected[field] = spec.response[field]
      result.actual[field] = response[field]
    };

    addError('headers');
    addError('status');
    addError('body');

    return {
      success: false,
      expected: JSON.stringify(result.expected) ,
      actual: JSON.stringify(result.actual),
    };
  }
}