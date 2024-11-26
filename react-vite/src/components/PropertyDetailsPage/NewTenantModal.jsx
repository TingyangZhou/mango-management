import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTenantThunk, updateTenantThunk  } from '../../redux/tenants';
import { useModal } from '../../context/Modal';
import "./NewTenantModal.css";

function NewTenantModal({propertyId, tenant, tenantId, formType}) {

    const { closeModal } = useModal();

    const dispatch=useDispatch();
   
    
  
    const [ errors, setErrors ]=useState({});
    const [ firstName, setFirstName ] = useState(tenant?.first_name || "");
    const [ lastName, setLastName ] = useState(tenant?.last_name ||"");
    const [ email, setEmail ] = useState(tenant?.email ||"");
    const [ mobile, setMobile ] = useState(tenant?.mobile ||"");

    const new_tenant = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        mobile: mobile
    }

    const handleCancel = () => {
        closeModal();
    }
   
    
    const handleSubmit = (e) => {
        setErrors({});
        e.preventDefault();
    
        if (formType === "Create Tenant") {
            dispatch(createTenantThunk(propertyId, new_tenant))
                .then(() => {
                    closeModal(); // Call closeModal here
                })
                .catch((error) => {
                    setErrors(error);
                });
        } else{
            dispatch(updateTenantThunk(propertyId, tenantId, new_tenant))
            .then(() => {
                closeModal(); // Call closeModal here
            })
            .catch((error) => {
                setErrors(error);
            });
        }
    
    
    };
    
    

    return (
        <form 
            onSubmit={handleSubmit}
            className = 'new-tenant-form'
        >
            <h3 className="create-tenant-title">{formType}</h3>
            {errors?.message && <p className="hint">{errors.message}</p>}
            <label className='new-tenant-form-label'>
                First Name
                <input 
                    name = "first_name" 
                    required
                    type ="text"
                    className='first-name-input'
                    value = {firstName}
                    onChange = {(e) => setFirstName(e.target.value)}
                />
            </label>
            {errors?.first_name && <p className="hint">{errors.first_name}</p>}

            <label className='new-tenant-form-label'>
                Last Name
                <input 
                    name = "last_name" 
                    required
                    type ="text"
                    className='last-name-input'
                    value = {lastName}
                    onChange = {(e) => setLastName(e.target.value)}
                />
            </label>
            {errors?.last_name && <p className="hint">{errors.last_name}</p>}

            <label className='new-tenant-form-label'>
                Email
                <input 
                    name = "email" 
                    required
                    type ="email"
                    className='email-input'
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                />
            </label>
            {errors?.email && <p className="hint">{errors.email}</p>}

            <label className='new-tenant-form-label'>
                Mobile Phone Number
                <input 
                    name = "mobile" 
                    required
                    type="tel" 
                    pattern="[0-9]{3,}"
                    className='mobile-input'
                    value = {mobile}
                    onChange = {(e) => setMobile(e.target.value)}
                />
            </label>
            {errors?.mobile && <p className="hint">{errors.mobile}</p>}



            <div className='property-form-buttons'>
                <button
                    onClick = {handleCancel}
                    className='cancel-change-button'>
                    Cancel
                </button>

                <button className='property-form-submit-button'>Submit</button>
            </div>
        
        </form>
        
    )
}





export default NewTenantModal;