# HTTP Moxy (WIP)

> A light mock http proxy supporting your E2E automation test to mock external dependencies through an http_proxy (inspired by https://httpdump.io)

## Description

### What is the problem we try to solve ?

Test automation are great, we all love it. However nowaday we all relay a lof on Saas services to extend our business or fasten our delivery (ex: google map, firebase, twilio)
From a development perspective those tool are awesome, from a test perspective... It's another challenge to test the E2E product...
We all know that dependencies are the real challenge on E2E tests.

This is where **HTTP MOXY** comes into the picture.

**Http Moxy** is just a simple http proxy __BUT__ it provides an ability to mock the http request.

The Http Moxy tool is born from understanding that external dependencies are not a part of our scope... They supposed to have their own End to End test, **however** it's a part of our scope to test the mapping from our business object to the external object.
Luckely **Rest APIs** are now a key standard to connect 2 systems together. Then the http moxy is borned.
Example:
* We have a nice api from our backend that send sms through the api `POST /api/send/sms` with a simple body containing the message
* The backend has a dependency with the sms provider, throught the send api service `POST http://sms-provider.test/sendSms` but it's not rest
* *What we want to test is that our backend translates properly the calls from `POST /api/send/sms` to `POST http://sms-provider.test/sendSms`*

### How does it works ?

The concept relies on the (https://microservices.io/patterns/observability/distributed-tracing.html)[Distributed tracing], each request has a tracable id that we can follow across the system...
Once we understand the concept, we can see that have the ability to trace each request through a unique identifier. And this is exactly what we want to identify when we are running a test, we want to mock the response of the external dependency for happy and unhappy scenario.

### Getting started

#### Installation

Installing the **http moxy** requires 2 steps:
 * Deploy the http moxy in your infrastructure or use the Saas version (https://moxy.restqa.io)
 * Set then `http_proxy` and `https_proxy` environment variable to the moxy server into your microservice
   * export `http_proxy=http://url-of-your-just-deployed-moxy-server` in case you deploy your own moxy
   * export `https_proxy=https://moxy.restqa.io` in case you use the saas version

Don't forget to set both of them : `http_proxy` and `https_proxy`


#### Usage

Moxy shares on 2 endpoints:
  * `/_/{request id}` (POST) : To create a mock related to a request id
  * `/_/{request id}` (GET) : To inspect a mock related to a request id

### The mock endpoint

The mock endpoint has only one  mandatory parameter:
  * `x-request-id` in the header

Now let's get into the real use case...


We have the following Gherkin test:

```
Given the backend api gateway
When i call the api POST /api/send/message
  And the request body is "hello world"
Then the status response is 200
```

It is a  nice test but we don't have any view of our the dependency interface.

With moxy we can propose to write a use test like :

```
Given the backend api gateway
  And mock the request to POST https://my-sms-provider/sendSMS to response 200
When i call the api POST /api/send/message
  And the request body is "hello world"
Then the status response is 200
  And the mock get call with the request body '{ "my-message": "hello world"}'
```

Alright then under the wood, what is happening ?

In fact the only pre-requisite is to generate your own request id.
In our example the request Id of our test will be `test-e2e-xxx-yyy-zzz`

Then during the test step `And mock the request to POST https://my-sms-provider/sendSMS to response 200`, the code will ask to moxy the create a now mock by using the following api:

```
curl -X POST \
  -H 'content-type: application/json` \
  -d '{
    "mock" : {
      "status": 200,
      "headers": {
        "powered-by": "express"
      },
      "body": "OK"
    }
  }' \
  https://moxy.restqa.io/_/test-e2e-xxx-yyy-zzz
```

The translation is simple we ask to create a mock for the request `test-e2e-xxx-yyy-zzz` with the response :
  * status: 200
  * headers : powered-by : "express"
  * body: "OK"

Yes you just understand all you need to do is to connect a mock to a request id...

**However you need to ensure that your microservice add the `request-id` into the request headers otherwise moxy won't be able to mock the request**

Afterwards to access to the result related to the test step `And the mock get call with the request body '{ "my-message": "hello world"}'`

You will need to call get endpoint

```
curl -X GET https://moxy.restqa.io/_/test-e2e-xxx-yyy-zzz'
```

and get the  response:

```
{
  "request": {
    "path": "/sms/send",
    "headers": {
      "content-type": "application/x-www-form-urlencoded",
      "request-id": "e2e-test-q3ke0dl-oekjd-ww"
    }
    "body": {
      "my-message": "hello world"
    }
  },
  "mock" : {
    "status": 200,
    "headers": {
      "powered-by": "express"
    },
    "body": "OK"
  }
}
```

You will have all element to know exactly what are the information that our internal microservice try to share with the external service.

### Data persistancy

TODO

### Distributed

TODO

### Monitoring Dashboard

TODO








## How to use


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
```

## Getting started




