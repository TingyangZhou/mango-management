import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';

import { deleteLeaseContractThunk  } from '../../redux/leases';


function ConfirmDeleteContractModal({propertyId}) {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();
    const [ errors, setErrors ]=useState({});

    const handleDeleteClick = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        try {
            await dispatch(deleteLeaseContractThunk(propertyId));
            closeModal(); // Close the modal on success
            navigate(`/properties/${propertyId}`); // Navigate after successful delete
        } catch (error) {
            setErrors({ message: error?.message || "Failed to delete the lease contract" });
        }
    };

    

    const handleKeepClick = () => {
        closeModal();
    }

    return (
        <form className='confirm-delete-contract-form'>
            
            <h2>Confirm Termination</h2>
            {errors?.message && <p className='hint'>{errors.message}</p>}
            <p> Are you sure you want to remove the lease contract? </p>
            <button 
                 className='yes-button'
                 onClick={handleDeleteClick}
            >Confirm</button>
            <button 
                className='no-button'
                onClick={handleKeepClick}
            >Cancel</button>
        </form>
        
    )
}





export default ConfirmDeleteContractModal;