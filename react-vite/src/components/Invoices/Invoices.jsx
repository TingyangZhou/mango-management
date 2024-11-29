import { useEffect } from 'react'
import './Invoices.css'
import { getAllInvoicesThunk } from '../../redux/invoices'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';



export default function Invoices (){
    const dispatch = useDispatch();
    const navigate = useNavigate();


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
        dispatch(getAllInvoicesThunk());
    }, [dispatch])

   
    

    return (
        <div className='invoices--page'>
            <div className='new-invoice-button-container'>
                <button  
                    onClick={handleCreateInvoice}
                    className='new-invoice-button-on-listPage'>
                        New Invoice
                    </button>
            </div>
           
            <table className="invoice-list-table">
                <thead>
                    <tr>    
                        <th>Invoice ID</th>
                        <th>Property</th>
                        <th>Item</th>
                        <th>Amount ($)</th>
                        <th>Created on</th>
                        <th>Due on</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedInvoices.map((invoice, index) => (
                        <tr key={index}
                            onClick={() => navigate(`/invoices/${invoice.id}`)}>
                            <td>{invoice.id}</td>
                            <td>{invoice.property.address}</td>
                            <td>{invoice.item}</td>
                            <td>{invoice.amount}</td>
                            <td>{invoice?.created_at
                                    ? new Date(invoice.created_at).toLocaleDateString('en-US', {
                                        timeZone: 'UTC', // Interpret and display the date in UTC
                                        month: 'short',  // Abbreviated month (e.g., "Mar")
                                        day: 'numeric',  // Day of the month (e.g., "1")
                                        year: 'numeric', // Full year (e.g., "2024")
                                    })
                                    : 'No due date available'}
                            </td>
                            <td>{invoice?.due_date
                                    ? new Date(invoice.due_date).toLocaleDateString('en-US', {
                                        timeZone: 'UTC', // Interpret and display the date in UTC
                                        month: 'short',  // Abbreviated month (e.g., "Mar")
                                        day: 'numeric',  // Day of the month (e.g., "1")
                                        year: 'numeric', // Full year (e.g., "2024")
                                    })
                                    : 'No due date available'}
                            </td>
                            <td className = {invoice.status}>{invoice.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

           
        </div>
    )
}