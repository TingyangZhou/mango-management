import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { getUserInfoThunk } from '../../redux/users';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2'; 
import 'chart.js/auto';

import "./indexHome.css"



export default function Home() {
    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session.user);
    const userInfo = useSelector((state) => state.userInfo);
    

    useEffect(() => {
        dispatch(getUserInfoThunk())
    }, [dispatch])


    const [allZero_collection, setAllZero_collection] = useState(0);
    const [allZero_vacancy, setAllZero_vacancy] = useState(0);

    const vacancyRate = userInfo?.num_vacant_properties/ (userInfo?.num_vacant_properties + userInfo?.num_occupied_properties) * 100
    
    const pieData_collection = {
        labels: ['Total Collected', 'Outstanding', 'Overdue'],
        datasets: [
            {
                data: [
                    userInfo?.collected || 0,
                    userInfo?.outstanding || 0,
                    userInfo?.overdue || 0
                ],
                backgroundColor: [
                    '#28a745', // Solid green
                    '#ffc107', // Solid yellow
                    '#dc3545'  // Solid red
                ],
               
                borderColor: '#ffffff', 
                borderWidth: 1 
            }
        ]
    };

    

   

    const pieOptions_collection = {
        plugins: {
            legend: {
                display: false 
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const dataIndex = tooltipItem.dataIndex; //dataIndex is the index of the data point within the dataset
                        const label = pieData_collection.labels[dataIndex];
                        const value = pieData_collection.datasets[0].data[dataIndex]; // Get the corresponding value
                        return `${label}: $${value}`; 
                    }
                },
                bodyFont: {
                    size: 16, // Increase the font size for the tooltip content
                },
                padding: 10,
                
            }
        }
    };
    
    const total_num_properties = userInfo?.num_vacant_properties + userInfo?.num_occupied_properties;
    const vacant_percent =( userInfo?.num_vacant_properties / total_num_properties * 100).toFixed(1);
    const occupied_percent =( userInfo?.num_occupied_properties / total_num_properties * 100).toFixed(1);

    const pieData_vacancy = {
        labels: ['Vacant', 'Occupied'],
        datasets: [
            {
                data: [
                    vacant_percent || 0,
                    occupied_percent || 0,
                ],
                backgroundColor: [
                    '#3498db', 
                    '#ffc107', 
                ],
                borderColor: '#ffffff', 
                borderWidth: 1 
            }
        ]
    };

   

    const pieOptions_vacancy = {
        plugins: {
            legend: {
                display: false 
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const dataIndex = tooltipItem.dataIndex; //dataIndex is the index of the data point within the dataset
                        const label = pieData_vacancy.labels[dataIndex];
                        const value = pieData_vacancy.datasets[0].data[dataIndex]; // Get the corresponding value
                        return `${label}: %${value}`; 
                    }
                },
                bodyFont: {
                    size: 16, // Increase the font size for the tooltip content
                },
                padding: 10,
            }
        }
    };

    useEffect(()=>{
        setAllZero_collection(pieData_collection.datasets[0].data.every((value) => value === 0));
        setAllZero_vacancy(pieData_vacancy.datasets[0].data.every((value) => value === 0));
    }, [pieData_collection.datasets, pieData_vacancy.datasets])


    if (!sessionUser) {
        return <Navigate to='/login'></Navigate>
     }
 
 


    return (
        <div className="user-info-container">
            <div className="info-section">
                <div className="info-header">Collection</div>
                <div className="info-container">
                    <div className="pie-chart-container">
                    {allZero_collection ? (
                        <img style= {{width:"100%"}} src= 'images/no_data.jpg' alt="No data available to display"/>
                        ) : (
                        <Pie data={pieData_collection} options={pieOptions_collection} />)}
                    </div>
                    <ul className="info-list">
                        <li style={{color:'#28a745'}}>Total Collected: ${userInfo?.collected}</li>
                        <li style={{color:'#ffc107'}}>Outstanding: ${userInfo?.outstanding}</li>
                        <li style={{color:'red'}}>Overdue: ${userInfo?.overdue}</li>
                    </ul>
                </div>
                
                
            </div>

            <div className="info-section">
                <div className="info-header">Occupancy</div>
                <div className="info-container">
                    <div className="pie-chart-container">
                    {allZero_vacancy ? (
                        <img style= {{width:"100%"}} src= 'images/no_data.jpg' alt="No data available to display"/>
                    ) : (
                        <Pie data={pieData_vacancy} options={pieOptions_vacancy} />
                    )}
                    </div>
                    <ul className="info-list">
                        <li style={{color:'#ffc107'}}>Occupied: {userInfo?.num_occupied_properties}</li>
                        <li style={{color:'#3498db'}}>Vacant: {userInfo?.num_vacant_properties}</li>
                        <li>Vacancy Rate: {vacancyRate.toFixed(1)}%</li>
                    </ul>
                </div>
                
            </div>
        </div>
    );
    
}

