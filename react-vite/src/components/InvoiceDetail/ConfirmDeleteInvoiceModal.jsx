import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteInvoiceThunk } from '../../redux/invoices';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import "./ConfirmDeleteInvoiceModal.css";

function ConfirmDeleteFormModal({invoiceId}) {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();
    const [ errors, setErrors ]=useState({});

    const handleDeleteClick = (e) => {
        setErrors({});
        e.preventDefault();

        dispatch(deleteInvoiceThunk(invoiceId))
        .then(()=>{
            closeModal();
            navigate(`/invoices`);

        })
        .catch(error => setErrors(error));
   
    }
    

    const handleKeepClick = () => {
        closeModal();
    }

    return (
        <form className='confirm-delete-invoice-form'>
             {errors?.message && <p className='hint'>{errors.message}</p>}
            <h2>Confirm Delete</h2>
            <p> Are you sure you want to delete this invoice? </p>
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