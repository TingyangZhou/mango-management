import { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './PropertyForm.css'
import { updatePropertyThunk, createPropertyThunk } from '../../redux/properties.js'

const PropertyForm = ({property, propertyId, formType}) =>{
    const [ errors, setErrors ] = useState({});
    const [ address, setAddress ] = useState(property?.address || "");
    const [ property_type, setProperty_type ] = useState(property?.property_type || "");
    const [ bedrooms, setBedrooms ] = useState(property?.bedrooms ||0);
    const [ bathrooms, setBathrooms ] = useState(property?.bathrooms ||0);
    const [ sqft, setSqft ] = useState(property?.sqft ||0);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    let handleCancel;

    

    if (formType === "Create Property") {
        handleCancel = () => {
            navigate(`/properties/${propertyId}`)
        }
    } else if (formType === "Update Property"){
        handleCancel = () => {
            navigate(`/properties/${property.id}`)
        }
    }
    
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const updatedProperty = {...property, address, property_type, bedrooms, bathrooms, sqft};

        try {
            if (formType === 'Update Property'){
                await dispatch(updatePropertyThunk(updatedProperty, updatedProperty.id))
                navigate(`/properties/${property.id}`)
            } else if (formType === 'Create Property') {
                // Wait for the thunk to resolve and return the created property
                const createdProperty = await dispatch(createPropertyThunk(updatedProperty));
                
                if (createdProperty?.id) {
                    console.log("Navigating to created property:", createdProperty.id);
                    navigate(`/properties/${createdProperty.id}`);
                } else {
                    console.error("Error: Created property ID is undefined");
                }
            }
        } catch(error){
            setErrors(error);
        }
        
     
    }


    return (

        <div className='property-form-page'>
            <h2>{formType}</h2>
            {errors?.message && <p className="hint">{errors.message}</p>}
            <form 
                onSubmit={handleSubmit}
                className = 'property-form'>
                <label className='property-form-label'>
                    Address
                    <input 
                        name = "address" 
                        required
                        type ="text"
                        className='property-address-input'
                        value = {address}
                        onChange = {(e) => setAddress(e.target.value)}
                    />
                </label>
                {errors?.address && <p className="hint">{errors.address}</p>}

                <label className="property-form-label">
                    Property Type
                    <select
                        id="propertyType"
                        name="property_type"
                        value={property_type}
                        required
                        onChange={(e) => setProperty_type(e.target.value)}
                    >
                        <option value="" disabled>
                            Select a property type
                        </option>
                        <option value="House">House</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Apartment">Apartment</option>
                    </select>
                </label>
                {errors?.property_type && <p className="hint">{errors.property_type}</p>}

                <label  className='property-form-label'>
                    Bedrooms
                    <input
                        type='number'
                        required
                        onChange={(e) => setBedrooms(e.target.value === "" ? "" : Number(e.target.value))}
                        value={bedrooms}
                        step="1"
                        min="0" 
                    />
                </label>
                {errors?.bedrooms && <p className="hint">{errors.bedrooms}</p>}

                <label  className='property-form-label'>
                    Bathrooms
                    <input
                        type='number'
                        required
                        onChange={(e) => setBathrooms(e.target.value === "" ? "" : Number(e.target.value))}
                        value={bathrooms}
                        min="0" 
                        step="1"
                    />
                </label>
                {errors?.bathrooms && <p className="hint">{errors.bathrooms}</p>}

                <label  className='property-form-label'>
                    Sqft
                    <input
                        type='number'
                        onChange={(e) => setSqft(e.target.value === "" ? "" : Number(e.target.value))}
                        value={sqft}
                        min="1" 
                        step="1"
                        required
                    />
                </label>
                {errors?.sqft && <p className="hint">{errors.sqft}</p>}

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
        </div>
    )

}

export default PropertyForm;