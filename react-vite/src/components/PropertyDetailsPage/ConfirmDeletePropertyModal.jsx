import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deletePropertyThunk } from '../../redux/properties';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';

function ConfirmDeleteFormModal({propertyId}) {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();
    const [ errors, setErrors ]=useState({});

    const handleDeleteClick = (e) => {
        setErrors({});
        e.preventDefault();

        dispatch(deletePropertyThunk(propertyId))
        .then(closeModal)
        .catch(error => setErrors(error));
        
        return navigate('/properties');
        
    }
    

    const handleKeepClick = () => {
        closeModal();
    }

    return (
        <form className='confirm-delete-form'>
             {errors?.message && <p className='hint'>{errors.message}</p>}
            <h2>Confirm Delete</h2>
            <p> Deleting this property will also permanently remove all associated leases, tenants, and invoices. Are you sure you want to proceed with removing this property? </p>
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





export default ConfirmDeleteFormModal;