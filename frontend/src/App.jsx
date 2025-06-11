import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/mainPages/Home'
import LandingPage from './pages/LandingPage/LandingPage'
import Register from './pages/AuthPages/Register'
import Login from './pages/AuthPages/Login'
import { ROUTES } from './config/constants'

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AppContent(){
  const loation = useLocation();

  const showNavbar = location.pathname !== ROUTES.landing && location.pathname !== ROUTES.register && location.pathname !== ROUTES.login;

  return(
    <>
    {showNavbar && <Navbar />}

    <Routes>
        <Route path={ROUTES.landing} element={<LandingPage />} />
        <Route path={ROUTES.register} element={<Register />} />
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.home} element={<Home />} />
        {/* Add more routes as needed */}
    </Routes>
  </>
  )
}

export default App
