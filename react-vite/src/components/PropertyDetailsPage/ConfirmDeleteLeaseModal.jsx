import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeLeaseThunk } from '../../redux/leases';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';

function ConfirmDeleteLeaseModal({propertyId, leaseId}) {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();
    const [ errors, setErrors ]=useState({});
    
    const handleDeleteClick = (e) => {
        setErrors({}); // Reset errors
        e.preventDefault(); // Prevent default behavior
    
        dispatch(removeLeaseThunk(leaseId))
            .then(() => {
                closeModal(); // Close the modal after successful deletion
                navigate(`/properties/${propertyId}`); // Navigate to the property page
            })
            .catch(error => {
                // Handle errors appropriately
                console.error("Error deleting lease:", error);
                setErrors({ message: "Failed to delete lease. Please try again." });
            });
    };
    
    

    const handleKeepClick = () => {
        closeModal();
    }

    return (
        <form className='confirm-delete-form'>
             {errors?.message && <p className='hint'>{errors.message}</p>}
            <h2>Confirm Delete</h2>
            <p> Deleting this lease will also permanently remove all associated tenants and invoices. Are you sure you want to proceed with removing this lease?</p>
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