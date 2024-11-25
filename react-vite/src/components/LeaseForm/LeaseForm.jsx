import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './LeaseForm.css'
import { updateLeaseThunk, addLeaseThunk } from '../../redux/leases.js'


const LeaseForm = ({lease, propertyId, formType}) =>{

    const [ errors, setErrors ] = useState({});
    const [ startDate, setStartDate ] = useState(lease?.start_date || "");
    const [ endDate, setEndDate ] = useState(lease?.end_date || "");
    const [ deposit, setDeposit ] = useState(lease?.deposit ||0);
    const [ depositDueDate, setDepositDueDate ] = useState(lease?.deposit_due_date || "");
    const [ rent, setRent ] = useState(lease?.rent ||0);
    const [ rentDueOn, setRentDueOn ] = useState(lease?.rent_due_day || "");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // console.log("=========lease:", lease)

    const handleDummyData =() => {
        setStartDate(new Date("2024-01-01").toISOString().split("T")[0]);
        setEndDate(new Date("2025-1-1").toISOString().split("T")[0]);
        setDeposit(1000);
        setDepositDueDate(new Date("2023-12-15").toISOString().split("T")[0]);
        setRent(1000);
        setRentDueOn(1);
    }

    //useEffect is used so whenever active lease is changed, form ca be pre-populated with updated data when a user directly input url
    useEffect(() => {
        if (lease) {
            setStartDate(lease.start_date || "");
            setEndDate(lease.end_date || "");
            setDeposit(lease.deposit || 0);
            setDepositDueDate(lease.deposit_due_date || "");
            setRent(lease.rent || 0);
            setRentDueOn(lease.rent_due_day || "");
        }
    }, [lease]);

    const handleCancel = () => {
        navigate(`/properties/${propertyId}`)
    }
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const updatedLease = {...lease, 
            start_date: startDate, 
            end_date: endDate, 
            rent: rent,
            rent_due_day: rentDueOn,
            deposit: deposit,
            deposit_due_date: depositDueDate
        };

   
        try {
            if (formType === 'Update Lease'){
                await dispatch(updateLeaseThunk(propertyId, updatedLease));
                navigate(`/properties/${propertyId}`);
            } else if(formType === 'Create Lease'){
                
                await dispatch(addLeaseThunk(propertyId, updatedLease));
                navigate(`/properties/${propertyId}`);
            } 
        } catch(error){
            setErrors(error);
        }    
    }
    

    const getOrdinalSuffix = (num) => {
        if (num === 11 || num === 12 || num === 13) return `${num}th`;
        const lastDigit = num % 10;
        if (lastDigit === 1 ) return `${num}st`;
        if (lastDigit === 2 ) return `${num}nd`;
        if (lastDigit === 3 ) return `${num}rd`;
        return `${num}th`;
    }

    const days = Array.from({ length: 31 }, (_, i) => getOrdinalSuffix(i + 1));

    return (
          
            <div className='lease-form-page'>
                <h2>{formType}</h2> 
                <button onClick={handleDummyData}> Fill dummy data</button>
                <form 
                    onSubmit={handleSubmit}
                    className = 'lease-form'>
                    <label className='lease-form-label'>
                        Start Date
                        <input 
                            required
                            type ="date"
                            className='lease-start-input'
                            value = {startDate}
                            onChange = {(e) => setStartDate(e.target.value)}
                        />
                    </label>
                    {errors?.start_date && <p className="hint">{errors.start_date}</p>}

                    <label className='lease-form-label'>
                        End Date
                        <input 
                            required
                            type ="date"
                            className='lease-end-input'
                            value = {endDate}
                            onChange = {(e) => setEndDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]} 
                        />
                    </label>
                    {errors?.end_date && <p className="hint">{errors.end_date}</p>}

                    <label  className='lease-form-label'>
                        Deposit ($)
                        <input
                            required
                            type='number'
                            className='deposit-input'
                            onChange={(e) => setDeposit(e.target.value === "" ? "" : Number(e.target.value))}
                            value={deposit}
                            step="0.01"
                            min="0" 
                        />
                    </label>
                    {errors?.deposit && <p className="hint">{errors.deposit}</p>}

                    <label className='lease-form-label'>
                        Deposit Due Date
                        <input 
                            required
                            type ="date"
                            className='deposit-due-input'
                            value = {depositDueDate}
                            onChange = {(e) => setDepositDueDate(e.target.value)}
                        />
                    </label>
                    {errors?.deposit_due_date && <p className="hint">{errors.deposit_due_date}</p>}

                    <label  className='lease-form-label'>
                        Rent ($/month)
                        <input
                            type='number'
                            required
                            className='rent-input'
                            onChange={(e) => setRent(e.target.value === "" ? "" : Number(e.target.value))}
                            value={rent}
                            min="0" 
                            step="0.01"
                        />
                    </label>
                    {errors?.rent && <p className="hint">{errors.rent}</p>}

                    <label className='lease-form-label'>
                        Due On
                        <div className = "select-due-day-container">
                            <select
                                className='rent-due-input'
                                value={rentDueOn}
                                required
                                onChange = {e => setRentDueOn (e.target.value)}>
                                <option value = "" disabled> -- Select Day --</option>
                            
                                {days.map((day, index) => (
                                    <option value ={index+1} key = {index}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                            <span className="of-every-month"> of every month</span>
                        </div>
                        
                    </label>
                    {errors?.rent_due_day && <p className="hint">{errors.rent_due_day}</p>}

                    <div className='lease-form-buttons'>
                        <button
                            onClick = {handleCancel}
                            className='cancel-change-button'>
                            Cancel
                        </button>

                        <button className='lease-form-submit-button'>Submit</button>
                    </div>
                
                </form>
            </div>
   
        
    )

}

export default LeaseForm;