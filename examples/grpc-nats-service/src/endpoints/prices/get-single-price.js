const auth = require('../auth');
const client = require('./grpc-client');

module.exports = (app) => {
  app.get('/prices', auth, async (request, response) => {

    const {Uic, AssetType} = request.query;

    const grpcRequest = {
      uic: Uic,
      field_ids: [
        "MID", "ASK", "BID"
      ]
    };

    const grpcResponse = await client.getPrice(grpcRequest);

    if(grpcResponse.data_feed_error_text.length > 0){
      return response.status(500).send({error: grpcResponse.data_feed_error_text});
    }

    const responseBody = {
      AssetType,
      Quote: {
        "Mid": grpcResponse.field_values[0],
        "Ask": grpcResponse.field_values[1],
        "Bid": grpcResponse.field_values[2],
      },
      Uic: parseInt(Uic)
    };
    return response.status(200).send(responseBody);
  });
};