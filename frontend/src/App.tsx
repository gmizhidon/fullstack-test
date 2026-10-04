import { RouterProvider } from 'react-router-dom';

import { router } from './routerConfig';

export function App() {
    return <RouterProvider router={router} />;
}
