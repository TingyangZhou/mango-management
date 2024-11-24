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
        .catch(error => setErrors(error));
        
        return navigate(`/properties/${propertyId}`);
        
    }
    

    const handleKeepClick = () => {
        closeModal();
    }

    return (
        <form className='confirm-delete-form'>
             {errors?.message && <p className='hint'>{errors.messagey}</p>}
            <h2>Confirm Termination</h2>
            <p>Are you sure you want to terminate this lease? </p>
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