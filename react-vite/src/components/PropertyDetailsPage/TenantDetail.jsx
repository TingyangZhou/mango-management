// react-vite/src/components/PropertyDetailPage.jsx

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { getTenantsThunk } from "../../redux/tenants.js";
import OpenModalButton from '../OpenModalButton/index.js';
import NewTenantModal from './NewTenantModal.jsx'
import ConfirmRemoveTenantModal from './ConfirmRemoveTenantModal.jsx'
import { MdContactMail } from "react-icons/md";


import './TenantDetail.css'


// import { useTheme } from '../../context/ThemeContext';


const TenantDetail = ({propertyId}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ errors, setErrors ] = useState({})
 
    
    const tenants = useSelector(state => state.tenants.tenants);
    const tenants_arr = Object.values(tenants);
    
    useEffect(()=>{
        
        dispatch(getTenantsThunk(propertyId))
            .catch((error) => {
                // console.log("Error from thunk:", error); // Debugging
                console.log('>......................')
                setErrors(error);
            })
    }, [dispatch, propertyId, tenants]);
   
  
    return (
        <>
        {Object.keys(errors).length !== 0 ? (<p className='hint'>{errors.message}</p>):
        <>
        <div className="tenants-page">
            <div className='tenants-container'>
                {tenants_arr.length === 0 ? 
                <><h2 style={{ textAlign: "center"}}>No tenant</h2>
                <div className = "new-tenant-button-container">
                    <OpenModalButton
                        className="new-tenant-modal-button"
                        modalClass="new-tenant-modal" // Pass this to set the modal class
                        buttonText="New Tenant"
                        modalComponent={<NewTenantModal 
                            propertyId={propertyId} 
                            formType= "Create Tenant"/>}
                        onModalClose={() => navigate(`/properties/${propertyId}`)}
                    />
                    </div></>
                    : 
                <>
                   <div className="title-button-container">
                    <div className="tenants-title-section">
                            <h2 className="current-tenants-title">Current Tenant(s)</h2>
                        </div>
                        <div className = "new-tenant-button-container">
                        <OpenModalButton
                            className="new-tenant-modal-button"
                            modalClass="new-tenant-modal" // Pass this to set the modal class
                            buttonText="New Tenant"
                            modalComponent={<NewTenantModal 
                                propertyId={propertyId} 
                                formType= "Create Tenant"/>}
                            onModalClose={() => navigate(`/properties/${propertyId}`)}
                        />
                        </div>
                   </div>
                    
                    
                    <ul className="tenant-list-section">
                        {tenants_arr.map(tenant => (
                            <li key={tenant.id} className = "tenant-list">
                                <MdContactMail style={{ marginRight: '10px' }} /> 
                                <div className ="tenant-info">{tenant.first_name} {tenant.last_name} | {tenant.email} | {tenant.mobile}</div> 
                               <div className= "tenant-buttons">
                                    <OpenModalButton
                                        className = "tenant-modal-button"
                                        buttonText = 'Edit'
                                        modalComponent={<NewTenantModal 
                                            propertyId = {propertyId} 
                                            tenant={tenants[tenant.id]}
                                            tenantId = {tenant.id}
                                            formType= "Edit Tenant"/>}
                                    />
                                    <OpenModalButton
                                        className = "tenant-modal-button"
                                        buttonText = 'Remove'
                                        modalComponent={<ConfirmRemoveTenantModal propertyId = {propertyId} tenantId = {tenant.id}/>}
                                        onModalClose = {()=> navigate(`/properties/${propertyId}`)}
                                    />
                               </div>
                            </li>
                        ))}
                    </ul>                
                
                </>
                }
            
            </div>
        </div>
           
        </>     
        }       
    </>
    )
};

export default TenantDetail;