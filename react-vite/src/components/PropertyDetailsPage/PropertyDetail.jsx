// react-vite/src/components/PropertyDetailPage.jsx

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {  getOnePropertyThunk } from "../../redux/properties";
import OpenModalButton from '../OpenModalButton';
import ConfirmDeleteFormModal from './ConfirmDeleteFormModal.jsx'
import LeaseDetail from './LeaseDetail.jsx'

// import { useTheme } from '../../context/ThemeContext';
import './PropertyDetail.css';
import { FaMapMarkerAlt} from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";
import { MdOutlineBedroomParent } from "react-icons/md";
import { MdOutlineBathroom } from "react-icons/md";


const StockDetailsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { propertyId } = useParams();
    const [ errors, setErrors ] = useState({})
 

    const currentProperty = useSelector(state => state.properties.currentProperty)
    
    useEffect(()=>{

        dispatch(getOnePropertyThunk(propertyId))
            .catch((error) => {
                // console.log("Error from thunk:", error); // Debugging
                setErrors(error);
            })
    }, [dispatch, propertyId])
 
    

    const handleEditProperty =() =>{
        navigate(`/properties/${propertyId}/edit`)
    }

    const handleCreateProperty =() =>{
        navigate(`/properties/new`)
    }

    return (
        <>
        {Object.keys(errors).length !== 0 ? (<p className='hint'>{errors.message}</p>):
        <div className="property-detail-page">
            <div className='property-container'>
                <h2 className="property-details-title">Property Details</h2>
                <table className="property-info-table">
                    
                    <tr>
                        <td> <FaMapMarkerAlt /> {currentProperty?.address}</td>
                        <td> <BiBuildingHouse /> {currentProperty?.property_type}</td>
                        <td> <span className={currentProperty?.is_vacant? 'vacant': 'occupied'}> {currentProperty?.is_vacant? 'Vacant': 'Occupied'}</span></td>
                    </tr>
                    <tr>
                        <td> <MdOutlineBedroomParent /> Bedrooms: {currentProperty?.bedrooms}</td>
                        <td> <MdOutlineBathroom /> Bathrooms: {currentProperty?.bathrooms}</td>
                        <td> Sqft: {currentProperty?.sqft} </td>
                    </tr>
                </table>

                <div className = "property-buttons">
                    <button 
                        className='new-property-button'
                        onClick={handleCreateProperty}>
                            New Property
                    </button>

                    <button 
                        className='edit-property-button'
                        onClick={handleEditProperty}>
                            Edit Property
                    </button>
                    <OpenModalButton
                        className = "open-modal-button"
                        buttonText = 'Remove Property'
                        modalComponent={<ConfirmDeleteFormModal propertyId = {propertyId}/>}
                        onModalClose = {()=> navigate(`/properties/${propertyId}`)}
                    />
                </div>
            
            </div>



        </div>
        }

        <LeaseDetail propertyId={propertyId} />
            
    </>
    )
}

    export default StockDetailsPage;