import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { getUserInfoThunk } from '../../redux/users';
import { useEffect } from 'react';

import "./indexHome.css"



export default function Home() {
    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session.user);
    const userInfo = useSelector((state) => state.userInfo);
    console.log(userInfo)

    useEffect(() => {
        dispatch(getUserInfoThunk())
    }, [dispatch])


    if (!sessionUser) {
        return <Navigate to='/login'></Navigate>
    }


    return (
        <div className="user-info-container">
            <div className="info-section">
                <div className="info-header">Collection</div>
                <ul className="info-list">
                    <li>Total Collected: {userInfo.collected}</li>
                    <li>Outstanding: {userInfo.outstanding}</li>
                    <li>Overdue: {userInfo.overdue}</li>
                </ul>
            </div>
            <div className="info-section">
                <div className="info-header">Occupancy</div>
                <ul className="info-list">
                    <li>Vacant: {userInfo.num_vacanct_properties}</li>
                    <li>Occupied: {userInfo.num_occupied_properties}</li>
                </ul>
            </div>
        </div>
    );
    
}

