//react-vite/src/components/PropertyForm/CreatePropertyForm.jsx

import PropertyForm from './PropertyForm'
import { useLocation } from "react-router-dom";

const CreatePropertyForm = ()=>{
    const location = useLocation();
    const property ={};
    const propertyId = location.state?.propertyId || "";
    // console.log("Location state:", location.state); // Debug log

    return (
        <PropertyForm
            property={property}
            propertyId = {propertyId}
            formType="Create Property"
        />
    );

};

export default CreatePropertyForm;