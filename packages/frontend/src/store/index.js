import { createStore, applyMiddleware, compose } from 'redux';
import reduxSaga from 'redux-saga';

import rootReducer from './reducers';
import sagas from './sagas';

const createSagaMiddleware = typeof reduxSaga.default === 'function' ? reduxSaga.default : reduxSaga;
const sagaMiddleware = createSagaMiddleware();
const initialState = undefined;

export default () => {
  const store = createStore(rootReducer, initialState, createEnhancer());
  sagaMiddleware.run(sagas);
  enableHmrForReducers(store);
  return store;
};

const createEnhancer = () => compose(applyMiddleware(sagaMiddleware));

const enableHmrForReducers = (store) => {
  if (module.hot) {
    const replaceReducer = () => store.replaceReducer(require('./reducers').default);
    module.hot.accept('./reducers', replaceReducer);
  }
};
