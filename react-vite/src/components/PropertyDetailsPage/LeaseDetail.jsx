// react-vite/src/components/PropertyDetailPage.jsx

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getActiveLeaseThunk } from "../../redux/leases.js";
import OpenModalButton from '../OpenModalButton';
import ConfirmDeleteFormModal from './ConfirmDeleteFormModal.jsx'
import './LeaseDetail.css'

// import { useTheme } from '../../context/ThemeContext';


const LeaseDetail = ({propertyId}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ errors, setErrors ] = useState({})
 

    const activeLease = useSelector(state => state.leases.activeLease)
    
    useEffect(()=>{
        dispatch(getActiveLeaseThunk(propertyId))
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

    // const handleEditProperty =() =>{
    //     navigate(`/properties/${propertyId}/edit`)
    // }

    // const handleCreateProperty =() =>{
    //     navigate(`/properties/new`)
    // }

    return (
        <>
        {Object.keys(errors).length !== 0 ? (<p className='hint'>{errors.message}</p>):
        <div className="active-lease-page">
            <div className='active-lease-container'>
                <h2 className="current-lease-title">Current Lease</h2>

            {!activeLease? <h2>No active lease is found for this property</h2> : 
                <table className="lease-info-table">
               
                    <tr>
                        
                        <td> Start Date: {activeLease?.start_date}</td>
                        <td> End Date: {activeLease?.end_date}</td>
                    </tr>

                    <tr>
                        <td> Rent: ${activeLease?.rent} </td>
                        <td>
                            Rent Due:{" "}
                            {activeLease?.rent_due_day === 1
                                ? "1st of every month"
                                : `${activeLease?.rent_due_day}${getOrdinalSuffix(activeLease?.rent_due_day)} of every month`}
                        </td>

                       
                    </tr>
                    
                    
                    <tr>
                        <td> Deposit ${activeLease?.deposit} </td>
                        <td> Deposit Due: {activeLease?.deposit_due_date}</td>
                       
                    </tr>
                   
                </table>
            }

                <div className = "active-lease-buttons">
                    <button 
                        className='new-lease-button'
                        // onClick={handleCreateLease}
                        >
                            New Lease
                    </button>

                    {!activeLease? "" : <button 
                        className='edit-lease-button'
                        // onClick={handleEditLease}
                        >
                            Edit Lease
                    </button> }

                    {!activeLease? "" :
                    <OpenModalButton
                        className = "open-modal-button"
                        buttonText = 'Remove Lease'
                        modalComponent={<ConfirmDeleteFormModal propertyId = {propertyId}/>}
                        onModalClose = {()=> navigate(`/properties/${propertyId}`)}
                    />
                    }
                   
                </div>
            
            </div>



        </div>
        }
            
    </>
    )
}

    export default LeaseDetail;