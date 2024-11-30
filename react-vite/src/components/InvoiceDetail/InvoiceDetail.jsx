import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom'
import {  getOneInvoiceThunk } from "../../redux/invoices.js";

import { AiFillDollarCircle } from "react-icons/ai";
import { GiTempleGate } from "react-icons/gi";
import { TbCalendarDue } from "react-icons/tb";
import { FcViewDetails } from "react-icons/fc";
import { IoIosContact } from "react-icons/io";
import { FaOrcid } from "react-icons/fa6";

import OpenModalButton from '../OpenModalButton';
import RecordPaymentModal from './RecordPaymentModal.jsx'
import ConfirmDeleteInvoiceModal from './ConfirmDeleteInvoiceModal.jsx'
import { updateInvoiceThunk } from  '../../redux/invoices';

import "./InvoiceDetail.css";


const InvoiceDetailsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { invoiceId } = useParams();
    const [ errors, setErrors ] = useState({});
    const [ isEditing, setIsEditing ] = useState(false);

    const sessionUser = useSelector((state) => state.session.user);    

    const invoice = useSelector(state => state.invoices.currentInvoice);
    const tenants = invoice?.tenants;


    const [ formData, setFormData ] = useState({
        item: invoice?.item || "",
        amount: invoice?.amount || 0,
        due_date: invoice?.due_date || "",
        description: invoice?.description || "",

    });

    useEffect(()=>{
        setFormData({
            item: invoice?.item,
            amount: invoice?.amount,
            due_date: invoice?.due_date
                ? new Date(invoice?.due_date).toISOString().split("T")[0] // Convert to YYYY-MM-DD
                : "",
            description: invoice?.description,
        })
    },[invoice])


    
    const handleEditClick=()=>{
        setErrors({});
        setIsEditing(true);
    }


    const handleSaveClick=async(e)=>{
       e.preventDefault();
       setErrors({});
        try{
            
            // console.log("Dispatching updateInvoiceThunk with:", formData);
            // console.log("============invoiceId", invoice?.id)
           
            await dispatch(updateInvoiceThunk(formData, invoice?.id))
            setIsEditing(false);
            // console.log('---------------------------%%%%%%%%%%%%')
            
        } catch(error){
            
            // console.log("============error:", error)
            setIsEditing(true);
            setErrors(error);
                    
        }
     
    }

    useEffect(()=>{
        // console.log("%%%%%%%%%%errors:", errors)
    },[errors])


    const handleCancelClick = () => {
        setIsEditing(false); // Cancel edit mode
    
      };
      
      const handleInputChange=(field, value) =>{
        setFormData(prevData =>(
            {
                ...prevData,
                [field]:value,
            }
        ))
      }

    useEffect(()=>{

        dispatch(getOneInvoiceThunk(invoiceId))
            .catch((error) => {
                // console.log("Error from thunk:", error); // Debugging
                setErrors(error);
            })
    }, [dispatch], invoice)

    if (!sessionUser) {
        return <Navigate to='/login'></Navigate>
     }
 
    
    return(
        <>
        {(errors?.message) ? (<p className="hint">{errors?.message}</p>):
        <div className="invoice-detail-page">
            <div className="invoice-container">
                <div className="new-invoice-header">
                    <h3 className="invoice-id-title"> Invoice ID: {invoice?.id}</h3>
                    <div className= {invoice?.status === "paid" ? "invoice-buttons-container-three-buttons": "invoice-buttons-container-four-buttons"}>
                       
                        <button 
                            onClick = {handleEditClick}
                            className = "edit-invoice-button">
                                Edit
                            </button>
                        {invoice?.status !== "paid" && 
                        <OpenModalButton
                                className = "open-modal-button"
                                buttonText = 'Add Pay'
                                invoiceId = {invoiceId}
                                modalComponent={<RecordPaymentModal invoiceId = {invoiceId}/>}
                                onModalClose = {()=> navigate(`/Invoices/${invoiceId}`)}
                            />
                        }
                         <OpenModalButton
                                className = "open-modal-button"
                                buttonText = 'Delete'
                                invoiceId = {invoiceId}
                                modalComponent={<ConfirmDeleteInvoiceModal invoiceId = {invoiceId}/>}
                                onModalClose = {()=> navigate(`/Invoices/${invoiceId}`)}
                            />
                        
                        <button 
                            onClick={() =>(navigate("/invoices/new"))}
                            className = "new-invoice-button">
                                New Invoice
                        </button>
                    </div>
                  
                </div>
                    <table className="invoice-info-table">
                        <tbody>
                        <tr>
                            <td> <GiTempleGate /> <span style={{ fontWeight: "bold" }}> 
                                    Item: </span> 
                                {isEditing ? (
                                    <>
                                        <input
                                            type='text'
                                            className="edit-invoice-input"
                                            value={formData?.item}
                                            required
                                            onChange ={e=>handleInputChange("item", e.target.value)}
                                        />
                                        {errors?.item && <p className="hint">{errors.item.join(", ")}</p>}
                                    </>
                                    

                                    ):(
                                            invoice?.item
                                        )
                                 }
                                
                            </td>

                            <td><AiFillDollarCircle />  <span style={{ fontWeight: "bold" }}>Amount: </span> 
                                 
                            {isEditing ? (
                                 <>
                                <input
                                    type='text'
                                    required
                                    className="edit-invoice-input"
                                    value={formData?.amount}
                                    onChange ={e=>handleInputChange("amount", e.target.value)}
                                    />
                                {errors?.amount && <p className="hint">{errors.amount.join(", ")}</p>}
                                </>
                                ):(
                                        invoice?.amount
                                    )
                                }
                            </td>
                            {!isEditing && 
                                <td> <TbCalendarDue /> <span style={{ fontWeight: "bold" }}>Created On:</span> {new Date(invoice?.created_at).toLocaleDateString('en-US', {
                                    month: 'short',  // Abbreviated month (e.g., "Nov")
                                    day: 'numeric',  // Day of the month (e.g., "13")
                                    year: 'numeric'  // Full year (e.g., "2024")
                                })}
                                </td>
                            }
                            
                            <td> <TbCalendarDue /> <span style={{ fontWeight: "bold" }}>Due On: </span> 
                            {isEditing?   
                                (<>
                                <input
                                    className="edit-invoice-input"
                                    type="date"
                                    required
                                    onChange={e =>handleInputChange("due_date", e.target.value)}
                                    value={formData?.due_date}
                                />
                                 {errors?.due_date && <p className="hint">{errors.due_date.join(", ")}</p>}
                                </>) :  (new Date(invoice?.due_date).toLocaleDateString('en-US', {
                                            timeZone: 'UTC', // Interpret and display the date in UTC
                                            month: 'short',  // Abbreviated month (e.g., "Mar")
                                            day: 'numeric',  // Day of the month (e.g., "1")
                                            year: 'numeric', // Full year (e.g., "2024")
                                         })
                                        )
                                        
                                    }

                            
                            </td>

                        </tr>

                        <tr>
                            <td colSpan="2"> <FcViewDetails /> <span style={{ fontWeight: "bold" }}> Details: </span> 
                            {isEditing ? 
                                (
                                <>
                                <textarea
                                    className="edit-invoice-input"

                                    onChange={e =>handleInputChange("description", e.target.value)}
                                    value={formData?.description}
                                    /> 
                                     {errors?.description && <p className="hint">{errors.description.join(", ")}</p>}
                                    </>) : (
                                        invoice?.description)
                            }</td>
                            
                            
                            <td className={invoice?.status}> 
                                {invoice?.status}</td>
                            
                        </tr>
                        
                            {isEditing && 
                                <tr>
                                    <td className="cancel-save-button-container">
                                    <button 
                                            className="edit-cancel"
                                            onClick= {handleCancelClick}
                                            >
                                            Cancel
                                        </button>
                                        
                                    </td>
                                    <td><button 
                                            onClick = {handleSaveClick}
                                            className="edit-save">
                                            Save
                                        </button>
                                       </td>
                                    
                                </tr>
                            }

                        </tbody>
                    </table>
                                
                    
                    <table className="property-tenant-info-table">            
                        <tbody> 
                                <tr>    
                                    <td> <FaOrcid /> <span style={{ fontWeight: "bold" }}>Property ID:</span> {invoice?.property?.id}</td>
                                    <td><GiTempleGate /> <span style={{ fontWeight: "bold" }}>Address: </span>{invoice?.property?.address}</td>
                                </tr>
                                <tr>
                                    <td><FaOrcid />  <span style={{ fontWeight: "bold" }}>Lease ID:</span> {invoice?.lease?.id}</td>
                                    <td><TbCalendarDue /> <span style={{ fontWeight: "bold" }}>Term: </span>{invoice?.lease?.start_date
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
                                        : 'No end date available'}</td></tr>
                                   
                                   {!tenants || tenants.length === 0 ? (
                                        <td colSpan="4" className="no-tenant">No tenant on lease</td>
                                        ) : (
                                        <>
                                            {/* Add a title row */}
                                            <tr>
                                            <td colSpan="4" className="tenant-title">Tenants:</td>
                                            </tr>
                                            {/* Render tenants */}
                                            {tenants.reduce((rows, tenant, index) => {
                                            // Start a new row every 2 tenants
                                            if (index % 2 === 0) rows.push([]);
                                            rows[rows.length - 1].push(tenant);
                                            return rows;
                                            }, []).map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {row.map((tenant, tenantIndex) => (
                                                <td key={tenantIndex}>
                                                    <IoIosContact /> {tenant.first_name} {tenant.last_name}
                                                </td>
                                                ))}
                                            </tr>
                                            ))}
                                        </>
                                        )}

                        </tbody>          
                                                     
                </table>    
                    
            </div>
            
        </div>
    
    }
    </>
    )
}

export default InvoiceDetailsPage;