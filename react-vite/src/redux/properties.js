// react-vite/src/components/redux/properties.js

import { normalizer } from './utils';

const GET_ALL_PROPERTIES_PAGE = 'properties/getAllWithPage';
const GET_ALL_PROPERTIES_NO_PAGE = 'properties/getAllNoPage'
const GET_ONE_PROPERTY= 'properties/getOne';
const CREATE_PROPERTY = 'properties/create';
const UPDATE_PROPERTY = 'properties/update';
const DELETE_PROPERTY = 'properties/delete';



const getAllProperties = (properties) => {
    return {
        type: GET_ALL_PROPERTIES_PAGE,
        payload: properties,
    };
};


const getAllPropertiesNoPage = (properties) => {
    return {
        type: GET_ALL_PROPERTIES_NO_PAGE,
        payload: properties,
    };
};


const getOneProperty = (property) => {
    return {
        type: GET_ONE_PROPERTY,
        payload: property,
    };
};

const createProperty = (property) => {
    return {
        type: CREATE_PROPERTY,
        payload: property,
    };
};


const updateProperty = (property) => {
    return {
        type: UPDATE_PROPERTY,
        payload: property,
    };
};


const deleteProperty = (propertyId) => {
    return {
        type: DELETE_PROPERTY,
        payload: propertyId,
    };
};

/** Thunk Action Creators: */

// get all properties pagination
export const getAllPropertiesThunk = (page, per_page) => async (dispatch) => {
    const res = await fetch(`/api/properties?page=${page}&per_page=${per_page}`);
        
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllProperties(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};


// get all properties without pagination
export const getAllPropertiesNoPageThunk = () => async (dispatch) => {
    const res = await fetch(`/api/properties/all`);
        
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllPropertiesNoPage(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};


// get one property
export const getOnePropertyThunk = (propertyId) => async (dispatch) => {
    const res = await fetch(`/api/properties/${propertyId}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getOneProperty(data));
    } else {
        
        const errors = await res.json();
        throw errors;
    }
};


// create a new property
export const createPropertyThunk = (propertyData) => async(dispatch) =>{

    const res = await fetch(`/api/properties`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(propertyData)
    });

    if (res.ok) {
        const newProperty = await res.json();
        dispatch(createProperty(newProperty));
        return newProperty;
    } else{
        const error = await res.json();
        throw error;
    }
}


// Update a property
export const updatePropertyThunk = (propertyData, propertyId) => async(dispatch) =>{
    const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(propertyData)
    });

    if (res.ok) {
        const property = await res.json();
        dispatch(updateProperty(property));
    } else{
        const error = await res.json();
        throw error;
    }
}

// Delete a property
export const deletePropertyThunk = (propertyId) => async(dispatch) => {
    const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE'
    })
    if (res.ok){
        dispatch(deleteProperty(propertyId))
    } else {
        const error = await res.json();
        throw error;
    }
}




let initialState = {
    currentProperty: null,
    properties: {}
}

export default function propertyReducer(state = initialState, { type, payload }) {
    switch (type) {
        case GET_ALL_PROPERTIES_PAGE:
            return {...state,
                currentProperty: state.currentProperty, 
                properties: normalizer(payload.properties), 
                num_properties:payload.num_properties
            };
        case GET_ALL_PROPERTIES_NO_PAGE:
            return {...state,
                currentProperty: state.currentProperty, 
                properties: normalizer(payload.properties), 
            };
        case GET_ONE_PROPERTY:
            return {...state, currentProperty: payload, properties: state.properties}
        case CREATE_PROPERTY:
            return {
                ...state,
                currentProperty:{...payload},
                properties: {...state.properties, [payload.id]:payload}
            }
        case UPDATE_PROPERTY:
            return {
                currentProperty:null,
                properties: {...state.properties, [payload.id]:payload}
            }
        case DELETE_PROPERTY: {
            let new_properties = {...state.properties};
            delete new_properties[payload]
            return {
                currentProperty:null,
                properties: new_properties
            }
        }
        default:
            return state;
    }
}