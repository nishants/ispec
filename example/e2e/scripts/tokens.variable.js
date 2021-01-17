const axios = require("axios");

module.exports = async (ispec) => {
  const response = await axios({
    url: 'http://localhost:3123/get-token?user=guest&access=invitation',
    method: 'GET'
  });

  const token = response.data.token;
  ispec.addVariable({guestToken: token});
};