import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Home from '../components/Home';
import Properties from '../components/Properties';
import PropertyDetail from '../components/PropertyDetailsPage';
// import Profile from '../components/Profile';
// import GenericError from '../components/Error';
// import * as api from './api';

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />,
                // loader: api.getAllTweets,
                // action: api.postNewTweet,
            },
            {
                path: 'login',
                element: <LoginFormPage />,
            },
            {
                path: 'signup',
                element: <SignupFormPage />,
            },
            
            {
                path: '/properties',
                element: <Properties />,
            },
            {
                path: '/properties/:propertyId',
                element: <PropertyDetail />,
            }
            // {
            //     path: 'profile/:userId',
            //     element: <Profile />,
            //     errorElement: <GenericError />,
            //     loader: api.getUserById,
            // },
            // {
            //     path: 'stories/post',
            //     action: () => 'it would hit me!',
            // },
        ],
    },
]);
