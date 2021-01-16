const axios = require('axios');
const dataToBody = (response) => {
  response.body = response.data
  delete response.data;
  return response;
};

module.exports = {
  request: async ({url, method, headers, body}) => {
    try{
      const response =  await axios({
        url,
        method,
        headers,
        data: body
      });

      return dataToBody(response);
    }catch(e){
      return e.response ? dataToBody(e.response) : null;
    }
  }
}