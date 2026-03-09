import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const location = useLocation();
  const isAdmin = localStorage.getItem('bookhub_is_admin') === 'true';

  if (!isAdmin) {
    // Crucial: If returning from Google OAuth, Supabase puts the token in the URL hash.
    // If we just redirect to '/login', react-router destroys the hash!
    // We MUST preserve it so the Login page can process the tokens.
    if (location.hash.includes('access_token=')) {
       return <Navigate to={`/login${location.hash}`} replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
