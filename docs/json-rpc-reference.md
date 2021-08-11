# RPC API Reference

## ping

Ping the API, just to make sure everything works.

* Method: `ping`
* Params: None
* Result: `pong`

```js
// >>> Example Request
{
    "jsonrpc": "2.0",
    "method": "ping",
    "params": {},
    "id": 1
}

// <<< Example Response
{
    "jsonrpc": "2.0",
    "result": "pong",
    "id": 1
}
```

## createMonitor

Create a new monitor along with email alert.

* Method: `createMonitor`
* Params:
  * name (string, required): Display name of the monitor
  * url (string, required): URL to check
  * alertEmail (string, required): Email to notify when the monitor is down
  * checkIntervalInSeconds (number, required): Check interval in seconds, must be greater or equal to 30
* Result:
  * id (string, required): Newly created Monitor ID

```js
// >>> Example Request
{
    "jsonrpc": "2.0",
    "method": "createMonitor",
    "params": {
        "name": "Personal Blog",
        "url": "https://blog.junzheng.dev",
        "alertEmail": "me@junzheng.dev",
        "checkIntervalInSeconds": 60
    },
    "id": 1
}

// <<< Example Response
{
    "jsonrpc": "2.0",
    "result": {
        "id": "m_y_JTXQrgvubpWb4Mcsxmw"
    },
    "id": 1
}
```
