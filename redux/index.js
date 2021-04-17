import { applyMiddleware, createStore, compose, combineReducers } from "redux";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";
// import rootReducer from "./reducers";
import rootSaga from "./sagas";
import { showNotification } from "../config/notifications";

const bindMiddleware = (middleware) => applyMiddleware(...middleware);


import general from "./reducers/general";
import viewStatus from "./reducers/viewStatus";
import tabs from "./reducers/tabs";



const rootReducer = { general, viewStatus, tabs }


function createReducer(customReducers) {
  console.log("rootReducer")
  console.log(rootReducer)
  return combineReducers({
    ...rootReducer,
    ...customReducers
  })
}



function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware({
    onError: (error) => {
      showNotification({
        message: error.name,
        description: error.message,
        type: "error",
      });
    },
  });
  const middlewares = [thunk, sagaMiddleware];
  // if (process.env.NODE_ENV === "development") {
  //   middlewares.push(logger);
  // }
  const store = createStore(createReducer(), initialState, compose(bindMiddleware(middlewares)));

  store.injectReducer = (key, customReducer) => {
    if (!("customReducers" in store)){
      store.customReducers={}
    }
    store.customReducers[key] = customReducer
    store.replaceReducer(createReducer(store.customReducers))
  }

  store.sagaTask = sagaMiddleware.run(rootSaga);
  
  return store;
}


const store = configureStore();
export default store;
