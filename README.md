# HTTP Moxy (WIP)

> A light mock http proxy tool to support your End to End automation test. The best way to  mock thrid parties API dependencies (inspired by https://httpdump.io)

## Description

### What is the problem we try to solve ?

Test automation is the key component of quality software, we all love it. However nowaday we relay more and more on Saas services to fasten our product delivery (ex: google map, firebase, twilio, etc...)
From a development perspective if feels good to use reliable services, but from a test automation perspective... This is where the headach starts.

**External dependencies are the main Pain in the a\**  of E2E automation test  !!!**

This is how  **HTTP MOXY** starts growing in our mind... We had to solve this remaining pain because it will just increase with the time.

Basically **Http Moxy** is just a simple http proxy on Steroid, It provides the ability to :
  * listen to passing http request
  * Mock any http response

And the best is that as a http proxy, *Moxy* doesn't bring any changes into the way software engineers are coding.

### Fundamentals

**Http Moxy** is born from the insight that as my test automation project,  i believe that external dependencies are not a part of my scope... Why should i test an external service (i believe the third party provider should have their own End to End test)
**However** it's a part of my scope to test the mapping from my business object to this external interface.

Luckely in 2020 **Rest API** is a key standard to connect 2 systems.

After a few days of brainstorming **http moxy** was borned, based on [anyproxy](http://anyproxy.io) from alibaba. *Http Moxy**  will serve you as middle man between between 2 systems to listen and mock the response from the external party.


### How does it works ?

The concept relies on the [Distributed tracing](https://microservices.io/patterns/observability/distributed-tracing.html), each request has a tracable id that we can follow across the system...
By having the ability to trace each request through a unique identifier, we can also refer to that same Id to mock the response of the external dependency for happy and unhappy scenario.

### Getting started

#### Installation

Installing the **http moxy** requires 2 steps:
 * Deploy the http moxy in your infrastructure or use the Saas version (https://moxy.restqa.io)
 * Inside the microservice that needs to connect an external service, set the proxies environment variable to point to the moxy server
   * `export http_proxy=http://url-of-your-just-deployed-moxy-server:8080` in case you deploy your own moxy
   * `export https_proxy=https://moxy.restqa.io` in case you want to use the saas version

Don't forget to set both of them : `http_proxy` and `https_proxy`

#### Usage

#### Ports

The service is exposing 2 ports:
  - 8080 the proxy port, you can configure it by setting up the `PROXY_PORT` environment variable
  - 8000 the admin port, you can configure it by setting up the `ADMIN_PORT` environment variable

Moxy shares on 2 endpoints into the admin endpoint:
  * `http://url-of-your-just-deployed-moxy-server:8080/requests/{request id}` (POST) : To create a mock related to a request id
  * `http://url-of-your-just-deployed-moxy-server:8080/requests/{request id}` (GET) : To inspect a request related to a request id

#### Create a mock endpoint (POST /requests/:id)

in the following use case we want to mock the response from our sms provider for unhappy scenarios

We will call:

```
curl --request POST \
  --url http://url-of-your-just-deployed-moxy-server:8000/requests/test-e2e-xxx-yyy-zzz \
  --header 'content-type: application/json' \
  --data '{
	  "mock": {
	  	"statusCode": 404,
	  	"header": {
	  		"Content-Type": "application/json"
	  	},
	  	"body": {
        "message": "The phone number needs to be defined"
      }
	  }
  }'
```

In the previous request the key informations are:
  * We are creating a mock for a future request. This request will need to include the `x-request-id: test-e2e-xxx-yyy-zzz` in the request header to be catched by the mock
  * The mock will repond with a 404 status code and a specific json response body
  
#### Using the Proxy

Once you will run your test, you will need to be sure the request Id : test-e2e-xxx-yyy-zzz, has been set in the request header of every transaction in your system to be sure that the **Moxy** can catch it.

Example if i call directly the sms provider:
```
curl 'https://my-sms-provider.com/send/message' \ 
  -X POST \
  -H 'Host: my-sms-provider.com' \
  -H 'Accept: */*' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -H 'request-id: test-e2e-xxx-yyy-zzz' \
  -H 'Content-Length: 32' \
  -d 'ACCOUNT=ww&PASSWORD=ww&OPTION=ww' 
  -k  \
  -x http://url-of-your-just-deployed-moxy-server:8080
```


#### Inspect request endpoint (GET /requests/:id)
 
On we catched a request after running our tests, we will want to inspect the request by using the same request id (in our case test-e2e-xxx-yyy-zzz)

```
curl --request GET \
  --url http://url-of-your-just-deployed-moxy-server:8000/requests/test-e2e-xxx-yyy-zzz
```

And the response will look like:

```
{
  "id": "test-e2e-xxx-yyy-zzz",
  "method": "POST",
  "url": "my-sms-provider.com",
  "path": "/send/message",
  "headers": {
    "Host": "my-sms-provider.com",
    "User-Agent": "curl/7.64.1",
    "Accept": "*/*",
    "Cookie": "JSESSIONID=EB87299D9439D54FE71A7B5EBBF9FE8B; __cfduid=d72c2f067e0b9024049b8bbe48a7f28be1581260566",
    "content-type": "application/x-www-form-urlencoded",
    "x-request-id": "test-e2e-xxx-yyy-zzz",
    "Content-Length": "32"
  },
  "body": "ACCOUNT=ww&PASSWORD=ww&OPTION=ww",
  "mock": {
	  "statusCode": 404,
	  "header": {
	  	"Content-Type": "application/json"
	  },
	  "body": {
      "message": "The phone number needs to be defined"
    }
  }
}
```

Here as you can see you will have all the request information available.

All you need to do is to connect a mock to a request id...

**Don't foprget you need to ensure that your microservice add the `x-request-id` into the request headers otherwise moxy won't be able to mock the request**

### Important to Know

* If you don't mock some request **Moxy** will just forward the request to the expected target
* **Moxy** is Acting as a **MAN IN THE MIDDLE** so do not deploy it in PRODUCTION... 
* A self certification is created by **Moxy** so you will need to ignore the ignore invalid self-signed ssl certificate

### Data persistancy

TODO 

### Distributed

TODO

### Monitoring Dashboard

You can access to a monitoring dashboard through the admin URL  on the port 8000 (default)

