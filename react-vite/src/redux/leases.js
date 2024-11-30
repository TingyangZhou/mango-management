// react-vite/src/redux/lease.js
import { normalizer } from './utils';

const GET_ACTIVE_LEASE = 'leases/getActiveLease';
const GET_EXPIRED_LEASES = 'leases/getExpiredLeases';
const ADD_LEASE = 'leases/addLease';
const UPDATE_LEASE = 'leases/updateLease';
const TERMINATE_LEASE = 'leases/terminateLease';
const REMOVE_LEASE = 'leases/removeLease';


// Action Creators
export const getActiveLease = (leases) => {
    return {
        type: GET_ACTIVE_LEASE,
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

// Thunk Actions

// get active leases
export const getActiveLeaseThunk = (propertyId) => async (dispatch) => {
    const res = await fetch(`/api/properties/${propertyId}/leases/active`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getActiveLease(data.active_lease));
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
export const addLeaseThunk = (propertyId, leaseData) => async (dispatch) => {
    const res = await fetch(`/api/properties/${propertyId}/leases`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaseData)
    });

    if (res.ok){
        const newLease = await res.json();
        dispatch(addLease(newLease));
    } else{
        const error = await res.json();
        throw error;
    }
};


// update lease
export const updateLeaseThunk = (propertyId, leaseData) => async (dispatch) => {
    const res = await fetch(`/api/properties/${propertyId}/lease`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaseData),
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
    activeLease: {},
    expiredLeases:{}
}

const leaseReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case GET_ACTIVE_LEASE:
            return {...state, activeLease: payload};
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