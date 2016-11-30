'use strict';

const cluster = require('cluster');
const clusterNodeCache = require('cluster-node-cache');

const FIVE_MINUTES = 5 * 60;

class ClusterNodeCache {
  constructor(options) {
    options = options || {};
    this.expiration = options.expiration || FIVE_MINUTES;
    this.cacheKey = typeof options.cacheKey === 'function' ?
      options.cacheKey : (path) => `path=${path}`;
    this.cache = clusterNodeCache(cluster, { stdTTL: this.expiration });
  }

  fetch(path, request) {
    let key = this.cacheKey(path, request);
    return this.cache.get(key).then(r => r.value[key]);
  }

  put(path, body, response) {
    let request = response && response.req;
    let key = this.cacheKey(path, request);

    let statusCode = response && response.statusCode;
    let statusCodeStr = statusCode && (statusCode + '');

    if (statusCodeStr && statusCodeStr.length &&
       (statusCodeStr.charAt(0) === '4' || statusCodeStr.charAt(0) === '5')) {
      return new Promise((res, rej) => res());
      return;
    }

    return this.cache.set(key, body);
  }
}

module.exports = ClusterNodeCache;
