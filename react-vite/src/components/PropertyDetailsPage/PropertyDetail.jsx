// react-vite/src/components/PropertyDetailPage.jsx

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import {  getOnePropertyThunk } from "../../redux/properties";
// import { useTheme } from '../../context/ThemeContext';
import './StockDetailsPage.css';

const StockDetailsPage = () => {
    const dispatch = useDispatch();
    const { propertyId } = useParams();
    const [ errors, setErrors ] = useState({});

    useEffect(()=>{
        dispatch(getOnePropertyThunk(propertyId))
            .catch((error) => {
                setErrors(error);
            })
    }, [dispatch, propertyId])

    return
}

    export default StockDetailsPage;