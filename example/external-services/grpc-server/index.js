const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../../protos/stocks.proto');

const packageDefinition = loader.loadSync(
  PROTO_PATH,
  {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

const service = grpc.loadPackageDefinition(packageDefinition).prices.Stocks.service;
const GetPrice = async (call, callback) => {
  const {uic, field_ids} = call.request;
  callback(null, {
      uic,
      status : "ok",
      field_values: field_ids.map(f => 1.11),
      data_feed_error_text : null
    }
  );
};

var server = new grpc.Server();
server.addService(service, {GetPrice: GetPrice});
server.bindAsync(process.env.grpc_endpoint || '0.0.0.0:7903', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});

