// react-vite/src/components/redux/stocks.js

import { normalizer } from './utils';

const GET_ALL_STOCKS = 'stocks/getAll';
const GET_ONE_STOCK = 'stocks/getOne';

const getAllStocks = (stocks) => {
    return {
        type: GET_ALL_STOCKS,
        payload: stocks,
    };
};

const getOneStock = (stock) => {
    return {
        type: GET_ONE_STOCK,
        payload: stock,
    };
};

export const getOneStockThunk = (stockId) => async (dispatch) => {
    const res = await fetch(`/api/stocks/${stockId}`);
    if (res.ok) {
        // const data = res.json();
        const data = await res.json();
        dispatch(getOneStock(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};

export const getAllStocksThunk = () => async (dispatch) => {
    const res = await fetch('/api/stocks');
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllStocks(data.stocks));
    } else {
        const errors = await res.json();
        return errors;
    }
};

export const getAllSearchStocksThunk = (input) => async (dispatch) => {
    const res = await fetch(`/api/stocks/search?input=${input}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllStocks(data.search_results));
    } else {
        const errors = await res.json();
        return errors;
    }
};

let initialState = {
    currentStock: {},
    stocks: {}
}

export default function stocksReducer(state = initialState, { type, payload }) {
    switch (type) {
        case GET_ALL_STOCKS:
            return {currentStock: state.currentStock, stocks: normalizer(payload)}
        case GET_ONE_STOCK:
            return {currentStock: payload, stocks: state.stocks}
        default:
            return state;
    }
}