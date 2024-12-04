//react-vite/src/components/PropertyForm/UpdatePropertyForm.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropertyForm from './PropertyForm'
import { getOnePropertyThunk } from "../../redux/properties"


const UpdatePropertyForm = ()=>{
    const { propertyId }  = useParams();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    
    
    useEffect(()=>{
        dispatch(getOnePropertyThunk(propertyId))
            .catch((error) => {
                // console.log("Error from thunk:", error); 
                setErrors(error);
            })
    }, [dispatch, propertyId])

    const property = useSelector(state => state.properties.currentProperty);

    if (!property) {
        return <p>Loading...</p>;
    }
 

    return (
        <>
            {Object.keys(errors).length !== 0 ? (<p className='hint'>{errors.message}</p>):
                <PropertyForm
                    property={property}
                    formType="Update Property"
                />
            }
        </>
        
    );

};

export default UpdatePropertyForm;