import { useEffect, useState } from 'react'
import './Invoices.css'
import { getAllInvoicesThunk } from '../../redux/invoices'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'


export default function Invoices (){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ errors, setErrors ] = useState("");

    const  invoices = useSelector((state) => state.invoices.invoices);

    const invoices_arr = Object.values(invoices);
 
    const sortedInvoices = invoices_arr.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
            return dateB - dateA;

    });
    
    
    const handleCreateInvoice =() =>{
        navigate(`/invoices/new`)
    }
      

    useEffect(()=>{
        // console.log("=======useEffect===========")
        dispatch(getAllInvoicesThunk())
        .catch(error => {
            setErrors(error);
        });
    }, [dispatch])

    return (
        <div className='invoices--page'>
            <div className='new-invoice-button-container'>
                <button  
                    onClick={handleCreateInvoice}
                    className='create-invoice-button-on-listPage'>
                        New Invoice
                    </button>
            </div>
           
            <table>
                <thead>
                    <tr>    
                        <th>Invoice ID</th>
                        <th>Property</th>
                        <th>Item</th>
                        <th>Amount ($)</th>
                        <th>Due on</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedInvoices.map((invoice, index) => (
                        <tr key={index}
                            onClick={() => navigate(`/properties/${property.id}`)}>
                            <td>{invoice.id}</td>
                            <td>{invoice.property.address}</td>
                            <td>{invoice.item}</td>
                            <td>{invoice.amount}</td>
                            <td>{invoice.due_date}</td>
                            <td>{invoice.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

           
        </div>
    )
}