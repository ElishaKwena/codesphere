import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
// import UserGroups from './pages/mainPages/UserGroups';
// import Groups from './pages/mainPages/Groups';
import Home from './pages/mainPages/Home';
import LandingPage from './pages/LandingPage/LandingPage';
import Register from './pages/AuthPages/Register';
import Login from './pages/AuthPages/Login';
import VerifyEmailSent from './pages/Email/VerifyEmailSent';
import VerifyEmail from './pages/Email/VerifyEmail';


import { ROUTES } from './config/constants';
import ProtectedRoute from './routes/ProtectedRoute';
import { Navigate } from 'react-router-dom';

import { useAuth } from './context/AuthContext.jsx';

function App() {
  return <AppContent />; // Just render content - no providers or routers here
}

function AppContent() {
  const {user, loading} = useAuth();

  const location = useLocation();
  console.log('AppContent render', {
    path: location.pathname,
    userExists: !!user,
    loading
  });
  
  const noNavbarPaths = [
    ROUTES.landing,
    ROUTES.register,
    ROUTES.login,
    ROUTES.verify_email_sent,
    ROUTES.verify_email
  ]
  if (loading) {
    return <FullPageLoader />;
  }
  return (
    <>
      {!noNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path={ROUTES.landing} element={<LandingPage />} />
        <Route path={ROUTES.register} element={<Register />} />
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.verify_email_sent} element={<VerifyEmailSent />} />
        <Route path={ROUTES.verify_email} element={<VerifyEmail />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.home} element={<Home />} />
          {/* <Route path={ROUTES.groups} element={<Groups />} />
          <Route path={ROUTES.usergroups} element={<UserGroups />} /> */}
        </Route>
        
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </>
  );
}

export default App;