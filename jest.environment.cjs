/**
 * Custom jsdom environment que inyecta el fetch nativo de Node 18 en el
 * sandbox de jsdom, necesario para que MSW pueda interceptar requests.
 */
const JSDOMEnvironment = require('jest-environment-jsdom').default;

class CustomJSDOMEnvironment extends JSDOMEnvironment {
  async setup() {
    await super.setup();
    // MSW v1 usa @mswjs/interceptors que parchea el módulo http/https de Node.
    // node-fetch v2 (dependencia transitiva de MSW) construye sobre http/https,
    // por lo que sus requests son interceptadas por MSW.
    // Node 18's native fetch NO es interceptada por MSW v1 → usamos node-fetch.
    const nodeFetch = require('node-fetch');
    this.global.fetch = nodeFetch.default;
    this.global.Request = nodeFetch.Request;
    this.global.Response = nodeFetch.Response;
    this.global.Headers = nodeFetch.Headers;
  }
}

module.exports = CustomJSDOMEnvironment;
