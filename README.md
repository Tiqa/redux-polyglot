# AT Tracker

Toolset (actions, middleware, enhancer, component and helpers) to integrate effortlessly AT Internet's Smart Tag to your React/Redux web application. 

## Installation

You can NOT YET install AT Tracker using npm:

    npm install at-tracker

## Usage

In your application's Redux initialization :

    import { trackingMiddleware, initSmartTag } from 'at-tracker'

And then : 

    const AtTag = initSmartTag('httpUrl','httpsUrl', isSecure, siteId, 'xiti.com');
    const AtMiddleware = createAtMiddleware(AtTag)
    
    middlewares.push(AtMiddleware);
    

**Note:** You can export AtTag, for any custom use, for exemple to change the settings with `AtTag.setConfig({site: 'anotherSiteId'});`

## Team

These folks keep the project moving and are resources for help:

* Jérémy Vincent ([@jvincent42](https://github.com/jvincent42)) - developer
* Jalil Arfaoui ([@JalilArfaoui](https://github.com/JalilArfaoui)) - developer

## Releases

Not released yet

## Filing Issues

Not released yet

## Frequently Asked Questions

### Can I use that with xtcore.js lib ?

Answer

### Where to ask for help?

Not here