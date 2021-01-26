const axios = require("axios");

module.exports = async (ispec) => {
  const url = ispec.getUrl('/get-token?user=guest&access=invitation');
  const response = await axios({url});

  const token = response.data.token;
  ispec.addVariable({guestToken: token});
};