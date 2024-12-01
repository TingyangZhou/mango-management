import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import './InvoiceForm.css';
import { createInvoiceThunk } from '../../redux/invoices.js';
import { getAllPropertiesThunk } from '../../redux/properties';

const InvoiceForm = ({formType}) =>{
   

    const [ errors, setErrors ] = useState({});
    const [ propertyId, setPropertyId ] = useState("");
    const [ item, setItem ] = useState("");
    const [ dueDate, setDueDate ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ amount, setAmount ] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        dispatch(getAllPropertiesThunk(1, 'all')); 
    }, [dispatch]);

    let occupiedPropertyArr=[];
    const properties = useSelector(state => state.properties.properties);
    if (properties){
        const propertiesArr = Object.values(properties);
        occupiedPropertyArr = propertiesArr.filter(property => property?.is_vacant === false);
    }


    const handleCancel = () => {
        navigate(`/invoices`)
    };


    const handleSubmit = async (e) =>{
        e.preventDefault();
        const newInvoice = {
            property_id:propertyId,
            item: item,      
            amount: amount,
            due_date: dueDate,
            description: description

        };        
        try {
            await dispatch(createInvoiceThunk(newInvoice))
            navigate(`/invoices`)
        } catch(error){
            // console.log("=============error:", error)
            setErrors(error);
     
        }
                 
        }
        
        
    const handleDummyData =(e) => {
        e.preventDefault();
        if (occupiedPropertyArr.length === 0) {
            alert("No leased property available to set data.");
            return; // Exit the function early
        }
        setPropertyId(occupiedPropertyArr[0].id);
        setDueDate(new Date("2025-1-1").toISOString().split("T")[0]);
        setAmount(1000);
        setItem("Deposit");
        setDescription("Deposit for property 1") 
    }

    return (

        <div className='invoice-form-page'>
            <button type="button" onClick = {handleDummyData}>dummy data</button>
            <h2>{formType}</h2>
            {errors?.message && <p className="hint">{errors.message}</p>}
            <form 
                onSubmit={handleSubmit}
                className = 'invoice-form'>
                <label className='invoice-form-label'>
                    Choose a Leased Property
                    <select
                        className='select-property-input'
                        value={propertyId}
                        required
                        onChange = {e => setPropertyId (e.target.value)}>
                        <option value = "" disabled> -- Select Property --</option>
                    
                        {occupiedPropertyArr.map((property) => (
                            <option value ={property.id} key = {property.id}>
                                {property.address}
                            </option>
                        ))}
                    </select>
                </label>
                {errors?.property_id && <p className="hint">{errors.property_id}</p>}

                <label className="invoice-form-label">
                    Item
                    <input
                        id="invoice-item-input"
                        type="text"
                        name="item"
                        value={item}
                        required
                        onChange={(e) => setItem(e.target.value)}
                    /> 
                </label>
                {errors?.item && <p className="hint">{errors.item}</p>}

                <label  className='invoice-form-label'>
                    Due Date
                    <input
                        className="invoice-due-input"
                        type="date"
                        required
                        onChange={e =>setDueDate(e.target.value)}
                        value={dueDate}
                    />
                </label>
                {errors?.due_date && <p className="hint">{errors.due_date}</p>}

                <label  className='invoice-form-label'>
                    Description
                    <textarea
                        type='text'
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />
                </label>
                {errors?.description && <p className="hint">{errors.description}</p>}

                <label  className='invoice-form-label'>
                    Amount($)
                    <input
                        className="invoice-amount-input"
                        type='number'
                        required
                        onChange={(e) => setAmount(e.target.value)}
                        value={amount}
                        min="0.01" 
                        step="0.01"
                    />
                </label>
                {errors?.amount && <p className="hint">{errors.amount}</p>}

                <div className='invoice-form-buttons'>
                    <button
                        type = "button"
                        onClick = {handleCancel}
                        className='cancel-change-button'>
                        Cancel
                    </button>

                    <button type="submit" className='form-submit-button'>Submit</button>
                </div>
               
            </form>
        </div>
    )

}

export default InvoiceForm;