// react-vite/src/components/LeaseDetail.jsx

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { getActiveLeaseThunk, getExpiredLeaseThunk } from "../../redux/leases.js";
import OpenModalButton from '../OpenModalButton';
import ConfirmDeleteLeaseModal from './ConfirmDeleteLeaseModal.jsx'
import ConfirmTerminateLeaseModal from './ConfirmTerminateLeaseModal.jsx'
import ConfirmDeleteContractModal from './ConfirmDeleteContractModal.jsx'
import DragAndDropUploadModal from './DragAndDropUploadModal.jsx'
import TenantDetail from './TenantDetail.jsx'
import './LeaseDetail.css'
import { TbCalendarDue } from "react-icons/tb";
import { AiFillDollarCircle } from "react-icons/ai";
import { CiCalendarDate } from "react-icons/ci";
import { RiExpandUpDownLine } from "react-icons/ri";

// import { useTheme } from '../../context/ThemeContext';


const LeaseDetail = ({propertyId}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ errors, setErrors ] = useState({});

    const activeLeases = useSelector(state => state.leases.activeLeases)
    const expiredLeases = useSelector(state => state.leases.expiredLeases)
    const activeLeases_arr = Object.values(activeLeases)
    const expiredLeases_arr = Object.values(expiredLeases)

    const sortedActiveLeases = activeLeases_arr.sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
            return dateA - dateB;

    });
    const sortedExpiredLeases = expiredLeases_arr.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
            return dateB - dateA;

    });

    const currentDate = new Date(); // Get the current date

    sortedActiveLeases.map(activeLease =>{
        const endDate = new Date(activeLease?.end_date);
        if (activeLease?.end_date){
            const timeDifference = endDate - currentDate; // Difference in milliseconds
            activeLease.daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        }
    
        activeLease.fileUrl = activeLease?.lease_doc;
    })
    
          

    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    
    useEffect(()=>{
        dispatch(getActiveLeaseThunk(propertyId))
            .catch((error) => {
                // console.log("Error from thunk:", error); // Debugging
                setErrors(error);
            })
        
    }, [dispatch, propertyId])

    useEffect(()=>{
        dispatch(getExpiredLeaseThunk(propertyId))
        .catch((error) => {
            // console.log("Error from thunk:", error); // Debugging
            setErrors(error);
        })
    }, [dispatch, propertyId])
 
    function getOrdinalSuffix(day) {
        if (day % 10 === 1 && day % 100 !== 11) return "st";
        if (day % 10 === 2 && day % 100 !== 12) return "nd";
        if (day % 10 === 3 && day % 100 !== 13) return "rd";
        return "th";
      }

    
    const handleCreateLease = () =>{
        navigate(`/properties/${propertyId}/leases/new`);
    }

    const handleEditLease = () =>{
        navigate(`/properties/${propertyId}/leases/edit`);
    }

    return (
        <>
        {Object.keys(errors).length !== 0 ? (<p className='hint'>{errors.message}</p>):
        <>
        <div className="active-lease-page">
            <div className='active-lease-container'>
                {sortedActiveLeases.length === 0 ?
                    <div className="no-active-lease-container">
                        <h2 className="current-lease-title">Current Lease </h2>
                        <table className="no-lease-info-table">
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: "center"}}>No active lease is found for this property</td>
                                </tr>
                            </tbody>
                                
                        </table> 
                        <button 
                            className={sortedActiveLeases.length !== 0? 'hidden':'new-lease-button'}
                            onClick={handleCreateLease}
                            >
                                New Lease
                        </button>
                    </div>
                    :
                    sortedActiveLeases.map((activeLease, index) =>(
                        <div className="have-active-lease-container">
                        <div className="current-lease-section">
                            <h2 className="current-lease-title">Current Lease ID: {activeLease?.id}</h2>
                            <h2 className="days-remaining">Days Remaining: {activeLease?.daysRemaining}</h2>
                        </div>

                        <div className="table-button-container">
                                    
                            <table className="lease-info-table">
                                <tbody>
                                
                            
                                <tr key={index}>
                                    
                                    <td> <CiCalendarDate /> <span style={{ fontWeight: "bold" }}>Start:</span> {new Date(activeLease?.start_date).toLocaleDateString('en-US', {
                                        timeZone: 'UTC',
                                        month: 'short',  // Abbreviated month (e.g., "Nov")
                                        day: 'numeric',  // Day of the month (e.g., "13")
                                        year: 'numeric'  // Full year (e.g., "2024")
                                    })}</td>
                                    <td> <CiCalendarDate /> <span style={{ fontWeight: "bold" }}>End:</span> {new Date(activeLease?.end_date).toLocaleDateString('en-US', {
                                        timeZone: 'UTC',
                                        month: 'short',  // Abbreviated month (e.g., "Nov")
                                        day: 'numeric',  // Day of the month (e.g., "13")
                                        year: 'numeric'  // Full year (e.g., "2024")
                                    })}</td>
                                
                                </tr>

                                <tr>
                                    <td> <AiFillDollarCircle /> <span style={{ fontWeight: "bold" }}>Rent: </span> ${activeLease?.rent} </td>
                                    
                                    <td>
                                        <TbCalendarDue /> <span style={{ fontWeight: "bold" }}>Rent Due: </span>
                                        {activeLease?.rent_due_day === 1
                                            ? "1st of every month"
                                            : `${activeLease?.rent_due_day}${getOrdinalSuffix(activeLease?.rent_due_day)} of every month`}
                                    </td>
                                </tr>
                                
                                
                                <tr>
                                    <td> <AiFillDollarCircle /> <span style={{ fontWeight: "bold" }}>Deposit: </span> ${activeLease?.deposit} </td>

                                    <td> <CiCalendarDate /> <span style={{ fontWeight: "bold" }}>Deposit Due: </span> {new Date(activeLease?.deposit_due_date).toLocaleDateString('en-US', {
                                        timeZone: 'UTC',
                                        month: 'short',  // Abbreviated month (e.g., "Nov")
                                        day: 'numeric',  // Day of the month (e.g., "13")
                                        year: 'numeric'  // Full year (e.g., "2024")
                                    })}</td>
                                                            
                                </tr>

                                {activeLease?.fileUrl ? (
                            <tr className='lease-doc'>
                                <td>
                                <a className="lease-link" href={activeLease?.fileUrl} target="_blank" rel="noopener noreferrer">
                                    Review Lease Contract
                                </a>
                                </td>
                                <td>
                                    <OpenModalButton
                                        className = "delete-contract-button"
                                        buttonText = 'Remove Contract'
                                        modalComponent={<ConfirmDeleteContractModal propertyId = {propertyId}/>}
                                        onModalClose = {()=> navigate(`/properties/${propertyId}`)}
                                    />
                                    
                                </td>
                            </tr>
                            ) : 
                            <tr>
                                <td colSpan='2'>
                                <OpenModalButton
                                        className = "add-lease-button"
                                        buttonText = 'Add Lease Contract'
                                        modalComponent={<DragAndDropUploadModal propertyId = {propertyId}/>}
                                        onModalClose = {()=> navigate(`/properties/${propertyId}`)}
                                    />                            
                                </td>
                            </tr>
                            }
                        
                    
                                </tbody>
                            </table>
                    

                            <div className = "active-lease-buttons">
                                

                                <button 
                                    className='edit-lease-button'
                                    onClick={handleEditLease}
                                    >
                                        Edit Lease
                                </button> 

                            
                                <OpenModalButton
                                    className = "open-modal-button"
                                    buttonText = 'Terminate'
                                    modalComponent={<ConfirmTerminateLeaseModal propertyId = {propertyId}/>}
                                    onModalClose = {()=> navigate(`/properties/${propertyId}`)}
                                />
                                
                            
                                <OpenModalButton
                                    className = "open-modal-button"
                                    buttonText = 'Delete'
                                    modalComponent={<ConfirmDeleteLeaseModal 
                                                    propertyId = {propertyId}
                                                    leaseId = {activeLease?.id}/>}
                                    onModalClose = {()=> navigate(`/properties/${propertyId}`)}
                                />
                        
                            </div>
                        
                        </div>
                        <TenantDetail propertyId={propertyId} lease={activeLease}/>
                    </div>
                    ))
                             
    
                } 

                

            </div>
            {sortedExpiredLeases.length !== 0 && 
        <button 
            className = "toggle-expand-button"
            onClick={toggleExpand}>
                {isExpanded ? "Hide Expired Leases" : "Show Expired Leases"} <RiExpandUpDownLine />
        </button> }
        
        {isExpanded && (
            <div className="expired-lease-container">
                <table className = 'expired-lease-table'>
                    <thead  className = 'expired-lease-table-header'>
                        <tr>
                            <th>Lease ID</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Rent ($/month)</th>
                            <th>Deposit ($)</th>
                            <th>Delete Lease</th>
                        </tr>
                    </thead>
                    <tbody  className = 'expired-lease-table-body'>
                        {sortedExpiredLeases.map((lease, index) => (
                            <tr key={index}>
                                <td>{lease.id}</td>
                                <td>{lease.start_date}</td>
                                <td>{lease.end_date}</td>
                                <td>{lease.rent}</td>
                                <td>{lease.deposit}</td>
                                <td><OpenModalButton
                                    className = "open-modal-button"
                                    buttonText = 'Delete'
                                    modalComponent={<ConfirmDeleteLeaseModal 
                                                    propertyId = {propertyId}
                                                    leaseId = {lease?.id}/>}
                                    onModalClose = {()=> navigate(`/properties/${propertyId}`)}
                                    />
                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        </div>
        
        
        </>     
        }
            
    </>
    )
};

export default LeaseDetail;