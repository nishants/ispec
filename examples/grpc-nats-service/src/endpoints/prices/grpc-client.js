const path = require('path');
const loader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const PROTO_PATH = path.join(__dirname, '../../../protos/stocks.proto');
const packageDefinition = loader.loadSync(
  PROTO_PATH,
  {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

const service = grpc.loadPackageDefinition(packageDefinition).prices.Stocks;
const client = new service(process.env.grpc_endpoint || '0.0.0.0:7903', grpc.credentials.createInsecure());

module.exports = {
  getPrice: (request) => {
    return new Promise((resolve, reject) => {
      client.GetPrice(request, (error, response) => error ? reject(error) : resolve(response));
    });
  }
};