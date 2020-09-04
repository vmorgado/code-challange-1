export default () => ({
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT, 10) || 3000,
  httpTimeout: parseInt(process.env.HTTP_TIMEOUT) || 10000,
  httpMaxRedirects: parseInt(process.env.HTTP_MAX_REDIRECTS) || 3,
  stubs: {
    urls: [
      'https://discovery-stub.comtravo.com/source1',
      'https://discovery-stub.comtravo.com/source2',
    ],
    auth: {
      username: process.env.STUB_USERNAME || '',
      password: process.env.STUB_PASSWORD || '',
    }
  },
  redis: {
    config: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    },
    memory: {
      prefix: 'memory',
      ttl: 3600,
    },
    cache: {
      prefix: 'cache',
      ttl: 60,
    }
  },
});