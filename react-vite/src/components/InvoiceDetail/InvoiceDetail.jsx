import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import {  getOneInvoiceThunk } from "../../redux/invoices.js";

import { AiFillDollarCircle } from "react-icons/ai";
import { GiTempleGate } from "react-icons/gi";
import { TbCalendarDue } from "react-icons/tb";
import { FcViewDetails } from "react-icons/fc";

import "./invoiceDetail.css";


const InvoiceDetailsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { invoiceId } = useParams();
    const [ errors, setErrors ] = useState({})

    const invoice = useSelector(state => state.invoices.currentInvoice);
    const tenants = invoice?.tenants
    
    useEffect(()=>{

        dispatch(getOneInvoiceThunk(invoiceId))
            .catch((error) => {
                // console.log("Error from thunk:", error); // Debugging
                setErrors(error);
            })
    }, [dispatch])

    
    return(
        <>  {Object.keys(errors).length !== 0 ? (<p className='hint'>{errors.message}</p>):
        <div className="invoice-detail-page">
            <div className="invoice-container">
                <div className="new-invoice-header">
                    <h3>Invoice ID: {invoice?.id}</h3>
                    <div className="invoice-buttons-container">
                       
                        <button className = "edit-invoice-button">Edit Invoice</button>
                        <button className = "pay-button">Record Payment</button>
                        <button className = "delete-invoice-button">Delete Invoice</button>
                        <button className = "new-invoice-button">New Invoice</button>
                    </div>
                  
                </div>
                    <table className="invoice-info-table">
                        <tbody>
                        <tr>
                            <td> <GiTempleGate /> {invoice?.item}</td>
                            <td><AiFillDollarCircle />  {invoice?.amount}</td>
                            <td> <TbCalendarDue /> Created On: {new Date(invoice?.created_at).toLocaleDateString('en-US', {
                                    month: 'short',  // Abbreviated month (e.g., "Nov")
                                    day: 'numeric',  // Day of the month (e.g., "13")
                                    year: 'numeric'  // Full year (e.g., "2024")
                                })}
                            </td>
                            <td>
                                {invoice?.due_date
                                    ? new Date(invoice.due_date).toLocaleDateString('en-US', {
                                        timeZone: 'UTC', // Interpret and display the date in UTC
                                        month: 'short',  // Abbreviated month (e.g., "Mar")
                                        day: 'numeric',  // Day of the month (e.g., "1")
                                        year: 'numeric', // Full year (e.g., "2024")
                                    })
                                    : 'No due date available'}
                            </td>

                        </tr>
                        <tr>
                            <td colSpan="3"> <FcViewDetails /> Details: {invoice?.description}</td>
                            <td className={invoice?.status}> {invoice?.status}</td>
                            
                        </tr>
                        </tbody>
                    </table>
                                
                    
                    <table className="invoice-info-table">
                    <tbody>
                    <tr>    
                        <td> Property ID: {invoice?.property?.id}</td>
                        <td><GiTempleGate /> {invoice?.property?.address}</td>
                    
                        <td> Lease Id: {invoice?.lease.id}</td>
                        <td><TbCalendarDue /> Term: {invoice?.lease?.start_date
                            ? new Date(invoice?.lease?.start_date).toLocaleDateString('en-US', {
                                timeZone: 'UTC', // Interpret and display the date in UTC
                                month: 'short',  // Abbreviated month (e.g., "Mar")
                                day: 'numeric',  // Day of the month (e.g., "1")
                                year: 'numeric', // Full year (e.g., "2024")
                            })
                        : 'No start date available'} - {invoice?.lease?.end_date
                            ? new Date(invoice?.lease?.end_date).toLocaleDateString('en-US', {
                                timeZone: 'UTC', // Interpret and display the date in UTC
                                month: 'short',  // Abbreviated month (e.g., "Mar")
                                day: 'numeric',  // Day of the month (e.g., "1")
                                year: 'numeric', // Full year (e.g., "2024")
                            })
                            : 'No end date available'}</td>
                       
                    </tr>
                    </tbody>
                    </table>

                    <table className="invoice-info-table">
                    <tbody>
                        <tr><td>Tenants</td></tr>
                    {tenants.reduce((rows, tenant, index) => {
                   
                   if (index % 3 === 0) rows.push([]);
                   rows[rows.length - 1].push(tenant);
                   return rows;
                   }, []).map((row, rowIndex) => (
                   <tr key={rowIndex}>
                       {row.map((tenant, colIndex) => (
                       <td key={colIndex}>{tenant?.first_name} {tenant?.last_name}</td>
                       ))}
                   </tr>
                   ))}
                    </tbody>
                    </table>              
                    
                   
            </div>
            
        </div>
    }
        </>
    )
}

export default InvoiceDetailsPage;