import { useEffect, useState } from 'react'
import './Invoices.css'
import { getAllFilteredInvoicesPageThunk, searchInvoicesThunk } from '../../redux/invoices'
import { useDispatch } from 'react-redux'
import { useNavigate, Navigate, useSearchParams} from 'react-router-dom'
import { useSelector } from 'react-redux';

import { FaSearch } from "react-icons/fa"



export default function Invoices (){
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    
    const [ isPaidChecked, setIsPaidChecked ] = useState(false);
    const [ isOutstandingChecked, setIsOutstandingChecked ] = useState(false);
    const [ isOverdueChecked, setIsOverdueChecked ] = useState(false);
    const [ filterBy, setFilterBy ] = useState("");
    const [ page, setPage] = useState(1);
    const [ numPages, setNumPages] = useState(1)
    const per_page = 10;
    

    const [ searchInput, setSearchInput ] = useState("");

    const sessionUser = useSelector((state) => state.session.user);
    const invoices = useSelector((state) => state.invoices.invoices);
    const num_invoices = useSelector((state) => state.invoices.num_invoices);
    const invoices_arr = Object.values(invoices);
   
    const num_pages = Math.ceil (num_invoices/per_page);
    const sortedInvoices = invoices_arr.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
            return dateB - dateA;

    });
    
    
    const handleCreateInvoice =() =>{
        navigate(`/invoices/new`)
    }


    const handlePaidChange = (e) =>{
        setPage(1);
        setIsPaidChecked(e.target.checked);
        setFilterBy(prev=>{
            const filters = new Set (prev.split(",").filter(Boolean));
            if (e.target.checked){
                filters.add("paid");
            } else{
                filters.delete("paid");
            }
            return Array.from(filters).join(",");
        })
              
    }

    const handleOutstandingChange = (e) =>{
        setPage(1);
        setIsOutstandingChecked(e.target.checked);
        setFilterBy(prev=>{
            const filters = new Set (prev.split(",").filter(Boolean));
            if (e.target.checked){
                filters.add("outstanding");
            } else{
                filters.delete("outstanding");
            }
            return Array.from(filters).join(",");
        })
              
    }

    const handleOverdueChange = (e) =>{
        setIsOverdueChecked(e.target.checked);
        setPage(1);
        setFilterBy(prev=>{
            const filters = new Set (prev.split(",").filter(Boolean));
            if (e.target.checked){
                filters.add("overdue");
            } else{
                filters.delete("overdue");
            }
            return Array.from(filters).join(",");
        })
              
    }
    
    const handlePageClick = (pageNumber) => {
        // console.log(pageNumber);
        setPage(pageNumber);
   
    };

    const handleChange =(e) =>{
        try{
            setSearchInput(e.target.value)
            // console.log("e.target.value-----------------", e.target.value)
            dispatch(searchInvoicesThunk(e.target.value))
        } catch(e){
            
            setErrors(e);
        }
    }
    

    useEffect(()=>{
        setErrors({});
        // console.log("=======useEffect===========")
        console.log("==================filterBy:", filterBy)
        dispatch(getAllFilteredInvoicesPageThunk(filterBy, page, per_page));
        
        // console.log("===========page:", page)
        console.log('num_invoices:', num_invoices);
  
    }, [dispatch, filterBy, page, per_page])

   
    if (!sessionUser) {
        return <Navigate to='/login'></Navigate>
     }
 

    return (
        <div className='invoices-page'>
            
            <div className="invoice-list-header">
                <div className='filter-container'>
                    <label className='checkbox-label'>
                        <input 
        
                            type="checkbox" 
                            id="filter-paid" 
                            checked = {isPaidChecked}
                            onChange = {handlePaidChange}
                        /> 
                            Paid
                    </label>
                    <label className='checkbox-label'>
                        <input 
                            type="checkbox" 
                            id="filter-outstanding" 
                            checked = {isOutstandingChecked}
                            onChange = {handleOutstandingChange}
                            />
                            Outstanding
                    </label>
                    <label className='checkbox-label'>
                        <input 
                            type="checkbox" 
                            id="filter-overdue" 
                            checked = {isOverdueChecked}
                            onChange = {handleOverdueChange}
                            />
                            Overdue
                    </label>
                </div>

                <div className="search-bar-container">
                    <FaSearch className='search-icon'/>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search invoices by property or item..."
                        onChange={(e) => {handleChange(e)}}
                        value={searchInput}
           
                ></input>
                </div>
                {errors?.message && <p className="hint">{errors.message}</p>}
                
                <div className='new-invoice-button-container'>
                    <button  
                        onClick={handleCreateInvoice}
                        className='new-invoice-button-on-listPage'>
                            New Invoice
                        </button>
                </div>
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

            <footer className = 'page-footer'>
                <div className = 'curr-page'>page {page}</div>
                <div className = 'page-list'>
                {Array.from({ length: num_pages }, (_, i) => (
                    <span  
                        className= "page-number"
                        key={i + 1}
                        onClick={()=>handlePageClick(i+1)}
                        style={{
                            margin: "0 5px",
                            textDecoration: page === i + 1 ? "underline" : "none",
                            fontWeight:page === i + 1 ? "bold" : "normal",
                       
                        }}
                    >
                        {i + 1}
                    </span>
                       )) }
                </div>
                

            </footer>

           
        </div>
    )
}