// react-vite/src/redux/store.js

import {
    legacy_createStore as createStore,
    applyMiddleware,
    compose,
    combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import propertyReducer from './properties';
import watchlistReducer from './watchlist';
import userInfoReducer from './users';
import leaseReducer from './leases';
import tenantReducer from './tenants';
import invoiceReducer from './invoices';


const rootReducer = combineReducers({
    session: sessionReducer,
    properties: propertyReducer,
    watchlist: watchlistReducer,
    userInfo: userInfoReducer,
    leases: leaseReducer,
    tenants:tenantReducer,
    invoices: invoiceReducer
});

let enhancer;
if (import.meta.env.MODE === 'production') {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = (await import('redux-logger')).default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
