import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTenantThunk, updateTenantThunk  } from '../../redux/tenants';
import { useModal } from '../../context/Modal';
import "./NewTenantModal.css";

function NewTenantModal({propertyId, tenantId, formType}) {

    const { closeModal } = useModal();

    const dispatch=useDispatch();
    const tenants = useSelector(state => state.tenants);
    const tenant = tenants.tenants[tenantId];


    const [ errors, setErrors ]=useState({});
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ mobile, setMobile ] = useState("");
   
    useEffect(()=>{
        setFirstName(tenant?.first_name);
        setLastName(tenant?.last_name);
        setEmail(tenant?.email);
        setMobile(tenant?.mobile); 
    }, [tenant?.email, tenant?.first_name, tenant?.last_name, tenant?.mobile])
   

    const new_tenant = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        mobile: mobile
    }

    const handleDummy=()=>{
        setFirstName("Alan");
        setLastName("Tan"),
        setEmail("alan@aa.io"),
        setMobile("5555555555")
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
        <>
        <button 
                className="fill-tenant-dummy-button" 
                onClick={handleDummy}
            >dummy data</button>
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
                    name="mobile" 
                    required
                    type="text" 
                    pattern="[0-9]{3,}" 
                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9-]/g, '')}
                    title="Please enter at least 3 characters, only digits are allowed" 
                    className="mobile-input"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                />

            </label>
            {errors?.mobile && <p className="hint">{errors.mobile}</p>}



            <div className='property-form-buttons'>
                <button
                    type="button" 
                    onClick = {handleCancel}
                    className='cancel-change-button'>
                    Cancel
                </button>

                <button 
                    type="submit" 
                    className='property-form-submit-button'>
                        Submit
                </button>
            </div>
        
        </form>
        </>
    )
}





export default NewTenantModal;