# E2E Mock Server

> A light mock server, meant to mock external dependencies to support the Quality Assurance (inspired by https://httpdump.io)

# Description

As you know each system has external dependencies such as saas tools (example: sms provider, notification provider) or internal backend system...
And one of the key in test  automation is to know is to test that the interface with those external dependencies has been respected...
Let's take the example of a sms provider, our responsibility is to test that the integration has been properly on our side, we can't really test the all end to end because the SMS provider doesn't provide a playground (each sms sent is charged)
It means in our test environement we will just test that we car calling the SMS provider API with the right request header and request body...
This is wheret **E2E Mock Server** helps to solve the problem... To understand the benefit of the tool, you need to have an understanding of QA automation and microservice request Id.
The tool is will be deployed in your test environment then it will be used by the :
  * your business microservice to replace the url of external dependencies
  * your test automation tool to check the resquest information sent by the different microservice

## How to use

The E2E Mock Server shares on 2 endpoints:
  * `/` (all methods) : The mock endpoint
  * `/_/{request id}` (GET) : The inspect endpoint

### The mock endpoint

The mock endpoint has only one  mandatory parameter:
  * `x-request-id` in the header

Example:

Let assume our mock server is deploy on our kubernetes farm. (internal url  : mock.default.svc.cluster.local)
We are simulating a call coming from our microservice
```
curl -X POST  \
  -H 'request-id: e2e-test-q3ke0dl-oekjd-ww' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'key=xxx-yyy-zzz' \ 
  -d 'message=hello world' \ 
  http://mock.default.svc.cluster.local/sms/send
```

As you saw the request id is `e2e-test-q3ke0dl-oekjd-ww` this will be the reference we will need in order to use the inspect endpoint.

### The inspect endpoint

Once the mock server has been used by microservices we will want to know what are the informations that has been sent...

To inspect the request `e2e-test-q3ke0dl-oekjd-ww` we will do: 

```
curl -X GET http://mock.default.svc.cluster.local/_/e2e-test-q3ke0dl-oekjd-ww'
```

and get the following response:

```
{
  "path": "/sms/send",
  "headers": {
    "content-type": "application/x-www-form-urlencoded",
    "request-id": "e2e-test-q3ke0dl-oekjd-ww"
  }
  "body": {
    ...
  }
}
```

## Getting started




