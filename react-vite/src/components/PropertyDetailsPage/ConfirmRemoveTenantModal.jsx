import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeTenantThunk  } from '../../redux/tenants';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';

function ConfirmRemoveTenantModal({propertyId, tenantId}) {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();
    const [ errors, setErrors ]=useState({});

    const handleDeleteClick = (e) => {
        setErrors({});
        e.preventDefault();

        dispatch(removeTenantThunk(propertyId, tenantId))
        .then(closeModal)
        .catch(error => setErrors(error));
        
        return navigate(`/properties/${propertyId}`);
        
    }
    

    const handleKeepClick = () => {
        closeModal();
    }

    return (
        <form className='tenant-confirm-delete-form'>
             {errors?.message && <p className='hint'>{errors.message}</p>}
            <h2>Confirm Termination</h2>
            <p>Are you sure you want to delete this tenant? </p>
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





export default ConfirmRemoveTenantModal;