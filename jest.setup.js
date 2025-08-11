import '@testing-library/jest-dom';

// Mock Next.js server-side globals for testing
if (typeof global.Request === 'undefined') {
  global.Request = class MockRequest {
    constructor(input, init) {
      this.url = input;
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);
      this.body = init?.body;
    }
  };
}

if (typeof global.Response === 'undefined') {
  global.Response = class MockResponse {
    constructor(body, init) {
      this.body = body;
      this.status = init?.status || 200;
      this.statusText = init?.statusText || 'OK';
      this.headers = new Headers(init?.headers);
    }

    async json() {
      return JSON.parse(this.body);
    }
  };
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class MockHeaders {
    constructor(init) {
      this.data = new Map();
      if (init) {
        if (Array.isArray(init)) {
          init.forEach(([key, value]) => this.data.set(key.toLowerCase(), value));
        } else if (typeof init === 'object') {
          Object.entries(init).forEach(([key, value]) => this.data.set(key.toLowerCase(), value));
        }
      }
    }

    get(name) {
      return this.data.get(name.toLowerCase()) || null;
    }

    set(name, value) {
      this.data.set(name.toLowerCase(), value);
    }

    has(name) {
      return this.data.has(name.toLowerCase());
    }

    delete(name) {
      return this.data.delete(name.toLowerCase());
    }

    *[Symbol.iterator]() {
      for (const [key, value] of this.data) {
        yield [key, value];
      }
    }
  };
}