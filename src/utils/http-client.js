const axios = require('axios');

module.exports = {
  request: async ({url, method, headers, body}) => {
    try{
      const response =  await axios({
        url,
        method,
        headers,
        data: body
      });

      return response
    }catch(e){
      return e.response;
    }
  }
}