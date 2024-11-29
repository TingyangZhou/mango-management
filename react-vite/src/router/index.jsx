import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import UpdatePropertyForm from '../components/PropertyForm/UpdatePropertyForm.jsx'
import CreatePropertyForm from '../components/PropertyForm/CreatePropertyForm.jsx'
import Layout from './Layout';
import Home from '../components/Home';
import Properties from '../components/Properties';
import PropertyDetail from '../components/PropertyDetailsPage';
import Invoices from "../components/Invoices/Invoices.jsx"
import CreateLeaseForm from '../components/LeaseForm/CreateLeaseForm.jsx';
import UpdateLeaseForm from '../components/LeaseForm/UpdateLeaseForm.jsx';
import InvoiceDetailsPage from '../components/InvoiceDetail/InvoiceDetail.jsx';
import CreateInvoiceForm from '../components/InvoiceForm/CreateInvoiceForm.jsx';

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
            },
            {
                path: '/properties/:propertyId/edit',
                element: <UpdatePropertyForm />
            },
            {
                path: '/properties/new',
                element: <CreatePropertyForm />
            },
            {
                path: '/properties/:propertyId/leases/new',
                element: <CreateLeaseForm />
            },
            {
                path: '/properties/:propertyId/leases/edit',
                element: <UpdateLeaseForm />
            },
            {
                path: '/invoices',
                element: <Invoices />
            },
            {
                path:'/invoices/:invoiceId',
                element: <InvoiceDetailsPage/>
            },
            {
                path:'/invoices/new',
                element: <CreateInvoiceForm/>
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
