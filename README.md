

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ docker-compose up -d // to start redis
$ npm run start
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

```

Credentials for the endpoint should be configured at src/config/default.config.test or by using environemnt variables STUB_USERNAME STUB_PASSWORD

The application will launch at http://localhost:3000/ , the endpoint that exposes the flights is http://localhost:3000/flights and accepts ?flight and ?deoarture as query parameters

There's also a swagger interface at http://localhost:3000/swagger

Redis is needed to run the whole application.



## Have Fun :)