import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { getUserInfoThunk } from '../../redux/users';
import { useEffect } from 'react';
import { Pie } from 'react-chartjs-2'; 
import 'chart.js/auto';

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
                    
                    '#FFA726', // Vibrant orange (mango pulp color)
                    '#3498db',
                    '#e74c3c',

                    
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
    const vacant_percent = userInfo?.num_vacant_properties / total_num_properties * 100;
    const occupied_percent = userInfo?.num_occupied_properties / total_num_properties * 100;

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
                    '#FFA726', 
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

    return (
        <div className="user-info-container">
            <div className="info-section">
                <div className="info-header">Collection</div>
                <div className="info-container">
                    <div className="pie-chart-container">
                        <Pie data={pieData_collection} options={pieOptions_collection} />
                    </div>
                    <ul className="info-list">
                        <li>Total Collected: ${userInfo?.collected}</li>
                        <li>Outstanding: ${userInfo?.outstanding}</li>
                        <li>Overdue: ${userInfo?.overdue}</li>
                    </ul>
                </div>
                
                
            </div>

            <div className="info-section">
                <div className="info-header">Occupancy</div>
                <div className="info-container">
                    <div className="pie-chart-container">
                        <Pie data={pieData_vacancy} options={pieOptions_vacancy} />
                    </div>
                    <ul className="info-list">
                        <li>Occupied: {userInfo?.num_occupied_properties}</li>
                        <li>Vacant: {userInfo?.num_vacant_properties}</li>
                    </ul>
                </div>
                
            </div>
        </div>
    );
    
}

