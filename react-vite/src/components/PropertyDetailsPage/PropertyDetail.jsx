// react-vite/src/components/PropertyDetailPage.jsx

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import {  getOnePropertyThunk } from "../../redux/properties";
import OpenModalButton from '../OpenModalButton';
import ConfirmDeleteFormModal from './ConfirmDeletePropertyModal.jsx'
import LeaseDetail from './LeaseDetail.jsx'
import TenantDetail from './TenantDetail.jsx'

// import { useTheme } from '../../context/ThemeContext';
import './PropertyDetail.css';
import { FaMapMarkerAlt} from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";
import { MdOutlineBedroomParent } from "react-icons/md";
import { MdOutlineBathroom } from "react-icons/md";


const PropertyDetailsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { propertyId } = useParams();
    const [ errors, setErrors ] = useState({})
    const sessionUser = useSelector((state) => state.session.user);
 

    const currentProperty = useSelector(state => state.properties.currentProperty)
    const activeLease = useSelector(state => state.leases.activeLease)
    
    useEffect(()=>{

        dispatch(getOnePropertyThunk(propertyId))
            .catch((error) => {
                // console.log("Error from thunk:", error); // Debugging
                setErrors(error);
            })
    }, [dispatch, propertyId, activeLease])
 
    

    const handleEditProperty =() =>{
        navigate(`/properties/${propertyId}/edit`)
    }

    const handleCreateProperty =() =>{
        navigate(`/properties/new`)
    }

    if (!sessionUser) {
        return <Navigate to='/login'></Navigate>
     }
 

    return (
        <>
        {Object.keys(errors).length !== 0 ? (<p className='hint'>{errors.message}</p>):
        <div className="property-detail-page">
            <div className='property-container'>
                <div className="property-title-new-property-button-container">
                    <h2 className="property-details-title">Property ID: {currentProperty?.id}</h2>
                    <div className="new-property-button-container"> 
                        <button 
                            className='new-property-button'
                            onClick={handleCreateProperty}>
                                New Property
                        </button>
                    </div>
                    
                </div>
                

                <div className= "property-table-button-container">
                    <table className="property-info-table">
                        <tbody>
                        <tr>
                            <td> <FaMapMarkerAlt /> <span style={{ fontWeight: "bold" }}> {currentProperty?.address}</span></td>
                            <td> <BiBuildingHouse /> <span style={{ fontWeight: "bold" }}>{currentProperty?.property_type}</span> </td>
                            <td> <span className={currentProperty?.is_vacant? 'vacant': 'occupied'}> {currentProperty?.is_vacant? 'Vacant': 'Occupied'}</span></td>
                        </tr>
                        <tr>
                            <td> <MdOutlineBedroomParent /> <span style={{ fontWeight: "bold" }}>Bedrooms: </span> {currentProperty?.bedrooms}</td>
                            <td> <MdOutlineBathroom /> <span style={{ fontWeight: "bold" }}>Bathrooms: </span> {currentProperty?.bathrooms}</td>
                            <td> <span style={{ fontWeight: "bold" }}>Sqft: </span> {currentProperty?.sqft} </td>
                        </tr>
                        </tbody>
                    </table>

                    <div className = "property-buttons">
                        
                        <button 
                            className='edit-property-button'
                            onClick={handleEditProperty}>
                                Edit Property
                        </button>
                        <OpenModalButton
                            className = "open-modal-button"
                            buttonText = 'Delete'
                            modalComponent={<ConfirmDeleteFormModal propertyId = {propertyId}/>}
                            onModalClose = {()=> navigate(`/properties/${propertyId}`)}
                        />
                    </div>
                </div>
                
            
            </div>



        </div>
        }

        <LeaseDetail propertyId={propertyId} />
        <TenantDetail propertyId={propertyId} lease={activeLease}/>
            
    </>
    )
}

    export default PropertyDetailsPage;