# redux-polyglot

[ ![Codeship Status for Tiqa/redux-polyglot](https://app.codeship.com/projects/21623df0-8959-0134-75f2-0e35097499a9/status?branch=master)](https://app.codeship.com/projects/184177)

Toolset (actions, reducer, middleware, enhancer, selectors) to help use Polyglot with Redux.

## Installation
```
    npm install --save redux-polyglot
```
## Setup

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
## Usage

### Set the language
#### without middleware
You can use redux-polyglot without his middleware, for this you need the `setLanguage()` action creator :

- ```setLanguage :: (String, Object) -> Action```

Example:
```javascript
import { setLanguage } from 'redux-polyglot';

store.dispatch(setLanguage('en', { yolo: 'yolo' }));
```
second parameter should be `polyglot phrases` (see [polyglot documentation](http://airbnb.io/polyglot.js/))

note: if language phrases already exists, this will overwrite the corresponding object state.

#### with middleware
The `createPolyglotMiddleware()` function allow you to automatically update language and phrases by listening to specific action(s).

The middleware catches specific action(s), and find the locale in the payload, and then [asynchronously] load the `polyglot phrases` (with Promise).

It takes 3 parameters and return a middleware :
- 1 - `actionToCatch :: String | Array<String>`
    - the type(s) of the action to catch
- 2 - `getLocale :: Object -> String`
    - a function that take the catched action as parameter and return new language.
- 3 - `getPhrases :: String -> Promise Object`
    - a function that take the language (as provided by `setLocale`) and return a Promise of Object ( Object should be `polyglot phrases` )

the middleware will catch `actionToCatch`

```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';

const polyglotMiddleware = createPolyglotMiddleware(
    'ACTION_TO_CATCH',
    action => action.payload.locale,
    locale => new Promise(resolve => {
        // perform async here
        resolve({
            hello: 'bonjour',
        });
    }),
)

const store = createStore(rootReducer, {}, applyMiddleware(polyglotMiddleware));
```

you can catch more than one action passing an array of action types:
```javascript
const polyglotMiddleware = createPolyglotMiddleware(
    ['FIRST_ACTION_TO_CATCH', 'SECOND_ACTION_TO_CATCH'],
    getLocale,
    getPhrases,
)
```

note: if language has not changed, nothing happens.

### Translation
#### with getP() selector
You can use the `getP(state)` selector.

It returns an object with 4 functions inside :
- t: String -> String : translation (the original polyglot `t` function)
- tc: String -> String : translation capitalized
- tt: String -> String : translation titleized
- tu: String -> String : translation upper-cased
- tm: (String -> String) -> String -> String :  translation using a custom morphism

(see [polyglot documentation](http://airbnb.io/polyglot.js/))

there is an optional parameter to getP().
this is allow you to automatically 'aim' a scope in your phrases object using `polyglotScope` property.

for example :

```js
store.dispatch(setLanguage('en', {
    some: { nested: { data: { hello: 'hello' } } }
}));
const p = getP(store.getState(), { polyglotScope: 'some.nested.data' });
console.log(p.tc('hello')) // => will return 'Hello'
```

#### Getting current locale
`getLocale(state)` selector returns current language.

#### If you use React

You can use `connect()` from `react-redux`, and the getP() selector, to get the `p` prop in your component.

Proptype:
````javascript
p: PropTypes.shape({
    t: PropTypes.func.isRequired,
    tc: PropTypes.func.isRequired,
    tu: PropTypes.func.isRequired,
    tm: PropTypes.func.isRequired,
}),
````

##### translate() enhancer
`props.p` can be also be provided easily to a component with the translate enhancer :
```javascript
import translate from 'redux-polyglot/translate';
const DummyComponentWithPProps = translate(DummyComponent);
```

you can select a `polyglotScope` with `translate('scope', Component)`
```js
// all this lines return an enhanced Dummy component
translate(Dummy);
translate('catalog', Dummy); // with polyglotScope
translate()(Dummy); // curried
translate('catalog')(Dummy); // curried with polyglotScope.
translate({ polyglotScope : 'some.nested.data', ownPhrases: 'some.nested.data.hello': 'Hi !', ... })(Dummy); // curried with object configuration.
```

##### get locale in a component
You can use the `getLocale()` selector inside a [mapStateToProps](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) from react-redux.

Proptype: ````locale: PropTypes.string,````

### Overwrite phrases
In some case, you should be able to replace some default phrases by others phrases. 

For doing this, you have to define an object which contains your overwrited phrases. 
This object is composed of : ``` { 'some.nested.data': 'phrase', ... }``` where `key` is the target path you want to replace and `value` ... the new value.

##### with _getP()_ selector
Simply add `ownPhrases` property and set the new configuration like above to overwrite  :
```js
store.dispatch(setLanguage('en', {
    some: { nested: { data: { hello: 'hello' } } }
}));
const p = getP(store.getState(), {
    polyglotScope: 'some.nested.data', 
    ownPhrases: { 'some.nested.data.hello': 'Hi !' }
});
console.log(p.tc('hello')) // => will return 'Hi !'
```
##### with _translate()_ enhancer
Instead passing only _string_ as parameter : `translate('catalog', Dummy)`, pass a plain _object_ which contains `polyglotScope` and `ownPhrases` properties :
```js
translate({ 
    polyglotScope : 'some.nested.data', 
    ownPhrases: { 'some.nested.data.catalog': 'Cars' } 
}, Dummy);
console.log(p.tc('catalog')) // => will return 'Cars'
```

### Use polyglot options
if you want to use `onMissingKey`, `allowMissing` or `warn` [polyglot](http://airbnb.io/polyglot.js/) options, you can use the `createGetP` function to create a custom `getP`.

usage :
```js
import { createGetP } from 'redux-polyglot';

const options = {
  allowMissing: true,
}

export const getP = createGetP(options);
```

## Team

These folks keep the project moving and are resources for help:

* Jérémy Vincent ([@jvincent42](https://github.com/jvincent42)) - developer
* Jalil Arfaoui ([@JalilArfaoui](https://github.com/JalilArfaoui)) - developer
* Guillaume ARM ([@guillaumearm](https://github.com/guillaumearm/)) - developer
