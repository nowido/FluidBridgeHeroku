# FluidBridge

## Introduction

**FluidBridge** is *webhook* bridge into [**FluidSync**](https://github.com/nowido/FluidSyncHeroku). It is Node.js project hosted on Heroku platform.

**FluidBridge** allows to dispatch web requests into **FluidSync** *publish* actions.

## Why Heroku?

[Heroku](https://www.heroku.com) grants a generous free hosting. Verified accounts (credit card needed) get 1000 monthly *dyno* hours for absolutely free. So, **FluidBridge** service runs 24 hours a day, accessible all over the world.

## FluidBridge usage

**FluidBridge** supports `GET` requests in a form 
```
https://fluidbridge.herokuapp.com/<channel>?<anything>
```

where `<channel>` is an arbitrary string containing no `‘?’` symbols, and `<anything>` is an arbitrary string.

For above request, **FluidBridge** emits **FluidSync** *publish* action:

```
fluidsync.emit('publish', {
    channel: <channel>,
    from: 'webhook',
    payload: {
        method: req.method, 
        url: /<channel>?<anything>, 
        headers: req.headers
    }
});
```

At present, **FluidBridge** doesn’t support HTTP methods other than GET.

## FluidBridge service is lightweight and almost stateless

**FluidBridge** supports no validation of request url content, except of non-zero `<channel>` length, and `‘?’` symbol presence. You have to implement your own protocol over this service. 
