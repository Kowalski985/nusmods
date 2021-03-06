import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'reducers';
import requestsMiddleware from 'middlewares/requests-middleware';
import ravenMiddleware from 'middlewares/raven-middleware';
import themeMiddleware from 'middlewares/theme-middleware';

// For redux-devtools-extensions - see
// https://github.com/zalmoxisus/redux-devtools-extension
/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;
/* eslint-enable no-underscore-dangle */

export default function configureStore(defaultState) {
  const middlewares = [ravenMiddleware, thunk, requestsMiddleware, themeMiddleware];

  if (process.env.NODE_ENV === 'development') {
    /* eslint-disable */
    const { createLogger } = require('redux-logger');
    /* eslint-enable */
    const logger = createLogger({
      level: 'info',
      collapsed: true,
      duration: true,
      diff: true,
    });
    middlewares.push(logger);
  }

  const store = createStore(
    rootReducer,
    defaultState,
    composeEnhancers(applyMiddleware(...middlewares)),
  );

  if (module.hot) {
    // Enable webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
}
