import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Home from '../components/Home';
import PortfolioPage from '../components/PortfolioPage/PortfolioPage';
import StockDetailsPage from '../components/StockDetailsPage/StockDetailsPage';
import SearchHome from '../components/SearchHome';
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
                path: 'portfolio',
                element: <PortfolioPage />
            },
            {
                path: '/stocks/:stockId',
                element: <StockDetailsPage />
            },
            {
                path: '/search',
                element: <SearchHome />,
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
