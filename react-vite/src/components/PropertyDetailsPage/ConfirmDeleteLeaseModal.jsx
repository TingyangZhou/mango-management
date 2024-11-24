import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeLeaseThunk } from '../../redux/leases';
import { useModal } from '../../context/Modal';
import { Navigate, useNavigate } from 'react-router-dom';

function ConfirmDeleteLeaseModal({propertyId, leaseId}) {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();
    const [ errors, setErrors ]=useState({});
    
    const handleDeleteClick = (e) => {
        setErrors({});
        e.preventDefault();

        dispatch(removeLeaseThunk(leaseId))
        .then(closeModal)
        .catch(error => setErrors(error));
        
        return navigate(`/properties/${propertyId}`);
        
    }
    

    const handleKeepClick = () => {
        closeModal();
    }

    return (
        <form className='confirm-delete-form'>
             {errors?.message && <p className='hint'>{errors.messagey}</p>}
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this lease? </p>
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





export default ConfirmDeleteLeaseModal;