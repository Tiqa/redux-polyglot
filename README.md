# redux-polyglot

Toolset (actions, reducer, middleware, enhancer, selectors) for use polyglot with redux.

## Installation
```
    npm install git+http://vpalm/tfs/SIVP/VPVoyages/_git/vpm-redux-polyglot
```
## Usage
First of all, you need the polyglot reducer in your rootReducer :
```javascript
import { createStore, combineReducers } from 'redux';
import { polyglotReducer } from 'redux-polyglot';

const rootReducer = combineReducers({
    ...yourReducers,
    polyglot: polyglotReducer,
});
const store = createStore(rootReducer, {});

```


### Set the language
##### without middleware
You can use redux-polyglot without his middleware, for this you need the `setLanguage()` action creator :

- ```setLanguage :: String -> Object -> Action```

```javascript
import { setLanguage } from 'redux-polyglot';

store.dispatch(setLanguage('en', { yolo: 'yolo' }));
```
second parameter should be `polyglot phrases` (see [polyglot documentation](http://airbnb.io/polyglot.js/))

#### with middleware
The `createPolyglotMiddleware()` function allow you to configure your middleware for tell him how to change the language.

for this, you can catch a specific action, and find the locale in the payload, then you can asynchronously load the `polyglot phrases` (with Promise).

it takes 3 parameters and return a middleware :
- 1 - `actionToCatch :: String`
    - the type of the action you want to catch
- 2 - `getLocale :: Object -> String`
    - a function that take the catched action and return selected locale.
- 3 - `getPhrases :: String -> Promise Object`
    - a function that take the locale (provided by `setLocale`) and return a Promise of Object ( Object should be `polyglot phrases` )

the middleware will catch `actionToCatch`

```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';

const polyglotMiddleware = createPolyglotMiddleware(
    'ACTION_TO_CATCH',
    action => action.payload.locale,
    locale => new Promise(resolve => {
        // use locale for fetch phrases.
        resolve({
            hello: 'hello'
        });
    }),
)

const store = createStore(rootReducer, {}, applyMiddleware(polyglotMiddleware));
```

### Translation
#### with getP() selector
You can use `connect()` from `react-redux` and the getP() selector, for get the `p` property in your component.

what is `props.p` ?
it's just an object with 3 functions inside :
- t: translation (the original polyglot `t` function)
- tc: translation capitalized
- tu: translation upper-cased

(see [polyglot documentation](http://airbnb.io/polyglot.js/))

#### with translate() enhancer
`props.p` can be easly provided to a component :
```javascript
import { translate } from 'redux-polyglot';
const DummyComponentWithPProps = translate(DummyComponent);
```

#### get locale in a component
`getLocale()` selector is at your disposition. use it inside a [mapStateToProps](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options).

## Team

These folks keep the project moving and are resources for help:

* Jérémy Vincent ([@jvincent42](https://github.com/jvincent42)) - developer
* Jalil Arfaoui ([@JalilArfaoui](https://github.com/JalilArfaoui)) - developer
* Guillaume ARM ([@garm](https://github.com/guillaumearm/)) - developer
