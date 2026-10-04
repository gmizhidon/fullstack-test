import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ItemsPage } from './features';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <ItemsPage />,
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
