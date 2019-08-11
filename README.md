# mock-server

- a mock HTTP server for development that maps a request path to a local file.
- routing rule can contain request query string.

## usage

1. edit `routes.json` which maps a request path and its query to a file of response body.
1. place a file for the response body to `public` dir.
1. `npm run serve` then start a http server listening 8000 port.

