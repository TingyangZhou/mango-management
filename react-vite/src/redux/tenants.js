// react-vite/src/redux/tenants.js
import { normalizer } from './utils';

const GET_TENANTS = 'tenants/getTenants';
const ADD_TENANT = 'tenants/addTenant';
const UPDATE_TENANT = 'tenants/updateTenant';
const REMOVE_TENANT = 'Tenant/removeTenant';


// Action Creators
export const getTenants = (tenants) => {
    return {
        type: GET_TENANTS,
        payload: tenants
    };
};

export const addTenant = (tenants) => {
    return {
        type: ADD_TENANT,
        payload: tenants
    };
};

export const updateTenant = (tenants) => {
    return {
        type: UPDATE_TENANT,
        payload: tenants
    };
};

export const removeTenant = (tenantId) => {
    return {
        type: REMOVE_TENANT,
        payload: tenantId
    };
};

// Thunk Actions

// get all tenants for a property
export const getTenantsThunk = (propertyId) => async (dispatch) => {
    const res = await fetch(`/api/properties/${propertyId}/tenants`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getTenants(data.tenants));
    } else {
        const errors = await res.json();
        throw errors;
    }
};


// create a Tenant
export const createTenantThunk = (propertyId, tenantData) => async (dispatch) => {
 
    const res = await fetch(`/api/properties/${propertyId}/tenants`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tenantData)
    });

    if (res.ok){
        const tenants = await res.json();
        dispatch(addTenant(tenants.tenants));
    } else{
        const error = await res.json();
        // console.log("==============", error)
        throw error;
    }
};


// update Tenant
export const updateTenantThunk = (propertyId, tenantId, tenantData) => async (dispatch) => {
    const res = await fetch(`/api/properties/${propertyId}/tenants/${tenantId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tenantData),
    });
    if (res.ok) {
        const updated_tenants = await res.json();
        dispatch(updateTenant(updated_tenants.tenants));
    } else {
        const error = await res.json();
        throw error;
    }
};


 //remove Tenant thunk
export const removeTenantThunk = (propertyId, tenantId) => async (dispatch) => {
   
    const res = await fetch(`/api/properties/${propertyId}/tenants/${tenantId}`, {
        method: 'DELETE'
    });
    if (res.ok){
        dispatch(removeTenant(tenantId))
        
    } else {
        const error = await res.json();
        throw error;
    }
};


// Reducers


const tenantReducer = (state = {tenants:{}}, {type, payload}) => {
    switch (type) {
        case GET_TENANTS:
            return {...state, tenants: payload? normalizer(payload):{}};
        case ADD_TENANT:
            return {...state, tenants: normalizer(payload)};
        case UPDATE_TENANT:
            return {...state, tenants: normalizer(payload)};
        case REMOVE_TENANT:{
            const {[payload]: _, ...newTenants} = state.tenants;
            return {...state, tenants: newTenants};}
        default:
            return state;
    }
};

export default tenantReducer;