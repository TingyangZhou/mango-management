// react-vite/src/components/redux/invoices.js

import { normalizer } from './utils';

const GET_ALL_INVOICES = 'invoices/getAll';
const GET_ONE_INVOICE = 'invoices/getOne';
const CREATE_INVOICE = 'invoices/create';
const UPDATE_INVOICE = 'invoices/update';
const PAY_INVOICE = 'invoices/pay';
const DELETE_INVOICE = 'invoices/delete';



const getAllInvoices = (invoices) => {
    return {
        type: GET_ALL_INVOICES,
        payload: invoices,
    };
};

const getOneInvoice = (invoice) => {
    return {
        type: GET_ONE_INVOICE,
        payload: invoice,
    };
};

const createInvoice = (invoice) => {
    return {
        type: CREATE_INVOICE,
        payload: invoice,
    };
};


const updateInvoice = (invoice) => {
    return {
        type: UPDATE_INVOICE,
        payload: invoice,
    };
};

const payInvoice = (invoice) => {
    return {
        type: PAY_INVOICE,
        payload: invoice,
    };
};

const deleteInvoice = (invoiceId) => {
    return {
        type: DELETE_INVOICE,
        payload: invoiceId,
    };
};

/** Thunk Action Creators: */

// get all invoices
export const getAllInvoicesThunk = () => async (dispatch) => {
    const res = await fetch(`/api/invoices`);
        
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllInvoices(data));
    } else {
        const errors = await res.json();
        throw errors;
    }
};


// get one invoice
export const getOneInvoiceThunk = (invoiceId) => async (dispatch) => {
    const res = await fetch(`/api/invoices/${invoiceId}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getOneInvoice(data));
    } else {
        
        const errors = await res.json();
        throw errors;
    }
};


// create a new invoice
export const createInvoiceThunk = (invoiceData) => async(dispatch) =>{

    const res = await fetch(`/api/invoices`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
    });

    if (res.ok) {
        const newInvoice = await res.json();
        dispatch(createInvoice(newInvoice));
      
    } else{
        
        const error = await res.json();
       
        throw error;
    }
}


// Update a invoice
export const updateInvoiceThunk = (invoiceData, invoiceId) => async(dispatch) =>{
    // console.log("********************===================")
    // console.log("updateInvoiceThunk called with:", invoiceData, invoiceId);
    const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
    });

    if (res.ok) {
        const invoice = await res.json();
        dispatch(updateInvoice(invoice));
    } else{
        
        const error = await res.json();
        throw error;
    }
}

// Pay an invoice
export const payInvoiceThunk = (payDate, invoiceId) => async(dispatch) =>{
    
    const res = await fetch(`/api/invoices/${invoiceId}/pay`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payDate)
    });

    if (res.ok) {
        const invoice = await res.json();
        dispatch(payInvoice(invoice));
    } else{
        const error = await res.json();
        throw error;
    }
}

// Delete a Invoice
export const deleteInvoiceThunk = (invoiceId) => async(dispatch) => {
    const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE'
    })
    if (res.ok){
        dispatch(deleteInvoice(invoiceId))
    } else {
        const error = await res.json();
        throw error;
    }
}



let initialState = {
    currentInvoice: null,
    invoices: {}
}

export default function invoiceReducer(state = initialState, { type, payload }) {
    
    switch (type) {
        case GET_ALL_INVOICES:
            if (!payload){
                return {...state,
                    currentInvoice: null, 
                    invoices: {}
                }
            } 
            return {...state,
                currentInvoice: state.currentInvoice, 
                invoices: normalizer(payload?.invoices)
                
            }
           
        case GET_ONE_INVOICE:
            return {...state, currentInvoice: payload, invoices: state.invoices}
        case CREATE_INVOICE:
            return {
                currentInvoice:payload,
                invoices: {...state.invoices, [payload.id]:payload}
            }
        case UPDATE_INVOICE:
            return {
                currentInvoice:payload,
                invoices: {...state.invoices, [payload.id]:payload}
            }
        case PAY_INVOICE:
            return {
                currentInvoice:payload,
                invoices: {...state.invoices, [payload.id]:payload}
            }
        case DELETE_INVOICE: {
            let new_invoices = {...state.invoices};
            delete new_invoices[payload]
            return {
                ...state,
                currentInvoice:null,
                invoices: new_invoices
            }
        }
        default:
            return state;
    }
}