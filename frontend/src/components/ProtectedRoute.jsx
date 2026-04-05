import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../store/slices/authSlice';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const token = useSelector((state) => state.auth.token);

  console.log('ProtectedRoute Check:', {
    isAuthenticated,
    userRole,
    hasToken: !!token,
    allowedRoles,
    hasRole: allowedRoles.length === 0 || allowedRoles.includes(userRole),
    timestamp: new Date().toISOString()
  });

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.log('ProtectedRoute: User role not allowed, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
