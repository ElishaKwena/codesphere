import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FullPageLoader from '../components/FullPageLoader';

const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <FullPageLoader />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  console.log('ProtectedRoute', { user, loading, authenticated: !!user });

  return <Outlet />;
};

export default ProtectedRoute;