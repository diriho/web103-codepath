import { Navigate, useRoutes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ShowCreators from './pages/ShowCreators';
import ViewCreator from './pages/ViewCreator';
import AddCreator from './pages/AddCreator';
import EditCreator from './pages/EditCreator';

export default function App() {
  const routes = useRoutes([
    { path: '/', element: <Landing /> },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <SignUp /> },
    {
      path: '/creators',
      element: (
        <ProtectedRoute>
          <ShowCreators />
        </ProtectedRoute>
      ),
    },
    {
      path: '/creators/add',
      element: (
        <ProtectedRoute>
          <AddCreator />
        </ProtectedRoute>
      ),
    },
    {
      path: '/creators/:id',
      element: (
        <ProtectedRoute>
          <ViewCreator />
        </ProtectedRoute>
      ),
    },
    {
      path: '/creators/:id/edit',
      element: (
        <ProtectedRoute>
          <EditCreator />
        </ProtectedRoute>
      ),
    },
    { path: '*', element: <Navigate to="/" replace /> },
  ]);

  return (
    <>
      <Navbar />
      <main>{routes}</main>
    </>
  );
}
