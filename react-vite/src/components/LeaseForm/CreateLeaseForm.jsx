//react-vite/src/components/LeaseForm/CreateLeaseForm.jsx

import LeaseForm from './LeaseForm'
import { useParams } from 'react-router-dom'

const CreateLeaseForm = ()=>{
    const lease ={};
    const { propertyId } = useParams();

    return (
        <LeaseForm
            lease={lease}
            propertyId = {propertyId}
            formType="Create Lease"
        />
    );

};

export default CreateLeaseForm;