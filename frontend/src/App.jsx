import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
// import UserGroups from './pages/mainPages/UserGroups';
import Groups from './pages/mainPages/Groups';
import GroupDetail from './pages/mainPages/GroupDetail';
import CreateGroup from './pages/mainPages/CreateGroup';
import InviteAccept from './pages/mainPages/InviteAccept';
import Home from './pages/mainPages/Home';
import LandingPage from './pages/LandingPage/LandingPage';
import Register from './pages/AuthPages/Register';
import Login from './pages/AuthPages/Login';
import VerifyEmailSent from './pages/Email/VerifyEmailSent';
import VerifyEmail from './pages/Email/VerifyEmail';
import PasswordResetRequest from './pages/AuthPages/PasswordResetRequest';
import PasswordResetConfirm from './pages/AuthPages/PasswordResetConfirm';
import Topics from './pages/mainPages/Topics';

import { ROUTES } from './config/constants';
import ProtectedRoute from './routes/ProtectedRoute';
import { Navigate } from 'react-router-dom';

import { useAuth } from './context/AuthContext.jsx';

import FullPageLoaderDemo from './components/FullPageLoaderDemo';
import FullPageLoader from './components/FullPageLoader';
import React, { useState, useEffect } from 'react';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <FullPageLoader />;

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
    ROUTES.verify_email,
    ROUTES.password_reset_request,
    ROUTES.password_reset_confirm
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
        <Route path={ROUTES.password_reset_request} element={<PasswordResetRequest />} />
        <Route path={ROUTES.password_reset_confirm} element={<PasswordResetConfirm />} />
        
        <Route path={ROUTES.groups} element={<Groups />} />
        <Route path="/groups/create" element={<CreateGroup />} />
        <Route path="/groups/:groupId" element={<GroupDetail />} />
        <Route path="/invite/:token" element={<InviteAccept />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.home} element={<Home />} />
          <Route path={ROUTES.topics} element={<Topics />} />
          {/* <Route path={ROUTES.usergroups} element={<UserGroups />} /> */}
        </Route>
        
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </>
  );
}

export default App;