//react-vite/src/components/PropertyForm/CreatePropertyForm.jsx

import PropertyForm from './PropertyForm'

const CreatePropertyForm = ()=>{
    const property ={};

    return (
        <PropertyForm
            property={property}
            formType="Create Property"
        />
    );

};

export default CreatePropertyForm;