import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { payInvoiceThunk } from '../../redux/invoices';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import "./RecordPaymentModal.css"

function RecordPaymentModal({invoiceId}) {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();
    const [ errors, setErrors ]=useState({});
    const [paymentDate, setPaymentDate] = useState("");
    
    const handleConfirmClick = (e) => {
        setErrors({}); // Reset errors
        e.preventDefault(); // Prevent default behavior

        const payment_date = {"payment_date": paymentDate}
    
        dispatch(payInvoiceThunk(payment_date, invoiceId))
            .then(() => {
                closeModal(); // Close the modal after successful deletion
                navigate(`/invoices/${invoiceId}`); 
            })
            .catch(error => {
                console.log("=========error", error)
                // Handle errors appropriately
                setErrors(error);
                
            });
    };
    
    

    const handleCancelClick = () => {
        closeModal();
    }

    return (
        <form className='payment-form-modal'>
             
            <h2>Confirm Payment Date</h2>
            {errors?.message && <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }} className='hint'>{errors.message}</p>}
            <form className="payment-date-form">
                <label className='lease-form-label'>
                    Please enter the date of payment:
                    <input 
                        required
                        type ="date"
                        className='payment-date-input'
                        value = {paymentDate}
                        onChange = {(e) => setPaymentDate(e.target.value)}
                    />
                </label>
            </form>
            <button 
                 className='yes-button'
                 onClick={handleConfirmClick}
            >Confirm</button>
            <button 
                className='no-button'
                onClick={handleCancelClick}
            >Cancel</button>
        </form>
        
    )
}





export default RecordPaymentModal;