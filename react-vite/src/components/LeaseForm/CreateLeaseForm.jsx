//react-vite/src/components/LeaseForm/CreateLeaseForm.jsx

import LeaseForm from './LeaseForm'
import { useParams } from 'react-router-dom'
//react-vite/src/components/LeaseForm/UpdateLeaseForm.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getOnePropertyThunk } from "../../redux/properties"

const CreateLeaseForm = ()=>{
    const lease ={};
    const { propertyId } = useParams();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
        
    useEffect(()=>{

        dispatch(getOnePropertyThunk(propertyId))
            .catch((error) => {
                setErrors(error);
            })
    }, [dispatch, propertyId])
 
    return ( 
        <>
        {Object.keys(errors).length !== 0 ? (<p className='hint'>{errors.message}</p>):
        <LeaseForm
            lease={lease}
            propertyId = {propertyId}
            formType="Create Lease"
        />
        }
        </>
     );

};

export default CreateLeaseForm;