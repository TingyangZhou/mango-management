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
 
    let tenants_arr;
    const tenants = useSelector(state => state.tenants);
    tenants_arr= Object.values(tenants.tenants);
    
     
    const activeLease = useSelector(state => state.leases.activeLease)
    
    useEffect(()=>{
        
        dispatch(getTenantsThunk(propertyId))
            .catch((error) => {
                // console.log("Error from thunk:", error); // Debugging
                setErrors(error);
            })
    }, [dispatch, propertyId, activeLease]);
  
    return (
        <>
        {Object.keys(errors).length !== 0 ? (<p className='hint'>{errors.message}</p>):
        
    
            <div className='tenants-container'>
                 
                {tenants_arr.length === 0 ? 
                <div className="no-tenant-container">
                    <h2 className="no-tenant-title">Add your first tenant!</h2>
                    {activeLease && <div className = "new-tenant-button-container">
                        <OpenModalButton
                            className="new-tenant-modal-button"
                         
                            buttonText="New Tenant"
                            modalComponent={<NewTenantModal 
                                propertyId={propertyId} 
                                formType= "Create Tenant"/>}
                            onModalClose={() => navigate(`/properties/${propertyId}`)}
                        />
                    </div>}
                    
                </div>
                : 
                <>
                   <div className="title-button-container">
                        <div className="tenants-title-section">
                            <p className="current-tenants-title">Tenants</p>
                        </div>
                        <div className = "new-tenant-button-container">
                        <OpenModalButton
                            className="new-tenant-modal-button"
                    
                            buttonText="Add Tenant"
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
                                <div className ="tenant-info"> 
                                    <div style={{ fontWeight: "bold" }}>{tenant.first_name} {tenant.last_name} </div> 
                                    <div> {tenant.email} | {tenant.mobile}</div> 
                                </div>
                               <div className= "tenant-buttons">
                                    <OpenModalButton
                                        className = "tenant-modal-button"
                                        buttonText = 'Edit'
                                        modalComponent={<NewTenantModal 
                                            propertyId = {propertyId} 
                                    
                                            tenantId = {tenant.id}
                                            formType= "Edit Tenant"/>}
                                    />
                                    <OpenModalButton
                                        className = "tenant-modal-button"
                                        buttonText = 'Delete'
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
       
           
          
        }       
    </>
    )
};

export default TenantDetail;