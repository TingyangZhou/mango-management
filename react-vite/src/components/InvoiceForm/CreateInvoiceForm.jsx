//react-vite/src/components/InvoiceForm/CreateInvoiceForm.jsx

import InvoiceForm from './InvoiceForm'


const CreateInvoiceForm = ()=>{
    const invoice ={};
   
 
    return ( 
        <>
        
        <InvoiceForm
            invoice={invoice}
            formType="Create Invoice"
        />
        
        </>
     );

};

export default CreateInvoiceForm;