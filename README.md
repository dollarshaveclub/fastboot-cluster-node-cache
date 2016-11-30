## FastBoot Cluster Node Cache

This cache for the [FastBoot App Server][app-server] utilizes
[cluster-node-cache](cluster-node-cache) to cache the results
of rendered FastBoot pages.

[app-server]: https://github.com/ember-fastboot/fastboot-app-server
[cluster-node-cache]: https://www.npmjs.com/package/cluster-node-cache

To use this cache:

```js
const FastBootAppServer = require('fastboot-app-server');
const ClusterNodeCache = require('fastboot-cluster-node-cache');

let cache = new ClusterNodeCache();

let server = new FastBootAppServer({
  cache: cache,
  expiration: 60 // optional, defaults to 5 min.
});
```

Additionally, if you would like your cache key to vary based on
information in the request (like headers), you can
provide a `cacheKey(path, request)` function that takes in as
parameters the path being requested and the request object.

```js
let cache = new ClusterNodeCache({
  cacheKey(path, request) {
    return `${path}_${request && request.cookies && request.cookies.chocolateChip}`;
  }
});
```
