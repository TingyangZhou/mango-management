import { useEffect } from 'react'
import './Properties.css'
import { getAllPropertiesThunk } from '../../redux/properties'
import { useDispatch } from 'react-redux'
import { useNavigate,  Navigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'


export default function Properties (){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector((state) => state.session.user);
    const [searchParams] = useSearchParams();

    const properties = useSelector((state) => state.properties.properties);
    const num_properties = useSelector((state) => state.properties.num_properties);
    const properties_arr = Object.values(properties);
    // console.log("property array:", properties_arr);

    const sortedProperties = properties_arr.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
            return dateB - dateA;

    });
    
    
    const handleCreateProperty =() =>{
        navigate(`/properties/new`)
    }
   
    const page = searchParams.get('page') || 1;
    const per_page = searchParams.get('per_page') || 10;
    const num_pages =Math.ceil (num_properties/per_page);
    

    useEffect(()=>{
        // console.log("=======useEffect===========")
        dispatch(getAllPropertiesThunk(page, per_page));
    }, [dispatch, page, per_page])

    if (!sessionUser) {
        return <Navigate to='/login'></Navigate>
     }
 

    return (
        <div className='properties--page'>
            <div className='new-property-container'>
                <button  
                    onClick={handleCreateProperty}
                    className='create-property-button-listPage'>
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
                    {sortedProperties.map((property, index) => (
                        <tr key={index}
                            onClick={() => navigate(`/properties/${property.id}`)}>
                            <td>{property.id}</td>
                            <td>{property.address}</td>
                            <td>{property.rent}</td>
                            <td>{property.num_tenants}</td>
                            <td className={property.is_vacant ? "vacant" : "occupied"}>{property.is_vacant ? "Vacant" : "Occupied"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <footer className = 'page-footer'>
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
                

            </footer>
        </div>
    )
}