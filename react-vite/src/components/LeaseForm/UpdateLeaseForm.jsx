//react-vite/src/components/LeaseForm/UpdateLeaseForm.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import LeaseForm from './LeaseForm'
import { getActiveLeaseThunk } from "../../redux/leases"


const UpdateLeaseForm = ()=>{
    const { propertyId }  = useParams();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    
    
    useEffect(()=>{
        dispatch(getActiveLeaseThunk(propertyId))
            .catch((error) => {
                setErrors(error);
            })
    }, [dispatch, propertyId])


    const activeLease = useSelector(state => state.leases.activeLease);
    
    // console.log('===========activelease:', activeLease);

    if (!activeLease) {
        return <p>Loading...</p>;
    }
 
    return (
        <>
            {Object.keys(errors).length !== 0 ? (<p className='hint'>{errors.message}</p>):
                <LeaseForm
                    propertyId = {propertyId}
                    lease ={activeLease}
                    formType="Update Lease"
                />
            }
        </>
        
    );

};

export default UpdateLeaseForm;