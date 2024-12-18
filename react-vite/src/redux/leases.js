// react-vite/src/redux/lease.js
import { normalizer } from './utils';

const GET_ACTIVE_LEASES = 'leases/getActiveLeases';
const GET_EXPIRED_LEASES = 'leases/getExpiredLeases';
const ADD_LEASE = 'leases/addLease';
const UPDATE_LEASE = 'leases/updateLease';
const TERMINATE_LEASE = 'leases/terminateLease';
const REMOVE_LEASE = 'leases/removeLease';
const DELETE_LEASE_CONTRACT = 'leases/deleteLeaseContract'
const ADD_LEASE_CONTRACT = 'leases/addLeaseContract';


// Action Creators
export const getActiveLease = (leases) => {
    return {
        type: GET_ACTIVE_LEASES,
        payload: leases
    };
};

export const getExpiredLease = (leases) => {
    return {
        type: GET_EXPIRED_LEASES,
        payload: leases
    };
};

export const addLease = (lease) => {
    return {
        type: ADD_LEASE,
        payload:lease
    };
};

export const updateLease = (lease) => {
    return {
        type: UPDATE_LEASE,
        payload:lease
    };
};

export const terminateLease = (lease) => {
    return {
        type: TERMINATE_LEASE,
        payload: lease
    };
};


export const removeLease = (leaseId) => {
    return {
        type: REMOVE_LEASE,
        payload: leaseId
    };
};

export const deleteLeaseContract = (lease) => {
    return {
        type: DELETE_LEASE_CONTRACT,
        payload: lease
    };
};

export const addLeaseContract = (lease) => {
    return {
        type: ADD_LEASE_CONTRACT,
        payload: lease
    };
};




// Thunk Actions

// get active leases
export const getActiveLeaseThunk = (propertyId) => async (dispatch) => {
    const res = await fetch(`/api/properties/${propertyId}/leases/active`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getActiveLease(data.active_leases));
        // console.log('activeLeases:', data)
    } else {
        const errors = await res.json();
        throw errors;
    }
};


// get expired leases
export const getExpiredLeaseThunk = (propertyId) => async (dispatch) => {
   
    const res = await fetch(`/api/properties/${propertyId}/leases/expired`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getExpiredLease(data.expired_leases));
    } else {
        const errors = await res.json();
        throw errors;
    }
};


// create a lease
export const addLeaseThunk = (propertyId, formData) => async (dispatch) => {
    
    const res = await fetch(`/api/properties/${propertyId}/leases`, {
        method: 'POST',
        body: formData
    });


    if (res.ok){
        // console.log('=============resok')
        const newLease = await res.json();
        dispatch(addLease(newLease));
    } else{
      
        const error = await res.json();
   
        throw error;
    }
};


// update lease
export const updateLeaseThunk = (propertyId, formData) => async (dispatch) => {
    const res = await fetch(`/api/properties/${propertyId}/lease`, {
        method: 'PATCH',
        body: formData
    });
    if (res.ok) {
        const updatedLease = await res.json();
        dispatch(updateLease(updatedLease));
    } else {
        const error = await res.json();
        throw error;
    }
};


// terminate lease
export const terminateLeaseThunk = (propertyId) => async (dispatch) => {
    const res = await fetch(`/api/properties/${propertyId}/lease/terminate`, {
        method: 'PATCH'
    });
    if (res.ok) {
        const updated_lease = await res.json();
        dispatch((terminateLease(updated_lease)));
    } else {
        const error = await res.json();
        throw error;
    }
};




// delete lease contract thunk
export const deleteLeaseContractThunk = (propertyId) => async (dispatch) => {
    const res = await fetch(`/api/properties/${propertyId}/lease-contract/delete`, {
        method: 'PATCH'
    });
    if (res.ok) {
        const updated_lease = await res.json();
        dispatch((deleteLeaseContract(updated_lease)));
        
    } else {
        // console.log('=============error:')
        const error = await res.json();
        
        throw error;
    }
};


// Add lease contract thunk
export const addLeaseContractThunk = (propertyId, formData) => async (dispatch) => {
    
    const res = await fetch(`/api/properties/${propertyId}/lease-contract/add`, {
        body: formData,
        method: 'PATCH'
    });
    if (res.ok) {
        const updated_lease = await res.json();
        dispatch((addLeaseContract(updated_lease)));
        
    } else {
        
        const error = await res.json();
        // console.log('=============error:', error)
        throw error;
    }
};

 //remove lease thunk
export const removeLeaseThunk = (leaseId) => async (dispatch) => {
   
    const res = await fetch(`/api/leases/${leaseId}`, {
        method: 'DELETE'
    });
    if (res.ok){
        
        dispatch(removeLease(leaseId))
        
    } else {
        const error = await res.json();
        throw error;
    }
};


// Reducers

const initialState ={
    activeLeases: {},
    expiredLeases:{}
}

const leaseReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case GET_ACTIVE_LEASES:
            return {...state, activeLeases: normalizer(payload)};
        case GET_EXPIRED_LEASES:
            return {...state, expiredLeases: normalizer(payload)};
        case ADD_LEASE:
            return {...state, activeLease: payload};
        case UPDATE_LEASE:
            return {...state, activeLease: payload};
        case TERMINATE_LEASE:
            return {
                ...state,
                activeLease: null,
                expiredLeases:{...(state.expiredLeases), [payload.id]: payload}
            };
        case DELETE_LEASE_CONTRACT:
            return {...state, activeLease: payload};
        case ADD_LEASE_CONTRACT:
            return {...state, activeLease: payload};
        case REMOVE_LEASE:
            return {
                ...state,
                activeLease: state.activeLease?.id === Number(payload) ? null : state.activeLease, // Update activeLease
                expiredLeases: normalizer(
                    Object.values(state.expiredLeases).filter(lease => lease.id !== Number(payload)) // Normalize filtered leases
                ),
            };
        

        default:
            return state;
    }
};

export default leaseReducer;