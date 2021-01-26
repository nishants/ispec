# iSpec

Data-driven specs for microservices.

Think of it like cucumber for API tests. While cucumber is great when the focus is user workflow, with iSpec the focus is on API input/output/external contracts.



### Why we created iSpec?

Usually, API tests are written by developers in the same language as they write code in (Java, Go, C#) using tools like junit, xunit etc. This makes tests non-readble for QAs, frontend developers, or developers who do not code in that language.

Also, the tests are mostly written with the objective of achieving regression rather than defining specs. The noise created by code makes it harder to read data or specs by looking at tests.

> iSpec approaches the test from the point of view of specs. Tests are written in request/response format. 
> We recommend the use of stubs and collectors to specify contracts with external components.

Some properties of tests written with iSpec : 

- Clear API contracts
- Extremely readable tests 
- Collaboration with devs/testers outside team (who don't code is the same language)
- Encourages to have the least logic in tests

- Using stubs and collectors, API contracts are specified with high readbility.



### Setup

```bash
npm install -g ispec
```



Now create a specs directory in your tests folder. E.g. `tests/specs`. Create tests and make sure the name ends with `.spec.yml` or `.spec.yaml`

```yaml
spec: {
  name: "Should return exchange rate for valid currency pair"
}

request: {
  url: "v1/exchangerates?CurrencyPair=USDINR"
}

response: {
  status: 200,
  body: { "ExchangeRate":73.1555 }
}
```

How run specs from cli:

```bash
ispec /path/to/specs/dir server=https://localhost:3000

# Found 1 spec.yml file in /path/to/specs/dir
# Passed : 1/1
```

In case of failures, you will see an output like : 

```diff
Found 7 spec.yml file in C:\Projects\Prices\e2e
Passed : 6/7
Failed : Should return exchange rate for valid currency pair
-"actual"
+"expected"

 {
   body: {
-    ExchangeRate: 73.1555
+    ConversionRate: 73.1555
   }
 }

Failed : 1/7
```

Click [here](./examples/grpc-nats-service/e2e) to view an example project



### Variables and templates

We can run some code, create a few variable and use them in tests. For e.g., if our request needs a token to authenticate themselves.

To create a variable, create a file named as `<name>.variable.js` in `scripts` dir next to specs.

```javascript
const axios = require("axios");

module.exports = async (ispec) => {
  const response = await axios({
    url: `${process.env.baseUrl}/get-token?user=guest&access=invitation`,
    method: 'GET'
  });

  const token = response.data.token;
  // (1) Set token as variable
  ispec.addVariable({guestToken: token});
};
```

Now, in our tests, we can use this token in the header as : 

```yaml
spec: {
  name: "Should return exchange rate for valid currency pair"
}

request: {
  url: "v1/exchangerates?CurrencyPair=USDINR",
  headers: {
    Authorization: "Bearer {{guestToken}}" # (2) Use token variable in requests
  }
}

response: {
  status: 200,
  body: { "ExchangeRate":73.1555 }
}
```

