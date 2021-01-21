const express = require('express')

const endpoints = [
  require('./endpoints/auth-request'),
  require('./endpoints/token-request'),
  require('./endpoints/prices/price-subscription'),
  require('./endpoints/prices/get-single-price'),
  require('./endpoints/nats/ping'),
  require('./endpoints/nats/publish')
];

const app = express();
app.use(express.json());
const port = 3123;

app.get('/', (req, res) => {
  res.send('ready');
});

endpoints.forEach(endpoint => endpoint(app));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});