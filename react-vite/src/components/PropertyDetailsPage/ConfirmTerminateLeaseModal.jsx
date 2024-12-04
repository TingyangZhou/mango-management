import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { terminateLeaseThunk  } from '../../redux/leases';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';

function ConfirmTerminateLeaseModal({propertyId}) {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();
    const [ errors, setErrors ]=useState({});

    const handleTerminateClick = (e) => {
        setErrors({});
        e.preventDefault();

        
        dispatch(terminateLeaseThunk(propertyId))
        .then(closeModal)
        .then(() => navigate(`/properties/${propertyId}`))
        .catch(error => setErrors(error));
        
    }
    

    const handleKeepClick = () => {
        closeModal();
    }

    return (
        <form className='confirm-delete-form'>
            
            <h2>Confirm Termination</h2>
            {errors?.message && <p className='hint'>{errors.message}</p>}
            <p> Terminating this lease will also permanently remove all associated tenants. Are you sure you want to proceed with terminating this lease? </p>
            <button 
                 className='yes-button'
                 onClick={handleTerminateClick}
            >Confirm</button>
            <button 
                className='no-button'
                onClick={handleKeepClick}
            >Cancel</button>
        </form>
        
    )
}





export default ConfirmTerminateLeaseModal;