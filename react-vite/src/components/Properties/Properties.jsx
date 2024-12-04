import { useState, useEffect } from 'react'
import './Properties.css'
import {  getAllPropertiesNoPageThunk  } from '../../redux/properties'
import { useDispatch } from 'react-redux'
import { useNavigate,  Navigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom'


export default function Properties (){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector((state) => state.session.user);
    // const [searchParams] = useSearchParams();
    const [ isVacantChecked, setIsVacantChecked ] = useState(false);
    const [ isOccupiedChecked, setIsOccupiedChecked ] = useState(false);
    const [ vacantProperties, setVacantProperties ] = useState([]);
    const [ occupiedProperties, setOccupiedProperties ] = useState([]);

    const properties = useSelector((state) => state.properties.properties);
    // const num_properties = useSelector((state) => state.properties.num_properties);
    const properties_arr = Object.values(properties);


    const sortedProperties = properties_arr.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
            return dateB - dateA;

    });

    
    const handleVacantChange = (e) =>{
        setIsVacantChecked(e.target.checked);
        console.log('isVacantChecked=======:', e.target.checked);
      
        if (e.target.checked){
            setVacantProperties(sortedProperties.filter(property => {
                return  property.is_vacant === true;
             }))
          
        }
      
    }
    

    const handleOccupiedChange = (e) =>{
        setIsOccupiedChecked(e.target.checked);
        
        console.log('isOccupiedChecked=======:', e.target.checked);

        if (e.target.checked){
            setOccupiedProperties(sortedProperties.filter(property => {
                return  property.is_vacant === false;
             }))
          
        }
      
    }
    
    
    const handleCreateProperty =() =>{
        navigate(`/properties/new`)
    }
   
   

    useEffect(()=>{
        // console.log("=======useEffect===========")
        dispatch( getAllPropertiesNoPageThunk());
    }, [dispatch])

    if (!sessionUser) {
        return <Navigate to='/login'></Navigate>
     }
 

    return (
        <div className='properties--page'>
            <div className= 'property-list-header'>
                <div className='filter-container'>
                    <label className='checkbox-label'>
                        <input 
                            type="checkbox" 
                            id="filter-vacant" 
                            checked = {isVacantChecked}
                            onChange = {handleVacantChange}
                        /> 
                            Vacant
                    </label>
                    <label className='checkbox-label'>
                        <input 
                            type="checkbox" 
                            id="filter-occupied" 
                            checked = {isOccupiedChecked}
                            onChange = {handleOccupiedChange}
                            />
                            Occupied
                    </label>
                </div>
                
                <button  
                    onClick={handleCreateProperty}
                    className='create-property-button-on-listPage'>
                    New Property
                </button>
            
            </div>
            
            
           
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Address</th>
                        <th>Rent ($ per month)</th>
                        <th>Tenants</th>
                        <th>Vacancy</th>
                    </tr>
                </thead>
                <tbody>
                    {(isVacantChecked === isOccupiedChecked) && sortedProperties.map((property, index) => (
                        <tr key={index}
                            onClick={() => navigate(`/properties/${property.id}`)}>
                            <td>{property.id}</td>
                            <td>{property.address}</td>
                            <td>{property.rent}</td>
                            <td>{property.num_tenants}</td>
                            <td> <span className={property.is_vacant ? "vacant" : "occupied"}>{property.is_vacant ? "Vacant" : "Occupied"}</span> </td>
                        </tr>
                    ))}
                    {(isVacantChecked && !isOccupiedChecked) && vacantProperties.map((property, index) => (
                        <tr key={index}
                            onClick={() => navigate(`/properties/${property.id}`)}>
                            <td>{property.id}</td>
                            <td>{property.address}</td>
                            <td>{property.rent}</td>
                            <td>{property.num_tenants}</td>
                            <td> <span className={property.is_vacant ? "vacant" : "occupied"}>{property.is_vacant ? "Vacant" : "Occupied"}</span> </td>
                        </tr>
                    ))}
                    {(isOccupiedChecked && !isVacantChecked) && occupiedProperties.map((property, index) => (
                        <tr key={index}
                            onClick={() => navigate(`/properties/${property.id}`)}>
                            <td>{property.id}</td>
                            <td>{property.address}</td>
                            <td>{property.rent}</td>
                            <td>{property.num_tenants}</td>
                            <td> <span className={property.is_vacant ? "vacant" : "occupied"}>{property.is_vacant ? "Vacant" : "Occupied"}</span> </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* <footer className = 'page-footer'>
                <div className = 'curr-page'>page {page}</div>
                <div className = 'page-list'>
                {Array.from({ length: num_pages }, (_, i) => (
                    <Link
                        key={i + 1}
                        to={`/properties?page=${i + 1}`}
                        style={{
                            margin: "0 5px",
                            textDecoration: page === i + 1 ? "underline" : "none",
                            fontWeight:page === i + 1 ? "bold" : "normal",
                        }}
                    >
                        {i + 1}
                    </Link>
                       )) }
                </div>
                

            </footer> */}
        </div>
    )
}